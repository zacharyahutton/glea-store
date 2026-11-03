import type { MetadataRoute } from "next";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, pages, policies, blog] = await Promise.all([shopify.products(), shopify.pages(), shopify.policies(), shopify.blog("news")]);
  const u = (p: string, lastModified?: string) => ({ url: `${site.url}${p}`, lastModified: lastModified ? new Date(lastModified) : undefined });
  return [
    u("/"),
    u("/collections/all"),
    ...products.map((p) => u(`/products/${p.handle}`, p.updatedAt)),
    ...pages.filter((p) => p.handle !== "contact-1").map((p) => u(`/pages/${p.handle}`, p.updatedAt)),
    ...policies.map((p) => u(`/policies/${p.handle}`)),
    u("/blogs/news"),
    ...(blog?.articles ?? []).map((a) => u(`/blogs/news/${a.handle}`, a.publishedAt)),
  ];
}
