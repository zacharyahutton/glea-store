import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";
import { faqs, known, topics, benefits } from "@/lib/content";
import { Media } from "@/components/ui/Media";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { MailForm } from "@/components/pages/MailForm";
import { FaqTabs } from "@/components/pages/FaqTabs";
import { OptOut } from "@/components/pages/OptOut";
import { AiNote } from "@/components/home/Sections";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await shopify.pages()).map((p) => ({ handle: p.handle }));
}

const meta: Record<string, { title: string; description: string }> = {
  about: { title: "About Glea", description: "Glea makes a clip-on book light for reading in bed: a soft glow on your page while the room stays dark." },
  contact: { title: "Contact us", description: "Questions about your Glea light or an order? Write to hello@getglea.com and a real person will reply." },
  faq: { title: "FAQ", description: "Answers about the Glea clip-on book light, shipping, returns and orders." },
  "track-order": { title: "Track your order", description: "How to see where your Glea order is." },
  returns: { title: "Returns", description: "14-day returns. How to start a return with Glea." },
  "data-sharing-opt-out": { title: "Your privacy choices", description: "Opt out of data sharing for targeted advertising." },
};

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = await shopify.page(handle);
  if (!p) return {};
  const m = meta[handle] ?? { title: p.title, description: p.bodySummary || site.description };
  return { title: m.title, description: m.description, alternates: { canonical: `/pages/${handle}` } };
}

/** Strip Shopify theme-only embeds (stylesheets, scripts, app containers) from page bodies. */
const clean = (html: string) =>
  html
    .replace(/<(link|meta)[^>]*>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<div id="pc--optOutFormContainer"[\s\S]*?<\/div>/gi, "")
    .trim();

function Hero({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <section className="phero">
      <div className="container narrow">
        <span className="kicker">{kicker}</span>
        <h1 className="h1">{title}</h1>
        {sub ? <p className="lead">{sub}</p> : null}
      </div>
    </section>
  );
}

function HelpLinks() {
  const l = [
    { t: "FAQ", u: "/pages/faq" },
    { t: "Track your order", u: "/pages/track-order" },
    { t: "Returns", u: "/pages/returns" },
    { t: "Shop the light", u: "/collections/all" },
  ];
  return (
    <ul className="feat">
      {l.map((x) => <li key={x.u}><Icon name="arrow" size={18} /><Link className="link" href={x.u}>{x.t}</Link></li>)}
    </ul>
  );
}

const crumbs = (title: string, handle: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: title, item: `${site.url}/pages/${handle}` },
  ],
});

