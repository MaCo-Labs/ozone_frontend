/** Fit the canvas itself to a photograph, preserving every edge without gutters. */
export function imageCanvas(width: number, height: number, imageWidth: number, imageHeight: number) {
  const ratio = imageWidth > 0 && imageHeight > 0 ? imageWidth / imageHeight : 1.6;
  const canvasWidth = Math.max(0, Math.min(width, height * ratio));
  return { width: canvasWidth, height: canvasWidth / ratio };
}
