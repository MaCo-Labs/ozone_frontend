import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { ProjectCarousel } from "@/components/home/ProjectCarousel/ProjectCarousel";
import { getStudioProject } from "@/lib/content-api";
import { projectImages } from "@/lib/projectMedia";
import styles from "../../editorial.module.css";
import railStyles from "./rail.module.css";
export const metadata = pageMetadata("/projects/qatar-rail");
export default async function Page() {
  const project = await getStudioProject("qatar-rail");
  return <main id="main-content" className={styles.page}><PageStructuredData path="/projects/qatar-rail" />
    <section className={styles.hero}>
      <div className={styles.heroMedia}>
        {project?.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.cover_image_url} alt="Qatar Rail illuminated arches and escalators" className={railStyles.cover} />
        ) : <Image src="/brochure/qatar-rail.jpg" alt="Qatar Rail project portfolio" fill sizes="100vw" priority />}
      </div>
      <div className={styles.heroCopy}><span className={styles.eyebrow}>Project 01 / {project?.service || "Interior fit-out"}</span><h1>{project?.title || "Qatar Rail"}.</h1><p>{project?.location || "Doha, Qatar"}. Featured OZONE portfolio project.</p></div>
    </section>
    <section className={`${styles.shell} ${styles.section} ${styles.intro}`}>
      <h2>Built for movement.</h2>
      <div className={styles.introCopy}><p>{project?.description || "Qatar Rail project from the OZONE portfolio."}</p></div>
    </section>
    <section className={`${styles.shell} ${railStyles.gallery}`} aria-label="Qatar Rail project gallery">
      <ProjectCarousel images={projectImages(project, 0)} title={project?.title ?? "Qatar Rail"} />
    </section>
    <Link className={styles.next} href="/projects/maestro"><span>Next project</span><strong>Maestro Medical Centre</strong></Link>
  </main>;
}
