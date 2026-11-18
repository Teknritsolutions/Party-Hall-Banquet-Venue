const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const widths = [
  320, 360, 375, 390, 420, 480, 640, 768, 820, 1024, 1280, 1440, 1920,
];
const pages = [
  "pages/home1.html",
  "pages/home2.html",
  ...fs
    .readdirSync("pages")
    .filter(
      (f) =>
        ![
          "login.html",
          "register.html",
          "forgot-password.html",
          "404.html",
          "coming-soon.html",
        ].includes(f),
    )
    .map((f) => "pages/" + f),
  "documentation/legal.html",
];
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [],
    failures = [];
  let checks = 0;
  page.on("pageerror", (e) => errors.push(e.message));
  for (const file of pages) {
    await page.goto("http://127.0.0.1:4173/" + file);
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["light", "dark"])
      for (const dir of ["ltr", "rtl"]) {
        await page.evaluate(
          ({ theme, dir }) => {
            document.documentElement.dataset.theme = theme;
            document.documentElement.dir = dir;
          },
          { theme, dir },
        );
        for (const width of widths) {
          await page.setViewportSize({ width, height: 1000 });
          await page.evaluate(
            () => new Promise((r) => requestAnimationFrame(r)),
          );
          const geometry = await page.evaluate(() => {
            const h = document
              .querySelector(".nav-container")
              .getBoundingClientRect();
            const nav = document
                .querySelector(".public-nav")
                .getBoundingClientRect(),
              actions = document
                .querySelector(".header-actions")
                .getBoundingClientRect(),
              brand = document
                .querySelector(".site-header .brand")
                .getBoundingClientRect();
            return {
              scroll: document.documentElement.scrollWidth,
              height: h.height,
              gutters: [h.left, innerWidth - h.right],
              nav: nav.toJSON(),
              actions: actions.toJSON(),
              brand: brand.toJSON(),
            };
          });
          checks++;
          if (geometry.scroll > width + 1)
            failures.push({
              file,
              theme,
              dir,
              width,
              type: "overflow",
              geometry,
            });
          if (Math.abs(geometry.gutters[0] - geometry.gutters[1]) > 1)
            failures.push({ file, theme, dir, width, type: "unequal gutters" });
          if (width >= 1280) {
            const boxes = [geometry.brand, geometry.nav, geometry.actions].sort(
              (a, b) => a.left - b.left,
            );
            if (boxes.some((r, i) => i && r.left < boxes[i - 1].right - 1))
              failures.push({
                file,
                theme,
                dir,
                width,
                type: "header overlap",
                geometry,
              });
          }
        }
      }
  }
  await page.goto("http://127.0.0.1:4173/");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "tests/header-updated-desktop.png" });
  await page.getByRole("button", { name: "Dashboard", exact: true }).click();
  assert(
    await page.getByRole("link", { name: /Client Dashboard/ }).isVisible(),
  );
  assert(
    await page.getByRole("link", { name: /Client Login Access/ }).isVisible(),
  );
  await page.screenshot({ path: "tests/header-updated-dashboard-menu.png" });
  await page.keyboard.press("Escape");
  assert(
    (await page
      .getByRole("button", { name: "Dashboard", exact: true })
      .getAttribute("aria-expanded")) === "false",
  );
  await page.locator(".header-login").click();
  await page.waitForURL("**/pages/login.html");
  assert((await page.locator("h1").innerText()) === "Welcome back.");
  await page.goto("http://127.0.0.1:4173/");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Dashboard", exact: true }).click();
  await page.screenshot({ path: "tests/header-updated-mobile-menu.png" });
  assert(
    await page.getByRole("link", { name: /Client Dashboard/ }).isVisible(),
  );
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  assert(
    await page
      .locator("body")
      .evaluate((e) => !e.classList.contains("nav-open")),
  );
  assert((await page.locator(".nav-backdrop").getAttribute("hidden")) !== null);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.screenshot({ path: "tests/header-updated-mobile.png" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator(".menu-toggle").click();
  assert(!(await page.locator(".public-nav").isVisible()));
  await browser.close();
  fs.writeFileSync(
    "documentation/header-test-results.json",
    JSON.stringify(
      {
        pages: pages.length,
        widths,
        checks,
        failures,
        errors,
        interactions: [
          "Dashboard dropdown links",
          "Client login navigation",
          "Keyboard dropdown close",
          "Mobile Dashboard menu",
          "Mobile Escape closes drawer and scroll lock",
          "Mobile close button",
        ],
        screenshots: [
          "header-updated-desktop.png",
          "header-updated-dashboard-menu.png",
          "header-updated-mobile-menu.png",
          "header-updated-mobile.png",
        ],
      },
      null,
      2,
    ),
  );
  console.log({ pages: pages.length, checks, failures, errors });
  assert.equal(failures.length, 0);
  assert.equal(errors.length, 0);
})();
