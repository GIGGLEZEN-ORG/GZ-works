import React from "react";
import { Filter, Calendar, Sparkles, X, Clapperboard, Layers } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";

const genresList = ["All Genres", "Sci-Fi", "Action", "Drama", "Animation", "Adventure", "Comedy"];
const formatsList = ["All Formats", "IMAX 70mm", "IMAX 3D", "Dolby Atmos", "4DX"];

export default function MovieFilterBar({
  selectedGenre,
  setSelectedGenre,
  selectedFormat,
  setSelectedFormat,
  selectedDate,
  setSelectedDate,
  searchQuery,
  setSearchQuery,
  totalResults
}) {
  // Generate next 6 days dynamically
  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const fullDate = d.toISOString().split("T")[0];
    return { dayName, monthDay, fullDate };
  });

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl space-y-5">
      
      {/* Top Bar: Date Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            <span>Select Screening Date</span>
          </div>
          <span className="text-xs text-rose-400 font-medium">
            {totalResults} {totalResults === 1 ? "Movie" : "Movies"} Showing
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dates.map((d, idx) => {
            const isSelected = (selectedDate || dates[0].fullDate) === d.fullDate;
            return (
              <button
                key={idx}
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setSelectedDate(d.fullDate);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-center transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 scale-102"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-white/5"
                }`}
              >
                <div className="text-[11px] font-medium opacity-80">{d.dayName}</div>
                <div className="text-xs font-bold">{d.monthDay}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Bar: Genre and Format Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-3 border-t border-white/5">
        
        {/* Genre Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">
            Genre:
          </span>
          {genresList.map((g) => {
            const isSelected = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setSelectedGenre(g);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/50"
                    : "bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Format Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">
            Screen:
          </span>
          {formatsList.map((fmt) => {
            const isSelected = selectedFormat === fmt;
            return (
              <button
                key={fmt}
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setSelectedFormat(fmt);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : "bg-slate-900/40 hover:bg-slate-800/80 text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>

      </div>

      {/* Active Search & Reset Chips (if active) */}
      {(searchQuery || selectedGenre !== "All Genres" || selectedFormat !== "All Formats") && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-slate-400">
          <span>Active Filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-white border border-white/10">
              Query: "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </span>
          )}
          {selectedGenre !== "All Genres" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {selectedGenre}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGenre("All Genres")} />
            </span>
          )}
          {selectedFormat !== "All Formats" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {selectedFormat}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFormat("All Formats")} />
            </span>
          )}
          <button
            onClick={() => {
              cinemaAudio.playHoverTick();
              setSearchQuery("");
              setSelectedGenre("All Genres");
              setSelectedFormat("All Formats");
            }}
            className="text-rose-400 hover:underline ml-auto font-medium cursor-pointer"
          >
            Reset All
          </button>
        </div>
      )}

    </div>
  );
}
