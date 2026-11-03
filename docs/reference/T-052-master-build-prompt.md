# Glea storefront: master build prompt (Loftie-style rebuild)

Paste this whole file into Claude as the first message, with the repo open. It is self-contained. Version: T-052, 3 Nov 2026. Measurements were taken on live loftie.com on 3 Nov 2026 with Playwright (Chromium, 1440x900 and 390x844) using getComputedStyle.

---

## 0. Your role and the one hard rule

You are the front-end engineer on the Glea storefront. Your job: make the Glea site feel and move like loftie.com (layout rhythm, section order, interactions, timing, easing), while staying 100% Glea.

**Recreate, never copy.** Do not copy Loftie's HTML, CSS, JavaScript, images, video, fonts, icons, copy, product names, claims or brand. Measure what you see (sizes, timing, easing, order) and write your own code and your own words. Loftie is a reference for structure and motion only.

---

## 1. Goal and brand

- Product: Glea clip-on book reading light. One product, 6 colors.
- Tagline: **"Soft light, after dark."**
- Palette:
  - cream (page) `#fbf3e4`, warm cream text on dark `#fbf7ed`;
  - deep navy (headings, announcement bar, dark buttons) `#1e2433`, ink (body text) `#14161f`;
  - warm amber (glow accent) `#f4a949`; amber ink for text on cream `#8a4b0c` (AA);
  - border `#e2d8c4`.
