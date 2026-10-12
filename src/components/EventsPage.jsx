import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Calendar, 
  Sparkles, 
  MapPin, 
  Ticket, 
  Laugh, 
  Music, 
  Tv, 
  Radio, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Search,
  LayoutGrid,
  SlidersHorizontal,
  Flame,
  CheckCircle2
} from "lucide-react";
import { cinemaEvents, popularCities } from "../data/moviesData";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";
import EventsShowcase from "./EventsShowcase";

const eventCategories = [
  { id: "all", label: "All Events", icon: Sparkles },
  { id: "music", label: "Concerts & Gigs", icon: Music, categoryMatch: "Musical Performances" },
  { id: "comedy", label: "Comedy Shows", icon: Laugh, categoryMatch: "Comedy Shows" },
  { id: "live", label: "Live Events", icon: Radio, categoryMatch: "Live Events" },
  { id: "festivals", label: "Cinema Festivals", icon: Tv, categoryMatch: "Cinema Festival" }
];

export default function EventsPage({ 
  selectedCity = "Mumbai", 
  onSelectCity,
  onNavigateHome,
  onBookEvent 
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "carousel"
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  
  const scrollRef = useRef(null);
  const scrollDirectionRef = useRef("right");

  // Filter events based on selected location
  const cityScopedEvents = useMemo(() => {
    const currentCityLower = (selectedCity || "mumbai").trim().toLowerCase();
    
    // Direct matches for this city
    const directMatches = cinemaEvents.filter(
      (e) => e.city && e.city.toLowerCase() === currentCityLower
    );

    if (directMatches.length > 0) {
      // Deduplicate direct matches by title/id
      const seen = new Set();
      return directMatches.filter((e) => {
        const key = e.title.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Fallback if city has no direct entries: return premier unique concerts
    const seen = new Set();
    return cinemaEvents.filter((e) => {
      const key = e.title.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }, [selectedCity]);

  // Apply category and search filtering (when searching, search across all locations)
  const filteredEvents = useMemo(() => {
    const hasSearch = searchQuery.trim().length > 0;
    
    // If user is searching, search across ALL events nationwide across all cities
    // Otherwise scope to the selected city
    let baseEvents = hasSearch ? cinemaEvents : cityScopedEvents;

    // Deduplicate base events by id/title
    const seen = new Set();
    let result = baseEvents.filter((e) => {
      const key = `${e.id}-${e.title}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Category filter
    if (selectedCategory !== "all") {
      const cat = eventCategories.find((c) => c.id === selectedCategory);
      if (cat?.categoryMatch) {
        result = result.filter((evt) => evt.category === cat.categoryMatch);
      }
    }

    // Search query filter (matches title, city, hall, subtitle, category, date)
    if (hasSearch) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (evt) =>
          (evt.title && evt.title.toLowerCase().includes(query)) ||
          (evt.city && evt.city.toLowerCase().includes(query)) ||
          (evt.hall && evt.hall.toLowerCase().includes(query)) ||
          (evt.subtitle && evt.subtitle.toLowerCase().includes(query)) ||
          (evt.category && evt.category.toLowerCase().includes(query)) ||
          (evt.date && evt.date.toLowerCase().includes(query))
      );
    }

    return result;
  }, [selectedCategory, searchQuery, cityScopedEvents]);

  // Manual scroll handler for carousel view
  const handleScrollEvents = (direction) => {
    cinemaAudio.playHoverTick();
    if (!scrollRef.current) return;
    const cardWidth = 320;
    const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Automatic smooth back-and-forth scrolling for carousel view
  useEffect(() => {
    if (viewMode !== "carousel" || isAutoScrollPaused || filteredEvents.length <= 1) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 10) return;

      const stepSize = 340;

      if (scrollDirectionRef.current === "right") {
        if (container.scrollLeft + stepSize >= maxScrollLeft - 20) {
          container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
          scrollDirectionRef.current = "left";
        } else {
          container.scrollBy({ left: stepSize, behavior: "smooth" });
        }
      } else {
        if (container.scrollLeft - stepSize <= 20) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          scrollDirectionRef.current = "right";
        } else {
          container.scrollBy({ left: -stepSize, behavior: "smooth" });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [viewMode, isAutoScrollPaused, filteredEvents.length]);

  return (
    <div className="pt-36 sm:pt-40 pb-10 lg:pb-6 min-h-screen text-slate-100">
      
      {/* 3D Rotating Events Cards Showcase (Matches Movies Rotating Showcase at Top) */}
      <EventsShowcase
        events={cityScopedEvents}
        selectedCity={selectedCity}
        onBookEvent={(event) => {
          if (onBookEvent) onBookEvent(event);
        }}
        onOpenDetails={(event) => {
          if (onBookEvent) onBookEvent(event);
        }}
      />

      {/* Main Events Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* City Filter & Interactive Location Switcher */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0d121f] border border-white/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Active City
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedCity}
                </h3>
              </div>
            </div>
          </div>

          {/* Quick City Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {popularCities.slice(0, 8).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  if (onSelectCity) onSelectCity(city);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCity === city
                    ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {eventCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              const count = cat.id === "all" 
                ? cityScopedEvents.length 
                : cityScopedEvents.filter((e) => e.category === cat.categoryMatch).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    cinemaAudio.playHoverTick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-linear-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20 scale-102 border border-white/20"
                      : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-72">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Events Rendering */}
        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-12 text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Music className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {searchQuery.trim()
                ? `No matching events found for "${searchQuery.trim()}" across any location`
                : `No matching events found in ${selectedCity}`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {searchQuery.trim()
                ? "Try searching with a different artist, tour name, genre, or city."
                : "Try adjusting your category filter, clearing your search query, or check events in another city."}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Show All Events
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* ================= GRID VIEW ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                id={`event-card-${evt.id}`}
                className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-slate-950/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/10 scroll-mt-28"
              >
                {/* 1. 4K Poster Image */}
                <div className="relative h-56 overflow-hidden bg-slate-900">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const categoryFallbacks = {
                        "Musical Performances": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
                        "Comedy Shows": "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=80",
                        "Live Events": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80",
                        "Cinema Festival": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80"
                      };
                      e.currentTarget.src = categoryFallbacks[evt.category] || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
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

                {/* 2. Card Content Details */}
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

                  {/* Date and Venue */}
                  <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-semibold">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">{evt.hall}</span>
                    </div>
                  </div>

                  {/* Price & Reserve Pass Button */}
                  <div className="pt-3 flex items-center justify-between gap-3 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Price</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        {formatCurrencyINR(evt.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        cinemaAudio.playHoverTick();
                        onBookEvent(evt);
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
        ) : (
          /* ================= CAROUSEL VIEW ================= */
          <div 
            className="relative group/events-slider"
            onMouseEnter={() => setIsAutoScrollPaused(true)}
            onMouseLeave={() => setIsAutoScrollPaused(false)}
          >
            {/* Horizontal Column Track */}
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent select-none"
              style={{
                WebkitOverflowScrolling: "touch"
              }}
            >
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  id={`event-card-${evt.id}`}
                  className="w-[calc(100vw-2rem)] sm:w-[320px] lg:w-[340px] shrink-0 snap-center sm:snap-start group relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-slate-950/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/10 scroll-mt-28"
                >
                  {/* Poster */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        const categoryFallbacks = {
                          "Musical Performances": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
                          "Comedy Shows": "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1000&q=80",
                          "Live Events": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80",
                          "Cinema Festival": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80"
                        };
                        e.currentTarget.src = categoryFallbacks[evt.category] || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* City Badge Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/85 text-amber-300 border border-amber-500/40">
                        {evt.city || selectedCity}
                      </span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                        {evt.title}
                      </h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="font-semibold">{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{evt.hall}</span>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between gap-3 border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">Price</span>
                        <span className="text-base font-extrabold text-white font-mono">
                          {formatCurrencyINR(evt.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          cinemaAudio.playHoverTick();
                          onBookEvent(evt);
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

            {/* Slider Controls Bar */}
            <div className="flex items-center justify-between pt-2 px-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isAutoScrollPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`}></span>
                <span>
                  {isAutoScrollPaused ? "Auto-scroll paused (hovering)" : "Auto-scrolling continuously"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setIsAutoScrollPaused(!isAutoScrollPaused);
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
              >
                {isAutoScrollPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
                <span>{isAutoScrollPaused ? "Resume" : "Pause"}</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
