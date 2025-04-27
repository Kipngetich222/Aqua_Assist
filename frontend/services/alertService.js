import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';
import { getSettings } from './settingsService';

const ALERTS_KEY = 'alerts';

export const getAlerts = async () => {
  try {
    // Get local alerts
    const localAlerts = await AsyncStorage.getItem(ALERTS_KEY);
    const alerts = localAlerts ? JSON.parse(localAlerts) : [];

    // If online, fetch new alerts from server
    if (navigator.onLine) {
      const response = await fetch(`${API_URL}/alerts`);
      const serverAlerts = await response.json();
      
      // Merge and deduplicate alerts
      const mergedAlerts = [...alerts, ...serverAlerts];
      const uniqueAlerts = Array.from(
        new Map(mergedAlerts.map(alert => [alert.id, alert])).values()
      );
      
      await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(uniqueAlerts));
      return uniqueAlerts;
    }

    return alerts;
  } catch (error) {
    console.error('Error getting alerts:', error);
    return [];
  }
};

export const createAlert = async (alert) => {
  try {
    const settings = await getSettings();
    
    // Save alert locally
    const localAlerts = await AsyncStorage.getItem(ALERTS_KEY);
    const alerts = localAlerts ? JSON.parse(localAlerts) : [];
    alerts.push({
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    });
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

    // If online and SMS alerts enabled, send to server
    if (navigator.onLine && settings.smsAlerts) {
      await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });
    }

    return true;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

export const markAlertAsRead = async (alertId) => {
  try {
    const localAlerts = await AsyncStorage.getItem(ALERTS_KEY);
    if (!localAlerts) return;

    const alerts = JSON.parse(localAlerts);
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    );

    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));

    // If online, sync with server
    if (navigator.onLine) {
      await fetch(`${API_URL}/alerts/${alertId}/read`, {
        method: 'PUT',
      });
    }
  } catch (error) {
    console.error('Error marking alert as read:', error);
    throw error;
  }
};

export const deleteAlert = async (alertId) => {
  try {
    const localAlerts = await AsyncStorage.getItem(ALERTS_KEY);
    if (!localAlerts) return;

    const alerts = JSON.parse(localAlerts);
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);

    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));

    // If online, sync with server
    if (navigator.onLine) {
      await fetch(`${API_URL}/alerts/${alertId}`, {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw error;
  }
};

export const clearAllAlerts = async () => {
  try {
    await AsyncStorage.removeItem(ALERTS_KEY);

    // If online, sync with server
    if (navigator.onLine) {
      await fetch(`${API_URL}/alerts`, {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.error('Error clearing alerts:', error);
    throw error;
  }
};

export const getUnreadAlertCount = async () => {
  try {
    const localAlerts = await AsyncStorage.getItem(ALERTS_KEY);
    if (!localAlerts) return 0;

    const alerts = JSON.parse(localAlerts);
    return alerts.filter(alert => !alert.read).length;
  } catch (error) {
    console.error('Error getting unread alert count:', error);
    return 0;
  }
};

export const createWaterParameterAlert = async (parameters) => {
  const alerts = [];

  // Temperature alerts
  if (parameters.temperature < 20) {
    alerts.push({
      type: 'temperature',
      severity: 'warning',
      message: 'Temperature is too low for optimal fish growth',
    });
  } else if (parameters.temperature > 30) {
    alerts.push({
      type: 'temperature',
      severity: 'warning',
      message: 'Temperature is too high and may stress fish',
    });
  }

  // pH alerts
  if (parameters.ph < 6.5) {
    alerts.push({
      type: 'ph',
      severity: 'warning',
      message: 'pH is too low and may affect fish health',
    });
  } else if (parameters.ph > 8.5) {
    alerts.push({
      type: 'ph',
      severity: 'warning',
      message: 'pH is too high and may affect fish health',
    });
  }

  // Dissolved Oxygen alerts
  if (parameters.dissolvedOxygen < 5) {
    alerts.push({
      type: 'oxygen',
      severity: 'critical',
      message: 'Dissolved oxygen is too low for fish survival',
    });
  }

  // Ammonia alerts
  if (parameters.ammonia > 0.5) {
    alerts.push({
      type: 'ammonia',
      severity: 'critical',
      message: 'Ammonia levels are dangerously high',
    });
  }

  // Create alerts
  for (const alert of alerts) {
    await createAlert(alert);
  }

  return alerts;
}; 