"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowTopRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { PortfolioCard } from "@/lib/portfolio";
import { PortfolioImage } from "./PortfolioImage";
import styles from "./ProjectGallery.module.css";

export function ProjectGallery({ projects }: { projects: PortfolioCard[] }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const gridId = useId();
  const sectors = [...new Set(projects.map((project) => project.sector))];
  const search = query.trim().toLocaleLowerCase();
  const visible = projects.filter((project) => (filter === "All" || project.sector === filter) && `${project.title} ${project.sector} ${project.client?.name ?? ""}`.toLocaleLowerCase().includes(search));
  return <section className={styles.gallery} aria-label="Project archive">
    <div className={styles.toolbar}>
      <div className={styles.filters} role="group" aria-label="Filter projects by sector">
        {["All", ...sectors].map((sector) => <button key={sector} type="button" aria-pressed={filter === sector} aria-controls={gridId} onClick={() => setFilter(sector)}>{sector}</button>)}
      </div>
      <label className={styles.search}><MagnifyingGlassIcon aria-hidden="true" /><span className={styles.srOnly}>Search projects</span><input type="search" placeholder="Search projects" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
    <p className={styles.count} role="status">{visible.length} {visible.length === 1 ? "project" : "projects"}{filter !== "All" ? ` in ${filter}` : " across Qatar"}</p>
    <div id={gridId} className={styles.grid}>
        {visible.map((project) => <article key={project.slug} className={styles.card}>
          <Link href={project.href} className={styles.link}>
            <div className={styles.image}><PortfolioImage image={project.cover} sizes="(max-width: 767px) 100vw, 50vw" /><span className={styles.open}><ArrowTopRightIcon aria-hidden="true" /></span></div>
            <div className={styles.heading}><h2>{project.title}</h2><span>{project.sector}</span></div>
            {project.short_description && <p className={styles.description}>{project.short_description}</p>}
            {project.reference && <span className={styles.reference}>Sector reference imagery</span>}
          </Link>
        </article>)}
    </div>
    {!visible.length && <div className={styles.empty}><h2>{projects.length ? "No matching projects." : "Our next chapter is taking shape."}</h2><p>{projects.length ? "Try another sector or a different project name." : "Published projects will appear here."}</p>{projects.length > 0 && <button type="button" onClick={() => { setFilter("All"); setQuery(""); }}>Clear filters</button>}</div>}
  </section>;
}
