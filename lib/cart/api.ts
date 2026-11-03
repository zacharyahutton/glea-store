"use client";
import { storefront } from "../shopify/client";
import { isLive, SHOPIFY_DOMAIN } from "../shopify/config";
import * as Q from "../shopify/queries";
import type { Cart, CartLine, Image, Money, SelectedOption } from "../shopify/types";
import { utmAttributes } from "../analytics";

/**
 * Cart API. Live: Storefront cartCreate / cartLines*, checkout via cart.checkoutUrl.
 * Fixture (no token): a local cart with real variant IDs. Its checkout link is a Shopify cart permalink
 * (https://store/cart/<variantId>:<qty>), which opens the real Shopify checkout for the same variants.
 */
export type AddInput = {
  merchandiseId: string;
  quantity: number;
  meta: { title: string; productTitle: string; handle: string; image: Image | null; price: Money; selectedOptions: SelectedOption[] };
};

const CART_KEY = "glea_cart_v1";
const LOCAL_KEY = "glea_local_cart_v1";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Payload = { cart: any; userErrors?: { message: string }[] };
const norm = (c: any): Cart | null =>
  c ? { ...c, lines: c.lines?.nodes ?? c.lines ?? [] } : null;
const take = (p: Payload) => {
  if (p.userErrors?.length) throw new Error(p.userErrors.map((e) => e.message).join("; "));
  return norm(p.cart);
};

/* Local fixture cart */
function localRead(): Cart {
  try {
    const c = JSON.parse(localStorage.getItem(LOCAL_KEY) || "null");
    if (c) return recompute(c.lines);
  } catch {}
  return recompute([]);
}
function recompute(lines: CartLine[]): Cart {
  const total = lines.reduce((s, l) => s + parseFloat(l.merchandise.price.amount) * l.quantity, 0);
  lines.forEach((l) => (l.cost = { totalAmount: { amount: (parseFloat(l.merchandise.price.amount) * l.quantity).toFixed(2), currencyCode: "USD" } }));
  const ids = lines.map((l) => `${l.merchandise.id.split("/").pop()}:${l.quantity}`).join(",");
  const cart: Cart = {
    id: "local",
    checkoutUrl: ids ? `https://${SHOPIFY_DOMAIN}/cart/${ids}` : `https://${SHOPIFY_DOMAIN}/cart`,
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    lines,
    cost: { subtotalAmount: { amount: total.toFixed(2), currencyCode: "USD" }, totalAmount: { amount: total.toFixed(2), currencyCode: "USD" } },
  };
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ lines }));
  return cart;
}

export async function getCart(): Promise<Cart | null> {
  if (!isLive) return localRead();
  const id = localStorage.getItem(CART_KEY);
  if (!id) return null;
  try {
    const d = await storefront<any>(Q.CART_QUERY, { id }, { cache: "no-store" });
    if (!d.cart) localStorage.removeItem(CART_KEY);
    return norm(d.cart);
  } catch {
    return null;
  }
}

export async function addLines(items: AddInput[]): Promise<Cart | null> {
  if (!isLive) {
    const c = localRead();
    items.forEach((it) => {
      const ex = c.lines.find((l) => l.merchandise.id === it.merchandiseId);
      if (ex) ex.quantity += it.quantity;
      else
        c.lines.push({
          id: `local-${it.merchandiseId.split("/").pop()}`,
          quantity: it.quantity,
          merchandise: {
            id: it.merchandiseId, title: it.meta.title, selectedOptions: it.meta.selectedOptions, image: it.meta.image, price: it.meta.price,
            product: { handle: it.meta.handle, title: it.meta.productTitle },
          },
          cost: { totalAmount: it.meta.price },
        });
    });
    return recompute(c.lines);
  }
  const lines = items.map((i) => ({ merchandiseId: i.merchandiseId, quantity: i.quantity }));
  const id = localStorage.getItem(CART_KEY);
  if (id) {
    try {
      const d = await storefront<any>(Q.CART_LINES_ADD, { cartId: id, lines }, { cache: "no-store" });
      return take(d.cartLinesAdd);
    } catch {
      localStorage.removeItem(CART_KEY);
    }
  }
  const d = await storefront<any>(Q.CART_CREATE, { input: { lines, attributes: utmAttributes() } }, { cache: "no-store" });
  const cart = take(d.cartCreate);
  if (cart) localStorage.setItem(CART_KEY, cart.id);
  return cart;
}

export async function updateLine(lineId: string, quantity: number): Promise<Cart | null> {
  if (!isLive) {
    const c = localRead();
    const lines = c.lines.map((l) => (l.id === lineId ? { ...l, quantity } : l)).filter((l) => l.quantity > 0);
    return recompute(lines);
  }
  const cartId = localStorage.getItem(CART_KEY);
  if (!cartId) return null;
  if (quantity <= 0) {
    const d = await storefront<any>(Q.CART_LINES_REMOVE, { cartId, lineIds: [lineId] }, { cache: "no-store" });
    return take(d.cartLinesRemove);
  }
  const d = await storefront<any>(Q.CART_LINES_UPDATE, { cartId, lines: [{ id: lineId, quantity }] }, { cache: "no-store" });
  return take(d.cartLinesUpdate);
}

/** Refresh UTM attributes right before checkout so late-arriving UTMs are kept. */
export async function syncAttributes(): Promise<void> {
  if (!isLive) return;
  const cartId = localStorage.getItem(CART_KEY);
  const attributes = utmAttributes();
  if (!cartId || !attributes.length) return;
  try {
    await storefront<any>(Q.CART_ATTRIBUTES_UPDATE, { cartId, attributes }, { cache: "no-store" });
  } catch {}
}
