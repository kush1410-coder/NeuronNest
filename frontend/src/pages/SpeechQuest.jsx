import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Award } from "lucide-react";
import { usePoints } from "../hooks/usePoints";

export default function SpeechQuest() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();

  // Load active child from localStorage
  const activeChild = (() => {
    try {
      return JSON.parse(localStorage.getItem("activeChild") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const childName = activeChild.name || "Div";
  const childGender = activeChild.gender || "male";
  const genderTitle = childGender === "female" ? "beautiful girl" : childGender === "male" ? "handsome boy" : "superstar kid";

  const WORD_ITEMS = [
    { word: "CAT", emoji: "🐱", hints: ["It says meow!", "Soft and furry pet"] },
    { word: "SUN", emoji: "☀️", hints: ["Bright in the sky!", "Keeps us warm"] },
    { word: "FROG", emoji: "🐸", hints: ["Green and hops!", "Lives in ponds"] },
    { word: "RAINBOW", emoji: "🌈", hints: ["Has seven colors!", "Appears after rain"] },
    { word: "FLOWER", emoji: "🌸", hints: ["Smells sweet!", "Grows in gardens"] },
    { word: "OCTOPUS", emoji: "🐙", hints: ["Has eight arms!", "Swims in the sea"] },
    { 
      word: `${childName.toUpperCase()} IS A VERY ${genderTitle.toUpperCase()}`, 
      emoji: "😎", 
      hints: ["Say something super cool about yourself!", `Start with ${childName}...`] 
    },
    { 
      word: "THE COW JUMPED OVER THE MOON", 
      emoji: "🐮", 
      hints: ["Think of a flying cow!", "Jump like a cow!"] 
    },
    { 
      word: "I CAN FLY LIKE A SUPERHERO", 
      emoji: "🦸", 
      hints: ["Imagine you have a cape!", "Soar high in the sky!"] 
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [won, setWon] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  
  const currentItem = WORD_ITEMS[currentIdx];
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check SpeechRecognition compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Web Speech API is not supported in this browser. Please try Google Chrome or Edge!");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
      setSpokenText("");
      setErrorMsg("");
    };

    rec.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("")
        .toUpperCase();
      setSpokenText(transcript);

      // Clean punctuation/spacing for robust sentence-level matching
      const cleanString = (str) => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();
      const cleanTranscript = cleanString(transcript);
      const cleanTarget = cleanString(currentItem.word);

      // Check match
      if (cleanTranscript.includes(cleanTarget)) {
        handleSuccess();
        rec.stop();
      }
    };

    rec.onerror = (err) => {
      if (err.error !== "no-speech") {
        console.warn("Speech recognition error:", err.error);
        setErrorMsg(`Oops! Let's try again. (${err.error})`);
      }
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;

    // Clean up
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentIdx]);

  const speakItem = () => {
    try {
      window.speechSynthesis.cancel();
      const text = `Can you say ${currentItem.word}?`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Synthesis failed:", e);
    }
  };

  const speakHint = () => {
    try {
      window.speechSynthesis.cancel();
      const text = currentItem.hints[hintIdx];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
      setHintIdx((prev) => (prev + 1) % currentItem.hints.length);
    } catch (e) {
      console.warn("Synthesis failed:", e);
    }
  };

  const playSynthSound = (freq, type, duration) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleSuccess = () => {
    setWon(true);
    playSynthSound(523.25, "triangle", 0.15); // C5
    setTimeout(() => playSynthSound(659.25, "sine", 0.3), 120); // E5
    setTimeout(() => playSynthSound(783.99, "sine", 0.4), 240); // G5
    earnPoints(15, 20); // Give coins and XP
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Start error:", e);
      }
    }
  };

  const nextLevel = () => {
    setWon(false);
    setSpokenText("");
    setHintIdx(0);
    setErrorMsg("");
    setCurrentIdx((prev) => (prev + 1) % WORD_ITEMS.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200 p-6 md:p-10 relative overflow-hidden flex flex-col justify-between">
      {won && <Confetti numberOfPieces={150} />}

      {/* Background Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 text-xl pointer-events-none opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{ y: [-10, 10, -10], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 4 + Math.random() * 4 }}
        >
          ✨
        </motion.div>
      ))}

      {/* Header */}
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2.5 bg-white/80 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
        >
          ⬅️ Back to Dashboard
        </button>
        
        <div className="bg-white/85 px-5 py-2 border-2 border-purple-300 text-purple-900 rounded-full font-black text-sm shadow flex items-center gap-2">
          <Award size={18} className="text-purple-600" />
          <span>Stage {currentIdx + 1} of {WORD_ITEMS.length}</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-3xl mx-auto w-full bg-white/50 backdrop-blur-xl border border-white/40 rounded-[45px] p-8 md:p-10 shadow-2xl z-10 text-center flex flex-col justify-between my-4 grow max-h-[700px] relative">
        
        {/* Robo-Owl Guide */}
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-6xl select-none"
          >
            🦉
          </motion.div>
          <div className="bg-purple-950/5 border border-purple-950/10 px-5 py-3 rounded-2xl max-w-xs text-left">
            <p className="text-purple-950 font-extrabold text-sm leading-relaxed">
              Hi! I'm Robo-Owl. Speak the sentence out loud to unlock the card!
            </p>
          </div>
        </div>

        {/* Secret Word Display */}
        <div className="my-6">
          <motion.div
            animate={{ scale: won ? [1, 1.15, 1] : 1 }}
            className="text-[120px] md:text-[140px] filter drop-shadow-md select-none leading-none"
          >
            {currentItem.emoji}
          </motion.div>
          
          <div className="mt-4 flex flex-col items-center justify-center gap-3">
            <h2 className="text-3xl md:text-4xl font-black text-purple-950 tracking-wide uppercase max-w-xl text-center leading-relaxed">
              {currentItem.word}
            </h2>
            <button
              onClick={speakItem}
              className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition shadow-sm w-fit"
              title="Hear Word Pronunciation"
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>

        {/* Speech Recognition Controls */}
        <div className="flex flex-col items-center justify-center gap-4">
          
          {/* Live transcript indicator */}
          <div className="bg-purple-900/10 border-2 border-dashed border-purple-900/20 rounded-[25px] px-8 py-4 w-full max-w-lg min-h-[68px] flex items-center justify-center">
            {isListening ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-black uppercase text-purple-600/70 tracking-widest animate-pulse">Listening...</span>
                <span className="text-purple-950 font-black text-xl tracking-wider text-center">{spokenText || "..."}</span>
              </div>
            ) : won ? (
              <span className="text-emerald-600 font-black text-lg flex items-center gap-2 text-center">
                🎉 Spot on! Robo-Owl is super happy!
              </span>
            ) : (
              <span className="text-purple-900/40 font-black text-sm uppercase tracking-wider text-center">
                Click microphone and say the sentence
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Voice Button */}
          {!won && (
            <div className="flex gap-4">
              <button
                onClick={speakHint}
                className="px-5 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-black rounded-2xl text-sm transition shadow-sm"
              >
                💡 Hint
              </button>
              
              <button
                onClick={toggleListening}
                className={`
                  p-6 rounded-full transition duration-300 transform active:scale-95 shadow-xl flex items-center justify-center border-4
                  ${isListening 
                    ? "bg-red-500 border-red-300 text-white animate-pulse" 
                    : "bg-purple-600 border-purple-400 text-white hover:bg-purple-700"
                  }
                `}
              >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>

              <button
                onClick={speakItem}
                className="px-5 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-black rounded-2xl text-sm transition shadow-sm"
              >
                🔊 Listen
              </button>
            </div>
          )}

        </div>

        {/* Level Progression */}
        <div className="min-h-[90px] flex items-center justify-center">
          {won && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="font-extrabold text-purple-950 text-lg">
                You earned <span className="text-orange-500">🪙 +15 Coins</span> and <span className="text-yellow-600">⭐ +20 XP</span>!
              </p>
              <button
                onClick={nextLevel}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-lg rounded-full shadow-lg hover:brightness-105 transition"
              >
                Next Level 🚀
              </button>
            </motion.div>
          )}
        </div>

      </div>

      {/* Educational Footer */}
      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/60 z-10 flex justify-center items-center gap-1.5">
        <Sparkles size={12} className="text-purple-600" />
        <span>Speech Quest develops word articulation, phonics listening, and cognitive visual-audio links.</span>
      </div>
    </div>
  );
}
