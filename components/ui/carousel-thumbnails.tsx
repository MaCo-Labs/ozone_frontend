"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { StudioProjectImage } from "@/lib/content-api";
import styles from "./carousel-thumbnails.module.css";

/** Expanding thumbnail strip adapted from the supplied Motion reference. */
export function CarouselThumbnails({ images, title, index, onSelect }: {
  images: StudioProjectImage[]; title: string; index: number; onSelect: (index: number) => void;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const container = rail.current;
    if (!container) return;
    const center = () => container.scrollTo({ left: Math.max(0, index * 50 + 3 - (container.clientWidth - 100) / 2), behavior: reducedMotion ? "instant" : "smooth" });
    center();
    const resize = new ResizeObserver(center);
    resize.observe(container);
    return () => resize.disconnect();
  }, [index, reducedMotion]);

  return <div ref={rail} className={styles.rail} data-scroll-rail role="group" aria-label={`${title} photograph thumbnails`}>
    <div className={styles.track}>
      {images.map((image, position) => <motion.button key={image.image_url}
        ref={(element) => { buttons.current[position] = element; }}
        type="button" className={styles.thumbnail} aria-label={`View photograph ${position + 1}`}
        aria-pressed={position === index} tabIndex={position === index ? 0 : -1}
        initial={false} animate={{ width: position === index ? 100 : 44 }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 34 }}
        onClick={(event) => { event.stopPropagation(); onSelect(position); }}
        onKeyDown={(event) => {
          const next = event.key === "Home" ? 0 : event.key === "End" ? images.length - 1 : event.key === "ArrowLeft" ? Math.max(0, position - 1) : event.key === "ArrowRight" ? Math.min(images.length - 1, position + 1) : null;
          if (next === null) return;
          event.preventDefault(); event.stopPropagation(); onSelect(next); buttons.current[next]?.focus();
        }}>
        {/* The same approved project images supply preview thumbnails. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.thumbnail_url || image.image_url} alt="" loading="lazy" decoding="async" draggable={false} />
      </motion.button>)}
    </div>
  </div>;
}
