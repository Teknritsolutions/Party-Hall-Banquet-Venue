const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const inventory = [];
let base = "";
let current = "";
const setPage = (file) => {
  current = file;
  base = "../".repeat(file.split("/").length - 1);
};
const href = (file) => base + file;
const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const link = (text, file, secondary = false) =>
  `<a class="btn ${secondary ? "btn-secondary" : "btn-primary"}" href="${href(file)}">${text}${icon("arrow-right")}</a>`;
const image = (name, alt, extra = "") => {
  inventory.push({ file: `assets/images/${name}.webp`, page: current, alt });
  return `<img src="${href(`assets/images/${name}.webp`)}" alt="${alt}" ${extra || 'loading="lazy"'} width="1200" height="800">`;
};
const label = (text) => `<p class="eyebrow"><span></span>${text}</p>`;
const heading = (title, sub = "", eyebrow = "THE GRAND VENUE") =>
  `<div class="section-heading">${label(eyebrow)}<h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>`;
const section = (title, body, sub = "", cls = "") =>
  `<section class="section ${cls}"><div class="container">${title ? heading(title, sub) : ""}${body}</div></section>`;
const features = (items, cls = "") =>
  `<div class="feature-grid ${cls}">${items.map(([ico, title, text]) => `<article class="feature"><span class="feature-icon">${icon(ico)}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
const split = (
  title,
  text,
  name,
  alt,
  reverse = false,
  eyebrow = "A PLACE TO REMEMBER",
  action = ["Discover our story", "pages/about.html"],
  checklist = ["Thoughtfully designed, beautifully delivered", "Your vision, with every detail considered", "A dedicated team from first visit to final toast"],
) =>
  `<div class="split ${reverse ? "reverse" : ""}"><div class="split-photo">${image(name, alt)}</div><div class="split-copy">${label(eyebrow)}<h2>${title}</h2><p>${text}</p><ul class="check-list">${checklist.map(item => `<li>${item}</li>`).join("")}</ul>${action ? link(...action) : ""}</div></div>`;
const cta = (title = "Your occasion. Our absolute attention.") =>
  `<div class="cta-panel"><div>${label("LET’S MAKE IT MEMORABLE")}<h2>${title}</h2><p>Every great celebration begins with a conversation. Let’s start yours.</p></div><div class="actions">${link("Book your event", "pages/booking.html")}${link("Get in touch", "pages/contact.html", true)}</div></div>`;
const field = (name, title, type = "text", placeholder = "", required = true) =>
  `<div class="field"><label for="${name}">${title}</label><input id="${name}" name="${name}" type="${type}" placeholder="${placeholder || `Enter your ${title.toLowerCase()}`}" ${required ? "required" : ""} ${type === "number" ? 'min="1"' : ""} ${type === "password" ? 'minlength="8" autocomplete="new-password"' : ""}><small class="field-error" id="${name}-error"></small></div>`;
const select = (name, title, options, required = true) =>
  `<div class="field"><label for="${name}">${title}</label><select name="${name}" id="${name}" ${required ? "required" : ""}><option value="">Select ${title.toLowerCase()}</option>${options.map((v, i) => `<option value="${v}">${v}</option>`).join("")}</select><small class="field-error" id="${name}-error"></small></div>`;
const form = (type = "enquiry", visit = false) =>
  `<form data-form="${type}" class="form-panel" novalidate><div class="form-grid">${field("fullName", "Full name")}${field("email", "Email address", "email")}${field("phone", "Phone number", "tel")}${select("eventType", "Event type", ["Wedding", "Engagement", "Birthday", "Corporate", "Anniversary", "Private celebration"])}${field("date", visit ? "Preferred visit date" : "Preferred event date", "date")}${field("guests", "Number of guests", "number", "Enter expected guest count", !visit)}<div class="field full"><label for="message">Your vision</label><textarea id="message" name="message" placeholder="Tell us about your celebration" rows="4" required></textarea><small class="field-error" id="message-error"></small></div></div><button class="btn btn-primary" type="submit">${visit ? "Request a venue visit" : "Send your enquiry"}${icon("arrow-right")}</button><p class="form-result" role="status"></p></form>`;
