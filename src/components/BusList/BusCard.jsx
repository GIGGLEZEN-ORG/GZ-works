import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  BatteryCharging, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  Info, 
  Check, 
  AlertCircle,
  Landmark
} from 'lucide-react';
import SeatLayout from './SeatLayout';

export default function BusCard({ bus, showSeats, onToggleSeats }) {
  const [activeTab, setActiveTab] = useState(null); // null | 'amenities' | 'points' | 'policy'

  const toggleTab = (tabName) => {
    setActiveTab(activeTab === tabName ? null : tabName);
  };

  return (
    <div className={`bg-gradient-to-br from-white via-white to-sky-50/40 rounded-2xl border transition-all duration-300 overflow-hidden shadow-card hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(8,126,139,0.13)] ${
      showSeats ? 'border-[#087e8b] ring-2 ring-sky-100' : 'border-gray-200 hover:border-sky-200'
    }`}>
      
      {/* Top Card Main Area */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:gap-6 lg:flex-row lg:items-center">
          
          {/* Operator Info & Model */}
          <div className="lg:w-1/3">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                {bus.name}
              </h3>

              {bus.isRtc && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                  <Landmark className="w-2.5 h-2.5 text-emerald-700" />
                  Official Govt Bus
                </span>
              )}
              
              {bus.isPrimo && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Primo
                </span>
              )}

              {bus.liveTracking && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-sky-700" />
                  Live Tracking
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 font-medium mb-3">
              {bus.busType}
            </p>

            {/* Rating badge */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-md shadow-xs">
                <span>{bus.rating}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {bus.ratingCount.toLocaleString()} ratings
              </span>
            </div>
          </div>

          {/* Departure - Duration - Arrival Timeline */}
          <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center lg:w-1/3">
            
            {/* Departure */}
            <div className="min-w-0 text-left sm:text-center">
              <div className="text-lg font-black text-gray-900 font-['Montserrat'] sm:text-xl">
                {bus.depTime}
              </div>
              <div className="truncate text-xs font-semibold text-gray-700">
                {bus.from}
              </div>
              <div className="truncate text-[10px] text-gray-400">
                {bus.boardingPoints[0].name}
              </div>
            </div>

            {/* Duration Graphic */}
            <div className="flex min-w-0 flex-col items-center px-1 sm:px-2">
              <span className="text-[11px] font-bold text-gray-500 mb-1">
                {bus.duration}
              </span>
              <div className="relative flex w-14 items-center sm:w-28">
                <div className="w-2 h-2 rounded-full border-2 border-gray-400 bg-white"></div>
                <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-[#087e8b]"></div>
              </div>
              <span className="whitespace-nowrap text-[10px] text-gray-400 mt-1">Direct Bus</span>
            </div>

            {/* Arrival */}
            <div className="min-w-0 text-right sm:text-center">
              <div className="text-lg font-black text-gray-900 font-['Montserrat'] sm:text-xl">
                {bus.arrTime}
              </div>
              <div className="truncate text-xs font-semibold text-gray-700">
                {bus.to}
              </div>
              <div className="truncate text-[10px] text-gray-400">
                {bus.droppingPoints[0].name}
              </div>
            </div>

          </div>

          {/* Pricing & View Seats Button */}
          <div className="flex flex-row items-center justify-between gap-3 rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/80 p-3 shadow-sm lg:w-1/3 lg:p-4">
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  ₹{bus.originalFare}
                </span>
                <span className="text-2xl font-black text-[#102b32] font-['Montserrat']">
                  ₹{bus.baseFare}
                </span>
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {bus.availableSeatsCount} Seats available
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleSeats}
              aria-expanded={showSeats}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087e8b] focus-visible:ring-offset-2 active:scale-95 cursor-pointer ${
                showSeats
                  ? 'border-[#087e8b] bg-white text-[#087e8b] shadow-sm hover:bg-sky-50'
                  : 'border-transparent bg-gradient-to-r from-[#087e8b] to-[#164e63] text-white shadow-md shadow-sky-500/20 hover:-translate-y-0.5 hover:from-[#075e68] hover:to-[#103b4a]'
              }`}
            >
              <span>{showSeats ? 'Hide Seats' : 'View Seats'}</span>
              {showSeats ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        {/* Bottom Strip: Tab Buttons */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 sm:mt-4 sm:pt-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => toggleTab('amenities')}
              className={`hover:text-[#087e8b] font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'amenities' ? 'text-[#087e8b]' : ''
              }`}
            >
              <span>Amenities ({bus.amenities.length})</span>
            </button>

            <button
              type="button"
              onClick={() => toggleTab('points')}
              className={`hover:text-[#087e8b] font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'points' ? 'text-[#087e8b]' : ''
              }`}
            >
              <span>Boarding & Dropping Points</span>
            </button>

            <button
              type="button"
              onClick={() => toggleTab('policy')}
              className={`hover:text-[#087e8b] font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'policy' ? 'text-[#087e8b]' : ''
              }`}
            >
              <span>Cancellation Policy</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-400 font-medium">
            Free Cancellation available with My Bus Booking Assurance
          </div>
        </div>

        {/* Tab Detail Panel: Amenities */}
        {activeTab === 'amenities' && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Available Amenities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700">
              {bus.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-gray-200">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Detail Panel: Boarding & Dropping Points */}
        {activeTab === 'points' && (
          <div className="mt-3 rounded-xl border border-sky-200 bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50/70 p-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2 md:gap-6">
              <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/80 p-3 shadow-sm">
                <h4 className="mb-2 flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-900">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Boarding Points ({bus.from})</span>
                </h4>
                <div className="space-y-2">
                  {bus.boardingPoints.map((bp, i) => (
                    <div key={i} className="flex justify-between gap-3 rounded-lg border border-emerald-100 bg-gradient-to-r from-white to-emerald-50/70 p-2 transition-colors hover:border-emerald-200">
                      <div>
                        <div className="font-bold text-gray-800">{bp.name}</div>
                        <div className="text-[10px] text-gray-400">{bp.landmark}</div>
                      </div>
                      <span className="shrink-0 font-mono font-bold text-emerald-700">{bp.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50/80 p-3 shadow-sm">
                <h4 className="mb-2 flex items-center gap-1.5 font-bold uppercase tracking-wider text-indigo-900">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Dropping Points ({bus.to})</span>
                </h4>
                <div className="space-y-2">
                  {bus.droppingPoints.map((dp, i) => (
                    <div key={i} className="flex justify-between gap-3 rounded-lg border border-indigo-100 bg-gradient-to-r from-white to-indigo-50/70 p-2 transition-colors hover:border-indigo-200">
                      <div>
                        <div className="font-bold text-gray-800">{dp.name}</div>
                        <div className="text-[10px] text-gray-400">{dp.landmark}</div>
                      </div>
                      <span className="shrink-0 font-mono font-bold text-indigo-700">{dp.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Detail Panel: Cancellation Policy */}
        {activeTab === 'policy' && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in duration-150">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Cancellation Refund Schedule
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="pb-1.5 font-bold">Cancellation Time</th>
                    <th className="pb-1.5 font-bold">Refund Amount</th>
                    <th className="pb-1.5 font-bold">Deduction Charges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bus.cancellationPolicy.map((row, i) => (
                    <tr key={i} className="text-gray-700">
                      <td className="py-2">{row.timeWindow}</td>
                      <td className="py-2 font-bold text-emerald-600">{row.refund}</td>
                      <td className="py-2 text-gray-500">{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Expanded Interactive Seat Selection Area */}
      {showSeats && <SeatLayout bus={bus} />}

    </div>
  );
}
