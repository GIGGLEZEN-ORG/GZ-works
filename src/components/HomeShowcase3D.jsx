import React, { useState, useEffect, useMemo } from "react";
import { 
  Ticket, 
  Star, 
  Info,
  Play, 
  Heart, 
  Calendar, 
  MapPin, 
  Film, 
  Music, 
  Clock
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";
import { useWishlist, toggleWishlistItem } from "../utils/wishlistStore";
import HeartBurstAnimation from "./HeartBurstAnimation";

export default function HomeShowcase3D({ 
  movies = [], 
  events = [],
  onSelectMovie, 
  onOpenMovieDetails, 
  onWatchTrailer, 
  onBookEvent 
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const wishlist = useWishlist();

  const toggleLike = (item, e) => {
    if (e) e.stopPropagation();
    const isLiked = wishlist.some((i) => String(i.id) === String(item.id));
    if (!isLiked) {
      cinemaAudio.playHeartBurst();
      setShowHeartBurst(true);
      toggleWishlistItem(item);
      window.dispatchEvent(
        new CustomEvent("cineverse_wishlist_alert", {
          detail: { item, action: "added" }
        })
      );
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("cineverse_open_wishlist", {
            detail: { item }
          })
        );
      }, 750);
    } else {
      cinemaAudio.playSeatClick(false);
      toggleWishlistItem(item);
      window.dispatchEvent(
        new CustomEvent("cineverse_wishlist_alert", {
          detail: { item, action: "removed" }
        })
      );
    }
  };

  // Build an alternating/interleaved spotlight deck of top movies and events (8 total ads)
  const displayItems = useMemo(() => {
    const list = [];
    const topMovies = movies.slice(0, 4);
    const topEvents = events.slice(0, 4);
    const maxLen = Math.max(topMovies.length, topEvents.length);

    for (let i = 0; i < maxLen; i++) {
      if (topMovies[i]) {
        list.push({
          ...topMovies[i],
          isMovie: true,
          itemType: "movie",
          displayImage: topMovies[i].poster,
          displayBackdrop: topMovies[i].backdrop4k || topMovies[i].poster,
          displayBadge: topMovies[i].formats?.[0] || "IMAX 70mm",
          displayAccent: topMovies[i].accentColor || "#f43f5e",
          displayCategory: topMovies[i].genres?.slice(0, 2).join(" • ") || "Cinema Feature",
          displayPrice: 280,
          displayTagline: topMovies[i].tagline || "Experience cinema in breathtaking 4K IMAX"
        });
      }
      if (topEvents[i]) {
        list.push({
          ...topEvents[i],
          isMovie: false,
          itemType: "event",
          displayImage: topEvents[i].image,
          displayBackdrop: topEvents[i].image,
          displayBadge: topEvents[i].badge || "Live Concert",
          displayAccent: topEvents[i].accentColor || "#f59e0b",
          displayCategory: topEvents[i].category || "Live Event",
          displayPrice: topEvents[i].price || 1500,
          displayTagline: topEvents[i].subtitle || "Experience electrifying live atmosphere"
        });
      }
    }
    return list.slice(0, 8);
  }, [movies, events]);

  const total = displayItems.length;
  const activeItem = displayItems[activeIndex] || displayItems[0];

  // Faster auto-advancing ad timer (2.8 seconds per ad, pauses on hover)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, 2800);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  if (total === 0 || !activeItem) return null;

  return (
    <section 
      id="cinematic-spotlight-marquee"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 select-none"
    >
      {/* Dynamic Ambient Glow matching the active item (fast 300ms transition) */}
      <div 
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-4/5 h-96 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-300 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${activeItem.displayAccent || "#f43f5e"}, transparent 70%)`
        }}
      />

      {/* SINGLE DISPLAY OF CONTENT: Bigger, Taller Panoramic Cinematic Billboard Ad */}
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[680px] rounded-3xl overflow-hidden border border-white/20 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-end group">
        
        {/* Background Images Cross-Fade with Fast 300ms Transition */}
        {displayItems.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <div
              key={`billboard-bg-${item.id}`}
              className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                isSelected ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <img
                src={item.displayBackdrop}
                alt={item.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = item.displayImage;
                }}
                className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-110 transition-transform duration-[3000ms] ease-out group-hover:scale-105"
              />
              
              {/* Dynamic Accent Color Tint */}
              <div 
                className="absolute inset-0 mix-blend-color opacity-25"
                style={{ backgroundColor: item.displayAccent }}
              />
            </div>
          );
        })}

        {/* Cinematic Vignettes and Shadow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/45 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_40%,rgba(7,9,14,0.7)_100%)]" />

        {/* Outward Love Symbol Burst Animation */}
        <HeartBurstAnimation isActive={showHeartBurst} onComplete={() => setShowHeartBurst(false)} />

        {/* Top Badges Over Billboard */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-20">
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg border text-white flex items-center gap-1.5 transition-colors duration-300"
              style={{ 
                backgroundColor: `${activeItem.displayAccent}25`,
                borderColor: `${activeItem.displayAccent}60`
              }}
            >
              {activeItem.isMovie ? (
                <Film className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Music className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{activeItem.isMovie ? "Movie Spotlight" : "Live Event Premiere"}</span>
            </span>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/85 text-slate-200 border border-white/15">
              {activeItem.displayBadge}
            </span>
          </div>

          {/* Favorite Wishlist Button */}
          <button
            type="button"
            onClick={(e) => toggleLike(activeItem, e)}
            aria-label="Save to wishlist"
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${
              wishlist.some((i) => String(i.id) === String(activeItem.id))
                ? "bg-rose-600 text-white border-rose-500 scale-110"
                : "bg-black/80 text-slate-200 hover:text-white border-white/20 hover:bg-black"
            }`}
          >
            <Heart 
              className={`w-4 h-4 ${wishlist.some((i) => String(i.id) === String(activeItem.id)) ? "fill-white" : ""}`} 
            />
          </button>
        </div>

        {/* Bottom Foreground Content & Call to Actions */}
        <div className="relative z-20 p-6 sm:p-10 md:p-14 lg:p-16 space-y-5 max-w-4xl">
          
          {/* Meta Tags Strip */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-slate-300">
            {activeItem.rating && (
              <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/30 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{activeItem.rating} / 10</span>
              </div>
            )}

            {activeItem.duration && (
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{activeItem.duration}</span>
              </span>
            )}

            {activeItem.date && (
              <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-white/10 px-3 py-1 rounded-lg">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{activeItem.date}</span>
              </span>
            )}

            {activeItem.hall && (
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span className="truncate max-w-[260px]">{activeItem.hall}</span>
              </span>
            )}

            <span className="text-slate-300 font-semibold px-2.5 py-0.5 rounded bg-white/5 border border-white/10">
              {activeItem.displayCategory}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-2xl line-clamp-2 transition-all duration-300 leading-none">
              {activeItem.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 line-clamp-3 mt-3 drop-shadow max-w-3xl leading-relaxed">
              {activeItem.synopsis || activeItem.description || activeItem.displayTagline}
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            
            {/* PRIMARY ACTION: BOOK TICKETS / RESERVE PASS */}
            {activeItem.isMovie ? (
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playCinemaRumble();
                  if (onSelectMovie) onSelectMovie(activeItem);
                }}
                className="group flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-base sm:text-lg shadow-2xl shadow-rose-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />
                <span>Book Tickets</span>
                <span className="text-xs sm:text-sm font-mono bg-black/35 px-2.5 py-0.5 rounded-full ml-1.5 text-rose-100 font-bold">
                  {formatCurrencyINR(activeItem.displayPrice)}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playCinemaRumble();
                  if (onBookEvent) onBookEvent(activeItem);
                }}
                className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-12" />
                <span>Reserve Live Pass</span>
                <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-full ml-1 text-amber-100">
                  {formatCurrencyINR(activeItem.price || activeItem.displayPrice)}
                </span>
              </button>
            )}

            {/* SECONDARY ACTION: WATCH TRAILER / PREVIEW */}
            {activeItem.isMovie && (
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  if (onWatchTrailer) onWatchTrailer(activeItem);
                  else if (onOpenMovieDetails) onOpenMovieDetails(activeItem);
                }}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <span>Watch Trailer</span>
              </button>
            )}

            {/* DETAILS ACTION */}
            <button
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                if (activeItem.isMovie) {
                  if (onOpenMovieDetails) onOpenMovieDetails(activeItem);
                } else {
                  if (onBookEvent) onBookEvent(activeItem);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
