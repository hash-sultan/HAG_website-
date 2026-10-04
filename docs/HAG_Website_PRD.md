# Product Requirements Document — Huivex Auto Global, Ltd. Website

**Version:** 1.0 (build-ready draft)
**Brand tagline:** *Cars Beyond Borders* · 车通天下
**Audience for this document:** an AI coding agent (and any human reviewer) who will build the site end to end.

---

## 0. How the agent should use this document

1. Read the whole document before writing code. Sections 6 to 9 (design, motion, responsive rules) are as binding as the feature list.
2. **Never invent business facts.** Do not make up prices, vehicle specs, testimonials, client names, certifications, statistics or addresses. Use only facts in Section 2. Where something is missing, render an honest fallback ("Specifications on request", "Request a quote") and list it in `OPEN_QUESTIONS.md` in the repo.
3. **Mobile first.** Design and test at 360 px wide first, then scale up. Landscape phones are a first-class target (Section 8).
4. Build in the phases from Section 14. Deliver a working, deployable site at the end of each phase.
5. Where this document says **MUST**, it is a hard requirement. **SHOULD** means do it unless there is a strong reason not to. **MAY** is optional.
6. If you pick a different technology than the one recommended in Section 11, you still MUST satisfy every non-functional requirement in Section 12.

---

## 1. Product overview

### 1.1 What this is
A marketing and lead-generation website for **Huivex Auto Global, Ltd.** (陕西汇驰天下汽车贸易有限公司), a China-based automobile sourcing and export company headquartered in Xi'an, Shaanxi. It sells vehicles (new energy vehicles, SUVs, sedans, pickups, MPVs, vans, commercial vehicles, and premium and Toyota models) and provides export support (documentation, loading, shipping) to overseas dealers and importers.

### 1.2 Primary goal
Convert overseas dealers, importers and trading companies into **qualified quotation inquiries**. Every page should move a visitor toward "Get a Quote" or a direct chat (WhatsApp/WeChat/email/phone).

### 1.3 Secondary goals
- Build trust fast: a young company (established 17 June 2026) needs to look credible, transparent and professional.
- Showcase the vehicle range and the end-to-end export process.
- Look noticeably more modern and polished than typical China car-export sites.
- Be fast and usable on weak mobile connections (many target markets).

### 1.4 Non-goals for v1
- No online payments, no shopping cart, no user accounts or login.
- No live inventory or pricing feed.
- No blog or CMS-driven news (architecture should allow adding it later).
- No chatbot (a WhatsApp/WeChat deep-link is enough).

### 1.5 Target users
| Persona | Description | What they need |
|---|---|---|
| **Overseas dealer / importer** (primary) | Runs or supplies a car dealership in Africa, the Middle East, Central Asia or South America. Mostly on a phone. English may be a second language. | See the model range, understand the process, trust the company, request a quote in under a minute |
| **Trading company / agent** | Sources vehicles for multiple buyers | Brands list, shipping modes, documentation clarity |
| **Prospective showroom partner** | Wants a display point or dealership partnership | Showroom/partner program info and a clear way to apply |
| **Client's own team (Xi'an)** | Staff who read inquiries | Clean, complete inquiry emails; Chinese language option |

### 1.6 Success metrics (first 90 days after launch)
- Mobile Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Inquiry form completion rate ≥ 3% of unique visitors (baseline target; refine after data).
- Median mobile LCP ≤ 2.5 s on 4G; CLS ≤ 0.1; INP ≤ 200 ms.
- Zero broken layouts across the device matrix in Section 8.4.

---

## 2. Source facts (single source of truth for content)

All facts below come from the client's deck (`HAG_2026.pptx`) and logo. Use them verbatim; do not extend them.

### 2.1 Company identity
- **English name:** HUIVEX AUTO GLOBAL, LTD (the deck writes it as "HUIVEX AUTO GLOBAL,. LTD" on some slides, but the logo uses **"HUIVEX AUTO GLOBAL, LTD"**. Use the logo spelling.)
- **Chinese name:** 陕西汇驰天下汽车贸易有限公司
- **Short mark:** HAG (monogram in the logo)
- **Tagline:** Cars Beyond Borders · 车通天下
- **Positioning:** China-based automobile sourcing and export service provider (立足中国的汽车车源及出口服务商)
- **Mission:** Deliver reliable vehicles, transparent pricing and smooth export execution.
- **Footer promise line used throughout the deck:** Trusted vehicle sourcing · Export documentation · Loading & shipment · After-sales support
- **Registered capital:** RMB 1,000,000
- **Established:** 17 June 2026
- **Legal scope:** Vehicle sales, NEV sales, parts, export support and related services
- **Origin / HQ:** Xi'an, China
- **Deck-stated track record:** 2022–2025 service period, **6,000+** vehicles exported cumulatively, key markets "Global".
  > ⚠ This track record predates the legal establishment date (June 2026). Show it, but word it carefully, e.g. "Our team has exported 6,000+ vehicles since 2022", and confirm the wording with the client (see Open Questions).
- **Target regions:** Africa · Middle East · Central Asia · South America

### 2.2 Markets / route map countries (from the deck)
Route map origin: **Xi'an, China**. Destinations shown: Russia, Kazakhstan, Uzbekistan, Turkmenistan, Iran, Iraq, Pakistan, Saudi Arabia, UAE, Algeria, Colombia, Brazil. Flag strip in the deck also includes China as origin.

### 2.3 Team structure (4 functions)
1. **Trading & Sales** (贸易销售): market inquiry, quotation, negotiation and client follow-up.
2. **After-sales Service** (售后服务): vehicle file keeping, technical communication and long-term support.
3. **Logistics & Customs** (物流报关): loading plan, port coordination, customs declaration and shipment tracking.
4. **Finance & Accounting** (财务会计): payment confirmation, PI/CI files, cost control and settlement.

**Team principle:** One client, one responsible owner, one visible process. (一个客户，一个责任人，一个可追踪流程。)

**Quick facts strip:** 24h fast response · 1-stop export service · VIN confirmation · Global shipping routes.

### 2.4 Export process (6 steps, in order)
1. **Quote** (报价)
2. **PI & Payment** (形式发票/收款)
3. **VIN Check** (车架号确认)
4. **Export Docs** (出口资料)
5. **Port Loading** (港口装车)
6. **Shipment** (海运/陆运)

Supporting statements:
- *Document control:* PI/CI, packing list, export declaration and customer files kept consistent.
- *Finance clarity:* Payment status, balance, cost and shipment fees are tracked before release.
- *Quality gate:* Every vehicle goes through sourcing review, document checking, visual confirmation and logistics scheduling.

### 2.5 Car-source advantages (6 cards)
1. **Direct Sourcing Channels:** stable links with dealerships, traders and market resources across China.
2. **Competitive Pricing:** fast price feedback based on market changes, trim level and delivery timing.
3. **VIN & Color Confirmation:** key order details reconfirmed before PI and before loading arrangements.
4. **Multi-brand Availability:** flexible choices across EVs, SUVs, sedans, premium vehicles and commercial models.
5. **Inspection Transparency:** vehicle videos, basic condition checks and loading confirmation improve confidence.
6. **Export Coordination:** quotation, sourcing, documentation, loading and after-sales support in one workflow.

**"Why it matters" paragraph:** For overseas dealers, good sourcing is not only about finding a car. It is about consistency in price, speed in confirmation, accuracy in specs, and confidence before shipment. HUIVEX focuses on these practical details to reduce order friction.

### 2.6 Transport modes (4)
Road Transport (国内拖车 / port transfer) · Container Loading (集装箱装运) · RoRo Shipment (滚装船运输) · Railway Freight (铁路运输).
Selection logic: "Flexible shipping methods are selected based on destination, cost, urgency and market policy."

### 2.7 Overseas showroom / partner program (4 points)
1. **Display Support:** localized showroom visuals, product cards and sales material support.
2. **Model Guidance:** popular trims, color recommendations and market-oriented product advice.
3. **Trust Building:** on-site viewing, client reception and partner photo/video confirmation.
4. **Flexible Cooperation:** suitable for display, promotion, dealer support and local market testing.

