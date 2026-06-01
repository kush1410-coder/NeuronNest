import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { usePoints } from "../hooks/usePoints";

const emojis = ["😀", "😎", "🤖", "🦄", "🐸", "🚀", "🐱", "🌈"];

export default function EmojiMatch() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();

  const [target, setTarget] = useState("😀");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(25);
  const [gameOver, setGameOver] = useState(false);
  const [pointsGiven, setPointsGiven] = useState(false);

  const playSound = (freq, type = "sine", duration = 0.12) => {
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

  useEffect(() => {
    if (time <= 0) {
      setGameOver(true);
      playSound(200, "triangle", 0.4);
      return;
    }

    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  // Give points when game finishes
  useEffect(() => {
    if (gameOver && score >= 5 && !pointsGiven) {
      earnPoints(8, 15);
      setPointsGiven(true);
    }
  }, [gameOver]);

  const chooseEmoji = (emoji) => {
    if (gameOver) return;

    if (emoji === target) {
      playSound(520, "sine", 0.1);
      setScore(score + 1);
      setTarget(
        emojis[Math.floor(Math.random() * emojis.length)]
      );
    } else {
      playSound(150, "sawtooth", 0.2);
    }
  };

  const restart = () => {
    setScore(0);
    setTime(25);
    setGameOver(false);
    setPointsGiven(false);

    setTarget(
      emojis[Math.floor(Math.random() * emojis.length)]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-200 to-blue-200 p-8 flex flex-col justify-between">
      {gameOver && score >= 5 && <Confetti numberOfPieces={80} />}

      {/* Navigation header */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
        >
          ⬅️ Back to Games
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 shadow-2xl w-full max-w-xl mx-auto border border-white/50">

        <h1 className="text-5xl font-black text-center text-purple-950">
          😀 Emoji Hunt
        </h1>

        <div className="flex justify-between mt-6">

          <div className="text-2xl font-black text-purple-900 bg-white/50 px-5 py-2 rounded-2xl">
            ⏰ Time: {time}s
          </div>

          <div className="text-2xl font-black text-purple-900 bg-white/50 px-5 py-2 rounded-2xl">
            ⭐ Score: {score}
          </div>

        </div>

        {!gameOver ? (
          <>
            <h2 className="text-center text-3xl mt-8 font-black text-purple-950">
              Find This Emoji:
            </h2>

            <div className="text-center text-[100px] select-none my-4 filter drop-shadow">
              {target}
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8">

              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => chooseEmoji(emoji)}
                  className="
                    text-5xl
                    bg-white
                    rounded-2xl
                    p-4
                    shadow-md
                    hover:scale-110
                    transition
                    cursor-pointer
                  "
                >
                  {emoji}
                </button>
              ))}

            </div>
          </>
        ) : (
          <div className="text-center mt-10 space-y-4">

            <h2 className="text-4xl font-black text-emerald-600">
              🎉 Time's Up!
            </h2>

            <p className="text-2xl font-bold text-purple-900">
              Total Score: <span className="font-black text-purple-950">{score}</span>
            </p>

            {score >= 5 ? (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-sm mx-auto">
                <p className="font-black text-emerald-700">
                  Great! Earned <span className="text-orange-500">🪙 +8 Coins</span> and <span className="text-yellow-600">⭐ +15 XP</span>!
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-bold">Try to score 5 or more to win rewards!</p>
            )}

            <button
              onClick={restart}
              className="
                px-8
                py-3.5
                rounded-full
                bg-purple-600
                text-white
                font-bold
                cursor-pointer
              "
            >
              Play Again
            </button>

          </div>
        )}

      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/40">
        🏆 Emoji Hunt speeds up focal visual reflexes and motor coordination.
      </div>
    </div>
  );
}