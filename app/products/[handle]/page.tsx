import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shopify } from "@/lib/shopify";
import { site, slugify } from "@/lib/site";
import { faqs, features, known } from "@/lib/content";
import { gallerySlots, featureSlots, type SlotName } from "@/lib/media";
import { resolveColorImages, resolveSlot } from "@/lib/media-server";
import { ProductView, type ColorMedia, type Slide } from "@/components/product/ProductView";
import { ColorCard, colorOf } from "@/components/product/ColorCard";
import { APlus, Compare, Spec, AiNote } from "@/components/home/Sections";
import { Stats } from "@/components/home/Showcase";
import { FaqList, linkText } from "@/components/ui/Faq";
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

  return (
    <>
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/collections/all">Shop</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{product.title}</span>
        </nav>
        <ProductView product={product} shared={shared} colorMedia={colorMedia}>
          {product.descriptionHtml ? <div className="prose small" style={{ marginTop: 20 }} dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} /> : <p className="muted" style={{ marginTop: 20 }}>{site.description}</p>}
          <ul className="feat">
            {features.map((f) => <li key={f.title}><Icon name={f.icon} size={20} /><span><strong>{f.title}.</strong> {f.text}</span></li>)}
          </ul>
          <div className="info-blocks">
            <details className="acc">
              <summary><span><Icon name="truck" size={20} />Shipping</span><Icon name="plus" size={20} className="plus" /></summary>
              <div className="acc__body"><p>We ship within the United States. Orders of ${site.freeShippingThreshold} or more ship free. Orders under ${site.freeShippingThreshold} ship for a flat ${site.flatShipping.toFixed(2)}. <Link href="/policies/shipping-policy">Shipping policy</Link></p></div>
            </details>
            <details className="acc">
              <summary><span><Icon name="return" size={20} />Returns</span><Icon name="plus" size={20} className="plus" /></summary>
              <div className="acc__body"><p dangerouslySetInnerHTML={{ __html: linkText(`We accept returns within ${site.returnDays} days. Email hello@getglea.com with your order number to start one.`) }} /><p><Link href="/policies/refund-policy">Refund policy</Link></p></div>
            </details>
            <details className="acc">
              <summary><span><Icon name="box" size={20} />Details and what is in the box</span><Icon name="plus" size={20} className="plus" /></summary>
              <div className="acc__body"><Spec /></div>
            </details>
          </div>
        </ProductView>
      </div>

      <section className="sec sec--white" aria-labelledby="feat-title">
        <div className="container">
          <div className="sec-head"><div><span className="kicker">Features</span><h2 id="feat-title" className="h1">Made for reading after dark</h2></div></div>
          <div className="grid grid-4">
            {featureSlots.map((s) => (
              <div className="frame ratio-1" data-rv key={s}><Media slot={s} sizes="(min-width: 1024px) 25vw, (min-width: 600px) 50vw, 100vw" /></div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section className="sec" id="how-it-works" aria-labelledby="how-title">
        <div className="container">
          <div className="sec-head"><div><span className="kicker">How it works</span><h2 id="how-title" className="h1">Clip. Glow. Keep reading.</h2></div></div>
          <div className="grid grid-3">
            {[
              { s: "HOW-01", t: "Clip it on", d: "Clip Glea to your book, front or back cover." },
              { s: "HOW-02", t: "Aim the glow", d: "Bend the neck and set the brightness you like." },
              { s: "HOW-03", t: "Keep reading", d: "The page glows. The room stays dark." },
            ].map((h, i) => (
              <div className="card card--flat" key={h.s}>
                <div className="frame ratio-43"><Media slot={h.s as SlotName} sizes="(min-width: 768px) 33vw, 100vw" /></div>
                <h3 className="h3"><span className="muted">0{i + 1}</span> {h.t}</h3>
                <p className="muted">{h.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tint" aria-label="Product story">
        <div className="container"><APlus /></div>
      </section>

      <section className="sec" aria-labelledby="cmp-title">
        <div className="container narrow">
          <h2 id="cmp-title" className="h1" style={{ marginBottom: 24 }}>Glea vs the usual ways to read at night</h2>
          <Compare />
        </div>
      </section>

      <section className="sec sec--white" aria-labelledby="faq-title">
        <div className="container narrow">
          <h2 id="faq-title" className="h1" style={{ marginBottom: 16 }}>Questions</h2>
          <FaqList items={pdpFaq} />
          <p style={{ marginTop: 20 }}><Link className="link-arrow" href="/pages/faq">All FAQs <Icon name="arrow" size={18} /></Link></p>
        </div>
      </section>

      <section className="sec" aria-labelledby="colors-title">
        <div className="container">
          <div className="sec-head"><div><span className="kicker">Six colors</span><h2 id="colors-title" className="h1">Pick your glow</h2></div></div>
          <div className="lineup">{product.variants.map((v) => <ColorCard key={v.id} product={product} variant={v} sizes="(min-width: 1100px) 16vw, (min-width: 768px) 33vw, 68vw" />)}</div>
          <div style={{ marginTop: 32 }}><AiNote /></div>
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
