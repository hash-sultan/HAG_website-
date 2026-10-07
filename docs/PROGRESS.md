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
  - Typecheck: 0 errors.
  - Playwright test suite: All 24 tests passed cleanly across viewports and locales.

## Next Steps
- Frontend improvements and UI design refinements.
