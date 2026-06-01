import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  const previewCards = [
    { emoji: "📖", title: "Magic Stories", desc: "Co-create custom AI fairy tales matching your mood and language!", color: "from-amber-400 to-orange-500 shadow-orange-500/20" },
    { emoji: "🧠", title: "Brain Games", desc: "8+ interactive puzzles to train calculation, attention, and memory recall!", color: "from-blue-400 to-indigo-500 shadow-indigo-500/20" },
    { emoji: "📷", title: "Emotion Hunter", desc: "Live webcam AI expression scanner tracks mood metrics and suggests tasks!", color: "from-pink-400 to-rose-500 shadow-rose-500/20" },
    { emoji: "🏆", title: "Reward Kingdom", desc: "Win coins during brain training to unlock magical custom items!", color: "from-yellow-400 to-yellow-600 shadow-yellow-500/20" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-cyan-100 flex flex-col justify-between relative overflow-hidden pb-12">
      
      {/* Dynamic drifting background particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [0.9, 1.1, 0.9],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + Math.random() * 6,
            }}
          >
            {["✨", "🎈", "🚀", "🪐", "🧸"][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Floating abstract backdrop blobs */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] bg-pink-300/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main hero space */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 flex flex-col items-center justify-center text-center grow">
        
        {/* Title Group */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <motion.span 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-8xl inline-block select-none"
          >
            🦉
          </motion.span>
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-purple-800 via-pink-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm leading-tight">
            NeuroNest Kids
          </h1>
          <p className="text-xl md:text-2xl text-purple-950 font-black tracking-wide">
            Learn • Play • Grow • Feel ✨
          </p>
        </motion.div>

        {/* Dynamic description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-purple-900/80 font-bold text-lg md:text-xl mt-6 leading-relaxed"
        >
          A beautiful cognitive growth ecosystem for kids. Boost calculation, logical recall, and emotional recognition using state-of-the-art interactive gamification and AI-guided storytelling!
        </motion.p>

        {/* Buttons Action bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mt-12 w-full max-w-lg"
        >
          <button
            onClick={() => navigate("/kid-gate")}
            className="flex-1 px-8 py-5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-2xl rounded-3xl shadow-[0_15px_35px_rgba(219,39,119,0.35)] hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            🚀 Launch Kid Universe
          </button>

          <button
            onClick={() => navigate("/login")}
            className="flex-1 px-8 py-5 bg-white hover:bg-purple-50 text-purple-950 border-3 border-purple-300 font-black text-2xl rounded-3xl shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            🛡️ Enter Parent Portal
          </button>
        </motion.div>

        {/* Interactive Feature Previews grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-20">
          {previewCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[35px] p-6 shadow-xl text-center flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <span className="text-6xl p-3 bg-purple-50/10 rounded-3xl inline-block mb-3 select-none">{card.emoji}</span>
                <h3 className="text-xl font-black text-purple-950 mt-1">{card.title}</h3>
                <p className="text-sm font-bold text-purple-900/70 mt-2 leading-relaxed">{card.desc}</p>
              </div>
              <div className={`mt-5 w-full h-2 rounded-full bg-gradient-to-r ${card.color} shadow-lg`} />
            </motion.div>
          ))}
        </div>

      </div>

      {/* Footer copyright */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-12 py-2 text-xs font-bold text-purple-950/40">
        © 2026 NeuroNest Kids Academy. Empowering cognitive development, empathy, and early child mental growth.
      </div>

    </div>
  );
}