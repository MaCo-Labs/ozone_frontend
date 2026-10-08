/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const { mkdir, writeFile } = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const output = path.resolve('../docs/qa-2026-10-08');
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3001/projects/qatar-rail', { waitUntil: 'networkidle' });
  const gallery = page.getByRole('region', { name: 'Qatar Rail photographs' });
  const slide = gallery.locator('[aria-roledescription="slide"]').first();
  await gallery.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  assert.equal(await gallery.getByRole('button').count(), 0);
  const start = await slide.getAttribute('aria-label');
  await page.waitForFunction((initial) => document.querySelector('[aria-roledescription="slide"]')?.getAttribute('aria-label') !== initial, start, { timeout: 12000 });
  const canvas = await slide.boundingBox();
  await page.mouse.move(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
  const hovered = await slide.getAttribute('aria-label');
  await page.waitForTimeout(6500);
  assert.equal(await slide.getAttribute('aria-label'), hovered, 'Hover must pause automatic rotation');
  await page.mouse.move(0, 0);
  await gallery.focus();
  const focused = await slide.getAttribute('aria-label');
  await page.waitForTimeout(6500);
  assert.equal(await slide.getAttribute('aria-label'), focused, 'Keyboard focus must pause automatic rotation');
  await page.keyboard.press('ArrowRight');
  assert.notEqual(await slide.getAttribute('aria-label'), focused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await gallery.evaluate((element) => element.blur());
  const reduced = await slide.getAttribute('aria-label');
  await page.waitForTimeout(6500);
  assert.equal(await slide.getAttribute('aria-label'), reduced);

  await page.goto('http://127.0.0.1:3001/projects', { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Healthcare', exact: true }).click();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  assert.ok(await page.locator('article').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).opacity === '1')), 'Filtered cards must remain visible with motion enabled');

  const fixtures = [];
  for (const [name, width, height] of [['portrait', 240, 1200], ['panorama', 1600, 160], ['small-square', 24, 24]]) {
    const fixtureContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const fixturePage = await fixtureContext.newPage();
    await fixturePage.route(/(?:media\/projects\/|preview\/qatar-rail-)/, (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#087d84"/><rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#19bdc6" stroke-width="2"/></svg>` }));
    await fixturePage.goto('http://127.0.0.1:3001/projects/qatar-rail', { waitUntil: 'networkidle' });
    const region = fixturePage.getByRole('region', { name: 'Qatar Rail photographs' });
    await region.scrollIntoViewIfNeeded();
    const image = region.locator('[aria-roledescription="slide"] img').first();
    await image.evaluate((img) => img.complete ? undefined : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; }));
    await fixturePage.waitForFunction(() => {
      const slide = document.querySelector('[aria-roledescription="slide"]'), img = slide?.querySelector('img'), box = slide?.getBoundingClientRect();
      return img?.naturalWidth > 0 && Math.abs(box.width / box.height - img.naturalWidth / img.naturalHeight) < .01;
    });
    const actual = await image.evaluate((img) => {
      const box = img.parentElement.getBoundingClientRect();
      return { width: img.naturalWidth, height: img.naturalHeight, fit: getComputedStyle(img).objectFit, canvasRatio: box.width / box.height };
    });
    assert.equal(actual.width, width);
    assert.equal(actual.height, height);
    assert.equal(actual.fit, 'cover');
    assert.ok(Math.abs(actual.canvasRatio - width / height) < .02, 'The canvas must share the full photograph ratio');
    fixtures.push({ name, ...actual });
    await region.screenshot({ path: path.join(output, `fit-${name}.png`), style: 'body > header, .skipLink { visibility: hidden !important; }' });
    await fixtureContext.close();
  }

  // Verify all page text boxes with normal motion at mobile widths.
  const normalChecks = [];
  const routes = ['/', '/about', '/services', '/services/interior-fit-out', '/services/contracting-construction', '/services/mep', '/services/engineering', '/projects', '/projects/qatar-rail', '/projects/maestro', '/projects/apparel-group', '/clients', '/process', '/quality-safety', '/sectors', '/insights', '/contact', '/privacy'];
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of routes) {
      await page.goto('http://127.0.0.1:3001' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(350);
      const outliers = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,p,input,select,textarea,button')].filter((element) => !element.closest('[data-scroll-rail],[inert],[aria-hidden="true"],dialog:not([open])')).flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const stage = element.closest('[data-horizontal-stage]');
        if (stage && (stage.getBoundingClientRect().right <= 0 || stage.getBoundingClientRect().left >= innerWidth)) return [];
        return rect.width && (rect.left < -2 || rect.right > innerWidth + 2) ? [element.textContent?.slice(0, 80)] : [];
      }));
      normalChecks.push({ width, route, outliers });
      assert.equal(outliers.length, 0, `${route} overflows at ${width}px: ${outliers.join(', ')}`);
    }
    console.log(`Motion-enabled layouts pass at ${width}px`);
  }
  await writeFile(path.join(output, 'gallery-report.json'), JSON.stringify({ autoplay: 'passed', hoverPause: 'passed', focusPause: 'passed', preferenceChange: 'passed', filters: 'passed', fixtures, normalChecks }, null, 2));
  await browser.close();
  console.log('Gallery aspect ratios, low-resolution fitting, playback, reduced motion, and 54 normal-motion page checks passed.');
})().catch((error) => { console.error(error); process.exit(1); });
