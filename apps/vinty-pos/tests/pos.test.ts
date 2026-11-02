import assert from "node:assert/strict";
import { test } from "node:test";
import {
  businessDate,
  cartTotals,
  checkout,
  initialState,
  migrateCatalog,
  ordersCsv,
  parseState,
  report,
  setQuantity,
  updateProduct,
  updateSettings,
  voidOrder,
  type Checkout,
} from "../src/model";
import { percentage, sumMoney } from "../src/money";

const now = new Date("2026-11-02T04:00:00.000Z");
const input: Checkout = {
  paymentMethod: "cash",
  tendered: 100000,
  qrisConfirmed: false,
  discountBps: 0,
  customer: "Ari",
  table: "03",
  serviceType: "Dine in",
  note: "Less ice",
};
const withCart = () => setQuantity(setQuantity(initialState(), "kopi-susu", 2), "matcha", 1);

test("rupiah totals round once per fee after discount", () => {
  const state = updateSettings(withCart(), { taxBps: 1000, serviceBps: 500 });
  assert.deepEqual(cartTotals(state, 1000), {
    subtotal: 52000,
    discount: 5200,
    service: 2340,
    tax: 4680,
    total: 53820,
  });
  assert.equal(percentage(25001, 500), 1250);
  assert.throws(() => sumMoney([Number.MAX_SAFE_INTEGER, 1]));
  assert.throws(() => cartTotals(state, -1));
});

test("checkout records cash change, snapshots prices, decrements stock and clears cart atomically", () => {
  const previous = withCart();
  const { state, order } = checkout(previous, input, now);
  assert.equal(order.id, "VNT-20261102-0001");
  assert.equal(order.total, 52000);
  assert.equal(order.change, 48000);
  assert.equal(order.note, "Less ice");
  assert.equal(state.products.find((product) => product.id === "kopi-susu")!.stock, 38);
  assert.equal(state.products.find((product) => product.id === "matcha")!.stock, 19);
  assert.equal(state.cart.length, 0);
  assert.equal(previous.cart.length, 2);
  assert.equal(previous.products[0].stock, 40);
});

test("underpayment, empty orders and missing tables are rejected without mutating inventory", () => {
  const state = withCart();
  const snapshot = JSON.stringify(state);
  assert.throws(() => checkout(state, { ...input, tendered: 1000 }, now), /mencukupi/);
  assert.throws(() => checkout(state, { ...input, table: " " }, now), /nomor meja/);
  assert.throws(() => checkout(initialState(), input, now), /kosong/);
  assert.equal(JSON.stringify(state), snapshot);
});

test("QRIS requires explicit manual confirmation and records exact tender without change", () => {
  assert.throws(() => checkout(withCart(), { ...input, paymentMethod: "qris" }, now), /Konfirmasi/);
  const { order } = checkout(
    withCart(),
    { ...input, paymentMethod: "qris", qrisConfirmed: true, tendered: 0 },
    now,
  );
  assert.equal(order.tendered, order.total);
  assert.equal(order.change, 0);
});

test("takeaway does not require a table", () => {
  const { order } = checkout(withCart(), { ...input, serviceType: "Take away", table: "" }, now);
  assert.equal(order.table, "—");
});

test("stock bounds and noninteger quantities cannot oversell", () => {
  assert.throws(() => setQuantity(initialState(), "kopi-susu", 41), /Stok/);
  assert.throws(() => setQuantity(initialState(), "kopi-susu", 1.5));
  assert.throws(() => setQuantity(initialState(), "kopi-susu", -1));
  const state = withCart();
  state.products[0].stock = 1;
  assert.throws(() => checkout(state, input, now), /Stok/);
});

test("removing a cart item restores availability without changing physical stock", () => {
  const state = setQuantity(withCart(), "kopi-susu", 0);
  assert.equal(state.cart.length, 1);
  assert.equal(state.products[0].stock, 40);
});

test("changing a menu price does not rewrite historical receipts", () => {
  const { state } = checkout(withCart(), input, now);
  const changed = updateProduct(state, { ...state.products[0], price: 30000 });
  assert.equal(changed.orders[0].items[0].price, 16000);
  assert.equal(changed.orders[0].total, 52000);
});

