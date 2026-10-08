import { describe, it, expect } from "vitest";
import { shouldCaptureGesture, crossedThreshold, directionFromDelta } from "./gestureController";

describe("shouldCaptureGesture", () => {
  it("always captures while a playback animation is running, regardless of position or direction", () => {
    expect(shouldCaptureGesture("playing-forward", false, "down")).toBe(true);
    expect(shouldCaptureGesture("playing-forward", false, "up")).toBe(true);
    expect(shouldCaptureGesture("playing-reverse", true, "up")).toBe(true);
  });

  it("never captures when the hero isn't near the top of the viewport, outside playback", () => {
    expect(shouldCaptureGesture("opening", false, "down")).toBe(false);
    expect(shouldCaptureGesture("final", false, "up")).toBe(false);
  });

  it("opening captures a downward gesture near the top, but lets an upward gesture pass through", () => {
    expect(shouldCaptureGesture("opening", true, "down")).toBe(true);
    expect(shouldCaptureGesture("opening", true, "up")).toBe(false);
  });

  it("final captures an upward gesture near the top (returning to replay in reverse), but lets downward pass through to continue into the page", () => {
    expect(shouldCaptureGesture("final", true, "up")).toBe(true);
    expect(shouldCaptureGesture("final", true, "down")).toBe(false);
  });
});

describe("directionFromDelta", () => {
  it("reads a positive delta as down and negative as up", () => {
    expect(directionFromDelta(5)).toBe("down");
    expect(directionFromDelta(-5)).toBe("up");
  });

  it("treats exactly zero as down (no movement never reaches the caller anyway)", () => {
    expect(directionFromDelta(0)).toBe("down");
  });
});

describe("crossedThreshold", () => {
  it("is false below the threshold and true at or above it, for either sign", () => {
    expect(crossedThreshold(40, 60)).toBe(false);
    expect(crossedThreshold(60, 60)).toBe(true);
    expect(crossedThreshold(-60, 60)).toBe(true);
    expect(crossedThreshold(-40, 60)).toBe(false);
  });
});
