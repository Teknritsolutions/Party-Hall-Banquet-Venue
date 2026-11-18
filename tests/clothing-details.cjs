const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
const fs = require("node:fs");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await c.newPage();
  const base =
    "https://teknritsolutions.github.io/Baby-kids-clothing-store/pages/";
  const result = { pages: [], behavior: {} };
  for (const file of [
    "Homepage1.html",
    "about.html",
    "shop.html",
    "contact.html",
  ]) {
    try {
      await p.goto(base + file, { waitUntil: "networkidle", timeout: 45000 });
      await p.evaluate(() => document.fonts.ready);
      const sizes = await p.evaluate(() => {
        const nodes = [
          ...document.querySelectorAll(
            "h1,h2,h3,h4,p,small,label,input,button,.header-cta,.btn,footer a",
          ),
        ].filter((e) => {
          const s = getComputedStyle(e);
          return (
            e.getClientRects().length &&
            s.visibility !== "hidden" &&
            s.opacity !== "0"
          );
        });
        const seen = new Set();
        return nodes
          .map((e) => {
            const s = getComputedStyle(e);
            return {
              tag: e.tagName,
              cls: e.className,
              size: s.fontSize,
              line: s.lineHeight,
              weight: s.fontWeight,
              text: e.textContent.trim().slice(0, 65),
            };
          })
          .filter((v) => {
            const key = v.tag + v.cls + v.size;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, 35);
      });
      result.pages.push({ file, sizes });
    } catch (e) {
      result.pages.push({ file, error: e.message.slice(0, 100) });
    }
  }
  await p.goto(base + "Homepage1.html", { waitUntil: "networkidle" });
  const home = p.locator(".dropdown-trigger");
  await home.hover();
  await p.waitForTimeout(300);
  result.behavior.hover = await home.getAttribute("aria-expanded");
  await p.screenshot({ path: "tests/clothing-reference-dropdown.png" });
  await p.mouse.move(10, 500);
  await p.waitForTimeout(400);
  result.behavior.leave = await home.getAttribute("aria-expanded");
  await home.click();
  await p.waitForTimeout(200);
  result.behavior.click = await home.getAttribute("aria-expanded");
  await p.keyboard.press("Escape");
  result.behavior.escape = await home.getAttribute("aria-expanded");
  await p.evaluate(() => scrollTo(0, 600));
  result.behavior.scroll = await p
    .locator(".site-header")
    .evaluate((e) => ({
      top: e.getBoundingClientRect().top,
      position: getComputedStyle(e).position,
    }));
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.screenshot({ path: "tests/clothing-reference-mobile.png" });
  await p.getByRole("button", { name: "Open navigation" }).click();
  await p.waitForTimeout(300);
  result.behavior.mobileMenu = await p
    .locator(".primary-nav")
    .evaluate((e) => ({
      rect: e.getBoundingClientRect().toJSON(),
      position: getComputedStyle(e).position,
      opacity: getComputedStyle(e).opacity,
    }));
  await p.screenshot({ path: "tests/clothing-reference-mobile-open.png" });
  fs.writeFileSync(
    "documentation/clothing-reference-details.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
  await b.close();
})();
