import React, { useMemo, useRef } from "react";
import { 
  Film, 
  Calendar, 
  Sparkles, 
  Clapperboard, 
  ArrowRight, 
  MapPin, 
  Flame, 
  Ticket, 
  Star, 
  ChevronRight,
  ChevronLeft,
  Tv,
  Music,
  Radio,
  Laugh
} from "lucide-react";
import HomeShowcase3D from "./HomeShowcase3D";
import MovieCard3D from "./MovieCard3D";
import { moviesData, cinemaEvents, popularCities } from "../data/moviesData";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";

export default function HomePage({
  selectedCity = "Mumbai",
  onSelectCity,
  onNavigatePage,
  onSelectMovie,
  onOpenMovieDetails,
  onWatchTrailer,
  onBookEvent
}) {
  const moviesScrollRef = useRef(null);
  const eventsScrollRef = useRef(null);

  // Filter events for the selected city (or fallback to top events)
  const cityEvents = useMemo(() => {
    const cityLower = selectedCity.trim().toLowerCase();
    const directMatches = cinemaEvents.filter(
      (e) => e.city && e.city.toLowerCase() === cityLower
    );
    if (directMatches.length > 0) return directMatches;
    return cinemaEvents.slice(0, 10);
  }, [selectedCity]);

  // Top Rated Movies (Sorted by rating descending: 8.9, 8.8, 8.7...)
  const topRatedMovies = useMemo(() => {
    return [...moviesData].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, []);

  // Horizontal scroll handler for Top Rated Movies
  const handleScrollMovies = (direction) => {
    cinemaAudio.playHoverTick();
    if (!moviesScrollRef.current) return;
    const containerWidth = moviesScrollRef.current.clientWidth;
    const scrollAmount = direction === "left" ? -containerWidth * 0.85 : containerWidth * 0.85;
    moviesScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Horizontal scroll handler for Events
  const handleScrollEvents = (direction) => {
    cinemaAudio.playHoverTick();
    if (!eventsScrollRef.current) return;
    const containerWidth = eventsScrollRef.current.clientWidth;
    const scrollAmount = direction === "left" ? -containerWidth * 0.85 : containerWidth * 0.85;
    eventsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="pt-32 sm:pt-36 pb-0 text-slate-100 min-h-screen w-full overflow-x-hidden overscroll-none">
      
      {/* 1. TOP CINEMATIC BILLBOARD STAGE: MARQUEE ADS FOR BOTH MOVIES & EVENTS */}
      <HomeShowcase3D
        movies={moviesData}
        events={cityEvents}
        onSelectMovie={onSelectMovie}
        onOpenMovieDetails={onOpenMovieDetails}
        onWatchTrailer={onWatchTrailer}
        onBookEvent={onBookEvent}
      />

      {/* 3. SECTION: TOP RATED MOVIES (HORIZONTAL CARDS MOVING LEFT TO RIGHT) */}
      <section id="top-rated-movies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Top Rated Movies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Browse critic-acclaimed blockbusters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => handleScrollMovies("left")}
                aria-label="Scroll left"
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollMovies("right")}
                aria-label="Scroll right"
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                if (onNavigatePage) onNavigatePage("movies");
              }}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-rose-600/20 border border-white/15 hover:border-rose-500/40 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition cursor-pointer shrink-0"
            >
              <span>View All Movies</span>
            </button>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="relative group/movies-slider">

          {/* Scrollable Column Track */}
          <div
            ref={moviesScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent select-none"
            style={{
              WebkitOverflowScrolling: "touch"
            }}
          >
            {topRatedMovies.map((movie) => (
              <div
                key={movie.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col"
              >
                <MovieCard3D
                  movie={movie}
                  selectedCity={selectedCity}
                  onSelectMovie={(m) => onSelectMovie(m)}
                  onWatchTrailer={(m) => onWatchTrailer ? onWatchTrailer(m) : onOpenMovieDetails(m)}
                  onOpenDetails={(m) => onOpenMovieDetails(m)}
                />
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 4. SECTION: TOP TRENDING LIVE EVENTS (HORIZONTAL CARDS MOVING LEFT TO RIGHT) */}
      <section id="trending-live-events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-0 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Top Trending Live Events in <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-rose-400 to-pink-400">{selectedCity}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Grab verified entry passes for premier tours and shows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => handleScrollEvents("left")}
                aria-label="Scroll left"
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollEvents("right")}
                aria-label="Scroll right"
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                if (onNavigatePage) onNavigatePage("events");
              }}
              className="w-fit self-start sm:self-auto group flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-amber-600/20 border border-white/15 hover:border-amber-500/40 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition cursor-pointer shrink-0"
            >
              <span>View All Events</span>
            </button>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="relative group/events-slider">

          {/* Scrollable Column Track */}
          <div
            ref={eventsScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent select-none"
            style={{
              WebkitOverflowScrolling: "touch"
            }}
          >
            {cityEvents.map((evt) => (
              <div
                key={evt.id}
                id={`home-event-card-${evt.id}`}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0 snap-start group relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-slate-950/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Poster Photo */}
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* City Badge Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/85 text-amber-300 border border-amber-500/40">
                      {evt.city || selectedCity}
                    </span>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/85 text-slate-200 border border-white/25">
                      {evt.category}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                    {evt.subtitle && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {evt.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-semibold">{evt.date} · {evt.time || "07:00 PM"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">{evt.hall}</span>
                    </div>
                  </div>

                  {/* Price & Reserve Pass Button */}
                  <div className="pt-3 flex items-center justify-between gap-3 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Pass from</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        {formatCurrencyINR(evt.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        cinemaAudio.playSeatConfirm();
                        if (onBookEvent) onBookEvent(evt);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Reserve Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
