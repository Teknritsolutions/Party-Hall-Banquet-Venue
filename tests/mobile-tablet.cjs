let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = playwright;
const fs = require("node:fs");
const path = require("node:path");
const widths = [320,390,480,600,640,768,820,912,1024,1440];
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
const files = [
  "index.html",
  ...walk("documentation").filter(p => p.endsWith(".html")),
  ...walk("pages"),
  ...walk("dashboard"),
]
  .filter((p) => p.endsWith(".html"))
  .map((p) => p.replaceAll("\\", "/"));
fs.mkdirSync("tests/screenshots", { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const failures = [],
    pageErrors = [],
    resources = [];
  let checks = 0;
  const workers = Array.from({ length: 3 }, (_, worker) =>
    files.filter((_, i) => i % 3 === worker),
  );
  await Promise.all(
    workers.map(async (files) => {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      let current = "";
      page.on("pageerror", (e) =>
        pageErrors.push({ file: current, error: e.message }),
      );
      page.on("response", (res) => {
        if (res.status() >= 400)
          resources.push({
            file: current,
            status: res.status(),
            url: res.url(),
          });
      });
      for (const file of files) {
        current = file;
        await page.goto("http://127.0.0.1:4173/" + file);
        await page.evaluate(async () => {
          document
            .querySelectorAll("img")
            .forEach((i) => (i.loading = "eager"));
          await Promise.all(
            [...document.images].map((i) => i.decode().catch(() => {})),
          );
          await document.fonts.ready;
        });
        const images = await page
          .locator("img")
          .evaluateAll((images) =>
            images
              .filter((i) => !i.complete || !i.naturalWidth)
              .map((i) => i.getAttribute("src")),
          );
        if (images.length) failures.push({ file, images });
        if (file.startsWith("dashboard/")) {
          const count = await page.locator("#dashboard-view").innerText();
          if (count.includes("Preparing your "))
            failures.push({ file, error: "Dashboard did not initialize" });
        }
        for (const theme of ["light", "dark"])
          for (const dir of ["ltr", "rtl"]) {
            await page.evaluate(
              ({ theme, dir }) => {
                document.documentElement.dataset.theme = theme;
                document.documentElement.dir = dir;
                document.dispatchEvent(new Event("themechange"));
                document.dispatchEvent(new Event("directionchange"));
              },
              { theme, dir },
            );
            for (const width of widths) {
              await page.setViewportSize({ width, height: 1000 });
              await page.evaluate(
                () =>
                  new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                  ),
              );
              const dimensions = await page.evaluate(() => ({
                narrowFields: [...document.querySelectorAll(".form-grid .field input,.form-grid .field select,.form-grid .field textarea")].filter(e => e.getClientRects().length && e.getBoundingClientRect().width < 170).map(e => ({id:e.id,width:e.getBoundingClientRect().width})),
                width: innerWidth,
                scroll: document.documentElement.scrollWidth,
                bad: [...document.querySelectorAll("main *")]
                  .filter((e) => {
                    const r = e.getBoundingClientRect();
                    return (
                      r.width &&
                      r.right > innerWidth + 2 &&
                      !e.closest(".table-wrap,.sidebar") &&
                      getComputedStyle(e).position !== "absolute"
                    );
                  })
                  .slice(0, 5)
                  .map((e) => ({ tag: e.tagName, class: e.className })),
              }));
              checks++;
              if (dimensions.scroll > width + 2 || dimensions.narrowFields.length)
                failures.push({ file, theme, dir, width, ...dimensions });
              if (
                (theme === "light" && dir === "ltr" && width === 820) ||
                (theme === "dark" && dir === "rtl" && width === 390)
              ) {
                await page.screenshot({
                  path:
                    "tests/screenshots/" +
                    file.replaceAll("/", "-").replace(".html", "") +
                    "-" +
                    theme +
                    "-" +
                    dir +
                    ".png",
                  fullPage: true,
                });
              }
            }
          }
        console.log("Checked " + file);
      }
      await context.close();
    }),
  );
  await browser.close();
  const result = {
    pages: files.length,
    widths,
    themes: ["light", "dark"],
    directions: ["ltr", "rtl"],
    checks,
    failures,
    pageErrors,
    resources,
  };
  fs.writeFileSync(
    "documentation/mobile-tablet-results.json",
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify({
      pages: files.length,
      checks,
      failures: failures.length,
      pageErrors,
      resources,
    }),
  );
  process.exitCode =
    failures.length || pageErrors.length || resources.length ? 1 : 0;
})();
