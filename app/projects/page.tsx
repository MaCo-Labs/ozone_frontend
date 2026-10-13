import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { getStudioProjects } from "@/lib/content-api";
import { portfolioCards } from "@/lib/portfolio";
export const metadata = pageMetadata("/projects");
export default async function ProjectsPage(){
  const projects = portfolioCards(await getStudioProjects());
  return <main id="main-content"><PageStructuredData path="/projects" /><ProjectIndex cover={projects[0]?.cover ?? null} /><ProjectGallery projects={projects} /></main>;
}
