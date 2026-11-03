import Link from "next/link";
import { Media } from "../ui/Media";
import { site } from "@/lib/site";
import type { SlotName } from "@/lib/media";

const pdp = `/products/${site.productHandle}`;

/** Loftie "How customers feel" ring card, filled with the maker's specs instead of survey stats. Rings draw once (1.5s). */
export function SpecRings() {
  const items = [
    { n: "9", u: "", l: "LEDs" },
    { n: "3", u: "", l: "Light colors" },
    { n: "80", u: "h", l: "Up to, per charge" },
    { n: "63", u: "g", l: "Light enough to pack" },
  ];
  return (
    <section className="lf-sec lf-sec--tight" aria-labelledby="rings-title">
      <div className="lf-wrap">
        <div className="lf-rings" data-rv>
          <div className="lf-rings__head">
            <h2 id="rings-title" className="lf-h2">Glea, by the numbers</h2>
            <p className="lf-rings__note">Maker&apos;s specs. Run time varies with brightness and light color.</p>
          </div>
          <ul className="lf-rings__list">
            {items.map((s) => (
              <li key={s.l} className="lf-ring">
                <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" pathLength={100} /></svg>
                <span className="lf-ring__n">{s.n}<small>{s.u}</small></span>
                <span className="lf-ring__l">{s.l}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Loftie's experts / journal row slot: three honest guide cards that link to real answers on this site. */
export function GoodToKnow({ title = "Good to know" }: { title?: string }) {
  const posts: { slot: SlotName; kicker: string; title: string; href: string }[] = [
    { slot: "BLOG-01", kicker: "Reading in bed", title: "Will it bother the person next to me?", href: "/pages/faq" },
    { slot: "BLOG-02", kicker: "Choosing", title: "Which of the six colors is yours?", href: "/collections/all" },
    { slot: "BLOG-03", kicker: "Travel", title: "Packing a light that weighs 63 g", href: `${pdp}#specs` },
  ];
  return (
    <section className="lf-sec" aria-labelledby="gtk-title">
      <div className="lf-wrap">
        <p className="lf-eyebrow lf-center">Notes for night readers</p>
        <h2 id="gtk-title" className="lf-h2 lf-center">{title}</h2>
        <div className="lf-rail lf-posts" data-rv-group>
          {posts.map((p) => (
            <Link key={p.title} href={p.href} className="lf-post">
              <div className="lf-post__img lf-zoom"><Media slot={p.slot} sizes="(min-width: 1000px) 30vw, 80vw" /></div>
              <p className="lf-post__k">{p.kicker}</p>
              <h3 className="lf-post__t">{p.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Rounded image panel with text over it (Loftie promo / feature panels). */
export function ImgPanel({ slot, title, text, cta, href, tone = "dark", sizes = "(min-width: 1000px) 50vw, 100vw", note }: {
  slot: SlotName; title: React.ReactNode; text?: string; cta?: string; href?: string; tone?: "dark" | "light"; sizes?: string; note?: string;
}) {
  return (
    <article className={`lf-panel lf-panel--${tone}`} data-rv>
      <div className="lf-panel__img"><Media slot={slot} sizes={sizes} /></div>
      <div className="lf-panel__shade" aria-hidden="true" />
      <div className="lf-panel__txt">
        <h3 className="lf-panel__t">{title}</h3>
        {text ? <p>{text}</p> : null}
        {cta && href ? <Link className="btn btn--cream" href={href}>{cta}</Link> : null}
      </div>
      {note ? <span className="lf-panel__note">{note}</span> : null}
    </article>
  );
}
