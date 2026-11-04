# Glea storefront: master build prompt v2 (Loftie 1:1 layout, Glea content)

Version: T-053 v2, 3 Nov 2026. Replaces v1 (kept as `T-052-master-build-prompt-v1.md`). All numbers below were measured on live loftie.com on 3 Nov 2026 with Playwright Chromium at 1440x900 and 390x844 (getComputedStyle, bounding boxes, hover and scroll probes), cross-checked with the offline export at `/workspace/eco/reference-html/loftie-export/` (on the build box only, not in the repo, not in the pack).

## START HERE (paste these 15 lines to Claude)

```
1. You are rebuilding the Glea storefront (repo zacharyahutton/glea-store, Next.js 15, Shopify headless) as a 1:1 LAYOUT replica of loftie.com.
2. Read this whole file first. Sections A to F are the spec; the numbers are measured, use them exactly (px, colors, gradient angles and stops, radii, timing, easing).
3. Same section order, grids, containers, paddings, type sizes, gradients, image treatments, buttons, hover and scroll motion as Loftie. Do not "improve" or personalize the layout.
4. Only swap content: Glea copy, Glea images (slot filenames in section E), Glea product data from Shopify. Copy placeholders are marked [COPY: ...].
5. Recreate in our own code. Never paste Loftie HTML, CSS, JS, images, video, fonts, icons, copy, product names or brand. Measure, then write it yourself.
6. Honesty: no reviews, ratings, review counts, testimonials, press logos, expert endorsements, survey stats, timers, deals, stock counters. Those Loftie slots become the honest substitutes listed per section.
7. Product facts allowed: 9 LEDs; 3000/4500/6000K; hold 4 s to dim 100% to 10%; 1000mAh; up to 80 h (varies); 63 g; $29.99; $4.99 shipping under $45, free over $45; 14-day returns; 6 colors.
8. Charge time, lumens, delivery times, warranty terms: unknown. Hidden TODO comments only, never shown or guessed.
9. Keep untouched: Shopify wiring, cart logic, checkout link, SEO, analytics, consent, chat, popup, /api/subscribe (never submit test emails), noindex on preview.
10. Buttons: Loftie's exact radius and feel (4px main buttons, 5px section buttons, 999px pills). Only switch to 10-12px if the owner asks.
11. Fonts: Austin News Deck and Messina Sans are licensed; use the free stand-ins in C.2 at Loftie's exact sizes, line-heights and tracking.
12. Work in the build order of section F; one commit per step; Vercel preview only; never publish a Shopify theme; never change Vercel settings.
13. After each step run the side-by-side QA in F.2 (Loftie vs ours, 1440 and 390, per section) and fix anything outside tolerance.
14. Keep prefers-reduced-motion (no video, no loops, no reveals, no auto-advance) and WCAG 2.1 AA contrast everywhere.
15. The deviation table in section D is your to-do list: every row must read "matches" when you are done.
```

## Contents
- A. Home blueprint (section by section, exact order)
- B. Every other page (collection, PDP, cart drawer, about, blog, FAQ/support, returns, warranty, shipping, contact, header, footer, menus)
- C. Token appendix
- D. Diff vs current glea-store
- E. Rules, honesty substitutions, keep-untouched list, image slot map
- F. Build order with acceptance criteria, side-by-side QA procedure

Notation: `1440: x / 390: y` means desktop value / mobile value. Colors in hex (measured rgb converted). "Messina" and "Austin" mean the stand-ins from C.2 rendered at the same metrics. `[COPY: ...]` is a Glea copy placeholder (owner approves final words). `TODO(hidden)` means a code comment or a non-rendered field, never visible text.

---

# C. Token appendix (read before A and B)

## C.1 Colors and gradients (exact, measured)

| Token | Value | Where Loftie uses it |
|---|---|---|
| `--page` | `#FBF7ED` (rgb 251,247,237) | Page background, cream text on dark, cream buttons |
| `--page-2` | `#FCF7ED` | Stats band outer bg, ring stroke |
| `--ink` | `#191919` (rgb 25,25,25) | Body text, dark buttons, footer subscribe |
| `--brown` | `#522D27` (rgb 82,45,39) | Announcement bar, ATC button, stats gradient start, refurb text |
| `--sand` | `#F0D6B5` (rgb 240,214,181) | Gradient ends, ring track |
| `--sand-2` | `#F7E9D3` | Support topic-card gradient |
| `--wine` | `#7A1F27` (rgb 122,31,39) | Active filter pill, highlight |
| `--line` | `#D9D6CD` | Borders, sticky ATC hairline |
| `--taupe` | `#BEAA9E` | Active gallery dot, photo backgrounds |
| `--body-2` | `#2E2A26` | Doomscroll body text |
| `--muted` | `#5C534B` | Support page secondary text |
| `--media-dark` | `#2B2320` | Doomscroll media bg |
| `--card-light` | `#FFFDF8`, border `#E7DDCC` | Support question buttons |
| `--promo` | `#F7F8FD` | About page promo blocks |
| `--refurb` | `#F1E7DA` | PDP refurb card (Glea: not used) |

Gradients (angle and stops exact):
- **Stats band**: `linear-gradient(160deg, #522D27, #F0D6B5)`.
- **"Who" band**: `linear-gradient(0deg, #F0D6B5 0%, #FBF7ED 70%)` (same as `to top`).
- **Doomscroll text panel**: `linear-gradient(105deg, #FBF7ED, #F0D6B5)`.
- **Doomscroll floating card**: `linear-gradient(165deg, #F0C39A, #B96A45)`, shadow `0 24px 60px rgba(20,16,12,.35)`.
- **Tabs active pill**: `linear-gradient(120deg, #E1BF91, #282E7E, #E1BF91)` with `background-size` large enough to slide, animated `shimmer 5s linear infinite` (Loftie `enShimmer 5000ms`).
- **Dusk footer**: `linear-gradient(172deg, #FBF7ED 0%, #F8EDDC 36%, #F0D6B5 62%, #7C768A 82%, #3E4373 96%, #373B66 100%)`.
- **Support topic card**: `linear-gradient(to top, #F0D6B5 0%, #F7E9D3 70%)`. **Support bottom band**: `linear-gradient(to top, #F0D6B5 0%, #FBF7ED 70%)`.
- **ATC button**: two layers. Top: `linear-gradient(178deg, #522D27, #522D27 10%, rgba(0,0,0,.07) 10%, rgba(0,0,0,.07) 100%)` at `background-size: 100% 200%`, `background-position: 100% -100%`; bottom: solid `#522D27`. Hover moves the top layer to `100% 25%` (a slanted 7% dark wash slides down). Transition `background-position .5s cubic-bezier(.215,.61,.355,1)`. Cream variant (about-page Submit): same with `#FBF7ED` and brown text.

## C.2 Fonts

| Role | Loftie font | License | Free stand-in (use now) | Alternative |
|---|---|---|---|---|
| Headings, numerals, quotes | Austin News Deck (Roman 400 and Italic 400), Commercial Type | Commercial, licensed; not on Google Fonts. Buying it is an owner decision (no spend now) | Newsreader 400 + 400 italic (already loaded via next/font) | Libre Caslon Display; Playfair Display 400 |
| Body, UI, buttons | Messina Sans (300, 400, 500, 600, 700, Book), Luzi Type | Commercial, licensed | DM Sans 300 to 700 (already loaded) | Inter; Manrope |

Rule: match Loftie's px size, line-height and letter-spacing exactly with the stand-in. If the stand-in's x-height makes a heading wrap differently from Loftie at 1440, adjust `letter-spacing` within -0.02em before touching size.

## C.3 Type scale (measured)

