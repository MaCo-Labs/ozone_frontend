import { TOTAL_FRAMES, frameFileName } from "./frames";

export type Tier = "mobile" | "desktop";

/**
 * Pure search: the nearest available (already-decoded) frame at or before
 * `index`, so playback never shows a blank frame or jumps to the wrong
 * direction while decoding is still catching up -- it just holds the last
 * genuinely-decoded frame until the real one is ready.
 */
export function nearestAvailableIndex(available: boolean[], index: number): number | null {
  const clamped = Math.max(0, Math.min(available.length - 1, index));
  for (let i = clamped; i >= 0; i--) {
    if (available[i]) return i;
  }
  return null;
}

type Entry = {
  blob: Blob | null;
  bitmap: ImageBitmap | null;
  status: "idle" | "fetching" | "fetched" | "error";
};

// A fully-decoded 2560x1440 ImageBitmap is roughly 14.7MB uncompressed; holding
// all 240 desktop frames decoded at once (~3.5GB) risks real memory pressure.
// Compressed blobs are cheap (~100-200KB each, ~30-45MB total for the whole
// sequence) and fetched once; only a window of DECODE_WINDOW_RADIUS frames on
// each side of the active index is kept as a decoded ImageBitmap at a time,
// decoding on demand from the already-fetched blob (fast -- no network) and
// evicting (bitmap.close()) outside that window. First-pass sizing, not
// device-profiled -- tune if real playback shows decode falling behind.
const DECODE_WINDOW_RADIUS = 40;

export class FrameCache {
  private entries: Entry[];
  private cancelled = false;

  constructor(
    private totalFrames: number = TOTAL_FRAMES,
    private tier: Tier = "desktop"
  ) {
    this.entries = Array.from({ length: totalFrames }, () => ({ blob: null, bitmap: null, status: "idle" }));
  }

  cancel(): void {
    this.cancelled = true;
  }

  get(index: number): ImageBitmap | null {
    return this.entries[index]?.bitmap ?? null;
  }

  nearestDecoded(index: number): number | null {
    return nearestAvailableIndex(this.entries.map((e) => e.bitmap !== null), index);
  }

  fetchedCount(): number {
    return this.entries.filter((e) => e.status === "fetched" || e.status === "error").length;
  }

  isFullyFetched(): boolean {
    return this.fetchedCount() === this.totalFrames;
  }

  private async fetchBlob(index: number): Promise<void> {
    const entry = this.entries[index];
    if (entry.status === "fetched" || entry.status === "fetching") return;
    entry.status = "fetching";
    try {
      const res = await fetch(`/hero-frames/${this.tier}/${frameFileName(index)}`);
      entry.blob = await res.blob();
      entry.status = "fetched";
    } catch {
      entry.status = "error";
    }
  }

  /**
   * Fetches AND decodes a single frame immediately, awaiting both steps --
   * for getting one specific frame (typically 0, or the last frame under
   * reduced motion) on screen as fast as possible, ahead of the rest of the
   * sequence. `ensureDecodedWindow` alone can't do this: it only decodes
   * frames whose blob has *already* arrived, so calling it before any
   * fetching has happened is a silent no-op.
   */
  async primeFrame(index: number): Promise<void> {
    await this.fetchBlob(index);
    const entry = this.entries[index];
    if (entry.blob && !entry.bitmap && !this.cancelled) {
      try {
        entry.bitmap = await createImageBitmap(entry.blob);
      } catch {
        // leave null; nearestDecoded() falls back to the last good frame
      }
    }
  }

  /** Fetches every frame's compressed blob, in order, in the background. */
  async fetchAll(onProgress?: (fetchedCount: number) => void): Promise<void> {
    for (let i = 0; i < this.totalFrames; i++) {
      if (this.cancelled) return;
      await this.fetchBlob(i);
      onProgress?.(this.fetchedCount());
    }
  }

  /**
   * Ensures frames within `radius` of `index` are decoded, and evicts
   * decoded bitmaps outside that window to bound memory. Safe to call
   * repeatedly (e.g. once per animation frame during playback) -- already
   *-decoded frames inside the window are left alone.
   */
  async ensureDecodedWindow(index: number, radius: number = DECODE_WINDOW_RADIUS): Promise<void> {
    const lo = Math.max(0, index - radius);
    const hi = Math.min(this.totalFrames - 1, index + radius);

    for (let i = 0; i < this.totalFrames; i++) {
      const entry = this.entries[i];
      if (i < lo || i > hi) {
        if (entry.bitmap) {
          entry.bitmap.close();
          entry.bitmap = null;
        }
        continue;
      }
      if (!entry.bitmap && entry.blob && !this.cancelled) {
        try {
          entry.bitmap = await createImageBitmap(entry.blob);
        } catch {
          // leave null; nearestDecoded() falls back to the last good frame
        }
      }
    }
  }
}
