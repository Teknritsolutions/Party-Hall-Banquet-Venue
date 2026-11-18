const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
const fs = require("fs"),
  assert = require("assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const p = await b.newPage({ reducedMotion: "reduce" });
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  let checks = 0;
  for (const role of ["admin", "client"]) {
    for (const name of fs
      .readdirSync("dashboard/" + role)
      .filter((n) => n.endsWith(".html"))) {
      for (const width of [1440, 820, 390, 320]) {
        await p.setViewportSize({ width, height: 1000 });
        await p.goto("http://127.0.0.1:4173/dashboard/" + role + "/" + name);
        await p.waitForTimeout(100);
        assert(
          await p.locator("#dashboard-view").innerText(),
          role + "/" + name + " empty",
        );
        const overflow = await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        assert(!overflow, role + "/" + name + " overflow " + width);
        if (width === 820) {
          assert.equal(await p.locator(".sidebar").isVisible(), false);
          await p.locator("[data-sidebar-toggle]").click();
          assert.equal(await p.locator(".sidebar").isVisible(), true);
          await p
            .getByRole("button", { name: "Close dashboard navigation" })
            .click();
          assert.equal(await p.locator(".sidebar").isVisible(), false);
        }
        if (name === "index.html") {
          assert.equal(
            await p.locator("canvas").count(),
            role === "admin" ? 8 : 4,
          );
          assert.equal(await p.locator(".booking-flow li").count(), 4);
          const data = await p.evaluate(() => ({
            charts: GVCharts.length,
            records: GV.state.bookings.length,
            values: GVCharts.find((c) => c.canvas.id === "chart-statuses").data
              .datasets[0].data,
            total: (document.querySelector(".dashboard-shell").dataset.role ===
            "admin"
              ? GV.state.bookings
              : GV.clientBookings()
            ).length,
          }));
          assert.equal(data.charts, role === "admin" ? 8 : 4);
          assert.equal(
            data.values.reduce((a, b) => a + b, 0),
            data.total,
          );
          await p.screenshot({
            path:
              "tests/screenshots/reviews/dashboard-" +
              role +
              "-" +
              width +
              ".png",
            fullPage: true,
          });
        }
        checks++;
      }
    }
  }
  await p.goto("http://127.0.0.1:4173/dashboard/admin/bookings.html");
  await p.locator("#bookingStatus").selectOption("Pending");
  await p.waitForTimeout(100);
  assert.equal(
    await p.evaluate(
      () =>
        GVCharts.find((c) => c.canvas.id === "chart-statuses").data.datasets[0]
          .data[1],
    ),
    await p.evaluate(
      () => GV.state.bookings.filter((b) => b.status === "Pending").length,
    ),
  );
  for (const role of ["admin", "client"]) {
    await p.goto("http://127.0.0.1:4173/dashboard/" + role + "/index.html");
    await p.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.dir = "rtl";
      document.dispatchEvent(new Event("themechange"));
      document.dispatchEvent(new Event("directionchange"));
    });
    await p.waitForTimeout(100);
    assert(
      !(await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )),
    );
    await p.screenshot({
      path: "tests/screenshots/reviews/dashboard-" + role + "-dark-rtl.png",
      fullPage: true,
    });
  }
  await p.goto("http://127.0.0.1:4173/dashboard/admin/reports.html");
  await p.locator("#reportFrom").fill("2099-01-01");
  await p.waitForTimeout(100);
  assert(
    await p.evaluate(() =>
      GVCharts.every((c) =>
        c.data.datasets.every((d) => d.data.every((v) => v === 0)),
      ),
    ),
  );
  assert.equal(await p.locator(".chart-empty:visible").count(), 8);
  await p.locator("#reportFrom").fill("");
  await p.waitForTimeout(100);
  assert.equal(await p.evaluate(() => GVCharts.length), 8);
  assert.deepEqual(errors, []);
  console.log(
    checks +
      " dashboard page/viewport checks passed; chart counts, status totals, filters and dark RTL passed.",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
