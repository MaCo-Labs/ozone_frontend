/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { writeFile } = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const checks = [];
  for (const width of [320, 390, 768, 1440]) {
    for (const javascriptEnabled of [false, true]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, javascriptEnabled });
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:3001/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const inspect = async () => page.locator('#home-hero-title [class*="lineMask"]').evaluateAll(masks => masks.map(mask => {
        const range = document.createRange(); range.selectNodeContents(mask);
        const text = range.getBoundingClientRect(), box = mask.getBoundingClientRect();
        return { text: mask.textContent, clipped: text.left < box.left - 1 || text.right > box.right + 1, opacity: getComputedStyle(mask.firstElementChild).opacity };
      }));
      let lines = await inspect();
      assert.ok(lines.length === 2 && lines.every(line => !line.clipped && line.opacity === '1'), `Initial hero fails at ${width}px, JavaScript=${javascriptEnabled}`);
      checks.push({ width, javascriptEnabled, phase: 'initial', lines });
      if (javascriptEnabled) {
        await page.locator('video').evaluate(video => { video.pause(); video.currentTime = video.duration / 2 + .1; });
        await page.waitForTimeout(1200);
        lines = await inspect();
        assert.ok(lines.length === 2 && lines.every(line => !line.clipped && line.opacity === '1'));
        assert.ok(lines.some(line => line.text.includes('We shape spaces')));
        checks.push({ width, javascriptEnabled, phase: 'second', lines });
      }
      await context.close();
    }
  }
  await writeFile(path.resolve('../docs/qa-2026-10-08/hero-report.json'), JSON.stringify({ checks }, null, 2));
  await browser.close();
  console.log('12 hero checks pass: four widths, JavaScript disabled/enabled, both rotating headlines.');
})().catch(error => { console.error(error); process.exit(1); });
