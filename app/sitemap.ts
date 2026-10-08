import type { MetadataRoute } from "next";
import { PAGE_SEO, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Do not report request time as a content modification date.
  return Object.keys(PAGE_SEO).map((path) => ({ url: `${SITE_URL}${path}` }));
}
