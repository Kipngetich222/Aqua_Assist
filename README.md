# AquaAssist

AquaAssist is a comprehensive mobile application designed to help fish farmers monitor and manage their aquaculture operations. The app provides tools for water parameter monitoring, disease detection, and expert guidance through an AI-powered chatbot.

## Features

### Core Features
- Manual data entry for water parameters (temperature, pH, dissolved oxygen, ammonia)
- Image-based disease recognition using TensorFlow Lite
- Predictive analytics for disease outbreaks and harvest time
- GPT-3.5 powered chatbot for FAQs and troubleshooting
- SMS/low-tech alerts for critical conditions
- Offline mode with local storage
- Multilingual support (English, Gujarati, Swahili)

### Key Screens
1. **Dashboard**
   - Summary of water parameters
   - Alerts and warnings
   - Quick actions for data entry and disease scanning

2. **Data Entry**
   - Form for water parameter input
   - Photo upload for visual documentation
   - Historical data visualization

3. **Disease Scanner**
   - Camera interface for fish disease detection
   - Gallery upload option
   - Detailed analysis and recommendations

4. **Chatbot**
   - Text and voice input
   - Expert guidance and troubleshooting
   - Offline response capability

5. **Settings**
   - Language selection
   - SMS alert configuration
   - Offline mode settings

## Tech Stack

### Frontend
- React Native (Expo)
- TensorFlow Lite for disease detection
- React Navigation for routing
- AsyncStorage for local data persistence

### Backend
- Node.js + Express.js
- MongoDB Atlas for data storage
- Twilio for SMS alerts
- Dialogflow for chatbot integration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for emulators)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aquaassist.git
cd aquaassist
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
```bash
# For iOS
npm run ios
# For Android
npm run android
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:
```
API_URL=your_api_url
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- TensorFlow.js team for the disease detection model
- Expo team for the React Native framework
- Dialogflow team for the chatbot integration
- Twilio team for the SMS functionality

## Support

For support, email support@aquaassist.com or join our Slack channel.
