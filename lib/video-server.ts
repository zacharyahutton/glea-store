import "server-only";
import fs from "node:fs";
import path from "node:path";
import { mediaExists, resolveSlot, type ResolvedImage } from "./media-server";
import type { SlotName } from "./media";

/**
 * Video slots (T-051). Filename-driven, like the image slots:
 *   public/media/video/<base>-d.mp4   desktop loop (16:9), optional
 *   public/media/video/<base>-m.mp4   mobile loop (9:16), optional (falls back to the desktop file)
 *   public/media/video/<base>-d.webp  desktop poster (first frame), optional
 *   public/media/video/<base>-m.webp  mobile poster, optional
 * Sizes and alt text come from public/media/video/videos.json (written by scripts/import-videos.mjs).
 * No mp4: the slot shows its still image slot instead. No poster: the still image is the poster.
 */
type Meta = Record<string, { alt?: string; d?: { w: number; h: number }; m?: { w: number; h: number } }>;
let meta: Meta | null = null;
function metaOf(base: string) {
  if (!meta) {
    try { meta = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "media", "video", "videos.json"), "utf8")); } catch { meta = {}; }
  }
  return meta![base] ?? {};
}

export type ResolvedVideo = { d: string | null; m: string | null; poster: ResolvedImage };

export function resolveVideo(base: string, still: SlotName): ResolvedVideo {
  const has = (f: string) => mediaExists(`video/${f}`);
  const dm = has(`${base}-d.mp4`), mm = has(`${base}-m.mp4`);
  const d = dm ? `/media/video/${base}-d.mp4` : mm ? `/media/video/${base}-m.mp4` : null;
  const m = mm ? `/media/video/${base}-m.mp4` : d;
  const info = metaOf(base);
  const pd = has(`${base}-d.webp`) && info.d ? { src: `/media/video/${base}-d.webp`, ...info.d } : null;
  const pm = has(`${base}-m.webp`) && info.m ? { src: `/media/video/${base}-m.webp`, ...info.m } : null;
  let poster: ResolvedImage = resolveSlot(still);
  // Video posters only make sense next to their video; without an mp4 the still image slot is used.
  if (d && (pd || pm)) {
    const main = pd ?? pm!;
    poster = { src: main.src, w: main.w, h: main.h, alt: info.alt ?? poster?.alt ?? "", mobile: pd && pm ? { src: pm.src, w: pm.w, h: pm.h } : undefined };
  }
  return { d, m, poster };
}
