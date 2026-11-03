"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

const MOBILE_MQ = "(max-width: 767px)";

/**
 * Muted, looping, inline background video (decorative, hidden from screen readers).
 * - No src until after window load + idle, so it never competes with the poster (the LCP image).
 * - Picks the mobile or desktop file once, by screen width.
 * - Skipped with prefers-reduced-motion or Save-Data: the poster stays.
 * - Pauses when off screen. A pause button meets WCAG 2.2.2.
 * - If the file fails to load, it stays invisible and the poster shows.
 */
export function BgVideo({ d, m }: { d: string; m: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (rm.matches || saveData) return;
    let gone = false;
    let idle = 0;
    const start = () => {
      if (gone || v.getAttribute("src")) return;
      v.src = matchMedia(MOBILE_MQ).matches ? m : d;
      setStarted(true);
      v.play().catch(() => {});
    };
    const later = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      idle = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 3000 }) : window.setTimeout(start, 1500);
    };
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    const io = new IntersectionObserver(([e]) => {
      if (!v.getAttribute("src") || pausedRef.current) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    const onRm = () => { if (rm.matches) { v.pause(); setReady(false); } };
    rm.addEventListener("change", onRm);
    return () => {
      gone = true;
      window.removeEventListener("load", later);
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      io.disconnect();
      rm.removeEventListener("change", onRm);
    };
  }, [d, m]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) v.pause();
    else v.play().catch(() => {});
  };

  return (
    <>
      <video ref={ref} className={`bgv${ready ? " is-ready" : ""}`} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}
        onPlaying={() => setReady(true)} onError={() => setReady(false)} />
      {started && ready ? (
        <button type="button" className="bgv__toggle" onClick={toggle} aria-label={paused ? "Play background video" : "Pause background video"}>
          <Icon name={paused ? "play" : "pause"} size={16} />
        </button>
      ) : null}
    </>
  );
}
