"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroVideo.module.css";

type HeroVideoProps = {
  className: string;
  onPhaseChange?: (phase: number) => void;
};

export function HeroVideo({ className, onPhaseChange }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const portrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean; effectiveType?: string } }).connection;
    let visible = false;
    let currentPhase = -1;

    if (!video) return;

    const syncHeadline = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const nextPhase = duration > 0 && video.currentTime >= duration / 2 ? 1 : 0;
      if (nextPhase === currentPhase) return;
      currentPhase = nextPhase;
      onPhaseChange?.(nextPhase);
    };

    const updatePlayback = () => {
      video.poster = portrait.matches ? "/media/hero-poster-mobile.webp" : "/media/hero-poster.webp";
      if (reducedMotion.matches || connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) {
        video.pause();
        if (video.hasAttribute("src")) {
          video.removeAttribute("src");
          video.load();
        }
        syncHeadline();
        return;
      }
      if (!visible || document.hidden) { video.pause(); return; }
      const source = portrait.matches ? "/media/ozone-hero-mobile-hq.mp4" : "/media/ozone-hero-desktop.mp4";
      if (video.getAttribute("src") !== source) {
        video.src = source;
      }
      void video.play().catch(() => {
        // Poster remains visible when browser blocks autoplay.
      });
    };

    // Set the appropriate poster before observing, including data-saver/reduced-motion visits.
    video.poster = portrait.matches ? "/media/hero-poster-mobile.webp" : "/media/hero-poster.webp";
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(video);
    reducedMotion.addEventListener("change", updatePlayback);
    portrait.addEventListener("change", updatePlayback);
    connection?.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    video.addEventListener("loadedmetadata", syncHeadline);
    video.addEventListener("timeupdate", syncHeadline);
    video.addEventListener("seeked", syncHeadline);

    return () => {
      reducedMotion.removeEventListener("change", updatePlayback);
      portrait.removeEventListener("change", updatePlayback);
      connection?.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      observer.disconnect();
      video.pause();
      video.removeEventListener("loadedmetadata", syncHeadline);
      video.removeEventListener("timeupdate", syncHeadline);
      video.removeEventListener("seeked", syncHeadline);
    };
  }, [onPhaseChange]);

  return <>
    <picture className={styles.poster}>
      <source media="(max-width: 767px) and (orientation: portrait)" srcSet="/media/hero-poster-mobile.webp" />
      {/* A responsive poster paints before hydration and remains when autoplay is unavailable. */}
      <img src="/media/hero-poster.webp" alt="" className={className} width={1280} height={720} fetchPriority="high" />
    </picture>
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      disablePictureInPicture
      disableRemotePlayback
    />
  </>;
}
