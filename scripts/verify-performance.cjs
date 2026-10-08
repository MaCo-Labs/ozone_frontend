/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const { writeFile } = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const results = [], broken = [], links = new Set();
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await context.newPage();
    const failed = [];
    page.on('response', response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }); });
    // Initialise Chrome's local network service without loading app scripts or fonts.
    await page.goto('http://127.0.0.1:3001/robots.txt', { waitUntil: 'load' });
    await page.addInitScript(() => {
      window.lab = { cls: 0, lcp: 0, lcpElement: null, longTasks: [] };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.lab.longTasks.push({ start: Math.round(entry.startTime), duration: Math.round(entry.duration) }); }).observe({ type: 'longtask', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.lab.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) { window.lab.lcp = entry.startTime; window.lab.lcpElement = entry.element?.tagName; } }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    for (const route of ['/', '/projects/qatar-rail', '/contact', '/clients']) {
      await page.goto('http://127.0.0.1:3001' + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        return { ttfbMs: Math.round(nav.responseStart - nav.requestStart), domReadyMs: Math.round(nav.domContentLoadedEventEnd), lcpMs: Math.round(window.lab.lcp), lcpElement: window.lab.lcpElement, longTasks: window.lab.longTasks, cls: Number(window.lab.cls.toFixed(4)), transferredBytes: resources.reduce((total, item) => total + item.transferSize, nav.transferSize), video: document.querySelector('video')?.currentSrc, backendRequests: resources.filter(item => /127\.0\.0\.1:8000/.test(item.name)).length, visibleClientCaptions: [...document.querySelectorAll('main ul li')].map(item => item.textContent.trim()).filter(Boolean).length, hrefs: [...document.querySelectorAll('a[href^="/"]')].map(item => item.getAttribute('href')) };
      });
      for (const href of metrics.hrefs) links.add(href.split('#')[0]);
      delete metrics.hrefs;
      assert.equal(metrics.backendRequests, 0, 'Preview must not request backend media');
      if (route === '/clients') assert.equal(metrics.visibleClientCaptions, 0, 'Clients page must show logos without names');
      if (route === '/') {
        assert.ok(metrics.video.endsWith(width < 768 ? 'ozone-hero-mobile.mp4' : 'ozone-hero-desktop.mp4'));
        await page.screenshot({ path: path.resolve(`../docs/qa-2026-10-08/${width}-hero.png`) });
      }
      results.push({ width, route, ...metrics });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:3001/');
    assert.equal(await page.locator('video').getAttribute('src'), null, 'Reduced motion must not download hero video');
    assert.equal(failed.length, 0, JSON.stringify(failed));
    await context.close();
  }
  const context = await browser.newContext();
  for (const href of links) {
    const response = await context.request.get('http://127.0.0.1:3001' + href);
    if (response.status() !== 200) broken.push({ href, status: response.status() });
  }
  const response = await context.request.get('http://127.0.0.1:3001/contact');
  assert.equal(response.headers()['x-content-type-options'], 'nosniff');
  assert.equal(response.headers()['x-powered-by'], undefined);
  assert.equal(broken.length, 0);
  await writeFile(path.resolve('../docs/qa-2026-10-08/performance-report.json'), JSON.stringify({ environment: 'Local production build, warm server and browser network service, cold app resources, no network or CPU throttling. These measurements are not field Core Web Vitals.', results, internalLinksChecked: links.size, broken, failedAssets: 0, reducedMotionVideoDownload: false }, null, 2));
  await browser.close();
  console.log(JSON.stringify({ results, internalLinksChecked: links.size, broken }, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
