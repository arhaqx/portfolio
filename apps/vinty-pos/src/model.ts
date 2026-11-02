import { CATALOG_VERSION, LEGACY_SEED_IDS, VINTY_CATALOG } from "./catalog";
import { assertRupiah, multiplyMoney, percentage, sumMoney } from "./money";

export const CATEGORIES = [
  "Semua",
  "Classic Coffee",
  "Flavoured Coffee",
  "Mocktail",
  "Milk Based",
  "Snack & Bites",
  "Tea Series",
  "All Day",
] as const;
export type Category = (typeof CATEGORIES)[number];
export type Product = {
  id: string;
  name: string;
  category: Exclude<Category, "Semua">;
  description: string;
  price: number;
  stock: number;
  art: string;
  active: boolean;
  featured?: boolean;
};
export type CartLine = { productId: string; quantity: number };
export type Settings = { taxBps: number; serviceBps: number };
export type Totals = {
  subtotal: number;
  discount: number;
  service: number;
  tax: number;
  total: number;
};
export type OrderLine = { productId: string; name: string; price: number; quantity: number };
export type Order = Totals & {
  id: string;
  createdAt: string;
  customer: string;
  table: string;
  serviceType: "Dine in" | "Take away";
  note: string;
  items: OrderLine[];
  paymentMethod: "cash" | "qris";
  tendered: number;
  change: number;
  discountBps: number;
  taxBps: number;
  serviceBps: number;
  status: "paid" | "voided";
  fulfillment: "new" | "making" | "ready" | "completed";
  voidReason?: string;
  voidedAt?: string;
};
export type POSState = {
  schemaVersion: 1;
  catalogVersion?: number;
  revision: number;
  products: Product[];
  cart: CartLine[];
  orders: Order[];
  settings: Settings;
};
export type Checkout = {
  paymentMethod: Order["paymentMethod"];
  tendered: number;
  qrisConfirmed: boolean;
  discountBps: number;
  customer: string;
  table: string;
  serviceType: Order["serviceType"];
  note: string;
};

export function initialState(): POSState {
  return {
    schemaVersion: 1,
    catalogVersion: CATALOG_VERSION,
    revision: 0,
    products: VINTY_CATALOG.map((product) => ({ ...product })),
    cart: [],
    orders: [],
    settings: { taxBps: 0, serviceBps: 0 },
  };
}

export function migrateCatalog(state: POSState): POSState {
  if (state.catalogVersion === CATALOG_VERSION || state.cart.length > 0) return state;
  const categories: Record<string, Product["category"]> = {
    Coffee: "Flavoured Coffee",
    "Non-coffee": "Milk Based",
    Makanan: "All Day",
    Camilan: "Snack & Bites",
  };
  const currentIds = new Set(VINTY_CATALOG.map((product) => product.id));
  const products = VINTY_CATALOG.map((seed) => {
    const previous = state.products.find((product) => product.id === seed.id);
    return previous ? { ...seed, stock: previous.stock, active: previous.active } : { ...seed };
  });
  // Keep custom products and archived sample items for historical stock reversals.
  const retained = state.products
    .filter((product) => !currentIds.has(product.id))
    .map((product) => ({
      ...product,
      category: categories[product.category] ?? product.category,
      active: LEGACY_SEED_IDS.has(product.id) ? false : product.active,
    }));
  return { ...state, catalogVersion: CATALOG_VERSION, products: [...products, ...retained] };
}

export function businessDate(date: Date | string): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export function cartTotals(state: POSState, discountBps = 0): Totals {
  const subtotal = sumMoney(
    state.cart.map((line) => {
      const product = state.products.find((product) => product.id === line.productId);
      if (!product || !product.active) throw new Error("Menu tidak tersedia. Hapus dari pesanan.");
      return multiplyMoney(product.price, line.quantity);
    }),
  );
  const discount = percentage(subtotal, discountBps);
  const net = subtotal - discount;
  const service = percentage(net, state.settings.serviceBps);
  // Demo policy: tax is computed on the discounted subtotal, excluding service.
  const tax = percentage(net, state.settings.taxBps);
  return { subtotal, discount, service, tax, total: sumMoney([net, service, tax]) };
}

export function setQuantity(state: POSState, productId: string, quantity: number): POSState {
  const product = state.products.find((product) => product.id === productId);
  if (!product || !product.active) throw new Error("Menu tidak tersedia.");
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 999)
    throw new Error("Jumlah harus antara 0 dan 999.");
  if (quantity > product.stock) throw new Error(`Stok ${product.name} hanya ${product.stock}.`);
  const cart = state.cart.filter((line) => line.productId !== productId);
  if (quantity) cart.push({ productId, quantity });
  return { ...state, cart };
}

