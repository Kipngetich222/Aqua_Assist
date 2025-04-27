import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSettings } from '../services/settingsService';

const Settings = () => {
  const [settings, setSettings] = useState({
    language: 'en',
    smsAlerts: true,
    offlineMode: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'sw', name: 'Swahili' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Language Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                settings.language === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => handleSettingChange('language', lang.code)}>
              <Text
                style={[
                  styles.languageText,
                  settings.language === lang.code && styles.languageTextActive,
                ]}>
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SMS Alerts */}
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>SMS Alerts</Text>
            <Text style={styles.settingDescription}>
              Receive alerts via SMS for critical water parameters
            </Text>
          </View>
          <Switch
            value={settings.smsAlerts}
            onValueChange={(value) => handleSettingChange('smsAlerts', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.smsAlerts ? '#2196F3' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Offline Mode */}
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Offline Mode</Text>
            <Text style={styles.settingDescription}>
              Store data locally when internet is unavailable
            </Text>
          </View>
          <Switch
            value={settings.offlineMode}
            onValueChange={(value) => handleSettingChange('offlineMode', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={settings.offlineMode ? '#2196F3' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dataButton}
          onPress={() => {
            Alert.alert(
              'Clear Data',
              'Are you sure you want to clear all local data?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await AsyncStorage.clear();
                      Alert.alert('Success', 'All local data has been cleared.');
                    } catch (error) {
                      console.error('Error clearing data:', error);
                      Alert.alert('Error', 'Failed to clear data. Please try again.');
                    }
                  },
                },
              ]
            );
          }}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          <Text style={styles.dataButtonText}>Clear Local Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#2196F3',
  },
  languageText: {
    color: '#666',
  },
  languageTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
  },
  dataButtonText: {
    marginLeft: 10,
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default Settings; 