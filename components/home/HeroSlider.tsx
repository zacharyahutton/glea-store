"use client";
import { useEffect, useState } from "react";
import { Icon } from "../ui/Icon";

/** Rotates server-rendered slides. Pauses on hover/focus, has a pause button, and respects reduced motion. */
export function HeroSlider({ slides, tones }: { slides: React.ReactNode[]; tones: ("dark" | "light")[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);
  useEffect(() => {
    if (paused || hover || slides.length < 2) return;
    const t = setTimeout(() => setI((i + 1) % slides.length), 6500);
    return () => clearTimeout(t);
  }, [i, paused, hover, slides.length]);
  return (
    <section
      className={`hero${tones[i] === "dark" ? " hero--ink-ctrl" : ""}`}
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="hero__track">
        {slides.map((s, n) => (
          <div key={n} className={`hero__slide${tones[n] === "dark" ? " hero__slide--dark" : ""}${n === i ? " is-active" : ""}`} aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}`} aria-hidden={n !== i} inert={n !== i}>
            {s}
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className="hero__ctrl">
          <div className="container">
            <div className="hero__dots">
              {slides.map((_, n) => (
                <button key={n} className="hero__dot" aria-label={`Show slide ${n + 1}`} aria-current={n === i} onClick={() => setI(n)}><span /></button>
              ))}
            </div>
            <button className="icon-btn hero__pause" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(!paused)}>
              <Icon name={paused ? "play" : "pause"} size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
