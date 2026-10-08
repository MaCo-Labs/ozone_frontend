export const TOTAL_FRAMES = 240;

export function frameFileName(index: number): string {
  return `ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`;
}
