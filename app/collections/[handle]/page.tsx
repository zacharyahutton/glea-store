import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";
import { ColorCard, colorOf, swatchFor } from "@/components/product/ColorCard";
import { ColorFilter } from "@/components/product/ColorFilter";
import { Media } from "@/components/ui/Media";
import { JsonLd } from "@/components/ui/JsonLd";
import { AiNote } from "@/components/home/Sections";

export const revalidate = 300;

export async function generateStaticParams() {
  const cs = await shopify.collections();
  return [{ handle: "all" }, ...cs.filter((c) => c.handle !== "all").map((c) => ({ handle: c.handle }))];
}

const titleFor = (h: string, t: string) => (h === "all" || h === "frontpage" ? "All colors" : t);

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const c = await shopify.collection(handle);
  if (!c) return {};
  return { title: titleFor(handle, c.title), description: c.description || "Glea clip-on book lights in six colors.", alternates: { canonical: `/collections/${handle === "frontpage" ? "all" : handle}` } };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const c = await shopify.collection(handle);
  if (!c) notFound();
  const title = titleFor(handle, c.title);
  const cards = c.products.flatMap((p) => p.variants.map((v) => ({ p, v, color: colorOf(v) })));
  const colors = [...new Set(cards.map((x) => x.color))];
  const swatches = Object.fromEntries(cards.map((x) => [x.color, swatchFor(x.p, x.color)]));
  const url = `${site.url}/collections/${handle}`;
  return (
    <>
      <section className="hero" style={{ minHeight: 0 }} aria-labelledby="coll-title">
        <div className="hero__track">
          <div className="hero__slide is-active" style={{ minHeight: "clamp(280px, 40vw, 440px)" }}>
            <div className="hero__media"><Media slot="COLL" priority /></div>
            <div className="hero__shade" />
            <div className="container hero__content" style={{ width: "100%", paddingBlock: "40px" }}>
              <span className="kicker" style={{ color: "var(--glow)" }}>Shop</span>
              <h1 id="coll-title" className="h1">{title}</h1>
              <p className="lead">{c.description || "One light, six colors. Pick the glow that fits your nightstand."}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="container sec sec--tight">
        <nav className="crumbs" aria-label="Breadcrumb" style={{ paddingTop: 0, marginBottom: 20 }}>
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
        </nav>
        <ColorFilter colors={colors} swatches={swatches} cards={cards.map((x) => ({ color: x.color, available: x.v.availableForSale, node: <ColorCard product={x.p} variant={x.v} /> }))} />
        <div style={{ marginTop: 40 }}><AiNote /></div>
      </div>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: title, item: url }] },
          { "@context": "https://schema.org", "@type": "ItemList", itemListElement: cards.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/products/${x.p.handle}?color=${encodeURIComponent(x.color)}`, name: `${x.p.title} - ${x.color}` })) },
        ]}
      />
    </>
  );
}
