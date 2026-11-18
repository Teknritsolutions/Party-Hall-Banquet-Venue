let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = playwright;
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const p = await b.newPage({ viewport: { width: 320, height: 900 } });
  for (const file of ["pages/home1.html", "pages/home2.html"]) {
    await p.goto("http://127.0.0.1:4173/" + file);
    console.log(
      file,
      await p.evaluate(() =>
        [...document.querySelectorAll("main *")]
          .filter((e) => e.getBoundingClientRect().right > innerWidth + 2)
          .slice(0, 10)
          .map((e) => ({
            tag: e.tagName,
            cls: e.className,
            text: e.textContent.slice(0, 100),
            width: e.getBoundingClientRect().width,
            right: e.getBoundingClientRect().right,
          })),
      ),
    );
  }
  await b.close();
})();
