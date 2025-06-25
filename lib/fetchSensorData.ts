// lib/fetchSensorData.ts
import {
  database,
  ref,
  query,
  orderByKey,
  limitToLast,
  get,
} from "@/lib/firebaseConfig";

interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
  timeFormatted: string;
}

export async function fetchUserSensorData(
  userId: string,
  limit: number = 60
): Promise<SensorData[]> {
  try {
    const dataRef = query(
      ref(database, `${userId}/sensor/data`),
      orderByKey(),
      limitToLast(limit)
    );

    const snapshot = await get(dataRef);
    if (!snapshot.exists()) return [];

    const results: SensorData[] = [];

    snapshot.forEach((child) => {
      const data = child.val();
      const formattedTime = new Date(data.timestamp * 1000).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      );

      results.push({
        ...data,
        timeFormatted: formattedTime,
      });
    });

    return results;
  } catch (error) {
    console.error("Gagal mengambil data sensor:", error);
    throw error;
  }
}
