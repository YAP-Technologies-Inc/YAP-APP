# YAP

YAP: the Talk‑to‑Earn language learning app featuring a React Native/Expo mobile frontend and a Node.js/Express/PostgreSQL backend. It supports secure authentication, user profiles, interactive Spanish lessons, and pronunciation assessment using Azure's Speech API.

## Features
- User authentication (signup, login) with bcrypt password hashing
- Profile management and progress tracking
- Interactive Spanish lessons with vocabulary cards
- Pronunciation practice with Azure Pronunciation Assessment API
- Audio recording and playback (mobile only)
- Modern, user-friendly UI

## Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn]
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```sh
  npm install -g expo-cli
  ```
- [PostgreSQL](https://www.postgresql.org/)
- Azure Speech resource (for pronunciation assessment)

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/YAP-Technologies-Inc/YAPWhole.git
cd YAPWhole
```

### 2. Install Dependencies
#### Backend
```sh
cd YAP-backend-master
npm install
```
#### Frontend (Mobile App)
```sh
cd ../YAPMobileApp
npm install
```

### 3. Configure Environment Variables
- Backend: Create a `.env` file in `YAP-backend-master` with your database and secret keys.
- Frontend: Set your Azure Speech API key and region in `LessonScreen.tsx` (for development; use secure storage for production).

### 4. Run the Backend
```sh
cd YAP-backend-master
npm start
```

### 5. Run the Mobile App
```sh
cd ../YAPMobileApp
npx expo start
```
- Scan the QR code with Expo Go (iOS/Android) or run on a simulator/emulator.
- **Note:** Audio features only work on real devices or emulators, not in the browser.

## Usage
- Sign up or log in to your account.
- Navigate through lessons, practice vocabulary, and record your pronunciation.
- View feedback and suggestions powered by Azure.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License
[MIT](LICENSE)
