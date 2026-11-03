import Link from "next/link";
import { Media } from "../ui/Media";
import { Icon } from "../ui/Icon";
import { aplus, benefits, compare, details, known, moments, aiNote } from "@/lib/content";
import type { SlotName } from "@/lib/media";
import { site } from "@/lib/site";

export function Trust() {
  const items = [
    { icon: "truck", text: `Free US shipping over $${site.freeShippingThreshold}` },
    { icon: "return", text: `${site.returnDays}-day returns` },
    { icon: "gift", text: `Buy 2, save $${site.bundle.save}` },
    { icon: "mail", text: "Real people at hello@getglea.com" },
  ];
  return (
    <section className="trust" aria-label="Why shop with Glea">
      <div className="container trust__in">
        {items.map((i) => (
          <div className="trust__item" key={i.text}><Icon name={i.icon} />{i.text}</div>
        ))}
      </div>
    </section>
  );
}

export function APlus({ limit }: { limit?: number }) {
  const list = limit ? aplus.slice(0, limit) : aplus;
  return (
    <div className="aplus">
      {list.map((a, i) => (
        <article className={`ap${i % 2 ? " ap--flip" : ""}`} key={a.slot}>
          <div className="ap__media"><Media slot={a.slot as SlotName} sizes="(min-width: 990px) 60vw, 100vw" /></div>
          <div className="ap__text">
            <h3 className="h2">{a.heading}</h3>
            <p className="lead">{a.sub}</p>
            {a.chips ? <div className="chips">{a.chips.map((c) => <span className="chip" key={c}>{c}</span>)}</div> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function Compare() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="cmp">
        <caption className="sr-only">{compare.heading}</caption>
        <thead>
          <tr><td /> {compare.cols.map((c, i) => <th scope="col" key={c} className={i === 0 ? "is-us" : undefined}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {compare.rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.v.map((v, i) => (
                <td key={i} className={i === 0 ? "is-us" : undefined}>
                  {v ? <Icon name="check" size={20} label="Yes" /> : <Icon name="x" size={18} label="No" className="muted" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Spec() {
  return (
    <table className="spec">
      <caption className="sr-only">Product details</caption>
      <tbody>
        {known(details).map((d) => (
          <tr key={d.label}><th scope="row">{d.label}</th><td>{d.value}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

export function Benefits() {
  return (
    <div className="grid grid-3">
      {benefits.map((b, i) => (
        <div className="card" key={b.title}>
          <span className="num">0{i + 1}</span>
          <h3 className="h3">{b.title}</h3>
          <p className="muted">{b.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Moments() {
  return (
    <div className="moments">
      {moments.map((m) => (
        <Link className="moment" key={m.slot} href={`/products/${site.productHandle}`}>
          <Media slot={m.slot as SlotName} sizes="(min-width: 990px) 50vw, 100vw" />
          <span className="moment__label">{m.label}<Icon name="arrow" /></span>
        </Link>
      ))}
    </div>
  );
}

export function AiNote() {
  return <p className="ai-note">{aiNote}</p>;
}