const faq = () =>
  `<div class="faq-list">${[
    [
      "Can we visit before booking?",
      "Of course. Use our visit request form to explore a enquiry. A real venue team would confirm your appointment.",
    ],
    [
      "What is included in a package?",
      "Venue hire, standard seating, catering and coordination are included according to your chosen tier. Explore the comparison for exact inclusions.",
    ],
    [
      "Can we customize our celebration?",
      "Yes. Add a floral stage, lighting, live food counters and more. All displayed prices are estimates.",
    ],
    [
      "How do payments work?",
      "The schedule uses a 30% initial installment, 40% planning installment and 30% final balance. No real payment is collected.",
    ],
  ]
    .map(
      ([q, a]) =>
        `<details><summary>${q}${icon("plus")}</summary><p>${a}</p></details>`,
    )
    .join("")}</div>`;
const halls = [
  ["Royal Grand Ballroom", 500, "8,000", "Wedding", "6,500"],
  ["Crystal Celebration Hall", 250, "4,200", "Engagement", "4,200"],
  ["Imperial Reception Hall", 350, "6,000", "Corporate", "5,200"],
  ["Heritage Banquet Suite", 150, "2,800", "Anniversary", "3,200"],
  ["Garden Celebration Pavilion", 200, "3,600", "Wedding", "3,800"],
  ["Intimate Private Hall", 60, "1,200", "Birthday", "1,800"],
];
const hallCards = (prefix = "hall", count = 6) =>
  `<div class="card-grid hall-grid">${halls
    .slice(0, count)
    .map(
      (h, i) =>
        `<article class="card hall-card" data-capacity="${h[1]}" data-category="${h[3]}"><a class="card-image" href="${href("pages/hall-details.html?hall=" + i)}">${image(`${prefix}-${["royal", "crystal", "imperial", "heritage", "pavilion", "private"][i]}`, `${h[0]}, an elegantly furnished celebration space`)}<span class="image-tag">${i === 0 ? "SIGNATURE SPACE" : h[3].toUpperCase()}</span></a><div class="card-body"><div class="card-meta">${icon("users")} Up to ${h[1]} guests <span></span> ${h[2]} sq ft</div><h3>${h[0]}</h3><p>${h[3]} celebrations, beautifully hosted. Climate control, premium sound and a dedicated host.</p><div class="card-bottom"><span>From <strong>$${h[4]}</strong><small> / event</small></span><a class="text-link" href="${href("pages/hall-details.html?hall=" + i)}" aria-label="View ${h[0]}">${icon("arrow-right")}</a></div></div></article>`,
    )
    .join("")}</div>`;
const pricing = () =>
  `<div class="card-grid pricing-grid">${[
    [
      "Essential Celebration",
      6500,
      "A beautiful beginning",
      [
        "Venue hire for 6 hours",
        "Standard table styling",
        "Buffet for 100 guests",
        "Dedicated event host",
      ],
    ],
    [
      "Signature Celebration",
      9800,
      "A little more extraordinary",
      [
        "Venue hire for 8 hours",
        "Signature floral styling",
        "Premium buffet for 150 guests",
        "Planning & day coordination",
      ],
    ],
    [
      "Royal Celebration",
      14500,
      "The complete grand experience",
      [
        "Exclusive venue for 12 hours",
        "Bespoke stage & premium styling",
        "Gourmet menu for 200 guests",
        "Full planning & entertainment",
      ],
    ],
  ]
    .map(
      ([name, p, desc, inc], i) =>
        `<article class="price-card ${i === 1 ? "popular" : ""}">${i === 1 ? '<span class="popular-label">MOST POPULAR</span>' : ""}<p class="eyebrow">0${i + 1} / THE COLLECTION</p><h3>${name}</h3><p>${desc}</p><p class="price">$${p.toLocaleString()}<small> / event</small></p><p class="form-note">Starting estimate</p><ul class="check-list">${inc.map((v) => `<li>${v}</li>`).join("")}</ul>${link("Choose this package", `pages/booking.html?package=${i}`, i !== 1)}</article>`,
    )
    .join("")}</div>`;
