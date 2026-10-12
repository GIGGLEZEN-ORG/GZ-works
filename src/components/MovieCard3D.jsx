import React, { useState, useRef } from "react";
import { Star, Clock, Ticket, Play, Info, Heart, Sparkles, MapPin } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { getCityTheaters } from "../data/moviesData";
import { useWishlist, toggleWishlistItem } from "../utils/wishlistStore";
import HeartBurstAnimation from "./HeartBurstAnimation";

export default function MovieCard3D({
  movie,
  selectedCity = "Mumbai",
  onSelectMovie,
  onWatchTrailer,
  onOpenDetails
}) {
  const localTheaters = getCityTheaters(selectedCity);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const wishlist = useWishlist();
  const isLiked = wishlist.some((item) => String(item.id) === String(movie.id));
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 12; // tilt angle
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      // Special action: Love symbol blooming outward like a small video
      cinemaAudio.playHeartBurst();
      setShowHeartBurst(true);
      toggleWishlistItem(movie);

      // Alert toast message
      window.dispatchEvent(
        new CustomEvent("cineverse_wishlist_alert", {
          detail: { item: movie, action: "added" }
        })
      );

      // Go to wishlist
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("cineverse_open_wishlist", {
            detail: { item: movie }
          })
        );
      }, 750);
    } else {
      cinemaAudio.playSeatClick(false);
      toggleWishlistItem(movie);
      window.dispatchEvent(
        new CustomEvent("cineverse_wishlist_alert", {
          detail: { item: movie, action: "removed" }
        })
      );
    }
  };

  return (
    <div
      id={`movie-card-${movie.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-2xl transition-all duration-300 ease-out scroll-mt-28 w-full h-full flex flex-col"
      style={{
        transform: tilt.opacity ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1)` : undefined
      }}
    >
      {/* Outer ambient glow based on movie theme */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500 -z-10"
        style={{
          background: `radial-gradient(circle, ${movie.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Main Card Container */}
      <div 
        className="relative rounded-2xl overflow-hidden flex flex-col h-full bg-[#0d121f] border border-white/12 shadow-xl group-hover:border-rose-500/50 transition-colors"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        
        {/* Dynamic Holographic Glare Sheen */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200"
          style={{
            opacity: tilt.opacity,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`
          }}
        />

        {/* Poster Media Area */}
        <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[360px] overflow-hidden bg-slate-900 shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.src = movie.posterFallback;
            }}
          />

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-transparent to-black/60 pointer-events-none" />

          {/* Outward Love Symbol Burst Animation */}
          <HeartBurstAnimation isActive={showHeartBurst} onComplete={() => setShowHeartBurst(false)} />

          {/* Top Badges */}
          <div className="absolute top-2 inset-x-2 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-1 z-20">
            <span className="max-w-[calc(100%-2rem)] truncate px-2 py-1 sm:px-2.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
              {movie.formats[0]}
            </span>

            {/* Favorite / Wishlist Button */}
            <button
              onClick={toggleLike}
              className={`shrink-0 p-1.5 sm:p-2 rounded-full transition-all cursor-pointer ${
                isLiked
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/50"
                  : "bg-black/70 text-slate-200 hover:text-white hover:bg-black/90"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Play Trailer Floating Button (positioned higher up for better visibility) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              cinemaAudio.playHoverTick();
              onWatchTrailer(movie);
            }}
            className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl z-20 cursor-pointer"
            title="Watch 4K Trailer"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>

          {/* Quick specs ribbon on bottom of poster */}
          <div className="absolute bottom-2 inset-x-2 sm:inset-x-3 flex items-center justify-between gap-1 text-[9px] sm:text-[11px] text-slate-200 z-20">
            <span className="flex items-center gap-1 font-bold text-amber-300 bg-black/85 px-1.5 sm:px-2 py-0.5 rounded border border-amber-500/30">
              <Star className="w-3 h-3 shrink-0 fill-amber-400 text-amber-400" />
              {movie.rating} <span className="hidden sm:inline">({movie.voteCount})</span>
            </span>
            <span className="flex items-center gap-1 bg-black/85 px-1.5 sm:px-2 py-0.5 rounded border border-white/10 font-semibold text-slate-200">
              <Clock className="w-3 h-3 text-slate-300" />
              {movie.duration}
            </span>
          </div>
        </div>

        {/* Content & Details Area */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
          <div>
            {/* Title & Age Rating */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                {movie.title}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 flex-shrink-0">
                {movie.ageRating}
              </span>
            </div>

            {/* Genres */}
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 line-clamp-1">
              {movie.genres.join(" • ")}
            </p>

            {/* Experience highlight tag */}
            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-cyan-300/90 flex items-center gap-1 line-clamp-1">
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{movie.experienceBadges[0]}</span>
            </div>

            {/* City Theaters screening badge */}
            <div className="mt-1.5 flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 line-clamp-1">
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">
                <strong className="text-slate-200">{selectedCity}:</strong> {localTheaters.slice(0, 2).map(t => t.name.split(":")[0]).join(", ")}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/5">
            <button
              onClick={() => {
                cinemaAudio.playHoverTick();
                onOpenDetails(movie);
              }}
              title="View full synopsis & cast"
              className="col-span-2 py-2 px-1.5 sm:py-2.5 sm:px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 border border-white/10 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Details</span>
            </button>

            <button
              onClick={() => {
                cinemaAudio.playCinemaRumble();
                onSelectMovie(movie);
              }}
              className="col-span-3 py-2 px-2 sm:py-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">Book Seats</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
