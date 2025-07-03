import {
  database,
  ref,
  get,
  set,
} from "@/lib/firebaseConfig";

/**
 * Mengambil status mode (otomatis/manual) untuk pengguna tertentu.
 * @param userId - ID pengguna.
 * @returns Promise yang resolve dengan boolean (true jika auto, false jika manual). Default ke true jika tidak ada data.
 */
export const fetchMode = async (userId: string): Promise<boolean> => {
  try {
    const modeRef = ref(database, `${userId}/mode/auto`);
    const snapshot = await get(modeRef);

    if (snapshot.exists()) {
      // Mengembalikan nilai boolean dari data yang ada
      return !!snapshot.val(); 
    }
    // Jika tidak ada data, default ke mode otomatis (true)
    return true; 
  } catch (error) {
    console.error("Error fetching mode status:", error);
    throw new Error("Gagal mengambil status mode.");
  }
};

/**
 * Memperbarui status mode (otomatis/manual) untuk pengguna tertentu.
 * @param userId - ID pengguna.
 * @param isAuto - Status mode baru (true untuk auto, false untuk manual).
 */
export const updateMode = async (userId: string, isAuto: boolean): Promise<void> => {
  try {
    const modeRef = ref(database, `${userId}/mode/auto`);
    await set(modeRef, isAuto);
  } catch (error) {
    console.error("Error updating mode status:", error);
    throw new Error("Gagal memperbarui status mode.");
  }
};
