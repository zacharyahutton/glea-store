import Link from "next/link";
import Image from "next/image";
import type { Product, Variant } from "@/lib/shopify/types";
import { formatMoney, slugify, swatchFallback } from "@/lib/site";
import { resolveCardImage } from "@/lib/media-server";
import { Placeholder } from "../ui/Placeholder";

export const colorOf = (v: Variant) => v.selectedOptions.find((o) => o.name.toLowerCase() === "color")?.value ?? v.title;
export const swatchFor = (p: Product, c: string) =>
  p.options.find((o) => o.name.toLowerCase() === "color")?.optionValues.find((o) => o.name === c)?.swatch?.color ?? swatchFallback[c.toLowerCase()] ?? "#ccc";

/**
 * Loftie-layout product card: square image on a soft stage, serif title, price, then a small "View" link.
 * Image: /public/media/glea-card-<slug>.(webp|png) (T-047), else the color photo, else the Shopify variant image.
 * No star ratings until real reviews exist.
 */
export function ColorCard({ product, variant, sizes = "(min-width: 1000px) 25vw, 50vw" }: { product: Product; variant: Variant; sizes?: string }) {
  const c = colorOf(variant);
  const src = resolveCardImage(slugify(c)) ?? variant.image?.url;
  const name = product.title.replace(/ Clip-On.*$/i, "");
  return (
    <Link className="lf-card" href={`/products/${product.handle}?color=${encodeURIComponent(c)}`}>
      <div className="lf-card__img lf-zoom">
        {src ? <Image src={src} alt={`${product.title} in ${c}`} width={1100} height={1100} sizes={sizes} className={/glea-(cut|card)-/.test(src) ? "is-cut" : undefined} /> : <Placeholder label={c} color={swatchFor(product, c)} />}
      </div>
      <h3 className="lf-card__t">{name} · {c}</h3>
      <p className="lf-card__m"><span className="lf-card__sw" style={{ background: swatchFor(product, c) }} aria-hidden="true" />{variant.availableForSale ? formatMoney(variant.price.amount) : "Sold out"}</p>
      <span className="lf-card__v">View</span>
    </Link>
  );
}
