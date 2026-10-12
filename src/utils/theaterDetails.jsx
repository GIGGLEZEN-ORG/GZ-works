import React from "react";
import { Film, Sparkles, Crown } from "lucide-react";
export { getTheaterImage } from "./theaterImages";

/**
 * Renders an authentic brand logo or badge for a given cinema theater
 */
export function TheaterBrandLogo({ name = "", className = "" }) {
  const lower = name.toLowerCase();

  // 1. PVR INOX & PVR
  if (lower.includes("pvr inox") || (lower.includes("pvr") && lower.includes("inox"))) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/90 border border-amber-500/50 shadow-md ${className}`}>
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="font-black text-[11px] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
          PVR INOX
        </span>
      </div>
    );
  }

  if (lower.includes("pvr")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/90 border border-amber-400/50 shadow-md ${className}`}>
        <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span className="font-black text-[11px] tracking-wider text-amber-300">
          PVR
        </span>
      </div>
    );
  }

  // 2. INOX
  if (lower.includes("inox")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#032352]/90 border border-sky-400/50 shadow-md ${className}`}>
        <span className="w-2 h-2 rounded-full bg-orange-400" />
        <span className="font-black text-[11px] tracking-wider text-white">
          IN<span className="text-orange-400">O</span>X
        </span>
      </div>
    );
  }

  // 3. Cinépolis
  if (lower.includes("cinépolis") || lower.includes("cinepolis")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#091b4a]/90 border border-cyan-400/50 shadow-md ${className}`}>
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span className="font-black text-[11px] tracking-wide text-white">
          Cinépolis
        </span>
      </div>
    );
  }

  // 4. Prasads & PCX
  if (lower.includes("prasads") || lower.includes("pcx")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/95 border border-cyan-500/60 shadow-md ${className}`}>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono font-black text-[11px] tracking-wider text-cyan-300">
          PRASADS <span className="text-rose-400 text-[10px]">PCX</span>
        </span>
      </div>
    );
  }

  // 5. AMB Cinemas
  if (lower.includes("amb")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/95 border border-yellow-500/50 shadow-md ${className}`}>
        <span className="font-black text-[11px] tracking-widest text-amber-300">
          AMB CINEMAS
        </span>
      </div>
    );
  }

  // 6. Miraj Cinemas
  if (lower.includes("miraj")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-950/90 border border-rose-500/50 shadow-md ${className}`}>
        <span className="font-black text-[11px] tracking-wider text-rose-200">
          MIRAJ
        </span>
      </div>
    );
  }

  // 7. SPI Cinemas / Sathyam
  if (lower.includes("spi") || lower.includes("sathyam")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-950/90 border border-red-500/50 shadow-md ${className}`}>
        <span className="font-black text-[11px] tracking-wider text-white">
          SPI <span className="text-red-400">CINEMAS</span>
        </span>
      </div>
    );
  }

  // 8. MovieMax
  if (lower.includes("moviemax")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-950/90 border border-orange-500/50 shadow-md ${className}`}>
        <span className="font-black text-[11px] tracking-wider text-orange-200">
          MOVIEMAX
        </span>
      </div>
    );
  }

  // 9. Mukta A2
  if (lower.includes("mukta")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-yellow-950/90 border border-yellow-500/50 shadow-md ${className}`}>
        <span className="font-black text-[11px] tracking-wider text-yellow-300">
          MUKTA A2
        </span>
      </div>
    );
  }

  // 10. AMC
  if (lower.includes("amc")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-red-950/95 border border-red-500/50 shadow-md ${className}`}>
        <span className="font-black text-[11px] tracking-wider text-red-300">
          AMC THEATRES
        </span>
      </div>
    );
  }

  // 11. Regal
  if (lower.includes("regal")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-950/95 border border-orange-500/50 shadow-md ${className}`}>
        <Crown className="w-3 h-3 text-orange-400" />
        <span className="font-black text-[11px] tracking-wider text-orange-300">
          REGAL
        </span>
      </div>
    );
  }

  // 12. BFI / IMAX
  if (lower.includes("bfi") || lower.includes("imax")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/95 border border-cyan-400/60 shadow-md ${className}`}>
        <span className="font-mono font-black text-[11px] tracking-widest text-cyan-300">
          IMAX
        </span>
      </div>
    );
  }

  // 13. Odeon
  if (lower.includes("odeon")) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-950/90 border border-blue-400/50 shadow-md ${className}`}>
        <span className="font-black text-[11px] tracking-wider text-blue-200">
          ODEON
        </span>
      </div>
    );
  }

  // Default Fallback Logo Badge
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/20 shadow-md ${className}`}>
      <Film className="w-3 h-3 text-cyan-400" />
      <span className="font-black text-[10px] tracking-wider text-white uppercase">
        CINEMA
      </span>
    </div>
  );
}
