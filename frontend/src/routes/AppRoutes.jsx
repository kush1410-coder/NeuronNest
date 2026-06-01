import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AdventureMap from "../pages/AdventureMap";
import StoryPage from "../pages/StoryPage";
import ChildHome from "../pages/ChildHome";
import Children from "../pages/Children";
import GamesPage from "../pages/GamesPage";
import RewardsPage from "../pages/RewardsPage";
import ProfilePage from "../pages/ProfilePage";
import MemoryMatch from "../pages/MemoryMatch";
import EmojiMatch from "../pages/EmojiMatch";
import AnimalQuiz from "../pages/AnimalQuiz";
import MathWizard from "../pages/MathWizard";
import EmotionPage from "../pages/EmotionPage";
import Home from "../pages/Home";
import ParentDashboard from "../pages/ParentDashboard";
import WordExplorer from "../pages/WordExplorer";
import PatternMaster from "../pages/PatternMaster";
import PlanetLander from "../pages/PlanetLander";
import FocusFinder from "../pages/FocusFinder";
import KidGate from "../pages/KidGate";
import SpeechQuest from "../pages/SpeechQuest";
import TreasureHunter from "../pages/TreasureHunter";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adventure" element={<AdventureMap />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/children" element={<Children />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/memory-match" element={<MemoryMatch />} />
        <Route path="/emoji-match" element={<EmojiMatch />} />
        <Route path="/animal-quiz" element={<AnimalQuiz />} />
        <Route path="/math-wizard" element={<MathWizard />} />
        <Route path="/emotion" element={<EmotionPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/word-explorer" element={<WordExplorer />} />
        <Route path="/pattern-master" element={<PatternMaster />} />
        <Route path="/planet-lander" element={<PlanetLander />} />
        <Route path="/focus-finder" element={<FocusFinder />} />
        <Route path="/kid-gate" element={<KidGate />} />
        <Route path="/speech-quest" element={<SpeechQuest />} />
        <Route path="/treasure-hunter" element={<TreasureHunter />} />
      </Routes>
    </BrowserRouter>
  );
}