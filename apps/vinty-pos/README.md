# Vinty POS

A functional single-register POS prototype for **Vinty Coffee & Space**, Muhammad Arinal Haq's own café in Jepara. Expo + React Native + TypeScript power both the mobile app and the interactive web demo embedded in the portfolio.

The previous third-party POS is separate from this newly developed application. The menu, prices, stock, and illustrations shipped here are sample data, and the app is not presented as an operational production deployment.

## Run the app

Use Node.js 20.19.4+ and npm. This application deliberately uses the Expo SDK 54 dependency set, locked independently of the portfolio's Next.js/React dependencies.

From the portfolio root:

```sh
npm --prefix apps/vinty-pos ci
npm run dev:pos
```

In Expo CLI, open an Android emulator, a compatible development build, or a compatible Expo Go client. The currently installed Expo Go must support SDK 54; otherwise use a development build or the matching Android Expo Go version from Expo's official downloads. To run the browser during development:

```sh
npm --prefix apps/vinty-pos run web
```

For the portfolio-integrated demo:

```sh
npm run build:pos
npm run dev
```

Open `/projects/vinty-coffee-and-space/demo`, or `/demos/vinty-pos/index.html` for the full-screen app. `npm run build` automatically builds the Expo web export before the Next.js portfolio. On a fresh deployment, the prebuild helper installs the app's locked dependencies with `npm ci`. Generated web assets live in the ignored `public/demos/vinty-pos/` directory.

## Try the workflow

1. In **Kasir**, search/filter the menu and add items. Open **Buka pesanan** on small screens.
2. Choose dine in and enter a table, or choose take away. Customer and notes are optional.
3. Apply 0%, 5%, or 10% discount. In **Laporan**, optional tax/service rates can be set from 0–30%.
4. Pay using cash (with tender validation and change) or explicitly confirm a manual QRIS recording. This demo does not transfer money.
5. Save/share the receipt or open the system print dialog. In **Pesanan**, advance fulfillment from new → making → ready → completed.
6. Cancel a paid transaction with a reason to restore its stock once. Cash refunds must be handled separately; cancellation changes the local record only.
7. In **Menu & stok**, add/edit menu items, change prices, replenish portions, or deactivate products. Items reserved in the cart cannot be deactivated or reduced below the reserved quantity.
8. View **Laporan** for revenue, order counts, average order value, bestseller quantities, and payment breakdown. Export the selected period to CSV, including cancelled transactions marked `voided`.

## Data and calculation rules

- All money uses integer rupiah; percentage rates use integer basis points.
- Discount is rounded from the subtotal; service and tax are separately rounded from the discounted subtotal. Tax excludes service. Both fees default to zero; this demo rule is configurable data, not a statement about the café's actual tax policy.
- Inventory tracks servings/portions, not ingredient recipes or COGS.
- Checkout creates immutable item/name/price snapshots and updates stock/cart/orders in one AsyncStorage value. The UI acknowledges payment only after a successful storage write.
- Storage key: `vinty-pos:v1`, with a validated schema and optimistic revision check. Web Locks serialize writes across supported browser tabs. Use one active register session; older browsers without Web Locks do not have a full concurrent-write guarantee.
- Orders and cart survive normal reloads. Unsaved customer/table/note fields and pending payment forms are transient. App data is device/browser-local and can be lost if the user clears site/app storage. CSV export is a transaction report, not a restorable complete backup.
- Business dates and daily receipt sequences use `Asia/Jakarta`. Daily reports count paid, nonvoided orders and include configured tax/service in revenue.
- Corrupt/incompatible saved state is rejected without automatically deleting/reseeding existing data.
- A loaded app can keep recording locally without network. The exported website needs a connection for its initial load and is not a service-worker-cached PWA. Mobile binaries package the JS/assets locally.

## Verification

```sh
npm --prefix apps/vinty-pos run typecheck
npm run test:pos
npm run build:pos
npm --prefix apps/vinty-pos run export:android -- --max-workers 2
npm run build
```

The domain tests cover calculation rounding, payment/stock validation, QRIS confirmation, price snapshots, void reversals, receipt sequences, WIB boundaries, report aggregation, formula-safe CSV, and restart/schema validation. Browser QA covers checkout, persistence after reload, order handling, inventory, reports, exports, and responsive layouts.

`export:android` verifies the Android JavaScript/Hermes bundle; it does **not** produce an installable APK or validate device-specific behavior. An APK can be produced with an authenticated Expo EAS account:

```sh
cd apps/vinty-pos
npx eas-cli build --platform android --profile preview
```

EAS project registration, credentials, any build quota/cost, physical-device testing, and store submission are separate release steps. `eas.json` includes an internal-preview APK profile. No APK or app-store release is claimed by this repository.

## Source selection and attribution

Research and implementation notes are in [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md). The selected open-source reference is **[RetailPOS](https://github.com/n17foo/retailpos)** (Expo/React Native, Apache 2.0). Only its money utilities were adapted into this implementation; the complete upstream stack was not forked. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the pinned source revision, changes, and preserved license.

## Structure

```text
App.tsx             Navigation, loading, persisted mutations, receipt display
src/Register.tsx    Catalog, cart, discounts, checkout
src/Management.tsx  Orders, menu/stock, reports, fee settings
src/model.ts        Pure domain rules, schema validation, report/CSV logic
src/money.ts        Adapted integer-rupiah helpers
src/store.ts        AsyncStorage and revision/write lock
src/receipts.ts     Receipt text, system print/share, CSV export
src/ui.tsx          Accessible shared controls and modals
src/theme.ts        Vinty visual tokens
assets/             Original illustrative menu artwork
tests/pos.test.ts   Domain regression tests
```

No staff authentication, backend sync, server backup, real QRIS verification, printer Bluetooth integration, or production operational rollout is included in this version.
