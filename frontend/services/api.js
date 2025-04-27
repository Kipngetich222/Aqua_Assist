import { queueOfflineData, syncOfflineData } from "./offline";
import { NetInfo } from "@react-native-community/netinfo";

export const saveReading = async (data) => {
  try {
    const isOnline = (await NetInfo.fetch()).isConnected;
    const API_URL = await AsyncStorage.getItem("API_URL");

    if (isOnline && API_URL) {
      await axios.post(`${API_URL}/readings`, data);
      await syncOfflineData(); // Sync any queued data
    } else {
      await queueOfflineData(data); // Queue if offline
    }
  } catch (error) {
    console.error("Error saving reading:", error);
  }
};
