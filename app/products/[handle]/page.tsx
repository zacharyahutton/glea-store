import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shopify } from "@/lib/shopify";
import { site, slugify } from "@/lib/site";
import { faqs, features, known } from "@/lib/content";
import { gallerySlots, type SlotName } from "@/lib/media";
import { resolveColorImages, resolveSlot, hasDrop } from "@/lib/media-server";
const glowSlots: SlotName[] = ["GLOW-3000", "GLOW-4500", "GLOW-6000"];
import { ProductView, type ColorMedia, type Slide } from "@/components/product/ProductView";
import { ColorCard, colorOf } from "@/components/product/ColorCard";
import { Spec, AiNote } from "@/components/home/Sections";
import { ImgPanel } from "@/components/lf/Blocks";
import { Rail } from "@/components/lf/Rail";
import { GlowPicker } from "@/components/lf/GlowPicker";
import { WaysToUse } from "@/components/lf/WaysToUse";
import { FaqList } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { JsonLd } from "@/components/ui/JsonLd";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await shopify.products()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const p = await shopify.product((await params).handle);
  if (!p) return {};
  const description = p.seo.description || site.description;
  return {
    title: p.seo.title || p.title,
    description,
    alternates: { canonical: `/products/${p.handle}` },
    openGraph: { title: p.title, description, url: `/products/${p.handle}`, images: [p.images[0]?.url ?? "/media/glea-og.jpg"] },
  };
}

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const product = await shopify.product((await params).handle);
  if (!product) notFound();

  const shopifyImgs: Slide[] = product.images.map((i) => ({ src: i.url, alt: i.altText ?? product.title, w: i.width ?? 1200, h: i.height ?? 1200 }));
  const localImgs: Slide[] = gallerySlots
    .map((s) => resolveSlot(s))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .map((r) => ({ src: r.src, alt: r.alt, w: r.w, h: r.h, note: r.note }));
  // Final local photo set (in brand order) wins over Shopify product media; Shopify images are the fallback.
  const shared = localImgs.length ? localImgs : shopifyImgs;
  const colorMedia: ColorMedia = {};
  for (const v of product.variants) {
    const c = colorOf(v);
    colorMedia[slugify(c)] = resolveColorImages(slugify(c)).map((src, i) => ({ src, alt: `${product.title} in ${c}${i ? `, view ${i + 1}` : ""}`, w: 1100, h: 1100 }));
  }
  const pdpFaq = known(faqs).filter((f) => f.topic !== "help").slice(0, 8);
  const url = `${site.url}/products/${product.handle}`;
  const description = plain(product.descriptionHtml) || site.description;
  const imgs = shared.filter((s): s is Exclude<Slide, { placeholder: true }> => !("placeholder" in s)).map((s) => (s.src.startsWith("http") ? s.src : `${site.url}${s.src}`));

  const pdp = `/products/${product.handle}`;
  const atHome: SlotName[] = ["LIFE-HANDS", "LIFE-PARTNER", "LIFE-SOFA", "LIFE-TRAVEL", "LIFE-ARMCHAIR", "LIFE-GIFT", "LIFE-UGC"];
  const strip = ["9 LEDs", "3 light colors", "Up to 80 h per charge", "1000mAh battery", "63 g", "Hold 4 s to dim"];
  const icons = [...features, { icon: "moon", title: "Dims to 10%", text: "Hold 4 s to dim from 100% to 10%." }];

  return (
    <>
      <nav className="crumbs sr-only" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/collections/all">Shop</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <ProductView product={product} shared={shared} colorMedia={colorMedia} bundleImg={hasDrop("BUNDLE") ? <Media slot="BUNDLE" sizes="120px" /> : undefined}>
        <div className="lf-accs">
          <details className="acc">
            <summary><span>Description</span><Icon name="plus" size={18} className="plus" /></summary>
            <div className="acc__body">
              {product.descriptionHtml ? <div className="prose" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> : <p>{site.description}</p>}
            </div>
          </details>
          <details className="acc">
            <summary><span>Key features</span><Icon name="plus" size={18} className="plus" /></summary>
            <div className="acc__body">
              <ul className="feat">
                {features.map((f) => <li key={f.title}><Icon name={f.icon} size={20} /><span><strong>{f.title}.</strong> {f.text}</span></li>)}
              </ul>
            </div>
          </details>
          <details className="acc" id="specs">
            <summary><span>Specs and what is in the box</span><Icon name="plus" size={18} className="plus" /></summary>
            <div className="acc__body"><Spec /></div>
          </details>
        </div>
      </ProductView>

      <section className="lf-strip" aria-label="Maker's specs">
        <ul>{strip.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      <section className="lf-sec" aria-labelledby="feat-title">
        <div className="lf-wrap lf-text">
          <h2 id="feat-title" className="lf-h2 lf-center">Everything you need to read at night</h2>
          <ul className="lf-icons" data-rv-group>
            {icons.map((f) => <li key={f.title}><Icon name={f.icon} size={26} /><span>{f.title}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-label="Glea at night">
        <div className="lf-wrap lf-stack">
          <ImgPanel slot="LIFE-NIGHTSTAND" title="Clip it on. Keep reading." text="Clip Glea to your book, front or back cover, and bend the neck so the glow lands on your page." sizes="(min-width: 1000px) 92vw, 100vw" />
          <ImgPanel slot="LIFE-PARTNER" title="Wind down without the big light." text="Hold the button for 4 seconds to dim from 100% to 10%, and keep the room dark for whoever is asleep." sizes="(min-width: 1000px) 92vw, 100vw" />
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-labelledby="why-title">
        <div className="lf-wrap lf-text">
          <div className="lf-split lf-split--plain" data-rv>
            <div className="lf-split__img"><Media slot="LIFE-HANDS" sizes="(min-width: 1000px) 50vw, 100vw" /></div>
            <div className="lf-split__txt">
              <h2 id="why-title" className="lf-h2">Your page glows. The room stays dark.</h2>
              <p>The light points down at your page, not across the room. Some light may still be visible, especially at high brightness. Turning it down helps.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-labelledby="glow-title">
        <div className="lf-wrap lf-text">
          <h2 id="glow-title" className="lf-h2 lf-center">Pick your glow</h2>
          <p className="lf-sub lf-center">Three light colors: warm 3000K, neutral 4500K and cool 6000K.</p>
          <GlowPicker photo={<Media slot="LIFE-PLINTH" sizes="(min-width: 1000px) 60vw, 100vw" />} lights={glowSlots.every(hasDrop) ? glowSlots.map((g) => <Media key={g} slot={g} sizes="(min-width: 1000px) 30vw, 50vw" />) : undefined} />
        </div>
      </section>

      <section className="lf-sec" id="how-it-works" aria-labelledby="how-title">
        <div className="lf-wrap lf-text">
          <h2 id="how-title" className="lf-h2 lf-center">How it works</h2>
          <WaysToUse items={[
            { id: "clip", title: "Clip it on", text: "Clip Glea to your book, front or back cover.", media: <Media slot="HOW-01" sizes="(min-width: 1000px) 55vw, 100vw" /> },
            { id: "aim", title: "Aim the glow", text: "Bend the neck and set the brightness you like.", media: <Media slot="HOW-02" sizes="(min-width: 1000px) 55vw, 100vw" /> },
            { id: "read", title: "Keep reading", text: "The page glows. The room stays dark.", media: <Media slot="HOW-03" sizes="(min-width: 1000px) 55vw, 100vw" /> },
          ]} />
          <div className="lf-alt" data-rv>
            <div className="lf-alt__img lf-stage"><Media slot="MACRO-BUTTON" sizes="(min-width: 1000px) 45vw, 100vw" /></div>
            <div className="lf-alt__txt">
              <h3 className="lf-h2">Easy to control</h3>
              <p>Switch it on, choose one of 3 light colors, and hold for 4 seconds to dim from 100% to 10%.</p>
              <ul className="lf-callouts"><li><strong>9 LEDs</strong></li><li><strong>3 light colors</strong> 3000K, 4500K, 6000K</li><li><strong>Hold 4 s</strong> to dim to 10%</li></ul>
            </div>
          </div>
          <div className="lf-alt lf-alt--flip" data-rv>
            <div className="lf-alt__img lf-stage"><Media slot="BENT" sizes="(min-width: 1000px) 45vw, 100vw" /></div>
            <div className="lf-alt__txt">
              <h3 className="lf-h2">Bend it where you need it</h3>
              <p>The flexible neck bends so the glow lands right where you are reading. It clips to hardcovers and paperbacks, and holds best on the back cover or on a hardcover.</p>
              <p>Up to 80 hours per charge from a 1000mAh battery, by the maker&apos;s figures. Run time varies with brightness and light color.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" id="in-the-box" aria-label="In the box">
        <div className="lf-wrap">
          <ImgPanel slot="INBOX" title="In the box" text="Your Glea light, a USB charging cable and a silicone page-follower bookmark." cta="See all colors" href="/collections/all" note="Bookmark shown as an illustration" sizes="(min-width: 1000px) 92vw, 100vw" />
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-labelledby="home-title">
        <div className="lf-wrap">
          <h2 id="home-title" className="lf-h2 lf-center">Glea at home</h2>
          <Rail label="Glea at home photos" className="lf-athome">
            {atHome.map((s) => <div className="lf-athome__item" key={s}><Media slot={s} sizes="(min-width: 1000px) 20vw, 60vw" /></div>)}
          </Rail>
          <AiNote />
        </div>
      </section>

      <section className="lf-sec" aria-labelledby="faq-title">
        <div className="lf-wrap lf-narrow">
          <h2 id="faq-title" className="lf-h2 lf-center">FAQs</h2>
          <FaqList items={pdpFaq} />
          <p className="lf-center" style={{ marginTop: 24 }}><Link className="lnk" href="/pages/faq">All FAQs</Link></p>
        </div>
      </section>

      <section className="lf-sec lf-sec--top0" aria-labelledby="colors-title">
        <div className="lf-wrap lf-text">
          <h2 id="colors-title" className="lf-h2 lf-center">More colors</h2>
          <Rail label="All colors" className="lf-more">
            {product.variants.map((v) => <div className="lf-more__item" key={v.id}><ColorCard product={product} variant={v} sizes="(min-width: 1000px) 25vw, 60vw" /></div>)}
          </Rail>
          <p className="lf-center" style={{ marginTop: 8 }}><Link className="lnk" href={pdp}>Back to top</Link></p>
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description,
            url,
            image: imgs.length ? imgs : [`${site.url}/media/glea-og.jpg`],
            brand: { "@type": "Brand", name: product.vendor || site.name },
            ...(product.variants[0]?.sku ? { sku: product.variants[0].sku } : {}),
            offers: product.variants.map((v) => ({
              "@type": "Offer",
              name: `${product.title} - ${colorOf(v)}`,
              url: `${url}?color=${encodeURIComponent(colorOf(v))}`,
              price: v.price.amount,
              priceCurrency: v.price.currencyCode,
              availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
                shippingRate: { "@type": "MonetaryAmount", value: site.flatShipping, currency: "USD" },
              },
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "US",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: site.returnDays,
                returnMethod: "https://schema.org/ReturnByMail",
              },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/collections/all` },
              { "@type": "ListItem", position: 3, name: product.title, item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: pdpFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />
    </>
  );
}
