/* Production browser checks. Uses the bundled Playwright runtime via NODE_PATH. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const { mkdir, writeFile } = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3001';
const output = process.env.QA_OUTPUT_DIR || path.resolve('../docs/qa-2026-10-08');
const routes = ['/', '/about', '/services', '/services/interior-fit-out', '/services/contracting-construction', '/services/mep', '/services/engineering', '/projects', '/projects/qatar-rail', '/projects/maestro', '/projects/apparel-group', '/clients', '/process', '/quality-safety', '/sectors', '/insights', '/contact', '/privacy'];

(async () => {
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const failures = [];
  const checks = [];
  page.on('pageerror', (error) => errors.push({ route: page.url(), message: error.message }));

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 });
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
      const result = await page.evaluate(() => {
        const shown = (element) => !element.closest('[data-scroll-rail], [inert], [aria-hidden="true"], dialog:not([open])') && getComputedStyle(element).visibility !== 'hidden' && getComputedStyle(element).display !== 'none';
        const outliers = [...document.querySelectorAll('h1,h2,h3,p,input,select,textarea,button')].filter(shown).flatMap((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width && (rect.left < -2 || rect.right > innerWidth + 2) ? [{ tag: element.tagName, text: element.textContent?.slice(0, 65), left: Math.round(rect.left), right: Math.round(rect.right) }] : [];
        });
        const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent));
        const headings = [...document.querySelectorAll('main h1,main h2,main h3')].map((element) => ({ text: element.textContent.slice(0, 75), size: getComputedStyle(element).fontSize }));
        const heroClipped = [...document.querySelectorAll('#home-hero-title [class*="lineMask"]')].some((mask) => {
          const range = document.createRange(); range.selectNodeContents(mask);
          const text = range.getBoundingClientRect(), box = mask.getBoundingClientRect();
          return text.left < box.left - 1 || text.right > box.right + 1;
        });
        return {
          headings, heroClipped,
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          ogUrl: document.querySelector('meta[property="og:url"]')?.content,
          ogImage: document.querySelector('meta[property="og:image"]')?.content,
          h1: document.querySelectorAll('main h1').length,
          main: document.querySelectorAll('#main-content').length,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          outliers,
          schemas: schemas.length,
          hasBreadcrumb: schemas.some((schema) => schema['@type'] === 'BreadcrumbList'),
        };
      });
      const check = { width, route, status: response.status(), ...result };
      checks.push(check);
      if (response.status() !== 200 || result.h1 !== 1 || result.main !== 1 || result.overflow || result.heroClipped || result.outliers.length || !result.hasBreadcrumb || result.canonical !== 'https://www.ozonefitout.com' + route || new URL(result.ogUrl).href !== result.canonical || !result.ogImage || !result.description) failures.push(check);
      if ((width === 390 || width === 1440) && ['/', '/contact', '/projects', '/projects/qatar-rail', '/services', '/quality-safety'].includes(route)) {
        for (const element of await page.locator('[data-reveal]').all()) {
          await element.scrollIntoViewIfNeeded();
          for (const img of await element.locator('img:visible').all()) {
            await img.evaluate((image) => image.complete ? undefined : new Promise((resolve) => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); setTimeout(resolve, 5000); }));
          }
        }
        await page.evaluate(() => scrollTo(0, 0));
        if (route === '/') {
          const style = 'body > header, .skipLink { visibility: hidden !important; }';
          await page.locator('#the-work').scrollIntoViewIfNeeded();
          await page.locator('#the-work [data-image-ready="true"] img').waitFor({ state: 'visible', timeout: 30000 });
          await page.locator('#the-work').screenshot({ path: path.join(output, `${width}-selected-work.png`), style });
          await page.locator('footer').screenshot({ path: path.join(output, `${width}-footer.png`) });
          await page.locator('section[aria-labelledby="clients-title"]').screenshot({ path: path.join(output, `${width}-brands.png`), style });
          await page.evaluate(() => scrollTo(0, 0));
        }
        await page.screenshot({ path: path.join(output, `${width}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}.png`), fullPage: true });
      }
    }
    console.log(`Checked ${routes.length} pages at ${width}px`);
    await writeFile(path.join(output, 'viewport-report.json'), JSON.stringify({ checks, failures, errors }, null, 2));
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 60000 });
  const projectSelector = page.getByRole('group', { name: 'Select a featured project' });
  const homeGallery = page.getByRole('region', { name: 'Qatar Rail photographs' });
  await homeGallery.scrollIntoViewIfNeeded();
  assert.equal(await homeGallery.getByRole('button').count(), 18, 'Home has 18 photograph thumbnails');
  const thumbs = homeGallery.getByRole('group', { name: 'Qatar Rail photograph thumbnails' });
  await thumbs.getByRole('button', { name: 'View photograph 18', exact: true }).click();
  assert.equal(await homeGallery.locator('[aria-roledescription="slide"]').getAttribute('aria-label'), '18 of 18');
  await page.keyboard.press('Home');
  assert.equal(await thumbs.getByRole('button', { name: 'View photograph 1', exact: true }).getAttribute('aria-pressed'), 'true');
  await projectSelector.getByRole('button', { name: /Maestro Medical Centre/ }).click();
  assert.equal(await page.getByRole('region', { name: 'Maestro Medical Centre photographs' }).count(), 1);
  assert.equal(await page.locator('#the-work').getByRole('link', { name: /View project/ }).getAttribute('href'), '/projects/maestro');
  await projectSelector.getByRole('button', { name: /Apparel Group Head Office/ }).click();
  assert.equal(await page.getByRole('region', { name: 'Apparel Group Head Office photographs' }).count(), 1);

  await page.goto(base + '/projects/qatar-rail', { waitUntil: 'networkidle', timeout: 60000 });
  const gallery = page.getByRole('region', { name: 'Qatar Rail photographs' });
  await gallery.scrollIntoViewIfNeeded();
  await gallery.focus();
  const activeSlide = () => gallery.locator('[aria-roledescription="slide"]').first();
  assert.equal(await activeSlide().getAttribute('aria-label'), '1 of 18');
  await page.keyboard.press('End');
  assert.equal(await activeSlide().getAttribute('aria-label'), '18 of 18');
  await page.keyboard.press('ArrowRight');
  assert.equal(await activeSlide().getAttribute('aria-label'), '1 of 18');
  const dimensions = [];
  for (let index = 0; index < 18; index++) {
    await activeSlide().locator('img').evaluate((img) => img.complete ? undefined : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; }));
    await page.waitForFunction(() => {
      const slide = document.querySelector('[aria-roledescription="slide"]'), img = slide?.querySelector('img'), box = slide?.getBoundingClientRect();
      return img?.naturalWidth > 0 && Math.abs(box.width / box.height - img.naturalWidth / img.naturalHeight) < .01;
    });
    dimensions.push(await activeSlide().evaluate((canvas) => {
      const img = canvas.querySelector('img');
      const frame = canvas.getBoundingClientRect();
      const photo = img.getBoundingClientRect();
      return { width: img.naturalWidth, height: img.naturalHeight, fit: getComputedStyle(img).objectFit, canvasRatio: frame.width / frame.height, imageRatio: img.naturalWidth / img.naturalHeight, filled: Math.abs(photo.width - frame.width) < 1 && Math.abs(photo.height - frame.height) < 1 };
    }));
    const actual = dimensions.at(-1);
    assert.equal(actual.fit, 'cover');
    assert.ok(actual.width > 0 && actual.filled && Math.abs(actual.canvasRatio - actual.imageRatio) < .01, 'Canvas must fit the full photograph with no gutters or crop');
    await page.keyboard.press('ArrowRight');
  }
  await page.waitForTimeout(6500);
  assert.equal(await activeSlide().getAttribute('aria-label'), '1 of 18', 'Reduced motion keeps the gallery still');

  await page.goto(base + '/projects', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Healthcare', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Healthcare', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.ok(await page.getByRole('region', { name: 'Maestro Medical Centre photographs' }).count());
  await page.getByRole('button', { name: 'All', exact: true }).click();
  assert.equal(await page.locator('article').count(), 14);
  assert.ok(await page.locator('article').evaluateAll((articles) => articles.every((article) => getComputedStyle(article).opacity === '1')), 'Changing a sector filter must leave all project cards visible');

  await page.goto(base + '/contact', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('dialog', { name: 'Primary navigation' }).waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'false');

  const form = page.locator('form');
  await form.getByRole('button', { name: /Continue on WhatsApp/ }).click();
  assert.equal(await form.evaluate((element) => element.checkValidity()), false);
  await form.locator('[name="name"]').fill('Amira QA');
  await form.locator('[name="company"]').fill('A&B Design');
  await form.locator('[name="email"]').fill('amira@example.com');
  await form.locator('[name="phone"]').fill('+974 5555 1234');
  await form.locator('[name="project"]').selectOption({ label: 'Interior fit-out' });
  await form.locator('[name="message"]').fill('Doha office\nJoinery & MEP + finishes?');
  let whatsappUrl;
  // Intercept before reaching WhatsApp. No external message is sent by QA.
  await page.route('https://wa.me/**', async (request) => {
    whatsappUrl = request.request().url();
    await request.fulfill({ status: 200, contentType: 'text/html', body: '<p>Enquiry intercepted for testing.</p>' });
  });
  await form.getByRole('button', { name: /Continue on WhatsApp/ }).click();
  await page.waitForURL('https://wa.me/**');
  const link = new URL(whatsappUrl);
  assert.equal(link.pathname, '/97433307095');
  assert.ok(link.searchParams.get('text').includes('Doha office\nJoinery & MEP + finishes?'));
  assert.ok(link.searchParams.get('text').includes('*Company:* A&B Design'));

  const missing = await page.goto(base + '/this-page-does-not-exist', { waitUntil: 'networkidle' });
  assert.equal(missing.status(), 404);
  assert.ok(await page.getByRole('link', { name: 'Back to home', exact: true }).count());
  assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count());
  await page.screenshot({ path: path.join(output, '390-404.png'), fullPage: true });
  const sitemap = await context.request.get(base + '/sitemap.xml');
  assert.equal(sitemap.status(), 200);
  assert.equal(((await sitemap.text()).match(/<loc>/g) || []).length, routes.length);
  const robots = await context.request.get(base + '/robots.txt');
  assert.ok((await robots.text()).includes('https://www.ozonefitout.com/sitemap.xml'));
  const social = await context.request.get(base + '/social/ozone-share.png');
  assert.equal(social.status(), 200);

  const report = { checks, failures, errors, railImageDimensions: dimensions, interactionChecks: ['selected-project switching', 'thumbnail selection without arrow toolbar', 'adaptive canvas', 'keyboard', 'wrapping', 'all 18 photographs', 'reduced motion', 'sector filters', 'mobile menu', 'form validation', 'WhatsApp payload intercepted', '404 status and noindex', 'sitemap', 'robots', 'social image'] };
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log(JSON.stringify({ pages: checks.length, failures, errors, interactions: report.interactionChecks.length }, null, 2));
  if (failures.length || errors.length) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exit(1); });
