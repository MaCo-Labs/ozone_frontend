# OZONE frontend

The public OZONE website is a Next.js application. This repository contains only the frontend and approved, lightweight local preview media. It can run without Django.

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run lint`, `npm run test`, and `npm run build` before publishing. Start the production build with `npm run start`.

## Vercel client preview

Import `MaCo-Labs/ozone_frontend` into Vercel. Select Next.js, use the repository root, and keep the standard install and build commands. Set `OZONE_PREVIEW_MODE=true` for the client preview. No backend, database or secret is required. The packaged project photos, brochure previews and client logos populate the image positions.

Selected work shows compact, near-square project photographs with titles inside each image. The carousel advances one project every five seconds once visible, pauses on hover/focus/drag or a hidden tab, and supports swiping and arrow keys. A keyboard-accessible pause control appears on focus; Escape stops rotation. Reduced motion disables automatic rotation. Project details use a photo grid and an expanded gallery. The archive supports Qatar/Bahrain branch switching, sector filters, and search, with three project columns on phones.

The hero uses a 540×720 portrait mobile video (1.34 MB) or a 1.1 MB desktop video. Playback pauses off-screen and in hidden tabs; reduced motion, data saver, and 2G connections use a static poster. Regenerate mobile media from the master with `node scripts/prepare-hero-video.mjs` (requires FFmpeg on PATH or `FFMPEG_PATH`).

## Connect the content service

Set `OZONE_PREVIEW_MODE=false` and `OZONE_API_BASE_URL=https://your-backend.example/api/v1`, then redeploy. Published API content revalidates every 60 seconds; packaged previews remain available when the API fails. The backend is maintained separately and is not deployed by this repository.

## Enquiries and search

The contact form validates the enquiry and opens a corporate WhatsApp draft addressed to +974 3330 7095. Visitors review and send the message themselves. No form database or mail server is required.

Metadata, structured data, sitemap and robots use `https://www.ozonefitout.com` as the production URL. Confirm this domain before the public launch. Configure the domain and HTTPS in Vercel, verify ownership in Google Search Console, and submit `/sitemap.xml`. A Vercel preview does not complete those account-level steps.

Custom 404, retryable error recovery and privacy pages are included. Published projects receive detail routes automatically and appear in the sitemap. Existing project URLs are preserved; map redirects only if legacy URLs change.
