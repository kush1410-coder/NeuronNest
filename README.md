# SahAI - NeuroNest Kids 🚀
### Advanced Early Childhood Cognitive Development & AI Learning Hub (Ages 3-7)

SahAI (NeuroNest Kids) is a next-generation interactive learning portal designed to boost early childhood cognitive abilities, emotional regulation, and phonemic awareness. By bridging digital gamification with physical active play and client-side computer vision, SahAI delivers a premium learning universe.

---

## 🌟 Key Features

1. **Magic Story Kingdom** 📖
   - Generates customized educational stories using the Gemini API based on a child's age, chosen topic, and current emotion.
   - Includes real-time Text-to-Speech (TTS) reading with voice adjustments (pitch/rate) and offline companion fallbacks if API keys are rate-limited.
2. **AI Speak & Spell (Speech Quest)** 🎙️
   - Gamified pronunciation trainer using edge HTML5 `SpeechRecognition`.
   - Robo-Owl 🦉 guide reads prompts aloud, validates spoken inputs, and handles sentences containing the child's dynamic profile name and pronouns in real-time.
3. **AI Treasure Hunter (Camera Quest)** 🔍
   - Active webcam-driven color finder. Kids search their physical rooms for items of a requested color (Red, Green, Blue, Yellow).
   - Local HSL color extraction computer vision engine evaluates captured video frames instantly, requiring zero API calls.
4. **Emotion Center** 😊
   - Local micro-expression scanning via `face-api.js` TinyFaceDetector alongside manual mood logging.
   - Automatically recommends learning quests and updates Cognitive Diagnostics (Focus, Creativity, Curiosity quotients) and weekly progress charts.
5. **Brain Games & Rewards** 🧠🏆
   - Includes Math Wizard, Memory Match, Emoji Hunt, Focus Finder, Planet Lander, and Pattern Master.
   - Earned Coins can be traded to unlock legendary badges and prizes.
6. **Parent Control Center** 👨‍👩‍👧
   - Separate access panel to register child profiles (safeguarding sibling data under a single parent account) and review real-time mood logs, cognitive assessments, and activity statistics.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion, HTML5 Web Speech API, `face-api.js` (Webcam Vision).
- **Backend**: Node.js, Express, MongoDB (Mongoose), `@google/generative-ai` (Gemini SDK).

---

## ⚙️ Project Setup

### 1. Prerequisite
Ensure you have **Node.js** and **MongoDB** installed and running on your local machine.

---

### 2. Backend Setup
Navigate into the `backend` folder:
```bash
cd backend
```

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a file named `.env` in the `backend` directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sahai
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```
   The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup
Navigate into the `frontend` folder:
```bash
cd ../frontend
```

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Vite dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📡 Edge AI & Compatibility Notes
- **Webcam**: Ensure you grant webcam permissions for the **Emotion Center** and **Treasure Hunter** camera quests.
- **Microphone**: Ensure you grant microphone permissions for **Speech Quest** vocal tasks.
- **Web Speech API**: Standard in modern browsers (Chrome, Edge, Safari). No cloud usage is billed, and it runs locally.
