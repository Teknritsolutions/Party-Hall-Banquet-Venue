const fs = require("node:fs");
const assert = require("node:assert/strict");
let pw;
try {
  pw = require("playwright");
} catch {
  pw = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = pw;
const publicPages = [
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
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const c = await b.newContext({ reducedMotion: "reduce" });
  const p = await c.newPage();
  const failures = [];
  let checks = 0;
  for (const file of publicPages) {
    await p.goto("http://127.0.0.1:4173/" + file);
    for (const [width, padding] of [
      [1440, 80],
      [820, 64],
      [390, 48],
    ]) {
      await p.setViewportSize({ width, height: 1000 });
      const rows = await p.evaluate(() =>
        [...document.querySelectorAll("main>section,main>form>section")].map((e, i) => {
          const s = getComputedStyle(e);
          return {
            section: i + 1,
            top: parseFloat(s.paddingTop),
            bottom: parseFloat(s.paddingBottom),
            marginTop: s.marginTop,
            marginBottom: s.marginBottom,
          };
        }),
      );
      checks += rows.length;
      for (const row of rows)
        if (
          row.top !== padding ||
          row.bottom !== padding ||
          row.marginTop !== "0px" ||
          row.marginBottom !== "0px"
        )
          failures.push({ file, width, expected: padding, ...row });
    }
  }
  await p.goto("http://127.0.0.1:4173/");
  for (const width of [320, 390, 820, 1440])
    for (const theme of ["light", "dark"])
      for (const dir of ["ltr", "rtl"]) {
        await p.setViewportSize({ width, height: 1000 });
        await p.evaluate(
          ({ theme, dir }) => {
            document.documentElement.dataset.theme = theme;
            document.documentElement.dir = dir;
          },
          { theme, dir },
        );
        const result = await p.locator(".hero-seal").evaluate((e) => {
          const r = e.getBoundingClientRect();
          const style = getComputedStyle(e),
            radius = r.width / 2 - parseFloat(style.borderLeftWidth) - 1;
          const cx = r.left + r.width / 2,
            cy = r.top + r.height / 2;
          const spans = [...e.querySelectorAll("span")].map((s) => {
            const t = s.getBoundingClientRect();
            return {
              text: s.textContent,
              fits:
                Math.max(
                  ...[
                    [t.left, t.top],
                    [t.right, t.top],
                    [t.left, t.bottom],
                    [t.right, t.bottom],
                  ].map(([x, y]) => Math.hypot(x - cx, y - cy)),
                ) <= radius,
            };
          });
          return {
            width: r.width,
            height: r.height,
            insideViewport: r.left >= 0 && r.right <= innerWidth,
            spans,
          };
        });
        checks++;
        if (
          result.width !== result.height ||
          !result.insideViewport ||
          result.spans.some((s) => !s.fits)
        )
          failures.push({ type: "badge", width, theme, dir, ...result });
        if (width === 390 && theme === "light" && dir === "ltr")
          await p.screenshot({ path: "tests/spacing-badge-mobile.png" });
        if (width === 1440 && theme === "light" && dir === "ltr")
          await p.screenshot({ path: "tests/spacing-badge-desktop.png" });
      }
  for (const file of [
    "dashboard/admin/index.html",
    "dashboard/admin/reports.html",
    "dashboard/client/index.html",
    "dashboard/client/new-booking.html",
  ]) {
    await p.goto("http://127.0.0.1:4173/" + file);
    const bad = await p.evaluate(() =>
      [
        ...document.querySelectorAll(
          "#dashboard-view>.dashboard-panel,#dashboard-view>.kpi-grid,#dashboard-view>.event-banner,#dashboard-view>.chart-grid,#dashboard-view>.dashboard-grid",
        ),
      ]
        .filter(
          (e) =>
            e !== e.parentElement.lastElementChild && getComputedStyle(e).marginBottom !== "24px",
        )
        .map((e) => e.className),
    );
    checks++;
    if (bad.length) failures.push({ file, workspace: bad });
  }
  await b.close();
  fs.writeFileSync(
    "documentation/spacing-test-results.json",
    JSON.stringify(
      {
        publicPages: publicPages.length,
        checks,
        spacing: { desktop: 80, tablet: 64, mobile: 48, workspace: 24 },
        failures,
      },
      null,
      2,
    ),
  );
  console.log({ checks, failures });
  assert.equal(failures.length, 0);
})();
