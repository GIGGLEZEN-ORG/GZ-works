import React from "react";
import { MapPin, Sparkles, Volume2, ShieldCheck, Clock, CheckCircle, Ban, Navigation, Ticket } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { isShowtimePast, getFirstAvailableShowtime } from "../utils/timeUtils";
import { popularCities } from "../data/moviesData";

export default function ShowtimeSelector({
  theaters,
  selectedTheater,
  setSelectedTheater,
  selectedTime,
  setSelectedTime,
  selectedDate,
  selectedCity = "Mumbai",
  onSelectCity,
  onProceedToSeats
}) {
  return (
    <div className="w-full space-y-5">
      {/* City / Location Picker Header */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 bg-slate-900/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <MapPin className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Select Location & Cinema
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Choose your city to browse available luxury auditoriums and laser screenings
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current City:</span>
            <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-md shadow-rose-600/30">
              {selectedCity}
            </span>
          </div>
        </div>

        {/* City selector pills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Navigation className="w-3 h-3 text-cyan-400" />
            <span>Select Location / City</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {popularCities.map((city) => {
              const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    cinemaAudio.playHoverTick();
                    if (onSelectCity) onSelectCity(city);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30 scale-102"
                      : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-white/10 hover:text-white"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theaters at that Location */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cinemas in {selectedCity} ({theaters.length})</span>
          </h4>
          <span className="text-[11px] text-slate-400">Choose a theater to select seats</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {theaters.map((theater) => {
          const isTheaterActive = selectedTheater?.id === theater.id;

          return (
            <div
              key={theater.id}
              onClick={() => {
                cinemaAudio.playSeatConfirm();
                const availableTime = getFirstAvailableShowtime(theater.showtimes, selectedDate) || theater.showtimes[0];
                if (onProceedToSeats) {
                  onProceedToSeats(theater, availableTime);
                }
              }}
              className={`p-4 sm:p-5 rounded-2xl glass-panel border transition-all cursor-pointer group flex flex-col justify-between h-full ${
                isTheaterActive
                  ? "border-rose-500 bg-rose-500/10 shadow-xl shadow-rose-500/20"
                  : "border-white/10 hover:border-white/20 hover:bg-slate-900/80 bg-slate-900/60"
              }`}
            >
              {/* Theater Info & Header (Fixed Height / Proportions) */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                {/* Theater Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-base sm:text-lg leading-snug group-hover:text-rose-400 transition-colors">
                        {theater.name}
                      </h4>
                      {isTheaterActive && (
                        <CheckCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                      {theater.location} • <span className="text-cyan-400 font-bold">{theater.distance}</span>
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40 flex items-center gap-1">
                    <span>★</span>
                    <span>{theater.rating}</span>
                  </span>
                </div>

                {/* Theater Tech Specs */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-200">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-600/70 font-semibold text-white">
                    {theater.screenType}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-600/70 text-slate-200 font-medium">
                    {theater.sound}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-white/5 text-slate-300 text-xs">
                    {theater.parking}
                  </span>
                </div>
              </div>

              {/* Select Seats Button */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cinemaAudio.playSeatConfirm();
                    const firstAvail = getFirstAvailableShowtime(theater.showtimes, selectedDate) || theater.showtimes[0];
                    if (onProceedToSeats) {
                      onProceedToSeats(theater, firstAvail);
                    }
                  }}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-98 transition-all cursor-pointer group"
                >
                  <Ticket className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>Select Seats</span>
                </button>
              </div>

            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
