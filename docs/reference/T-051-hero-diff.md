# T-051 Home hero: before / after (Glea vs Loftie)

Target: live loftie.com at 1440x900 and 390x844, measured 3 Nov 2026 with Playwright, plus Zach's screenshot (3:55 PM).
Built in our own code (app/page.tsx, app/shell.css, components/layout/Header.tsx, components/ui/VideoSlot.tsx, BgVideo.tsx). No Loftie assets, text, JS or CSS copied.
Before = commit a630fd0 (deploy dpl_7FrD7dEe965Q4zrta3f5294nH2UZ). After = the T-051 commit in the report.

## Hero
| # | Item | Loftie (measured) | Before (Glea) | After (Glea) |
|---|---|---|---|---|
| 1 | Size | 100vh, full bleed, runs under the bar and header | min(92svh, 860px), started under the header only | 100svh (min 560px), full bleed, runs under the announcement bar and header |
| 2 | Background | Muted looping video over a poster, black base. Video fades in (opacity 0 to 1, .3s) once it plays | One still photo (HERO-01), navy base | Muted looping mp4 (desktop 16:9, mobile 9:16) over a first-frame WebP poster, black base, fades in .3s on `playing`. Poster is the LCP image |
| 3 | Overlay | None | Top + bottom navy gradients | Soft dark oval behind the text plus a light top gradient, for WCAG AA (Loftie needs none on its bright scene; ours is a night scene with a bright lamp) |
| 4 | Text block position | Centered column, top of the hero: H1 top about 168px desktop, 242px mobile | Left aligned, bottom left | Centered column, same top offsets (padding-top = bar + header + 22px desktop, + 118px mobile) |
| 5 | H1 | 65px / 1.05, max 700px desktop; 32px / .93, max 350px mobile | clamp(2.4rem, 5vw, 4rem), left | 65px / 1.05 max 700px desktop; 32px / .95 max 350px mobile. "Soft light, / after dark." on two lines |
| 6 | Subheading | 18px / 1.25, max 500px, 32px below desktop; 16px / 1.1, max 340px, 14px below mobile | 17px, max 34rem, left | Same sizes, widths and gaps |
| 7 | CTA | One cream button, 266x57 / 16px bold desktop, 232x43 / 14px mobile, radius 4px | Cream button, default size, left | Same sizes, centered; radius 10px (our button rule, no pills) |
| 8 | Product | Product stands at the bottom center on a surface | None | White Glea light (cutout from our render glea-cut-hero-white-lit, file public/media/glea-hero-product.webp) at bottom center, 38% of hero height desktop (max 360px), 30% mobile, with a contact shadow and a dark floor band |
| 9 | Text entrance animation | None (text at opacity 1 on first paint) | Reveal fade | None, same as Loftie. Only the video fades in |
| 10 | Scroll behavior | No parallax; hero scrolls normally | Same | Same |
| 11 | Video controls | None visible | n/a | 40px pause / play button bottom left (WCAG 2.2.2). Bottom right stays free for the chat button |
| 12 | Reduced motion / Save-Data | n/a | n/a | No video loaded, poster stays |

## Header over the hero
| # | Item | Loftie (measured) | Before (Glea) | After (Glea) |
|---|---|---|---|---|
| 13 | Announcement bar | 46px desktop, 50px mobile, stays pinned at top | 44px / 40px, pinned | 46px / 50px, pinned |
| 14 | Header at top | Floating rounded capsule, nearly clear: rgba(20,14,11,.06), blur 12px, thin light border, cream text and icons | Fully transparent, no border | Same nearly clear capsule, blur 12px, thin cream border, cream text and icons |
| 15 | Header mid scroll (about 300 to 500px) | Light cream veil | n/a | Cream veil from 280px |
| 16 | Header solid | Cream .92, blur 16px, dark text, after about 550px | After any scroll | Solid cream .92, dark text, after 520px; back to clear near the top |
| 17 | Hide / show | Hides on scroll down after about 250 to 300px, translateY(-(height + 90px)) .35s; shows on scroll up | Hid at any scroll down, -190px | Hides after 280px with the same transform and .35s; shows on scroll up |
| 18 | Desktop layout | Logo left (100x30), nav from x193 with about 30px gaps, icons right 19px on 37px steps (account, search, cart) | Logo, nav, icons | Logo left, nav next to it, search + cart right, 19px on 37px steps. No account icon: the store has no customer accounts on this build |
| 19 | Mobile layout | Capsule 366x54 at x12, radius 16; menu + search left, logo centered, cart right | Menu, logo left, icons right | Same: menu + search left, logo centered, cart right, 54px capsule, radius 16 |

## Other T-051 items
- Mobile product page: the chat button hides while the color swatches or the add to cart row are on screen (IntersectionObserver, body class `fab-off`). Checked every 60px of scroll at 360 and 390: 0 overlaps with swatches, the buy row or the sticky add to cart.
- Chat and the email popup now load as separate chunks after load + idle, or on first tap, key, scroll or pointer move.
- Hero video picks: desktop slot-5 (warm lamp glow, Pexels, Tima Miroshnichenko), mobile slot-6 (woman reading by lamp light, Pexels, cottonbro studio), both from T-050-video-picks.md. Mood placeholders only; nobody is shown endorsing the product.

## Measured text contrast over the hero (cream #fbf7ed text)
Background sampled behind the subheading with the text hidden, over 4 video moments. Ratio at the 95th percentile brightest background pixel: 1440: 6.4, 1280: 5.0, 390: 13.3, 360: 11.6 (AA needs 4.5). A small text shadow adds margin on the few brightest pixels.

## Screenshots
qa/shots/hero-compare/ (Loftie vs Glea, 1440 and 390, top and after scroll with the solid header; consent and popup dismissed).

## Prod QA (dpl_9t1t8s6ARmUTNF16YB4qr6xARn46)
- Lighthouse mobile home x5: perf 95, 98, 87, 94, 88 (median 94); LCP 2.77, 2.23, 3.73, 2.82, 3.52 s (median 2.82 s); CLS 0; a11y 100; SEO 69 is the intentional noindex.
- Lighthouse mobile product x2: perf 87, 95; LCP 3.63, 2.71 s.
- LCP element on home is the hero product image (glea-hero-product.webp, 16 KB).
- FAB overlap 0 of 50 scroll positions at 360 and 390. Reduced motion: no video src, video hidden.
- Screenshots: glea-store/qa/shots/hero-compare/ (local, folder is gitignored).