const comparison = () =>
  `<div class="table-wrap"><table><caption>Celebration package comparison · pricing</caption><thead><tr><th>Inclusion</th><th>Essential</th><th>Signature</th><th>Royal</th></tr></thead><tbody>${[
    ["Starting estimate", "$6,500", "$9,800", "$14,500"],
    ["Included guests", "100", "150", "200"],
    ["Venue time", "6 hours", "8 hours", "12 hours"],
    ["Styling", "Classic", "Signature floral", "Bespoke luxury"],
    ["Coordination", "Event host", "Day coordination", "Full planning"],
    ["Menu", "Buffet", "Premium buffet", "Gourmet menu"],
  ]
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
const calendar = (admin = false) =>
  `<div class="calendar-panel" data-calendar ${admin ? 'data-admin="true"' : ""}><div class="calendar-toolbar"><button class="icon-btn" data-month="-1" aria-label="Previous month">${icon("chevron-left")}</button><h3 data-month-title></h3><button class="icon-btn" data-month="1" aria-label="Next month">${icon("chevron-right")}</button></div><div class="calendar-grid" data-calendar-grid></div><div class="legend"><span>${icon("circle")}Available</span><span>${icon("circle-dot")}Reserved</span><span>${icon("circle-x")}Unavailable</span></div><p data-selected-date role="status">Choose a date to see availability.</p><p class="form-note">Availability is not live. ${admin ? "Select an available date to block or unblock it." : "Reservations are not live."}</p></div>`;
const utilities = () =>
  `<div class="utilities"><button class="icon-btn" data-theme-toggle aria-label="Toggle light and dark theme"><span class="theme-glyph theme-glyph-moon">${icon("moon")}</span><span class="theme-glyph theme-glyph-sun">${icon("sun")}</span></button><button class="icon-btn" data-rtl-toggle aria-label="Toggle right to left layout"><span data-direction-label>RTL</span></button></div>`;
function header() {
  const nav = [
    [
      "Home",
      [
        ["Home Page 1", "pages/home1.html"],
        ["Home Page 2", "pages/home2.html"],
      ],
    ],
    ["About Us", "pages/about.html"],
    [
      "Halls",
      [
        ["All Halls", "pages/halls.html"],
        ["Hall Details", "pages/hall-details.html"],
      ],
    ],
    ["Packages", "pages/packages.html"],
    [
      "Services",
      [
        ["All Services", "pages/services.html"],
        ["Service Details", "pages/service-details.html"],
      ],
    ],
    ["Gallery", "pages/gallery.html"],
    [
      "Blog",
      [
        ["Blog", "pages/blog.html"],
        ["Blog Details", "pages/blog-details.html"],
      ],
    ],
    ["Contact", "pages/contact.html"],
    [
      "Dashboard",
      [
        [
          "Client Dashboard",
          "dashboard/client/index.html",
          "Availability, bookings & installments",
          "layout-dashboard",
        ],
        [
          "Admin Dashboard",
          "dashboard/admin/index.html",
          "Venue management ",
          "settings-2",
        ],
      ],
    ],
  ];
  const navigation = nav
    .map(([title, target], index) => {
      if (!Array.isArray(target))
        return (
          '<a class="nav-link ' +
          (target === current ? "active" : "") +
          '" href="' +
          href(target) +
          '" ' +
          (target === current ? 'aria-current="page"' : "") +
          ">" +
          title +
          "</a>"
        );
      const id = "nav-menu-" + index;
      const isDashboard = title === "Dashboard";
      return (
        '<div class="nav-dropdown ' +
        (isDashboard ? "dashboard-dropdown" : "") +
        '"><button type="button" aria-expanded="false" aria-controls="' +
        id +
        '" class="nav-link ' +
        (target.some((t) => t[1] === current) ? "active" : "") +
        '" data-dropdown>' +
        title +
        icon("chevron-down") +
        '</button><div id="' +
        id +
        '" class="dropdown-panel">' +
        (isDashboard
          ? '<p class="dropdown-label">YOUR CELEBRATION, TOGETHER</p>'
          : "") +
        target
          .map(
            ([text, url, description, ico]) =>
              '<a href="' +
              href(url) +
              '" ' +
              (url === current ? 'aria-current="page"' : "") +
              ">" +
              (ico
                ? '<span class="dropdown-icon">' + icon(ico) + "</span>"
                : "") +
              "<span>" +
              text +
              (description ? "<small>" + description + "</small>" : "") +
              "</span></a>",
          )
          .join("") +
        "</div></div>"
      );
    })
    .join("");
  return (
    '<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="nav-container"><a class="brand" href="' +
    href("pages/home1.html") +
    '" aria-label="The Grand Venue home"><img src="' +
    href("assets/images/brand-mark.svg") +
    '" class="brand-emblem" width="44" height="50" alt=""><span class="brand-wordmark"><span class="brand-kicker">THE</span><span class="brand-name">Grand Venue</span></span></a><button class="nav-backdrop" data-menu-close aria-label="Dismiss navigation" tabindex="-1" hidden></button><nav class="public-nav" id="public-nav" aria-label="Main navigation"><div class="nav-drawer-heading"><div><span class="eyebrow">THE GRAND VENUE</span><p>Explore the venue</p></div><button class="icon-btn" data-menu-close aria-label="Close navigation">' +
    icon("x") +
    "</button></div>" +
    navigation +
    "<div class=\"nav-menu-preferences\"><span>Appearance &amp; direction</span><div class=\"utilities\"><button type=\"button\" class=\"icon-btn\" data-theme-toggle aria-label=\"Toggle light and dark theme\"><span class=\"theme-glyph theme-glyph-moon\"><i data-lucide=\"moon\" aria-hidden=\"true\"></i></span><span class=\"theme-glyph theme-glyph-sun\"><i data-lucide=\"sun\" aria-hidden=\"true\"></i></span></button><button type=\"button\" class=\"icon-btn\" data-rtl-toggle aria-label=\"Toggle right to left layout\"><span data-direction-label>RTL</span></button></div></div>" +
    '</nav><div class="header-actions"><div class="header-utilities">' +
    utilities() +
    '</div><a class="btn btn-primary header-login" href="' +
    href("pages/login.html") +
    '">Client login ' +
    icon("arrow-right") +
    '</a><button class="icon-btn menu-toggle" data-menu-toggle aria-label="Open navigation" aria-controls="public-nav" aria-expanded="false">' +
    icon("menu") +
    "</button></div></div></header>"
  );
}

function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="${href("pages/home1.html")}"><img src="${href("assets/images/logo-light.svg")}" alt="The Grand Venue" width="178" height="48"></a><p>A remarkable setting for life’s most meaningful moments. Thoughtful spaces. Exceptional celebrations.</p><div class="social-links"><a href="${href("pages/contact.html?channel=instagram")}" aria-label="Ask about our Instagram">${icon("instagram")}</a><a href="${href("pages/contact.html?channel=facebook")}" aria-label="Ask about our Facebook">${icon("facebook")}</a><a href="${href("pages/contact.html?channel=pinterest")}" aria-label="Ask about our Pinterest">${icon("camera")}</a></div></div><div><h3>Explore</h3>${[
    ["Our story", "about"],
    ["Our halls", "halls"],
    ["Packages", "packages"],
    ["The journal", "blog"],
  ]
    .map(([t, p]) => `<a href="${href("pages/" + p + ".html")}">${t}</a>`)
    .join("")}</div><div><h3>Celebrations</h3>${[
    ["Wedding planning", "service-details"],
    ["Catering & decor", "services"],
    ["Gallery", "gallery"],
    ["Contact us", "contact"],
  ]
    .map(([t, p]) => `<a href="${href("pages/" + p + ".html")}">${t}</a>`)
    .join(
      "",
    )}</div><div><h3>Let’s stay in touch</h3><form data-form="newsletter" novalidate><label class="visually-hidden" for="newsletterEmail">Email address</label><div class="newsletter"><input id="newsletterEmail" name="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Subscribe">${icon("arrow-right")}</button></div><p class="form-result" role="status"></p></form><address class="footer-contact"><a class="footer-contact-row" href="mailto:hello@example.com"><i data-lucide="mail" aria-hidden="true"></i><span>hello@example.com</span></a><a class="footer-contact-row" href="tel:+15550102026"><i data-lucide="phone" aria-hidden="true"></i><span dir="ltr">+1 (555) 010-2026</span></a><div class="footer-contact-row"><i data-lucide="map-pin" aria-hidden="true"></i><span>Venue address to be configured</span></div></address></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} The Grand Venue. All rights reserved.</span><div><a href="${href("documentation/legal.html#privacy")}">Privacy policy</a><a href="${href("documentation/legal.html#terms")}">Terms & conditions</a></div></div></div></footer>`;
}
function write(
  file,
  title,
  body,
  {
    layout = "public",
    description = `${title}. Explore thoughtfully designed banquet spaces and celebration experiences in The Grand Venue.`,
  } = {},
) {
  body = body.replace(/<section\b/g, "<!-- Content section -->\n<section");
  const output = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title} | The Grand Venue">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://example.com/${file}">
  <meta property="og:url" content="https://example.com/${file}">
  <link rel="manifest" href="${href("manifest.webmanifest")}">
  <meta name="theme-color" content="#641c35">
  <title>${title} | The Grand Venue</title>
  <link rel="icon" href="${href("assets/images/favicon.svg")}" type="image/svg+xml">
  <link rel="icon" href="${href("assets/images/favicon-32.png")}" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${href("assets/images/apple-touch-icon.png")}">
  <link rel="stylesheet" href="${href("assets/fonts/fonts.css")}">
  <link rel="stylesheet" href="${href("assets/vendor/bootstrap.min.css")}">
  <link rel="stylesheet" href="${href("assets/css/style.css")}">
  <link rel="stylesheet" href="${href("assets/css/typography.css")}">
  <link rel="stylesheet" href="${href("assets/css/spacing.css")}">
  <link rel="stylesheet" href="${href("assets/css/premium.css")}">
  ${layout === "dashboard" ? `<link rel="stylesheet" href="${href("assets/css/dashboard.css")}">` : ""}
  <script src="${href("assets/js/theme.js")}"></script>
