"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Product, Variant } from "@/lib/shopify/types";
import { useCart } from "../cart/CartProvider";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";
import { formatMoney, site, swatchFallback, slugify } from "@/lib/site";
import { track } from "@/lib/analytics";

export type Slide = { src: string; alt: string; w: number; h: number; note?: string } | { placeholder: true; label: string; color?: string };
export type ColorMedia = Record<string, { src: string; alt: string; w: number; h: number }[]>;

const colorOf = (v: Variant) => v.selectedOptions.find((o) => o.name.toLowerCase() === "color")?.value ?? v.title;

export function ProductView({ product, shared, colorMedia, initialColor, bundleImg, children }: {
  product: Product; shared: Slide[]; colorMedia: ColorMedia; initialColor?: string; bundleImg?: React.ReactNode; children?: React.ReactNode;
}) {
  const { add, busy } = useCart();
  const colorOpt = product.options.find((o) => o.name.toLowerCase() === "color");
  const findVariant = (c?: string) => product.variants.find((v) => c && colorOf(v).toLowerCase() === c.toLowerCase());
  const [variant, setVariant] = useState<Variant>(findVariant(initialColor) ?? product.variants.find((v) => v.availableForSale) ?? product.variants[0]);
  const [qty, setQty] = useState(1);
  const color = colorOf(variant);
  const swatchColor = (name: string) =>
    colorOpt?.optionValues.find((o) => o.name === name)?.swatch?.color ?? swatchFallback[name.toLowerCase()] ?? "#ccc";

  // Slides: the selected color's photos (or a tinted placeholder until they exist), then shared gallery photos.
  const slides: Slide[] = useMemo(() => {
    const own = colorMedia[slugify(color)] ?? [];
    const variantImg = variant.image ? [{ src: variant.image.url, alt: variant.image.altText ?? `${product.title} in ${color}`, w: variant.image.width ?? 1200, h: variant.image.height ?? 1200 }] : [];
    const first: Slide[] = own.length ? own : variantImg.length ? variantImg : [{ placeholder: true, label: `${color}`, color: swatchColor(color) }];
    return [...first, ...shared];
  }, [color, colorMedia, shared, variant.image, product.title]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  // Scroll-snap gallery: dots/arrows scroll the track; scrolling updates the active dot.
  const go = useCallback((n: number) => {
    const t = trackRef.current;
    const k = (n + slides.length) % slides.length;
    setIdx(k);
    if (!t) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollTo({ left: k * t.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }, [slides.length]);
  const onScroll = () => {
    const t = trackRef.current;
    if (t && t.clientWidth) setIdx(Math.round(t.scrollLeft / t.clientWidth));
  };
  const toStart = () => { setIdx(0); if (trackRef.current) trackRef.current.scrollLeft = 0; };

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("color");
    const v = findVariant(c ?? undefined);
    if (v && v.id !== variant.id) { setVariant(v); toStart(); }
    else if (v) toStart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    track("view_item", { value: parseFloat(variant.price.amount), items: [{ item_id: variant.id.split("/").pop()!, item_name: product.title, item_variant: color, price: parseFloat(variant.price.amount), quantity: 1 }] });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (v: Variant) => {
    setVariant(v);
    toStart();
    const u = new URL(window.location.href);
    u.searchParams.set("color", colorOf(v));
    window.history.replaceState(null, "", u);
  };

  const addItems = (quantity: number) =>
    add([{ merchandiseId: variant.id, quantity, meta: { title: variant.title, productTitle: product.title, handle: product.handle, image: variant.image, price: variant.price, selectedOptions: variant.selectedOptions } }]);

  // Sticky add to cart shows once the main button scrolls out of view.
  const buyRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.body.classList.toggle("has-sticky", sticky);
    return () => document.body.classList.remove("has-sticky");
  }, [sticky]);

  const price = formatMoney(variant.price.amount);
  const soldOut = !variant.availableForSale;
  const trust = [
    { icon: "truck", t: `Free shipping over $${site.freeShippingThreshold}` },
    { icon: "return", t: `${site.returnDays}-day returns` },
    { icon: "battery", t: "Rechargeable" },
    { icon: "palette", t: "6 colors" },
  ];

  const swatchButtons = (small?: boolean) => product.variants.map((v) => {
    const c = colorOf(v);
    return (
      <button key={v.id} type="button" role="radio" aria-checked={v.id === variant.id} aria-label={`${c}${v.availableForSale ? "" : ", sold out"}`} aria-disabled={!v.availableForSale}
        className={small ? "lf-sw lf-sw--sm" : "lf-sw"} onClick={() => pick(v)} title={c}>
        <span style={{ background: swatchColor(c) }} />
      </button>
    );
  });

  return (
    <>
      <div className="lf-pdp">
        <div className="lf-gal" aria-roledescription="carousel" aria-label="Product photos">
          <div className="lf-gal__track" ref={trackRef} onScroll={onScroll} key={color}>
            {slides.map((s, i) => (
              <div className="lf-gal__slide" key={i} aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
                {"placeholder" in s ? (
                  <Placeholder label={`${s.label}`} color={s.color} note="Color photo coming soon" />
                ) : (
                  <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 1000px) 50vw, 100vw" priority={i === 0} loading={i === 0 ? undefined : "lazy"} className={/glea-(cut|macro)-/.test(s.src) ? "is-cut" : undefined} />
                )}
                {!("placeholder" in s) && s.note ? <span className="gal__note">{s.note}</span> : null}
              </div>
            ))}
          </div>
          {slides.length > 1 ? (
            <>
              <button className="lf-gal__nav lf-gal__nav--prev" aria-label="Previous photo" onClick={() => go(idx - 1)}><Icon name="left" size={18} /></button>
              <button className="lf-gal__nav lf-gal__nav--next" aria-label="Next photo" onClick={() => go(idx + 1)}><Icon name="right" size={18} /></button>
              <div className="lf-gal__dots">
                {slides.map((_, i) => (
                  <button key={i} className="lf-gal__dot" aria-current={i === idx} aria-label={`Show photo ${i + 1}`} onClick={() => go(i)} />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="pdp__info lf-buy">
          <h1 className="lf-buy__t">{product.title}</h1>
          <p className="lf-buy__sub">Soft light, after dark. A warm glow on your page, so the room stays dark.</p>
          <div className="lf-buy__price">
            <span>{price}</span>
            {variant.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) ? <s>{formatMoney(variant.compareAtPrice.amount)}</s> : null}
          </div>

          {colorOpt ? (
            <>
              <p className="lf-buy__opt" id="color-label">{color}{soldOut ? <span className="lf-buy__warn"> Sold out</span> : null}</p>
              <div className="lf-sws" role="radiogroup" aria-labelledby="color-label">{swatchButtons()}</div>
            </>
          ) : null}

          <div className="lf-buy__row" ref={buyRef}>
            <label className="sr-only" htmlFor="pdp-qty">Quantity</label>
            <select id="pdp-qty" className="lf-qty" value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)}>
              {Array.from({ length: 10 }, (_, n) => <option key={n} value={n + 1}>{n + 1}</option>)}
            </select>
            <button className="btn btn--primary btn--block lf-atc" disabled={busy || soldOut} onClick={() => addItems(qty)}>
              {soldOut ? "Sold out" : "Add to cart"}
            </button>
          </div>

          <div className={`lf-bundle${bundleImg ? " has-img" : ""}`}>
            {bundleImg && <div className="lf-bundle__img">{bundleImg}</div>}
            <p className="lf-bundle__k">Buy 2, save ${site.bundle.save}</p>
            <p className="lf-bundle__t">One for you, one for a reader you love.</p>
            <div className="lf-bundle__dots" aria-hidden="true">{product.variants.map((v) => <span key={v.id} style={{ background: swatchColor(colorOf(v)) }} />)}</div>
            <p className="lf-bundle__s">The discount comes off at checkout.</p>
            <button type="button" className="lnk lf-bundle__a" disabled={busy || soldOut} onClick={() => addItems(2)}>Add 2 in {color} <span aria-hidden="true">→</span></button>
          </div>

          <ul className="lf-trust">
            {trust.map((t) => <li key={t.t}><Icon name={t.icon} size={20} />{t.t}</li>)}
          </ul>
          {children}
        </div>
      </div>

      <div className={`lf-sticky${sticky ? " is-visible" : ""}`} aria-hidden={!sticky} inert={!sticky}>
        <div className="lf-sticky__in">
          <div className="lf-sticky__info">
            <p className="lf-sticky__t">{product.title}</p>
            <p className="lf-sticky__p">{color} · {price}</p>
          </div>
          <div className="lf-sticky__sws" role="radiogroup" aria-label="Color">{swatchButtons(true)}</div>
          <button className="btn btn--primary" disabled={busy || soldOut} onClick={() => addItems(1)}>
            {soldOut ? "Sold out" : `Add to cart · ${price}`}
          </button>
        </div>
      </div>
    </>
  );
}
