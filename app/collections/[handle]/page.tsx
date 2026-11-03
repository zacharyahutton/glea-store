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
import { FaqList } from "@/components/ui/Faq";
import { GoodToKnow } from "@/components/lf/Blocks";

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
  const help = [
    { q: "Shipping", a: `US orders of $${site.freeShippingThreshold} or more ship free. Orders under $${site.freeShippingThreshold} ship for a flat $${site.flatShipping}.` },
    { q: "Returns", a: `We accept returns within ${site.returnDays} days. Email hello@getglea.com with your order number to start one.` },
    { q: "Charging", a: "Plug it in with the USB charging cable in the box. Up to 80 hours per charge from a 1000mAh battery, by the maker's figures. Run time varies with brightness and light color." },
    { q: "In the box", a: "A reading light in your color, a charging cable and a silicone page-follower bookmark." },
  ];
  return (
    <>
      <section className="lf-sec lf-sec--page" aria-labelledby="coll-title">
        <div className="lf-wrap">
          <nav className="crumbs sr-only" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
          </nav>
          <ColorFilter title={handle === "all" || handle === "frontpage" ? "Shop all" : title} colors={colors} swatches={swatches} cards={cards.map((x) => ({ color: x.color, available: x.v.availableForSale, node: <ColorCard product={x.p} variant={x.v} sizes="(min-width: 1000px) 25vw, 50vw" /> }))} />
        </div>
      </section>
      <section className="lf-sec lf-sec--top0" aria-labelledby="coll-help">
        <div className="lf-wrap lf-text">
          <div className="lf-accsplit" data-rv>
            <div>
              <h2 id="coll-help" className="sr-only">Before you pick</h2>
              <FaqList items={help} />
            </div>
            <div className="lf-accsplit__img"><Media slot="STUDIO-CREAM" sizes="(min-width: 1000px) 45vw, 100vw" /></div>
          </div>
        </div>
      </section>
      <GoodToKnow />
      <div className="lf-wrap"><AiNote /></div>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: title, item: url }] },
          { "@context": "https://schema.org", "@type": "ItemList", itemListElement: cards.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/products/${x.p.handle}?color=${encodeURIComponent(x.color)}`, name: `${x.p.title} - ${x.color}` })) },
        ]}
      />
    </>
  );
}
