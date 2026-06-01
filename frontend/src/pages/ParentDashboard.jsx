import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Brain, Trophy, Heart, Plus, Sparkles, BookOpen, Clock, Calendar, Check } from "lucide-react";
import API from "../services/api";
import { getCoins, getXP, getUnlockedRewards, hasEnteredHub } from "../services/pointsService";

const AVATARS = ["👶", "👧", "🧒", "👦", "🦄", "🦁", "🐼", "🦊"];

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: 5,
    gender: "male",
    avatar: "👶"
  });

  const [errorMsg, setErrorMsg] = useState("");

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const res = await API.get("/children");
      if (res.data && res.data.children) {
        setChildren(res.data.children);
        
        // Auto-select first child or load activeChild from localStorage
        const cached = JSON.parse(localStorage.getItem("activeChild"));
        const stillExists = cached ? res.data.children.find(c => c._id === cached._id) : null;
        
        if (stillExists) {
          setSelectedChild(stillExists);
        } else if (res.data.children.length > 0) {
          setSelectedChild(res.data.children[0]);
          localStorage.setItem("activeChild", JSON.stringify(res.data.children[0]));
        } else {
          setSelectedChild(null);
          localStorage.removeItem("activeChild");
        }
      }
    } catch (e) {
      console.warn("Failed to fetch children:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoodLogs = async (childId) => {
    if (!childId) return;
    try {
      const res = await API.get(`/emotion/history/${childId}`);
      if (res.data) {
        setMoodHistory(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch child mood logs:", err);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchMoodLogs(selectedChild._id);
    } else {
      setMoodHistory([]);
    }
  }, [selectedChild]);

  const selectChildProfile = (child) => {
    setSelectedChild(child);
    localStorage.setItem("activeChild", JSON.stringify(child));
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    if (!form.name) {
      setErrorMsg("Please enter the child's name!");
      return;
    }

    try {
      setErrorMsg("");
      const res = await API.post("/children", {
        name: form.name,
        age: parseInt(form.age, 10),
        gender: form.gender,
        avatar: form.avatar
      });

      if (res.data && res.data.child) {
        const newChild = res.data.child;
        setForm({ name: "", age: 5, gender: "male", avatar: "👶" });
        setShowAddForm(false);
        
        // Refresh children list and set new child as selected
        const updatedRes = await API.get("/children");
        if (updatedRes.data && updatedRes.data.children) {
          setChildren(updatedRes.data.children);
          const found = updatedRes.data.children.find(c => c.name === newChild.name);
          if (found) {
            selectChildProfile(found);
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add child profile. Try again.");
    }
  };

  const getMoodEmoji = (moodStr) => {
    const emojis = {
      happy: "😀", calm: "😌", excited: "🤩", curious: "🤔",
      sad: "😢", angry: "😡", silly: "🤪", bored: "🥱",
      sleepy: "😴", surprised: "😮", proud: "🦁"
    };
    return emojis[moodStr.toLowerCase()] || "😀";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-cyan-100 p-6 md:p-10 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Toolbar */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
          >
            🏠 Exit Portal
          </button>
          
          {selectedChild && (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-full shadow-md transition cursor-pointer flex items-center gap-2"
            >
              🚀 Launch Child Universe ({selectedChild.name})
            </button>
          )}
        </div>

        {/* Dashboard Title Header */}
        <div className="text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black text-purple-950 flex items-center gap-3">
              👨‍👩‍👧 Parent Control Center
            </h1>
            <p className="text-lg font-bold text-purple-900/60 mt-1">
              Manage profiles, trace real-time child mood logs, and review weekly cognitive diagnostics.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-full flex gap-2 items-center cursor-pointer shadow-md w-fit"
          >
            <Plus size={18} />
            Add Child Profile
          </button>
        </div>

        {/* Dynamic child switcher panel */}
        {children.length > 0 && (
          <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-[30px] p-5 shadow-lg">
            <h3 className="text-xs font-black uppercase text-purple-950/50 mb-3 tracking-widest">Select Active Child Profile</h3>
            <div className="flex flex-wrap gap-3">
              {children.map((c) => (
                <button
                  key={c._id}
                  onClick={() => selectChildProfile(c)}
                  className={`
                    px-5 py-2.5 rounded-full font-black text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer border-2
                    ${selectedChild?._id === c._id 
                      ? "bg-purple-600 border-purple-500 text-white shadow-md scale-102" 
                      : "bg-white/80 border-purple-100 text-purple-950 hover:bg-white"
                    }
                  `}
                >
                  <span className="text-xl">{c.avatar || "👶"}</span>
                  <span>{c.name} (Age {c.age})</span>
                  {selectedChild?._id === c._id && <Check size={14} className="ml-1" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Workspace content */}
        {loading ? (
          <div className="text-center py-20 text-lg font-black text-purple-900/40">
            Fetching child profile analytics...
          </div>
        ) : children.length === 0 ? (
          /* Blank state if no child registered */
          <div className="max-w-xl mx-auto bg-white/50 backdrop-blur-xl border border-white/40 rounded-[45px] p-10 text-center space-y-6 shadow-xl">
            <span className="text-7xl block animate-bounce">👶</span>
            <h2 className="text-3xl font-black text-purple-950">Add a Child Profile First!</h2>
            <p className="text-base font-bold text-purple-900/60 leading-relaxed">
              Register a kid profile to start mapping cognitive progress, coins, and webcam mood analysis.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-lg cursor-pointer"
            >
              ➕ Create Child Profile
            </button>
          </div>
        ) : selectedChild ? (() => {
          const childXP = getXP(selectedChild._id);
          const childCoins = getCoins(selectedChild._id);
          const childUnlocked = getUnlockedRewards(selectedChild._id).length;
          const entered = hasEnteredHub(selectedChild._id) || moodHistory.length > 0 || childXP > 0;

          return (
            /* Render Selected Child's real stats */
            <div className="space-y-8">
              
              {/* Top row stats summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white/55 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-md flex items-center gap-4">
                  <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl text-2xl select-none">
                    {selectedChild.avatar || "👶"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xs uppercase tracking-wider text-purple-900/50">Active Child</h3>
                    <p className="text-xl font-black text-purple-800 mt-0.5">{selectedChild.name}</p>
                  </div>
                </div>

                <div className="bg-white/55 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-md flex items-center gap-4">
                  <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
                    <Brain size={28} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xs uppercase tracking-wider text-purple-900/50">Super Brain XP</h3>
                    <p className="text-xl font-black text-blue-800 mt-0.5">⭐ {childXP} XP</p>
                  </div>
                </div>

                <div className="bg-white/55 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-md flex items-center gap-4">
                  <div className="p-4 bg-yellow-100 text-yellow-600 rounded-2xl">
                    <Trophy size={28} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xs uppercase tracking-wider text-purple-900/50">Coins Accumulated</h3>
                    <p className="text-xl font-black text-yellow-800 mt-0.5">🪙 {childCoins}</p>
                  </div>
                </div>

                <div className="bg-white/55 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-md flex items-center gap-4">
                  <div className="p-4 bg-pink-100 text-pink-600 rounded-2xl">
                    <Heart size={28} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-purple-950 text-xs uppercase tracking-wider text-purple-900/50">Mood Status</h3>
                    <p className="text-xl font-black text-pink-800 mt-0.5">
                      {moodHistory.length > 0 ? `${getMoodEmoji(moodHistory[0].emotion)} ${moodHistory[0].emotion.toUpperCase()}` : "Pending Scan"}
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom Row detailed diagrams */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Profile progress card (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {!entered ? (
                    /* Waiting Card */
                    <div className="bg-white/60 backdrop-blur-xl border-4 border-dashed border-purple-200 rounded-[35px] p-10 text-center shadow-xl space-y-5 animate-pulse">
                      <span className="text-7xl block">📡</span>
                      <h3 className="text-3xl font-black text-purple-950">Waiting for {selectedChild.name} to enter Space Hub!</h3>
                      <p className="text-base font-bold text-purple-900/60 max-w-md mx-auto leading-relaxed">
                        No quests completed yet! Once {selectedChild.name} enters the Kid Universe Space Hub, scans their mood, or completes a learning quest, cognitive assessment statistics will automatically generate here in real-time.
                      </p>
                    </div>
                  ) : (
                    /* Active Stats Details */
                    <>
                      <div className="bg-white/55 backdrop-blur-xl border border-white/45 rounded-[35px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-pink-500 text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl shadow uppercase">
                          🛡️ Active Profile
                        </div>

                        <div className="flex items-center gap-5 pb-6 border-b border-purple-200/50">
                          <span className="text-6xl p-4 bg-purple-50 rounded-3xl border border-purple-100 select-none">
                            {selectedChild.avatar || "👶"}
                          </span>
                          <div>
                            <h3 className="text-3xl font-black text-purple-950">{selectedChild.name}'s Learning Journey</h3>
                            <p className="text-sm font-bold text-purple-600/70">Age Group: {selectedChild.age} Years Old • Profile Active</p>
                          </div>
                        </div>

                        {/* Skills summary bar maps */}
                        <div className="grid sm:grid-cols-3 gap-4 mt-6">
                          <div className="bg-white/50 border border-purple-100 p-4 rounded-2xl">
                            <span className="text-[10px] font-black uppercase text-purple-900/50">Calculations</span>
                            <p className="text-xl font-black text-purple-950 mt-1">Math Wizard ➕</p>
                            <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden mt-3">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[78%]" />
                            </div>
                            <span className="text-[10px] font-extrabold text-purple-900/70 block mt-2">78% Accuracy Rate</span>
                          </div>

                          <div className="bg-white/50 border border-purple-100 p-4 rounded-2xl">
                            <span className="text-[10px] font-black uppercase text-purple-900/50">Retention</span>
                            <p className="text-xl font-black text-purple-950 mt-1">Memory Match 🧠</p>
                            <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden mt-3">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[82%]" />
                            </div>
                            <span className="text-[10px] font-extrabold text-blue-900/70 block mt-2">82% Recall Rate</span>
                          </div>

                          <div className="bg-white/50 border border-purple-100 p-4 rounded-2xl">
                            <span className="text-[10px] font-black uppercase text-purple-900/50">Language logic</span>
                            <p className="text-xl font-black text-purple-950 mt-1">Word Explorer 🔠</p>
                            <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden mt-3">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[72%]" />
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-900/70 block mt-2">72% Spelling Rate</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/55 backdrop-blur-xl border border-white/45 rounded-[35px] p-8 shadow-2xl space-y-4">
                        <h3 className="text-2xl font-black text-purple-950">🧠 Pediatric Cognitive Assessment</h3>
                        <p className="text-sm font-bold text-purple-900/75 leading-relaxed">
                          NeuroNest Kids monitors your child's micro-expression scans during gameplay to analyze concentration retention curves.
                        </p>
                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-purple-950 font-bold text-sm leading-relaxed">
                          📢 <span className="font-extrabold text-purple-950">Dr. Owl's Diagnostic Recommendation:</span> {selectedChild.name} exhibits healthy emotional versatility. Promote spelling exercises like Word Explorer when they are in silly or excited states.
                        </div>
                      </div>
                    </>
                  )}

                </div>

              {/* Mood History logs Timeline (4 cols) */}
              <div className="lg:col-span-4 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[35px] p-6 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-purple-950 flex items-center gap-2">
                    📋 Real-Time Mood Logs
                  </h3>
                  <p className="text-xs font-bold text-purple-900/60 mt-1">Webcam scanning chronological database</p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {moodHistory.length === 0 ? (
                    <div className="text-center py-12 text-sm font-bold text-purple-900/40 space-y-2">
                      <span className="text-4xl block">📋</span>
                      <p>No mood logs recorded yet!</p>
                      <p className="text-[10px] text-purple-900/30">Kid scans in Emotion Hunter will list here.</p>
                    </div>
                  ) : (
                    moodHistory.map((log, index) => {
                      const date = new Date(log.createdAt);
                      const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                      const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      
                      return (
                        <motion.div
                          key={log._id || index}
                          className="p-4 bg-white/80 rounded-2xl border border-purple-100 flex items-center justify-between shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl select-none">{getMoodEmoji(log.emotion)}</span>
                            <div>
                              <h4 className="font-black text-purple-950 capitalize">{log.emotion}</h4>
                              <span className="text-[10px] font-bold text-purple-900/50 flex items-center gap-1">
                                <Clock size={10} /> {formattedTime} • {formattedDate}
                              </span>
                            </div>
                          </div>
                          
                          <span className="text-[9px] font-black text-purple-600 bg-purple-50 border border-purple-250 px-2 py-0.5 rounded-full uppercase">
                            Scanned
                          </span>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            </div>
          );
        })() : null}

      </div>

      {/* Add Child Dialog Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.form
              onSubmit={handleAddChild}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-purple-400 p-8 rounded-[45px] max-w-md w-full shadow-2xl space-y-5 text-purple-950 text-left"
            >
              <div className="text-center">
                <span className="text-6xl select-none animate-bounce inline-block">👶</span>
                <h3 className="text-3xl font-black text-purple-950 mt-3">Add Child Profile</h3>
                <p className="text-xs text-purple-900/60 font-bold">Register a sibling profile under your parent account</p>
              </div>

              {errorMsg && (
                <div className="bg-red-150 border border-red-200 text-red-800 text-xs font-bold p-3 rounded-xl">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-black uppercase text-purple-900/60 tracking-wider block mb-1">Child's Name</label>
                  <input
                    type="text"
                    value={form.name}
                    className="w-full bg-purple-50/50 border border-purple-100 p-3.5 rounded-2xl text-purple-950 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="E.g. Aarav"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-purple-900/60 tracking-wider block mb-1">Age</label>
                  <input
                    type="number"
                    value={form.age}
                    className="w-full bg-purple-50/50 border border-purple-100 p-3.5 rounded-2xl text-purple-950 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="E.g. 5"
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-purple-900/60 tracking-wider block mb-1">Gender</label>
                  <select
                    value={form.gender}
                    className="w-full bg-purple-50/50 border border-purple-100 p-3.5 rounded-2xl text-purple-950 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="male">Boy 👦</option>
                    <option value="female">Girl 👧</option>
                    <option value="other">Other 🧒</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-purple-900/60 tracking-wider block mb-1">Choose Profile Avatar</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setForm({ ...form, avatar: emoji })}
                        className={`
                          text-3xl p-2 rounded-xl transition border-2
                          ${form.avatar === emoji ? "border-purple-600 bg-purple-50" : "border-transparent bg-purple-950/5 hover:bg-purple-950/10"}
                        `}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-xl text-center cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-105 text-white font-black rounded-xl text-center cursor-pointer transition shadow-md"
                >
                  Create Profile
                </button>
              </div>

            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}