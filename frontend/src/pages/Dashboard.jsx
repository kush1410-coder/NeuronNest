import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { usePoints } from "../hooks/usePoints";
import { Sparkles, Trophy, Rocket, Star, Gift } from "lucide-react";


function Cloud({ className }) {
  return (
    <svg
      viewBox="0 0 200 100"
      fill="white"
      className={className}
    >
      <circle cx="60" cy="55" r="30" />
      <circle cx="100" cy="40" r="40" />
      <circle cx="145" cy="55" r="30" />
      <rect x="50" y="55" width="100" height="30" rx="20" />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { coins, xp, storiesRead, gamesPlayed } = usePoints();
  const [recommendation, setRecommendation] = useState(null);
  const [emotion, setEmotion] = useState("happy");
  const [particles, setParticles] = useState([]);

  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'pop') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'sparkle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'rocket') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const triggerConfetti = (e) => {
    playSound('click');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const newParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: Math.random(),
      x,
      y,
      color: ["#FF62B0", "#FFD700", "#00E5FF", "#B388FF", "#80F3B4", "#FFA726"][i % 6],
      tx: (Math.random() - 0.5) * 200,
      ty: (Math.random() - 0.7) * 200 - 80,
      size: Math.random() * 10 + 6,
      rotate: Math.random() * 360,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => !newParticles.includes(p)));
    }, 1000);
  };

