/**
 * Image slots. Each slot points at a file name in /public/media. To swap a photo, drop a new file with the
 * same name into /public/media (or change the name here). Missing files render as an intentional placeholder tile.
 * Desktop/mobile pairs use `file` (desktop) and `mobile`.
 */
export type Slot = { file: string; mobile?: string; alt: string; w: number; h: number; mw?: number; mh?: number; label?: string; note?: string };

export const slots = {
  "HERO-01": { file: "glea-hero-01-d-2000.webp", mobile: "glea-hero-01-m-1100.webp", alt: "Reader in bed with a Glea light clipped to a book", w: 2000, h: 929, mw: 1100, mh: 1500 },
  "HERO-02": { file: "glea-hero-02-d-2000.webp", mobile: "glea-hero-02-m-1100.webp", alt: "Glea light glowing on an open book at night", w: 2000, h: 929, mw: 1100, mh: 1500 },
  "HERO-03": { file: "glea-hero-03-d-2000.webp", mobile: "glea-hero-03-m-1100.webp", alt: "Glea lights in several colors on a sunlit shelf", w: 2000, h: 929, mw: 1100, mh: 1500 },
  "GAL-01": { file: "glea-gal-01-main-studio-1100.webp", alt: "Black Glea book light clipped to an open book", w: 1100, h: 1100 },
  "GAL-02": { file: "glea-gal-02-lineup-1100.webp", alt: "Six colors. One soft glow. Glea in Black, Amber, Pink, Purple, Lake Blue and White, with 9 LEDs, 3 light colors, dims 100% to 10%, up to 80 hours", w: 1100, h: 1100 },
  "GAL-03": { file: "glea-gal-03-brightness-1100.webp", alt: "Find your glow: 9 LED light panel, 3 light colors (warm 3000K, neutral 4500K, cool 6000K), hold 4 seconds to dim from 100% to 10%", w: 1100, h: 1100 },
  "GAL-04": { file: "glea-gal-02-partner-1100.webp", alt: "Reading in bed with Glea while a partner sleeps", w: 1100, h: 1100 },
  "GAL-05": { file: "glea-gal-05-neck-1100.webp", alt: "Bend it where you need it: flexible gooseneck to aim the glow, curls up to pack", w: 1100, h: 1100 },
  "GAL-06": { file: "glea-gal-06-clip-1100.webp", alt: "Clips on, stays put: strong spring clip with a ridged grip, clips to books, beds and desks", w: 1100, h: 1100 },
  "GAL-07": { file: "glea-gal-07-charge-1100.webp", alt: "Charge it, then read: 1000mAh rechargeable battery, up to 80 hours of reading per charge, USB cable included. Run time varies with brightness and light color", w: 1100, h: 1100 },
  "GAL-08": { file: "glea-gal-08-size-1100.webp", alt: "Small enough for any bag: palm-sized, just 63 g, slips into a bag", w: 1100, h: 1100 },
  "GAL-09": { file: "glea-gal-09-compare-1100.webp", alt: "Glea compared with many basic clip lights: clips onto your book, rechargeable 1000mAh battery, 3 light colors, dims 100% to 10%, flexible gooseneck, up to 80 hours per charge, 63 g. Other clip lights vary by model", w: 1100, h: 1100 },
  "GAL-10": { file: "glea-gal-10-in-box-1100.webp", alt: "In the box: Glea book light, USB charging cable and a free silicone bookmark (bookmark shown as an illustration)", w: 1100, h: 1100, note: "Bookmark shown as an illustration" },
  "APLUS-01": { file: "glea-aplus-01-d-1440.webp", mobile: "glea-aplus-01-m-750.webp", alt: "Glea light on a book after dark", w: 1440, h: 590, mw: 750, mh: 562 },
  "APLUS-02": { file: "glea-aplus-02-d-1440.webp", mobile: "glea-aplus-02-m-750.webp", alt: "Glow on the page with a dark room around it", w: 1440, h: 590, mw: 750, mh: 562 },
  "APLUS-03": { file: "glea-aplus-03-d-1440.webp", mobile: "glea-aplus-03-m-750.webp", alt: "Bending the Glea neck to aim the light", w: 1440, h: 590, mw: 750, mh: 562 },
  "APLUS-04": { file: "glea-aplus-04-d-1440.webp", mobile: "glea-aplus-04-m-600.webp", alt: "Adjusting Glea brightness", w: 1440, h: 590, mw: 600, mh: 450 },
  "APLUS-05": { file: "glea-aplus-05-d-1440.webp", mobile: "glea-aplus-05-m-600.webp", alt: "Charging the Glea light", w: 1440, h: 590, mw: 600, mh: 450 },
  "APLUS-06": { file: "glea-aplus-06-d-1440.webp", mobile: "glea-aplus-06-m-750.webp", alt: "The six Glea colors", w: 1440, h: 589, mw: 750, mh: 562 },
  "APLUS-07": { file: "glea-aplus-07-d-1440.webp", mobile: "glea-aplus-07-m-750.webp", alt: "Glea light and charging cable", w: 1440, h: 589, mw: 750, mh: 562 },
  "TILE-01": { file: "glea-tile-01-bed.webp", alt: "Reading in bed with Glea", w: 1000, h: 1150 },
  "TILE-02": { file: "glea-tile-02-travel.webp", alt: "Glea for reading on the go", w: 1000, h: 500 },
  "TILE-03": { file: "glea-tile-03-gift.webp", alt: "Glea as a gift", w: 1000, h: 500 },
  "HOW-01": { file: "glea-how-01-clip-600.webp", alt: "Clipping Glea to a book", w: 600, h: 450 },
  "HOW-02": { file: "glea-how-02-glow-600.webp", alt: "Glea switched on, glowing on the page", w: 600, h: 450 },
  "HOW-03": { file: "glea-how-03-read-600.webp", alt: "Reading by the Glea glow", w: 600, h: 450 },
  "FEAT-01": { file: "glea-feat-01-neck.webp", alt: "Bend it your way: flexible gooseneck", w: 1200, h: 1200 },
  "FEAT-02": { file: "glea-feat-02-clip.webp", alt: "Clips on, stays put: strong spring clip", w: 1200, h: 1200 },
  "FEAT-03": { file: "glea-feat-03-charge.webp", alt: "Charge it, then read: 1000mAh battery, up to 80 hours per charge", w: 1200, h: 1200 },
  "FEAT-04": { file: "glea-feat-04-colors.webp", alt: "Six colors. One soft glow.", w: 1200, h: 1200 },
  "ABOUT-01": { file: "glea-about-01-d-1440.webp", mobile: "glea-about-01-m-750.webp", alt: "Glea reading light at night", w: 1440, h: 360, mw: 750, mh: 865 },
  "ABOUT-02": { file: "glea-about-02-750.webp", alt: "Glow on the page", w: 750, h: 500 },
  "ABOUT-03": { file: "glea-about-03-750.webp", alt: "Soft adjustable light", w: 750, h: 500 },
  "ABOUT-04": { file: "glea-about-04-750.webp", alt: "Glea light clipped to a book", w: 750, h: 500 },
  "COLL": { file: "glea-coll-d-1440.webp", mobile: "glea-coll-m-750.webp", alt: "Glea lights in six colors", w: 1440, h: 562, mw: 750, mh: 1023 },
  "CREATOR": { file: "glea-creator-d-1440.webp", mobile: "glea-creator-m-750.webp", alt: "A reading corner lit by Glea", w: 1440, h: 514, mw: 750, mh: 938 },
  "BLOG-01": { file: "glea-blog-01-partner-750.webp", alt: "Reading next to a sleeping partner", w: 750, h: 500 },
  "BLOG-02": { file: "glea-blog-02-choose-750.webp", alt: "Choosing a book light", w: 750, h: 500 },
  "BLOG-03": { file: "glea-blog-03-travel-750.webp", alt: "Reading on the go", w: 750, h: 500 },
  "POPUP": { file: "glea-popup.webp", alt: "Glea lights in several colors", w: 1500, h: 1500, label: "Popup image" },
  "OG": { file: "glea-og.jpg", alt: "Glea clip-on book reading light", w: 1200, h: 630 },
} satisfies Record<string, Slot>;

export type SlotName = keyof typeof slots;

/** Per-color photos: glea-var-<slug>-1100.webp in /public/media (slug without dashes, so "lake-blue" maps to "lakeblue"). Extra angles: -2, -3. */
export const colorFile = (slug: string, n = 1) => `glea-var-${slug.replace(/-/g, "")}-1100${n > 1 ? `-${n}` : ""}.webp`;

export const gallerySlots: SlotName[] = ["GAL-01", "GAL-02", "GAL-03", "GAL-04", "GAL-05", "GAL-06", "GAL-07", "GAL-08", "GAL-09", "GAL-10"];
export const featureSlots: SlotName[] = ["FEAT-01", "FEAT-02", "FEAT-03", "FEAT-04"];
