import { site, formatMoney } from "@/lib/site";

export function ShipBar({ subtotal }: { subtotal: number }) {
  const t = site.freeShippingThreshold;
  const left = Math.max(0, t - subtotal);
  const pct = Math.min(100, (subtotal / t) * 100);
  return (
    <div className="ship-bar">
      <p aria-live="polite">
        {left > 0 ? (
          <>You are <strong>{formatMoney(left)}</strong> away from free US shipping.</>
        ) : (
          <><strong>Your order ships free.</strong> Free US shipping on orders over {formatMoney(t).replace(".00", "")}.</>
        )}
      </p>
      <div className="ship-bar__track" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={t} aria-valuenow={Math.min(t, Math.round(subtotal * 100) / 100)}>
        <div className="ship-bar__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
