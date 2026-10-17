import { describe, expect, it } from "vitest";
import { fallbackProject, portfolioCards, portfolioImages, projectCover } from "./portfolio";
import type { StudioProject, StudioProjectImage } from "./content-api";

const images: StudioProjectImage[] = [
  { image_url: "/detail.jpg", alt_text: "Detail", is_cover: false, caption: "", display_order: 0 },
  { image_url: "/cover.jpg", alt_text: "Main photo", is_cover: true, caption: "", display_order: 1 },
];
const project: StudioProject = { title: "New project", slug: "new-project", sector: "Retail", location: "Doha", service: "MEP Services", description: "Backend copy", cover_image_url: null, images };

describe("dynamic portfolio", () => {
  it("chooses the designated cover even when it is not the first photo", () => {
    expect(projectCover(project, images)?.image_url).toBe("/cover.jpg");
    expect(projectCover({ ...project, cover_image_url: "/explicit-cover.jpg" }, images)?.image_url).toBe("/explicit-cover.jpg");
  });
  it("uses backend projects, sectors, flags and links without merging preview content", () => {
    const cards = portfolioCards([{ ...project, featured: true, short_description: "Live description", cover_image_url: "/cover.jpg" }]);
    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({ title: "New project", sector: "Retail", featured: true, href: "/projects/new-project", short_description: "Live description", reference: false });
  });
  it("preserves an intentionally empty published archive", () => {
    expect(portfolioCards([])).toEqual([]);
  });
  it("preserves Bahrain assignments and defaults legacy and preview projects to Qatar", () => {
    expect(portfolioCards([{ ...project, branch: "bahrain" }])[0].branch).toBe("bahrain");
    expect(portfolioCards([project])[0].branch).toBe("qatar");
    expect(portfolioCards(null).every((card) => card.branch === "qatar")).toBe(true);
    expect(fallbackProject(portfolioCards([{ ...project, branch: "bahrain" }])[0]).location).toBe("");
  });
  it("retains complete fallback galleries and one cover per homepage project", () => {
    const cards = portfolioCards(null).filter((card) => card.featured);
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card.cover?.image_url).toMatch(/^\/(preview|brochure)\//);
      expect(portfolioImages(fallbackProject(card)).length).toBeGreaterThan(0);
    }
    expect(portfolioImages(fallbackProject(cards[0]))).toHaveLength(18);
  });
  it("handles new projects without gallery images", () => {
    expect(portfolioImages({ ...project, images: [], cover_image_url: "/live.jpg" })[0].image_url).toBe("/live.jpg");
    expect(portfolioImages({ ...project, images: [] })).toEqual([]);
  });
});
