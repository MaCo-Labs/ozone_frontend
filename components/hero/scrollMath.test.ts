import { describe, it, expect } from "vitest";
import { frameIndexForProgress, stageIndexForProgress } from "./scrollMath";

describe("frameIndexForProgress", () => {
  it("maps 0 to the first frame and 1 to the last", () => {
    expect(frameIndexForProgress(0, 240)).toBe(0);
    expect(frameIndexForProgress(1, 240)).toBe(239);
  });

  it("maps the midpoint proportionally", () => {
    expect(frameIndexForProgress(0.5, 240)).toBe(120);
  });

  it("clamps out-of-range progress", () => {
    expect(frameIndexForProgress(-0.2, 240)).toBe(0);
    expect(frameIndexForProgress(1.5, 240)).toBe(239);
  });
});

describe("stageIndexForProgress", () => {
  it("maps progress to one of 6 stages", () => {
    expect(stageIndexForProgress(0, 6)).toBe(0);
    expect(stageIndexForProgress(0.99, 6)).toBe(5);
    expect(stageIndexForProgress(0.5, 6)).toBe(3);
  });
});