- Fonts (free stand-ins for Loftie's licensed fonts), via `next/font/google`:
  - **Newsreader** 400 and 400 italic for headings;
  - **DM Sans** for body and UI.
- Voice: calm, plain, short. One italic second line per page at most.

---

## 2. Stack and where things live

- Next.js 15 App Router, TypeScript, React 19, plain CSS (`app/globals.css`, `app/shell.css`), `next/image`, sharp and ffmpeg for media scripts. No animation library: CSS transitions plus small hooks.
- Shopify Storefront API (headless). Checkout is Shopify's hosted checkout via the cart `checkoutUrl`.
- Repo: https://github.com/zacharyahutton/glea-store (private), branch `main`.
- Hosting: Vercel project **glea-store**, preview only. Preview URL: https://glea-store-alphakennyagains-projects.vercel.app (noindex, must stay noindex).
- Environment variable NAMES (values live in Vercel and `.env.local`; never commit or print values):
  - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`, `NEXT_PUBLIC_SHOPIFY_API_VERSION`
  - `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEX` (must stay unset or false on preview)
  - `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
  - `NEXT_PUBLIC_POPUP_OFFER_CODE`, `NEXT_PUBLIC_POPUP_OFFER_TEXT`
  - `NEXT_PUBLIC_ON_VERCEL`, `VERCEL_URL` (set by Vercel)
- Routes today: `/`, `/collections/[handle]` (main: `/collections/all`), `/products/[handle]` (main: `/products/glea-clip-on-book-reading-light`), `/cart`, `/search`, `/pages/[handle]`, `/policies/[handle]`, `/blogs/[blog]/...`, `/api/subscribe`, `robots.ts`, `sitemap.ts`.

---

## 3. What exists today (read these first)

In the repo:
- `README.md`: setup, scripts, deploy notes.
- `docs/IMAGE-SLOTS.md`: every image and video slot, file names, sizes, fallbacks.
- `docs/reference/`: the design research below, copied into the repo so you can read it:
  - `T-048-loftie-analysis.md`: tokens, type scale, shell, home / collection / PDP section maps, what was dropped and why.
  - `T-048-loftie-interactions.md`: 28 measured Loftie interactions and the Glea version of each.
  - `T-049-slot-map.md`: image slot to file map for every page.
  - `T-050-video-slots.md`: video slot plan.
  - `T-051-hero-diff.md`: hero and header before/after with measured values.
  - `T-052-master-build-prompt.md`: this file.
- Key code:
  - `app/page.tsx` (home), `app/shell.css` (all Loftie-layout styles), `components/layout/Header.tsx`, `AnnBar.tsx`, footer;
  - `components/ui/VideoSlot.tsx` + `BgVideo.tsx` (hero video), `lib/video-server.ts`;
  - `components/product/ColorCard.tsx` (cards with hover swap), `components/product/ProductView.tsx` (PDP buy box, gallery, swatches);
  - `components/lf/*` (Tabs, WaysToUse, Rail), `components/motion/Reveal.tsx`;
  - `lib/media-server.ts` (filename-driven image resolver), `scripts/import-renders.mjs`, `scripts/import-videos.mjs`;
  - `qa/qa.py` (15 paths x 3 widths).
- Already live on the preview (T-048 to T-052): Loftie layout on home, collection and PDP; full-screen video hero with product at the bottom; floating header capsule (clear over hero, cream veil, solid on scroll, solid on hover); card hover image swap; scroll reveals; tabs; 8 s "how it works" auto-advance; scroll-snap rails; cart drawer with free-shipping bar; sticky add to cart; accordions; consent banner; email popup; chat button.

Reference material (look, measure, do not copy):
- Live: https://loftie.com/ , https://loftie.com/products/loftie-lamp , https://loftie.com/collections/all , https://loftie.com/blogs/ (journal), https://loftie.com/pages/ (support / FAQ pages).
- Offline export (on the build box only, not in the repo): `/workspace/eco/reference-html/loftie-export/` (frontpage, products, pages, blogs, assets/css). Reference screenshots: `qa/shots/loftie-ref/` (local only, gitignored).

---

## 4. Loftie page set and section order (measured 3 Nov 2026)

### Home (loftie.com, 1440 wide)
1. Full-screen hero: background video, centered serif H1 + sub + one cream button at the top, product at the bottom (900px tall at 1440x900).
2. Testimonial carousel ("How customers feel...") about 476px.
3. "Who are you shopping for?" 5 portrait cards on a rounded peach panel + dark button.
4. "Gifts they'll use every night": 2 large product cards.
5. Split rounded panel: image + text + button.
6. Tabbed story, 4 pill tabs, quote + image (about 1055px).
7. Feature with 2 circular videos (two-phase alarm).
8. Big promo card for a gift set with 3 videos.
9. Experts row (4 portraits).
10. Footer: big rounded dusk gradient card.

### Glea home today (keep this order; it mirrors the rhythm)
Hero, "Glea, by the numbers" rings card (maker specs only), "Who is it for?" 4 cards, "A soft glow for every night" 2 cards, split "Your page glows. The room stays dark.", tabbed "Turn the big light off. Glea has the rest.", "One button. Your glow." (hold 4 s to dim, 100% / 10%), "In the box" duo, "Good to know" journal row, footer.

### Product page (loftie.com/products/loftie-lamp)
Buy section (gallery with a video slide, title, rating, price, swatches, qty + add to cart, trust row, accordions), press strip, social proof block, "features" 6-icon row, 2 feature sections each with 2 videos, image-with-text (light mode), "Set any mood" color picker with image swap (15 images), "Easy to control" close-up, "Engineered inside out" (internals), experts, "Perfect match" cross-sell, "at home" UGC carousel, FAQs, "You may also like" 3 cards, reviews widget, footer. Sticky add to cart.

### Glea PDP today
Buy section, "Everything you need to read at night" icon row, "Clip it on. Keep reading." panels, split "Your page glows", "Pick your glow" (3000/4500/6000K dots), "How it works" (8 s auto-advance), "In the box", "Glea at home" rail (AI label), FAQs, "More colors" rail, footer. Sticky add to cart.

### Collection (loftie.com/collections/all)
Filters + "Shop All" grid of rounded square cards (hover swap), editorial image-with-text block, accordion + image split, journal row, footer. Glea matches: 6 color filters, 3-column grid (2 on mobile), accordion + image, journal row.

### Other Loftie pages
Journal (blog index + article), support / FAQ, contact, shipping, returns, about. Glea has `/pages/[handle]`, `/policies/[handle]`, `/blogs/...`.

---

## 5. Interactions spec (measured on Loftie; build our own)

Global: every motion below is off under `prefers-reduced-motion: reduce` (one global CSS rule plus JS guards). Use transform and opacity only where possible.

| # | Interaction | Spec (timing / easing / values) | Glea status |
|---|---|---|---|
| 1 | Card hover image swap | Second image absolutely positioned over the first, opacity 0. On hover: second to opacity 1, first to 0. `transition: opacity .4s ease-in-out, visibility .4s ease-in-out`. No zoom while swapping. Only under `@media (pointer: fine)`; touch shows the first image. Also on keyboard focus. Cards without a second image: scale 1.03 over .65s cubic-bezier(.22,.61,.36,1) | Done (T-052) on color cards (collection, search, PDP "More colors") and the 2 home product cards. Image source: section 7 |
| 2 | Header over hero | Floating capsule inset 24px, 72px tall, radius 999px. At top of home: rgba(20,14,11,.06), `backdrop-filter: blur(12px) saturate(1.15)`, border 1px rgba(251,247,237,.22), cream text. Cream veil from 280px scroll, solid cream .92 + blur 16px + dark text from 520px. Transition background, color, border-color, box-shadow .32s ease | Done (T-051) |
| 3 | Header solid on hover | Pointer over the header (or focus inside it): background solid cream, text ink, border rgba(255,255,255,.6), `blur(18px) saturate(1.15)`, shadow `0 22px 52px rgba(12,7,5,.2), 0 3px 12px rgba(12,7,5,.08)`. Same .32s; fully solid by ~300 ms; reverts on leave. Only under `(hover: hover)` | Done (T-052) |
| 4 | Header hide / show | Hides on scroll down after 280px: translateY(-(header + 90px)), transform .35s ease. Shows on scroll up. Never hides while a menu, the cart or focus is inside | Done |
| 5 | Header icons | 19 to 21px line icons, stroke 1.5, on ~37px steps; hover opacity .72 + 1px lift, .2s; cart count badge 17px circle | Done (T-052). No account icon (no customer accounts) |
| 6 | Nav links | Color .32s; underline grows from left via ::after transform .3s; first item highlighted (amber ink) | Done |
| 7 | Announcement bar | One static centered message, 46px desktop / 50px mobile, navy bg, cream text, pinned at top, no rotation | Done |
| 8 | Scroll reveals | From opacity 0, translateY(20px) to visible; .5s cubic-bezier(.25,.46,.45,.94); siblings stagger 80ms; trigger when the top reaches 88% of the viewport; once. Content visible without JS | Done (`Reveal.tsx`) |
| 9 | Color picker image swap (PDP) | 40px circle swatches, selected ring 2px offset 3px (.2s). Click swaps the gallery to that color's photos with a .3s opacity crossfade; URL `?color=` updates | Done |
| 10 | "Pick your glow" dots | 3 dots (3000 / 4500 / 6000K) swap the image | Done |
| 11 | Sticky add to cart | Appears when the main add to cart leaves view. Desktop: bar under the header area; mobile: fixed bottom. opacity / transform / visibility .25s ease-in-out | Done |
| 12 | Cart drawer | 440px panel from the right, transform .3s ease, overlay rgba(20,22,31,.3) fade .3s. Free-shipping bar: "$X away from free shipping" until $45, fill width .5s ease. Empty state links to the colors | Done |
| 13 | Mobile menu drawer | From left, 320px, transform .6s cubic-bezier(.75,0,.175,1); overlay opacity .6s ease-in-out | Done |
| 14 | Accordions | `<details>`; content fades / slides down .3s on open; + rotates to x .3s | Done |
| 15 | Sliders / rails | Scroll-snap row, prev / next buttons, smooth scroll (instant under reduced motion), native swipe | Done |
| 16 | Tabs | Panel fade .45s ease from translateY(10px); text .75s from 16px; image float 6s ease-in-out loop (2px); active tab shimmer 5s linear | Done |
| 17 | Auto-advance feature list | 8s linear progress bar per item, then next; pauses on hover / focus | Done ("How it works") |
| 18 | Video sections | Muted, loop, playsinline, autoplay only when on screen (IntersectionObserver), poster first, fade in .3s on `playing`; never loaded under reduced motion or Save-Data; no visible controls on background video | Hero done; section videos not built (gap list) |
| 19 | Buttons | Radius **10 to 12px** (no pills), bg / color / border .32s, no transform | Done |
| 20 | Footer glow | Dusk gradient card, two glow layers 9s and 13s ease-in-out loops (opacity / transform) | Done |
| 21 | Page transitions, parallax | None on Loftie. Do not add. Exception: the 2.5D hero still fallback (section 6) may use a very small pointer / scroll parallax, off under reduced motion | n/a |

---

## 6. Video hero spec

- Full-screen: `height: 100svh` (min 560px), full bleed, runs under the announcement bar and the header (`margin-top: -(bar + header)`), black base.
- Layers bottom to top: poster image, muted looping `<video>` (fades in .3s on `playing`), a soft dark oval scrim behind the text (needed for AA), centered text column, product at the bottom center.
- Text (top of the hero, centered): H1 "Soft light, / after dark." Newsreader 400, desktop `clamp(64px, 9.6vh, 88px)` / 1.02, mobile 46px / .98 (40px on short screens); sub 21px desktop / 18px mobile; one cream button "Shop the light" (266x57 desktop, 232x43 mobile, radius 10px). No text entrance animation.
- Product: Glea light cutout standing at bottom center, 34% of hero height desktop (max 340px), 30% mobile, contact shadow and a dark floor band. The text and button must never overlap the product at 1440x900, 1280x720, 1920x1080, 390x844, 360x640.
- Video files: `public/media/video/glea-hero-d.mp4` (1920x1080) and `glea-hero-m.mp4` (1080x1920). Export spec: **mp4 H.264, under 6 MB each, muted (no audio track), with poster**. The `<video>` uses `preload="none"`, loads after page load + idle, pauses off screen, `aria-hidden`, no tab stop.
- Poster: `hero-frame-01-16x9` (1920x1080) and `hero-frame-01-9x16` (1080x1920), the approved first frame of the hero video. Used as the poster (LCP image, preloaded) and as the still / 2.5D parallax fallback for reduced motion and Save-Data. Fallback chain: hero-frame-01, else the video's first-frame WebP, else `HERO-01` still.
- No on-screen pause button (owner decision, T-052; Loftie has none). Mitigation for WCAG 2.2.2: no video under reduced motion or Save-Data, pauses when off screen, purely decorative.
- Current clips are mood placeholders from Pexels (see T-050). Never caption people in them as using or endorsing Glea.

---

## 7. Image-slot system (filename-driven)

- Drop a file named after its slot into `/workspace/eco/glea-renders/` (build box) and run `node scripts/import-renders.mjs`. It writes WebP (max 2400px; non-transparent files flattened on cream) into `public/media/` and records sizes in `public/media/renders.json`. Commit the outputs.
- Code never hard-codes a missing file: `lib/media-server.ts` (`findDrop`, `resolveCardImage`, `resolveColorImages`, `resolveHoverImage`) picks the first file that exists, else falls back to the next option, else a styled `Placeholder` with the color name. A missing file must never break a page.
- Full slot list: `docs/IMAGE-SLOTS.md` and `docs/reference/T-049-slot-map.md`. New in T-052:

| Slot | Use | Size | Content | Fallback |
|---|---|---|---|---|
| `glea-hover-black` (first), `-amber`, `-pink`, `-purple`, `-lakeblue`, `-white` | Card hover image per color (collection, search, PDP "More colors"); `glea-hover-black` also on the home "Glea book light" card | 4:5 (e.g. 1600x2000), transparency not required | Same scene as the card image, closer. No person | `glea-cut-hero-<color>-lit`, else `glea-var-<color>-1100` (home card: `glea-life-nightstand`) |
| `glea-hover-pair` | Hover on the home "Buy 2" card | 4:5 | Two lights, closer | `glea-cut-pair-black-white` |
| `hero-frame-01-16x9` | Hero poster + still / 2.5D fallback, desktop | 1920x1080 | Approved first hero frame | video first-frame WebP, else HERO-01 |
| `hero-frame-01-9x16` | Same, mobile | 1080x1920 | Same | desktop frame, else mobile poster, else HERO-01 |

- Lifestyle images are AI-made: **the "AI-generated image" label under the "Glea at home" rail stays.**

---

## 8. Honesty rules (non-negotiable)

- Allowed product facts, and only these: 9 LEDs; 3 light colors 3000K / 4500K / 6000K; hold 4 s to dim from 100% to 10%; 1000mAh battery; up to 80 h (varies with brightness); 63 g; $29.99; shipping $4.99 under $45, free over $45; 14-day returns; 6 colors (Black, Amber, Pink, Purple, Lake Blue, White).
- **Charge time, lumens and delivery times are unknown: keep them as hidden TODOs** (code comments or hidden fields), never shown or guessed.
- No reviews, star ratings, review counts, testimonials, press logos, "as seen in", expert endorsements, survey stats, countdown timers, fake deals, stock counters or "X people viewing". Reviews UI stays hidden until real reviews exist.
- No medical or sleep-science claims.
- People in placeholder videos and AI images are never presented as customers or endorsers.

---

## 9. Design rules

- Buttons and inputs: border-radius **10 to 12px**. No pill buttons. (Swatches are circles; that is fine.)
- Blocks: radius 16px (8px small). Container max 1600px, gutters 24px mobile / 26px desktop, text sections max 1200px. Section spacing 88px desktop / 56px mobile. Breakpoints 740 and 1000 (1200 for wide).
- Type scale: H2 `clamp(2.25rem, 3.4vw, 3rem)`, PDP title `clamp(2.4rem, 3.6vw, 3.25rem)`, card title 1.375rem serif, body 17px / 16px, line-height 1.65.

---

## 10. Performance and accessibility targets

- Mobile Lighthouse (home and PDP): **performance 90+, LCP under 3 s**, CLS under 0.05. Accessibility 100. (SEO shows ~69 on the preview because of noindex; that is intended.)
- Hero LCP is the poster or product image: preload it, correct `sizes`, AVIF / WebP. Video, chat and popup load after load + idle. No new heavy dependencies.
- **WCAG 2.1 AA**: text contrast 4.5:1 (3:1 for large text), including text over video (sample the brightest frames). Visible focus rings. Every interaction works with the keyboard. Hover-only effects must not hide information.
- `prefers-reduced-motion: reduce`: no video, no reveals, no loops, no auto-advance, instant scroll.

---

## 11. Keep untouched (do not break, do not redesign)

Shopify Storefront wiring (`lib/shopify/*`), cart logic and the cart drawer data flow, the checkout link (Shopify `checkoutUrl`), SEO (metadata, JSON-LD, sitemap, robots), analytics (GA4 / Meta / TikTok events: view_item, add_to_cart, begin_checkout; UTM storage), the consent banner and its gating of analytics, the chat widget, the email popup and `/api/subscribe` (it creates real Shopify customers: never submit test emails), and **noindex on the preview** (meta robots + `X-Robots-Tag`). Do not publish any Shopify theme. Do not change Vercel project settings.

---

## 12. Build order with acceptance criteria

Work in small commits. After each step run the QA checklist (section 13) on a preview deploy.

1. **Card hover images live.** Import `glea-hover-*` files when they arrive. Accept: every color card on collection / search / PDP shows its own hover image, .4s ease-in-out, only on fine pointers; no layout shift; missing file falls back silently.
2. **Hero frame + final videos.** Import `hero-frame-01-*` and the final hero mp4s (H.264, under 6 MB, muted). Accept: poster is the LCP image, video fades in .3s, LCP under 3 s on mobile, text contrast AA over the brightest frame, no overlap at the 5 test sizes.
3. **2.5D still fallback.** For reduced motion / Save-Data show `hero-frame-01` as a still (optional subtle parallax only when motion is allowed). Accept: no video request under reduced motion; still fills the hero with no CLS.
4. **PDP gallery video slide.** Add an optional first or second gallery slide that plays a short muted product clip (slot name `glea-pdp-clip`, mp4 H.264, under 4 MB, poster). Accept: swatches still swap images; video pauses off screen; dots / swipe work.
5. **Feature video sections (PDP + home).** Two Loftie-style feature rows with looping muted clips (e.g. "Hold 4 s to dim", "Clip it on"), using only allowed facts. Accept: lazy, paused off screen, reduced motion shows the poster.
6. **"Inside the light" section (PDP).** Render-based section in the "engineered inside out" slot: LEDs, battery, clip, using only allowed specs. Accept: no invented numbers.
7. **Collection editorial block.** Add the image-with-text block between the grid and the accordion. Accept: one H2, 1 image slot with fallback, reveal on scroll.
8. **Journal depth.** Blog index card grid and article template in the Loftie rhythm (hero image, reading width ~680px, related posts row). Accept: renders with zero or more posts (empty state links to the FAQ), no new claims. Articles are written and approved by the owner, not invented.
9. **Polish pass.** Header icon set, badge, focus states, footer spacing, 360px layouts. Accept: QA checklist all green.

---

## 13. QA checklist (run on every preview deploy)

- [ ] 15 key paths x 3 widths (1280, 390, 360): HTTP 200, no console errors, no horizontal overflow (`qa/qa.py <url>`).
- [ ] Events fire: view_item, add_to_cart, begin_checkout; checkout link points to Shopify cart.
- [ ] Consent banner shows, buttons radius 10px, choice persists, analytics gated by consent.
- [ ] Email popup shows once, closes; bad email to `/api/subscribe` returns 400 (never submit a real email).
- [ ] Hero: no overlap of text / button / product at 1440x900, 1280x720, 1920x1080, 390x844, 360x640; contrast AA; no pause button; reduced motion = no video.
- [ ] Header: clear at top, solid on hover (desktop), veil / solid on scroll, hides on scroll down, shows on scroll up.
- [ ] Card hover swap on every card with a second image; touch shows the first image only.
- [ ] Chat button never covers swatches, the buy row or the sticky add to cart at 360 / 390.
- [ ] Lighthouse mobile home x3 and PDP x2: perf 90+, LCP < 3 s, a11y 100.
- [ ] `<meta name="robots" content="noindex, nofollow">` and `X-Robots-Tag: noindex` present.
- [ ] No reviews / stars / timers / invented facts anywhere; AI-image label present.
- [ ] No secrets in the repo (scan for tokens before every push).

---

## 14. Gap list: what Loftie has that Glea still lacks

From the live site and reference screenshots, 3 Nov 2026:

1. **Video depth.** Loftie home has 7 videos (hero, 2 circular feature videos, 3 in the gift-set promo); its PDP has 5 (one gallery slide, 2 feature sections x 2). Glea has 1 (hero), PDP has 0.
2. **Final hero media.** Loftie's hero video is brand footage; Glea's hero video is a Pexels mood placeholder, and the approved `hero-frame-01` frames and final mp4s are not delivered yet.
3. **Card hover images.** Wired, but the `glea-hover-<color>` and `glea-hover-pair` files are not delivered; cards fall back to lit cutouts.
4. **PDP "engineered inside out" / internals section** and a big product close-up section with real renders: Glea has none.
5. **Gift-set promo card** (large rounded card with video for a bundle): Glea's "Buy 2" exists only as a small box and a card.
6. **Collection editorial image-with-text block** between the grid and the accordion: missing on Glea.
7. **Journal**: Loftie has a full blog. Glea's /blogs/news lists no articles; the home "Good to know" row links to the FAQ, the collection and the specs instead.
8. **Account icon / customer accounts** (account, search, cart): Glea shows search and cart only (no accounts on this store).
9. **Social proof** (testimonial carousel, reviews widget, review stars, experts, press strip): intentionally absent until real reviews exist; do not fake.
10. **Missing renders still flagged in T-049**: home mobile hero crop, "how it works" step images (clip, aim, read), and a social share (OG) image.
