import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { usePoints } from "../hooks/usePoints";

const EMOTIONAL_SETS = [
  { base: "🐱", odd: "🐶" },
  { base: "🍔", odd: "🍟" },
  { base: "🍎", odd: "🍏" },
  { base: "⭐", odd: "🌟" },
  { base: "🐒", odd: "🦍" },
  { base: "🚗", odd: "🚓" },
  { base: "⚽", odd: "🏀" },
  { base: "🍉", odd: "🍈" }
];

export default function FocusFinder() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState("start"); // start, playing, gameover
  const [gridSize, setGridSize] = useState(9); // 3x3 initially
  const [gridItems, setGridItems] = useState([]);
  const [oddIndex, setOddIndex] = useState(-1);
  const [pointsGiven, setPointsGiven] = useState(false);

  const playSound = (freq, type = "sine", duration = 0.2) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setGameState("playing");
    setPointsGiven(false);
    generateNextLevel(0);
  };

  const generateNextLevel = (currentScore) => {
    const size = currentScore >= 8 ? 16 : 9; // Increase grid to 4x4 if score is high
    setGridSize(size);

    const set = EMOTIONAL_SETS[Math.floor(Math.random() * EMOTIONAL_SETS.length)];
    const items = Array(size).fill(set.base);
    const oddIdx = Math.floor(Math.random() * size);
    items[oddIdx] = set.odd;

    setGridItems(items);
    setOddIndex(oddIdx);
  };

  const handleItemClick = (index) => {
    if (gameState !== "playing") return;

    if (index === oddIndex) {
      playSound(550, "sine", 0.1);
      const nextScore = score + 1;
      setScore(nextScore);
      // Give a small time bonus
      setTimeLeft(t => Math.min(25, t + 1));
      generateNextLevel(nextScore);
    } else {
      playSound(150, "sawtooth", 0.3);
      // Deduct time on mistakes
      setTimeLeft(t => Math.max(0, t - 3));
    }
  };

  // Timer loop
  useEffect(() => {
    if (gameState === "playing") {
      if (timeLeft <= 0) {
        setGameState("gameover");
        playSound(200, "triangle", 0.5);
        if (score >= 6 && !pointsGiven) {
          earnPoints(20, 25);
          setPointsGiven(true);
        }
        return;
      }

      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-indigo-100 to-pink-200 p-8 relative overflow-hidden flex flex-col justify-between">
      {gameState === "gameover" && score >= 6 && <Confetti numberOfPieces={100} />}

      {/* Top Navbar */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition"
        >
          ⬅️ Back to Games
        </button>
        <div className="flex gap-4">
          <span className="bg-white/80 px-4 py-2 text-purple-950 rounded-full font-black text-sm shadow-md">
            ⏰ Time: {timeLeft}s
          </span>
          <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-md">
            ⭐ Score: {score}
          </span>
        </div>
      </div>

      {/* Board Container */}
      <div className="max-w-md mx-auto w-full bg-white/50 backdrop-blur-xl border border-white/40 rounded-[45px] p-8 shadow-2xl z-10 text-center flex flex-col justify-between my-4 grow max-h-[600px]">
        
        <div>
          <h1 className="text-4xl font-black text-purple-950">
            🔍 Focus Finder
          </h1>
          <p className="text-purple-800 font-extrabold text-xs mt-1">
            Locate the single odd emoji in the grid as fast as you can! ⏰
          </p>
        </div>

        {/* Display Grid Board */}
        <div className="my-6 grow flex items-center justify-center">
          {gameState === "start" ? (
            <div className="space-y-4">
              <span className="text-7xl block animate-bounce">🔍</span>
              <p className="font-extrabold text-purple-900 px-4">Find at least 6 odd emojis to win rewards!</p>
              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-full shadow-lg cursor-pointer"
              >
                ▶ Start Hunting
              </button>
            </div>
          ) : gameState === "playing" ? (
            <div className={`grid gap-3 w-full max-w-[280px] aspect-square ${gridSize === 9 ? "grid-cols-3" : "grid-cols-4"}`}>
              {gridItems.map((emoji, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleItemClick(idx)}
                  className="bg-white border-2 border-purple-100 rounded-2xl flex items-center justify-center text-4xl aspect-square shadow hover:shadow-md cursor-pointer hover:bg-purple-50/50"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-6xl block">🏆</span>
              <h2 className="text-3xl font-black text-purple-950">Round Over!</h2>
              <p className="text-lg font-bold text-purple-800">
                You found <span className="text-purple-600 font-black">{score}</span> odd ones!
              </p>
              {score >= 6 ? (
                <div className="p-3 bg-green-50 rounded-2xl border border-green-200">
                  <p className="font-black text-emerald-600 text-sm">
                    Amazing! Earned <span className="text-orange-500">🪙 +20 Coins</span> and <span className="text-yellow-600">⭐ +25 XP</span>!
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-bold">Goal is to score at least 6. Try again!</p>
              )}
              <button
                onClick={startGame}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-full shadow-md cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="text-xs font-bold text-purple-900/40 uppercase tracking-wide">
          Goal Score: 6+ to unlock rewards
        </div>

      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/60 z-10">
        🏆 Focus Finder strengthens parietal visual search and speed motor reflex logic.
      </div>
    </div>
  );
}
