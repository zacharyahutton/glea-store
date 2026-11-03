import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shopify } from "@/lib/shopify";

export const revalidate = 3600;
export async function generateStaticParams() {
  return (await shopify.policies()).map((p) => ({ handle: p.handle }));
}
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = (await shopify.policies()).find((x) => x.handle === handle);
  return p ? { title: p.title, alternates: { canonical: `/policies/${p.handle}` } } : {};
}
export default async function PolicyPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = (await shopify.policies()).find((x) => x.handle === handle);
  if (!p) notFound();
  return (
    <div className="container narrow sec sec--tight">
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{p.title}</span></nav>
      <h1 className="h1" style={{ margin: "16px 0 28px" }}>{p.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: p.body }} />
    </div>
  );
}