${layout === "public" ? '<script type="application/ld+json">{"@context":"https://schema.org","@type":"EventVenue","name":"The Grand Venue","url":"https://example.com","description":"Venue information will be updated before reservations are accepted."}</script>' : ""}
</head>
<body class="${layout}-layout${file === "pages/home2.html" ? " home-two" : file === "pages/about.html" ? " about-page" : file === "pages/halls.html" ? " halls-page" : file === "pages/hall-details.html" ? " halls-page hall-detail-page" : file === "pages/services.html" ? " services-page" : file === "pages/service-details.html" ? " services-page service-detail-page" : file === "pages/blog.html" ? " blog-page" : file === "pages/blog-details.html" ? " blog-page article-page" : file === "pages/contact.html" ? " contact-page" : ""}" data-root="${base || "./"}">
${layout === "public" ? header() : ""}
<main id="main">${body}</main>
${layout === "public" ? footer() : ""}
<dialog id="site-dialog" aria-labelledby="dialog-title"><button class="icon-btn dialog-close" data-close-dialog aria-label="Close dialog">×</button><div id="dialog-content"></div></dialog>
<div class="toast-message" role="status" aria-live="polite"></div>
<script src="${href("assets/vendor/bootstrap.bundle.min.js")}" defer></script>
<script src="${href("assets/vendor/lucide.min.js")}" defer></script>
${layout === "dashboard" ? `<script src="${href("assets/vendor/chart.umd.js")}" defer></script>` : ""}
<script src="${href("assets/js/demo-data.js")}" defer></script>
<script src="${href("assets/js/main.js")}" defer></script>
<script src="${href("assets/js/booking.js")}" defer></script>
${layout === "dashboard" ? `<script src="${href("assets/js/dashboard.js")}" defer></script>` : ""}
</body>
</html>`;
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), output);
}
const intro = (title, sub, eyebrow = "CELEBRATE BEAUTIFULLY") =>
  `<section class="page-intro section${["about", "halls", "packages", "pricing", "services", "service-details", "gallery", "blog", "blog-details", "contact"].includes(path.basename(current, ".html")) ? " page-intro-photo" : ""}" data-hero="${path.basename(current, ".html")}"><div class="container">${label(eyebrow)}<h1>${title}</h1><p>${sub}</p><div class="breadcrumb"><a href="${href("pages/home1.html")}">Home</a><span>/</span><span>${current === "pages/about.html" ? "About Us" : current === "pages/halls.html" ? "All Halls" : current === "pages/services.html" ? "Services" : current === "pages/service-details.html" ? "Wedding Planning" : current === "pages/blog.html" ? "Blog" : current === "pages/blog-details.html" ? "Article" : current === "pages/contact.html" ? "Contact Us" : title}</span></div></div></section>`;
module.exports = {
  root,
  inventory,
  setPage,
  href,
  icon,
  link,
  image,
  label,
  heading,
  section,
  features,
  split,
  cta,
  field,
  select,
  form,
  faq,
  halls,
  hallCards,
  pricing,
  comparison,
  calendar,
  utilities,
  header,
  footer,
  write,
  intro,
};
