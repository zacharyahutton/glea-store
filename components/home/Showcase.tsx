import Link from "next/link";
import { Media } from "../ui/Media";
import { CountUp } from "../motion/CountUp";
import { site } from "@/lib/site";
import { specStats, story } from "@/lib/content";
import type { SlotName } from "@/lib/media";

/** Offers marquee. Real store offers only. */
export function Marquee() {
  const items = [
    `Free US shipping over $${site.freeShippingThreshold}`,
    `${site.returnDays}-day returns`,
    `Buy 2, save $${site.bundle.save}`,
    "Six colors",
    "Up to 80 hours per charge",
    "Soft light, after dark",
  ];
  const list = (hidden?: boolean) => (
    <ul className="marquee__list" aria-hidden={hidden || undefined}>
      {items.map((t) => <li key={t}>{t}<span className="marquee__dot" aria-hidden="true" /></li>)}
    </ul>
  );
  return (
    <div className="ann" role="region" aria-label="Store offers">
      <div className="marquee">{list()}{list(true)}</div>
    </div>
  );
}

/** Maker's spec numbers with count-up. Only the creator-claim list, labeled as such. */
export function Stats({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <section className={`stats stats--${tone}`} aria-labelledby="stats-title">
      <div className="container">
        <h2 id="stats-title" className="sr-only">Glea in numbers</h2>
        <dl className="stats__grid">
          {specStats.map((s) => (
            <div className="stats__item" key={s.label} data-rv>
              <dt className="stats__label">{s.label}</dt>
              <dd className="stats__num">{s.pre ? <small>{s.pre} </small> : null}<CountUp to={s.n} />{s.unit ? <small>{s.unit}</small> : null}</dd>
            </div>
          ))}
        </dl>
        <p className="stats__note">Maker&apos;s specs. Run time varies with brightness and light color.</p>
      </div>
    </section>
  );
}

/** Big storytelling rows: lifestyle photo with an overlapping feature card. */
export function Story() {
  return (
    <div className="story">
      {story.map((r, i) => (
        <article className={`story__row${i % 2 ? " story__row--flip" : ""}`} key={r.photo}>
          <div className="story__media" data-rv>
            <div className="story__photo"><Media slot={r.photo as SlotName} sizes="(min-width: 1024px) 58vw, 100vw" /></div>
            <div className="story__card"><Media slot={r.card as SlotName} sizes="(min-width: 1024px) 22vw, 46vw" /></div>
          </div>
          <div className="story__text" data-rv>
            <span className="kicker">0{i + 1} · {r.kicker}</span>
            <h3 className="h1">{r.heading}</h3>
            <p className="lead">{r.sub}</p>
            <Link className="link-arrow" href={`/products/${site.productHandle}`}>Shop the light</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
