const fs = require("node:fs");
const path = require("node:path");
const C = require("./components.cjs");
const publicSite = require("./public.cjs");
const workspaces = require("./workspaces.cjs");
publicSite.home1();
publicSite.home2();
publicSite.publicPages();
workspaces.authPages();
workspaces.dashboardPages();
workspaces.utilityPages();
C.setPage("dashboard/client/new-booking.html");
const booking = publicSite.bookingSections(true);
fs.writeFileSync(
  "assets/js/workspace-markup.js",
  `/* Generated shared workflow markup. Edit scripts/public.cjs and rebuild. */\nwindow.GVBookingMarkup = ${JSON.stringify(booking)};\nwindow.GVCalendarMarkup = ${JSON.stringify(C.calendar(true))};\n`,
);
// Client calendars are interactive date selectors; only admin may block dates.
let dashboardJS = fs.readFileSync("assets/js/dashboard.js", "utf8");
if (!dashboardJS.includes("window.GVCalendarMarkup.replace")) {
  dashboardJS = dashboardJS.replace(
    "${window.GVCalendarMarkup}",
    "${admin?window.GVCalendarMarkup:window.GVCalendarMarkup.replace('data-admin=\"true\"','')}",
  );
  fs.writeFileSync("assets/js/dashboard.js", dashboardJS);
}
for (const role of ["client", "admin"])
  for (const name of fs.readdirSync(`dashboard/${role}`)) {
    const file = `dashboard/${role}/${name}`;
    let html = fs.readFileSync(file, "utf8");
    html = html.replace(
      '<script src="../../assets/js/dashboard.js"',
      '<script src="../../assets/js/workspace-markup.js" defer></script>\n<script src="../../assets/js/dashboard.js"',
    );
    fs.writeFileSync(file, html);
  }
const imageItems = require("./generated-images.json");
fs.writeFileSync(
  "documentation/image-inventory.md",
  "# Original image inventory\n\nAll " +
    imageItems.length +
    " photographs were generated with the built-in image-generation tool, then locally converted to WebP. No stock photography is used. Each photograph is used in exactly one page and one section. Shared vector brand marks are intentionally reused.\n\n| Image | Page | Alt text |\n|---|---|---|\n" +
    C.inventory.map((i) => `| ${i.file} | ${i.page} | ${i.alt} |`).join("\n") +
    "\n\n## Generation prompts\n\n" +
    imageItems
      .map(
        (i) =>
          `- **${i.name}**: ${i.prompt}. Premium realistic editorial photography, warm ivory, champagne and burgundy. No text or logos.`,
      )
      .join("\n") +
    "\n\nGenerated assets require review against applicable tool terms and destination marketplace requirements. Marketplace acceptance or exclusive resale rights are not guaranteed.\n",
);
const emblem = `<g fill="none" stroke="#c4a06a" stroke-width="1.6"><path d="M9 43V22a16 16 0 0 1 32 0v21M15 43V23a10 10 0 0 1 20 0v20M5 43h40M25 15v12m-7-4 7 6 7-6m-7 6v6"/><path d="m21 37 4-3 4 3"/></g>`;
for (const [file, color] of [
  ["logo.svg", "#641c35"],
  ["logo-light.svg", "#f8f4f0"],
])
  fs.writeFileSync(
    "assets/images/" + file,
    `<svg xmlns="http://www.w3.org/2000/svg" width="228" height="56" viewBox="0 0 228 56" role="img" aria-label="The Grand Venue">${emblem}<text x="58" y="20" fill="${color}" font-size="8" font-family="Arial,sans-serif" letter-spacing="3.5">THE</text><text x="57" y="40" fill="${color}" font-size="23" font-family="Georgia,serif">Grand Venue</text><path d="M59 49h161" stroke="#c4a06a" stroke-width=".6"/></svg>`,
  );
fs.writeFileSync(
  "assets/images/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#641c35"/><g transform="translate(7 7)">${emblem}</g></svg>`,
);
const publicFiles = [
  ...fs
    .readdirSync("pages")
    .filter((n) => n.endsWith(".html"))
    .map((n) => "pages/" + n),
];
fs.writeFileSync(
  "sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    publicFiles
      .map((file) => `  <url><loc>https://example.com/${file}</loc></url>`)
      .join("\n") +
    "\n</urlset>\n",
);
fs.writeFileSync(
  "robots.txt",
  "User-agent: *\nAllow: /\nDisallow: /dashboard/\nSitemap: https://example.com/sitemap.xml\n",
);
const manifest = {
  name: "The Grand Venue",
  short_name: "Grand Venue",
  start_url: "./index.html",
  display: "standalone",
  background_color: "#faf7f2",
  theme_color: "#641c35",
  icons: [
    { src: "assets/images/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "assets/images/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
};
fs.writeFileSync("manifest.webmanifest", JSON.stringify(manifest, null, 2));
C.setPage("documentation/legal.html");
C.write(
  "documentation/legal.html",
  "Privacy & Terms",
  C.intro(
    "A few important details.",
    "Privacy and terms for your celebration workspace.",
  ) +
    C.section(
      "Privacy",
      `<div class="dashboard-panel" id="privacy"><p>This workspace stores preferences, enquiries and booking requests in your browser. No forms send email or process payments. Clear site storage or use Reset local data in Settings to remove local records.</p><p>Avoid entering sensitive information. Business policies will be updated when services are connected.</p></div>`,
    ) +
    C.section(
      "Terms",
      `<div class="dashboard-panel" id="terms"><p>Pricing and availability are subject to venue confirmation. No real reservation, transaction or service agreement is created.</p><p>Contact the venue to confirm service, cancellation and payment terms.</p></div>`,
    ),
);
fs.writeFileSync(
  "documentation/page-structure.md",
  "# Page inventory\n\n" +
    [
      ...fs.readdirSync("pages").map((n) => "pages/" + n),
      ...["client", "admin"].flatMap((role) =>
        fs
          .readdirSync("dashboard/" + role)
          .map((n) => "dashboard/" + role + "/" + n),
      ),
    ]
      .map((f) => "- `" + f + "`")
      .join("\n") +
    "\n",
);
console.log(
  "Built 45 pages plus the legal information page. " +
    C.inventory.length +
    " unique photo placements.",
);

require("./root-home.cjs");
