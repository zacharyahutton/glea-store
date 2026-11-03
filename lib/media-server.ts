import "server-only";
import fs from "node:fs";
import path from "node:path";
import { slots, type SlotName, colorFile, cutoutBase, cardBase, DROP_EXT } from "./media";

const dir = path.join(process.cwd(), "public", "media");
const cache = new Map<string, boolean>();
export function mediaExists(file: string) {
  if (!cache.has(file)) cache.set(file, fs.existsSync(path.join(dir, file)));
  return cache.get(file)!;
}

/** Real pixel sizes written by scripts/import-renders.mjs, so drop-ins never use placeholder dims. */
let dims: Record<string, { w: number; h: number }> | null = null;
function dimOf(file: string) {
  if (!dims) {
    try { dims = JSON.parse(fs.readFileSync(path.join(dir, "renders.json"), "utf8")); } catch { dims = {}; }
  }
  return dims![file];
}

export type ResolvedImage = { src: string; alt: string; w: number; h: number; note?: string; cutout?: boolean; mobile?: { src: string; w: number; h: number } } | null;

/** First existing /public/media/<base>.<ext> for the drop-in extensions, or null. */
export function findDrop(base: string): string | null {
  for (const e of DROP_EXT) if (mediaExists(`${base}.${e}`)) return `${base}.${e}`;
  return null;
}
const isCutout = (f: string) => /^glea-(cut|macro)-/.test(f);

export function resolveSlot(name: SlotName): ResolvedImage {
  const s = slots[name] as (typeof slots)[SlotName] & { mobile?: string; mw?: number; mh?: number; note?: string; drop?: string; dw?: number; dh?: number; dropAlt?: string };
  const d = s.drop ? findDrop(s.drop) : null;
  if (d) {
    const dm = findDrop(`${s.drop}-m`);
    const dd = dimOf(d), mdim = dm ? dimOf(dm) : undefined;
    return { src: `/media/${d}`, alt: s.dropAlt ?? s.alt, w: dd?.w ?? s.dw ?? s.w, h: dd?.h ?? s.dh ?? s.h, note: s.note, cutout: isCutout(d), mobile: dm ? { src: `/media/${dm}`, w: mdim?.w ?? 1080, h: mdim?.h ?? 1920 } : undefined };
  }
  if (!mediaExists(s.file)) return null;
  const mobile = s.mobile && mediaExists(s.mobile) ? { src: `/media/${s.mobile}`, w: s.mw ?? s.w, h: s.mh ?? s.h } : undefined;
  return { src: `/media/${s.file}`, alt: s.alt, w: s.w, h: s.h, note: s.note, mobile };
}

export function resolveColorImages(slug: string): string[] {
  const out: string[] = [];
  const lit = findDrop(cutoutBase(slug, true));
  const unlit = findDrop(cutoutBase(slug, false));
  if (lit) out.push(`/media/${lit}`);
  if (unlit) out.push(`/media/${unlit}`);
  for (let n = 1; n <= 4; n++) {
    const f = colorFile(slug, n);
    if (mediaExists(f)) out.push(`/media/${f}`);
  }
  return out;
}

/** Collection card image for a color: the T-047 code-made card if present, else the first color photo. */
export function resolveCardImage(slug: string): string | undefined {
  const c = findDrop(cardBase(slug));
  return c ? `/media/${c}` : resolveColorImages(slug)[0];
}

/**
 * Card hover image (T-052, Loftie card image swap): glea-hover-<color> (4:5, same scene closer, no person) when present,
 * else the color's studio photo (glea-var-<color>-1100), else its lit cutout. Never the same file as the card image.
 */
export function resolveHoverImage(slug: string, primary?: string): string | undefined {
  const h = findDrop(`glea-hover-${slug.replace(/-/g, "")}`);
  const opts = [h ? `/media/${h}` : null, ...resolveColorImages(slug).filter((x) => !x.includes("-unlit"))];
  return opts.find((x): x is string => !!x && x !== primary);
}

/** True when a slot's drop-in render (not the placeholder) is present. */
export function hasDrop(name: SlotName): boolean {
  const s = slots[name] as { drop?: string };
  return !!(s.drop && findDrop(s.drop));
}
