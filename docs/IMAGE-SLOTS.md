# Glea image slots (Loftie layout)

This file mirrors `/workspace/eco/workflow/outputs/store-lead/T-049-slot-map.md` (kept in sync). Slot names are the keys in `lib/media.ts`; each slot has a v3c placeholder `file` and an optional `drop` (the T-047 shotlist filename, without extension).

## Swapping in real images
- Put the finished renders in `/workspace/eco/glea-renders/` with the shotlist filenames (.png, .jpg or .webp).
- Run `node scripts/import-renders.mjs`. It writes `public/media/<drop>.webp` (transparent cutouts keep alpha; photos are flattened), real sizes into `public/media/renders.json`, and the six collection cards `glea-card-<color>.webp` (cutout on cream, 1200x1200).
- Commit `public/media`. Vercel only builds git-tracked files, so the import must run locally.
- Any missing drop falls back to the placeholder `file`. Cutouts are detected by name (`glea-cut-*`, `glea-macro-*`) and get `object-fit: contain` on a cream stage.
- Per-color PDP images: `glea-cut-hero-<color>-lit` then `-unlit` (color slugs: black, amber, pink, purple, lakeblue, white).
- A mobile crop for any slot can be added as `<drop>-m` (for example `glea-life-hero-window-m`).
- AI-image note stays under lifestyle sections. INBOX keeps "Bookmark shown as an illustration".

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

## Video slots (T-051)
Filename-driven, like the image slots. Files live in `public/media/video/`:

| File | Use | Size today |
|---|---|---|
| `<base>-d.mp4` | Desktop loop, 16:9 (1920x1080) | glea-hero-d.mp4, 1.1 MB |
| `<base>-m.mp4` | Mobile loop, 9:16 (720x1280). Optional: the desktop file is used if missing | glea-hero-m.mp4, 0.4 MB |
| `<base>-d.webp` / `<base>-m.webp` | Posters (first frame). This is the LCP image and is preloaded | 45 KB / 13 KB |
| `videos.json` | Poster sizes and alt text, written by the script | |

- The home hero uses base `glea-hero` with still slot `HERO-01`: `<VideoSlot base="glea-hero" still="HERO-01" priority />`.
- Video rules: muted, loop, playsInline, preload none, no audio track, aria-hidden. The file is attached only after page load + browser idle, picked once by screen width (767px and below = mobile file). It fades in over .3s when it starts playing and pauses when off screen. No on-screen pause button (removed in T-052 at the owner's request, as on Loftie); reduced-motion users never get the video.
- prefers-reduced-motion or Save-Data: no video is loaded; the poster stays.
- Missing mp4: the slot shows the still image slot (HERO-01) instead, and no video tag is rendered. A load error at runtime leaves the poster showing.
- Adding or replacing a clip: encode, drop it in, run the script, commit (only committed files deploy):
  `ffmpeg -i in.mp4 -an -c:v libx264 -crf 28 -pix_fmt yuv420p -vf scale=1920:1080 -movflags +faststart public/media/video/glea-hero-d.mp4`
  then `node scripts/import-videos.mjs` (makes missing posters and updates videos.json). Delete the old posters first if the clip changed.
- Sources today (see workflow/outputs/store-lead/T-050-video-picks.md): desktop = slot-5 warm lamp glow (Pexels, Tima Miroshnichenko), mobile = slot-6 woman reading by lamp light (Pexels, cottonbro studio). Mood placeholders, re-encoded smaller (crf 28, no audio). Never caption people in clips as endorsing the product.

## Hero product (T-051)
`public/media/glea-hero-product.webp`: transparent cutout of the White light (from glea-cut-hero-white-lit), standing at the bottom center of the home hero. Rebuild with `python3 scripts/hero-product-cutout.py glea-cut-hero-white-lit 10 public/media/glea-hero-product.webp`. If the file is missing, the hero shows no product.

## Card hover images and hero frame (T-052)
Filename-driven; drop the file in `/workspace/eco/glea-renders/`, run `node scripts/import-renders.mjs` (writes WebP to `public/media/`), commit.

| Slot file | Where | Size / ratio | Notes | Fallback when missing |
|---|---|---|---|---|
| `glea-hover-black` (first), `glea-hover-amber`, `glea-hover-pink`, `glea-hover-purple`, `glea-hover-lakeblue`, `glea-hover-white` | Hover image on each color card (collection, search, PDP "more colors") and `glea-hover-black` on the home "Glea book light" card | 4:5 (e.g. 1600x2000), transparent not required | No person. Same scene as the card image, closer | Card: the color's lit cutout `glea-cut-hero-<color>-lit` (on cream), else the studio photo `glea-var-<color>-1100`. Home card: `glea-life-nightstand` |
| `glea-hover-pair` | Hover image on the home "Buy 2" card | 4:5 | Two lights, closer | `glea-cut-pair-black-white` |
| `hero-frame-01-16x9` | Approved first hero frame: hero video poster (desktop) and the still fallback (also for a 2.5D parallax still) | 1920x1080 | Preloaded LCP image | Video first-frame poster `video/glea-hero-d.webp`, else HERO-01 still |
| `hero-frame-01-9x16` | Same, mobile | 1080x1920 | | Desktop frame, else `video/glea-hero-m.webp`, else HERO-01 |

Hover behavior (measured on loftie.com, T-052): the second image sits on top at opacity 0 and crossfades in, opacity .4s ease-in-out while the first fades out; no zoom while swapping. Only on fine pointers (mouse); touch shows the first image. Keyboard focus on the card also swaps. Cards with no second image keep the soft 1.03 zoom.

Hero video exports (incoming): mp4 H.264, 1920x1080 (`glea-hero-d.mp4`) and 1080x1920 (`glea-hero-m.mp4`), under 6 MB each, muted (no audio track), with poster (= hero-frame-01). Put them in `public/media/video/` and run `node scripts/import-videos.mjs`.
