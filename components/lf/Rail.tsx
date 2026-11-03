"use client";
import { useRef } from "react";
import { Icon } from "../ui/Icon";

/** Scroll-snap row with prev/next buttons (Loftie "at home" / product rows). Native scroll, so touch and keyboard work. */
export function Rail({ children, label, className = "" }: { children: React.ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (d: number) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div className={`lf-railx ${className}`} role="region" aria-label={label}>
      <div className="lf-railx__track" ref={ref} tabIndex={0}>{children}</div>
      <div className="lf-railx__btns">
        <button type="button" className="lf-railx__btn" aria-label="Scroll back" onClick={() => move(-1)}><Icon name="left" size={18} /></button>
        <button type="button" className="lf-railx__btn" aria-label="Scroll forward" onClick={() => move(1)}><Icon name="right" size={18} /></button>
      </div>
    </div>
  );
}
