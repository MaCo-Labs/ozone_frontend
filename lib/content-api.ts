import "server-only";

import { cache } from "react";
import previewContent from "./previewContent.json";

export type StudioClient = {
  name: string;
  slug: string;
  website_url: string;
  logo_url: string | null;
};

type PaginatedResponse<T> = {
  results: T[];
};

export type StudioProjectImage = {
  image_url: string;
  alt_text: string;
  caption: string;
  is_cover: boolean;
  display_order: number;
  thumbnail_url?: string;
};

export type StudioProject = {
  title: string;
  slug: string;
  sector: string;
  location: string;
  service: string;
  description: string;
  cover_image_url: string | null;
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
