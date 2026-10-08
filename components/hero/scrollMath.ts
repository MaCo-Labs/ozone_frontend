export function frameIndexForProgress(progress: number, totalFrames: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(totalFrames - 1, Math.floor(clamped * totalFrames));
}

export function stageIndexForProgress(progress: number, stageCount: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(stageCount - 1, Math.floor(clamped * stageCount));
}
