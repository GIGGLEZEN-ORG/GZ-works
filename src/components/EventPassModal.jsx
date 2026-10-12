import React, { useState } from "react";
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  CreditCard,
  Download,
  Share2
} from "lucide-react";
import confetti from "canvas-confetti";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";
import BookingRatingModal from "./BookingRatingModal";

export default function EventPassModal({
  event,
  user,
  onClose,
  onSaveBooking,
  onOpenAuth,
  onViewPass
}) {
  // Quantities for each pass tier individually
  const [tierQuantities, setTierQuantities] = useState({
    silver: 0,
    gold: 2,
    platinum: 0
  });
  const [limitWarning, setLimitWarning] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  if (!event) return null;

  const basePrice = event.price || 999;
  const MAX_ACCOUNT_PASSES = 6;
  
  const tiers = [
    {
      id: "silver",
      name: "Silver Pass",
      badge: "General",
      multiplier: 1.0,
      description: "Standard stadium & hall entry with unreserved zone seating.",
      color: "border-slate-400/40 bg-slate-900/80 text-slate-200",
      accent: "from-slate-700 to-slate-900",
      pillColor: "bg-slate-700 text-slate-200"
    },
    {
      id: "gold",
      name: "Gold VIP",
      badge: "VIP Lounge",
      multiplier: 1.5,
      description: "Elevated tier seating, express queue & complimentary drink.",
      color: "border-amber-500/50 bg-amber-950/40 text-amber-300",
      accent: "from-amber-600 to-amber-900",
      pillColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30"
    },
    {
      id: "platinum",
      name: "Platinum Fan Pit",
      badge: "Stage Front",
      multiplier: 2.2,
      description: "Stage-front pit access, exclusive lanyard & afterparty access.",
      color: "border-rose-500/50 bg-rose-950/40 text-rose-300",
      accent: "from-rose-600 to-pink-900",
      pillColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30"
    }
  ];

  const totalQuantity = Object.values(tierQuantities).reduce((acc, q) => acc + q, 0);

  const subtotal = tiers.reduce((acc, tier) => {
    const qty = tierQuantities[tier.id] || 0;
    const price = Math.round(basePrice * tier.multiplier);
    return acc + qty * price;
  }, 0);

  const bookingFee = Math.round(subtotal * 0.08); // 8% fee
  const grandTotal = subtotal + bookingFee;

  const handleUpdateQuantity = (tierId, delta) => {
    if (delta > 0 && totalQuantity >= MAX_ACCOUNT_PASSES) {
      cinemaAudio.playSeatClick(false);
      setLimitWarning("An account has a limit of 6 passes per booking.");
      return;
    }

    setLimitWarning("");
    cinemaAudio.playHoverTick();
    setTierQuantities((prev) => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [tierId]: next
      };
    });
  };

  const handleConfirmPassBooking = () => {
    cinemaAudio.playSeatConfirm();

    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (totalQuantity === 0) {
      alert("Please select at least 1 pass to continue.");
      return;
    }

    const bookingId = `EV-${Math.floor(100000 + Math.random() * 900000)}`;
    const passCodes = [];
    tiers.forEach((tier) => {
      const count = tierQuantities[tier.id] || 0;
      for (let i = 1; i <= count; i++) {
        passCodes.push(`${tier.id.toUpperCase()}-${String(i).padStart(2, "0")}`);
      }
    });

    const activeTierSummary = tiers
      .filter((t) => (tierQuantities[t.id] || 0) > 0)
      .map((t) => `${tierQuantities[t.id]}x ${t.name}`)
      .join(", ");

    const newBooking = {
      bookingId,
      isEventPass: true,
      movie: {
        id: event.id,
        title: event.title,
        poster: event.image,
        backdrop: event.image,
        backdrop4k: event.image,
        posterFallback: event.image,
        genres: [event.category || "Live Event"],
        rating: 4.9,
        director: event.artist || event.title,
        synopsis: event.subtitle || `${event.category} live tour event.`
      },
      theater: {
        id: `venue-${event.id}`,
        name: event.hall,
        location: `${event.hall}, ${event.city}`,
        screenType: `${activeTierSummary} · ${event.category}`
      },
      time: {
        time: event.time || "07:00 PM",
        format: activeTierSummary,
        price: subtotal
      },
      date: event.date,
      seats: passCodes,
      totalAmount: grandTotal,
      customer: { name: user.name, email: user.email },
      timestamp: new Date().toISOString()
    };

    setConfirmedBooking(newBooking);
    setIsConfirmed(true);

    if (onSaveBooking) {
      onSaveBooking(newBooking);
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Automatically trigger Booking Experience Rating Modal right after payment
    setTimeout(() => {
      setShowRatingModal(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 animate-in fade-in duration-300">
      
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => {
          cinemaAudio.playHoverTick();
          onClose();
        }} 
      />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-3xl border border-white/20 shadow-2xl bg-[#090d16] p-5 sm:p-7 text-left"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                Official Live Pass Booking
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                {isConfirmed ? "Booking Confirmed!" : "Select Pass Tier & Quantity"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cinemaAudio.playHoverTick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isConfirmed && confirmedBooking ? (
          /* Confirmation Screen */
          <div className="py-6 space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                You're Going to {event.title}!
              </h3>
              <p className="text-xs text-slate-400">
                Booking ID: <span className="font-mono text-amber-400 font-bold">{confirmedBooking.bookingId}</span> · E-tickets dispatched to <span className="text-white font-semibold">{user?.email}</span>
              </p>
            </div>

            {/* Pass Preview Card */}
            <div className="rounded-2xl border border-white/15 bg-linear-to-b from-slate-900/90 to-slate-950 p-5 space-y-4 shadow-2xl">
              <div className="flex items-start gap-4">
                <img
                  src={event.image}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 rounded-xl object-cover bg-slate-800 shrink-0 border border-white/10 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {confirmedBooking.theater?.screenType || "Live Pass"}
                  </span>
                  <h4 className="text-base font-extrabold text-white mt-1 truncate">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{event.date} · {event.time || "07:00 PM"}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{event.hall}, {event.city}</span>
                  </p>
                </div>
              </div>

              {/* Passes List */}
              <div className="pt-3 border-t border-dashed border-white/15 flex flex-wrap gap-2">
                {confirmedBooking.seats.map((passCode) => (
                  <div 
                    key={passCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-white/10 font-mono text-xs text-amber-300 font-bold"
                  >
                    <Ticket className="w-3.5 h-3.5 text-rose-400" />
                    <span>{passCode}</span>
                  </div>
                ))}
              </div>

              {/* Total Paid */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Amount Paid</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {formatCurrencyINR(confirmedBooking.totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  onClose();
                  if (onViewPass && confirmedBooking) {
                    onViewPass(confirmedBooking);
                  }
                }}
                className="flex-1 py-3.5 rounded-xl bg-linear-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-500/20 text-center flex items-center justify-center gap-2 active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                <span>View My Pass</span>
              </button>
            </div>
          </div>
        ) : (
          /* Selection Screen */
          <div className="py-4 space-y-6">
            
            {/* Event Summary Hero */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <img
                src={event.image}
                alt={event.title}
                referrerPolicy="no-referrer"
                className="w-16 h-20 rounded-xl object-cover bg-slate-800 shrink-0 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {event.city}
                  </span>
                  <span className="text-xs text-slate-400">
                    {event.category}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mt-1 line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-400" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {event.hall}
                  </span>
                </div>
              </div>
            </div>

            {/* 1. Select Passes & Quantities (Silver, Gold, Platinum in Row Wise format) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                <span>Select Pass Tiers & Quantities</span>
                <span className={`text-[11px] font-mono font-semibold ${
                  totalQuantity >= MAX_ACCOUNT_PASSES ? "text-rose-400" : "text-amber-400"
                }`}>
                  Total: {totalQuantity} / {MAX_ACCOUNT_PASSES} Passes Max
                </span>
              </div>

              {/* Account Limit Warning Notice */}
              {limitWarning && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="font-semibold">{limitWarning}</span>
                  <button
                    type="button"
                    onClick={() => setLimitWarning("")}
                    className="text-rose-400 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Row-wise Pass Cards */}
              <div className="flex flex-col gap-3">
                {tiers.map((tier) => {
                  const qty = tierQuantities[tier.id] || 0;
                  const price = Math.round(basePrice * tier.multiplier);
                  const isSelected = qty > 0;

                  return (
                    <div
                      key={tier.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                        isSelected
                          ? `${tier.color} ring-1 ring-amber-500/50 shadow-lg shadow-black/40`
                          : "border-white/10 bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      {/* Left: Pass Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">
                            {tier.name}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${tier.pillColor}`}>
                            {tier.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {tier.description}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5 text-xs">
                          <span className="font-mono font-black text-white text-sm">
                            {formatCurrencyINR(price)}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold uppercase">per pass</span>
                        </div>
                      </div>

                      {/* Right: Quantity Controls for this pass */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <span className="text-xs text-slate-400 font-semibold sm:hidden">
                          Quantity:
                        </span>
                        
                        <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-xl border border-white/10">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(tier.id, -1)}
                            disabled={qty <= 0}
                            aria-label={`Decrease ${tier.name} quantity`}
                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white font-black text-base flex items-center justify-center transition cursor-pointer"
                          >
                            -
                          </button>
                          
                          <span className="w-8 text-center font-mono font-black text-sm text-white">
                            {qty}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(tier.id, 1)}
                            disabled={totalQuantity >= MAX_ACCOUNT_PASSES}
                            aria-label={`Increase ${tier.name} quantity`}
                            className={`w-8 h-8 rounded-lg text-white font-black text-base flex items-center justify-center transition cursor-pointer ${
                              totalQuantity >= MAX_ACCOUNT_PASSES
                                ? "bg-slate-800/50 text-slate-500 cursor-not-allowed opacity-40"
                                : "bg-slate-800 hover:bg-slate-700"
                            }`}
                          >
                            +
                          </button>
                        </div>

                        {/* Tier Total Pill */}
                        <div className="min-w-18 text-right hidden sm:block">
                          <span className="text-xs font-mono font-bold text-amber-300 block">
                            {formatCurrencyINR(qty * price)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {qty > 0 ? `${qty} pass(es)` : "0 passes"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Breakdown Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
              {tiers.map((tier) => {
                const qty = tierQuantities[tier.id] || 0;
                if (qty === 0) return null;
                const price = Math.round(basePrice * tier.multiplier);
                return (
                  <div key={`summary-${tier.id}`} className="flex justify-between text-slate-300">
                    <span>{tier.name} ({qty} × {formatCurrencyINR(price)})</span>
                    <span className="text-white font-mono font-semibold">{formatCurrencyINR(qty * price)}</span>
                  </div>
                );
              })}
              
              {totalQuantity === 0 && (
                <div className="text-slate-400 italic text-center py-1">
                  No passes selected. Use the + button above to add passes.
                </div>
              )}

              <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                <span>Convenience Fee & GST (8%)</span>
                <span className="text-white font-mono">{formatCurrencyINR(bookingFee)}</span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                <span className="text-white">Total Amount ({totalQuantity} {totalQuantity === 1 ? "pass" : "passes"})</span>
                <span className="text-amber-400 font-extrabold text-base font-mono">
                  {formatCurrencyINR(grandTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  onClose();
                }}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPassBooking}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-amber-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Confirm & Reserve Passes ({formatCurrencyINR(grandTotal)})</span>
              </button>
            </div>

          </div>
        )}

        {/* Rating Experience Popup (Appears right after payment) */}
        {showRatingModal && confirmedBooking && (
          <BookingRatingModal
            booking={confirmedBooking}
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onSubmitRating={(ratingData) => {
              // rating submitted
            }}
          />
        )}

      </div>
    </div>
  );
}
