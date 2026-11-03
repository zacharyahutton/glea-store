import Link from "next/link";
import Image from "next/image";
import type { Product, Variant } from "@/lib/shopify/types";
import { formatMoney, slugify, swatchFallback } from "@/lib/site";
import { resolveColorImages } from "@/lib/media-server";
import { Placeholder } from "../ui/Placeholder";

export const colorOf = (v: Variant) => v.selectedOptions.find((o) => o.name.toLowerCase() === "color")?.value ?? v.title;
export const swatchFor = (p: Product, c: string) =>
  p.options.find((o) => o.name.toLowerCase() === "color")?.optionValues.find((o) => o.name === c)?.swatch?.color ?? swatchFallback[c.toLowerCase()] ?? "#ccc";

/** One card per color variant. Photo comes from the variant image or /public/media/glea-color-<slug>.webp. */
export function ColorCard({ product, variant, sizes = "(min-width: 990px) 25vw, 50vw" }: { product: Product; variant: Variant; sizes?: string }) {
  const c = colorOf(variant);
  const src = variant.image?.url ?? resolveColorImages(slugify(c))[0];
  return (
    <Link className="pcard" href={`/products/${product.handle}?color=${encodeURIComponent(c)}`}>
      <div className="pcard__media">
        {src ? <Image src={src} alt={`${product.title} in ${c}`} width={800} height={1000} sizes={sizes} /> : <Placeholder label={c} color={swatchFor(product, c)} />}
      </div>
      <div>
        <div className="pcard__row">
          <span className="pcard__title">{product.title.replace(/ Clip-On.*$/i, "")} · {c}</span>
        </div>
        <div className="pcard__row">
          <span className="small muted"><span className="pcard__sw" style={{ background: swatchFor(product, c) }} aria-hidden="true" />{c}</span>
          <span style={{ fontWeight: 600 }}>{variant.availableForSale ? formatMoney(variant.price.amount) : "Sold out"}</span>
        </div>
      </div>
    </Link>
  );
}
