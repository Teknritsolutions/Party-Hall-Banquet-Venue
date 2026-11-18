/* Navigation, preferences, forms, galleries, calendars and public interactions. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const root = document.body.dataset.root;
  const { escape: esc, money } = GV;
  function revealResults(target) {
    if (!target) return;
    const headerHeight = $(".site-header")?.getBoundingClientRect().height || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
    window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  let toastTimer;
  function toast(message) {
    const node = $(".toast-message");
    node.textContent = message;
    node.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("visible"), 4500);
  }
  function persist(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      toast("Preferences could not be saved in this browser.");
    }
  }
  function icons() {
    window.lucide?.createIcons();
  }
  function modal(title, body) {
    $("#dialog-content").innerHTML =
      `<h2 id="dialog-title">${esc(title)}</h2>${body}`;
    $("#site-dialog").showModal();
    icons();
  }
  window.UI = { $, $$, root, toast, modal, icons };
  function refreshPreferenceControls() {
    const dark = document.documentElement.dataset.theme === "dark";
    const rtl = document.documentElement.dir === "rtl";
    $$("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(dark));
      button.title = dark ? "Switch to light mode" : "Switch to dark mode";
    });
    $$("[data-rtl-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(rtl));
      button.title = rtl
        ? "Switch to left-to-right layout"
        : "Switch to right-to-left layout";
    });
  }
  document.addEventListener("themechange", refreshPreferenceControls);
  document.addEventListener("directionchange", refreshPreferenceControls);
  refreshPreferenceControls();
  const preferenceObserver = new MutationObserver(refreshPreferenceControls);
  preferenceObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "dir"],
  });
  $$("[data-theme-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      const theme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      persist("gv-theme", theme);
      document.dispatchEvent(new Event("themechange"));
    }),
  );
  $$("[data-rtl-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      const direction = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
      document.documentElement.dir = direction;
      persist("gv-direction", direction);
      document.dispatchEvent(new Event("directionchange"));
    }),
  );
  const publicMenu = $(".public-nav");
  const menuToggle = $("[data-menu-toggle]");
  const menuBackdrop = $(".nav-backdrop");
  const hoverOpened = new WeakSet();
  const hoverTimers = new WeakMap();
  function closeDropdowns(except) {
    $$(".nav-dropdown.open").forEach((node) => {
      if (node === except) return;
      hoverOpened.delete(node);
      clearTimeout(hoverTimers.get(node));
      node.classList.remove("open");
      $("[data-dropdown]", node).setAttribute("aria-expanded", "false");
    });
  }
  function setPublicMenu(open, restoreFocus = true) {
    if (!publicMenu || !menuToggle) return;
    publicMenu.classList.toggle("mobile-open", open);
    document.body.classList.toggle("nav-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    if (menuBackdrop) menuBackdrop.hidden = !open;
    menuToggle.innerHTML =
      '<i data-lucide="' + (open ? "x" : "menu") + '" aria-hidden="true"></i>';
    icons();
    if (open) $("[data-menu-close]", publicMenu)?.focus();
    else {
      closeDropdowns();
      if (restoreFocus) menuToggle.focus();
    }
  }
  menuToggle?.addEventListener("click", () =>
    setPublicMenu(!publicMenu.classList.contains("mobile-open")),
  );
  $$("[data-menu-close]").forEach((button) =>
    button.addEventListener("click", () => setPublicMenu(false)),
  );
  $$("[data-dropdown]").forEach((button) =>
    button.addEventListener("click", () => {
      const dropdown = button.closest(".nav-dropdown");
      const open =
        hoverOpened.has(dropdown) || !dropdown.classList.contains("open");
      hoverOpened.delete(dropdown);
      closeDropdowns(dropdown);
      dropdown.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const opened = $(".nav-dropdown.open");
      if (opened) {
        closeDropdowns();
        $("[data-dropdown]", opened).focus();
      } else if (publicMenu?.classList.contains("mobile-open"))
        setPublicMenu(false);
      $(".sidebar")?.classList.remove("mobile-open");
      $("[data-sidebar-toggle]")?.setAttribute("aria-expanded", "false");
    }
    if (event.key === "Tab" && publicMenu?.classList.contains("mobile-open")) {
      const focusable = [
        menuToggle,
        ...$$("a,button", publicMenu).filter(
          (node) => node.getClientRects().length && !node.disabled,
        ),
      ];
      const current = focusable.indexOf(document.activeElement);
      const next =
        (current + (event.shiftKey ? -1 : 1) + focusable.length) %
        focusable.length;
      event.preventDefault();
      focusable[next].focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) closeDropdowns();
  });
  matchMedia("(min-width: 1280px)").addEventListener("change", (event) => {
    if (event.matches) setPublicMenu(false, false);
  });
  // Desktop pointer interaction follows the reference; clicks and keys remain available.
  $$(".nav-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("pointerenter", (event) => {
      if (
        !matchMedia("(min-width: 1280px) and (hover: hover)").matches ||
        event.pointerType === "touch"
      )
        return;
      clearTimeout(hoverTimers.get(dropdown));
      if (dropdown.classList.contains("open")) return;
      closeDropdowns(dropdown);
      dropdown.classList.add("open");
      hoverOpened.add(dropdown);
      $("[data-dropdown]", dropdown).setAttribute("aria-expanded", "true");
    });
    dropdown.addEventListener("pointerleave", () => {
      if (!matchMedia("(min-width: 1280px) and (hover: hover)").matches) return;
      hoverTimers.set(
        dropdown,
        setTimeout(() => {
          if (dropdown.contains(document.activeElement)) return;
          dropdown.classList.remove("open");
          hoverOpened.delete(dropdown);
          $("[data-dropdown]", dropdown).setAttribute("aria-expanded", "false");
        }, 180),
      );
    });
    $("[data-dropdown]", dropdown).addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      closeDropdowns(dropdown);
      dropdown.classList.add("open");
      $("[data-dropdown]", dropdown).setAttribute("aria-expanded", "true");
      const links = $$("a", dropdown);
      (event.key === "ArrowDown" ? links[0] : links.at(-1))?.focus();
    });
  });
  function refreshDirectionLabels() {
    $$("[data-direction-label]").forEach(
      (node) =>
        (node.textContent =
          document.documentElement.dir === "rtl" ? "LTR" : "RTL"),
    );
  }
  document.addEventListener("directionchange", refreshDirectionLabels);
  refreshDirectionLabels();
  $("[data-sidebar-toggle]")?.addEventListener("click", (event) => {
    const open = $(".sidebar").classList.toggle("mobile-open");
    event.currentTarget.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => {
    const sidebar = $(".sidebar.mobile-open");
    if (
      sidebar &&
      !event.target.closest(".sidebar") &&
      !event.target.closest("[data-sidebar-toggle]")
    ) {
      sidebar.classList.remove("mobile-open");
      $("[data-sidebar-toggle]").setAttribute("aria-expanded", "false");
    }
  });
  $$("[data-logout]").forEach((link) =>
    link.addEventListener("click", () => {
      try {
        sessionStorage.removeItem("gv-session");
        localStorage.removeItem("gv-session");
      } catch {}
    }),
  );
  $("[data-close-dialog]")?.addEventListener("click", () =>
    $("#site-dialog").close(),
  );
  $("#site-dialog")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      const r = event.currentTarget.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        event.currentTarget.close();
    }
  });
  $$("input[type=password]").forEach((input) => {
    const wrap = document.createElement("div");
    wrap.className = "password-wrap";
    input.parentNode.insertBefore(wrap, input);
    wrap.append(input);
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Show password");
    button.innerHTML = '<i data-lucide="eye" aria-hidden="true"></i>';
    wrap.append(button);
    button.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      button.setAttribute(
        "aria-label",
        input.type === "password" ? "Show password" : "Hide password",
      );
    });
  });
  function validate(form) {
    let first = null;
    $$("input,select,textarea", form).forEach((input) => {
      input.setCustomValidity("");
      if (
        input.name === "confirmPassword" &&
        input.value !== form.elements.password?.value
      )
        input.setCustomValidity("Passwords must match.");
      if (
        input.type === "tel" &&
        input.value &&
        !/^[+()\d\s.-]{7,25}$/.test(input.value)
      )
        input.setCustomValidity("Enter a valid phone number.");
      const invalid = !input.checkValidity();
      input.setAttribute("aria-invalid", String(invalid));
      let error = $(`#${input.id}-error`, form);
      if (!error && input.id) {
        error = document.createElement("small");
        error.className = "field-error";
        error.id = input.id + "-error";
        input.closest(".field")?.append(error);
      }
      if (error) {
        error.textContent = invalid
          ? input.validationMessage || "Please complete this field."
          : "";
        input.setAttribute("aria-describedby", error.id);
      }
      if (invalid && !first) first = input;
    });
    if (first) {
      first.focus();
      toast("Please check the highlighted fields.");
      return false;
    }
    return true;
  }
  window.UI.validate = validate;
  $$("input[type=date]").forEach((input) => {
    if (!input.closest(".toolbar")) input.min = GV.iso(new Date());
  });
  $$("form[data-form]").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate(form)) return;
      const values = Object.fromEntries(new FormData(form));
      const type = form.dataset.form;
      const result = $(".form-result", form);
      let message = "";
      if (type === "login" || type === "register") {
        if (type === "register") {
          GV.state.profile = {
            name: values.fullName,
            email: values.email,
            phone: values.phone,
          };
          if (!GV.save()) {
            result.textContent =
              "Browser storage is unavailable. profile could not be saved.";
            return;
          }
        }
        try {
          (values.remember ? localStorage : sessionStorage).setItem(
            "gv-session",
            "demo-client",
          );
        } catch {}
        location.href = root + "dashboard/client/index.html";
        return;
      }
      if (type === "forgot-password")
        message =
          "Reset request validated. No email was sent. Password reset is not connected.";
      else if (type === "newsletter") {
        message =
          "Your interest is saved in this browser for the . No subscription email was sent.";
        GV.state.enquiries.push({
          type: "newsletter",
          email: values.email || values.journalEmail || values.launchEmail,
          date: GV.iso(new Date()),
        });
      } else if (type === "comment") {
        GV.state.comments.push({
          name: values.commentName,
          comment: values.comment,
        });
        renderComments();
        message = "Your comment was added on this device.";
      } else if (type === "profile") {
        GV.state.profile = {
          name: values.fullName,
          email: values.email,
          phone: values.phone,
        };
        message = "Your profile has been updated.";
      } else if (type === "settings") {
        Object.assign(GV.state.settings, values);
        message = "preferences saved.";
      } else {
        GV.state.enquiries.push({ type, ...values, date: GV.iso(new Date()) });
        GV.state.messages.unshift({
          id: "m" + Date.now(),
          name: values.fullName,
          email: values.email,
          subject:
            type === "visit"
              ? "Venue visit request"
              : values.eventType || "Event enquiry",
          body: values.message,
          read: false,
        });
        message =
          type === "visit"
            ? "Visit request saved on this device. No appointment has been confirmed."
            : "Enquiry saved on this device. No email was sent. Find it in the admin inbox.";
      }
      const saved = GV.save();
      if (!saved)
        message =
          "Browser storage is unavailable. This action could not be saved.";
      if (result) result.textContent = message;
      toast(message);
      if (saved && !["profile", "settings"].includes(type)) form.reset();
    }),
  );
  function renderComments() {
    const list = $("[data-comments]");
    if (list)
      list.innerHTML = GV.state.comments
        .map(
          (c) =>
            `<article class="dashboard-panel"><h3>${esc(c.name)}</h3><p>${esc(c.comment)}</p><small>Local comment</small></article>`,
        )
        .join("");
  }
  renderComments();
  $$("[data-lightbox]").forEach((button) =>
    button.addEventListener("click", () => {
      const img = $("img", button);
      modal(
        img.alt,
        `<img class="lightbox-image" src="${esc(img.src)}" alt="${esc(img.alt)}">`,
      );
    }),
  );
  $$('[data-filter-target="gallery"] [data-filter]').forEach((button) =>
    button.addEventListener("click", () => {
      const value = button.dataset.filter;
      $$('[data-filter-target="gallery"] button').forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      let count = 0;
      $$(".gallery-grid .gallery-tile").forEach((tile) => {
        tile.hidden = value !== "All" && tile.dataset.category !== value;
        if (!tile.hidden) count++;
      });
      $("[data-gallery-status]").textContent =
        `${count} images in the collection.`;
      revealResults($(".gallery-grid"));
    }),
  );
  if ($("[data-hall-filters]")) {
    const filter = () => {
      const capacity = Number($("#capacity").value || 0),
        category = $("#eventFilter").value;
      let count = 0;
      $$(".hall-card").forEach((card) => {
        card.hidden =
          Number(card.dataset.capacity) < capacity ||
          (category && card.dataset.category !== category);
        if (!card.hidden) count++;
      });
      $("[data-filter-status]").textContent = count
        ? `${count} spaces match your celebration.`
        : "No spaces match these filters. Try a smaller capacity or another event type.";
    };
    $$("select", $("[data-hall-filters]")).forEach((input) =>
      input.addEventListener("change", () => {
        filter();
        revealResults($(".hall-grid")?.closest("section")?.querySelector(".section-heading"));
      }),
    );
    $("[data-reset-filters]").addEventListener("click", () => {
      $$("select", $("[data-hall-filters]")).forEach((i) => (i.value = ""));
      filter();
      revealResults($(".hall-grid")?.closest("section")?.querySelector(".section-heading"));
    });
  }
  if ($("[data-blog-grid]")) {
    let category = "All",
      page = 0;
    const update = () => {
      const term = $("#blogSearch").value.toLowerCase();
      const cards = $$(".blog-card");
      const matching = cards.filter(
        (c) =>
          (category === "All" || c.dataset.category === category) &&
          c.dataset.title.toLowerCase().includes(term),
      );
      const pages = Math.max(1, Math.ceil(matching.length / 3));
      page = Math.min(page, pages - 1);
      cards.forEach((c) => (c.hidden = true));
      matching.slice(page * 3, page * 3 + 3).forEach((c) => (c.hidden = false));
      $("[data-blog-status]").textContent = `${matching.length} stories found.`;
      $("[data-blog-page-label]").textContent = `Page ${page + 1} of ${pages}`;
      $(".pagination-controls").hidden = pages <= 1;
      $$("[data-blog-page]").forEach(
        (b) =>
          (b.disabled =
            Number(b.dataset.blogPage) < 0 ? page === 0 : page === pages - 1),
      );
    };
    $("#blogSearch").addEventListener("input", () => {
      page = 0;
      update();
    });
    $$('[data-filter-target="blog"] button').forEach((b) =>
      b.addEventListener("click", () => {
        category = b.dataset.filter;
        page = 0;
        $$('[data-filter-target="blog"] button').forEach((c) => {
          c.classList.toggle("active", c === b);
          c.setAttribute("aria-pressed", String(c === b));
        });
        update();
        revealResults($("[data-blog-grid]")?.parentElement.querySelector(".section-heading"));
      }),
    );
    $$("[data-blog-page]").forEach((b) =>
      b.addEventListener("click", () => {
        page += Number(b.dataset.blogPage);
        update();
        revealResults($("[data-blog-grid]")?.parentElement.querySelector(".section-heading"));
      }),
    );
    update();
  }
  function initCalendars() {
    $$("[data-calendar]").forEach((panel) => {
      if (panel.dataset.initialized) return;
      panel.dataset.initialized = "true";
      let displayed = new Date();
      displayed.setDate(1);
      let selected = "";
      function render() {
        const hall =
          $("#calendarHall")?.value ||
          $("input[name=hall]:checked")?.value ||
          String(new URLSearchParams(location.search).get("hall") || "0");
        $("[data-month-title]", panel).textContent =
          displayed.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
        const grid = $("[data-calendar-grid]", panel);
        grid.innerHTML =
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
            .map((day) => `<span class="day-label">${day}</span>`)
            .join("") + "<span></span>".repeat(displayed.getDay());
        const days = new Date(
          displayed.getFullYear(),
          displayed.getMonth() + 1,
          0,
        ).getDate();
        for (let day = 1; day <= days; day++) {
          const date = GV.iso(
            new Date(displayed.getFullYear(), displayed.getMonth(), day),
          );
          let status = GV.availability(date, hall);
          const capacity = Number($("#calendarCapacity")?.value || 0);
          if (
            capacity >
            (GV.state.halls.find((h) => h.id === hall)?.capacity || 0)
          )
            status = "Unavailable";
          const button = document.createElement("button");
          button.type = "button";
          button.textContent = day;
          button.className =
            (status === "Reserved"
              ? "reserved"
              : status === "Unavailable"
                ? "blocked"
                : "") + (selected === date ? " selected" : "");
          button.setAttribute("aria-label", `${date}, ${status}`);
          button.setAttribute("aria-pressed", String(date === selected));
          button.dataset.date = date;
          if (status !== "Available" && !panel.dataset.admin)
            button.disabled = true;
          button.addEventListener("click", () => {
            if (panel.dataset.admin) {
              const booking = GV.state.bookings.find(
                (b) =>
                  b.hall === hall &&
                  b.date === date &&
                  b.status !== "Cancelled",
              );
              if (booking) {
                modal(
                  "Reservation details",
                  `<p>${esc(booking.id)}${esc(booking.name)}</p><p>${esc(booking.event)}${esc(booking.status)}</p>`,
                );
                return;
              }
              if (date < GV.iso(new Date())) {
                toast("Past dates cannot be changed.");
                return;
              }
              const key = hall + ":" + date;
              const i = GV.state.blocked.indexOf(key);
              if (i >= 0) GV.state.blocked.splice(i, 1);
              else GV.state.blocked.push(key);
              GV.save();
              toast(i >= 0 ? "date unblocked." : "date blocked.");
            } else {
              selected = date;
              const input = $("#eventDate");
              if (input) {
                input.value = date;
                input.dispatchEvent(new Event("change", { bubbles: true }));
              }
              persist("gv-selected-date", date);
            }
            $("[data-selected-date]", panel).textContent =
              `${date} · ${GV.availability(date, hall)}`;
            render();
          });
          grid.append(button);
        }
      }
      $$("[data-month]", panel).forEach((button) =>
        button.addEventListener("click", () => {
          displayed.setMonth(
            displayed.getMonth() + Number(button.dataset.month),
          );
          render();
        }),
      );
      $$(
        "input[name=hall],#calendarHall,#calendarCapacity,#calendarEvent",
      ).forEach((input) =>
        input.addEventListener("change", () => {
          const event = $("#calendarEvent")?.value;
          if (event) {
            $("[data-selected-date]", panel).textContent =
              `${event} setup · availability is based on the hall's full-day reservations.`;
          }
          render();
        }),
      );
      $("#calendarMonth")?.addEventListener("change", (event) => {
        if (event.target.value) {
          displayed = new Date(event.target.value + "-01T12:00:00");
          render();
        }
      });
      panel.refreshCalendar = render;
      render();
    });
  }
  UI.initCalendars = initCalendars;
  initCalendars();
  const hallTitle = $("[data-hall-name]");
  if (hallTitle) {
    const h =
      GV.state.halls[
        Number(new URLSearchParams(location.search).get("hall")) || 0
      ] || GV.state.halls[0];
    hallTitle.textContent = h.name;
    $("[data-hall-capacity]").textContent = h.capacity;
    $("[data-hall-area]").textContent = h.area.toLocaleString();
    $("[data-hall-price]").textContent = money(h.price);
    const hallPhotos = ["hall-royal", "hall-crystal", "hall-imperial", "hall-heritage", "hall-pavilion", "hall-private"];
    const heroPhoto = $(".detail-hero-photo img");
    if (heroPhoto && Number(h.id) > 0) {
      heroPhoto.src = root + "assets/images/" + hallPhotos[Number(h.id)] + ".webp";
      heroPhoto.alt = h.name + ", celebration venue interior";
    }
    const bookingLink = $("a[data-hall-booking]");
    if (bookingLink) bookingLink.href = root + "pages/booking.html?hall=" + h.id;
    $$(".related-links a").forEach((link, index) => {
      const related = GV.state.halls.filter(item => String(item.id) !== String(h.id))[index];
      if (!related) return;
      link.href = root + "pages/hall-details.html?hall=" + related.id;
      $("h3", link).textContent = related.name;
      $("p", link).textContent = "Up to " + related.capacity + " guests";
    });
  }
  const countdown = $("[data-countdown]");
  if (countdown) {
    const tick = () => {
      const left = Math.max(
        0,
        Math.floor((new Date(countdown.dataset.countdown) - Date.now()) / 1000),
      );
      countdown.innerHTML = [
        [Math.floor(left / 86400), "DAYS"],
        [Math.floor(left / 3600) % 24, "HOURS"],
        [Math.floor(left / 60) % 60, "MINUTES"],
        [left % 60, "SECONDS"],
      ]
        .map(
          ([n, t]) =>
            `<div><strong>${String(n).padStart(2, "0")}</strong><span>${t}</span></div>`,
        )
        .join("");
    };
    tick();
    setInterval(tick, 1000);
  }

  if (
    location.pathname.endsWith("/blog-details.html") &&
    new URLSearchParams(location.search).has("article")
  ) {
    const variants = [
      {
        title: "The art of a beautiful reception table.",
        lead: "A memorable table makes every guest feel considered. Start with comfort, then bring the atmosphere together one thoughtful layer at a time.",
        heads: [
          "01. Start with the setting.",
          "02. Let the details connect.",
          "03. Make room for conversation.",
          "04. Finish with something personal.",
        ],
        paragraphs: [
          "Choose linens and tableware that complement the room. Warm ivory, soft textures and considered proportions make an elegant foundation.",
          "Repeat one or two colors across florals, stationery and napkins. A cohesive palette feels intentional without needing every detail to match.",
          "Keep arrangements at a height that lets guests see one another. Leave space for glassware, shared dishes and comfortable movement.",
          "A handwritten place card, a meaningful flower or a thoughtful favor can make an ordinary place setting feel entirely yours.",
        ],
      },
      {
        title: "A menu your guests will remember.",
        lead: "The best celebration menus bring people together. Balance your favorite flavors with thoughtful choices for every guest.",
        heads: [
          "01. Think about your guests.",
          "02. Plan the flow of the meal.",
          "03. Choose a few memorable moments.",
          "04. Share the practical details.",
        ],
        paragraphs: [
          "Collect dietary requirements early, including allergies. Discuss preparation and service with your catering team rather than assuming a dish is suitable.",
          "Consider the timing of arrival drinks, dinner and entertainment. A well-paced meal supports the whole celebration.",
          "A live station, a favorite family recipe or a carefully paired dessert can add personality without overcomplicating the menu.",
          "Confirm guest counts, service style, kitchen access and the final menu in writing. Ask how late changes will be handled.",
        ],
      },
      {
        title: "Small details. Extraordinary atmosphere.",
        lead: "Great atmosphere often comes from a few well-considered choices. Let lighting, sound and thoughtful transitions support the way you want the day to feel.",
        heads: [
          "01. Follow the light.",
          "02. Give each moment its own mood.",
          "03. Let the room breathe.",
          "04. Keep your guests comfortable.",
        ],
        paragraphs: [
          "Visit at your planned event time. Natural daylight, warm ambient lighting and candles can each create a different experience.",
          "Plan a gentle transition from arrival to dinner to dancing. Coordinate lighting and music cues with your event team.",
          "Choose a focal point and give it space. A beautiful stage or floral installation feels more considered when the rest of the room supports it.",
          "Test sound levels, accessible paths and seating. The most beautiful detail is a guest who feels completely at ease.",
        ],
      },
    ];
    const story =
      variants[Number(new URLSearchParams(location.search).get("article"))] ||
      variants[0];
    $(".page-intro h1").textContent = story.title;
    $(".article-lead").textContent = story.lead;
    const articleIndex = variants.indexOf(story);
    const articleImages = ["blog-tables", "blog-food", "blog-lights"];
    const articleCategories = ["STYLING / 6 MIN READ", "CATERING / 5 MIN READ", "PLANNING / 4 MIN READ"];
    const photo = $(".article-main > img");
    photo.src = root + "assets/images/" + articleImages[articleIndex] + ".webp";
    photo.alt = story.title;
    $(".page-intro .eyebrow").lastChild.textContent = articleCategories[articleIndex];
    $(".page-intro > .container > p:not(.eyebrow)").textContent = story.lead;
    $(".article-callout").textContent = ["Thoughtful details help every guest feel welcome.", "Share dietary requirements with your catering team early.", "Let lighting, sound and timing support the celebration."][articleIndex];
    $(".article-aside h3").textContent = ["Your styling checklist", "Your menu checklist", "Your atmosphere checklist"][articleIndex];
    const checklist = [["Comfortable place settings", "Consistent colors and textures", "Clear guest sightlines", "Space for shared dishes", "Personal finishing touches"],["Dietary requirements", "Service timing", "Seasonal ingredients", "Vegetarian options", "Catering confirmation"],["Ambient lighting", "Sound levels", "Guest arrival flow", "Entertainment timing", "Quiet spaces"]][articleIndex];
    $$(".article-aside .check-list li").forEach((li,i)=>li.textContent=checklist[i]);

    $$(".article-main h2").forEach((h, i) => (h.textContent = story.heads[i]));
    $$(".article-main h2").forEach((h, i) => {
      if (h.nextElementSibling?.tagName === "P")
        h.nextElementSibling.textContent = story.paragraphs[i];
    });
    document.title = story.title + " | The Grand Venue";
  }
  icons();
})();
