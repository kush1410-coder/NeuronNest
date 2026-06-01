import { motion } from "framer-motion";
import { FaBook, FaBrain, FaStar } from "react-icons/fa";

export default function ChildHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-yellow-200 to-blue-300">

      <div className="text-center py-20">

        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl font-bold text-white"
        >
          NeuroNest Kids
        </motion.h1>

        <p className="mt-6 text-2xl">
          Learn • Play • Grow
        </p>

        <div className="grid md:grid-cols-3 gap-8 p-12">

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <FaBook size={50} />
            <h2 className="text-2xl mt-4">Stories</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <FaBrain size={50} />
            <h2 className="text-2xl mt-4">Memory Games</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <FaStar size={50} />
            <h2 className="text-2xl mt-4">Rewards</h2>
          </div>

        </div>
      </div>

    </div>
  );
}