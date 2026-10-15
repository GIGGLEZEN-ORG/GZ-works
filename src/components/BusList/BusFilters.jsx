import React from 'react';
import { Filter, Radio, Award, Landmark, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

export default function BusFilters({
  filters,
  setFilters,
  resetFilters,
}) {
  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50/70 p-4 shadow-card transition-shadow duration-300 hover:shadow-[0_16px_32px_rgba(8,126,139,0.12)]">
      
      {/* Filters Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#087e8b]" />
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider font-['Montserrat']">
            Filters
          </h3>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-bold text-[#087e8b] hover:underline cursor-pointer"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Primo, RTC & Live Tracking Quick Badges */}
      <div className="space-y-2">
        <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-emerald-50/60 to-white p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm cursor-pointer">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-gray-800">Govt RTC Buses Only</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.rtcOnly)}
            onChange={(e) => setFilters(prev => ({ ...prev, rtcOnly: e.target.checked }))}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-amber-50/70 to-white p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-sm cursor-pointer">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-gray-800">Primo Buses Only</span>
          </div>
          <input
            type="checkbox"
            checked={filters.primoOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, primoOnly: e.target.checked }))}
            className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-sky-50/70 to-white p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-sm cursor-pointer">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-700" />
            <span className="text-xs font-bold text-gray-800">Live Tracking</span>
          </div>
          <input
            type="checkbox"
            checked={filters.liveTrackingOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, liveTrackingOnly: e.target.checked }))}
            className="h-4 w-4 rounded text-sky-700 focus:ring-sky-600"
          />
        </label>
      </div>

      {/* Bus Types */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Bus Type
        </h4>
        <div className="space-y-2 text-xs">
          {[
            { id: 'AC', label: 'AC Buses' },
            { id: 'Non-AC', label: 'Non-AC Buses' },
            { id: 'sleeper', label: 'Sleeper' },
            { id: 'seater', label: 'Seater / Semi-Sleeper' }
          ].map((type) => (
            <label key={type.id} className="flex items-center gap-2.5 cursor-pointer text-gray-700 hover:text-gray-900">
              <input
                type="checkbox"
                checked={filters.busTypes.includes(type.id)}
                onChange={() => toggleFilter('busTypes', type.id)}
                className="rounded text-[#087e8b] focus:ring-sky-500 w-4 h-4"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time Slots */}
      <div>
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
          Departure Time
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'early', icon: Sunrise, label: 'Before 6 AM' },
            { id: 'morning', icon: Sun, label: '6 AM - 12 PM' },
            { id: 'afternoon', icon: Sunset, label: '12 PM - 6 PM' },
            { id: 'night', icon: Moon, label: 'After 6 PM' }
          ].map((slot) => {
            const Icon = slot.icon;
            const isSelected = filters.departureSlots.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => toggleFilter('departureSlots', slot.id)}
                className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center transition cursor-pointer ${
                  isSelected
                    ? 'border-[#087e8b] bg-sky-50 text-[#087e8b] font-bold'
                    : 'border-gray-200 bg-gradient-to-br from-white to-slate-50 text-gray-600 hover:-translate-y-0.5 hover:border-sky-200 hover:from-sky-50 hover:to-cyan-50 hover:text-[#087e8b]'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[11px] leading-tight">{slot.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-gray-800 uppercase tracking-wider">Max Price</span>
          <span className="font-mono font-bold text-[#087e8b]">₹{filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="500"
          max="2000"
          step="50"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-[#087e8b] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
          <span>₹500</span>
          <span>₹2000</span>
        </div>
      </div>

    </div>
  );
}
