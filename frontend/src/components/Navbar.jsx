import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, LogIn, UserPlus, LogOut, LayoutDashboard, Home as HomeIcon, Menu, X } from "lucide-react";
import ParkLogo from "../assets/Park.png";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <div className="bg-black-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <img src={ParkLogo} alt="Park" className="w-6 h-6 object-contain" />
            </div>
            <h1 className="text-white font-black text-2xl tracking-tighter uppercase group-hover:text-yellow-400 transition-colors">
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
                  className="hidden sm:flex bg-yellow-400 text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/10 active:scale-95 items-center gap-2"
                >
                  <UserPlus size={16} /> Register
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-6">
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

            {/* --- MOBILE MENU BUTTON --- */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-zinc-800 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0D0D0B]/95 backdrop-blur-md">
            <div className="flex flex-col gap-2 px-6 py-4">
              {/* Mobile Navigation Links */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  isActive("/") 
                    ? "text-yellow-400 bg-yellow-400/10" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <HomeIcon size={18} /> 
                <span className="text-sm font-bold uppercase tracking-wider">Home</span>
              </Link>
              
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  isActive("/bookings") 
                    ? "text-yellow-400 bg-yellow-400/10" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <LayoutDashboard size={18} /> 
                <span className="text-sm font-bold uppercase tracking-wider">My Bookings</span>
              </Link>

              {/* Mobile Auth Buttons */}
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    <LogIn size={18} className="text-yellow-400" /> 
                    <span className="text-sm font-bold uppercase tracking-wider">Login</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setRegisterOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 transition-all font-black uppercase tracking-wider"
                  >
                    <UserPlus size={18} /> 
                    <span className="text-sm">Register</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                      System Linked
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-500/50 transition-all"
                  >
                    <LogOut size={18} className="text-zinc-500" />
                    <span className="text-sm font-bold uppercase text-zinc-400">Exit</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* --- MODALS --- */}
      {loginOpen && (
        <LoginModal
          close={() => {
            setLoginOpen(false);
            // Re-check token after modal closes
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
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