import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Previews stay out of search engines until NEXT_PUBLIC_ALLOW_INDEX=true on the production domain. */
export default function robots(): MetadataRoute.Robots {
  if (!site.allowIndex) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/search", "/api/"] }], sitemap: `${site.url}/sitemap.xml`, host: site.url };
}
