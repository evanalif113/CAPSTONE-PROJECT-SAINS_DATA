// Mengimpor instance 'database' dan fungsi-fungsi dari file konfigurasi pusat
import { database, ref, onValue, set, push } from "@/lib/firebaseConfig";
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
// ID unik dari root database Anda
const DB_ROOT_ID = "GQAUD4ySfaNncpiZEkiKYNITWvK2";

/**
 * Mendengarkan perubahan data pada node 'harvest_log' secara real-time.
 * @param callback Fungsi yang akan dipanggil setiap kali data panen berubah.
 * @returns Sebuah fungsi 'unsubscribe' untuk berhenti mendengarkan.
 */
export function listenToHarvestData(
  callback: (harvests: Harvest[]) => void
): Unsubscribe {
  const harvestLogRef = ref(database, `${DB_ROOT_ID}/harvest_log`);

  const unsubscribe = onValue(harvestLogRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const loadedHarvests: Harvest[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      loadedHarvests.sort((a, b) => a.timestamp - b.timestamp);
      callback(loadedHarvests);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

/**
 * Menambahkan entri data panen baru ke Firebase.
 * @param harvestData Objek data panen baru yang sesuai dengan interface NewHarvestData.
 */
export async function addHarvestData(
  harvestData: NewHarvestData
): Promise<void> {
  const harvestLogRef = ref(database, `${DB_ROOT_ID}/harvest_log`);
  const newPostRef = push(harvestLogRef);

  const dataWithTimestamp: NewHarvestData = {
    ...harvestData,
    timestamp: Date.now(), // Menambahkan timestamp saat data dibuat
  };
  await set(newPostRef, dataWithTimestamp);
}
