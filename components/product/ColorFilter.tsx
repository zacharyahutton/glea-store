"use client";
import { useState } from "react";

/** Client filter over server-rendered color cards. Keeps all cards in the HTML for SEO and no-JS. */
export function ColorFilter({ colors, swatches, cards }: { colors: string[]; swatches: Record<string, string>; cards: { color: string; available: boolean; node: React.ReactNode }[] }) {
  const [sel, setSel] = useState<string | null>(null);
  const [inStock, setInStock] = useState(false);
  const shown = cards.filter((c) => (!sel || c.color === sel) && (!inStock || c.available));
  return (
    <>
      <div className="filters" role="group" aria-label="Filter by color">
        <button className="filter" aria-pressed={!sel} onClick={() => setSel(null)}>All colors</button>
        {colors.map((c) => (
          <button key={c} className="filter" aria-pressed={sel === c} onClick={() => setSel(sel === c ? null : c)}>
            <span className="pcard__sw" style={{ background: swatches[c], margin: 0 }} aria-hidden="true" />{c}
          </button>
        ))}
        <label className="check" style={{ marginLeft: "auto", alignItems: "center" }}>
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock only
        </label>
      </div>
      <p className="small muted" aria-live="polite" style={{ marginBottom: 16 }}>{shown.length} {shown.length === 1 ? "light" : "lights"}</p>
      <div className="grid grid-4" style={{ gridTemplateColumns: undefined }}>
        {cards.map((c, i) => (
          <div key={i} hidden={!shown.includes(c)}>{c.node}</div>
        ))}
      </div>
    </>
  );
}
