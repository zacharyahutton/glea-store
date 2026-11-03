"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart } from "@/lib/shopify/types";
import { addLines, getCart, updateLine, syncAttributes, type AddInput } from "@/lib/cart/api";
import { track } from "@/lib/analytics";

type Ctx = {
  cart: Cart | null;
  open: boolean;
  busy: boolean;
  error: string | null;
  setOpen: (v: boolean) => void;
  add: (items: AddInput[], opts?: { open?: boolean }) => Promise<void>;
  update: (lineId: string, qty: number) => Promise<void>;
  checkout: () => Promise<void>;
};

const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};

const itemsOf = (cart: Cart | null) =>
  (cart?.lines ?? []).map((l) => ({
    item_id: l.merchandise.id.split("/").pop()!,
    item_name: l.merchandise.product.title,
    item_variant: l.merchandise.title,
    price: parseFloat(l.merchandise.price.amount),
    quantity: l.quantity,
  }));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpenState] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCart().then(setCart).catch(() => {});
  }, []);

  const setOpen = useCallback((v: boolean) => {
    setOpenState(v);
    document.documentElement.classList.toggle("lock", v);
  }, []);

  const add = useCallback<Ctx["add"]>(async (items, opts) => {
    setBusy(true);
    setError(null);
    try {
      const c = await addLines(items);
      setCart(c);
      const value = items.reduce((s, i) => s + parseFloat(i.meta.price.amount) * i.quantity, 0);
      track("add_to_cart", {
        value,
        items: items.map((i) => ({ item_id: i.merchandiseId.split("/").pop()!, item_name: i.meta.productTitle, item_variant: i.meta.title, price: parseFloat(i.meta.price.amount), quantity: i.quantity })),
      });
      if (opts?.open !== false) setOpen(true);
    } catch {
      setError("We could not add that to your cart. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [setOpen]);

  const update = useCallback<Ctx["update"]>(async (lineId, qty) => {
    setBusy(true);
    setError(null);
    try {
      setCart(await updateLine(lineId, qty));
    } catch {
      setError("We could not update your cart. Please try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  const checkout = useCallback(async () => {
    if (!cart?.lines.length) return;
    track("begin_checkout", { value: parseFloat(cart.cost.subtotalAmount.amount), items: itemsOf(cart) });
    await syncAttributes();
    window.location.href = cart.checkoutUrl;
  }, [cart]);

  const value = useMemo(() => ({ cart, open, busy, error, setOpen, add, update, checkout }), [cart, open, busy, error, setOpen, add, update, checkout]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
