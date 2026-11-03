import "server-only";
import fs from "node:fs";
import path from "node:path";
import { findDrop, mediaExists, resolveSlot, type ResolvedImage } from "./media-server";
import type { SlotName } from "./media";

/**
 * Video slots (T-051). Filename-driven, like the image slots:
 *   public/media/video/<base>-d.mp4   desktop loop (16:9), optional
 *   public/media/video/<base>-m.mp4   mobile loop (9:16), optional (falls back to the desktop file)
 *   public/media/video/<base>-d.webp  desktop poster (first frame), optional
 *   public/media/video/<base>-m.webp  mobile poster, optional
 * Sizes and alt text come from public/media/video/videos.json (written by scripts/import-videos.mjs).
 * No mp4: the slot shows its still image slot instead. No poster: the still image is the poster.
 * Approved hero frame (T-052): public/media/<frame>-16x9.<ext> (1920x1080) and <frame>-9x16.<ext> (1080x1920), e.g. hero-frame-01.
 *   When present it wins: it is the poster and also the still fallback (with or without an mp4).
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

let dims: Record<string, { w: number; h: number }> | null = null;
function dimOf(file: string) {
  if (!dims) {
    try { dims = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "media", "renders.json"), "utf8")); } catch { dims = {}; }
  }
  return dims![file];
}

export function resolveVideo(base: string, still: SlotName, frame?: string): ResolvedVideo {
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
  if (frame) {
    const fd = findDrop(`${frame}-16x9`), fm = findDrop(`${frame}-9x16`);
    const main = fd ?? fm;
    if (main) {
      const md = dimOf(main) ?? (fd ? { w: 1920, h: 1080 } : { w: 1080, h: 1920 });
      const mm2 = fd && fm ? (dimOf(fm) ?? { w: 1080, h: 1920 }) : null;
      poster = { src: `/media/${main}`, w: md.w, h: md.h, alt: info.alt ?? poster?.alt ?? "", mobile: fd && fm ? { src: `/media/${fm}`, w: mm2!.w, h: mm2!.h } : undefined };
    }
  }
  return { d, m, poster };
}
