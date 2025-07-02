import {
  database,
  ref,
  get,
  set, // Impor 'set'
  query,
  orderByChild,
  remove, // Impor 'remove'
} from "@/lib/firebaseConfig";

export interface ActuatorLog {
  id: string;
  pin: string;
  state: 0 | 1; // Status yang diatur: 0 (ON) atau 1 (OFF)
  mode: 'auto' | 'manual';
  timestamp: number;
}

/**
 * Menambahkan log aktivitas aktuator baru.
 * @param userId - ID pengguna.
 * @param logData - Data log yang akan ditambahkan (tanpa id dan timestamp).
 */
export const addActuatorLog = async (userId: string, logData: Omit<ActuatorLog, 'id' | 'timestamp'>): Promise<void> => {
  try {
    const timestamp = Date.now();
    const logRef = ref(database, `${userId}/actuator_logs/${timestamp}`);
    const newLog = {
      ...logData,
      timestamp: timestamp, // Simpan timestamp di dalam objek juga
    };
    await set(logRef, newLog);
  } catch (error) {
    console.error("Error adding actuator log:", error);
    throw new Error("Gagal menambahkan log aktuator.");
  }
};

/**
 * Mengambil semua log aktivitas aktuator untuk pengguna tertentu.
 * @param userId - ID pengguna.
 * @returns Promise yang resolve dengan array log, diurutkan dari yang terbaru.
 */
export const fetchActuatorLogs = async (userId: string): Promise<ActuatorLog[]> => {
  try {
    const logRef = ref(database, `${userId}/actuator_logs`);
    const snapshot = await get(logRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const logs = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key],
        }))
        .sort((a, b) => b.timestamp - a.timestamp); // Urutkan dari terbaru di sisi klien
      return logs;
    }
    return [];
  } catch (error) {
    console.error("Error fetching actuator logs:", error);
    throw new Error("Gagal mengambil data log aktuator.");
  }
};

/**
 * Menghapus semua log aktivitas aktuator untuk pengguna tertentu.
 * @param userId - ID pengguna.
 */
export const deleteActuatorLogs = async (userId: string): Promise<void> => {
  try {
    const logRef = ref(database, `${userId}/actuator_logs`);
    await remove(logRef);
  } catch (error) {
    console.error("Error deleting actuator logs:", error);
    throw new Error("Gagal menghapus log aktuator.");
  }
};
