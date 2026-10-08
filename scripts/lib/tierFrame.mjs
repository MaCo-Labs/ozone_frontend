import sharp from "sharp";

/**
 * Resizes and JPEG-encodes the input into each named width tier,
 * e.g. tierFrame(buf, { mobile: 1280, desktop: 2560 }).
 */
export async function tierFrame(inputBuffer, widths) {
  const outputs = {};
  for (const [tier, width] of Object.entries(widths)) {
    outputs[tier] = await sharp(inputBuffer)
      .resize({ width })
      .jpeg({ quality: 78 })
      .toBuffer();
  }
  return outputs;
}
