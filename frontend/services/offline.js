import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to offline queue
export const queueOfflineData = async (data) => {
  try {
    const queue = JSON.parse(await AsyncStorage.getItem('offlineQueue') || '[]');
    queue.push(data);
    await AsyncStorage.setItem('offlineQueue', JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to queue offline data:', error);
  }
};

// Sync queued data when online
export const syncOfflineData = async () => {
  try {
    const queue = JSON.parse(await AsyncStorage.getItem('offlineQueue') || '[]');
    if (queue.length === 0) return;

    const API_URL = await AsyncStorage.getItem('API_URL'); // Retrieve locally stored API_URL
    if (!API_URL) throw new Error('API_URL not set');

    for (const data of queue) {
      await axios.post(`${API_URL}/readings`, data); // Send to backend
    }
    await AsyncStorage.removeItem('offlineQueue'); // Clear queue after sync
  } catch (error) {
    console.error('Failed to sync offline data:', error);
  }
};