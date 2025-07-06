import { database, ref, get } from "@/lib/firebaseConfig";

/**
 * Interface for the prediction data structure.
 * This ensures type safety for the fetched data.
 */
export interface PredictionData {
  temperature: number;
  humidity: number;
}

/**
 * Fetches the latest prediction data (temperature and humidity) for a given user from Firebase.
 * @param uid - The unique ID of the user.
 * @returns A promise that resolves to an object containing temperature and humidity, or null if no data is found.
 */
export const fetchPredictionData = async (
  uid: string
): Promise<PredictionData | null> => {
  if (!uid) {
    console.error("UID is required to fetch prediction data.");
    return null;
  }

  try {
    // Construct the reference to the 'predict' node for the specific user
    const predictRef = ref(database, `users/${uid}/predict`);
    const snapshot = await get(predictRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Ensure the required fields exist before returning
      if (data && typeof data.temperature !== 'undefined' && typeof data.humidity !== 'undefined') {
        return {
          temperature: data.temperature,
          humidity: data.humidity,
        };
      } else {
        console.warn("Prediction data exists but is missing temperature or humidity fields.");
        return null;
      }
    } else {
      console.log("No prediction data available for this user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching prediction data:", error);
    // Re-throw the error to be handled by the calling function
    throw new Error("Failed to fetch prediction data from Firebase.");
  }
};
