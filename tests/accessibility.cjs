let pw;
try {
  pw = require("playwright");
} catch {
  pw = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = pw;
let axe;
try {
  axe = require("@axe-core/playwright");
} catch {
  axe = require("D:/Hobby & Board Games Store/node_modules/@axe-core/playwright");
}
const AxeBuilder = axe.default;
const fs = require("node:fs");
const files = [
  "pages/home1.html",
  "pages/home2.html",
  ...fs.readdirSync("pages").map((n) => "pages/" + n),
  ...["client", "admin"].flatMap((role) =>
    fs.readdirSync("dashboard/" + role).map((n) => "dashboard/" + role + "/" + n),
  ),
];
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = [];
  const batches = Array.from({ length: 3 }, (_, i) => files.filter((_, n) => n % 3 === i));
  await Promise.all(
    batches.map(async (files) => {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
      });
      const p = await ctx.newPage();
      for (const file of files) {
        await p.goto("http://127.0.0.1:4173/" + file);
        await p.evaluate(() => document.fonts.ready);
        for (const theme of ["light", "dark"]) {
          await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
          const r = await new AxeBuilder({ page: p })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          if (r.violations.length)
            results.push({
              file,
              theme,
              violations: r.violations.map((v) => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                nodes: v.nodes
                  .map((n) => ({ target: n.target, summary: n.failureSummary }))
                  .slice(0, 10),
              })),
            });
        }
        console.log("Axe " + file);
      }
      await p.close();
    }),
  );
  await browser.close();
  fs.writeFileSync(
    "documentation/accessibility-test-results.json",
    JSON.stringify({ pages: files.length, themes: ["light", "dark"], results }, null, 2),
  );
  console.log("Pages with issues: " + results.length);
  process.exitCode = results.length ? 1 : 0;
})();
