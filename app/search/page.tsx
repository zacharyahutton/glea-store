import type { Metadata } from "next";
import Link from "next/link";
import { shopify } from "@/lib/shopify";
import { faqs, known } from "@/lib/content";
import { ColorCard, colorOf } from "@/components/product/ColorCard";
import { SearchTracker } from "@/components/pages/SearchTracker";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true }, alternates: { canonical: "/search" } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const all = await shopify.products();
  const ql = q.toLowerCase();
  const terms = ql.split(/\s+/).filter(Boolean);
  const hits = q
    ? all.flatMap((p) => p.variants.filter((v) => terms.some((t) => `${p.title} ${colorOf(v)} ${p.tags.join(" ")} light lamp book reading clip`.toLowerCase().includes(t))).map((v) => ({ p, v })))
    : [];
  const faqHits = q ? known(faqs).filter((f) => terms.some((t) => t.length > 2 && `${f.q} ${f.a}`.toLowerCase().includes(t))).slice(0, 5) : [];
  return (
    <div className="container sec sec--tight">
      <h1 className="h1">Search</h1>
      <form action="/search" role="search" style={{ display: "flex", gap: 10, margin: "20px 0 32px", maxWidth: 560 }}>
        <label htmlFor="q" className="sr-only">Search the store</label>
        <input id="q" name="q" className="input" defaultValue={q} placeholder="Try pink, gift or returns" type="search" />
        <button className="btn btn--primary">Search</button>
      </form>
      {q ? <SearchTracker q={q} /> : null}
      {q ? (
        <>
          <p className="muted" aria-live="polite" style={{ marginBottom: 20 }}>{hits.length + faqHits.length} result{hits.length + faqHits.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;</p>
          {hits.length ? <div className="grid grid-4">{hits.map(({ p, v }) => <ColorCard key={v.id} product={p} variant={v} />)}</div> : null}
          {faqHits.length ? (
            <div style={{ marginTop: 40 }}>
              <h2 className="h3">From the FAQ</h2>
              <ul className="feat">{faqHits.map((f) => <li key={f.q}><span><strong>{f.q}</strong> {f.a}</span></li>)}</ul>
            </div>
          ) : null}
          {!hits.length && !faqHits.length ? <p>Nothing matched. <Link className="link" href="/collections/all">See all colors</Link> or read the <Link className="link" href="/pages/faq">FAQ</Link>.</p> : null}
        </>
      ) : null}
    </div>
  );
}
