import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

export default function KidGate() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login or register
  const [form, setForm] = useState({
    childName: "",
    childAge: 5,
    parentEmail: "",
    parentPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAction = async () => {
    if (!form.childName || !form.parentEmail || !form.parentPassword) {
      setErrorMsg("Please fill in all parent verification fields!");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      // 1. Authenticate parent first to get JWT token
      const parentAuthRes = await API.post("/auth/login", {
        email: form.parentEmail,
        password: form.parentPassword,
      });

      if (!parentAuthRes.data || !parentAuthRes.data.token) {
        throw new Error("Parent authentication failed.");
      }

      // Save parent token locally to allow API requests
      localStorage.setItem("token", parentAuthRes.data.token);
      localStorage.setItem("user", JSON.stringify(parentAuthRes.data.user));

      if (mode === "register") {
        // 2a. Register new child profile
        const createRes = await API.post("/children", {
          name: form.childName,
          age: parseInt(form.childAge, 10),
        });

        if (createRes.data && createRes.data.child) {
          localStorage.setItem("activeChild", JSON.stringify(createRes.data.child));
          setSuccessMsg(`Welcome to the Universe, ${form.childName}! Preparing space flight... 🚀`);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          throw new Error("Failed to create child profile.");
        }
      } else {
        // 2b. Log in existing child profile (Find matching child by name under parent)
        const childrenRes = await API.get("/children");
        const matchingChild = childrenRes.data.children.find(
          (c) => c.name.toLowerCase() === form.childName.toLowerCase()
        );

        if (matchingChild) {
          localStorage.setItem("activeChild", JSON.stringify(matchingChild));
          setSuccessMsg(`Welcome back, ${matchingChild.name}! Syncing brain logs... 🧠`);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          // If no matching profile, give option to register
          setErrorMsg(`Could not find a kid named "${form.childName}" under this account! Change to Register mode to create it.`);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Authentication failed. Verify parent details!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-purple-150 to-pink-200 p-6 flex flex-col justify-between relative overflow-hidden">
      
      {/* Drifting spaceships & stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 5,
            }}
          >
            {["🚀", "🪐", "⭐", "👾", "👨‍🚀"][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Floating Blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Back button */}
      <div className="max-w-4xl mx-auto w-full flex justify-start z-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
        >
          ⬅️ Exit Entrance Gate
        </button>
      </div>

      {/* Portal Entrance Card */}
      <div className="max-w-md w-full mx-auto bg-white/50 backdrop-blur-xl border border-white/40 rounded-[45px] p-8 shadow-2xl z-10 my-auto text-center space-y-6">
        
        <div>
          <span className="text-7xl inline-block mb-3 select-none animate-bounce">🛡️</span>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Kid Universe Gate
          </h1>
          <p className="text-xs font-bold text-purple-900/60 mt-1">
            Please log in or register your child profile using Parent Verification.
          </p>
        </div>

        {/* Mode Selector Toggle Tab */}
        <div className="flex bg-purple-900/10 p-1.5 rounded-2xl border border-purple-900/10">
          <button
            onClick={() => { setMode("login"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-xl font-black text-sm transition-all duration-300 ${mode === "login" ? "bg-white text-purple-950 shadow-md scale-102" : "text-purple-900/60 hover:text-purple-900"}`}
          >
            🔑 Log In Profile
          </button>
          <button
            onClick={() => { setMode("register"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-xl font-black text-sm transition-all duration-300 ${mode === "register" ? "bg-white text-purple-950 shadow-md scale-102" : "text-purple-900/60 hover:text-purple-900"}`}
          >
            ➕ Register Kid
          </button>
        </div>

        {/* Error notification bar */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 border border-red-200 text-red-800 text-xs font-bold py-2.5 px-4 rounded-xl"
            >
              ⚠️ {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success notification bar */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-100 border border-emerald-250 text-emerald-800 text-xs font-bold py-2.5 px-4 rounded-xl"
            >
              🎉 {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields Stack */}
        <div className="space-y-3">
          
          <div className="bg-white/40 border border-purple-100 p-2.5 rounded-2xl text-left space-y-1.5">
            <span className="text-[10px] font-black text-purple-950 uppercase tracking-widest pl-1.5">👶 Kid's Info</span>
            <input
              type="text"
              value={form.childName}
              className="w-full bg-white border border-purple-100 p-3.5 rounded-xl text-purple-950 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
              placeholder="Child's First Name"
              onChange={(e) => setForm({ ...form, childName: e.target.value })}
            />
            {mode === "register" && (
              <input
                type="number"
                value={form.childAge}
                className="w-full bg-white border border-purple-100 p-3.5 rounded-xl text-purple-950 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400 mt-2"
                placeholder="Child's Age"
                onChange={(e) => setForm({ ...form, childAge: e.target.value })}
              />
            )}
          </div>

          <div className="bg-white/40 border border-purple-100 p-2.5 rounded-2xl text-left space-y-1.5">
            <span className="text-[10px] font-black text-purple-950 uppercase tracking-widest pl-1.5">🛡️ Parent Verification</span>
            <input
              type="email"
              value={form.parentEmail}
              className="w-full bg-white border border-purple-100 p-3.5 rounded-xl text-purple-950 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
              placeholder="Parent Account Email"
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
            />
            <input
              type="password"
              value={form.parentPassword}
              className="w-full bg-white border border-purple-100 p-3.5 rounded-xl text-purple-950 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-400"
              placeholder="Parent Password"
              onChange={(e) => setForm({ ...form, parentPassword: e.target.value })}
            />
          </div>

        </div>

        {/* Action Trigger Button */}
        <button
          onClick={handleAction}
          disabled={loading}
          className="w-full py-4.5 rounded-2xl text-white font-black text-lg bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:brightness-105 active:scale-95 shadow-lg shadow-purple-500/20 transition-all duration-300 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Verifying..." : mode === "login" ? "🔑 Enter Kid Universe" : "🚀 Create Profile & Launch"}
        </button>

      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-950/40">
        © 2026 NeuroNest Kids. Protected Parent-Child Security Protocol.
      </div>

    </div>
  );
}
