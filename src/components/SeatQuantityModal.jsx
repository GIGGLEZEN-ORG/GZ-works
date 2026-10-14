import React, { useState } from "react";
import { 
  Bike, 
  Scooter, 
  CarFront, 
  Car, 
  Bus,
  Sparkles,
  Check,
  ChevronRight,
  Armchair
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";

// Vehicle options mapping based on user specifications:
// 1 -> Cycle (Bike)
// 2 -> Scooty (Scooter)
// 3 -> Auto (Three-wheeler auto rickshaw)
// 4 -> Mini Car (Compact car)
// 5 -> Car (Sedan / Standard Car)
// 6 -> Large Car (SUV / Large Car / Bus)

export const SEAT_QUANTITY_OPTIONS = [
  {
    count: 1,
    label: "1 Seat",
    title: "Solo Rider",
    vehicleName: "Cycle",
    Icon: Bike,
    color: "from-emerald-500 to-teal-600",
    border: "border-emerald-500/40",
    bgGlow: "group-hover:shadow-emerald-500/20",
    desc: "Cycle"
  },
  {
    count: 2,
    label: "2 Seats",
    title: "Dynamic Duo",
    vehicleName: "Scooty",
    Icon: Scooter,
    color: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/40",
    bgGlow: "group-hover:shadow-cyan-500/20",
    desc: "Scooty"
  },
  {
    count: 3,
    label: "3 Seats",
    title: "Trio Ride",
    vehicleName: "Auto",
    // Custom auto rickshaw badge
    isAuto: true,
    color: "from-amber-500 to-orange-600",
    border: "border-amber-500/40",
    bgGlow: "group-hover:shadow-amber-500/20",
    desc: "Auto"
  },
  {
    count: 4,
    label: "4 Seats",
    title: "Quartet Cruisers",
    vehicleName: "Mini Car",
    Icon: CarFront,
    color: "from-rose-500 to-pink-600",
    border: "border-rose-500/40",
    bgGlow: "group-hover:shadow-rose-500/20",
    desc: "Mini Car"
  },
  {
    count: 5,
    label: "5 Seats",
    title: "Prime Gang",
    vehicleName: "Car",
    Icon: Car,
    color: "from-purple-500 to-indigo-600",
    border: "border-purple-500/40",
    bgGlow: "group-hover:shadow-purple-500/20",
    desc: "Car"
  },
  {
    count: 6,
    label: "6 Seats",
    title: "Squad Van",
    vehicleName: "Large Car",
    Icon: Bus,
    color: "from-fuchsia-500 to-rose-600",
    border: "border-fuchsia-500/40",
    bgGlow: "group-hover:shadow-fuchsia-500/20",
    desc: "Large Car"
  }
];

export function AutoRickshawIcon({ className = "w-7 h-7" }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Auto Rickshaw Silhouette */}
      <path d="M4 17h16" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M5 15V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v7" />
      <path d="M5 10h12" />
      <path d="M10 5v5" />
      <path d="M17 11l3 3v3h-3" />
      <circle cx="19" cy="17" r="1" />
    </svg>
  );
}

export default function SeatQuantityModal({
  isOpen,
  currentCount = 2,
  onSelectCount,
  onClose
}) {
  const [selectedCount, setSelectedCount] = useState(currentCount || 2);

  if (!isOpen) return null;

  const handleConfirm = (count) => {
    const finalCount = count || selectedCount;
    cinemaAudio.playSeatConfirm();
    onSelectCount(finalCount);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0a0f1d] p-5 sm:p-7 shadow-2xl shadow-rose-950/50 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-rose-500 to-indigo-500 rounded-t-3xl" />

        {/* Close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-1">
            <Armchair className="w-3.5 h-3.5" />
            <span>Select Ticket Quantity</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            How Many Seats?
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose your group size to automatically select the best adjacent seats in the house. You can change your seats anytime!
          </p>
        </div>

        {/* Vehicle Selection Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
          {SEAT_QUANTITY_OPTIONS.map((opt) => {
            const isSelected = selectedCount === opt.count;
            const IconComponent = opt.Icon;

            return (
              <button
                key={opt.count}
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setSelectedCount(opt.count);
                }}
                className={`group relative p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-between transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-b from-rose-600/30 to-pink-600/20 border-rose-500 shadow-xl shadow-rose-600/30 scale-105 ring-2 ring-rose-500/40"
                    : "bg-slate-900/80 hover:bg-slate-800 border-white/10 hover:border-white/25 hover:scale-102"
                }`}
              >
                {/* Seat Number Tag */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-mono mb-2 ${
                  isSelected
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/50"
                    : "bg-white/10 text-slate-300 group-hover:bg-white/20"
                }`}>
                  {opt.count}
                </div>

                {/* Vehicle Symbol */}
                <div className={`p-2 rounded-xl mb-1.5 transition-transform duration-200 group-hover:scale-110 ${
                  isSelected
                    ? "text-rose-400 bg-rose-500/20"
                    : "text-slate-400 group-hover:text-slate-200 bg-white/5"
                }`}>
                  {opt.isAuto ? (
                    <AutoRickshawIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>

                {/* Vehicle Name Label */}
                <span className={`text-[11px] sm:text-xs font-black tracking-tight ${
                  isSelected ? "text-white" : "text-slate-300"
                }`}>
                  {opt.vehicleName}
                </span>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Vehicle Info Card */}
        {(() => {
          const currentOpt = SEAT_QUANTITY_OPTIONS.find((o) => o.count === selectedCount);
          return (
            <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  {currentOpt.isAuto ? (
                    <AutoRickshawIcon className="w-5 h-5" />
                  ) : (
                    <currentOpt.Icon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{currentOpt.label} ({currentOpt.vehicleName})</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                      {currentOpt.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    We will instantly auto-reserve {currentOpt.count} contiguous prime seat{currentOpt.count > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Confirm Button */}
        <button
          type="button"
          onClick={() => handleConfirm(selectedCount)}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <span>Select Seats ({selectedCount} {selectedCount === 1 ? "Seat" : "Seats"})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
