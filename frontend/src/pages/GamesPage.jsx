import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePoints } from "../hooks/usePoints";

export default function GamesPage() {
  const navigate = useNavigate();
  const { coins, xp } = usePoints();

  const games = [
    {
      emoji: "🧠",
      title: "Memory Match",
      description: "Find card pairs to boost cognitive recall!",
      xp: 20,
      coins: 10,
      route: "/memory-match",
      color: "from-blue-400 to-indigo-500",
    },
    {
      emoji: "😀",
      title: "Emoji Hunt",
      description: "Quick reflex puzzle. Speed-match emojis!",
      xp: 15,
      coins: 8,
      route: "/emoji-match",
      color: "from-pink-400 to-rose-500",
    },
    {
      emoji: "🐘",
      title: "Animal Quiz",
      description: "Explore the wild world with fun animal trivia!",
      xp: 25,
      coins: 15,
      route: "/animal-quiz",
      color: "from-emerald-400 to-teal-500",
    },
    {
      emoji: "➕",
      title: "Math Wizard",
      description: "Master magical numbers and spell equations!",
      xp: 30,
      coins: 20,
      route: "/math-wizard",
      color: "from-amber-400 to-orange-500",
    },
    {
      emoji: "🔠",
      title: "Word Explorer",
      description: "Unscramble mixed up letters to name object clues!",
      xp: 25,
      coins: 15,
      route: "/word-explorer",
      color: "from-purple-400 to-fuchsia-500",
    },
    {
      emoji: "🎨",
      title: "Pattern Master",
      description: "Repeat the beautiful glowing sequence memory trails!",
      xp: 30,
      coins: 20,
      route: "/pattern-master",
      color: "from-cyan-400 to-blue-500",
    },
    {
      emoji: "🚀",
      title: "Planet Lander",
      description: "Balance spaceship thrusters to land safely!",
      xp: 30,
      coins: 25,
      route: "/planet-lander",
      color: "from-violet-500 to-purple-800",
    },
    {
      emoji: "🔍",
      title: "Focus Finder",
      description: "Spot the single odd emoji in the grid under pressure!",
      xp: 25,
      coins: 20,
      route: "/focus-finder",
      color: "from-teal-400 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 pb-16">
      
      {/* Decorative Floating Spheres */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 text-xl pointer-events-none opacity-40"
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
          ✨
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Back navigation and Dashboard Button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            🏠 Back to Dashboard
          </button>
          
          <button
            onClick={() => navigate("/rewards")}
            className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-black rounded-full shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            🏆 Go to Reward Kingdom
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mt-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-[120px] inline-block filter drop-shadow-lg"
          >
            🧠
          </motion.div>

          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent drop-shadow-sm">
            Brain Academy
          </h1>

          <p className="text-purple-950 font-extrabold text-xl mt-3 max-w-xl mx-auto">
            Play fun brain games, sharpen your super mind, and collect coins to buy magical prizes! 🚀
          </p>
        </div>

        {/* Dynamic points/stats bar */}
        <div className="flex justify-center gap-6 mt-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 px-8 py-3.5 rounded-full shadow-lg font-black text-xl text-purple-900 flex items-center gap-2">
            <span>⭐</span> {xp} XP
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 px-8 py-3.5 rounded-full shadow-lg font-black text-xl text-purple-900 flex items-center gap-2">
            <span>🪙</span> {coins} Coins
          </div>
        </div>

        {/* Core Game Roster Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {games.map((game) => (
            <motion.div
              key={game.title}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[35px] p-6 shadow-xl flex flex-col justify-between"
            >
              <div className="text-center flex flex-col items-center">
                <div className="text-7xl p-4 rounded-3xl bg-purple-50 border border-purple-100/50 mb-4 select-none">
                  {game.emoji}
                </div>

                <h2 className="text-2xl font-black text-purple-950">
                  {game.title}
                </h2>

                <p className="mt-3 text-purple-900/80 font-bold text-sm leading-relaxed min-h-[48px]">
                  {game.description}
                </p>

                <div className="flex gap-2.5 mt-5">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-extrabold text-xs">
                    ⭐ {game.xp} XP
                  </span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-extrabold text-xs">
                    🪙 {game.coins} Coins
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(game.route)}
                className={`
                  mt-8 w-full py-3.5 rounded-2xl text-white font-black text-base shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer
                  bg-gradient-to-r ${game.color} hover:brightness-105 hover:shadow-purple-500/20
                `}
              >
                ▶ Play Game
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}