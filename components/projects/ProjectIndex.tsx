"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PROJECTS } from "@/lib/siteData";
import styles from "./ProjectIndex.module.css";

const links = ["/projects/qatar-rail", "/projects/maestro", "/projects/apparel-group"];

export function ProjectIndex({ railCover }: { railCover?: string | null }) {
  const featured = PROJECTS.slice(0, 3);
  const [active, setActive] = useState(0);
  return <section className={styles.index} aria-labelledby="project-index-title">
    <header><span>Featured projects</span><h1 id="project-index-title">The work.</h1></header>
    <div className={styles.stage}>
      <div className={styles.images}>{featured.map((project,index)=><Image key={project.name} src={index === 0 && railCover ? railCover : project.image} unoptimized={index === 0 && Boolean(railCover)} alt={project.source === "brochure" ? `${project.name} portfolio` : `Representative ${project.sector.toLowerCase()} interior`} fill sizes="(max-width:760px) 100vw, 50vw" priority={index===0} data-active={index===active} />)}</div>
      <div className={styles.list}>{featured.map((project,index)=><Link key={project.name} href={links[index]} data-active={index===active} onPointerEnter={()=>setActive(index)} onFocus={()=>setActive(index)}><span>0{index+1}</span><strong>{project.name}</strong><small>{project.sector}</small></Link>)}</div>
    </div>
  </section>;
}
