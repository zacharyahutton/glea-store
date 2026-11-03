"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../cart/CartProvider";
import { Icon } from "../ui/Icon";
import type { MenuItem } from "@/lib/shopify/types";
import { site } from "@/lib/site";

/** Main links, Loftie-style: four plain links, the first one highlighted. No mega menu (Loftie has none). */
export const navLinks = [
  { title: "Shop all colors", url: "/collections/all", hi: true },
  { title: "The light", url: `/products/${site.productHandle}` },
  { title: "How it works", url: `/products/${site.productHandle}#how-it-works` },
  { title: "Help", url: "/pages/faq" },
];

/**
 * Sticky header under the announcement bar (T-051, measured on loftie.com at 1440 and 390).
 * - Home, near the top: a see-through glass capsule over the hero (faint dark tint, 12px blur, thin cream border), cream text.
 * - Home, between HIDE_AT and SOLID_AT on the way back up: a light cream veil. Past SOLID_AT (and on every other page):
 *   the solid cream capsule with dark text. Color changes run .32s.
 * - Hides on scroll down past HIDE_AT, comes back on scroll up (transform .35s). Never hides while a menu or the cart is open.
 */
const HIDE_AT = 280;
const SOLID_AT = 520;
export function Header({ menu, help }: { menu: MenuItem[]; help: MenuItem[] }) {
  const { cart, setOpen, open: cartOpen } = useCart();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const path = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const hdrRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > HIDE_AT);
        setSolid(y > SOLID_AT);
        const inside = hdrRef.current?.contains(document.activeElement);
        if (y < HIDE_AT || inside) setHidden(false);
        else if (Math.abs(y - last) > 6) setHidden(y > last);
        last = y;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => { setNav(false); }, [path]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!navOpen) return;
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setNav(false);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [navOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  function setNav(v: boolean) {
    setNavOpen(v);
    document.documentElement.classList.toggle("lock", v);
  }

  const count = cart?.totalQuantity ?? 0;
  const isCurrent = (url: string) => (url.split("#")[0] === path && !url.includes("#") ? "page" : undefined);
  const home = path === "/";
  const tone = !home || solid ? "" : scrolled ? " hdr--veil" : " hdr--over";
  const extra = menu.filter((m) => !navLinks.some((n) => n.url === m.url) && !/how it works/i.test(m.title));

  return (
    <>
      <header ref={hdrRef} className={`hdr${tone}${scrolled ? " is-scrolled" : ""}${hidden && !navOpen && !cartOpen ? " is-hidden" : ""}`} onFocus={() => setHidden(false)}>
        <div className="hdr__bar">
          <div className="hdr__left">
            <button className="icon-btn menu-btn" aria-label="Open menu" aria-expanded={navOpen} aria-controls="mobile-nav" onClick={() => setNav(true)}>
              <Icon name="menu" size={19} />
            </button>
            <Link href="/search" className="icon-btn hdr__search hdr__search--m" aria-label="Search"><Icon name="search" size={19} /></Link>
            <Link href="/" className="logo" aria-label="Glea home">
              <span className="logo__dot" aria-hidden="true" />
              glea
            </Link>
            <nav className="hdr__nav" aria-label="Main">
              {navLinks.map((m) => (
                <Link key={m.title} href={m.url} className={m.hi ? "is-hi" : undefined} aria-current={isCurrent(m.url)}>{m.title}</Link>
              ))}
            </nav>
          </div>
          <div className="hdr__icons">
            <Link href="/search" className="icon-btn hdr__search hdr__search--d" aria-label="Search"><Icon name="search" size={19} /></Link>
            <button className="icon-btn hdr__cart" aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`} onClick={() => setOpen(true)}>
              <Icon name="cart" size={19} />
              {count > 0 ? <span className="badge" aria-hidden="true">{count}</span> : null}
            </button>
          </div>
        </div>
      </header>
      <div className={`scrim scrim--nav${navOpen ? " is-open" : ""}`} onClick={() => setNav(false)} aria-hidden="true" />
      <div id="mobile-nav" className={`drawer drawer--left${navOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!navOpen} inert={!navOpen}>
        <div className="drawer__head">
          <Link href="/" className="logo" onClick={() => setNav(false)}><span className="logo__dot" aria-hidden="true" />glea</Link>
          <button ref={closeRef} className="icon-btn" aria-label="Close menu" onClick={() => setNav(false)}><Icon name="close" /></button>
        </div>
        <div className="drawer__body">
          <nav className="drawer-nav" aria-label="Mobile">
            {navLinks.map((m) => (
              <Link key={m.title} href={m.url} className={m.hi ? "is-hi" : undefined} onClick={() => setNav(false)}>{m.title}</Link>
            ))}
            {extra.map((m) => (
              <Link key={m.title} href={m.url} onClick={() => setNav(false)}>{m.title}</Link>
            ))}
          </nav>
          <div className="drawer-nav__sub">
            {help.map((m) => (
              <Link key={m.title} href={m.url} onClick={() => setNav(false)}>{m.title}</Link>
            ))}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