useEffect(() => {
  API.post("/recommendations", {
    emotion,
    memoryScore: 65,
    mathScore: 80,
    storiesRead: 5,
  })
    .then((res) => {
      setRecommendation(res.data);
    })
    .catch(console.error);
}, [emotion]);
  const cards = [
    {
      title: "Magic Stories",
      subtitle: "Create magical AI adventures",
      emoji: "📖",
      route: "/story",
    },
    {
      title: "Brain Games",
      subtitle: "Train your super brain",
      emoji: "🧠",
      route: "/games",
    },
    {
      title: "Rewards",
      subtitle: "Unlock fun prizes",
      emoji: "🏆",
      route: "/rewards",
    },
    {
      title: "Emotion Center",
      subtitle: "Track feelings & mood",
      emoji: "😊",
      route: "/emotion",
    },
    {
      title: "Speech Quest",
      subtitle: "Speak & spell with voice magic 🎙️",
      emoji: "🎙️",
      route: "/speech-quest",
    },
    {
      title: "Treasure Hunter",
      subtitle: "Find objects in the real world 🔍",
      emoji: "🔍",
      route: "/treasure-hunter",
    }
  ];

  const activeChild = (() => {
    try {
      return JSON.parse(localStorage.getItem("activeChild") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const childName = activeChild.name || "Aarav";

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Dynamic Interactive Sparkle/Confetti Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
            animate={{
              opacity: 0,
              scale: 0.2,
              x: p.x + p.tx,
              y: p.y + p.ty,
              rotate: p.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              left: 0,
              top: 0,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-yellow-100 to-cyan-200" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_60%)]" />

      <div className="absolute top-20 left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[140px]" />
      <div className="absolute top-40 right-1/3 w-80 h-80 bg-yellow-300/30 rounded-full blur-[120px]" />

      {/* Clouds */}
      <Cloud className="cloud cloud1 absolute w-48 opacity-60" />
      <Cloud className="cloud cloud2 absolute w-32 opacity-40" />
      <Cloud className="cloud cloud3 absolute w-56 opacity-50" />
      <Cloud className="cloud cloud4 absolute w-40 opacity-60" />

      {/* Particles */}
      {[...Array(25)].map((_, i) => {
        const templates = ["✨", "🎈", "🌟", "🌸", "🫧", "⭐", "🌈", "🧩"];
        const size = Math.random() * 20 + 15;
        const emoji = templates[i % templates.length];
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-50px`,
              fontSize: `${size}px`,
              opacity: Math.random() * 0.4 + 0.3,
            }}
            animate={{
              y: ["0vh", "-110vh"],
              x: ["0px", `${(Math.random() - 0.5) * 120}px`],
              rotate: [0, 360],
            }}
            transition={{
              duration: 12 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-5xl font-black text-white drop-shadow-lg">
              NeuroNest Kids
            </h1>

            <p className="text-white/90 text-xl mt-2">
              Learn • Play • Grow ✨
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl font-bold">
              ⭐ {xp} XP
            </div>

            <div className="bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-xl font-bold">
              🪙 {coins} Coins
            </div>
          </div>
        </div>

        {/* Magical Redesigned Hero */}
        <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/20 backdrop-blur-md rounded-[50px] p-8 md:p-12 border border-white/30 shadow-[0_30px_100px_rgba(255,255,255,0.2)] relative overflow-hidden">
          
          {/* Glowing Rainbow Backlight inside card */}
          <div className="absolute -inset-10 bg-gradient-to-tr from-purple-400/20 via-pink-400/20 to-cyan-300/20 rounded-[50px] blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '6s' }} />

          {/* Left Column: Interactive Greetings & Call to Action */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            
            {/* Playful Welcome Text */}
            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="inline-flex items-center gap-2 bg-purple-500/25 px-4 py-1.5 rounded-full text-purple-900 font-bold text-sm uppercase tracking-wider border border-purple-300/35"
              >
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Adventure Mode Active</span>
              </motion.div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1 text-5xl md:text-6xl font-black text-white tracking-wide select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                {"Welcome Back,".split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-flex">
                    {word.split("").map((letter, lIdx) => (
                      <motion.span
                        key={lIdx}
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: (wIdx * 5 + lIdx) * 0.08,
                          ease: "easeInOut"
                        }}
                        className="inline-block hover:text-yellow-300 transition-colors"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </div>
            </div>

            {/* Child Name Section */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <motion.h2 
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_5px_15px_rgba(244,63,94,0.3)] pr-2"
              >
                {childName}
              </motion.h2>
              
              {/* Animated Mascot Beside Name */}
              <motion.div
                whileHover={{ scale: 1.3, rotate: 15 }}
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                onClick={(e) => {
                  playSound('sparkle');
                  triggerConfetti(e);
                }}
                className="cursor-pointer text-5xl md:text-6xl select-none"
              >
                🦕
              </motion.div>
            </div>

            <p className="text-xl md:text-2xl text-purple-950/80 font-medium">
              Ready for a magical adventure today? Choose a game or story below! 🗺️✨
            </p>

            {/* Redesigned Glowing Adventure Action Button */}
            <div className="relative inline-block group pt-4">
              {/* Outer button glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <motion.button
                onClick={(e) => {
                  playSound('rocket');
                  triggerConfetti(e);
                  setTimeout(() => {
                    navigate("/games");
                  }, 400);
                }}
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: "0 0 35px rgba(236,72,153,0.8)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-6 rounded-full text-white text-2xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 border-4 border-white/60 shadow-2xl flex items-center gap-4 cursor-pointer select-none"
              >
                <motion.span
                  animate={{ 
                    x: [0, 4, 0, -2, 0],
                    y: [0, -3, 0, 2, 0]
                  }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-3xl"
                >
                  🚀
                </motion.span>
                <span className="tracking-wide">START ADVENTURE</span>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </motion.button>
            </div>
          </div>

          {/* Right Column: Cartoon Mascot & Floating Mini Achievements/Rewards */}
          <div className="flex-1 w-full flex justify-center items-center relative py-6">
            
            {/* Outer magical backdrop elements */}
            <div className="absolute w-72 h-72 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-[60px]" />
            
            {/* The Floating Island base card */}
            <div className="relative bg-white/40 backdrop-blur-md rounded-[40px] p-6 border border-white/50 shadow-xl flex flex-col items-center">
              
              {/* Interactive Daily Reward Bubble */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                onClick={(e) => {
                  playSound('pop');
                  triggerConfetti(e);
                }}
                className="absolute -top-12 -left-8 bg-gradient-to-tr from-yellow-300 to-amber-400 text-amber-950 p-4 rounded-3xl shadow-xl border border-white/60 cursor-pointer flex flex-col items-center select-none"
              >
                <Gift className="w-8 h-8 animate-bounce text-red-500" />
                <span className="text-xs font-black uppercase mt-1">Claim Me!</span>
              </motion.div>

              {/* Interactive Trophy */}
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                whileHover={{ scale: 1.2, rotate: 180 }}
                onClick={(e) => {
                  playSound('sparkle');
                  triggerConfetti(e);
                }}
                className="absolute -top-14 -right-8 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white p-4 rounded-3xl shadow-xl border border-white/60 cursor-pointer flex flex-col items-center select-none"
              >
                <Trophy className="w-8 h-8 text-yellow-300 animate-pulse" />
                <span className="text-xs font-black uppercase mt-1">Trophy</span>
              </motion.div>

              {/* Animated Mascot (Cute Space Dino) */}
              <div className="relative cursor-pointer" onClick={(e) => {
                playSound('sparkle');
                triggerConfetti(e);
              }}>
                <motion.svg
                  viewBox="0 0 100 100"
                  className="w-48 h-48 select-none"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Base Island Shadow */}
                  <ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.15)" />
                  
                  {/* Dino Body */}
                  <rect x="25" y="28" width="50" height="58" rx="25" fill="#4ADE80" />
                  
                  {/* Tail */}
                  <path d="M 26 74 Q 4 80 14 58 Q 26 58 26 74" fill="#4ADE80" />
                  
                  {/* Belly */}
                  <ellipse cx="50" cy="65" rx="18" ry="20" fill="#86EFAC" />
                  
                  {/* Big Friendly Eyes */}
                  <g>
                    {/* Left Eye */}
                    <circle cx="40" cy="45" r="7.5" fill="white" />
                    <circle cx="42" cy="43" r="3.5" fill="black" />
                    <circle cx="44" cy="41" r="1.5" fill="white" />
                    {/* Right Eye */}
                    <circle cx="60" cy="45" r="7.5" fill="white" />
                    <circle cx="58" cy="43" r="3.5" fill="black" />
                    <circle cx="60" cy="41" r="1.5" fill="white" />
                    
                    {/* Cheeks */}
                    <circle cx="33" cy="53" r="4.5" fill="#F43F5E" opacity="0.6" />
                    <circle cx="67" cy="53" r="4.5" fill="#F43F5E" opacity="0.6" />
                  </g>

                  {/* Dino Spikes */}
                  <polygon points="32,28 27,18 40,24" fill="#FBBF24" />
                  <polygon points="45,24 43,12 53,21" fill="#FBBF24" />
                  <polygon points="57,24 58,12 68,25" fill="#FBBF24" />

                  {/* Smile */}
                  <path d="M 45 55 Q 50 60 55 55" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />

                  {/* Cute Waving Arm */}
                  <motion.g
                    style={{ originX: "68px", originY: "58px" }}
                    animate={{ rotate: [0, 45, 0, 45, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                  >
                    <rect x="65" y="52" width="16" height="8" rx="4" fill="#4ADE80" />
                  </motion.g>
                  
                  {/* Left Arm holding a small flower or star */}
                  <rect x="18" y="52" width="12" height="8" rx="4" fill="#34D399" />
                </motion.svg>
              </div>

              {/* Floating Stars underneath Mascot */}
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2 + s, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    onClick={(e) => {
                      playSound('sparkle');
                      triggerConfetti(e);
                    }}
                    className="cursor-pointer text-yellow-400 text-xl filter drop-shadow-[0_2px_5px_rgba(250,204,21,0.5)]"
                  >
                    ⭐
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">

          {cards.map((card) => (
            <motion.div
              key={card.title}
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
              onClick={() => navigate(card.route)}
              className="
              cursor-pointer
              bg-white/25
              backdrop-blur-2xl
              border
              border-white/40
              rounded-[40px]
              p-10
              shadow-[0_15px_50px_rgba(255,255,255,0.25)]
              text-center
              "
            >
              <div className="text-7xl mb-5">
                {card.emoji}
              </div>

              <h2 className="text-3xl font-black">
                {card.title}
              </h2>

              <p className="mt-3 text-gray-700">
                {card.subtitle}
              </p>

              <button
                className="
                mt-8
                bg-white
                px-8
                py-3
                rounded-full
                font-bold
                shadow-lg
                "
              >
                Open
              </button>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div
          className="
          mt-20
          bg-white/25
          backdrop-blur-2xl
          rounded-[40px]
          p-10
          border
          border-white/40
          shadow-2xl
          "
        >
          <h2 className="text-4xl font-black mb-8">
            Today's Progress ⭐
          </h2>

          <div className="grid md:grid-cols-4 gap-5">

            <div className="bg-pink-100/80 rounded-3xl p-6 text-center">
              <div className="text-5xl">📚</div>
              <h3 className="font-bold mt-3">{storiesRead} {storiesRead === 1 ? "Story" : "Stories"}</h3>
            </div>

            <div className="bg-blue-100/80 rounded-3xl p-6 text-center">
              <div className="text-5xl">🧠</div>
              <h3 className="font-bold mt-3">{gamesPlayed} {gamesPlayed === 1 ? "Game" : "Games"}</h3>
            </div>

            <div className="bg-green-100/80 rounded-3xl p-6 text-center">
              <div className="text-5xl">😊</div>
              <h3 className="font-bold mt-3 capitalize">
  {emotion} Mood
</h3>
            </div>

            <div className="bg-yellow-100/80 rounded-3xl p-6 text-center">
              <div className="text-5xl">🏆</div>
              <h3 className="font-bold mt-3">Level {Math.floor(xp / 100) + 1}</h3>
            </div>

          </div>
          <div
  className="
  mt-10
  bg-white/20
  backdrop-blur-xl
  rounded-[30px]
  p-6
  "
>
  <h2 className="text-2xl font-black">
    😊 How are you feeling today?
  </h2>

  <div className="flex flex-wrap gap-3 mt-4">

    <button
  onClick={() => setEmotion("happy")}
  className={`
    px-5 py-2 rounded-full
    ${emotion === "happy"
      ? "bg-yellow-400 text-white"
      : "bg-yellow-100"}
  `}
>
  😀 Happy
</button>

<button
  onClick={() => setEmotion("calm")}
  className={`
    px-5 py-2 rounded-full
    ${emotion === "calm"
      ? "bg-blue-400 text-white"
      : "bg-blue-100"}
  `}
>
  😌 Calm
</button>

<button
  onClick={() => setEmotion("excited")}
  className={`
    px-5 py-2 rounded-full
    ${emotion === "excited"
      ? "bg-pink-500 text-white"
      : "bg-pink-100"}
  `}
>
  🤩 Excited
</button>

<button
  onClick={() => setEmotion("curious")}
  className={`
    px-5 py-2 rounded-full
    ${emotion === "curious"
      ? "bg-purple-500 text-white"
      : "bg-purple-100"}
  `}
>
  🤔 Curious
</button>

  </div>
</div>
          {recommendation && (
  <div
    className="
    mt-12
    bg-white/25
    backdrop-blur-2xl
    rounded-[40px]
    p-10
    border
    border-white/40
    shadow-2xl
    "
  >
    <h2 className="text-4xl font-black mb-6">
      🤖 AI Learning Coach
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-blue-100/80 rounded-3xl p-6">
        <h3 className="font-black text-xl">
          🎮 Recommended Game
        </h3>

        <p className="mt-3 text-lg">
          {recommendation.game}
        </p>
      </div>

      <div className="bg-pink-100/80 rounded-3xl p-6">
        <h3 className="font-black text-xl">
          📖 Recommended Story
        </h3>

        <p className="mt-3 text-lg">
          {recommendation.story}
        </p>
      </div>

      <div className="bg-green-100/80 rounded-3xl p-6">
        <h3 className="font-black text-xl">
          🧠 Why?
        </h3>

        <p className="mt-3 text-lg">
          {recommendation.reason}
        </p>
      </div>

    </div>
  </div>
)}
        </div>

      </div>
    </div>
    
  );
}