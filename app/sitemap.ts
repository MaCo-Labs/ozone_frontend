import type { MetadataRoute } from "next";
import { PAGE_SEO, SITE_URL } from "@/lib/seo";
import { getStudioProjects } from "@/lib/content-api";
import { portfolioCards } from "@/lib/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Do not report request time as a content modification date.
  const published = await getStudioProjects();
  const publishedSlugs = new Set(published?.map((project) => project.slug));
  const staticPaths = Object.keys(PAGE_SEO).filter((path) => !path.startsWith("/projects/") || published === null || publishedSlugs.has(path.slice("/projects/".length)));
  const paths = new Set([...staticPaths, ...portfolioCards(published).map((project) => project.href)]);
  return [...paths].map((path) => ({ url: `${SITE_URL}${path}` }));
}
