"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatMoney, swatchFallback } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";

export function CartLines() {
  const { cart, update, busy } = useCart();
  if (!cart?.lines.length) return null;
  return (
    <ul aria-label="Items in your cart">
      {cart.lines.map((l) => {
        const color = l.merchandise.selectedOptions.find((o) => o.name.toLowerCase() === "color")?.value ?? l.merchandise.title;
        return (
          <li className="cline" key={l.id}>
            <div className="cline__img">
              {l.merchandise.image ? (
                <Image src={l.merchandise.image.url} alt={l.merchandise.image.altText ?? `${l.merchandise.product.title} in ${color}`} width={168} height={208} />
              ) : (
                <Placeholder color={swatchFallback[color.toLowerCase()]} note={null} label={undefined} />
              )}
            </div>
            <div>
              <div className="cline__top">
                <div>
                  <Link className="cline__title" href={`/products/${l.merchandise.product.handle}?color=${encodeURIComponent(color)}`}>
                    {l.merchandise.product.title}
                  </Link>
                  <p className="small muted">Color: {color}</p>
                </div>
                <p className="small" style={{ fontWeight: 600 }}>{formatMoney(l.cost.totalAmount.amount)}</p>
              </div>
              <div className="cline__ctrl">
                <div className="qty qty--sm">
                  <button type="button" aria-label={`Decrease quantity of ${color}`} disabled={busy} onClick={() => update(l.id, l.quantity - 1)}>
                    <Icon name="minus" size={16} />
                  </button>
                  <input aria-label={`Quantity of ${color}`} value={l.quantity} readOnly inputMode="numeric" />
                  <button type="button" aria-label={`Increase quantity of ${color}`} disabled={busy} onClick={() => update(l.id, l.quantity + 1)}>
                    <Icon name="plus" size={16} />
                  </button>
                </div>
                <button type="button" className="cline__rm" disabled={busy} onClick={() => update(l.id, 0)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartTotals() {
  const { cart } = useCart();
  if (!cart?.lines.length) return null;
  const sub = parseFloat(cart.cost.subtotalAmount.amount);
  const disc = (cart.discountAllocations ?? []).reduce((s, d) => s + parseFloat(d.discountedAmount.amount), 0);
  const qualifiesBundle = cart.totalQuantity >= 2;
  return (
    <div className="totals">
      <div className="totals__row"><span>Subtotal</span><span>{formatMoney(sub)}</span></div>
      {disc > 0 ? <div className="totals__row"><span>Savings</span><span>-{formatMoney(disc)}</span></div> : null}
      {qualifiesBundle && disc === 0 ? <p className="small muted">Buy 2, save $5: the discount comes off at checkout.</p> : null}
      <p className="small muted">Shipping and taxes are calculated at checkout.</p>
    </div>
  );
}
