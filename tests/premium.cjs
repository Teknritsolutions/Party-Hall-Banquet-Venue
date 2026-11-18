const fs = require("node:fs");
const assert = require("node:assert/strict");
const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const files = [
    "pages/home1.html",
    "pages/home2.html",
    ...fs.readdirSync("pages").map((n) => "pages/" + n),
    ...["client", "admin"].flatMap((r) =>
      fs.readdirSync("dashboard/" + r).map((n) => "dashboard/" + r + "/" + n),
    ),
  ];
  const failures = [];
  for (const file of files) {
    await page.goto("http://127.0.0.1:4173/" + file);
    await page.waitForTimeout(200);
    const result = await page.evaluate(() => ({
      text: document.body.innerText,
      missing: document.querySelectorAll("i[data-lucide]").length,
      css: !!document.querySelector('link[href$="premium.css"]'),
    }));
    if (
      /\b(demo|template|illustrative|fictional|demonstration)\b/i.test(
        result.text,
      )
    )
      failures.push({
        file,
        copy: result.text.match(
          /.{0,55}\b(demo|template|illustrative|fictional|demonstration)\b.{0,55}/gi,
        ),
      });
    if (result.missing || !result.css)
      failures.push({ file, icons: result.missing, css: result.css });
  }
  await page.goto("http://127.0.0.1:4173/");
  const cards = page.locator(".feature-grid").first();
  await cards.screenshot({ path: "tests/premium-features-light.png" });
  const border = await cards
    .locator(".feature")
    .first()
    .evaluate((el) => getComputedStyle(el).borderTopWidth);
  assert.equal(border, "1px");
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "dark"),
  );
  await cards.screenshot({ path: "tests/premium-features-dark.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "light"),
  );
  await cards.screenshot({ path: "tests/premium-features-mobile.png" });
  await browser.close();
  fs.writeFileSync(
    "documentation/premium-test-results.json",
    JSON.stringify({ pages: files.length, failures }, null, 2),
  );
  console.log(JSON.stringify({ pages: files.length, failures }));
  assert.equal(failures.length, 0);
})();
