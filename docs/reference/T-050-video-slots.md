# T-050 Loftie video slots inventory

Made Tue Nov 3, 2026 (Bogota, UTC-5). Source: the static Loftie export in /workspace/eco/reference-html/loftie-export/ (NoCodeXport). The export has no local video or gif files. Every video is a Loftie CDN URL in the HTML. Sizes and durations below were read with ffprobe from those CDN URLs.

Pages read:
- Home: ref-da-frontpage.html and ref-de-frontpage.html (same home template)
- Collection: ref-de-lamps-collection.html ("Lampen")
- Product: ref-da-loftie-lamp.html ("Loftie Lampe"), plus products/woodland-wonder-bedtime-spray/index.html (a second product template)

How the theme plays video:
- Hero sections use `<video muted loop playsinline preload="none" data-src=...>` with a separate desktop and mobile file, object-fit cover. So: autoplay muted, loops, no controls, no sound.
- The buy box gallery uses an Alpine.js carousel: `<video playsinline autoplay muted loop preload="auto" width=800 height=800>`. It autoplays muted and loops when its slide is active.
- GIFs loop forever and play silently.
- Product media JSON (cart, quick add, recommendations) is data only, not a rendered slot. Listed at the end for reference.

## Rendered slots

| # | Page | Section | File (Loftie CDN) | Size and aspect | Length | Loops | Autoplay muted | What it shows |
|---|---|---|---|---|---|---|---|---|
| 1 | Home | Product grid (template--23766633840887__main), product card hover or secondary image | 98-Loftie_grab-it__r1_gif.gif (//loftie.com/cdn/shop/products/98-Loftie_grab-it__r1_gif.gif?v=1649707500) | 1493x1493, 1:1, 11.06 MB GIF, 22 frames | 14.5 s | Yes | Yes (GIF, silent) | Hands reaching for the Flowers with Powers puzzle |
| 2 | Product (Loftie Lampe) | Buy box gallery (international_clock_buy_box_Pmz7de), video slide, media position 34 of 37 | 81e8f3aac86b422bbd20b82d7ad95110.HD-1080p-2.5Mbps-10562498.mp4 | 1080x1080, 1:1, shown in an 800x800 box | 27.6 s | Yes | Yes, when the slide is active | Lamp product demo |
| 3 | Product (Loftie Lampe) | Hero homepage_hero_section_WnHiyF "Sunrise wake-up", image with text overlay, DESKTOP | f1cf68a3...HD-1080p-7.2Mbps-25002620.mp4 | 1920x1080, 16:9 | 8.0 s | Yes | Yes | Lamp sunrise light in bedroom |
| 4 | Product (Loftie Lampe) | Same hero WnHiyF, MOBILE | 2f1ec024...HD-1080p-7.2Mbps-25002738.mp4 | 708x1080, about 2:3 portrait | 8.0 s | Yes | Yes | Same scene, portrait |
| 5 | Product (Loftie Lampe) | Hero homepage_hero_section_bxJLtr "Easy Wind Down" (warm dim light, bedtime signal), DESKTOP | 1c7257ff...HD-1080p-4.8Mbps-87247758.mp4 | 1920x1080, 16:9 | 15.0 s | Yes | Yes | Warm dim lamp light at night |
| 6 | Product (Loftie Lampe) | Same hero bxJLtr, MOBILE | 264364ab...HD-1080p-3.3Mbps-87247213.mp4 | 606x1080, about 9:16 | 12.0 s | Yes | Yes | Same scene, portrait |
| 7 | Product (Loftie Lampe) | image_with_text_MLN3cB "Thought through to the fingertips" (design detail) | assembly_square.gif (//loftie.com/cdn/shop/files/assembly_square.gif?v=1700159640) | 1262x1262, 1:1, 0.77 MB GIF, 4 frames | 4.0 s | Yes | Yes (GIF, silent) | Product detail or assembly |
| 8 | Product, second template (Woodland Wonder spray) | Hero homepage_hero_section_ca9GrC, same file for desktop and mobile | 67abe761...HD-1080p-7.2Mbps-56318646.mp4 | 1920x1080, 16:9 (cropped to cover on mobile) | 11.7 s | Yes | Yes | Product lifestyle scene |

Also on the product page:
- loftie_reviews_WqbD8Y: the Okendo reviews widget can show customer videos (oke-media--video). This is customer content from the review app, not a theme slot. Glea would get this only from its own reviews app.

## Sections with no video

- Home: faq-image and blog-posts (images only).
- Collection (Lampen): no rendered video or gif. Only media JSON in quick view and cart data.
- Product: homepage_hero_section_PPKrUB ("the lamp's perfect partner", clock pairing) is an image only. image_with_text_L7BrXY (red light mode) has no video.

## Media JSON only (not rendered, for reference)

- Mouth tape 9:16 videos: ca6b5f22 (5.8 s), ddbf3b32 (11.2 s), 0dee1cbc (10.6 s), all 1080x1920.
- Loftie clock: b4e60545, 1440x990, 22.2 s.
- Lamp: 81e8f3aa, 1:1, 27.6 s (the same file as slot 2).
- Loftie card: eabce830, 1:1 3000x3000, 8.5 s (product recommendations data).

## Totals

8 rendered autoplay slots: 6 mp4 slots (2 hero pairs on the lamp page, 1 buy box gallery video, 1 hero on the second product template) and 2 GIF loops (home card hover, product detail). The home and collection pages have no hero video. Loftie keeps its motion on the product page.
