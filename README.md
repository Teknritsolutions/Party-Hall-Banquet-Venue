# The Grand Venue

A complete local HTML template for a party hall and banquet venue, with classic and modern homepages, public pages, separate authentication screens, and client and admin workspaces. All venue identities, testimonials, team members, prices and reservations are illustrative.

## Preview

From this folder, run `npm start` (or `node scripts/serve.cjs`) and open **http://127.0.0.1:4173**. No dependency installation is needed to preview: Bootstrap, Chart.js, Lucide, fonts, and photographs are local.

- Classic homepage: `/index.html` (opens `/pages/home1.html`)
- Modern homepage: `/pages/home2.html`
- Client workspace: `/dashboard/client/index.html`
- Admin workspace: `/dashboard/admin/index.html`
- Login demo: `/pages/login.html`

The dashboards are deliberately public demonstrations. There are no real credentials. Use fictional details when trying forms. Passwords are never stored.

## GitHub Pages deployment

Push to `main` to run `.github/workflows/deploy-pages.yml`. The workflow publishes the existing static files without rebuilding the edited pages. The root `index.html` opens Home 1 automatically.

Live site: https://teknritsolutions.github.io/Party-Hall-Banquet-Venue/

If GitHub Pages requires manual setup, open repository Settings → Pages and select **GitHub Actions** as the source, then rerun the deployment workflow.

## Folder structure

```text
Party Hall & Banquet Venue/
├── pages/home1.html, pages/home2.html
├── pages/                       20 homepage, public, auth and utility pages
├── dashboard/
│   ├── client/                  11 complete screens
│   └── admin/                   13 complete screens
├── assets/
│   ├── css/style.css            shared responsive design system
│   ├── js/                      interactions, demo store, booking, charts
│   ├── images/                  54 unique generated WebP photos and branding
│   ├── fonts/                   local Inter and Playfair Display + OFL texts
│   └── vendor/                  Bootstrap 5, Chart.js, Lucide + licenses
├── scripts/                     page generator and local server
├── tests/                       browser checks, screenshots, CSV/PDF samples
├── documentation/               guides, inventory, credits and QA evidence
├── package.json
├── manifest.webmanifest
├── sitemap.xml
└── robots.txt
```

## Completed page inventory

**Public:** Home 1, Home 2, About, Halls, Hall Details, Packages, Services, Service Details, Gallery, Blog, Blog Details, Contact, Booking, Booking Confirmation, Pricing.

**Authentication and utility:** Login, Register, Forgot Password, 404, Coming Soon. A separate legal-information page supplies demo privacy and terms notices.

**Client:** Overview, Hall Availability, My Bookings, New Booking, Catering Add-ons, Decoration Add-ons, Payment Installments, Invoices, Notifications, Profile, Settings. Logout clears the demo session marker and returns to Login.

**Admin:** Overview, Bookings, Hall Management, Availability Calendar, Packages, Catering Management, Decoration Management, Client Management, Payments, Messages, Reports & Analytics, Notifications, Settings. Logout returns to Login.

Both homepages contain exactly **10 main sections**. Other major public pages contain **5 or 6**. There are **44 required pages**, plus the legal-information page.

## Features

Burgundy/champagne design tokens; local Inter and Playfair Display; original arch/chandelier emblem; SVG and PNG favicons and 180/192/512px icons; persisted light/dark and LTR/RTL preferences; responsive menus; hall filters; gallery filters and keyboard-accessible native-dialog lightbox; searchable and paginated journal; validated local enquiry and subscription forms; six-stage booking flow; simulated payment installments; printable invoices with browser PDF saving; editable demo profiles, halls, packages and add-ons; enquiry inbox and local reply drafts; notification read states; reports with date filters and CSV export.

Eight admin Chart.js charts and four client charts derive from the same booking records as KPI cards and tables: monthly received revenue, monthly bookings, event categories, booking statuses paid/outstanding balances, hall popularity, package selection and guest volume. Revenue is allocated to event month for this illustrative data model. Non-cancelled reservations contribute to payment totals.

## Development

The delivered HTML files are the ready-to-use output. To regenerate from reusable source components, run `npm run build`. Page definitions are in `scripts/public.cjs`, `scripts/workspaces.cjs` and `scripts/components.cjs`. Keep content edits in those sources when using the generator, because rebuilding overwrites generated HTML.