**Advantage statement:** We cooperate with display points and partner locations that help overseas clients see product style, size and finish more intuitively. Visual identity can be localized with HUIVEX branding, helping improve recognition and dealer confidence.

### 2.8 Brand portfolio (logos shown in the deck)
BYD, Geely, Toyota, Changan, GAC, Livan, Avatr, ROX, Zeekr, BMW, Mercedes-Benz, Mazda, Kia, Hyundai, Volkswagen, Jetour. Label: "Available for export".
> ⚠ Third-party trademarks. Use them as a text/logo wall only if the client confirms he is entitled to display them; otherwise use a clean typographic wordmark list. Never imply official dealership status or manufacturer endorsement; add the disclaimer in the footer (Section 5.12).

### 2.9 Vehicle catalog seed data (from the deck)
No specs, prices or condition (new/used) are given. Do not invent them.

| # | Category | Model | Deck descriptor | Powertrain (as stated or implied) | Source media |
|---|---|---|---|---|---|
| 1 | Flagship SUV | Zeekr 9X | Luxury full-size SUV | EV / extended-range (confirm) | slide 13 |
| 2 | Flagship SUV | ROX 01 | Extended-range flagship SUV | Extended-range | slide 13 |
| 3 | Flagship SUV | Xiaomi Pengcheng N90 *(name as written in the deck; confirm)* | Next-generation flagship SUV | confirm | slide 13 |
| 4 | EV Sedan | Xiaomi SU7 EV | High-performance EV sedan | EV | slide 14 |
| 5 | EV Sedan | Avatr 12 | Modern intelligent electric sedan | EV | slide 14 |
| 6 | EV Crossover | BYD Tang L | Modern intelligent EV crossover | EV | slide 14 |
| 7 | Toyota | Toyota RAV4 | High-demand SUV | confirm | slide 15 |
| 8 | Toyota | Toyota Corolla Cross | Compact crossover | confirm | slide 15 |
| 9 | Toyota | Toyota Corolla | Sedan (no descriptor) | confirm | slide 15 |
| 10 | Premium | BMW X5 | Premium mid-size SUV | confirm | slide 16 |
| 11 | Premium | Mercedes-Benz GLC | Premium mid-size SUV | confirm | slide 16 |
| 12 | Pickup | Ford Raptor F-150 | Large-format vehicle for rugged markets | confirm | slide 17 |
| 13 | Pickup | Nissan Frontier Pro PHEV | Spacious all-purpose vehicle | PHEV | slide 17 |
| 14 | Gasoline | Jetour Traveler | Adventure-style gasoline SUV | Gasoline | slide 18 |
| 15 | Gasoline | Geely Coolray 1.5T | Reliable market favorite | Gasoline | slide 18 |
| 16 | Utility / Van | Chinese Passenger Van | Comfortable & spacious | confirm | slide 19 (full-slide image only) |
| 17 | Utility / Van | Chinese Commercial Van | Reliable & efficient | confirm | slide 19 (full-slide image only) |
| 18 | MPV | GAC Gasoline MPV | Comfortable & spacious | Gasoline | slide 20 (full-slide image only) |
| 19 | MPV | Denza EV MPV | Luxury & intelligent | EV | slide 20 (full-slide image only) |
| 20 | Commercial | HOWO Truck | Heavy duty & reliable | confirm | slide 21 (full-slide image only) |
| 21 | Commercial | Commercial Crane | Strong lifting capacity | confirm | slide 21 (full-slide image only) |

Deck filter tabs seen on slides 19 to 21: *Utility Vehicles / MPV Vehicles / Commercial Vehicles* combined with *EV / LPG / Gasoline / Passenger*. Use these as the basis of the catalog filters (Section 5.4).

### 2.10 Contact details (from the deck, last slide)
- **Contact person:** Benny, Deputy General Manager (销售与出口负责人, Sales & Export lead)
- **Telephone:** +86 182 4089 7728
- **WeChat:** Benny_chat55
- **Email:** baraqturab55@icloud.com
- **Address (Chinese, as written):** 陕西省西安市浐灞生态区东三环立交通塬路1680号浐灞汽车主题公园内以西6号
- **English address:** Not provided. Do not machine-translate it on the page without client approval. Show the Chinese address and add `// TODO: English address` in config.

> ⚠ This is a personal name, phone number and iCloud email. Confirm the client wants them public. Architecture MUST keep all contact details in one config file so they can be changed in one place. SHOULD recommend a branded email (e.g. `sales@<domain>`) before launch.

### 2.11 Brand assets
- **Logo:** `logo.jpeg`, 1254×1254, white background. Navy "HAG" monogram with a suspension bridge carrying a car, a gold globe, a cargo ship, and a gold swoosh; wordmark "HUIVEX AUTO GLOBAL, LTD"; tagline "Cars Beyond Borders" between two thin gold rules.
- **Sampled brand colors:** deep navy ≈ `#0A2352`, gold ≈ `#C9962E`.
- A transparent PNG of the logo exists inside the deck (`image3.png`, RGBA). No SVG exists. See Section 10 for what the agent must produce.

---

## 3. Information architecture (sitemap)

```
/                         Home
/vehicles                 Vehicle catalog (filterable)
/vehicles/[slug]          Vehicle detail (generated from data)
/services                 Export process & services (sourcing, docs, logistics, finance, after-sales)
/markets                  Destinations & route map
/showrooms                Overseas showroom / partner program
/about                    Company, team, credentials, gallery
/contact                  Contact + Get a Quote form (also the quote page)
/privacy                  Privacy policy
/terms                    Terms of use
/404                      Branded not-found page
```

Global elements on every page: sticky header, language switcher, floating quick-contact button, footer, cookie/consent notice (only if analytics need it).

**Languages:**
- **v1: English (default) and Simplified Chinese (zh-CN).** The deck already contains the Chinese copy.
- Architecture MUST support more locales later without refactoring: Arabic (RTL), Russian, Spanish, Portuguese. Use locale-prefixed routes (`/en/...`, `/zh/...`), a translation file per locale, logical CSS properties (`margin-inline-start`, etc.) so RTL is not a rewrite, and `hreflang` tags.
- Chinese typography: use Noto Sans SC (self-hosted, subset).

---

## 4. Global components

### 4.1 Header / navigation
- **Layout:** logo (left), primary nav (center/right), language switcher, primary CTA button "Get a Quote" (gold).
- **Nav items:** Home · Vehicles · Services · Markets · Showrooms · About · Contact.
- **Behavior:**
  - Over the hero: transparent background, white text/logo variant.
  - After 24 px of scroll: solid deep-navy background with backdrop blur, subtle bottom gold hairline, logo switches to compact.
  - Hides on scroll down, reappears on scroll up (do not hide while the mobile menu is open).
  - **Mobile (<1024 px):** hamburger opens a full-height slide-in drawer (from the inline-end side) with large links (min 48 px tall), staggered link entrance, the language switcher, the Get a Quote button, and tap-to-call / WhatsApp / email rows. Body scroll is locked while open; focus is trapped; Esc and backdrop tap close it.
  - Header height: 72 px desktop, 64 px mobile portrait, **56 px landscape phone**.
- Active page link has a gold underline that animates in.

### 4.2 Floating quick-contact (all pages)
- **Mobile portrait:** a slim bottom action bar with three equal buttons: **Quote**, **WhatsApp**, **Call**. It auto-hides while the keyboard is open or while the user is in the contact form. Respect `env(safe-area-inset-bottom)`.
- **Mobile landscape:** collapse to a single circular floating button (bottom inline-end) that expands into the three actions, to save vertical space.
- **Desktop:** a single floating gold circular button (bottom inline-end) that expands on hover/focus into WhatsApp / WeChat (opens a QR modal showing the ID) / Email / Call.
- WhatsApp link format: `https://wa.me/<number-digits-only>?text=<prefilled message>`. The client MUST confirm that the number is on WhatsApp (Open Question). If not, hide the WhatsApp button via a single config flag.
- WeChat cannot be opened via a plain URL. Show the WeChat ID with a "copy" button and a QR code image slot (`/public/wechat-qr.png`, placeholder until the client supplies it).

