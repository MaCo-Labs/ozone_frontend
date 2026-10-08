import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import { ProjectCarousel } from "@/components/home/ProjectCarousel/ProjectCarousel";
import { getStudioProject } from "@/lib/content-api";
import { projectImages } from "@/lib/projectMedia";
import styles from "../../editorial.module.css";
import galleryStyles from "../qatar-rail/rail.module.css";

export const metadata = pageMetadata("/projects/apparel-group");

export default async function Page() {
  const project = await getStudioProject("apparel-group");
  return <main id="main-content" className={styles.page}>
    <PageStructuredData path="/projects/apparel-group" />
    <section className={styles.hero}>
      <div className={styles.heroMedia}><Image src="/brochure/apparel-head-office.jpg" alt="Apparel Group Head Office project portfolio" fill sizes="100vw" priority /></div>
      <div className={styles.heroCopy}><span className={styles.eyebrow}>Project 03 / Corporate</span><h1>{project?.title || "Apparel Group Head Office"}.</h1><p>A structured workplace composition from the OZONE project portfolio.</p></div>
    </section>
    <section className={`${styles.shell} ${styles.section} ${styles.intro}`}>
      <h2>A workspace designed to perform.</h2>
      <div className={styles.introCopy}><p>{project?.description || "Workplace architecture aligns teams, technology, movement and identity within one clear system. View the complete project composition from the OZONE company profile."}</p></div>
    </section>
    <section className={`${styles.shell} ${galleryStyles.gallery}`} aria-label="Apparel Group Head Office project gallery">
      <ProjectCarousel images={projectImages(project, 2)} title={project?.title || "Apparel Group Head Office"} />
    </section>
    <Link className={styles.next} href="/projects"><span>Continue</span><strong>View project archive</strong></Link>
  </main>;
}
