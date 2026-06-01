import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import { incrementStoriesRead } from "../services/pointsService";

export default function StoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const gameSuggestions = {
    happy: { name: "Math Wizard ➕", path: "/math-wizard" },
    excited: { name: "Emoji Hunt 😀", path: "/emoji-match" },
    curious: { name: "Animal Quiz 🐘", path: "/animal-quiz" },
    calm: { name: "Memory Match 🧠", path: "/memory-match" },
    sad: { name: "Memory Match 🧠", path: "/memory-match" },
    angry: { name: "Memory Match 🧠", path: "/memory-match" },
    silly: { name: "Emoji Hunt 😀", path: "/emoji-match" },
    bored: { name: "Animal Quiz 🐘", path: "/animal-quiz" },
    sleepy: { name: "Memory Match 🧠", path: "/memory-match" },
    surprised: { name: "Math Wizard ➕", path: "/math-wizard" },
    proud: { name: "Math Wizard ➕", path: "/math-wizard" }
  };

  // Load active child details for personalization
  const activeChild = (() => {
    try {
      return JSON.parse(localStorage.getItem("activeChild") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: activeChild.age || 5,
    emotion: "happy",
    topic: "animals",
    learningLevel: "beginner",
    language: "english",
  });
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");

  const utteranceRef = useRef(null);

  useEffect(() => {
    // Clear any stuck browser speechSynthesis queue on component mount
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("Failed to clear speechSynthesis on mount:", e);
    }

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices() || [];
      setVoices(allVoices);
      console.log(window.speechSynthesis.getVoices());
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getFilteredVoices = () => {
    const langKey = form.language === "hindi" ? "hi" : "en";
    return voices.filter((voice) => voice.lang.toLowerCase().startsWith(langKey));
  };

  // Automatically select a matching voice whenever language or voices load/change
  useEffect(() => {
    const filtered = getFilteredVoices();
    if (filtered.length > 0) {
      // Prioritize female-sounding voices for both English and Hindi
      const femaleVoice = filtered.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("hazel") ||
          v.name.toLowerCase().includes("swara") ||
          v.name.toLowerCase().includes("kalpana") ||
          v.name.toLowerCase().includes("harmeet") ||
          v.name.toLowerCase().includes("neerja")
      );
      if (femaleVoice) {
        setSelectedVoiceName(femaleVoice.name);
      } else {
        setSelectedVoiceName(filtered[0].name);
      }
    } else {
      setSelectedVoiceName("");
    }
  }, [form.language, voices]);

  // Clean Markdown formatting from stories so speech engines do not choke
  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return "";
    return rawText
      .replace(/\*\*+/g, "") // Strip bold asterisks
      .replace(/\*+/g, "")   // Strip italic asterisks
      .replace(/#+/g, "")    // Strip headers
      .replace(/_+/g, "")    // Strip underscores
      .replace(/`+/g, "")    // Strip backticks
      .trim();
  };

  const audioQueueRef = useRef([]);
  const currentAudioRef = useRef(null);

  const stopAllAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Google Translate TTS — chunked playback for Hindi fallback
  const speakWithGoogleTTS = (text, lang = "hi") => {
    const MAX_LENGTH = 200;
    const chunks = [];
    let remaining = text;
    while (remaining.length > 0) {
      // Try to break at sentence boundary
      const slice = remaining.slice(0, MAX_LENGTH);
      const lastBreak = Math.max(
        slice.lastIndexOf("।"),
        slice.lastIndexOf("."),
        slice.lastIndexOf("?"),
        slice.lastIndexOf("!"),
        slice.lastIndexOf(","),
        slice.lastIndexOf(" ")
      );
      const end = (remaining.length <= MAX_LENGTH) ? remaining.length : (lastBreak > 0 ? lastBreak + 1 : MAX_LENGTH);
      chunks.push(remaining.slice(0, end).trim());
      remaining = remaining.slice(end).trim();
    }

    audioQueueRef.current = chunks;
    setIsSpeaking(true);
    setIsPaused(false);

    const playNext = () => {
      if (audioQueueRef.current.length === 0) {
        setIsSpeaking(false);
        setIsPaused(false);
        currentAudioRef.current = null;
        return;
      }
      const chunk = audioQueueRef.current.shift();
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(chunk)}`;
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = playNext;
      audio.onerror = () => {
        console.error("Google TTS audio error, skipping chunk");
        playNext();
      };
      audio.play().catch((e) => {
        console.error("Audio play error:", e);
        playNext();
      });
    };

    playNext();
  };

  const speakStory = () => {
    if (!story) return;

    stopAllAudio();
    const cleanedStory = cleanTextForSpeech(story);

    if (form.language === "hindi") {
      const hindiVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("hi"));
      if (hindiVoices.length === 0) {
        // No Hindi voice installed — fall back to Google Translate TTS
        console.log("No native Hindi voice found, using Google Translate TTS fallback.");
        speakWithGoogleTTS(cleanedStory, "hi");
        return;
      }
    }

    // Small delay to allow the browser speech synthesis engine to reset completely
    setTimeout(() => {
      const speech = new SpeechSynthesisUtterance(cleanedStory);
      
      // Store reference to prevent garbage collection silent failure
      utteranceRef.current = speech;

      const activeVoice = voices.find((v) => v.name === selectedVoiceName);
      if (activeVoice) {
        speech.voice = activeVoice;
        speech.lang = activeVoice.lang;
      } else {
        const filtered = getFilteredVoices();
        // Prioritize female-sounding voices for both English and Hindi
        const femaleVoice = filtered.find(
          (v) =>
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("hazel") ||
            v.name.toLowerCase().includes("swara") ||
            v.name.toLowerCase().includes("kalpana") ||
            v.name.toLowerCase().includes("harmeet") ||
            v.name.toLowerCase().includes("neerja")
        );
        if (femaleVoice) {
          speech.voice = femaleVoice;
          speech.lang = femaleVoice.lang;
        } else if (filtered.length > 0) {
          speech.voice = filtered[0];
          speech.lang = filtered[0].lang;
        } else {
          speech.lang = form.language === "hindi" ? "hi-IN" : "en-US";
        }
      }

      speech.rate = 0.9;
      speech.pitch = 1.1;
      speech.volume = 1;

      speech.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      speech.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      speech.onerror = (e) => {
        console.error("SpeechSynthesisUtterance error:", e);
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(speech);
    }, 250);
  };

  const pauseStory = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    } else {
      window.speechSynthesis.pause();
    }
    setIsPaused(true);
  };

  const resumeStory = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.play();
    } else {
      window.speechSynthesis.resume();
    }
    setIsPaused(false);
  };

  const stopStory = () => {
    stopAllAudio();
  };

  const generateStory = async (formOverride = null) => {
    try {
      setLoading(true);

      const payload = (formOverride && !formOverride.target) ? formOverride : form;

      const res = await API.post(
        "/story/generate",
        payload
      );

      setStory(res.data.story);
      incrementStoriesRead();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state) {
      const { emotion, topic, autoLoad } = location.state;
      const updatedForm = {
        ...form,
        emotion: emotion || form.emotion,
        topic: topic || form.topic,
      };
      
      setForm(updatedForm);
      
      if (autoLoad) {
        generateStory(updatedForm);
      }
    }
  }, [location.state]);
  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-100" />

      {/* Clouds */}
      <div className="absolute top-24 left-[-250px] cloud cloud1">
        <svg width="240" height="120">
          <ellipse cx="70" cy="60" rx="45" ry="25" fill="white" opacity="0.6" />
          <ellipse cx="120" cy="45" rx="55" ry="35" fill="white" opacity="0.6" />
          <ellipse cx="180" cy="60" rx="40" ry="22" fill="white" opacity="0.6" />
        </svg>
      </div>

      <div className="absolute top-56 right-[-250px] cloud cloud2">
        <svg width="280" height="140">
          <ellipse cx="80" cy="70" rx="50" ry="30" fill="white" opacity="0.5" />
          <ellipse cx="145" cy="55" rx="65" ry="40" fill="white" opacity="0.5" />
          <ellipse cx="210" cy="75" rx="45" ry="28" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Magic Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 1, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + Math.random() * 4,
          }}
        >
          ✨
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Back to Dashboard Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-white/80 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
          >
            ⬅️ Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center">

          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="text-[140px]"
          >
            📖
          </motion.div>

          <h1 className="text-7xl font-black text-white drop-shadow-xl">
            Magic Story Kingdom
          </h1>

          <p className="text-white text-2xl mt-4">
            Create magical adventures with AI ✨
          </p>

        </div>

        <div className="grid lg:grid-cols-[450px_1fr] gap-10 mt-14">

          {/* Left Panel */}
          <div className="bg-white/40 backdrop-blur-2xl rounded-[40px] p-8 shadow-2xl border border-white/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl animate-bounce">🪄</span>
                <h2 className="text-3xl font-black text-purple-950">
                  Story Settings
                </h2>
              </div>

              <div className="space-y-6">

                {/* Age Group Selector */}
                <div>
                  <label className="text-sm font-black text-purple-900 block mb-2">Age Group</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { ageVal: 4, label: "3-4 yrs", emoji: "🐣" },
                      { ageVal: 6, label: "5-6 yrs", emoji: "🦊" },
                      { ageVal: 7, label: "7+ yrs", emoji: "🦁" }
                    ].map((item) => {
                      const isSelected = Number(form.age) === item.ageVal || (item.ageVal === 7 && Number(form.age) >= 7) || (item.ageVal === 4 && Number(form.age) <= 4);
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setForm({ ...form, age: item.ageVal })}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-purple-600 border-purple-600 text-white shadow-lg scale-105"
                              : "bg-white/70 border-purple-100 text-purple-950 hover:bg-white hover:border-purple-200"
                          }`}
                        >
                          <span className="text-2xl mb-1">{item.emoji}</span>
                          <span className="text-xs font-black">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Emotion Grid */}
                <div>
                  <label className="text-sm font-black text-purple-900 block mb-2">Child's Emotion</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { val: "happy", emoji: "😊" },
                      { val: "excited", emoji: "🤩" },
                      { val: "curious", emoji: "🤓" },
                      { val: "calm", emoji: "😌" },
                      { val: "sad", emoji: "😢" },
                      { val: "angry", emoji: "😠" },
                      { val: "silly", emoji: "🤪" },
                      { val: "bored", emoji: "😑" },
                      { val: "sleepy", emoji: "😴" },
                      { val: "surprised", emoji: "😮" },
                      { val: "proud", emoji: "😎" }
                    ].map((item) => {
                      const isSelected = form.emotion.toLowerCase() === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setForm({ ...form, emotion: item.val })}
                          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-pink-500 border-pink-500 text-white shadow-md scale-105 font-bold"
                              : "bg-white/60 border-pink-100 text-purple-950 hover:bg-white text-xs"
                          }`}
                        >
                          <span className="text-lg mb-0.5">{item.emoji}</span>
                          <span className="text-[10px] capitalize font-extrabold">{item.val}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic Selector */}
                <div>
                  <label className="text-sm font-black text-purple-900 block mb-2">Story Theme</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { val: "animals", label: "Animals 🦁" },
                      { val: "space", label: "Space 🚀" },
                      { val: "magic", label: "Magic 🪄" },
                      { val: "dinosaurs", label: "Dinosaurs 🦖" },
                      { val: "ocean", label: "Ocean 🌊" },
                      { val: "science", label: "Science 🧪" }
                    ].map((item) => {
                      const isSelected = form.topic.toLowerCase() === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setForm({ ...form, topic: item.val })}
                          className={`p-2.5 rounded-xl border text-xs font-black transition-all duration-200 cursor-pointer text-center ${
                            isSelected
                              ? "bg-amber-500 border-amber-500 text-white shadow-md scale-105"
                              : "bg-white/60 border-amber-100 text-purple-950 hover:bg-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    placeholder="✍️ Or type a custom adventure..."
                    value={["animals", "space", "magic", "dinosaurs", "ocean", "science"].includes(form.topic.toLowerCase()) ? "" : form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value || "animals" })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-purple-200 text-purple-950 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-purple-400/70"
                  />
                </div>

                {/* Difficulty / Learning Level Selector */}
                <div>
                  <label className="text-sm font-black text-purple-900 block mb-2">Learning Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "beginner", label: "Beginner", desc: "🌱 Simple text" },
                      { val: "intermediate", label: "Mid", desc: "🌿 Fun tales" },
                      { val: "advanced", label: "Advanced", desc: "🌳 Rich words" }
                    ].map((item) => {
                      const isSelected = form.learningLevel.toLowerCase() === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setForm({ ...form, learningLevel: item.val })}
                          className={`p-2.5 rounded-xl border flex flex-col items-center transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-md scale-105"
                              : "bg-white/60 border-emerald-100 text-purple-950 hover:bg-white"
                          }`}
                        >
                          <span className="text-xs font-black">{item.label}</span>
                          <span className="text-[9px] mt-0.5 opacity-90">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Story Language */}
                <div>
                  <label className="text-sm font-black text-purple-900 block mb-2">Language</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: "english", label: "English 🇬🇧" },
                      { val: "hindi", label: "Hindi 🇮🇳" }
                    ].map((item) => {
                      const isSelected = form.language.toLowerCase() === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setForm({ ...form, language: item.val })}
                          className={`p-3 rounded-2xl border font-bold transition-all duration-200 cursor-pointer text-center ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
                              : "bg-white/60 border-blue-100 text-purple-950 hover:bg-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            <button
              onClick={() => generateStory()}
              className="
                w-full
                py-4
                mt-6
                rounded-3xl
                text-white
                text-lg
                font-black
                bg-gradient-to-r
                from-purple-600
                via-pink-500
                to-amber-500
                shadow-xl
                hover:scale-[1.03]
                active:scale-95
                transition-all
                duration-300
                cursor-pointer
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">✨</span>
                  <span>Weaving Magic...</span>
                </>
              ) : (
                <>
                  <span>📖</span>
                  <span>Create Adventure Story</span>
                </>
              )}
            </button>
          </div>

          {/* Story Book */}
          <div className="bg-gradient-to-b from-amber-50/90 to-orange-50/90 rounded-[50px] p-10 shadow-2xl border border-yellow-200">

            {!story ? (
              <div className="h-full flex flex-col items-center justify-center text-center">

                <div className="text-[160px]">
                  📚
                </div>

                <h2 className="text-5xl font-black mt-4">
                  Your Story Awaits ✨
                </h2>

                <p className="mt-4 text-xl text-gray-700">
                  Fill the settings and let AI create a magical adventure.
                </p>

              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

  <h2 className="text-4xl font-black">
    📚 Story Book
  </h2>

  <div className="flex gap-3 flex-wrap items-center">

  <select
    value={selectedVoiceName}
    onChange={(e) => setSelectedVoiceName(e.target.value)}
    className="bg-purple-100 text-purple-700 px-4 py-3 rounded-[20px] font-bold border-2 border-purple-200 focus:outline-none shadow-md max-w-xs"
  >
    <option value="">🗣️ Default AI Voice</option>
    {getFilteredVoices().map((v) => (
      <option key={v.name} value={v.name}>
        🎙️ {v.name}
      </option>
    ))}
  </select>

  <button
    onClick={speakStory}
    className={`px-5 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-2 ${
      isSpeaking && !isPaused
        ? "bg-green-600 text-white ring-4 ring-green-300 scale-105 animate-pulse"
        : "bg-green-500 text-white hover:bg-green-600 hover:scale-105"
    }`}
  >
    <span>🔊</span> Read
  </button>

  <button
    onClick={pauseStory}
    disabled={!isSpeaking || isPaused}
    className={`px-5 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-2 ${
      isPaused
        ? "bg-yellow-600 text-white ring-4 ring-yellow-300 scale-105 animate-pulse"
        : isSpeaking && !isPaused
        ? "bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105"
        : "bg-yellow-300 text-gray-500 cursor-not-allowed opacity-50"
    }`}
  >
    <span>⏸</span> Pause
  </button>

  <button
    onClick={resumeStory}
    disabled={!isPaused}
    className={`px-5 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-2 ${
      isPaused
        ? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105"
        : "bg-blue-300 text-gray-500 cursor-not-allowed opacity-50"
    }`}
  >
    <span>▶</span> Resume
  </button>

  <button
    onClick={stopStory}
    disabled={!isSpeaking && !isPaused}
    className={`px-5 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-2 ${
      isSpeaking || isPaused
        ? "bg-red-500 text-white hover:bg-red-600 hover:scale-105"
        : "bg-red-300 text-gray-500 cursor-not-allowed opacity-50"
    }`}
  >
    <span>⏹</span> Stop
  </button>
    <button
      className="
      bg-yellow-400
      px-5
      py-3
      rounded-full
      font-bold
      shadow-lg
      hover:scale-105
      transition
      "
    >
      ⭐ Save Story
    </button>

  </div>

</div>

                

                <div
                  className="
                    bg-[#fffdf5]
                    border-4
                    border-yellow-200
                    rounded-[30px]
                    p-8
                    max-h-[650px]
                    overflow-y-auto
                    leading-9
                    text-lg
                    shadow-inner
                    whitespace-pre-wrap
                  "
                >
                  {story}
                  <div
  className="
  mt-6
  bg-gradient-to-br
  from-purple-50
  to-pink-50
  border-2
  border-purple-200
  rounded-3xl
  p-6
  shadow-sm
  "
>
  <h3 className="text-2xl font-black text-purple-950 flex items-center gap-2">
    🤖 AI Coach Recommendation
  </h3>

  <p className="mt-3 text-purple-900 font-bold">
    Since you selected the topic
    <strong> "{form.topic}"</strong>
    and are feeling
    <span className="capitalize font-black text-pink-600"> {form.emotion}</span>,
    we have customized a special quest for you! We highly recommend playing
    <strong className="text-purple-900"> {gameSuggestions[form.emotion.toLowerCase()]?.name || "Math Wizard ➕"}</strong>
    to keep your brain engaged.
  </p>

  <button
    onClick={() => {
      const rec = gameSuggestions[form.emotion.toLowerCase()] || gameSuggestions.happy;
      navigate(rec.path);
    }}
    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black rounded-2xl shadow-md transition-all duration-300 transform hover:scale-[1.03] active:scale-95 flex items-center gap-2 text-sm cursor-pointer"
  >
    🚀 Play Suggested Quest: {gameSuggestions[form.emotion.toLowerCase()]?.name || "Math Wizard ➕"}
  </button>
</div>
                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
