// lib/fetchSensorData.ts
import {
  database,
  ref,
  query,
  orderByKey,
  limitToLast,
  get
} from "@/lib/firebaseConfig";

interface SensorValue {
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
}

export interface SensorData extends SensorValue {
  timestamp: number;
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
): Promise<SensorData[]> {
  try {
    const dataRef = query(
      ref(database, `${userId}/sensor/data`),
      orderByKey(),
      limitToLast(limit)
    );

    const snapshot = await get(dataRef);
    if (!snapshot.exists()) {
      console.log("No sensor data found.");
      return [];
    }

    const results: SensorData[] = [];

    snapshot.forEach((child) => {
      // 1. Ambil timestamp dari KEY, bukan dari VALUE
      const timestamp = Number(child.key); // <-- INI KUNCI PAKE UNIX TIME
      const data: SensorValue = child.val();

      // 2. Format waktu menggunakan timestamp yang benar
      const formattedTime = new Date(timestamp * 1000).toLocaleTimeString(
        'en-GB',
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      );
      // 3. Gabungkan semua data sesuai interface SensorData
      results.push({
        timestamp: timestamp,
        temperature: data.temperature,
        humidity: data.humidity,
        light: data.light,
        moisture: data.moisture,
        timeFormatted: formattedTime,
      });
    });

    // 4. Balik urutan array agar data terbaru berada di indeks pertama
    return results.reverse();

  } catch (error) {
    console.error("Gagal mengambil data sensor:", error);
    // Melempar kembali error
    throw error;
  }
}