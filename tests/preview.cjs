let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = playwright;
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4173");
  await page.screenshot({ path: "tests/home-desktop.png", fullPage: true });
  console.log({
    title: await page.title(),
    errors,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  });
  await browser.close();
})();
