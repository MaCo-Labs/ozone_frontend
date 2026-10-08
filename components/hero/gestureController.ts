import { isPlaying, type HeroState } from "./playbackController";

export type GestureDirection = "up" | "down";

/**
 * Decides whether a wheel/touch gesture should be captured (preventDefault,
 * so it drives the cinematic instead of scrolling the page) or left alone.
 *
 * - Always captured while a playback animation is already running, so a
 *   second gesture mid-animation can't restart or interrupt it (the caller
 *   still needs to actually ignore/no-op the gesture's effect; this only
 *   answers "should the browser's default scroll be prevented").
 * - Otherwise, captured only when the hero is near the top of the viewport
 *   (the thing currently on screen) AND the gesture direction matches what
 *   that state is waiting for: a downward gesture from "opening" starts the
 *   forward cinematic; an upward gesture from "final" starts the reverse
 *   one. The opposite direction, or any gesture once scrolled away from the
 *   hero, passes through untouched so normal page scrolling always works.
 */
/** Reads a raw wheel deltaY or touch-drag delta as a scroll-intent direction. */
export function directionFromDelta(delta: number): GestureDirection {
  return delta < 0 ? "up" : "down";
}

/** Whether accumulated gesture magnitude is enough to count as intentional, not noise. */
export function crossedThreshold(accumulated: number, threshold: number): boolean {
  return Math.abs(accumulated) >= threshold;
}

export function shouldCaptureGesture(
  state: HeroState,
  isNearTop: boolean,
  direction: GestureDirection
): boolean {
  if (isPlaying(state)) return true;
  if (!isNearTop) return false;
  if (state === "opening") return direction === "down";
  if (state === "final") return direction === "up";
  return false;
}
