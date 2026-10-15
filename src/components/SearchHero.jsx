import React, { useState, useRef, useEffect } from 'react';
import { Bus, Calendar, ArrowLeftRight, Search, MapPin, ChevronRight, ShieldCheck, LocateFixed } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { POPULAR_CITIES, POPULAR_ROUTES } from '../data/cities';
import { getTravelDateBounds } from '../utils/travelDates';

export default function SearchHero() {
  const { searchParams, handleSearch } = useBooking();
  
  const [fromCity, setFromCity] = useState(searchParams.fromCity);
  const [toCity, setToCity] = useState(searchParams.toCity);
  const [date, setDate] = useState(searchParams.date);

  // Sync inputs whenever searchParams changes (e.g. from RTC section or popular routes)
  useEffect(() => {
    setFromCity(searchParams.fromCity);
    setToCity(searchParams.toCity);
    setDate(searchParams.date);
  }, [searchParams.fromCity, searchParams.toCity, searchParams.date]);

  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setToDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchesCity = (city, query) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    if (city.name.toLowerCase().includes(q)) return true;
    if (city.state && city.state.toLowerCase().includes(q)) return true;
    if (city.code && city.code.toLowerCase().includes(q)) return true;
    if (city.aliases && city.aliases.some(a => a.toLowerCase().includes(q))) return true;
    // Common phonetic / alternate spellings
    if ((q === 'nasik' || q === 'nashik') && (city.id === 'nashik' || city.name.toLowerCase().includes('nashik'))) return true;
    return false;
  };

  const filteredFromCities = POPULAR_CITIES.filter(c => matchesCity(c, fromCity));

  const filteredToCities = POPULAR_CITIES.filter(c => matchesCity(c, toCity));

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    setLocationStatus('');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Location is not supported by this browser. Enter your source city manually.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const toRadians = value => (value * Math.PI) / 180;
        const [nearestCity, nearestDistance] = POPULAR_CITIES.reduce(
          ([closestCity, closestDistance], city) => {
            const [latitude, longitude] = city.coordinates;
            const latitudeDelta = toRadians(latitude - coords.latitude);
            const longitudeDelta = toRadians(longitude - coords.longitude);
            const distance = 6371 * 2 * Math.asin(Math.sqrt(
              Math.sin(latitudeDelta / 2) ** 2 +
              Math.cos(toRadians(coords.latitude)) *
              Math.cos(toRadians(latitude)) *
              Math.sin(longitudeDelta / 2) ** 2
            ));
            return distance < closestDistance
              ? [city, distance]
              : [closestCity, closestDistance];
          },
          [null, Infinity]
        );

        setIsLocating(false);
        if (!nearestCity || nearestDistance > 150) {
          setLocationStatus('No supported city found nearby. Enter your source city manually.');
          return;
        }

        setFromCity(nearestCity.name);
        setFromDropdownOpen(false);
        setLocationStatus(`Nearest supported city: ${nearestCity.name}. You can change it manually.`);
      },
      error => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('Location permission was denied. Enter your source city manually.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationStatus('Your location is unavailable. Enter your source city manually.');
        } else {
          setLocationStatus('Location request timed out. Enter your source city manually.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const travelDateBounds = getTravelDateBounds();

  const setQuickDate = (daysAhead) => {
    setDate(daysAhead === 0 ? travelDateBounds.today : travelDateBounds.tomorrow);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!fromCity.trim()) {
      alert('Please enter a source city');
      return;
    }
    if (!toCity.trim()) {
      alert('Please enter a destination city');
      return;
    }
    if (fromCity.toLowerCase() === toCity.toLowerCase()) {
      alert('Source and destination cannot be the same');
      return;
    }
    handleSearch(fromCity, toCity, date);
  };

  const formatDisplayDate = (dStr) => {
    if (!dStr) return '';
    const dateObj = new Date(dStr);
    return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative z-20 bg-gradient-to-br from-emerald-800 via-[#087e8b] to-indigo-950 px-4 pt-8 pb-16 text-white sm:px-6 sm:pt-12 sm:pb-24 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-[0.08] [background-size:18px_18px]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-500/35 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Banner Title */}
        <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-gradient-to-r from-white/20 via-cyan-100/10 to-indigo-200/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-indigo-950/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/60 hover:from-white/25 hover:to-indigo-200/25 hover:shadow-cyan-300/20">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>Primo & Verified Bus Network</span>
          </div>
          <h1 className="font-['Montserrat'] text-3xl font-extrabold leading-tight tracking-tight drop-shadow-sm sm:text-5xl">
            India's <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">No. 1</span> Online Bus Ticket Booking <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">Site</span>
          </h1>
          <p className="mt-3 text-sm font-medium text-cyan-50 sm:text-base">
            Over 36 Million Happy Travelers • 3,500+ Bus Operators • 100% Secure & On-Time Guarantee
          </p>
        </div>

        {/* Unified Search Widget */}
        <div className="relative z-30 mx-auto max-w-5xl rounded-2xl border border-white/70 bg-gradient-to-br from-white via-white to-cyan-50 p-3 text-gray-800 shadow-2xl shadow-indigo-950/30 transition-shadow duration-300 hover:shadow-[0_28px_70px_rgba(15,23,42,0.38)] sm:rounded-3xl sm:p-4">
          <form onSubmit={onSubmit} className="flex flex-col lg:flex-row items-stretch gap-2 relative">
            
            {/* FROM CITY */}
            <div className={`group relative flex-1 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:from-emerald-50 hover:to-white hover:shadow-md hover:shadow-emerald-100 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 ${fromDropdownOpen ? 'z-40' : 'z-0'}`} ref={fromRef}>
              <div className="flex items-center gap-3">
                <div className="text-gray-400 transition-transform duration-200 group-hover:scale-110 group-focus-within:text-[#087e8b]">
                  <Bus className="h-5 w-5 text-emerald-700 transition-colors group-hover:text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      From
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-1 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-100 hover:text-emerald-950 disabled:cursor-wait disabled:opacity-60"
                    >
                      <LocateFixed className="h-3 w-3" />
                      {isLocating ? 'Locating…' : 'Use location'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => {
                      setFromCity(e.target.value);
                      setFromDropdownOpen(true);
                      setLocationStatus('');
                    }}
                    onFocus={() => setFromDropdownOpen(true)}
                    placeholder="Enter Source City"
                    className="w-full bg-transparent font-bold text-gray-800 text-base focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>
              </div>
              {locationStatus && (
                <p role="status" className="mt-1 pl-8 text-xs text-gray-500">
                  {locationStatus}
                </p>
              )}

              {/* From Dropdown */}
              {fromDropdownOpen && (
                <div key={fromCity} className="absolute left-0 top-full mt-3 w-full sm:w-84 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-[min(20rem,50vh)] overflow-y-auto">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between">
                    <span>Popular Source Cities</span>
                    <span className="text-[10px] text-gray-400 font-normal">({filteredFromCities.length})</span>
                  </div>
                  <div className="divide-y divide-gray-50 pb-2">
                    {filteredFromCities.length > 0 ? (
                      filteredFromCities.map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => {
                            setFromCity(city.name);
                            setFromDropdownOpen(false);
                            setLocationStatus('');
                          }}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50 flex items-center justify-between transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MapPin className="w-4 h-4 text-[#087e8b] shrink-0" />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-gray-800 text-sm">{city.name}</span>
                                {city.aliases && city.aliases.length > 0 && (
                                  <span className="text-xs text-sky-600 font-medium bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                                    {city.aliases.join(', ')}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">({city.state})</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                            {city.code}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-xs text-gray-500 text-center">No city found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SWAP BUTTON */}
            <div className="z-20 -my-2 flex items-center justify-center lg:-mx-2">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap Cities"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-cyan-200 bg-gradient-to-br from-white to-cyan-50 text-[#087e8b] shadow-md shadow-cyan-900/10 transition-all duration-300 hover:rotate-180 hover:scale-110 hover:border-[#087e8b] hover:bg-gradient-to-br hover:from-[#087e8b] hover:to-indigo-700 hover:text-white hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* TO CITY */}
            <div className={`group relative flex-1 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:from-violet-50 hover:to-white hover:shadow-md hover:shadow-violet-100 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100 ${toDropdownOpen ? 'z-40' : 'z-0'}`} ref={toRef}>
              <div className="flex items-center gap-3">
                <div className="text-gray-400 transition-transform duration-200 group-hover:scale-110">
                  <Bus className="h-5 w-5 text-violet-600 transition-colors group-hover:text-violet-700" />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-violet-800">
                    To
                  </label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => {
                      setToCity(e.target.value);
                      setToDropdownOpen(true);
                    }}
                    onFocus={() => setToDropdownOpen(true)}
                    placeholder="Enter Destination City"
                    className="w-full bg-transparent font-bold text-gray-800 text-base focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* To Dropdown */}
              {toDropdownOpen && (
                <div key={toCity} className="absolute left-0 top-full mt-3 w-full sm:w-84 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-[min(20rem,50vh)] overflow-y-auto">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between">
                    <span>Popular Destination Cities</span>
                    <span className="text-[10px] text-gray-400 font-normal">({filteredToCities.length})</span>
                  </div>
                  <div className="divide-y divide-gray-50 pb-2">
                    {filteredToCities.length > 0 ? (
                      filteredToCities.map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => {
                            setToCity(city.name);
                            setToDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50 flex items-center justify-between transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MapPin className="w-4 h-4 text-[#087e8b] shrink-0" />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-gray-800 text-sm">{city.name}</span>
                                {city.aliases && city.aliases.length > 0 && (
                                  <span className="text-xs text-sky-600 font-medium bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                                    {city.aliases.join(', ')}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">({city.state})</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                            {city.code}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-xs text-gray-500 text-center">No city found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* DATE SELECTOR */}
            <div className="group flex-1 rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:from-amber-50 hover:to-white hover:shadow-md hover:shadow-amber-100 focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-amber-600 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Date of Journey
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setQuickDate(0)}
                        className="rounded bg-gray-200/60 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 transition-all hover:-translate-y-0.5 hover:bg-emerald-100 hover:text-emerald-800"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickDate(1)}
                        className="rounded bg-sky-100/60 px-1.5 py-0.5 text-[10px] font-semibold text-[#087e8b] transition-all hover:-translate-y-0.5 hover:bg-violet-100 hover:text-violet-800"
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={travelDateBounds.today}
                    className="w-full bg-transparent font-bold text-gray-800 text-sm sm:text-base focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="lg:w-48 flex items-stretch">
              <button
                type="submit"
                className="group flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087e8b] via-teal-600 to-indigo-700 px-6 py-4 font-['Montserrat'] text-base font-bold text-white shadow-lg shadow-indigo-900/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:from-[#075e68] hover:via-[#087e8b] hover:to-indigo-800 hover:shadow-xl hover:shadow-indigo-500/30 active:translate-y-0"
              >
                <Search className="h-5 w-5 stroke-[2.5] transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-8deg]" />
                <span>SEARCH BUSES</span>
              </button>
            </div>

          </form>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="relative z-0 mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-sky-100">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">Popular Routes:</span>
          {POPULAR_ROUTES.slice(0, 5).map((route, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setFromCity(route.from);
                setToCity(route.to);
                handleSearch(route.from, route.to, date);
              }}
              className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-indigo-300/10 px-3 py-1 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200/50 hover:from-cyan-300/20 hover:to-indigo-300/25 hover:shadow-md hover:shadow-indigo-950/20"
            >
              <span>{route.from}</span>
              <ChevronRight className="h-3 w-3 text-sky-300 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-200" />
              <span>{route.to}</span>
              <span className="ml-1 rounded-full bg-amber-300/20 px-2 py-0.5 font-semibold text-amber-200">₹{route.startingPrice}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
