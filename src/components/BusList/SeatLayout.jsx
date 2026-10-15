import React, { useState } from 'react';
import { ArrowRight, MapPin, X } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function SeatLayout({ bus }) {
  const { 
    selectedBusId, 
    selectedSeats, 
    toggleSeat, 
    proceedToCheckout 
  } = useBooking();

  const [activeDeck, setActiveDeck] = useState('lower'); // 'lower' | 'upper'

  const isCurrentBusSelected = selectedBusId === bus.id;
  const currentBusSeats = isCurrentBusSelected ? selectedSeats : [];

  const lowerSeats = bus.seatMap.lowerDeck;
  const upperSeats = bus.seatMap.upperDeck || [];

  const totalAmount = currentBusSeats.reduce((sum, s) => sum + s.price, 0);

  // Helper to render an individual seat or sleeper berth
  const renderSeatItem = (seat) => {
    const isSelected = currentBusSeats.some(s => s.id === seat.id);
    const isBooked = seat.status === 'booked';
    const isFemale = seat.status === 'female_booked';
    const isSleeper = seat.type === 'sleeper';

    let seatClasses = 'relative flex flex-col items-center justify-center transition-all duration-150 cursor-pointer select-none rounded-lg font-mono text-xs font-bold border-2 ';
    
    if (isSelected) {
      seatClasses += 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105';
    } else if (isFemale) {
      seatClasses += 'bg-pink-50 border-pink-300 text-pink-700 cursor-not-allowed opacity-90';
    } else if (isBooked) {
      seatClasses += 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-75';
    } else {
      seatClasses += 'bg-gradient-to-br from-white via-sky-50 to-cyan-100/80 border-sky-200 hover:-translate-y-0.5 hover:scale-105 hover:border-[#087e8b] hover:from-cyan-100 hover:via-sky-100 hover:to-indigo-100 hover:text-[#075e68] hover:shadow-md hover:shadow-sky-200/70 text-gray-700 shadow-sm';
    }

    const berthDimension = isSleeper 
      ? 'w-16 sm:w-20 h-10 sm:h-12' 
      : 'w-10 sm:w-11 h-10 sm:h-11';

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked || isFemale}
        onClick={() => toggleSeat(bus, seat)}
        className={`${seatClasses} ${berthDimension}`}
        title={`${seat.seatNumber} - ₹${seat.price} (${seat.status})`}
      >
        {/* Sleeper pillow motif */}
        {isSleeper && (
          <div className={`absolute left-1 top-1.5 bottom-1.5 w-1.5 rounded-sm ${isSelected ? 'bg-white/40' : 'bg-gray-200'}`} />
        )}
        
        <span className="text-[11px] leading-tight">{seat.seatNumber}</span>
        <span className="text-[9px] font-sans font-normal opacity-80">₹{seat.price}</span>

        {isFemale && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-pink-500 text-white rounded-full text-[8px] flex items-center justify-center font-sans font-bold">
            F
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="rounded-b-2xl border-t border-sky-200 bg-gradient-to-br from-cyan-100/70 via-sky-50 to-indigo-100/60 p-4 animate-in fade-in duration-200 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / CENTER: SEAT MAP LAYOUT */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-white via-white to-cyan-50 p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-sky-100 lg:col-span-7">
          
          {/* Deck Switcher & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-100 via-cyan-50 to-indigo-50 p-1">
              <button
                type="button"
                onClick={() => setActiveDeck('lower')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeDeck === 'lower'
                    ? 'bg-gradient-to-r from-[#087e8b] to-[#164e63] text-white shadow-md shadow-sky-500/20'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Lower Deck ({lowerSeats.filter(s => s.status === 'available').length} Avail)
              </button>
              {upperSeats.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveDeck('upper')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeDeck === 'upper'
                      ? 'bg-gradient-to-r from-[#087e8b] to-[#164e63] text-white shadow-md shadow-sky-500/20'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Upper Deck ({upperSeats.filter(s => s.status === 'available').length} Avail)
                </button>
              )}
            </div>

            {/* Seat Types Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 border-2 border-gray-300 rounded bg-white"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded border-emerald-600"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-pink-100 border border-pink-300 rounded"></div>
                <span>Ladies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-gray-200 rounded"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* BUS INTERIOR VISUAL CONTAINER */}
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-5 shadow-inner shadow-sky-100/80">
            
            {/* Front of bus / Steering Wheel header */}
            <div className="mb-4 flex w-full items-center justify-between border-b border-sky-100 pb-3 text-xs font-bold uppercase tracking-widest text-sky-800/60">
              <span>Front of Bus</span>
              <div className="flex items-center gap-1.5 rounded-md border border-sky-100 bg-gradient-to-r from-white to-sky-50 px-2.5 py-1 text-[#087e8b] shadow-sm">
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
                </svg>
                <span>Driver</span>
              </div>
            </div>

            {/* SEATS GRID */}
            <div className="py-2">
              {activeDeck === 'lower' ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((rowNum) => {
                    const rowSeats = lowerSeats.filter(s => s.row === rowNum);
                    const colA = rowSeats.find(s => s.col === 1);
                    const colB = rowSeats.find(s => s.col === 2);
                    const colC = rowSeats.find(s => s.col === 3);

                    return (
                      <div key={rowNum} className="flex items-center justify-center gap-4 sm:gap-6">
                        {/* Single seat on left */}
                        <div>{colA && renderSeatItem(colA)}</div>

                        {/* Gangway / Aisle */}
                        <div className="w-6 sm:w-10 text-center text-[10px] text-gray-300 font-mono select-none">
                          •••
                        </div>

                        {/* Pair on right */}
                        <div className="flex items-center gap-2">
                          {colB && renderSeatItem(colB)}
                          {colC && renderSeatItem(colC)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((rowNum) => {
                    const rowSeats = upperSeats.filter(s => s.row === rowNum);
                    const colA = rowSeats.find(s => s.col === 1);
                    const colB = rowSeats.find(s => s.col === 2);

                    return (
                      <div key={rowNum} className="flex items-center justify-center gap-6 sm:gap-10">
                        <div>{colA && renderSeatItem(colA)}</div>
                        <div className="w-8 sm:w-12 text-center text-[10px] text-gray-300 font-mono select-none">
                          •••
                        </div>
                        <div>{colB && renderSeatItem(colB)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 w-full border-t border-sky-100 pt-3 text-center text-xs font-semibold uppercase tracking-widest text-sky-800/50">
              Rear of Bus
            </div>

          </div>

          <p className="text-[11px] text-gray-400 text-center mt-3">
            Click on an available seat to select. You can select up to 6 seats.
          </p>
        </div>

        {/* RIGHT: TRIP OVERVIEW, SELECTED SEATS & FARE SUMMARY */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Journey & Operator Overview */}
            <div className="space-y-3 rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                    {bus.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{bus.busType}</p>
                </div>
                {bus.rating && (
                  <span className="shrink-0 flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-lg shadow-xs">
                    ★ {bus.rating}
                  </span>
                )}
              </div>

              {/* Schedule */}
              <div className="flex items-center justify-between rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-3 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Departure</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{bus.depTime}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-semibold">{bus.duration}</span>
                  <div className="w-16 h-0.5 bg-gray-300 relative my-1">
                    <div className="w-1.5 h-1.5 bg-[#087e8b] rounded-full absolute -top-0.5 right-0" />
                  </div>
                  <span className="text-[9px] text-[#087e8b] font-semibold uppercase">Direct</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Arrival</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{bus.arrTime}</span>
                </div>
              </div>

              {/* Next Step Notice */}
              <div className="flex items-center gap-2 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-sky-50 to-indigo-50 p-3 text-xs text-[#087e8b]">
                <MapPin className="w-4 h-4 shrink-0 text-[#087e8b]" />
                <span className="leading-tight">
                  Boarding & dropping points will be selected in the next step.
                </span>
              </div>
            </div>

            {/* Selected Seats Card */}
            <div className="space-y-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50/70 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Selected Seats ({currentBusSeats.length}/6)
                </span>
                {currentBusSeats.length > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    ₹{totalAmount}
                  </span>
                )}
              </div>

              {currentBusSeats.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentBusSeats.map(seat => (
                    <div
                      key={seat.id}
                      className="flex items-center justify-between rounded-xl border border-indigo-100 bg-gradient-to-r from-white to-indigo-50/70 p-2.5 text-xs transition hover:border-indigo-200 hover:from-indigo-50 hover:to-sky-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-gradient-to-r from-[#087e8b] to-indigo-600 px-2 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
                          {seat.seatNumber}
                        </span>
                        <span className="text-gray-700 font-medium">
                          {seat.deck === 'upper' ? 'Upper Deck' : 'Lower Deck'} · {seat.type === 'sleeper' ? 'Sleeper' : 'Seater'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 font-mono">₹{seat.price}</span>
                        <button
                          type="button"
                          onClick={() => toggleSeat(bus, seat)}
                          title={`Remove seat ${seat.seatNumber}`}
                          className="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 px-4 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-[#087e8b] flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="3" width="16" height="18" rx="3" />
                      <path d="M4 11h16M9 15h6" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-700">No seat selected</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Click on any available seat on the map to select (Max 6 seats)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FARE BREAKDOWN & CHECKOUT CTA */}
          <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-cyan-100/70 p-5 shadow-sm">
            <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Base Fare:</span>
              <span className="bg-gradient-to-r from-[#087e8b] to-indigo-600 bg-clip-text font-mono text-2xl font-black text-transparent">₹{totalAmount}</span>
            </div>

            <button
              type="button"
              disabled={currentBusSeats.length === 0}
              onClick={() => proceedToCheckout(bus)}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                currentBusSeats.length > 0
                  ? 'bg-gradient-to-r from-[#087e8b] via-teal-600 to-indigo-700 text-white shadow-sky-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{currentBusSeats.length > 0 ? 'CONTINUE TO BOOK' : 'SELECT SEATS TO CONTINUE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-2.5">
              Next step: Select Boarding & Dropping Points
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
