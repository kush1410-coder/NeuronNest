import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "parent",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const register = async () => {
    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      await API.post("/auth/register", form);

      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-cyan-100 flex flex-col justify-between p-6 relative overflow-hidden">
      
      {/* Sparkles background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              scale: [0.9, 1.1, 0.9],
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 5,
            }}
          >
            {["✨", "🎈", "🌟", "📝"][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Floating blobs backdrop */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Toolbar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-start z-10">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-white/70 hover:bg-white text-purple-950 font-black rounded-full shadow-md transition cursor-pointer"
        >
          🏠 Back to Home
        </button>
      </div>

      {/* Form card container */}
      <div className="max-w-md w-full mx-auto bg-white/50 backdrop-blur-xl border border-white/40 rounded-[45px] p-8 md:p-10 shadow-2xl z-10 my-auto text-center space-y-6">
        
        <div>
          <span className="text-6xl inline-block mb-3 select-none">🎈</span>
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
            Parent Register
          </h1>
          <p className="text-sm font-bold text-purple-900/60 mt-1">
            Create an account to track your child's brain journey
          </p>
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

        {/* Form Inputs stack */}
        <div className="space-y-3.5">
          <input
            type="text"
            value={form.name}
            className="w-full bg-white border border-purple-100 p-4 rounded-2xl text-purple-950 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
            placeholder="Parent Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            value={form.email}
            className="w-full bg-white border border-purple-100 p-4 rounded-2xl text-purple-950 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
            placeholder="Parent Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            value={form.password}
            className="w-full bg-white border border-purple-100 p-4 rounded-2xl text-purple-950 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
            placeholder="Account Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Register Button */}
        <button
          onClick={register}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-black text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-105 active:scale-95 shadow-lg shadow-purple-500/20 transition-all duration-300 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account 🚀"}
        </button>

        {/* Footnote */}
        <p className="text-sm font-semibold text-purple-900/60">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-pink-500 cursor-pointer ml-1.5 font-extrabold hover:underline"
          >
            Login here
          </span>
        </p>

      </div>

      <div className="max-w-4xl mx-auto w-full text-center py-2 text-xs font-bold text-purple-950/40">
        © 2026 NeuroNest Kids. Protected Parent Access.
      </div>

    </div>
  );
}