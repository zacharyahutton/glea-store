import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";
import { faqs, known, aplus } from "@/lib/content";
import { Benefits, Moments, Compare, AiNote } from "@/components/home/Sections";
import { Stats, Story } from "@/components/home/Showcase";
import { ColorCard } from "@/components/product/ColorCard";
import { Media } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { FaqList } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { resolveColorImages } from "@/lib/media-server";

export const revalidate = 300;
export const metadata: Metadata = { alternates: { canonical: "/" } };

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default async function Home() {
  const product = await shopify.product(site.productHandle);
  const pdp = `/products/${site.productHandle}`;
  const price = product ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}` : "";
  const homeFaq = known(faqs).filter((f) => ["What colors are there?", "How long does the battery last?", "Will it bother my partner?", "Does it fit hardcovers and paperbacks?", "Do you offer free shipping?", "What is your return policy?"].includes(f.q));
  const inline = ["amber", "lake-blue", "pink"].map((c) => resolveColorImages(c)[0]).filter(Boolean);
  const dark = aplus.find((a) => a.slot === "APLUS-02")!;
  return (
    <>
      <section className="xhero" aria-labelledby="hero-title">
        <div className="xhero__media"><Media slot="HERO-01" priority sizes="100vw" /></div>
        <div className="xhero__shade" aria-hidden="true" />
        <div className="container xhero__in">
          <span className="pill pill--glass">Clip-on book light{price ? ` · ${price}` : ""}</span>
          <h1 id="hero-title" className="xhero__title">Soft light,<br /><em>after dark.</em></h1>
          <div className="xhero__foot">
            <p className="xhero__sub">A warm glow that stays on your page, so the room stays dark. Six colors. Rechargeable.</p>
            <div className="xhero__cta">
              <Link className="btn btn--glow btn--lg" href={pdp}>Shop the light <Icon name="arrow" size={18} /></Link>
              <Link className="btn btn--glass btn--lg" href="#colors">See the colors</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec intro" aria-labelledby="intro-title">
        <div className="container">
          <span className="kicker" data-rv>The Glea reading light</span>
          <h2 id="intro-title" className="intro__text" data-rv>
            A small light that clips to your book{inline[0] ? <span className="intro__img" aria-hidden="true"><Image src={inline[0]} alt="" width={120} height={120} sizes="120px" /></span> : null} and aims a soft glow at your words{inline[1] ? <span className="intro__img" aria-hidden="true"><Image src={inline[1]} alt="" width={120} height={120} sizes="120px" /></span> : null} so you can read one more chapter while the room sleeps{inline[2] ? <span className="intro__img" aria-hidden="true"><Image src={inline[2]} alt="" width={120} height={120} sizes="120px" /></span> : null}
          </h2>
        </div>
      </section>

      <Stats />

      <section className="sec" id="colors" aria-labelledby="lineup-title">
        <div className="container">
          <div className="sec-head" data-rv>
            <div><span className="kicker">Six colors{price ? ` · ${price}` : ""}</span><h2 id="lineup-title" className="h1">Find your reading light</h2></div>
            <Link className="btn btn--ghost" href="/collections/all">Shop all colors <Icon name="arrow" size={18} /></Link>
          </div>
          {product ? <div className="lineup lineup--big">{product.variants.map((v) => <ColorCard key={v.id} product={product} variant={v} sizes="(min-width: 1100px) 30vw, (min-width: 768px) 45vw, 78vw" />)}</div> : null}
        </div>
      </section>

      <section className="sec sec--story" aria-labelledby="story-title">
        <div className="container">
          <div className="sec-head" data-rv><div><span className="kicker">How it works</span><h2 id="story-title" className="h1">Made for one more chapter</h2></div></div>
          <Story />
        </div>
      </section>

      <section className="band" aria-labelledby="band-title">
        <div className="band__media"><Media slot="APLUS-02" sizes="100vw" /></div>
        <div className="band__shade" aria-hidden="true" />
        <div className="container band__in">
          <span className="kicker kicker--glow" data-rv>Why Glea</span>
          <h2 id="band-title" className="band__title" data-rv>{dark.heading}</h2>
          <p className="lead" data-rv>{dark.sub}</p>
        </div>
      </section>

      <section className="sec" aria-labelledby="why-title">
        <div className="container">
          <h2 id="why-title" className="sr-only">Why readers pick Glea</h2>
          <Benefits />
        </div>
      </section>

      <section className="sec sec--white" aria-labelledby="cmp-title">
        <div className="container split">
          <div data-rv>
            <span className="kicker">Compare</span>
            <h2 id="cmp-title" className="h1" style={{ margin: "12px 0 20px" }}>Made for reading after dark.</h2>
            <p className="lead">Glea clips to your book and aims a soft glow at your page, so your hands stay free.</p>
            <div className="btn-row">
              <Link className="btn btn--primary btn--lg" href={pdp}>Shop the light</Link>
              <Link className="btn btn--ghost btn--lg" href={`${pdp}#how-it-works`}>How it works</Link>
            </div>
          </div>
          <div data-rv><Compare /></div>
        </div>
      </section>

      <section className="sec" aria-labelledby="moments-title">
        <div className="container">
          <div className="sec-head" data-rv><div><span className="kicker">Where it goes</span><h2 id="moments-title" className="h1">Made for reading after dark</h2></div></div>
          <Moments />
        </div>
      </section>

      <section className="sec sec--tight" aria-label="Glea on Instagram">
        <div className="container">
          <div className="creator" data-rv>
            <Media slot="CREATOR" sizes="100vw" />
            <div className="creator__in">
              <span className="kicker kicker--glow">Night readers</span>
              <h2 className="h1">Show us your reading corner.</h2>
              <p>Tag {site.instagramHandle} on Instagram.</p>
              <a className="btn btn--glow btn--lg" style={{ justifySelf: "start" }} href={site.instagram} target="_blank" rel="noopener noreferrer">Follow {site.instagramHandle}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--white" aria-labelledby="hfaq-title">
        <div className="container faq-split">
          <div data-rv>
            <span className="kicker">Questions</span>
            <h2 id="hfaq-title" className="h1" style={{ marginTop: 12 }}>Good to know</h2>
            <p style={{ marginTop: 20 }}><Link className="link-arrow" href="/pages/faq">All FAQs <Icon name="arrow" size={18} /></Link></p>
          </div>
          <div>
            <FaqList items={homeFaq} />
            <div style={{ marginTop: 32 }}><AiNote /></div>
          </div>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, potentialAction: { "@type": "SearchAction", target: `${site.url}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } }} />
    </>
  );
}
