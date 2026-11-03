// Import finished Glea renders (T-047 shotlist filenames) into public/media as WebP.
// Run locally before commit: node scripts/import-renders.mjs [srcDir]
// Vercel builds only see git-tracked files, so the WebP output is committed.
// Missing files are skipped; the site then falls back to the v3c placeholders.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = process.argv[2] || "/workspace/eco/glea-renders";
const OUT = path.join(process.cwd(), "public", "media");
const COLORS = ["black", "amber", "pink", "purple", "lakeblue", "white"];
const CREAM = { r: 243, g: 231, b: 208, alpha: 1 };
const MAX = 2400;

const names = [
  ...COLORS.flatMap((c) => [`glea-cut-hero-${c}-lit`, `glea-cut-hero-${c}-unlit`]),
  "glea-cut-onbook-black-lit", "glea-cut-side-black", "glea-cut-back-clip-black", "glea-cut-folded-black",
  "glea-macro-clip-black", "glea-macro-head-black-lit", "glea-macro-charge-black", "glea-cut-lineup-6",
  "glea-studio-navy-black-lit", "glea-studio-cream-white-lit", "glea-cut-top-black-lit", "glea-cut-bent-black-lit",
  "glea-macro-button-black", "glea-cut-light-4500k-black", "glea-cut-light-6000k-black", "glea-flatlay-inbox-black",
  "glea-cut-hand-black", "glea-studio-amber-amber-lit", "glea-cut-pair-black-white",
  "glea-life-hero-window", "glea-life-hero-window-m", "glea-life-plinth-stone", "glea-life-nightstand",
  "glea-life-hands-reading", "glea-life-partner-bed", "glea-life-armchair", "glea-life-travel-hotel",
  "glea-life-sofa-blanket", "glea-life-gift-unwrap", "glea-life-ugc-stack",
  "glea-life-how-clip", "glea-life-how-aim", "glea-life-how-read", "glea-og-life",
  // T-052: card hover images (4:5) and the approved first hero frame (video poster + still fallback)
  ...COLORS.map((c) => `glea-hover-${c}`), "glea-hover-pair", "hero-frame-01-16x9", "hero-frame-01-9x16",
];
const EXT = [".png", ".webp", ".jpg", ".jpeg"];
const find = (base) => {
  for (const e of EXT) { const f = path.join(SRC, base + e); if (fs.existsSync(f)) return f; }
  return null;
};
const manifestPath = path.join(OUT, "renders.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const cut = (b) => /^glea-(cut|macro)-/.test(b);
let done = 0, missing = [];

for (const base of names) {
  const src = find(base);
  if (!src) { missing.push(base); continue; }
  const out = path.join(OUT, `${base}.webp`);
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) { done++; continue; }
  let img = sharp(src).rotate().resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true });
  if (!cut(base)) img = img.flatten({ background: CREAM });
  const info = await img.webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(out);
  manifest[`${base}.webp`] = { w: info.width, h: info.height };
  done++;
  console.log("ok", base, `${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB");
}

// Collection cards: lit cutout centered on cream, 1200x1200.
for (const c of COLORS) {
  const src = find(`glea-cut-hero-${c}-lit`);
  if (!src) continue;
  const out = path.join(OUT, `glea-card-${c}.webp`);
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
  const fg = await sharp(src).resize({ width: 1000, height: 1000, fit: "inside" }).png().toBuffer();
  const info = await sharp({ create: { width: 1200, height: 1200, channels: 4, background: CREAM } })
    .composite([{ input: fg, gravity: "center" }]).webp({ quality: 82 }).toFile(out);
  manifest[`glea-card-${c}.webp`] = { w: info.width, h: info.height };
  console.log("ok card", c);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + "\n");
console.log(`\n${done}/${names.length} renders present. Missing (placeholders stay): ${missing.length}`);
if (missing.length) console.log(missing.join("\n"));