### 4.3 Language switcher
Compact dropdown (EN / 中文) in the header and drawer. Persist the choice (cookie), keep the user on the equivalent page, and never auto-redirect crawlers.

### 4.4 Footer (see 5.12)

---

## 5. Page and section specifications

### 5.1 Conventions used below
- "Reveal" = the standard scroll-reveal from Section 7.3.
- Every section has: an eyebrow label (small gold uppercase), an H2 headline, an optional one-line sub-headline, then content.
- Every section ends with a path forward (a CTA or a link) where it makes sense.

### 5.2 HOME: Section 1. Hero carousel (the signature element)

**Purpose:** a cinematic first impression with a clear promise and CTA.

**Structure:** full-bleed carousel, height `100svh` (min 560 px portrait; see landscape rules in Section 8.2), 4 slides, with a dark navy gradient overlay (bottom-to-top, ~60% to 0%) for legibility.

**Per-slide content** (use only deck-supported claims):

| # | Eyebrow | Headline (H1 on slide 1, H2 on others) | Sub-headline | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|
| 1 | HUIVEX AUTO GLOBAL | **Cars Beyond Borders** | China-based vehicle sourcing and export, from quotation to delivery. | Get a Quote | Explore Vehicles |
| 2 | New energy & more | **EVs, SUVs, sedans, pickups, vans and trucks** | One export partner across brands and body types. | Browse the Range | Get a Quote |
| 3 | One visible process | **From quote to shipment, every step tracked** | Quote, PI & payment, VIN check, export documents, port loading, shipment. | See How It Works | Get a Quote |
| 4 | Global reach | **Shipping to Africa, the Middle East, Central Asia and South America** | Road, container, RoRo and rail options, chosen for your destination. | View Our Markets | Get a Quote |

**Imagery:** choose from the landscape-ratio, ≥1600 px-wide images listed in Appendix A (cinematic logistics images, port/container photos, the route-map image). Slide 2 SHOULD use a vehicle image set against a clean/dramatic background (see 9.2 for how to prepare vehicle photos). Every image MUST have descriptive `alt` text.

**Behavior and animation (MUST):**
- Autoplay every 6.5 s. Pause on pointer hover, keyboard focus, touch/drag, and when the tab is hidden. Resume 2 s after interaction ends.
- Transition: 900 ms crossfade with a slight scale settle (image scales 1.06 → 1.00 over the slide's visible time, a "Ken Burns" drift). Text enters with a staggered rise: eyebrow (0 ms), headline (100 ms), sub-headline (200 ms), buttons (300 ms), each 16-24 px translateY + opacity, 600 ms ease-out.
- Swipe/drag on touch and mouse with natural momentum (Embla Carousel `loop: true`, `dragFree: false`, `duration` tuned so the settle feels smooth).
- Controls: segmented **progress bars** along the bottom (one per slide; the active one fills over the autoplay duration and is tappable), prev/next arrow buttons on ≥768 px only, keyboard left/right.
- A subtle "scroll" indicator (animated chevron) bottom center on tall viewports; hidden on landscape phones.
- `prefers-reduced-motion`: no autoplay, no scale drift, no stagger; crossfade only or instant, and the user can still advance manually.
- Preload only slide 1's image with `priority`; lazy-load the rest. Serve responsive sizes (Section 10).
- The H1 text MUST be real HTML text (not baked into images).

### 5.3 HOME: Remaining sections (in order)

**a) Trust strip (directly under hero).** Four animated stat tiles. Count-up on first reveal (1.2 s, ease-out), tabular numerals.
- **6,000+** Vehicles exported (since 2022). *(wording subject to client confirmation, see 2.1)*
- **24h** Fast response
- **1-Stop** Export service
- **VIN** Confirmation before loading
On mobile: 2×2 grid. Include a small "Est. 2026 · Registered capital RMB 1,000,000 · Xi'an, China" credential line below the tiles.

**b) "What we do" intro.** Two-column on desktop (stacked on mobile): left headline + short paragraph + CTA; right an image or animated illustration. Copy: use the mission and positioning from 2.1. Include the four service pillars as animated icon cards: **Trusted vehicle sourcing · Export documentation · Loading & shipment · After-sales support**.

**c) Featured vehicles carousel (second signature element).**
- Headline: "Popular models for export". Cards from the catalog data flagged `featured: true` (default: Zeekr 9X, ROX 01, Xiaomi SU7 EV, Avatr 12, BYD Tang L, Toyota RAV4, BMW X5, Ford Raptor F-150, Geely Coolray 1.5T).
- Embla Carousel, free-drag with snap alignment. **Peek:** show ~12-15% of the next card on mobile; 3.2 cards on desktop. Center-snap on mobile.
- Card: 4:3 image, category pill, model name, one-line descriptor, powertrain badge (EV / EREV / PHEV / Gasoline), button "Request Quote" and a text link "View details".
- Animations: card lift and image zoom (1.00 → 1.05) on hover (pointer devices only); the active/centered card is full scale and neighbors are 0.94 scale / 0.7 opacity on mobile, easing smoothly while dragging; pagination dots plus prev/next arrows on ≥768 px; optional slow autoplay is OFF by default (users are browsing).
- "View all vehicles" CTA after the carousel.

**d) Category grid.** Tiles linking to filtered catalog views: Flagship SUV · EV Sedans · Toyota · Premium · Pickups · Gasoline · MPV · Utility Vans · Commercial. Each tile: image, label, count. Hover/tap: image zoom and a gold arrow slides in.

**e) How it works (6-step timeline).** Source: 2.4.
- Desktop: horizontal line with six numbered nodes; the line draws as it enters the viewport and nodes pop in sequentially (80 ms stagger). Mobile: vertical timeline with the same behavior, or a horizontal scroll-snap row. Each step has a title (EN + 中文 on zh locale), icon and one supporting sentence taken from 2.4. Do not invent step descriptions beyond the deck.
- Beneath: two callouts *Document control* and *Finance clarity*.

**f) Why choose us.** Six cards from 2.5 (icon, title, sentence), 3×2 grid desktop, 2×3 tablet, 1×6 or horizontally swipeable mobile. Below: the "Why it matters" paragraph as a highlighted pull-quote panel.

**g) Brand wall.** Infinite horizontal marquee (two rows moving in opposite directions on ≥768 px; one row on mobile) of the brands in 2.8, with the label "Available for export". Pause on hover/touch-hold. Honor the trademark note in 2.8; use grayscale logos that colorize on hover if logos are used.

**h) Global reach: animated route map (third signature element).**
- Inline-SVG simplified world map in a dark navy panel with gold route arcs from **Xi'an** to each destination in 2.2. Arcs draw in sequence (stroke-dashoffset, ~1.6 s each, 150 ms stagger) when the section is revealed, destination nodes pulse softly, and a small plane/ship glyph MAY travel along an arc.
- Tap/hover on a destination shows a tooltip with the country name and a flag.
- On mobile the map is pinch-free: scale it to fit width, make nodes ≥ 24 px hit targets, and show a legend list of destinations under the map.
- Footer line: "Main target regions: Africa · Middle East · Central Asia · South America".
- Accessible alternative: a visually hidden list of destinations.

**i) Transport modes.** Four cards (Road Transport, Container Loading, RoRo Shipment, Railway Freight) with images from slide 10 (see Appendix A) and the one-liner selection logic from 2.6. Mobile: horizontal swipe carousel with snap.

**j) Operations gallery ("Our professional team").** Masonry or bento image grid with captions *Office team · Workshop support · Client reception · Order follow-up · Port loading*. Lightbox on tap with swipe, pinch-zoom on images, and keyboard support. Add the line: "One client, one responsible owner, one visible process."

**k) Overseas showrooms teaser.** Image + the four points from 2.7 as a compact list + CTA "Become a showroom partner" linking to /showrooms.

