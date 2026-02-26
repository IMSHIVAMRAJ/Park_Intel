import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LogIn, LogOut, MapPin, BrainCircuit, Car, DoorOpen, Navigation, Cpu, 
  Database, Server, Cloud, Zap, Search, Scan, Sparkles
} from "lucide-react";
import StartParkingModal from "../components/StartParkingModal";
import EndParkingModal from "../components/EndParkingModal";
import RegisterModal from "../components/RegisterModal";
import video from "../assets/parking.mp4";

function Home() {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  
  const servicesRef = useRef(null);
  const navigate = useNavigate();

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Tech Stack Data
  const techStack = [
    { name: "React", icon: <Cpu className="text-blue-400" />, desc: "Builds the high-performance interactive user interface.", color: "border-blue-400/30" },
    { name: "Node.js", icon: <Zap className="text-emerald-400" />, desc: "Handles backend logic and heavy API processing.", color: "border-emerald-400/30" },
    { name: "Express.js", icon: <Server className="text-yellow-400" />, desc: "Lightweight framework powering structured REST APIs.", color: "border-yellow-400/30" },
    { name: "Redis", icon: <Search className="text-red-500" />, desc: "Real-time geospatial search for nearby spots.", color: "border-red-500/30" },
    { name: "MySQL", icon: <Database className="text-blue-500" />, desc: "Secure bookings, users, and billing records.", color: "border-blue-500/30" },
    { name: "Railway", icon: <Cloud className="text-purple-500" />, desc: "Reliable cloud hosting for production DB.", color: "border-purple-500/30" },
    { name: "Upstash", icon: <Zap className="text-emerald-500" />, desc: "Serverless Redis for high-performance caching.", color: "border-emerald-500/30" },
    { name: "FastAPI", icon: <Server className="text-yellow-500" />, desc: "High-speed async OCR and AI endpoints.", color: "border-yellow-500/30" },
    { name: "LangChain", icon: <Cpu className="text-orange-500" />, desc: "Manages structured prompts and AI context.", color: "border-orange-500/30" },
    { name: "Gemini AI", icon: <BrainCircuit className="text-stone-400" />, desc: "Generates smart natural language insights.", color: "border-stone-500/30" },
    { name: "OCR API", icon: <Scan className="text-white" />, desc: "Auto-extracts vehicle numbers from images.", color: "border-white/20" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-white font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-28 pb-24 px-6 overflow-hidden">
        
        {/* VIDEO BACKGROUND LAYER */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-30 blur-[2px] scale-105"
          >
       
            <source src={video} type="video/mp4" />
          </video>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0B]/60 via-transparent to-[#0D0D0B]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 bg-[#1A1A14]/80 backdrop-blur-sm border border-yellow-500/30 px-4 py-1.5 rounded-full relative z-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-yellow-500 uppercase">
            AI-Powered Systems Online
          </span>
        </motion.div>

        <h1 className="relative z-10 text-5xl md:text-8xl font-extrabold tracking-tight mb-6 max-w-5xl leading-[1.05]">
          The Future of <span className="text-yellow-400">Smart Parking</span> is Here
        </h1>

        <p className="relative z-10 text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          Experience seamless urban mobility with Park-Intel's premium AI predictor, 
          real-time vacancy tracking, and automated digital payments.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row gap-5">
          <button onClick={() => setRegisterOpen(true)} className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20 active:scale-95">
            Get Started Now →
          </button>
          <button onClick={scrollToServices} className="bg-white/5 backdrop-blur-md border border-white/10 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
            Explore Features
          </button>
        </div>
      </section>

      {/* Services Section */}
      <div ref={servicesRef} className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-10">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3 font-mono uppercase tracking-tighter">Parking Services</h2>
          <p className="text-gray-500 max-w-md text-lg italic">
            Select an action to begin your premium parking experience .
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ServiceCard title="Start Parking" description="Initiate your parking session instantly with AI-powered license plate verification." icon={<LogIn className="w-5 h-5 text-yellow-400" />} illustration={<Car className="w-16 h-16 absolute -right-2 -top-2 opacity-10 text-white" />} btnText="Start Session" onClick={() => setStartOpen(true)} variant="filled" />
          <ServiceCard title="End Parking" description="Securely end your session and process automated payments with digital receipting." icon={<LogOut className="w-5 h-5 text-yellow-400" />} illustration={<DoorOpen className="w-16 h-16 absolute -right-2 -top-2 opacity-10 text-white" />} btnText="End Session" onClick={() => setEndOpen(true)} variant="outline" />
          <ServiceCard title="Find Nearest Parking" description="Locate available premium spots near your destination with real-time occupancy maps." icon={<MapPin className="w-5 h-5 text-yellow-400" />} illustration={<Navigation className="w-16 h-16 absolute -right-2 -top-2 opacity-10 text-white" />} btnText="Open Map" onClick={() => navigate("/find")} variant="filled" />
          <ServiceCard title="AI Parking Predictor" description="Predict availability using ahistorical traffic patterns." icon={<BrainCircuit className="w-5 h-5 text-yellow-400" />} illustration={<Cpu className="w-16 h-16 absolute -right-2 -top-2 opacity-10 text-white" />} btnText="Predict Now" onClick={() => navigate("/predict")} variant="outline" />
        </div>

        {/* --- HOW PARK-INTEL WORKS SECTION --- */}
        <div className="mt-40 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">
              How <span className="text-yellow-400 underline decoration-yellow-400/30">Park-Intel</span> Works
            </h2>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">The  Architecture Behind the Scenes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((tech, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`bg-[#121210] border-l-4 ${tech.color} p-6 rounded-2xl hover:bg-zinc-900 transition-all`}
              >
                <div className="bg-zinc-950 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-white/5">
                  {tech.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{tech.name}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="mt-32 text-center py-20 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
            <h2 className="text-5xl font-bold mb-4">Ready to transform your arrival?</h2>
            <p className="text-gray-400 mb-8 text-lg">Join 50,000+ drivers who have upgraded their parking experience.</p>
            <button onClick={() => setRegisterOpen(true)} className="bg-yellow-400 text-black px-12 py-4 rounded-full font-bold hover:bg-yellow-300 transition-all shadow-2xl shadow-yellow-400/20">
                Register Your Account
            </button>
        </div>
      </div>

      {/* Modals */}
      {startOpen && <StartParkingModal close={() => setStartOpen(false)} />}
      {endOpen && <EndParkingModal close={() => setEndOpen(false)} />}
      {registerOpen && <RegisterModal close={() => setRegisterOpen(false)} />}
    </div>
  );
}

function ServiceCard({ title, description, icon, illustration, btnText, onClick, variant }) {
  return (
    <motion.div
      whileHover={{ y: -8, borderColor: 'rgba(250, 204, 21, 0.4)' }}
      className="group bg-[#121210] border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-300"
    >
      {illustration}
      <div className="bg-yellow-400/10 p-4 rounded-2xl w-fit mb-8 group-hover:bg-yellow-400/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 text-base mb-10 leading-relaxed max-w-[320px]">
        {description}
      </p>
      
      <button
        onClick={onClick}
        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2
          ${variant === 'filled' 
            ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
            : 'bg-white/5 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400 hover:text-black'}`}
      >
        {btnText} <span className="text-xs">▾</span>
      </button>
    </motion.div>
  );
}

export default Home;