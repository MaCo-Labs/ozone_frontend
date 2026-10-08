import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { patchRegion } from "./patchFrame.mjs";

describe("patchRegion", () => {
  it("replaces the target region with pixels from the clone source", async () => {
    // 100x100 image: left half red (the "clean" area to clone from),
    // right half blue (the "text" area to patch over).
    const width = 100;
    const height = 100;
    const svg = `<svg width="${width}" height="${height}">
      <rect x="0" y="0" width="50" height="${height}" fill="red" />
      <rect x="50" y="0" width="50" height="${height}" fill="blue" />
    </svg>`;
    const input = await sharp(Buffer.from(svg)).png().toBuffer();

    const result = await patchRegion(input, {
      x: 50,
      y: 0,
      width: 40,
      height: 40,
      cloneX: 5,
      cloneY: 0,
      featherWidth: 2,
    });

    const { data, info } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
    const idx = (info.width * 20 + 70) * info.channels; // center of the patched region
    const [r, b] = [data[idx], data[idx + 2]];

    expect(r).toBeGreaterThan(180); // patched pixel should now read red-ish, not blue
    expect(b).toBeLessThan(80);
  });

  it("does not overshoot the feather band past its correct edge when the patch sits near the image's left edge", async () => {
    // 100x100 image: red for x<30, blue for x>=30. Patch box is x:0-20, y:30-50
    // (entirely inside the red zone), with featherWidth=10, so x=0 < featherWidth
    // triggers left-edge clamping. bandBox.left is clamped to 0, losing 10px of
    // its intended left margin — the correct (symmetric) band should stop 10px
    // short on the right to compensate: right edge = x + width + featherWidth = 30.
    // The buggy formula instead derives width from the unclamped
    // `width + featherWidth * 2` = 40, overshooting the right edge to x=40 and
    // blurring 10 extra columns (x:30-39) that should have been left untouched.
    const width = 100;
    const height = 100;
    const svg = `<svg width="${width}" height="${height}">
      <rect x="0" y="0" width="30" height="${height}" fill="red" />
      <rect x="30" y="0" width="70" height="${height}" fill="blue" />
    </svg>`;
    const input = await sharp(Buffer.from(svg)).png().toBuffer();

    const result = await patchRegion(input, {
      x: 0,
      y: 30,
      width: 20,
      height: 20,
      cloneX: 0,
      cloneY: 60,
      featherWidth: 10,
    });

    const { data, info } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
    // x=33 sits at the correct band's right edge (30) plus a 3px margin: still
    // well inside the buggy band's overshot right edge (40), and far enough from
    // the red/blue seam at x=30 to catch blur bleed unambiguously.
    const idx = (info.width * 40 + 33) * info.channels;
    const [r, b] = [data[idx], data[idx + 2]];

    // Correct band excludes x=33 entirely, so it must be untouched, pure blue.
    // The buggy band includes it (right edge overshoots to 40) and blurs in red
    // from the seam at x=30, dragging r up and b down.
    expect(r).toBeLessThan(50);
    expect(b).toBeGreaterThan(200);
  });
});
