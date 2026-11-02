import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { artwork } from "./artwork";
import {
  CATEGORIES,
  cartTotals,
  checkout,
  setQuantity,
  type Category,
  type Checkout,
  type Order,
  type POSState,
  type Product,
} from "./model";
import { formatMoney } from "./money";
import { colors, s, serif } from "./theme";
import { Badge, Button, Chip, Dialog, Empty, Field } from "./ui";

export type Mutate = (operation: (state: POSState) => POSState) => Promise<boolean>;

function ProductCard({
  product,
  quantity,
  onAdd,
  width,
  busy,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  width: number | `${number}%`;
  busy: boolean;
}) {
  const soldOut = product.stock <= quantity;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Tambah ${product.name}, ${formatMoney(product.price)}, stok ${product.stock}`}
      accessibilityState={{ disabled: soldOut || busy }}
      disabled={soldOut || busy}
      onPress={onAdd}
      style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [
        {
          width,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          overflow: "hidden",
          opacity: soldOut ? 0.55 : 1,
        },
        (hovered || pressed) && { borderColor: colors.brown },
      ]}
    >
      <View
        style={{
          backgroundColor: colors.cream,
          position: "relative",
          width: "100%",
          aspectRatio: 600 / 420,
        }}
      >
        <Image
          source={artwork[product.art] ?? artwork["kopi-susu"]}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        {product.featured && (
          <View style={{ position: "absolute", top: 11, left: 11 }}>
            <Badge>Signature</Badge>
          </View>
        )}
        {quantity > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              borderRadius: 7,
              backgroundColor: colors.brown,
              paddingHorizontal: 9,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: colors.white, fontSize: 11 }}>{quantity} di pesanan</Text>
          </View>
        )}
      </View>
      <View style={{ padding: 14, gap: 5 }}>
        <Text
          style={{
            fontSize: 9,
            letterSpacing: 1.3,
            color: colors.muted,
            textTransform: "uppercase",
          }}
        >
          {product.category}
        </Text>
        <Text
          numberOfLines={2}
          style={[s.text, { fontWeight: "600", fontSize: 13, minHeight: 40 }]}
        >
          {product.name}
        </Text>
        <Text numberOfLines={1} style={[s.muted, { fontSize: 10 }]}>
          {product.description}
        </Text>
        <View style={[s.between, { marginTop: 9 }]}>
          <View>
            <Text style={[s.text, { fontWeight: "700", fontSize: 13 }]}>
              {formatMoney(product.price)}
            </Text>
            <Text
              style={{
                color: product.stock <= 5 ? colors.danger : colors.muted,
                fontSize: 10,
                marginTop: 2,
              }}
            >
              {soldOut ? "Stok habis / sudah di keranjang" : `Stok ${product.stock}`}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.brown,
              width: 31,
              height: 31,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.white, fontSize: 22 }}>+</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function Register({
  state,
  mutate,
  busy,
  onReceipt,
  cartOpen,
  onCartClose,
  error,
}: {
  state: POSState;
  mutate: Mutate;
  busy: boolean;
  onReceipt: (order: Order) => void;
  cartOpen: boolean;
  onCartClose: () => void;
  error: string;
}) {
  const { width } = useWindowDimensions();
  const wide = width >= 1180;
  const [category, setCategory] = useState<Category>("Semua");
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState<Checkout["serviceType"]>("Dine in");
  const [customer, setCustomer] = useState("");
  const [table, setTable] = useState("");
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [method, setMethod] = useState<Checkout["paymentMethod"]>("cash");
  const [cash, setCash] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [gridWidth, setGridWidth] = useState(600);
  const totals = cartTotals(state, discount);
  const products = state.products.filter(
    (product) =>
      product.active &&
      (category === "Semua" || product.category === category) &&
      `${product.name} ${product.description}`
        .toLocaleLowerCase("id")
        .includes(search.toLocaleLowerCase("id")),
  );
  const count = state.cart.reduce((sum, line) => sum + line.quantity, 0);
  const columns = gridWidth < 440 ? 2 : gridWidth < 760 ? 3 : 4;

  async function pay() {
    if (!/^\d*$/.test(cash)) {
      setPaymentError("Masukkan uang tunai dalam rupiah bulat.");
      return;
    }
    let receipt: Order | undefined;
    setPaymentError("");
    const success = await mutate((current) => {
      const result = checkout(current, {
        paymentMethod: method,
        tendered: Number(cash),
        qrisConfirmed: confirmed,
        discountBps: discount,
        customer,
        table,
        serviceType,
        note,
      });
      receipt = result.order;
      return result.state;
    });
    if (success && receipt) {
      setPaymentOpen(false);
      setCustomer("");
      setTable("");
      setNote("");
      setDiscount(0);
      onReceipt(receipt);
    } else
      setPaymentError("Pembayaran belum disimpan. Perbaiki kesalahan di bawah, lalu coba lagi.");
  }

  const cart = (
    <View
      style={[
        s.panel,
        {
          padding: wide ? 22 : 16,
          width: wide ? 340 : "100%",
          gap: 19,
          position: Platform.OS === "web" && wide ? ("sticky" as "relative") : "relative",
          top: 0,
        },
      ]}
    >
      <View style={s.between}>
        <View style={{ gap: 4 }}>
          <Text style={s.eyebrow}>CURRENT ORDER</Text>
          <Text style={[s.subheading, { fontFamily: serif, fontSize: 25, fontWeight: "400" }]}>
            Pesanan baru
          </Text>
        </View>
        <Badge>{count} item</Badge>
      </View>
      <View style={[s.row, { backgroundColor: colors.page, borderRadius: 10, padding: 4, gap: 5 }]}>
        {(["Dine in", "Take away"] as const).map((type) => (
          <Pressable
            key={type}
            accessibilityRole="button"
            accessibilityState={{ selected: serviceType === type }}
            onPress={() => setServiceType(type)}
            style={{
              flex: 1,
              borderRadius: 8,
              padding: 11,
              backgroundColor: serviceType === type ? colors.surface : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: serviceType === type ? colors.brown : colors.muted,
              }}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={s.row}>
        <Field
          label="Nama pelanggan"
          placeholder="Opsional"
          value={customer}
          onChangeText={setCustomer}
          maxLength={80}
        />
        {serviceType === "Dine in" && (
          <View style={{ width: 85 }}>
            <Field
              label="Meja *"
              placeholder="01"
              value={table}
              onChangeText={setTable}
              maxLength={12}
            />
          </View>
        )}
      </View>
      <View style={s.rule} />
      {!state.cart.length ? (
        <Empty
          title="Belum ada racikan"
          detail="Pilih menu favorit pelanggan untuk memulai pesanan pertama."
        />
      ) : (
        <View style={{ gap: 18 }}>
          {state.cart.map((line) => {
            const product = state.products.find((product) => product.id === line.productId)!;
            return (
              <View key={line.productId} style={{ gap: 9 }}>
                <View style={[s.row, { alignItems: "flex-start", gap: 10 }]}>
                  <Image
                    source={artwork[product.art] ?? artwork["kopi-susu"]}
                    style={{ width: 47, height: 47, borderRadius: 9 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.text, { fontSize: 12, fontWeight: "600" }]}>
                      {product.name}
                    </Text>
                    <Text style={[s.muted, { fontSize: 11 }]}>{formatMoney(product.price)}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Hapus ${product.name}`}
                    disabled={busy}
                    onPress={() => void mutate((current) => setQuantity(current, product.id, 0))}
                    hitSlop={8}
                    style={{ minWidth: 28, minHeight: 32, alignItems: "center" }}
                  >
                    <Text style={{ color: colors.muted, fontSize: 19 }}>×</Text>
                  </Pressable>
                </View>
                <View style={s.between}>
                  <View
                    style={[
                      s.row,
                      { gap: 0, borderWidth: 1, borderColor: colors.border, borderRadius: 8 },
                    ]}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Kurangi ${product.name}`}
                      disabled={busy}
                      onPress={() =>
                        void mutate((current) =>
                          setQuantity(current, product.id, line.quantity - 1),
                        )
                      }
                      style={{ padding: 8, minWidth: 34, alignItems: "center" }}
                    >
                      <Text style={s.text}>−</Text>
                    </Pressable>
                    <Text style={[s.text, { minWidth: 25, textAlign: "center", fontSize: 12 }]}>
                      {line.quantity}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Tambah satu ${product.name}`}
                      disabled={busy || line.quantity >= product.stock}
                      onPress={() =>
                        void mutate((current) =>
                          setQuantity(current, product.id, line.quantity + 1),
                        )
                      }
                      style={{
                        padding: 8,
                        minWidth: 34,
                        alignItems: "center",
                        opacity: line.quantity >= product.stock ? 0.3 : 1,
                      }}
                    >
                      <Text style={s.text}>+</Text>
                    </Pressable>
                  </View>
                  <Text style={[s.text, { fontWeight: "600", fontSize: 12 }]}>
                    {formatMoney(product.price * line.quantity)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
      <Field
        label="Catatan pesanan"
        placeholder="Contoh: less ice, tanpa gula…"
        value={note}
        onChangeText={setNote}
        maxLength={250}
      />
      <View style={s.rule} />
      <View style={{ gap: 9 }}>
        <View style={s.between}>
          <Text style={s.muted}>Subtotal</Text>
          <Text style={s.text}>{formatMoney(totals.subtotal)}</Text>
        </View>
        <View style={s.between}>
          <Text style={s.muted}>Diskon</Text>
          <View style={[s.row, { gap: 5 }]}>
            {[0, 500, 1000].map((value) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Diskon ${value / 100} persen`}
                accessibilityState={{ selected: discount === value }}
                key={value}
                onPress={() => setDiscount(value)}
                style={{
                  paddingHorizontal: 9,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: discount === value ? colors.cream : colors.page,
                }}
              >
                <Text style={{ color: colors.brown, fontSize: 10 }}>{value / 100}%</Text>
              </Pressable>
            ))}
          </View>
        </View>
        {totals.discount > 0 && (
          <View style={s.between}>
            <Text style={s.muted}>Potongan</Text>
            <Text style={[s.text, { color: colors.sage }]}>−{formatMoney(totals.discount)}</Text>
          </View>
        )}
        {state.settings.serviceBps > 0 && (
          <View style={s.between}>
            <Text style={s.muted}>Layanan {state.settings.serviceBps / 100}%</Text>
            <Text style={s.text}>{formatMoney(totals.service)}</Text>
          </View>
        )}
        {state.settings.taxBps > 0 && (
          <View style={s.between}>
            <Text style={s.muted}>Pajak {state.settings.taxBps / 100}%</Text>
            <Text style={s.text}>{formatMoney(totals.tax)}</Text>
          </View>
        )}
        <View
          style={[
            s.between,
            {
              borderTopWidth: 1,
              borderStyle: "dashed",
              borderColor: colors.border,
              paddingTop: 16,
              marginTop: 5,
            },
          ]}
        >
          <Text style={[s.text, { fontWeight: "600" }]}>Total tagihan</Text>
          <Text
            style={{ color: colors.brown, fontSize: 23, fontWeight: "700", letterSpacing: -0.8 }}
          >
            {formatMoney(totals.total)}
          </Text>
        </View>
      </View>
      <Button
        disabled={busy || !state.cart.length || (serviceType === "Dine in" && !table.trim())}
        onPress={() => {
          setCash("");
          setConfirmed(false);
          setPaymentError("");
          onCartClose();
          setPaymentOpen(true);
        }}
      >
        Lanjut pembayaran →
      </Button>
      <Text style={[s.muted, { textAlign: "center", fontSize: 10 }]}>
        Demo lokal · Pembayaran dicatat secara manual
      </Text>
    </View>
  );

  return (
    <>
      <View style={{ flexDirection: wide ? "row" : "column", gap: 24, alignItems: "flex-start" }}>
        <View
          style={{
            flex: wide ? 1 : undefined,
            width: wide ? undefined : "100%",
            gap: 22,
            minWidth: 0,
          }}
        >
          <View
            style={{
              backgroundColor: colors.cream,
              borderRadius: 18,
              padding: width < 600 ? 22 : 28,
              overflow: "hidden",
              minHeight: 153,
              justifyContent: "center",
            }}
          >
            <View style={{ gap: 10, maxWidth: "83%", zIndex: 1 }}>
              <Text style={[s.eyebrow, { color: colors.brown, fontSize: 9 }]}>
                BREWED WITH CARE. SERVED WITH LOVE.
              </Text>
              <Text
                style={{
                  fontFamily: serif,
                  fontSize: width < 600 ? 30 : 37,
                  lineHeight: width < 600 ? 35 : 41,
                  color: colors.brown,
                  letterSpacing: -1,
                }}
              >
                Racik hari yang baik.
              </Text>
              <Text style={{ fontSize: 11, lineHeight: 17, color: colors.brown }}>
                Satu kopi, satu obrolan, satu pesanan pada waktunya.
              </Text>
            </View>
            <Image
              source={require("../assets/logo-mark.png")}
              style={{
                position: "absolute",
                right: -8,
                bottom: -10,
                width: 165,
                height: 145,
                opacity: 0.1,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={[s.between, { flexWrap: "wrap", gap: 14 }]}>
            <View>
              <Text style={s.subheading}>Temukan menu favorit</Text>
              <Text style={[s.muted, { marginTop: 4 }]}>
                {state.products.filter((product) => product.active).length} pilihan menu siap
                disajikan
              </Text>
            </View>
            <View style={{ minWidth: 170, flexGrow: width < 600 ? 1 : 0 }}>
              <TextInput
                accessibilityLabel="Cari menu"
                placeholder="⌕   Cari kopi, makanan…"
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={setSearch}
                style={[s.input, { minWidth: 180 }]}
              />
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {CATEGORIES.map((item) => (
              <Chip key={item} active={category === item} onPress={() => setCategory(item)}>
                {item}
              </Chip>
            ))}
          </ScrollView>
          {products.length ? (
            <View
              onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
              style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  busy={busy}
                  quantity={state.cart.find((line) => line.productId === product.id)?.quantity ?? 0}
                  width={Math.max(0, (gridWidth - (columns - 1) * 14) / columns)}
                  onAdd={() =>
                    void mutate((current) =>
                      setQuantity(
                        current,
                        product.id,
                        (current.cart.find((line) => line.productId === product.id)?.quantity ??
                          0) + 1,
                      ),
                    )
                  }
                />
              ))}
            </View>
          ) : (
            <Empty
              title="Menu belum ditemukan"
              detail="Coba kata pencarian lain atau pilih kategori Semua."
              symbol="⌕"
            />
          )}
          <Text style={[s.muted, { fontSize: 10, marginBottom: 8 }]}>
            Menu dan harga mengikuti menu Vinty. Stok adalah simulasi; gambar merupakan ilustrasi.
          </Text>
        </View>
        {wide && cart}
      </View>
      {cartOpen && !wide && (
        <Dialog title="Detail pesanan" onClose={onCartClose}>
          {cart}
        </Dialog>
      )}
      {paymentOpen && (
        <Dialog title="Selesaikan pembayaran" onClose={() => !busy && setPaymentOpen(false)}>
          <View
            style={[s.panel, { backgroundColor: colors.page, alignItems: "center", padding: 20 }]}
          >
            <Text style={s.muted}>Total tagihan · {serviceType}</Text>
            <Text style={{ fontSize: 35, color: colors.brown, fontWeight: "700", marginTop: 7 }}>
              {formatMoney(totals.total)}
            </Text>
            <Text style={[s.muted, { marginTop: 6 }]}>
              {customer || "Pelanggan"}
              {serviceType === "Dine in" ? ` · Meja ${table}` : ""}
            </Text>
          </View>
          <View style={s.row}>
            <Chip
              active={method === "cash"}
              onPress={() => {
                setMethod("cash");
                setPaymentError("");
              }}
            >
              Tunai
            </Chip>
            <Chip
              active={method === "qris"}
              onPress={() => {
                setMethod("qris");
                setPaymentError("");
              }}
            >
              QRIS manual
            </Chip>
          </View>
          {method === "cash" ? (
            <>
              <Field
                label="Uang diterima (Rp)"
                value={cash}
                onChangeText={(value) => {
                  setCash(value.replace(/[^0-9]/g, ""));
                  setPaymentError("");
                }}
                keyboardType="number-pad"
                placeholder="0"
                maxLength={12}
              />
              <View style={[s.row, { flexWrap: "wrap", gap: 6 }]}>
                {[
                  ...new Set(
                    [totals.total, 50000, 100000].filter((value) => value >= totals.total),
                  ),
                ].map((value) => (
                  <Chip
                    key={value}
                    active={cash === String(value)}
                    onPress={() => setCash(String(value))}
                  >
                    {value === totals.total ? "Uang pas" : formatMoney(value)}
                  </Chip>
                ))}
              </View>
              <View style={s.between}>
                <Text style={s.muted}>
                  {Number(cash) < totals.total ? "Kekurangan" : "Kembalian"}
                </Text>
                <Text
                  style={[
                    s.text,
                    {
                      fontWeight: "700",
                      color: Number(cash) < totals.total ? colors.danger : colors.sage,
                    },
                  ]}
                >
                  {formatMoney(Math.abs(Number(cash) - totals.total))}
                </Text>
              </View>
            </>
          ) : (
            <View style={{ gap: 14 }}>
              <Text style={s.text}>
                Mode demo ini mencatat QRIS secara manual. Tidak ada kode pembayaran atau penarikan
                dana.
              </Text>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel="Konfirmasi pencatatan QRIS manual"
                accessibilityState={{ checked: confirmed }}
                aria-checked={confirmed}
                onPress={() => setConfirmed(!confirmed)}
                style={[
                  s.row,
                  {
                    alignItems: "flex-start",
                    backgroundColor: colors.page,
                    padding: 15,
                    borderRadius: 10,
                  },
                ]}
              >
                <View
                  style={{
                    width: 23,
                    height: 23,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: colors.brown,
                    backgroundColor: confirmed ? colors.brown : colors.surface,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: colors.white }}>{confirmed ? "✓" : ""}</Text>
                </View>
                <Text style={[s.text, { flex: 1, fontSize: 12 }]}>
                  Saya mengonfirmasi pencatatan pembayaran QRIS ini untuk transaksi demo.
                </Text>
              </Pressable>
            </View>
          )}
          {!!paymentError && (
            <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 12 }}>
              {paymentError}
            </Text>
          )}
          {!!error && (
            <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 12 }}>
              {error}
            </Text>
          )}
          <Button
            disabled={busy || (method === "cash" ? Number(cash) < totals.total : !confirmed)}
            onPress={() => void pay()}
          >
            {busy ? "Menyimpan…" : "Simpan pembayaran & buat struk"}
          </Button>
        </Dialog>
      )}
    </>
  );
}
