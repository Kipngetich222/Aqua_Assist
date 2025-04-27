import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { launchImageLibrary } from 'react-native-image-picker';
import { saveWaterParameters } from '../services/waterService';

const DataEntry = () => {
  const [parameters, setParameters] = useState({
    temperature: 25,
    ph: 7.0,
    dissolvedOxygen: 6.0,
    ammonia: 0.0
  });
  const [photo, setPhoto] = useState(null);

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handlePhotoUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      await saveWaterParameters({
        ...parameters,
        photo: photo
      });
      // Show success message or navigate back
    } catch (error) {
      console.error('Error saving parameters:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Entry</Text>
      </View>

      <View style={styles.form}>
        {/* Temperature */}
        <View style={styles.parameterContainer}>
          <Text style={styles.parameterLabel}>Temperature (°C)</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.valueText}>{parameters.temperature.toFixed(1)}°C</Text>
            <Slider
              style={styles.slider}
              minimumValue={15}
              maximumValue={35}
              value={parameters.temperature}
              onValueChange={(value) => handleParameterChange('temperature', value)}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#000000"
            />
          </View>
        </View>

        {/* pH */}
        <View style={styles.parameterContainer}>
          <Text style={styles.parameterLabel}>pH Level</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.valueText}>{parameters.ph.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={9}
              value={parameters.ph}
              onValueChange={(value) => handleParameterChange('ph', value)}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#000000"
            />
          </View>
        </View>

        {/* Dissolved Oxygen */}
        <View style={styles.parameterContainer}>
          <Text style={styles.parameterLabel}>Dissolved Oxygen (mg/L)</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.valueText}>{parameters.dissolvedOxygen.toFixed(1)} mg/L</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              value={parameters.dissolvedOxygen}
              onValueChange={(value) => handleParameterChange('dissolvedOxygen', value)}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#000000"
            />
          </View>
        </View>

        {/* Ammonia */}
        <View style={styles.parameterContainer}>
          <Text style={styles.parameterLabel}>Ammonia (mg/L)</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.valueText}>{parameters.ammonia.toFixed(2)} mg/L</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={2}
              value={parameters.ammonia}
              onValueChange={(value) => handleParameterChange('ammonia', value)}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#000000"
            />
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.photoContainer}>
          <Text style={styles.parameterLabel}>Upload Photo</Text>
          <TouchableOpacity style={styles.photoButton} onPress={handlePhotoUpload}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={32} color="#666" />
                <Text style={styles.photoText}>Tap to upload photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Data</Text>
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
  form: {
    padding: 20,
  },
  parameterContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    width: 80,
    fontSize: 16,
    color: '#666',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  photoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  photoButton: {
    height: 200,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 10,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    marginTop: 10,
    color: '#666',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DataEntry;
