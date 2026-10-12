import React, { useState, useEffect, useRef } from "react";
import { Play, Ticket, Star, Clock, Calendar, Sparkles, Volume2, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";

export default function HeroBanner3D({ movies, onSelectMovie, onWatchTrailer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const currentMovie = movies[currentIndex] || movies[0];

  // Auto advance carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  // Handle 3D Parallax Tilt on mouse movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const maxTilt = 12;
    setTilt({
      x: -(y / (rect.height / 2)) * maxTilt,
      y: (x / (rect.width / 2)) * maxTilt
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    cinemaAudio.playHoverTick();
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    cinemaAudio.playHoverTick();
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] overflow-hidden flex items-center justify-center py-12 sm:py-16 transition-all duration-700 preserve-3d"
    >
      {/* 4K Cinematic Backdrop Image with Smooth Fade */}
      <div className="absolute inset-0 -z-20 transition-all duration-1000 transform scale-105">
        <img
          key={currentMovie.id}
          src={currentMovie.backdrop4k}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125 transition-opacity duration-1000"
          onError={(e) => {
            e.target.src = currentMovie.posterFallback;
          }}
        />
        {/* Cinematic Vignette and Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/50 to-transparent" />
        <div 
          className="absolute inset-0 opacity-40 mix-blend-color-dodge transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 60% 30%, ${currentMovie.accentColor} 0%, transparent 60%)`
          }}
        />
      </div>

      {/* Floating 3D Content Container */}
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-transform duration-200 ease-out"
        style={{
          transform: (tilt.x !== 0 || tilt.y !== 0) ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Movie Info & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Format Tags & High-Resolution Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest bg-rose-600 text-white shadow-lg shadow-rose-600/40 uppercase">
                Now in 4K IMAX
              </span>
              {currentMovie.formats.map((fmt, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/90 border border-white/15 text-slate-200"
                >
                  {fmt}
                </span>
              ))}
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {currentMovie.rating}
              </span>
            </div>

            {/* Movie Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
                {currentMovie.title}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-rose-300/90 font-medium italic">
                "{currentMovie.tagline}"
              </p>
            </div>

            {/* Quick Meta Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-400" />
                {currentMovie.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                {currentMovie.releaseYear}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs">
                {currentMovie.ageRating}
              </span>
              <span>•</span>
              <span className="text-slate-300 font-medium">
                {currentMovie.genres.join(" / ")}
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-slate-300/90 line-clamp-3 leading-relaxed max-w-2xl">
              {currentMovie.synopsis}
            </p>

            {/* Director & Cinematography highlight */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/15 inline-flex items-center gap-3 text-xs text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Directed by <strong className="text-white">{currentMovie.director}</strong> • {currentMovie.cinematographer}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  cinemaAudio.playCinemaRumble();
                  onSelectMovie(currentMovie);
                }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-rose-600/40 hover:shadow-rose-600/60 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <Ticket className="w-5 h-5" />
                Book 3D Tickets
              </button>

              <button
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  onWatchTrailer(currentMovie);
                }}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base border border-white/20 flex items-center gap-2 transition-all duration-300 cursor-pointer hover:border-rose-400/50 shadow-lg"
              >
                <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
                Watch Trailer
              </button>
            </div>

          </div>

          {/* Right Column: 3D Holographic Poster Display */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              onClick={() => {
                cinemaAudio.playCinemaRumble();
                onSelectMovie(currentMovie);
              }}
              className="relative w-64 sm:w-72 lg:w-80 group cursor-pointer"
            >
              {/* Glowing Hologram Backdrop */}
              <div 
                className="absolute -inset-2 rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  background: `linear-gradient(45deg, ${currentMovie.accentColor}, #f43f5e, #38bdf8)`
                }}
              />
              
              {/* 3D Poster Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 bg-slate-900">
                <img
                  src={currentMovie.poster}
                  alt={currentMovie.title}
                  className="w-full h-[400px] sm:h-[460px] object-cover"
                  onError={(e) => {
                    e.target.src = currentMovie.posterFallback;
                  }}
                />
                
                {/* Gloss Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Bottom Card Ribbon */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-extrabold text-sm truncate">
                        {currentMovie.title}
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Ticket className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Bottom Controls */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          
          {/* Thumbnails of other movies */}
          <div className="flex items-center gap-3 overflow-x-auto py-1 max-w-full">
            {movies.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setCurrentIndex(idx);
                }}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  currentIndex === idx 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105" 
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5"
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.accentColor }} />
                <span>{m.title}</span>
              </button>
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              title="Previous movie"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-white/10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-2">
              {currentIndex + 1} / {movies.length}
            </span>
            <button
              onClick={nextSlide}
              title="Next movie"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-white/10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
