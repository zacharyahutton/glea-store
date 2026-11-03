# T-049 Glea image slot map (Loftie layout, T-048)

Written 2026-11-03 by the T-048 build (Website Builder). Source of truth for which shotlist image (T-047-3d-cutout-shotlist.md, P-xx / L-xx) fills which slot on the new Loftie-layout site. Kept in sync with glea-store/docs/IMAGE-SLOTS.md.

## How files get in
1. Drop finished files in `/workspace/eco/glea-renders/` with the shotlist filename (any of .png .jpg .jpeg .webp). `-alt` takes are ignored.
2. Run `node scripts/import-renders.mjs` in glea-store. It converts to WebP into `public/media/` (alpha kept for cutouts, long edge capped at 2400, q82), builds the per-color cards and swatches, and skips anything missing.
3. Each slot loads the WebP if it exists, else its current v3c placeholder file. Nothing breaks when a file is missing.

Sizes: "Source" is what to deliver (the shotlist size). "Shown at" is the largest CSS box on the site (desktop 1440 / mobile 390); the source covers 2x retina for every slot except the full-bleed hero, where 2400 wide is enough for 1440 @1.67x and next/image caps at the source.
T = transparent cutout (shown with object-fit contain on a soft cream stage). Solid = full-bleed photo/backdrop (object-fit cover).

## Home (/)
| Slot (code) | Where | Shown at (CSS px) | Ratio in layout | Source | T? | Fills with |
|---|---|---|---|---|---|---|
| HERO-01 | Full-bleed hero under the transparent header | 1440x860 desktop, 390x780 mobile | ~16:9 desktop (cover), ~1:2 mobile (cover, center crop) | 2400x1350 | No | **L-01** glea-life-hero-window. MOBILE CROP MISSING, see flags |
| (rings card) | "Glea, by the numbers" | n/a | n/a | n/a | n/a | No image (SVG rings) |
| LIFE-SOFA | "Who is it for" card 1 | 330x412 | 4:5 cover | 1200x1200 (crops to 4:5) | No | **L-08** glea-life-sofa-blanket |
| LIFE-PARTNER | "Who is it for" card 2, home duo panel 2, PDP panel 2 | 330x412 / 690x600 / 1360x600 | 4:5 / ~1.15:1 / ~2.3:1 cover | 2400x1600 | No | **L-05** glea-life-partner-bed |
| LIFE-TRAVEL | "Who is it for" card 3 | 330x412 | 4:5 cover | 1600x2000 | No | **L-07** glea-life-travel-hotel |
| LIFE-GIFT | "Who is it for" card 4, PDP "at home" rail | 330x412 | 4:5 cover | 1200x1200 | No | **L-09** glea-life-gift-unwrap |
| STUDIO-NAVY | "A soft glow for every night" product card 1 | 670x670 | 1:1 cover | 2048x2048 | No (solid navy) | **P-15** glea-studio-navy-black-lit |
| LINEUP | Product card 2 ("Buy 2, save $5") | 670x670 | 1:1 contain | 2400x1600 | T | **P-14** glea-cut-lineup-6 |
| LIFE-NIGHTSTAND | Split image, tabs "sleeper", PDP panel 1 | 680x520 / 900x560 / 1360x600 | ~1.3:1 / 16:10 / ~2.3:1 cover | 2400x1600 | No | **L-03** glea-life-nightstand |
| LIFE-HANDS | Tabs "bed", PDP split, PDP "at home" rail | 900x560 / 580x580 | 16:10 / 4:3 cover | 2048x2048 | No | **L-04** glea-life-hands-reading |
| LIFE-ARMCHAIR | Tabs "travel", PDP "at home" rail | 900x560 | 16:10 cover | 2400x1600 | No | **L-06** glea-life-armchair |
| LIFE-UGC | Tabs "gift", PDP "at home" rail | 900x560 / 330x412 | 16:10 / 4:5 cover | 1200x1500 | No | **L-10** glea-life-ugc-stack |
| INBOX | Home duo panel 1 "In the box", PDP #in-the-box panel | 690x600 / 1360x600 | cover (solid cream backdrop) | 2048x2048 | No (solid cream) | **P-28** glea-flatlay-inbox-black. Label "Bookmark shown as an illustration" stays |
| BLOG-01 | "Good to know" card 1 | 440x293 | 3:2 cover | uses L-05 | No | **L-05** (reuse) |
| BLOG-02 | "Good to know" card 2 | 440x293 | 3:2 contain | uses P-14 | T | **P-14** (reuse) |
| BLOG-03 | "Good to know" card 3 | 440x293 | 3:2 contain | 2048x2048 | T | **P-10** glea-cut-folded-black |
| Footer | Dusk gradient card | n/a | n/a | n/a | n/a | No image (CSS gradient + glows), same as Loftie |

