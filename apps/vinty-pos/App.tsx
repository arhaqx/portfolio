import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CATALOG_VERSION } from "./src/catalog";
import { Inventory, Orders, Reports } from "./src/Management";
import { Register, type Mutate } from "./src/Register";
import { businessDate, report, type Order, type POSState } from "./src/model";
import { formatMoney } from "./src/money";
import { printReceipt, receiptText, shareReceipt } from "./src/receipts";
import { loadState, saveState } from "./src/store";
import { colors, s, serif } from "./src/theme";
import { Badge, Button, Dialog } from "./src/ui";

const navigation = [
  { id: "register", label: "Kasir", icon: "▦" },
  { id: "orders", label: "Pesanan", icon: "▤" },
  { id: "inventory", label: "Menu & stok", icon: "▧" },
  { id: "reports", label: "Laporan", icon: "◴" },
] as const;
type Screen = (typeof navigation)[number]["id"];

function VintyPOS() {
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  const [screen, setScreen] = useState<Screen>("register");
  const [state, setState] = useState<POSState | null>(null);
  const stateRef = useRef<POSState | null>(null);
  const writing = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [clock, setClock] = useState(() => new Date());
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [receiptError, setReceiptError] = useState("");
  const [about, setAbout] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const bootstrap = useCallback(async () => {
    setLoadError("");
    try {
      const saved = await loadState();
      stateRef.current = saved;
      setState(saved);
    } catch (cause) {
      setLoadError(
        cause instanceof Error ? cause.message : "Penyimpanan perangkat tidak dapat dibaca.",
      );
    }
  }, []);
  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const mutate: Mutate = useCallback(async (operation) => {
    if (writing.current || !stateRef.current) return false;
    writing.current = true;
    setBusy(true);
    setError("");
    try {
      const current = stateRef.current;
      const persisted = await saveState(operation(current), current.revision);
      stateRef.current = persisted;
      setState(persisted);
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Data gagal disimpan. Transaksi belum diselesaikan.",
      );
      return false;
    } finally {
      writing.current = false;
      setBusy(false);
    }
  }, []);

  if (!state)
    return (
      <View
        style={[s.app, { alignItems: "center", justifyContent: "center", padding: 30, gap: 20 }]}
      >
        <Image
          source={require("./assets/logo.png")}
          accessibilityLabel="Logo Vinty"
          style={{ width: 190, height: 75 }}
          resizeMode="contain"
        />
        {loadError ? (
          <>
            <Text
              accessibilityRole="alert"
              style={[s.text, { textAlign: "center", maxWidth: 420 }]}
            >
              {loadError}
            </Text>
            <Text style={[s.muted, { textAlign: "center", maxWidth: 400 }]}>
              Data tidak dihapus atau ditimpa. Pastikan penyimpanan browser/perangkat diizinkan.
            </Text>
            <Button onPress={() => void bootstrap()}>Coba baca ulang</Button>
          </>
        ) : (
          <ActivityIndicator color={colors.brown} />
        )}
      </View>
    );

  const stats = report(state, businessDate(clock));
  const activeOrders = state.orders.filter(
    (order) => order.status === "paid" && order.fulfillment !== "completed",
  ).length;
  const openReceipt = (order: Order) => {
    setReceipt(order);
    setReceiptError("");
  };
  const currentReceipt = receipt
    ? (state.orders.find((order) => order.id === receipt.id) ?? receipt)
    : null;
  const nav = navigation.map((item) => (
    <Pressable
      key={item.id}
      accessibilityRole="button"
      accessibilityLabel={`Navigasi ${item.label}`}
      accessibilityState={{ selected: screen === item.id }}
      onPress={() => {
        setScreen(item.id);
        setCartOpen(false);
      }}
      style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
        {
          flexDirection: desktop ? "row" : "column",
          alignItems: "center",
          gap: desktop ? 13 : 4,
          paddingVertical: desktop ? 13 : 10,
          paddingHorizontal: desktop ? 14 : 10,
          borderRadius: 10,
          backgroundColor:
            screen === item.id ? colors.brown : hovered ? colors.cream : "transparent",
          flex: desktop ? undefined : 1,
        },
      ]}
    >
      <Text
        style={{
          fontSize: desktop ? 20 : 18,
          color: screen === item.id ? colors.white : colors.muted,
        }}
      >
        {item.icon}
      </Text>
      <Text
        style={{
          fontSize: desktop ? 12 : 10,
          fontWeight: screen === item.id ? "600" : "400",
          color: screen === item.id ? colors.white : colors.muted,
        }}
      >
        {item.label}
      </Text>
      {desktop && item.id === "orders" && activeOrders > 0 && (
        <View
          style={{
            marginLeft: "auto",
            backgroundColor: screen === item.id ? "rgba(255,255,255,0.18)" : colors.cream,
            paddingHorizontal: 7,
            paddingVertical: 3,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: screen === item.id ? colors.white : colors.brown, fontSize: 10 }}>
            {activeOrders}
          </Text>
        </View>
      )}
    </Pressable>
  ));

  return (
    <View style={s.app}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, flexDirection: "row" }}>
        {desktop && (
          <View
            style={{
              width: 205,
              padding: 23,
              paddingTop: 32,
              borderRightWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              gap: 35,
            }}
          >
            <View style={{ gap: 7, paddingHorizontal: 9 }}>
              <Image
                source={require("./assets/logo.png")}
                accessibilityLabel="Logo Vinty"
                style={{ width: 145, height: 58 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 8, letterSpacing: 2.5, color: colors.muted }}>
                COFFEE & SPACE
              </Text>
            </View>
            <View style={{ gap: 7 }}>
              <Text style={[s.eyebrow, { fontSize: 8, paddingLeft: 14, marginBottom: 10 }]}>
                WORKSPACE
              </Text>
              {nav}
            </View>
            <View style={{ marginTop: "auto", gap: 18 }}>
              <View style={{ borderRadius: 12, padding: 15, backgroundColor: colors.page, gap: 9 }}>
                <Text style={[s.text, { fontFamily: serif, fontSize: 20 }]}>A little pause.</Text>
                <Text style={[s.muted, { fontSize: 10 }]}>
                  Kopi yang baik selalu punya tempat untuk pulang.
                </Text>
                <Text style={{ color: colors.sage, fontSize: 9 }}>VINTY · JEPARA</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setAbout(true)}
                style={{ padding: 9, minHeight: 44 }}
              >
                <Text style={s.muted}>ⓘ Tentang demo</Text>
              </Pressable>
              <View
                style={[
                  s.row,
                  { borderTopWidth: 1, borderColor: colors.border, paddingTop: 18, gap: 10 },
                ]}
              >
                <Image
                  source={require("./assets/icon.png")}
                  style={{ width: 33, height: 33, borderRadius: 10 }}
                />
                <View>
                  <Text style={{ color: colors.ink, fontSize: 11, fontWeight: "600" }}>
                    Vinty Coffee & Space
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 9, marginTop: 3 }}>
                    Single register · Local mode
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View
            style={{
              paddingHorizontal: desktop ? 32 : 19,
              paddingVertical: desktop ? 23 : 17,
              borderBottomWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              gap: 13,
            }}
          >
            <View style={s.between}>
              <View style={{ gap: 5 }}>
                {desktop ? (
                  <Text style={s.eyebrow}>VINTY COFFEE & SPACE</Text>
                ) : (
                  <Image
                    source={require("./assets/logo.png")}
                    accessibilityLabel="Logo Vinty"
                    style={{ width: 85, height: 34 }}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={{
                    color: colors.ink,
                    fontSize: desktop ? 22 : 20,
                    fontWeight: "600",
                    letterSpacing: -0.5,
                  }}
                >
                  {navigation.find((item) => item.id === screen)?.label}
                  <Text style={{ color: colors.muted, fontWeight: "400", fontSize: 12 }}>
                    {" "}
                    / Point of sale
                  </Text>
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text style={[s.muted, { fontSize: 10 }]}>
                  {clock.toLocaleDateString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
                <Badge>{busy ? "○ Menyimpan…" : "● Tersimpan lokal"}</Badge>
              </View>
            </View>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: desktop ? 30 : 17, gap: 22, paddingBottom: 40 }}
          >
            <View style={[s.between, { flexWrap: "wrap" }]}>
              <Text style={{ color: colors.muted, fontSize: 10, letterSpacing: 0.6 }}>
                DEMO INTERAKTIF · MENU VINTY
              </Text>
              <Text style={[s.muted, { fontSize: 10 }]}>
                {stats.orders} transaksi hari ini ·{" "}
                <Text style={{ color: colors.brown, fontWeight: "600" }}>
                  {formatMoney(stats.revenue)}
                </Text>
              </Text>
            </View>
            {state.catalogVersion !== CATALOG_VERSION && (
              <View style={{ padding: 14, backgroundColor: colors.cream, borderRadius: 10 }}>
                <Text style={s.text}>
                  Menu Vinty terbaru akan diterapkan setelah pesanan saat ini selesai atau keranjang
                  dikosongkan. Harga pesanan yang sedang dibuat tetap dipertahankan.
                </Text>
              </View>
            )}
            {!!error && (
              <View
                accessibilityRole="alert"
                style={{
                  backgroundColor: colors.dangerLight,
                  padding: 16,
                  borderRadius: 10,
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 12, color: colors.danger }}>{error}</Text>
                <View style={s.row}>
                  <Button
                    secondary
                    disabled={busy}
                    onPress={() => {
                      setError("");
                      void bootstrap();
                    }}
                  >
                    Muat ulang data
                  </Button>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Tutup pesan kesalahan"
                    onPress={() => setError("")}
                    style={{ padding: 10 }}
                  >
                    <Text style={{ color: colors.danger, fontSize: 12 }}>Tutup pesan</Text>
                  </Pressable>
                </View>
              </View>
            )}
            {screen === "register" && (
              <Register
                state={state}
                mutate={mutate}
                busy={busy}
                onReceipt={openReceipt}
                cartOpen={cartOpen}
                onCartClose={() => setCartOpen(false)}
                error={error}
              />
            )}
            {screen === "orders" && (
              <Orders
                state={state}
                mutate={mutate}
                busy={busy}
                onReceipt={openReceipt}
                error={error}
              />
            )}
            {screen === "inventory" && (
              <Inventory state={state} mutate={mutate} busy={busy} error={error} />
            )}
            {screen === "reports" && <Reports state={state} mutate={mutate} busy={busy} />}
            {!desktop && (
              <Pressable
                accessibilityRole="button"
                onPress={() => setAbout(true)}
                style={{ padding: 12, alignItems: "center" }}
              >
                <Text style={s.muted}>ⓘ Tentang Vinty POS & kredit open source</Text>
              </Pressable>
            )}
          </ScrollView>
          {width < 1180 && screen === "register" && state.cart.length > 0 && (
            <View
              style={{
                padding: 12,
                borderTopWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Button onPress={() => setCartOpen(true)}>
                Buka pesanan · {state.cart.reduce((sum, line) => sum + line.quantity, 0)} item →
              </Button>
            </View>
          )}
          {!desktop && (
            <View
              style={{
                flexDirection: "row",
                borderTopWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                padding: 8,
                gap: 4,
              }}
            >
              {nav}
            </View>
          )}
        </View>
      </View>
      {currentReceipt && (
        <Dialog
          title={currentReceipt.status === "voided" ? "Struk dibatalkan" : "Pembayaran tersimpan"}
          onClose={() => setReceipt(null)}
        >
          <View style={{ alignItems: "center", gap: 7 }}>
            <Text style={{ color: colors.sage, fontSize: 26 }}>✓</Text>
            <Text style={{ fontFamily: serif, fontSize: 33, color: colors.brown }}>
              Terima kasih.
            </Text>
            <Badge>STRUK DEMO · {currentReceipt.id}</Badge>
          </View>
          <View
            style={{
              padding: 20,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: colors.border,
              borderRadius: 10,
            }}
          >
            <Text
              selectable
              style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 21, color: colors.ink }}
            >
              {receiptText(currentReceipt)}
            </Text>
          </View>
          {!!receiptError && (
            <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 12 }}>
              {receiptError}
            </Text>
          )}
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Button
                secondary
                onPress={() => {
                  setReceiptError("");
                  void shareReceipt(currentReceipt).catch(() =>
                    setReceiptError("Struk gagal dibagikan. Coba lagi."),
                  );
                }}
              >
                ↓ Simpan / bagikan
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  setReceiptError("");
                  void printReceipt(currentReceipt).catch(() =>
                    setReceiptError(
                      "Pencetakan dibatalkan atau tidak tersedia. Struk tetap tersimpan.",
                    ),
                  );
                }}
              >
                Cetak struk
              </Button>
            </View>
          </View>
        </Dialog>
      )}
      {about && (
        <Dialog title="Dari kedai, untuk kedai." onClose={() => setAbout(false)}>
          <Text style={[s.heading, { fontFamily: serif, fontWeight: "400" }]}>Vinty POS</Text>
          <Text style={s.text}>
            Aplikasi POS untuk Vinty Coffee & Space di Jepara. Dibangun dengan Expo, React Native,
            dan TypeScript.
          </Text>
          <Text style={s.muted}>
            Versi ini adalah demo satu kasir. Menu dan harga mengikuti menu Vinty; stok dan
            transaksi adalah simulasi. Data disimpan pada perangkat ini; belum ada akun,
            sinkronisasi server, payment gateway, atau integrasi printer Bluetooth.
          </Text>
          <Text style={s.muted}>
            Pembayaran QRIS dicatat secara manual. Demo ini tidak memindahkan uang. Muatan aplikasi
            web membutuhkan internet saat dibuka pertama kali; data transaksi yang sudah dimuat
            dapat diproses tanpa koneksi.
          </Text>
          <Text style={s.muted}>
            Referensi arsitektur dan adaptasi utilitas uang: RetailPOS oleh n17foo dan kontributor
            (Apache 2.0). Antarmuka Vinty, katalog, transaksi, dan integrasi portofolio dikembangkan
            khusus untuk proyek ini.
          </Text>
          <Button
            secondary
            onPress={() => void Linking.openURL("https://github.com/n17foo/retailpos")}
          >
            Lihat repo referensi ↗
          </Button>
          <Button
            secondary
            onPress={() =>
              void Linking.openURL("https://github.com/arhaqx/portfolio/tree/main/apps/vinty-pos")
            }
          >
            Source Vinty POS ↗
          </Button>
          <Button
            onPress={() =>
              void Linking.openURL("https://arhaq.dev/projects/vinty-coffee-and-space")
            }
          >
            Studi kasus di portofolio ↗
          </Button>
        </Dialog>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "bottom"]} style={s.app}>
        <VintyPOS />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
