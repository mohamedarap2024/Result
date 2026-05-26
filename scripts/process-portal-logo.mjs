/**
 * Remove black background from portal banner logo (edge flood-fill).
 * Run: npm run logo:portal-transparent
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(__dirname, "..", "public", "logo-sjec-portal.png");
const THRESHOLD = 48;

const { data, info } = await sharp(output)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const channels = 4;
const visited = new Uint8Array(width * height);

function isBg(x, y) {
  const i = (y * width + x) * channels;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  return r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD;
}

const queue = [];
for (let x = 0; x < width; x++) {
  for (const y of [0, height - 1]) {
    if (isBg(x, y)) queue.push([x, y]);
  }
}
for (let y = 0; y < height; y++) {
  for (const x of [0, width - 1]) {
    if (isBg(x, y)) queue.push([x, y]);
  }
}

while (queue.length > 0) {
  const [x, y] = queue.pop();
  const idx = y * width + x;
  if (visited[idx] || !isBg(x, y)) continue;
  visited[idx] = 1;
  const pi = idx * channels;
  data[pi + 3] = 0;
  for (const [nx, ny] of [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ]) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny * width + nx]) {
      queue.push([nx, ny]);
    }
  }
}

const tmp = output + ".tmp.png";
await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(tmp);
fs.renameSync(tmp, output);

let transparent = 0;
for (let i = 3; i < data.length; i += channels) {
  if (data[i] < 10) transparent++;
}
console.log(
  `Portal logo transparent: ${Math.round((100 * transparent) / (width * height))}%`
);
