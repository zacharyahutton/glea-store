"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { CartLines, CartTotals } from "./CartLines";
import { ShipBar } from "./ShipBar";
import { Icon } from "../ui/Icon";
import { formatMoney } from "@/lib/site";

export function CartDrawer() {
  const { cart, open, setOpen, checkout, busy, error } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, [open, setOpen]);

  const sub = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const count = cart?.totalQuantity ?? 0;
  return (
    <>
      <div className={`scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={panelRef} className={`drawer drawer--right${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden={!open} inert={!open}>
        <div className="drawer__head">
          <h2 id="cart-title" className="h3">Your cart {count ? <span className="muted small">({count})</span> : null}</h2>
          <button ref={closeRef} className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart"><Icon name="close" /></button>
        </div>
        <div className="drawer__body">
          <ShipBar subtotal={sub} />
          {count ? (
            <CartLines />
          ) : (
            <div className="empty">
              <p className="h3">Your cart is empty</p>
              <p className="muted">Pick a color and it will show up here.</p>
              <Link className="btn btn--primary" href="/products/glea-clip-on-book-reading-light" onClick={() => setOpen(false)}>Shop the light</Link>
            </div>
          )}
          {error ? <p className="notice" role="alert" style={{ marginTop: 16 }}>{error}</p> : null}
        </div>
        {count ? (
          <div className="drawer__foot">
            <CartTotals />
            <button className="btn btn--primary btn--block" style={{ marginTop: 14 }} onClick={checkout} disabled={busy}>
              <Icon name="lock" size={18} /> Checkout · {formatMoney(sub)}
            </button>
            <Link href="/cart" className="link small" style={{ display: "block", textAlign: "center", marginTop: 12 }} onClick={() => setOpen(false)}>View cart</Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
