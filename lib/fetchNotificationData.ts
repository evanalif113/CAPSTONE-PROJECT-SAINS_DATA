// lib/fetchNotificationData.ts
import {
  database,
  ref,
  get,
  update, // 'update' lebih aman karena hanya mengubah field yang diberikan
  remove,
  push, // Impor 'push' untuk membuat data baru
} from "@/lib/firebaseConfig";

export interface Notification {
  id: string; // ID unik untuk notifikasi
  message: string; // Pesan notifikasi
  timestamp: number; // Waktu notifikasi dalam format UNIX timestamp
  read: boolean; // Status apakah notifikasi sudah dibaca
}

/**
 * Menambahkan notifikasi baru untuk pengguna.
 * @param userId - ID pengguna.
 * @param message - Pesan notifikasi.
 */
export const addNotification = async (userId: string, message: string): Promise<void> => {
  try {
    const notificationsRef = ref(database, `${userId}/notifications`);
    const newNotification = {
      message,
      timestamp: Date.now(),
      read: false,
    };
    await push(notificationsRef, newNotification);
  } catch (error) {
    console.error("Error adding notification:", error);
    throw new Error("Gagal menambahkan notifikasi.");
  }
};

/**
 * Mengambil semua notifikasi untuk pengguna tertentu.
 * @param userId - ID pengguna.
 * @returns Promise yang resolve dengan array notifikasi, diurutkan dari yang terbaru.
 */
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const notificationsRef = ref(database, `${userId}/notifications`);
    const snapshot = await get(notificationsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Ubah objek menjadi array dan urutkan dari yang terbaru
      const notifications = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key],
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      return notifications;
    }
    return []; // Kembalikan array kosong jika tidak ada notifikasi
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Gagal mengambil data notifikasi.");
  }
};

/**
 * Menghapus notifikasi tertentu.
 * @param userId - ID pengguna.
 * @param notificationId - ID notifikasi yang akan dihapus.
 */
export const deleteNotification = async (userId: string, notificationId: string): Promise<void> => {
  try {
    const notificationRef = ref(database, `${userId}/notifications/${notificationId}`);
    await remove(notificationRef);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw new Error("Gagal menghapus notifikasi.");
  }
};

