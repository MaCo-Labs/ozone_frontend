import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { getStudioProject, getStudioProjects } from "@/lib/content-api";
import { fallbackProject, portfolioCards, portfolioImages, projectCover } from "@/lib/portfolio";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProjectDetailGallery } from "./ProjectDetailGallery";
import styles from "./ProjectDetail.module.css";

export async function ProjectDetail({ slug }: { slug: string }) {
  const [published, summaries] = await Promise.all([getStudioProject(slug), getStudioProjects()]);
  const cards = portfolioCards(summaries);
  const card = cards.find((item) => item.slug === slug);
  const project = published ?? (card ? fallbackProject(card) : null);
  if (!project) notFound();
  // List responses do not supply location; do not invent it when detail retrieval fails.
  if (!published && summaries !== null) project.location = "";
  const gallery = portfolioImages(project);
  const cover = projectCover(project, gallery);
  const images = cover ? [cover, ...gallery.filter((image) => image.image_url !== cover.image_url)] : gallery;
  const position = cards.findIndex((item) => item.slug === slug);
  const next = position !== -1 ? cards[position + 1] : null;
  const facts = [
    ["Sector", project.sector], ["Location", project.location], ["Service", project.service],
    ["Client", project.client?.name], ["Completed", project.completion_year?.toString()],
  ].filter(([, value]) => Boolean(value));

  return <main id="main-content" className={styles.page}>
    <div className={styles.shell}>
      <Link href="/projects" className={styles.back}><ArrowLeftIcon aria-hidden="true" /> All projects</Link>
      <ProjectDetailGallery images={images} title={project.title} />
      {card?.reference && <p className={styles.reference}>Sector reference imagery. This project is listed in the OZONE company profile.</p>}
      <div className={styles.content}>
        <article className={styles.overview}>
          <p className={styles.sector}>{project.sector}</p>
          <h1>{project.title}</h1>
          {project.location && <p className={styles.location}>{project.location}</p>}
          {project.short_description && project.short_description !== project.description && <p className={styles.summary}>{project.short_description}</p>}
          {project.description && <div className={styles.description}>{project.description.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}
          <div className={styles.facts}><h2>Project details</h2><dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
        </article>
        <aside className={styles.enquiry}><h2>Have a similar project?</h2><p>Tell us what you have in mind.</p><ContactForm projectName={project.title} /></aside>
      </div>
      <Link className={styles.next} href={next?.href ?? "/projects"}><div><span>{next ? "Next project" : "Explore more"}</span><strong>{next?.title ?? "The project archive"}</strong></div><ArrowTopRightIcon aria-hidden="true" /></Link>
    </div>
  </main>;
}
