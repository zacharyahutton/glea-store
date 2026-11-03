"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../cart/CartProvider";
import { Icon } from "../ui/Icon";
import type { MenuItem } from "@/lib/shopify/types";

export function Header({ menu, help }: { menu: MenuItem[]; help: MenuItem[] }) {
  const { cart, setOpen } = useCart();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
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

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header__in">
          <div className="header__left">
            <button className="icon-btn menu-btn" aria-label="Open menu" aria-expanded={navOpen} aria-controls="mobile-nav" onClick={() => setNav(true)}>
              <Icon name="menu" />
            </button>
            <Link href="/" className="logo" aria-label="Glea home">
              <span className="logo__dot" aria-hidden="true" />
              glea
            </Link>
          </div>
          <nav className="nav" aria-label="Main">
            {menu.map((m) => (
              <Link key={m.title} href={m.url} aria-current={isCurrent(m.url)}>{m.title}</Link>
            ))}
          </nav>
          <div className="header__icons">
            <Link href="/search" className="icon-btn" aria-label="Search"><Icon name="search" /></Link>
            <button className="icon-btn" aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`} onClick={() => setOpen(true)}>
              <Icon name="cart" />
              {count > 0 ? <span className="badge" aria-hidden="true">{count}</span> : null}
            </button>
          </div>
        </div>
      </header>
      <div className={`scrim${navOpen ? " is-open" : ""}`} onClick={() => setNav(false)} aria-hidden="true" />
      <div id="mobile-nav" className={`drawer drawer--left${navOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!navOpen} inert={!navOpen}>
        <div className="drawer__head">
          <Link href="/" className="logo" onClick={() => setNav(false)}><span className="logo__dot" aria-hidden="true" />glea</Link>
          <button ref={closeRef} className="icon-btn" aria-label="Close menu" onClick={() => setNav(false)}><Icon name="close" /></button>
        </div>
        <div className="drawer__body">
          <nav className="drawer-nav" aria-label="Mobile">
            {menu.map((m) => (
              <Link key={m.title} href={m.url} onClick={() => setNav(false)}>{m.title}</Link>
            ))}
          </nav>
          <div className="drawer-nav__sub">
            {help.map((m) => (
              <Link key={m.title} href={m.url} onClick={() => setNav(false)}>{m.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
