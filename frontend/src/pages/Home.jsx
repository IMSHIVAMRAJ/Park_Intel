import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StartParkingModal from "../components/StartParkingModal";
import EndParkingModal from "../components/EndParkingModal";

function Home() {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-black text-white px-16 py-12">

      {/* Hero Section */}
      <div className="mb-16">
        <span className="text-xs bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30">
          SYSTEM ONLINE
        </span>

        <h1 className="text-5xl font-bold mt-6">
          Welcome back, <span className="text-yellow-400">Driver.</span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl">
          AI-powered smart parking at your fingertips. Manage your sessions,
          find spots, and predict availability in real-time.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-10">

        {/* Start Parking */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-black border border-yellow-500/20 
                     p-8 rounded-2xl shadow-lg hover:shadow-yellow-500/10 transition"
        >
          <h2 className="text-2xl font-semibold mb-4">Start Parking</h2>
          <p className="text-gray-400 text-sm mb-6">
            Instant entry via AI plate recognition. No tickets, no paper.
          </p>
          <button
            onClick={() => setStartOpen(true)}
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Enter Now →
          </button>
        </motion.div>

        {/* End Parking */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-black border border-yellow-500/20 
                     p-8 rounded-2xl shadow-lg hover:shadow-yellow-500/10 transition"
        >
          <h2 className="text-2xl font-semibold mb-4">End Parking</h2>
          <p className="text-gray-400 text-sm mb-6">
            Calculate fees and exit seamlessly.
          </p>
          <button
            onClick={() => setEndOpen(true)}
            className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            Exit Gate →
          </button>
        </motion.div>

        {/* Find Nearest */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-black border border-yellow-500/20 
                     p-8 rounded-2xl shadow-lg hover:shadow-yellow-500/10 transition"
        >
          <h2 className="text-2xl font-semibold mb-4">Find Nearest Parking</h2>
          <p className="text-gray-400 text-sm mb-6">
            Real-time availability mapping.
          </p>
          <button
            onClick={() => navigate("/find")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            View →
          </button>
        </motion.div>

        {/* Predictor */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-black border border-yellow-500/20 
                     p-8 rounded-2xl shadow-lg hover:shadow-yellow-500/10 transition "
        >

          <h2 className="text-2xl font-semibold mb-4">AI Parking Predictor</h2>
          <p className="text-gray-400 text-sm mb-6">
            Smart forecast for peak parking hours.
          </p>
          <button
            onClick={() => navigate("/predict")}
            className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            Predict →
          </button>
        </motion.div>

      </div>

      {startOpen && <StartParkingModal close={() => setStartOpen(false)} />}
      {endOpen && <EndParkingModal close={() => setEndOpen(false)} />}
    </div>
  );
}

export default Home;