# Project Progress

## Mobile Layout Bug Fixes (Completed & Verified)
- **Bug 1 (Process Timeline)**: Mobile clipping on Step 01 circle and overlap with sticky bottom "Get a quote" bar resolved on Home and `/services`.
- **Bug 2 (Mobile Menu Drawer)**: Drawer un-trapped from header height, anchored full-viewport via portal at `z-index: 80`, navy background with clear cream text and proper padding.
- **Bug 3 (Brand Logos)**: Replaced white-background JPEG with transparent PNG marks and logos across light/dark themes.
- **Verification**: 24/24 Playwright end-to-end tests passing (`hero.spec.mjs` and `mobile-fixes.spec.mjs`) across 5 viewports (320x640, 360x640, 390x844, 568x320, 844x390) and both English and Chinese locales. Typecheck passing cleanly.

## Exact Next Step
- Mobile drawer accessibility enhancements:
  - Add `role="dialog"` and `aria-modal="true"` to `.mobile-drawer`.
  - Apply `inert` / `aria-hidden="true"` to the background header and main page shell when the drawer is open.
  - Distinguish header hamburger toggle (`aria-label="Open menu"` / `"Close menu"`) and drawer close button (`aria-label="Close site menu"`).
  - Re-run the full 24-test e2e suite to confirm no regressions.
  - Merge branch `2026-10-05-szo7` into `main` locally.
