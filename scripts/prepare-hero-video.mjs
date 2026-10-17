import { execFileSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import path from "node:path";

const bundled = path.resolve(".tools/video/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe");
const ffmpeg = process.env.FFMPEG_PATH ?? (existsSync(bundled) ? bundled : "ffmpeg");
const source = path.resolve("assets/source/ozone-hero-source.mp4");
const target = path.resolve("public/media/ozone-hero-mobile-hq.mp4");
// Crop before encoding: spend mobile bandwidth on the visible scene, not discarded edges.
// Keep all 720 source lines; the previous 360-line landscape encode was enlarged on phones.
const crop = "crop=trunc(ih*3/4/2)*2:ih:(iw-ow)*0.62:0,setsar=1";
execFileSync(ffmpeg, [
  "-hide_banner", "-loglevel", "error", "-y", "-i", source,
  "-vf", crop, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
  "-maxrate", "3M", "-bufsize", "6M", "-pix_fmt", "yuv420p",
  "-g", "48", "-movflags", "+faststart", "-map_metadata", "-1",
  `${target}.tmp.mp4`,
], { stdio: "inherit" });
renameSync(`${target}.tmp.mp4`, target);
execFileSync(ffmpeg, [
  "-hide_banner", "-loglevel", "error", "-y", "-i", source,
  "-vf", crop, "-frames:v", "1", "-quality", "85",
  path.resolve("public/media/hero-poster-mobile.webp"),
], { stdio: "inherit" });
console.log("Prepared 540×720 mobile hero and portrait poster from the master.");
