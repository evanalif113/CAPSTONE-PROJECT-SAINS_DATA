// lib/manageDevices.ts
import { database, ref, get, set, push, remove, update } from "@/lib/firebaseConfig";

export interface Device {
  id: string; // ID unik dari Firebase
  name: string;
  location: string;
  type: 'sensor' | 'actuator';
  sensorId?: number; // Opsional, hanya untuk tipe sensor
  status?: 'active' | 'inactive'; // Status perangkat
}

// Mengambil semua perangkat
export async function fetchDevices(userId: string): Promise<Device[]> {
  const devicesRef = ref(database, `${userId}/devices`);
  try {
    const snapshot = await get(devicesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Ubah objek dari Firebase menjadi array
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
  } catch (error) {
    console.error("Gagal mengambil data perangkat:", error);
    throw error;
  }
}

// Menambah perangkat baru
export async function addDevice(userId: string, deviceData: Omit<Device, 'id'>): Promise<void> {
  const devicesRef = ref(database, `${userId}/devices`);
  const newDeviceRef = push(devicesRef); // Buat ID unik baru
  try {
    await set(newDeviceRef, deviceData);
    console.log("Perangkat baru berhasil ditambahkan.");
  } catch (error) {
    console.error("Gagal menambah perangkat:", error);
    throw error;
  }
}

// <<< FUNGSI BARU DITAMBAHKAN DI SINI >>>
// Memperbarui perangkat yang ada
export async function updateDevice(userId: string, deviceId: string, deviceData: Partial<Omit<Device, 'id'>>): Promise<void> {
  const deviceRef = ref(database, `${userId}/devices/${deviceId}`);
  try {
    // Gunakan 'update' untuk memperbarui hanya field yang diberikan
    await update(deviceRef, deviceData);
    console.log("Perangkat berhasil diperbarui.");
  } catch (error) {
    console.error("Gagal memperbarui perangkat:", error);
    throw error;
  }
}

// Menghapus perangkat
export async function deleteDevice(userId: string, deviceId: string): Promise<void> {
  const deviceRef = ref(database, `${userId}/devices/${deviceId}`);
  try {
    await remove(deviceRef);
    console.log("Perangkat berhasil dihapus.");
  } catch (error) {
    console.error("Gagal menghapus perangkat:", error);
    throw error;
  }
}