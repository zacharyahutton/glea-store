"use client";
import { useId, useState } from "react";

export type TabItem = { id: string; label: string; quote: string; note?: string; media: React.ReactNode; side: React.ReactNode };

/**
 * Loftie "Put the phone down" tabs, rebuilt: pill tablist, active pill shimmer (5s), panel fade-up .45s from 10px,
 * statement fade-up .75s from 16px, image float 6s. Arrow keys move between tabs (WAI-ARIA tabs pattern).
 */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const [i, setI] = useState(0);
  const uid = useId();
  const key = (e: React.KeyboardEvent, n: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (n + d + items.length) % items.length;
    setI(next);
    document.getElementById(`${uid}-t${next}`)?.focus();
  };
  const t = items[i];
  return (
    <div className="lf-tabs">
      <div className="lf-tabs__list" role="tablist" aria-label={label}>
        {items.map((x, n) => (
          <button key={x.id} id={`${uid}-t${n}`} role="tab" aria-selected={n === i} aria-controls={`${uid}-p`} tabIndex={n === i ? 0 : -1}
            className={`lf-tab${n === i ? " is-on" : ""}`} onClick={() => setI(n)} onKeyDown={(e) => key(e, n)}>
            {x.label}
          </button>
        ))}
      </div>
      <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t${i}`} className="lf-tabs__panel" key={t.id}>
        <blockquote className="lf-tabs__quote">
          <p>{t.quote}</p>
          {t.note ? <footer>{t.note}</footer> : null}
        </blockquote>
        <div className="lf-tabs__media">{t.media}</div>
        <div className="lf-tabs__side">{t.side}</div>
      </div>
    </div>
  );
}