| Use | 1440 | 390 |
|---|---|---|
| Body | Messina 400 18/31.2 | 17 |
| Announcement | Messina 700 17.06, italic for emphasis word | 12.87 |
| Hero H1 | Austin 400 65/68.25, cream | 32/29.76 |
| Hero sub | Messina 18/22.5, max-width 500 | 16 |
| Section H2 (default) | Austin 400 48/57.6 | 40/48 |
| Section H2 (home stats, who, featured) | Austin 40/46, 40/42, 40/40 | 24/27.6, 32/33.6, 40/40 |
| Tabs H2 | Austin 66/72.6 + italic 70/84 second part | 35/40 |
| Reviews / media hero H2 | Austin 52/56.16, 52/54.6 | 34/36.72 |
| PDP H1 | Austin 52/48.36 | 36/33.48 |
| Collection card title | Austin 27/37.8, ls -.6px | (2-col) |
| Related card title | Austin 23.4/32.76, ls -.6px; tagline Austin italic 19.8/25.74 ls .2px | |
| Card H3 (who) | Austin 22/24.2; meta Messina 14, alpha .65 | 19/20.9 |
| Featured card | Austin 24/24; tagline Austin italic 16; price Messina 500 18, ls .36px | 17/17 |
| Image-with-text p | Messina 18/19.8 | 18/19.8 |
| Accordion toggle | Messina 600 16, padding 8px 0; body Messina 14/24.27 | same |
| FAQ toggle | Messina 700 16, 668x60, padding 21px 24px | 338x51 |
| Price (collection) | Messina 500 15, ls .36px | |
| Trust row | Messina 12 | 12 |
| Support H1 | Austin 100.8/104.83 | 52/54.08 |
| Policy page H1 | Austin 67.86/63.11 white on header band | 34/37.4 |
| Policy page H3 | Austin 32/40 | 24/30 |

## C.4 Spacing, containers, breakpoints
- Container max 1600, side padding 30 (1440) / 26 (390). Text sections max 1000 (multi-column), 850 (policy text), 700 (hero text), 560 (collection intro).
- Inset bands: 44px outer padding at 1440 (16 at 390), inner 1352 wide (stats, doomscroll, media heroes).
- Rounded bands start at x22 (1396 wide) for "who" and two-up.
- Section vertical rhythm is per section (listed in A/B), not one global value.
- Breakpoints: keep the existing ones; verify layouts at exactly 1440 and 390.

## C.5 Radii
- Main buttons (hero, ATC, Shop, Submit, Back to home): **4px**. Section buttons (who, two-up, filter pills): **5px**. Tab pills, support Ask: **999px**. Support manual button 12px, question buttons 14px.
- Images: 8px default (PDP sections, collection, related, experts grid), 14px featured, 20px who cards and inset media heroes and stats band, 22px support topic cards and clock-features cards, 28px support hero image, 32px who band, two-up cards, support bottom band; 40px footer glass card. Gallery: 0. UGC rail: 0. Circular video: 50%.
- Header capsule 999px (desktop), 16px (mobile).
- Owner preference on record: 10-12px buttons. Default is Loftie's 4/5px. Switch only if the owner asks.

## C.6 Shadows and borders
- Header rest `0 18px 44px rgba(12,7,5,.1), 0 2px 10px rgba(12,7,5,.05)`; hover `0 22px 52px rgba(12,7,5,.2), 0 3px 12px rgba(12,7,5,.08)`; border `1px solid rgba(255,255,255,.5)` to `.6` on hover.
- Footer card `0 30px 70px rgba(10,8,24,.28)`.
- Doomscroll card `0 24px 60px rgba(20,16,12,.35)`.
- Sticky ATC `0 6px 5px -5px rgba(217,214,205,.4)` plus a 1px `#D9D6CD` hairline.
- Gallery dots: `0 0 0 2px #fff` plus `rgba(0,0,0,.25)`.
- Swatches: 3px solid `#FBF7ED` border.

## C.7 Buttons (states and transitions)
| Button | Size 1440 / 390 | Fill / text | Radius | Font | Hover / transition |
|---|---|---|---|---|---|
| Hero CTA | 266x57 / 232x43 | `#FBF7ED` / `#191919` | 4 | Messina 700 16 (14 mobile) | No visible change measured; keep none |
| Section CTA dark | 211x42, padding 14px 32px | `#191919` / cream | 5 | Messina 700 14 | none measured |
| Section CTA cream (on dark cards) | padding 14px 32px | cream / ink | 5 | Messina 700 14 | none measured |
| ATC | 520x55, padding 0 35px | brown two-layer gradient / white | 4 | Messina 400 21.6/48 | swipe: background-position .5s cubic-bezier(.215,.61,.355,1) |
| Shop Now (about) | 142x48, padding 0 35 | `#191919` / cream | 4 | Messina | none |
| Filter pill | 38 tall, padding 11px 16px | active `#7A1F27` / cream; inactive transparent | 5 | Messina | color/bg .2s |
| Tab pill | 157x52, padding 12px 24px / 10px 16px | active shimmer gradient, cream, 600; inactive transparent, alpha .75 | 999 | Messina 16 | bg/color .3s; container bg/border .6s |
| Footer subscribe | 82x50 | `#191919` / cream | 4 | Messina | none |
| Gallery prev/next (about timeline) | 56x56 | `#191919` | 4px 4px 0 0 and 0 0 4px 4px (joined pair) | | |
| Support Ask | 105x48 | `#191919` / cream | 999 | Messina Book 15 | bg/color .2s |
| Link underline | text | | | | text-decoration-color, color .2s ease-in-out |
Focus: add a visible 2px focus ring (Loftie has weak focus; this is an allowed accessibility deviation).

## C.8 Image hover and motion effects
- **Who cards**: image `transform .5s`, hover `scale(1.04)`, container overflow hidden, radius 20.
- **Product cards (collection, related, more colors)**: primary to secondary image crossfade, `opacity .4s ease-in-out, visibility .4s ease-in-out`.
- **Featured 2-up cards**: no hover change.
- **Header**: background/color/border-color/box-shadow .32s; links color .32s and scale 1.03 on hover; hides on scroll down (translate up out of view), shows on scroll up; scrolled state `rgba(251,247,237,.92)` + `backdrop-filter: blur(16px) saturate(1.2)`; solid `#FBF7ED` on hover.
- **Gallery**: slides fade `opacity .3s ease-in-out`; dots bg .3s.
- **Swatch**: border-color .2s ease-in-out; no hover change.
- **Accordion (PDP details)**: height animates from 0 (about .4s, ease-in-out; verify in QA), plus icon pseudo-elements rotate 90deg with `transform .4s ease-in-out, opacity .4s ease-in-out`.
- **Quantity menu items**: background-color .3s ease-in-out.
- **Cart drawer**: panel 440 wide from the right, `right .3s linear` (keyframes 300ms), overlay `rgba(0,0,0,.3)`; drawer overlays `.6s ease-in-out`.
- **Mobile menu**: from left, 320 wide, `transform .6s cubic-bezier(.75,0,.175,1)`.
- **Sticky ATC**: opacity, transform, visibility, top `.25s ease-in-out`.
- **Scroll reveals**: 0.5s, ease `power2.out` equivalent `cubic-bezier(.25,.46,.45,.94)`, stagger .08s, start when the element top passes 88% of the viewport. Reviews-card style reveal: opacity/transform 1s `cubic-bezier(.16,1,.3,1)`, stagger .11s.
- **Doomscroll scroll timeline**: dot `top .5s cubic-bezier(.22,.61,.36,1)`, panel opacity .55s, text transform .65s same curve, button opacity .25s.
- **Tabs**: card opacity/transform .8s; float loop 6s infinite (product image), quote-in 750ms, mark-in 900ms.
- **Footer glows**: two radial glows drifting, 9s and 13s infinite.
- **Logo/spec marquee**: 60s linear infinite, gap 100 (70 mobile).
- **8 s tab progress** (image-with-text tabs): progress bar 8000ms linear.
- All loops and reveals off under `prefers-reduced-motion: reduce`.

## C.9 Ring / stat component (exact)
- SVG 190x190, `viewBox="-8 -8 116 116"`, rotated -90deg.
- Track circle r=45, stroke `#F0D6B5`, width 1.3, opacity .5.
- Value circle r=45, stroke `#FCF7ED`, width 1.7, `stroke-linecap: round`, `stroke-dasharray: 283`, `stroke-dashoffset: 283 * (1 - fraction)`.
- Glow: SVG filter `feDropShadow dx=0 dy=0 stdDeviation=2.4 flood-color=#FCF7ED`.
- Numeral inside: Austin italic, 25 viewBox units (about 41px), cream, centered.
- Label under: Messina 15/21, centered, cream.
- Draw animation: dashoffset from 283 to target, 1500ms linear, once, when in view. Reduced motion: final state.
- Row: flex, gap 54 (1440), 3 rings.

---
# A. Home blueprint (loftie.com, exact order)

