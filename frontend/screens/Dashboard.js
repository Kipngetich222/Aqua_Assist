import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getWaterParameters } from '../services/waterService';
import { getAlerts } from '../services/alertService';

const Dashboard = () => {
  const navigation = useNavigation();
  const [waterParams, setWaterParams] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const params = await getWaterParameters();
      const alertData = await getAlerts();
      setWaterParams(params);
      setAlerts(alertData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getStatusColor = (value, type) => {
    // Add logic to determine status color based on parameter type and value
    return '#4CAF50'; // Default to green
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AquaAssist Dashboard</Text>
      </View>

      {/* Water Parameters Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water Parameters</Text>
        <View style={styles.parametersGrid}>
          {waterParams && Object.entries(waterParams).map(([key, value]) => (
            <View key={key} style={styles.parameterCard}>
              <Text style={styles.parameterLabel}>{key}</Text>
              <Text style={[styles.parameterValue, { color: getStatusColor(value, key) }]}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Alerts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts</Text>
        {alerts.map((alert, index) => (
          <View key={index} style={styles.alertCard}>
            <Ionicons name="warning" size={24} color="#FFA500" />
            <Text style={styles.alertText}>{alert.message}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('DataEntry')}
          >
            <Ionicons name="add-circle" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Data Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('DiseaseScanner')}
          >
            <Ionicons name="camera" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Disease Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <Ionicons name="chatbubble" size={32} color="#2196F3" />
            <Text style={styles.actionText}>Chatbot</Text>
          </TouchableOpacity>
        </View>
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
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  parameterCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  parameterLabel: {
    fontSize: 14,
    color: '#666',
  },
  parameterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  alertText: {
    marginLeft: 10,
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    elevation: 2,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});

export default Dashboard;