**l) FAQ (accordion).** The deck has no FAQ. Provide a **structure** with 6 questions and answers that the client MUST approve before launch; mark each answer `status: "draft"` in the content file and do not publish unapproved answers. Suggested questions: How do I request a quote? · What happens after I accept a quote (PI & payment)? · How do you confirm the exact vehicle (VIN and color)? · Which shipping methods do you offer? · Which countries do you ship to? · Do you provide export documents (PI/CI, packing list, export declaration)? Answers MUST only restate facts from Section 2; anything else is a placeholder.

**m) Final CTA band.** Full-width navy panel with gold glow: "Ready to import from China? Tell us the models, quantity and destination port. We'll respond with a quotation." (Do NOT promise a specific time other than the deck's "24h fast response" language; phrase it as "Fast response".) Embedded **compact quote form** (name, email/WhatsApp, vehicles of interest, message) plus a "Full quote request" link.

### 5.4 VEHICLES: catalog (`/vehicles`)

- **Header banner:** short hero with title "Vehicles for Export".
- **Filters (sticky on scroll):**
  - Category chips (horizontally scrollable on mobile): All · SUV · Sedan · Pickup · MPV · Van · Commercial · Premium · Toyota.
  - Powertrain chips: EV · EREV/PHEV · Gasoline · LPG.
  - Brand multi-select (drawer on mobile, sidebar/popover on desktop).
  - Text search over brand and model.
  - Active filters shown as removable pills; result count; "Clear all".
  - Filters sync to the URL query string (shareable, back-button friendly).
- **Grid:** 1 column (<480), 2 columns (480-1023), 3 columns (1024-1535), 4 columns (≥1536). Cards as in 5.3c. Animate filtering with layout transitions (cards fade/slide into new positions, 250 ms). Skeleton loaders while images load.
- **Empty state:** friendly message + "Can't find your model? Tell us what you need" CTA to the quote form with the search text prefilled.
- **Vehicle data is local, typed content (Section 13.1), not hardcoded in components.**

### 5.5 VEHICLES: detail page (`/vehicles/[slug]`)
- Image gallery: large image with thumbnails; swipe on touch; tap to open the fullscreen lightbox. For models with only one image, show it large and omit thumbnails.
- Title, category and powertrain badges, descriptor, an "About this model" paragraph built **only** from the deck descriptor (do not invent).
- **Specification block:** render fields only if present in data. If absent show: "Detailed specifications, trims and colors available on request." with a **Request this model** button.
- Sticky bottom bar on mobile with "Request Quote" and "WhatsApp" (prefilled message: "Hello, I'm interested in {model}. Please send a quotation.").
- "Includes with every export" panel: VIN & color confirmation, document support, loading coordination, shipment tracking (from 2.4/2.5).
- "Related vehicles" carousel (same category).
- Product structured data (no price; omit `offers`).

### 5.6 SERVICES (`/services`)
- Hero banner: "Complete export support, from quotation to delivery."
- Large version of the 6-step process (5.3e), each step expandable (accordion on mobile, side-by-side details on desktop) with the supporting statements from 2.4.
- Sections for the four team functions (2.3) as icon cards: Trading & Sales · Logistics & Customs · Finance & Accounting · After-sales Service.
- Transport modes (5.3i) with a short comparison note: "Selected based on destination, cost, urgency and market policy."
- Documentation checklist panel: PI / CI / packing list / export declaration / customer files.
- CTA band.

### 5.7 MARKETS (`/markets`)
- Large interactive route map (5.3h) as the page hero.
- Region tabs: Africa · Middle East · Central Asia · South America. Each tab lists the countries from 2.2 that belong to it. The deck gives no country-to-region grouping, so propose one (for example: Algeria → Africa; UAE, Saudi Arabia, Iraq, Iran → Middle East; Kazakhstan, Uzbekistan, Turkmenistan → Central Asia; Brazil, Colombia → South America; Pakistan and Russia placed where the client prefers). **Treat the grouping as a draft and flag it for client approval.**
- CTA: "Not on the list? Ask us about your market."

### 5.8 SHOWROOMS (`/showrooms`)
- Content from 2.7: four-point grid, the "HUIVEX showroom advantage" statement, photo pair from slide 8.
- "Partner with us" form: same quote form component, with the `inquiryType` field preset to `showroom-partner` and extra fields (city/country, existing business type).
- Do not claim specific showroom locations (the deck gives none).

### 5.9 ABOUT (`/about`)
- Company story using 2.1 (positioning, mission, established, registered capital, legal scope).
- Team structure (2.3) with the team-principle pull quote.
- Credentials panel: registered name (EN and 中文), registered capital, established date, business scope.
  - **Business-license image:** the deck's slide 3 includes a photo of the business license (contains an ID/QR code). Do NOT publish it by default. Provide an optional `showLicense` config flag, default `false`, pending client approval.
- Operations gallery (5.3j).
- Contact summary and map link to the address (Chinese address as given).

### 5.10 CONTACT / GET A QUOTE (`/contact`)
Two-column on desktop (form left, contact card right), stacked on mobile with the form first.

**Contact card:** contact person (Benny, Deputy General Manager), phone (tap-to-call `tel:`), WhatsApp button, WeChat ID with copy button + QR, email (`mailto:`), address (zh, with copy button), office hours **omitted** (not provided).

**Quote form fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| Full name | text | Yes | `autocomplete="name"` |
| Company | text | No | `autocomplete="organization"` |
| Country | searchable select | Yes | flags + ISO codes; prioritize the 12 destination countries at the top |
| Email | email | Yes (one of email/phone required) | `inputmode="email"` |
| Phone / WhatsApp | tel with country-code picker | Yes (one of email/phone required) | `inputmode="tel"` |
| Inquiry type | select | Yes | Vehicle quote / Showroom partnership / Other |
| Vehicles of interest | multi-select combobox fed from catalog + free text | No | prefilled from `?vehicle=slug` |
| Quantity | number / range select | No | 1, 2-5, 6-20, 20+ |
| Destination country / port | text | No | |
| Message | textarea | No | max 2000 chars |
| Consent | checkbox | Yes | links to Privacy Policy |
| Honeypot | hidden | n/a | spam trap |

**UX:** inline validation on blur, accessible error messages, 16 px minimum input font-size, 48 px minimum control height, a progress-style two-step layout is optional on mobile (Step 1: who you are. Step 2: what you need), the submit button shows a loading state, and on success the form morphs into an animated confirmation (gold check draw-in) with a summary and "What happens next" (Quote → PI & Payment → VIN Check, from 2.4). On failure keep entered data and show a retry message plus direct WhatsApp/email fallbacks.

### 5.11 Legal pages and 404
- `/privacy` and `/terms`: generate sensible templates covering data collected via the form, cookies/analytics, retention, contact for deletion. **Mark as "draft: client to review with legal counsel".** (The agent is not providing legal advice.)
- `/404`: branded, animated (car moves along the bridge line from the logo concept), links to Home, Vehicles, Contact.

### 5.12 Footer
- Navy background with a thin gold top rule.
- Columns: logo + one-line mission and tagline · Quick links · Vehicle categories · Contact (phone, WhatsApp, WeChat ID, email, Chinese address).
- Legal line: "© 2026 HUIVEX AUTO GLOBAL, LTD · 陕西汇驰天下汽车贸易有限公司. All rights reserved."
- Trademark disclaimer: "All brand names and logos are property of their respective owners. Huivex Auto Global, Ltd. is an independent export trading company and is not an official dealer or representative of the brands shown unless stated otherwise."
- Privacy · Terms links; language switcher; "Back to top" button with smooth scroll.

---

## 6. Visual design system

### 6.1 Design direction
**Modern, sleek, premium-international.** Think "luxury logistics meets automotive launch page": deep navy surfaces, gold used sparingly as an accent for emphasis and CTAs, generous white space, large confident typography, big photography, glass/blur layers, and fluid motion. It must feel trustworthy and corporate, not flashy. No stock-template look, no clutter, no more than two accent treatments per screen.

### 6.2 Color tokens (define as CSS variables; derived from the logo)
| Token | Value | Use |
|---|---|---|
| `--navy-950` | `#050F24` | Footer, deepest overlays |
| `--navy-900` | `#0A2352` | Brand navy (logo), headers, dark sections |
| `--navy-700` | `#163A7A` | Hover states, secondary surfaces |
| `--gold-500` | `#C9962E` | Brand gold (logo), CTAs, accents |
| `--gold-300` | `#E6C879` | Gold highlights, gradients |
| `--gold-700` | `#9A6F1C` | Gold text on light backgrounds (contrast) |
| `--ink` | `#0B1220` | Body text on light |
| `--slate-600` | `#475569` | Secondary text |
| `--mist-50` | `#F6F8FC` | Page background (light sections) |
| `--white` | `#FFFFFF` | Cards |
| `--success` / `--danger` | `#16A34A` / `#DC2626` | Form states |

- Gold gradient for primary buttons: `linear-gradient(135deg, #E6C879, #C9962E 55%, #A97A1F)` with navy text.
- Verify the actual logo colors by sampling the logo asset and adjust the tokens to match exactly; keep the **names** stable.
- Body text vs. background contrast MUST meet WCAG AA (4.5:1). Do not put gold text (`--gold-500`) on white for body-size text; use `--gold-700`.
- Alternate section backgrounds (light `--mist-50` / white / dark navy) to create rhythm.
- A dark theme toggle is **not** required.

### 6.3 Typography
- **Headings:** a geometric sans that echoes the logo, such as **Sora**, **Outfit** or **Plus Jakarta Sans** (pick one). Weight 600-700, tight tracking (-0.02em) on large sizes.
- **Body/UI:** **Inter** (or the same family as headings at 400-500).
- **Chinese:** Noto Sans SC.
- **Fonts MUST be self-hosted** (e.g., `next/font` or downloaded WOFF2 files), never loaded from Google's CDN at runtime: Google Fonts is unreliable inside mainland China, where the client's team and some partners will view the site. Subset and `font-display: swap`.
- Fluid type scale using `clamp()`:
  - H1: `clamp(2.25rem, 1.4rem + 4vw, 4.75rem)`
  - H2: `clamp(1.75rem, 1.2rem + 2.4vw, 3rem)`
  - H3: `clamp(1.25rem, 1.05rem + 0.9vw, 1.625rem)`
  - Body: `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)`, line-height 1.6
  - Eyebrow: 0.75-0.8125rem, uppercase, letter-spacing 0.14em, gold.
- Max line length ~68 characters for paragraphs.

### 6.4 Layout, spacing and shape
- 8-pt spacing scale. Section padding: 72 px (mobile), 96 px (tablet), 128 px (desktop) vertical.
- Container max-width 1280 px with fluid side padding (20 px mobile, 32 px tablet, 48 px desktop). Hero and gallery MAY go full-bleed.
- Radii: 16 px for cards, 12 px for inputs/buttons, full-round for pills.
- Shadows: soft, layered, navy-tinted (`0 10px 30px -12px rgba(10, 35, 82, .25)`).
- Glass panels (blur 12-16 px, white 8-12% on navy) for overlays on the hero and sticky header.
- Subtle decorative motifs from the logo: thin gold rules, an arc/globe line pattern in dark sections. Keep them extremely light so they never compete with content.

### 6.5 Component library (build these as reusable components)
Button (primary gold / secondary outline / ghost; sizes; loading), Pill/Badge, SectionHeader, StatTile, FeatureCard, VehicleCard, CategoryTile, Timeline, Accordion, Carousel (generic wrapper around Embla with dots/arrows/progress), Lightbox, Marquee, RouteMap, Drawer, Modal, FormField set, Toast, Skeleton, Tooltip, Reveal (scroll animation wrapper), LanguageSwitcher, FloatingActions.

Buttons: min height 48 px, 12 px radius, label 600 weight. Primary has a gentle shine sweep on hover (pointer devices) and a press scale of 0.98.

---

## 7. Motion and animation system

### 7.1 Principles
Smooth, purposeful, never gimmicky. Animations guide attention and signal quality; they MUST NOT block content, delay interaction or cause layout shift. **Animate only `transform` and `opacity`** (plus `clip-path`/`stroke-dashoffset` for specific effects); never animate `width/height/top/left`.

### 7.2 Motion tokens
```
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* default enter */
--ease-inout:  cubic-bezier(0.65, 0, 0.35, 1);   /* carousels, drawers */
--dur-fast:    150ms;   /* hovers, presses */
--dur-base:    300ms;   /* UI state changes */
--dur-slow:    600ms;   /* reveals */
--dur-hero:    900ms;   /* hero crossfade */
```

### 7.3 Scroll reveal (standard)
- Elements enter at 24 px below with `opacity: 0` → `translateY(0) opacity: 1`, 600 ms ease-out, triggered once when ≥15% visible (IntersectionObserver or Framer Motion `whileInView` with `once: true`).
- Groups stagger by 70-90 ms per child (cap total stagger at ~600 ms).
- Content MUST remain visible if JavaScript fails (progressive enhancement: use a `no-js` fallback or render visible by default and apply the hidden state only after hydration).

### 7.4 Carousels (all of them)
- Built on **Embla Carousel** (or Swiper if the agent can justify it) with: touch/mouse drag, momentum, snap, keyboard support, `aria-roledescription="carousel"`, live-region announcement of slide changes when autoplay is off, and `inert`/`aria-hidden` for off-screen slides.
- Dot/progress indicators animate in sync with slide position (interpolate with scroll progress, not just on settle).
- Prevent vertical-scroll hijacking: horizontal swipe handled by the carousel, vertical scrolling passes to the page (`touch-action: pan-y`).
- Edge resistance and rubber-banding at non-looping ends.

### 7.5 Catalog of required effects
| Effect | Where | Spec |
|---|---|---|
| Hero crossfade + Ken Burns + staggered text | Home hero | 5.2 |
| Header solidify, hide/show on scroll | Header | 4.1 |
| Count-up numbers | Trust strip | 1.2 s, once |
| Timeline line draw + node pop | How it works | line draws with scroll progress or 1.2 s once; nodes stagger 80 ms |
| Route arcs drawing + node pulse | Route map | 5.3h |
| Brand marquee | Brand wall | CSS `translateX` loop, 40-60 s per cycle, pause on hover |
| Card hover lift | Cards | `translateY(-6px)`, shadow deepen, image `scale(1.05)` over 500 ms (pointer devices only, via `@media (hover: hover)`) |
| Filter layout transition | Catalog | 250 ms layout animation |
| Page transitions | Route changes | 250-300 ms fade + 12 px slide; use the View Transitions API where supported, else Framer Motion |
| Drawer open | Mobile nav | 350 ms ease-inout slide, backdrop fade, stagger links 40 ms |
| Form success | Contact | gold check stroke draw, 600 ms |
| Parallax | Hero/banners | **Subtle only** (≤ 8% translate) and DISABLED on touch devices and reduced motion |
| Skeleton shimmer | Image loading | 1.4 s loop |
| Blur-up | All images | low-quality placeholder fades to sharp over 400 ms |
| 404 car-on-bridge | 404 | simple looping SVG translate |

### 7.6 Reduced motion and performance
- `@media (prefers-reduced-motion: reduce)`: disable autoplay, parallax, Ken Burns, marquee (show static wrapped grid), count-up (show final value), arc drawing (show final state) and replace slides/reveals with simple opacity fades ≤ 150 ms.
- Respect `Save-Data` and slow connections: skip autoplay video/heavy effects.
- Do not use scroll-jacking or custom smooth-scroll libraries that alter native touch scrolling. (A desktop-only smooth scroll such as Lenis MAY be added if it is disabled on touch devices and does not break anchor links, focus or accessibility.)
- Keep main-thread work low: no more than ~60 KB gzipped of animation JS beyond the framework; code-split the route map and lightbox.
- Target a steady 60 fps on a mid-range Android phone (e.g., Snapdragon 6-series class).

---

## 8. Responsive design (mobile portrait + landscape + tablet + desktop)

### 8.1 Strategy
**Mobile-first CSS.** Base styles are for a 360 px portrait phone, progressively enhanced with `min-width` queries. Use CSS Grid/Flex, fluid type and spacing (`clamp`), `aspect-ratio`, container queries where helpful, and logical properties.

Breakpoints: `base` ≥ 320 · `sm` 480 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536.

Global rules (MUST):
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- **No horizontal page scroll at any width from 320 px up.** Wide content (tables, code, maps) scrolls inside its own container.
- Never use `100vh` for full-height sections. Use `100svh` (with `100vh` fallback) so mobile browser URL-bar collapse does not cause jumps; use `dvh` only where intentional.
- Touch targets ≥ 44×44 px (prefer 48), with ≥ 8 px between adjacent targets.
- Form inputs use `font-size ≥ 16px` (prevents iOS Safari zoom on focus).
- No hover-only interactions: everything reachable by hover must be reachable by tap/focus. Wrap hover effects in `@media (hover: hover) and (pointer: fine)`.
- Respect safe areas: pad fixed bars with `env(safe-area-inset-top/right/bottom/left)`, especially important in landscape on notched iPhones.
- Images: `max-width: 100%`, explicit `width`/`height` or `aspect-ratio` to prevent CLS.

### 8.2 Landscape phones (first-class requirement)
Landscape phones are short (≈ 320-430 px tall) and wide (≈ 568-932 px). Detect with
`@media (orientation: landscape) and (max-height: 500px)` and apply:
- **Header:** 56 px, no tagline, hamburger drawer remains.
- **Hero:** height `100svh` with `min-height: 320px`; switch to a **two-column layout**: text on the inline-start (headline smaller via `clamp` using `vh`-aware limits, one-line sub-headline, buttons side by side), image on the inline-end or full-bleed behind with the text on a gradient panel. Hide the scroll indicator. Slide controls move to the bottom inline-end.
- Large vertical section padding shrinks to 40-56 px.
- Fixed bottom action bar becomes the collapsed floating button (4.2).
- Drawer uses two columns for links if needed so nothing requires scrolling to find Get a Quote.
- Carousels show more cards per view (2 on landscape phones for the vehicle carousel).
- Modals/lightbox use the full viewport and a close button in the corner; avoid vertical centering that clips content (use `max-height: 100svh` and internal scroll).
- Form inputs: when the on-screen keyboard is open, the active field scrolls into view (`scrollIntoView({block:'center'})`) and the fixed bars hide.
- Test rotation: the layout MUST adapt live on rotate without a reload and without losing carousel position, drawer state or form input.

### 8.3 Tablet and desktop
- Tablet portrait (768-1023): two-column grids, nav may stay in the drawer until 1024.
- Desktop (≥1024): full nav, hover effects, 3-4 column grids, side-by-side sections.
- Ultra-wide (≥1920): content stays within 1280-1440 px container; hero background stays full-bleed without upscaling artifacts (provide a 2400 px-wide image variant).

### 8.4 Device and browser test matrix (QA MUST cover)
| Device class | Viewport (portrait / landscape) |
|---|---|
| Small Android | 360×640 / 640×360 |
| iPhone SE | 375×667 / 667×375 |
| iPhone 14/15 | 390×844 / 844×390 |
| iPhone Pro Max | 430×932 / 932×430 |
| Pixel / Galaxy | 412×915 / 915×412 |
| iPad mini | 744×1133 / 1133×744 |
| iPad Pro 11" | 834×1194 / 1194×834 |
| Laptop | 1366×768 |
| Desktop | 1920×1080 |
| Ultra-wide | 2560×1080 |

Browsers: iOS Safari 16+, Chrome for Android (current), Samsung Internet (current), Chrome/Edge/Firefox/Safari desktop (current and previous major). Verify at 200% browser zoom and with large system font sizes.

---

## 9. Imagery, content and copy rules

### 9.1 Tone of voice
Professional, clear, confident, transparent. Short sentences. Plain international English (many readers are non-native speakers). Avoid hype ("best", "cheapest", "guaranteed") and any claim not in Section 2. Chinese copy uses the deck's wording. Use "we" for the company.

### 9.2 Imagery rules
- The deck's images are a **mix of AI-generated illustrations/renders and photos**, and the vehicle shots vary widely in background and quality. For launch the agent MUST:
  - Use the deck imagery as-is where it looks professional and consistent, but never alter a vehicle's appearance.
  - Present vehicle images consistently: same 4:3 aspect, `object-fit: cover` on a neutral card background, with a subtle gradient overlay for text legibility.
  - Flag in `OPEN_QUESTIONS.md` that the client SHOULD supply real photos and videos of actual stock, port loading and the office/team, because **authentic imagery is the single biggest trust factor** in this industry. Build image slots so replacement is a file swap.
- Images that are rendered slide pages or posters (with text baked in) are **not** to be used as photography: slides 1, 2, 12, 19, 20, 21, 23 (see Appendix A).
- Do not display images containing identifiable ID numbers or QR codes (the business license) unless approved.
- Alt text on every informative image; decorative images get `alt=""`.

### 9.3 Content management
All copy lives in locale files (`/content/{en,zh}/*.json` or MDX), all vehicles in a typed data file (13.1), all contact details and feature flags in one `site.config.ts`. No hardcoded strings in components. This lets the client or a developer update content without touching layout code.

---

## 10. Asset pipeline

**Source:** `HAG_2026.pptx`. Extract with `unzip HAG_2026.pptx -d hag` and read from `hag/ppt/media/`. Slide-to-media mapping and dimensions are in Appendix A. **Open and visually inspect each image before assigning it a role.** The agent MUST NOT assume content from the file name or slide number alone.

1. **Logo**
   - `image3.png` (1113×805) in the deck is the cropped logo with a **real alpha channel**. Use it as the header/footer logo base. Verify it looks clean on both light and dark backgrounds.
   - Provide: a light-background version and a white/gold-on-dark version (CSS filter or a recolored copy; do not distort), a square mark for favicon and app icons (crop the **HAG monogram** area), `favicon.ico`, `apple-touch-icon.png` (180), `icon-192/512.png`, and an OG image.
   - Offer to vectorize (SVG trace) the logo for crispness; if the trace is not faithful, keep the PNG at 2× resolution. Never stretch the 1254 px JPEG into a hero.
2. **Optimization (MUST):** deck PNGs are 0.3-4 MB each. Convert to **AVIF + WebP** with JPEG/PNG fallback only if needed, generate responsive widths (480, 768, 1080, 1440, 1920, 2400 where the source allows), strip metadata, create 20-px blur placeholders. Budget: hero image ≤ 180 KB at mobile width, any card image ≤ 70 KB, total initial page weight ≤ 1.2 MB on mobile.
3. **Naming:** `/public/images/{section}/{slug}-{w}.avif` etc. Keep a `assets.manifest.json` (id, source file, role, alt text, focal point).
4. **Upscaling:** the 600×800 JPEGs (`image11`, `image21`) MUST NOT be used as full-width heroes.
5. **Video:** not provided. Reserve optional hero video support (muted, `playsinline`, poster, disabled on Save-Data and reduced motion) behind a config flag, off by default.

---

## 11. Technical requirements

### 11.1 Recommended stack (default; the agent MAY substitute if all Section 12 requirements are still met)
| Concern | Choice |
|---|---|
| Framework | **Next.js (current stable, App Router)** with **TypeScript**, static generation (SSG/ISR) for all content pages |
| Styling | **Tailwind CSS** + CSS variables for design tokens |
| Animation | **Framer Motion** (a.k.a. `motion`) for UI/page/reveal animation; CSS for marquee and simple hovers; GSAP is not needed |
| Carousel | **Embla Carousel** (+ autoplay plugin, custom progress/dots) |
| i18n | **next-intl** (or equivalent) with locale-prefixed routes, RTL-ready |
| Forms | **React Hook Form + Zod** (shared schema client/server) |
| Icons | lucide-react (tree-shaken) or custom SVG |
| Images | `next/image` with a custom pre-optimized set (Section 10) |
| Lightbox | Lightweight (e.g., yet-another-react-lightbox, lazy-loaded) or custom |
| Map | Hand-built inline SVG (no map SDK, no tile requests) |
| Email | Server route sending via **Resend** or SMTP (Nodemailer), configured with env vars |
| Anti-spam | Honeypot + server-side rate limiting + **Cloudflare Turnstile** (or hCaptcha); Google reCAPTCHA is NOT recommended because of China accessibility |
| Hosting | Vercel or Cloudflare Pages/Workers; add a note in the README about mainland-China reachability (some hosts are slow or blocked there) and keep the site free of blocked third-party resources (Google Fonts, YouTube embeds, Google Maps embeds, reCAPTCHA) |
| Containerization | Provide a `Dockerfile` and `docker-compose.yml` for self-hosting as an alternative |
| Quality | ESLint, Prettier, TypeScript strict, Playwright smoke tests, Lighthouse CI |

*Alternative accepted by the client's developer:* React + TypeScript front end with the quote endpoint implemented as a **FastAPI** service (Docker). If chosen, the SSR/SEO requirements in Section 12 still apply (so prerender or SSR the pages).

### 11.2 Repository structure (suggested)
```
/app/[locale]/(pages...)
/components/ui | sections | layout
/content/en | zh
/data/vehicles.ts  /data/markets.ts  /data/faq.ts
/lib/ (seo, i18n, analytics, validators, email)
/public/images /public/fonts /public/icons
site.config.ts   assets.manifest.json   OPEN_QUESTIONS.md   README.md   .env.example
```

### 11.3 Environment variables (`.env.example`)
`SITE_URL`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY` (or `SMTP_*`), `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `ANALYTICS_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`. No secrets in the client bundle or the repo.

---

## 12. Non-functional requirements

### 12.1 Performance (MUST)
- Core Web Vitals on mobile (Lighthouse, Moto G Power-class emulation, slow 4G): LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms, TBT ≤ 200 ms.
- Initial JS ≤ 170 KB gzipped on the home route; route-level code splitting; defer below-the-fold interactive components (map, lightbox, FAQ).
- Preload LCP image, preconnect only to domains actually used. No render-blocking third-party scripts.
- Cache static assets with immutable far-future headers; serve compressed (Brotli/gzip).

### 12.2 Accessibility (MUST: WCAG 2.2 AA)
Semantic landmarks, one H1 per page, logical heading order, skip-to-content link, visible focus rings (2 px gold with navy offset), keyboard-operable carousels/drawer/accordion/lightbox/filters, ARIA only where needed, color contrast per 6.2, form labels and error association (`aria-describedby`, `aria-invalid`), pause/stop control for autoplay content, `prefers-reduced-motion` honored, `lang` attribute per locale (and `dir="rtl"` readiness), accessible names for icon buttons, no information conveyed by color alone.

### 12.3 SEO (MUST)
- Server-rendered/prerendered HTML for all pages (crawlable without JS).
- Unique `<title>` and meta description per page and locale, e.g. "Export Cars from China | Huivex Auto Global" and "Browse EVs, SUVs, pickups and more. Quote-to-delivery export support from Xi'an, China."
- Open Graph + Twitter cards with a branded OG image; canonical URLs; `hreflang` (en, zh-CN, `x-default`); `sitemap.xml`; `robots.txt`.
- JSON-LD: `Organization` (name, alternateName in Chinese, logo, address, contactPoint), `WebSite`, `BreadcrumbList`, `Product`/`Vehicle` on detail pages (no price), `FAQPage` only for approved FAQs.
- Clean, human-readable slugs; semantic image filenames and alt text; internal links between related pages.
- Do NOT claim "new" or "used" in titles/schema until the client confirms the vehicles' condition.

### 12.4 Security and privacy (MUST)
HTTPS only with HSTS; security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protections); server-side validation and sanitization of all form input; rate limiting on the quote endpoint; no PII in logs; escape all user input in emails; dependency audit in CI.
Privacy: collect only the fields in 5.10; disclose in the Privacy Policy; analytics MUST be privacy-friendly (Plausible/Umami) or gated behind consent (GA4). Show a minimal consent banner only if non-essential cookies are used.

