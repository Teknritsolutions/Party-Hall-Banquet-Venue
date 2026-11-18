/* Centralized browser-only demo data. No secrets or authentication credentials. */
(() => {
  const money = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  const today = new Date();
  const iso = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const plusDays = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return iso(d);
  };
  const hallNames = [
    "Royal Grand Ballroom",
    "Crystal Celebration Hall",
    "Imperial Reception Hall",
    "Heritage Banquet Suite",
    "Garden Celebration Pavilion",
    "Intimate Private Hall",
  ];
  const halls = hallNames.map((name, i) => ({
    id: String(i),
    name,
    capacity: [500, 250, 350, 150, 200, 60][i],
    area: [8000, 4200, 6000, 2800, 3600, 1200][i],
    price: [6500, 4200, 5200, 3200, 3800, 1800][i],
    amenities: "Parking, climate control, sound, private suite",
    enabled: true,
  }));
  const packages = [
    {
      id: "0",
      name: "Essential Celebration",
      price: 6500,
      guests: 100,
      inclusions: "Venue 6h, buffet, classic styling, event host",
    },
    {
      id: "1",
      name: "Signature Celebration",
      price: 9800,
      guests: 150,
      inclusions: "Venue 8h, premium buffet, floral styling, coordinator",
    },
    {
      id: "2",
      name: "Royal Celebration",
      price: 14500,
      guests: 200,
      inclusions: "Venue 12h, gourmet menu, bespoke stage, full planning",
    },
  ];
  const seedBookings = Array.from({ length: 24 }, (_, i) => {
    const month = i % 12;
    const date = new Date(today.getFullYear(), month, 10 + (i % 8));
    const total = [6500, 9800, 14500][i % 3];
    return {
      id: `GV-${today.getFullYear()}-${String(i + 1).padStart(4, "0")}`,
      hall: String(i % 6),
      event: ["Wedding", "Engagement", "Birthday", "Corporate", "Anniversary"][
        i % 5
      ],
      date: iso(date),
      time: "18:00–00:00",
      package: String(i % 3),
      guests: Math.min([100, 150, 200][i % 3], halls[i % 6].capacity),
      name: [
        "Olivia Bennett",
        "James Morgan",
        "Amelia Cole",
        "Ethan Brooks",
        "Charlotte Ellis",
        "Noah Parker",
      ][i % 6],
      email: `guest${i + 1}@example.com`,
      phone: "+1 555 010 2026",
      status: [
        "Confirmed",
        "Pending",
        "Completed",
        "Confirmed",
        "Cancelled",
        "Completed",
      ][i % 6],
      total,
      paid:
        i % 6 === 4
          ? 0
          : Math.round(total * (i % 6 === 2 || i % 6 === 5 ? 1 : 0.3)),
      catering: 0,
      decoration: 0,
      created: iso(date),
      client: i % 6 === 0 ? "demo-client" : `client-${i % 6}`,
    };
  });
  // Keep historical completion states and future events chronologically believable.
  seedBookings.forEach((booking, index) => {
    booking.email =
      ["olivia", "james", "amelia", "ethan", "charlotte", "noah"][index % 6] +
      "@example.com";
    booking.status =
      index % 11 === 0
        ? "Cancelled"
        : booking.date < iso(today)
          ? "Completed"
          : "Confirmed";
    booking.paid =
      booking.status === "Cancelled"
        ? 0
        : Math.round(
            booking.total * (booking.status === "Completed" ? 1 : 0.3),
          );
    const created = new Date(booking.date + "T12:00:00");
    created.setDate(created.getDate() - 90);
    booking.created = iso(created);
  });
  Object.assign(seedBookings[0], {
    date: plusDays(42),
    created: plusDays(-20),
    status: "Confirmed",
    paid: 1950,
  });
  Object.assign(seedBookings[11], {
    date: plusDays(21),
    created: iso(today),
    status: "Pending",
    paid: 0,
  });
  Object.assign(seedBookings[23], {
    date: plusDays(65),
    created: plusDays(-10),
    status: "Confirmed",
    paid: 4350,
  });
  const defaults = {
    version: 1,
    bookings: seedBookings,
    halls,
    packages,
    catering: [
      { id: "0", name: "Vegetarian buffet", price: 28, unit: "guest" },
      { id: "1", name: "Non-vegetarian buffet", price: 36, unit: "guest" },
      { id: "2", name: "Live counters", price: 1800, unit: "station" },
      { id: "3", name: "Dessert stations", price: 650, unit: "station" },
      { id: "4", name: "Beverage service", price: 18, unit: "guest" },
    ],
    decorations: [
      { id: "0", name: "Floral stage", price: 1200, unit: "setup" },
      { id: "1", name: "Premium lighting", price: 800, unit: "setup" },
      { id: "2", name: "Entrance decoration", price: 550, unit: "setup" },
      { id: "3", name: "Table centerpieces", price: 65, unit: "table" },
      { id: "4", name: "Theme decoration", price: 1500, unit: "setup" },
    ],
    profile: {
      name: "Olivia Bennett",
      email: "olivia@example.com",
      phone: "+1 555 010 2026",
    },
    settings: {
      venue: "The Grand Venue",
      email: "hello@example.com",
      hours: "10:00–18:00",
      notice: 7,
      currency: "USD",
    },
    notifications: [
      {
        id: "n1",
        title: "Your celebration is on the horizon",
        body: "Review the details for your upcoming event.",
        read: false,
      },
      {
        id: "n2",
        title: "Planning installment reminder",
        body: "Your next installment is ready to review.",
        read: false,
      },
      {
        id: "n3",
        title: "Your package details are ready",
        body: "Explore your selected menu and styling options.",
        read: true,
      },
    ],
    messages: [
      {
        id: "m1",
        name: "Amelia Cole",
        email: "amelia@example.com",
        subject: "A September wedding",
        body: "We are planning a reception for 150 guests. Could we arrange a venue visit and discuss your Signature package?",
        read: false,
      },
      {
        id: "m2",
        name: "Ethan Brooks",
        email: "ethan@example.com",
        subject: "Annual team celebration",
        body: "We would love to explore a dinner for our team with a short awards presentation. Please share corporate options.",
        read: false,
      },
      {
        id: "m3",
        name: "Noah Parker",
        email: "noah@example.com",
        subject: "Anniversary dinner",
        body: "We are looking for an intimate space for 60 guests, with a bespoke dinner menu.",
        read: true,
      },
    ],
    blocked: [],
    addons: { catering: {}, decorations: {} },
    enquiries: [],
    comments: [],
  };
  const escape = (text) =>
    String(text ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  function valid(data) {
    if (!data || data.version !== 1) return false;
    if (
      ![
        "bookings",
        "halls",
        "packages",
        "catering",
        "decorations",
        "notifications",
        "messages",
        "blocked",
        "enquiries",
        "comments",
      ].every((key) => Array.isArray(data[key]) && data[key].length < 2000)
    )
      return false;
    if (!data.profile || !data.settings || !data.addons) return false;
    if (
      !["name", "email", "phone"].every(
        (key) => typeof data.profile[key] === "string",
      )
    )
      return false;
    if (
      !data.notifications.every(
        (n) =>
          n &&
          typeof n.id === "string" &&
          typeof n.title === "string" &&
          typeof n.body === "string" &&
          typeof n.read === "boolean",
      )
    )
      return false;
    if (
      !data.messages.every(
        (m) =>
          m &&
          typeof m.id === "string" &&
          typeof m.name === "string" &&
          typeof m.email === "string" &&
          typeof m.subject === "string" &&
          typeof m.body === "string",
      )
    )
      return false;
    if (
      !data.blocked.every(
        (d) => typeof d === "string" && /^.{1,40}:\d{4}-\d{2}-\d{2}$/.test(d),
      )
    )
      return false;
    if (
      !["catering", "decorations"].every(
        (kind) =>
          data.addons[kind] &&
          typeof data.addons[kind] === "object" &&
          !Array.isArray(data.addons[kind]) &&
          data[kind].every(
            (item) =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.unit === "string" &&
              Number.isFinite(item.price) &&
              item.price >= 0,
          ),
      )
    )
      return false;
    return (
      data.bookings.every(
        (b) =>
          b &&
          typeof b.id === "string" &&
          typeof b.name === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
          Number.isFinite(b.total) &&
          Number.isFinite(b.paid) &&
          b.total >= 0 &&
          b.paid >= 0 &&
          b.paid <= b.total &&
          typeof b.status === "string" &&
          typeof b.hall === "string" &&
          typeof b.package === "string",
      ) &&
      data.halls.every(
        (h) => h && typeof h.name === "string" && Number.isFinite(h.capacity),
      ) &&
      data.packages.every(
        (p) => p && typeof p.name === "string" && Number.isFinite(p.price),
      )
    );
  }
  let state = structuredClone(defaults);
  try {
    const parsed = JSON.parse(localStorage.getItem("gv-demo-v1") || "null");
    if (valid(parsed)) state = parsed;
  } catch {}
  const save = () => {
    try {
      localStorage.setItem("gv-demo-v1", JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  };
  const clientBookings = () =>
    state.bookings.filter((b) => b.client === "demo-client");
  function availability(date, hall = "0") {
    if (
      date < iso(new Date()) ||
      !state.halls.find((h) => h.id === String(hall))?.enabled
    )
      return "Unavailable";
    if (state.blocked.includes(`${hall}:${date}`)) return "Unavailable";
    if (
      state.bookings.some(
        (b) =>
          b.hall === String(hall) &&
          b.date === date &&
          b.status !== "Cancelled",
      )
    )
      return "Reserved";
    const d = Number(date.slice(-2));
    return d % 13 === 0
      ? "Unavailable"
      : d % 7 === 0
        ? "Reserved"
        : "Available";
  }
  window.GV = {
    get state() {
      return state;
    },
    save,
    defaults,
    valid,
    money,
    escape,
    iso,
    plusDays,
    clientBookings,
    availability,
    reset() {
      state = structuredClone(defaults);
      return save();
    },
  };
})();
