import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, LogIn, UserPlus, LogOut, LayoutDashboard, Home as HomeIcon } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/"; // Force redirect on logout
  };

  // Helper for active link styling
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-[#0D0D0B]/80 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* --- LOGO (Routes to Home) --- */}
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <div className="bg-yellow-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Cpu size={22} className="text-black" />
            </div>
            <h1 className="text-white font-black italic text-2xl tracking-tighter uppercase group-hover:text-yellow-400 transition-colors">
              PARK <span className="text-yellow-400">INTEL</span>
            </h1>
          </Link>

          {/* --- NAVIGATION LINKS --- */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <Link
              to="/"
              className={`flex items-center gap-2 transition-all ${
                isActive("/") ? "text-yellow-400" : "text-zinc-500 hover:text-white"
              }`}
            >
              <HomeIcon size={14} /> Home
            </Link>
            <Link
              to="/bookings"
              className={`flex items-center gap-2 transition-all ${
                isActive("/bookings") ? "text-yellow-400" : "text-zinc-500 hover:text-white"
              }`}
            >
              <LayoutDashboard size={14} /> My Bookings
            </Link>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex gap-4 items-center">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-all"
                >
                  <LogIn size={16} className="text-yellow-400" /> Login
                </button>

                <button
                  onClick={() => setRegisterOpen(true)}
                  className="bg-yellow-400 text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/10 active:scale-95 flex items-center gap-2"
                >
                  <UserPlus size={16} /> Register
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                    System Linked
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl hover:border-red-500/50 transition-all duration-300"
                >
                  <LogOut size={16} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
                  <span className="text-xs font-bold uppercase text-zinc-400 group-hover:text-white">Exit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- MODALS --- */}
      {loginOpen && (
        <LoginModal
          close={() => {
            setLoginOpen(false);
            setIsLoggedIn(true);
          }}
        />
      )}

      {registerOpen && (
        <RegisterModal close={() => setRegisterOpen(false)} />
      )}
    </>
  );
}

export default Navbar;