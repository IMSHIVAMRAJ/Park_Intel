import { useState } from "react";
import { Sparkles, BrainCircuit, Clock, Calendar as CalendarIcon, Cpu, Zap, Activity, Info } from "lucide-react";
import { motion } from "framer-motion"; // Optional: For that smooth AI feel

function PredictorPage() {
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handlePredict = async () => {
    if (!day || hour === "") {
      setError("Please select day and hour");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setAnalysis("");
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/prediction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, hour: Number(hour) }),
      });
      const data = await res.json();
      setAnalysis(data.analysis || data.message);
    } catch (err) {
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center p-6 md:p-12 text-white font-sans">
      
      {/* --- AI STICKERS / FLOATING ELEMENTS --- */}
      <div className="absolute top-10 left-10 opacity-20 animate-pulse hidden md:block">
        <Cpu size={120} className="text-yellow-400 rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-bounce hidden md:block">
        <BrainCircuit size={100} className="text-yellow-500 -rotate-12" />
      </div>
      <div className="absolute top-1/2 left-20 opacity-10 hidden md:block">
        <Zap size={60} className="text-yellow-300" />
      </div>

      {/* --- HEADER --- */}
      <div className="relative z-10 text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full mb-4">
          <Sparkles size={16} className="text-yellow-400" />
          <span className="text-yellow-400 text-xs font-black tracking-widest uppercase">Predictive Intelligence</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white">
          PARK <span className="text-yellow-400">INTEL</span> AI
        </h1>
        <p className="text-zinc-500 mt-2 font-medium tracking-wide">Predicting space availability .</p>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Decorative corner accents */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-xl"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rounded-br-xl"></div>

        <div className="bg-zinc-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Day Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
                <CalendarIcon size={14} className="text-yellow-400" /> Select Day
              </label>
              <select
                className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white focus:border-yellow-400 outline-none transition-all appearance-none cursor-pointer hover:bg-zinc-800"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">Choose Day</option>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Hour Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
                <Clock size={14} className="text-yellow-400" /> Arrival Time
              </label>
              <select
                className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white focus:border-yellow-400 outline-none transition-all appearance-none cursor-pointer hover:bg-zinc-800"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              >
                <option value="">Choose Hour</option>
                {[...Array(24).keys()].map((h) => (
                  <option key={h} value={h}>{h}:00 {h < 12 ? 'AM' : 'PM'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full relative group overflow-hidden bg-yellow-400 disabled:bg-zinc-700 text-black font-black py-5 rounded-2xl transition-all active:scale-95"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 text-lg uppercase">
              {loading ? (
                <> <Activity className="animate-spin" /> Processing Please Wait...</>
              ) : (
                <> <BrainCircuit /> Run Prediction</>
              )}
            </div>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
              <Info size={18} /> {error}
            </div>
          )}

          {/* Result Section */}
          {analysis && (
            <div className="mt-10 pt-8 border-t border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <h2 className="text-yellow-400 font-black uppercase tracking-widest text-sm">AI Response Generated</h2>
              </div>
              <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                   <Sparkles size={20} className="text-yellow-400/20" />
                </div>
                <p className="text-zinc-300 leading-relaxed font-medium italic">
                  "{analysis}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-10 text-zinc-600 text-[10px] uppercase font-bold tracking-[0.3em]">
        Model V3.4 // Real-time Datasets Active
      </p>
    </div>
  );
}

export default PredictorPage;