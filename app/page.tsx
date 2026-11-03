import type { Metadata } from "next";
import Link from "next/link";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";
import { heroSlides, faqs, known, features } from "@/lib/content";
import type { SlotName } from "@/lib/media";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Trust, APlus, Benefits, Moments, Compare, AiNote } from "@/components/home/Sections";
import { ColorCard } from "@/components/product/ColorCard";
import { Media } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { FaqList } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";

export const revalidate = 300;
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const product = await shopify.product(site.productHandle);
  const pdp = `/products/${site.productHandle}`;
  const homeFaq = known(faqs).filter((f) => ["What colors are there?", "Will it bother my partner?", "Does it fit hardcovers and paperbacks?", "Do you offer free shipping?", "What is your return policy?"].includes(f.q));
  const slides = heroSlides.map((h, i) => (
    <>
      <div className="hero__media"><Media slot={h.slot as SlotName} priority={i === 0} /></div>
      <div className="hero__shade" />
      <div className="container hero__content" style={{ width: "100%" }}>
        {i === 0 ? <h1 className="display">{h.heading}</h1> : <h2 className="display">{h.heading}</h2>}
        <p className="lead">{h.sub}</p>
        <Link className={`btn ${h.tone === "dark" ? "btn--primary" : "btn--glow"}`} href={pdp}>{h.cta}</Link>
      </div>
    </>
  ));
  return (
    <>
      <HeroSlider slides={slides} tones={heroSlides.map((h) => h.tone)} />
      <Trust />

      <section className="sec" aria-labelledby="lineup-title">
        <div className="container">
          <div className="sec-head">
            <div><span className="kicker">Six colors · {product ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}` : ""}</span><h2 id="lineup-title" className="h2">Find your reading light</h2></div>
            <Link className="link-arrow" href="/collections/all">Shop all colors <Icon name="arrow" size={18} /></Link>
          </div>
          {product ? <div className="lineup">{product.variants.map((v) => <ColorCard key={v.id} product={product} variant={v} sizes="(min-width: 1100px) 16vw, (min-width: 768px) 33vw, 68vw" />)}</div> : null}
        </div>
      </section>

      <section className="sec sec--tint" aria-labelledby="why-title">
        <div className="container">
          <div className="sec-head"><div><span className="kicker">Why Glea</span><h2 id="why-title" className="h2">Your page glows. The room stays dark.</h2></div></div>
          <Benefits />
        </div>
      </section>

      <section className="sec" aria-label="How Glea works">
        <div className="container"><APlus limit={3} /></div>
      </section>

      <section className="sec sec--white" aria-labelledby="feat-title">
        <div className="container split">
          <div>
            <span className="kicker">The light</span>
            <h2 id="feat-title" className="h2" style={{ margin: "10px 0 20px" }}>Small light. Made for one more chapter.</h2>
            <ul className="feat">{features.map((f) => <li key={f.title}><Icon name={f.icon} size={20} /><span><strong>{f.title}.</strong> {f.text}</span></li>)}</ul>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <Link className="btn btn--primary" href={pdp}>Shop the light</Link>
              <Link className="btn btn--ghost" href={`${pdp}#how-it-works`}>How it works</Link>
            </div>
          </div>
          <Compare />
        </div>
      </section>

      <section className="sec" aria-labelledby="moments-title">
        <div className="container">
          <div className="sec-head"><div><span className="kicker">Where it goes</span><h2 id="moments-title" className="h2">Made for reading after dark</h2></div></div>
          <Moments />
        </div>
      </section>

      <section className="sec sec--tight" aria-label="Glea on Instagram">
        <div className="container">
          <div className="creator">
            <Media slot="CREATOR" sizes="100vw" />
            <div className="creator__in">
              <span className="kicker" style={{ color: "var(--glow)" }}>Night readers</span>
              <h2 className="h2">Show us your reading corner.</h2>
              <p>Tag {site.instagramHandle} on Instagram.</p>
              <a className="btn btn--glow" style={{ justifySelf: "start" }} href={site.instagram} target="_blank" rel="noopener noreferrer">Follow {site.instagramHandle}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--white" aria-labelledby="hfaq-title">
        <div className="container narrow">
          <h2 id="hfaq-title" className="h2" style={{ marginBottom: 16 }}>Good to know</h2>
          <FaqList items={homeFaq} />
          <p style={{ marginTop: 20 }}><Link className="link-arrow" href="/pages/faq">All FAQs <Icon name="arrow" size={18} /></Link></p>
          <div style={{ marginTop: 40 }}><AiNote /></div>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, potentialAction: { "@type": "SearchAction", target: `${site.url}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
    </>
  );
}
