# T-048 Loftie analysis (layout, tokens, type, components)

Sources: English export in /workspace/eco/reference-html/loftie-export/ (frontpage, lamp PDP, lamps collection, CSS) and live loftie.com measured with Playwright at 1440 and 390 on 2026-11-03. Reference screenshots: /workspace/eco/glea-store/qa/shots/loftie-ref/loftie-{home,product,collection,blog,support}-{desktop,mobile}.png. Used for layout and measurement only. No Loftie HTML, CSS, JS, images, copy or brand assets are in the Glea repo.

## 1. Tokens

| Token | Loftie | Glea (T-048) |
|---|---|---|
| Page background | rgb(251,247,237) cream | #fbf3e4 cream (theme) |
| Text | rgb(25,25,25) | #14161f ink |
| Heading color | rgb(82,45,39) brown | #1e2433 deep navy |
| Border | rgb(217,214,205) | #e2d8c4 |
| Accent / announcement bg | rgb(82,45,39) | #1e2433 navy |
| Highlight nav item | rgb(122,31,39) | #8a4b0c amber ink (AA on cream) |
| Warm accent | peach/brown gradients | #f4a949 amber glow |
| Button radius | 4px | 10px (brief: 10 to 12px, no pills) |
| Block radius | 16px (8px reduced) | 16px (8px small) |
| Container | max 1600px, gutter 26px (24 header inset) | max 1600px, gutter 24px mobile / 26px desktop. Text sections cap at 1200px |
| Section spacing | about 64 to 96px desktop, 48px mobile | 88px desktop, 56px mobile |
| Swatch | circle (100%) 40px | circle 40px |

Breakpoints used by Loftie: 741/740, 1000/999, 1200, 1400, 1600 (plus 749/768/1024 in sections). Glea uses 740 and 1000 as the main switches, 1200 for wide layouts.

## 2. Type

| Use | Loftie | Glea |
|---|---|---|
| Headings | Austin News Deck Roman 400 (Commercial Type, licensed) | **Newsreader** 400 / 400 italic (Google Fonts, free, next/font). Closest free high-contrast news serif |
| Body / UI | Messina Sans (Luzi Type, licensed) | **DM Sans** (free, already loaded). Closest free low-contrast grotesk |
| Hero h1 | 52 to 64px desktop, ~36px mobile | clamp(2.4rem, 5vw, 4rem) |
| h2 section | 48px desktop / 40px mobile (home 40px) | clamp(2.25rem, 3.4vw, 3rem) |
| PDP title | 52px | clamp(2.4rem, 3.6vw, 3.25rem) |
| Card title | 22px serif | 1.375rem serif |
| Body | 18px desktop, 16 to 17px mobile, line-height ~1.7 | 17px desktop / 16px mobile, 1.65 |
| Buttons | 16px (14px mobile), weight 500 to 600 | 16px / 15px, weight 600 |
| Announcement | 17px desktop / 12.9px mobile | 15px desktop / 13px mobile |
| Italic second lines | used in section titles ("We've got the rest.") | used once per page max, Newsreader italic |

Both Loftie fonts are commercial, so we substitute: Austin News Deck -> Newsreader, Messina Sans -> DM Sans. Fraunces is removed.

## 3. Shell

- Announcement bar: one static centered message, 46px desktop / 50px mobile, not sticky. Glea: "Free US shipping on orders over $45 · 14-day returns".
- Header: sticky under the bar, 100px band with a 72px inner bar inset 24px. Transparent with white text over the home hero (hero runs under it), solid cream capsule after scroll (radius 999px, blur, soft shadow). Hides on scroll down, shows on scroll up. Logo left, 4 nav links next to it, account/search/cart icons right, cart count in a 24px brown circle. Glea: logo, nav (Shop all colors, The light, Journal, Help), search and cart icons. No account icon (no customer accounts).
- No mega menu (plain links). Mobile: hamburger opens a 320px left drawer.
- Cart drawer: 440px from the right, header "Your Cart" with count, empty state with product links.
- Footer: big rounded (16px) gradient card (cream to dusk), logo, "Be the first to know" signup, 3 link columns (Learn / Partner With Us / Support), socials, app badges; under it a centered row: copyright, Terms, Privacy, country/language selects, payment icons. Glea: same card and rhythm; columns Shop / Learn / Help, Instagram, signup; bottom row copyright, policy links, privacy choices, cookie settings. No payment logos (we do not render brand logos), no country selector (US only).