export function checkout(
  state: POSState,
  input: Checkout,
  now = new Date(),
): { state: POSState; order: Order } {
  if (!state.cart.length) throw new Error("Pesanan masih kosong.");
  if (input.paymentMethod !== "cash" && input.paymentMethod !== "qris")
    throw new Error("Metode pembayaran tidak valid.");
  if (input.serviceType !== "Dine in" && input.serviceType !== "Take away")
    throw new Error("Jenis pesanan tidak valid.");
  if (input.serviceType === "Dine in" && !input.table.trim())
    throw new Error("Isi nomor meja untuk dine in.");
  const totals = cartTotals(state, input.discountBps);
  assertRupiah(input.tendered);
  if (input.paymentMethod === "cash" && input.tendered < totals.total)
    throw new Error("Uang diterima belum mencukupi.");
  if (input.paymentMethod === "qris" && !input.qrisConfirmed)
    throw new Error("Konfirmasi pembayaran QRIS terlebih dahulu.");
  const items = state.cart.map((line) => {
    const product = state.products.find((product) => product.id === line.productId)!;
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > product.stock)
      throw new Error(`Stok ${product.name} tidak mencukupi.`);
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: line.quantity,
    };
  });
  const date = businessDate(now);
  const sequence =
    state.orders.filter((order) => businessDate(order.createdAt) === date).length + 1;
  const order: Order = {
    ...totals,
    id: `VNT-${date.replaceAll("-", "")}-${String(sequence).padStart(4, "0")}`,
    createdAt: now.toISOString(),
    customer: input.customer.trim().slice(0, 80) || "Pelanggan",
    table: input.serviceType === "Dine in" ? input.table.trim().slice(0, 12) : "—",
    serviceType: input.serviceType,
    note: input.note.trim().slice(0, 250),
    items,
    paymentMethod: input.paymentMethod,
    tendered: input.paymentMethod === "cash" ? input.tendered : totals.total,
    change: input.paymentMethod === "cash" ? input.tendered - totals.total : 0,
    discountBps: input.discountBps,
    ...state.settings,
    status: "paid",
    fulfillment: "new",
  };
  if (state.orders.some((existing) => existing.id === order.id))
    throw new Error("Nomor transaksi sudah digunakan.");
  return {
    order,
    state: {
      ...state,
      cart: [],
      products: state.products.map((product) => ({
        ...product,
        stock:
          product.stock - (state.cart.find((line) => line.productId === product.id)?.quantity ?? 0),
      })),
      orders: [order, ...state.orders],
    },
  };
}

export function voidOrder(
  state: POSState,
  orderId: string,
  reason: string,
  now = new Date(),
): POSState {
  const order = state.orders.find((order) => order.id === orderId);
  if (!order || order.status !== "paid") throw new Error("Transaksi tidak dapat dibatalkan lagi.");
  if (reason.trim().length < 5) throw new Error("Isi alasan pembatalan minimal 5 karakter.");
  return {
    ...state,
    products: state.products.map((product) => ({
      ...product,
      stock:
        product.stock + (order.items.find((item) => item.productId === product.id)?.quantity ?? 0),
    })),
    orders: state.orders.map((item) =>
      item.id === orderId
        ? {
            ...item,
            status: "voided",
            voidReason: reason.trim().slice(0, 250),
            voidedAt: now.toISOString(),
          }
        : item,
    ),
  };
}

export function updateProduct(state: POSState, product: Product): POSState {
  if (!product.name.trim() || product.name.length > 80)
    throw new Error("Nama menu wajib diisi, maksimal 80 karakter.");
  assertRupiah(product.price);
  if (!product.price || product.price > 100000000)
    throw new Error("Harga menu harus antara Rp1 dan Rp100.000.000.");
  if (!Number.isInteger(product.stock) || product.stock < 0 || product.stock > 99999)
    throw new Error("Stok harus antara 0 dan 99.999.");
  if (!CATEGORIES.slice(1).includes(product.category)) throw new Error("Kategori tidak valid.");
  const reserved = state.cart.find((line) => line.productId === product.id)?.quantity ?? 0;
  if (product.stock < reserved || (!product.active && reserved > 0))
    throw new Error("Menu sedang ada di keranjang. Sesuaikan keranjang terlebih dahulu.");
  const normalized = {
    ...product,
    name: product.name.trim(),
    description: product.description.trim().slice(0, 120),
  };
  return {
    ...state,
    products: state.products.some((item) => item.id === product.id)
      ? state.products.map((item) => (item.id === product.id ? normalized : item))
      : [...state.products, normalized],
  };
}

export function updateSettings(state: POSState, settings: Settings): POSState {
  for (const rate of [settings.taxBps, settings.serviceBps]) {
    if (!Number.isInteger(rate) || rate < 0 || rate > 3000)
      throw new Error("Pajak dan layanan harus antara 0% dan 30%.");
  }
  return { ...state, settings };
}

