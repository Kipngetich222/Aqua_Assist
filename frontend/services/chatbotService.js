import { API_URL } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_HISTORY_KEY = 'chatHistory';

export const sendMessage = async (message) => {
  try {
    // Save message to local history
    const history = await getChatHistory();
    history.push({
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));

    // If offline, return cached response
    if (!navigator.onLine) {
      return getCachedResponse(message);
    }

    // Send to Dialogflow
    const response = await fetch(`${API_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Save response to history
    history.push({
      text: data.response,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));

    return data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

const getCachedResponse = (message) => {
  // Simple keyword-based responses for offline mode
  const keywords = {
    temperature: 'The ideal water temperature for most fish is between 24-28°C.',
    ph: 'The optimal pH range for most fish is between 6.5-7.5.',
    ammonia: 'Ammonia levels should be kept below 0.25 mg/L for fish health.',
    oxygen: 'Dissolved oxygen should be maintained above 5 mg/L for fish survival.',
    disease: 'Common fish diseases include Ich, Fin Rot, and Columnaris. Regular monitoring is important.',
    feeding: 'Feed your fish 2-3 times daily with appropriate amounts they can consume in 2-3 minutes.',
    water: 'Regular water changes of 20-30% weekly help maintain water quality.',
    filter: 'Clean your filter monthly and replace media as needed.',
    stress: 'Reduce stress by maintaining stable water parameters and providing hiding places.',
  };

  const messageLower = message.toLowerCase();
  for (const [key, response] of Object.entries(keywords)) {
    if (messageLower.includes(key)) {
      return response;
    }
  }

  return "I'm sorry, I can't process your request while offline. Please try again when you're connected to the internet.";
};

export const clearChatHistory = async () => {
  try {
    await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

export const getFrequentlyAskedQuestions = () => {
  return [
    {
      question: 'What is the ideal water temperature for fish?',
      answer: 'The ideal water temperature for most fish is between 24-28°C.',
    },
    {
      question: 'How often should I change the water?',
      answer: 'Regular water changes of 20-30% weekly help maintain water quality.',
    },
    {
      question: 'What are common fish diseases?',
      answer: 'Common fish diseases include Ich, Fin Rot, and Columnaris. Regular monitoring is important.',
    },
    {
      question: 'How much should I feed my fish?',
      answer: 'Feed your fish 2-3 times daily with appropriate amounts they can consume in 2-3 minutes.',
    },
    {
      question: 'What is the optimal pH range?',
      answer: 'The optimal pH range for most fish is between 6.5-7.5.',
    },
  ];
}; 