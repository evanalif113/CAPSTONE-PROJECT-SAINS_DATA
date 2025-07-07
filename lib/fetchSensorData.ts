// lib/fetchSensorData.ts
import {
  database,
  ref,
  query,
  orderByKey,
  limitToLast,
  get,
  remove
} from "@/lib/firebaseConfig";

export interface SensorValue {
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
}

export interface SensorDate extends SensorValue {
  timestamp: number; // UNIX timestamp in milliseconds
  dateFormatted: string; // Optional, if you want to store a formatted date
  timeFormatted: string;
}

/**
 * Memperbarui status dari satu aktuator spesifik.
 * @param userId - ID pengguna yang datanya akan diupdate.
 * @param limit - Berapa Poin data yang akan diambil.
 * @returns Sebuah promise yang akan resolve ketika get data selesai.
 */

export async function fetchSensorData(
  userId: string,
  limit: number,
): Promise<SensorDate[]> {
  console.log("fetchSensorData called with:", { userId, limit });
  try {
    const dataRef = query(
      ref(database, `${userId}/sensor/data`),
      orderByKey(),
      limitToLast(limit)
    );

    const snapshot = await get(dataRef);
    console.log("Firebase snapshot exists:", snapshot.exists());
    if (!snapshot.exists()) {
      console.log("No sensor data found.");
      return [];
    }

    const results: SensorDate[] = [];

    snapshot.forEach((child) => {
      // 1. Ambil timestamp dari KEY (detik), dan konversi ke milidetik untuk JS
      const timestampInSeconds = Number(child.key);
      const timestampInMillis = timestampInSeconds * 1000;
      console.log("Processing timestamp (ms):", timestampInMillis);
      const data: SensorValue = child.val();
      console.log("Sensor value from child:", data);

      // 2. Format waktu menggunakan timestamp yang benar
      const formattedTime = new Date(timestampInMillis).toLocaleString(
        'id-ID',
        {
          timeZone: "Asia/Jakarta", // Pastikan zona waktu sesuai
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      ).replace(/\./g, ':');  //replace untuk mengganti titik dengan titik dua
      console.log("Formatted time:", formattedTime);
      // 2.1 Format tanggal jika diperlukan
      const dateFormatted = new Date(timestampInMillis).toLocaleString(
        'id-ID',
        {
          timeZone: "Asia/Jakarta", // Pastikan zona waktu sesuai
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      ).replace(/\./g, ':');  //replace untuk mengganti titik dengan titik dua
      console.log("Formatted time:", formattedTime);
      // 3. Gabungkan semua data sesuai interface SensorData
      const resultItem = {
        timestamp: timestampInMillis, // Simpan dalam milidetik
        temperature: data.temperature,
        humidity: data.humidity,
        light: data.light,
        moisture: data.moisture,
        dateFormatted: dateFormatted,
        timeFormatted: formattedTime,
      };
      console.log("Pushing item to results:", resultItem);
      results.push(resultItem);
    });

    // 4. Balik urutan array agar data terbaru berada di indeks pertama
    const reversedResults = results.reverse();
    console.log("Final reversed results:", reversedResults);
    return reversedResults;

  } catch (error) {
    console.error("Gagal mengambil data sensor:", error);
    // Melempar kembali error
    throw error;
  }
}

/**
 * Menghapus semua data sensor untuk pengguna tertentu.
 * @param userId - ID pengguna yang datanya akan dihapus.
 * @returns Sebuah promise yang akan resolve ketika data berhasil dihapus.
 */
export async function deleteSensorData(userId: string): Promise<void> {
  try {
    const dataRef = ref(database, `${userId}/sensor/data`);
    await remove(dataRef);
    console.log(`Sensor data for user ${userId} deleted successfully.`);
  } catch (error) {
    console.error("Gagal menghapus data sensor:", error);
    throw error;
  }
}