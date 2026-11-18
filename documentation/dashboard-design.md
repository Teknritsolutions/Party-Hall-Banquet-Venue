# Dashboard design

Reference: https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html (client and admin dashboards).

The shared design uses a charcoal sidebar, warm surfaces, burgundy actions, gold accents, consistent panel padding, and paired chart grids. All 24 dashboard screens load assets/css/dashboard.css. The layout collapses to a drawer on tablets and phones; the drawer closes with its close button, Escape, or an outside click.

Admin overview and reports include revenue, reservation activity, celebration mix, reservation status, paid/outstanding value, hall popularity, package selection, and guest volume. Client overview contains four charts scoped to client reservations. Booking and payment screens contain relevant charts. Monthly series explicitly label the current event year; the other charts cover the selected records. Revenue represents paid amounts allocated to event month.

The workflow diagram shows review, confirmation, fully paid, and completed reservation counts. These milestone counts can overlap and do not represent conversion rates. All values come from the existing demo store. Reports and booking charts respect the page filters. Empty datasets show a message.

Validation: tests/dashboard-layout.cjs checks all screens at desktop, tablet, and phone widths, chart totals, booking filters, report empty states, drawer controls, and dark RTL layouts. Visual captures are stored under tests/screenshots/reviews/.
