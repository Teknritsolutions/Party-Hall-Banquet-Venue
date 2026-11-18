let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require("D:/Hobby & Board Games Store/node_modules/playwright");
}
const { chromium } = playwright;
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const checks = [];
  const go = (file) => page.goto("http://127.0.0.1:4173/" + file);
  const check = (name, condition) => {
    assert(condition, name);
    checks.push(name);
    console.log("PASS " + name);
  };
  await go("pages/home1.html");
  await page.getByRole("button", { name: "Home", exact: true }).click();
  check(
    "Home dropdown opens",
    await page
      .getByRole("link", { name: "Home Page 2", exact: true })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Toggle light and dark theme" })
    .click();
  const theme = await page.locator("html").getAttribute("data-theme");
  await go("pages/about.html");
  check(
    "Theme persists across pages",
    (await page.locator("html").getAttribute("data-theme")) === theme,
  );
  await page
    .getByRole("button", { name: "Toggle right to left layout" })
    .click();
  await go("pages/halls.html");
  check(
    "RTL persists across pages",
    (await page.locator("html").getAttribute("dir")) === "rtl",
  );
  await page.selectOption("#capacity", "500");
  check(
    "Hall capacity filter",
    (await page.locator(".hall-card:visible").count()) === 1,
  );
  await page.getByRole("button", { name: "Reset filters" }).click();
  check(
    "Hall filters reset",
    (await page.locator(".hall-card:visible").count()) === 6,
  );
  await go("pages/gallery.html");
  await page.getByRole("button", { name: "Weddings", exact: true }).click();
  check(
    "Gallery category filtering",
    (await page.locator(".gallery-grid .gallery-tile:visible").count()) === 1,
  );
  await page.locator(".gallery-grid .gallery-tile:visible").click();
  check(
    "Accessible lightbox opens",
    (await page.locator("dialog[open] .lightbox-image").count()) === 1,
  );
  await page.keyboard.press("Escape");
  check(
    "Lightbox closes on Escape",
    (await page.locator("dialog[open]").count()) === 0,
  );
  await go("pages/blog.html");
  await page.fill("#blogSearch", "menu");
  check(
    "Journal search",
    (await page.locator(".blog-card:visible").count()) === 1,
  );
  await page.fill("#blogSearch", "no-such-story");
  check(
    "Journal empty state",
    (await page.locator("[data-blog-status]").innerText()) ===
      "0 stories found.",
  );
  await page.fill("#blogSearch", "");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  check(
    "Journal pagination",
    (await page.locator("[data-blog-page-label]").innerText()) ===
      "Page 2 of 2",
  );
  await go("pages/contact.html");
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  check(
    "Inline required-field validation",
    (await page.locator("[aria-invalid=true]").count()) > 0,
  );
  await page.fill("#fullName", "QA Celebration");
  await page.fill("#email", "qa@example.com");
  await page.fill("#phone", "+1 555 010 2026");
  await page.selectOption("#eventType", "Wedding");
  await page.fill("#date", await page.evaluate(() => GV.plusDays(90)));
  await page.fill("#guests", "120");
  await page.fill("#message", "We would love to arrange a venue visit.");
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  check(
    "Enquiry saves with honest feedback",
    (
      await page.locator("form[data-form=enquiry] .form-result").innerText()
    ).includes("No email was sent"),
  );
  await go("dashboard/admin/messages.html");
  check(
    "Enquiry appears in admin inbox",
    (await page.getByRole("button", { name: /QA Celebration/ }).count()) === 1,
  );
  await page.getByRole("button", { name: /QA Celebration/ }).click();
  await page.fill("#reply", "A thoughtful reply.");
  await page.getByRole("button", { name: "Save reply draft" }).click();
  check(
    "Reply draft persists",
    await page.evaluate(
      () => GV.state.messages[0].draft === "A thoughtful reply.",
    ),
  );
  await go("pages/booking.html?package=1");
  const date = await page.evaluate(() => {
    for (let i = 50; i < 100; i++) {
      let d = GV.plusDays(i);
      if (GV.availability(d, "0") === "Available") return d;
    }
  });
  await page.fill("#eventDate", date);
  await page.selectOption("#timeSlot", "18:00–00:00");
  await page.selectOption("#bookingEvent", "Wedding");
  await page.fill("#guestCount", "150");
  await page.check("input[name=catering]");
  await page.check("input[name=decoration]");
  await page.fill("#customerName", "QA Booking");
  await page.fill("#customerEmail", "booking@example.com");
  await page.fill("#customerPhone", "+1 555 010 2026");
  await page.check("input[name=agreement]");
  check(
    "Booking estimate includes add-ons",
    (await page.locator("[data-booking-summary]").innerText()).includes(
      "$12,800",
    ),
  );
  await page.getByRole("button", { name: "Save booking request" }).click();
  await page.waitForURL("**/booking-confirmation.html?*");
  const bookingId = await page.evaluate(() => GV.state.bookings.at(-1).id);
  check(
    "Booking persists and confirmation renders",
    (await page.locator("[data-confirmation-summary]").innerText()).includes(
      bookingId,
    ),
  );
  await go("dashboard/client/bookings.html");
  await page.fill("#bookingSearch", bookingId);
  check(
    "New booking appears in client dashboard",
    (await page.locator("[data-booking-table] tbody tr").count()) === 1,
  );
  await page.getByRole("button", { name: "Details", exact: true }).click();
  check(
    "Booking detail dialog",
    (await page.locator("dialog[open]").innerText()).includes("$12,800"),
  );
  await page.keyboard.press("Escape");
  await go("dashboard/client/payments.html");
  await page
    .locator(`tr:has-text("${bookingId}")`)
    .getByRole("button", { name: "Record installment" })
    .click();
  await page.getByRole("button", { name: "Save installment record" }).click();
  check(
    "Payment simulation updates shared balance",
    await page.evaluate(
      (id) => GV.state.bookings.find((b) => b.id === id).paid === 3840,
      bookingId,
    ),
  );
  await go("dashboard/client/invoices.html");
  await page.selectOption("#invoiceBooking", bookingId);
  check(
    "Invoice matches payment record",
    (await page.locator("[data-invoice]").innerText()).includes("$3,840"),
  );
  await page.pdf({
    path: "tests/demo-invoice.pdf",
    format: "A4",
    printBackground: true,
  });
  check(
    "Printable invoice PDF created",
    fs.statSync("tests/demo-invoice.pdf").size > 5000,
  );
  await go("dashboard/admin/index.html");
  check(
    "All eight charts initialize",
    await page.evaluate(() => GVCharts.length === 8),
  );
  const metric = await page.evaluate(() => ({
    chart: GVCharts.find((c) => c.canvas.id === "chart-payments").data
      .datasets[0].data[0],
    paid: GV.state.bookings
      .filter((b) => b.status !== "Cancelled")
      .reduce((s, b) => s + b.paid, 0),
  }));
  check("Chart and payment totals agree", metric.chart === metric.paid);
  await page
    .getByRole("button", { name: "Toggle light and dark theme" })
    .click();
  check(
    "Charts redraw for theme",
    await page.evaluate(() => GVCharts.length === 8),
  );
  await go("dashboard/admin/bookings.html");
  await page.fill("#bookingSearch", bookingId);
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await page.selectOption("#newStatus", "Confirmed");
  await page.getByRole("button", { name: "Save status" }).click();
  check(
    "Admin booking status update",
    await page.evaluate(
      (id) => GV.state.bookings.find((b) => b.id === id).status === "Confirmed",
      bookingId,
    ),
  );
  await go("dashboard/admin/halls.html");
  await page.getByRole("button", { name: "Add hall" }).click();
  await page.fill("#editName", "QA Private Hall");
  await page.fill("#editPrice", "2400");
  await page.fill("#editCapacity", "80");
  await page.fill("#editArea", "2000");
  await page.fill("#editAmenities", "Parking and sound");
  await page.getByRole("button", { name: "Save changes" }).click();
  check(
    "Admin add hall form",
    await page.evaluate(() =>
      GV.state.halls.some((h) => h.name === "QA Private Hall"),
    ),
  );
  await go("dashboard/admin/calendar.html");
  const available = page
    .locator("[data-calendar-grid] button:not(.blocked):not(.reserved)")
    .first();
  const selectedDate = await available.getAttribute("data-date");
  await available.click();
  check(
    "Admin blocks a date",
    await page.evaluate(
      (date) => GV.state.blocked.includes("0:" + date),
      selectedDate,
    ),
  );
  await go("dashboard/client/catering.html");
  await page.fill("#addon-0", "10");
  check(
    "Catering quantity estimate",
    (await page.locator("[data-addon-total]").innerText()).includes("$280"),
  );
  await page.getByRole("button", { name: "Save selections" }).click();
  await page.reload();
  check(
    "Catering selections persist",
    (await page.inputValue("#addon-0")) === "10",
  );
  await go("dashboard/client/profile.html");
  await page.fill("#fullName", "QA Profile");
  await page.getByRole("button", { name: "Save profile" }).click();
  check(
    "Editable client profile",
    await page.evaluate(() => GV.state.profile.name === "QA Profile"),
  );
  await go("dashboard/client/notifications.html");
  await page.getByRole("button", { name: "Mark all as read" }).click();
  check(
    "Notification read states",
    await page.evaluate(() => GV.state.notifications.every((n) => n.read)),
  );
  await go("dashboard/admin/reports.html");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const file = await download;
  await file.saveAs("tests/demo-report.csv");
  check(
    "Reports CSV export",
    fs.readFileSync("tests/demo-report.csv", "utf8").includes(bookingId),
  );
  await page.fill("#reportFrom", "2099-01-01");
  check(
    "Reports date filters update charts",
    await page.evaluate(() =>
      GVCharts.find(
        (c) => c.canvas.id === "chart-bookings",
      ).data.datasets[0].data.every((n) => n === 0),
    ),
  );
  await go("pages/register.html");
  await page.fill("#fullName", "Client");
  await page.fill("#email", "client@example.com");
  await page.fill("#phone", "+1 555 010 2026");
  await page.fill("#password", "examplePass123");
  await page.fill("#confirmPassword", "wrongPass123");
  await page.check("[name=terms]");
  await page.getByRole("button", { name: "Create a profile" }).click();
  check(
    "Registration password matching",
    (await page.locator("#confirmPassword").getAttribute("aria-invalid")) ===
      "true",
  );
  await page.fill("#confirmPassword", "examplePass123");
  await page.getByRole("button", { name: "Create a profile" }).click();
  await page.waitForURL("**/dashboard/client/index.html");
  check(
    "registration stores no password",
    !JSON.stringify(await page.evaluate(() => GV.state)).includes(
      "examplePass123",
    ),
  );
  await go("pages/login.html");
  await page.getByRole("button", { name: "Show password" }).click();
  check(
    "Password visibility toggle",
    (await page.locator("#password").getAttribute("type")) === "text",
  );
  await page.evaluate(() => localStorage.setItem("gv-demo-v1", "{broken"));
  await page.reload();
  check(
    "Corrupt localStorage recovers safely",
    await page.evaluate(() => GV.state.bookings.length === 24),
  );
  await page.setViewportSize({ width: 320, height: 800 });
  await go("pages/home1.html");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Home", exact: true }).click();
  check(
    "Mobile Home dropdown works",
    await page
      .getByRole("link", { name: "Home Page 2", exact: true })
      .isVisible(),
  );
  await go("dashboard/client/index.html");
  await page
    .getByRole("button", { name: "Toggle dashboard navigation" })
    .click();
  check(
    "Mobile dashboard sidebar opens",
    await page.locator(".sidebar").isVisible(),
  );
  await page.keyboard.press("Escape");
  check(
    "Mobile sidebar closes on Escape",
    !(await page.locator(".sidebar").isVisible()),
  );
  check("No JavaScript errors", errors.length === 0);
  await browser.close();
  fs.writeFileSync(
    "documentation/workflow-test-results.json",
    JSON.stringify({ checks, errors, total: checks.length }, null, 2),
  );
  console.log(checks.length + " workflow assertions passed.");
})();
