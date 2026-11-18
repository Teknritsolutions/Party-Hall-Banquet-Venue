const { chromium } = require("D:/Hobby & Board Games Store/node_modules/playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("http://127.0.0.1:4173/");
  await p.evaluate(() => document.fonts.ready);
  await p.locator(".hero-seal").screenshot({ path: "tests/spacing-badge-detail-desktop.png" });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.locator(".hero-seal").screenshot({ path: "tests/spacing-badge-detail-mobile.png" });
  await b.close();
})();
