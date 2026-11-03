import type { Metadata } from "next";
import Link from "next/link";
import { shopify } from "@/lib/shopify";
import { site, formatMoney } from "@/lib/site";
import { AiNote } from "@/components/home/Sections";
import { Media } from "@/components/ui/Media";
import { JsonLd } from "@/components/ui/JsonLd";
import { SpecRings, GoodToKnow, ImgPanel } from "@/components/lf/Blocks";
import { Tabs } from "@/components/lf/Tabs";
import { DimDemo } from "@/components/lf/DimDemo";
import type { SlotName } from "@/lib/media";

export const revalidate = 300;
export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Home, in Loftie's section order (see T-048-loftie-analysis.md, home map). */
export default async function Home() {
  const product = await shopify.product(site.productHandle);
  const pdp = `/products/${site.productHandle}`;
  const price = product ? formatMoney(product.priceRange.minVariantPrice.amount) : "";
  const who: { slot: SlotName; t: string; s: string }[] = [
    { slot: "LIFE-SOFA", t: "Reading in bed", s: "Clip, bend, read" },
    { slot: "LIFE-PARTNER", t: "Next to a sleeper", s: "The glow stays on your page" },
    { slot: "LIFE-TRAVEL", t: "Travel", s: "63 g, rechargeable" },
    { slot: "LIFE-GIFT", t: "A gift", s: "Six colors to pick from" },
  ];
  const tabs = [
    { id: "bed", label: "Reading in bed", quote: "Clip it to your book, bend the neck, and the glow lands right on your page.", slot: "LIFE-HANDS" as SlotName, chip: "Warm", chipV: "3000K" },
    { id: "sleeper", label: "Next to a sleeper", quote: "The light points down at your page, so most of the room stays dark.", slot: "LIFE-NIGHTSTAND" as SlotName, chip: "Hold 4 s", chipV: "100% to 10%" },
    { id: "travel", label: "Travel", quote: "It weighs 63 g and charges by USB, so it packs right next to your book.", slot: "LIFE-ARMCHAIR" as SlotName, chip: "Up to", chipV: "80 h per charge" },
    { id: "gift", label: "Gifting", quote: "Six colors, so there is one for every reader on your list.", slot: "LIFE-UGC" as SlotName, chip: "Colors", chipV: "6" },
  ];
  return (
    <>
      <section className="lf-hero" aria-labelledby="hero-title">
        <div className="lf-hero__media"><Media slot="HERO-01" priority sizes="100vw" /></div>
        <div className="lf-hero__shade" aria-hidden="true" />
        <div className="lf-hero__in">
          <h1 id="hero-title" className="lf-hero__t">Soft light, after dark.</h1>
          <p className="lf-hero__s">A clip-on book light with a warm glow that stays on your page, so the room stays dark. Six colors. Rechargeable.</p>
          <Link className="btn btn--cream" href={pdp}>Shop the light</Link>
        </div>
      </section>

      <SpecRings />

      <section className="lf-sec" aria-labelledby="who-title">
        <div className="lf-wrap">
          <div className="lf-who">
            <h2 id="who-title" className="lf-h2 lf-center">Who is it for?</h2>
            <p className="lf-sub lf-center">Pick a reader. Every Glea comes with the same soft light.</p>
            <div className="lf-rail lf-who__grid" data-rv-group>
              {who.map((w) => (
                <Link key={w.t} href="/collections/all" className="lf-who__card">
                  <div className="lf-who__img lf-zoom"><Media slot={w.slot} sizes="(min-width: 1000px) 22vw, 60vw" /></div>
                  <h3 className="lf-who__t">{w.t}</h3>
                  <p className="lf-who__s">{w.s}</p>
                </Link>
              ))}
            </div>
            <div className="lf-center"><Link className="btn btn--navy" href="/collections/all">Shop all colors</Link></div>
          </div>
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-labelledby="pair-title">
        <div className="lf-wrap lf-text">
          <h2 id="pair-title" className="lf-h2 lf-center">A soft glow for every night</h2>
          <div className="lf-pair" data-rv-group>
            <Link href={pdp} className="lf-pcard">
              <div className="lf-pcard__img lf-zoom"><Media slot="STUDIO-NAVY" sizes="(min-width: 1000px) 40vw, 90vw" /></div>
              <div className="lf-pcard__row"><h3 className="lf-pcard__t">Glea book light</h3><span className="lf-pcard__p">{price}</span></div>
              <p className="lf-pcard__d">Clip-on, bendable neck, 3 light colors, six colors to choose from.</p>
            </Link>
            <Link href={pdp} className="lf-pcard">
              <div className="lf-pcard__img lf-zoom"><Media slot="LINEUP" sizes="(min-width: 1000px) 40vw, 90vw" /></div>
              <div className="lf-pcard__row"><h3 className="lf-pcard__t">Buy 2, save ${site.bundle.save}</h3><span className="lf-pcard__p">2 lights</span></div>
              <p className="lf-pcard__d">One for you, one for the reader next to you. $5 comes off at checkout.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-labelledby="split-title">
        <div className="lf-wrap">
          <div className="lf-split" data-rv>
            <div className="lf-split__img">
              <Media slot="LIFE-NIGHTSTAND" sizes="(min-width: 1000px) 50vw, 100vw" />
              <span className="lf-chip" aria-hidden="true"><small>Warm</small>3000K</span>
            </div>
            <div className="lf-split__txt">
              <h2 id="split-title" className="lf-h2">Your page glows. The room stays dark.</h2>
              <p>The light points down at your page, not across the room. Bend the neck to aim it, and hold the button to dim it right down.</p>
              <Link className="btn btn--navy" href={`${pdp}#how-it-works`}>See how it works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lf-sec" aria-labelledby="tabs-title">
        <div className="lf-wrap">
          <h2 id="tabs-title" className="lf-h2 lf-center lf-h2--xl">Turn the big light off.<br /><em>Glea has the rest.</em></h2>
          <Tabs label="Ways to read with Glea" items={tabs.map((t) => ({
            id: t.id, label: t.label, quote: t.quote,
            media: <Media slot={t.slot} sizes="(min-width: 1000px) 34vw, 90vw" />,
            side: <div className="lf-tabs__card"><small>{t.chip}</small><strong>{t.chipV}</strong><Link className="lnk" href={pdp}>Shop the light</Link></div>,
          }))} />
        </div>
      </section>

      <section className="lf-sec" aria-labelledby="dim-title">
        <div className="lf-wrap lf-text">
          <h2 id="dim-title" className="lf-h2 lf-center">One button. Your glow.</h2>
          <DimDemo />
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-label="More from Glea">
        <div className="lf-wrap">
          <div className="lf-duo">
            <ImgPanel slot="INBOX" title={<>In the box</>} text="Your Glea light, a USB charging cable and a silicone page-follower bookmark." cta="See what is inside" href={`${pdp}#in-the-box`} note="Bookmark shown as an illustration" />
            <ImgPanel slot="LIFE-PARTNER" title={<>Read without<br />waking them</>} text="A warm glow on your page, a dark room for them." cta="Shop all colors" href="/collections/all" />
          </div>
        </div>
      </section>

      <GoodToKnow />

      <div className="lf-wrap"><AiNote /></div>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, potentialAction: { "@type": "SearchAction", target: `${site.url}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
    </>
  );
}
