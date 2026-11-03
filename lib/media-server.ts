import "server-only";
import fs from "node:fs";
import path from "node:path";
import { slots, type SlotName, colorFile } from "./media";

const dir = path.join(process.cwd(), "public", "media");
const cache = new Map<string, boolean>();
export function mediaExists(file: string) {
  if (!cache.has(file)) cache.set(file, fs.existsSync(path.join(dir, file)));
  return cache.get(file)!;
}

export type ResolvedImage = { src: string; alt: string; w: number; h: number; mobile?: { src: string; w: number; h: number } } | null;

export function resolveSlot(name: SlotName): ResolvedImage {
  const s = slots[name] as (typeof slots)[SlotName] & { mobile?: string; mw?: number; mh?: number };
  if (!mediaExists(s.file)) return null;
  const mobile = s.mobile && mediaExists(s.mobile) ? { src: `/media/${s.mobile}`, w: s.mw ?? s.w, h: s.mh ?? s.h } : undefined;
  return { src: `/media/${s.file}`, alt: s.alt, w: s.w, h: s.h, mobile };
}

export function resolveColorImages(slug: string): string[] {
  const out: string[] = [];
  for (let n = 1; n <= 4; n++) {
    const f = colorFile(slug, n);
    if (mediaExists(f)) out.push(`/media/${f}`);
  }
  return out;
}
