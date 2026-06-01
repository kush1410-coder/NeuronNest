import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { usePoints } from "../hooks/usePoints";

const WORD_LIST = [
  { word: "LION", emoji: "🦁", clue: "King of the jungle!" },
  { word: "PANDA", emoji: "🐼", clue: "Loves to eat green bamboo leaves!" },
  { word: "FROG", emoji: "🐸", clue: "Loves hopping around ponds!" },
  { word: "KOALA", emoji: "🐨", clue: "Clings to Eucalyptus trees!" },
  { word: "TIGER", emoji: "🐯", clue: "Has beautiful orange and black stripes!" },
  { word: "MONKEY", emoji: "🐒", clue: "Enjoys hanging from trees!" },
];

export default function WordExplorer() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();
  const [level, setLevel] = useState(0);
  const [currentWordObj, setCurrentWordObj] = useState(WORD_LIST[0]);
  const [mixedLetters, setMixedLetters] = useState([]);
  const [userGuess, setUserGuess] = useState([]);
  const [won, setWon] = useState(false);
  const [pointsGiven, setPointsGiven] = useState(false);

  useEffect(() => {
    setupWord(WORD_LIST[level % WORD_LIST.length]);
  }, [level]);

  const setupWord = (wordObj) => {
    setCurrentWordObj(wordObj);
    setUserGuess([]);
    setWon(false);
    setPointsGiven(false);
    
    // Scramble letters
    const letters = wordObj.word.split("").map((char, index) => ({
      char,
      originalIndex: index,
      uniqueId: `${char}-${index}-${Math.random()}`
    }));
    
    // Ensure it's shuffled
    let shuffled = [...letters].sort(() => Math.random() - 0.5);
    while (shuffled.map(l => l.char).join("") === wordObj.word) {
      shuffled = [...letters].sort(() => Math.random() - 0.5);
    }
    setMixedLetters(shuffled);
  };

  const playSound = (freq, type, duration) => {
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

  const handleLetterClick = (letterObj, fromGuess) => {
    if (won) return;
    playSound(400 + (userGuess.length * 80), "sine", 0.1);

    if (fromGuess) {
      setUserGuess(prev => prev.filter(l => l.uniqueId !== letterObj.uniqueId));
      setMixedLetters(prev => [...prev, letterObj]);
    } else {
      setMixedLetters(prev => prev.filter(l => l.uniqueId !== letterObj.uniqueId));
      const newGuess = [...userGuess, letterObj];
      setUserGuess(newGuess);

      // Check if guess matches the word
      if (newGuess.map(l => l.char).join("") === currentWordObj.word) {
        setWon(true);
        playSound(600, "triangle", 0.15);
        setTimeout(() => playSound(800, "sine", 0.3), 150);
        if (!pointsGiven) {
          earnPoints(15, 25);
          setPointsGiven(true);
        }
      }
    }
  };

  const nextWord = () => {
    setLevel(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200 p-8 relative overflow-hidden flex flex-col justify-between">
      {won && <Confetti numberOfPieces={120} />}
      
      {/* Decorative background shapes */}
      <div className="absolute top-10 left-10 w-44 h-44 bg-purple-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-pink-400/20 rounded-full blur-2xl" />

      {/* Top Navbar */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition"
        >
          ⬅️ Back to Games
        </button>
        <div className="flex gap-4">
          <span className="bg-yellow-150 px-4 py-2 border-2 border-yellow-300 text-yellow-900 rounded-full font-black text-sm">
            ⭐ Level {level + 1}
          </span>
        </div>
      </div>

      {/* Main Area */}
      <div className="max-w-3xl mx-auto w-full bg-white/50 backdrop-blur-xl border border-white/40 rounded-[40px] p-8 shadow-2xl z-10 text-center flex flex-col justify-between my-4 grow max-h-[680px]">
        
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-purple-950 flex items-center justify-center gap-3">
            🔠 Word Explorer
          </h1>
          <p className="text-purple-800 font-extrabold text-sm md:text-base mt-2">
            Arrange the mixed-up letters to spell the secret word! 🗺️
          </p>
        </div>

        {/* Word Display Area */}
        <div className="my-6">
          <motion.div 
            animate={{ scale: won ? [1, 1.1, 1] : 1 }}
            className="text-[120px] filter drop-shadow-md select-none"
          >
            {currentWordObj.emoji}
          </motion.div>
          
          <div className="bg-purple-100/50 border border-purple-200/50 rounded-2xl p-4 inline-block max-w-md">
            <span className="font-extrabold text-purple-950 text-base">Clue: </span>
            <span className="font-bold text-purple-900">{currentWordObj.clue}</span>
          </div>
        </div>

        {/* User Guess Trays */}
        <div className="flex flex-col gap-5 items-center justify-center">
          
          {/* Current Guess Slot */}
          <div className="flex justify-center items-center gap-3 min-h-[70px] px-6 py-3 bg-purple-900/10 border-2 border-dashed border-purple-900/20 rounded-[25px] w-full max-w-xl">
            <AnimatePresence>
              {userGuess.map((letterObj) => (
                <motion.button
                  key={letterObj.uniqueId}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleLetterClick(letterObj, true)}
                  className="w-12 h-12 rounded-xl bg-purple-600 border-2 border-purple-400 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-purple-500/30"
                >
                  {letterObj.char}
                </motion.button>
              ))}
            </AnimatePresence>
            {userGuess.length === 0 && (
              <span className="text-purple-900/40 font-black text-sm uppercase tracking-wider">Tap letters below to spell</span>
            )}
          </div>

          {/* Mixed Letters Pool */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <AnimatePresence>
              {mixedLetters.map((letterObj) => (
                <motion.button
                  key={letterObj.uniqueId}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetterClick(letterObj, false)}
                  className="w-14 h-14 rounded-2xl bg-white border-3 border-purple-200 text-purple-950 font-black text-2xl flex items-center justify-center shadow-lg hover:border-purple-500 transition duration-150"
                >
                  {letterObj.char}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* Victory Screen / Footer */}
        <div className="mt-6 min-h-[80px]">
          {won && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-black text-emerald-600 flex items-center justify-center gap-2">
                🎉 Spectacular Spell!
              </h2>
              <p className="font-extrabold text-purple-900 text-lg">
                You earned <span className="text-orange-500">🪙 +15 Coins</span> and <span className="text-yellow-600">⭐ +25 XP</span>!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextWord}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-lg rounded-full shadow-lg hover:shadow-emerald-500/30 transition duration-150"
              >
                Next Word 🚀
              </motion.button>
            </motion.div>
          )}
        </div>

      </div>

      {/* Rewards indicators */}
      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/60 z-10">
        🏆 Word Explorer matches spelling skills to logical cognition.
      </div>
    </div>
  );
}
