"use client";
import { useState } from "react";

const temps = [
  { k: "3000K", name: "Warm", c: "#f4a949" },
  { k: "4500K", name: "Neutral", c: "#f1d7a6" },
  { k: "6000K", name: "Cool", c: "#d6e1f2" },
];

/** Loftie "Set any mood" slot: three light-color dots re-tint the glow panel next to the photo (.3s color fade, no video). */
export function GlowPicker({ photo, lights }: { photo: React.ReactNode; lights?: React.ReactNode[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="lf-glow">
      <div className="lf-glow__dots" role="radiogroup" aria-label="Light color">
        {temps.map((t, n) => (
          <button key={t.k} type="button" role="radio" aria-checked={n === i} className="lf-glow__dot" onClick={() => setI(n)}>
            <span style={{ background: t.c }} aria-hidden="true" />
            <small>{t.name}<br />{t.k}</small>
          </button>
        ))}
      </div>
      <div className="lf-glow__grid">
        <div className="lf-glow__photo">{photo}</div>
        <div className="lf-glow__tint" style={{ ["--gl" as string]: temps[i].c } as React.CSSProperties} aria-hidden="true">
          <span />
          {lights?.map((l, n) => <div key={n} className={`lf-glow__light${n === i ? " is-on" : ""}`}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}
