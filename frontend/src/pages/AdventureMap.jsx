import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Trophy, Rocket, Star, Gift, ArrowLeft, Play, Lock, 
  MapPin, HelpCircle, RefreshCw, Volume2, Mic, Paintbrush, 
  BookOpen, Heart, Check, X, ShieldAlert, Award, User, VolumeX
} from "lucide-react";

// Web Audio API Synthesizer Helper
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'spell') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      // Little melody
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
        g.gain.setValueAtTime(0.08, ctx.currentTime + index * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.08 + 0.15);
        o.start(ctx.currentTime + index * 0.08);
        o.stop(ctx.currentTime + index * 0.08 + 0.15);
      });
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    console.error("Web Audio Synthesizer blocked or unsupported", e);
  }
};

export default function AdventureMap() {
  const navigate = useNavigate();

  // Accessibility States
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [colorblindMode, setColorblindMode] = useState(false);
  const [voiceReadAloud, setVoiceReadAloud] = useState(true);

  // Parent Dashboard View Toggle
  const [showParentDashboard, setShowParentDashboard] = useState(false);

  // Child Config/Input Profile
  const activeChild = (() => {
    try {
      return JSON.parse(localStorage.getItem("activeChild") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const [profile, setProfile] = useState({
    childName: activeChild.name || "Yash",
    age: 8,
    favoriteTopic: "Space",
    learningGoal: "Mathematics"
  });

  // Flow control states: 'setup' | 'story' | 'map' | 'challenge' | 'ceremony'
  const [gameState, setGameState] = useState("setup");
  const [generatedStory, setGeneratedStory] = useState(null);

  // Map Levels & Progress
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [xp, setXp] = useState(120);
  const [coins, setCoins] = useState(50);
  const [stars, setStars] = useState(150);
  const [gems, setGems] = useState(10);
  const [streakDays, setStreakDays] = useState(3);
  const [unlockedChests, setUnlockedChests] = useState([]);

  // Active level challenge states
  const [activeChallengeLevel, setActiveChallengeLevel] = useState(null);
  const [challengeStep, setChallengeStep] = useState(1); // progress inside current level
  const [monsterHp, setMonsterHp] = useState(100);
  const [mathQuestion, setMathQuestion] = useState({ q: "5 + 8", a: 13, options: [11, 13, 15, 12] });
  const [streakAnswers, setStreakAnswers] = useState(0); // tracks speed/correctness for adaptive difficulty

  // Canvas drawing state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasStrokeColor, setCanvasStrokeColor] = useState("#8B5CF6");

  // Speaking state
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState("");
  const [speakingAccuracy, setSpeakingAccuracy] = useState(null);

  // Drag and Drop Space planets state
  const [planetSlots, setPlanetSlots] = useState([
    { id: "earth", name: "Earth", emoji: "🌍", currentSlot: null },
    { id: "mars", name: "Mars", emoji: "🔴", currentSlot: null },
    { id: "mercury", name: "Mercury", emoji: "☄️", currentSlot: null },
  ]);
  const [correctSlots, setCorrectSlots] = useState({
    slot1: "mercury", // closest to sun
    slot2: "earth",
    slot3: "mars",
  });

  // Companion state
  const [companionDialogue, setCompanionDialogue] = useState("Hi there! I am Sparky your dino helper. Let's explore the magical universe together!");

  // Interactive Confetti State
  const [particles, setParticles] = useState([]);

  // Story Continuation State
  const [storyPart, setStoryPart] = useState(1);

  // Text-To-Speech Synthesis helper
  const speakText = (text) => {
    if (!voiceReadAloud) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.35; // Slightly higher pitch for a young girl voice tone

      // Get available voices and find Indian English female voice
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        
        // Target Indian Female voice names or language en-IN
        const indianFemaleVoice = voices.find(v => 
          (v.lang === "en-IN" || v.lang.includes("en_IN")) &&
          (v.name.toLowerCase().includes("female") || 
           v.name.toLowerCase().includes("heera") || 
           v.name.toLowerCase().includes("priya") || 
           v.name.toLowerCase().includes("veena") || 
           v.name.toLowerCase().includes("rhea") || 
           v.name.toLowerCase().includes("google"))
        ) || voices.find(v => v.lang === "en-IN" || v.lang.includes("en_IN"));

        if (indianFemaleVoice) {
          utterance.voice = indianFemaleVoice;
        }
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  const triggerLocalConfetti = (e) => {
    playSound('pop');
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: Math.random(),
      x,
      y,
      color: ["#FF62B0", "#FFD700", "#00E5FF", "#B388FF", "#80F3B4", "#FF5722"][i % 6],
      tx: (Math.random() - 0.5) * 280,
      ty: (Math.random() - 0.7) * 280 - 60,
      size: Math.random() * 12 + 6,
      rotate: Math.random() * 360,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
  };

  // Run companion speak when companion text changes
  useEffect(() => {
    if (gameState !== "setup") {
      speakText(companionDialogue);
    }
  }, [companionDialogue, gameState]);

  // Levels Configuration
  const levels = [
    { id: 1, name: "Home Village", emoji: "🏠", bg: "from-green-200 to-emerald-300", difficulty: "Beginner", reward: "50 Stars", topic: "Starting Out", desc: "Start your quest here!" },
    { id: 2, name: "Enchanted Forest", emoji: "🌳", bg: "from-emerald-300 to-teal-400", difficulty: "Easy", reward: "100 Stars", topic: "Basic Addition", desc: "Help the wood elves solve tree problems." },
    { id: 3, name: "Unicorn Valley", emoji: "🦄", bg: "from-teal-300 to-cyan-400", difficulty: "Medium", reward: "150 Stars", topic: "Ordering Planets", desc: "Arrange space alignment for the unicorns." },
    { id: 4, name: "Crystal Castle", emoji: "🏰", bg: "from-cyan-300 to-blue-500", difficulty: "Tricky", reward: "200 Stars", topic: "Voice Magic Spell", desc: "Speak clean spells to unlock the castle gate." },
    { id: 5, name: "Dragon Mountain", emoji: "🐉", bg: "from-amber-200 to-red-400", difficulty: "Boss Fight", reward: "300 Stars", topic: "Math Battle", desc: "Fight the math monster to claim the treasure!" },
    { id: 6, name: "Treasure Kingdom", emoji: "💎", bg: "from-yellow-200 to-purple-400", difficulty: "Legendary", reward: "Gold Trophy", topic: "Ceremony", desc: "Celebrate and claim rewards!" }
  ];

  // AI Adaptable Math Generator
  const generateMathQuestion = (isCorrect) => {
    let qStr = "";
    let ans = 0;
    
    // Adaptive logic: streak determines level
    if (streakAnswers < 2) {
      // Easy level: 10 + 5
      const num1 = Math.floor(Math.random() * 9) + 2;
      const num2 = Math.floor(Math.random() * 8) + 2;
      qStr = `${num1} + ${num2}`;
      ans = num1 + num2;
    } else if (streakAnswers < 5) {
      // Medium level: 20 + 15
      const num1 = Math.floor(Math.random() * 20) + 10;
      const num2 = Math.floor(Math.random() * 15) + 5;
      qStr = `${num1} + ${num2}`;
      ans = num1 + num2;
    } else {
      // Hard level: 123 + 89
      const num1 = Math.floor(Math.random() * 100) + 50;
      const num2 = Math.floor(Math.random() * 80) + 20;
      qStr = `${num1} + ${num2}`;
      ans = num1 + num2;
    }

    const opts = new Set([ans]);
    while (opts.size < 4) {
      opts.add(ans + (Math.floor(Math.random() * 10) - 5));
    }

    setMathQuestion({
      q: qStr,
      a: ans,
      options: Array.from(opts).sort(() => Math.random() - 0.5)
    });
  };

  // Trigger personalized AI Story Setup
  const handleStartStory = () => {
    playSound('success');
    const story = `${profile.childName}, a brave ${profile.age}-year-old explorer, has been chosen by the cosmic Star Guardians to restore the lost light of the Universe. Five magic crystal stars are hidden across the Galaxy Forest. Each crystal can only be unlocked by solving magical learning challenges. Luckily, Sparky the Dino is here to help!`;
    setGeneratedStory(story);
    setGameState("story");
  };

  // Launch actual level challenge
  const startLevelChallenge = (level) => {
    if (level.id > currentLevelId) return; // Locked
    playSound('click');
    setActiveChallengeLevel(level);
    setGameState("challenge");
    setChallengeStep(1);
    setMonsterHp(100);
    setSpeechResult("");
    setSpeakingAccuracy(null);
    generateMathQuestion();
    setCompanionDialogue(`Prepare yourself! Let's solve this challenge in ${level.name}.`);
  };

  // Handlers for interactive actions
  const handleQuizAnswer = (selectedOption, e) => {
    if (selectedOption === mathQuestion.a) {
      playSound('spell');
      triggerLocalConfetti(e);
      setMonsterHp((prev) => Math.max(0, prev - 34));
      setStreakAnswers((prev) => prev + 1);
      setCompanionDialogue("Woohoo! Correct answer! Magical bolt deals damage to the monster!");
      
      // Check if monster defeated
      if (monsterHp <= 40) {
        setTimeout(() => {
          completeLevel();
        }, 800);
      } else {
        setTimeout(() => {
          generateMathQuestion();
        }, 600);
      }
    } else {
      playSound('hit');
      setStreakAnswers(0); // Reset streak for adaptive difficulty
      setCompanionDialogue("Oh no! That was tricky. Let's try another easy one!");
      setTimeout(() => {
        generateMathQuestion();
      }, 800);
    }
  };

  // Canvas paint handlers
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = canvasStrokeColor;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playSound('pop');
  };

  const submitDrawing = (e) => {
    playSound('success');
    triggerLocalConfetti(e);
    setCompanionDialogue("Stunning artwork! You've got amazing creativity. Sparky rates this 10 out of 10 stars!");
    setTimeout(() => {
      completeLevel();
    }, 1200);
  };

  // Speak pronunciation challenge
  const triggerVoiceListen = () => {
    setIsListening(true);
    playSound('pop');
    setCompanionDialogue("Listening closely now... Say the magical words!");

    // Simulated speech evaluation
    setTimeout(() => {
      setIsListening(false);
      setSpeechResult("The moon shines brightly tonight");
      setSpeakingAccuracy(96);
      playSound('success');
      setCompanionDialogue("Splendid pronunciation! You speak like a true wizard explorer!");
    }, 2500);
  };

  // Complete level and unlock next
  const completeLevel = () => {
    playSound('success');
    setXp((prev) => prev + 50);
    setCoins((prev) => prev + 20);
    setStars((prev) => prev + 100);
    setGems((prev) => prev + 2);

    if (activeChallengeLevel.id === 5) {
      setGameState("ceremony");
      setCompanionDialogue(`Congratulations ${profile.childName}! You've saved the kingdom and restored the magical treasure chest!`);
    } else {
      setCurrentLevelId((prev) => Math.max(prev, activeChallengeLevel.id + 1));
      setGameState("map");
      setCompanionDialogue(`Awesome job! ${activeChallengeLevel.name} complete. The path to the next checkpoint is open!`);
    }
    setActiveChallengeLevel(null);
  };

  // Secret Treasure Chest trigger
  const openTreasureChest = (chestId, e) => {
    if (unlockedChests.includes(chestId)) return;
    playSound('success');
    triggerLocalConfetti(e);
    setUnlockedChests((prev) => [...prev, chestId]);
    setStars((prev) => prev + 150);
    setGems((prev) => prev + 5);
    setCompanionDialogue("Incredible! You found a hidden crystal treasure chest. Have some bonus stars and rare gems!");
  };

  return (
    <div className={`relative min-h-screen overflow-hidden select-none pb-12 transition-all duration-300 ${
      dyslexicFont ? "font-serif" : "font-sans"
    } ${
      colorblindMode ? "filter contrast-125 saturate-150 brightness-110" : ""
    } bg-gradient-to-b from-sky-200 via-purple-100 to-pink-200 text-purple-900`}>

      {/* Font Family Helper for Dyslexic Font Toggling */}
      {dyslexicFont && (
        <style dangerouslySetInnerHTML={{__html: `
          body, p, h1, h2, h3, h4, span, button {
            font-family: 'Comic Sans MS', 'Fredoka', cursive !important;
            letter-spacing: 0.05em !important;
            word-spacing: 0.1em !important;
          }
        `}} />
      )}

      {/* Confetti Explosion Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
              animate={{
                opacity: 0,
                scale: 0.1,
                x: p.x + p.tx,
                y: p.y + p.ty,
                rotate: p.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                left: -p.size/2,
                top: -p.size/2,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Top Header & Settings bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-white/95 backdrop-blur-md p-3 rounded-full hover:scale-115 active:scale-95 shadow-lg border border-purple-200/50 cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-purple-800" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-purple-900 flex items-center gap-2">
              <span>Adventure Mode</span>
              <span className="animate-pulse">🗺️</span>
            </h1>
            <p className="text-xs font-semibold text-purple-800/80 uppercase tracking-widest">NeuronNest Fantasy map</p>
          </div>
        </div>

        {/* Accessibility & Parent dashboard controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dyslexia Mode Toggle */}
          <button
            onClick={() => { playSound('pop'); setDyslexicFont(!dyslexicFont); }}
            className={`px-4 py-2 rounded-full font-bold shadow-md cursor-pointer border transition ${
              dyslexicFont 
                ? "bg-purple-600 text-white border-purple-700" 
                : "bg-white/90 text-purple-900 border-purple-200"
            }`}
          >
            ✏️ Dyslexia Font
          </button>

          {/* Colorblind Filter Toggle */}
          <button
            onClick={() => { playSound('pop'); setColorblindMode(!colorblindMode); }}
            className={`px-4 py-2 rounded-full font-bold shadow-md cursor-pointer border transition ${
              colorblindMode 
                ? "bg-purple-600 text-white border-purple-700" 
                : "bg-white/90 text-purple-900 border-purple-200"
            }`}
          >
            🎨 Colorblind Assist
          </button>

          {/* Voice Read Aloud Toggle */}
          <button
            onClick={() => { 
              playSound('pop'); 
              const next = !voiceReadAloud;
              setVoiceReadAloud(next);
              if (!next) window.speechSynthesis.cancel();
            }}
            className="bg-white/90 text-purple-900 border border-purple-200 p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            title="Toggle Voice Read Aloud"
          >
            {voiceReadAloud ? <Volume2 className="w-5 h-5 text-purple-800" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
          </button>

          {/* Parent Mode Dashboard Toggle */}
          <button
            onClick={() => { playSound('pop'); setShowParentDashboard(!showParentDashboard); }}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-5 py-2.5 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Parent Dashboard</span>
          </button>
        </div>
      </div>

      {/* Parent Report Panel (Slide down) */}
      <AnimatePresence>
        {showParentDashboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-20 max-w-4xl mx-auto px-6 mb-6 overflow-hidden"
          >
            <div className="bg-white/95 backdrop-blur-xl border-4 border-amber-300 rounded-[35px] p-6 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-amber-950 flex items-center gap-2">
                  <span>📊 AI Parent Insights & Reports</span>
                </h3>
                <span className="text-xs bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-full uppercase">Weekly Review</span>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900">Learning Speed</h4>
                  <p className="text-3xl font-black mt-2 text-amber-950">92% Accuracy</p>
                  <p className="text-xs text-amber-800 mt-1">Excellent adaptation to multiplication problems.</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900">Time Spent</h4>
                  <p className="text-3xl font-black mt-2 text-amber-950">45 Mins</p>
                  <p className="text-xs text-amber-800 mt-1">Well-balanced game play session today.</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900">Weak Area Target</h4>
                  <p className="text-lg font-black mt-2 text-red-700">Vocabulary Speeds</p>
                  <p className="text-xs text-amber-800 mt-1">AI learning companion is adjusting challenges.</p>
                </div>
              </div>
              <div className="bg-amber-100/50 p-4 rounded-2xl border border-amber-200">
                <p className="text-sm font-semibold text-amber-950">
                  💬 <strong className="text-amber-900">AI Tutor Feedback:</strong> Emma has shown fantastic performance in Math battles today! Speed adaptation enabled to keep multiplication engaging. Recommend focusing next on reading completion tasks.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Flow Sections */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-4">

        {/* 1. SETUP SCREEN */}
        {gameState === "setup" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white/70 backdrop-blur-lg border border-white/50 p-8 rounded-[40px] shadow-2xl space-y-6 text-center mt-12"
          >
            <div className="w-20 h-20 bg-purple-500/20 text-purple-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
              🦄
            </div>
            
            <h2 className="text-4xl font-black text-purple-950">Configure Your Magical Adventure</h2>
            <p className="text-purple-900/80 font-medium">Input your profile information, and the AI story generator will weave a unique learning quest just for you!</p>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-black uppercase tracking-wider text-purple-900/70 mb-1">Explorer's Name</label>
                <input 
                  type="text" 
                  value={profile.childName}
                  onChange={(e) => setProfile({ ...profile, childName: e.target.value })}
                  className="w-full bg-white/80 border-2 border-purple-200 px-5 py-3 rounded-2xl font-bold focus:outline-none focus:border-purple-500 text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-purple-900/70 mb-1">Age</label>
                  <input 
                    type="number" 
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 8 })}
                    className="w-full bg-white/80 border-2 border-purple-200 px-5 py-3 rounded-2xl font-bold focus:outline-none focus:border-purple-500 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-purple-900/70 mb-1">Favorite Topic</label>
                  <select 
                    value={profile.favoriteTopic}
                    onChange={(e) => setProfile({ ...profile, favoriteTopic: e.target.value })}
                    className="w-full bg-white/80 border-2 border-purple-200 px-5 py-3 rounded-2xl font-bold focus:outline-none focus:border-purple-500 text-lg"
                  >
                    <option value="Space">🌌 Space</option>
                    <option value="Dinosaurs">🦕 Dinosaurs</option>
                    <option value="Fairy Tales">🧚 Fairy Tales</option>
                    <option value="Ocean Quest">🦈 Ocean Quest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wider text-purple-900/70 mb-1">Learning Goal</label>
                <select 
                  value={profile.learningGoal}
                  onChange={(e) => setProfile({ ...profile, learningGoal: e.target.value })}
                  className="w-full bg-white/80 border-2 border-purple-200 px-5 py-3 rounded-2xl font-bold focus:outline-none focus:border-purple-500 text-lg"
                >
                  <option value="Mathematics">🔢 Mathematics</option>
                  <option value="Grammar & Spelling">📚 Grammar & Spelling</option>
                  <option value="Science exploration">🧪 Science exploration</option>
                  <option value="Social skills">🤝 Social skills</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartStory}
              className="w-full py-4 rounded-full text-white text-xl font-black bg-gradient-to-r from-pink-500 to-purple-600 border-4 border-white shadow-xl hover:shadow-2xl cursor-pointer flex items-center justify-center gap-3"
            >
              <Play className="fill-white w-5 h-5" />
              <span>GENERATE AI ADVENTURE</span>
            </motion.button>
          </motion.div>
        )}

        {/* 2. STORY INTRODUCTION SCREEN */}
        {gameState === "story" && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white/70 backdrop-blur-lg border border-white/50 p-8 rounded-[40px] shadow-2xl space-y-6 text-center mt-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black bg-purple-500 text-white px-3 py-1 rounded-full uppercase tracking-wider">AI Story Generator</span>
              <button 
                onClick={() => { playSound('pop'); speakText(generatedStory); }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-2.5 rounded-full cursor-pointer flex items-center justify-center"
                title="Read Story Aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-3xl font-black text-purple-950">Your Quest Begins... 🌌</h3>

            {/* Simulated Cartoon Animation container */}
            <div className="relative w-full h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800 border-4 border-white shadow-lg flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.4))] animate-pulse" />
              {/* Simple stylized SVG for Space adventure visual representation */}
              <svg viewBox="0 0 200 100" className="w-full h-full opacity-80 pointer-events-none">
                <circle cx="100" cy="50" r="3" fill="white" className="animate-ping" />
                <circle cx="40" cy="30" r="15" fill="#E91E63" />
                <circle cx="150" cy="65" r="25" fill="#3F51B5" />
                <circle cx="80" cy="70" r="6" fill="#FFEB3B" />
                {/* Waving dino silhouette */}
                <text x="90" y="55" fontSize="24">🦕</text>
                <text x="140" y="45" fontSize="16">⭐</text>
              </svg>
              <div className="absolute bottom-3 left-4 bg-black/40 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider">Galaxy Forest Chapter 1</div>
            </div>

            <p className="text-xl text-purple-950 leading-relaxed font-semibold bg-purple-50/50 p-6 rounded-2xl border border-purple-200">
              "{generatedStory}"
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playSound('success'); setGameState("map"); }}
              className="px-12 py-4 rounded-full text-white text-xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 border-4 border-white shadow-xl hover:shadow-2xl cursor-pointer flex items-center justify-center gap-3 mx-auto"
            >
              <span>ENTER THE WORLD MAP</span>
              <Rocket className="w-5 h-5 animate-bounce" />
            </motion.button>
          </motion.div>
        )}

        {/* 3. MAP SCREEN */}
        {gameState === "map" && (
          <div className="space-y-6">
            
            {/* Top Dashboard Progress & Currency HUD */}
            <div className="bg-white/50 backdrop-blur-md rounded-[35px] p-6 border border-white/50 shadow-xl flex flex-wrap justify-between items-center gap-6">
              
              {/* Level Progress bar */}
              <div className="flex-1 min-w-[250px] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-purple-950">Quest Destination Progress</span>
                  <span className="text-sm font-black bg-purple-600 text-white px-2 py-0.5 rounded-full">{Math.round(((currentLevelId - 1) / 5) * 100)}%</span>
                </div>
                <div className="w-full bg-purple-200/50 h-5 rounded-full overflow-hidden border border-purple-300">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentLevelId - 1) / 5) * 100}%` }}
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-purple-900/70">
                  <span>Completed: {currentLevelId - 1} Levels</span>
                  <span>Destination: Treasure Kingdom</span>
                </div>
              </div>

              {/* Stats HUD */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white/80 border border-purple-200 px-5 py-2.5 rounded-full font-black text-sm shadow-md flex items-center gap-2">
                  ⭐ <span>{stars} Stars</span>
                </div>
                <div className="bg-white/80 border border-purple-200 px-5 py-2.5 rounded-full font-black text-sm shadow-md flex items-center gap-2">
                  🪙 <span>{coins} Coins</span>
                </div>
                <div className="bg-white/80 border border-purple-200 px-5 py-2.5 rounded-full font-black text-sm shadow-md flex items-center gap-2">
                  💎 <span>{gems} Gems</span>
                </div>
                <div className="bg-amber-400 text-amber-950 border border-amber-300 px-5 py-2.5 rounded-full font-black text-sm shadow-md flex items-center gap-2">
                  🔥 <span>{streakDays} Day Streak!</span>
                </div>
              </div>
            </div>

            {/* Explanatory banner */}
            <div className="bg-cyan-100/70 border-2 border-cyan-300 rounded-3xl p-4 text-center">
              <p className="font-semibold text-cyan-900 text-sm md:text-base flex items-center justify-center gap-2 flex-wrap">
                🗺️ <strong className="text-cyan-950">Adventure Rule:</strong> Solve challenges on the map points to clear the fog and unlock the magic keys to the next castle!
              </p>
            </div>

            {/* Cartoon Map Area */}
            <div className="relative bg-gradient-to-tr from-sky-400 via-emerald-300 to-yellow-100 rounded-[50px] p-8 min-h-[500px] border-4 border-white shadow-2xl overflow-hidden flex flex-col justify-between">
              
              {/* Floating Map Decorations */}
              <div className="absolute top-10 left-12 w-28 h-12 bg-white/70 rounded-full blur-md opacity-70 animate-pulse pointer-events-none" />
              <div className="absolute top-28 right-16 w-24 h-8 bg-white/60 rounded-full blur-md opacity-60 pointer-events-none animate-bounce" style={{ animationDuration: '6s' }} />

              {/* Curved SVG Connections Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path 
                  d="M 120 400 Q 250 250 450 350 T 800 200" 
                  fill="none" 
                  stroke="#FFF" 
                  strokeWidth="8" 
                  strokeDasharray="16" 
                  className="opacity-70"
                />
              </svg>

              {/* Levels / Milestones layout on map */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center mt-12">
                {levels.map((level) => {
                  const isUnlocked = level.id <= currentLevelId;
                  const isCurrent = level.id === currentLevelId;

                  return (
                    <motion.div 
                      key={level.id}
                      whileHover={isUnlocked ? { scale: 1.08 } : {}}
                      onClick={() => startLevelChallenge(level)}
                      className={`relative flex flex-col items-center w-full max-w-[150px] cursor-pointer ${
                        !isUnlocked ? "filter blur-[2px] opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {/* Interactive lock bubble */}
                      {!isUnlocked && (
                        <div className="absolute z-20 bg-gray-900/60 p-2.5 rounded-full text-white shadow-lg flex items-center justify-center top-8">
                          <Lock className="w-5 h-5" />
                        </div>
                      )}

                      {/* Floating pointer anchor for Current active checkpoint */}
                      {isCurrent && (
                        <motion.div 
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-12 bg-pink-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase shadow-lg border border-white z-20 flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5 fill-white" />
                          <span>Active</span>
                        </motion.div>
                      )}

                      {/* Icon Globe Frame */}
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl bg-gradient-to-tr border-4 shadow-xl relative ${
                        isCurrent 
                          ? "border-pink-500 animate-pulse ring-4 ring-pink-300" 
                          : isUnlocked 
                            ? "border-white" 
                            : "border-gray-300"
                      } ${level.bg}`}>
                        {level.emoji}
                      </div>

                      {/* Level Label */}
                      <div className="mt-3 bg-white/90 px-3 py-1.5 rounded-2xl shadow-md text-center border border-purple-100/50 w-full">
                        <p className="text-xs font-black text-purple-500 uppercase tracking-wider">Level {level.id}</p>
                        <p className="font-extrabold text-sm text-purple-950 truncate">{level.name}</p>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-full uppercase mt-1 inline-block">{level.topic}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Hidden Chest System (Interactable bonuses) */}
              <div className="relative z-10 flex justify-around items-center border-t border-white/30 pt-6 mt-16">
                {[1, 2].map((chestId) => {
                  const isOpen = unlockedChests.includes(chestId);
                  return (
                    <motion.div
                      key={chestId}
                      whileHover={!isOpen ? { scale: 1.15, rotate: [0, -5, 5, -5, 0] } : {}}
                      onClick={(e) => openTreasureChest(chestId, e)}
                      className={`cursor-pointer flex flex-col items-center bg-white/40 p-4 rounded-3xl shadow-lg border border-white/50 ${
                        isOpen ? "opacity-75" : ""
                      }`}
                    >
                      <span className="text-4xl select-none">{isOpen ? "🔓" : "🎁"}</span>
                      <p className="text-xs font-black uppercase text-purple-950 mt-1">
                        {isOpen ? "Chest Claimed!" : "Secret Chest"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* Multiplayer Friendly Rank Panel */}
            <div className="bg-white/60 backdrop-blur-md rounded-[35px] p-6 border border-white/50 shadow-xl space-y-4">
              <h3 className="text-xl font-black text-purple-950">🏆 Explorer Rank & Achievements</h3>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <p className="text-base font-semibold text-purple-900">
                  🎉 <strong className="text-purple-950">Great job, {profile.childName}!</strong> You completed <span className="bg-purple-200 px-2 py-0.5 rounded-full text-purple-950 font-black">{currentLevelId - 1} adventures</span> this week. Keep up the magical learning!
                </p>
                <div className="flex gap-2">
                  <span className="bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1 rounded-full text-xs font-black uppercase">⭐ Reading Hero</span>
                  <span className="bg-cyan-100 border border-cyan-300 text-cyan-800 px-3 py-1 rounded-full text-xs font-black uppercase">🧮 Math Wizard</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 4. ACTIVE CHALLENGE ARENA MODAL */}
        {gameState === "challenge" && activeChallengeLevel && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto bg-white/95 border-4 border-purple-300 rounded-[45px] p-6 md:p-8 shadow-2xl space-y-6"
          >
            {/* Header Arena */}
            <div className="flex justify-between items-center border-b border-purple-100 pb-4">
              <div>
                <span className="text-xs font-black bg-purple-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">Level {activeChallengeLevel.id} Challenge</span>
                <h3 className="text-3xl font-black text-purple-950 mt-1">{activeChallengeLevel.name}</h3>
              </div>
              <button 
                onClick={() => { playSound('pop'); setGameState("map"); }}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-2 rounded-full cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LEVEL 5: MATH BATTLE ARENA */}
            {activeChallengeLevel.id === 5 && (
              <div className="space-y-6">
                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-4 text-center">
                  <p className="text-sm font-black text-red-800">⚔️ CRITICAL MATH BOSS BATTLE! FIGHT THE EVIL OGRE!</p>
                </div>

                {/* Battle layout */}
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  
                  {/* Monster Card */}
                  <div className="bg-gradient-to-br from-red-100 to-amber-100 border-2 border-red-300 rounded-3xl p-6 text-center space-y-3">
                    <span className="text-7xl select-none animate-bounce block">👹</span>
                    <h4 className="font-black text-xl text-red-950">Math Monster</h4>
                    <div className="w-full bg-red-200 h-5 rounded-full overflow-hidden border border-red-300">
                      <motion.div 
                        initial={{ width: "100%" }}
                        animate={{ width: `${monsterHp}%` }}
                        className="h-full bg-red-600 rounded-full"
                      />
                    </div>
                    <span className="text-xs font-black text-red-700 uppercase">HP: {monsterHp}%</span>
                  </div>

                  {/* Adaptive Math Quiz Board */}
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-3xl p-6 text-center space-y-4">
                    <h4 className="text-sm font-black text-purple-500 uppercase tracking-widest">Answer to Cast Magic Spell!</h4>
                    <p className="text-5xl font-black text-purple-950">{mathQuestion.q} = ?</p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {mathQuestion.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleQuizAnswer(opt, e)}
                          className="bg-white border-2 border-purple-200 hover:border-purple-500 p-4 rounded-2xl font-black text-xl text-purple-900 cursor-pointer transition shadow"
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* LEVEL 4: SPEECH QUEST CHALLENGE */}
            {activeChallengeLevel.id === 4 && (
              <div className="text-center space-y-6 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full mx-auto flex items-center justify-center text-4xl shadow-inner animate-pulse">
                  🎙️
                </div>
                
                <h4 className="text-xl font-bold text-purple-950">Speak the magical sentence correctly to open the Crystal Gate!</h4>
                
                <p className="text-2xl font-black bg-purple-50 border-2 border-dashed border-purple-300 p-6 rounded-2xl text-purple-800">
                  "The moon shines brightly tonight."
                </p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={triggerVoiceListen}
                    className={`px-8 py-4 rounded-full font-black text-white cursor-pointer shadow-lg flex items-center gap-2 mx-auto ${
                      isListening ? "bg-red-500 animate-pulse" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    <Mic className="w-5 h-5 fill-white" />
                    <span>{isListening ? "Listening..." : "Tap & Speak Now!"}</span>
                  </motion.button>

                  {speechResult && (
                    <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-1">
                      <p className="text-xs font-bold text-emerald-800 uppercase">You Spoke:</p>
                      <p className="font-extrabold text-emerald-950">"{speechResult}"</p>
                      {speakingAccuracy !== null && (
                        <p className="text-sm font-black text-emerald-700">Accuracy: {speakingAccuracy}% ✨ Spell Success!</p>
                      )}
                    </div>
                  )}
                </div>

                {speakingAccuracy !== null && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={completeLevel}
                    className="px-10 py-3.5 bg-emerald-500 hover:bg-emerald-600 border-4 border-white text-white font-black rounded-full shadow-lg cursor-pointer"
                  >
                    COMPLETE CHALLENGE
                  </motion.button>
                )}
              </div>
            )}

            {/* LEVEL 3: PLANET DRAG & DROP PUZZLE */}
            {activeChallengeLevel.id === 3 && (
              <div className="space-y-6">
                <div className="bg-cyan-50 border border-cyan-300 p-4 rounded-2xl text-center">
                  <p className="text-sm font-semibold text-cyan-950">🌌 Order the celestial planets from closest to farthest away from the glowing Sun!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  
                  {/* Option list */}
                  <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 space-y-3">
                    <h4 className="font-black text-purple-950">Planets to Sort:</h4>
                    {planetSlots.map((p) => (
                      <motion.div 
                        key={p.id}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          playSound('pop');
                          // Simple click to cycle slot simulation for simple mobile friendly kids interaction
                          let nextSlot = p.currentSlot === null ? 1 : p.currentSlot === 3 ? null : p.currentSlot + 1;
                          setPlanetSlots(planetSlots.map(x => x.id === p.id ? { ...x, currentSlot: nextSlot } : x));
                        }}
                        className="bg-white p-3 rounded-xl border border-purple-200 flex justify-between items-center font-bold text-sm cursor-pointer shadow-sm"
                      >
                        <span className="text-xl flex items-center gap-2">
                          <span>{p.emoji}</span>
                          <span>{p.name}</span>
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                          {p.currentSlot === null ? "Tap to Assign" : `Slot ${p.currentSlot}`}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Placement zones */}
                  <div className="space-y-3 bg-cyan-900/10 p-6 rounded-3xl border border-cyan-200">
                    <h4 className="font-black text-cyan-950 text-center">Solar System Slots:</h4>
                    
                    <div className="space-y-3">
                      {[1, 2, 3].map((slotNum) => {
                        // Find planet assigned to this slot
                        const assigned = planetSlots.find(p => p.currentSlot === slotNum);
                        return (
                          <div key={slotNum} className="bg-white/60 p-4 rounded-2xl border-2 border-dashed border-cyan-300 flex justify-between items-center">
                            <span className="font-black text-xs text-cyan-900">Position {slotNum} (Sun Close)</span>
                            {assigned ? (
                              <span className="font-extrabold text-sm text-cyan-950 bg-white px-3 py-1 rounded-xl shadow-md border border-cyan-200 flex items-center gap-2">
                                <span>{assigned.emoji}</span>
                                <span>{assigned.name}</span>
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-gray-500">Empty Slot</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      onClick={(e) => {
                        // Validate correctness
                        const s1 = planetSlots.find(p => p.currentSlot === 1)?.id === "mercury";
                        const s2 = planetSlots.find(p => p.currentSlot === 2)?.id === "earth";
                        const s3 = planetSlots.find(p => p.currentSlot === 3)?.id === "mars";

                        if (s1 && s2 && s3) {
                          playSound('success');
                          triggerLocalConfetti(e);
                          setCompanionDialogue("Splendid! Solar system puzzle is perfectly solved!");
                          setTimeout(() => {
                            completeLevel();
                          }, 1000);
                        } else {
                          playSound('hit');
                          setCompanionDialogue("Oops! The planets are not in correct alignment. Try assigning Mercury to Slot 1, Earth to Slot 2, Mars to Slot 3!");
                        }
                      }}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black py-3 rounded-2xl cursor-pointer mt-4 shadow-md"
                    >
                      Check Alignment 🌌
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* LEVEL 2: STORY CREATIVE COMPLETION */}
            {activeChallengeLevel.id === 2 && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 space-y-4">
                  <h4 className="font-black text-purple-950 uppercase tracking-widest text-xs">Complete the Adventure Tale!</h4>
                  <p className="text-2xl font-bold text-purple-900 leading-relaxed">
                    "The friendly baby dragon flew over the snowy mountain peaks and found a hidden magical cave. Inside the cave, glowing quietly on a rock, was a..."
                  </p>
                </div>

                <div className="grid gap-3">
                  {[
                    "Golden box that whispered spell secrets",
                    "Tiny space telescope pointing to a new galaxy",
                    "Talking mushroom wizard who offered magical math tips"
                  ].map((optionText, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        playSound('success');
                        triggerLocalConfetti(e);
                        setCompanionDialogue(`A fantastic storyline option chosen: "${optionText}". That enhances reading comprehension!`);
                        setTimeout(() => {
                          completeLevel();
                        }, 1200);
                      }}
                      className="bg-white border-2 border-purple-200 hover:border-purple-500 p-4 rounded-2xl text-left font-extrabold text-purple-900 cursor-pointer shadow transition"
                    >
                      ✨ {optionText}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL 1: DINOSAUR DRAWING CANVAS CHALLENGE */}
            {activeChallengeLevel.id === 1 && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h4 className="font-black text-purple-950">🎨 Drawing Task</h4>
                    <p className="text-sm text-purple-800">Draw a happy dinosaur or glowing star!</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Paint brush colors */}
                    {["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"].map((c) => (
                      <button 
                        key={c}
                        onClick={() => { playSound('pop'); setCanvasStrokeColor(c); }}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer shadow-md ${
                          canvasStrokeColor === c ? "border-purple-900 scale-110" : "border-white"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <button 
                      onClick={clearCanvas}
                      className="bg-white hover:bg-gray-100 text-purple-800 px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-black shadow-sm cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border-4 border-dashed border-purple-200 p-2 shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={300}
                    onMouseDown={startDrawing}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseMove={draw}
                    className="w-full h-[300px] cursor-crosshair bg-white rounded-2xl"
                  />
                </div>

                <button 
                  onClick={submitDrawing}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-full border-4 border-white shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Paintbrush className="w-5 h-5" />
                  <span>Submit Canvas Drawing</span>
                </button>
              </div>
            )}

          </motion.div>
        )}

        {/* 5. DESTINATION REWARD CEREMONY SCREEN */}
        {gameState === "ceremony" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-100 border-4 border-yellow-400 rounded-[50px] p-8 text-center shadow-2xl space-y-6"
          >
            <div className="text-8xl select-none animate-bounce">
              🏆
            </div>
            
            <h2 className="text-4xl font-black text-amber-950">Crystal Castle Restored!</h2>
            <p className="text-lg text-amber-900 font-bold">
              Thank you, Hero {profile.childName}! By solving the magical learning challenges, the kingdom is saved!
            </p>

            {/* Rewards Card */}
            <div className="bg-white/70 p-6 rounded-3xl border-2 border-yellow-300 max-w-md mx-auto space-y-4">
              <h4 className="font-black text-amber-950 uppercase tracking-widest text-sm">Quest Rewards Claimed:</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-200">
                  <p className="text-xs font-bold text-yellow-800">Stars Earned</p>
                  <p className="text-2xl font-black text-yellow-950">+1500</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-200">
                  <p className="text-xs font-bold text-yellow-800">XP Points</p>
                  <p className="text-2xl font-black text-yellow-950">+500</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-200">
                  <p className="text-xs font-bold text-yellow-800">New Skin</p>
                  <p className="text-sm font-black text-yellow-950">Golden Dino</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playSound('success');
                  setGameState("setup");
                  setCurrentLevelId(1);
                  setStreakAnswers(0);
                }}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-full border-4 border-white shadow-lg cursor-pointer"
              >
                START A NEW QUEST 🗺️
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-full border-4 border-white shadow-lg cursor-pointer"
              >
                GO BACK TO DASHBOARD 🏠
              </motion.button>
            </div>
          </motion.div>
        )}

      </div>

      {/* Floating AI Companion Character (Sparky the Dino) */}
      {gameState !== "setup" && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-6 right-6 z-30 flex items-end gap-3 max-w-sm pointer-events-auto"
        >
          {/* Chat Bubble */}
          <div className="bg-white border-2 border-purple-300 p-4 rounded-3xl shadow-xl relative text-sm font-bold text-purple-950 leading-snug">
            <div className="absolute w-4 h-4 bg-white border-b-2 border-r-2 border-purple-300 rotate-45 bottom-4 -right-2" />
            <p className="font-semibold">"{companionDialogue}"</p>
          </div>

          {/* Animated SVG Dino Companion Avatar */}
          <div className="relative group cursor-pointer" onClick={(e) => {
            playSound('success');
            triggerLocalConfetti(e);
            setCompanionDialogue("Yay! Thanks for tapping Sparky the dinosaur explorer!");
          }}>
            <motion.svg
              viewBox="0 0 100 100"
              className="w-24 h-24 select-none drop-shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ellipse cx="50" cy="90" rx="20" ry="4" fill="rgba(0,0,0,0.15)" />
              <rect x="30" y="35" width="40" height="48" rx="20" fill="#10B981" />
              <ellipse cx="50" cy="65" rx="14" ry="16" fill="#6EE7B7" />
              <circle cx="42" cy="48" r="5" fill="white" />
              <circle cx="44" cy="47" r="2" fill="black" />
              <circle cx="58" cy="48" r="5" fill="white" />
              <circle cx="56" cy="47" r="2" fill="black" />
              <path d="M 46 56 Q 50 60 54 56" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <motion.g
                style={{ originX: "65px", originY: "58px" }}
                animate={{ rotate: [0, 30, 0, 30, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <rect x="62" y="52" width="12" height="6" rx="3" fill="#10B981" />
              </motion.g>
            </motion.svg>
          </div>
        </motion.div>
      )}

    </div>
  );
}