## 4. Home section map

| # | Loftie | Glea replacement (same slot rhythm) |
|---|---|---|
| 1 | Full-bleed hero, centered serif h1, sub, cream button | Full-bleed hero (HERO-01), "Soft light, after dark.", sub, cream button "Shop the light" |
| 2 | Rounded gradient card, survey % rings (3) | Rounded gradient card, maker spec rings: 9 LEDs, 3 light colors, up to 80 h, 63 g (labelled maker's figures). No survey numbers |
| 3 | "Who are you shopping for?" 5 portrait cards on a peach rounded panel + dark button | "Who is it for?" 4 portrait cards (Reading in bed / Next to a sleeper / Travel / A gift) on an amber-cream rounded panel + navy button |
| 4 | "Gifts they'll use every night" 2 large product cards | "Six colors, one soft glow" 2 large cards (Warm colors / Cool colors) linking to the collection with color filter |
| 5 | Split rounded panel image + text + button | Split panel: lifestyle image + "Your page glows. The room stays dark." |
| 6 | Tabbed story with 4 pill tabs, quote + image | Tabbed "Every night" story, 4 tabs (Wind down / Reading in bed / Travel / Gifting), honest Glea copy (no testimonial) |
| 7 | Two-phase alarm, 2 circles | "Hold 4 s to dim" two circles: 100% and 10% |
| 8 | 2 rounded dark promo cards | 2 rounded promo cards: "In the box" and "Six colors" |
| 9 | Experts row (4 portraits) | Journal row (3 posts) |
| 10 | Footer | Footer |

## 5. Collection map

Loftie: left sidebar filters (lists), "Shop All" serif title, "Hide filters" toggle, 3-column grid of square rounded cards (serif title, stars, price, "View"), then an accordion + image split, then a 3-card journal row, footer.
Glea: same sidebar with the 6 colors as filters (plus "All"), "Shop all" title, hide filters toggle, 3-column grid (2 on mobile) of the 6 color cards (no stars), accordion + image split (shipping, returns, care, what is in the box), journal row.

## 6. PDP map

Loftie: 2 columns (gallery left 50%, dark bg, dots; buy box right): title 52px, stars + review count, subtitle, price, color label + swatches, qty stepper + Add to cart, refurbished box, trust row (4 icon items in 2x2), HSA box, accordions (Description / Key Features / Tech Specs). Then press marquee, review cards, 6-icon feature row, big rounded image panels with text, alternating split rows, "Set any mood" color dots + video, experts row, "Perfect match" cross-sell panel, UGC "at home" carousel, centered FAQ (~520px... measured max ~ 760px container), "You may also like" 3 cards, reviews widget, footer.
Glea: same 2 columns; title, subtitle, price, color label + 40px swatches with per-color image swap, qty + Add to cart, "Buy 2" box in the refurbished slot, trust row 2x2 (free shipping over $45 / 14-day returns / rechargeable / 6 colors), accordions (Description / Key features / Specs). Then a static spec strip in the press slot, no reviews (hidden until real), 6-icon feature row, 2 big rounded image panels, alternating split rows, "Pick your glow" 3 light-color dots (3000/4500/6000K), "In the box" cross-sell panel, "At home" scroll-snap row (AI label kept), centered FAQ, "Other colors" 3 cards, footer. Sticky ATC.

## 7. Dropped (we lack the feature or it would be invented)

App, Loftie+ subscription, Loftie Card, hotels, corporate gifting, kids, survey stats, press logos, reviews and stars, experts, HSA/FSA, refurbished, country/language selector, payment logos.
