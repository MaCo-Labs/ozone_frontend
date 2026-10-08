"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  className: string;
  onPhaseChange?: (phase: number) => void;
};

export function HeroVideo({ className, onPhaseChange }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
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
      if (!video.hasAttribute("src")) {
        video.src = window.matchMedia("(max-width: 767px)").matches ? "/media/ozone-hero-mobile.mp4" : "/media/ozone-hero-desktop.mp4";
      }
      void video.play().catch(() => {
        // Poster remains visible when browser blocks autoplay.
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(video);
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    video.addEventListener("loadedmetadata", syncHeadline);
    video.addEventListener("timeupdate", syncHeadline);
    video.addEventListener("seeked", syncHeadline);

    return () => {
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      observer.disconnect();
      video.pause();
      video.removeEventListener("loadedmetadata", syncHeadline);
      video.removeEventListener("timeupdate", syncHeadline);
      video.removeEventListener("seeked", syncHeadline);
    };
  }, [onPhaseChange]);

  return <>
    <link rel="preload" as="image" href="/media/hero-poster.webp" fetchPriority="high" />
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster="/media/hero-poster.webp"
      aria-hidden="true"
      disablePictureInPicture
      disableRemotePlayback
    />
  </>;
}
