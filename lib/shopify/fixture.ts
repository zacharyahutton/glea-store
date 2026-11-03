import store from "./fixture/store.json";
import type { Article, Blog, Collection, Menu, Page, Policy, Product, Shop } from "./types";
import { normalizeMenuItems } from "./normalize";

/** Fixture adapter: real store data pulled with the Admin API (read only). Used when no Storefront token is set. */
const products = store.products as unknown as Product[];

export const fixture = {
  shop: async (): Promise<Shop> => store.shop as Shop,
  product: async (handle: string) => products.find((p) => p.handle === handle) ?? null,
  products: async (q?: string) =>
    q ? products.filter((p) => `${p.title} ${p.tags.join(" ")} ${p.productType}`.toLowerCase().includes(q.toLowerCase())) : products,
  collection: async (handle: string): Promise<Collection | null> => {
    if (handle === "all") return { handle: "all", title: "Shop all", description: "", descriptionHtml: "", products };
    const c = store.collections.find((x) => x.handle === handle);
    if (!c) return null;
    return { ...c, products: products.filter((p) => c.productHandles.includes(p.handle)) };
  },
  collections: async () => store.collections.map(({ handle, title, description, descriptionHtml }) => ({ handle, title, description, descriptionHtml })),
  page: async (handle: string) => (store.pages as Page[]).find((p) => p.handle === handle) ?? null,
  pages: async () => store.pages as Page[],
  blog: async (handle: string) => ((store.blogs as unknown as Blog[]).find((b) => b.handle === handle) ?? null),
  article: async (blog: string, handle: string): Promise<Article | null> =>
    ((store.blogs as unknown as Blog[]).find((b) => b.handle === blog)?.articles.find((a) => a.handle === handle) ?? null),
  menu: async (handle: string): Promise<Menu | null> => {
    const m = (store.menus as unknown as Menu[]).find((x) => x.handle === handle);
    return m ? { ...m, items: normalizeMenuItems(m.items) } : null;
  },
  policies: async () => store.policies as Policy[],
};
