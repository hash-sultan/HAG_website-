# Huivex Auto Global — Launch Open Questions & Confirmations

This document tracks all critical items requiring client confirmation, legal approval, or technical credential setup before the production launch.

---

### 1. Resend Domain & Sender Setup
- **Status**: Backend email delivery is implemented and tested via Resend API in `artifacts/api-server/src/routes/quote-email.ts`.
- **Pending Confirmation**:
  - Configure and verify the custom sending domain in the Resend dashboard (DNS records: SPF, DKIM, and DMARC).
  - Confirm the production sender address (`CONTACT_FROM_EMAIL`, e.g. `quotes@huivex.com` or `noreply@huivex.com`).
  - Confirm the internal sales recipient inbox (`CONTACT_TO_EMAIL`, e.g. `sales@huivex.com`).
  - Rotate the temporary development Resend API key before going live.

### 2. Client Contact Details
- **Status**: Placeholders currently guarded with fallback strings.
- **Pending Confirmation**:
  - Personal contact identity (name of sales lead / representative).
  - Direct telephone number with international dialing prefix.
  - WhatsApp business account number.
  - WeChat ID and optional QR code asset.
  - Public sales email address.

### 3. English Office Address
- **Status**: Chinese registered address is sourced from company business documentation.
- **Pending Confirmation**:
  - Confirm the exact official English translation of the Xi'an headquarters address (e.g., Room/Unit, Building, High-Tech Industrial Development Zone, Xi'an, Shaanxi, China).

### 4. Vehicle Selection at Launch
- **Status**: 15 active consumer vehicles are displayed in the catalog. 6 draft entries (`howo-truck`, `commercial-crane`, `denza-ev-mpv`, `gac-gasoline-mpv`, `chinese-passenger-van`, `chinese-commercial-van`) are marked `status: 'draft'` and hidden across all lists, carousels, and search routes.
- **Pending Confirmation**:
  - Which of the 6 draft models (if any) should be promoted to active inventory at launch?
  - Are there additional models, powertrains, or trims to add or replace?
  - Confirm whether seed vehicle descriptors and specifications align with available export allocations.

### 5. New vs. Used Vehicle Positioning
- **Status**: Catalog copy focuses on sourcing from China with availability confirmed on quotation.
- **Pending Confirmation**:
  - Confirm Huivex's explicit policy regarding brand-new versus certified pre-owned / used vehicles.
  - Confirm vehicle condition inspection claims, mileage assurances, and warranty/guarantee boundaries for export buyers.

### 6. Photography & Asset Licensing Rights
- **Status**: Hero image uses an atmospheric stock visual; vehicle artwork uses lightweight SVG/CSS placeholders without third-party copyrighted photography.
- **Pending Confirmation**:
  - Confirm copyright clearance and commercial display rights for all photography provided in the client's initial deck.
  - Supply high-resolution, approved photographs for vehicles, vehicle inspection, port container loading, and showroom partners.

### 7. Brand Logo Rights & Fair Use Disclaimers
- **Status**: Brand mentions currently use clean text labels and transparent monochrome marks with explicit non-endorsement disclaimers.
- **Pending Confirmation**:
  - Confirm whether client legal counsel approves displaying manufacturer brand names and logos (Zeekr, BYD, Xiaomi, Toyota, BMW, Mercedes-Benz, Ford, etc.) under nominative fair use for vehicle export trading.

### 8. Team Track Record Wording ("6,000+ vehicles since 2022")
- **Status**: Labeled on the home and about pages as team track record.
- **Pending Confirmation**:
  - Confirm the precise phrasing, cumulative vehicle count, attribution (core team history vs. entity founding date), and supporting documentation.

### 9. Privacy Policy & Terms of Use
- **Status**: Routes `/privacy` and `/terms` display a visible "DRAFT / APPROVAL REQUIRED" notice.
- **Pending Confirmation**:
  - Supply counsel-approved Privacy Policy compliant with applicable personal data protection laws (e.g. GDPR, PIPL).
  - Supply counsel-approved Terms of Use outlining quotation validity, contract formation, governing law (Shaanxi/PRC or international arbitration), and disclaimer of implied warranties.

### 10. Establishment Date & Registered Capital
- **Status**: Displayed in company credentials component.
- **Pending Confirmation**:
  - Confirm the exact establishment year and registered capital amount before public indexing.

### 11. Anti-Spam & Turnstile Integration
- **Status**: Form is secured with server-side validation, IP sliding-window rate limiting, and a silent honeypot input.
- **Pending Confirmation**:
  - Decide whether Cloudflare Turnstile or Google reCAPTCHA v3 keys should be provisioned for additional automated submission protection.

### 12. Production Domain & SEO Go-Live
- **Status**: Demo has `<meta name="robots" content="noindex, nofollow">` and `Disallow: /` in `robots.txt`.
- **Pending Confirmation**:
  - Confirm the final primary production domain name.
  - Review the launch checklist in `docs/PROGRESS.md` to remove noindex, deploy the XML sitemap, configure canonical URLs, and register Google Search Console / Baidu Webmaster Tools.
