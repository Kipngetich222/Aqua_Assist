import * as tf from "@tensorflow/tfjs";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const loadModel = async () => {
  await tf.ready();
  try {
    // For TFLite models, consider using @tensorflow/tfjs-tflite
    // For now, we'll assume you've converted to TFJS format
    const model = await tf.loadLayersModel(
      bundleResourceIO(
        require("../assets/model/model.json"),
        require("../assets/model/weights.bin")
      )
    );
    return model;
  } catch (error) {
    console.error("Failed to load model", error);
    throw error;
  }
};

export const predictDisease = async (model, imageUri) => {
  try {
    const imageTensor = await processImage(imageUri);
    const prediction = model.predict(imageTensor);
    const results = await prediction.data();

    // Get the index of the highest probability
    const topResultIndex = results.indexOf(Math.max(...results));

    // Assuming you have labels array imported
    const labels = [
      "Aeromoniasis",
      "Bacterial Gill",
      "Red Disease",
      "Saprolegniasis",
      "Healthy",
    ];
    return labels[topResultIndex] || "Unknown";
  } catch (error) {
    console.error("Prediction failed", error);
    return "Error in prediction";
  }
};

const processImage = async (uri) => {
  try {
    // First, fix orientation and resize
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224, height: 224 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Read as base64
    const imgB64 = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return tf.tidy(() => {
      // Convert to tensor
      const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
      const tensor = tf.node.decodeImage(new Uint8Array(imgBuffer), 3);

      // Normalize to [0,1] and expand dimensions
      return tensor.div(255).expandDims(0);
    });
  } catch (error) {
    console.error("Image processing failed", error);
    throw error;
  }
};
