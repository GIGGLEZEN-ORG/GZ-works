import React, { useState } from "react";
import { 
  Film, 
  Sparkles, 
  Send, 
  Compass,
  Clapperboard, 
  Calendar, 
  Award,
  CheckCircle2
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";

const navItems = [
  { id: "movies", label: "Movies", Icon: Clapperboard, color: "text-rose-500" },
  { id: "events", label: "Events", Icon: Calendar, color: "text-amber-400" }
];

export default function Footer({ onNavigatePage, currentPage = "home" }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    cinemaAudio.playHoverTick();
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  const handleNavigate = (pageId) => {
    cinemaAudio.playHoverTick();
    if (onNavigatePage) {
      onNavigatePage(pageId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full shrink-0 relative bg-[#05070b] border-t border-white/10 pt-8 pb-24 lg:pb-10 text-left overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Brand Section */}
        <div className="flex items-center justify-between pb-2">
          
          {/* Brand Logo & Tagline (Navigates to Home Section) */}
          <div 
            onClick={() => handleNavigate("home")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNavigate("home");
              }
            }}
            aria-label="CINEVERSE Home"
            title="Go to Home"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
              <Film className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div>
              <span className="font-black text-xl sm:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-rose-400 group-hover:from-white group-hover:to-pink-300 transition-colors">
                CINEVERSE
              </span>
              <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-rose-400 transition-colors">
                Next-Gen Cinema & Arena Experiences
              </p>
            </div>
          </div>
        </div>

        {/* ================= DISPLAY FLEX MODE: NOW SHOWING, EXPERIENCES, EXPLORE, CINEVERSE VIP CLUB ================= */}
        <div className="flex flex-col md:flex-col lg:flex-row flex-wrap items-start justify-between gap-8 md:gap-10">
          
          {/* 1. NOW SHOWING (display: flex) */}
          <div className="flex flex-col gap-3.5 w-full md:w-full lg:flex-1 lg:min-w-[220px]">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-500" />
              <span>Now Showing</span>
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Dune: Part Two (IMAX 70mm)
              </li>
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Oppenheimer (15-Perf Print)
              </li>
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Spider-Man: Beyond Spider-Verse
              </li>
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Interstellar (10th Anniversary)
              </li>
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Avatar: Fire and Ash (48fps 3D)
              </li>
            </ul>
          </div>

          {/* 2. EXPERIENCES (display: flex) */}
          <div className="flex flex-col gap-3.5 w-full md:w-full lg:flex-1 lg:min-w-[220px]">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Experiences</span>
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Curved 3D IMAX Amphitheater
              </li>
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Dolby Cinema Dual Laser
              </li>
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                VIP Heated Recliner Suites
              </li>
              <li 
                onClick={() => handleNavigate("events")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Live Stadium Concert Tours
              </li>
              <li 
                onClick={() => handleNavigate("movies")}
                className="hover:text-rose-400 cursor-pointer transition-colors"
              >
                Gourmet Concessions & Bar
              </li>
            </ul>
          </div>

          {/* 3. EXPLORE (Movies & Events Navigation) */}
          <div className="flex flex-col gap-3.5 w-full md:w-full lg:flex-1 lg:min-w-[200px]">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore</span>
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              {navItems.map(({ id, label, Icon, color }) => {
                const isActive = currentPage === id;
                return (
                  <li
                    key={`footer-nav-${id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleNavigate(id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNavigate(id);
                      }
                    }}
                    className={`flex items-center gap-2.5 cursor-pointer transition-colors select-none ${
                      isActive
                        ? id === "events"
                          ? "text-amber-400 font-semibold"
                          : "text-rose-400 font-semibold"
                        : "hover:text-rose-400"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span>{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 4. CINEVERSE VIP CLUB (display: flex) */}
          <div className="flex flex-col gap-3.5 w-full md:w-full lg:flex-1 lg:min-w-[260px]">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Cineverse VIP Club</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get exclusive 24h early access to 70mm tickets, premier live event passes, and director Q&As.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-1">
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 text-xs rounded-l-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-rose-500 w-full"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to VIP Club"
                  className="px-4 py-2.5 rounded-r-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white flex items-center justify-center cursor-pointer transition-all shrink-0 font-bold text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Welcome to the VIP Club!</span>
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cineverse Theaters Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Admittance</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Audio Calibration Docs</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
