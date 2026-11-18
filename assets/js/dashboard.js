/* Dashboard screens share one validated demo store. */
(() => {
  const shell = document.querySelector(".dashboard-shell");
  if (!shell) return;
  const { $, $$, root, toast, modal, icons } = UI;
  const { money, escape: esc } = GV;
  const role = shell.dataset.role,
    screen = shell.dataset.screen,
    admin = role === "admin",
    view = $("#dashboard-view");
  let charts = [];
  const sidebarClose = document.createElement("button");
  sidebarClose.type = "button";
  sidebarClose.className = "icon-btn sidebar-close";
  sidebarClose.setAttribute("aria-label", "Close dashboard navigation");
  sidebarClose.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>';
  document.querySelector(".sidebar").prepend(sidebarClose);
  sidebarClose.addEventListener("click", () => {
    document.querySelector(".sidebar").classList.remove("mobile-open");
    const toggle = document.querySelector("[data-sidebar-toggle]");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });

  const pill = (text) =>
    `<span class="status-pill ${esc(text.toLowerCase())}">${esc(text)}</span>`;
  const button = (text, action, id = "", secondary = true) =>
    `<button class="btn ${secondary ? "btn-secondary" : "btn-primary"}" data-action="${action}" data-id="${esc(id)}">${text}</button>`;
  const select = (id, title, values) =>
    `<div class="field"><label for="${id}">${title}</label><select id="${id}"><option value="">All ${title.toLowerCase()}</option>${values.map((v) => `<option>${esc(v)}</option>`).join("")}</select></div>`;
  const input = (id, title, type = "text", value = "", required = false) =>
    `<div class="field"><label for="${id}">${title}</label><input id="${id}" name="${id}" type="${type}" value="${esc(value)}" placeholder="Enter ${title.toLowerCase()}" ${required ? "required" : ""} ${type === "number" ? 'min="0"' : ""}></div>`;
  const panel = (title, body) =>
    `<section class="dashboard-panel"><h2>${title}</h2>${body}</section>`;
  const table = (headers, rows, caption) =>
    `<div class="table-wrap"><table><caption>${caption}</caption><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">No matching records. Adjust the filters.</td></tr>`}</tbody></table></div>`;
  const kpis = (items) =>
    `<div class="kpi-grid">${items.map(([title, value, note, ico]) => `<article class="kpi-card"><div><p>${title}</p><strong>${value}</strong><small>${note}</small></div><i data-lucide="${ico}" aria-hidden="true"></i></article>`).join("")}</div>`;
  const list = () => (admin ? GV.state.bookings : GV.clientBookings());
  const hallName = (id) =>
    GV.state.halls.find((h) => h.id === id)?.name || "Archived hall";
  const packageName = (id) =>
    GV.state.packages.find((p) => p.id === id)?.name || "Archived package";
  const active = (bookings) => bookings.filter((b) => b.status !== "Cancelled");
  const total = (bookings, key) => bookings.reduce((sum, b) => sum + b[key], 0);
  function overview() {
    const bookings = list(),
      valid = active(bookings);
    const value = total(valid, "total"),
      paid = total(valid, "paid");
    const next = valid
      .filter((b) => b.date >= GV.iso(new Date()) && b.paid < b.total)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    const nextDue = next
      ? next.paid === 0
        ? next.created
        : dueDate(next.date, next.paid < next.total * 0.7 ? 30 : 7)
      : "No installment due";
    const nextAmount = next
      ? Math.min(
          next.total - next.paid,
          Math.round(next.total * (next.paid === 0 ? 0.3 : 0.4)),
        )
      : 0;
    const monthBookings = valid.filter(
      (b) => b.date.slice(0, 7) === GV.iso(new Date()).slice(0, 7),
    );
    const items = admin
      ? [
          [
            "Total bookings",
            bookings.length,
            "All reservations",
            "calendar-check",
          ],
          [
            "Monthly revenue",
            money(total(monthBookings, "paid")),
            "Payments allocated to event month",
            "wallet",
          ],
          [
            "Pending bookings",
            bookings.filter((b) => b.status === "Pending").length,
            "Awaiting review",
            "clock",
          ],
          [
            "Available halls",
            GV.state.halls.filter((h) => h.enabled).length,
            "Active event spaces",
            "landmark",
          ],
          [
            "Active clients",
            new Set(valid.map((b) => b.email)).size,
            "Unique clients with active records",
            "users",
          ],
          [
            "Outstanding payments",
            money(value - paid),
            "Total value less paid installments",
            "credit-card",
          ],
        ]
      : [
          [
            "Active bookings",
            valid.filter((b) => b.status !== "Completed").length,
            "Your upcoming celebrations",
            "calendar-check",
          ],
          [
            "Total booking value",
            money(value),
            "Non-cancelled reservations",
            "wallet",
          ],
          ["Amount paid", money(paid), "Installment records", "credit-card"],
          [
            "Remaining balance",
            money(value - paid),
            "Across all active bookings",
            "receipt",
          ],
          [
            "Next installment",
            money(nextAmount),
            "Due " + nextDue + "",
            "calendar-days",
          ],
          [
            "Event countdown",
            Math.max(
              0,
              Math.ceil(
                (new Date(
                  valid.find((b) => b.date >= GV.iso(new Date()))?.date ||
                    GV.plusDays(0),
                ) -
                  new Date()) /
                  86400000,
              ),
            ) + " days",
            "Until your next celebration",
            "heart",
          ],
        ];
    const upcoming = valid
      .filter((b) => b.date >= GV.iso(new Date()))
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    view.innerHTML =
      kpis(items) +
      (upcoming
        ? `<section class="event-banner"><div><p>${admin ? "NEXT ON THE CALENDAR" : "YOUR UPCOMING CELEBRATION"}</p><h2>${esc(upcoming.event)} at ${esc(hallName(upcoming.hall))}</h2><p>${esc(upcoming.date)} &nbsp; / &nbsp; ${upcoming.guests} guests &nbsp; / &nbsp; ${esc(upcoming.status)}</p></div><a class="btn btn-secondary" href="bookings.html">View the details</a></section>`
        : "") +
      workflowMarkup(bookings) +
      (admin
        ? chartMarkup()
        : `<div class="dashboard-grid">${panel("Your planning journey", `<ul class="check-list"><li>Find the space you love</li><li>Review your celebration package</li><li>Choose catering and decoration enhancements</li><li>Review your installment schedule</li></ul><div class="actions"><a class="btn btn-primary" href="new-booking.html">New booking</a><a class="btn btn-secondary" href="payments.html">View installments</a></div>`)}${panel(
            "Recent activity",
            GV.state.notifications
              .slice(0, 3)
              .map(
                (n) =>
                  `<div class="notification-item"><div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p></div></div>`,
              )
              .join(""),
          )}</div>`) +
      (!admin
        ? chartMarkup(["revenue", "bookings", "statuses", "payments"])
        : "") +
      panel("Recent reservations", bookingTable(bookings.slice(-5)));
    renderCharts(bookings);
  }
  function workflowMarkup(bookings) {
    const valid = active(bookings);
    const steps = [
      [
        "Review",
        bookings.filter((b) => b.status === "Pending").length,
        "Awaiting confirmation",
        "clipboard-list",
        "bookings.html",
      ],
      [
        "Confirm",
        bookings.filter((b) => b.status === "Confirmed").length,
        "Confirmed reservations",
        "calendar-check",
        "bookings.html",
      ],
      [
        "Settle",
        valid.filter((b) => b.paid >= b.total).length,
        "Fully paid reservations",
        "credit-card",
        "payments.html",
      ],
      [
        "Celebrate",
        bookings.filter((b) => b.status === "Completed").length,
        "Completed celebrations",
        "party-popper",
        "bookings.html",
      ],
    ];
    return (
      '<section class="dashboard-panel workflow-panel"><div class="dashboard-section-heading"><div><p class="dashboard-kicker">FROM FIRST ENQUIRY TO EVENT DAY</p><h2>Booking workflow</h2></div><span class="dashboard-section-note">Current records at each milestone</span></div><ol class="booking-flow">' +
      steps
        .map(
          ([title, count, note, icon, url], i) =>
            '<li><a href="' +
            url +
            '"><span class="flow-step-number">0' +
            (i + 1) +
            '</span><i data-lucide="' +
            icon +
            '" aria-hidden="true"></i><h3>' +
            title +
            "</h3><strong>" +
            count +
            "</strong><span>" +
            note +
            "</span></a></li>",
        )
        .join("") +
      "</ol></section>"
    );
  }
  function chartMarkup(ids) {
    const definitions = [
      [
        "revenue",
        admin ? "Revenue over time" : "Your payments over time",
        "Paid value by event month",
        "trending-up",
      ],
      [
        "bookings",
        "Reservation activity",
        "Bookings by event month",
        "calendar-days",
      ],
      [
        "categories",
        "Celebration mix",
        "Reservations by event type",
        "party-popper",
      ],
      [
        "statuses",
        "Reservation status",
        "All reservation records",
        "circle-check",
      ],
      ["payments", "Paid & outstanding", "Active reservations only", "wallet"],
      ["halls", "Hall popularity", "Active reservations per space", "landmark"],
      [
        "packages",
        "Package selection",
        "Active reservations per package",
        "package",
      ],
      ["guests", "Guest volume", "Expected guests by event month", "users"],
    ].filter(([id]) => !ids || ids.includes(id));
    return (
      '<section class="dashboard-analytics"><div class="dashboard-section-heading"><div><p class="dashboard-kicker">ANALYTICS</p><h2>' +
      (admin ? "Your venue, in numbers" : "Your celebrations, in perspective") +
      '</h2></div><span class="dashboard-section-note">Based on ' +
      (admin ? "venue" : "your") +
      ' reservation records</span></div><div class="chart-grid">' +
      definitions
        .map(
          ([id, title, note, icon]) =>
            '<section class="chart-panel"><div class="chart-panel-heading"><div><h3>' +
            title +
            "</h3><p>" +
            note +
            '</p></div><span class="chart-icon"><i data-lucide="' +
            icon +
            '" aria-hidden="true"></i></span></div><div class="chart-container"><canvas id="chart-' +
            id +
            '" role="img" aria-label="' +
            title +
            "; " +
            note +
            '.">See reservation and payment tables for individual records.</canvas></div><p class="chart-empty" data-empty-chart="' +
            id +
            '" hidden>No matching reservation data yet.</p></section>',
        )
        .join("") +
      "</div></section>"
    );
  }
  function renderCharts(bookings) {
    charts.forEach((c) => c.destroy());
    charts = [];
    if (!window.Chart) {
      toast(
        "Chart library could not load. See the data tables for the same records.",
      );
      return;
    }
    const css = getComputedStyle(document.documentElement),
      text = css.getPropertyValue("--color-text-muted").trim(),
      border = css.getPropertyValue("--color-border").trim();
    Chart.defaults.color = text;
    Chart.defaults.font.family = "Inter, Arial, sans-serif";
    const colors =
      document.documentElement.dataset.theme === "dark"
        ? ["#d29eaf", "#c4a06a", "#aa8b96", "#b7aba7", "#8e8188"]
        : ["#641c35", "#9b743c", "#9f7580", "#887c77", "#6f6269"];
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(2026, i, 1).toLocaleDateString("en-US", { month: "short" }),
    );
    const year = new Date().getFullYear();
    const annual = bookings.filter((b) => Number(b.date.slice(0, 4)) === year);
    $$(".chart-panel").forEach((p) => {
      if (p.querySelector("#chart-revenue,#chart-bookings,#chart-guests"))
        p.querySelector(".chart-panel-heading p").textContent =
          p
            .querySelector(".chart-panel-heading p")
            .textContent.replace(/ \| \d{4}$/, "") +
          " | " +
          year;
    });
    const valid = active(bookings);
    const annualValid = active(annual);
    const revenue = Array.from({ length: 12 }, (_, i) =>
      total(
        annualValid.filter((b) => Number(b.date.slice(5, 7)) === i + 1),
        "paid",
      ),
    );
    const counts = Array.from(
      { length: 12 },
      (_, i) =>
        annual.filter((b) => Number(b.date.slice(5, 7)) === i + 1).length,
    );
    const categories = [
      ...new Set([
        "Wedding",
        "Engagement",
        "Birthday",
        "Corporate",
        "Anniversary",
        ...bookings.map((b) => b.event),
      ]),
    ];
    const statuses = ["Confirmed", "Pending", "Completed", "Cancelled"];
    const specs = [
      [
        "revenue",
        "line",
        months,
        [
          {
            label: "Paid revenue ($)",
            data: revenue,
            borderColor: colors[0],
            backgroundColor: "#641c3516",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
        ],
      ],
      [
        "bookings",
        "bar",
        months,
        [
          {
            label: "Reservations",
            data: counts,
            backgroundColor: colors[1],
            borderRadius: 4,
          },
        ],
      ],
      [
        "categories",
        "doughnut",
        categories,
        [
          {
            label: "Events",
            data: categories.map(
              (c) => bookings.filter((b) => b.event === c).length,
            ),
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      ],
      [
        "statuses",
        "doughnut",
        statuses,
        [
          {
            label: "Reservations",
            data: statuses.map(
              (s) => bookings.filter((b) => b.status === s).length,
            ),
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      ],
      [
        "payments",
        "bar",
        ["All active bookings"],
        [
          {
            label: "Paid ($)",
            data: [total(valid, "paid")],
            backgroundColor: colors[0],
          },
          {
            label: "Outstanding ($)",
            data: [total(valid, "total") - total(valid, "paid")],
            backgroundColor: colors[1],
          },
        ],
      ],
    ];
    specs.push(
      [
        "halls",
        "bar",
        GV.state.halls.map((h) =>
          h.name.replace(/ (Ballroom|Hall|Suite|Pavilion)$/, ""),
        ),
        [
          {
            label: "Reservations",
            data: GV.state.halls.map(
              (h) => valid.filter((b) => b.hall === h.id).length,
            ),
            backgroundColor: colors[0],
            borderRadius: 6,
          },
        ],
      ],
      [
        "packages",
        "doughnut",
        GV.state.packages.map((p) => p.name),
        [
          {
            label: "Reservations",
            data: GV.state.packages.map(
              (p) => valid.filter((b) => b.package === p.id).length,
            ),
            backgroundColor: colors,
            borderWidth: 0,
          },
        ],
      ],
      [
        "guests",
        "line",
        months,
        [
          {
            label: "Expected guests",
            data: Array.from({ length: 12 }, (_, i) =>
              total(
                annualValid.filter((b) => Number(b.date.slice(5, 7)) === i + 1),
                "guests",
              ),
            ),
            borderColor: colors[1],
            backgroundColor: "#c4a06a20",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
        ],
      ],
    );
    specs.forEach(([id, type, labels, datasets]) => {
      const canvas = $("#chart-" + id);
      if (!canvas) return;
      const empty = datasets.every((d) => d.data.every((v) => !v));
      const emptyNote = document.querySelector(`[data-empty-chart="${id}"]`);
      if (emptyNote) emptyNote.hidden = !empty;
      const circular = type === "doughnut";
      const chart = new Chart(canvas, {
        type,
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? false
            : { duration: 250 },
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 10, padding: 16, font: { size: 12 } },
            },
            tooltip: { rtl: document.documentElement.dir === "rtl" },
          },
          ...(circular
            ? { cutout: "70%" }
            : {
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 12 } },
                  },
                  y: {
                    beginAtZero: true,
                    grid: { color: border },
                    ticks: { precision: 0, font: { size: 12 } },
                  },
                },
              }),
        },
      });
      charts.push(chart);
    });
    window.GVCharts = charts;
  }
  document.addEventListener("themechange", () => {
    if (["index", "payments"].includes(screen)) renderCharts(list());
    if (screen === "bookings")
      $("#bookingSearch")?.dispatchEvent(new Event("input"));
    if (screen === "reports") applyReport();
  });
  document.addEventListener("directionchange", () => {
    charts.forEach((c) => {
      c.options.plugins.tooltip.rtl = document.documentElement.dir === "rtl";
      c.update();
    });
  });
  function bookingTable(bookings) {
    return table(
      [
        "Reference",
        "Client / occasion",
        "Space",
        "Date",
        "Status",
        "Total",
        "Actions",
      ],
      bookings.map((b) => [
        esc(b.id),
        `${esc(b.name)}<br><small>${esc(b.event)}</small>`,
        esc(hallName(b.hall)),
        esc(b.date),
        pill(b.status),
        money(b.total),
        `<div class="table-actions">${button("Details", "booking-detail", b.id)}${admin ? button("Update", "booking-status", b.id) : b.status === "Pending" ? button("Cancel request", "booking-cancel", b.id) : ""}</div>`,
      ]),
      "booking records",
    );
  }
  function bookings() {
    view.innerHTML =
      chartMarkup(["categories", "statuses"]) +
      panel(
        admin ? "Manage reservations" : "Your celebrations",
        `<div class="toolbar">${input("bookingSearch", "Search bookings")}${select("bookingStatus", "Status", ["Confirmed", "Pending", "Completed", "Cancelled"])}${input("bookingFrom", "From date", "date")}${input("bookingTo", "To date", "date")}</div><div data-booking-table></div>`,
      );
    const update = () => {
      const term = $("#bookingSearch").value.toLowerCase(),
        status = $("#bookingStatus").value,
        from = $("#bookingFrom").value,
        to = $("#bookingTo").value;
      const records = list().filter(
        (b) =>
          (!term ||
            [b.id, b.name, b.event, hallName(b.hall)]
              .join(" ")
              .toLowerCase()
              .includes(term)) &&
          (!status || b.status === status) &&
          (!from || b.date >= from) &&
          (!to || b.date <= to),
      );
      $("[data-booking-table]").innerHTML = bookingTable(records);
      renderCharts(records);
    };
    $$(".toolbar input,.toolbar select", view).forEach((input) =>
      input.addEventListener("input", update),
    );
    update();
  }
  function availability() {
    view.innerHTML = panel(
      "Plan around your date",
      `<div class="toolbar"><div class="field"><label for="calendarHall">Hall</label><select id="calendarHall">${GV.state.halls.map((h) => `<option value="${h.id}">${esc(h.name)}</option>`).join("")}</select></div>${input("calendarMonth", "Month", "month", GV.iso(new Date()).slice(0, 7))}${select("calendarEvent", "Event type", ["Wedding", "Engagement", "Birthday", "Corporate"])}${select("calendarCapacity", "Minimum capacity", ["60", "150", "250", "500"])}</div>${admin ? window.GVCalendarMarkup : window.GVCalendarMarkup.replace('data-admin="true"', "")}`,
    );
    UI.initCalendars();
  }
  function addons(kind) {
    const options = GV.state[kind];
    const selected = GV.state.addons[kind] || {};
    view.innerHTML = panel(
      kind === "catering"
        ? "A menu to make your own"
        : "Set the scene, your way",
      `<p>Optional enhancements are saved as a planning estimate. They are not charged or automatically added to an existing booking.</p><div class="addon-list">${options.map((o) => `<div class="addon-row"><div><h3>${esc(o.name)}</h3><p>${money(o.price)} per ${esc(o.unit)} · estimate</p></div><div class="field"><label for="addon-${o.id}">Quantity</label><input id="addon-${o.id}" type="number" min="0" max="500" value="${Number(selected[o.id]) || 0}" data-addon="${o.id}" placeholder="0"></div></div>`).join("")}</div><p class="addon-total" data-addon-total></p>${button("Save selections", "save-addons", kind, false)}`,
    );
    const update = () => {
      let sum = 0;
      $$("[data-addon]", view).forEach((input) => {
        const qty = Math.max(0, Math.min(500, Number(input.value) || 0));
        sum += qty * options.find((o) => o.id === input.dataset.addon).price;
      });
      $("[data-addon-total]").textContent =
        "Estimated enhancements: " + money(sum);
    };
    $$("[data-addon]", view).forEach((i) =>
      i.addEventListener("input", update),
    );
    update();
  }
  function dueDate(date, days) {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() - days);
    return GV.iso(d);
  }
  function installmentSchedule(records) {
    return table(
      ["Booking", "Installment", "Due date", "Amount", "Status"],
      records.flatMap((b) =>
        [
          [0.3, "Initial installment", b.created || GV.iso(new Date()), 0.3],
          [0.4, "Planning installment", dueDate(b.date, 30), 0.7],
          [0.3, "Final balance", dueDate(b.date, 7), 1],
        ].map(([part, title, date, threshold]) => [
          esc(b.id),
          title,
          esc(date),
          money(Math.round(b.total * part)),
          pill(b.paid >= Math.round(b.total * threshold) ? "Paid" : "Pending"),
        ]),
      ),
      "installment due dates",
    );
  }
  function payments() {
    const records = active(list());
    view.innerHTML =
      kpis([
        [
          "Total value",
          money(total(records, "total")),
          "Active bookings",
          "wallet",
        ],
        [
          "Paid",
          money(total(records, "paid")),
          "Installment records",
          "credit-card",
        ],
        [
          "Outstanding",
          money(total(records, "total") - total(records, "paid")),
          "Remaining balance",
          "receipt",
        ],
      ]) +
      panel(
        admin ? "Payment records" : "Your installment schedule",
        table(
          [
            "Booking",
            "Client",
            "Total",
            "Paid",
            "Outstanding",
            "Status",
            "Action",
          ],
          records.map((b) => [
            esc(b.id),
            esc(b.name),
            money(b.total),
            money(b.paid),
            money(b.total - b.paid),
            pill(b.total === b.paid ? "Paid" : "Pending"),
            b.paid < b.total
              ? button("Record installment", "pay", b.id)
              : button("Print receipt", "receipt", b.id),
          ]),
          "No real money is processed",
        ),
      ) +
      chartMarkup(["revenue", "payments"]) +
      panel("Installment due dates", installmentSchedule(records)) +
      panel(
        "How the schedule works",
        `<div class="spec-grid"><div><strong>30%</strong><span>Initial installment · on review</span></div><div><strong>40%</strong><span>Planning installment · 30 days before</span></div><div><strong>30%</strong><span>Final balance · 7 days before</span></div></div><p class="form-note">History and current paid amounts remain consistent with invoices and booking records.</p>`,
      ) +
      panel(
        "Payment history",
        table(
          ["Booking", "Latest recorded amount", "Event date", "Record"],
          records
            .filter((b) => b.paid > 0)
            .map((b) => [
              esc(b.id),
              money(b.paid),
              esc(b.date),
              "Cumulative installment record",
            ]),
          "Installment history",
        ),
      );
    renderCharts(records);
  }
  function invoiceMarkup(b) {
    return `<div class="invoice-sheet"><div class="invoice-heading"><div><h2>The Grand Venue</h2><p>Venue address to be configured<br>hello@example.com</p></div><div><h3>PAYMENT SUMMARY</h3><p>INV-${esc(b.id)}<br>Issued ${GV.iso(new Date())}</p></div></div><p><strong>Billed to ${esc(b.name)}</strong><br>${esc(b.email)}<br>Event: ${esc(b.date)}</p>${table(
      ["Description", "Amount"],
      [
        [
          esc(hallName(b.hall)) + " / " + esc(packageName(b.package)),
          money(b.total - b.catering - b.decoration),
        ],
        ["Catering enhancement", money(b.catering)],
        ["Decoration enhancement", money(b.decoration)],
      ],
      "celebration estimate",
    )}<div class="invoice-totals summary-lines"><p><span>Total</span><strong>${money(b.total)}</strong></p><p><span>Recorded installments</span><strong>${money(b.paid)}</strong></p><p><span>Balance</span><strong>${money(b.total - b.paid)}</strong></p></div><p class="form-note">Not a tax invoice. No real transaction or reservation. Use your browser print dialog to save this as a PDF.</p></div>`;
  }
  function invoices() {
    const records = list();
    view.innerHTML = panel(
      "Your celebration invoices",
      `<div class="toolbar"><div class="field"><label for="invoiceBooking">Booking</label><select id="invoiceBooking">${records.map((b) => `<option value="${esc(b.id)}">${esc(b.id)}${esc(b.event)}</option>`).join("")}</select></div>${button("Print / Save as PDF", "print")}</div><div data-invoice></div>`,
    );
    const update = () => {
      const b = records.find((b) => b.id === $("#invoiceBooking").value);
      $("[data-invoice]").innerHTML = b
        ? invoiceMarkup(b)
        : "<p>No invoices yet. Create a booking first.</p>";
    };
    $("#invoiceBooking").addEventListener("change", update);
    update();
  }
  function notifications() {
    view.innerHTML = panel(
      "The latest on your celebration",
      `<div class="toolbar">${button("Mark all as read", "read-all")}</div><div class="notification-list">${GV.state.notifications.map((n) => `<article class="notification-item ${n.read ? "read" : ""}"><i data-lucide="${n.read ? "mail-open" : "bell"}" aria-hidden="true"></i><div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><small>${n.read ? "Read" : "Unread"} · Update</small></div>${button(n.read ? "Mark unread" : "Mark read", "notification", n.id)}</article>`).join("")}</div>`,
    );
  }
  function profile() {
    const p = GV.state.profile;
    view.innerHTML = `<div class="profile-grid"><aside class="profile-card"><span class="avatar">${esc(p.name[0])}</span><h3>${esc(p.name)}</h3><p>Celebration client<br>${esc(p.email)}</p><span class="status-pill">Your profile</span></aside>${panel("Your personal details", `<form data-profile-form novalidate><div class="form-grid">${input("fullName", "Full name", "text", p.name, true)}${input("email", "Email address", "email", p.email, true)}${input("phone", "Phone number", "tel", p.phone, true)}</div><div class="section-action">${button("Save profile", "save-profile", "", false)}</div><p class="form-result" role="status"></p></form>`)}</div>`;
  }
  function settings() {
    const s = GV.state.settings;
    view.innerHTML =
      panel(
        admin ? "Venue configuration" : "Your preferences",
        `<form data-settings-form><div class="form-grid">${admin ? input("venue", "Venue name", "text", s.venue, true) + input("venueEmail", "Venue email", "email", s.email, true) + input("hours", "Visiting hours", "text", s.hours, true) + input("notice", "Minimum booking notice (days)", "number", s.notice, true) : input("contactName", "Preferred contact name", "text", s.contactName || GV.state.profile.name, true) + select("contactMethod", "Preferred contact", ["Email", "Phone"])}<div class="field"><label for="displayTheme">Display theme</label><select id="displayTheme"><option value="light">Light</option><option value="dark">Dark</option></select></div><div class="field"><label for="displayDirection">Reading direction</label><select id="displayDirection"><option value="ltr">Left to right</option><option value="rtl">Right to left</option></select></div></div><div class="section-action">${button("Save preferences", "save-settings", "", false)}</div><p class="form-result" role="status"></p></form>`,
      ) +
      panel(
        "Local workspace data",
        `<p>All reservations, profiles and settings are stored on this device. There is no secure authentication, live availability or real payment processing.</p><a class="text-link" href="${root}documentation/integrations.md">Integration guide</a><div class="section-action">${button("Reset local data", "reset-demo")}</div>`,
      );
    $("#displayTheme").value = document.documentElement.dataset.theme;
    $("#displayDirection").value = document.documentElement.dir;
  }
  function management(kind) {
    const items = GV.state[kind];
    const title = {
      halls: "Hall collection",
      packages: "Celebration packages",
      catering: "Catering options",
      decorations: "Decoration options",
    }[kind];
    view.innerHTML = panel(
      title,
      `<div class="toolbar">${input("managementSearch", "Search " + kind)}${button("Add " + (kind === "halls" ? "hall" : "option"), "manage-add", kind, false)}</div><div data-management-table></div>`,
    );
    const update = () => {
      const term = $("#managementSearch").value.toLowerCase();
      const rows = items.filter((i) => i.name.toLowerCase().includes(term));
      $("[data-management-table]").innerHTML = table(
        kind === "halls"
          ? [
              "Hall",
              "Capacity",
              "Area",
              "Venue price",
              "Availability",
              "Actions",
            ]
          : ["Name", "Price", "Details", "Actions"],
        rows.map((item) =>
          kind === "halls"
            ? [
                esc(item.name),
                item.capacity + " guests",
                item.area.toLocaleString() + " sq ft",
                money(item.price),
                pill(item.enabled ? "Available" : "Unavailable"),
                `<div class="table-actions">${button("Details", "hall-detail", item.id)}${button("Edit", "manage-edit", kind + ":" + item.id)}${button(item.enabled ? "Disable" : "Enable", "hall-toggle", item.id)}</div>`,
              ]
            : [
                esc(item.name),
                money(item.price),
                esc(item.inclusions || "Per " + item.unit),
                button("Edit", "manage-edit", kind + ":" + item.id),
              ],
        ),
        "Editable browser-local collection",
      );
    };
    $("#managementSearch").addEventListener("input", update);
    update();
  }
  function editor(kind, id) {
    const existing = GV.state[kind].find((item) => item.id === id);
    const item = existing || {
      name: "",
      price: 0,
      capacity: 100,
      area: 2000,
      amenities: "",
      unit: "guest",
      inclusions: "",
    };
    modal(
      existing
        ? "Edit " + item.name
        : "Add " + (kind === "halls" ? "hall" : "option"),
      `<form id="management-form" data-kind="${kind}" data-edit-id="${id || ""}" novalidate><div class="form-grid">${input("editName", "Name", "text", item.name, true)}${input("editPrice", "Price ($)", "number", item.price, true)}${kind === "halls" ? input("editCapacity", "Capacity", "number", item.capacity, true) + input("editArea", "Area (sq ft)", "number", item.area, true) + input("editAmenities", "Amenities", "text", item.amenities, true) : kind === "packages" ? input("editInclusions", "Inclusions", "text", item.inclusions, true) : input("editUnit", "Unit", "text", item.unit, true)}</div><div class="section-action"><button class="btn btn-primary" type="submit">Save changes</button></div><p class="form-result" role="status"></p></form>`,
    );
    $("#management-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!UI.validate(form)) return;
      const values = Object.fromEntries(new FormData(form));
      const record = {
        ...item,
        id: id || "custom-" + Date.now(),
        name: values.editName,
        price: Number(values.editPrice),
      };
      if (kind === "halls")
        Object.assign(record, {
          capacity: Number(values.editCapacity),
          area: Number(values.editArea),
          amenities: values.editAmenities,
          enabled: existing?.enabled ?? true,
        });
      else if (kind === "packages") record.inclusions = values.editInclusions;
      else record.unit = values.editUnit;
      if (existing) Object.assign(existing, record);
      else GV.state[kind].push(record);
      GV.save();
      $("#site-dialog").close();
      management(kind);
      icons();
      toast(
        "Changes saved on this device. Existing bookings retain their original estimates.",
      );
    });
  }
  function clients() {
    const map = new Map();
    GV.state.bookings.forEach((b) => {
      if (!map.has(b.email))
        map.set(b.email, {
          name: b.name,
          email: b.email,
          phone: b.phone,
          bookings: [],
        });
      map.get(b.email).bookings.push(b);
    });
    const clients = [...map.values()];
    view.innerHTML = panel(
      "The people behind the celebrations",
      `<div class="toolbar">${input("clientSearch", "Search clients")}</div><div data-client-table></div>`,
    );
    const update = () => {
      $("[data-client-table]").innerHTML = table(
        ["Client", "Contact", "Bookings", "Total value", "Action"],
        clients
          .filter((c) =>
            (c.name + c.email)
              .toLowerCase()
              .includes($("#clientSearch").value.toLowerCase()),
          )
          .map((c) => [
            esc(c.name),
            esc(c.email) + "<br>" + esc(c.phone),
            c.bookings.length,
            money(total(active(c.bookings), "total")),
            button("View profile", "client-detail", c.email),
          ]),
        "Client directory",
      );
    };
    $("#clientSearch").addEventListener("input", update);
    update();
  }
  function messages() {
    view.innerHTML = `<section class="message-grid"><div class="message-list">${GV.state.messages.map((m) => `<button data-message="${esc(m.id)}"><strong>${m.read ? "" : "● "}${esc(m.name)}</strong><span>${esc(m.subject)}</span></button>`).join("")}</div><div class="message-detail" data-message-detail><h2>Your enquiry inbox</h2><p>Select a message to read the details.</p></div></section>`;
    $$("[data-message]", view).forEach((button) =>
      button.addEventListener("click", () => {
        const m = GV.state.messages.find(
          (m) => m.id === button.dataset.message,
        );
        m.read = true;
        GV.save();
        $$("[data-message]").forEach((b) =>
          b.classList.toggle("active", b === button),
        );
        $("strong", button).textContent = m.name;
        $("[data-message-detail]").innerHTML =
          `<p class="eyebrow">ENQUIRY</p><h2>${esc(m.subject)}</h2><p>${esc(m.name)} &lt;${esc(m.email)}&gt;</p><hr><p>${esc(m.body)}</p><form data-reply="${esc(m.id)}"><div class="field"><label for="reply">Reply draft</label><textarea id="reply" name="reply" placeholder="Write a thoughtful reply" rows="5" required>${esc(m.draft || "")}</textarea></div><button class="btn btn-primary" type="submit">Save reply draft</button><p class="form-note">Saves a draft locally. No message is sent.</p></form>`;
      }),
    );
  }
  let reportRecords = [];
  function reports() {
    view.innerHTML =
      panel(
        "Your venue, in perspective",
        `<div class="toolbar">${input("reportFrom", "From date", "date")}${input("reportTo", "To date", "date")}${button("Export CSV", "export-csv")}${button("Print report", "print")}</div><div data-report-kpis></div>`,
      ) +
      chartMarkup() +
      panel(
        "Hall utilization and package popularity",
        "<div data-utilization></div>",
      );
    $$("#reportFrom,#reportTo").forEach((i) =>
      i.addEventListener("change", applyReport),
    );
    applyReport();
  }
  function applyReport() {
    const from = $("#reportFrom")?.value || "",
      to = $("#reportTo")?.value || "";
    reportRecords = GV.state.bookings.filter(
      (b) => (!from || b.date >= from) && (!to || b.date <= to),
    );
    const records = active(reportRecords);
    $("[data-report-kpis]").innerHTML = kpis([
      [
        "Reservations",
        reportRecords.length,
        "Selected event-date range",
        "calendar-check",
      ],
      [
        "Revenue received",
        money(total(records, "paid")),
        "Installment records",
        "wallet",
      ],
      [
        "Outstanding",
        money(total(records, "total") - total(records, "paid")),
        "Within date range",
        "credit-card",
      ],
    ]);
    $("[data-utilization]").innerHTML =
      table(
        ["Hall", "Bookings", "Share of selected reservations", "Booked value"],
        GV.state.halls.map((h) => {
          const rows = records.filter((b) => b.hall === h.id);
          return [
            esc(h.name),
            rows.length,
            Math.round((rows.length / Math.max(1, records.length)) * 100) + "%",
            money(total(rows, "total")),
          ];
        }),
        "Hall utilization · share of active bookings",
      ) +
      "<br>" +
      table(
        ["Package", "Bookings", "Value"],
        GV.state.packages.map((p) => {
          const rows = records.filter((b) => b.package === p.id);
          return [esc(p.name), rows.length, money(total(rows, "total"))];
        }),
        "Package popularity",
      );
    renderCharts(reportRecords);
    icons();
  }
  function refresh() {
    if (!admin) {
      const name = GV.state.profile.name;
      const display = $(".topbar-avatar>span:not(.avatar)");
      if (display) display.textContent = name + " · Celebration client";
      const avatar = $(".topbar-avatar .avatar");
      if (avatar) avatar.textContent = name[0] || "C";
      if (screen === "index")
        $(".dashboard-heading h1").textContent =
          "Welcome back, " + name.split(" ")[0] + ".";
    }
    charts.forEach((c) => c.destroy());
    charts = [];
    const renderers = {
      index: overview,
      bookings,
      availability,
      calendar: availability,
      catering: () => (admin ? management("catering") : addons("catering")),
      decorations: () =>
        admin ? management("decorations") : addons("decorations"),
      payments,
      invoices,
      notifications,
      profile,
      settings,
      halls: () => management("halls"),
      packages: () => management("packages"),
      clients,
      messages,
      reports,
      "new-booking": () => {
        view.innerHTML = window.GVBookingMarkup;
        UI.initCalendars();
        UI.initBooking();
      },
    };
    renderers[screen]?.();
    icons();
  }
  view.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-reply]");
    if (!form) return;
    event.preventDefault();
    if (!UI.validate(form)) return;
    const m = GV.state.messages.find((m) => m.id === form.dataset.reply);
    m.draft = form.elements.reply.value;
    GV.save();
    toast("reply draft saved. No message was sent.");
  });
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    event.preventDefault();
    const action = target.dataset.action,
      id = target.dataset.id;
    const b = GV.state.bookings.find((b) => b.id === id);
    if (action === "booking-detail" && b)
      modal(
        "Celebration details",
        UI.bookingSummary(b) +
          `<p class="form-note">Client: ${esc(b.name)}${esc(b.email)}<br>Requests: ${esc(b.notes || "No special requests")}</p>`,
      );
    if (action === "booking-status" && b) {
      modal(
        "Update reservation",
        `<p>${esc(b.id)}${esc(b.name)}</p><div class="field"><label for="newStatus">Booking status</label><select id="newStatus">${["Confirmed", "Pending", "Completed", "Cancelled"].map((s) => `<option ${s === b.status ? "selected" : ""}>${s}</option>`).join("")}</select></div><div class="section-action">${button("Save status", "status-save", b.id, false)}</div>`,
      );
    }
    if (action === "status-save" && b) {
      b.status = $("#newStatus").value;
      GV.save();
      $("#site-dialog").close();
      refresh();
      toast("booking status updated.");
    }
    if (action === "booking-cancel" && b)
      modal(
        "Cancel this booking request?",
        `<p>${esc(b.id)} will be marked cancelled in this browser.</p>${button("Cancel request", "cancel-confirm", b.id, false)}`,
      );
    if (action === "cancel-confirm" && b) {
      b.status = "Cancelled";
      GV.save();
      $("#site-dialog").close();
      refresh();
      toast("booking cancelled.");
    }
    if (action === "save-addons") {
      const kind = id;
      const quantities = {};
      $$("[data-addon]", view).forEach(
        (i) =>
          (quantities[i.dataset.addon] = Math.max(
            0,
            Math.min(500, Number(i.value) || 0),
          )),
      );
      GV.state.addons[kind] = quantities;
      GV.save();
      toast(
        "Your enhancement estimate is saved. Existing bookings are unchanged.",
      );
    }
    if (action === "pay" && b) {
      const due = Math.min(
        b.total - b.paid,
        Math.round(b.total * (b.paid === 0 ? 0.3 : 0.4)),
      );
      modal(
        "Record an installment",
        `<p>Record ${money(due)} against ${esc(b.id)}?</p><p>No card details are collected and no money is processed.</p>${button("Save installment record", "pay-confirm", b.id, false)}`,
      );
    }
    if (action === "pay-confirm" && b) {
      const amount = Math.min(
        b.total - b.paid,
        Math.round(b.total * (b.paid === 0 ? 0.3 : 0.4)),
      );
      b.paid += amount;
      GV.save();
      $("#site-dialog").close();
      refresh();
      toast("Installment record saved. No money was processed.");
    }
    if (action === "receipt" && b) {
      modal(
        "Payment record",
        invoiceMarkup(b) + button("Print / Save as PDF", "print-dialog"),
      );
    }
    if (action === "print" || action === "print-dialog") window.print();
    if (action === "read-all") {
      GV.state.notifications.forEach((n) => (n.read = true));
      GV.save();
      refresh();
      toast("All notifications marked as read.");
    }
    if (action === "notification") {
      const n = GV.state.notifications.find((n) => n.id === id);
      n.read = !n.read;
      GV.save();
      refresh();
    }
    if (action === "save-profile") {
      const form = $("[data-profile-form]");
      if (!UI.validate(form)) return;
      GV.state.profile = {
        name: $("#fullName").value,
        email: $("#email").value,
        phone: $("#phone").value,
      };
      GV.save();
      refresh();
      toast("profile updated.");
    }
    if (action === "save-settings") {
      const form = $("[data-settings-form]");
      if (!UI.validate(form)) return;
      if (admin)
        Object.assign(GV.state.settings, {
          venue: $("#venue").value,
          email: $("#venueEmail").value,
          hours: $("#hours").value,
          notice: Number($("#notice").value),
        });
      else
        Object.assign(GV.state.settings, {
          contactName: $("#contactName").value,
          contactMethod: $("#contactMethod").value,
        });
      document.documentElement.dataset.theme = $("#displayTheme").value;
      document.documentElement.dir = $("#displayDirection").value;
      try {
        localStorage.setItem("gv-theme", $("#displayTheme").value);
        localStorage.setItem("gv-direction", $("#displayDirection").value);
      } catch {}
      GV.save();
      toast("preferences saved.");
    }
    if (action === "reset-demo")
      modal(
        "Reset this browser’s local data?",
        `<p>This removes local edits and restores the sample reservations. It does not affect any real service.</p>${button("Reset local data", "reset-confirm", "", false)}`,
      );
    if (action === "reset-confirm") {
      GV.reset();
      $("#site-dialog").close();
      refresh();
      toast("Sample data restored.");
    }
    if (action === "manage-add") editor(id);
    if (action === "manage-edit") {
      const [kind, editId] = id.split(":");
      editor(kind, editId);
    }
    if (action === "hall-toggle") {
      const h = GV.state.halls.find((h) => h.id === id);
      h.enabled = !h.enabled;
      GV.save();
      refresh();
      toast("hall availability updated.");
    }
    if (action === "hall-detail") {
      const h = GV.state.halls.find((h) => h.id === id);
      modal(
        h.name,
        `<div class="summary-lines"><p><span>Capacity</span><strong>${h.capacity}</strong></p><p><span>Area</span><strong>${h.area.toLocaleString()} sq ft</strong></p><p><span>Hire estimate</span><strong>${money(h.price)}</strong></p><p><span>Amenities</span><strong>${esc(h.amenities)}</strong></p></div>`,
      );
    }
    if (action === "client-detail") {
      const rows = GV.state.bookings.filter((b) => b.email === id);
      modal(
        rows[0]?.name || "Client",
        `<p>${esc(id)}${esc(rows[0]?.phone)}</p>` + bookingTable(rows),
      );
    }
    if (action === "export-csv") {
      const safe = (v) => {
        let text = String(v ?? "");
        if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
        return '"' + text.replace(/"/g, '""') + '"';
      };
      const rows = [
        [
          "Reference",
          "Client",
          "Hall",
          "Event date",
          "Status",
          "Total",
          "Paid",
        ],
        ...reportRecords.map((b) => [
          b.id,
          b.name,
          hallName(b.hall),
          b.date,
          b.status,
          b.total,
          b.paid,
        ]),
      ];
      const blob = new Blob(
        ["\uFEFF" + rows.map((r) => r.map(safe).join(",")).join("\r\n")],
        {
          type: "text/csv;charset=utf-8",
        },
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "grand-venue-report.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("report exported.");
    }
  });
  refresh();
})();