export function report(state: POSState, date?: string) {
  const orders = state.orders.filter(
    (order) => order.status === "paid" && (!date || businessDate(order.createdAt) === date),
  );
  const revenue = sumMoney(orders.map((order) => order.total));
  const products = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const order of orders)
    for (const item of order.items) {
      const current = products.get(item.productId) ?? { name: item.name, quantity: 0, revenue: 0 };
      products.set(item.productId, {
        ...current,
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + item.price * item.quantity,
      });
    }
  return {
    orders: orders.length,
    revenue,
    average: orders.length ? Math.round(revenue / orders.length) : 0,
    items: orders.reduce(
      (sum, order) => sum + order.items.reduce((total, item) => total + item.quantity, 0),
      0,
    ),
    cash: sumMoney(
      orders.filter((order) => order.paymentMethod === "cash").map((order) => order.total),
    ),
    qris: sumMoney(
      orders.filter((order) => order.paymentMethod === "qris").map((order) => order.total),
    ),
    bestsellers: [...products.values()].sort((a, b) => b.quantity - a.quantity),
  };
}

export function ordersCsv(orders: Order[]): string {
  // Prevent spreadsheet formula injection in customer-controlled text cells.
  const cell = (value: string | number) =>
    `"${String(typeof value === "string" && /^[\s]*[=+@-]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;
  return [
    [
      "Nomor",
      "Waktu",
      "Pelanggan",
      "Jenis",
      "Meja",
      "Metode",
      "Status",
      "Subtotal",
      "Diskon",
      "Layanan",
      "Pajak",
      "Total",
      "Diterima",
      "Kembalian",
      "Alasan batal",
    ],
    ...orders.map((order) => [
      order.id,
      order.createdAt,
      order.customer,
      order.serviceType,
      order.table,
      order.paymentMethod,
      order.status,
      order.subtotal,
      order.discount,
      order.service,
      order.tax,
      order.total,
      order.tendered,
      order.change,
      order.voidReason ?? "",
    ]),
  ]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}

export function parseState(raw: string): POSState {
  const data = JSON.parse(raw) as POSState;
  if (
    data?.schemaVersion !== 1 ||
    (data.catalogVersion !== undefined &&
      data.catalogVersion !== 1 &&
      data.catalogVersion !== CATALOG_VERSION) ||
    !Number.isInteger(data.revision) ||
    data.revision < 0 ||
    !Array.isArray(data.products) ||
    !Array.isArray(data.cart) ||
    !Array.isArray(data.orders) ||
    !data.settings
  )
    throw new Error("Format penyimpanan tidak dikenali. Data lama tidak ditimpa.");
  const productIds = new Set<string>();
  for (const product of data.products) {
    if (
      !product ||
      typeof product.id !== "string" ||
      productIds.has(product.id) ||
      typeof product.name !== "string" ||
      !product.name.trim() ||
      typeof product.description !== "string" ||
      typeof product.art !== "string" ||
      typeof product.active !== "boolean" ||
      ![...CATEGORIES.slice(1), "Coffee", "Non-coffee", "Makanan", "Camilan"].includes(
        product.category,
      )
    )
      throw new Error("Data menu tidak valid.");
    assertRupiah(product.price);
    if (!Number.isInteger(product.stock) || product.stock < 0)
      throw new Error("Data stok tidak valid.");
    productIds.add(product.id);
  }
  const cartIds = new Set<string>();
  for (const line of data.cart) {
    if (
      !line ||
      !productIds.has(line.productId) ||
      cartIds.has(line.productId) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 999
    )
      throw new Error("Data keranjang tidak valid.");
    cartIds.add(line.productId);
  }
  updateSettings(data, data.settings);
  const orderIds = new Set<string>();
  for (const order of data.orders) {
    if (
      !order ||
      typeof order.id !== "string" ||
      orderIds.has(order.id) ||
      !Number.isFinite(Date.parse(order.createdAt)) ||
      !["paid", "voided"].includes(order.status) ||
      !["new", "making", "ready", "completed"].includes(order.fulfillment) ||
      !["cash", "qris"].includes(order.paymentMethod) ||
      !["Dine in", "Take away"].includes(order.serviceType) ||
      !Array.isArray(order.items) ||
      !order.items.length ||
      typeof order.customer !== "string" ||
      typeof order.note !== "string" ||
      typeof order.table !== "string"
    )
      throw new Error("Data transaksi tidak valid.");
    for (const value of [
      order.subtotal,
      order.discount,
      order.service,
      order.tax,
      order.total,
      order.tendered,
      order.change,
    ])
      assertRupiah(value);
    for (const rate of [order.taxBps, order.serviceBps, order.discountBps]) percentage(0, rate);
    for (const item of order.items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        typeof item.name !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      )
        throw new Error("Detail transaksi tidak valid.");
      assertRupiah(item.price);
    }
    if (
      order.discount > order.subtotal ||
      order.total !== order.subtotal - order.discount + order.service + order.tax
    )
      throw new Error("Total transaksi tidak valid.");
    orderIds.add(order.id);
  }
  return data;
}
