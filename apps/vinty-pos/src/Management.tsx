import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { artwork } from "./artwork";
import {
  CATEGORIES,
  businessDate,
  report,
  updateProduct,
  updateSettings,
  voidOrder,
  type Order,
  type POSState,
  type Product,
} from "./model";
import { formatMoney } from "./money";
import { exportOrders } from "./receipts";
import type { Mutate } from "./Register";
import { colors, s, serif } from "./theme";
import { Badge, Button, Chip, Dialog, Empty, Field } from "./ui";

const fulfillmentLabels: Record<Order["fulfillment"], string> = {
  new: "Pesanan baru",
  making: "Disiapkan",
  ready: "Siap disajikan",
  completed: "Selesai",
};
const nextStatus: Partial<Record<Order["fulfillment"], Order["fulfillment"]>> = {
  new: "making",
  making: "ready",
  ready: "completed",
};

export function Orders({
  state,
  mutate,
  busy,
  onReceipt,
  error,
}: {
  state: POSState;
  mutate: Mutate;
  busy: boolean;
  onReceipt: (order: Order) => void;
  error: string;
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [voiding, setVoiding] = useState<Order | null>(null);
  const [reason, setReason] = useState("");
  const orders = state.orders.filter(
    (order) =>
      (filter === "all" ||
        (filter === "voided"
          ? order.status === "voided"
          : order.status === "paid" && order.fulfillment === filter)) &&
      `${order.id} ${order.customer} ${order.table}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <View style={{ gap: 22 }}>
      <View style={[s.between, { flexWrap: "wrap" }]}>
        <View>
          <Text style={s.heading}>Setiap pesanan, terpantau.</Text>
          <Text style={[s.muted, { marginTop: 7 }]}>
            Dari racikan pertama sampai siap disajikan.
          </Text>
        </View>
        <TextInput
          accessibilityLabel="Cari transaksi"
          placeholder="Cari nama / nomor transaksi…"
          placeholderTextColor={colors.muted}
          style={[s.input, { minWidth: 240 }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 7 }}
      >
        {[
          ["all", "Semua"],
          ["new", "Baru"],
          ["making", "Disiapkan"],
          ["ready", "Siap"],
          ["completed", "Selesai"],
          ["voided", "Dibatalkan"],
        ].map(([value, label]) => (
          <Chip key={value} active={filter === value} onPress={() => setFilter(value)}>
            {label}
          </Chip>
        ))}
      </ScrollView>
      {!orders.length ? (
        <View style={s.panel}>
          <Empty
            title="Belum ada pesanan di sini"
            detail="Transaksi yang dibayar dari Kasir akan muncul di sini secara otomatis."
            symbol="▤"
          />
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={[s.panel, { gap: 15 }]}>
            <View style={[s.between, { flexWrap: "wrap" }]}>
              <View style={{ gap: 4 }}>
                <Text style={[s.text, { fontWeight: "600" }]}>{order.id}</Text>
                <Text style={s.muted}>
                  {new Date(order.createdAt).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  WIB
                </Text>
              </View>
              <Badge warning={order.status === "voided"}>
                {order.status === "voided" ? "Dibatalkan" : fulfillmentLabels[order.fulfillment]}
              </Badge>
            </View>
            <View style={s.between}>
              <View style={{ flex: 1 }}>
                <Text style={s.text}>
                  {order.customer} · {order.serviceType}
                  {order.serviceType === "Dine in" ? ` · Meja ${order.table}` : ""}
                </Text>
                <Text style={s.muted}>
                  {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                </Text>
                {!!order.note && (
                  <Text style={[s.muted, { fontStyle: "italic", marginTop: 6 }]}>
                    Catatan: {order.note}
                  </Text>
                )}
                {order.status === "voided" && (
                  <Text style={{ color: colors.danger, fontSize: 12, marginTop: 6 }}>
                    Alasan: {order.voidReason}
                  </Text>
                )}
              </View>
              <Text style={[s.subheading, { color: colors.brown }]}>
                {formatMoney(order.total)}
              </Text>
            </View>
            <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
              <Button secondary onPress={() => onReceipt(order)}>
                Lihat struk
              </Button>
              {order.status === "paid" && (
                <>
                  {nextStatus[order.fulfillment] && (
                    <Button
                      disabled={busy}
                      onPress={() =>
                        void mutate((current) => ({
                          ...current,
                          orders: current.orders.map((item) =>
                            item.id === order.id &&
                            item.status === "paid" &&
                            nextStatus[item.fulfillment]
                              ? { ...item, fulfillment: nextStatus[item.fulfillment]! }
                              : item,
                          ),
                        }))
                      }
                    >
                      {fulfillmentLabels[nextStatus[order.fulfillment]!]} →
                    </Button>
                  )}
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => {
                      setVoiding(order);
                      setReason("");
                    }}
                    style={{ padding: 12, minHeight: 44 }}
                  >
                    <Text style={{ color: colors.danger, fontSize: 12 }}>Batalkan transaksi</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        ))
      )}
      {voiding && (
        <Dialog title="Batalkan transaksi?" onClose={() => !busy && setVoiding(null)}>
          <Text style={s.text}>
            {voiding.id} · {formatMoney(voiding.total)}
          </Text>
          <Text style={s.muted}>
            Stok item akan dikembalikan dan transaksi dikeluarkan dari omzet. Pembatalan ini hanya
            mengubah catatan lokal; pengembalian uang ditangani secara terpisah.
          </Text>
          <Field
            label="Alasan pembatalan"
            placeholder="Contoh: pesanan pelanggan keliru"
            value={reason}
            onChangeText={setReason}
            maxLength={250}
            multiline
          />
          {!!error && (
            <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 12 }}>
              {error}
            </Text>
          )}
          <Button
            disabled={busy || reason.trim().length < 5}
            onPress={() => {
              void mutate((current) => voidOrder(current, voiding.id, reason)).then((success) => {
                if (success) setVoiding(null);
              });
            }}
          >
            {busy ? "Menyimpan…" : "Ya, batalkan & kembalikan stok"}
          </Button>
        </Dialog>
      )}
    </View>
  );
}

export function Inventory({
  state,
  mutate,
  busy,
  error,
}: { state: POSState; mutate: Mutate; busy: boolean; error: string }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const products = state.products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );
  function edit(product: Product) {
    setEditing({ ...product });
    setPrice(String(product.price));
    setStock(String(product.stock));
  }
  const lowStock = state.products.filter((product) => product.active && product.stock <= 5).length;
  return (
    <View style={{ gap: 22 }}>
      <View style={[s.between, { flexWrap: "wrap" }]}>
        <View>
          <Text style={s.heading}>Menu yang selalu siap.</Text>
          <Text style={[s.muted, { marginTop: 7 }]}>
            {state.products.length} menu · {lowStock} stok menipis
          </Text>
        </View>
        <Button
          onPress={() =>
            edit({
              id: `menu-${Date.now().toString(36)}`,
              name: "",
              category: "Classic Coffee",
              description: "",
              price: 0,
              stock: 0,
              art: "kopi-susu",
              active: true,
            })
          }
        >
          + Tambah menu
        </Button>
      </View>
      <TextInput
        accessibilityLabel="Cari menu dalam stok"
        style={[s.input, { maxWidth: 360 }]}
        placeholder="Cari nama menu…"
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />
      <View style={[s.panel, { padding: 0, overflow: "hidden" }]}>
        {products.length ? (
          products.map((product, index) => (
            <View
              key={product.id}
              style={[
                s.row,
                {
                  padding: 16,
                  flexWrap: "wrap",
                  borderTopWidth: index ? 1 : 0,
                  borderColor: colors.border,
                },
              ]}
            >
              <Image
                source={artwork[product.art] ?? artwork["kopi-susu"]}
                style={{ width: 55, height: 52, borderRadius: 9 }}
              />
              <View style={{ flex: 1, minWidth: 140 }}>
                <Text style={[s.text, { fontWeight: "600" }]}>{product.name}</Text>
                <Text style={s.muted}>
                  {product.category} · {formatMoney(product.price)}
                </Text>
              </View>
              <View style={{ minWidth: 65 }}>
                <Text
                  style={[
                    s.text,
                    { fontWeight: "600", color: product.stock <= 5 ? colors.danger : colors.ink },
                  ]}
                >
                  {product.stock}
                </Text>
                <Text style={s.muted}>porsi</Text>
              </View>
              <Badge warning={!product.active || product.stock <= 5}>
                {!product.active ? "Nonaktif" : product.stock <= 5 ? "Stok menipis" : "Tersedia"}
              </Badge>
              <Button secondary onPress={() => edit(product)} label={`Edit ${product.name}`}>
                Edit menu
              </Button>
            </View>
          ))
        ) : (
          <Empty title="Menu tidak ditemukan" detail="Coba nama menu yang lain." />
        )}
      </View>
      <Text style={s.muted}>
        Stok dihitung per porsi menu, belum mencakup resep atau bahan baku.
      </Text>
      {editing && (
        <Dialog
          title={
            state.products.some((product) => product.id === editing.id)
              ? "Edit menu & stok"
              : "Tambah menu baru"
          }
          onClose={() => !busy && setEditing(null)}
        >
          <Field
            label="Nama menu"
            value={editing.name}
            onChangeText={(name) => setEditing({ ...editing, name })}
            maxLength={80}
          />
          <Field
            label="Deskripsi"
            value={editing.description}
            onChangeText={(description) => setEditing({ ...editing, description })}
            maxLength={120}
          />
          <View>
            <Text style={s.label}>Kategori</Text>
            <View style={[s.row, { flexWrap: "wrap", gap: 6 }]}>
              {CATEGORIES.slice(1).map((category) => (
                <Chip
                  key={category}
                  active={editing.category === category}
                  onPress={() =>
                    setEditing({ ...editing, category: category as Product["category"] })
                  }
                >
                  {category}
                </Chip>
              ))}
            </View>
          </View>
          <View style={s.row}>
            <Field
              label="Harga (Rp)"
              value={price}
              onChangeText={(value) => setPrice(value.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={9}
            />
            <Field
              label="Stok (porsi)"
              value={stock}
              onChangeText={(value) => setStock(value.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
          <View style={s.between}>
            <Text style={s.text}>Menu aktif di kasir</Text>
            <Switch
              accessibilityLabel="Menu aktif di kasir"
              value={editing.active}
              onValueChange={(active) => setEditing({ ...editing, active })}
              trackColor={{ true: colors.sage }}
            />
          </View>
          <View>
            <Text style={s.label}>Ilustrasi menu</Text>
            <View style={[s.row, { flexWrap: "wrap", gap: 7 }]}>
              {[
                "kopi-susu",
                "matcha",
                "chocolate",
                "lychee",
                "strawberry",
                "croissant",
                "fries",
                "rice",
              ].map((art) => (
                <Pressable
                  key={art}
                  accessibilityRole="button"
                  accessibilityLabel={`Pilih ilustrasi ${art}`}
                  accessibilityState={{ selected: editing.art === art }}
                  onPress={() => setEditing({ ...editing, art })}
                  style={{
                    borderWidth: 2,
                    borderColor: editing.art === art ? colors.brown : "transparent",
                    borderRadius: 9,
                    overflow: "hidden",
                  }}
                >
                  <Image source={artwork[art]} style={{ width: 48, height: 42 }} />
                </Pressable>
              ))}
            </View>
          </View>
          {!!error && (
            <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 12 }}>
              {error}
            </Text>
          )}
          <Button
            disabled={busy || !editing.name.trim() || !price || !stock}
            onPress={() => {
              void mutate((current) =>
                updateProduct(current, { ...editing, price: Number(price), stock: Number(stock) }),
              ).then((success) => {
                if (success) setEditing(null);
              });
            }}
          >
            {busy ? "Menyimpan…" : "Simpan perubahan"}
          </Button>
        </Dialog>
      )}
    </View>
  );
}

export function Reports({
  state,
  mutate,
  busy,
}: { state: POSState; mutate: Mutate; busy: boolean }) {
  const { width } = useWindowDimensions();
  const [period, setPeriod] = useState("today");
  const [tax, setTax] = useState(String(state.settings.taxBps / 100));
  const [service, setService] = useState(String(state.settings.serviceBps / 100));
  const [exportError, setExportError] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const date = period === "today" ? businessDate(new Date()) : undefined;
  const stats = report(state, date);
  const orders = state.orders.filter((order) => !date || businessDate(order.createdAt) === date);
  const cashPercent = stats.revenue ? (stats.cash / stats.revenue) * 100 : 0;
  const validRates =
    /^\d+(\.\d{1,2})?$/.test(tax) &&
    /^\d+(\.\d{1,2})?$/.test(service) &&
    Number(tax) <= 30 &&
    Number(service) <= 30;
  return (
    <View style={{ gap: 24 }}>
      <View style={[s.between, { flexWrap: "wrap" }]}>
        <View>
          <Text style={s.heading}>Kenali ritme kedaimu.</Text>
          <Text style={[s.muted, { marginTop: 7 }]}>
            Ringkasan dari transaksi tersimpan · Waktu Indonesia Barat
          </Text>
        </View>
        <Button
          secondary
          onPress={() => {
            setExportError("");
            void exportOrders(orders).catch(() =>
              setExportError(
                "Ekspor gagal. Periksa izin berbagi / unduhan perangkat, lalu coba lagi.",
              ),
            );
          }}
          disabled={!orders.length}
        >
          ↓ Ekspor CSV
        </Button>
      </View>
      <View style={s.row}>
        <Chip active={period === "today"} onPress={() => setPeriod("today")}>
          Hari ini
        </Chip>
        <Chip active={period === "all"} onPress={() => setPeriod("all")}>
          Semua waktu
        </Chip>
      </View>
      {!!exportError && (
        <Text accessibilityRole="alert" style={{ color: colors.danger }}>
          {exportError}
        </Text>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {[
          ["OMZET", formatMoney(stats.revenue), "Termasuk pajak & layanan"],
          ["TRANSAKSI", String(stats.orders), "Pembayaran tercatat"],
          ["RATA-RATA", formatMoney(stats.average), "Per transaksi"],
          ["ITEM TERJUAL", String(stats.items), "Porsi menu"],
        ].map(([label, value, detail]) => (
          <View
            key={label}
            style={[
              s.panel,
              { flexGrow: 1, flexBasis: width < 600 ? "42%" : "20%", padding: 19, gap: 12 },
            ]}
          >
            <Text style={s.eyebrow}>{label}</Text>
            <Text
              style={{ fontFamily: serif, fontSize: width < 600 ? 26 : 32, color: colors.brown }}
            >
              {value}
            </Text>
            <Text style={[s.muted, { fontSize: 10 }]}>{detail}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: width >= 1100 ? "row" : "column", gap: 20 }}>
        <View style={[s.panel, { flex: 1, gap: 20 }]}>
          <Text style={s.subheading}>Menu paling dicintai</Text>
          {!stats.bestsellers.length ? (
            <Empty
              title="Cerita baru dimulai"
              detail="Selesaikan transaksi pertamamu untuk melihat menu terlaris."
            />
          ) : (
            stats.bestsellers.slice(0, 6).map((item, index) => (
              <View key={item.name + index} style={{ gap: 10 }}>
                <View style={s.between}>
                  <View style={s.row}>
                    <Text style={s.muted}>{String(index + 1).padStart(2, "0")}</Text>
                    <Text style={s.text}>{item.name}</Text>
                  </View>
                  <Text style={[s.text, { fontWeight: "600" }]}>{item.quantity} porsi</Text>
                </View>
                <View style={{ backgroundColor: colors.page, borderRadius: 4, height: 6 }}>
                  <View
                    style={{
                      width: `${Math.max(3, (item.quantity / stats.bestsellers[0].quantity) * 100)}%`,
                      backgroundColor: index === 0 ? colors.brown : colors.sage,
                      height: 6,
                      borderRadius: 4,
                    }}
                  />
                </View>
              </View>
            ))
          )}
        </View>
        <View style={[s.panel, { flex: 1, gap: 22 }]}>
          <Text style={s.subheading}>Metode pembayaran</Text>
          <View
            style={{
              flexDirection: "row",
              height: 15,
              backgroundColor: colors.page,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            {stats.revenue > 0 && (
              <>
                <View style={{ width: `${cashPercent}%`, backgroundColor: colors.brown }} />
                <View style={{ flex: 1, backgroundColor: colors.sage }} />
              </>
            )}
          </View>
          <View style={s.between}>
            <View style={s.row}>
              <View
                style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.brown }}
              />
              <Text style={s.text}>Tunai</Text>
            </View>
            <Text style={[s.text, { fontWeight: "600" }]}>{formatMoney(stats.cash)}</Text>
          </View>
          <View style={s.between}>
            <View style={s.row}>
              <View
                style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.sage }}
              />
              <Text style={s.text}>QRIS manual</Text>
            </View>
            <Text style={[s.text, { fontWeight: "600" }]}>{formatMoney(stats.qris)}</Text>
          </View>
          <View style={s.rule} />
          <Text style={s.muted}>
            {orders.filter((order) => order.status === "voided").length} transaksi dibatalkan pada
            periode ini. Transaksi tersebut tidak masuk omzet.
          </Text>
          <Text style={s.muted}>Ringkasan ini memakai catatan pada perangkat ini saja.</Text>
        </View>
      </View>
      <View style={[s.panel, { gap: 18 }]}>
        <View>
          <Text style={s.subheading}>Pajak & biaya layanan</Text>
          <Text style={[s.muted, { marginTop: 7 }]}>
            Default 0%. Keduanya dihitung dari subtotal setelah diskon; pajak tidak dikenakan atas
            biaya layanan. Perubahan berlaku untuk pesanan berikutnya.
          </Text>
        </View>
        <View style={[s.row, { flexWrap: "wrap", alignItems: "flex-end" }]}>
          <Field
            label="Pajak (%)"
            value={tax}
            onChangeText={(value) => {
              setTax(value.replace(",", "."));
              setSettingsSaved(false);
            }}
            keyboardType="decimal-pad"
            maxLength={5}
          />
          <Field
            label="Layanan (%)"
            value={service}
            onChangeText={(value) => {
              setService(value.replace(",", "."));
              setSettingsSaved(false);
            }}
            keyboardType="decimal-pad"
            maxLength={5}
          />
          <Button
            disabled={busy || !validRates}
            onPress={() => {
              void mutate((current) =>
                updateSettings(current, {
                  taxBps: Math.round(Number(tax) * 100),
                  serviceBps: Math.round(Number(service) * 100),
                }),
              ).then((success) => setSettingsSaved(success));
            }}
          >
            Simpan tarif
          </Button>
        </View>
        {!validRates && (
          <Text style={{ color: colors.danger, fontSize: 12 }}>
            Gunakan angka 0–30, maksimal 2 desimal.
          </Text>
        )}
        {settingsSaved && (
          <Text accessibilityLiveRegion="polite" style={{ color: colors.sage, fontSize: 12 }}>
            Tarif berhasil disimpan.
          </Text>
        )}
      </View>
    </View>
  );
}
