/**
 * Image slots. Each slot points at a file name in /public/media. To swap a photo, drop a new file with the
 * same name into /public/media (or change the name here). Missing files render as an intentional placeholder tile.
 * Desktop/mobile pairs use `file` (desktop) and `mobile`.
 */
export type Slot = { file: string; mobile?: string; alt: string; w: number; h: number; mw?: number; mh?: number; label?: string };

export const slots = {
  "HERO-01": { file: "glea-hero-01-d.webp", mobile: "glea-hero-01-m.webp", alt: "Reader in bed with a Glea light clipped to a book", w: 2800, h: 1300, mw: 1490, mh: 2032 },
  "HERO-02": { file: "glea-hero-02-d.webp", mobile: "glea-hero-02-m.webp", alt: "Glea light glowing on an open book at night", w: 2800, h: 1300, mw: 1490, mh: 2032 },
  "HERO-03": { file: "glea-hero-03-d.webp", mobile: "glea-hero-03-m.webp", alt: "Amber Glea light clipped to a book", w: 2800, h: 1300, mw: 1490, mh: 2032 },
  "GAL-01": { file: "glea-gal-01-main.webp", alt: "Glea clip-on book reading light", w: 2048, h: 2048 },
  "GAL-02": { file: "glea-gal-02-partner.webp", alt: "Reading with Glea while a partner sleeps", w: 2048, h: 2194 },
  "GAL-03": { file: "glea-gal-03.webp", alt: "Glea light detail", w: 2048, h: 2194, label: "Gallery photo 3" },
  "GAL-04": { file: "glea-gal-04.webp", alt: "Glea light detail", w: 2048, h: 2194, label: "Gallery photo 4" },
  "GAL-05": { file: "glea-gal-05-neck-clip.webp", alt: "Glea bendable neck and clip", w: 2048, h: 2194 },
  "GAL-06": { file: "glea-gal-06.webp", alt: "Glea light detail", w: 2048, h: 2194, label: "Gallery photo 6" },
  "GAL-07": { file: "glea-gal-07-size.webp", alt: "Glea size next to a book", w: 2048, h: 2194 },
  "GAL-08": { file: "glea-gal-08-travel.webp", alt: "Glea packed for travel", w: 2048, h: 2194 },
  "APLUS-01": { file: "glea-aplus-01-d.webp", mobile: "glea-aplus-01-m.webp", alt: "Glea light on a book after dark", w: 2198, h: 900, mw: 1200, mh: 900 },
  "APLUS-02": { file: "glea-aplus-02-d.webp", mobile: "glea-aplus-02-m.webp", alt: "Glow on the page with a dark room around it", w: 2198, h: 900, mw: 1200, mh: 900 },
  "APLUS-03": { file: "glea-aplus-03-d.webp", mobile: "glea-aplus-03-m.webp", alt: "Bending the Glea neck to aim the light", w: 2198, h: 900, mw: 1200, mh: 900 },
  "APLUS-04": { file: "glea-aplus-04-d.webp", mobile: "glea-aplus-04-m.webp", alt: "Adjusting Glea brightness", w: 2198, h: 900, mw: 1200, mh: 900 },
  "APLUS-05": { file: "glea-aplus-05-d.webp", mobile: "glea-aplus-05-m.webp", alt: "Charging the Glea light", w: 2198, h: 900, mw: 1200, mh: 900 },
  "APLUS-06": { file: "glea-aplus-06-d.webp", mobile: "glea-aplus-06-m.webp", alt: "The six Glea colors", w: 2198, h: 900, mw: 1200, mh: 900 },
  "APLUS-07": { file: "glea-aplus-07-d.webp", mobile: "glea-aplus-07-m.webp", alt: "What comes in the Glea box", w: 2198, h: 900, mw: 1200, mh: 900 },
  "TILE-01": { file: "glea-tile-01-bed.webp", alt: "Reading in bed with Glea", w: 1000, h: 1150 },
  "TILE-02": { file: "glea-tile-02-travel.webp", alt: "Glea for travel", w: 1000, h: 500 },
  "TILE-03": { file: "glea-tile-03-gift.webp", alt: "Glea as a gift", w: 1000, h: 500 },
  "HOW-01": { file: "glea-how-01-clip.webp", alt: "Clip Glea to your book", w: 1200, h: 900 },
  "HOW-02": { file: "glea-how-02-glow.webp", alt: "Switch on the glow", w: 1200, h: 900 },
  "HOW-03": { file: "glea-how-03-read.webp", alt: "Keep reading", w: 1200, h: 900 },
  "ABOUT-01": { file: "glea-about-01-d.webp", mobile: "glea-about-01-m.webp", alt: "Glea reading light at night", w: 2800, h: 700, mw: 1300, mh: 1500 },
  "ABOUT-02": { file: "glea-about-02.webp", alt: "Glow on the page", w: 1500, h: 1000 },
  "ABOUT-03": { file: "glea-about-03.webp", alt: "Soft adjustable light", w: 1500, h: 1000 },
  "ABOUT-04": { file: "glea-about-04.webp", alt: "Glea colors", w: 1500, h: 1000 },
  "COLL": { file: "glea-coll-d.webp", mobile: "glea-coll-m.webp", alt: "Glea lights in six colors", w: 2560, h: 1000, mw: 1074, mh: 1465 },
  "CREATOR": { file: "glea-creator-d.webp", mobile: "glea-creator-m.webp", alt: "A reading corner lit by Glea", w: 2800, h: 1000, mw: 1200, mh: 1500 },
  "BLOG-01": { file: "glea-blog-01-partner.webp", alt: "Reading next to a sleeping partner", w: 1500, h: 1000 },
  "BLOG-02": { file: "glea-blog-02-choose.webp", alt: "Choosing a book light", w: 1500, h: 1000 },
  "BLOG-03": { file: "glea-blog-03-travel.webp", alt: "Reading on the go", w: 1500, h: 1000 },
  "POPUP": { file: "glea-popup.webp", alt: "Glea light on a book", w: 900, h: 1100, label: "Popup image" },
  "OG": { file: "glea-og.jpg", alt: "Glea clip-on book reading light", w: 1200, h: 630 },
} satisfies Record<string, Slot>;

export type SlotName = keyof typeof slots;

/** Per-color slots: drop glea-color-<slug>.webp (and -2, -3 for extra angles) into /public/media. */
export const colorFile = (slug: string, n = 1) => `glea-color-${slug}${n > 1 ? `-${n}` : ""}.webp`;

export const gallerySlots: SlotName[] = ["GAL-01", "GAL-02", "GAL-03", "GAL-04", "GAL-05", "GAL-06", "GAL-07", "GAL-08"];
