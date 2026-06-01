import { useNavigate, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  BookOpen,
  Brain,
  Camera,
  Trophy,
  BarChart3
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-72 bg-white/70 backdrop-blur-lg shadow-xl p-6 flex flex-col justify-between h-screen sticky top-0">

      <div>
        <div className="text-center mb-10">
          <div className="text-6xl animate-bounce duration-1000">🦉</div>
          <h1 className="font-bold text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            NeuroNest
          </h1>
          <p className="text-gray-600 font-bold text-sm">Learn & Grow</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition font-extrabold hover:bg-pink-100 ${
              isActive("/dashboard") ? "bg-pink-200 text-pink-900 shadow-sm" : "text-gray-700"
            }`}
          >
            <HomeIcon />
            Home
          </button>

          <button
            onClick={() => navigate("/story")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition font-extrabold hover:bg-yellow-100 ${
              isActive("/story") ? "bg-yellow-200 text-yellow-900 shadow-sm" : "text-gray-700"
            }`}
          >
            <BookOpen />
            Stories
          </button>

          <button
            onClick={() => navigate("/games")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition font-extrabold hover:bg-green-100 ${
              isActive("/games") ? "bg-green-200 text-green-900 shadow-sm" : "text-gray-700"
            }`}
          >
            <Brain />
            Games
          </button>

          <button
            onClick={() => navigate("/emotion")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition font-extrabold hover:bg-blue-100 ${
              isActive("/emotion") ? "bg-blue-200 text-blue-900 shadow-sm" : "text-gray-700"
            }`}
          >
            <Camera />
            Emotion AI
          </button>

          <button
            onClick={() => navigate("/rewards")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition font-extrabold hover:bg-purple-100 ${
              isActive("/rewards") ? "bg-purple-200 text-purple-900 shadow-sm" : "text-gray-700"
            }`}
          >
            <Trophy />
            Rewards
          </button>

          <button
            onClick={() => navigate("/parent-dashboard")}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition font-extrabold hover:bg-orange-100 ${
              isActive("/parent-dashboard") ? "bg-orange-200 text-orange-900 shadow-sm" : "text-gray-700"
            }`}
          >
            <BarChart3 />
            Parent Dashboard
          </button>
        </div>
      </div>

      <div className="text-center text-xs font-bold text-purple-600/70 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
        ✨ Aarav's Nest
      </div>
    </div>
  );
}