const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(
    "https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html",
    { waitUntil: "networkidle" },
  );
  console.log(
    JSON.stringify(
      await p
        .locator("a")
        .evaluateAll((a) =>
          a
            .filter((e) =>
              /dashboard|admin|client/i.test(e.textContent + e.href),
            )
            .map((e) => ({ text: e.textContent.trim(), url: e.href })),
        ),
    ),
  );
  for (const name of ["userdashboard", "admindashboard"]) {
    await p.goto(
      "https://teknrit-maker.github.io/High-End-Event-Planning/pages/" +
        name +
        ".html",
      { waitUntil: "networkidle" },
    );
    console.log(
      name + ": " + (await p.locator("body").innerText()).slice(0, 8500),
    );
    await p.screenshot({
      path: "tests/screenshots/reviews/reference-" + name + ".png",
      fullPage: true,
    });
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
