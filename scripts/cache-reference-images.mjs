// Cache existing illustrative images locally to remove third-party requests from page loads.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (/\.(tsx?|css)$/.test(entry.name) && !entry.name.endsWith('.test.ts')) files.push(file);
  }
}
for (const directory of ["app", "components", "lib"]) await collect(directory);
const sources = await Promise.all(files.map(async (file) => ({ file, text: await readFile(file, "utf8") })));
const urls = [...new Set(sources.flatMap(({ text }) => text.match(/https:\/\/images\.unsplash\.com\/[^"'\s)]+/g) || []))];
if (!urls.length) {
  console.log("Reference images are already local; existing source manifest preserved.");
  process.exit(0);
}
const groups = new Map();
for (const url of urls) {
  const name = new URL(url).pathname.slice(1);
  if (!groups.has(name)) groups.set(name, []);
  groups.get(name).push(url);
}
await mkdir("public/reference", { recursive: true });
const replacements = new Map();
const manifest = [];
const pending = [...groups];
async function worker() {
  while (pending.length) {
    const [name, originals] = pending.shift();
    try {
      const request = `https://images.unsplash.com/${name}?auto=format&fit=max&w=1800&q=85`;
      const response = await fetch(request, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const original = Buffer.from(await response.arrayBuffer());
      const output = `/reference/${name}.webp`;
      const info = await sharp(original).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public${output}`);
      originals.forEach((url) => replacements.set(url, output));
      manifest.push({ source: request, path: output, width: info.width, height: info.height, bytes: info.size });
      console.log(`${name}: ${info.size} bytes`);
    } catch (error) {
      console.error(`${name}: ${error.message} (existing URL retained)`);
    }
  }
}
await Promise.all([worker(), worker(), worker()]);
for (const { file, text } of sources) {
  let updated = text;
  for (const [source, local] of replacements) updated = updated.replaceAll(source, local);
  if (updated !== text) await writeFile(file, updated);
}
await mkdir("docs", { recursive: true });
await writeFile("docs/reference-image-sources.json", JSON.stringify(manifest.sort((a, b) => a.path.localeCompare(b.path)), null, 2));
console.log(`Cached ${manifest.length}/${groups.size} images locally (${manifest.reduce((bytes, image) => bytes + image.bytes, 0)} bytes).`);
