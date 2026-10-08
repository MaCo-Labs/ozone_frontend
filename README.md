# OZONE frontend

Next.js website with lightweight local preview images. No backend is required for the client preview.

```sh
npm ci
npm run dev
npm run lint
npm run test
npm run build
```

Deploy on Vercel using Next.js, the repository root and `OZONE_PREVIEW_MODE=true`.

To connect Django, set `OZONE_PREVIEW_MODE=false` and `OZONE_API_BASE_URL` to the deployed `/api/v1` URL. Production SEO uses `https://www.ozonefitout.com`.
