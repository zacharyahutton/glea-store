"use client";
import { useEffect, useState } from "react";

export type Way = { id: string; title: string; text: string; media: React.ReactNode };

/**
 * Loftie "image with text" navigation: each item has an 8s linear progress bar, then the next one shows.
 * Pauses on hover and focus, and does not auto-advance under prefers-reduced-motion.
 */
export function WaysToUse({ items }: { items: Way[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(false);
  useEffect(() => { setAuto(!window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => {
    if (!auto || paused) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % items.length), 8000);
    return () => window.clearTimeout(t);
  }, [i, auto, paused, items.length]);
  return (
    <div className={`lf-ways${auto && !paused ? " is-auto" : ""}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <ol className="lf-ways__list">
        {items.map((w, n) => (
          <li key={w.id}>
            <button type="button" className={`lf-ways__item${n === i ? " is-on" : ""}`} aria-current={n === i} onClick={() => setI(n)}>
              <span className="lf-ways__bar" aria-hidden="true"><span key={`${i}-${paused}`} /></span>
              <span className="lf-ways__t">{w.title}</span>
              <span className="lf-ways__d">{w.text}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="lf-ways__media">
        {items.map((w, n) => <div key={w.id} className={`lf-ways__img${n === i ? " is-on" : ""}`} aria-hidden={n !== i}>{w.media}</div>)}
      </div>
    </div>
  );
}
