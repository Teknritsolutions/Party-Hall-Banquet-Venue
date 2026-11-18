# Production integrations

This is a static frontend template. The following connections are intentionally absent:

- Authentication: replace the local demo entry flow with server-backed sessions, password hashing, CSRF protection, rate limiting and role-based authorization. Never treat the demo session marker as access control. Registration and login currently validate inputs and open a clearly labeled workspace; passwords are not stored or checked against real accounts.
- Password reset: use single-use time-limited tokens and actual email delivery. The frontend reset state sends nothing.
- Booking: supply an authoritative availability API, capacity validation, date/time conflict locking, pricing snapshots, a transactional database and confirmation workflow. Simulated available/reserved/unavailable states must not be represented as live inventory.
- Payments: use a provider's hosted/tokenized checkout and verified server webhooks. The installment action only increments browser-local paid totals; it does not request card data or process money.
- Email and newsletter: connect provider endpoints and consent/retention policies. Enquiries and replies currently stay in the browser's demo inbox.
- Maps: configure the real venue location and a licensed map provider. The contact map is explicitly a placeholder; sample contact details are not real service contacts.
- Invoices: connect business identity, tax rules, legal numbering and payment records. Browser Print / Save as PDF is provided; no direct PDF generation library is bundled.
- Administration: protect APIs and validate all inputs server-side. Public HTML files cannot provide a secure admin panel. Client-side filters and hidden controls are not authorization.

Replace example.com canonical and Open Graph URLs, fictional statistics/team/testimonials, launch countdown, sample contact details, business JSON-LD, legal placeholders and social contact stubs before production. Configure CSP, security headers, HTTPS, backup and retention policies according to the chosen backend/host. CSV values beginning with spreadsheet formula characters are escaped in demo exports.
