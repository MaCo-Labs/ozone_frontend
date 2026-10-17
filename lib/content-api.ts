import "server-only";

import { cache } from "react";
import previewContent from "./previewContent.json";
import type { ProjectBranch } from "./projectBranch";

export type StudioClient = {
  name: string;
  slug: string;
  website_url: string;
  logo_url: string | null;
};

type PaginatedResponse<T> = {
  results: T[];
  next?: string | null;
};

export type StudioProjectImage = {
  image_url: string;
  alt_text: string;
  caption: string;
  is_cover: boolean;
  display_order: number;
  thumbnail_url?: string;
  /** A display window within an approved company-profile composition. */
  crop?: { left: number; top: number; width: number; height: number; aspect: number };
};

export type StudioProjectSummary = {
  title: string;
  slug: string;
  sector: string;
  branch?: ProjectBranch;
  short_description?: string;
  featured?: boolean;
  client?: StudioClient | null;
  cover_image_url: string | null;
};

export type StudioProject = StudioProjectSummary & {
  location: string;
  service: string;
  description: string;
  completion_year?: number | null;
  meta_title?: string;
  meta_description?: string;
  images: StudioProjectImage[];
};

const apiBaseUrl = (process.env.OZONE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

async function getJson<T>(path: string): Promise<T | null> {
  if (process.env.OZONE_PREVIEW_MODE === "true") return null;
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(3500) });

    if (!response.ok) return null;

    return await response.json() as T;
  } catch {
    return null;
  }
}

/** Public content revalidates every minute; packaged previews work without Django. */
export const getStudioClients = cache(async (): Promise<StudioClient[] | null> => {
  const response = await getJson<PaginatedResponse<StudioClient>>("/clients/?limit=100");
  return response?.results ?? previewContent.clients;
});

/** Django is the source of truth for published project galleries. */
export const getStudioProject = cache((slug: string): Promise<StudioProject | null> =>
  getJson<StudioProject>(`/projects/${encodeURIComponent(slug)}/`),
);

/** Only published Django projects appear in the archive and selected work. */
export const getStudioProjects = cache(async (): Promise<StudioProjectSummary[] | null> => {
  const projects: StudioProjectSummary[] = [];
  let offset = 0;
  while (true) {
    const page = await getJson<PaginatedResponse<StudioProjectSummary>>(`/projects/?limit=100&offset=${offset}`);
    if (!page) return null;
    projects.push(...page.results);
    if (!page.next || !page.results.length) return projects;
    offset += page.results.length;
  }
});
