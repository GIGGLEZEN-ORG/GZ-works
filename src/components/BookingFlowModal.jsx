import React, { useEffect, useState, useMemo } from "react";
import { X, ChevronLeft, Ticket, CheckCircle2, Calendar, Clock, MapPin, Sparkles, Ban } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { getCityTheaters } from "../data/moviesData";
import { isShowtimePast, getFirstAvailableShowtime, getLocalTodayStr } from "../utils/timeUtils";
import { saveBookedSeatsForShowtime } from "../utils/seatBookingStore";
import { formatCurrencyINR } from "../utils/currency";
import ShowtimeSelector from "./ShowtimeSelector";
import SeatPicker3D from "./SeatPicker3D";
import ConcessionsDrawer from "./ConcessionsDrawer";
import TicketReceipt3D from "./TicketReceipt3D";

export default function BookingFlowModal({
  movie,
  user,
  selectedDate,
  selectedCity = "Mumbai",
  onSelectCity,
  initialTheater = null,
  initialShowtime = null,
  initialStep = null,
  onClose,
  onSaveBooking,
  onOpenAuth,
  onGoHome
}) {
  const cityTheaters = getCityTheaters(selectedCity);
  // If an initial theater was directly provided, jump to seats; otherwise prompt location & movie theatre first!
  const [step, setStep] = useState(() => initialStep || (initialTheater ? "seats" : "theaters"));
  const [selectedTheater, setSelectedTheater] = useState(
    initialTheater || cityTheaters[0]
  );
  // Default to today's date formatted as YYYY-MM-DD
  const todayStr = useMemo(() => getLocalTodayStr(), []);
  const [bookingDate, setBookingDate] = useState(selectedDate || todayStr);

  const [selectedTime, setSelectedTime] = useState(() => {
    if (initialShowtime) return initialShowtime;
    const th = initialTheater || cityTheaters[0];
    const initialDate = selectedDate || todayStr;
    const firstAvail = getFirstAvailableShowtime(th?.showtimes || [], initialDate);
    return firstAvail || th?.showtimes?.[0];
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [concessions, setConcessions] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [ticketNotice, setTicketNotice] = useState("");

  // Generate next 7 days starting from today (today is selected by default)
  const dateOptions = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const dayName = isToday ? "Today" : isTomorrow ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
      const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const fullDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return { dayName, monthDay, fullDate, isToday };
    });
  }, []);

  // Ensure selectedTime is never a past/blocked showtime when date or theater changes
  useEffect(() => {
    if (selectedTheater?.showtimes?.length > 0) {
      const isCurrentPast = isShowtimePast(selectedTime?.time, bookingDate);
      if (isCurrentPast) {
        const firstAvailable = getFirstAvailableShowtime(selectedTheater.showtimes, bookingDate);
        if (firstAvailable) {
          setSelectedTime(firstAvailable);
        }
      }
    }
  }, [bookingDate, selectedTheater, selectedTime]);

  const allShowtimesPast = useMemo(() => {
    if (!selectedTheater?.showtimes || selectedTheater.showtimes.length === 0) return false;
    return selectedTheater.showtimes.every((st) => isShowtimePast(st.time, bookingDate));
  }, [selectedTheater, bookingDate]);

  // Sync theater if selectedCity or initialTheater changes
  useEffect(() => {
    const currentTheaters = getCityTheaters(selectedCity);
    if (initialTheater && currentTheaters.some(t => t.id === initialTheater.id)) {
      setSelectedTheater(initialTheater);
      const firstAvail = getFirstAvailableShowtime(initialTheater.showtimes, bookingDate);
      setSelectedTime(firstAvail || initialTheater.showtimes[0]);
    } else {
      setSelectedTheater(currentTheaters[0]);
      const firstAvail = getFirstAvailableShowtime(currentTheaters[0]?.showtimes || [], bookingDate);
      setSelectedTime(firstAvail || currentTheaters[0]?.showtimes[0]);
    }
  }, [selectedCity, initialTheater]);

  useEffect(() => {
    if (!ticketNotice) return undefined;
    const timeoutId = window.setTimeout(() => setTicketNotice(""), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [ticketNotice]);

  if (!movie) return null;

  const handleProceedToConcessions = () => {
    if (!selectedSeats || selectedSeats.length === 0) return;
    if (selectedSeats.length > 6) {
      alert("An account has a limit of 6 movie tickets per booking.");
      return;
    }

    if (!user) {
      if (onOpenAuth) {
        onOpenAuth(
          `Sign in or create an account to proceed to concessions & payment for "${movie.title}".`,
          () => {
            setStep("concessions");
          }
        );
      }
      return;
    }
    setStep("concessions");
  };

  const finalizeBooking = (grandTotal, activeUser) => {
    const bookingId = `CV-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentUser = activeUser || user;
    const newBooking = {
      bookingId,
      movie,
      theater: selectedTheater,
      time: selectedTime,
      date: bookingDate,
      seats: selectedSeats,
      concessions,
      totalAmount: grandTotal,
      customer: { 
        name: currentUser?.name || "Guest", 
        email: currentUser?.email || "guest@cineverse.com" 
      },
      timestamp: new Date().toISOString()
    };

    // Persist booked seats to seat booking store for this screening slot
    if (selectedSeats && selectedSeats.length > 0) {
      saveBookedSeatsForShowtime(
        movie?.id || movie?.title,
        selectedTheater?.id || selectedTheater?.name,
        bookingDate,
        selectedTime?.time,
        selectedSeats.map((s) => s.id)
      );
    }

    setConfirmedBooking(newBooking);
    onSaveBooking(newBooking);
    setTicketNotice(`Sending ticket to ${currentUser?.email || "your email"}`);
    setStep("ticket");
  };

  const handleProceedToCheckout = (grandTotal) => {
    if (!user) {
      if (onOpenAuth) {
        onOpenAuth(
          `Sign in or create an account to confirm payment of ${formatCurrencyINR(grandTotal)} for "${movie.title}".`,
          (authenticatedUser) => {
            finalizeBooking(grandTotal, authenticatedUser);
          }
        );
      }
      return;
    }
    finalizeBooking(grandTotal, user);
  };

  const handleGoHome = () => {
    onClose();
    if (onGoHome) {
      onGoHome();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 animate-in fade-in duration-300">
      
      {/* Click outside to close (except on ticket confirmation) */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => {
          if (step !== "ticket") {
            cinemaAudio.playHoverTick();
            onClose();
          }
        }} 
      />

      {/* Main Dialog Shell */}
      <div 
        className="relative w-full max-w-5xl max-h-[96vh] overflow-y-auto rounded-3xl border border-white/20 shadow-2xl bg-[#090d16] p-4 sm:p-8 text-left"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        {ticketNotice && (
          <div
            role="status"
            className="fixed left-1/2 top-5 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-400/30 bg-slate-900/95 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <Ticket className="h-4 w-4" />
            </span>
            <span>{ticketNotice}</span>
          </div>
        )}
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {step === "concessions" && (
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setStep("seats");
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Back to Seats"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {step === "seats" && (
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  setStep("theaters");
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                title="Change Location & Cinema"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div>
              <h3 className="font-extrabold text-white text-base sm:text-xl">
                {movie.title}
              </h3>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              cinemaAudio.playHoverTick();
              onClose();
            }}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Cinema & Showtime Selection (Alternate view) */}
        {step === "theaters" && (
          <div className="space-y-3">
            <ShowtimeSelector
              theaters={cityTheaters}
              selectedTheater={selectedTheater}
              setSelectedTheater={setSelectedTheater}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedDate={bookingDate}
              selectedCity={selectedCity}
              onSelectCity={onSelectCity}
              onProceedToSeats={(th, st) => {
                if (th) setSelectedTheater(th);
                if (st) setSelectedTime(st);
                cinemaAudio.playSeatConfirm();
                setStep("seats");
              }}
            />

          </div>
        )}

        {/* Step: Seat Selection with Date & Time Selection */}
        {step === "seats" && (
          <div className="space-y-5">
            {/* Unified Screening Control Center: Cinema, Date & Time Selection */}
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 bg-slate-900/75 space-y-4">
              
              {/* Cinema Auditorium Row */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Cinema Auditorium • {selectedCity}</span>
                    <h4 className="font-extrabold text-white text-sm sm:text-base">
                      {selectedTheater?.name}
                    </h4>
                  </div>
                </div>
              </div>

              {/* 1. Date Selection (Defaults to Today, User can switch) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>Select Date</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {dateOptions.map((d) => {
                    const isSelected = bookingDate === d.fullDate;
                    return (
                      <button
                        key={d.fullDate}
                        type="button"
                        onClick={() => {
                          cinemaAudio.playHoverTick();
                          setBookingDate(d.fullDate);
                          if (selectedSeats.length > 0) setSelectedSeats([]);
                        }}
                        className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-center transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-500 shadow-md shadow-rose-600/30 scale-102"
                            : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {d.isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          <span className="text-[11px] font-bold uppercase tracking-wider">{d.dayName}</span>
                        </div>
                        <div className="text-xs font-black mt-0.5">{d.monthDay}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Time Selection (User can switch showtimes, past times blocked) */}
              <div className="space-y-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Select Showtime</span>
                </div>

                {allShowtimesPast ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>All screenings for today have concluded. Select Tomorrow to choose seats.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        cinemaAudio.playHoverTick();
                        if (dateOptions[1]) setBookingDate(dateOptions[1].fullDate);
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold border border-amber-500/40 cursor-pointer"
                    >
                      View Tomorrow's Screenings →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedTheater?.showtimes?.map((st, idx) => {
                      const isPast = isShowtimePast(st.time, bookingDate);
                      const isSelected = selectedTime?.time === st.time;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isPast}
                          onClick={() => {
                            if (isPast) return;
                            cinemaAudio.playHoverTick();
                            setSelectedTime(st);
                            if (selectedSeats.length > 0) setSelectedSeats([]);
                          }}
                          title={isPast ? "This showtime has already passed for today and is unavailable." : `Select ${st.time} (${st.format})`}
                          className={`px-3.5 py-2 rounded-xl text-left transition-all border flex flex-col ${
                            isPast
                              ? "opacity-35 bg-slate-950/40 border-white/5 cursor-not-allowed text-slate-500 select-none"
                              : isSelected
                              ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-500 shadow-md shadow-rose-600/30 scale-102 cursor-pointer"
                              : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-white/10 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Clock className={`w-3 h-3 ${isPast ? "text-slate-600" : isSelected ? "text-white" : "text-rose-400"}`} />
                            <span className={`text-xs font-black tracking-tight ${isPast ? "line-through text-slate-500" : ""}`}>
                              {st.time}
                            </span>
                            {isPast && (
                              <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-rose-500/10 text-rose-400/80 border border-rose-500/20 uppercase ml-1">
                                Ended
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] opacity-75 font-medium">{st.format}</span>
                            {!isPast && st.isFillingFast && (
                              <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                                isSelected ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-300"
                              }`}>
                                Filling Fast
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* 3. Interactive 3D Seat Picker with live Date & Time */}
            <SeatPicker3D
              movie={movie}
              selectedTheater={selectedTheater}
              selectedTime={selectedTime}
              selectedDate={bookingDate}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              onProceedToConcessions={handleProceedToConcessions}
            />
          </div>
        )}

        {/* Step 2: Concessions, Merch & Voucher Checkout */}
        {step === "concessions" && (
          <ConcessionsDrawer
            concessions={concessions}
            setConcessions={setConcessions}
            selectedSeats={selectedSeats}
            onBackToSeats={() => setStep("seats")}
            onProceedToCheckout={handleProceedToCheckout}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            discount={discount}
            setDiscount={setDiscount}
          />
        )}

        {/* Step 3: Holographic 3D Ticket & Confetti Celebration */}
        {step === "ticket" && confirmedBooking && (
          <TicketReceipt3D
            booking={confirmedBooking}
            onGoHome={handleGoHome}
            onClose={onClose}
          />
        )}

      </div>
    </div>
  );
}