Loftie home is 7367px tall at 1440 and 9617px at 390. Page bg `#FBF7ED`. Every section below is in Loftie's order. Glea gets the same section in the same place.

### A.0 Announcement bar (global)
- Loftie: full width, bg `#522D27`, 46px tall (50 at 390), padding 0 30, inner max 1600; one static centered line, Messina 700 17.06 cream (12.87 at 390), one italic emphasis word. Not sticky; scrolls away.
- Glea: `[COPY: Free shipping on orders over $45]` with "Free" in italic. Fact-checked: allowed.

### A.0b Header (global, floating capsule)
- Desktop: capsule `.hdr__bar` at x24, y60 (14px below the bar), 1392x72, radius 999, padding 0 30. Logo left (Glea uses its own wordmark), nav links after the logo, gap 32, Messina 16; icons right (search, account, cart with count badge).
- States: over hero `rgba(20,14,11,.06)` with cream text; on PDP and inner pages `rgba(251,247,237,.3)` with ink text; scrolled `rgba(251,247,237,.92)` + blur(16px) saturate(1.2); hover or focus-within solid `#FBF7ED`. Shadows and border in C.6. Transitions .32s. Header section itself: background/color/box-shadow .25s ease-in-out.
- Scroll: hides when scrolling down past the hero (moves above the viewport), reappears on scroll up.
- Mobile: 366x54 at x12, radius 16, padding 0 16; menu + search left, logo centered, cart right.
- Nav (Loftie: Holiday Shop, Clock, Card, Lamp). Glea: `[COPY: Shop all colors]` (/collections/all, first item highlighted), `[COPY: The light]` (PDP), `[COPY: How it works]` (PDP#how-it-works), `[COPY: Help]` (/pages/faq or support). No mega menu: Loftie has none (plain links, verified by hover probes).

### A.1 Hero (homepage_hero_section)
- Size: 900 tall at 1440, 844 at 390; full bleed; runs under bar + header.
- Media: full-bleed muted looping video, `playsinline`, black base, poster image; image layer opacity .3s.
- Text block: centered, max-width 700, padding-top 32. H1 Austin 65/68.25 cream (32/29.76 mobile). Sub Messina 18/22.5 max-width 500 (16 mobile). One button 266x57 radius 4, cream bg, ink text, Messina 700 16 (232x43 mobile, 14).
- Loftie has no product cutout in the hero. Our current product cutout at the bottom is a deviation (see D). Default: remove it to match; keep the cutout component behind a flag `HERO_PRODUCT=false` in case the owner wants it back.
- Glea: H1 `[COPY: Soft light, after dark.]`, sub `[COPY: A clip-on book light with a warm glow on your page, not the room.]`, button `[COPY: Shop the light]`. Slots: `glea-hero-d.mp4` / `glea-hero-m.mp4`, poster `hero-frame-01-16x9` / `-9x16`.
- Contrast: keep a soft scrim behind the text so cream text is 4.5:1 on the brightest frame.

### A.2 Spec band (Loftie: carousel_customer_stats "How customers feel...")
- Outer: 476 tall, padding 44 (16 at 390), bg `#FCF7ED`.
- Inner card: 1352x388, radius 20, background `linear-gradient(160deg, #522D27, #F0D6B5)`.
- Title: Austin 40/46 cream (24/27.6), max-width 400. Sub: Messina 15/26 cream at opacity .65.
- Rings: 3, flex, gap 54, ring spec in C.9. Mobile: rings in a horizontal row that scrolls/snaps (Loftie uses a carousel) or 1 per view.
- Honesty substitution (survey stats are not allowed): this becomes a REAL-SPEC band. Title `[COPY: Glea, by the numbers]`, sub `[COPY: Maker specs. Battery life varies with brightness.]`.
  - Ring 1: numeral `100 to 10%`, label `[COPY: Hold 4 s to dim]`, arc fraction 0.9 (the real dimming range, 10% to 100%).
  - Ring 2: numeral `3`, label `[COPY: Light colors, 3000K / 4500K / 6000K]`, arc drawn as 3 equal segments (gaps 6 units) so it reads as "three", not as a percentage.
  - Ring 3: numeral `80 h`, label `[COPY: Up to 80 h per charge (varies)]`, full arc (fraction 1.0).
  - 9 LEDs, 1000mAh and 63 g go in the sub line or a 4th ring only if the owner wants 4; Loftie has 3, default 3.
- Contrast: cream text over the light end (`#F0D6B5`) fails AA. Keep text and rings in the left/darker 60% of the card at 1440, or add `text-shadow: 0 1px 8px rgba(82,45,39,.45)`. Measure in QA; if still under 4.5:1, darken only the end stop and log it in D.

### A.3 "Who" band (Loftie: holiday_who)
- Band: x22, width 1396, radius 32 (24 at 390), padding 64 40 56 (40 16 32), background `linear-gradient(0deg, #F0D6B5 0%, #FBF7ED 70%)`.
- H2 Austin 40/42 centered (32/33.6); sub Messina 16/24 ink at alpha .7.
- Cards: grid 5 columns x 235, gap 16, max 1240 (390: 2 columns x 161, gap 20/12, 5th card spans or sits alone left).
- Card image 235x314 (3:4) radius 20, object-fit cover, `transition: transform .5s`, hover `scale(1.04)` inside overflow hidden (390: 161x161 radius 16).
- Card text: h3 Austin 22/24.2 (19/20.9), meta Messina 14 alpha .65.
- Button under the grid: centered, 211x42, `#191919`, cream text, radius 5, padding 14 32, Messina 700 14 (full-width 334 at 390).
- Glea: H2 `[COPY: Who is it for?]`, sub `[COPY: One small light, five kinds of nights.]`. 5 cards (we have 4 today):
  1. LIFE-PARTNER `[COPY: Reading next to a sleeper]`
  2. LIFE-SOFA `[COPY: The sofa reader]`
  3. LIFE-TRAVEL `[COPY: The traveler]`
  4. LIFE-HANDS `[COPY: The late-night chapter]`
  5. LIFE-GIFT `[COPY: The gift]`
  Meta line per card `[COPY: short real use, no claims]`. Button `[COPY: Shop all colors]` to /collections/all.

### A.4 Featured 2-up (Loftie: featured_collection_dynamic)
- Section padding 71 0 27; container 1600, padding 0 57. H2 Austin 40/40 ink, centered.
- Grid 2 x 569, gap 30. Image 569x363 radius 14 (390: horizontal scroll row, cards 304x194).
- Info row under image: grid 420 / 140: left h4 Austin 24 + tagline Austin italic 16 (+ Loftie's review count: OMIT); right price Messina 500 18, ls .36.
- No hover change on these cards.
- Glea: H2 `[COPY: A soft glow for every night]`. Card 1: STUDIO-NAVY, `Glea book light`, tagline `[COPY: Soft light, after dark.]`, `$29.99`. Card 2: LINEUP, `[COPY: Buy 2, save $5]` (existing bundle config in `site.bundle`), tagline `[COPY: Six colors]`, price from Shopify. Images are landscape 569x363: crop slots accordingly (see E.4).

### A.5 Split with floating card (Loftie: ditch_the_doomscroll)
- Outer padding 44 (16). Stage 1352x464, grid 744 / 608 (stacked at 390: media 358x360 then text).
- Left media: bg `#2B2320`, image or looping video, cover, radius 0 inside the stage.
- Right text panel: `linear-gradient(105deg, #FBF7ED, #F0D6B5)`. H2 Austin 37.44/41.93 (22/24.64). Body Messina 15.84/25.34 `#2E2A26`.
- Floating card over the media: 230x149, radius 10, padding 20, `linear-gradient(165deg, #F0C39A, #B96A45)`, shadow `0 24px 60px rgba(20,16,12,.35)`, two lines in Austin 37.44 and 31.68 cream.
- Scroll timeline: as the section scrolls through, a dot moves (top .5s cubic-bezier(.22,.61,.36,1)), panel opacity .55s, text translate .65s same curve, button opacity .25s.
- Glea: H2 `[COPY: Your page glows. The room stays dark.]`, body `[COPY: ...]`, media LIFE-NIGHTSTAND (or `glea-split-clip.mp4` when ready). Floating card lines: `Hold 4 s` / `[COPY: Dim to 10%]` (real fact).

### A.6 Tabs with shimmer pills (Loftie: every_night_tabs)
- Padding 64 0 (32 0 40). Wrap max 1440, padding 0 95 (0 24).
- H2: first part Austin 66/72.6, second part Austin italic 70/84 (35/40 at 390), centered.
- Pills: flex gap 6 (4 at 390), 4 pills, radius 999, padding 12 24 (10 16), Messina 16. Inactive: transparent, alpha .75. Active: shimmer gradient (C.1), cream, weight 600, shimmer 5s infinite. Pill bg/color .3s; pill container bg/border .6s.
- Panel: grid 333 / 509 / 360, gap 24 (single column at 390):
  - Col 1: large text in Austin 36/46.08 (21/29 at 390) + one small fact line in Messina.
  - Col 2: photo 509x607 radius 8 (342x474 radius 16 at 390), photo bg `#BEAA9E`.
  - Col 3: tall image 360x608 (Loftie: phone/app screen) with a 6s float loop.
  - Panel cards: opacity/transform .8s; text in 750ms, mark in 900ms.
- Honesty substitution for col 1 (Loftie shows a customer testimonial): a Glea-written scenario line, NOT a quote: no quotation marks, no name, no "customer". Small line = the matching fact.
- Glea: H2 `[COPY: Turn the big light off.]` + italic `[COPY: Glea has the rest.]`. Pills and panels:
  1. `[COPY: In bed]`: LIFE-HANDS; line `[COPY: Clip it to the cover and read.]`; fact `Hold 4 s to dim to 10%`; col 3 `glea-cut-hero-black-lit` (transparent, floating).
  2. `[COPY: Next to a sleeper]`: LIFE-PARTNER / LIFE-NIGHTSTAND; fact `3000K warm light`.
  3. `[COPY: Travel]`: LIFE-ARMCHAIR or LIFE-TRAVEL; fact `63 g, 1000mAh`.
  4. `[COPY: Gift]`: LIFE-UGC; fact `6 colors, $29.99`.

### A.7 Two circles (Loftie: circular_images_grid)
- Padding 80 115.2 (40 at 390), page bg. H2 Austin 48/57.6 (40/48).
- 2 columns, each card 500 wide, flex column gap 20; circular video 400x400 radius 50% (300 at 390), autoplay muted loop.
- h3 Austin 38/45.6 (32/38.4), p Messina 18/19.8.
- Under the second card: list of 3 small options, flex gap 10 (Loftie: alarm tones you can play).
- Glea: H2 `[COPY: One button. Your glow.]`. Circle 1 `[COPY: Hold to dim]` (clip `glea-circle-dim.mp4`, poster MACRO-BUTTON), p `Hold 4 s to dim from 100% to 10%`. Circle 2 `[COPY: Pick your color]` (clip `glea-circle-temp.mp4`, poster GLOW-3000), with a 3-item list `3000K`, `4500K`, `6000K` that swaps the circle to GLOW-3000 / 4500 / 6000 (this replaces our DimDemo block; same function, Loftie layout).

### A.8 Two-up dark cards (Loftie: holiday_two_up)
- Grid 2 x 688, gap 20, starts x22 (1 column at 390; card heights 600 and 440).
- Card: radius 32 (24 at 390), bg `#191919`, full-card background video or image, cover.
- Text block 408 wide, bottom-left: h3 Austin 36/37.8 cream (30/31.5), p Messina 16/24, button cream radius 5 padding 14 32 Messina 700 14.
- Glea: card 1 INBOX `[COPY: In the box]` text `Your Glea light, a USB charging cable and a silicone page-follower bookmark.` (note "Bookmark shown as an illustration" stays), button `[COPY: See what is inside]`. Card 2 LIFE-PARTNER `[COPY: Read without waking them]`, button `[COPY: Shop all colors]`.

### A.9 Four-column people grid (Loftie: multi_column "team of doctors")
- Header max 1000, H2 Austin 48/57.6 (40/48). Grid 4 x 286, gap 32/24 (2 x 163, gap 32/12 at 390). Images 286 square radius 8. h3 Austin 38/45.6 (32/38.4), sub Messina 18/21.6.
- Honesty substitution: no experts or endorsements. Same grid becomes `[COPY: Good to know]` with 4 square cards linking to help or journal content: (1) `How to clip it on` (P-07), (2) `Charging` (P-13 MACRO-CHARGE; charge time TODO(hidden)), (3) `Pick your glow` (GLOW-3000), (4) `Returns and shipping` (P-14 LINEUP). h3 at 38/45.6 is large; keep it (1:1) and keep titles to 2 to 3 words.

### A.10 Footer (dusk footer, global)
- Footer bg: dusk gradient (C.1), padding 56 48 0.
- Glass card: 1344x623, `rgba(251,247,237,.3)`, radius 40, padding 56 60 52 (36 28 40 at 390), shadow C.6.
- Card grid 465 / 709, gap 48. Left: newsletter `Be the first to know` style title Austin 26, email input + subscribe button 82x50 radius 4 `#191919`, social links (bordered icons, border alpha .7 to 1, bg to `rgba(25,25,25,.08)` .2s). Right: 3 link columns x 215, gap 32 (2 columns at 390), column titles Austin 19, links Messina at alpha .82 to 1 on hover. Bottom row: legal links.
- Two soft radial glows drift (9s and 13s infinite).
- Glea columns: `[COPY: Learn]` (About, Journal, How it works), `[COPY: Help]` (Help center/FAQ, Shipping, Returns, Contact, Warranty TODO(hidden) until terms exist), `[COPY: Legal]` (Terms, Privacy, Cookie preferences = existing ConsentLink, Do not sell / opt-out). Newsletter: existing FooterSignup with consent text (it creates Shopify customers: never submit tests). No app badges.

---
# B. Every other page

## B.1 Product page (template: loftie.com/products/loftie-lamp; 13092px at 1440, 14671 at 390)
Loftie Lamp is the closest match to Glea (one physical product, colors). Same order:

1. **Buy box** (section 994 tall at 1440, 1346 at 390).
   - **Gallery** left, 720x720 at x0 (full-left, radius 0), 390x390 full width on mobile. Slides crossfade `opacity .3s ease-in-out`. Dots under/over the image: 10px circles (8 at 390), active `#BEAA9E`, inactive white, shadow `0 0 0 2px #fff` + `rgba(0,0,0,.25)`, bg .3s. Glea slots: E.4 gallery order; color swap changes the first two images.
   - **Info column** at x763, width 593, side padding 35 (30 at 390). Order:
     1. H1 Austin 52/48.36 ink (36/33.48). Glea: `Glea book light` (Shopify title).
     2. Stars + review count row (Messina 15): **HIDDEN** until real reviews exist (render nothing, keep the component behind `REVIEWS_ENABLED=false`).
     3. Subtitle Messina 19/23.75. Glea `[COPY: Soft light, after dark.]`.
     4. Price Messina 500 18. Glea `$29.99` from Shopify.
     5. Color label Messina 15 `Color: <name>`. Loftie's orange low-stock label (12px `#D05500`): **NEVER** (no stock counters).
     6. Swatches: 40px circles, 3px `#FBF7ED` border, gap 8, swatch image or flat color, selected state border-color .2s ease-in-out. 6 Glea colors in Shopify order (Black, Amber, Pink, Purple, Lake Blue, White).
     7. Quantity dropdown (items 63x47, bg .3s ease-in-out) inline left of the ATC.
     8. ATC 520x55 radius 4, two-layer brown swipe (C.1), white Messina 400 21.6/48, `[COPY: Add to cart]`. Wired to the existing cart add (do not change logic).
     9. Loftie refurb card (`#F1E7DA`, radius 8, padding 14 16): no Glea equivalent. Replace with the existing bundle box in the same box style: `[COPY: Buy 2, save $5]` with BUNDLE image (from `site.bundle`). If the bundle is removed, render nothing.
     10. Trust row: 2x2 grid, icon + Messina 12. Glea (real facts only): `Free shipping over $45` / `$4.99 under $45`, `14-day returns`, `6 colors`, `Secure Shopify checkout`.
     11. Loftie HSA line: none for Glea.
     12. Accordions (Description / Key features / Tech specs): toggle Messina 600 16, padding 8 0, animated plus (pseudo-elements rotate, transform .4s ease-in-out); body Messina 14/24.27. Glea Tech specs list = allowed facts only; `TODO(hidden): charge time, lumens`.
2. **Logo marquee** (80 tall, gap 100, 60s linear infinite): press logos NOT allowed. Same strip becomes a **spec ticker**: Messina 14 uppercase-free items `9 LEDs · 3000K / 4500K / 6000K · Hold 4 s to dim · 1000mAh · Up to 80 h · 63 g`, same speed and gap. Paused under reduced motion.
3. **Reviews block** (H2 Austin 52/56.16, 3 cards gap 32, reveal 1s cubic-bezier(.16,1,.3,1) stagger .11s): **not rendered** until real reviews exist. Build the component with an empty data source; render nothing when empty (no placeholder text, no stars).
4. **Feature icon row** (H2 Austin 48/57.6, flex gap 15, 6 items, label Messina 14): Glea `[COPY: Everything you need to read at night]` with 6 items: 9 LEDs, 3 light colors, Hold to dim, 1000mAh, Up to 80 h, 63 g. Icons: our own line icons.
5. **Inset media hero 1** (1352x700 radius 20, inside 44 padding; 600 tall at 390): video bg, text block max 700 at left 94, H Austin 52/54.6 cream, sub Messina. Glea: `[COPY: Clip it on. Keep reading.]`, clip `glea-pdp-clip.mp4`, poster LIFE-HANDS.
6. **Inset media hero 2** (same): Glea `[COPY: Your page glows]`, poster LIFE-NIGHTSTAND.
7. **Image-with-text with tabs** (image 605x648 radius 8; text tabs, content visibility .6s, 8s progress bar per tab): Glea `[COPY: Pick your glow]` tabs `3000K` / `4500K` / `6000K` swapping GLOW-3000/4500/6000. No health or sleep-science claims.
8. **Slideshow with swatch nav** (H Austin 48; slides 825 + 400 peek, gap 2%; swatch nav buttons 50px with 1px white ring): Glea `[COPY: Six colors]`, slides = `glea-hover-<color>` (fallback `glea-cut-hero-<color>-lit`), nav = 6 color swatches.
9. **Image-with-text** (605 image radius 8, H2 Austin 48/57.6): Glea `[COPY: One button]` (MACRO-BUTTON).
10. **Image-with-text reversed**: Glea `[COPY: Bend it where you need it]` (BENT) or `Inside the light` (render, allowed specs only).
11. **Experts grid**: no Glea equivalent; render the `In the box` 3-card grid in the same grid metrics (286 squares radius 8; 3 items: light, USB cable, bookmark (illustration label)).
12. **Big overlay banner** (1380x700, radius 20, image overlay, cream button 266x57 radius 4 with brown text): Glea `[COPY: Read without waking them]` LIFE-PARTNER, button `[COPY: Shop all colors]`.
13. **"At home" rail** (H2 Austin 48/57.6, images 300x373 radius 0, opacity .4s, drag handles; 225x280 at 390): Glea `Glea at home`, LIFE-* x7, AI-image label under the rail stays.
14. **FAQs** (container padding 0 30, H2 Austin 48/57.6, toggles 668x60 padding 21 24 Messina 700 16, color/underline .2s): existing FAQ data (allowed facts only).
15. **You may also like** (H2 Austin 48/52 ls -1; grid 3 x 309, gap 48/29; images 309 square radius 8; primary to secondary swap .4s ease-in-out; title Austin 23.4/32.76 ls -.6, italic tagline Austin 19.8): Glea `More colors`, 3 or 6 color cards (`glea-card-<color>` + `glea-hover-<color>`).
16. **Reviews widget** (Okendo, 2281px): not rendered.
17. Footer.
- **Sticky ATC** (desktop): appears after the main ATC leaves view; fixed at top 46 (header is hidden on scroll down), full width 1440x121, bg `#FBF7ED`, shadow C.6; content: product name + selected color, price, color select, quantity stepper (- 1 +), Add button 198x47. Mobile: fixed bottom bar. Transition opacity/transform/visibility/top .25s ease-in-out.
- Clock PDP (`/products/loftie`) extra patterns available if the owner wants more depth: feature cards grid 2 x 528 gap 52/44 radius 22 with colored pill labels (radius 999, padding 9 18 9 11), comparison chart (max 520), USP icon grid. Not needed for 1:1 with the lamp template.

## B.2 Collection (/collections/all; Loftie 3248px at 1440)
- No banner. Grid starts right under the header (y186). Container 1600, padding 0 30 (0 26).
- Grid 3 columns x 440.66, gap 48 row / 29 col (390: 2 x 177, gap 32/10).
- Card: image 441 square radius 8, cover; hover crossfade to second image .4s ease-in-out; small 50x50 sticker slot top-left (Glea: none, or `New` only if true). Title Austin 27/37.8 ls -.6; review count: OMIT; price Messina 500 15 ls .36; `View` link Messina 14.
- Then **promo split** (container padding 0 115.2, grid 2 x 580, gap 50): image 580x591 radius 8 + stacked link rows 477x62 padding 21 24 Messina 700 18 (Loftie: guide links). Glea: STUDIO-CREAM + link rows `How to clip it on`, `Charging`, `Pick your glow`, `Returns and shipping`.
- Then **journal row** (3 x 381, gap 48; images 381x500 radius 8; small kicker Austin 18, H Austin 48/52): Glea BLOG-01..03.
- Filtered view (Loftie holiday shop pattern, use for color filter): intro max 560, H1 Austin 56/57.12 (40/40.8), pills flex gap 8 (radius 5, padding 11 16, 38 tall; active `#7A1F27` cream), grid 4 x 312 gap 32/24 (2 x 169 gap 24/12), images 312 radius 8, group headings Austin 32/35.2. Glea: pills = 6 colors + `All`.

## B.3 Cart drawer
- Panel 440 wide from the right, full height, bg `#FBF7ED`, radius 0, `right .3s linear` (300ms in and out). Overlay full-screen `rgba(0,0,0,.3)`.
- Header row `Your Cart` + count; empty state shows best sellers (Glea: the light card + `Shop all colors`).
- Glea keeps its ShipBar (real rule) at the top of the drawer, cart lines, bundle note, checkout button (ATC style, radius 4) linking to Shopify `checkoutUrl`. Do not change cart logic.

## B.4 About (/pages/about-us; 5811px)
1. Image hero 1440x576 (390x519), cover, H Austin 60/60 cream ls -.9 (36/40).
2. One intro line, Messina 18/19.8.
3. Two promo blocks side by side 910 + 440, height 450, radius 8, bg `#F7F8FD`, padding 48 (stacked on mobile).
4. Founder note: image 605x756 radius 8 + text, H2 Austin 48/57.6. Glea: `[COPY: Why we made Glea]` written by the owner. TODO(hidden) until written; no invented founder story.
5. Values grid: max 1000, H2 Austin 48/52. Glea `[COPY: What we care about]`, owner-written.
6. Timeline gallery: horizontal row of 331x331 radius 5 cards with joined prev/next square buttons 56 (`#191919`). Glea: TODO(hidden) until real milestones exist; otherwise skip.
7. CTA band: H2 Austin 48/57.6 + `Shop Now` 142x48 radius 4 dark.
8. Product carousel: 309 cards (same as related).
9. Contact form: H1 Austin 48, fields, Submit 460x50 radius 4 cream two-layer swipe with brown text, `Email us` link. Glea contact form posts to a mailto or the existing contact handler only (never `/api/subscribe`).

## B.5 Journal (/pages/loftie-times; 4204px)
- Whole page on black `#000` with cream/white text.
- Hero 561 tall: centered masthead image + title Austin 50/46.5 cream.
- Category rows: padding 0 80 160, big card images 451x648, `Read` text buttons; titles Austin 50 white, body Messina 15/25.
- Most read: padding 60 0 120, title Austin 40, 2-column list, item titles Austin 30/36.
- Article template (from export `blogs/`): hero image, reading column about 680, related row.
- Glea: masthead = Glea wordmark + `[COPY: Journal]`; posts only owner-approved; empty state links to Help.

## B.6 Help / FAQ (/pages/loftie-support; 5139px)
- Section bg `#FBF7ED`, wrap max 1240 padding 0 48 (0 20).
- Top: grid 549 / 523, gap 72. Left: kicker Messina 14 `#5C534B`; H1 Austin 100.8/104.83 (52/54.08); sub Messina 300 21/31.5 `#5C534B`; search field + `Ask` pill 105x48 radius 999 dark (input row flex gap 14); popular links flex gap 6/18. Right: image 523x654 radius 28.
- Topic cards: 271x203 radius 22 padding 24, `linear-gradient(to top, #F0D6B5 0%, #F7E9D3 70%)`, image transform .6s on hover, outline-color .2s focus.
- Question buttons 477x52 radius 14 padding 14 18: active dark `#191919` cream, others `#FFFDF8` with 1px `#E7DDCC`; bg/color/border .2s. Manual button 300x44 radius 12 dark.
- Bottom band: 1336x684 radius 32 padding 56, `linear-gradient(to top, #F0D6B5 0%, #FBF7ED 70%)`.
- Answer pop animation 250ms.
- Glea: H1 `[COPY: How can we help?]`; topics `Using Glea`, `Charging` (charge time TODO(hidden)), `Orders and shipping`, `Returns`; answers from `lib/content.ts` (allowed facts). Search filters FAQ items client-side (existing FaqTabs).

## B.7 Returns (/pages/returns; 5891px)
- Header band: image background with H1 Austin 67.86/63.11 white (34/37.4), breadcrumb Messina 12 (opacity .2s hover).
- Intro text column max 850, Messina 18/22.5.
- Loftie return-deadline box (computes a date): Glea cannot compute (delivery date unknown). TODO(hidden); do not render.
- 5 image-with-text Q&A rows: image 605 square radius 8 (338 at 390), H2 Austin 48/57.6 (40/48), p Messina 18/19.8, alternating sides.
- Glea rows (facts only): `[COPY: What is your return policy?]` (14 days, email hello@getglea.com with the order number), `[COPY: How do I start a return?]`. Other rows TODO(hidden) until the owner confirms terms.

## B.8 Warranty (/pages/warranty-policy) and Shipping (/pages/shipping)
- Same header band + text column (max 850), H3 Austin 32/40 (24/30), body Messina 18/22.5.
- Glea shipping: `$4.99 under $45, free over $45`; delivery times TODO(hidden). Glea warranty: TODO(hidden), page not linked until terms exist (Shopify policies stay at /policies/*).

## B.9 Contact
- Loftie has no /pages/contact (404; the form lives at the bottom of About). Glea: keep our /pages/contact but render it with the About contact-form block (B.4.9). 404 page: `Page not found` Austin 36, `Back to home` 195x48 radius 4 dark.

## B.10 Menus
- Mega menu: none (plain links). Mobile menu: left drawer 320 wide, `.6s cubic-bezier(.75,0,.175,1)`, overlay fade .6s ease-in-out. Search: left drawer 347 wide same curve (Glea may keep /search page link).

---
# D. Diff vs current glea-store (commit d4e1671, preview dpl_4qXQXJxSi3UszKsMzjJ3E2vzZjhV)

Every row is a concrete deviation to fix. "Ours" is measured from `app/globals.css`, `app/shell.css`, `app/page.tsx`, `components/lf/*`. Rows are ranked by visual impact (1 = biggest).

| # | Area | Ours now | Loftie (target) | Fix |
|---|---|---|---|---|
| 1 | Spec/stats band | White card, 1px `#e2d8c4` border, radius 16, 2-col grid, 4 rings: stroke amber `#f4a949` width 4, upright numerals 2.25rem | Inset 1352x388 radius 20 band, `linear-gradient(160deg,#522D27,#F0D6B5)`, 3 thin rings (track 1.3 at .5, value 1.7 cream, round cap, glow filter), italic serif numerals about 41px, 1500ms draw | Rebuild per A.2 + C.9 |
| 2 | Palette | Navy `#1e2433` + amber `#f4a949`/`#8a4b0c` accents, page `#fbf3e4`, ink `#14161f` | Brown `#522D27`, sand `#F0D6B5`, page `#FBF7ED`, ink `#191919`, wine `#7A1F27` | Replace tokens per C.1; remove navy and amber as accents |
| 3 | Footer | `linear-gradient(160deg,#d9c39b 0,#6b4e71 45%,navy 100%)`, card radius 24 | Page-wide dusk `172deg` 6-stop gradient, glass card `rgba(251,247,237,.3)` radius 40, padding 56 60 52, shadow `0 30px 70px rgba(10,8,24,.28)`, drifting glows | A.10 |
| 4 | Button shape and feel | Radius 10 everywhere, 15px 600, min-height 50, navy/cream variants | 4px main (hero 266x57, ATC 520x55), 5px section CTAs (padding 14 32, 700 14), 999 pills; ATC has the slanted brown swipe hover (.5s cubic-bezier(.215,.61,.355,1)) | C.7; ATC per B.1 |
| 5 | "Who" section | 4 cards, 4:5 radius 16 on plain page bg | Rounded r32 band with `0deg #F0D6B5 to #FBF7ED 70%` gradient, 5 cards 235x314 r20, hover scale 1.04 over .5s, dark r5 button | A.3 (add LIFE-HANDS as 5th) |
| 6 | Tabs | Bordered r10 white tabs with amber shimmer, navy card panel | Pills r999, active = `120deg #E1BF91/#282E7E/#E1BF91` shimmer 5s; 3-col panel 333/509/360 with big serif line, r8 photo, floating product; H2 66 + italic 70 | A.6 |
| 7 | Split block | Tinted bg, radius 16, plain 2-col | 1352x464 stage, dark media + `105deg #FBF7ED to #F0D6B5` text panel, floating `165deg #F0C39A to #B96A45` card with shadow, scroll timeline | A.5 |
| 8 | Section order / set | hero, rings, who, 2 cards, split, tabs, DimDemo, duo panels, GoodToKnow, AiNote | hero, stats band, who, featured 2-up, split, tabs, two circles, two-up dark cards, 4-col grid, footer | Reorder; DimDemo becomes the two-circles section (A.7); GoodToKnow takes the 4-col grid (A.9) |
| 9 | Typography scale | H2 `clamp(2rem,3.4vw,3rem)/1.08`; body 17; hero 64 to 88 clamp | Fixed per section: H2 40 (home top) / 48/57.6 (most) / 52 (PDP), hero 65/68.25, body 18/31.2 (17 at 390) | C.3 exact px; no clamps at 1440 and 390 |
| 10 | Header | Capsule already close (72 tall r999, same dual shadow and blur, hides on scroll down via transform .35s), but it sits in flow at x12 with padding 10 12, over-hero border alpha .22, navy-tinted veil `rgba(20,22,31,.06)` | Capsule overlays the hero at x24 y60 (1392 wide), border `rgba(255,255,255,.5)`, veil `rgba(20,14,11,.06)`, PDP `rgba(251,247,237,.3)`, hover solid `#FBF7ED` + stronger shadow | A.0b: position, inset 24, tints, hover state |
| 11 | Announcement bar | Navy, 50 tall | `#522D27`, 46 tall (50 at 390), Messina 700 17.06 cream | A.0 |
| 12 | Featured product cards | 1:1 r16 cards | 569x363 r14 landscape, info row title/tagline left + price right, no hover | A.4 |
| 13 | Dark panels | Navy r16 image panels | `#191919` r32 cards 688 wide, gap 20, video bg, text 408 bottom-left, cream r5 button | A.8 |
| 14 | Containers | `--wrap 1360`, gutter 16, `--container 1200` | 1600 container, padding 30 (26 mobile); inset bands 1352 (44 outer padding); rounded bands 1396 at x22 | C.4 |
| 15 | Image radii | 16 on most images | 0 gallery, 8 grids, 14 featured, 20 who and media heroes, 22/28 support, 32 bands, 40 footer | C.5 |
| 16 | Hero | Product cutout at the bottom of the hero; button 232x43 min, 14px 700 at all sizes | No cutout; 266x57 at 1440, 232x43 at 390; H1 65/68.25 | A.1 (cutout behind a flag, off) |
| 17 | PDP gallery | Sticky, radius 16 | 720x720 flush left, radius 0, crossfade .3s, 10px dots | B.1 |
| 18 | PDP swatches | 40px plain | 40px with 3px `#FBF7ED` border ring, border-color .2s | B.1 |
| 19 | PDP quantity | r10 stepper | Dropdown inline with ATC (items 63x47) | B.1 |
| 20 | PDP accordions | `<details>` with .3s keyframe, plus rotates 45deg .3s ease, summary padding 16 0 (22 0 at large) | Height tween about .4s, plus rotates 90deg .4s ease-in-out, toggle Messina 600 16 padding 8 0, body 14/24.27 | B.1, C.8 |
| 21 | PDP sticky ATC | Exists: desktop top bar min-height 96 with swatch buttons and a 240x54 button, shadow `0 8px 24px rgba(20,22,31,.08)` | 121 tall at top 46, title + color, price, color select, qty - 1 +, Add 198x47; shadow `0 6px 5px -5px rgba(217,214,205,.4)` + 1px `#D9D6CD`; .25s ease-in-out | B.1 |
| 22 | PDP lower sections | Our own order | Lamp order B.1 items 2 to 15 (spec ticker, icon row, 2 inset media heroes, temp tabs, swatch slideshow, 2 image-with-text, in-the-box grid, overlay banner, at-home rail, FAQs, more colors) | B.1 |
| 23 | Collection | Page heading block + our card grid (`.lf-pcard` 1:1 r16) + accordion split with STUDIO-CREAM | No banner; 3 x 441 r8 grid gap 48/29 with image swap .4s; promo split; journal row | B.2 |
| 24 | Cart drawer | 440 wide, `transform .3s ease` | 440 wide `#FBF7ED`, slide .3s linear, overlay `rgba(0,0,0,.3)`, empty state with best-seller cards | B.3 |
| 25 | Journal | Light page | All-black journal layout | B.5 |
| 26 | Help | FAQ tabs page | Support hub layout (100.8 H1, gradient topic cards r22, question buttons r14, bottom band r32) | B.6 |
| 27 | Policy pages | Plain text page | Image header band + 850 column; returns as image-with-text Q&A rows | B.7, B.8 |
| 28 | Mobile menu | Already matches: left drawer 320, .6s cubic-bezier(.75,0,.175,1) | Same | Verify only |
| 29 | Fonts | Newsreader + DM Sans at our sizes | Same stand-ins, at Loftie metrics (Austin/Messina are licensed) | C.2, C.3 |
| 30 | Scroll reveals | Some | 0.5s power2.out, stagger .08, start 88% on all section heads and cards | C.8 |

---

# E. Rules

## E.1 Recreate, do not copy
- Build everything in our own code from these measurements. Never copy Loftie HTML, CSS files, JS, class names in bulk, images, videos, icons, fonts, copy, product names, logos or brand marks. The offline export (`/workspace/eco/reference-html/loftie-export/`) is for looking only; it stays on the build box and never enters the repo, the pack or a deploy.
- Matching layout, spacing, gradients and motion values is the brief (owner instruction, T-053). Brand identity stays Glea: Glea wordmark, Glea name, Glea copy, Glea photos and video.

## E.2 Honesty (non-negotiable)
- No reviews, ratings, stars, review counts, testimonials, quotes attributed to people, press logos, "as seen in", expert or doctor endorsements, survey stats, percent-of-customers claims, countdown timers, fake deals, strike-through prices without a real compare-at, low-stock or "only X left" counters, "X people viewing".
- Loftie slot to Glea substitute: survey stats band = real-spec band (A.2); testimonial in tabs = Glea-written scenario line (A.6); expert grid = Good to know (A.9) / In the box (B.1.11); press marquee = spec ticker (B.1.2); reviews block and widget = not rendered until real reviews exist; refurb card = bundle box or nothing; low-stock label = never.
- Allowed product facts only: 9 LEDs; 3000/4500/6000K; hold 4 s to dim 100% to 10%; 1000mAh; up to 80 h (varies); 63 g; $29.99; $4.99 shipping under $45, free over $45; 14-day returns; 6 colors (Black, Amber, Pink, Purple, Lake Blue, White).
- Unknown and hidden (TODO comments only): charge time, lumens, delivery times, warranty terms, founder story, milestones.
- "Buy 2, save $5": shown only while the matching Shopify automatic discount is live (existing `site.bundle` config). Otherwise hide it.
- Lifestyle images are AI-made: keep the "AI-generated image" label under the at-home rail. Video clips are mood footage; never caption a person as a customer or as endorsing.
- Ring fills (A.2) show real ranges, not percentages of people.

## E.3 Keep untouched
Shopify Storefront wiring (`lib/shopify/*`), cart logic and drawer data flow, the checkout link (Shopify `checkoutUrl`), SEO (metadata, JSON-LD, sitemap, robots), analytics (GA4 / Meta / TikTok: view_item, add_to_cart, begin_checkout; UTM storage), the consent banner and its gating, the chat widget, the email popup and `/api/subscribe` (creates real Shopify customers: never submit test emails), noindex on preview (meta robots + `X-Robots-Tag`), prefers-reduced-motion handling. Do not publish any Shopify theme. Do not change Vercel project settings or connect git to the Vercel project. Env var NAMES (values never in code or chat): `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`, `NEXT_PUBLIC_SHOPIFY_API_VERSION`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEX`, GA4/META/TIKTOK ids, `POPUP_OFFER_CODE`, `POPUP_OFFER_TEXT`, `NEXT_PUBLIC_ON_VERCEL`, `VERCEL_URL`.

## E.4 Image slot map by filename
Files live in `public/media/` (WebP). New or replaced images: drop `<slot>.<ext>` in `/workspace/eco/glea-renders/` and run `node scripts/import-renders.mjs`; videos via `scripts/import-videos.mjs` into `public/media/video/`. `lib/media-server.ts` falls back to the next file, then a styled placeholder; a missing file never breaks a page. Full list: `docs/IMAGE-SLOTS.md`, `docs/reference/T-049-slot-map.md`.

| Loftie slot (page / section) | Size to fill (1440 / 390) | Glea file (exists today unless marked NEW) |
|---|---|---|
| Home hero video + poster | 1440x900 / 390x844 | `video/glea-hero-d.mp4` + `glea-hero-d.webp`, `video/glea-hero-m.mp4` + `glea-hero-m.webp`; poster NEW `hero-frame-01-16x9` / `-9x16` (fallback `glea-hero-01-d-2000` / `-m-750`) |
| Home who card 1 to 5 | 235x314 (3:4) / 161x161 | `glea-life-partner-bed`, `glea-life-sofa-blanket`, `glea-life-travel-hotel`, `glea-life-hands-reading`, `glea-life-gift-unwrap` |
| Home featured 2-up | 569x363 / 304x194 | `glea-studio-navy-black-lit`, `glea-cut-lineup-6` (on `--page`) |
| Home split media | 744x464 / 358x360 | `glea-life-nightstand` (NEW clip `video/glea-split-clip.mp4` optional) |
| Home tabs col 2 (x4) | 509x607 / 342x474 | `glea-life-hands-reading`, `glea-life-partner-bed`, `glea-life-armchair`, `glea-life-ugc-stack` |
| Home tabs col 3 | 360x608 / 181x306 | `glea-cut-hero-black-lit` (transparent, floating) |
| Home circles | 400 round / 300 | posters `glea-macro-button-black`, `glea-cut-hero-amber-lit` / `glea-cut-light-4500k-black` / `glea-cut-light-6000k-black`; NEW clips `video/glea-circle-dim.mp4`, `video/glea-circle-temp.mp4` |
| Home two-up dark cards | 688x480 / 358x600 and 440 | `glea-flatlay-inbox-black`, `glea-life-partner-bed` |
| Home 4-col grid | 286 square / 163 | `glea-how-01-clip-600`, `glea-macro-charge-black`, `glea-how-02-glow-600`, `glea-tile-03-gift` |
| PDP gallery (lit/unlit per color, then fixed) | 720 square / 390 | `glea-cut-hero-<color>-lit`, `glea-cut-hero-<color>-unlit`, then `glea-gal-01-main-studio-1100`, `glea-gal-02-partner-1100`, `glea-gal-03-brightness-1100`, `glea-gal-05-neck-1100`, `glea-gal-06-clip-1100`, `glea-gal-07-charge-1100`, `glea-gal-08-size-1100`, `glea-gal-09-compare-1100`, `glea-gal-10-in-box-1100` |
| PDP swatches | 40 round | flat color or `glea-var-<color>-1100` crop |
| PDP inset media heroes | 1352x700 / 358x600 | `glea-life-hands-reading`, `glea-life-nightstand` (NEW clip `video/glea-pdp-clip.mp4` optional) |
| PDP temp tabs | 605x648 | `glea-cut-hero-amber-lit` (3000K stand-in until NEW `glea-glow-3000`), `glea-cut-light-4500k-black`, `glea-cut-light-6000k-black` |
| PDP swatch slideshow | 825 wide slides | NEW `glea-hover-<color>`; fallback `glea-cut-hero-<color>-lit` |
| PDP image-with-text | 605 | `glea-macro-button-black`, `glea-cut-bent-black-lit` |
| PDP in the box | 286 square | `glea-flatlay-inbox-black`, `glea-macro-clip-black`, `glea-gal-10-in-box-1100` |
| PDP overlay banner | 1380x700 | `glea-life-partner-bed` |
| PDP at-home rail | 300x373 / 225x280 | `glea-life-*` (7), AI label stays |
| Related / more colors / collection cards | 309 / 441 square | `glea-card-<color>` + hover NEW `glea-hover-<color>` (fallback `glea-cut-hero-<color>-lit`) |
| Collection promo split | 580x591 | `glea-studio-cream-white-lit` |
| Journal / blog cards | 381x500, 451x648 | `glea-blog-01-partner-750`, `glea-blog-02-choose-750`, `glea-blog-03-travel-750` (re-export taller crops: NEW) |
| About hero | 1440x576 / 390x519 | `glea-about-01-d-1440` / `glea-about-01-m-750` |
| About founder image | 605x756 | `glea-about-02-750` (owner to confirm) |
| Help hero image | 523x654 r28 | `glea-life-armchair` |
| Help topic cards | 271x203 | `glea-how-01-clip-600`, `glea-macro-charge-black`, `glea-life-travel-hotel`, `glea-tile-03-gift` |
| Policy header band | 1440 wide | `glea-coll-d-1440` / `glea-coll-m-750` |
| Returns Q&A rows | 605 square | `glea-flatlay-inbox-black`, `glea-tile-02-travel` |

---

# F. Build order and QA

## F.1 Build order (one commit per step; preview deploy only after a step passes)

| Step | Work | Acceptance criteria |
|---|---|---|
| 1 | Tokens and fonts: C.1 colors, C.2 stand-ins at C.3 metrics, C.4 containers, C.5 radii, C.6 shadows, C.7 buttons, C.8 motion vars | `getComputedStyle(body)` bg `rgb(251, 247, 237)`, color `rgb(25, 25, 25)`, font-size 18px / 17px at 390; no `#1e2433`, `#f4a949`, `#fbf3e4` left in CSS (grep); buttons measure per C.7 within 1px |
| 2 | Announcement bar + capsule header (position over hero, tints, hover state; hide on scroll exists) | Bar 46/50 tall `#522D27`; capsule at x24 y60 1392x72 r999 (390: x12, 366x54, r16); hidden after scrolling 400px down, visible after 50px up; transitions .32s |
| 3 | Home A.1 hero | 900/844 tall; H1 65px/68.25 and 32/29.76; button 266x57 and 232x43, radius 4; cream text contrast >= 4.5:1 on poster |
| 4 | Home A.2 spec band | Card 1352x388 r20 at 1440; gradient sampled per F.2; 3 rings 190px, stroke 1.7 cream; numerals italic; only allowed facts; draw 1.5s once; static under reduced motion; text contrast AA |
| 5 | Home A.3 who band | Band 1396 wide r32 at x22; 5 cards 235x314 r20 gap 16; hover scale 1.04 over .5s; button 211x42 r5 |
| 6 | Home A.4 featured 2-up | Cards 569x363 r14 gap 30; price 18px 500; bundle card only if discount live |
| 7 | Home A.5 split | Stage 1352x464, cols 744/608; both gradients exact; floating card 230x149 r10 with shadow |
| 8 | Home A.6 tabs | Pills 157x52 r999; active gradient + 5s shimmer; panel 333/509/360 gap 24; no quotation marks or names |
| 9 | Home A.7 circles, A.8 dark cards, A.9 grid | Circles 400/300; dark cards 688x480 r32 gap 20; grid 4x286 gap 32/24 |
| 10 | Footer A.10 | Dusk gradient stops and 172deg exact; glass card 1344 wide r40 padding 56 60 52; newsletter consent intact |
| 11 | PDP B.1 buy box + sticky ATC | Gallery 720 r0; info x763 w593; H1 52/48.36; swatches 40 + 3px ring; ATC 520x55 r4 swipe (hover bg-position goes from `100% -100%` to `100% 25%`); stars, refurb, HSA, low stock absent; sticky top bar 121 tall |
| 12 | PDP B.1 lower sections 2 to 16 | Section order and sizes per B.1; reviews and widget absent; spec ticker uses allowed facts only |
| 13 | Collection B.2 + cart drawer B.3 | 3x441 r8 gap 48/29; swap .4s; drawer 440 wide, right .3s linear; checkout link unchanged |
| 14 | About, journal, help, returns, shipping, warranty, contact, 404 (B.4 to B.9) | Layout per spec; TODO(hidden) items not rendered; contact form never posts to /api/subscribe |
| 15 | Motion pass + a11y + perf | Reveals per C.8; reduced motion kills loops/reveals/video; Lighthouse mobile perf 90+, a11y 100; LCP < 3 s; CLS < 0.05; keyboard focus visible everywhere |
| 16 | Full side-by-side QA (F.2) | Every D row reads "matches" |

## F.2 Side-by-side QA procedure (per section, 1440 and 390)
1. Screenshots: Playwright Chromium, viewport 1440x900 and 390x844 (DPR 1), full page, after scrolling once to the bottom and back to trigger lazy loads and reveals, with `prefers-reduced-motion` off. Loftie reference shots already exist in the pack (`loftie-ref/`, `loftie-ref-t053/s-*.jpg`). Capture ours from the Vercel preview into `qa/shots/compare-<step>/`.
2. Per section crop: use each section's bounding box (Loftie: `.shopify-section` elements excluding popup, cart and app-optim sections; ours: `[data-sec]` attributes, add them) and save `ours-<page>-<sec>-<w>.png` and `loftie-...png` side by side (concat with PIL).
3. Boxes and spacing: compare `getBoundingClientRect()` of the section, its container, heading, grid items, images and buttons. Tolerance +/-2px for sizes and offsets; exact for radius, font-size, line-height, letter-spacing (computed). Script: `tools/measure.js` + `tools/run.py` (pack) produce JSON with the same shape for both sites; `tools/summ.py` / `tools/outline.py` print them.
4. Gradients: sample pixels with PIL at 5 points along the gradient line (0, 25, 50, 75, 100% of the box diagonal for the stated angle) on both crops; every channel within 6 RGB (scrims/text excluded; sample empty areas). Also assert the computed `background-image` string matches C.1 exactly.
5. Motion: with `tools/hover.py` / `tools/inter.py`, hover each interactive (buttons, cards, swatches, header) and diff computed styles before/after; transition-duration and timing-function must equal C.8. Record a 2 s video of the ATC hover, tab shimmer and ring draw on both sites and compare by eye.
6. States: header scrolled/hidden, sticky ATC visible, cart drawer open, mobile menu open, accordion open (compare to `probe-*` reference shots).
7. Honesty sweep: grep the built HTML for `review`, `rating`, `stars`, `as seen`, `left in stock`, `%` near "customers", timers; and confirm every visible product fact is in E.2.
8. Contrast: axe-core on each page at both widths; zero AA failures.
9. Log results in `qa/QA-LOG.md`: per page, per section, per width: pass or the measured delta.

---

# Reference files (in the pack and repo)
- `docs/reference/T-048-loftie-analysis.md`, `T-048-loftie-interactions.md` (earlier measurements; where they differ, this v2 wins).
- `docs/reference/T-049-slot-map.md`, `docs/IMAGE-SLOTS.md`.
- `docs/reference/T-051-hero-diff.md`.
- v1 of this prompt: `T-052-master-build-prompt-v1.md` (output folder only).
- Offline Loftie export (look only, build box): `/workspace/eco/reference-html/loftie-export/`.
