export type HeroState = "opening" | "playing-forward" | "final" | "playing-reverse";

/**
 * Maps a hero state + elapsed/duration to a 0..1 progress value, the same
 * shape scrollMath's frameIndexForProgress/stageIndexForProgress already
 * consume -- forward and reverse playback just walk that value in opposite
 * directions over time instead of scroll distance.
 */
export function progressForState(state: HeroState, elapsedMs: number, durationMs: number): number {
  const t = durationMs > 0 ? Math.min(1, Math.max(0, elapsedMs / durationMs)) : 1;
  switch (state) {
    case "opening":
      return 0;
    case "final":
      return 1;
    case "playing-forward":
      return t;
    case "playing-reverse":
      return 1 - t;
  }
}

export function isPlaying(state: HeroState): boolean {
  return state === "playing-forward" || state === "playing-reverse";
}

/** Page scroll is captured only while the cinematic is actively playing. */
export function isLocked(state: HeroState): boolean {
  return isPlaying(state);
}

export function nextStateOnGestureDown(state: HeroState): HeroState {
  return state === "opening" ? "playing-forward" : state;
}

export function nextStateOnGestureUp(state: HeroState): HeroState {
  return state === "final" ? "playing-reverse" : state;
}

export function nextStateOnPlaybackComplete(state: HeroState): HeroState {
  if (state === "playing-forward") return "final";
  if (state === "playing-reverse") return "opening";
  return state;
}
