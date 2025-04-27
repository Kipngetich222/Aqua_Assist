import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { API_URL } from '../constants/config';

let model = null;

const loadModel = async () => {
  if (model) return model;

  try {
    // Load the model
    model = await tf.loadLayersModel(
      bundleResourceIO('model/model.json', 'model/weights.bin')
    );
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
};

const preprocessImage = async (imageUri) => {
  try {
    // Load and decode the image
    const response = await fetch(imageUri, {}, { isBinary: true });
    const imageData = await response.arrayBuffer();
    const imageTensor = decodeJpeg(new Uint8Array(imageData));

    // Resize the image to match model input
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);

    // Normalize the image
    const normalizedImage = resizedImage.div(255.0);

    // Add batch dimension
    const batchedImage = normalizedImage.expandDims(0);

    return batchedImage;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
};

export const analyzeDisease = async (imageUri) => {
  try {
    // Load model if not loaded
    if (!model) {
      await loadModel();
    }

    // Preprocess the image
    const processedImage = await preprocessImage(imageUri);

    // Make prediction
    const prediction = await model.predict(processedImage).data();

    // Get the class with highest probability
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    const confidence = prediction[maxIndex] * 100;

    // Map index to disease name and get recommendation
    const { disease, recommendation } = getDiseaseInfo(maxIndex);

    return {
      disease,
      confidence: Math.round(confidence),
      recommendation,
    };
  } catch (error) {
    console.error('Error analyzing disease:', error);
    throw error;
  }
};

const getDiseaseInfo = (index) => {
  const diseases = {
    0: {
      name: 'Columnaris',
      recommendation:
        'Treat with antibiotics and improve water quality. Increase aeration and reduce stress.',
    },
    1: {
      name: 'Ichthyophthirius (Ich)',
      recommendation:
        'Increase water temperature gradually and treat with appropriate medication.',
    },
    2: {
      name: 'Fin Rot',
      recommendation:
        'Improve water quality and treat with antibacterial medication.',
    },
    3: {
      name: 'Dropsy',
      recommendation:
        'Isolate affected fish and treat with appropriate medication. Improve water quality.',
    },
    4: {
      name: 'Healthy',
      recommendation: 'Continue regular maintenance and monitoring.',
    },
  };

  return diseases[index] || {
    name: 'Unknown',
    recommendation: 'Please consult a fish health expert.',
  };
};

export const getDiseaseHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/disease-history`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting disease history:', error);
    throw error;
  }
};

export const saveDiseaseAnalysis = async (analysis) => {
  try {
    const response = await fetch(`${API_URL}/disease-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving disease analysis:', error);
    throw error;
  }
}; 