### 12.5 Analytics and events
Page views plus custom events: `quote_submit_success`, `quote_submit_error`, `whatsapp_click`, `call_click`, `email_click`, `wechat_copy`, `vehicle_view`, `filter_use`, `cta_click` (with location), `language_switch`. Provide a documented event list in the README.

### 12.6 Reliability and email delivery
Quote submissions MUST NOT be lost. On submit: (1) validate, (2) send the notification email to `CONTACT_TO_EMAIL`, (3) send an auto-acknowledgement to the visitor (if an email was given), (4) append the lead to a durable store (e.g., a database table, a Google Sheet via service account, or at minimum a persisted JSON/log) so a failed email does not lose the lead. If everything fails, the UI shows direct-contact fallbacks.

---

## 13. Data models and API

### 13.1 Vehicle model
```ts
type Powertrain = "EV" | "EREV" | "PHEV" | "Gasoline" | "LPG" | "Unspecified";
type Category = "suv" | "sedan" | "pickup" | "mpv" | "van" | "commercial";

interface Vehicle {
  slug: string;                 // "zeekr-9x"
  brand: string;                // "Zeekr"
  model: string;                // "9X"
  title: string;                // "Zeekr 9X"
  category: Category;
  collections: string[];        // ["flagship-suv","premium","toyota",...]
  powertrain: Powertrain;       // "Unspecified" if the deck doesn't say
  descriptor: Record<"en" | "zh", string>;   // from the deck
  images: { src: string; alt: Record<"en"|"zh", string>; w: number; h: number; blur: string }[];
  featured?: boolean;
  specs?: Record<string, string>;            // OPTIONAL; omit if unknown, never invent
  condition?: "new" | "used" | "zero-km";    // OPTIONAL; omit until client confirms
  status: "published" | "draft";
  sortOrder: number;
}
```
Seed with the 21 rows in 2.9. Rows 16-21 have only full-slide images; mark them `status: "draft"` and hide them until proper images are supplied (or crop clean regions with the client's approval).

### 13.2 Quote API
`POST /api/quote` (JSON)
```json
{
  "locale": "en",
  "name": "string", "company": "string?", "country": "ISO-3166 alpha-2",
  "email": "string?", "phone": "E.164 string?",
  "inquiryType": "vehicle-quote | showroom-partner | other",
  "vehicles": ["slug-or-free-text"], "quantity": "1 | 2-5 | 6-20 | 20+",
  "destination": "string?", "message": "string?", "consent": true,
  "turnstileToken": "string", "hp": ""
}
```
Responses: `200 {ok:true, id}` · `400 {ok:false, errors:{field:msg}}` · `429 {ok:false, retryAfter}` · `500 {ok:false}`. At least one of `email` / `phone` is required. Shared Zod schema for client and server.

**Notification email (to client):** subject `New {inquiryType} from {name} ({country})`; body with all fields in a scannable table, reply-to set to the visitor's email, and a one-tap `wa.me` link if a phone was given.

---

## 14. Delivery phases

**Phase 1: Foundation and Home (MVP core)**
Project setup, design tokens, fonts, i18n scaffolding, layout (header, drawer, footer, floating actions), asset pipeline, Home page with all sections in 5.2-5.3, quote form + API, SEO basics, deploy to preview.

**Phase 2: Catalog and inner pages**
Vehicles catalog + filters + detail pages, Services, Markets (full route map), Showrooms, About, Contact, Legal, 404, Chinese locale complete.

**Phase 3: Polish and launch**
Animation tuning, reduced-motion pass, accessibility audit, performance budget tuning, device-matrix QA (8.4), analytics events, structured data, sitemap, README and handover docs, production deploy, redirects and domain/SSL setup.

**Phase 4 (post-launch, optional):** Arabic (RTL), Russian, Spanish, Portuguese; blog/news; CMS integration; vehicle spec sheets (PDF download); live stock; customer testimonials with real logos and permissions; video hero.

---

## 15. Acceptance criteria (definition of done)

**Functional**
- [ ] All pages in Section 3 exist, are linked, and render in EN and ZH.
- [ ] Hero carousel autoplays, swipes, pauses on interaction, and has working progress bars, arrows and keyboard control.
- [ ] Featured-vehicle carousel is draggable with snap and a visible peek on mobile.
- [ ] Catalog filters work, sync to the URL, and have a working empty state.
- [ ] Quote form validates, submits, sends the email(s), stores the lead, and shows success/error states; tested with real inbox delivery.
- [ ] WhatsApp, call, email and WeChat actions work on mobile and desktop; config flags can hide any of them.
- [ ] Language switch preserves the page.

**Responsive**
- [ ] No horizontal scroll at any width 320-2560 px.
- [ ] Every page checked in portrait **and landscape** on the matrix in 8.4; hero, drawer, forms, lightbox and carousels are usable in landscape without clipped content.
- [ ] Rotation changes layout live without losing state.
- [ ] All touch targets ≥ 44 px; form fields ≥ 16 px font.

**Visual and motion**
- [ ] Design tokens and typography match Section 6; gold used as an accent only.
- [ ] All effects in 7.5 implemented; transform/opacity only; 60 fps on a mid-range Android.
- [ ] Reduced-motion mode verified.

**Quality**
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95 on Home, Vehicles and Contact.
- [ ] CWV targets in 12.1 met; image and JS budgets met.
- [ ] axe-core: zero serious/critical violations; keyboard-only walkthrough passes.
- [ ] No third-party requests to Google Fonts/CDNs blocked in China.
- [ ] No invented facts: every number/claim traces to Section 2 or is marked as draft.
- [ ] README documents setup, env vars, how to add a vehicle, how to edit copy, how to add a language, deployment, and the analytics events.

---

## 16. Open questions for the client (agent: write these into `OPEN_QUESTIONS.md`; product owner: please resolve)

1. **Domain and branded email.** What is the domain? Can we use a company email (not a personal iCloud address) for inquiries and for the public contact?
2. **Public contact details.** Is it OK to publish Benny's name, phone and email publicly? Is +86 182 4089 7728 on WhatsApp? Is there a WeChat QR code to display?
3. **English address.** Please provide the official English version of the Xi'an address.
4. **Track record wording.** The deck says 6,000+ exports during 2022-2025, but the company was established in June 2026. How should this be worded (e.g., "the team's experience")?
5. **Vehicle condition.** Are the vehicles new, zero-km or used? This affects copy, SEO and export-compliance wording.
6. **Specs and prices.** Does the client want to show specs, trims, colors, or "from" prices? Provide a spreadsheet and the data file will be filled.
7. **Spelling of models.** Confirm "Xiaomi Pengcheng N90", the Toyota/other powertrains, the "Livan" brand name, and rows 16-21 (vans, MPVs, trucks, crane) with proper photos.
8. **Brand logos.** Are brand logos permitted on the site (trademark/authorization)? If not, use text wordmarks.
9. **Imagery.** Please supply real photos/videos (port loading, stock, office, team). Which deck images are AI-generated and should be replaced?
10. **Business license.** Should the license image or number be shown publicly? (Default: no.)
11. **Languages.** Is English + Chinese enough for launch? Which of Arabic, Russian, Spanish, Portuguese come next?
12. **Region grouping on the Markets page.** Please confirm which region each destination belongs to.
13. **Testimonials/partners.** Are there real client or partner quotes/logos we can use (with permission)?
14. **Social links.** Any Facebook, Instagram, TikTok, YouTube, LinkedIn, Telegram accounts?
15. **Hosting and accounts.** Who owns the hosting, domain, email-sending and analytics accounts?
16. **FAQ answers.** Approve or supply the FAQ answers.

---

## Appendix A: Deck media map (for the asset pipeline)

Media is in `ppt/media/`. Dimensions are width×height in pixels. **Inspect every file before use.**

| Slide | Content (from deck) | Media files |
|---|---|---|
| 1 | Cover poster "2026 Export Vehicle Portfolio" (text baked in) | image1.png 1055×1491 |
| 2 | "Welcome to HAG" enterprise poster (text baked in) + header logo | image2.png 1055×1491; **image3.png 1113×805 (logo, transparent)** |
| 3 | Enterprise intro + business license photo (**sensitive**) | image4.jpeg 1783×1279 |
| 4 | Team introduction (logo only) | image3.png |
| 5 | Professional teams: office, workshop, reception, order follow-up, port loading | image9.png 1672×941 · image8.jpeg 1536×2048 · image7.jpeg 1536×2048 · image6.png 1086×1448 · image5.png 1448×1086 |
| 6 | Logistics & finance banner image | image10.png 1672×941 |
| 7 | Export performance photo collage (containers, loading) | image15.jpeg 2275×1279 · image14.png / image13.png / image12.png 1320×2868 (phone screenshots/portrait photos) · image11.jpeg 600×800 |
| 8 | Overseas showrooms | image17.png 1320×2868 · image16.png 1271×1237 |
| 9 | Car-source advantages banner | image18.png 1536×1024 |
| 10 | Transport modes: road, container, RoRo, railway | image22.png · image20.png · image19.png (each 1672×941) · image21.jpeg 600×800 · image23.png 1506×266 (banner strip) |
| 11 | Exit route map, centered on Xi'an (dark, glowing routes) | image24.png 1491×1055 |
| 12 | Brand portfolio logo wall (rendered slide, text baked in) | image25.png 1086×1448 |
| 13 | Flagship SUVs: Zeekr 9X, ROX 01, Xiaomi N90 | image26.png · image27.png · image28.png (1400×1050) |
| 14 | EV sedans: SU7, Avatr 12, BYD Tang L | image29.png · image30.png · image31.jpeg (1400×1050) |
| 15 | Toyota lineup | image32.png · image33.jpeg · image34.jpeg (1400×1050) |
| 16 | Premium: BMW X5, Mercedes GLC | image35.png · image36.png (1400×1050) |
| 17 | Pickups: Ford Raptor F-150, Nissan Frontier Pro PHEV | image37.jpeg · image38.jpeg (1400×1050) |
| 18 | Gasoline: Jetour Traveler, Geely Coolray 1.5T | image39.jpeg · image40.jpeg (1400×1050) |
| 19 | Utility vehicles (rendered slide) | image41.png 1038×1516 |
| 20 | MPV vehicles (rendered slide) | image42.png 1086×1448 |
| 21 | Commercial vehicles (rendered slide) | image43.png 1086×1448 |
| 22 | Contact slide (logo only) | image3.png |
| 23 | "Thank you" poster (text baked in) | image44.png 1086×1448 |

Notes: the mapping of individual vehicle files to model names on slides 13-18 follows the visual order seen in the deck (verify each by opening it). Slides 19-21, 12, 1, 2, 23 are flattened slide renders; they are **reference only** unless the client supplies clean source images for those vehicles. The deck contains files that appear to be AI-generated (for example "ChatGPT Image …" filenames in the source); treat authenticity of imagery as an open question.

## Appendix B: Competitor reference (wlbauto.com)

At the time of writing, the competitor site `www.wlbauto.com` could not be loaded for analysis (the page request timed out), so **no specific competitor features are copied or assumed in this PRD.**

**Product owner action:** before or during the build, add 5-10 phone screenshots of the competitor site (home, vehicle list, a vehicle page, contact) to the repo under `/docs/competitor/` and a short list of what you like and dislike. The agent should then reconcile this PRD with those notes and record any differences in `OPEN_QUESTIONS.md`.

**Benchmark principle (applies regardless):** the goal is to be clearly better than typical China-export car sites on (1) mobile polish and speed, (2) motion quality, (3) trust signals and process transparency, and (4) a fast, low-friction inquiry path. The requirements above are written to achieve exactly that.
