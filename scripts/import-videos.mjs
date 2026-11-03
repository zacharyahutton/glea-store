// Import background video loops into public/media/video (T-051). Run locally before commit:
//   node scripts/import-videos.mjs
// For each <base>-d.mp4 / <base>-m.mp4 already in public/media/video, writes a first-frame WebP poster
// (<base>-d.webp / <base>-m.webp) if missing (needs ffmpeg on this machine) and records poster sizes in videos.json.
// Encode new loops first, for example:
//   ffmpeg -i in.mp4 -an -c:v libx264 -crf 28 -pix_fmt yuv420p -vf scale=1920:1080 -movflags +faststart <base>-d.mp4
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "media", "video");
const ALTS = { "glea-hero": "Warm lamp light in a dark room at night" };
const metaPath = path.join(DIR, "videos.json");
const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf8")) : {};
for (const f of fs.readdirSync(DIR).filter((f) => /-(d|m)\.mp4$/.test(f))) {
  const [, base, k] = f.match(/^(.*)-(d|m)\.mp4$/);
  const poster = path.join(DIR, `${base}-${k}.webp`);
  if (!fs.existsSync(poster)) {
    const tmp = path.join(DIR, `.${base}-${k}.png`);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(DIR, f), "-frames:v", "1", tmp]);
    await sharp(tmp).webp({ quality: 62 }).toFile(poster);
    fs.unlinkSync(tmp);
  }
  const { width, height } = await sharp(poster).metadata();
  meta[base] = { ...(meta[base] || {}), alt: meta[base]?.alt ?? ALTS[base] ?? "", [k]: { w: width, h: height } };
  console.log("ok", f, `${width}x${height}`, `${Math.round(fs.statSync(path.join(DIR, f)).size / 1024)} KB`);
}
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 1) + "\n");