test("inventory updates reject fractional, negative or reserved stock and inactive cart products", () => {
  const state = withCart();
  for (const stock of [-1, 1.5, 1, 100000])
    assert.throws(() => updateProduct(state, { ...state.products[0], stock }));
  assert.throws(() => updateProduct(state, { ...state.products[0], active: false }));
  assert.throws(() => updateProduct(state, { ...state.products[0], price: 0 }));
  assert.throws(() => updateProduct(state, { ...state.products[0], price: 2.5 }));
});

test("deactivated menus cannot be added to cart", () => {
  const state = initialState();
  const changed = updateProduct(state, { ...state.products[0], active: false });
  assert.throws(() => setQuantity(changed, "kopi-susu", 1), /tidak tersedia/);
});

test("void restores stock once, records reason and excludes revenue", () => {
  const { state, order } = checkout(withCart(), input, now);
  assert.equal(report(state).revenue, 52000);
  const cancelled = voidOrder(state, order.id, "Pesanan keliru", now);
  assert.equal(cancelled.products[0].stock, 40);
  assert.equal(cancelled.orders[0].status, "voided");
  assert.equal(cancelled.orders[0].voidReason, "Pesanan keliru");
  assert.equal(report(cancelled).revenue, 0);
  assert.equal(report(cancelled).orders, 0);
  assert.throws(() => voidOrder(cancelled, order.id, "Coba ulang", now));
  assert.throws(() => voidOrder(state, order.id, " ", now));
});

test("receipt sequences remain unique after a void", () => {
  const first = checkout(withCart(), input, now);
  const cancelled = voidOrder(first.state, first.order.id, "Pesanan keliru", now);
  const second = checkout(setQuantity(cancelled, "latte", 1), input, now);
  assert.equal(second.order.id, "VNT-20261102-0002");
});

test("business dates use Asia/Jakarta at the UTC day boundary", () => {
  assert.equal(businessDate("2026-11-01T16:59:59Z"), "2026-11-01");
  assert.equal(businessDate("2026-11-01T17:00:00Z"), "2026-11-02");
  const first = checkout(withCart(), input, new Date("2026-11-01T17:00:00Z"));
  assert.equal(report(first.state, "2026-11-02").orders, 1);
  assert.equal(report(first.state, "2026-11-01").orders, 0);
});

test("reports aggregate cash, QRIS and bestseller quantities from actual paid orders", () => {
  const first = checkout(withCart(), input, now);
  const second = checkout(
    setQuantity(first.state, "kopi-susu", 1),
    { ...input, paymentMethod: "qris", qrisConfirmed: true },
    now,
  );
  const stats = report(second.state);
  assert.equal(stats.orders, 2);
  assert.equal(stats.revenue, 68000);
  assert.equal(stats.cash, 52000);
  assert.equal(stats.qris, 16000);
  assert.equal(stats.items, 4);
  assert.equal(stats.bestsellers[0].quantity, 3);
});

test("CSV quotes embedded commas and neutralizes spreadsheet formulas", () => {
  const { order } = checkout(withCart(), { ...input, customer: '=HYPERLINK("bad","x")' }, now);
  const csv = ordersCsv([order]);
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"",""x"")"'));
  assert.ok(csv.includes("52000"));
  assert.ok(csv.split("\r\n").length === 2);
});

test("valid snapshots survive restart without re-seeding or changing receipts", () => {
  const { state } = checkout(withCart(), input, now);
  assert.deepEqual(parseState(JSON.stringify({ ...state, revision: 3 })), {
    ...state,
    revision: 3,
  });
});

test("corrupt, unsupported and duplicate storage is rejected", () => {
  assert.throws(() => parseState("oops"));
  assert.throws(() => parseState(JSON.stringify({ ...initialState(), schemaVersion: 2 })));
  const duplicate = initialState();
  duplicate.products.push(duplicate.products[0]);
  assert.throws(() => parseState(JSON.stringify(duplicate)));
  const cart = withCart();
  cart.cart.push(cart.cart[0]);
  assert.throws(() => parseState(JSON.stringify(cart)));
});

test("invalid saved transaction totals and invalid rates are rejected", () => {
  const { state } = checkout(withCart(), input, now);
  state.orders[0].total = -1;
  assert.throws(() => parseState(JSON.stringify(state)));
  assert.throws(() => updateSettings(initialState(), { taxBps: 3001, serviceBps: 0 }));
  assert.throws(() => updateSettings(initialState(), { taxBps: 100.5, serviceBps: 0 }));
});

