import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";
import { Placeholder } from "@/components/ui/Placeholder";

export const revalidate = 300;
export async function generateStaticParams() {
  return [{ blog: "news" }];
}
export async function generateMetadata({ params }: { params: Promise<{ blog: string }> }): Promise<Metadata> {
  const b = await shopify.blog((await params).blog);
  if (!b) return {};
  return { title: b.title, description: "Reading notes and news from Glea.", alternates: { canonical: `/blogs/${b.handle}` } };
}

export default async function BlogPage({ params }: { params: Promise<{ blog: string }> }) {
  const b = await shopify.blog((await params).blog);
  if (!b) notFound();
  return (
    <>
      <section className="phero">
        <div className="container">
          <span className="kicker">{b.title}</span>
          <h1 className="h1">Reading notes</h1>
          <p className="lead">Notes on reading after dark, from Glea.</p>
        </div>
      </section>
      <section className="sec sec--tight">
        <div className="container">
          {b.articles.length ? (
            <div className="grid grid-3">
              {b.articles.map((a) => (
                <Link key={a.handle} href={`/blogs/${b.handle}/${a.handle}`} className="pcard">
                  <div className="pcard__media" style={{ aspectRatio: "3 / 2" }}>
                    {a.image ? <Image src={a.image.url} alt={a.image.altText ?? a.title} width={900} height={600} sizes="(min-width: 768px) 33vw, 100vw" /> : <Placeholder note={null} />}
                  </div>
                  <span className="small muted">{new Date(a.publishedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                  <span className="h3">{a.title}</span>
                  {a.excerpt ? <span className="muted">{a.excerpt}</span> : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty">
              <p className="h3">The first notes are on the way.</p>
              <p className="muted">Follow <a className="link" href={site.instagram} target="_blank" rel="noopener noreferrer">{site.instagramHandle}</a> to hear when they go up.</p>
              <Link className="btn btn--primary" href={`/products/${site.productHandle}`}>Shop the light</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
