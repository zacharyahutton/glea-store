# Glea store (headless)

Next.js 15 storefront for Glea, reading from the Shopify Storefront API (store `gjqatv-06.myshopify.com`).
Checkout stays on Shopify. The Shopify theme v2 remains the fallback and is not touched by this repo.

## Run

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Data: live Storefront API or fixture

- `lib/shopify/` holds a typed Storefront client (`live.ts`), the queries, and a fixture adapter (`fixture/store.json`).
- When `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` is empty, the site runs on the fixture automatically. When it is set, every read goes to the Storefront API with no code change.
- The fixture is a snapshot of the real store (products, variants, prices, pages, policies, blog). Refresh it with `node scripts/pull-fixture.mjs` then `node scripts/build-fixture.mjs` (needs a signed-in Shopify CLI).
- Fixture cart: kept in the browser with real variant IDs. Checkout sends the shopper to a Shopify cart permalink. Live cart: Storefront `cartCreate` / `cartLinesAdd`, then `cart.checkoutUrl`. UTM values are written to cart attributes.

## Managing content

| What | Where |
| --- | --- |
| Products, prices, colors, stock | Shopify admin. Each variant is one color; the collection page shows one card per color. |
| Product description | Shopify admin. Until it exists, a short fallback from `lib/content.ts` shows. |
| Pages (About, Contact, FAQ, Track order, Returns) | Layouts live in `app/pages/[handle]/page.tsx`. Any extra page body written in Shopify shows on that page. |
| Policies | Shopify admin, Settings > Policies. Rendered at `/policies/<handle>`. |
| Journal | Shopify blog `news`. Empty state shows until an article exists. |
| FAQ, feature copy, comparison | `lib/content.ts`. Entries whose text starts with `TODO(zach)` are hidden on the site until a confirmed fact replaces them. |

### Images: swap by file name

Every image slot is listed in `lib/media.ts`. To replace an image, drop a new file into `public/media/` with the same file name. Slots whose file is missing show a styled placeholder (or are skipped in the gallery), so adding these files makes them appear with no code change:

- `glea-gal-03.webp`, `glea-gal-04.webp`, `glea-gal-06.webp` (product gallery 2048x2194)
- `glea-popup.webp` (popup 900x1100, falls back to the bedroom tile)
- `glea-color-<color>.webp`, for example `glea-color-lake-blue.webp` (per-color product photos; extra shots as `-2`, `-3`). When the Shopify variant has an image, that image wins.

Lifestyle photos on this site are AI-generated and labeled as such in the footer note on each page that uses them.

## Popup

`components/layout/Popup.tsx`. Shows once per 14 days, after the cookie choice, never on the cart. Email sign-up calls `/api/subscribe`, which runs Storefront `customerCreate` with `acceptsMarketing: true` and an explicit consent checkbox. With no token it answers "Sign-up is not connected in this preview yet."
No discount is offered unless both `NEXT_PUBLIC_POPUP_OFFER_CODE` and `NEXT_PUBLIC_POPUP_OFFER_TEXT` are set, and they should only be set once the code exists in Shopify.

## Chat

`components/layout/Chat.tsx` is a small rule-based helper (no third party, no cost, no data leaves the browser). It is labeled automated, answers from the same FAQ content, and hands anything else to `hello@getglea.com`. Questions about unconfirmed specs (battery life, charge time, brightness, delivery times) get "not confirmed yet" and the email link, never a guessed answer.

## Analytics and consent

`components/layout/Analytics.tsx` and `lib/analytics/index.ts`.

- Consent banner: Accept all / Analytics only / Necessary only. Stored in `localStorage` (`glea_consent_v1`). Footer "Cookie settings" reopens it. Browsers that send Global Privacy Control never get marketing pixels.
- Vercel Analytics: cookieless, loads only when deployed on Vercel.
- GA4: loads with Consent Mode v2, default denied, updated from the banner.
- Meta Pixel and TikTok Pixel: load only after marketing consent.
- Events: `view_item`, `add_to_cart`, `begin_checkout`, `view_cart`, `search`, `sign_up`, `generate_lead`. Add `?debug_analytics=1` to any URL to log them in the console; they are also kept in `window.gleaEvents`.
- UTM, gclid, fbclid and ttclid are captured on landing (first and last touch) and passed to the Shopify cart as attributes.

IDs go in env vars only. Store them in Bitwarden as `Glea - <Service> <type>`, for example `Glea - GA4 Measurement ID`, `Glea - Meta Pixel ID`, `Glea - TikTok Pixel ID`, `Glea - Shopify Storefront API token`.

| Env var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `gjqatv-06.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Headless channel public token. Empty = fixture. |
| `NEXT_PUBLIC_SHOPIFY_API_VERSION` | `2026-10` |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL |
| `NEXT_PUBLIC_ALLOW_INDEX` | `false` until launch (noindex header, meta and robots) |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Analytics, optional |
| `NEXT_PUBLIC_POPUP_OFFER_CODE`, `NEXT_PUBLIC_POPUP_OFFER_TEXT` | Popup offer, only with a real code |

## SEO

Per-page metadata and canonical URLs, Open Graph image, `sitemap.xml`, `robots.txt`, and JSON-LD: Organization (all pages), WebSite (home), Product with per-color offers, BreadcrumbList, FAQPage, ItemList (collection), Article (journal posts). No ratings markup: there are no reviews yet. While `NEXT_PUBLIC_ALLOW_INDEX` is not `true`, every response carries `X-Robots-Tag: noindex, nofollow` and robots disallows everything.

## QA

```bash
PORT=3100 npm start &
python3 qa/qa.py http://localhost:3100   # overflow, console errors, JSON-LD, analytics flow at 1280/390/360
```

Lighthouse results from the last run are in `qa/lighthouse/`.

## Deploy (Vercel preview)

1. Vercel Hobby project `glea-store`, import this repo.
2. Set the env vars above (token from Bitwarden; never paste it in chat). Keep `NEXT_PUBLIC_ALLOW_INDEX=false`.
3. Deploy as a preview. Do not attach a domain until launch is approved.

Before launch: turn off the Shopify storefront password (it blocks checkout), confirm payments in a test order, set `NEXT_PUBLIC_ALLOW_INDEX=true` and `NEXT_PUBLIC_SITE_URL` on the production domain.
