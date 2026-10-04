# Approved group A — touch-target fixes

The previously measured language control (42×40 px), mobile menu button (42×42 px), hero segmented controls (34×24 px hit area), and catalog filter chips (about 32 px high) now meet the 44×44 px minimum.

Also sized the new hero arrow buttons, featured-carousel dots and arrows, catalog clear control, header CTA, quick-contact actions, and vehicle-card text links to at least 44 px high. The hero, featured-carousel, navigation, quick-action, and catalog filter control groups use at least 8 px spacing.

`hero.spec.mjs` checks the audited control groups on the Home and Vehicles pages and performs touch-emulated swipe and orientation-preservation checks. The four landscape hero screenshots are saved alongside this file.