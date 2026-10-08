import { describe, it, expect } from "vitest";
import {
  progressForState,
  isPlaying,
  isLocked,
  nextStateOnGestureDown,
  nextStateOnGestureUp,
  nextStateOnPlaybackComplete,
} from "./playbackController";

describe("progressForState", () => {
  it("is 0 at opening and 1 at final regardless of elapsed time", () => {
    expect(progressForState("opening", 999, 5000)).toBe(0);
    expect(progressForState("final", 0, 5000)).toBe(1);
  });

  it("maps forward playback elapsed time to increasing progress", () => {
    expect(progressForState("playing-forward", 0, 5000)).toBe(0);
    expect(progressForState("playing-forward", 2500, 5000)).toBe(0.5);
    expect(progressForState("playing-forward", 5000, 5000)).toBe(1);
  });

  it("clamps forward progress to [0, 1] for out-of-range elapsed time", () => {
    expect(progressForState("playing-forward", -100, 5000)).toBe(0);
    expect(progressForState("playing-forward", 9000, 5000)).toBe(1);
  });

  it("maps reverse playback elapsed time to decreasing progress", () => {
    expect(progressForState("playing-reverse", 0, 5000)).toBe(1);
    expect(progressForState("playing-reverse", 2500, 5000)).toBe(0.5);
    expect(progressForState("playing-reverse", 5000, 5000)).toBe(0);
  });
});

describe("isPlaying", () => {
  it("is true only during the two playing states", () => {
    expect(isPlaying("playing-forward")).toBe(true);
    expect(isPlaying("playing-reverse")).toBe(true);
    expect(isPlaying("opening")).toBe(false);
    expect(isPlaying("final")).toBe(false);
  });
});

describe("isLocked", () => {
  it("locks during both playing states, never during opening or final", () => {
    expect(isLocked("playing-forward")).toBe(true);
    expect(isLocked("playing-reverse")).toBe(true);
    expect(isLocked("opening")).toBe(false);
    expect(isLocked("final")).toBe(false);
  });
});

describe("state transitions", () => {
  it("a downward gesture starts forward playback only from opening", () => {
    expect(nextStateOnGestureDown("opening")).toBe("playing-forward");
    expect(nextStateOnGestureDown("playing-forward")).toBe("playing-forward");
    expect(nextStateOnGestureDown("final")).toBe("final");
    expect(nextStateOnGestureDown("playing-reverse")).toBe("playing-reverse");
  });

  it("an upward gesture starts reverse playback only from final", () => {
    expect(nextStateOnGestureUp("final")).toBe("playing-reverse");
    expect(nextStateOnGestureUp("opening")).toBe("opening");
    expect(nextStateOnGestureUp("playing-forward")).toBe("playing-forward");
    expect(nextStateOnGestureUp("playing-reverse")).toBe("playing-reverse");
  });

  it("forward playback completes into final; reverse completes into opening", () => {
    expect(nextStateOnPlaybackComplete("playing-forward")).toBe("final");
    expect(nextStateOnPlaybackComplete("playing-reverse")).toBe("opening");
  });

  it("completion is a no-op from a non-playing state", () => {
    expect(nextStateOnPlaybackComplete("opening")).toBe("opening");
    expect(nextStateOnPlaybackComplete("final")).toBe("final");
  });
});
