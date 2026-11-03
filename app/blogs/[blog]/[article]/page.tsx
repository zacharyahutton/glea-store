import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/ui/JsonLd";

export const revalidate = 300;
export const dynamicParams = true;
export async function generateStaticParams() {
  const b = await shopify.blog("news");
  return (b?.articles ?? []).map((a) => ({ blog: "news", article: a.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ blog: string; article: string }> }): Promise<Metadata> {
  const { blog, article } = await params;
  const a = await shopify.article(blog, article);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt ?? undefined,
    alternates: { canonical: `/blogs/${blog}/${article}` },
    openGraph: { type: "article", title: a.title, images: a.image ? [a.image.url] : undefined, publishedTime: a.publishedAt },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ blog: string; article: string }> }) {
  const { blog, article } = await params;
  const a = await shopify.article(blog, article);
  if (!a) notFound();
  const url = `${site.url}/blogs/${blog}/${article}`;
  return (
    <article className="sec sec--tight">
      <div className="container narrow">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href={`/blogs/${blog}`}>Journal</Link></nav>
        <h1 className="h1" style={{ marginTop: 16 }}>{a.title}</h1>
        <p className="small muted" style={{ margin: "10px 0 28px" }}>{new Date(a.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" })}{a.authorName ? ` · ${a.authorName}` : ""}</p>
        {a.image ? <div className="frame ratio-32" style={{ marginBottom: 28 }}><Image src={a.image.url} alt={a.image.altText ?? a.title} width={1500} height={1000} sizes="780px" priority /></div> : null}
        <div className="prose" dangerouslySetInnerHTML={{ __html: a.contentHtml }} />
      </div>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Article", headline: a.title, datePublished: a.publishedAt, mainEntityOfPage: url, image: a.image ? [a.image.url] : undefined, author: a.authorName ? { "@type": "Person", name: a.authorName } : { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name } },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: "Journal", item: `${site.url}/blogs/${blog}` }, { "@type": "ListItem", position: 3, name: a.title, item: url }] },
        ]}
      />
    </article>
  );
}
