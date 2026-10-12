import React, { useState } from "react";
import { X, Play, Star, Clock, Calendar, Ticket, Sparkles, Film, Award, UserCheck, MapPin, ChevronDown, Check } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { getCityTheaters, popularCities } from "../data/moviesData";

export default function MovieDetailModal({
  movie,
  selectedCity = "Mumbai",
  onSelectCity,
  onClose,
  onBookNow
}) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const cityTheaters = getCityTheaters(selectedCity);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 animate-in fade-in duration-300">
      
      {/* Outer Click dismiss backdrop */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => {
          cinemaAudio.playHoverTick();
          onClose();
        }} 
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/20 shadow-2xl bg-[#0a0e17] text-left"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        
        {/* Close Button */}
        <button
          onClick={() => {
            cinemaAudio.playHoverTick();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer transition-transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Media / Trailer Header */}
        <div className="relative w-full h-[280px] sm:h-[400px] bg-black overflow-hidden rounded-t-3xl">
          {isPlayingTrailer ? (
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerEmbed}?autoplay=1&rel=0`}
              title={`${movie.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={movie.backdrop4k}
                alt={movie.title}
                className="w-full h-full object-cover filter brightness-[0.6] contrast-110"
                onError={(e) => {
                  e.target.src = movie.posterFallback;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-black/40" />

              {/* Big Trailer Play Button */}
              <button
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setIsPlayingTrailer(true);
                }}
                className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border border-white/30 group"
              >
                <Play className="w-8 h-8 fill-white ml-1 group-hover:scale-110 transition-transform" />
              </button>

              {/* Title & Format Overlays */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                    {movie.formats[0]}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                    ★ {movie.rating} ({movie.voteCount})
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">
                  {movie.title}
                </h2>
              </div>
            </>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Quick Specs Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pb-4 border-b border-white/10">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-400" />
              {movie.duration}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {movie.releaseYear}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-xs">
              {movie.ageRating}
            </span>
            <span>•</span>
            <span className="text-slate-300 font-medium">
              {movie.genres.join(", ")}
            </span>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Storyline & Synopsis
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Director & Cinematography Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Director & Vision
              </span>
              <strong className="text-white text-sm block mt-0.5">
                {movie.director}
              </strong>
              <p className="text-xs text-rose-300/90 mt-1">
                {movie.cinematographer}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Audio & Screen Formats
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {movie.formats.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-cyan-950/60 text-cyan-300 border border-cyan-800">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Screening In Selected City Auditoriums */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Now Screening at Top Auditoriums in <strong className="text-cyan-400">{selectedCity}</strong>
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {cityTheaters.length} Theaters Available
              </span>
            </div>

            {/* Quick City Switcher Chips */}
            {onSelectCity && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {popularCities.map((c) => {
                  const isSelected = selectedCity.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        cinemaAudio.playHoverTick();
                        onSelectCity(c);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {cityTheaters.map((th) => (
                <div 
                  key={th.id} 
                  onClick={() => {
                    cinemaAudio.playHoverTick();
                    onBookNow(movie, th);
                  }}
                  onDoubleClick={() => {
                    cinemaAudio.playSeatConfirm();
                    onBookNow(movie, th, th.showtimes?.[0], "seats");
                  }}
                  title="Double-click to jump directly to seat selection"
                  className="p-3 rounded-xl bg-black/40 hover:bg-slate-800/90 border border-white/5 hover:border-cyan-500/40 flex items-center justify-between text-xs cursor-pointer transition-all group hover:scale-[1.01]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{th.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{th.location} · <span className="text-cyan-400 font-semibold">{th.distance}</span></p>
                    <span className="text-[9px] text-slate-400 mt-0.5 block truncate">{th.screenType}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      ★ {th.rating}
                    </span>
                    <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1 group-hover:text-white transition-colors">
                      <Ticket className="w-3 h-3" />
                      Book
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cast Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-rose-400" />
              Key Cast & Characters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {movie.cast.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-left">
                  <p className="font-extrabold text-white text-xs truncate">{c.name}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Highlights Badges */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 to-purple-950/30 border border-rose-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Premium Theater Presentation
            </h4>
            <div className="flex flex-wrap gap-2">
              {movie.experienceBadges.map((badge, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg text-xs bg-slate-900/80 text-slate-200 border border-white/10 font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Action Bottom Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                cinemaAudio.playHoverTick();
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
            >
              Close Window
            </button>

            <button
              onClick={() => {
                cinemaAudio.playCinemaRumble();
                onBookNow(movie);
              }}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-rose-600/40 cursor-pointer active:scale-95 transition-all"
            >
              <Ticket className="w-5 h-5" />
              Proceed to Seat Selection
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
