let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = playwright;
const fs = require("node:fs");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });
  const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await c.newPage();
  const checks = [];
  const check = (name, condition) => {
    assert(condition, name);
    checks.push(name);
    console.log("PASS " + name);
  };
  const go = (file) => p.goto("http://127.0.0.1:4173/" + file);
  await go("pages/booking.html");
  const reserved = await p.evaluate(() => {
    for (let i = 10; i < 60; i++) {
      const d = GV.plusDays(i);
      if (GV.availability(d, "0") === "Reserved") return d;
    }
  });
  await p.fill("#eventDate", reserved);
  await p.selectOption("#timeSlot", "11:00–17:00");
  await p.selectOption("#bookingEvent", "Wedding");
  await p.fill("#guestCount", "100");
  await p.selectOption("#package", { index: 1 });
  await p.fill("#customerName", "Validation Test");
  await p.fill("#customerEmail", "validation@example.com");
  await p.fill("#customerPhone", "+1 555 010 2026");
  await p.check("[name=agreement]");
  await p.getByRole("button", { name: "Save booking request" }).click();
  check(
    "Reserved date is rejected",
    (await p.locator("#eventDate-error").innerText()).includes(
      "available date",
    ),
  );
  const available = await p.evaluate(() => {
    for (let i = 60; i < 100; i++) {
      let d = GV.plusDays(i);
      if (GV.availability(d, "0") === "Available") return d;
    }
  });
  await p.fill("#eventDate", available);
  await p.fill("#guestCount", "501");
  await p.getByRole("button", { name: "Save booking request" }).click();
  check(
    "Hall capacity limit enforced",
    (await p.locator("#guestCount-error").innerText()).includes("500"),
  );
  await p.fill("#guestCount", "100");
  await p.fill("#eventDate", "2020-01-01");
  await p.getByRole("button", { name: "Save booking request" }).click();
  check(
    "Past event dates rejected",
    (await p.locator("#eventDate").getAttribute("aria-invalid")) === "true",
  );
  await go("dashboard/client/new-booking.html");
  check(
    "Client embeds complete booking workflow",
    (await p.locator("#booking-form .dashboard-panel").count()) === 5,
  );
  const title = await p.locator("[data-month-title]").innerText();
  await p.locator('[data-month="1"]').click();
  const next = await p.locator("[data-month-title]").innerText();
  await p.check('[name=hall][value="1"]');
  await p.locator('[data-month="-1"]').click();
  check(
    "Hall change does not duplicate calendar navigation",
    (await p.locator("[data-month-title]").innerText()) === title &&
      next !== title,
  );
  await go("dashboard/admin/packages.html");
  await p.getByRole("button", { name: "Edit", exact: true }).nth(1).click();
  await p.fill("#editPrice", "10200");
  await p.getByRole("button", { name: "Save changes" }).click();
  await go("pages/booking.html?package=1");
  check(
    "Edited package price reaches booking options",
    (await p.locator("#package").innerText()).includes("$10,200"),
  );
  check(
    "Edited package price reaches estimates",
    (await p.locator("[data-booking-summary]").innerText()).includes("$10,200"),
  );
  await go("dashboard/admin/decorations.html");
  await p.getByRole("button", { name: "Edit", exact: true }).first().click();
  await p.fill("#editPrice", "1300");
  await p.getByRole("button", { name: "Save changes" }).click();
  await go("dashboard/client/decorations.html");
  await p.fill("#addon-0", "2");
  check(
    "Edited decoration prices reach client estimates",
    (await p.locator("[data-addon-total]").innerText()).includes("$2,600"),
  );
  await go("dashboard/client/settings.html");
  await p.selectOption("#displayTheme", "dark");
  await p.selectOption("#displayDirection", "rtl");
  await p.getByRole("button", { name: "Save preferences" }).click();
  await p.reload();
  check(
    "Settings save theme and direction",
    (await p.locator("html").getAttribute("data-theme")) === "dark" &&
      (await p.locator("html").getAttribute("dir")) === "rtl",
  );
  await go("pages/forgot-password.html");
  await p.fill("#email", "reset@example.com");
  await p.getByRole("button", { name: "Request password reset" }).click();
  check(
    "Forgot-password feedback is explicit about no email",
    (await p.locator(".form-result").first().innerText()).includes(
      "No email was sent",
    ),
  );
  await go("pages/blog-details.html?article=1");
  check(
    "Journal article links select distinct content",
    (await p.locator("h1").innerText()).includes("menu your guests"),
  );
  await p.fill("#commentName", "Reader");
  await p.fill("#commentEmail", "reader@example.com");
  await p.fill("#comment", "A thoughtful celebration planning question.");
  await p.getByRole("button", { name: "Post comment" }).click();
  await p.reload();
  check(
    "Comments persist locally",
    (await p.locator("[data-comments]").innerText()).includes(
      "A thoughtful celebration planning question.",
    ),
  );
  await p.fill("#newsletterEmail", "newsletter@example.com");
  await p.getByRole("button", { name: "Subscribe", exact: true }).click();
  check(
    "Newsletter stores a request without sending",
    (await p.locator("footer .form-result").innerText()).includes(
      "No subscription email was sent",
    ),
  );
  await go("dashboard/admin/index.html");
  const canvas = p.locator("#chart-revenue");
  await canvas.hover({ position: { x: 100, y: 100 } });
  check(
    "Chart tooltip system configured",
    await p.evaluate(() =>
      GVCharts.every((c) => c.options.plugins.tooltip.enabled !== false),
    ),
  );
  await go("dashboard/client/settings.html");
  await p.getByRole("button", { name: "Reset local data" }).click();
  await p
    .getByRole("dialog")
    .getByRole("button", { name: "Reset local data", exact: true })
    .click();
  check(
    "reset restores package defaults",
    await p.evaluate(
      () =>
        GV.state.packages[1].price === 9800 && GV.state.comments.length === 0,
    ),
  );
  await b.close();
  fs.writeFileSync(
    "documentation/edge-test-results.json",
    JSON.stringify({ checks, total: checks.length }, null, 2),
  );
  console.log(checks.length + " edge checks passed.");
})();
