import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { usePoints } from "../hooks/usePoints";

export default function RewardsPage() {
  const navigate = useNavigate();
  const { coins, xp, unlockedRewards, spendCoins, unlockReward } = usePoints();

  const [unlockedSuccess, setUnlockedSuccess] = useState(null);
  const [warningMsg, setWarningMsg] = useState("");

  const rewards = [
    { emoji: "🎩", title: "Magic Hat", cost: 100, color: "from-blue-400 to-indigo-500", desc: "Wear a sorcerer's wizard hat!" },
    { emoji: "🦄", title: "Unicorn Friend", cost: 250, color: "from-pink-400 to-rose-500", desc: "A mythical magical sidekick avatar!" },
    { emoji: "🚀", title: "Rocket Booster", cost: 150, color: "from-amber-400 to-orange-500", desc: "Increases your profile level speed!" },
    { emoji: "👑", title: "King Crown", cost: 500, color: "from-yellow-400 to-yellow-600", desc: "Show your royal neuro-mastery status!" },
    { emoji: "🛸", title: "Alien Space Ship", cost: 300, color: "from-teal-400 to-emerald-500", desc: "A cosmic ride across the solar system!" },
    { emoji: "🥚", title: "Baby Dragon Egg", cost: 400, color: "from-red-400 to-orange-600", desc: "Hatch a legendary fire dragon pet!" },
    { emoji: "🪄", title: "Rainbow Wand", cost: 200, color: "from-purple-400 to-fuchsia-500", desc: "Cast visual magic spells on pages!" },
    { emoji: "🦸", title: "Super Brain Cape", cost: 350, color: "from-cyan-400 to-blue-600", desc: "A sleek flying cape for hyper-focus!" },
  ];

  const playSound = (freq, type = "sine", duration = 0.25) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleUnlock = (reward) => {
    if (unlockedRewards.includes(reward.title)) {
      playSound(350, "sine", 0.15);
      setUnlockedSuccess(reward);
      return;
    }

    if (coins >= reward.cost) {
      spendCoins(reward.cost);
      unlockReward(reward.title);
      playSound(523.25, "sine", 0.15); // Win chime C5
      setTimeout(() => playSound(659.25, "sine", 0.15), 100); // E5
      setTimeout(() => playSound(783.99, "sine", 0.3), 200); // G5
      setUnlockedSuccess(reward);
    } else {
      playSound(150, "sawtooth", 0.35); // Sad buzzer sound
      setWarningMsg(`You need ${reward.cost - coins} more coins to unlock this!`);
      setTimeout(() => setWarningMsg(""), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-200 p-8 relative overflow-hidden pb-16">
      
      {unlockedSuccess && <Confetti numberOfPieces={120} />}

      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {["🌸", "👑", "✨", "🎁"][i % 4]}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Navigation Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition-all cursor-pointer"
          >
            🏠 Back to Dashboard
          </button>
          
          <button
            onClick={() => navigate("/games")}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-full shadow-md transition-all cursor-pointer"
          >
            🎮 Go to Brain Games
          </button>
        </div>

        {/* Hero */}
        <div className="text-center mt-6">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="text-[120px] inline-block filter drop-shadow-lg select-none"
          >
            🏆
          </motion.div>

          <h1 className="text-6xl font-black text-purple-950 drop-shadow-md">
            Reward Kingdom
          </h1>

          <p className="text-xl text-purple-900 font-bold mt-2 max-w-xl mx-auto">
            Trade your hard-earned puzzle coins to unlock legendary avatar accessories and companion pets! 🎁
          </p>
        </div>

        {/* Dynamic Coins Stats Badge */}
        <div className="flex justify-center mt-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-xl border border-white/50 px-10 py-4 rounded-full shadow-lg text-2xl font-black text-purple-950 flex items-center gap-3"
          >
            <span>🪙</span> {coins} Coins
          </motion.div>
        </div>

        {/* Shaking Coins Warning Panel */}
        <AnimatePresence>
          {warningMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: [0, -10, 10, -10, 10, 0] }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto mt-6 bg-red-100 border-2 border-red-300 rounded-2xl p-4 text-center text-red-800 font-extrabold shadow-lg"
            >
              ⚠️ {warningMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rewards Store Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
          {rewards.map((reward) => {
            const isUnlocked = unlockedRewards.includes(reward.title);
            return (
              <motion.div
                key={reward.title}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`
                  bg-white/40 backdrop-blur-xl rounded-[35px] p-6 border shadow-xl text-center flex flex-col justify-between transition-all duration-300
                  ${isUnlocked ? "border-emerald-300 bg-emerald-50/20" : "border-white/50"}
                `}
              >
                <div>
                  <div className="text-8xl p-3 bg-purple-50/20 rounded-3xl mb-3 select-none">
                    {reward.emoji}
                  </div>

                  <h2 className="text-2xl font-black text-purple-950">
                    {reward.title}
                  </h2>
                  
                  <p className="text-xs text-purple-900/60 font-bold mt-1.5 leading-relaxed min-h-[32px]">
                    {reward.desc}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 bg-yellow-250/20 px-4 py-1.5 rounded-full border border-yellow-250/30 text-purple-950 font-black text-sm">
                    <span>🪙</span> {reward.cost} Coins
                  </div>
                </div>

                <button
                  onClick={() => handleUnlock(reward)}
                  className={`
                    mt-6 w-full py-3 rounded-2xl text-white font-black text-base transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md
                    ${
                      isUnlocked
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-105"
                        : coins >= reward.cost
                        ? `bg-gradient-to-r ${reward.color} hover:brightness-105`
                        : "bg-gray-400 text-gray-200 cursor-not-allowed hover:bg-gray-400"
                    }
                  `}
                >
                  {isUnlocked ? "✨ Unlocked • Wear" : "🔒 Unlock Reward"}
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Unlock Success Modal Overlay */}
      <AnimatePresence>
        {unlockedSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-300 p-8 rounded-[45px] max-w-sm w-full text-center shadow-2xl space-y-6"
            >
              <div className="text-[120px] select-none filter drop-shadow-md animate-bounce">
                {unlockedSuccess.emoji}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-yellow-900">Magical Unlock!</h3>
                <p className="font-extrabold text-purple-950 text-base">
                  You successfully unlocked the <span className="text-pink-600 font-black">{unlockedSuccess.title}</span> accessory! 🎉
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <span className="text-xs font-black text-purple-900 uppercase">Equipped to aarav</span>
              </div>

              <button
                onClick={() => setUnlockedSuccess(null)}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition cursor-pointer"
              >
                Wonderful! Let's Go
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}