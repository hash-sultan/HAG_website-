# Project Progress

## Mobile Layout Bug Fixes (Completed & Verified)
- **Bug 1 (Process Timeline)**: Mobile clipping on Step 01 circle and overlap with sticky bottom "Get a quote" bar resolved on Home and `/services`.
- **Bug 2 (Mobile Menu Drawer)**: Drawer un-trapped from header height, anchored full-viewport via portal at `z-index: 80`, navy background with clear cream text and proper padding.
- **Bug 3 (Brand Logos)**: Replaced white-background JPEG with transparent PNG marks and logos across light/dark themes.
- **Verification**: 24/24 Playwright end-to-end tests passing (`hero.spec.mjs` and `mobile-fixes.spec.mjs`) across 5 viewports (320x640, 360x640, 390x844, 568x320, 844x390) and both English and Chinese locales. Typecheck passing cleanly.

## Build Verification & Content Cleanup (Completed & Verified)
- **Linux Build Check**: Executed clean production build inside a Linux Docker container (`node:24`) using `pnpm install --frozen-lockfile` and verified build passed without errors. Confirmed that native Linux binaries (`esbuild`, `rollup`, `lightningcss`) resolve properly after catalog dependency pruning in `pnpm-workspace.yaml`.
- **Hide Draft Vehicles**: Marked the 6 placeholder/draft vehicles (`chinese-passenger-van`, `chinese-commercial-van`, `gac-gasoline-mpv`, `denza-ev-mpv`, `howo-truck`, `commercial-crane`) with `status: 'draft'` in `data.ts`. Excluded drafts from all public UI surfaces: featured carousel, catalog filter chips and grid, detail page (direct URLs return 404 Not Found), and quote form vehicle picker.
- **Content Cleanup (EN & ZH)**:
  - Removed Xi'an coordinates (`34°20′N / 108°56′E`) from vehicle visual artwork.
  - Removed obsolete/unapproved labels: `"HAG / EXPORT SERIES"`, `"HAG / VEHICLE FILE"`, `"Europe / CIS"` (from route graphic), and `"Multiple brands"`.
  - Replaced page description copy with `"Browse our export range. Availability confirmed on quotation."` in `index.html` meta tags.
  - Standardized powertrain spec for `confirm: true` vehicles to `"Specifications on request"` (EN) / `"规格可按需咨询"` (ZH).
- **Housekeeping**:
  - Deleted obsolete `artifacts/huivex-auto/public/brand/README.txt`.

## Mobile Catalog Bug & Content Refinements (Prompt Part 2 — Completed & Verified)
1. **Mobile Catalog Vehicle Bug Fix**:
   - **Root Cause**: An arbitrary CSS rule in `artifacts/huivex-auto/src/index.css` inside the `@media (max-width: 850px)` media block: `.catalog-grid .vehicle-card:nth-child(n+4) { display: none; }` hid all vehicle cards past the third one, despite the heading displaying 15.
   - **Fix**: Removed the truncation CSS rule so all 15 active vehicles render. Added 4 Playwright tests in `tests/catalog-mobile.spec.mjs` verifying all 15 active vehicles are visible on 390x844, 844x390, 360x640, and 640x360 viewports.
2. **Vehicle Detail Content Fixes (EN & ZH)**:
   - Removed the `"HUIVEX / VEHICLE"` label from `VehicleArt`.
   - Replaced all unapproved `"pending confirmation"` phrases in public UI with: `"Full specifications and availability are confirmed on quotation."` (EN) / `"完整规格与供货情况将在报价时确认。"` (ZH).
   - Removed the internal `"PUBLIC CONTACT DETAILS PENDING APPROVAL"` banner from the contact page sidebar.
3. **Quote Form — Unlisted Vehicles & Graceful Fallback**:
   - Added `"Other / not listed (tell us what you need)"` (EN) and `"其他 / 未列出（请说明需求）"` (ZH) to the quote form's vehicle picker dropdown.
   - When chosen, renders an inline text input (`maxlength="300"`) for the custom model description.
   - Added `otherVehicle` (nullable `varchar(300)`) to the database schema (`quote_inquiries`), OpenAPI specification, generated Zod schemas, React API client types, Express POST route handler, and business notification email formatter.
   - Handled `?vehicle=<slug>` URL parameters safely: unrecognized or draft slugs fall back gracefully to the empty state without crashing or selecting unapproved models.
4. **Search Engine Demo Safety**:
   - Added `<meta name="robots" content="noindex, nofollow" />` to `index.html`.
   - Updated `public/robots.txt` to `User-agent: *` with `Disallow: /`.
5. **Playwright Automated Test Suite**:
   - Added `tests/unlisted-and-drafts.spec.mjs` verifying:
     - Direct navigation to all 6 draft vehicle URLs routes to the 404 page.
     - Active vehicle detail pages load cleanly.
     - The quote form vehicle picker excludes all 6 draft models while retaining active models and the "Other" option.
     - Direct visits to `/contact?vehicle=<draft-slug>` fall back gracefully without crashing.
     - Submitting an "Other / not listed" quote sends `otherVehicle` to the API with mocked email delivery.
   - **Total Test Count**: **33 / 33 tests passing** (4 mobile catalog visibility + 4 hero landscape/touch + 20 cross-viewport/bilingual layout + 5 unlisted/draft e2e tests).
