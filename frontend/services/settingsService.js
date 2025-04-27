import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

const SETTINGS_KEY = 'userSettings';

export const updateSettings = async (settings) => {
  try {
    // Save locally
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    // If online, sync with server
    if (navigator.onLine) {
      await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    // Try to get from local storage first
    const localSettings = await AsyncStorage.getItem(SETTINGS_KEY);
    if (localSettings) {
      return JSON.parse(localSettings);
    }

    // If no local settings and online, fetch from server
    if (navigator.onLine) {
      const response = await fetch(`${API_URL}/settings`);
      const data = await response.json();
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
      return data;
    }

    // Return default settings if no data available
    return getDefaultSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return getDefaultSettings();
  }
};

const getDefaultSettings = () => ({
  language: 'en',
  smsAlerts: true,
  offlineMode: false,
  theme: 'light',
  notifications: {
    waterParameters: true,
    diseaseAlerts: true,
    maintenanceReminders: true,
  },
  measurementUnits: {
    temperature: 'celsius',
    volume: 'liters',
    weight: 'kilograms',
  },
});

export const syncSettings = async () => {
  try {
    const localSettings = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!localSettings) return;

    const settings = JSON.parse(localSettings);
    if (!settings.synced && navigator.onLine) {
      await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      settings.synced = true;
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  } catch (error) {
    console.error('Error syncing settings:', error);
    throw error;
  }
};

export const resetSettings = async () => {
  try {
    const defaultSettings = getDefaultSettings();
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw error;
  }
};

export const getLanguageStrings = (language) => {
  const translations = {
    en: {
      dashboard: 'Dashboard',
      dataEntry: 'Data Entry',
      diseaseScanner: 'Disease Scanner',
      chatbot: 'Chatbot',
      settings: 'Settings',
      temperature: 'Temperature',
      ph: 'pH',
      dissolvedOxygen: 'Dissolved Oxygen',
      ammonia: 'Ammonia',
      save: 'Save',
      cancel: 'Cancel',
      // Add more translations as needed
    },
    gu: {
      dashboard: 'ડેશબોર્ડ',
      dataEntry: 'ડેટા એન્ટ્રી',
      diseaseScanner: 'રોગ સ્કેનર',
      chatbot: 'ચેટબોટ',
      settings: 'સેટિંગ્સ',
      temperature: 'તાપમાન',
      ph: 'પીએચ',
      dissolvedOxygen: 'ઓક્સિજન',
      ammonia: 'એમોનિયા',
      save: 'સેવ કરો',
      cancel: 'રદ કરો',
      // Add more translations as needed
    },
    sw: {
      dashboard: 'Dashibodi',
      dataEntry: 'Ingizo la Data',
      diseaseScanner: 'Skana ya Magonjwa',
      chatbot: 'Chatbot',
      settings: 'Mipangilio',
      temperature: 'Joto',
      ph: 'pH',
      dissolvedOxygen: 'Oksijeni',
      ammonia: 'Amonia',
      save: 'Hifadhi',
      cancel: 'Ghairi',
      // Add more translations as needed
    },
  };

  return translations[language] || translations.en;
}; 