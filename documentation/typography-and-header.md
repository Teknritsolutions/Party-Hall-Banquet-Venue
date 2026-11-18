# Typography and header refinement — 1.0.2

The supplied Baby & Kids Clothing reference was inspected live in Chrome on its homepage, About, Shop and Contact pages. Desktop/mobile screenshots, computed font measurements and interaction observations are saved in the reference JSON evidence. Its sizes and hierarchy informed this update; the venue's original Playfair Display/Inter fonts, burgundy/champagne branding, photography and content remain.

| Role | Desktop | Mobile |
|---|---|---|
| Body copy | 16px / 1.7 line height | 16px / 1.7 |
| Navigation | 15px | 15px |
| Homepage hero at 1440px / 390px | 74.16px | 42.12px |
| Public page title | up to 74px | responsive 36–46px |
| Major section heading | up to 50px | 32px |
| Card/content title | 20–24px | 18–22px by role |
| Form controls | 16px | 16px |
| Labels / interface controls | 14px | 14px |
| Captions / helper text | 12px | 12px |
| Dashboard page title | up to 40px | 30px |
| Dashboard panel title | 20px | 20px |
| Dashboard chart labels | 12px | 12px |

## Header behavior

- Sticky header with a measured 85px desktop row and 68px phone row; tablet uses 76px.
- Desktop dropdowns open on pointer hover or click and close on mouse leave (unless keyboard focus is inside), outside click or Escape.
- ArrowUp/ArrowDown on a dropdown button opens it and moves focus to its last/first link.
- The mobile menu opens full-width directly below the header, with a visible close toggle, scrollable contents, backdrop, focus containment and background scroll lock.
- The logo, main destinations, utility controls and Client login remain aligned. Dashboard remains the last primary destination and retains client/login/admin links.
- The navigation switches to compact mode below 1280px so all nine venue categories retain a readable 15px size.

## Implementation

assets/css/typography.css is the canonical shared type scale, loaded after the base stylesheet on all pages. It covers public cards/sections, forms, footers, authentication, utility pages, invoices, tables, notifications, client/admin panels and chart titles. Chart.js axis/legend text is also enlarged to 12px. Layout adjustments preserve card alignment and allow larger copy to fit naturally.

## Verification evidence

- browser-test-results.json: all required pages at the thirteen requested widths in light/dark and LTR/RTL.
- typography-test-results.json: computed body/form/heading/navigation measurements for every required page at 1440px and 390px, plus clipping and header-behavior checks.
- accessibility-test-results.json: every required page in both themes.
- header-accessibility-results.json: open dropdown/mobile menu in both themes and directions.
- workflow-test-results.json and edge-test-results.json: client/admin behavior and forms.
- tests/screenshots/: complete page screenshots; tests/typography-*.png: current header, hero and mobile menu.

The original 1.0.1 header report documents the earlier drawer design. This version supersedes it with the below-header mobile panel requested through the latest reference. Frontend demo boundaries and production integration requirements are unchanged.
