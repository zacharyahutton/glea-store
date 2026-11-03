import { storefront } from "./client";
import * as Q from "./queries";
import { normalizeMenuItems, normalizeProduct } from "./normalize";
import type { Article, Blog, Collection, Menu, Page, Policy, Product, Shop } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const live = {
  shop: async (): Promise<Shop> => {
    const d = await storefront<any>(Q.POLICIES_QUERY, {}, { tags: ["shop"] });
    return { name: d.shop.name, email: "hello@getglea.com", currencyCode: "USD", primaryDomain: d.shop.primaryDomain };
  },
  product: async (handle: string): Promise<Product | null> => {
    const d = await storefront<any>(Q.PRODUCT_QUERY, { handle }, { tags: ["products"] });
    return d.product ? normalizeProduct(d.product) : null;
  },
  products: async (q?: string): Promise<Product[]> => {
    const d = await storefront<any>(Q.PRODUCTS_QUERY, { first: 50, query: q || null }, { tags: ["products"] });
    return d.products.nodes.map(normalizeProduct);
  },
  collection: async (handle: string): Promise<Collection | null> => {
    if (handle === "all") {
      const products = await live.products();
      return { handle: "all", title: "Shop all", description: "", descriptionHtml: "", products };
    }
    const d = await storefront<any>(Q.COLLECTION_QUERY, { handle }, { tags: ["collections"] });
    if (!d.collection) return null;
    return { ...d.collection, products: d.collection.products.nodes.map(normalizeProduct) };
  },
  collections: async () => (await storefront<any>(Q.COLLECTIONS_QUERY, {}, { tags: ["collections"] })).collections.nodes,
  page: async (handle: string): Promise<Page | null> => (await storefront<any>(Q.PAGE_QUERY, { handle }, { tags: ["pages"] })).page,
  pages: async (): Promise<Page[]> => (await storefront<any>(Q.PAGES_QUERY, {}, { tags: ["pages"] })).pages.nodes,
  blog: async (handle: string): Promise<Blog | null> => {
    const d = await storefront<any>(Q.BLOG_QUERY, { handle }, { tags: ["blog"] });
    if (!d.blog) return null;
    return { handle: d.blog.handle, title: d.blog.title, articles: d.blog.articles.nodes.map(mapArticle) };
  },
  article: async (blog: string, handle: string): Promise<Article | null> => {
    const d = await storefront<any>(Q.ARTICLE_QUERY, { blog, handle }, { tags: ["blog"] });
    return d.blog?.articleByHandle ? mapArticle(d.blog.articleByHandle) : null;
  },
  menu: async (handle: string): Promise<Menu | null> => {
    const d = await storefront<any>(Q.MENU_QUERY, { handle }, { tags: ["menus"] });
    return d.menu ? { ...d.menu, items: normalizeMenuItems(d.menu.items) } : null;
  },
  policies: async (): Promise<Policy[]> => {
    const d = await storefront<any>(Q.POLICIES_QUERY, {}, { tags: ["policies"] });
    return [d.shop.privacyPolicy, d.shop.refundPolicy, d.shop.shippingPolicy, d.shop.termsOfService].filter(Boolean);
  },
};

function mapArticle(a: any): Article {
  return {
    handle: a.handle, title: a.title, contentHtml: a.contentHtml, excerpt: a.excerpt, publishedAt: a.publishedAt,
    tags: a.tags, image: a.image, authorName: a.authorV2?.name ?? null,
  };
}
