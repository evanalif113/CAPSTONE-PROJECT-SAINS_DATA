// lib/fetchThresholdData.ts
import {
  database,
  ref,
  get,
  update, // 'update' lebih aman karena hanya mengubah field yang diberikan
} from "@/lib/firebaseConfig";

/**
 * Mendefinisikan struktur data untuk nilai ambang batas (thresholds).
 */
export interface ThresholdValue {
  temperatureMax: number;
  temperatureMin: number;
  humidityMax: number;
  humidityMin: number;
  lightMax: number;
  lightMin: number;
  moistureMax: number;
  moistureMin: number;
}

/**
 * Mengambil data thresholds dari Firebase untuk pengguna tertentu.
 * @param userId - ID unik dari pengguna.
 * @returns Sebuah Promise yang resolve dengan objek ThresholdValue, atau null jika tidak ada data.
 */
export async function fetchThresholds(
  userId: string
): Promise<ThresholdValue | null> {
  // Tentukan path ke data thresholds pengguna
  const dataRef = ref(database, `${userId}/thresholds`);

  try {
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      // Jika data ada, kembalikan data tersebut
      return snapshot.val() as ThresholdValue;
    } else {
      // Jika tidak ada data, kembalikan null
      console.log("Data thresholds tidak ditemukan.");
      return null;
    }
  } catch (error) {
    console.error("Gagal mengambil data thresholds:", error);
    // Lemparkan kembali error agar bisa ditangani oleh pemanggil fungsi
    throw error;
  }
}

/**
 * Memperbarui data thresholds di Firebase untuk pengguna tertentu.
 * @param userId - ID unik dari pengguna.
 * @param newThresholds - Objek berisi nilai thresholds yang baru.
 * @returns Sebuah Promise yang akan resolve ketika proses update selesai.
 */
export async function updateThresholds(
  userId: string,
  newThresholds: Partial<ThresholdValue> // Gunakan Partial<> agar bisa update sebagian
): Promise<void> {
  // Tentukan path ke data thresholds pengguna
  const dataRef = ref(database, `${userId}/thresholds`);

  try {
    // Gunakan fungsi 'update' untuk memperbarui data
    await update(dataRef, newThresholds);
    console.log("Data thresholds berhasil diperbarui.");
  } catch (error) {
    console.error("Gagal memperbarui data thresholds:", error);
    // Lemparkan kembali error
    throw error;
  }
}