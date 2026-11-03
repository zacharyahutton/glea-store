import Link from "next/link";
import type { MenuItem, Policy } from "@/lib/shopify/types";
import { site } from "@/lib/site";
import { Icon } from "../ui/Icon";
import { FooterSignup } from "./FooterSignup";
import { ConsentLink } from "./ConsentLink";

export function Footer({ shop, help, policies }: { shop: MenuItem[]; help: MenuItem[]; policies: Policy[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" className="logo"><span className="logo__dot" aria-hidden="true" />glea</Link>
            <p className="muted" style={{ marginTop: 14, maxWidth: "38ch" }}>A clip-on book light for reading in bed. Your page glows. The room stays dark.</p>
            <h2 style={{ marginTop: 28 }}>Join the night readers</h2>
            <p className="muted small">New colors and reading notes, now and then. No spam.</p>
            <FooterSignup />
          </div>
          <div>
            <h2>Shop</h2>
            <ul>{shop.map((m) => <li key={m.title}><Link href={m.url}>{m.title}</Link></li>)}</ul>
          </div>
          <div>
            <h2>Help</h2>
            <ul>
              {help.map((m) => <li key={m.title}><Link href={m.url}>{m.title}</Link></li>)}
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            </ul>
          </div>
          <div>
            <h2>Policies</h2>
            <ul>
              {policies.map((p) => <li key={p.handle}><Link href={`/policies/${p.handle}`}>{p.title}</Link></li>)}
              <li><Link href="/pages/data-sharing-opt-out">Your privacy choices</Link></li>
              <li><ConsentLink /></li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <p>© {year} Glea. Checkout is powered by Shopify.</p>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <Icon name="instagram" size={18} /> Instagram {site.instagramHandle}
          </a>
        </div>
      </div>
    </footer>
  );
}
