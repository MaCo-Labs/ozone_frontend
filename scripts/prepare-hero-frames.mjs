import { readdir, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { patchRegion } from "./lib/patchFrame.mjs";
import { tierFrame } from "./lib/tierFrame.mjs";

const SOURCE_DIR = path.resolve("assets/hero-source-frames");
const OUT_DIR = path.resolve("public/hero-frames");

// The 240-frame sequence is a progressive transformation, not a static shot with
// static text: early frames (~30-89) show a construction/blueprint wall (white
// wireframe on black), with the headline positioned lower on the wall. The
// headline then crossfades -- dipping through a near-invisible low-contrast
// moment around frame ~90-105 -- to its final position higher on the wall
// (finished around frame ~118-120), which holds for the rest of the sequence.
// A second, smaller tagline ("FROM VISION / TO A BETTER TOMORROW.") draws on
// starting ~frame 140 and sits below the main block; the main region never
// reaches it.
//
// Values below came from pixel-brightness profiling and single-frame patch
// tests against the real source frames -- see task-7-report.md for that trail.
//
// FIX (post-Task-7): the original version of this script gave MAIN_EARLY and
// MAIN_LATE *different* target-box geometry (y:500/h:430 vs y:420/h:460),
// sized tightly to each phase's own text position. That's individually
// correct -- Task 7's review confirmed no leftover text on either side -- but
// it means the patch box's visible top edge jumps ~80px in the single frame
// transition from 89 to 90, which reads as something in the scene physically
// moving during live playback even though the real HTML headline (a separate,
// spatially-fixed DOM element) never does. Live-scrubbing the actual browser
// is what surfaces this; it's invisible comparing static frames side by side,
// which is why the original per-frame review didn't catch it.
//
// Fix: ONE constant box (the union of both phases' original boxes) for the
// entire patched range, so the box itself never resizes. Only the FILL
// strategy still switches at MAIN_SWITCH_FRAME, matching where the wall's own
// lighting genuinely changes (wireframe-cluttered vs a plain lit panel) --
// verified clean on both sides of that boundary by the original Task 7
// review, so kept as-is:
//  - EARLY frames: the whole wall is covered in wireframe linework, so
//    there's no clean patch anywhere. Cloning a single same-size block from
//    the duct/ceiling area above the text (still wireframe, but a different
//    part of it) reads as "more construction clutter" rather than an obvious
//    mismatch.
//  - LATE frames: the wall is a plain lit panel except for a diagonal ceiling
//    cove-light reflection that sweeps across the top of the region, hitting
//    any single same-size vertical clone somewhere along its sweep. The left
//    ~140px margin of the wall (before any text starts) is genuinely clean
//    for the whole height, so tiled copies of that strip are composited
//    across the target width instead.
const MAIN_BOX = { x: 90, y: 420, width: 780, height: 510 }; // union of the old 500/430 and 420/460 boxes
const TAGLINE = { x: 100, y: 885, width: 430, height: 130 };
const MAIN_SWITCH_FRAME = 90; // before: wireframe wall clone strategy. from here: lit wall tiled strategy.
const PATCH_FROM_FRAME = 30; // frames before this are already clean
const TAGLINE_FROM_FRAME = 140; // second tagline first becomes visible on the wall
const WIDTHS = { mobile: 1280, desktop: 2560 };

// Tiles copies of a clean vertical strip (from cloneX, same y-range as the
// target so lighting matches top-to-bottom) across `width`, as ONE manual
// composite (plain paste, no blur) -- then calls the real patchRegion exactly
// ONCE, self-cloning (cloneX=x, cloneY=y, a no-op paste), purely to get its
// single unified blur/feather pass over the whole target+margin band. Doing
// this as N separate patchRegion calls instead (one per tile) works but each
// gets its own independent blur pass, leaving visible periodic seams every
// tileWidth px -- confirmed while tuning these regions.
async function tilePatch(buf, { x, y, width, height, cloneX = 0, tileWidth = 130, featherWidth = 14 }) {
  const tiles = [];
  let cx = 0;
  let i = 0;
  while (cx < width) {
    const w = Math.min(tileWidth, width - cx);
    const srcX = cloneX + (i % 2) * 8; // slight alternation so tiles aren't byte-identical
    const tile = await sharp(buf).extract({ left: srcX, top: y, width: w, height }).toBuffer();
    tiles.push({ input: tile, left: cx, top: 0 });
    cx += w;
    i++;
  }
  const strip = await sharp({ create: { width, height, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite(tiles)
    .png()
    .toBuffer();
  const pasted = await sharp(buf).composite([{ input: strip, left: x, top: y }]).toBuffer();
  return patchRegion(pasted, { x, y, width, height, cloneX: x, cloneY: y, featherWidth });
}

async function main() {
  await mkdir(path.join(OUT_DIR, "mobile"), { recursive: true });
  await mkdir(path.join(OUT_DIR, "desktop"), { recursive: true });

  const files = (await readdir(SOURCE_DIR)).filter((f) => f.endsWith(".jpg")).sort();
  const manifest = [];

  for (const file of files) {
    const frameNum = parseInt(file.match(/(\d+)/)[1], 10);
    const raw = await readFile(path.join(SOURCE_DIR, file));

    let clean = raw;
    if (frameNum >= PATCH_FROM_FRAME && frameNum < MAIN_SWITCH_FRAME) {
      clean = await patchRegion(clean, { ...MAIN_BOX, cloneX: 90, cloneY: 10, featherWidth: 16 });
    } else if (frameNum >= MAIN_SWITCH_FRAME) {
      clean = await tilePatch(clean, MAIN_BOX);
    }
    if (frameNum >= TAGLINE_FROM_FRAME) {
      clean = await tilePatch(clean, TAGLINE);
    }

    const tiers = await tierFrame(clean, WIDTHS);
    for (const [tier, buf] of Object.entries(tiers)) {
      await writeFile(path.join(OUT_DIR, tier, file), buf);
    }
    manifest.push(file);
    if (frameNum % 40 === 0) console.log(`...${frameNum}/${files.length}`);
  }

  await writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify({ frames: manifest }, null, 2));
  console.log(`Processed ${manifest.length} frames into ${OUT_DIR}`);
}

main();
