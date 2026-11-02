/**
 * Adapted from RetailPOS shared/utils/money.ts (Apache-2.0).
 * Upstream: n17foo/retailpos, commit 599406788360ef98c147e47f303ce2feaa50ecdf.
 * Vinty changes: integer rupiah, safe-integer validation, percentage basis points.
 * See THIRD_PARTY_NOTICES.md and licenses/retailpos-Apache-2.0.txt.
 */
export function assertRupiah(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new Error("Nominal rupiah harus berupa bilangan bulat positif atau nol.");
  return value;
}

export function multiplyMoney(price: number, quantity: number): number {
  assertRupiah(price);
  if (!Number.isSafeInteger(quantity) || quantity < 0) throw new Error("Jumlah tidak valid.");
  return assertRupiah(price * quantity);
}

export function sumMoney(amounts: number[]): number {
  return amounts.reduce((sum, amount) => assertRupiah(sum + assertRupiah(amount)), 0);
}

export function percentage(amount: number, basisPoints: number): number {
  assertRupiah(amount);
  if (!Number.isInteger(basisPoints) || basisPoints < 0 || basisPoints > 10000)
    throw new Error("Persentase tidak valid.");
  return assertRupiah(Math.round((amount * basisPoints) / 10000));
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
