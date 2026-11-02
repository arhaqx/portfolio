# Third-party notices

Vinty POS is a new, focused implementation for Vinty Coffee & Space, not a renamed copy of a complete third-party POS application.

## RetailPOS

- Project: [n17foo/retailpos](https://github.com/n17foo/retailpos)
- Author attribution: RetailPOS authors and contributors.
- Inspected revision: [`599406788360ef98c147e47f303ce2feaa50ecdf`](https://github.com/n17foo/retailpos/tree/599406788360ef98c147e47f303ce2feaa50ecdf).
- License: Apache License, Version 2.0. The complete upstream license is preserved in [licenses/retailpos-Apache-2.0.txt](licenses/retailpos-Apache-2.0.txt).
- Adapted source: [shared/utils/money.ts](https://github.com/n17foo/retailpos/blob/599406788360ef98c147e47f303ce2feaa50ecdf/shared/utils/money.ts) → [src/money.ts](src/money.ts).
- Changes: changed from dollar/cent conversion to whole rupiah; added nonnegative safe-integer validation; replaced decimal tax rates with integer basis points; formatted IDR using `Intl.NumberFormat`.
- Architectural reference: cross-platform Expo POS, inventory, transaction snapshots, manual payment recording, and local operation. RetailPOS connectors, authentication, synchronization, payment integrations, native hardware drivers, assets, and UI were not imported into Vinty.
- No root `NOTICE` file was returned by GitHub for the inspected repository. Existing notices in the copied license are preserved.

The Vinty interface, original SVG-derived menu illustrations, catalog, order/inventory domain, persistence adapter, reports, tests, and portfolio integration were implemented for this project. No endorsement by RetailPOS is implied.

## Runtime packages

Expo, React, React Native, React Native Web, AsyncStorage, and the other npm dependencies retain their respective upstream licenses, distributed with the installed packages. Exact resolved dependency versions are recorded in `package-lock.json`.
