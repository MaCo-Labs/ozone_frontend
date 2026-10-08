"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { StudioProjectImage } from "@/lib/content-api";
import { imageCanvas } from "@/lib/imageCanvas";
import { CarouselThumbnails } from "@/components/ui/carousel-thumbnails";
import styles from "./ProjectCarousel.module.css";

type Size = { width: number; height: number };

export function ProjectCarousel({ images, title, onAspectRatio, thumbnails = false }: { images: StudioProjectImage[]; title: string; onAspectRatio?: (ratio: number) => void; thumbnails?: boolean }) {
  const [index, setIndex] = useState(0);
  const [sizes, setSizes] = useState<Record<string, Size>>({});
  const [failures, setFailures] = useState<Record<string, boolean>>({});
  const [bounds, setBounds] = useState<Size>({ width: 0, height: 0 });
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const count = images.length;
  const activeIndex = count ? index % count : 0;
  const active = images[activeIndex];
  let nextIndex = (activeIndex + 1) % (count || 1);
  for (let step = 0; step < count - 1 && failures[images[nextIndex]?.image_url]; step++) nextIndex = (nextIndex + 1) % count;
  const next = images[nextIndex];
  const saveSize = useCallback((source: string, width: number, height: number) => {
    if (!width || !height) return;
    setSizes((current) => current[source]?.width === width && current[source]?.height === height ? current : { ...current, [source]: { width, height } });
  }, []);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setBounds({ width: entry.contentRect.width, height: entry.contentRect.height }));
    resize.observe(element.parentElement ?? element);
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    intersection.observe(element);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updatePreference(); updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      resize.disconnect(); intersection.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const activeWidth = active ? sizes[active.image_url]?.width : undefined;
  const activeHeight = active ? sizes[active.image_url]?.height : undefined;
  useEffect(() => {
    // A cached photograph may finish before React attaches its load listener.
    const photo = frame.current?.querySelector<HTMLImageElement>("img");
    if (active && photo?.complete && photo.naturalWidth) saveSize(active.image_url, photo.naturalWidth, photo.naturalHeight);
  }, [active, visible, saveSize]);
  useEffect(() => {
    if (activeWidth && activeHeight) onAspectRatio?.(activeWidth / activeHeight);
  }, [activeWidth, activeHeight, onAspectRatio]);

  // Decode the next photograph before changing the canvas; slow media never flashes blank.
  useEffect(() => {
    if (!visible || !next || nextIndex === activeIndex || sizes[next.image_url] || failures[next.image_url]) return;
    let cancelled = false;
    const photo = new window.Image();
    photo.onload = async () => {
      try { await photo.decode(); } catch { /* The load event already confirms usable media. */ }
      if (!cancelled) saveSize(next.image_url, photo.naturalWidth, photo.naturalHeight);
    };
    photo.onerror = () => { if (!cancelled) setFailures((current) => ({ ...current, [next.image_url]: true })); };
    photo.src = next.image_url;
    return () => { cancelled = true; photo.onload = null; photo.onerror = null; };
  }, [visible, next, nextIndex, activeIndex, sizes, failures, saveSize]);

  useEffect(() => {
    if (count < 2 || !visible || !documentVisible || reducedMotion || hovered || focused || paused || !next || !sizes[next.image_url] || nextIndex === activeIndex) return;
    const timer = window.setTimeout(() => setIndex(nextIndex), 6000);
    return () => window.clearTimeout(timer);
  }, [count, visible, documentVisible, reducedMotion, hovered, focused, paused, next, sizes, nextIndex, activeIndex]);

  if (!active) return null;
  const size = sizes[active.image_url] ?? { width: 1600, height: 1000 };
  const canvas = imageCanvas(bounds.width, bounds.height, size.width, size.height);
  return <div ref={frame} className={styles.carousel} style={{ width: canvas.width || "100%", height: canvas.height || "100%" }} role="region" aria-roledescription="carousel"
    aria-label={`${title} photographs`} aria-describedby={count > 1 ? hintId : undefined} tabIndex={count > 1 ? 0 : undefined}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onClick={() => setPaused((value) => !value)}
    onKeyDown={(event) => {
      if (event.key === " " || event.key === "Escape") {
        event.preventDefault(); setPaused((value) => event.key === "Escape" || !value);
      } else if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        event.preventDefault(); setPaused(true);
        setIndex(event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (activeIndex + (event.key === "ArrowLeft" ? -1 : 1) + count) % count);
      }
    }}>
    <div className={styles.canvas}
      role="group" aria-roledescription="slide" aria-label={`${activeIndex + 1} of ${count}`} data-image-ready={Boolean(sizes[active.image_url])}>
      {/* Uploaded portfolio media supports the content studio and external object storage. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={active.image_url} className={styles.photo} src={active.image_url} loading="lazy" decoding="async" draggable={false}
        alt={active.alt_text || `${title} project photograph ${activeIndex + 1}`}
        onLoad={(event) => saveSize(active.image_url, event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)}
        onError={() => setFailures((current) => ({ ...current, [active.image_url]: true }))} />
      {failures[active.image_url] && <p className={styles.error} role="status">This photograph is temporarily unavailable.</p>}
    </div>
    {thumbnails && count > 1 && <CarouselThumbnails images={images} title={title} index={activeIndex} onSelect={(position) => { setIndex(position); setPaused(false); }} />}
    {count > 1 && <span id={hintId} className={styles.srOnly}>Photographs change automatically. Hover or focus to pause. Tap or press Space to pause or resume; arrow keys browse photographs. Reduced motion keeps the gallery still.</span>}
  </div>;
}
