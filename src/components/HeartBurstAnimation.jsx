import React, { useEffect } from "react";
import { Heart, Sparkles } from "lucide-react";

export default function HeartBurstAnimation({ isActive = false, onComplete }) {
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1100);
    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const particles = [
    { tx: "0px", ty: "-65px", delay: "0ms", icon: Heart, color: "text-rose-400" },
    { tx: "48px", ty: "-48px", delay: "30ms", icon: Sparkles, color: "text-amber-300" },
    { tx: "68px", ty: "0px", delay: "60ms", icon: Heart, color: "text-pink-400" },
    { tx: "48px", ty: "48px", delay: "40ms", icon: Sparkles, color: "text-rose-300" },
    { tx: "0px", ty: "65px", delay: "70ms", icon: Heart, color: "text-rose-500" },
    { tx: "-48px", ty: "48px", delay: "50ms", icon: Sparkles, color: "text-amber-400" },
    { tx: "-68px", ty: "0px", delay: "40ms", icon: Heart, color: "text-pink-400" },
    { tx: "-48px", ty: "-48px", delay: "80ms", icon: Sparkles, color: "text-rose-400" },
  ];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl bg-black/60 animate-in fade-in duration-200">
      {/* 1. Outward Shockwave Ripple Rings */}
      <div className="absolute w-24 h-24 rounded-full border-2 border-rose-500/80 animate-heart-ring pointer-events-none" />
      <div 
        className="absolute w-28 h-28 rounded-full border border-pink-400/60 animate-heart-ring pointer-events-none" 
        style={{ animationDelay: "120ms" }}
      />
      <div 
        className="absolute w-32 h-32 rounded-full bg-radial from-rose-500/30 via-pink-500/10 to-transparent animate-heart-ring pointer-events-none" 
        style={{ animationDelay: "60ms" }}
      />

      {/* 2. Radial Flying Confetti Particles */}
      {particles.map((p, idx) => {
        const IconComponent = p.icon;
        return (
          <div
            key={idx}
            className="absolute animate-heart-particle"
            style={{
              "--tx": p.tx,
              "--ty": p.ty,
              animationDelay: p.delay,
            }}
          >
            <IconComponent 
              className={`w-4 h-4 fill-current ${p.color} drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]`} 
            />
          </div>
        );
      })}

      {/* 3. Central Big Blooming 3D Love Symbol */}
      <div className="relative flex flex-col items-center justify-center animate-heart-pop">
        <div className="relative">
          {/* Ambient intense glow backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-600 via-pink-500 to-red-500 rounded-full blur-2xl opacity-90 scale-125 animate-pulse" />
          
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full drop-shadow-[0_0_30px_rgba(244,63,94,1)] drop-shadow-[0_0_55px_rgba(251,113,133,0.85)] filter"
            >
              <defs>
                <linearGradient id={`heartGrad-${Math.random()}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff2a6d" />
                  <stop offset="50%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <radialGradient id={`heartShine-${Math.random()}`} cx="30%" cy="25%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Outer heart body */}
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#f43f5e"
              />
              {/* Inner highlight glass reflection */}
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="rgba(255,255,255,0.25)"
              />
            </svg>
          </div>
        </div>

        {/* 4. Glowing Outward Text Badge */}
        <div className="mt-2 px-3 py-1 rounded-full bg-black/95 border border-rose-500/60 shadow-xl shadow-rose-500/40 flex items-center gap-1.5 animate-in slide-in-from-bottom-2 fade-in duration-300">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span className="text-[11px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-pink-300">
            Added to Wishlist!
          </span>
        </div>
      </div>
    </div>
  );
}
