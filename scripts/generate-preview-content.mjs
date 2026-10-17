import sharp from "sharp";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const mediaRoot = path.resolve(root, "../backend/media");
const output = path.resolve(root, "public/preview");
const api = process.env.OZONE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
await mkdir(output, { recursive: true });
const content = { clients: [], projects: {} };
let inputBytes = 0, previewBytes = 0, thumbnailBytes = 0;

function localMedia(url) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  if (!pathname.startsWith("/media/")) throw new Error("Only local approved studio media can be packaged.");
  const file = path.resolve(mediaRoot, pathname.slice(7));
  if (!file.startsWith(mediaRoot + path.sep)) throw new Error("Media path escapes its source directory.");
  return file;
}
async function response(endpoint) {
  const result = await fetch(api + endpoint);
  return result.ok ? result.json() : null;
}
for (const [slug, fallback, title] of [["qatar-rail", "qatar-rail", "Qatar Rail"], ["maestro", "maestro-medical-centre", "Maestro Medical Centre"], ["apparel-group", "apparel-head-office", "Apparel Group Head Office"]]) {
  const project = await response(`/projects/${slug}/`);
  const sources = project?.images?.length ? project.images : [{ image_url: `/brochure/${fallback}.jpg`, alt_text: `${title} interior photographs`, caption: "", is_cover: true, display_order: 0 }];
  content.projects[slug] = [];
  for (const [index, image] of sources.entries()) {
    const source = image.image_url.startsWith("/") ? path.join(root, "public", image.image_url) : localMedia(image.image_url);
    const input = await readFile(source);
    const name = `${slug}-${String(index + 1).padStart(2, "0")}`;
    const full = `${name}.webp`, thumbnail = `${name}-thumb.webp`;
    await sharp(input).rotate().resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(output, full));
    await sharp(input).rotate().resize({ width: 200, height: 200, fit: "inside", withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(output, thumbnail));
    inputBytes += input.length; previewBytes += (await stat(path.join(output, full))).size; thumbnailBytes += (await stat(path.join(output, thumbnail))).size;
    content.projects[slug].push({ ...image, source_name: path.basename(source), image_url: `/preview/${full}`, thumbnail_url: `/preview/${thumbnail}` });
  }
}
const clients = await response("/clients/?limit=100");
for (const client of clients?.results ?? []) {
  if (!client.logo_url) { content.clients.push(client); continue; }
  const name = `client-${client.slug}.webp`;
  await sharp(await readFile(localMedia(client.logo_url))).rotate().resize({ width: 300, height: 140, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toFile(path.join(output, name));
  content.clients.push({ ...client, logo_url: `/preview/${name}` });
}
await writeFile(path.join(root, "lib/previewContent.json"), JSON.stringify(content, null, 2) + "\n");
console.log(JSON.stringify({ images: Object.values(content.projects).flat().length, clients: content.clients.length, inputBytes, previewBytes, thumbnailBytes }, null, 2));
