import { describe, it, expect } from "vitest";
import { nearestAvailableIndex } from "./frameCache";

describe("nearestAvailableIndex", () => {
  it("returns the requested index when it's already available", () => {
    const available = [true, true, true, true];
    expect(nearestAvailableIndex(available, 2)).toBe(2);
  });

  it("searches backward toward 0 when the requested index isn't available yet", () => {
    const available = [true, true, false, false, false];
    expect(nearestAvailableIndex(available, 4)).toBe(1);
  });

  it("returns null when nothing at or before the requested index is available", () => {
    const available = [false, false, true];
    expect(nearestAvailableIndex(available, 1)).toBe(null);
  });

  it("returns null for an empty cache", () => {
    expect(nearestAvailableIndex([], 0)).toBe(null);
  });

  it("clamps an out-of-range index into the array before searching", () => {
    const available = [true, false];
    expect(nearestAvailableIndex(available, 99)).toBe(0);
  });
});
