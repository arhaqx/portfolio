import type { Metadata } from "next";
import { Button, Column, Heading, Row, Text } from "@once-ui-system/core";

export const metadata: Metadata = {
  title: "Vinty POS — Interactive Demo | arhaq.dev",
  description:
    "Coba aplikasi kasir Vinty Coffee & Space: menu, transaksi, stok, struk, dan laporan. Dibangun dengan Expo dan React Native.",
  robots: { index: false, follow: true },
};

export default function VintyPOSDemo() {
  return (
    <Column as="section" fillWidth maxWidth={100} gap="24">
      <Row fillWidth horizontal="between" vertical="end" gap="16" wrap>
        <Column gap="8">
          <Text variant="label-strong-s" onBackground="brand-weak">
            EXPO · REACT NATIVE · TYPESCRIPT
          </Text>
          <Heading as="h1" variant="display-strong-s">
            Vinty POS
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak">
            Aplikasi kasir Vinty Coffee & Space, siap kamu coba.
          </Text>
        </Column>
        <Row gap="8" wrap>
          <Button href="/projects/vinty-coffee-and-space" variant="secondary" size="s">
            Studi kasus
          </Button>
          <Button
            href="/demos/vinty-pos/index.html"
            target="_blank"
            rel="noopener noreferrer"
            size="s"
            suffixIcon="arrowUpRightFromSquare"
          >
            Buka layar penuh
          </Button>
        </Row>
      </Row>
      <Column
        background="neutral-alpha-weak"
        border="neutral-alpha-weak"
        radius="m"
        padding="16"
        gap="8"
      >
        <Text variant="body-default-s">
          Mulai dengan memilih menu, isi nomor meja atau pilih take away, lalu lanjutkan pembayaran
          tunai atau QRIS manual. Pesanan, stok, dan laporan akan mengikuti transaksi yang kamu
          buat.
        </Text>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Menu dan harga mengikuti referensi Vinty. Stok dan transaksi adalah simulasi. Data
          tersimpan di perangkat ini. Pembayaran dicatat sebagai simulasi tanpa perpindahan dana.
        </Text>
      </Column>
      <iframe
        src="/demos/vinty-pos/index.html"
        title="Demo interaktif Vinty POS — aplikasi kasir Expo dan React Native"
        style={{
          width: "100%",
          height: "82dvh",
          minHeight: 720,
          border: "1px solid var(--neutral-alpha-medium)",
          borderRadius: "16px",
          background: "var(--page-background)",
        }}
      />
      <Row fillWidth horizontal="between" gap="16" wrap>
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Satu kode aplikasi untuk mobile dan web · Penyimpanan lokal · QRIS manual
        </Text>
        <Button
          href="https://github.com/arhaqx/veloce-landing-page"
          variant="tertiary"
          size="s"
          suffixIcon="arrowUpRightFromSquare"
        >
          Source aplikasi & cara menjalankan
        </Button>
      </Row>
    </Column>
  );
}