test("official catalog has 44 serving variants across the seven menu categories", () => {
  const products = initialState().products;
  assert.equal(products.length, 44);
  const counts = new Map<string, number>();
  for (const product of products)
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  assert.deepEqual(Object.fromEntries(counts), {
    "Flavoured Coffee": 7,
    "Classic Coffee": 8,
    Mocktail: 3,
    "Milk Based": 11,
    "Snack & Bites": 6,
    "Tea Series": 4,
    "All Day": 5,
  });
  const prices: Record<string, number> = {
    "Kopsu Vinty": 16000,
    "French Fries": 16000,
    "Lychee Tea": 15000,
    "Chipy Chips": 12000,
    "Katsu Mentai": 26000,
    "Ricebowl Beef Teriyaki": 27000,
  };
  for (const [name, price] of Object.entries(prices))
    assert.equal(products.find((product) => product.name === name)?.price, price);
  assert.ok(!products.some((product) => product.name.includes("Croissant")));
});

test("Classic Coffee prices distinguish Robusta and Arabica for both temperatures", () => {
  const products = initialState().products;
  for (const temperature of ["Hot", "Cold"])
    for (const [name, price] of [
      ["Americano Robusta", 15000],
      ["Americano Arabica", 17000],
      ["Caffe Latte Robusta", 20000],
      ["Caffe Latte Arabica", 22000],
    ] as const) {
      assert.equal(
        products.find((product) => product.name === `${name} · ${temperature}`)?.price,
        price,
      );
    }
  for (const temperature of ["Hot", "Cold"])
    for (const [name, price] of [
      ["Matcha Latte", 20000],
      ["Choco", 18000],
      ["Taro", 18000],
      ["Redvelvet", 18000],
    ] as const) {
      assert.equal(
        products.find((product) => product.name === `${name} · ${temperature}`)?.price,
        price,
      );
    }
});

function legacyState() {
  const state = initialState();
  state.catalogVersion = 1;
  state.products = state.products.filter((product) => ["kopi-susu", "matcha"].includes(product.id));
  state.products[0] = {
    ...state.products[0],
    name: "Kopi Susu Vinty",
    price: 24000,
    category: "Coffee" as (typeof state.products)[number]["category"],
  };
  state.products[1] = {
    ...state.products[1],
    price: 28000,
    category: "Non-coffee" as (typeof state.products)[number]["category"],
  };
  state.products.push({
    ...state.products[0],
    id: "croissant",
    name: "Butter Croissant",
    price: 23000,
  });
  state.products.push({
    ...state.products[0],
    id: "custom-local",
    name: "Menu lokal",
    price: 12000,
    stock: 7,
  });
  return state;
}

test("catalog migration preserves historical prices, orders, local stock and custom menus", () => {
  const legacy = legacyState();
  const paid = checkout(setQuantity(setQuantity(legacy, "kopi-susu", 2), "matcha", 1), input, now);
  assert.equal(paid.order.total, 76000);
  const migrated = migrateCatalog(parseState(JSON.stringify(paid.state)));
  assert.equal(migrated.catalogVersion, 2);
  assert.equal(migrated.products.find((product) => product.id === "kopi-susu")?.price, 16000);
  assert.equal(migrated.products.find((product) => product.id === "kopi-susu")?.stock, 38);
  assert.equal(migrated.products.find((product) => product.id === "croissant")?.active, false);
  assert.equal(migrated.products.find((product) => product.id === "custom-local")?.stock, 7);
  assert.equal(migrated.orders[0].total, 76000);
  assert.equal(migrated.orders[0].items[0].price, 24000);
  assert.equal(parseState(JSON.stringify(migrated)).orders.length, 1);
});

test("an unpaid legacy cart keeps its original price until completion or removal", () => {
  const pending = setQuantity(legacyState(), "kopi-susu", 1);
  assert.strictEqual(migrateCatalog(pending), pending);
  assert.equal(cartTotals(pending).total, 24000);
  const paid = checkout(pending, input, now);
  const migrated = migrateCatalog(paid.state);
  assert.equal(migrated.orders[0].total, 24000);
  assert.equal(migrated.products[0].price, 16000);
  assert.equal(migrateCatalog(setQuantity(pending, "kopi-susu", 0)).catalogVersion, 2);
});

test("catalog migration is idempotent and does not overwrite later local edits", () => {
  const current = updateProduct(initialState(), { ...initialState().products[0], price: 19000 });
  assert.strictEqual(migrateCatalog(current), current);
  assert.equal(migrateCatalog(current).products[0].price, 19000);
});