export default async function Page({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const page = await shopify.page(handle);
  if (!page) notFound();
  const body = clean(page.body);
  const hasBody = body.replace(/<[^>]+>/g, "").trim().length > 0;
  const title = meta[handle]?.title ?? page.title;

  let content: React.ReactNode;
  switch (handle) {
    case "about":
      content = (
        <>
          <section className="hero" aria-labelledby="about-title">
            <div className="hero__track">
              <div className="hero__slide is-active" style={{ minHeight: "clamp(320px, 42vw, 520px)" }}>
                <div className="hero__media"><Media slot="ABOUT-01" priority /></div>
                <div className="hero__shade" />
                <div className="container hero__content" style={{ width: "100%" }}>
                  <span className="kicker" style={{ color: "var(--glow)" }}>About Glea</span>
                  <h1 id="about-title" className="display">Soft light, after dark.</h1>
                  <p className="lead">Clip it on, switch it on, keep reading.</p>
                </div>
              </div>
            </div>
          </section>
          {hasBody ? <section className="sec"><div className="container narrow prose" dangerouslySetInnerHTML={{ __html: body }} /></section> : null}
          {[
            { s: "ABOUT-02", k: "The glow", h: "Your page, not the room", t: ["The glow lands on your page, so the room can stay dark for whoever is sleeping."] },
            { s: "ABOUT-03", k: "Pick your glow", h: "Soft when you want it", t: ["The brightness is adjustable, so you can keep it soft.", "Rechargeable, so there are no batteries to buy."] },
            { s: "ABOUT-04", k: "Six colors", h: "Six colors for six kinds of readers.", t: ["Black, Amber, Pink, Purple, Lake Blue and White. Every order comes with a silicone page-follower bookmark."] },
          ].map((b, i) => (
            <section className={`sec${i % 2 ? " sec--tint" : ""}`} key={b.s}>
              <div className={`container split${i % 2 ? " split--flip" : ""}`}>
                <div className="frame ratio-32"><Media slot={b.s as "ABOUT-02"} sizes="(min-width: 900px) 50vw, 100vw" /></div>
                <div>
                  <span className="kicker">{b.k}</span>
                  <h2 className="h2" style={{ margin: "10px 0 16px" }}>{b.h}</h2>
                  {b.t.map((x) => <p className="lead" key={x} style={{ marginTop: 8 }}>{x}</p>)}
                  {i === 2 ? <Link className="btn btn--primary" style={{ marginTop: 24 }} href="/collections/all">See the colors</Link> : null}
                </div>
              </div>
            </section>
          ))}
          <section className="sec sec--white">
            <div className="container">
              <div className="grid grid-3">
                {benefits.filter((b) => b.title !== "Your page, not the room").map((b) => <div className="card" key={b.title}><h3 className="h3" style={{ marginTop: 0 }}>{b.title}</h3><p className="muted">{b.text}</p></div>)}
              </div>
              <div style={{ marginTop: 32 }}><AiNote /></div>
            </div>
          </section>
        </>
      );
      break;
    case "contact":
      content = (
        <>
          <Hero kicker="Help" title="Contact us" sub="Questions about your light or an order? A real person will reply." />
          <section className="sec sec--tight">
            <div className="container split" style={{ alignItems: "start" }}>
              <div className="card">
                <h2 className="h3" style={{ marginTop: 0, marginBottom: 8 }}>Get in touch</h2>
                <p className="muted" style={{ marginBottom: 20 }}>Ordered already? Add your order number so we can find it fast.</p>
                <MailForm topic="Question" />
              </div>
              <div>
                <h2 className="h3">Email</h2>
                <p><a className="link" href={`mailto:${site.email}`}>{site.email}</a></p>
                <h2 className="h3" style={{ marginTop: 28 }}>Quick answers</h2>
                <HelpLinks />
                {hasBody ? <div className="prose" style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: body }} /> : null}
              </div>
            </div>
          </section>
        </>
      );
      break;
    case "faq": {
      const list = known(faqs);
      content = (
        <>
          <Hero kicker="Help" title="Questions, answered" sub="Colors, the clip, shipping, returns and more." />
          <section className="sec sec--tight">
            <div className="container narrow">
              <FaqTabs topics={topics.filter((t) => list.some((f) => f.topic === t.id))} faqs={list} />
              <div className="notice" style={{ marginTop: 32 }}>Still have a question? Write to <a className="link" href={`mailto:${site.email}`}>{site.email}</a> and a real person will reply.</div>
            </div>
          </section>
          <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
        </>
      );
      break;
    }
    case "track-order":
      content = (
        <>
          <Hero kicker="Help" title="Track your order" sub="Here is how to see where your Glea is." />
          <section className="sec sec--tight">
            <div className="container">
              <div className="grid grid-2">
                <div className="card"><span className="num">01</span><h2 className="h3">Open your order email</h2><p className="muted">Your order confirmation email has a link to your order status page, with tracking once it ships.</p></div>
                <div className="card"><span className="num">02</span><h2 className="h3">Ask us</h2><p className="muted">Send the form below with your order number and a real person will reply.</p></div>
              </div>
              <div className="card" style={{ marginTop: 28, maxWidth: 780 }}>
                <h2 className="h3" style={{ marginTop: 0, marginBottom: 8 }}>Ask about an order</h2>
                <p className="muted" style={{ marginBottom: 20 }}>Add your order number, for example #1001, so we can find it fast.</p>
                <MailForm topic="Track order" order="required" msgLabel="How can we help?" />
              </div>
            </div>
          </section>
        </>
      );
      break;
    case "returns": {
      const refund = (await shopify.policies()).find((p) => p.handle === "refund-policy");
      content = (
        <>
          <Hero kicker="Help" title="Returns" sub={`${site.returnDays}-day returns. See our refund policy for the details.`} />
          <section className="sec sec--tight">
            <div className="container">
              <div className="grid grid-3">
                <div className="card"><Icon name="return" /><h2 className="h3">{site.returnDays}-day returns</h2><p className="muted">See our <Link className="link" href="/policies/refund-policy">refund policy</Link> for the details.</p></div>
                <div className="card"><Icon name="mail" /><h2 className="h3">A real person replies</h2><p className="muted">Write to <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.</p></div>
                <div className="card"><Icon name="truck" /><h2 className="h3">Free US shipping over ${site.freeShippingThreshold}</h2><p className="muted">Questions about delivery? The <Link className="link" href="/pages/faq">FAQ</Link> has answers.</p></div>
              </div>
            </div>
          </section>
          <section className="sec sec--tint">
            <div className="container narrow">
              <h2 className="h2">How to start a return</h2>
              <p className="lead" style={{ marginTop: 12 }}>Email <a className="link" href={`mailto:${site.email}?subject=Return`}>{site.email}</a> with your order number, or use the <Link className="link" href="/pages/contact">contact form</Link>. We confirm the details by email.</p>
              {refund ? <div className="card prose" style={{ marginTop: 28 }}><h3 style={{ marginTop: 0 }}>Refund policy</h3><div dangerouslySetInnerHTML={{ __html: refund.body }} /></div> : null}
            </div>
          </section>
        </>
      );
      break;
    }
    default:
      content = (
        <>
          <Hero kicker="Glea" title={title} />
          <section className="sec sec--tight">
            <div className="container narrow">
              {hasBody ? <div className="prose" dangerouslySetInnerHTML={{ __html: body }} /> : <p className="muted">This page is being written.</p>}
              {handle === "data-sharing-opt-out" ? <OptOut /> : null}
            </div>
          </section>
        </>
      );
  }
  return (
    <>
      {handle !== "about" ? (
        <div className="container"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav></div>
      ) : null}
      {content}
      <JsonLd data={crumbs(title, handle)} />
    </>
  );
}
