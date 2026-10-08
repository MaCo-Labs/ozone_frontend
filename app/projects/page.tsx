import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { getStudioProject } from "@/lib/content-api";
import { FEATURED_PROJECT_SLUGS, projectImages } from "@/lib/projectMedia";
export const metadata = pageMetadata("/projects");
export default async function ProjectsPage(){
  const projects = await Promise.all(FEATURED_PROJECT_SLUGS.map((slug) => getStudioProject(slug)));
  return <main id="main-content"><PageStructuredData path="/projects" /><ProjectIndex railCover={projects[0]?.cover_image_url} /><ProjectGallery galleries={projects.map((project, index) => projectImages(project, index))} /></main>;
}
