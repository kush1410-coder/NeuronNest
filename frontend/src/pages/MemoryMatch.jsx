import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useLocation } from "react-router-dom";
import { usePoints } from "../hooks/usePoints";

const emojis = ["🐶", "🐱", "🦁", "🐼", "🐸", "🦄"];

export default function MemoryMatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { earnPoints } = usePoints();

  const fromEmotion = location.state?.fromEmotion;

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [pointsGiven, setPointsGiven] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

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

  const startGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
      }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
    setPointsGiven(false);
  };

  const handleFlip = (id) => {
    if (
      flipped.length === 2 ||
      flipped.includes(id) ||
      matched.includes(id) ||
      won
    )
      return;

    playSound(380, "sine", 0.08);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      const first = cards.find((c) => c.id === newFlipped[0]);
      const second = cards.find((c) => c.id === newFlipped[1]);

      if (first.emoji === second.emoji) {
        playSound(520, "sine", 0.12);
        const newMatched = [
          ...matched,
          first.id,
          second.id,
        ];

        setMatched(newMatched);

        if (newMatched.length === cards.length) {
          setWon(true);
          playSound(580, "sine", 0.15);
          setTimeout(() => playSound(800, "sine", 0.35), 120);
          if (!pointsGiven) {
            const bonusCoins = fromEmotion ? 15 : 0;
            earnPoints(10 + bonusCoins, 20);
            setPointsGiven(true);
          }
        }

        setTimeout(() => {
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-200 to-blue-200 p-8 relative flex flex-col justify-between">
      {won && <Confetti numberOfPieces={120} />}

      {/* Back to Games link */}
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center mb-6 z-10">
        <button
          onClick={() => navigate("/games")}
          className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
        >
          ⬅️ Back to Games
        </button>
      </div>

      <div className="max-w-3xl mx-auto w-full bg-white/40 backdrop-blur-xl border border-white/50 rounded-[45px] p-8 shadow-2xl my-auto space-y-4">

        {/* Emotion center quest banner */}
        {fromEmotion && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-xs py-2 px-4 rounded-full text-center uppercase tracking-wider shadow animate-pulse">
            🎯 Emotion Quest Active: Calm/Balance your {fromEmotion} energy! (+15 Coins Bonus)
          </div>
        )}

        <h1 className="text-5xl font-black text-center text-purple-950">
          🧠 Memory Match
        </h1>

        <p className="text-center text-purple-900 font-extrabold text-base mt-2">
          Find matching identical card pairs! Improve your memory recall! 🌈
        </p>

        <div className="flex justify-center gap-6 mt-6">

          <div className="bg-white rounded-full px-6 py-2 shadow font-black text-purple-900">
            Moves: {moves}
          </div>

          <div className="bg-yellow-250/30 border border-yellow-300 rounded-full px-6 py-2 shadow font-black text-purple-950">
            ⭐ 20 XP
          </div>

          <div className="bg-orange-250/20 border border-orange-300 rounded-full px-6 py-2 shadow font-black text-purple-950">
            🪙 10 Coins
          </div>

        </div>

        <div className="grid grid-cols-4 gap-4 mt-8">

          {cards.map((card) => {
            const isFlipped =
              flipped.includes(card.id) ||
              matched.includes(card.id);

            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                className={`
                  h-28 rounded-2xl flex items-center justify-center text-4xl shadow-md border transition cursor-pointer
                  ${isFlipped ? "bg-white border-purple-200 hover:scale-105" : "bg-purple-900/10 border-purple-900/20 text-purple-950 hover:bg-purple-900/20 hover:scale-105"}
                `}
              >
                {isFlipped ? card.emoji : "❓"}
              </button>
            );
          })}
        </div>

        {won && (
          <div className="text-center mt-10 space-y-4">

            <h2 className="text-4xl font-black text-emerald-600 animate-bounce">
              🎉 Magical Win!
            </h2>

            <p className="text-lg font-black text-purple-950">
              You earned <span className="text-orange-500">🪙 +{fromEmotion ? "25" : "10"} Coins</span> and <span className="text-yellow-600">⭐ +20 XP</span>!
            </p>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-lg shadow-md cursor-pointer"
            >
              Play Again
            </button>

          </div>
        )}

      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/40">
        🏆 Memory Match improves visual attention and temporal retention logic.
      </div>
    </div>
  );
}