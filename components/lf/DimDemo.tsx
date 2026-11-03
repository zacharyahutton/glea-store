"use client";
import { useState } from "react";

const temps = [
  { k: "3000K", name: "Warm", c: "#f4a949", c2: "#f7d39a" },
  { k: "4500K", name: "Neutral", c: "#f3d9a8", c2: "#fbf3e4" },
  { k: "6000K", name: "Cool", c: "#cfdcf0", c2: "#f4f7fb" },
];

/** Loftie "two-phase alarm" slot: two glow circles (100% and 10%) and three light-color rows that re-tint both. */
export function DimDemo() {
  const [t, setT] = useState(0);
  const cur = temps[t];
  const style = { ["--g1" as string]: cur.c, ["--g2" as string]: cur.c2 } as React.CSSProperties;
  return (
    <div className="lf-dim" style={style}>
      {[{ pct: "100%", title: "Full glow", text: "Switch it on and the page lights up in the light color you pick." }, { pct: "10%", title: "Hold 4 s to dim", text: "Hold the button for 4 seconds to dim from 100% down to 10%." }].map((p, n) => (
        <div className="lf-dim__col" key={p.pct}>
          <div className={`lf-dim__orb${n ? " is-low" : ""}`} aria-hidden="true"><span>{p.pct}</span></div>
          <h3 className="lf-h3">{p.title}: {p.pct}</h3>
          <p className="lf-dim__text">{p.text}</p>
          <div className="lf-dim__list" role="group" aria-label={`Light color, ${p.title}`}>
            {temps.map((x, i) => (
              <button key={x.k} type="button" className="lf-dim__row" aria-pressed={i === t} onClick={() => setT(i)}>
                <span className="lf-dim__dot" style={{ background: x.c }} aria-hidden="true" />{x.name} {x.k}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
