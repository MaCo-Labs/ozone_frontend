"use client";

import { useId, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ProjectCarousel } from "@/components/home/ProjectCarousel/ProjectCarousel";
import type { StudioProjectImage } from "@/lib/content-api";
import styles from "./SelectedWorkShowcase.module.css";

export type SelectedProject = {
  name: string;
  sector: string;
  location: string;
  href: string;
  images: StudioProjectImage[];
};

export function SelectedWorkShowcase({ projects }: { projects: SelectedProject[] }) {
  const [index, setIndex] = useState(0);
  const [ratio, setRatio] = useState(1.6);
  const galleryId = useId();
  const project = projects[index];
  if (!project) return null;

  return <div className={styles.showcase} style={{ "--gallery-ratio": ratio } as CSSProperties}>
    <div id={galleryId} className={styles.gallery}>
      <ProjectCarousel key={project.href} images={project.images} title={project.name} onAspectRatio={setRatio} thumbnails />
    </div>
    <div className={styles.directory}>
      <div className={styles.projects} role="group" aria-label="Select a featured project">
        {projects.map((item, position) => <button
          key={item.href} type="button" className={styles.project}
          aria-pressed={position === index} aria-controls={galleryId}
          onClick={() => setIndex(position)}
        >
          <span className={styles.index}>{String(position + 1).padStart(2, "0")} / {item.sector}</span>
          <strong>{item.name}</strong>
          <span className={styles.indicator} aria-hidden="true">↗</span>
        </button>)}
      </div>
      <div className={styles.details}>
        <p>{project.location}</p>
        <Link href={project.href}>View project <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </div>;
}
