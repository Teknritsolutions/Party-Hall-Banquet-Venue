/* Shared public and client booking workflow. */
(() => {
  const { $, $$, root, toast, validate } = UI;
  const { escape: esc, money } = GV;
  const summary = (b) =>
    `<div class="summary-lines">${[
      ["Booking reference", b.id],
      ["Celebration", b.event],
      [
        "Venue",
        GV.state.halls.find((h) => h.id === b.hall)?.name || "Selected hall",
      ],
      ["Date & time", b.date + " / " + b.time],
      ["Guests", b.guests],
      [
        "Package",
        GV.state.packages.find((p) => p.id === b.package)?.name ||
          "Selected package",
      ],
      ["Estimated total", money(b.total)],
      ["status", b.status],
    ]
      .map(([t, v]) => `<p><span>${t}</span><strong>${esc(v)}</strong></p>`)
      .join("")}</div>`;
  UI.bookingSummary = summary;
  UI.initBooking = function () {
    const form = $("#booking-form");
    if (!form || form.dataset.ready) return;
    form.dataset.ready = "true";
    const options = $(".hall-options", form);
    options.innerHTML = GV.state.halls
      .map(
        (h, i) =>
          '<label class="choice-card"><input type="radio" name="hall" value="' +
          esc(h.id) +
          '" ' +
          (i === 0 ? "checked " : "") +
          (!h.enabled ? "disabled" : "") +
          "><span><strong>" +
          esc(h.name) +
          '</strong><small><span class="choice-capacity">Up to ' +
          h.capacity +
          ' guests</span><span class="choice-price">From ' +
          money(h.price) +
          " <span>venue only</span></span>" +
          (!h.enabled ? " · unavailable" : "") +
          "</small></span></label>",
      )
      .join("");
    form.elements.package.innerHTML =
      '<option value="">Choose a celebration package</option>' +
      GV.state.packages
        .map(
          (p) =>
            '<option value="' +
            esc(p.name) +
            '">' +
            esc(p.name) +
            " — " +
            money(p.price) +
            "</option>",
        )
        .join("");
    const params = new URLSearchParams(location.search);
    const hall = params.get("hall");
    if (hall && form.elements.hall[Number(hall)])
      form.elements.hall.value = hall;
    const pack = params.get("package");
    if (pack !== null && GV.state.packages[Number(pack)])
      form.elements.package.selectedIndex = Number(pack) + 1;
    const event = params.get("event");
    if (event) {
      const option = [...form.elements.bookingEvent.options].find(
        (o) => o.value.toLowerCase() === event.toLowerCase().replace(/s$/, ""),
      );
      if (option) option.selected = true;
    }
    const dateInput = form.elements.eventDate;
    try {
      const date = localStorage.getItem("gv-selected-date");
      if (
        date &&
        GV.availability(date, form.elements.hall.value) === "Available"
      )
        dateInput.value = date;
    } catch {}
    function calculate() {
      const index = form.elements.package.selectedIndex - 1;
      const pkg = GV.state.packages[index];
      const catering = form.elements.catering.checked ? 1800 : 0;
      const decoration = form.elements.decoration.checked ? 1200 : 0;
      const total = (pkg?.price || 0) + catering + decoration;
      const hall = GV.state.halls.find(
        (h) => h.id === form.elements.hall.value,
      );
      $("[data-booking-summary]", form).innerHTML =
        `<div class="summary-lines"><p><span>Selected venue</span><strong>${esc(hall?.name || "Choose your venue")}</strong></p><p><span>Package including venue</span><strong>${pkg ? esc(pkg.name) + "" + money(pkg.price) : "Choose your package"}</strong></p><p><span>Catering enhancement</span><strong>${money(catering)}</strong></p><p><span>Decoration enhancement</span><strong>${money(decoration)}</strong></p><p><span>Total estimate</span><strong class="summary-total">${money(total)}</strong></p><p><span>Initial installment (30%)</span><strong>${money(Math.round(total * 0.3))}</strong></p></div>`;
      return { pkg, catering, decoration, total, hall };
    }
    form.addEventListener("change", (event) => {
      calculate();
      if (event.target.name === "hall") {
        const calendar = form.querySelector("[data-calendar]");
        if (calendar) {
          calendar.refreshCalendar?.();
        }
      }
    });
    calculate();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      dateInput.setCustomValidity("");
      form.elements.guestCount.setCustomValidity("");
      const estimate = calculate();
      const values = Object.fromEntries(new FormData(form));
      if (
        values.eventDate &&
        GV.availability(values.eventDate, values.hall) !== "Available"
      )
        dateInput.setCustomValidity("Choose an available date.");
      if (Number(values.guestCount) > estimate.hall.capacity)
        form.elements.guestCount.setCustomValidity(
          `This hall accommodates up to ${estimate.hall.capacity} guests.`,
        );
      // Keep domain errors while shared validation checks native constraints.
      const dateError =
        dateInput.validationMessage && dateInput.validity.customError
          ? dateInput.validationMessage
          : "";
      const guestError = form.elements.guestCount.validity.customError
        ? form.elements.guestCount.validationMessage
        : "";
      if (!validate(form)) return;
      if (dateError || guestError) {
        const target = dateError ? dateInput : form.elements.guestCount;
        target.setCustomValidity(dateError || guestError);
        target.setAttribute("aria-invalid", "true");
        const err = $("#" + target.id + "-error", form);
        if (err) err.textContent = dateError || guestError;
        target.focus();
        toast(dateError || guestError);
        return;
      }
      const booking = {
        id: `GV-${new Date().getFullYear()}-${Date.now().toString().slice(-7)}`,
        hall: values.hall,
        event: values.bookingEvent,
        date: values.eventDate,
        time: values.timeSlot,
        package: String(form.elements.package.selectedIndex - 1),
        guests: Number(values.guestCount),
        name: values.customerName,
        email: values.customerEmail,
        phone: values.customerPhone,
        notes: values.notes || "",
        status: "Pending",
        total: estimate.total,
        paid: 0,
        catering: estimate.catering,
        decoration: estimate.decoration,
        created: GV.iso(new Date()),
        client: "demo-client",
      };
      GV.state.bookings.push(booking);
      if (!GV.save()) {
        GV.state.bookings.pop();
        toast(
          "Your browser could not save this booking. Enable site storage and try again.",
        );
        return;
      }
      try {
        localStorage.setItem("gv-last-booking", booking.id);
      } catch {}
      location.href =
        root +
        "pages/booking-confirmation.html?id=" +
        encodeURIComponent(booking.id);
    });
  };
  UI.initBooking();
  if ($("[data-confirmation-summary]")) {
    let id = new URLSearchParams(location.search).get("id");
    try {
      id = id || localStorage.getItem("gv-last-booking");
    } catch {}
    const b = GV.state.bookings.find((b) => b.id === id);
    if (b) {
      $("[data-confirmation-summary]").innerHTML = summary(b);
      $("[data-confirmation-addons]").innerHTML =
        `<h3>${esc(GV.state.packages.find((p) => p.id === b.package)?.name || "Package")}</h3><div class="summary-lines"><p><span>Catering enhancement</span><strong>${money(b.catering)}</strong></p><p><span>Decoration enhancement</span><strong>${money(b.decoration)}</strong></p></div>`;
      $("[data-confirmation-installments]").innerHTML =
        `<div class="table-wrap"><table><caption>payment schedule</caption><thead><tr><th>Installment</th><th>Amount</th><th>Timing</th></tr></thead><tbody>${[
          [30, "Initial planning"],
          [40, "30 days before event"],
          [30, "7 days before event"],
        ]
          .map(
            ([pct, t]) =>
              `<tr><td>${pct}%</td><td>${money(Math.round((b.total * pct) / 100))}</td><td>${t}</td></tr>`,
          )
          .join("")}</tbody></table></div>`;
    } else {
      $("[data-confirmation-summary]").innerHTML =
        `<div class="empty-state"><h3>No booking saved yet.</h3><p>Begin a booking to see your personalized summary.</p><a class="btn btn-primary" href="booking.html">Create a booking</a></div>`;
      $("[data-confirmation-addons]").textContent =
        "Package details will appear after your submission.";
      $("[data-confirmation-installments]").textContent =
        "Your schedule will appear with your booking.";
    }
  }
})();
