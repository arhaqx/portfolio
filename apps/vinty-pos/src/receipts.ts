import { Platform, Share } from "react-native";
import { type Order, ordersCsv } from "./model";
import { formatMoney } from "./money";
import { logoSvg } from "./brand";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

export function receiptText(order: Order): string {
  return [
    "VINTY COFFEE & SPACE",
    "Jepara · STRUK DEMO",
    order.id,
    new Date(order.createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB",
    `${order.customer} · ${order.serviceType}${order.serviceType === "Dine in" ? ` · Meja ${order.table}` : ""}`,
    "",
    ...order.items.map(
      (item) => `${item.quantity} × ${item.name}  ${formatMoney(item.price * item.quantity)}`,
    ),
    "",
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Diskon: -${formatMoney(order.discount)}`,
    `Layanan: ${formatMoney(order.service)}`,
    `Pajak: ${formatMoney(order.tax)}`,
    `TOTAL: ${formatMoney(order.total)}`,
    `${order.paymentMethod === "cash" ? "Tunai" : "QRIS manual"}: ${formatMoney(order.tendered)}`,
    `Kembalian: ${formatMoney(order.change)}`,
    ...(order.note ? [`Catatan: ${order.note}`] : []),
    ...(order.status === "voided" ? [`DIBATALKAN: ${order.voidReason}`] : []),
    "",
    "Terima kasih sudah singgah.",
    "Brewed with care, served with love.",
    "Data lokal · Bukan bukti pembayaran sungguhan.",
  ].join("\n");
}

export function downloadText(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareReceipt(order: Order): Promise<void> {
  const content = receiptText(order);
  if (Platform.OS === "web") {
    downloadText(`${order.id}.txt`, content, "text/plain;charset=utf-8");
    return;
  }
  await Share.share({ title: order.id, message: content });
}

export async function printReceipt(order: Order): Promise<void> {
  const { printAsync } = await import("expo-print");
  await printAsync({
    html: `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>${escapeHtml(order.id)}</title><style>body{font:12px monospace;color:rgb(40,35,30);max-width:320px;margin:24px auto}pre{white-space:pre-wrap;line-height:1.7}header{text-align:center}header svg{width:150px;height:auto}@media print{@page{margin:12mm}}</style></head><body><header>${logoSvg}</header><pre>${escapeHtml(receiptText(order))}</pre></body></html>`,
  });
}

export async function exportOrders(orders: Order[]): Promise<void> {
  const csv = "\uFEFF" + ordersCsv(orders);
  if (Platform.OS === "web") {
    downloadText("vinty-transaksi.csv", csv, "text/csv;charset=utf-8");
    return;
  }
  // iOS/Android system share sheet; exports the actual CSV as a file.
  const [{ File, Paths }, { shareAsync }] = await Promise.all([
    import("expo-file-system"),
    import("expo-sharing"),
  ]);
  const file = new File(Paths.cache, "vinty-transaksi.csv");
  file.create({ overwrite: true });
  file.write(csv);
  await shareAsync(file.uri, {
    mimeType: "text/csv",
    UTI: "public.comma-separated-values-text",
    dialogTitle: "Ekspor transaksi Vinty",
  });
}
