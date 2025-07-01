// lib/fetchNotificationData.ts
import {
  database,
  ref,
  get,
  update, // 'update' lebih aman karena hanya mengubah field yang diberikan
  remove,
  set, // Impor 'set' untuk menggunakan key kustom
} from "@/lib/firebaseConfig";

export interface Notification {
  id: string; // ID unik untuk notifikasi (akan menjadi timestamp)
  message: string; // Pesan notifikasi
  read: boolean; // Status apakah notifikasi sudah dibaca
  timestamp: number; // Timestamp tetap disimpan untuk kemudahan akses
}

/**
 * Menambahkan notifikasi baru untuk pengguna.
 * @param userId - ID pengguna.
 * @param message - Pesan notifikasi.
 */
export const addNotification = async (userId: string, message: string): Promise<void> => {
  try {
    const timestamp = Date.now();
    const notificationRef = ref(database, `${userId}/notifications/${timestamp}`);
    const newNotification = {
      message,
      read: false,
      timestamp: timestamp, // Simpan juga di dalam objek untuk konsistensi
    };
    await set(notificationRef, newNotification);
  } catch (error) {
    console.error("Error adding notification:", error);
    throw new Error("Gagal menambahkan notifikasi.");
  }
};

/**
 * Menandai notifikasi sebagai sudah dibaca.
 * @param userId - ID pengguna.
 * @param notificationId - ID notifikasi yang akan ditandai.
 */
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  try {
    const notificationRef = ref(database, `${userId}/notifications/${notificationId}`);
    await update(notificationRef, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Gagal menandai notifikasi.");
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
      // Ubah objek menjadi array dan urutkan dari yang terbaru berdasarkan key (timestamp)
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

