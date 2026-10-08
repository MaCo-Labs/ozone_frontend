/**
 * Given the frame the current scroll position wants and how many frames
 * have loaded so far (frames always load in order from 0), returns the
 * frame to actually display — never one that isn't loaded yet.
 */
export function clampToLoaded(requestedIndex: number, loadedCount: number): number {
  if (loadedCount <= 0) return 0;
  return Math.min(requestedIndex, loadedCount - 1);
}
