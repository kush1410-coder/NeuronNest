import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { usePoints } from "../hooks/usePoints";

const questions = [
  { question: "2 + 3", answer: 5 },
  { question: "7 - 4", answer: 3 },
  { question: "5 + 6", answer: 11 },
  { question: "8 - 2", answer: 6 },
];

export default function MathWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { earnPoints } = usePoints();

  const fromEmotion = location.state?.fromEmotion;

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [pointsGiven, setPointsGiven] = useState(false);

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

  const submit = () => {
    if (finished) return;

    let nextScore = score;
    if (Number(input) === questions[index].answer) {
      playSound(520, "sine", 0.12);
      nextScore = score + 1;
      setScore(nextScore);
    } else {
      playSound(150, "sawtooth", 0.25);
    }

    setInput("");

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
      if (nextScore >= 3) {
        playSound(600, "sine", 0.2);
        setTimeout(() => playSound(800, "sine", 0.3), 150);
        if (!pointsGiven) {
          // If launched as an emotion quest, add +15 extra coins bonus!
          const bonusCoins = fromEmotion ? 15 : 0;
          earnPoints(20 + bonusCoins, 30);
          setPointsGiven(true);
        }
      }
    }
  };

  const restartGame = () => {
    setIndex(0);
    setScore(0);
    setFinished(false);
    setPointsGiven(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-200 p-8 flex flex-col justify-between">
      {finished && score >= 3 && <Confetti numberOfPieces={100} />}

      {/* Toolbar */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
        >
          ⬅️ Back to Games
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 shadow-2xl w-full max-w-xl mx-auto border border-white/50 my-auto space-y-4">
        
        {/* Quest banner from Emotion Center */}
        {fromEmotion && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-xs py-2 px-4 rounded-full text-center uppercase tracking-wider shadow animate-pulse">
            🎯 Emotion Quest Active: Channel your {fromEmotion} energy! (+15 Coins Bonus)
          </div>
        )}

        <h1 className="text-5xl font-black text-center text-purple-950">
          ➕ Math Wizard
        </h1>

        {!finished ? (
          <div className="mt-8 space-y-6">
            <div className="bg-white/50 border border-purple-100 rounded-2xl p-4 text-center">
              <span className="text-xs font-black text-purple-900 uppercase">Solve Puzzle {index + 1} of {questions.length}</span>
            </div>

            <h2 className="text-5xl text-center font-black text-purple-950 tracking-wider">
              {questions[index].question}
            </h2>

            <input
              value={input}
              type="number"
              onChange={(e) => setInput(e.target.value)}
              className="
                w-full
                p-4
                border-2
                border-purple-200
                rounded-2xl
                text-center
                text-2xl
                font-black
                focus:border-purple-500
                focus:outline-none
              "
              placeholder="Your answer"
            />

            <button
              onClick={submit}
              className="
                w-full
                py-4
                rounded-2xl
                bg-blue-500
                hover:bg-blue-600
                text-white
                font-black
                text-lg
                shadow-md
                cursor-pointer
              "
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="text-center mt-10 space-y-4">
            <h2 className="text-4xl font-black text-emerald-600">🎉 Game Finished!</h2>
            
            <p className="text-xl font-bold text-purple-900">
              Total Score: <span className="font-black text-purple-950">{score} / {questions.length}</span>
            </p>

            {score >= 3 ? (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-250 max-w-sm mx-auto">
                <p className="font-black text-emerald-700">
                  Spectacular! Earned <span className="text-orange-500">🪙 +{fromEmotion ? "35" : "20"} Coins</span> and <span className="text-yellow-600">⭐ +30 XP</span>!
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-bold">Goal is to solve at least 3 equations! Try again!</p>
            )}

            <button
              onClick={restartGame}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-lg shadow-md cursor-pointer"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/40">
        🏆 Math Wizard builds left brain analytical calculation and speed numerical logic.
      </div>
    </div>
  );
}