/* Focused production regression checks. Bundled Playwright is supplied via NODE_PATH. */
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3001';
const output = process.env.QA_OUTPUT_DIR || path.resolve('../docs/qa-navigation');

(async () => {
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const errors = [];
  try {
    for (const [width, height] of [[320, 568], [360, 740], [390, 844], [430, 932], [768, 1024], [844, 390], [1440, 650], [1440, 900], [1920, 1080]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      const clientTop = await page.locator('#clients-title').evaluate(e => e.closest('section').getBoundingClientRect().top + scrollY);
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), clientTop - height / 2);
      const boundary = await page.evaluate(() => {
        const hero = document.querySelector('#home-hero-title').closest('section');
        const clients = document.querySelector('#clients-title').closest('section');
        const heroBox = hero.getBoundingClientRect();
        const wrapperBox = hero.parentElement.getBoundingClientRect();
        const clientBox = clients.getBoundingClientRect();
        const hit = document.elementFromPoint(innerWidth / 2, clientBox.top + 5);
        return { heroHeight: heroBox.height, wrapperHeight: wrapperBox.height, heroBottom: heroBox.bottom, clientTop: clientBox.top, clientsPainted: clients === hit || clients.contains(hit) };
      });
      assert.ok(Math.abs(boundary.heroHeight - boundary.wrapperHeight) < 1, 'Hero must match its sticky container');
      assert.ok(boundary.heroBottom <= boundary.clientTop + 1, 'Hero must end before clients');
      assert.ok(boundary.clientsPainted, 'Hero video must not paint over clients');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: path.join(output, `${width}x${height}-boundary-after.png`) });

      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      await page.getByRole('button', { name: 'Close menu', exact: true }).waitFor();
      const nav = page.getByRole('navigation', { name: 'Primary navigation', exact: true });
      await nav.waitFor();
      const geometry = await nav.locator('a').evaluateAll(elements => elements.map(e => ({ text: e.textContent, font: parseFloat(getComputedStyle(e).fontSize), rect: e.getBoundingClientRect().toJSON() })));
      assert.equal(geometry.length, 7);
      for (const link of geometry) {
        assert.ok(link.rect.height >= 56, `${link.text} must have a generous hit area`);
        assert.ok(link.font >= (width <= 700 ? 26 : 32), `${link.text} must be readable`);
        assert.ok(link.rect.left >= 0 && link.rect.right <= width, `${link.text} must fit horizontally`);
        if (width <= 700) assert.ok(link.rect.width >= width - 42, 'Phone links must fill the menu width');
      }
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      await page.screenshot({ path: path.join(output, `${width}x${height}-menu-after.png`) });
      await nav.getByRole('link', { name: 'About', exact: true }).focus();
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.getByRole('button', { name: 'Close menu', exact: true }).evaluate(e => e === document.activeElement), true, 'Close button must be in the focus sequence');
      await nav.getByRole('link', { name: 'Contact', exact: true }).focus();
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open menu');
      assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).evaluate(e => e === document.activeElement), true);
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');

      if (width === 320) {
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        await page.getByRole('button', { name: 'Close menu', exact: true }).waitFor();
        await nav.waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, '200% text must fit horizontally');
        const close = await page.getByRole('button', { name: 'Close menu', exact: true }).boundingBox();
        assert.ok(close.x >= 0 && close.x + close.width <= width, 'Close button must fit at 200% text');
        await nav.getByRole('link', { name: 'Quality & Safety', exact: true }).scrollIntoViewIfNeeded();
        const link = await nav.getByRole('link', { name: 'Quality & Safety', exact: true }).boundingBox();
        assert.ok(link.y >= 82 && link.y + link.height <= height, 'Enlarged menu links must scroll into view below the header');
        await page.screenshot({ path: path.join(output, '320-menu-enlarged-text.png') });
        await nav.getByRole('link', { name: 'Projects', exact: true }).click();
        await page.waitForURL('**/projects');
        await page.getByRole('button', { name: 'Open menu', exact: true }).waitFor();
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden', 'Navigation must release scroll lock');
      }
      checks.push({ width, height, boundary, menu: 'passed', keyboard: 'passed' });
      await page.close();
    }
    assert.equal(errors.length, 0, errors.join('\n'));
    await writeFile(path.join(output, 'navigation-report.json'), JSON.stringify({ checks, errors }, null, 2));
    console.log(JSON.stringify({ viewports: checks.length, heroContainment: 'passed', menuTargets: 'passed', keyboard: 'passed', enlargedText: 'passed', errors }, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
