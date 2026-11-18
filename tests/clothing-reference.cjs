const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const base =
    "https://teknritsolutions.github.io/Baby-kids-clothing-store/pages/Homepage1.html";
  await page.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await page.screenshot({ path: "tests/clothing-reference-desktop.png" });
  const inspect = () =>
    page.evaluate(() => {
      const visible = (e) => e.getClientRects().length;
      const font = (e) => {
        let s = getComputedStyle(e);
        return {
          tag: e.tagName,
          class: e.className,
          text: e.innerText?.trim().slice(0, 95),
          size: s.fontSize,
          weight: s.fontWeight,
          line: s.lineHeight,
          family: s.fontFamily,
          rect: e.getBoundingClientRect().toJSON(),
        };
      };
      return {
        title: document.title,
        headers: [...document.querySelectorAll("header")]
          .filter(visible)
          .slice(0, 2)
          .map(font),
        type: [
          ...document.querySelectorAll(
            "h1,h2,h3,p,label,button,nav a,nav summary",
          ),
        ]
          .filter(visible)
          .slice(0, 90)
          .map(font),
        links: [...document.querySelectorAll("a")]
          .filter(visible)
          .map((e) => ({ text: e.innerText, url: e.href }))
          .filter((e) => e.text.trim()),
      };
    });
  const data = { desktop: await inspect() };
  console.log(JSON.stringify(data.desktop, null, 2));
  const nav = page.locator("header").first();
  console.log("HEADER HTML", await nav.innerHTML());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "tests/clothing-reference-mobile.png" });
  data.mobile = await inspect();
  fs.writeFileSync(
    "documentation/clothing-reference-measurements.json",
    JSON.stringify(data, null, 2),
  );
  await browser.close();
})();
