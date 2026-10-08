import sharp from "sharp";

/**
 * Clone-stamps a same-size region from (cloneX, cloneY) over the target
 * box at (x, y, width, height) within the same image, then lightly blurs
 * a thin band around the patch border to soften the seam.
 */
export async function patchRegion(inputBuffer, region) {
  const { x, y, width, height, cloneX, cloneY, featherWidth = 12 } = region;

  const clone = await sharp(inputBuffer)
    .extract({ left: cloneX, top: cloneY, width, height })
    .toBuffer();

  const patched = await sharp(inputBuffer)
    .composite([{ input: clone, left: x, top: y }])
    .toBuffer();

  const meta = await sharp(inputBuffer).metadata();
  const left = Math.max(0, x - featherWidth);
  const top = Math.max(0, y - featherWidth);
  const right = Math.min(x + width + featherWidth, meta.width);
  const bottom = Math.min(y + height + featherWidth, meta.height);
  const bandBox = {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };

  const blurredBand = await sharp(patched)
    .extract(bandBox)
    .blur(6)
    .toBuffer();

  return sharp(patched)
    .composite([{ input: blurredBand, left: bandBox.left, top: bandBox.top }])
    .png()
    .toBuffer();
}
