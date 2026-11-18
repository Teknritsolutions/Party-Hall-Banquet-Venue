const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
const assert = require("assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const p = await b.newPage({ reducedMotion: "reduce" });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  let checks = 0;
  for (const file of [
    "dashboard/client/new-booking.html",
    "dashboard/client/profile.html",
    "dashboard/client/settings.html",
    "dashboard/admin/settings.html",
    "pages/booking.html",
  ]) {
    for (const width of [1440, 820, 390, 320]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto("http://127.0.0.1:4173/" + file);
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )),
        file + " overflow " + width,
      );
      if (file.includes("booking")) {
        assert.equal(await p.locator(".choice-capacity").count(), 6);
        const card = await p.locator(".choice-card").first().innerText();
        assert(card.includes("500 guests"));
        assert(card.includes("From $6,500"));
        await p.locator("#timeSlot").selectOption({ index: 1 });
        assert(await p.locator("#timeSlot").inputValue());
        await p.locator('input[name=hall][value="1"]').check();
        assert.equal(
          await p.locator("input[name=hall]:checked").inputValue(),
          "1",
        );
        if (file.startsWith("dashboard")) {
          const gap = await p
            .locator("#booking-form")
            .evaluate((e) => getComputedStyle(e).gap);
          assert.equal(gap, "24px");
        }
      }
      if (file.includes("profile")) {
        const positions = await p
          .locator("[data-profile-form]")
          .evaluate((f) => ({
            input: f.querySelector("input").getBoundingClientRect().x,
            button: f
              .querySelector('[data-action="save-profile"]')
              .getBoundingClientRect().x,
          }));
        assert(Math.abs(positions.input - positions.button) < 2);
      }
      if (width === 1440 || width === 390)
        await p.screenshot({
          path:
            "tests/screenshots/reviews/" +
            file.replaceAll("/", "-").replace(".html", "") +
            "-forms-" +
            width +
            ".png",
          fullPage: true,
        });
      checks++;
    }
  }
  await p.goto("http://127.0.0.1:4173/dashboard/client/profile.html");
  await p.locator("#fullName").fill("Olivia Test");
  await p.getByRole("button", { name: "Save profile", exact: true }).click();
  assert.equal(await p.locator(".profile-card h3").innerText(), "Olivia Test");
  await p.reload();
  assert.equal(await p.locator("#fullName").inputValue(), "Olivia Test");
  await p.goto("http://127.0.0.1:4173/dashboard/client/new-booking.html");
  await p.locator("#timeSlot").click();
  await p.screenshot({
    path: "tests/screenshots/reviews/dashboard-time-slot-open.png",
  });
  await p.keyboard.press("Escape");
  assert.deepEqual(errors, []);
  console.log(
    checks +
      " form layout checks passed; hall selection, time slots and profile persistence passed; no browser errors.",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
