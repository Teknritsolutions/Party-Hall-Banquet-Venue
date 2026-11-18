# Header branding and controls — 1.0.3

The public header now uses live text for the brand name: 27px on full desktops, 24px on smaller desktops, 21px on phones and 18px at 320px. Its original arch symbol is stored separately as assets/images/brand-mark.svg. Burgundy text is used in light mode and warm-white text in dark mode.

Navigation item gaps are 20px at 1280–1399px, 28px at standard desktop widths and 34px at 1600px and above. The wider header container provides room for these gaps without reducing the 15px navigation text.

Theme controls display a moon in light mode (switch to dark) and a sun in dark mode (switch to light). RTL controls use a direction icon, with RTL/LTR action labels where space permits. Both have coordinated rounded backgrounds, subtle borders, burgundy/gold icon treatments, hover/focus styling, tooltips and aria-pressed state. Controls in the public header, authentication pages and both workspaces share this implementation.

Verification: 832 public-page/header layout combinations passed; explicit measurements at 320, 390, 1280, 1366, 1440, 1884 and 1920px confirmed visible branding, no overlap and the expected desktop gaps. Moon/sun visibility, persisted preference and RTL pressed/action-label states passed. Eight open-menu accessibility checks in both themes/directions reported no violations. All 42 workflow assertions passed again. Evidence is in brand-controls-test-results.json, header-test-results.json, header-accessibility-results.json and workflow-test-results.json. Current screenshots are tests/header-brand-light.png, header-brand-dark.png and header-brand-mobile-rtl.png.

## Text-only direction control — 1.0.4

Direction buttons now show only RTL/LTR text. The symbol was removed from public headers, mobile navigation, authentication and dashboard controls. Existing direction switching, labels, styling and saved preferences remain.
