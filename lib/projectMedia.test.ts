import { describe, expect, it } from "vitest";
import { projectImages } from "./projectMedia";
import type { StudioProject } from "./content-api";

describe("portfolio media fallback", () => {
  const published: StudioProject = {
    title: "Qatar Rail", slug: "qatar-rail", sector: "Transit", location: "Doha, Qatar",
    service: "Interior fit-out", description: "Published project", cover_image_url: null, images: [],
  };
  it("retains packaged project photography and complete brochure compositions without the API", () => {
    for (const index of [0, 1, 2]) {
      const images = projectImages(null, index);
      expect(images.length).toBeGreaterThan(0);
      expect(images[0].image_url).toMatch(/^\/preview\//);
      expect(images[0].thumbnail_url).toMatch(/-thumb.webp$/);
      expect(images[0].alt_text.length).toBeGreaterThan(0);
    }
  });
  it("uses published gallery images in their supplied order", () => {
    const images = [{ image_url: "/one.jpg", alt_text: "Detail", caption: "Doha", is_cover: true, display_order: 0 }];
    const project: StudioProject = { ...published, images };
    expect(projectImages(project, 0)).toEqual(images);
  });
  it("uses a published cover when the gallery is empty", () => {
    const project: StudioProject = { ...published, cover_image_url: "/published-cover.jpg" };
    expect(projectImages(project, 0)[0].image_url).toBe("/published-cover.jpg");
  });
});
