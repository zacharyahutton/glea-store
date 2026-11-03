import { isLive } from "./config";
import { fixture } from "./fixture";
import { live } from "./live";

/**
 * Data source. Switches to the live Storefront API automatically when
 * NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN is set. If a live call fails, it falls back to the fixture so pages still render.
 */
type Api = typeof fixture;
const safe = <K extends keyof Api>(k: K): Api[K] =>
  (async (...args: unknown[]) => {
    if (!isLive) return (fixture[k] as (...a: unknown[]) => unknown)(...args);
    try {
      return await (live[k] as (...a: unknown[]) => unknown)(...args);
    } catch (e) {
      console.warn(`[shopify] live ${String(k)} failed, using fixture:`, (e as Error).message);
      return (fixture[k] as (...a: unknown[]) => unknown)(...args);
    }
  }) as Api[K];

export const shopify: Api = {
  shop: safe("shop"),
  product: safe("product"),
  products: safe("products"),
  collection: safe("collection"),
  collections: safe("collections"),
  page: safe("page"),
  pages: safe("pages"),
  blog: safe("blog"),
  article: safe("article"),
  menu: safe("menu"),
  policies: safe("policies"),
};

export { isLive };
export * from "./types";
