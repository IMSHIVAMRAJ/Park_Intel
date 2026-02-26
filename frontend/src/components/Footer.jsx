import React from "react";
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, Car, Cpu } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-zinc-400 py-12 border-t border-zinc-900 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Identity */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-yellow-400 p-1.5 rounded-lg">
                <Cpu size={20} className="text-black" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter text-white">
                PARK <span className="text-yellow-400">INTEL</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Revolutionizing urban mobility through AI and real-time geospatial intelligence. Your premium parking partner.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-yellow-400 hover:text-black transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-l-2 border-yellow-400 pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              {["Find Parking", "AI Predictor", "My Bookings", "Pricing", "About Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                    <span className="text-[10px] text-zinc-700">/</span> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-l-2 border-yellow-400 pl-3">
              Support & Tech
            </h3>
            <ul className="space-y-3 text-sm">
              {["Help Center", , "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-yellow-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-l-2 border-yellow-400 pl-3">
              Get in Touch
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 shrink-0" />
                <span>Buxar, <br />Bihar, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-yellow-400 shrink-0" />
                <span>+91 (800) PARK-INTEL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
            © {currentYear} PARK-INTEL CORE SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="text-zinc-500">Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span className="text-zinc-500">and</span>
            <span className="text-yellow-400 font-mono tracking-tighter">&lt;/&gt;</span>
            <span className="text-zinc-500 px-1">by</span>
            <span className="text-white font-black italic tracking-tight hover:text-yellow-400 cursor-default transition-colors">
              Shivam Raj
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;