To run the browser test tools on another machine, run `npm install`, install Google Chrome, start the preview server, then run `npm test`, `npm run test:workflows`, and `npm run test:responsive`. The original workstation also has a fallback to a preinstalled Playwright copy; a normal local installation takes precedence. Browser tests create their own isolated profiles and do not change your real browser data.

`npm run format` formats development source. Third-party vendor files are intentionally kept as upstream distributions. There is no runtime bundler, external CDN or production API requirement. For distribution, deploy the HTML, assets, manifest, robots and sitemap; omit development scripts and test artifacts if desired. Configure your host's custom 404 page to `/pages/404.html`.

## Demo boundaries and launch requirements

Bookings, enquiries, preferences and sample payments persist on the current browser only. Local storage is safely parsed and checked against a versioned schema, with sample-data recovery when corrupt. Dashboard edits are demo records, not an online CMS for the static brochure pages. Add-on selections in the client planning screens are separate saved estimates; the booking workflow has its own explicit enhancements. No reservation, payment, email, subscription, password reset or message delivery is performed by an external service.

Production requires secure backend authentication and authorization, server-side availability and booking validation, a payment provider, email delivery, a real map/address, reviewed legal policies, real business metadata and canonical URLs. See [integrations](documentation/integrations.md).

Generated imagery was actually produced with the built-in image-generation tool and optimized to WebP. Each photograph appears in exactly one page and section; brand vectors are intentionally shared. See [image inventory](documentation/image-inventory.md), [credits](documentation/credits.md) and [testing report](documentation/testing-report.md). Marketplace approval and asset resale eligibility require your own review; they are not guaranteed.

## Header update — 1.0.1

The public header now has a single aligned row, clear client login, and a Dashboard dropdown. On smaller screens it becomes a navigation drawer with the same destinations and display controls. Client Dashboard provides hall availability, event-date booking, catering/decor enhancement estimates, payment installments and invoices. See documentation/header-refinement.md for the reference and verification notes.

## Typography and header update — 1.0.2

The latest update follows the Baby & Kids Clothing reference's typography hierarchy and header behavior. The entire template uses 16px body/form text, 15px navigation, 50px desktop/32px mobile major section headings, 20–24px content titles, and 12–14px supporting/interface text. Public hero text responds from approximately 74px at 1440px to 42px at 390px. Playfair Display and Inter remain the two brand fonts.

The header is sticky, opens desktop dropdowns on hover or click, supports keyboard navigation, and opens a full-width mobile menu immediately below the header. Client login and Dashboard access remain available. The canonical size tokens and role rules are in assets/css/typography.css; they apply to all generated public, authentication, utility and dashboard pages. See documentation/typography-and-header.md.

## Header polish — 1.0.3

Navigation gaps are now 20px on smaller desktops, 28px on standard desktops and 34px on wide screens. The header brand is live text (up to 27px) beside the original venue emblem, with an explicit light/dark treatment. Theme buttons now show a moon in light mode and a sun in dark mode. Theme and direction controls share rounded ivory/charcoal surfaces, brand-colored icons, hover/focus feedback, tooltips and pressed states.

## Consistent section spacing — 1.0.6

All public content sections now share 80px vertical padding on desktop, 64px on tablet and 48px on mobile. Workspace panels use a consistent 24px gap, including chart grids without doubled margins. The homepage celebration badge has balanced padding, an inset gold border and labels that fit inside its circle at every tested width. Shared spacing values are in assets/css/spacing.css.

Version 1.0.7: Premium bordered cards, framed line icons and cleaner interface copy. See documentation/premium-refinement.md.


## Keeping the workspace tidy

Store visual review captures in `tests/screenshots/reviews/`; keep runtime images in `assets/images/`. Keep QA outputs under `tests/`, guides under `documentation/`, and distribution archives under `release/`. The project root contains website entry points and project configuration.

## Dashboard design

Client and admin workspaces use a shared dashboard stylesheet, aligned cards, responsive chart grids, and a four-stage reservation workflow. Booking filters update their charts; payment graphs and report totals use the shared reservation store. See [dashboard design](documentation/dashboard-design.md).
