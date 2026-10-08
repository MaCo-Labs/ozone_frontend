import { describe, expect, it } from "vitest";
import { imageCanvas } from "./imageCanvas";

describe("photograph canvas", () => {
  it.each([[240, 1200], [1600, 160], [24, 24], [1600, 1200]])("preserves all edges of a %s × %s image", (width, height) => {
    const canvas = imageCanvas(800, 500, width, height);
    expect(canvas.width).toBeLessThanOrEqual(800);
    expect(canvas.height).toBeLessThanOrEqual(500);
    expect(canvas.width / canvas.height).toBeCloseTo(width / height);
    expect(canvas.width === 800 || canvas.height === 500).toBe(true);
  });
  it("handles an unmeasured image before load", () => {
    expect(imageCanvas(800, 500, 0, 0)).toEqual({ width: 800, height: 500 });
  });
});
