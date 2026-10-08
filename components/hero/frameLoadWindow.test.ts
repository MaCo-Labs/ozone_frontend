import { describe, it, expect } from "vitest";
import { clampToLoaded } from "./frameLoadWindow";

describe("clampToLoaded", () => {
  it("returns the requested index when it's already loaded", () => {
    expect(clampToLoaded(10, 50)).toBe(10);
  });

  it("clamps to the last loaded frame when the request is ahead of loading", () => {
    expect(clampToLoaded(150, 50)).toBe(49);
  });

  it("returns 0 when nothing has loaded yet", () => {
    expect(clampToLoaded(5, 0)).toBe(0);
  });
});
