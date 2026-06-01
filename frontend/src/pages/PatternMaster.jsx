import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { usePoints } from "../hooks/usePoints";

const COLORS = [
  { id: 0, name: "red", color: "bg-red-500", activeColor: "bg-red-300 ring-4 ring-red-200 shadow-[0_0_30px_#ef4444]", freq: 261.63 },
  { id: 1, name: "blue", color: "bg-blue-500", activeColor: "bg-blue-300 ring-4 ring-blue-200 shadow-[0_0_30px_#3b82f6]", freq: 293.66 },
  { id: 2, name: "green", color: "bg-green-500", activeColor: "bg-green-300 ring-4 ring-green-200 shadow-[0_0_30px_#10b981]", freq: 329.63 },
  { id: 3, name: "yellow", color: "bg-yellow-500", activeColor: "bg-yellow-300 ring-4 ring-yellow-200 shadow-[0_0_30px_#eab308]", freq: 349.23 },
];

export default function PatternMaster() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();
  
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activePad, setActivePad] = useState(null);
  const [round, setRound] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Tap Start to test your memory! 🧠");
  const [won, setWon] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [pointsGiven, setPointsGiven] = useState(false);

  const playSound = (freq, type = "sine", duration = 0.3) => {
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

  const flashPad = (padId, duration = 400) => {
    setActivePad(padId);
    playSound(COLORS[padId].freq, "sine", duration / 1000);
    setTimeout(() => {
      setActivePad(null);
    }, duration);
  };

  const startNewGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
    setRound(1);
    setWon(false);
    setPointsGiven(false);
    setStatusMsg("Watch closely... 👁️");
  };

  useEffect(() => {
    if (sequence.length > 0) {
      showSequence();
    }
  }, [sequence]);

  const showSequence = async () => {
    setIsShowingSequence(true);
    setStatusMsg("Watch closely... 👁️");
    
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      flashPad(sequence[i], 500);
    }
    
    await new Promise(r => setTimeout(r, 400));
    setIsShowingSequence(false);
    setStatusMsg("Your turn! Repeat the pattern. ✨");
  };

  const handlePadClick = (id) => {
    if (isShowingSequence || won || round === 0) return;
    
    flashPad(id, 250);
    const newPlayerSeq = [...playerSequence, id];
    setPlayerSequence(newPlayerSeq);

    // Validate move
    const currentCheckIndex = newPlayerSeq.length - 1;
    if (newPlayerSeq[currentCheckIndex] !== sequence[currentCheckIndex]) {
      // Mistake!
      playSound(150, "sawtooth", 0.5);
      setStatusMsg("Oops, wrong pattern! Let's start fresh. 🔄");
      if (round - 1 > highScore) {
        setHighScore(round - 1);
      }
      setRound(0);
      return;
    }

    // Sequence completed correctly!
    if (newPlayerSeq.length === sequence.length) {
      if (round >= 5) {
        // Complete Victory at level 5!
        setWon(true);
        setStatusMsg("AMAZING memory! You are the Pattern Master! 🎉");
        playSound(523.25, "sine", 0.15); // C5
        setTimeout(() => playSound(659.25, "sine", 0.15), 100); // E5
        setTimeout(() => playSound(783.99, "sine", 0.3), 200); // G5
        if (!pointsGiven) {
          earnPoints(20, 30); // Big rewards
          setPointsGiven(true);
        }
        if (round > highScore) {
          setHighScore(round);
        }
      } else {
        // Next round
        setStatusMsg("Awesome matching! Next round incoming... 🚀");
        setTimeout(() => {
          setPlayerSequence([]);
          setRound(prev => prev + 1);
          setSequence(prev => [...prev, Math.floor(Math.random() * 4)]);
        }, 1200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-blue-200 to-indigo-200 p-8 relative overflow-hidden flex flex-col justify-between">
      {won && <Confetti numberOfPieces={120} />}
      
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
            🏆 Record: Round {highScore}
          </span>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="max-w-md mx-auto w-full bg-white/50 backdrop-blur-xl border border-white/40 rounded-[45px] p-8 shadow-2xl z-10 text-center flex flex-col justify-between my-4 grow max-h-[620px]">
        
        <div>
          <h1 className="text-4xl font-black text-purple-950">
            🎨 Pattern Master
          </h1>
          <p className="text-purple-900 font-extrabold text-sm mt-1">
            Repeat the blinking musical paths to win! 🎵
          </p>
        </div>

        {/* Round display & status bar */}
        <div className="my-4">
          <div className="bg-purple-950/10 border border-purple-950/20 py-2.5 px-6 rounded-2xl inline-block">
            <span className="font-extrabold text-purple-950">Round: {round} / 5</span>
          </div>
          <p className="mt-3 text-purple-950 font-black text-base animate-pulse">
            {statusMsg}
          </p>
        </div>

        {/* Color pads grid layout */}
        <div className="grid grid-cols-2 gap-5 aspect-square max-w-[280px] mx-auto w-full my-4">
          {COLORS.map((pad) => (
            <motion.button
              key={pad.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isShowingSequence || won || round === 0}
              onClick={() => handlePadClick(pad.id)}
              className={`
                aspect-square rounded-3xl transition-all duration-150 shadow-md border-3 border-white/50 cursor-pointer
                ${activePad === pad.id ? pad.activeColor : pad.color}
                ${(isShowingSequence || won || round === 0) ? "opacity-90" : "hover:opacity-95"}
              `}
            />
          ))}
        </div>

        {/* Controls / Victory details */}
        <div className="min-h-[90px] flex items-center justify-center">
          {round === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewGame}
              className="px-10 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-lg rounded-full shadow-lg cursor-pointer"
            >
              🎮 Start Game
            </motion.button>
          ) : won ? (
            <div className="space-y-3">
              <p className="font-black text-emerald-600 text-lg">
                Earned <span className="text-orange-500">🪙 +20 Coins</span> & <span className="text-yellow-600">⭐ +30 XP</span>!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startNewGame}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-base rounded-full shadow-md cursor-pointer"
              >
                Play Again
              </motion.button>
            </div>
          ) : (
            <div className="text-sm font-extrabold text-purple-900/60 uppercase tracking-widest">
              {isShowingSequence ? "Listen and Watch..." : "Your Turn!"}
            </div>
          )}
        </div>

      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/60 z-10">
        🏆 Pattern Master stimulates temporal and parietal lobes logic.
      </div>
    </div>
  );
}
