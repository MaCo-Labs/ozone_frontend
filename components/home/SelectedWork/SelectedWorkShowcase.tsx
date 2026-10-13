"use client";

import { useCallback, useId, useSyncExternalStore } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useReducedMotion } from "motion/react";
import type { PortfolioCard } from "@/lib/portfolio";
import { PortfolioImage } from "@/components/projects/PortfolioImage";
import styles from "./SelectedWorkShowcase.module.css";

export function SelectedWorkShowcase({ projects }: { projects: PortfolioCard[] }) {
  const reduce = useReducedMotion();
  const galleryId = useId();
  const [viewportRef, api] = useEmblaCarousel({ align: "center", loop: projects.length > 2, containScroll: false });
  const subscribe = useCallback((notify: () => void) => {
    if (!api) return () => {};
    api.on("select", notify).on("reInit", notify);
    return () => { api.off("select", notify).off("reInit", notify); };
  }, [api]);
  const snapshot = useCallback(() => api?.selectedScrollSnap() ?? 0, [api]);
  const selected = useSyncExternalStore(subscribe, snapshot, () => 0);
  const project = projects[selected];
  if (!project) return <p className={styles.empty}>Selected projects will appear here as they are published.</p>;

  return <div className={styles.showcase} role="region" aria-roledescription="carousel" aria-label="Selected projects"
    onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        if (event.key === "ArrowLeft") api?.scrollPrev(Boolean(reduce));
        else api?.scrollNext(Boolean(reduce));
      }
    }}>
    <div ref={viewportRef} id={galleryId} className={styles.viewport}>
      <div className={styles.track}>
        {projects.map((item, index) => <div key={item.slug} className={styles.slide} role="group" aria-roledescription="slide"
          aria-label={`${index + 1} of ${projects.length}: ${item.title}`} data-active={index === selected}>
          <Link href={item.href} className={styles.project} tabIndex={index === selected ? 0 : -1}
            onClick={(event) => { if (index !== selected) { event.preventDefault(); api?.scrollTo(index, Boolean(reduce)); } }}>
            <div className={styles.image}><PortfolioImage image={item.cover} sizes="(max-width: 650px) 86vw, 66vw" /></div>
            <div className={styles.caption}><div><span>{item.sector}</span><h3>{item.title}</h3></div><span className={styles.open}><ArrowTopRightIcon aria-hidden="true" /><span className={styles.srOnly}>View project</span></span></div>
          </Link>
        </div>)}
      </div>
    </div>
    <div className={styles.controls}>
      <div className={styles.dots} role="group" aria-label="Choose a project">
        {projects.map((item, index) => <button key={item.slug} type="button" aria-label={`Show ${item.title}`}
          aria-pressed={index === selected} aria-controls={galleryId} onClick={() => api?.scrollTo(index, Boolean(reduce))}><span /></button>)}
      </div>
      <div className={styles.arrows}>
        <button type="button" aria-label="Previous project" aria-controls={galleryId} disabled={projects.length < 2 || (projects.length <= 2 && selected === 0)} onClick={() => api?.scrollPrev(Boolean(reduce))}><ArrowLeftIcon aria-hidden="true" /></button>
        <button type="button" aria-label="Next project" aria-controls={galleryId} disabled={projects.length < 2 || (projects.length <= 2 && selected === projects.length - 1)} onClick={() => api?.scrollNext(Boolean(reduce))}><ArrowRightIcon aria-hidden="true" /></button>
      </div>
    </div>
    <p className={styles.srOnly} aria-live="polite" aria-atomic="true">{project.title}, project {selected + 1} of {projects.length}</p>
  </div>;
}
