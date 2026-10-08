import { describe, expect, it } from "vitest";
import { breadcrumbSchema, pageMetadata, PAGE_SEO, serializeJsonLd, SITE_URL, type SitePath } from "./seo";
import sitemap from "../app/sitemap";

describe("search metadata", () => {
  it("gives every public route its own canonical and matching share URL", () => {
    for (const path of Object.keys(PAGE_SEO) as SitePath[]) {
      const metadata = pageMetadata(path);
      expect(metadata.alternates?.canonical).toBe(path);
      expect(metadata.openGraph?.url).toBe(path);
      expect(metadata.description?.length).toBeGreaterThan(60);
    }
  });
  it("includes every published route without fabricated modification times", () => {
    expect(sitemap().map((item) => item.url)).toEqual(Object.keys(PAGE_SEO).map((path) => SITE_URL + path));
    expect(sitemap().every((item) => item.lastModified === undefined)).toBe(true);
  });
  it("builds the complete route hierarchy for nested service pages", () => {
    const items = breadcrumbSchema("/services/mep").itemListElement;
    expect(items.map((item) => item.item)).toEqual([SITE_URL + "/", SITE_URL + "/services", SITE_URL + "/services/mep"]);
    expect(items.map((item) => item.position)).toEqual([1, 2, 3]);
  });
  it("prevents content from closing the JSON-LD script element", () => {
    const content = { name: "</script><script>alert(1)</script>" };
    const serialized = serializeJsonLd(content);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(content);
  });
});
