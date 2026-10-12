import React, { useState, useEffect, useRef } from "react";
import { 
  Ticket, 
  Star, 
  Info,
  Calendar,
  MapPin,
  Heart,
  Sparkles,
  Flame,
  Radio
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";
import { useWishlist, toggleWishlistItem } from "../utils/wishlistStore";
import HeartBurstAnimation from "./HeartBurstAnimation";

export default function EventsShowcase({ 
  events = [], 
  selectedCity = "Mumbai",
  onBookEvent,
  onOpenDetails
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isArenaHovered, setIsArenaHovered] = useState(false);
  const [heartBurstEventId, setHeartBurstEventId] = useState(null);
  const wishlist = useWishlist();
  const showcaseRef = useRef(null);
  const lastHoverTimeRef = useRef(0);
  const isUserMovingRef = useRef(true);

  const toggleLike = (evt) => {
    const isLiked = wishlist.some((i) => String(i.id) === String(evt.id));
    if (!isLiked) {
      cinemaAudio.playHeartBurst();
      setHeartBurstEventId(evt.id);
      toggleWishlistItem(evt);
      window.dispatchEvent(
        new CustomEvent("cineverse_wishlist_alert", {
          detail: { item: evt, action: "added" }
        })
      );
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("cineverse_open_wishlist", {
            detail: { item: evt }
          })
        );
      }, 750);
    } else {
      cinemaAudio.playSeatClick(false);
      toggleWishlistItem(evt);
      window.dispatchEvent(
        new CustomEvent("cineverse_wishlist_alert", {
          detail: { item: evt, action: "removed" }
        })
      );
    }
  };

  // Take top 8 events for rotating carousel (if less than 8, use available)
  const displayEvents = events.slice(0, 8);
  const total = displayEvents.length;

  // Reset activeIndex when events list changes
  useEffect(() => {
    setActiveIndex(0);
    setHoveredIndex(null);
  }, [events]);

  // Auto-rotation timer (pauses automatically when hovered or in arena - synced to 2.8s ads time)
  useEffect(() => {
    if (hoveredIndex !== null || isArenaHovered || total <= 1) return;
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

  if (total === 0) return null;

  const currentActiveEvent = displayEvents[hoveredIndex !== null ? hoveredIndex : activeIndex] || displayEvents[0];

  return (
    <section 
      id="trending-events-showcase" 
      ref={showcaseRef} 
      className="relative w-full pt-4 sm:pt-6 pb-6 overflow-hidden transition-colors duration-700"
    >
      {/* Dynamic 4K Stage Backdrop Layer (Matches Active Event) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {displayEvents.map((evt) => {
          const isSelected = evt.id === currentActiveEvent?.id;
          return (
            <div
              key={`bg-evt-${evt.id}`}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                isSelected ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={evt.image}
                alt=""
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80";
                }}
                className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-110 scale-105 transition-transform duration-1000"
              />
              {/* Event Accent Color Ambient Overlay */}
              <div 
                className="absolute inset-0 mix-blend-color opacity-30"
                style={{ backgroundColor: evt.accentColor || "#f59e0b" }}
              />
            </div>
          );
        })}

        {/* Cinematic Vignette Gradients for Text Contrast and Smooth Page Blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-[#07090e]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e]/70 via-transparent to-[#07090e]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#07090e_85%)] opacity-70" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 sm:pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-xl">
              Featured Events in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400">{selectedCity}</span>
            </h2>
          </div>
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
          
          {/* Background Radial Glow tied to active event */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
            <div 
              className="w-[500px] sm:w-[700px] h-[350px] rounded-full blur-3xl opacity-35 transition-all duration-1000"
              style={{
                background: `radial-gradient(circle, ${currentActiveEvent?.accentColor || "#f59e0b"}, transparent 70%)`
              }}
            />
          </div>

          {/* 3D Stage */}
          <div 
            className="relative w-full max-w-6xl h-[370px] sm:h-[450px] lg:h-[490px] flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {displayEvents.map((evt, index) => {
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

              // 3D transforms matching the movie cards carousel
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
                  key={evt.id}
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
                    if (onBookEvent) onBookEvent(evt);
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
                      ? "ring-4 ring-amber-500/80 shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] border-transparent"
                      : isCenter
                      ? "border border-amber-500/40 shadow-xl shadow-amber-950/40"
                      : "border border-white/10 shadow-lg"
                  }`}
                >
                  {/* Ambient glow matching event theme */}
                  <div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500 -z-10 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${evt.accentColor || "#f59e0b"} 0%, transparent 70%)`
                    }}
                  />

                  {/* 1. Event Photo */}
                  <img
                    src={evt.image}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80";
                    }}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isHovered ? "scale-108 filter brightness-70" : "scale-100"
                    }`}
                  />

                  {/* Outward Love Symbol Burst Animation */}
                  <HeartBurstAnimation isActive={heartBurstEventId === evt.id} onComplete={() => setHeartBurstEventId(null)} />

                  {/* Top Badges on Hover (Category pill & Wishlist/Like) */}
                  <div
                    className={`absolute top-2 inset-x-2 sm:top-2.5 sm:inset-x-2.5 flex items-center justify-between z-30 transition-opacity duration-300 ${
                      isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-md">
                      {evt.category?.split(" ")[0] || "Live"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(evt);
                      }}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        wishlist.some((i) => String(i.id) === String(evt.id))
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-600/50"
                          : "bg-black/70 text-slate-200 hover:text-white hover:bg-black/90"
                      }`}
                      title={wishlist.some((i) => String(i.id) === String(evt.id)) ? "Saved to Favorites" : "Save to Favorites"}
                    >
                      <Heart className={`w-3 h-3 ${wishlist.some((i) => String(i.id) === String(evt.id)) ? "fill-white" : ""}`} />
                    </button>
                  </div>

                  {/* Floating Ticket Button on Hover (positioned higher up for clarity) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cinemaAudio.playSeatConfirm();
                      if (onBookEvent) onBookEvent(evt);
                    }}
                    className={`absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white flex items-center justify-center shadow-2xl z-30 transition-all duration-300 cursor-pointer ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                    }`}
                    title="Reserve Event Pass"
                  >
                    <Ticket className="w-5 h-5" />
                  </button>

                  {/* 2. On Hover: reveals event name, date, venue, price, book pass */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-3.5 sm:p-4 flex flex-col justify-end space-y-2.5 transition-opacity duration-300 z-20 ${
                      isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                    style={{
                      WebkitFontSmoothing: "antialiased",
                      textRendering: "geometricPrecision"
                    }}
                  >
                    {/* Event Name & Meta */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50 uppercase tracking-wider">
                          {evt.badge || evt.city}
                        </span>
                        <span className="text-[11px] text-emerald-300 font-mono font-black bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {formatCurrencyINR(evt.price)}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-lg line-clamp-2">
                        {evt.title}
                      </h3>

                      <p className="text-[11px] font-semibold text-slate-200 line-clamp-1 flex items-center gap-1 drop-shadow">
                        <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{evt.date}</span>
                      </p>
                      
                      <p className="text-[11px] font-medium text-slate-300 line-clamp-1 flex items-center gap-1 drop-shadow">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{evt.hall}</span>
                      </p>
                    </div>

                    {/* Action Buttons: Reserve Pass & View Details */}
                    <div className="space-y-2 pt-1">
                      {/* Book Passes */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cinemaAudio.playSeatConfirm();
                          if (onBookEvent) onBookEvent(evt);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/40 active:scale-95 transition-all cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Reserve Passes</span>
                      </button>

                      {/* View Details / Jump to Event */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cinemaAudio.playHoverTick();
                          if (onOpenDetails) {
                            onOpenDetails(evt);
                          } else {
                            const target = document.getElementById(`event-card-${evt.id}`);
                            if (target) {
                              target.scrollIntoView({ behavior: "smooth", block: "center" });
                            }
                          }
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 border border-white/25 transition-all cursor-pointer shadow-md"
                      >
                        <Info className="w-4 h-4 text-cyan-400" />
                        <span>View Pass Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Indicator Dots */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            {displayEvents.map((evt, idx) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setActiveIndex(idx);
                }}
                title={evt.title}
                className={`transition-all cursor-pointer rounded-full ${
                  activeIndex === idx
                    ? "w-6 h-2 bg-amber-500 shadow-md shadow-amber-500/50"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