## Collection (/collections/all)
| Slot | Where | Shown at | Ratio | Source | T? | Fills with |
|---|---|---|---|---|---|---|
| glea-card-[color] x6 | Product grid card (3 col desktop, 2 col mobile) | 330x330 desktop, 170x170 mobile | 1:1 | 1200x1200 code-made | No (cutout composited on cream #F3E7D0) | Built by import script from **P-01..P-06** (lit). If a card file is missing, the raw P-0x cutout shows on the stage |
| STUDIO-CREAM | Accordion + image split | 640x480 | 4:3 cover | 2048x2048 | No (solid cream) | **P-16** glea-studio-cream-white-lit |
| BLOG-01..03 | "Good to know" row | as home | | | | as home |

## Product page (/products/[handle])
Gallery order per selected color (dark stage, 1:1, shown at 740x740 desktop, 390x390 mobile; source 2048x2048):
1. **P-0x lit** glea-cut-hero-[color]-lit (P-01 Black, P-02 Amber, P-03 Pink, P-04 Purple, P-05 Lake Blue, P-06 White), T
2. **P-17..P-22 unlit** glea-cut-hero-[color]-unlit, T
3. GAL-01 **P-07** glea-cut-onbook-black-lit, T
4. GAL-02 **P-15** glea-studio-navy-black-lit, solid
5. GAL-03 **P-12** glea-macro-head-black-lit, T
6. GAL-04 **L-02** glea-life-plinth-stone (4:5 source, center-cropped to 1:1), solid
7. GAL-05 **P-08** glea-cut-side-black, T
8. GAL-06 **P-09** glea-cut-back-clip-black, T
9. GAL-07 **P-13** glea-macro-charge-black, T
10. GAL-08 **P-29** glea-cut-hand-black, T
11. GAL-09 **P-23** glea-cut-top-black-lit, T
12. GAL-10 **P-28** glea-flatlay-inbox-black, solid (illustration label stays)
Color swap = the first two images change, with a .3s crossfade.

| Slot | Where | Shown at | Ratio | Source | T? | Fills with |
|---|---|---|---|---|---|---|
| BUNDLE | Small image in the "Buy 2, save $5" box | 120x80 | 3:2 contain | 2400x1600 | T | **P-31** glea-cut-pair-black-white |
| LIFE-NIGHTSTAND / LIFE-PARTNER | Two big image panels | 1360x600 | ~2.3:1 cover | 2400x1600 | No | **L-03**, **L-05** |
| LIFE-HANDS | Split "Your page glows" | 600x600 | 1:1 cover | 2048x2048 | No | **L-04** |
| GLOW-3000 / GLOW-4500 / GLOW-6000 | "Pick your glow" panel, swaps on the 3 dots | 440x440 | 1:1 contain | 2048x2048 | T | **P-01** (3000K), **P-26** glea-cut-light-4500k-black, **P-27** glea-cut-light-6000k-black |
| LIFE-PLINTH | "Pick your glow" big photo | 880x660 | 4:3 cover | 1600x2000 | No | **L-02** glea-life-plinth-stone |
| HOW-01..03 | "How it works" 8s auto-advance | 760x570 | 4:3 cover | v3c only today | No | NO SHOTLIST IMAGE (see flags). Proposed: P-07 / P-24 / L-04 |
| MACRO-BUTTON | "Easy to control" row | 580x580 | 1:1 contain | 2048x2048 | T | **P-25** glea-macro-button-black |
| BENT | "Bend it where you need it" row | 580x580 | 1:1 contain | 2048x2048 | T | **P-24** glea-cut-bent-black-lit |
| INBOX | #in-the-box panel | 1360x600 | cover | 2048x2048 | No | **P-28** |
| LIFE-* x7 | "Glea at home" rail | 330x412 | 4:5 cover | per L-xx | No | **L-04, L-05, L-08, L-07, L-06, L-09, L-10** (AI label under the rail) |
| glea-card-[color] | "More colors" rail | 440x440 | 1:1 | 1200x1200 code-made | No | from **P-01..P-06** |
| Sticky ATC | | n/a | | | | No image (Loftie's has none) |

## Shared / other
| Slot | Where | Shown at | Ratio | Source | T? | Fills with |
|---|---|---|---|---|---|---|
| POPUP | Email popup image | 420x420 | 1:1 cover | 2400x1600 (center crop) | No (solid amber) | **P-30** glea-studio-amber-amber-lit |
| OG | Social share card | 1200x630 | 1.91:1 | 1200x630 | No | NO SHOTLIST IMAGE. Proposed: code crop of L-01 + wordmark (flag) |
| glea-swatch-[color] | Not used: swatches are flat color dots, as on Loftie | | | 160x160 | | Unused, can be skipped |
| ABOUT-01..04 (phase 2 About) | About hero + 3 story tiles | 1440x360 hero / 440x293 tiles | 4:1 / 3:2 | | No | Phase 2 proposal: **L-06** hero, **L-02**, **L-04**, **P-07** tiles |
| COLL (phase 2 / not shown in phase 1) | Old collection banner, no longer on the page | | | | | Not used in the Loftie layout |
| CREATOR, APLUS-*, FEAT-*, TILE-*, HERO-02/03 | Old v2/v3 sections | | | | | Not shown on phase 1 pages (kept as files) |

## Flags for Store Lead
Slots with no matching shotlist image (please add):
1. **HERO-01 mobile**: L-01 is 16:9; the mobile hero is ~1:2 portrait. Add `glea-life-hero-window-m` at **1080x1920 (9:16)**, subject centered (or 1080x1350 4:5 minimum). Until then mobile center-crops L-01.
2. **HOW-01..03** ("How it works" auto-advance, 4:3, 1600x1200): clip on / aim the glow / reading. Proposal `glea-life-how-clip`, `glea-life-how-aim`, `glea-life-how-read`, or approve reusing P-07, P-24, L-04 (I will wire the reuse if no new files come).
3. **OG** 1200x630: `glea-og-life` (no text in the image; we add nothing on top). Can be a crop of L-01.

Shotlist images no slot uses: none. Every P-01..P-31 and L-01..L-10 has a slot above. P-17..P-22 (unlit) appear only as PDP gallery image 2. glea-swatch-[color] files (code-made) are not needed.

## T-052 addition: card hover images and hero frame
| Slot name | Use | Size / ratio | Content | Fallback |
|---|---|---|---|---|
| glea-hover-black (make first) | Hover image on the Black color card and on the home "Glea book light" card | 4:5, transparent not required | Same scene as the card, closer. No person | lit cutout glea-cut-hero-black-lit, else glea-var-black-1100 (home card: glea-life-nightstand) |
| glea-hover-amber, glea-hover-pink, glea-hover-purple, glea-hover-lakeblue, glea-hover-white | Hover image on each color card (collection, search, PDP more colors) | 4:5 | Same, per color | lit cutout glea-cut-hero-<color>-lit, else glea-var-<color>-1100 |
| glea-hover-pair (optional) | Hover image on the home "Buy 2" card | 4:5 | Two lights, closer | glea-cut-pair-black-white |
| hero-frame-01-16x9 | Approved first hero frame: hero video poster and still fallback (also the 2.5D parallax still) | 1920x1080 | Hero scene with the product | video first-frame poster, else HERO-01 |
| hero-frame-01-9x16 | Same, mobile | 1080x1920 | | desktop frame, else mobile poster, else HERO-01 |

Hero video exports: mp4 H.264 1920x1080 and 1080x1920, under 6 MB each, muted, with poster. Files arrive in /workspace/eco/glea-renders/ by these names. Wired in code (T-052): swap is opacity .4s ease-in-out, fine pointers only. See glea-store/docs/IMAGE-SLOTS.md.
