import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { usePoints } from "../hooks/usePoints";

const questions = [
  {
    question: "Which animal is the largest land mammal?",
    options: ["Dog", "Elephant", "Cat", "Monkey"],
    answer: "Elephant",
  },
  {
    question: "Which of these animals says 'Moo'?",
    options: ["Cow", "Tiger", "Dog", "Lion"],
    answer: "Cow",
  },
  {
    question: "Which bird is famous for its beautiful colorful feathers and victory dance?",
    options: ["Crow", "Sparrow", "Peacock", "Pigeon"],
    answer: "Peacock",
  },
  {
    question: "Which animal is known as the Ship of the Desert?",
    options: ["Horse", "Camel", "Cow", "Elephant"],
    answer: "Camel",
  }
];

export default function AnimalQuiz() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [pointsGiven, setPointsGiven] = useState(false);

  const current = questions[index];

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

  const choose = (option) => {
    if (finished) return;

    let nextScore = score;
    if (option === current.answer) {
      playSound(520, "sine", 0.12);
      nextScore = score + 1;
      setScore(nextScore);
    } else {
      playSound(150, "sawtooth", 0.25);
    }

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
      if (nextScore >= 3) {
        playSound(600, "sine", 0.2);
        setTimeout(() => playSound(800, "sine", 0.3), 150);
        if (!pointsGiven) {
          earnPoints(15, 25);
          setPointsGiven(true);
        }
      }
    }
  };

  const restartQuiz = () => {
    setIndex(0);
    setScore(0);
    setFinished(false);
    setPointsGiven(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-emerald-250 p-8 flex flex-col justify-between">
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

      <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 shadow-2xl w-full max-w-xl mx-auto border border-white/50 my-auto">
        <h1 className="text-5xl font-black text-center text-purple-950 flex items-center justify-center gap-3">
          🐘 Animal Quiz
        </h1>

        {!finished ? (
          <div className="mt-8 space-y-6">
            <div className="bg-white/50 border border-purple-100 rounded-2xl p-4 text-center">
              <span className="text-xs font-black text-purple-900 uppercase">Question {index + 1} of {questions.length}</span>
            </div>

            <h2 className="text-3xl font-black text-purple-950 text-center leading-snug min-h-[72px] flex items-center justify-center">
              {current.question}
            </h2>

            <div className="grid gap-3.5 mt-8">
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  className="
                    p-4
                    rounded-2xl
                    bg-white
                    hover:bg-purple-50
                    border-2
                    border-purple-100
                    text-purple-950
                    font-extrabold
                    text-lg
                    shadow-sm
                    hover:scale-[1.02]
                    transition
                    cursor-pointer
                  "
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mt-10 space-y-4">
            <h2 className="text-4xl font-black text-emerald-600">🎉 Quiz Finished!</h2>
            
            <p className="text-xl font-bold text-purple-900">
              Total Score: <span className="font-black text-purple-950">{score} / {questions.length}</span>
            </p>

            {score >= 3 ? (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-250 max-w-sm mx-auto">
                <p className="font-black text-emerald-700">
                  Spectacular! Earned <span className="text-orange-500">🪙 +15 Coins</span> and <span className="text-yellow-600">⭐ +25 XP</span>!
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-bold">Goal is to score at least 3 correct! Try again!</p>
            )}

            <button
              onClick={restartQuiz}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-lg shadow-md cursor-pointer"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/40">
        🏆 Animal Quiz expands language logic and semantic knowledge structures.
      </div>
    </div>
  );
}