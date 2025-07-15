// Mengimpor instance 'database' dan fungsi-fungsi dari file konfigurasi pusat
import {
  database,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
} from "@/lib/firebaseConfig";
// Mengimpor TIPE 'Unsubscribe' langsung dari pustaka Firebase
import { Unsubscribe } from "firebase/database";

// --- Tipe Data ---
// Tipe dasar untuk data panen saat dibuat (belum punya ID)
export interface NewHarvestData {
  date: string;
  amount: number;
  quality: string;
  note: string;
  avgTemp: number;
  avgHumidity: number;
  timestamp: number; // Waktu dalam milidetik sejak epoch (1970-01-01T00:00:00Z)
}

// Tipe data panen lengkap setelah diambil dari Firebase (sudah punya ID)
export interface Harvest extends NewHarvestData {
  id: string;
}

// --- Konfigurasi ---

/**
 * Mendengarkan perubahan data pada node 'harvest_log' secara real-time.
 * @param userId ID unik pengguna.
 * @param callback Fungsi yang akan dipanggil setiap kali data panen berubah.
 * @returns Sebuah fungsi 'unsubscribe' untuk berhenti mendengarkan.
 */
export function listenToHarvestData(
  userId: string,
  callback: (harvests: Harvest[]) => void
): Unsubscribe {
  const harvestLogRef = ref(database, `${userId}/harvest_log`);

  const unsubscribe = onValue(harvestLogRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const loadedHarvests: Harvest[] = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key],
        }))
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
      callback(loadedHarvests);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

/**
 * Menambahkan entri data panen baru ke Firebase.
 * @param userId ID unik pengguna.
 * @param harvestData Objek data panen baru yang sesuai dengan interface NewHarvestData.
 */
export async function addHarvestData(
  userId: string,
  harvestData: NewHarvestData
): Promise<void> {
  const harvestLogRef = ref(database, `${userId}/harvest_log`);
  const newPostRef = push(harvestLogRef);
  await set(newPostRef, harvestData);
}

/**
 * Memperbarui entri data panen yang ada di Firebase.
 * @param userId ID unik pengguna.
 * @param id ID unik dari entri panen yang akan diperbarui.
 * @param harvestData Objek data panen yang berisi field yang akan diperbarui.
 */
export async function updateHarvestData(
  userId: string,
  id: string,
  harvestData: Partial<NewHarvestData>
): Promise<void> {
  const harvestEntryRef = ref(database, `${userId}/harvest_log/${id}`);
  await update(harvestEntryRef, harvestData);
}

/**
 * Menghapus entri data panen dari Firebase.
 * @param userId ID unik pengguna.
 * @param id ID unik dari entri panen yang akan dihapus.
 */
export async function deleteHarvestData(
  userId: string,
  id: string
): Promise<void> {
  const harvestEntryRef = ref(database, `${userId}/harvest_log/${id}`);
  await remove(harvestEntryRef);
}
