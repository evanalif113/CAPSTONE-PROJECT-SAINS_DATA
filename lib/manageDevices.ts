// lib/manageDevices.ts
import { database, ref, get, set, push, remove, update } from "@/lib/firebaseConfig";

export interface Device {
  id: string; // ID unik, sekarang akan menjadi Nomor Seri yang diinput manual
  name: string;
  location: string;
  type: 'sensor' | 'actuator';
  sensorId?: number; // Opsional, hanya untuk tipe sensor
  status?: 'active' | 'inactive'; // Status perangkat
}

// Mengambil semua perangkat (Tidak perlu diubah)
export async function fetchDevices(userId: string): Promise<Device[]> {
  const devicesRef = ref(database, `${userId}/devices`);
  try {
    const snapshot = await get(devicesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Logika ini secara otomatis mengambil key (Nomor Seri) dan menjadikannya 'id'
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  } catch (error) {
    console.error("Gagal mengambil data perangkat:", error);
    throw error;
  }
}

// Menambah perangkat baru dengan Nomor Seri manual sebagai ID
export async function addDevice(userId: string, deviceData: Omit<Device, 'status'>): Promise<void> {
  // 1. Validasi dasar: pastikan ID (Nomor Seri) tidak kosong.
  // Firebase keys juga tidak boleh mengandung karakter seperti ., $, #, [, ], /, dll.
  // Kita asumsikan input sudah divalidasi di frontend, tapi pengecekan di sini adalah praktik yang baik.
  if (!deviceData.id || deviceData.id.trim() === '') {
    throw new Error("Nomor Seri tidak boleh kosong.");
  }
  
  const sanitizedId = deviceData.id.replace(/[.#$[\]/]/g, '_'); // Contoh sanitasi sederhana
  const deviceRef = ref(database, `${userId}/devices/${sanitizedId}`);

  try {
    // 2. Langkah Kritis: Periksa apakah perangkat dengan Nomor Seri ini sudah ada
    const snapshot = await get(deviceRef);
    if (snapshot.exists()) {
      // Jika sudah ada, tolak penambahan dan beri pesan error
      throw new Error(`Perangkat dengan Nomor Seri "${sanitizedId}" sudah terdaftar.`);
    }

    // 3. Siapkan data yang akan disimpan.
    // Kita tidak perlu menyimpan 'id' di dalam objek data, karena itu sudah menjadi key.
    const { id, ...dataToSet } = deviceData;

    // 4. Jika Nomor Seri unik, simpan perangkat baru menggunakan set()
    await set(deviceRef, { ...dataToSet, status: 'active' }); // Tambahkan status default saat membuat
    console.log(`Perangkat dengan Nomor Seri "${sanitizedId}" berhasil ditambahkan.`);

  } catch (error) {
    console.error("Gagal menambah perangkat:", error);
    // Lemparkan kembali error agar bisa ditangani oleh pemanggil fungsi
    throw error;
  }
}

// Memperbarui perangkat yang ada (Tidak perlu diubah)
export async function updateDevice(userId: string, deviceId: string, deviceData: Partial<Omit<Device, 'id'>>): Promise<void> {
  const deviceRef = ref(database, `${userId}/devices/${deviceId}`);
  try {
    await update(deviceRef, deviceData);
    console.log(`Perangkat "${deviceId}" berhasil diperbarui.`);
  } catch (error) {
    console.error("Gagal memperbarui perangkat:", error);
    throw error;
  }
}

// Menghapus perangkat (Tidak perlu diubah)
export async function deleteDevice(userId: string, deviceId: string): Promise<void> {
  const deviceRef = ref(database, `${userId}/devices/${deviceId}`);
  try {
    await remove(deviceRef);
    console.log(`Perangkat "${deviceId}" berhasil dihapus.`);
  } catch (error) {
    console.error("Gagal menghapus perangkat:", error);
    throw error;
  }
}