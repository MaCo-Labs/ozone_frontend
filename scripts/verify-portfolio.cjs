/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const output = path.resolve('../docs/qa-2026-10-13');
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const failures = [], checks = [];
  const landscapeOnly = process.env.OZONE_QA_SCOPE === 'landscape';
  try {
    for (const width of landscapeOnly ? [] : [320, 360, 390, 430, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => failures.push(error.message));
      page.on('response', response => { if (response.status() >= 400 && !response.url().includes('/__nextjs')) failures.push(`${response.status()} ${response.url()}`); });
      await page.goto('http://127.0.0.1:3001/', { waitUntil: 'networkidle' });
      const carousel = page.getByRole('region', { name: 'Selected projects' });
      await carousel.scrollIntoViewIfNeeded();
      assert.equal(await carousel.locator('img').count(), 3, 'Homepage must contain one cover per featured project');
      if (width === 320) {
        const firstDot = await carousel.getByRole('button', { name: 'Show Qatar Rail', exact: true }).boundingBox();
        const lastDot = await carousel.getByRole('button', { name: 'Show Apparel Group Head Office', exact: true }).boundingBox();
        assert.ok(Math.abs(firstDot.y - lastDot.y) < 1, 'Phone pagination must fit one row');
      }
      await carousel.getByRole('button', { name: 'Next project', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('[aria-label="Show Maestro Medical Centre"]')?.getAttribute('aria-pressed') === 'true');
      await carousel.getByRole('button', { name: 'Show Qatar Rail', exact: true }).click();
      await carousel.getByRole('button', { name: 'Next project', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('[aria-label="Show Maestro Medical Centre"]')?.getAttribute('aria-pressed') === 'true');
      await carousel.getByRole('button', { name: 'Show Qatar Rail', exact: true }).click();
      await page.locator('#the-work').screenshot({ path: path.join(output, `${width}-selected-work.png`) });
      if (width === 1440) {
        await carousel.getByRole('button', { name: 'Show Maestro Medical Centre', exact: true }).click();
        await carousel.screenshot({ path: path.join(output, '1440-maestro-cover.png') });
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        const slide = carousel.locator('[aria-roledescription="slide"][data-active="true"] a > div').first();
        await slide.scrollIntoViewIfNeeded();
        const box = await slide.boundingBox();
        const dragY = box.y + box.height / 2;
        await page.mouse.move(box.x + box.width * .85, dragY);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * .15, dragY, { steps: 15 });
        await page.waitForTimeout(150);
        await page.mouse.up();
        await page.waitForFunction(() => document.querySelector('[aria-label="Show Maestro Medical Centre"]')?.getAttribute('aria-pressed') === 'false');
        await page.emulateMedia({ reducedMotion: 'reduce' });
      }

      await page.goto('http://127.0.0.1:3001/projects', { waitUntil: 'networkidle' });
      assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Archive must fit mobile width');
      if (width < 768) {
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        await page.getByRole('button', { name: 'Close menu', exact: true }).waitFor();
        await page.keyboard.press('Escape');
        await page.getByRole('button', { name: 'Open menu', exact: true }).waitFor();
        assert.ok(await page.getByRole('searchbox').evaluate(element => parseFloat(getComputedStyle(element).fontSize)) >= 16, 'Mobile inputs must avoid iOS automatic zoom');
      }
      await page.getByRole('button', { name: 'Healthcare', exact: true }).click();
      assert.equal(await page.locator('main article').count(), 1);
      assert.match(await page.locator('main article').innerText(), /Maestro Medical Centre/);
      await page.getByRole('button', { name: 'All', exact: true }).click();
      await page.getByRole('searchbox', { name: 'Search projects' }).fill('zz-no-match');
      await page.getByRole('heading', { name: 'No matching projects.' }).waitFor();
      await page.getByRole('button', { name: 'Clear filters' }).click();
      assert.equal(await page.getByRole('searchbox').inputValue(), '');
      for (let position = 0; position < await page.evaluate(() => document.body.scrollHeight); position += 800) await page.evaluate(y => scrollTo(0, y), position);
      // A full-page screenshot includes offscreen lazy images; request them explicitly for capture.
      await page.locator('main article img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.querySelectorAll('main article img')].every(image => image.complete), null, { timeout: 15000 });
      await page.locator('main article img').evaluateAll(images => Promise.all(images.map(image => image.decode().catch(() => {}))));
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `${width}-projects.png`), fullPage: true });

      await page.goto('http://127.0.0.1:3001/projects/qatar-rail', { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Open photo 1 of Qatar Rail', exact: true }).click();
      const dialog = page.getByRole('dialog', { name: 'Qatar Rail photo gallery' });
      await dialog.waitFor();
      await dialog.getByRole('button', { name: 'Next photo', exact: true }).click();
      assert.match(await dialog.innerText(), /2 \/ 18/);
      await page.keyboard.press('ArrowLeft');
      assert.match(await dialog.innerText(), /1 \/ 18/);
      await page.keyboard.press('Escape');
      assert.equal(await dialog.isVisible(), false);
      assert.equal(await page.getByRole('button', { name: 'Open photo 1 of Qatar Rail', exact: true }).evaluate(element => element === document.activeElement), true, 'Closing gallery must restore focus');
      assert.match(await page.locator('textarea[name="message"]').inputValue(), /Qatar Rail/);
      await page.screenshot({ path: path.join(output, `${width}-project-detail.png`), fullPage: true });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Page must not overflow horizontally');
      if (width === 320) {
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        const menuBox = await page.getByRole('button', { name: 'Open menu', exact: true }).boundingBox();
        assert.ok(menuBox.x >= 0 && menuBox.x + menuBox.width <= 320, 'Enlarged-text menu must fit the viewport');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Enlarged text must not cause horizontal overflow');
        await page.screenshot({ path: path.join(output, '320-project-detail-enlarged-text.png'), fullPage: true });
        await page.goto('http://127.0.0.1:3001/projects', { waitUntil: 'networkidle' });
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        assert.equal(await page.getByRole('heading', { level: 1 }).evaluate(element => element.scrollWidth > element.clientWidth + 1), false, 'Enlarged archive title must not clip');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      checks.push({ width, covers: 3, filters: 'passed', search: 'passed', gallery: 'passed', focusRestoration: 'passed', overflow: false });
      await context.close();
    }
    const landscape = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const landscapePage = await landscape.newPage();
    await landscapePage.goto('http://127.0.0.1:3001/projects/qatar-rail', { waitUntil: 'networkidle' });
    await landscapePage.getByRole('button', { name: 'Open photo 1 of Qatar Rail', exact: true }).click();
    const landscapeDialog = landscapePage.getByRole('dialog', { name: 'Qatar Rail photo gallery' });
    const closeBox = await landscapeDialog.getByRole('button', { name: 'Close gallery', exact: true }).boundingBox();
    assert.ok(closeBox.y >= 0 && closeBox.y + closeBox.height <= 390, 'Landscape close control must stay visible');
    const nextBox = await landscapeDialog.getByRole('button', { name: 'Next photo', exact: true }).boundingBox();
    assert.ok(nextBox.y >= 0 && nextBox.y + nextBox.height <= 390, 'Landscape photo controls must stay visible');
    await landscapePage.screenshot({ path: path.join(output, '844-landscape-gallery.png') });
    checks.push({ width: 844, height: 390, landscapeControls: 'passed' });
    await landscape.close();
    const live = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    live.on('pageerror', error => failures.push(error.message));
    await live.goto('http://localhost:3000/projects', { waitUntil: 'networkidle' });
    assert.equal(await live.locator('main article').count(), 1, 'Live archive must only show published Django content');
    await live.goto('http://localhost:3000/projects/qatar-rail', { waitUntil: 'networkidle' });
    assert.match(await live.locator('main').innerText(), /Interior Fit-Out/);
    await live.screenshot({ path: path.join(output, '1440-live-project-detail.png'), fullPage: true });
    const missing = await live.goto('http://localhost:3000/projects/unknown-project');
    // Next.js returns 200 when a loading boundary has already streamed before notFound().
    assert.ok([200, 404].includes(missing.status()));
    await live.getByRole('heading', { name: 'Let’s find the right space.', exact: true }).waitFor();
    assert.match(await live.locator('head meta[name="robots"]').first().getAttribute('content'), /noindex/);
    assert.equal(failures.length, 0, failures.join('\n'));
    await writeFile(path.join(output, landscapeOnly ? 'landscape-report.json' : 'portfolio-report.json'), JSON.stringify({ checks, publishedDjangoProjects: 1, failures }, null, 2));
    console.log(JSON.stringify({ checks, publishedDjangoProjects: 1, failures }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
