import React, { useState, useEffect, useRef } from "react";
import { 
  Ticket, 
  Star, 
  Info,
  Play,
  Heart,
  Sparkles
} from "lucide-react";
import { moviesData } from "../data/moviesData";
import { cinemaAudio } from "../utils/soundEffects";
import { useWishlist, toggleWishlistItem } from "../utils/wishlistStore";
import HeartBurstAnimation from "./HeartBurstAnimation";

export default function ExperienceShowcase({ 
  movies = moviesData, 
  onSelectMovie, 
  onOpenDetails,
  onWatchTrailer 
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isArenaHovered, setIsArenaHovered] = useState(false);
  const [heartBurstMovieId, setHeartBurstMovieId] = useState(null);
  const wishlist = useWishlist();
  const showcaseRef = useRef(null);
  const lastHoverTimeRef = useRef(0);
  const isUserMovingRef = useRef(true);

  const toggleLike = (movie) => {
    const isLiked = wishlist.some((i) => String(i.id) === String(movie.id));
    if (!isLiked) {
      cinemaAudio.playHeartBurst();
      setHeartBurstMovieId(movie.id);
      toggleWishlistItem(movie);
      window.dispatchEvent(
        new CustomEvent("cineverse_wishlist_alert", {
          detail: { item: movie, action: "added" }
        })
      );
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

  // Take top 8 trending & featured blockbusters
  const displayMovies = (movies && movies.length > 0 ? movies : moviesData).slice(0, 8);
  const total = displayMovies.length;

  // Auto-rotation timer (pauses automatically when hovered or in arena - synced to 2.8s ads time)
  useEffect(() => {
    if (hoveredIndex !== null || isArenaHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 2800);
    return () => clearInterval(interval);
  }, [hoveredIndex, isArenaHovered, total]);

  const handleCardHover = (index) => {
    cinemaAudio.playHoverTick();
    setHoveredIndex(index);
    if (index !== activeIndex) {
      const now = Date.now();
      if (now - lastHoverTimeRef.current > 350) {
        lastHoverTimeRef.current = now;
        isUserMovingRef.current = false;
        setActiveIndex(index);
      }
    }
  };

  const handleNext = () => {
    cinemaAudio.playHoverTick();
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    cinemaAudio.playHoverTick();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const currentActiveMovie = displayMovies[hoveredIndex !== null ? hoveredIndex : activeIndex] || displayMovies[0];

  return (
    <section 
      id="trending-blockbusters" 
      ref={showcaseRef} 
      className="relative w-full pt-2 sm:pt-4 pb-6 overflow-hidden scroll-mt-24 transition-colors duration-700"
    >
      {/* Dynamic 4K Cinematic Backdrop Layer (Matches Active Movie) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {displayMovies.map((movie) => {
          const isSelected = movie.id === currentActiveMovie?.id;
          return (
            <div
              key={`bg-${movie.id}`}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                isSelected ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={movie.backdrop4k || movie.poster}
                alt=""
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (movie.poster) e.currentTarget.src = movie.poster;
                }}
                className="w-full h-full object-cover object-center filter brightness-[0.52] contrast-115 scale-105 transition-transform duration-1000"
              />
              {/* Movie Accent Color Ambient Overlay */}
              <div 
                className="absolute inset-0 mix-blend-color opacity-25"
                style={{ backgroundColor: movie.accentColor || "#f43f5e" }}
              />
            </div>
          );
        })}

        {/* Cinematic Vignette Gradients for Text Contrast and Smooth Page Blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/30 to-[#07090e]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e]/60 via-transparent to-[#07090e]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#07090e_85%)] opacity-60" />
      </div>

      {/* Foreground Content (relative z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Title Header */}
        <div className="flex items-center justify-between pb-2 sm:pb-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-xl">
            Trending Blockbusters
          </h2>
        </div>

      {/* 3D Rotating Cards Arena */}
      <div 
        onMouseEnter={() => {
          setIsArenaHovered(true);
          isUserMovingRef.current = true;
        }}
        onMouseMove={() => {
          isUserMovingRef.current = true;
        }}
        onMouseLeave={() => {
          setIsArenaHovered(false);
          setHoveredIndex(null);
        }}
        className="relative min-h-[460px] sm:min-h-[530px] lg:min-h-[580px] flex items-center justify-center pt-8 sm:pt-14 pb-6 select-none"
      >
        
        {/* Background Radial Glow tied to active movie */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
          <div 
            className="w-[500px] sm:w-[700px] h-[350px] rounded-full blur-3xl opacity-35 transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${currentActiveMovie?.accentColor || "#f43f5e"}, transparent 70%)`
            }}
          />
        </div>

        {/* 3D Stage */}
        <div 
          className="relative w-full max-w-6xl h-[370px] sm:h-[450px] lg:h-[490px] flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          {displayMovies.map((movie, index) => {
            // Calculate normalized circular distance from activeIndex
            let diff = (index - activeIndex + total) % total;
            if (diff > total / 2) diff -= total;

            const isCenter = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;
            const isFarLeft = diff === -2;
            const isFarRight = diff === 2;
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            const isHovered = hoveredIndex === index;

            // Compact 3D transforms with smooth hover expansion
            let translateX = "0%";
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 20;

            if (isCenter) {
              translateX = "0%";
              translateZ = isHovered ? 180 : 90;
              rotateY = 0;
              scale = isHovered ? 1.15 : 1.02;
              opacity = 1;
              zIndex = isHovered ? 60 : 35;
            } else if (isRight) {
              translateX = "78%";
              translateZ = isHovered ? 90 : -50;
              rotateY = isHovered ? -10 : -25;
              scale = isHovered ? 1.05 : 0.85;
              opacity = isHovered ? 1 : 0.85;
              zIndex = isHovered ? 55 : 25;
            } else if (isLeft) {
              translateX = "-78%";
              translateZ = isHovered ? 90 : -50;
              rotateY = isHovered ? 10 : 25;
              scale = isHovered ? 1.05 : 0.85;
              opacity = isHovered ? 1 : 0.85;
              zIndex = isHovered ? 55 : 25;
            } else if (isFarRight) {
              translateX = "150%";
              translateZ = isHovered ? -20 : -140;
              rotateY = isHovered ? -20 : -42;
              scale = isHovered ? 0.9 : 0.7;
              opacity = isHovered ? 0.9 : 0.45;
              zIndex = isHovered ? 50 : 15;
            } else if (isFarLeft) {
              translateX = "-150%";
              translateZ = isHovered ? -20 : -140;
              rotateY = isHovered ? 20 : 42;
              scale = isHovered ? 0.9 : 0.7;
              opacity = isHovered ? 0.9 : 0.45;
              zIndex = isHovered ? 50 : 15;
            }

            return (
              <div
                key={movie.id}
                onMouseEnter={() => {
                  isUserMovingRef.current = true;
                  handleCardHover(index);
                }}
                onMouseMove={() => {
                  isUserMovingRef.current = true;
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  if (onOpenDetails) {
                    onOpenDetails(movie);
                  } else if (onSelectMovie) {
                    onSelectMovie(movie);
                  }
                }}
                style={{
                  transform: `translate3d(${translateX}, ${isHovered ? 24 : 8}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: "all 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)",
                  transformStyle: "preserve-3d",
                  WebkitFontSmoothing: "subpixel-antialiased",
                  backfaceVisibility: "hidden"
                }}
                className={`absolute w-[260px] sm:w-[320px] lg:w-[360px] h-[330px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-950 transition-all duration-400 will-change-transform select-none ${
                  isHovered
                    ? "ring-4 ring-rose-500/80 shadow-[0_20px_50px_-10px_rgba(244,63,94,0.5)] border-transparent"
                    : isCenter
                    ? "border border-rose-500/40 shadow-xl shadow-rose-950/40"
                    : "border border-white/10 shadow-lg"
                }`}
              >
                {/* Ambient glow matching movie theme */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500 -z-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${movie.accentColor || "#f43f5e"} 0%, transparent 70%)`
                  }}
                />

                {/* 1. Only pure Movie Picture by default */}
                <img
                  src={movie.poster}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    if (movie.posterFallback) e.currentTarget.src = movie.posterFallback;
                  }}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isHovered ? "scale-108 filter brightness-70" : "scale-100"
                  }`}
                />

                {/* Outward Love Symbol Burst Animation */}
                <HeartBurstAnimation isActive={heartBurstMovieId === movie.id} onComplete={() => setHeartBurstMovieId(null)} />

                {/* Top Badges on Hover (Format & Wishlist/Like) */}
                <div
                  className={`absolute top-2 inset-x-2 sm:top-2.5 sm:inset-x-2.5 flex items-center justify-between z-30 transition-opacity duration-300 ${
                    isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
                    {movie.formats?.[0] || "IMAX 3D"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(movie);
                    }}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      wishlist.some((i) => String(i.id) === String(movie.id))
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/50"
                        : "bg-black/70 text-slate-200 hover:text-white hover:bg-black/90"
                    }`}
                    title={wishlist.some((i) => String(i.id) === String(movie.id)) ? "Saved to Watchlist" : "Save to Watchlist"}
                  >
                    <Heart className={`w-3 h-3 ${wishlist.some((i) => String(i.id) === String(movie.id)) ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Floating Play Trailer & Video Button on Hover (positioned higher up) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cinemaAudio.playHoverTick();
                    if (onWatchTrailer) {
                      onWatchTrailer(movie);
                    } else if (onOpenDetails) {
                      onOpenDetails(movie);
                    }
                  }}
                  className={`absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl z-30 transition-all duration-300 cursor-pointer ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                  }`}
                  title="Play 4K Trailer"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>

                {/* 2. On Hover: reveals movie name, book tickets, view details */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-3.5 sm:p-4 flex flex-col justify-end space-y-2.5 transition-opacity duration-300 z-20 ${
                    isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    WebkitFontSmoothing: "antialiased",
                    textRendering: "geometricPrecision"
                  }}
                >
                  {/* Movie Name & Meta */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/50 uppercase tracking-wider">
                        {movie.genres?.[0] || "Cinema"}
                      </span>
                      <span className="text-[11px] text-amber-300 font-mono font-black flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {movie.rating}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-lg line-clamp-2">
                      {movie.title}
                    </h3>

                    <p className="text-[11px] font-semibold text-slate-200 line-clamp-1 drop-shadow">
                      {movie.duration} · Dir. {movie.director}
                    </p>
                  </div>

                  {/* Action Buttons: Book Tickets & View Details */}
                  <div className="space-y-2 pt-1">
                    {/* Book Tickets */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cinemaAudio.playSeatConfirm();
                        if (onSelectMovie) onSelectMovie(movie);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/40 active:scale-95 transition-all cursor-pointer"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book Tickets</span>
                    </button>

                    {/* View Details / Movie Info */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cinemaAudio.playHoverTick();
                        if (onOpenDetails) onOpenDetails(movie);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 border border-white/25 transition-all cursor-pointer shadow-md"
                    >
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span>View Details & Trailer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {displayMovies.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                setActiveIndex(idx);
              }}
              title={m.title}
              className={`transition-all cursor-pointer rounded-full ${
                activeIndex === idx
                  ? "w-6 h-2 bg-rose-500 shadow-md shadow-rose-500/50"
                  : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
