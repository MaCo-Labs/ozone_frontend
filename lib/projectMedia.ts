import type { StudioProject, StudioProjectImage } from "./content-api";
import { PROJECTS } from "./siteData";
import previewContent from "./previewContent.json";

export const FEATURED_PROJECT_LINKS = ["/projects/qatar-rail", "/projects/maestro", "/projects/apparel-group"] as const;
export const FEATURED_PROJECT_SLUGS = ["qatar-rail", "maestro", "apparel-group"] as const;

/** Keep complete, approved portfolio pages available when the content API is offline. */
export function projectImages(project: StudioProject | null | undefined, index: number): StudioProjectImage[] {
  const slug = FEATURED_PROJECT_SLUGS[index];
  const previews = previewContent.projects[slug];
  if (project?.images.length) return project.images.map((image) => {
    const filename = image.image_url.split("/").at(-1)?.split("?")[0];
    const thumbnail = previews.find((preview) => preview.source_name === filename)?.thumbnail_url;
    return thumbnail ? { ...image, thumbnail_url: thumbnail } : image;
  });
  if (!project?.cover_image_url && previews.length) return previews;
  const fallback = PROJECTS[index];
  return [{
    image_url: project?.cover_image_url || fallback.image,
    alt_text: `${fallback.name} — OZONE project portfolio`,
    caption: project?.location || "",
    is_cover: true,
    display_order: 0,
  }];
}
