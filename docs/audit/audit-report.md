# Huivex Auto Global — PRD audit

## Scope and evidence

Read-only audit of the local development app against `HAG_Website_PRD.md`. No application source or configuration was changed. No live quote was submitted and no production URL was supplied.

- Captured 112 full-page screenshots: 8 routes × 14 viewport orientations. See `docs/audit/screenshots/`.
- Playwright route, viewport, interaction and sizing results: `playwright-measurements.json`.
- Responsive scan: 11 routes × 25 widths (320–2560 px); no horizontal overflow in the sampled widths. See `responsive-width-scan.json`.
- Mobile Lighthouse JSON: `lighthouse-home.json`, `lighthouse-vehicles.json`, `lighthouse-contact.json`.
- All 112 captured route/viewport loads returned HTTP 200, had one H1, and recorded no page errors.

Lighthouse and browser checks used the local Vite development server, not a production build or live deployment. The complete cross-browser, 200% zoom, enlarged system-font and real-device matrix was not run.

## Section 15 acceptance results

| PRD check | Result | Evidence / gap |
|---|---|---|
| Required routes exist, are linked and are usable in English and Chinese | **PARTIAL** | The eight audited routes load. Locale switching works, but Chinese pages retain English labels and `/404` has an English H1. |
| Hero carousel supports the required slide count, autoplay, swipe, pause, dots, arrows and keyboard | **FAIL** | Three slides are present rather than four. Dots work; ArrowRight did not change slides. No swipe or pause-on-hover/focus behavior was found. The interval is 7 seconds, not the specified 6.5 seconds. |
| Featured-vehicle carousel behaves as specified | **FAIL** | Featured vehicles render as a static grid; no swipe/drag carousel or next-card peek. |
| Catalog filters/search update the URL and show an empty state | **PARTIAL** | Category, powertrain, brand and search update query parameters; filtering, clear and empty state work. Brand is a single-select control, not multi-select as specified. |
| Quote form validates, persists, emails and confirms | **FAIL** | Client/server validation and database persistence exist. No email notification or real-inbox delivery implementation was found. Validation was checked without submitting a lead. |
| Quick-contact actions are present and functional | **FAIL** | The visible action is the quote CTA. WhatsApp and WeChat are disabled; phone and email quick actions are absent. Contact values remain unconfirmed. |
| Language switch preserves the current route | **PASS** | Switching languages on `/about` retained the path and changed the localized content. |
| No horizontal overflow at supported widths | **PASS (sampled)** | No overflow across 275 route/width combinations: 11 routes at 25 representative widths from 320 to 2560 px. This is a sample, not every possible CSS-pixel width. |
| Required responsive and orientation matrix | **FAIL** | The requested screenshot matrix is captured. The hero still violates the landscape-phone specification: 450 px high at 640×360 and 844×390; at 915×412 it is 640 px high, with a 78 px header and visible scroll indicator. Broader browser/zoom/font tests remain unverified. |
| Rotation preserves carousel, drawer and form state | **PASS** | The selected hero slide remained selected after portrait-to-landscape resize. Drawer state and typed form input also survived resize. |
| Touch targets are at least 44 px; form text is at least 16 px | **FAIL** | Form controls meet the measured 16 px text and 48 px height. Several other controls do not: language control 42×40, menu 42×42, carousel controls 34×24, catalog chips about 32 px high. |
| Visual tokens and typography match the PRD | **PARTIAL** | Navy, gold and warm-paper colors are close to the intended palette. Display type falls back to Arial/system fonts; the specified font treatment is not implemented. The logo JPEG has a visible white rectangle. |
| Required effects are implemented and run at 60 fps on a mid-range phone | **FAIL** | Some CSS reveal, route-line and marquee effects exist. Required carousel/gallery behaviors are missing; no physical-device frame-rate test was performed. |
| Reduced-motion mode is respected | **PARTIAL** | Emulated reduced motion stopped hero autoplay and the CSS reduces animation/transition duration. The full app-wide effects set was not independently checked. |
| Mobile Lighthouse thresholds | **FAIL (performance)** | Scores: Home 55/96/96/100; Vehicles 55/95/96/100; Contact 55/97/96/100 for Performance/Accessibility/Best Practices/SEO. Only Performance misses its stated threshold in these runs. |
| Core Web Vitals and page-weight budgets | **FAIL in dev; production unknown** | LCP 20.9–22.1 s; CLS 0; TBT 0–16 ms. Total transfer was about 3.64–3.74 MB. Lighthouse ran against Vite dev output, so these are not production-bundle measurements. INP and physical-device performance were not measured. |
| axe zero serious/critical findings and keyboard-only walkthrough | **PARTIAL** | Lighthouse accessibility scores are 95–97, but no standalone axe report or full keyboard-only walkthrough was completed. The tested ArrowRight carousel control failed. |
| No blocked third-party dependencies for China | **PASS (sampled)** | No external font/CDN dependency was observed in the three Lighthouse network runs. This is not a test from inside mainland China. |
| No unsourced facts or invented content | **FAIL** | See “Content requiring confirmation” below. “Not sourced” means not substantiated by Section 2; it is not a claim that the value is false. |
| README documents routes, architecture and analytics events | **FAIL** | No root or artifact README was present. No analytics event list was found. |