6. **Documentation & Housekeeping**:
   - Added `.pnpm-store/` to root `.gitignore`.
   - Created root `README.md` documenting architecture, prerequisites, local setup (Docker Compose, `.env`, pnpm run commands), mobile phone Wi-Fi network testing, test runner commands, and doc references.
   - Updated `docs/OPEN_QUESTIONS.md` (and synced `artifacts/huivex-auto/OPEN_QUESTIONS.md`) covering Resend domain and sender verification, client contact details, English office address, vehicle launch roster, new vs used positioning, deck photography rights, brand logo usage rights, team track record wording ("6,000+"), privacy/terms approval, and production domain rollout.

## Live End-to-End Verification & Database Migration (Completed)
- **Database Push**: Applied schema change to the live local PostgreSQL instance using `pnpm --filter @workspace/db run push`. Confirmed the presence of the `other_vehicle varchar(300)` column via PostgreSQL table inspection. Clarified the exact migration command in `README.md`.
- **Contact Sidebar Notice**: Restored `<small className="pending-label">PUBLIC CONTACT DETAILS PENDING APPROVAL</small>` to `artifacts/huivex-auto/src/App.tsx`.
- **Live End-to-End Test (No Mocks)**: Sent a real `POST /api/quotes` request with `otherVehicle: "BYD Yangwang U9 supercar in bespoke yellow"`. Received HTTP 201 (`id: 4`). Verified row in PostgreSQL with `other_vehicle` populated and confirmed transactional email delivery via Resend API (`email_status: "sent"`).

## Reveal Scroll Animation Component (Completed & Verified)
- **Component**: Created reusable `Reveal` component (`artifacts/huivex-auto/src/components/ui/Reveal.tsx`) powered by `framer-motion` (`whileInView`, `viewport: { once: true, margin: '0px 0px -10% 0px' }`, 0.6s cubic bezier ease, fade + 24px rise) with full `useReducedMotion` fallback support.
- **Section Wrapping**: Wrapped major content sections across Home, Vehicles, Services, Markets, and About in `<Reveal>`, while explicitly preserving:
  - Hero carousel (`HeroCarousel`)
  - Quote forms (`QuoteForm`)
  - Quote bar and header navigation (`SiteHeader`)
  - Mobile drawer portal
  - Grid structures (wrapping complete grid blocks rather than individual child selectors to maintain styling and layout integrity).
- **Verification**:
  - TypeScript typecheck passed cleanly with zero errors.
  - Full Playwright E2E test suite (33/33 tests) passed across mobile and desktop viewports in English and Chinese.

## Vercel & Supabase Migration Preparation (Completed & Verified)
- **Database-Backed Rate Limiting (No Redis)**:
  - Created `rate_limits` table in `@workspace/db` schema (`key varchar(128)`, `count integer`, `reset_at timestamptz`).
  - Added atomic `checkDatabaseRateLimit()` helper function with automatic window expiry pruning.
  - Migrated both local Express server and Vercel serverless handler to use persistent PostgreSQL rate limiting, completely eliminating Redis dependency.
  - Successfully pushed schema to PostgreSQL via `drizzle-kit push`.
- **Vercel Serverless Functions (`/api`)**:
  - `api/quotes.ts`: Serverless quotation handler with database rate limiting, honeypot validation, Zod validation, PostgreSQL inquiry persistence, and Resend transactional email dispatch.
  - `api/health.ts`: Serverless health check pinging PostgreSQL with `SELECT 1` to verify connectivity and prevent Supabase project auto-pause.
  - `api/_lib/quote-email.ts`: Transactional email sending helper using Resend REST API with graceful error handling.
- **Vercel Monorepo Configuration (`vercel.json`)**:
  - Configured Vite build command (`pnpm --filter @workspace/huivex-auto run build`) and output directory (`artifacts/huivex-auto/dist/public`).
  - Configured routing rules preserving `/api/(.*)` serverless execution and rewriting SPA client paths to `/index.html`.
- **Supabase Keep-Alive GitHub Action (`.github/workflows/supabase-keepalive.yml`)**:
  - Scheduled cron running every 3 days at 08:00 UTC to ping `/api/health` and keep the free Supabase database from going inactive.
- **Verification**:
  - TypeScript build (`tsc --build`) and app typecheck passed cleanly with 0 errors.
  - Production bundle generated cleanly (`vite build` in 38s).
  - All 33 Playwright E2E tests passing.

## Launch Checklist
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from `index.html`
- [ ] Remove `Disallow: /` from `public/robots.txt` and allow search engine indexing
- [ ] Add canonical tags, production XML sitemap (`/sitemap.xml`), and finalized `og:image`
- [ ] Rotate the Resend API key
- [ ] Verify the custom sender domain in Resend
- [ ] Set real, approved client contact details (phone, email, WeChat ID, English office address)
