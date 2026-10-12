import React, { useState, useEffect } from "react";
import { Heart, X, Sparkles, ArrowRight } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";

export default function WishlistToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleAlert = (e) => {
      const { item, action } = e.detail || {};
      if (!item) return;

      setToast({
        id: Date.now(),
        item,
        action: action || "added"
      });
    };

    window.addEventListener("cineverse_wishlist_alert", handleAlert);
    return () => window.removeEventListener("cineverse_wishlist_alert", handleAlert);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const isAdded = toast.action === "added";

  return (
    <div className="fixed top-22 sm:top-24 left-1/2 -translate-x-1/2 z-[70] w-[92vw] max-w-md animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div 
        className="relative overflow-hidden rounded-2xl bg-[#090d16] border border-rose-500/50 p-4 shadow-2xl shadow-rose-950/60"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        {/* Glow accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Animated Heart Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-600/40 animate-pulse">
              <Heart className="w-5 h-5 fill-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {isAdded ? "Added to Wishlist! ❤️" : "Removed from Wishlist"}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white truncate leading-tight mt-0.5">
                {toast.item.title || "Cinema Item"}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {isAdded ? "Opening your wishlist..." : "Item removed from saved list"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdded && (
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  window.dispatchEvent(
                    new CustomEvent("cineverse_open_wishlist", {
                      detail: { item: toast.item }
                    })
                  );
                  setToast(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center gap-1 cursor-pointer"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress timer bar */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 animate-[beamScan_3.8s_linear_forwards]" />
        </div>
      </div>
    </div>
  );
}
