import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Marquee } from "@/components/home/Showcase";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";
import "./globals.css";
import { shopify } from "@/lib/shopify";
import { site } from "@/lib/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/layout/Analytics";
import { Popup } from "@/components/layout/Popup";
import { Chat } from "@/components/layout/Chat";
import { JsonLd } from "@/components/ui/JsonLd";
import { resolveSlot } from "@/lib/media-server";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
// Two static weights only (300 display, 500 headings); no extra axes, to keep the above-the-fold font small.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", weight: ["300", "500"], style: ["normal"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  robots: site.allowIndex ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: "website", siteName: site.name, images: [{ url: "/media/glea-og.jpg", width: 1200, height: 630, alt: "Glea clip-on book reading light" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#fbf3e4", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [main, help, policies] = await Promise.all([shopify.menu("main-menu"), shopify.menu("help"), shopify.policies()]);
  const popupImg = resolveSlot("POPUP") ?? resolveSlot("TILE-01");
  const shopLinks = [
    { title: "The reading light", url: `/products/${site.productHandle}` },
    { title: "All colors", url: "/collections/all" },
    { title: "How it works", url: `/products/${site.productHandle}#how-it-works` },
    { title: "Search", url: "/search" },
  ];
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <CartProvider>
          <Marquee />
          <Header menu={main?.items ?? []} help={help?.items ?? []} />
          <main id="main">{children}</main>
          <Footer shop={shopLinks} help={help?.items ?? []} policies={policies} />
          <CartDrawer />
          <Popup image={popupImg ? { src: popupImg.src, alt: popupImg.alt, w: popupImg.w, h: popupImg.h } : null} />
          <Chat />
          <Analytics />
          <Reveal />
        </CartProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/favicon.svg`,
            email: site.email,
            sameAs: [site.instagram],
          }}
        />
      </body>
    </html>
  );
}
