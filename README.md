# 📸 AI Image Captioner

**Platform-Based Development (BAXU 3153) - Final Project**
**Universiti Teknikal Malaysia Melaka (UTeM)**

An intelligent, mobile-first React Native application designed to solve "writer's block" for content creators and social media users. The app leverages the Google Gemini generative AI model to instantly analyze uploaded photos and generate engaging, context-aware social media captions tailored to specific emotional tones.

---

## ✨ Key Features

* **Intelligent Generation:** Upload photos via the native device gallery and receive 3 unique caption options based on user-provided context.
* **Tone Selection:** Interactive chips allow users to steer the AI's writing style (Engaging, Funny, Aesthetic, or Professional).
* **Local Authentication:** A secure, offline user management system built with `AsyncStorage` and React's `Context API`. Supports registration, login, and password resets.
* **Persistent History:** Automatically saves all generated captions locally. The "History" tab uses a high-performance `FlatList` to render a persistent ledger of past posts.
* **Native Interactions:** * Seamlessly copy text via `expo-clipboard`.
  * Share directly to social media (WhatsApp, Instagram) using the native OS `Share` API.
  * Tactile UI feedback using `expo-haptics` for physical device vibrations.
* **Resilient Error Handling:** Gracefully catches API rate limits and server "high demand" errors, displaying native `Alert.alert()` dialogues instead of crashing.
* **Dark Mode UI:** A clean, modern interface utilizing high-contrast deep grays (`#121212`) and Electric Sky Blue (`#0EA5E9`) accents.

---

## 🛠️ Tech Stack & Architecture

* **Framework:** React Native / Expo
* **Navigation:** `@react-navigation/native` (Bottom Tabs & Native Stack)
* **Global State:** React Context API (`AuthContext`)
* **Local Storage:** `@react-native-async-storage/async-storage`
* **External API:** Google Gemini API (`gemini-3.5-flash`) via native `fetch`
* **Media:** `expo-image-picker` (with built-in base64 compression)

---

## 🚀 Installation & Setup

To run this project locally on your machine or emulator:

**1. Clone the repository:**
```bash
git clone [https://github.com/SujayDyksrra/ImageCaptionApp.git](https://github.com/SujayDyksrra/ImageCaptionApp.git)
cd ImageCaptionApp
```

**2. Install dependencies:**

```bash
npm install
```

**3. Configure the API Key:**

Note: For security, the Google Gemini API key has been removed from the public repository.

Open screens/GeneratorScreen.js.

Locate the API_KEY variable at the top of the file and insert your valid Gemini key:

JavaScript
const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
4. Start the application:

```bash
npx expo start
```