## Lighthouse results

| Route | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT | Total transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Home | 55 | 96 | 96 | 100 | 21.3 s | 22.1 s | 0 | 8 ms | 3.74 MB |
| Vehicles | 55 | 95 | 96 | 100 | 20.9 s | 20.9 s | 0 | 16 ms | 3.64 MB |
| Contact | 55 | 97 | 96 | 100 | 21.4 s | 21.4 s | 0 | 0 ms | 3.64 MB |

The development preview includes Vite/HMR and development scripts; do not treat these totals or scores as a production build result. The raw HTML is an SPA shell with an empty root. `/sitemap.xml` returned the SPA HTML rather than XML. Route-specific metadata is set client-side; no canonical, hreflang or JSON-LD was found.

## Content requiring client confirmation

These items are not traceable to the supplied company facts in PRD Section 2, or are presented more definitively than the source allows:

1. **Xi’an coordinates:** `34°20′N / 108°56′E` is shown as a location detail, while the source gives Xi’an but no coordinates.
2. **Market grouping:** `Europe / CIS` is used as a regional label without a source-approved grouping. The target-region list does not itself approve these regional buckets.
3. **Vehicle makes:** generic “Multiple brands” labels and make assignments appear where the source material does not confirm a specific make.
4. **Draft vehicle rows:** six later vehicle entries are visible as catalog items even though the PRD says slide-only additions must stay hidden until approved. Their presence implies publishable inventory.
5. **Availability wording:** the raw page description says “Browse available models,” which implies current availability; the PRD says availability is confirmed on request.
6. **Vehicle details with confirmation flags:** some source values are marked for confirmation in the catalog, but the detail page does not consistently carry that qualification.
7. **Unverified graphic labels:** labels such as `HAG / EXPORT SERIES` and the selected map-region captions are presentation copy, not approved company facts.
8. **Image provenance:** the hero image is a local 1024×1024 asset; its source/approval is not documented in the supplied company information. Vehicle imagery is represented by CSS artwork rather than source vehicle photos.

## Requirements missing or materially simplified

- **Home:** four-slide functional hero, featured-vehicle carousel, vehicle-category grid, transport-mode cards, operations gallery, six-question FAQ and embedded compact quote form are absent or simplified.
- **Vehicle pages:** no real vehicle photo gallery/lightbox; CSS placeholder artwork is used. Confirmation labels are not consistently repeated on details.
- **Catalog:** brand selection is single-select rather than multi-select. The filter chips are below the required touch height.
- **Markets:** map is a static illustration, not an interactive map with region tabs.
- **Showrooms/About:** requested gallery and richer showroom context are missing or reduced.
- **Contact and lead handling:** requested direct call/email/WhatsApp/WeChat actions are not all present. The quote is stored but no email notification was found; no real-inbox test was possible.
- **Legal/privacy:** privacy and terms content is still draft/placeholder. This needs approved text before collecting personal data publicly.
- **SEO/discovery:** no XML sitemap, canonical tags, hreflang or structured data. Initial HTML is not prerendered per route.
- **Images and identity:** the hero is square and below the PRD’s landscape-resolution target; vehicle cards use placeholders. The logo’s white JPEG background is visible.
- **Landscape mobile:** hero height, header height and scroll indicator do not meet the specified short-landscape behavior.
- **Verification/docs:** no README or analytics event list. Cross-browser, real-device frame rate, axe report, 200% zoom, enlarged system-font and production Lighthouse checks remain outstanding.

## Prioritized fixes

### P0 — resolve before public launch

1. Complete lead delivery: notify the approved business inbox, provide a user confirmation, and verify both paths in a real inbox. Persistence alone can leave inquiries unseen.
2. Obtain and publish approved business contact details and enable the intended direct contact actions.
3. Replace draft privacy/terms text with approved policies before accepting names, email addresses and other inquiry data.

### P1 — core PRD and launch quality

1. Add route-aware prerendering or SSR and correct XML sitemap, canonical/hreflang and structured metadata.
2. Implement the specified hero and featured-vehicle interactions with keyboard, touch, pause and reduced-motion behavior.
3. Keep unapproved vehicle rows hidden and ensure every uncertain model/specification is clearly marked across catalog and detail views.
4. Complete missing Home, gallery, FAQ, map, showroom and contact requirements.
5. Fix short-landscape layout and raise every interactive target to at least 44×44 px.
6. Replace placeholder car art with approved, properly sized responsive images; remeasure production Lighthouse and image/JS budgets.
7. Finish Chinese localization for labels, legal routes, metadata and fallback pages.

### P2 — finish and maintainability

1. Replace the logo JPEG with a transparent approved asset and implement the specified type system/tokens.
2. Add the README, route/architecture notes, analytics event inventory and repeatable route/accessibility checks.
3. Complete browser, zoom, large-system-font, real-device motion and mainland-China network checks.

## Seven additional questions

The compacted task context did not retain the exact wording of the seven additional questions. I have not guessed at them. The evidence above covers routes, interactions, responsive behavior, Lighthouse, content provenance, omitted requirements and priorities; provide the original questions if exact answers to those prompts are still needed.