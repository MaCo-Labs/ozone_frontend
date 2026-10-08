# OZONE launch readiness

Verified locally on 9 October 2026 against a production Next.js build.

## Website requirements

- Custom 404 returns HTTP 404 and includes useful links and `noindex`.
- Error recovery includes a retry action and contact/home navigation.
- All 18 public pages have one main landmark, one H1, descriptive metadata, canonical URLs, social previews and breadcrumb structured data.
- Sitemap lists all 18 routes. Robots references the production sitemap.
- Service and business structured data use the recorded OZONE details. No invented reviews or ratings are included.
- Client logos retain accessible names; visible client captions are removed.
- The contact form validates fields and prepares a corporate WhatsApp draft. QA intercepts the link before any external message can be sent.
- Privacy information explains WhatsApp and request processing. There are no analytics or advertising trackers in this build.
- Existing public routes remain available. There is no known legacy URL migration that requires a redirect map.
- Mobile menu, project filters, carousel keyboard navigation, thumbnails and reduced motion are verified.
- The first hero headline renders before JavaScript, with a conservative CSS size that prevents mobile clipping. JavaScript then measures both headline phrases against the available width.
- The adaptive image canvas preserves the complete photograph without gutters, distortion or cropping, including extreme portrait, panorama and low-resolution fixtures.
- Footer columns, navigation labels and heading scales are consistent. Mobile hero text fits its container.
- Images and fonts are hosted locally. Preview galleries contain lightweight approved project photographs and complete brochure images.
- Mobile and desktop hero videos are 357,346 and 1,112,082 bytes respectively, replacing an 8,199,299-byte runtime download. Data saver and reduced motion do not load the video; hidden or offscreen video pauses.
- Response headers disable MIME sniffing and unnecessary device permissions. Framework version disclosure is disabled.

## Verification

Verification passed: production build and lint, 46 frontend tests, 15 backend tests, 72 page/viewport checks, 54 checks with motion enabled, and 12 focused hero checks with JavaScript enabled and disabled. Fifteen browser interaction checks passed, including every Qatar Rail photograph. Seventeen discovered internal links returned HTTP 200, and no preview image requests failed. Reports in this folder record the post-patch runs and focused checks after the final hero rendering change.

The performance report measures local, unthrottled production navigation. These numbers are not field Core Web Vitals or a Lighthouse score. It also verifies internal links, image responses, preview independence, client captions, hero video selection and security headers.

The measured home LCP was 884 ms at 390 px and 628 ms at 1440 px, with zero layout shift in all eight sampled navigations. Chrome's network service is initialised with a robots request before measurement, keeping app resources cold while excluding browser-process startup from the page benchmark. Confirm real-user performance after deployment.

Next.js and its ESLint configuration are patched to 16.3.8, Sharp to 0.35.5, and source-map-js to 1.2.2. The final production dependency audit reports zero vulnerabilities. The full tooling audit still reports five high-severity entries from one unpatched `braces@3.0.3` advisory and its ESLint dependency chain. There is no published compatible `braces@3.0.4` patch. This build-only dependency processes repository lint patterns; it is not part of the public runtime. A framework/tooling downgrade suggested by `npm audit --force` is intentionally not applied. Recheck the tooling advisory when a compatible patch becomes available.

Backend caching, compression, conditional requests and a bounded three-query portfolio list are verified by the separate Django tests. Backend changes remain in the main workspace and are not included in this frontend repository.

## Hosting tasks

1. Import this frontend repository into the authorised Vercel account, using Next.js and the repository root. Set `OZONE_PREVIEW_MODE=true` for the client preview.
2. Verify the deployed URL, HTTPS certificate and production responses after deployment. Local HTTP tests cannot verify hosting TLS.
3. Before public indexing, confirm the production domain matches `lib/seo.ts`, configure the domain and HTTPS, and connect the deployed backend if required.
4. Verify domain ownership in Google Search Console and submit `https://www.ozonefitout.com/sitemap.xml`. This requires the owner's Google account; generating the sitemap does not submit it.
5. Keep preview deployments protected from public indexing. Review any previous live-site URL inventory and add permanent redirects if those URLs differ from this site's preserved routes.

No newsletter, checkout, analytics or cookie banner is added because those services are not part of this website. If analytics is introduced later, update the privacy information and consent flow to match its actual behaviour.
