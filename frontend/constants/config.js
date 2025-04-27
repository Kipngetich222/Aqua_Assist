// API Configuration
export const API_URL = 'https://api.aquaassist.com/v1';

// TensorFlow Model Configuration
export const MODEL_CONFIG = {
  inputSize: [224, 224],
  modelPath: 'model/model.json',
  weightsPath: 'model/weights.bin',
};

// Water Parameter Thresholds
export const WATER_PARAMETERS = {
  temperature: {
    min: 20,
    max: 30,
    unit: '°C',
  },
  ph: {
    min: 6.5,
    max: 8.5,
    unit: '',
  },
  dissolvedOxygen: {
    min: 5,
    max: 8,
    unit: 'mg/L',
  },
  ammonia: {
    min: 0,
    max: 0.5,
    unit: 'mg/L',
  },
};

// Disease Detection Configuration
export const DISEASE_CONFIG = {
  confidenceThreshold: 0.7,
  supportedDiseases: [
    'Columnaris',
    'Ichthyophthirius',
    'Fin Rot',
    'Dropsy',
    'Healthy',
  ],
};

// Chatbot Configuration
export const CHATBOT_CONFIG = {
  maxHistoryLength: 50,
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'gu', 'sw'],
};

// SMS Alert Configuration
export const SMS_CONFIG = {
  enabled: true,
  maxAlertsPerDay: 5,
  criticalThreshold: 0.8,
};

// Offline Mode Configuration
export const OFFLINE_CONFIG = {
  maxStorageSize: 50 * 1024 * 1024, // 50MB
  syncInterval: 15 * 60 * 1000, // 15 minutes
};

// Theme Configuration
export const THEME = {
  colors: {
    primary: '#2196F3',
    secondary: '#4CAF50',
    warning: '#FFC107',
    danger: '#F44336',
    success: '#4CAF50',
    background: '#F5F5F5',
    text: '#333333',
    textLight: '#666666',
    border: '#DDDDDD',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 14,
      color: '#666666',
    },
  },
};

// Navigation Configuration
export const NAVIGATION = {
  initialRoute: 'Dashboard',
  routes: [
    {
      name: 'Dashboard',
      icon: 'home',
    },
    {
      name: 'DataEntry',
      icon: 'add-circle',
    },
    {
      name: 'DiseaseScanner',
      icon: 'camera',
    },
    {
      name: 'Chatbot',
      icon: 'chatbubble',
    },
    {
      name: 'Settings',
      icon: 'settings',
    },
  ],
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network connection error. Please check your internet connection.',
  server: 'Server error. Please try again later.',
  offline: 'You are currently offline. Some features may be limited.',
  camera: 'Camera permission denied. Please enable camera access in settings.',
  storage: 'Storage is full. Please clear some space.',
  model: 'Failed to load disease detection model.',
  sync: 'Failed to sync data with server.',
}; 