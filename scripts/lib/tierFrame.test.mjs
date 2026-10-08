import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { tierFrame } from "./tierFrame.mjs";

describe("tierFrame", () => {
  it("resizes the input to each requested width", async () => {
    const input = await sharp({
      create: { width: 800, height: 450, channels: 3, background: { r: 100, g: 100, b: 100 } },
    })
      .jpeg()
      .toBuffer();

    const tiers = await tierFrame(input, { mobile: 400, desktop: 800 });

    const mobileMeta = await sharp(tiers.mobile).metadata();
    const desktopMeta = await sharp(tiers.desktop).metadata();

    expect(mobileMeta.width).toBe(400);
    expect(mobileMeta.height).toBe(225);
    expect(desktopMeta.width).toBe(800);
  });
});
