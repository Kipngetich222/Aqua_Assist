import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

const WATER_PARAMS_KEY = 'waterParameters';

export const saveWaterParameters = async (parameters) => {
  try {
    // Save locally first
    const existingData = await AsyncStorage.getItem(WATER_PARAMS_KEY);
    const waterData = existingData ? JSON.parse(existingData) : [];
    waterData.push({
      ...parameters,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem(WATER_PARAMS_KEY, JSON.stringify(waterData));

    // If online, sync with server
    if (navigator.onLine) {
      await fetch(`${API_URL}/water-parameters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      });
    }

    return true;
  } catch (error) {
    console.error('Error saving water parameters:', error);
    throw error;
  }
};

export const getWaterParameters = async () => {
  try {
    // Try to get from local storage first
    const localData = await AsyncStorage.getItem(WATER_PARAMS_KEY);
    if (localData) {
      const waterData = JSON.parse(localData);
      if (waterData.length > 0) {
        return waterData[waterData.length - 1]; // Return most recent
      }
    }

    // If no local data or online, fetch from server
    if (navigator.onLine) {
      const response = await fetch(`${API_URL}/water-parameters/latest`);
      const data = await response.json();
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error getting water parameters:', error);
    throw error;
  }
};

export const syncWaterParameters = async () => {
  try {
    const localData = await AsyncStorage.getItem(WATER_PARAMS_KEY);
    if (!localData) return;

    const waterData = JSON.parse(localData);
    const unsyncedData = waterData.filter((data) => !data.synced);

    for (const data of unsyncedData) {
      try {
        await fetch(`${API_URL}/water-parameters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        // Mark as synced
        data.synced = true;
      } catch (error) {
        console.error('Error syncing water parameter:', error);
      }
    }

    // Update local storage with synced status
    await AsyncStorage.setItem(WATER_PARAMS_KEY, JSON.stringify(waterData));
  } catch (error) {
    console.error('Error syncing water parameters:', error);
    throw error;
  }
};

export const getWaterParameterHistory = async (days = 7) => {
  try {
    const localData = await AsyncStorage.getItem(WATER_PARAMS_KEY);
    if (!localData) return [];

    const waterData = JSON.parse(localData);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return waterData.filter(
      (data) => new Date(data.timestamp) >= cutoffDate
    );
  } catch (error) {
    console.error('Error getting water parameter history:', error);
    throw error;
  }
};

export const analyzeWaterParameters = (parameters) => {
  const analysis = {
    status: 'normal',
    warnings: [],
  };

  // Temperature analysis
  if (parameters.temperature < 20) {
    analysis.warnings.push('Temperature is too low for optimal fish growth');
    analysis.status = 'warning';
  } else if (parameters.temperature > 30) {
    analysis.warnings.push('Temperature is too high and may stress fish');
    analysis.status = 'warning';
  }

  // pH analysis
  if (parameters.ph < 6.5) {
    analysis.warnings.push('pH is too low and may affect fish health');
    analysis.status = 'warning';
  } else if (parameters.ph > 8.5) {
    analysis.warnings.push('pH is too high and may affect fish health');
    analysis.status = 'warning';
  }

  // Dissolved Oxygen analysis
  if (parameters.dissolvedOxygen < 5) {
    analysis.warnings.push('Dissolved oxygen is too low for fish survival');
    analysis.status = 'critical';
  }

  // Ammonia analysis
  if (parameters.ammonia > 0.5) {
    analysis.warnings.push('Ammonia levels are dangerously high');
    analysis.status = 'critical';
  }

  return analysis;
}; 