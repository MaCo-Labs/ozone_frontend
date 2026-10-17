"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useReducedMotion } from "motion/react";
import type { PortfolioCard } from "@/lib/portfolio";
import { PortfolioImage } from "@/components/projects/PortfolioImage";
import styles from "./SelectedWorkShowcase.module.css";

const HOLD_MS = 5000;

export function SelectedWorkShowcase({ projects }: { projects: PortfolioCard[] }) {
  const reduce = useReducedMotion();
  const instructionId = useId();
  const regionRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  // Small collections still need enough slides to loop continuously at this card width.
  const slides = projects.length > 1 && projects.length < 5
    ? Array.from({ length: Math.ceil(5 / projects.length) }, () => projects).flat()
    : projects;
  const [viewportRef, api] = useEmblaCarousel({ align: "center", loop: projects.length > 1, containScroll: false, duration: 42 });
  const subscribe = useCallback((notify: () => void) => {
    if (!api) return () => {};
    api.on("select", notify).on("reInit", notify);
    return () => { api.off("select", notify).off("reInit", notify); };
  }, [api]);
  const snapshot = useCallback(() => api?.selectedScrollSnap() ?? 0, [api]);
  const selected = useSyncExternalStore(subscribe, snapshot, () => 0);

  useEffect(() => {
    const region = regionRef.current;
    if (!api || !region || reduce || paused || projects.length < 2) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let hovering = window.matchMedia("(hover: hover)").matches && region.matches(":hover");
    let dragging = false;
    const clear = () => { clearTimeout(timer); };
    const schedule = () => {
      clear();
      if (!visible || hovering || dragging || document.hidden) return;
      timer = setTimeout(() => {
        if (region.contains(document.activeElement)) return;
        if (api.canScrollNext()) api.scrollNext();
        else api.scrollTo(0);
      }, HOLD_MS);
    };
    const onEnter = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovering = true; clear(); } };
    const onLeave = () => { hovering = false; schedule(); };
    const onDown = () => { dragging = true; clear(); };
    const onUp = () => { dragging = false; schedule(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: .35 });
    observer.observe(region);
    region.addEventListener("pointerenter", onEnter);
    region.addEventListener("pointerleave", onLeave);
    region.addEventListener("focusin", clear);
    region.addEventListener("focusout", schedule);
    document.addEventListener("visibilitychange", schedule);
    api.on("pointerDown", onDown).on("pointerUp", onUp).on("settle", schedule).on("reInit", schedule);
    return () => {
      clear(); observer.disconnect();
      region.removeEventListener("pointerenter", onEnter);
      region.removeEventListener("pointerleave", onLeave);
      region.removeEventListener("focusin", clear);
      region.removeEventListener("focusout", schedule);
      document.removeEventListener("visibilitychange", schedule);
      api.off("pointerDown", onDown).off("pointerUp", onUp).off("settle", schedule).off("reInit", schedule);
    };
  }, [api, reduce, paused, projects.length]);

  if (!projects.length) return <p className={styles.empty}>Selected projects will appear here as they are published.</p>;

  return <div ref={regionRef} className={styles.showcase} role="region" aria-roledescription="carousel" aria-label="Selected projects"
    aria-describedby={instructionId} tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === "Escape") setPaused(true);
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        regionRef.current?.focus({ preventScroll: true });
        if (event.key === "ArrowLeft") api?.scrollPrev(Boolean(reduce));
        else api?.scrollNext(Boolean(reduce));
      }
    }}>
    <p id={instructionId} className={styles.srOnly}>Swipe or use the left and right arrow keys to explore. Rotation pauses while hovered or focused. Press Escape to stop rotation.</p>
    {projects.length > 1 && <button className={styles.accessibleControl} type="button" onClick={() => setPaused((value) => !value)}>{paused ? "Resume" : "Pause"} project rotation</button>}
    <div ref={viewportRef} className={styles.viewport}>
      <div className={styles.track}>
        {slides.map((item, index) => <div key={`${item.slug}-${index}`} className={styles.slide} role="group" aria-roledescription="slide"
          aria-label={`${index % projects.length + 1} of ${projects.length}: ${item.title}`} aria-hidden={index !== selected} data-active={index === selected}>
          <Link href={item.href} className={styles.project} tabIndex={index === selected ? 0 : -1}
            onClick={(event) => { if (index !== selected) { event.preventDefault(); api?.scrollTo(index, Boolean(reduce)); } }}>
            <div className={styles.image}>
              <PortfolioImage image={item.cover} sizes="(max-width: 650px) 80vw, (max-width: 1400px) 44vw, 620px" />
              <div className={styles.caption}><div><span>{item.sector}</span><h3>{item.title}</h3></div><span className={styles.open}><ArrowTopRightIcon aria-hidden="true" /><span className={styles.srOnly}>View project</span></span></div>
            </div>
          </Link>
        </div>)}
      </div>
    </div>
  </div>;
}
