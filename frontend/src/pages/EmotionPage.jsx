import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

export default function EmotionPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState("happy");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [detectedEmotionMsg, setDetectedEmotionMsg] = useState(null);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const moods = [
    {
      emoji: "😀",
      value: "happy",
      color: "bg-yellow-100 border-yellow-300 text-yellow-700",
      accent: "bg-yellow-400",
    },
    {
      emoji: "😌",
      value: "calm",
      color: "bg-blue-100 border-blue-300 text-blue-700",
      accent: "bg-blue-400",
    },
    {
      emoji: "🤩",
      value: "excited",
      color: "bg-pink-100 border-pink-300 text-pink-700",
      accent: "bg-pink-500",
    },
    {
      emoji: "🤔",
      value: "curious",
      color: "bg-purple-100 border-purple-300 text-purple-700",
      accent: "bg-purple-500",
    },
    {
      emoji: "😢",
      value: "sad",
      color: "bg-indigo-100 border-indigo-300 text-indigo-700",
      accent: "bg-indigo-500",
    },
    {
      emoji: "😡",
      value: "angry",
      color: "bg-red-100 border-red-300 text-red-700",
      accent: "bg-red-500",
    },
    {
      emoji: "🤪",
      value: "silly",
      color: "bg-orange-100 border-orange-300 text-orange-700",
      accent: "bg-orange-400",
    },
    {
      emoji: "🥱",
      value: "bored",
      color: "bg-teal-100 border-teal-300 text-teal-700",
      accent: "bg-teal-400",
    },
    {
      emoji: "😴",
      value: "sleepy",
      color: "bg-slate-100 border-slate-300 text-slate-700",
      accent: "bg-slate-400",
    },
    {
      emoji: "😮",
      value: "surprised",
      color: "bg-cyan-100 border-cyan-300 text-cyan-700",
      accent: "bg-cyan-400",
    },
    {
      emoji: "🦁",
      value: "proud",
      color: "bg-amber-100 border-amber-300 text-amber-700",
      accent: "bg-amber-500",
    },
  ];

  // Extra details, analytical metrics, and quests for a complex "heavy" page look
  const suggestionsMap = {
    happy: {
      text: "🌈 Fantastic energy! You're ready to shine and conquer the world. Try Math Wizard today to earn bonus stars!",
      game: { name: "➕ Math Wizard", route: "/math-wizard", reward: "+50 XP", level: "Lvl 3" },
      story: { name: "🚀 Space Explorers Journey", route: "/story", readTime: "5 min read", tag: "Sci-Fi", topic: "space exploration" },
      activity: "💃 Do a 5-second happy victory dance in your room!",
      focus: 85,
      creativity: 98,
      curiosity: 90,
      brainSector: "Prefrontal Cortex (High Focus)",
      brainHemisphere: "Left Brain Logic Active"
    },
    calm: {
      text: "🍃 Peaceful and ready. A relaxing, beautiful story is perfect to match your calm state.",
      game: { name: "🧠 Memory Match", route: "/memory-match", reward: "+30 XP", level: "Lvl 1" },
      story: { name: "🌳 The Sleeping Forest", route: "/story", readTime: "7 min read", tag: "Nature", topic: "sleeping forest" },
      activity: "🧘 Take 3 slow, deep breaths. Breathe in magic, breathe out smiles.",
      focus: 98,
      creativity: 80,
      curiosity: 85,
      brainSector: "Occipital Lobe (Visualizing)",
      brainHemisphere: "Bilateral Harmony"
    },
    excited: {
      text: "🚀 Super excited! Unleash your high energy, quick reflexes, and speed in the fast-paced Emoji Hunt game!",
      game: { name: "😀 Emoji Hunt", route: "/emoji-match", reward: "+40 XP", level: "Lvl 2" },
      story: { name: "☄️ Rocket Adventure Quest", route: "/story", readTime: "4 min read", tag: "Adventure", topic: "rocket adventure" },
      activity: "🎨 Draw a fast rocket ship on a piece of paper!",
      focus: 60,
      creativity: 98,
      curiosity: 92,
      brainSector: "Motor Cortex (Active Reflex)",
      brainHemisphere: "Right Brain Arts Dominant"
    },
    curious: {
      text: "🧪 Brilliant! A curious mind loves learning and discovery. Go explore Animal Quiz for exciting world trivia!",
      game: { name: "🐘 Animal Quiz", route: "/animal-quiz", reward: "+45 XP", level: "Lvl 3" },
      story: { name: "🗺️ Mysteries of the Jungle", route: "/story", readTime: "6 min read", tag: "Discovery", topic: "jungle mysteries" },
      activity: "🌌 Look up at the ceiling and guess why stars twinkle!",
      focus: 90,
      creativity: 90,
      curiosity: 99,
      brainSector: "Temporal Lobe (Memory Retrieval)",
      brainHemisphere: "Left Brain Analytical"
    },
    sad: {
      text: "🧸 A big warm hug for you! Let's read a cheering story or play a memory match game to bring that beautiful smile back!",
      game: { name: "🧠 Memory Match", route: "/memory-match", reward: "+35 XP", level: "Lvl 1" },
      story: { name: "🐶 The Puppy's Sunny Day", route: "/story", readTime: "5 min read", tag: "Feel-Good", topic: "a puppy's happy sunny day" },
      activity: "❤️ Tell a family member or a friend that you love them today.",
      focus: 55,
      creativity: 85,
      curiosity: 60,
      brainSector: "Amygdala (Emotional Care Needed)",
      brainHemisphere: "Right Brain Sensitivities"
    },
    angry: {
      text: "🧘 Take a deep breath, buddy. Try a calming, slow-paced story to feel completely peaceful and relaxed.",
      game: { name: "🧠 Memory Match", route: "/memory-match", reward: "+30 XP", level: "Lvl 1" },
      story: { name: "⛵ The Soft Sailing Boat", route: "/story", readTime: "8 min read", tag: "Calming", topic: "a soft sailing boat on calm seas" },
      activity: "🌀 Trace slow circles on your palm to let the anger sail away.",
      focus: 45,
      creativity: 70,
      curiosity: 50,
      brainSector: "Hippocampus (Regulation)",
      brainHemisphere: "Self-Regulation Protocol"
    },
    silly: {
      text: "🤪 You're in a playful and goofy mood! Unleash the silliness with a funny story or emoji search!",
      game: { name: "😀 Emoji Hunt", route: "/emoji-match", reward: "+40 XP", level: "Lvl 2" },
      story: { name: "🍬 The Day It Rained Jellybeans", route: "/story", readTime: "6 min read", tag: "Fantasy", topic: "the day it rained jellybeans" },
      activity: "😜 Make the silliest face you can in the mirror!",
      focus: 50,
      creativity: 99,
      curiosity: 95,
      brainSector: "Frontal Cortex (Playful Impulse)",
      brainHemisphere: "Right Brain Dominant"
    },
    bored: {
      text: "🥱 Boredom is just an adventure waiting to happen! Fire up a quiz or check out a magical story to spark excitement.",
      game: { name: "🐘 Animal Quiz", route: "/animal-quiz", reward: "+45 XP", level: "Lvl 2" },
      story: { name: "🏰 Escape from Boredom Island", route: "/story", readTime: "5 min read", tag: "Adventure", topic: "escape from boredom island" },
      activity: "🧱 Build a magnificent pillow fort or a block tower!",
      focus: 65,
      creativity: 88,
      curiosity: 80,
      brainSector: "Parietal Lobe (Visual Space)",
      brainHemisphere: "Balanced Logic"
    },
    sleepy: {
      text: "😴 Feeling a little drowsy? Cozy up and read a calming bedtime story to drift into dreamland.",
      game: { name: "🧠 Memory Match", route: "/memory-match", reward: "+25 XP", level: "Lvl 1" },
      story: { name: "🌟 Goodnight Little Star", route: "/story", readTime: "7 min read", tag: "Bedtime", topic: "goodnight little star" },
      activity: "🌯 Wrap yourself tightly inside a blanket like a warm burrito!",
      focus: 35,
      creativity: 75,
      curiosity: 55,
      brainSector: "Pineal Gland (Melatonin active)",
      brainHemisphere: "Slow-wave Harmony"
    },
    surprised: {
      text: "😮 Whoa! Something cool just surprised you! Channel that awe into a magical Math Wizard session.",
      game: { name: "➕ Math Wizard", route: "/math-wizard", reward: "+50 XP", level: "Lvl 3" },
      story: { name: "🪄 The Secret Magic Portal", route: "/story", readTime: "6 min read", tag: "Magic", topic: "a secret magic portal" },
      activity: "🔮 Guess a secret number between 1 and 10 in your head!",
      focus: 80,
      creativity: 92,
      curiosity: 96,
      brainSector: "Visual Cortex (Sensory Arousal)",
      brainHemisphere: "High Neuroplasticity"
    },
    proud: {
      text: "🦁 Super proud! You've accomplished something awesome. Keep the winning streak going in Math Wizard!",
      game: { name: "➕ Math Wizard", route: "/math-wizard", reward: "+55 XP", level: "Lvl 3" },
      story: { name: "👑 The Brave Little Lion", route: "/story", readTime: "6 min read", tag: "Inspirational", topic: "a brave little lion" },
      activity: "📝 Write down or say one super awesome thing you did today!",
      focus: 94,
      creativity: 95,
      curiosity: 90,
      brainSector: "Reward Center (Dopamine high)",
      brainHemisphere: "Optimized Integration"
    }
  };

  // Helper to map emotion string to emoji and color
  const getMoodConfig = (val) => {
    return moods.find(m => m.value === val) || { emoji: "😀", accent: "bg-yellow-400" };
  };

  const getDynamicLogs = () => {
    if (moodHistory.length === 0) {
      return [
        { day: "Mon", emoji: "😌", name: "Calm", height: "h-24", color: "bg-blue-400" },
        { day: "Tue", emoji: "😀", name: "Happy", height: "h-32", color: "bg-yellow-400" },
        { day: "Wed", emoji: "🤔", name: "Curious", height: "h-28", color: "bg-purple-400" },
        { day: "Thu", emoji: "🤩", name: "Excited", height: "h-40", color: "bg-pink-500" },
        { day: "Today", emoji: getMoodConfig(selectedMood).emoji, name: selectedMood, height: "h-36", color: getMoodConfig(selectedMood).accent }
      ];
    }

    const records = [...moodHistory].slice(0, 5).reverse();
    return records.map((record, index) => {
      const date = new Date(record.createdAt);
      const dayName = index === records.length - 1 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });
      const conf = getMoodConfig(record.emotion);
      const heights = ["h-20", "h-28", "h-32", "h-36", "h-40"];
      return {
        day: dayName,
        emoji: conf.emoji,
        name: record.emotion,
        height: heights[index % heights.length],
        color: conf.accent
      };
    });
  };

  const pastMoodLogs = getDynamicLogs();

  const fetchHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const child = JSON.parse(localStorage.getItem("activeChild") || "{}");
      const targetId = child._id || user.id || user._id || "default_guest";
      
      // Load local history first for immediate responsiveness
      const localLogs = JSON.parse(localStorage.getItem(`mood_history_${targetId}`) || "[]");
      if (localLogs.length > 0) {
        setMoodHistory(localLogs);
        setSelectedMood(localLogs[0].emotion);
      }

      if (targetId && targetId !== "default_guest") {
        const res = await API.get(`/emotion/history/${targetId}`);
        if (res.data && res.data.length > 0) {
          setMoodHistory(res.data);
          setSelectedMood(res.data[0].emotion);
          // Sync to localStorage
          localStorage.setItem(`mood_history_${targetId}`, JSON.stringify(res.data));
        }
      }
    } catch (e) {
      console.warn("Failed to fetch mood history:", e);
    }
  };

  const saveMoodLog = async (emotionVal) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const child = JSON.parse(localStorage.getItem("activeChild") || "{}");
    const targetId = child._id || user.id || user._id || "default_guest";
    
    // Construct local mock log entry
    const newLog = {
      _id: `local_${Date.now()}`,
      userId: targetId,
      emotion: emotionVal,
      createdAt: new Date().toISOString()
    };
    
    // Save locally first
    const localLogs = JSON.parse(localStorage.getItem(`mood_history_${targetId}`) || "[]");
    const updatedLogs = [newLog, ...localLogs].slice(0, 20);
    localStorage.setItem(`mood_history_${targetId}`, JSON.stringify(updatedLogs));
    setMoodHistory(updatedLogs);
    setSelectedMood(emotionVal);

    // Try posting to DB asynchronously
    try {
      if (targetId && targetId !== "default_guest") {
        await API.post("/emotion/save", {
          userId: targetId,
          emotion: emotionVal,
        });
      }
    } catch (err) {
      console.warn("Failed to save mood log to backend database:", err);
    }
  };

  // Reset challenge box when selectedMood changes
  useEffect(() => {
    setChallengeChecked(false);
  }, [selectedMood]);

  // Clean up camera stream on unmount & fetch history on mount
  useEffect(() => {
    fetchHistory();
    return () => {
      stopCamera();
    };
  }, []);

  const loadModels = async () => {
    try {
      if (window.faceapi && !modelsLoaded) {
        setDetectedEmotionMsg("Loading local AI models... 🦉");
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      }
    } catch (e) {
      console.error("Failed to load local face-api models:", e);
      setCameraError("Failed to load face detection models. Please check your internet connection.");
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setDetectedEmotionMsg(null);
      
      // Load local AI models
      await loadModels();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      
      streamRef.current = stream;
      setIsCameraActive(true);

      // Give a tiny timeout for the video DOM element to mount and be captured by ref
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => {
            console.error("Video autoPlay failed:", e);
          });
        }
      }, 80);

    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied! Please verify your browser camera permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || isScanning) return;
    setIsScanning(true);
    setDetectedEmotionMsg("AI is analyzing your expression... 🦉");

    try {
      if (!window.faceapi) {
        setDetectedEmotionMsg("Local AI Face-API is not ready yet! Try again.");
        setIsScanning(false);
        return;
      }

      await loadModels();

      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      
      // Mirror the captured image horizontally to match preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // Reset translation
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const base64Data = canvas.toDataURL("image/jpeg");
      setCapturedImage(base64Data);

      // Detect face & emotions locally using face-api.js TinyFaceDetector
      const detections = await window.faceapi.detectSingleFace(
        videoRef.current,
        new window.faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();

      if (detections && detections.expressions) {
        const expressions = detections.expressions;
        let maxEmotion = "neutral";
        let maxVal = 0;

        Object.keys(expressions).forEach((emotion) => {
          if (expressions[emotion] > maxVal) {
            maxVal = expressions[emotion];
            maxEmotion = emotion;
          }
        });

        // Map local face-api expressions to our custom dashboard emotions:
        // face-api returns: neutral, happy, sad, angry, fearful, disgusted, surprised
        let mappedEmotion = "calm";
        if (maxEmotion === "happy") mappedEmotion = "happy";
        else if (maxEmotion === "sad") mappedEmotion = "sad";
        else if (maxEmotion === "angry") mappedEmotion = "angry";
        else if (maxEmotion === "surprised") mappedEmotion = "surprised";
        else if (maxEmotion === "fearful") mappedEmotion = "excited";
        else if (maxEmotion === "disgusted") mappedEmotion = "angry";
        else if (maxEmotion === "neutral") mappedEmotion = "calm";

        setSelectedMood(mappedEmotion);
        setDetectedEmotionMsg(`Detected: ${mappedEmotion.toUpperCase()}! ✨`);

        // Save mood history locally and sync with backend
        saveMoodLog(mappedEmotion);
      } else {
        setDetectedEmotionMsg("⚠️ Face not detected! Make sure your face is clearly inside the camera frame and well-lit.");
      }
    } catch (err) {
      console.error("Local face detection failed:", err);
      setDetectedEmotionMsg("Local AI scanning error. Try again!");
    } finally {
      setIsScanning(false);
    }
  };

  const activeSuggestion = suggestionsMap[selectedMood] || suggestionsMap.happy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-6 md:p-10 relative overflow-hidden">
      
      {/* Styles for futuristic neon scan line */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .scan-laser {
          animation: scan 2.5s linear infinite;
        }
      `}</style>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 5,
            }}
          >
            {["✨", "🌸", "🎨", "🌟"][i % 4]}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Back to Dashboard Button */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-white/80 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
          >
            ⬅️ Back to Dashboard
          </button>
        </div>

        {/* Page Title */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm inline-block">
            😊 AI Emotion Hunter
          </h1>
          <p className="text-xl text-purple-950 font-bold mt-2 animate-pulse">
            Webcam Face Analysis & Real-time Brain Diagnostics Dashboard 🚀
          </p>
        </motion.div>

        {/* TOP ROW: Manual Selector & AI Camera Hunt (Side-by-Side) */}
        <div className="grid md:grid-cols-12 gap-8 items-stretch">
          
          {/* Manual Mood Selection Grid (7 cols) */}
          <div className="md:col-span-7 bg-white/40 backdrop-blur-xl border border-white/30 rounded-[35px] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black text-purple-900 mb-4 flex items-center gap-2">
                👇 Select Your Current Mood
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      setDetectedEmotionMsg(null);
                      saveMoodLog(mood.value);
                    }}
                    className={`
                      p-3
                      rounded-2xl
                      border-2
                      flex
                      flex-col
                      items-center
                      transition-all
                      duration-300
                      ${
                        selectedMood === mood.value
                          ? `${mood.color} ring-4 ring-purple-400 scale-[1.03] shadow-md`
                          : "bg-white/60 border-transparent hover:bg-white text-gray-700 shadow-sm"
                      }
                    `}
                  >
                    <span className="text-3xl mb-1">{mood.emoji}</span>
                    <span className="font-extrabold capitalize text-[11px]">{mood.value}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 border-t border-purple-200/50 pt-4 flex items-center justify-between">
              <span className="text-sm font-black text-purple-950">Active Mood:</span>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-600/10 border-2 border-purple-600/20 text-purple-800 rounded-full font-black text-md capitalize">
                <span>{moods.find((m) => m.value === selectedMood)?.emoji}</span>
                <span>{selectedMood}</span>
              </div>
            </div>
          </div>

          {/* AI Camera Hunt Webcam (5 cols) */}
          <div className="md:col-span-5 bg-white/40 backdrop-blur-xl border border-white/30 rounded-[35px] p-6 shadow-2xl flex flex-col justify-between text-center">
            
            <div className="w-full flex items-center justify-between mb-3">
              <h2 className="text-xl font-black text-purple-950 flex items-center gap-2">
                📷 Live Webcam Scan
              </h2>
              {isCameraActive && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </div>

            {/* Video Frame container */}
            <div className="relative w-full aspect-[4/3] bg-purple-900/10 rounded-2xl overflow-hidden border-4 border-purple-900/20 shadow-inner flex items-center justify-center">
              
              {/* Fallback Display shown when camera is NOT active */}
              {!isCameraActive && (
                <div className="flex flex-col items-center p-4">
                  <span className="text-6xl mb-3 opacity-70 animate-bounce">🦉</span>
                  <p className="text-gray-600 font-bold mb-4 text-sm">
                    Activate camera to scan real expression!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startCamera}
                    className="px-6 py-2.5 bg-purple-600 text-white font-black rounded-full shadow-lg flex items-center gap-2 text-sm hover:bg-purple-700 transition"
                  >
                    🔌 Start Camera
                  </motion.button>
                </div>
              )}

              {/* Webcam Video element - ALWAYS rendered in DOM to guarantee ref is defined */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover ${!isCameraActive ? "hidden" : ""}`}
                style={{ transform: "scaleX(-1)" }} // Mirror effect
              />

              {/* Scan Line Laser overlay */}
              {isCameraActive && isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] scan-laser pointer-events-none" />
              )}

              {/* Captured Frame Thumbnail Preview Float */}
              {isCameraActive && capturedImage && (
                <div className="absolute bottom-3 right-3 w-20 h-15 bg-white border-2 border-purple-500 rounded-lg overflow-hidden shadow-md z-20">
                  <div className="text-[7px] bg-purple-600 text-white font-bold text-center py-0.5">LAST SCAN</div>
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Captured preview" />
                </div>
              )}

              {/* Scanner active overlay pulse */}
              {isCameraActive && isScanning && (
                <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none animate-pulse" />
              )}

              {/* Error Banner */}
              {cameraError && (
                <div className="absolute inset-0 bg-red-900/90 text-white p-6 flex flex-col items-center justify-center">
                  <span className="text-4xl mb-2">⚠️</span>
                  <p className="font-bold text-center text-sm">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-4 px-4 py-2 bg-white text-red-900 font-black rounded-full text-xs"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Status and Action Buttons */}
            <div className="w-full mt-3 space-y-2">
              {isCameraActive && (
                <>
                  <AnimatePresence mode="wait">
                    {detectedEmotionMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-2.5 bg-white/70 border border-purple-100 rounded-xl text-purple-900 font-black text-xs"
                      >
                        {detectedEmotionMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={captureAndDetect}
                      disabled={isScanning}
                      className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-full text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      🔍 {isScanning ? "Scanning..." : "Scan Face"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={stopCamera}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-black rounded-full text-sm hover:bg-gray-300 transition"
                    >
                      🛑 Off
                    </motion.button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

        {/* BOTTOM ROW: Dr. Owl's AI Coaching Hub & Visual Diagnostic Center */}
        {moodHistory.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl border-4 border-dashed border-purple-200 rounded-[35px] p-10 text-center shadow-xl space-y-5 animate-pulse max-w-xl mx-auto">
            <span className="text-7xl block select-none">📡</span>
            <h3 className="text-3xl font-black text-purple-950">Waiting for your first scan!</h3>
            <p className="text-base font-bold text-purple-900/60 max-w-md mx-auto leading-relaxed">
              No emotion logs recorded yet! Scan your face expression with the camera above or select a mood manually to unlock Dr. Owl's coaching recommendations and cognitive diagnostics.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Quests & Coaches (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Dr. Owl's AI Coaching Card */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[35px] p-8 shadow-2xl relative overflow-hidden">
                {/* Futuristic circuit-style corner badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-500 text-white text-xs font-black px-6 py-2 rounded-bl-3xl shadow-md uppercase tracking-wider">
                  🤖 AI Coach System Active
                </div>

                <div className="flex items-center gap-4 border-b border-purple-200/50 pb-5">
                  <div className="text-5xl p-4 bg-purple-100 rounded-3xl border border-purple-200 animate-bounce duration-1000">
                    🦉
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-purple-950">Dr. Owl's Coaching Logs</h3>
                    <p className="text-sm font-extrabold text-purple-600/70 uppercase">Behavioral Neuroscientist Assistant</p>
                  </div>
                </div>

                {/* Coach text bubbles */}
                <div className="mt-6 flex gap-4 items-start">
                  <div className="bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full shrink-0 mt-1">DR. OWL</div>
                  <div className="p-5 rounded-3xl rounded-tl-none bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/40 text-purple-950 font-bold text-lg leading-relaxed shadow-sm">
                    "{activeSuggestion.text}"
                  </div>
                </div>

                {/* Gorgeous Active Quests Hub */}
                <div className="mt-8">
                  <h4 className="text-xl font-black text-purple-900 mb-4 flex items-center gap-2">
                    🏆 Recommended Active Quests
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Game Quest Card */}
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-green-700 bg-green-150 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">🎮 Game Quest</span>
                          <span className="text-xs font-black text-white bg-green-500 px-2 py-0.5 rounded-md">{activeSuggestion.game.level}</span>
                        </div>
                        <h4 className="font-black text-2xl text-green-950 mt-4">{activeSuggestion.game.name}</h4>
                        
                        <div className="mt-3 flex items-center gap-2 bg-green-200/40 border border-green-200 px-3 py-1.5 rounded-xl w-fit">
                          <span className="text-sm font-black text-green-800">Reward:</span>
                          <span className="text-sm font-extrabold text-green-700">{activeSuggestion.game.reward} & 🪙 +15</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(activeSuggestion.game.route, { state: { fromEmotion: selectedMood } })}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-2xl hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition shadow-md"
                      >
                        ▶ Launch Quest
                      </button>
                    </motion.div>

                    {/* Story Quest Card */}
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-2 border-yellow-200 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-yellow-700 bg-yellow-150 border border-yellow-200 px-3 py-1 rounded-full uppercase tracking-wider">📖 Story Quest</span>
                          <span className="text-xs font-black text-white bg-yellow-500 px-2 py-0.5 rounded-md">{activeSuggestion.story.readTime}</span>
                        </div>
                        <h4 className="font-black text-2xl text-yellow-950 mt-4">💬 {activeSuggestion.story.name}</h4>
                        
                        <div className="mt-3 flex items-center gap-2 bg-yellow-200/40 border border-yellow-200 px-3 py-1.5 rounded-xl w-fit">
                          <span className="text-xs font-black text-yellow-800 uppercase tracking-widest">{activeSuggestion.story.tag}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(activeSuggestion.story.route, { state: { emotion: selectedMood, topic: activeSuggestion.story.topic, autoLoad: true } })}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-lg rounded-2xl hover:shadow-[0_8px_20px_rgba(245,158,11,0.3)] active:scale-[0.98] transition shadow-md"
                      >
                        📖 Start Reading
                      </button>
                    </motion.div>

                  </div>
                </div>

              </div>

              {/* Daily Behavioral Challenge Box */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[30px] p-6 shadow-xl flex items-center justify-between gap-6 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🏆</span>
                  <div>
                    <h4 className="text-xl font-black text-purple-900">Mental Mastery Challenge</h4>
                    <p className="text-sm font-bold text-gray-700 mt-1">{activeSuggestion.activity}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="challenge"
                    checked={challengeChecked}
                    onChange={(e) => setChallengeChecked(e.target.checked)}
                    className="w-8 h-8 rounded-xl text-purple-600 border-2 border-purple-400 focus:ring-purple-400 cursor-pointer"
                  />
                  
                  <AnimatePresence>
                    {challengeChecked && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase"
                      >
                        +15 Coins! 🎉
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Diagnostic Stats, Gauge Bars, Mood Logs (4 cols) */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Visual Diagnostics Panel */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[35px] p-6 shadow-2xl space-y-6">
                <h3 className="text-xl font-black text-purple-950 border-b border-purple-200/50 pb-3 flex items-center gap-2">
                  📊 Cognitive Diagnostics
                </h3>

                {/* Gauge bars */}
                <div className="space-y-4">
                  
                  {/* Focus level bar */}
                  <div>
                    <div className="flex justify-between text-sm font-extrabold mb-1">
                      <span className="text-gray-700">🎯 Focus Quotient</span>
                      <span className="text-purple-800">{activeSuggestion.focus}%</span>
                    </div>
                    <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                      <motion.div
                        key={`${selectedMood}-focus`}
                        initial={{ width: 0 }}
                        animate={{ width: `${activeSuggestion.focus}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Creativity index bar */}
                  <div>
                    <div className="flex justify-between text-sm font-extrabold mb-1">
                      <span className="text-gray-700">🎨 Creativity Index</span>
                      <span className="text-pink-800">{activeSuggestion.creativity}%</span>
                    </div>
                    <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                      <motion.div
                        key={`${selectedMood}-creativity`}
                        initial={{ width: 0 }}
                        animate={{ width: `${activeSuggestion.creativity}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Curiosity bar */}
                  <div>
                    <div className="flex justify-between text-sm font-extrabold mb-1">
                      <span className="text-gray-700">🧪 Curiosity Quotient</span>
                      <span className="text-blue-800">{activeSuggestion.curiosity}%</span>
                    </div>
                    <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                      <motion.div
                        key={`${selectedMood}-curiosity`}
                        initial={{ width: 0 }}
                        animate={{ width: `${activeSuggestion.curiosity}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </div>

                </div>

                {/* Cortex Diagnostic Logs */}
                <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl space-y-2 text-xs font-bold text-purple-900">
                  <div className="flex justify-between">
                    <span className="opacity-70">Active Lobe:</span>
                    <span className="font-extrabold text-right">{activeSuggestion.brainSector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Hemisphere:</span>
                    <span className="font-extrabold text-right">{activeSuggestion.brainHemisphere}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Synaptic Velocity:</span>
                    <span className="font-extrabold text-emerald-700">OPTIMIZED ⚡</span>
                  </div>
                </div>
              </div>

              {/* Weekly Mood progress timeline log */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[35px] p-6 shadow-2xl">
                <h3 className="text-xl font-black text-purple-950 mb-6 flex items-center gap-2">
                  📈 Mood Progress Logs
                </h3>

                {/* Visual Vertical Chart */}
                <div className="flex justify-around items-end h-44 border-b border-purple-200/50 pb-2">
                  {pastMoodLogs.map((log, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 group cursor-help relative">
                      {/* Hover tooltip */}
                      <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-950 text-white font-extrabold text-[10px] py-1 px-2 rounded-lg pointer-events-none capitalize">
                        {log.name}
                      </span>
                      <span className="text-2xl animate-pulse">{log.emoji}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: log.height.replace("h-", "") * 4 }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className={`w-7 rounded-t-lg shadow-inner ${log.color}`}
                        style={{ width: "28px" }}
                      />
                      <span className="text-xs font-extrabold text-purple-950 mt-1">{log.day}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs font-extrabold text-purple-700/70 text-center mt-3 uppercase tracking-wider">
                  🌟 Level 5 Emotional Quotient Analytics
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
