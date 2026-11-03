"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Product, Variant } from "@/lib/shopify/types";
import { useCart } from "../cart/CartProvider";
import { Icon } from "../ui/Icon";
import { Placeholder } from "../ui/Placeholder";
import { formatMoney, site, swatchFallback, slugify } from "@/lib/site";
import { track } from "@/lib/analytics";

export type Slide = { src: string; alt: string; w: number; h: number } | { placeholder: true; label: string; color?: string };
export type ColorMedia = Record<string, { src: string; alt: string; w: number; h: number }[]>;

const colorOf = (v: Variant) => v.selectedOptions.find((o) => o.name.toLowerCase() === "color")?.value ?? v.title;

export function ProductView({ product, shared, colorMedia, initialColor, children }: {
  product: Product; shared: Slide[]; colorMedia: ColorMedia; initialColor?: string; children?: React.ReactNode;
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
  const hasOwn = !("placeholder" in slides[0]);
  const [idx, setIdx] = useState(initialColor || hasOwn ? 0 : Math.min(1, slides.length - 1));
  const go = useCallback((n: number) => setIdx((n + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("color");
    const v = findVariant(c ?? undefined);
    if (v && v.id !== variant.id) { setVariant(v); setIdx(0); }
    else if (v) setIdx(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    track("view_item", { value: parseFloat(variant.price.amount), items: [{ item_id: variant.id.split("/").pop()!, item_name: product.title, item_variant: color, price: parseFloat(variant.price.amount), quantity: 1 }] });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (v: Variant) => {
    setVariant(v);
    setIdx(0);
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

  const touch = useRef<number | null>(null);
  const slide = slides[idx] ?? slides[0];
  const price = formatMoney(variant.price.amount);
  const soldOut = !variant.availableForSale;

  return (
    <>
      <div className="pdp">
        <div className="gal" aria-roledescription="carousel" aria-label="Product photos">
          <div
            className="gal__main"
            onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touch.current == null) return;
              const dx = e.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
              touch.current = null;
            }}
          >
            {"placeholder" in slide ? (
              <Placeholder label={`${slide.label}`} color={slide.color} note="Color photo coming soon" />
            ) : (
              <Image src={slide.src} alt={slide.alt} width={slide.w} height={slide.h} sizes="(min-width: 990px) 55vw, 100vw" priority={idx <= 1} />
            )}
            {slides.length > 1 ? (
              <>
                <button className="gal__nav gal__nav--prev" aria-label="Previous photo" onClick={() => go(idx - 1)}><Icon name="left" size={20} /></button>
                <button className="gal__nav gal__nav--next" aria-label="Next photo" onClick={() => go(idx + 1)}><Icon name="right" size={20} /></button>
                <span className="gal__count" aria-live="polite">{idx + 1} / {slides.length}</span>
              </>
            ) : null}
          </div>
          <div className="gal__thumbs" role="list">
            {slides.map((s, i) => (
              <button key={i} role="listitem" className="gal__thumb" aria-current={i === idx} aria-label={`Show photo ${i + 1}`} onClick={() => setIdx(i)}>
                {"placeholder" in s ? <Placeholder color={s.color} note={null} /> : <Image src={s.src} alt="" width={144} height={144} sizes="72px" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pdp__info">
          <span className="kicker">Clip-on book light</span>
          <h1 className="h1 pdp__title">{product.title}</h1>
          <div className="price">
            <span>{price}</span>
            {variant.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) ? <s>{formatMoney(variant.compareAtPrice.amount)}</s> : null}
          </div>
          <p className="small muted" style={{ marginTop: 6 }}>Free US shipping on orders over ${site.freeShippingThreshold}.</p>

          {colorOpt ? (
            <>
              <p className="opt-label" id="color-label">Color: <strong>{color}</strong></p>
              <div className="swatches" role="radiogroup" aria-labelledby="color-label">
                {product.variants.map((v) => {
                  const c = colorOf(v);
                  return (
                    <button key={v.id} role="radio" aria-checked={v.id === variant.id} aria-label={`${c}${v.availableForSale ? "" : ", sold out"}`} aria-disabled={!v.availableForSale} className="swatch" onClick={() => pick(v)} title={c}>
                      <span style={{ background: swatchColor(c) }} />
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          <div className="buy" ref={buyRef}>
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}><Icon name="minus" size={18} /></button>
              <input aria-label="Quantity" inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} />
              <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(20, qty + 1))}><Icon name="plus" size={18} /></button>
            </div>
            <button className="btn btn--primary btn--block" disabled={busy || soldOut} onClick={() => addItems(qty)}>
              {soldOut ? "Sold out" : `Add to cart · ${formatMoney(parseFloat(variant.price.amount) * qty)}`}
            </button>
          </div>

          <div className="bundle">
            <Icon name="gift" />
            <p><strong>Buy 2, save ${site.bundle.save}</strong>One for you, one for a reader you love. The discount comes off at checkout.</p>
            <button className="btn btn--ghost" disabled={busy || soldOut} onClick={() => addItems(2)}>Add 2</button>
          </div>
          {children}
        </div>
      </div>

      <div className={`sticky-atc${sticky ? " is-visible" : ""}`} aria-hidden={!sticky} inert={!sticky}>
        <div className="sticky-atc__in">
          <span className="sticky-atc__sw" style={{ background: swatchColor(color) }} aria-hidden="true" />
          <div className="sticky-atc__info">
            <p style={{ fontWeight: 600 }}>{product.title}</p>
            <p className="small muted">{color} · {price}</p>
          </div>
          <button className="btn btn--primary" disabled={busy || soldOut} onClick={() => addItems(1)}>
            {soldOut ? "Sold out" : `Add to cart · ${price}`}
          </button>
        </div>
      </div>
    </>
  );
}
