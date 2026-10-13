import "server-only";

import type { Metadata } from "next";
import { getStudioProject, getStudioProjects } from "./content-api";
import { portfolioCards } from "./portfolio";
import { PAGE_SEO, pageMetadata, type SitePath } from "./seo";

export async function getProjectMetadata(slug: string): Promise<Metadata> {
  const [project, summaries] = await Promise.all([getStudioProject(slug), getStudioProjects()]);
  const card = portfolioCards(summaries).find((item) => item.slug === slug);
  const path = `/projects/${encodeURIComponent(slug)}`;
  const known = path in PAGE_SEO ? pageMetadata(path as SitePath) : {};
  const title = project?.meta_title || (known.title as string | undefined) || project?.title || card?.title || "Project";
  const description = project?.meta_description || project?.short_description || known.description || card?.short_description;
  const image = project?.cover_image_url ?? card?.cover?.image_url;
  return {
    ...known, title, description, alternates: { canonical: path },
    openGraph: { ...known.openGraph, title, description, url: path, ...(image ? { images: [{ url: image, alt: project?.title ?? card?.title }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}
