"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ProjectCarousel } from "@/components/home/ProjectCarousel/ProjectCarousel";
import type { StudioProjectImage } from "@/lib/content-api";
import { PROJECTS } from "@/lib/siteData";
import { FEATURED_PROJECT_LINKS, projectImages } from "@/lib/projectMedia";
import Link from "next/link";
import styles from "./ProjectGallery.module.css";

const FILTERS = ["All", "Retail", "F&B", "Corporate", "Healthcare", "Transit", "Wellness"] as const;
const toId = (name: string) => name.toLowerCase().replaceAll(" ", "-");

export function ProjectGallery({ galleries = [] }: { galleries?: StudioProjectImage[][] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const projects = useMemo(
    () => PROJECTS.filter((project) => filter === "All" || project.sector.includes(filter)),
    [filter],
  );

  return (
    <section className={styles.gallery} aria-labelledby="project-archive-title">
      <div className={styles.heading}>
        <div>
          <span>Project archive</span>
          <h2 id="project-archive-title">Work across Qatar</h2>
        </div>
        <div className={styles.filters} aria-label="Filter projects">
          {FILTERS.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className={styles.note}>
        Project names are drawn from the OZONE company profile. Sector reference imagery is used where final approved photography is not yet in the web asset library.
      </p>
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <article
            key={project.name}
            id={toId(project.name)}
            className={styles.project}
          >
            <div className={styles.image}>
              {PROJECTS.indexOf(project) < 3 ? (
                <ProjectCarousel images={galleries[PROJECTS.indexOf(project)] ?? projectImages(null, PROJECTS.indexOf(project))} title={project.name} />
              ) : <>
                <Image src={project.image} alt={`Representative ${project.sector.toLowerCase()} space`} fill sizes="(max-width: 700px) 100vw, 50vw" />
                <span>{project.source === "brochure" ? "OZONE portfolio" : "Sector reference"}</span>
              </>}
            </div>
            <div className={styles.meta}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{PROJECTS.indexOf(project) < 3 ? <Link href={FEATURED_PROJECT_LINKS[PROJECTS.indexOf(project)]}>{project.name}</Link> : project.name}</h3>
              <p>{project.sector}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
