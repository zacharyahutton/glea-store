import type { Product, MenuItem } from "./types";

type Nodes<T> = { nodes: T[] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProduct(p: any): Product {
  return {
    ...p,
    images: (p.images as Nodes<Product["images"][number]>)?.nodes ?? [],
    variants: (p.variants as Nodes<Product["variants"][number]>)?.nodes ?? [],
  };
}

/** Storefront menu URLs are absolute. Turn store URLs into site paths. */
export function toPath(url: string): string {
  try {
    const u = new URL(url, "https://x.local");
    if (u.hostname === "x.local" || /myshopify\.com$|getglea\.com$/.test(u.hostname)) {
      return `${u.pathname}${u.hash}` || "/";
    }
    return url;
  } catch {
    return url;
  }
}

export function normalizeMenuItems(items: MenuItem[]): MenuItem[] {
  return items.map((i) => ({ title: i.title, url: toPath(i.url), items: i.items ? normalizeMenuItems(i.items) : [] }));
}
