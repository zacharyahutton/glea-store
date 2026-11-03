export const site = {
  name: "Glea",
  tagline: "Clip-on book light for reading in bed",
  description:
    "Glea clips onto your book and puts a soft glow on the page, so you can keep reading while the rest of the room stays dark. Rechargeable, bendable, and made in six colors.",
  email: "hello@getglea.com",
  instagram: "https://www.instagram.com/getglea/",
  instagramHandle: "@getglea",
  productHandle: "glea-clip-on-book-reading-light",
  freeShippingThreshold: 45,
  flatShipping: 4.99,
  bundle: { qty: 2, save: 5 },
  returnDays: 14,
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  allowIndex: process.env.NEXT_PUBLIC_ALLOW_INDEX === "true",
};

/** Swatch colors used until Shopify color swatches are set on the Color option. */
export const swatchFallback: Record<string, string> = {
  black: "#1C1D22",
  amber: "#D98E2B",
  pink: "#EBA9BC",
  purple: "#8C70B4",
  "lake blue": "#6AA6C8",
  white: "#F7F3EA",
};

export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function formatMoney(amount: string | number, currency = "USD") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}
