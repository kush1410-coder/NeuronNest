import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { usePoints } from "../hooks/usePoints";

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
  const [recommendation, setRecommendation] =
  useState(null);
  const [emotion, setEmotion] = useState("happy");
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

        {/* Hero */}
        <div className="text-center mt-24">

          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-7xl font-black text-white drop-shadow-xl"
          >
            Welcome Back,
          </motion.h1>

          <h2 className="text-6xl font-black mt-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {childName} 👋
          </h2>

          <p className="text-2xl mt-5 text-gray-700">
            Ready for a magical adventure today?
          </p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="
            mt-8
            px-12
            py-5
            rounded-full
            text-white
            text-xl
            font-bold
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            shadow-[0_15px_50px_rgba(236,72,153,0.4)]
            "
          >
            🚀 Start Adventure
          </motion.button>
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