"use client";
import { useState } from "react";

/**
 * Loftie collection layout: title row with a "Hide filters" toggle, a left sidebar of filters, and a 3-column grid.
 * Client filter over server-rendered cards, so every card stays in the HTML for SEO and no-JS.
 */
export function ColorFilter({ title, colors, swatches, cards }: { title: string; colors: string[]; swatches: Record<string, string>; cards: { color: string; available: boolean; node: React.ReactNode }[] }) {
  const [sel, setSel] = useState<string | null>(null);
  const [inStock, setInStock] = useState(false);
  const [show, setShow] = useState(true);
  const shown = cards.filter((c) => (!sel || c.color === sel) && (!inStock || c.available));
  return (
    <div className={`lf-coll${show ? "" : " is-nofilters"}`}>
      <div className="lf-coll__head">
        <h1 id="coll-title" className="lf-h1">{title}</h1>
        <button type="button" className="lf-coll__toggle" aria-expanded={show} aria-controls="coll-filters" onClick={() => setShow(!show)}>
          {show ? "Hide filters" : "Show filters"}
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="lf-coll__body">
        <aside id="coll-filters" className="lf-coll__side" aria-label="Filters" hidden={!show}>
          <ul aria-label="Filter by color">
            <li><button type="button" className="lf-flt" aria-pressed={!sel} onClick={() => setSel(null)}>All colors</button></li>
            {colors.map((c) => (
              <li key={c}>
                <button type="button" className="lf-flt" aria-pressed={sel === c} onClick={() => setSel(sel === c ? null : c)}>
                  <span className="lf-flt__sw" style={{ background: swatches[c] }} aria-hidden="true" />{c}
                </button>
              </li>
            ))}
          </ul>
          <label className="lf-flt__stock">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock only
          </label>
          <p className="lf-flt__count" aria-live="polite">{shown.length} {shown.length === 1 ? "light" : "lights"}</p>
        </aside>
        <h2 className="sr-only">Products</h2>
        <div className="lf-grid" data-rv-group>
          {cards.map((c, i) => (
            <div key={i} hidden={!shown.includes(c)}>{c.node}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
