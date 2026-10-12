import React, { useRef } from "react";
import { 
  Film, 
  Sparkles, 
  Clapperboard, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import ExperienceShowcase from "./ExperienceShowcase";
import MovieFilterBar from "./MovieFilterBar";
import MovieCard3D from "./MovieCard3D";
import TheatersSection from "./TheatersSection";
import { cinemaAudio } from "../utils/soundEffects";

export default function MoviesPage({
  movies = [],
  allMovies = [],
  selectedGenre,
  setSelectedGenre,
  selectedFormat,
  setSelectedFormat,
  selectedDate,
  setSelectedDate,
  searchQuery,
  setSearchQuery,
  selectedCity,
  onSelectCity,
  onInitiateBooking,
  onOpenDetails,
  onWatchTrailer,
  onNavigateHome
}) {
  const moviesScrollRef = useRef(null);

  const handleScrollMovies = (direction) => {
    cinemaAudio.playHoverTick();
    if (!moviesScrollRef.current) return;
    const cardWidth = 320;
    const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    moviesScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="pt-32 sm:pt-36 pb-20 lg:pb-8 min-h-screen text-slate-100 w-full overflow-x-hidden overscroll-none">
      
      {/* Rotating 3D Movie Cards Spotlight Showcase */}
      <ExperienceShowcase
        movies={allMovies}
        onSelectMovie={onInitiateBooking}
        onOpenDetails={onOpenDetails}
        onWatchTrailer={onWatchTrailer}
      />

      {/* Main Movies Gallery & Filter Area */}
      <main id="now-showing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Now Showing in 3D & IMAX
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select any movie below to experience our interactive curved 3D auditorium seating.
            </p>
          </div>
        </div>

        {/* Filter & Date Selection Bar */}
        <MovieFilterBar
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalResults={movies.length}
        />

        {/* 3D Movies Grid / Slider */}
        {movies.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-3">
            <Clapperboard className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Movies Match Your Criteria</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your genre, format, or search query.
            </p>
            <button
              onClick={() => {
                cinemaAudio.playHoverTick();
                setSelectedGenre("All Genres");
                setSelectedFormat("All Formats");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative group/slider">
            {/* Horizontal Track */}
            <div
              ref={moviesScrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent select-none"
              style={{
                WebkitOverflowScrolling: "touch"
              }}
            >
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  id={`movie-card-${movie.id}`}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0 snap-start scroll-mt-28 flex flex-col"
                >
                  <MovieCard3D
                    movie={movie}
                    selectedCity={selectedCity}
                    onSelectMovie={(m) => onInitiateBooking(m)}
                    onWatchTrailer={(m) => onOpenDetails(m)}
                    onOpenDetails={(m) => onOpenDetails(m)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Flagship Theaters Section */}
      <TheatersSection
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
        onSelectTheaterQuick={(theater, showtime, step = "seats") => {
          onInitiateBooking(allMovies[0], theater, showtime, step);
        }}
      />

    </div>
  );
}
