import React, { useState, useMemo } from "react";
import { 
  Eye, 
  Grid, 
  Sparkles, 
  Check, 
  Info, 
  ShieldCheck, 
  Volume2, 
  ChevronRight,
  Flame,
  Armchair
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";
import { getBookedSeatsForShowtime } from "../utils/seatBookingStore";

// Layout Configuration
const ROWS = [
  { row: "A", tier: "Standard", price: 1162, seatsCount: 12, quality: "Front Row Immersion (85%)" },
  { row: "B", tier: "Standard", price: 1162, seatsCount: 12, quality: "Wide Angle Field of View (90%)" },
  { row: "C", tier: "Standard", price: 1162, seatsCount: 14, quality: "Balanced Spatial Audio (92%)" },
  { row: "D", tier: "Dolby Prime", price: 1660, seatsCount: 14, quality: "Direct Center Axis (96%)" },
  { row: "E", tier: "Dolby Prime", price: 1660, seatsCount: 14, isSweetSpot: true, quality: "★ Director's Sweet Spot (100% Audio/Visual)" },
  { row: "F", tier: "Dolby Prime", price: 1660, seatsCount: 14, quality: "Optimal Sound Stage (97%)" },
  { row: "G", tier: "VIP Recliner", price: 2324, seatsCount: 12, isVip: true, quality: "Heated Leather Recliner + Dine-in (98%)" },
  { row: "H", tier: "Couple Sofa", price: 3486, seatsCount: 6, isCouple: true, quality: "Double Plush Loveseat & Champagne Table (99%)" }
];

export default function SeatPicker3D({
  movie,
  selectedTheater,
  selectedTime,
  selectedDate,
  selectedSeats,
  setSelectedSeats,
  onProceedToConcessions
}) {
  const [viewMode, setViewMode] = useState("2d"); // "2d" | "pov"
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // All seats are selectable by default.
  // Seats become booked when a user completes a booking for this movie, theater, date, and time.
  const [bookedSeatsList, setBookedSeatsList] = useState(() => {
    return getBookedSeatsForShowtime(
      movie?.id || movie?.title,
      selectedTheater?.id || selectedTheater?.name,
      selectedDate,
      selectedTime?.time
    );
  });

  // Re-read booked seats whenever movie, theater, date, or time changes, or when updated
  React.useEffect(() => {
    const fetchBooked = () => {
      const list = getBookedSeatsForShowtime(
        movie?.id || movie?.title,
        selectedTheater?.id || selectedTheater?.name,
        selectedDate,
        selectedTime?.time
      );
      setBookedSeatsList(list);
    };

    fetchBooked();

    const handleUpdate = () => {
      fetchBooked();
    };

    window.addEventListener("cineverse_seats_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cineverse_seats_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [movie, selectedTheater, selectedDate, selectedTime]);

  const occupiedSeats = useMemo(() => new Set(bookedSeatsList), [bookedSeatsList]);

  // Toggle seat selection
  const handleSeatClick = (seatId, rowConfig, seatNum) => {
    if (occupiedSeats.has(seatId)) return;

    const exists = selectedSeats.some((s) => s.id === seatId);
    let next;

    if (exists) {
      next = selectedSeats.filter((s) => s.id !== seatId);
      cinemaAudio.playSeatClick(false);
    } else {
      if (selectedSeats.length >= 8) {
        alert("Maximum 8 seats can be reserved in one transaction.");
        return;
      }
      next = [
        ...selectedSeats,
        {
          id: seatId,
          row: rowConfig.row,
          number: seatNum,
          tier: rowConfig.tier,
          price: rowConfig.price,
          isCouple: !!rowConfig.isCouple
        }
      ];
      cinemaAudio.playSeatClick(true);
    }
    setSelectedSeats(next);
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, s) => acc + s.price, 0);
  }, [selectedSeats]);

  // Determine current simulated POV perspective based on hovered or last selected seat
  const activeFocusRow = hoveredSeat?.row || selectedSeats[selectedSeats.length - 1]?.row || "E";
  const povScale = 
    activeFocusRow === "A" ? 1.4 :
    activeFocusRow === "B" ? 1.3 :
    activeFocusRow === "C" ? 1.2 :
    activeFocusRow === "D" ? 1.1 :
    activeFocusRow === "E" ? 1.0 :
    activeFocusRow === "F" ? 0.95 :
    activeFocusRow === "G" ? 0.9 : 0.85;

  return (
    <div className="w-full space-y-6">

      {/* Main Theater Seating Stage */}
      <div className="relative w-full rounded-2xl glass-panel p-3 xs:p-4 sm:p-8 border border-white/10 overflow-hidden min-h-[500px] flex flex-col items-center justify-between">
        
        {/* Ambient Projector Light Beam Cone */}
        <div className="absolute top-0 inset-x-0 h-44 projector-beam-cone z-0 animate-beam opacity-40" />
        <div 
          className="absolute top-0 inset-x-0 h-36 projector-glow -z-10" 
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)"
          }}
        />

        {/* 3D Curved IMAX Screen */}
        <div className="w-full max-w-2xl text-center z-10 mb-8 sm:mb-12">
          <div className="relative">
            {/* Screen Arch Curve */}
            <div 
              className="w-full h-8 sm:h-11 rounded-t-[100px] border-t-4 border-white bg-gradient-to-b from-white/60 via-white/15 to-transparent flex items-center justify-center shadow-[0_15px_45px_-5px_rgba(255,255,255,0.7)]"
              style={{
                borderColor: "#ffffff",
                boxShadow: "0 15px 45px -5px rgba(255, 255, 255, 0.75), 0 0 25px 2px rgba(255, 255, 255, 0.45)"
              }}
            >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                IMAX 70MM CURVED LASER SCREEN
              </span>
            </div>

            {/* Glowing Floor Reflection */}
            <div className="w-3/4 mx-auto h-4 bg-white/25 blur-md rounded-full mt-1" />
          </div>
        </div>

        {/* POV Screen Simulator Modal / Banner when POV mode is active */}
        {viewMode === "pov" && (
          <div className="w-full max-w-xl p-4 mb-6 rounded-xl bg-slate-900/90 border border-rose-500/40 text-center z-20 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Live Seat POV Simulation: Row {activeFocusRow}
              </span>
              <span className="text-[11px] text-amber-400 font-bold">
                {ROWS.find(r => r.row === activeFocusRow)?.quality}
              </span>
            </div>
            
            {/* Simulated Cinema Screen from this Row */}
            <div className="relative h-28 bg-black rounded-lg overflow-hidden border border-white/20 flex items-center justify-center">
              <img
                src={movie?.backdrop4k}
                alt="POV Screen"
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: `scale(${povScale})` }}
              />
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              <div className="absolute bottom-2 text-[10px] text-white/90 bg-black/70 px-2 py-0.5 rounded font-mono">
                Screen Fill Angle: ~{(povScale * 42).toFixed(0)}° • Distance: {(9 - activeFocusRow.charCodeAt(0) + 65) * 4}m
              </div>
            </div>
          </div>
        )}

        {/* Seating Layout Container */}
        <div className="w-full max-w-4xl transition-all duration-300 ease-out z-10 flex justify-center">
          <div className="w-full max-w-full space-y-2 sm:space-y-3.5">
            {ROWS.map((rowConfig) => {
              const rowSeats = Array.from({ length: rowConfig.seatsCount }, (_, idx) => idx + 1);
              const showTierLabel = ["A", "D", "G", "H"].includes(rowConfig.row);
              const tierLabelStyle = rowConfig.isVip
                ? "text-amber-300"
                : rowConfig.isCouple
                  ? "text-purple-300"
                  : ["D", "E", "F"].includes(rowConfig.row)
                    ? "text-blue-300"
                    : "text-slate-300";

              return (
                <React.Fragment key={rowConfig.row}>
                {showTierLabel && (
                  <div className={`flex items-center gap-2 py-0.5 text-[9px] font-semibold sm:text-xs ${tierLabelStyle}`}>
                    <span className="flex-1 border-t border-dotted border-current opacity-40" />
                    <span className="shrink-0">
                      {rowConfig.tier} • {formatCurrencyINR(rowConfig.price)} per seat
                    </span>
                    <span className="flex-1 border-t border-dotted border-current opacity-40" />
                  </div>
                )}
                <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-4">
                  
                  {/* Row Letter Left */}
                  <span className="w-3.5 sm:w-6 text-center text-[10px] sm:text-xs font-black font-mono text-slate-300 shrink-0">
                    {rowConfig.row}
                  </span>

                  {/* Row Seats Arc */}
                  <div className="flex items-center justify-center gap-0.5 xs:gap-1 sm:gap-2">
                    {rowSeats.map((seatNum) => {
                      const seatId = `${rowConfig.row}-${seatNum}`;
                      const isOccupied = occupiedSeats.has(seatId);
                      const isSelected = selectedSeats.some((s) => s.id === seatId);

                      // Center walkway gap in middle
                      const isMiddleGap = seatNum === Math.floor(rowConfig.seatsCount / 2);

                      return (
                        <React.Fragment key={seatId}>
                          <button
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId, rowConfig, seatNum)}
                            onMouseEnter={() => {
                              cinemaAudio.playHoverTick();
                              setHoveredSeat({
                                id: seatId,
                                row: rowConfig.row,
                                number: seatNum,
                                tier: rowConfig.tier,
                                price: rowConfig.price,
                                quality: rowConfig.quality,
                                isSweetSpot: rowConfig.isSweetSpot
                              });
                            }}
                            onMouseLeave={() => setHoveredSeat(null)}
                            title={isOccupied ? `Seat ${seatId} (Booked)` : `Seat ${seatId} - ${formatCurrencyINR(rowConfig.price)}`}
                            className={`relative transition-all duration-200 transform cursor-pointer ${
                              rowConfig.isCouple 
                                ? "w-8 xs:w-10 sm:w-13 h-5 xs:h-6 sm:h-7 rounded-md" 
                                : "w-4 xs:w-5 sm:w-7 h-4 xs:h-5 sm:h-7 rounded-t-md rounded-b-xs"
                            } flex items-center justify-center text-[8px] xs:text-[9px] sm:text-[10px] font-bold ${
                              isOccupied
                                ? "bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed opacity-50"
                                : isSelected
                                ? "bg-gradient-to-t from-rose-600 to-pink-500 text-white border sm:border-2 border-white shadow-md shadow-rose-600/70 scale-110 -translate-y-0.5 z-20"
                                : ["D", "E", "F"].includes(rowConfig.row)
                                ? "bg-blue-950/80 hover:bg-blue-600/50 text-blue-300 border border-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.2)] hover:scale-105"
                                : rowConfig.isCouple
                                ? "bg-purple-950/80 hover:bg-purple-600/50 text-purple-300 border border-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.2)] hover:scale-105"
                                : rowConfig.isVip
                                ? "bg-amber-950/60 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 hover:scale-105"
                                : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-white/10 hover:border-rose-400 hover:scale-105"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3] drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                            ) : (
                              <span className={`font-black font-mono leading-none tracking-tight text-[8px] xs:text-[9px] sm:text-[11px] ${
                                isOccupied
                                  ? "text-slate-600 opacity-60"
                                  : ["D", "E", "F"].includes(rowConfig.row)
                                  ? "text-blue-200 drop-shadow-[0_0_6px_rgba(59,130,246,0.9)]"
                                  : rowConfig.isCouple
                                  ? "text-purple-200 drop-shadow-[0_0_6px_rgba(192,132,252,0.9)]"
                                  : rowConfig.isVip
                                  ? "text-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                                  : "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
                              }`}>
                                {seatNum}
                              </span>
                            )}

                            {/* Director's sweet spot subtle marker badge */}
                            {rowConfig.isSweetSpot && seatNum === 7 && !isSelected && (
                              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            )}
                          </button>

                          {/* Center aisle walkway gap */}
                          {isMiddleGap && (
                            <div className="w-1.5 xs:w-2.5 sm:w-5 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Row Letter Right */}
                  <span className="w-3.5 sm:w-6 text-center text-[10px] sm:text-xs font-black font-mono text-slate-300 shrink-0">
                    {rowConfig.row}
                  </span>

                </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Hovered Seat Tooltip Preview */}
        {hoveredSeat && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/60 text-white shadow-2xl z-30 flex items-center gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500 flex items-center justify-center font-bold font-mono text-rose-400">
              {hoveredSeat.id}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white">{hoveredSeat.tier}</span>
                <span className="text-xs font-bold text-emerald-400">{formatCurrencyINR(hoveredSeat.price)}</span>
              </div>
              <p className="text-[11px] text-cyan-300 font-medium">{hoveredSeat.quality}</p>
            </div>
          </div>
        )}

        {/* Seating Legend Bar */}
        <div className="w-full mt-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-100 font-semibold z-10">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-t-md bg-slate-800 border border-white/20" />
            <span>Available ({formatCurrencyINR(1162)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-t-md bg-blue-950 border border-blue-500 text-blue-400 text-[10px] flex items-center justify-center">★</span>
            <span className="text-blue-200">Dolby Prime ({formatCurrencyINR(1660)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-t-md bg-amber-950 border border-amber-500" />
            <span className="text-amber-200">VIP Recliner ({formatCurrencyINR(2324)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-3 rounded-md bg-purple-950 border border-purple-500" />
            <span className="text-purple-200">Couple Sofa ({formatCurrencyINR(3486)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-t-md bg-rose-600 border border-white text-white flex items-center justify-center text-[10px]">✓</span>
            <span className="text-rose-200">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-t-md bg-slate-800/80 border border-slate-600" />
            <span className="text-slate-400">Booked</span>
          </div>
        </div>

      </div>

      {/* Selected Seats Counter and Checkout Bar */}
      <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left: Selected Seats Summary */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Armchair className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-bold text-white">
              Selected Seats: {selectedSeats.length > 0 ? `${selectedSeats.length} Seat(s)` : "None selected"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {selectedSeats.length === 0 ? (
              <span className="text-xs text-slate-400">
                Tap on any available seat in the theater above to select.
              </span>
            ) : (
              selectedSeats.map((s) => (
                <span 
                  key={s.id}
                  className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1"
                >
                  {s.id} ({formatCurrencyINR(s.price)})
                  <button 
                    onClick={() => handleSeatClick(s.id, ROWS.find(r => r.row === s.row), s.number)}
                    className="hover:text-white cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Right: Subtotal and Proceed CTA */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Seats Subtotal
            </p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-rose-400">
              {formatCurrencyINR(totalPrice)}
            </p>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={() => {
              cinemaAudio.playCinemaRumble();
              onProceedToConcessions();
            }}
            className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              selectedSeats.length > 0
                ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-xl shadow-rose-600/40 active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
            }`}
          >
            <span>Concessions & Pay</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
