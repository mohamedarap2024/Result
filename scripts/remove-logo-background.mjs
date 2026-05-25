/**
 * Make shield logo transparent: remove flat black + white backgrounds.
 * Run: npm run logo:transparent
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const output = path.join(publicDir, "logo-sjec-shield.png");

const sources = [
  path.join(publicDir, "logo-sjec-shield.png"),
  path.join(
    __dirname,
    "..",
    "..",
    "..",
    ".cursor",
    "projects",
    "c-Users-hp-Desktop-STDMarksfull",
    "assets"
  ),
];

let input = path.join(publicDir, "logo-sjec-shield.png");
const assetDir = path.join(
  "C:",
  "Users",
  "hp",
  ".cursor",
  "projects",
  "c-Users-hp-Desktop-STDMarksfull",
  "assets"
);
if (fs.existsSync(assetDir)) {
  const newest = fs
    .readdirSync(assetDir)
    .filter((f) => f.includes("bf6e1e3d") || f.includes("517960bc"))
    .map((f) => ({
      f,
      m: fs.statSync(path.join(assetDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.m - a.m)[0];
  if (newest) input = path.join(assetDir, newest.f);
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const channels = 4;

function shouldRemove(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (r + g + b) / 3;
  const sat = max === 0 ? 0 : (max - min) / max;
  if (lum >= 248) return true;
  if (lum <= 58 && sat <= 0.28) return true;
  return false;
}

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (shouldRemove(r, g, b)) {
    data[i + 3] = 0;
  } else {
    data[i + 3] = 255;
  }
}

const tmp = output + ".tmp.png";
await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(tmp);
fs.renameSync(tmp, output);

let transparent = 0;
const total = data.length / channels;
for (let i = 3; i < data.length; i += channels) {
  if (data[i] < 10) transparent++;
}
console.log(
  `Saved ${output} — ${Math.round((100 * transparent) / total)}% transparent`
);
