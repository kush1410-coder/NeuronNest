import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Camera, Volume2, Sparkles, AlertCircle, Award, RefreshCw } from "lucide-react";
import { usePoints } from "../hooks/usePoints";

const COLOR_QUESTS = [
  { name: "Red", emoji: "🔴", text: "something Red like an apple 🍎", minHue: 340, maxHue: 20, minSat: 30, colorCode: "#EF4444" },
  { name: "Green", emoji: "🟢", text: "something Green like a leaf 🌿", minHue: 80, maxHue: 160, minSat: 25, colorCode: "#10B981" },
  { name: "Blue", emoji: "🔵", text: "something Blue like the sky 🌊", minHue: 180, maxHue: 250, minSat: 25, colorCode: "#3B82F6" },
  { name: "Yellow", emoji: "🟡", text: "something Yellow like a banana 🍌", minHue: 40, maxHue: 70, minSat: 30, colorCode: "#F59E0B" }
];

export default function TreasureHunter() {
  const navigate = useNavigate();
  const { earnPoints } = usePoints();

  const [questIdx, setQuestIdx] = useState(0);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [detectedColor, setDetectedColor] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [won, setWon] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const currentQuest = COLOR_QUESTS[questIdx];

  // Start webcam
  const startWebcam = async () => {
    try {
      setCameraError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "environment" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraError("Could not access your camera. Make sure permissions are granted!");
    }
  };

  useEffect(() => {
    startWebcam();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync video source if stream or ref changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const speakQuest = () => {
    try {
      window.speechSynthesis.cancel();
      const text = `Robo-Owl challenges you to find ${currentQuest.text}! Hold it close to the camera.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  };

  const playSynthSound = (freq, type, duration) => {
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

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const checkObject = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setScanning(true);
    setDetectedColor(null);

    playSynthSound(450, "sine", 0.1);

    setTimeout(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Draw middle region of the video stream onto a small canvas
      canvas.width = 100;
      canvas.height = 100;

      // Draw the center of the video frame
      const sx = (video.videoWidth - 200) / 2 || 0;
      const sy = (video.videoHeight - 200) / 2 || 0;
      ctx.drawImage(video, sx, sy, 200, 200, 0, 0, 100, 100);

      // Get pixel data from center square
      const imgData = ctx.getImageData(10, 10, 80, 80);
      const data = imgData.data;

      // Average color values
      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        // Skip dark and washed-out gray pixels
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        sumR += r;
        sumG += g;
        sumB += b;
        count++;
      }

      const avgR = Math.round(sumR / count);
      const avgG = Math.round(sumG / count);
      const avgB = Math.round(sumB / count);

      const [h, s, l] = rgbToHsl(avgR, avgG, avgB);
      console.log(`Scanned HSL: [${h}, ${s}%, ${l}%]`);

      // Check if matches the target quest color parameters
      let isMatch = false;
      const target = currentQuest;

      // Handling wraparound Hue for Red
      if (target.name === "Red") {
        isMatch = (h >= target.minHue || h <= target.maxHue) && s >= target.minSat;
      } else {
        isMatch = h >= target.minHue && h <= target.maxHue && s >= target.minSat;
      }

      // Check luminance to filter pure black/white
      if (l < 15 || l > 85) {
        isMatch = false;
      }

      setScanning(false);
      setDetectedColor({ h, s, l, rgb: `rgb(${avgR}, ${avgG}, ${avgB})` });

      if (isMatch) {
        handleSuccess();
      } else {
        playSynthSound(220, "triangle", 0.3); // Sad buzzer
      }
    }, 1000);
  };

  const handleSuccess = () => {
    setWon(true);
    playSynthSound(523.25, "triangle", 0.15); // C5
    setTimeout(() => playSynthSound(659.25, "sine", 0.3), 120); // E5
    setTimeout(() => playSynthSound(783.99, "sine", 0.4), 240); // G5
    earnPoints(15, 20); // Add rewards
  };

  const skipQuest = () => {
    // Accessibility bypass / offline cheat
    handleSuccess();
  };

  const nextQuest = () => {
    setWon(false);
    setDetectedColor(null);
    setQuestIdx((prev) => (prev + 1) % COLOR_QUESTS.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200 p-6 md:p-10 relative overflow-hidden flex flex-col justify-between">
      {won && <Confetti numberOfPieces={150} />}

      {/* Decorative Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2.5 bg-white/80 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
        >
          ⬅️ Back to Dashboard
        </button>
        
        <div className="bg-white/85 px-5 py-2 border-2 border-purple-300 text-purple-900 rounded-full font-black text-sm shadow flex items-center gap-2">
          <Award size={18} className="text-purple-600" />
          <span>Quest {questIdx + 1} of {COLOR_QUESTS.length}</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-4xl mx-auto w-full bg-white/50 backdrop-blur-xl border border-white/40 rounded-[45px] p-6 md:p-8 shadow-2xl z-10 text-center flex flex-col justify-between my-4 grow relative">
        
        {/* Robo-Owl Guide */}
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-6xl select-none"
          >
            🦉
          </motion.div>
          <div className="bg-purple-950/5 border border-purple-950/10 px-5 py-3 rounded-2xl max-w-sm text-left">
            <p className="text-purple-950 font-extrabold text-sm leading-relaxed">
              Find <strong className="underline text-purple-900" style={{ color: currentQuest.colorCode }}>{currentQuest.text}</strong>, hold it to the target box, and let me scan it!
            </p>
          </div>
        </div>

        {/* Camera Scanner Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-center my-6">
          
          {/* Left Column: Camera Screen */}
          <div className="flex flex-col items-center justify-center">
            {cameraError ? (
              <div className="bg-red-50 border-2 border-dashed border-red-200 text-red-800 p-8 rounded-3xl text-center space-y-4 max-w-sm">
                <span className="text-5xl block">📷</span>
                <p className="font-extrabold text-sm">{cameraError}</p>
                <button
                  onClick={startWebcam}
                  className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl flex items-center gap-2 mx-auto hover:bg-red-700"
                >
                  <RefreshCw size={16} /> Try Again
                </button>
              </div>
            ) : (
              <div className="relative border-4 border-white rounded-[35px] overflow-hidden shadow-2xl bg-black w-full max-w-md aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                
                {/* Target overlay target box */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 border-4 border-dashed border-yellow-300 rounded-3xl animate-pulse relative">
                    <span className="absolute -top-6 left-0 right-0 text-[10px] font-black text-yellow-300 bg-black/60 px-1.5 py-0.5 rounded-full uppercase tracking-widest text-center">
                      Align object here
                    </span>
                  </div>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Right Column: Quest Status & Info */}
          <div className="flex flex-col justify-center items-center text-center space-y-6">
            
            <div className="bg-white/80 border border-purple-200/50 rounded-3xl p-6 shadow-sm max-w-sm w-full space-y-3">
              <span className="text-6xl block select-none">{currentQuest.emoji}</span>
              <h2 className="text-3xl font-black text-purple-950 uppercase tracking-widest">
                Target: {currentQuest.name}
              </h2>
              <button
                onClick={speakQuest}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-extrabold rounded-full transition shadow-sm text-xs flex items-center gap-1.5 mx-auto"
              >
                <Volume2 size={14} /> Listen Prompt
              </button>
            </div>

            {/* Scanning / Analysis output */}
            <div className="min-h-[70px] w-full max-w-sm flex items-center justify-center">
              {scanning ? (
                <div className="space-y-2">
                  <span className="text-xs font-black text-purple-600 uppercase tracking-widest animate-pulse">Robo-Owl is analyzing...</span>
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : detectedColor ? (
                <div className="flex items-center gap-3 bg-white/70 px-6 py-3 rounded-2xl border border-purple-100 shadow-sm">
                  <span className="text-xs font-black text-purple-950/60 uppercase">Analyzed Color:</span>
                  <div
                    className="w-8 h-8 rounded-full border border-purple-250 shadow-inner"
                    style={{ backgroundColor: detectedColor.rgb }}
                  />
                  <span className="text-sm font-black text-purple-950">
                    Hue: {detectedColor.h}° (Sat: {detectedColor.s}%)
                  </span>
                </div>
              ) : won ? (
                <span className="text-emerald-600 font-black text-lg flex items-center gap-2">
                  🎉 Color detected successfully!
                </span>
              ) : (
                <span className="text-purple-900/40 font-black text-xs uppercase tracking-widest leading-relaxed">
                  Hold your item in the target box and click Check Object!
                </span>
              )}
            </div>

            {/* Check Buttons */}
            {!won && (
              <div className="flex gap-3">
                <button
                  onClick={skipQuest}
                  className="px-5 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-black rounded-2xl text-sm transition"
                  title="Bypass in case camera is not working"
                >
                  Skip Quest ➡️
                </button>
                
                <button
                  onClick={checkObject}
                  disabled={scanning}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg transition duration-200"
                >
                  <Camera size={20} /> Check Object 🔍
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Level Progression / Success Card */}
        <div className="min-h-[90px] flex items-center justify-center">
          {won && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="font-extrabold text-purple-950 text-lg">
                You earned <span className="text-orange-500">🪙 +15 Coins</span> and <span className="text-yellow-600">⭐ +20 XP</span>!
              </p>
              <button
                onClick={nextQuest}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-lg rounded-full shadow-lg hover:brightness-105 transition"
              >
                Next Quest 🚀
              </button>
            </motion.div>
          )}
        </div>

      </div>

      {/* Educational Footer */}
      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-900/60 z-10 flex justify-center items-center gap-1.5">
        <Sparkles size={12} className="text-purple-600" />
        <span>Treasure Hunter matches real-world color identification to cognitive spatial awareness.</span>
      </div>
    </div>
  );
}
