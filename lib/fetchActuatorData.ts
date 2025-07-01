// lib/fetchActuatorData.ts
import {
  database,
  ref,
  get,
  update, // Kita menggunakan 'update' untuk mengubah data spesifik
} from "@/lib/firebaseConfig";
import { addActuatorLog } from "@/lib/fetchActuatorLog"; // Impor fungsi logging

/**
 * Mendefinisikan struktur data untuk status aktuator.
 * Ini adalah objek di mana setiap key adalah ID aktuator (dalam bentuk string)
 * dan nilainya adalah status (0 untuk OFF, 1 untuk ON).
 * Contoh: { "16": 1, "pompa": 0 }
 */
export interface ActuatorData {
  [key: number]: 0 | 1;
}

/**
 * Mengambil seluruh data status aktuator untuk seorang pengguna.
 * @param userId - ID pengguna yang datanya akan diambil.
 * @returns Sebuah promise yang akan resolve dengan objek ActuatorData, atau null jika tidak ada data.
 */
export async function fetchActuatorData(
  userId: string
): Promise<ActuatorData | null> {
  try {
    const dataRef = ref(database, `${userId}/aktuator/data`);
    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      return snapshot.val() as ActuatorData;
    } else {
      console.log("Data aktuator tidak ditemukan.");
      return null;
    }
  } catch (error) {
    console.error("Gagal mengambil data aktuator:", error);
    throw error;
  }
}

/**
 * Memperbarui status dari satu aktuator spesifik.
 * @param userId - ID pengguna yang datanya akan diupdate.
 * @param actuatorId - ID dari aktuator yang akan diubah (misal: "16").
 * @param newState - Status baru untuk aktuator (0 atau 1).
 * @param mode - Mode pemicu aksi ('manual' atau 'auto').
 * @returns Sebuah promise yang akan resolve ketika update selesai.
 */
export async function updateActuatorState(
  userId: string,
  PinId: string,
  newState: 0 | 1,
  mode: 'manual' | 'auto'
): Promise<void> {
  try {
    const dataRef = ref(database, `${userId}/aktuator/data`);

    // Objek 'updates' menentukan path spesifik yang akan diubah.
    // Kunci dinamis [actuatorId] akan menjadi "16", "17", dll.
    const updates = {
      [PinId]: newState,
    };

    // Fungsi 'update' hanya akan mengubah field yang ada di dalam objek 'updates',
    // tanpa mempengaruhi data aktuator lainnya.
    await update(dataRef, updates);

    // Tambahkan log setelah state berhasil diubah
    await addActuatorLog(userId, {
      pin: PinId,
      state: newState,
      mode: mode,
    });

    console.log(`Status aktuator ${PinId} berhasil diubah menjadi ${newState} (Mode: ${mode})`);
  } catch (error) {
    console.error(`Gagal mengubah status aktuator ${PinId}:`, error);
    throw error;
  }
}
