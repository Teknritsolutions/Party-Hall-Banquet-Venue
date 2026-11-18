# Customization

## Branding and tokens

Edit assets/css/style.css for the two brand colors, supporting neutrals, spacing, typography, focus and theme tokens. Primary is #641C35 and secondary is #C4A06A. Avoid blue/green accents. Logical properties support RTL. Inter and Playfair Display are locally hosted in assets/fonts with OFL license texts.

The arch/chandelier logo is original SVG. Replace logo.svg and logo-light.svg together and regenerate favicon-32.png, apple-touch-icon.png, icon-192.png and icon-512.png if changing the emblem. The generated brand vectors originate in scripts/build.cjs; update that source too if rebuilding. If adding non-Latin text, supply appropriate locally licensed font subsets; system fallbacks handle Arabic/Hebrew but the English demo is not a translation.

## Pages

Edit scripts/public.cjs for public content, scripts/workspaces.cjs for authentication/dashboard shells, and scripts/components.cjs for shared navigation, footer, cards and forms. Run npm run build to regenerate HTML. Keep exactly ten sections on each homepage. Direct HTML edits are possible but will be overwritten by a build.

The image inventory lists all 54 photographs and their unique placement. Replacements must remain subject-appropriate, locally stored, optimized and individually licensed. Preserve descriptive alt text. Photos use object-fit with consistent component aspect ratios. The hero loads eagerly; below-fold images load lazily.

## Demo data and dashboards

assets/js/demo-data.js defines the initial records, validation, currency formatting and localStorage namespace gv-demo-v1. assets/js/dashboard.js renders workspaces, management forms, charts and reports. assets/js/booking.js handles estimates and booking submission. Packages use $6,500, $9,800 and $14,500; venue-only prices are not charged again on top of packages.

Admin editing changes browser-local demo records. Existing bookings keep their original financial snapshot, which preserves invoice and payment consistency. Static brochure content remains author-controlled source content; connect a CMS/API to synchronize it in production.

Use Settings > Reset local demo data to restore sample records. Theme and direction are stored separately under gv-theme and gv-direction. No password is persisted. Sample identities and demo copy must be replaced only when verified real information is available.

## Browser support

The implementation uses CSS Grid, logical properties, native dialog, :has() and modern ES6+ JavaScript. Current evergreen browsers are the target. Chrome was used for automated verification; separate Safari/Firefox testing is recommended before marketplace submission. No Lighthouse score or full accessibility certification is claimed.

## Shared typography presets (1.0.2)

Edit assets/css/typography.css for the final typography tokens and semantic role rules. It is loaded after style.css on all 46 HTML files. Use --text-body, --text-interface, --text-navigation, --text-caption, --text-hero, --text-page-title, --text-section-title and --text-card-title. Responsive values are centralized instead of editing individual page markup. The shared component generator includes this stylesheet when rebuilding. Header interaction behavior is in assets/js/main.js; the compact navigation breakpoint is 1280px to accommodate all venue destinations at a readable 15px.

## Shared spacing presets (1.0.6)

assets/css/spacing.css loads after typography.css. Change --section-space for public section padding, --section-heading-space for title-to-content rhythm, --content-space for in-section compositions and --workspace-space for dashboard block gaps. The public token responds at 1023px and 767px. Apply shared classes rather than page-specific section margins.
