# T-048 Loftie interactions inventory (measured) and Glea implementation

Measured live on loftie.com on 2026-11-03 with Playwright (Chromium, 1440x900 and 390x844), using getComputedStyle, document.getAnimations() and timed screenshots. Probe data: /tmp/vd/lof/probe.json and probe2.json (box only, not in the repo). Nothing from Loftie's JS or CSS was copied. Every Glea version is our own code in the repo (CSS transitions plus a few small React hooks, no animation library added).

All motion below is switched off under `prefers-reduced-motion: reduce` (one global rule in app/shell.css plus JS guards in Reveal, Header and tab/slider timers).

| # | Interaction | Loftie, measured | Glea implementation (file) |
|---|---|---|---|
| 1 | Announcement bar | Static single message, 46px tall desktop / 50px mobile, brown bg, cream text, 17px desktop / 12.9px mobile. Same text at 0s and 6s, so no rotation. Not sticky (scrolls away) | `AnnBar` in components/layout/AnnBar.tsx: one static line, 44px desktop / 40px mobile, navy bg, cream text, no rotation. Pinned (sticky top 0) so the floating header can sit under it |
| 2 | Header over home hero | Transparent over the hero, white text. Section is sticky (top = ann height) with margin-bottom -146px so the hero runs under it | `.hdr--over` on "/" while at top: transparent, cream text; hero pulls up under it |
| 3 | Header on scroll (capsule) | After scroll, inner wrapper turns into a floating capsule: inset 24px, 72px tall, radius 999px, bg rgba(251,247,237,.92), backdrop blur(16px) saturate(1.2), border 1px rgba(255,255,255,.5), shadow 0 18px 44px rgba(12,7,5,.10) + 0 2px 10px rgba(12,7,5,.05), padding 0 30px. Transition: background, color, border-color, box-shadow .32s | Same values with Glea cream and navy shadow tint, `.hdr.is-scrolled .hdr__bar`, transition .32s ease |
| 4 | Header hide on scroll down / show on scroll up | Section gets translateY(-190px) on scroll down, back to none on scroll up. `transition: transform .35s` (ease) | `useScrollDir` hook in Header.tsx toggles `.is-hidden`; `transform .35s ease`; never hides while a menu or the cart is open or while focus is inside the header |
| 5 | Nav link hover | Link color transition .32s; whole header turns cream with brown text when the pointer is over it (header loses `--transparent`, bg/color .25s ease-in-out) | Nav color .32s; `.hdr--over:hover` and `:focus-within` switch to the solid capsule colors with .25s ease-in-out |
| 6 | Mega menu | No mega menu on loftie.com today: nav items are plain links (no aria-expanded, no panel after 150ms hover). Highlighted first item in red | Plain links, first item ("Shop all colors") highlighted in amber ink. A small "Shop" dropdown was NOT added, because Loftie has none (matching motion amount) |
| 7 | Mobile menu drawer | From left, 320px wide, transform .6s cubic-bezier(0.75,0,0.175,1), visibility same; overlay opacity/visibility .6s ease-in-out | Same timing and curve, `.drawer--left`, overlay .6s ease-in-out |
| 8 | Search drawer | From left, 347px, same .6s curve | Search stays a link to /search (page exists). Not a drawer, noted |
| 9 | Cart drawer | 440px panel from the right, keyframes cartIn / cartOut 300ms, overlay rgba(0,0,0,.3). Empty state shows best sellers | 440px panel, transform .3s ease out / in, overlay rgba(20,22,31,.3) fade .3s. Empty state shows the light and "Shop all colors". Existing Shopify cart wiring kept |
| 10 | Free shipping bar | Loftie has none in the drawer | We keep our ShipBar (real rule: free over $45). Fill animates width .5s ease, off under reduced motion |
| 11 | Scroll reveal | GSAP ScrollTrigger: from opacity 0, y ~20 to opacity 1, y 0, duration 0.5s, ease power2.out, stagger 0.08s, start "top 88%", once | Our IntersectionObserver (`components/motion/Reveal.tsx`): opacity 0 / translateY(20px) to visible, .5s cubic-bezier(.25,.46,.45,.94) (power2.out), siblings in a `[data-rv-group]` stagger 80ms, rootMargin bottom -12% (= top 88%), once. Content visible without JS |
| 12 | Stat rings draw | `ccs-ring-draw` 1.5s once, when the stats card enters | Spec ring draw in the stats card: stroke-dashoffset 1.5s ease once on reveal (rings are decorative, not percentages) |
| 13 | Tab switcher ("Every night" tabs) | Active pill has a shimmer loop 5s linear; image floats 6s loop; panel enFade .45s ease from opacity 0 / translateY(10px); quote enQuoteIn .75s from translateY(16px); mark .9s cubic-bezier(.22,.61,.36,1) delay .34s, scale .94 | `Tabs` in components/lf/Tabs.tsx: panel fade .45s ease from 10px; text in .75s from 16px; image float 6s ease-in-out loop (2px); tab shimmer 5s linear on the active tab only |
| 14 | Image-with-text progress nav | `navigationItemAnimation` 8s linear progress bar on the active item, then auto-advance | `WaysToUse` in components/lf/WaysToUse.tsx, PDP #how-it-works block: 8s progress bar on active item, auto-advance, pauses on hover/focus, off under reduced motion |
| 15 | Product card image hover | Body has `features--image-zoom`; card images are plain (`transition: all`, no transform measured on the home cards) | Collection and home cards: image scale 1.03 over .65s cubic-bezier(.22,.61,.36,1) on hover (Loftie's PDP/collection theme zoom curve), no movement on touch |
| 16 | Buttons | 4px radius, 16px, bg/color .32s. No transform on hover | 10px radius (brief), bg/color/border .32s, no transform |
| 17 | Link underline | `textUnderlinedAnimatedKeyframes` on text links | `.lnk` underline grows from left .3s ease on hover |
| 18 | Swatches (PDP) | 40px circle swatches; selected ring; image swaps instantly to the color's photo | In components/product/ProductView.tsx: 40px circles, 2px ring offset 3px on selected, .2s ring transition; click swaps the gallery to that color's photos with a .3s opacity crossfade |
| 19 | Color select dropdown | `border-radius .2s ease-in-out` | Not used (we show all 6 swatches, as Loftie does on the lamp page) |
| 20 | PDP gallery | Flickity slider, dark bg, dot nav under the image, swipe on mobile, slide transform | In components/product/ProductView.tsx: CSS scroll-snap track with dots and arrows, smooth scroll (instant under reduced motion), swipe native |
| 21 | Accordions (Description / Key Features / Tech Specs, FAQ) | `collapsible` height animation, + icon | `<details>` whose content runs a .3s fade/slide-down keyframe on open, + rotates to x .3s |
| 22 | Sticky add to cart | Desktop: bar slides down at top (top 46px), 121px, cream, opacity/transform/visibility/top .25s ease-in-out, appears after the buy button leaves view. Mobile: fixed bottom, opacity/transform/visibility .25s ease-in-out | Desktop: top bar under the hidden header; mobile: bottom bar. Both .25s ease-in-out, triggered when the main ATC leaves view |
| 23 | Press logo marquee | 60s linear infinite | Not used: we have no press. Slot kept as a static spec strip (honest), no motion |
| 24 | Footer dusk glow | Gradient footer with two glow layers, 9s and 13s loops | Footer card gradient cream to navy dusk with two soft glow layers, 9s and 13s ease-in-out loops (opacity/transform only) |
| 25 | Videos | Autoplay muted loop inline sections | None yet: we have no videos. Video slot documented in docs/IMAGE-SLOTS.md; would be muted, loop, playsinline, paused under reduced motion |
| 26 | Page transitions | None (normal navigation) | None |
| 27 | Parallax | None measured | None |
| 28 | Carousels (UGC "at home", cross-sell) | Flickity horizontal drag, prev/next buttons (`prevNextButtonKeyframe`) | `Rail` in components/lf/Rail.tsx: CSS scroll-snap row with prev/next buttons, smooth scroll (instant under reduced motion) |

Things Loftie does that we did not copy on purpose: review stars and review carousels (no real reviews yet), press marquee, survey percentages, expert portraits, app UI panels.

## T-051 update (3 Nov 2026)
Re-measured the home hero and the header over it on live loftie.com; rows 1 to 4 above are superseded by these values. Full before/after list: T-051-hero-diff.md.
- Announcement bar: 46px desktop / 50px mobile, pinned at top (ours now matches; it was 44 / 40).
- Header at top of home: floating capsule, nearly clear (rgba(20,14,11,.06), blur 12px saturate 1.15, border rgba(251,247,237,.22)), cream text. Cream veil from 280px, solid cream .92 from 520px, transitions .32s. Hides on scroll down only after 280px, translateY(-(header + 90px)) .35s; shows on scroll up.
- Mobile header: 54px capsule, radius 16, menu + search left, logo centered, cart right.
- Hero: 100svh full bleed under bar and header; muted loop video over a poster, fades in .3s; text centered at the top (H1 65px / 32px), no text entrance animation, no parallax; product at bottom center (Glea White light cutout).
- Video slot: components/ui/VideoSlot.tsx + BgVideo.tsx; loads after load + idle, never with reduced motion or Save-Data, pauses off screen, pause button bottom left.

## T-052 update (3 Nov 2026)
- Hero video: pause / play button removed (owner request; Loftie has none). Video still never loads under reduced motion or Save-Data and pauses off screen.
- Header: turns solid cream on pointer hover or focus inside (Loftie: header loses its transparent state on hover; wrapper background, color, border-color, box-shadow .32s; solid by about 300 ms; shadow 0 22px 52px rgba(12,7,5,.2) + 0 3px 12px rgba(12,7,5,.08); blur 18px saturate 1.15). Solid-on-scroll unchanged.
- Row 15 superseded: Loftie product cards swap to a second image on hover (secondary image absolutely positioned, opacity 0 to 1, primary 1 to 0, opacity and visibility .4s ease-in-out, fine pointers only, no zoom). Glea does the same on every color card and the 2 home product cards, using glea-hover-<color> with fallback (docs/IMAGE-SLOTS.md).
- Header icons redrawn (stroke 1.5, menu 21px, search and cart 20px), hover opacity .72 with a 1px lift.
