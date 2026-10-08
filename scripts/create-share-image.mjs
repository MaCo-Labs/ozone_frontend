import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#171c1b"/>
  <path d="M72 80H1128" stroke="#19bdc6" stroke-width="3"/>
  <text x="72" y="148" fill="#19bdc6" font-family="Arial, sans-serif" font-size="24" letter-spacing="4">DOHA / QATAR</text>
  <text x="65" y="310" fill="#fbfaf6" font-family="Arial, sans-serif" font-weight="700" font-size="150" letter-spacing="-6">OZONE</text>
  <text x="72" y="395" fill="#fbfaf6" font-family="Arial, sans-serif" font-size="44">Spaces built to work.</text>
  <text x="72" y="476" fill="#c9ceca" font-family="Arial, sans-serif" font-size="25">Interior fit-out · Contracting · MEP · Engineering</text>
  <text x="72" y="556" fill="#19bdc6" font-family="Arial, sans-serif" font-size="23">ozonefitout.com</text>
</svg>`;

await mkdir("public/social", { recursive: true });
await sharp(Buffer.from(svg)).png().toFile("public/social/ozone-share.png");
console.log("Created public/social/ozone-share.png (1200 × 630)");
