import type { NextConfig } from "next";

const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEX === "true";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    if (!allowIndex) base.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    return [{ source: "/:path*", headers: base }];
  },
  async redirects() {
    return [
      { source: "/journal", destination: "/blogs/news", permanent: false },
      { source: "/shop", destination: "/collections/all", permanent: false },
      { source: "/pages/contact-1", destination: "/pages/contact", permanent: true },
    ];
  },
};

export default nextConfig;
