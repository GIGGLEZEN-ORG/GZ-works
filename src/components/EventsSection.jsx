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
  Play
} from "lucide-react";
import { cinemaEvents } from "../data/moviesData";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";

const eventCategories = [
  { id: "all", label: "All Events", icon: Sparkles },
  { id: "music", label: "Concerts & Gigs", icon: Music, categoryMatch: "Musical Performances" },
  { id: "comedy", label: "Comedy Shows", icon: Laugh, categoryMatch: "Comedy Shows" },
  { id: "live", label: "Live Events", icon: Radio, categoryMatch: "Live Events" },
  { id: "festivals", label: "Cinema Festivals", icon: Tv, categoryMatch: "Cinema Festival" }
];

const popularCities = [
  "Mumbai",
  "Delhi-NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Chandigarh",
  "Jaipur"
];

export default function EventsSection({ 
  selectedCity = "Mumbai", 
  onSelectCity,
  onBookEvent 
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    }).slice(0, 8);
  }, [selectedCity]);

  // Apply category filtering
  const filteredEvents = useMemo(() => {
    if (selectedCategory === "all") return cityScopedEvents;
    const cat = eventCategories.find((c) => c.id === selectedCategory);
    return cityScopedEvents.filter((evt) => evt.category === cat?.categoryMatch);
  }, [selectedCategory, cityScopedEvents]);

  // Manual scroll handler
  const handleScrollEvents = (direction) => {
    cinemaAudio.playHoverTick();
    if (!scrollRef.current) return;
    const cardWidth = 320;
    const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Automatic smooth back-and-forth scrolling (moves right and left automatically)
  useEffect(() => {
    if (isAutoScrollPaused || filteredEvents.length <= 1) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 10) return;

      const stepSize = 340; // width of one card + gap

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
  }, [isAutoScrollPaused, filteredEvents.length]);

  return (
    <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Events & Live Experiences
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Discover real-time stadium concerts, viral standup comedy tours, EDM arena festivals, and 70mm cinema retrospectives curated for your city.
          </p>
        </div>

        {/* Location Indicator & Quick City Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                cinemaAudio.playHoverTick();
                setIsCityDropdownOpen(!isCityDropdownOpen);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-linear-to-r from-rose-950/90 to-purple-950/90 border border-rose-500/40 text-white text-xs sm:text-sm font-bold shadow-lg hover:border-rose-400/60 transition cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
              <span>Events in <span className="text-amber-300 font-extrabold">{selectedCity}</span></span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCityDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Quick City Dropdown */}
            {isCityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0b101b] border border-white/20 shadow-2xl p-2 z-40 animate-in fade-in">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-white/5">
                  Select Event City
                </p>
                <div className="max-h-56 overflow-y-auto space-y-1 py-1">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        cinemaAudio.playHoverTick();
                        if (onSelectCity) onSelectCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedCity === city
                          ? "bg-rose-500/20 text-rose-300 font-bold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Booking Badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-slate-900/90 px-3.5 py-2.5 rounded-2xl border border-white/10 shadow-lg shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-bold text-white">Live Booking Active</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs & Auto-Play Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
                    ? "bg-linear-to-r from-rose-600 to-amber-500 text-white shadow-lg shadow-rose-600/30 scale-102 border border-white/20"
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

        {/* Auto Slide Toggle Pill */}
        <button
          type="button"
          onClick={() => {
            cinemaAudio.playHoverTick();
            setIsAutoScrollPaused(!isAutoScrollPaused);
          }}
          title={isAutoScrollPaused ? "Resume auto-slide" : "Pause auto-slide"}
          className="hidden sm:flex shrink-0 items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-white/10 transition cursor-pointer self-start sm:self-auto"
        >
          {isAutoScrollPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resume Auto-Scroll</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause Auto-Scroll</span>
            </>
          )}
        </button>
      </div>

      {/* Events Carousel Slider (Columns moving left & right automatically) */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-3">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No events found in this category for {selectedCity}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Try switching categories or explore events happening across other major cities like Mumbai or Delhi-NCR.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition"
          >
            Show All Events in {selectedCity}
          </button>
        </div>
      ) : (
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
                className="w-[280px] sm:w-[320px] lg:w-[340px] shrink-0 snap-start group relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-slate-950/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-amber-500/10 scroll-mt-28"
              >
                {/* 1. Image */}
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
                  {/* 2. Name of event */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                  </div>

                  {/* 3. Date and place */}
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

                  {/* 4. Price & 5. Reserve Pass */}
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

          {/* Event Status and Count Info */}
          <div className="flex items-center justify-between pt-2 px-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAutoScrollPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`}></span>
              <span>
                {isAutoScrollPaused ? "Auto-scroll paused (hovering)" : "Auto-scrolling continuously"}
              </span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} in {selectedCity}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
