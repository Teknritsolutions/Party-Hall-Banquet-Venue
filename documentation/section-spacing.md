# Consistent section spacing — 1.0.6

Every public content section uses the same top/bottom padding at each viewport: desktop 80px, tablet 64px and mobile 48px. This includes both homepages, page introductions, highlights, public booking stages and legal sections. Existing differences in hero, intro and highlight padding were removed. Section-ending margins are cleared, and common heading/action/content spacing comes from shared tokens.

Compact dashboard workspaces use a 24px block gap. Chart grids now use one gap between rows rather than combining grid gaps with child panel margins. Dashboard headings and demo notices follow the same block-gap token. Authentication and standalone utility screens retain their full-page compositions.

The celebration badge uses a 132px desktop circle and 120px tablet/mobile circle. Its labels and sparkle are centered with consistent padding, a cream outer border and a thin inset gold keyline. Its text corners were checked geometrically against the inner circle, not merely its rectangular box.

Verification: 308 targeted spacing/badge checks passed, covering all 96 public content sections at three widths, the badge in both themes/directions at four widths and representative workspace blocks. All 45 required pages passed 2,340 responsive combinations with no overflow, missing resources or JavaScript errors. The section counts remain unchanged. See spacing-test-results.json and browser-test-results.json. Desktop/mobile badge close-ups are in tests/spacing-badge-detail-*.png.
