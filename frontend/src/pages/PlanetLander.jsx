import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { usePoints } from "../hooks/usePoints";

export default function PlanetLander() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();

  const [y, setY] = useState(50); // rocket height in pixels
  const [velocity, setVelocity] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [status, setStatus] = useState("playing"); // playing, landed, crashed
  const [pointsGiven, setPointsGiven] = useState(false);
  const gameIntervalRef = useRef(null);

  const GRAVITY = 0.25;
  const THRUST = -0.8;
  const WINNING_SPEED = 2.5;

  const playSound = (freq, type = "sine", duration = 0.15) => {
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

  const applyThrust = () => {
    if (status !== "playing" || fuel <= 0) return;
    playSound(200, "triangle", 0.15);
    setVelocity(v => v + THRUST);
    setFuel(f => Math.max(0, f - 8));
  };

  const restartGame = () => {
    setY(50);
    setVelocity(0);
    setFuel(100);
    setStatus("playing");
    setPointsGiven(false);
  };

  useEffect(() => {
    if (status === "playing") {
      gameIntervalRef.current = setInterval(() => {
        setY((currentY) => {
          const nextVelocity = velocity + GRAVITY;
          setVelocity(nextVelocity);
          const nextY = currentY + nextVelocity;
          
          if (nextY >= 360) { // Hit landing pad
            clearInterval(gameIntervalRef.current);
            if (nextVelocity <= WINNING_SPEED) {
              setStatus("landed");
              playSound(600, "sine", 0.2);
              setTimeout(() => playSound(900, "sine", 0.4), 150);
              if (!pointsGiven) {
                earnPoints(25, 30);
                setPointsGiven(true);
              }
            } else {
              setStatus("crashed");
              playSound(100, "sawtooth", 0.6);
            }
            return 360;
          }
          
          if (nextY <= 0) { // Hit top ceiling
            setVelocity(0);
            return 0;
          }
          
          return nextY;
        });
      }, 50);
    }
    
    return () => clearInterval(gameIntervalRef.current);
  }, [velocity, status, pointsGiven]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 relative overflow-hidden flex flex-col justify-between text-white">
      {status === "landed" && <Confetti numberOfPieces={120} />}
      
      {/* Stars back drop */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full w-1 h-1"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black rounded-full shadow-md transition"
        >
          ⬅️ Back to Games
        </button>
        <div className="flex gap-4">
          <span className="bg-orange-500/20 border border-orange-500/40 text-orange-400 px-4 py-2 rounded-full font-black text-sm">
            🪙 Fuel: {fuel}%
          </span>
        </div>
      </div>

      {/* Game Window Container */}
      <div className="max-w-xl mx-auto w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[45px] p-8 shadow-2xl z-10 text-center flex flex-col justify-between my-4 grow max-h-[640px]">
        
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            🚀 Planet Lander
          </h1>
          <p className="text-slate-300 font-extrabold text-sm mt-1">
            Tap thrusters to land gently on the launching pad below! ☄️
          </p>
        </div>

        {/* Physics flight sandbox display */}
        <div className="relative w-full h-[400px] bg-black/40 rounded-3xl overflow-hidden border-2 border-slate-700/50 my-6 shadow-inner">
          
          {/* Landing Pad */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-800 to-slate-700 border-t-4 border-emerald-500 flex justify-center items-center">
            <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">SAFE LANDING STATION</span>
          </div>

          {/* Lander rocket */}
          <motion.div
            style={{ y: y }}
            className="absolute left-[45%] w-14 h-14 flex items-center justify-center text-4xl"
          >
            <motion.div
              animate={status === "playing" && fuel > 0 ? { y: [0, -2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              {status === "crashed" ? "💥" : status === "landed" ? "👨‍🚀" : "🚀"}
            </motion.div>
          </motion.div>

          {/* Speed Indicator */}
          <div className="absolute top-4 left-4 bg-black/60 px-4 py-2 rounded-xl text-left border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Landing Speed</div>
            <div className={`text-base font-black ${Math.abs(velocity) <= WINNING_SPEED ? "text-green-400" : "text-red-400"}`}>
              {Math.max(0, (velocity * 4).toFixed(1))} km/h
            </div>
            <span className="text-[9px] text-slate-500 font-bold">Must be &lt; 10 km/h</span>
          </div>
        </div>

        {/* Action Controls or Status Panels */}
        <div className="min-h-[100px] flex items-center justify-center">
          {status === "playing" ? (
            <div className="w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={applyThrust}
                disabled={fuel <= 0}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-2xl shadow-lg hover:from-orange-600 hover:to-amber-600 transition cursor-pointer disabled:opacity-30"
              >
                🔥 Fire Thrusters!
              </motion.button>
            </div>
          ) : status === "landed" ? (
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-emerald-400">🎉 Successful Landing!</h2>
              <p className="font-bold text-slate-300">
                You landed safely! Earned <span className="text-orange-400">🪙 +25 Coins</span> and <span className="text-yellow-400">⭐ +30 XP</span>!
              </p>
              <button
                onClick={restartGame}
                className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-full shadow-md cursor-pointer"
              >
                Launch Again 🌌
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-red-500">💥 Landing Failed!</h2>
              <p className="font-bold text-slate-400">The ship landed too fast. Let's try again!</p>
              <button
                onClick={restartGame}
                className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-full shadow-md cursor-pointer"
              >
                Rebuild Ship 🛠️
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-slate-500 z-10">
        🏆 Planet Lander coordinates hand-eye spatial reflexes and cognitive math forecasting.
      </div>
    </div>
  );
}
