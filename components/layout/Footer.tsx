import Link from "next/link";
import type { MenuItem, Policy } from "@/lib/shopify/types";
import { site } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { FooterSignup } from "./FooterSignup";
import { ConsentLink } from "./ConsentLink";

/**
 * Loftie-layout footer: a rounded dusk card inset from the page edge with two slow glow layers (9s / 13s),
 * signup on the left, Shop / Learn / Help columns, then a base row with policies and privacy controls.
 */
export function Footer({ shop, help, policies }: { shop: MenuItem[]; help: MenuItem[]; policies: Policy[] }) {
  const year = new Date().getFullYear();
  const learn = [
    { title: "How it works", url: `/products/${site.productHandle}#how-it-works` },
    { title: "About Glea", url: "/pages/about" },
    { title: "Journal", url: "/blogs/news" },
  ];
  const shopLinks = [{ title: "Shop all colors", url: "/collections/all" }, ...shop.filter((m) => !/how it works|about|faq|contact/i.test(m.title))];
  return (
    <footer className="ftr">
      <div className="ftr__card">
        <span className="ftr__glow ftr__glow--a" aria-hidden="true" />
        <span className="ftr__glow ftr__glow--b" aria-hidden="true" />
        <div className="ftr__in">
          <div className="ftr__top">
            <div className="ftr__sign">
              <Link href="/" className="logo"><span className="logo__dot" aria-hidden="true" />glea</Link>
              <h2 className="ftr__title">Soft light, <em>after dark.</em></h2>
              <p className="ftr__muted">New colors and reading notes, now and then. No spam.</p>
              <FooterSignup />
            </div>
            <div className="ftr__cols">
              <div>
                <h2>Shop</h2>
                <ul>{shopLinks.map((m) => <li key={m.title}><Link className="lnk" href={m.url}>{m.title}</Link></li>)}</ul>
              </div>
              <div>
                <h2>Learn</h2>
                <ul>{learn.map((m) => <li key={m.title}><Link className="lnk" href={m.url}>{m.title}</Link></li>)}</ul>
              </div>
              <div>
                <h2>Help</h2>
                <ul>
                  {help.map((m) => <li key={m.title}><Link className="lnk" href={m.url}>{m.title}</Link></li>)}
                  <li><a className="lnk" href={`mailto:${site.email}`}>{site.email}</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="ftr__base">
            <p>© {year} Glea. Checkout is powered by Shopify.</p>
            <ul className="ftr__legal">
              {policies.map((p) => <li key={p.handle}><Link href={`/policies/${p.handle}`}>{p.title}</Link></li>)}
              <li><Link href="/pages/data-sharing-opt-out">Your privacy choices</Link></li>
              <li><ConsentLink /></li>
            </ul>
            <a className="ftr__ig" href={site.instagram} target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" size={18} /> Instagram {site.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
