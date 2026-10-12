import React, { useState, useRef, useEffect } from "react";
import { MapPin, Star, Ticket, ChevronDown, Check } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { getCityTheaters, popularCities } from "../data/moviesData";
import { getTheaterImage, TheaterBrandLogo } from "../utils/theaterDetails";

export default function TheatersSection({ 
  selectedCity = "Mumbai",
  onSelectCity,
  onSelectTheaterQuick 
}) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const theaters = getCityTheaters(selectedCity);

  // Close city dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCityChange = (city) => {
    cinemaAudio.playHoverTick();
    if (onSelectCity) {
      onSelectCity(city);
    }
    setIsCityDropdownOpen(false);
  };

  return (
    <section id="theaters" className="w-full pt-8 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Title Header with Location Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-white/5">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Top Luxury Theaters in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400">{selectedCity}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered acoustics, 4K laser projection, and gourmet in-seat dining across premier cinemas in {selectedCity}.
          </p>
        </div>

        {/* Location Dropdown Picker */}
        <div className="flex items-center gap-3 relative shrink-0" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => {
                cinemaAudio.playHoverTick();
                setIsCityDropdownOpen(!isCityDropdownOpen);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/10 transition-all cursor-pointer group"
            >
              <MapPin className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span>Change Location: <strong className="text-cyan-400">{selectedCity}</strong></span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCityDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isCityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a0e17] border border-white/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 flex items-center justify-between">
                  <span>Select Metro / City</span>
                  <span className="text-cyan-400">{popularCities.length} Locations</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10">
                  {popularCities.map((city) => {
                    const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
                    return (
                      <button
                        key={city}
                        onClick={() => handleCityChange(city)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                          {city}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Theaters Grid for Selected City */}
      <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {theaters.map((theater, index) => {
          const theaterImage = getTheaterImage(theater, index);

          return (
            <div
              key={theater.id}
              onMouseEnter={() => cinemaAudio.playHoverTick()}
              onClick={() => {
                cinemaAudio.playSeatConfirm();
                if (onSelectTheaterQuick) {
                  onSelectTheaterQuick(theater, theater.showtimes?.[0], "seats");
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                cinemaAudio.playSeatConfirm();
                if (onSelectTheaterQuick) {
                  onSelectTheaterQuick(theater, theater.showtimes?.[0], "seats");
                }
              }}
              className="group relative flex h-full flex-col rounded-3xl overflow-hidden glass-card border border-white/10 bg-[#0c101a] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
            >
              {/* 1. Theatre Image Area */}
              <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={theaterImage}
                  alt={theater.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.currentTarget.src = "/theaters/hyd-prasads-pcx.jpg";
                  }}
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-black/25 to-black/60 pointer-events-none" />

                {/* 2. Theatre Logo (Top-Left) */}
                <div className="absolute top-3 left-3 z-10 drop-shadow-lg">
                  <TheaterBrandLogo name={theater.name} />
                </div>

                {/* 3. Rating Badge (Top-Right) */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-black/85 px-2.5 py-1 text-xs font-bold text-amber-300 shadow-xl">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {theater.rating}
                  </span>
                </div>
              </div>

              {/* 4. Card Body: Theatre Name + Showtimes + Select Seats */}
              <div 
                className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3.5"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  cinemaAudio.playSeatConfirm();
                  if (onSelectTheaterQuick) {
                    onSelectTheaterQuick(theater, theater.showtimes?.[0], "seats");
                  }
                }}
              >
                {/* Theatre Name & Location */}
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                    {theater.name}
                  </h3>
                  {theater.location && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{theater.location}</span>
                    </p>
                  )}
                </div>


                {/* 5. Select Seats Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cinemaAudio.playSeatConfirm();
                    if (onSelectTheaterQuick) {
                      onSelectTheaterQuick(theater, theater.showtimes?.[0], "seats");
                    }
                  }}
                  className="w-full mt-1 py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Select Seats</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
