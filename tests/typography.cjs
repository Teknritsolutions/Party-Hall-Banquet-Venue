let pw;
try {
  pw = require("playwright");
} catch {
  pw = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = pw;
const fs = require("node:fs");
const assert = require("node:assert/strict");
const files = [
  "pages/home1.html",
  "pages/home2.html",
  ...fs.readdirSync("pages").map((f) => "pages/" + f),
  ...["client", "admin"].flatMap((role) =>
    fs
      .readdirSync("dashboard/" + role)
      .map((f) => "dashboard/" + role + "/" + f),
  ),
];
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const failures = [],
    samples = [];
  let checks = 0;
  for (const file of files) {
    await page.goto("http://127.0.0.1:4173/" + file);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const metrics = await page.evaluate(() => {
        const size = (e) => Number.parseFloat(getComputedStyle(e).fontSize);
        const visible = (e) => e.getClientRects().length;
        return {
          body: size(document.body),
          h1: size(document.querySelector("h1")),
          fieldSizes: [
            ...document.querySelectorAll(
              ".field input,.field select,.field textarea",
            ),
          ]
            .filter(visible)
            .map(size),
          paragraphs: [
            ...document.querySelectorAll(
              ".feature p,.split-copy>p:not(.eyebrow),.page-intro p:not(.eyebrow)",
            ),
          ]
            .filter(visible)
            .map(size),
          hero: document.querySelector(".hero-copy h1")
            ? size(document.querySelector(".hero-copy h1"))
            : null,
          h2: document.querySelector(".section-heading h2")
            ? size(document.querySelector(".section-heading h2"))
            : null,
          nav: document.querySelector(".public-nav .nav-link")
            ? size(document.querySelector(".public-nav .nav-link"))
            : null,
          clipped: [...document.querySelectorAll("h1,h2,h3,p,label,button")]
            .filter(
              (e) =>
                visible(e) &&
                e.clientWidth > 0 &&
                (e.scrollWidth > e.clientWidth + 2 ||
                  e.scrollHeight > e.clientHeight + 2) &&
                !e.closest(".table-wrap,.visually-hidden") &&
                /(hidden|clip)/.test(
                  getComputedStyle(e).overflowX + getComputedStyle(e).overflowY,
                ),
            )
            .map((e) => ({
              tag: e.tagName,
              cls: e.className,
              text: e.textContent.slice(0, 60),
            })),
        };
      });
      checks++;
      if (
        metrics.body !== 16 ||
        metrics.fieldSizes.some((n) => n !== 16) ||
        metrics.paragraphs.some((n) => n !== 16) ||
        metrics.clipped.length
      )
        failures.push({ file, width, ...metrics });
      samples.push({
        file,
        width,
        body: metrics.body,
        h1: metrics.h1,
        h2: metrics.h2,
        hero: metrics.hero,
        nav: metrics.nav,
      });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("http://127.0.0.1:4173/");
  const home = page.getByRole("button", { name: "Home", exact: true });
  await home.hover();
  assert.equal(await home.getAttribute("aria-expanded"), "true");
  await page.screenshot({ path: "tests/typography-header-hover.png" });
  await page.mouse.move(10, 600);
  await page.waitForTimeout(250);
  assert.equal(await home.getAttribute("aria-expanded"), "false");
  await home.click();
  assert.equal(await home.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await home.getAttribute("aria-expanded"), "false");
  await home.focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    "Home Page 1",
  );
  await page.keyboard.press("Escape");
  await page.evaluate(() => scrollTo(0, 500));
  assert.equal(
    await page
      .locator(".site-header")
      .evaluate((e) => e.getBoundingClientRect().top),
    0,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: "tests/typography-mobile-home.png" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const alignment = await page.evaluate(() => ({
    header: document.querySelector(".site-header").getBoundingClientRect()
      .bottom,
    menu: document.querySelector(".public-nav").getBoundingClientRect().top,
    width: document.querySelector(".public-nav").getBoundingClientRect().width,
  }));
  assert(Math.abs(alignment.header - alignment.menu) <= 1);
  assert.equal(alignment.width, 390);
  await page.screenshot({ path: "tests/typography-mobile-navigation.png" });
  await page
    .getByRole("button", { name: "Close navigation", exact: true })
    .click();
  assert.equal(
    await page
      .locator("body")
      .evaluate((e) => e.classList.contains("nav-open")),
    false,
  );
  await browser.close();
  fs.writeFileSync(
    "documentation/typography-test-results.json",
    JSON.stringify(
      {
        pages: files.length,
        checks,
        failures,
        samples,
        headerBehavior: [
          "Hover opens",
          "Pointer leave closes",
          "Click opens",
          "Escape closes",
          "ArrowDown focuses first submenu link",
          "Sticky header",
          "Full-width mobile menu below header",
          "Mobile close clears scroll lock",
        ],
      },
      null,
      2,
    ),
  );
  console.log({ pages: files.length, checks, failures });
  assert.equal(failures.length, 0);
})();
