import type { StudioProject, StudioProjectImage, StudioProjectSummary } from "./content-api";
import { FEATURED_PROJECT_SLUGS, projectImages } from "./projectMedia";
import { PROJECTS } from "./siteData";

export type PortfolioCard = StudioProjectSummary & {
  href: string;
  cover: StudioProjectImage | null;
  reference: boolean;
};

export const projectSlug = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function portfolioImages(project: StudioProject): StudioProjectImage[] {
  const index = FEATURED_PROJECT_SLUGS.findIndex((slug) => slug === project.slug);
  if (index !== -1) return projectImages(project, index);
  if (project.images.length) return project.images;
  return project.cover_image_url ? [{ image_url: project.cover_image_url, alt_text: project.title, caption: "", is_cover: true, display_order: 0 }] : [];
}

export function projectCover(project: StudioProjectSummary, images: StudioProjectImage[] = []): StudioProjectImage | null {
  if (project.cover_image_url) {
    return images.find((image) => image.image_url === project.cover_image_url) ?? {
      image_url: project.cover_image_url, alt_text: `${project.title} project`, caption: "", is_cover: true, display_order: 0,
    };
  }
  return images.find((image) => image.is_cover) ?? images[0] ?? null;
}

/** Packaged company-profile content is used only while the public API is unavailable. */
export function portfolioCards(published: StudioProjectSummary[] | null): PortfolioCard[] {
  const summaries = published ?? PROJECTS.map((project, index) => ({
    title: project.name,
    slug: FEATURED_PROJECT_SLUGS[index] ?? projectSlug(project.name),
    sector: project.sector,
    short_description: index < 3 ? "From the OZONE company portfolio." : "Project listed in the OZONE company profile.",
    featured: index < 3,
    cover_image_url: index < 3 ? null : project.image,
  }));
  return summaries.map((project) => {
    const index = FEATURED_PROJECT_SLUGS.findIndex((slug) => slug === project.slug);
    const images = index === -1 ? [] : projectImages(null, index);
    const cover = projectCover(project, images);
    // These packaged sheets contain several photos. Show one photograph in the cover carousel.
    const croppedCover = cover && !project.cover_image_url && index > 0 ? {
      ...cover,
      image_url: index === 1 ? "/brochure/maestro-medical-centre.jpg" : "/brochure/apparel-head-office.jpg",
      alt_text: index === 1 ? "Maestro Medical Centre reception with curved lighting and a stone front desk" : "Apparel Group Head Office meeting room with circular ceiling lights",
      crop: index === 1
        ? { left: .049, top: .608, width: .416, height: .359, aspect: 1446 / 1915 }
        : { left: .534, top: .017, width: .419, height: .377, aspect: 1446 / 1915 },
    } : cover;
    return { ...project, href: `/projects/${encodeURIComponent(project.slug)}`, cover: croppedCover, reference: published === null && index === -1 };
  });
}

export function fallbackProject(card: PortfolioCard): StudioProject {
  const index = FEATURED_PROJECT_SLUGS.findIndex((slug) => slug === card.slug);
  return { ...card, location: "Doha, Qatar", service: "", description: card.short_description ?? "", images: index === -1 ? (card.cover ? [card.cover] : []) : projectImages(null, index) };
}
