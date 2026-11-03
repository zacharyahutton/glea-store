"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { CartLines, CartTotals } from "./CartLines";
import { ShipBar } from "./ShipBar";
import { Icon } from "../ui/Icon";
import { formatMoney, site } from "@/lib/site";
import { track } from "@/lib/analytics";

export function CartPageView() {
  const { cart, checkout, busy, error } = useCart();
  const count = cart?.totalQuantity ?? 0;
  const sub = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  useEffect(() => {
    if (cart && count) track("view_cart", { value: sub });
  }, [!!cart]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!count)
    return (
      <div className="empty">
        <p className="h3">Your cart is empty</p>
        <p className="muted">Pick a color and it will show up here.</p>
        <Link className="btn btn--primary" href={`/products/${site.productHandle}`}>Shop the light</Link>
      </div>
    );
  return (
    <div className="cart-page">
      <div>
        <ShipBar subtotal={sub} />
        <CartLines />
      </div>
      <aside className="card">
        <h2 className="h3" style={{ marginTop: 0 }}>Summary</h2>
        <CartTotals />
        <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={checkout} disabled={busy}>
          <Icon name="lock" size={18} /> Checkout · {formatMoney(sub)}
        </button>
        {error ? <p className="notice" role="alert" style={{ marginTop: 12 }}>{error}</p> : null}
        <ul className="feat small">
          <li><Icon name="truck" size={18} />Free US shipping on orders over ${site.freeShippingThreshold}, otherwise ${site.flatShipping.toFixed(2)} flat.</li>
          <li><Icon name="return" size={18} />{site.returnDays}-day returns. <Link href="/policies/refund-policy" className="link">Refund policy</Link></li>
        </ul>
      </aside>
    </div>
  );
}
