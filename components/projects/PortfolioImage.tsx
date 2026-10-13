"use client";

import Image from "next/image";
import { useState } from "react";
import type { StudioProjectImage } from "@/lib/content-api";

export function PortfolioImage({ image, sizes, eager = false }: { image: StudioProjectImage | null; sizes: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!image || failed) return <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--steel)", fontSize: ".8rem" }}>{failed ? "Image unavailable" : "Project photography coming soon"}</span>;
  const crop = image.crop;
  const centerX = crop ? crop.left + crop.width / 2 : 0;
  const centerY = crop ? crop.top + crop.height / 2 : 0;
  return <span style={{ position: "absolute", inset: 0, overflow: "hidden", ...(crop ? { containerType: "size" } : {}) }}><Image src={image.image_url} alt={image.alt_text} fill sizes={crop ? "200vw" : sizes} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined}
    style={crop ? {
      objectFit: "fill", maxWidth: "none",
      width: `max(${100 / crop.width}cqw, ${100 * crop.aspect / crop.height}cqh)`,
      height: `max(${100 / crop.height}cqh, ${100 / crop.aspect / crop.width}cqw)`,
      left: `calc(50cqw - max(${100 * centerX / crop.width}cqw, ${100 * crop.aspect * centerX / crop.height}cqh))`,
      top: `calc(50cqh - max(${100 * centerY / crop.height}cqh, ${100 * centerY / crop.aspect / crop.width}cqw))`,
      right: "auto", bottom: "auto",
    } : undefined}
    unoptimized={!image.image_url.startsWith("/preview/") && !image.image_url.startsWith("/reference/") && !image.image_url.startsWith("/brochure/")}
    draggable={false} onError={() => setFailed(true)} /></span>;
}
