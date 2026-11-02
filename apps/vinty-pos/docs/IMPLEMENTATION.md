# Vinty POS implementation record

Date: 2 November 2026 (Asia/Jakarta).

## 1. Inspect the existing portfolio

The existing Vinty project described a landing page, used unrelated/starter imagery, and linked to `arhaqx/veloce-landing-page`. The user clarified that Vinty is their own café. Scope was updated to a new POS application and a personal-business case study, retaining the existing project URL.

## 2. Inspect public Expo POS repositories

| Repository | Verified evidence | Decision |
| --- | --- | --- |
| [n17foo/retailpos](https://github.com/n17foo/retailpos) | Public Expo/React Native POS, explicit Apache-2.0 `LICENSE`, integer-money utilities and POS modules | Selected reference. Pin `599406788360ef98c147e47f303ce2feaa50ecdf`; adapt money utilities only. |
| [hasebusman/offline-sync](https://github.com/hasebusman/offline-sync) | Expo 52, restaurant ordering, PouchDB + Socket.IO + native discovery; README says MIT but root `LICENSE` request returned 404 | Useful architecture comparison; no source copied. Native discovery/server stack exceeds the focused demo scope. |
| [thoriqdharmawan/fluffy-expo](https://github.com/thoriqdharmawan/fluffy-expo) | Expo 48 / React Native 0.71.6 in `package.json`; no root `LICENSE` returned | Older dependency set; no source copied. |

The new app is not a wholesale fork of RetailPOS. Its broader connector, payment, synchronization, and hardware integrations are not features of Vinty POS. Source attribution distinguishes a reference from actual adapted code.

## 3. Build a focused, runnable application

Keep the Expo app in `apps/vinty-pos` with its own lockfile and React dependency set. Implement domain rules as pure TypeScript. Use a single-versioned AsyncStorage snapshot, revision comparisons, and browser Web Locks. Add cashier, order fulfillment/voiding, product/stock editing, reports, CSV, and receipts. Create original illustrative menu assets; all seeded menu/pricing data remains explicitly marked as sample.

## 4. Verify before showcasing

Run TypeScript checks and domain tests, export web and Android/Hermes bundles, and verify real interactions in the browser. Capture screenshots from the running application. Screenshots with transaction figures contain deliberately entered demo transactions, not claimed café business results. The mobile screenshot is a browser viewport of the actual Expo web app, not a native Android device screenshot.

## 5. Update the existing portfolio

Preserve `/projects/vinty-coffee-and-space`. Add `/projects/vinty-coffee-and-space/demo` with the actual Expo web export. Update the project narrative, preview, gallery dimensions, About experience, chatbot knowledge, and build pipeline. Use the existing deployment infrastructure rather than creating a duplicate website under a different host.

## Release boundary

This deliverable is a functional single-register prototype with tested application logic and exported bundles. It does not establish production café use, native device compatibility, payment processing, multi-register operation, or a published APK. Device testing and an authenticated EAS build are needed for an installable Android release.
