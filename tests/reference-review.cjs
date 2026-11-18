const { chromium } = require("D:/Hobby & Board Games Store/node_modules/playwright");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(
    "https://teknritsolutions.github.io/Kids-Summer-Camp-Activity-Program/pages/index.html",
    { waitUntil: "networkidle", timeout: 60000 },
  );
  await page.screenshot({ path: "tests/reference-header.png" });
  console.log(await page.locator(".site-header").innerText());
  console.log(
    await page
      .locator(".header-inner")
      .evaluate((e) => ({
        rect: e.getBoundingClientRect().toJSON(),
        gap: getComputedStyle(e).gap,
        align: getComputedStyle(e).alignItems,
      })),
  );
  const dashboard = page.locator(".site-header summary").filter({ hasText: "Dashboard" });
  await dashboard.click();
  await page.screenshot({ path: "tests/reference-dashboard-menu.png" });
  console.log(await page.locator(".site-header").innerText());
  await browser.close();
})();
