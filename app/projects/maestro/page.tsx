import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import { ProjectCarousel } from "@/components/home/ProjectCarousel/ProjectCarousel";
import { getStudioProject } from "@/lib/content-api";
import { projectImages } from "@/lib/projectMedia";
import styles from "../../editorial.module.css";
import galleryStyles from "../qatar-rail/rail.module.css";

export const metadata = pageMetadata("/projects/maestro");

export default async function Page() {
  const project = await getStudioProject("maestro");
  return <main id="main-content" className={styles.page}>
    <PageStructuredData path="/projects/maestro" />
    <section className={styles.hero}>
      <div className={styles.heroMedia}><Image src="/brochure/maestro-medical-centre.jpg" alt="Maestro Medical Centre project portfolio" fill sizes="100vw" priority /></div>
      <div className={styles.heroCopy}><span className={styles.eyebrow}>Project 02 / Healthcare</span><h1>{project?.title || "Maestro Medical Centre"}.</h1><p>Quiet precision shaped around the experience of care.</p></div>
    </section>
    <section className={`${styles.shell} ${styles.section} ${styles.intro}`}>
      <h2>Quiet luxury. Exact delivery.</h2>
      <div className={styles.introCopy}><p>{project?.description || "Healthcare interiors depend on calm visual order and coordinated technical layers. View the complete project composition from the OZONE company profile."}</p></div>
    </section>
    <section className={`${styles.shell} ${galleryStyles.gallery}`} aria-label="Maestro Medical Centre project gallery">
      <ProjectCarousel images={projectImages(project, 1)} title={project?.title || "Maestro Medical Centre"} />
    </section>
    <Link className={styles.next} href="/projects/apparel-group"><span>Continue</span><strong>Apparel Group Head Office</strong></Link>
  </main>;
}
