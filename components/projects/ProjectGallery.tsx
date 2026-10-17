"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowTopRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { PortfolioCard } from "@/lib/portfolio";
import { PROJECT_BRANCHES, type ProjectBranch } from "@/lib/projectBranch";
import { PortfolioImage } from "./PortfolioImage";
import styles from "./ProjectGallery.module.css";

export function ProjectGallery({ projects }: { projects: PortfolioCard[] }) {
  const [filter, setFilter] = useState("All");
  const [branch, setBranch] = useState<ProjectBranch>("qatar");
  const [query, setQuery] = useState("");
  const gridId = useId();
  const branchProjects = projects.filter((project) => project.branch === branch);
  const sectors = [...new Set(branchProjects.map((project) => project.sector))];
  const branchLabel = PROJECT_BRANCHES.find((item) => item.value === branch)!.label;
  const search = query.trim().toLocaleLowerCase();
  const visible = branchProjects.filter((project) => (filter === "All" || project.sector === filter) && `${project.title} ${project.sector} ${project.client?.name ?? ""}`.toLocaleLowerCase().includes(search));
  return <section className={styles.gallery} aria-label="Project archive">
    <div className={styles.branchBar}>
      <span className={styles.branchLabel}>Explore by branch</span>
      <div className={styles.branchSwitch} role="group" aria-label="Filter projects by branch">
        {PROJECT_BRANCHES.map((item) => <button key={item.value} type="button" aria-pressed={branch === item.value} aria-controls={gridId}
          onClick={() => { setBranch(item.value); setFilter("All"); setQuery(""); }}>{item.label}</button>)}
      </div>
    </div>
    <div className={styles.toolbar}>
      <div className={styles.filters} role="group" aria-label="Filter projects by sector">
        {["All", ...sectors].map((sector) => <button key={sector} type="button" aria-pressed={filter === sector} aria-controls={gridId} onClick={() => setFilter(sector)}>{sector}</button>)}
      </div>
      <label className={styles.search}><MagnifyingGlassIcon aria-hidden="true" /><span className={styles.srOnly}>Search projects</span><input type="search" placeholder="Search projects" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
    <p className={styles.count} role="status">{visible.length} {visible.length === 1 ? "project" : "projects"} in {branchLabel}{filter !== "All" ? ` · ${filter}` : ""}</p>
    <div id={gridId} className={styles.grid}>
        {visible.map((project) => <article key={project.slug} className={styles.card}>
          <Link href={project.href} className={styles.link}>
            <div className={styles.image}><PortfolioImage image={project.cover} sizes="(max-width: 767px) 31vw, (max-width: 1200px) 46vw, 560px" /><span className={styles.open}><ArrowTopRightIcon aria-hidden="true" /></span></div>
            <div className={styles.heading}><h2>{project.title}</h2><span>{project.sector}</span></div>
            {project.short_description && <p className={styles.description}>{project.short_description}</p>}
          </Link>
        </article>)}
    </div>
    {!visible.length && <div className={styles.empty}><h2>{branchProjects.length ? "No matching projects." : `${branchLabel} projects are on the way.`}</h2><p>{branchProjects.length ? "Try another sector or a different project name." : `Published projects from our ${branchLabel} branch will appear here.`}</p>{branchProjects.length > 0 && <button type="button" onClick={() => { setFilter("All"); setQuery(""); }}>Clear filters</button>}</div>}
  </section>;
}
