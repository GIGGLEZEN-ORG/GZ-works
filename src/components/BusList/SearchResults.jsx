import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Calendar, 
  MapPin, 
  Search, 
  RotateCcw,
  Landmark
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import BusCard from './BusCard';
import BusFilters from './BusFilters';
import { RTC_LIST } from '../../data/rtcData';
import { clampTravelDate, formatDateInput, getTravelDateBounds } from '../../utils/travelDates';

const RTC_DISPLAY_ORDER = ['apsrtc', 'tsrtc', 'ksrtc', 'msrtc', 'gsrtc', 'upsrtc'];

export default function SearchResults() {
  const { searchParams, buses, handleSearch, navigateToHome } = useBooking();

  // Sorting state: 'cheapest' | 'fastest' | 'early' | 'late' | 'rating'
  const [sortBy, setSortBy] = useState('rating');
  const [selectedRtcCode, setSelectedRtcCode] = useState(null);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSeatBusId, setOpenSeatBusId] = useState(null);

  useEffect(() => {
    if (!mobileFilterOpen) return undefined;

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') setMobileFilterOpen(false);
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileFilterOpen]);

  // Filters state
  const [filters, setFilters] = useState({
    rtcOnly: false,
    primoOnly: false,
    liveTrackingOnly: false,
    busTypes: [],
    departureSlots: [],
    maxPrice: 2000
  });

  const resetFilters = () => {
    setFilters({
      rtcOnly: false,
      primoOnly: false,
      liveTrackingOnly: false,
      busTypes: [],
      departureSlots: [],
      maxPrice: 2000
    });
  };

  const availableRtcCards = useMemo(() => {
    const groupedBuses = new Map();
    buses.filter(bus => bus.isRtc).forEach(bus => {
      const group = groupedBuses.get(bus.rtcCode) || [];
      group.push(bus);
      groupedBuses.set(bus.rtcCode, group);
    });

    return RTC_LIST
      .filter(rtc => groupedBuses.has(rtc.id))
      .sort((first, second) =>
        RTC_DISPLAY_ORDER.indexOf(first.id) - RTC_DISPLAY_ORDER.indexOf(second.id)
      )
      .map(rtc => {
        const rtcBuses = groupedBuses.get(rtc.id);
        return {
          ...rtc,
          busCount: rtcBuses.length,
          startingFare: Math.min(...rtcBuses.map(bus => bus.baseFare)),
          hasLiveTracking: rtcBuses.some(bus => bus.liveTracking)
        };
      });
  }, [buses]);

  // Shift date helper
  const shiftDate = (days) => {
    const d = new Date(`${searchParams.date}T00:00:00`);
    d.setDate(d.getDate() + days);
    const newDateStr = clampTravelDate(formatDateInput(d), searchParams.date);
    handleSearch(searchParams.fromCity, searchParams.toCity, newDateStr);
  };

  // Filter buses
  const filteredBuses = useMemo(() => {
    return buses.filter(bus => {
      // Govt RTC Only
      if (filters.rtcOnly && !bus.isRtc) return false;

      // Keep RTC operators represented by summary cards unless their buses are requested.
      if (selectedRtcCode && (!bus.isRtc || bus.rtcCode !== selectedRtcCode)) return false;
      if (bus.isRtc && !selectedRtcCode && !filters.rtcOnly) return false;

      // Primo
      if (filters.primoOnly && !bus.isPrimo) return false;

      // Live Tracking
      if (filters.liveTrackingOnly && !bus.liveTracking) return false;

      // Max price
      if (bus.baseFare > filters.maxPrice) return false;

      // Bus Types
      if (filters.busTypes.length > 0) {
        const matchesType = filters.busTypes.some(t => {
          if (t === 'AC' && bus.isAC) return true;
          if (t === 'Non-AC' && !bus.isAC) return true;
          if (t === 'sleeper' && bus.category.includes('sleeper')) return true;
          if (t === 'seater' && (bus.category === 'seater' || bus.category === 'semi-sleeper')) return true;
          return false;
        });
        if (!matchesType) return false;
      }

      // Departure Slots
      if (filters.departureSlots.length > 0) {
        const hour = parseInt(bus.depTime.split(':')[0], 10);
        const matchesSlot = filters.departureSlots.some(slot => {
          if (slot === 'early' && hour < 6) return true;
          if (slot === 'morning' && hour >= 6 && hour < 12) return true;
          if (slot === 'afternoon' && hour >= 12 && hour < 18) return true;
          if (slot === 'night' && hour >= 18) return true;
          return false;
        });
        if (!matchesSlot) return false;
      }

      return true;
    });
  }, [buses, filters, selectedRtcCode]);

  // Sort buses
  const sortedBuses = useMemo(() => {
    const list = [...filteredBuses];
    if (sortBy === 'cheapest') {
      list.sort((a, b) => a.baseFare - b.baseFare);
    } else if (sortBy === 'fastest') {
      const getMin = d => {
        const parts = d.match(/(\d+)h\s*(\d+)m/);
        return parts ? parseInt(parts[1]) * 60 + parseInt(parts[2]) : 999;
      };
      list.sort((a, b) => getMin(a.duration) - getMin(b.duration));
    } else if (sortBy === 'early') {
      list.sort((a, b) => a.depTime.localeCompare(b.depTime));
    } else if (sortBy === 'late') {
      list.sort((a, b) => b.depTime.localeCompare(a.depTime));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [filteredBuses, sortBy]);

  const formattedDate = new Date(searchParams.date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const travelDateBounds = getTravelDateBounds();

  return (
    <div className="min-h-screen bg-[#f6f8f7] pb-20">
      
      {/* Top Route & Modify Search Strip */}
      <div className="sticky top-16 z-30 border-b border-sky-100 bg-gradient-to-r from-white via-white to-sky-50/80 shadow-xs md:top-20">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-4">
            
            {/* Origin -> Destination & Date */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={navigateToHome}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1 text-base font-black text-gray-900 font-['Montserrat'] sm:gap-2 sm:text-xl">
                  <span className="truncate">{searchParams.fromCity}</span>
                  <span className="shrink-0 text-[#087e8b]">→</span>
                  <span className="truncate">{searchParams.toCity}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {formattedDate}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-gray-800">
                    {sortedBuses.length} Buses Available
                  </span>
                </div>
              </div>
            </div>

            {/* Day Shift Controls & Mobile Filter Trigger */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50 p-1">
                <button
                  type="button"
                  onClick={() => shiftDate(-1)}
                  disabled={searchParams.date <= travelDateBounds.today}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Today</span>
                </button>
                <button
                  type="button"
                  onClick={() => shiftDate(1)}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-800 transition hover:-translate-y-0.5 hover:from-violet-100 hover:to-indigo-100 hover:text-indigo-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Next Day</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <label
                  className="relative ml-1 flex h-8 w-9 cursor-pointer items-center justify-center rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:from-amber-100 hover:to-orange-100 hover:text-orange-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-1"
                  title="Choose travel date"
                >
                  <Calendar aria-hidden="true" className="h-4 w-4 transition-transform hover:scale-110" />
                  <input
                    type="date"
                    aria-label="Choose travel date"
                    value={searchParams.date}
                    min={travelDateBounds.today}
                    onChange={event =>
                      handleSearch(searchParams.fromCity, searchParams.toCity, event.target.value)
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 rounded-xl border border-sky-200 bg-gradient-to-r from-white to-sky-50 px-3 py-2 text-xs font-bold text-gray-800 transition-all hover:border-sky-300 hover:text-[#087e8b] hover:shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#087e8b]" />
                <span>Filters</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-12">
          
          {/* DESKTOP FILTERS SIDEBAR */}
          <div className="sticky top-44 hidden max-h-[calc(100dvh-12rem)] overscroll-contain overflow-y-auto lg:col-span-3 lg:block">
            <BusFilters
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetFilters}
            />
          </div>

          {/* MOBILE FILTERS MODAL */}
          {mobileFilterOpen && (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-black/50 p-3 sm:items-center sm:p-4 lg:hidden"
              onClick={() => setMobileFilterOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-filters-title"
                className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[85dvh]"
                onClick={event => event.stopPropagation()}
              >
                <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
                  <h3 id="mobile-filters-title" className="font-bold text-gray-900">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-[#087e8b] to-[#164e63] px-4 py-2 text-xs font-bold text-white transition hover:from-[#075e68] hover:to-[#103b4a]"
                  >
                    Done
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
                  <BusFilters
                    filters={filters}
                    setFilters={setFilters}
                    resetFilters={resetFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BUS LISTING CONTAINER */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-9">

            {availableRtcCards.length > 0 && (
              <section aria-label="Government RTC buses" className="space-y-3 sm:space-y-4">
                {availableRtcCards.map(rtc => (
                  <article
                    key={rtc.id}
                    className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-white to-amber-50/50 p-4 shadow-[0_8px_18px_rgba(17,24,39,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_18px_36px_rgba(245,158,11,0.14)] sm:rounded-[28px] sm:p-6"
                  >
                    <div className="mb-4 flex flex-wrap items-start gap-2 sm:mb-5">
                      {rtc.hasLiveTracking && (
                        <span className="rounded-xl bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-gray-800 sm:px-3 sm:text-sm">
                          Live Tracking
                        </span>
                      )}
                      {rtc.offer && (
                        <span className="rounded-xl bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-gray-800 sm:px-3 sm:text-sm">
                          {rtc.offer}
                        </span>
                      )}
                      <span className="rounded-xl bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-gray-800 sm:px-3 sm:text-sm">
                        {rtc.concession}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                        <div
                          aria-hidden="true"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-sky-50 text-amber-600 sm:h-16 sm:w-16"
                        >
                          <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="break-words text-lg font-bold leading-tight text-gray-900 sm:text-2xl">
                            {rtc.name} Buses
                          </h2>
                          <p className="mt-1 break-words text-sm leading-relaxed text-gray-700 sm:text-lg">
                            {rtc.fullName}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                        <p className="text-sm text-gray-600 sm:text-right sm:text-base">
                          <span className="font-medium text-gray-900">{rtc.busCount} buses</span>
                          <span className="text-gray-500"> starting from </span>
                          <span className="font-bold text-gray-900">₹{rtc.startingFare}</span>
                        </p>
                        <button
                          type="button"
                          aria-pressed={selectedRtcCode === rtc.id}
                          onClick={() => setSelectedRtcCode(current => current === rtc.id ? null : rtc.id)}
                          className="w-full shrink-0 rounded-full bg-gradient-to-r from-[#087e8b] to-[#164e63] px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#075e68] hover:to-[#103b4a] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087e8b] focus-visible:ring-offset-2 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
                        >
                          {selectedRtcCode === rtc.id ? 'Hide buses' : 'Show buses'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            )}
            
            {/* Quick Sort Options Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-100 bg-gradient-to-r from-white via-sky-50/50 to-cyan-50/50 p-3 text-xs shadow-xs">
              <span className="font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <span>Sort by:</span>
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'rating', label: 'Top Rated ★' },
                  { id: 'cheapest', label: 'Cheapest First' },
                  { id: 'fastest', label: 'Fastest Duration' },
                  { id: 'early', label: 'Departure: Early' },
                  { id: 'late', label: 'Departure: Late' }
                ].map(sortOption => (
                  <button
                    key={sortOption.id}
                    type="button"
                    onClick={() => setSortBy(sortOption.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      sortBy === sortOption.id
                        ? 'border border-sky-200 bg-gradient-to-r from-sky-100 to-cyan-100 font-bold text-[#087e8b] shadow-sm'
                        : 'border border-transparent text-gray-600 hover:border-sky-100 hover:bg-white hover:text-[#087e8b]'
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Buses */}
            {sortedBuses.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {sortedBuses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    showSeats={openSeatBusId === bus.id}
                    onToggleSeats={() =>
                      setOpenSeatBusId(currentBusId => currentBusId === bus.id ? null : bus.id)
                    }
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50 p-12 text-center shadow-card">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-[#087e8b] flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-['Montserrat'] mb-2">
                  No buses match your active filters
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Try adjusting the departure time, price slider, or bus operators to view more available buses on this route.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl bg-gradient-to-r from-[#087e8b] to-[#164e63] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-[#075e68] hover:to-[#103b4a] hover:shadow-lg cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
