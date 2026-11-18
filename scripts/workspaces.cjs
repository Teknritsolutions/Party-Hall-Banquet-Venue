const C = require("./components.cjs");
const {
  setPage,
  href,
  icon,
  link,
  image,
  label,
  field,
  select,
  utilities,
  write,
} = C;
function authPages() {
  for (const [slug, title, photo] of [
    ["login", "Welcome back.", "login"],
    ["register", "Your next chapter starts here.", "register"],
    ["forgot-password", "A fresh beginning.", "forgot"],
  ]) {
    const file = `pages/${slug}.html`;
    setPage(file);
    let fields = "";
    if (slug === "register")
      fields =
        field("fullName", "Full name") +
        field("email", "Email address", "email") +
        field("phone", "Phone number", "tel") +
        field("password", "Password", "password") +
        field("confirmPassword", "Confirm password", "password") +
        `<label class="check-label"><input name="terms" type="checkbox" required> I agree to the <a href="${href("documentation/legal.html#terms")}">terms</a>.</label>`;
    else if (slug === "login")
      fields =
        field("email", "Email address", "email") +
        field("password", "Password", "password") +
        `<div class="auth-links"><label><input type="checkbox" name="remember"> Remember my session</label><a href="${href("pages/forgot-password.html")}">Forgot password?</a></div>`;
    else fields = field("email", "Email address", "email");
    const submit =
      slug === "login"
        ? "Open client workspace"
        : slug === "register"
          ? "Create a profile"
          : "Request password reset";
    const form = `<form data-form="${slug}" novalidate>${fields}<button class="btn btn-primary" type="submit">${submit}${icon("arrow-right")}</button><p class="form-result" role="status"></p><p class="form-note">${slug === "forgot-password" ? "Password reset is not connected. No reset email is sent." : "Sign-in is not connected to an account service. Passwords are not stored."}</p></form>`;
    write(
      file,
      slug === "login"
        ? "Login"
        : slug === "register"
          ? "Register"
          : "Forgot Password",
      `<div class="auth-shell"><div class="auth-art">${image(photo, "Warm ivory and champagne banquet venue interior", 'loading="eager"')}<div class="auth-art-copy">${label("A PLACE FOR YOUR NEXT CHAPTER")}<h2>Beautiful moments<br>begin here.</h2><p>Every celebration starts with a little possibility.</p></div></div><div class="auth-form"><div class="auth-top"><a class="brand" href="${href("pages/home1.html")}"><img src="${href("assets/images/logo.svg")}" alt="The Grand Venue" width="178" height="48"></a>${utilities()}</div><h1>${title}</h1><p>${slug === "forgot-password" ? "Enter your email to review password reset options." : "A thoughtful space for all your celebration details."}</p>${form}<div class="auth-links">${slug === "login" ? `<span>New here? <a href="${href("pages/register.html")}">Create a profile</a></span><a href="${href("dashboard/admin/index.html")}">Admin workspace</a>` : `<span>Already have a profile? <a href="${href("pages/login.html")}">Return to login</a></span>`}</div><a class="text-link" href="${href("pages/home1.html")}">${icon("arrow-left")} Back to the venue</a></div></div>`,
      { layout: "auth" },
    );
  }
}
const clientNav = [
  ["index", "Overview", "layout-dashboard"],
  ["availability", "Hall Availability", "calendar-days"],
  ["bookings", "My Bookings", "calendar-check"],
  ["new-booking", "New Booking", "circle-plus"],
  ["catering", "Catering Add-ons", "utensils"],
  ["decorations", "Decoration Add-ons", "flower-2"],
  ["payments", "Payment Installments", "credit-card"],
  ["invoices", "Invoices", "receipt-text"],
  ["notifications", "Notifications", "bell"],
  ["profile", "Profile", "user-round"],
  ["settings", "Settings", "settings-2"],
];
const adminNav = [
  ["index", "Overview", "layout-dashboard"],
  ["bookings", "Bookings", "calendar-check"],
  ["halls", "Hall Management", "landmark"],
  ["calendar", "Availability Calendar", "calendar-days"],
  ["packages", "Packages", "package"],
  ["catering", "Catering Management", "utensils"],
  ["decorations", "Decoration Management", "flower-2"],
  ["clients", "Client Management", "users"],
  ["payments", "Payments", "credit-card"],
  ["messages", "Messages", "mail"],
  ["reports", "Reports & Analytics", "chart-no-axes-combined"],
  ["notifications", "Notifications", "bell"],
  ["settings", "Settings", "settings-2"],
];
function dashboardPages() {
  for (const [role, nav] of [
    ["client", clientNav],
    ["admin", adminNav],
  ])
    for (const [slug, title] of nav) {
      const file = `dashboard/${role}/${slug}.html`;
      setPage(file);
      const sidebar = `<aside class="sidebar" id="dashboard-sidebar"><a class="brand" href="${href("pages/home1.html")}"><img src="${href("assets/images/logo-light.svg")}" alt="The Grand Venue" width="178" height="48"></a><p class="sidebar-label">${role === "admin" ? "VENUE MANAGEMENT" : "YOUR CELEBRATION"}</p><nav aria-label="${role} dashboard">${nav.map(([s, t, ico]) => `<a href="${s}.html" class="${s === slug ? "active" : ""}" ${s === slug ? 'aria-current="page"' : ""}>${icon(ico)}${t}</a>`).join("")}<a href="${href("pages/login.html")}" data-logout>${icon("log-out")}Logout</a></nav><div class="sidebar-footer">Thoughtfully hosted.<br>Beautifully remembered.<br><a href="${href("pages/home1.html")}">← Visit the website</a></div></aside>`;
      const body = `<div class="dashboard-shell" data-role="${role}" data-screen="${slug}">${sidebar}<div class="dashboard-main"><header class="dashboard-topbar"><button class="icon-btn dashboard-menu" data-sidebar-toggle aria-expanded="false" aria-controls="dashboard-sidebar" aria-label="Toggle dashboard navigation">${icon("menu")}</button><span class="topbar-title">${role === "admin" ? "Venue workspace" : "Your celebration workspace"} <span> / ${title}</span></span><div class="topbar-actions">${utilities()}<a class="icon-btn" href="notifications.html" aria-label="View notifications">${icon("bell")}</a><a href="${role === "admin" ? "settings" : "profile"}.html" class="topbar-avatar"><span class="avatar">${role === "admin" ? "A" : "O"}</span><span>${role === "admin" ? "Alex Morgan<br>Venue administrator" : "Olivia Bennett<br>Celebration client"}</span>${icon("chevron-down")}</a></div></header><div class="dashboard-content"><div class="dashboard-heading"><div>${label(role === "admin" ? "THE GRAND VENUE / ADMIN" : "THE GRAND VENUE / CLIENT")}<h1>${slug === "index" ? (role === "admin" ? "A grand day, at a glance." : "Welcome back, Olivia.") : title}</h1><p>${role === "admin" ? "The details behind every beautiful celebration." : "Your plans, your details, your next unforgettable moment."}</p></div>${link(role === "admin" ? "View the venue" : "Plan a celebration", role === "admin" ? "pages/home1.html" : "dashboard/client/new-booking.html")}</div><div id="dashboard-view"><p>Preparing your workspace…</p></div><noscript>This requires JavaScript for dashboard data and interactions.</noscript><p class="copyright-note">© 2026 The Grand Venue &middot; ${role === "admin" ? "Admin" : "Client"} workspace</p></div></div></div>`;
      write(file, `${role === "admin" ? "Admin" : "Client"} — ${title}`, body, {
        layout: "dashboard",
      });
    }
}
function utilityPages() {
  for (const [slug, title, text] of [
    [
      "404",
      "A little off the beaten path.",
      "The page you’re looking for may have moved. Let’s get you back to something beautiful.",
    ],
    [
      "coming-soon",
      "Something grand is on its way.",
      "A new chapter in celebration is taking shape. Be the first to hear about it.",
    ],
  ]) {
    const file = `pages/${slug}.html`;
    setPage(file);
    const graphic =
      slug === "404"
        ? '<div class="utility-number">404</div>'
        : slug === "coming-soon"
          ? image(
              "coming",
              "Grand brass venue doors at dusk",
              'class="coming-art" loading="eager"',
            )
          : `<div class="utility-number">${icon("sparkles")}</div>`;
    const extra =
      slug === "coming-soon"
        ? `<div class="countdown" data-countdown="2027-06-01T10:00:00-04:00"></div><form data-form="newsletter" novalidate>${field("launchEmail", "Email address", "email")}<button class="btn btn-primary" type="submit">Keep me in the loop</button><p class="form-result" role="status"></p></form><p class="form-note">Subscriptions are saved on this device. No email is sent.</p>`
        : "";
    write(
      file,
      title,
      `<div class="utility-page">${utilities()}<a class="brand" href="${href("pages/home1.html")}"><img src="${href("assets/images/logo.svg")}" alt="The Grand Venue" width="178" height="48"></a>${graphic}${label("THE GRAND VENUE")}<h1>${title}</h1><p>${text}</p>${extra}<div class="actions">${link("Back to the venue", "pages/home1.html")}${link("Get in touch", "pages/contact.html", true)}</div></div>`,
      { layout: "utility" },
    );
  }
}
module.exports = { authPages, dashboardPages, utilityPages };
