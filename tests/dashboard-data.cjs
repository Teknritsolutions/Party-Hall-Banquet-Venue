const {
  chromium,
} = require("D:/Hobby & Board Games Store/node_modules/playwright");
const assert = require("assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const p = await b.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  for (const role of ["admin", "client"]) {
    await p.goto("http://127.0.0.1:4173/dashboard/" + role + "/payments.html");
    const m = await p.evaluate(() => {
      const records = (
        document.querySelector(".dashboard-shell").dataset.role === "admin"
          ? GV.state.bookings
          : GV.clientBookings()
      ).filter((b) => b.status !== "Cancelled");
      return {
        chart: GVCharts.find(
          (c) => c.canvas.id === "chart-payments",
        ).data.datasets.map((d) => d.data[0]),
        paid: records.reduce((s, b) => s + b.paid, 0),
        due: records.reduce((s, b) => s + b.total - b.paid, 0),
      };
    });
    assert.deepEqual(m.chart, [m.paid, m.due]);
    await p.goto("http://127.0.0.1:4173/dashboard/" + role + "/bookings.html");
    await p.locator("#bookingStatus").selectOption("Pending");
    const get = () =>
      p.evaluate(
        () =>
          GVCharts.find((c) => c.canvas.id === "chart-statuses").data
            .datasets[0].data,
      );
    const before = await get();
    await p.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
      document.dispatchEvent(new Event("themechange"));
    });
    assert.deepEqual(await get(), before);
    await p.goto("http://127.0.0.1:4173/dashboard/" + role + "/index.html");
    assert.equal(
      await p.locator(".sidebar img").getAttribute("src"),
      "../../assets/images/logo-light.svg",
    );
  }
  assert.deepEqual(errors, []);
  console.log(
    "Client/admin payment charts match balances; booking filters persist through theme changes; no browser errors.",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
