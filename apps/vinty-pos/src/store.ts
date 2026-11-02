import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialState, migrateCatalog, parseState, type POSState } from "./model";

const STORAGE_KEY = "vinty-pos:v1";

export async function loadState(): Promise<POSState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw === null ? initialState() : migrateCatalog(parseState(raw));
}

export async function saveState(next: POSState, expectedRevision: number): Promise<POSState> {
  const write = async () => {
    const current = await loadState();
    if (current.revision !== expectedRevision)
      throw new Error("Data berubah di tab lain. Muat ulang aplikasi sebelum melanjutkan.");
    const persisted = { ...migrateCatalog(next), revision: expectedRevision + 1 };
    // One storage key commits inventory, order snapshots, and cart together.
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    return persisted;
  };
  // Serialize supported browsers across tabs. Native is a single register session.
  if (typeof navigator !== "undefined" && "locks" in navigator) {
    return navigator.locks.request("vinty-pos-write", write);
  }
  return write();
}
