let pw;
try {
  pw = require("playwright");
} catch {
  pw = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
let axe;
try {
  axe = require("@axe-core/playwright");
} catch {
  axe = require("D:/Hobby & Board Games Store/node_modules/@axe-core/playwright");
}
const fs = require("node:fs");
(async () => {
  const browser = await pw.chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];
  let checks = 0;
  for (const theme of ["light", "dark"])
    for (const dir of ["ltr", "rtl"])
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto("http://127.0.0.1:4173/");
        await page.evaluate(
          ({ theme, dir }) => {
            document.documentElement.dataset.theme = theme;
            document.documentElement.dir = dir;
          },
          { theme, dir },
        );
        if (width < 1280)
          await page.getByRole("button", { name: "Open navigation" }).click();
        await page
          .getByRole("button", { name: "Dashboard", exact: true })
          .click();
        const audit = await new axe.default({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        checks++;
        if (audit.violations.length)
          results.push({
            theme,
            dir,
            width,
            violations: audit.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => ({
                target: n.target,
                summary: n.failureSummary,
              })),
            })),
          });
      }
  await browser.close();
  fs.writeFileSync(
    "documentation/header-accessibility-results.json",
    JSON.stringify({ checks, results }, null, 2),
  );
  console.log({ checks, results });
  process.exitCode = results.length ? 1 : 0;
})();
