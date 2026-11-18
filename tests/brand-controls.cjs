const { chromium } = require("D:/Hobby & Board Games Store/node_modules/playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const c = await b.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: "light" });
  const p = await c.newPage();
  const checks = [];
  await p.goto("http://127.0.0.1:4173/");
  for (const width of [320, 390, 1280, 1366, 1440, 1884, 1920]) {
    await p.setViewportSize({ width, height: 900 });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => {
      const nav = [
        ...document.querySelectorAll(".public-nav>.nav-link,.public-nav>.nav-dropdown>button"),
      ]
        .filter((e) => e.getClientRects().length)
        .map((e) => e.getBoundingClientRect().toJSON());
      return {
        scroll: document.documentElement.scrollWidth,
        name: getComputedStyle(document.querySelector(".brand-name")).fontSize,
        gaps: nav.slice(1).map((e, i) => e.left - nav[i].right),
        overlaps: nav.some((e, i) => i && e.left < nav[i - 1].right),
        brand: document.querySelector(".site-header .brand").getBoundingClientRect().toJSON(),
        actions: document.querySelector(".header-actions").getBoundingClientRect().toJSON(),
        nav,
      };
    });
    assert(r.scroll <= width + 1);
    assert(!r.overlaps);
    if (width >= 1280) {
      assert(r.gaps.every((n) => n >= 19));
      assert(r.nav[0].left >= r.brand.right + 8);
      assert(r.nav.at(-1).right <= r.actions.left - 8);
    }
    checks.push({ width, ...r });
  }
  await p.setViewportSize({ width: 1884, height: 1000 });
  const theme = p.locator(".header-utilities [data-theme-toggle]");
  assert(await theme.locator(".theme-glyph-moon").isVisible());
  assert(!(await theme.locator(".theme-glyph-sun").isVisible()));
  await p.screenshot({ path: "tests/header-brand-light.png" });
  await theme.click();
  assert(await theme.locator(".theme-glyph-sun").isVisible());
  assert(!(await theme.locator(".theme-glyph-moon").isVisible()));
  assert.equal(await theme.getAttribute("aria-pressed"), "true");
  await p.waitForTimeout(300);
  await p.screenshot({ path: "tests/header-brand-dark.png" });
  await p.reload();
  assert(await p.locator(".header-utilities .theme-glyph-sun").isVisible());
  const rtl = p.locator(".header-utilities [data-rtl-toggle]");
  await rtl.click();
  assert.equal(await rtl.getAttribute("aria-pressed"), "true");
  assert.equal(await rtl.locator("[data-direction-label]").innerText(), "LTR");
  await p.setViewportSize({ width: 320, height: 844 });
  await p.screenshot({ path: "tests/header-brand-mobile-rtl.png" });
  await b.close();
  fs.writeFileSync(
    "documentation/brand-controls-test-results.json",
    JSON.stringify(
      {
        checks,
        theme: "Moon in light mode; sun in dark mode; preference persists",
        rtl: "Styled icon/text control toggles direction and pressed state",
      },
      null,
      2,
    ),
  );
  console.log("Brand visibility, navigation gaps, theme icons and RTL controls passed.");
})();
