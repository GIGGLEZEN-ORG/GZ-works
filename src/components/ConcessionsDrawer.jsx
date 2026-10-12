import React, { useState } from "react";
import { Plus, Minus, Popcorn, ShoppingBag, Sparkles, Tag, ChevronLeft, CreditCard } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { cinemaConcessions } from "../data/moviesData";
import { formatCurrencyINR } from "../utils/currency";

export default function ConcessionsDrawer({
  concessions,
  setConcessions,
  selectedSeats,
  onBackToSeats,
  onProceedToCheckout,
  promoCode,
  setPromoCode,
  discount,
  setDiscount
}) {
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const handleQuantity = (item, delta) => {
    cinemaAudio.playHoverTick();
    const current = concessions[item.id]?.count || 0;
    const nextCount = Math.max(0, current + delta);

    const updated = { ...concessions };
    if (nextCount === 0) {
      delete updated[item.id];
    } else {
      updated[item.id] = {
        item,
        count: nextCount
      };
    }
    setConcessions(updated);
  };

  const handleApplyPromo = () => {
    cinemaAudio.playHoverTick();
    const cleaned = promoInput.trim().toUpperCase();
    if (cleaned === "IMAX3D" || cleaned === "CINEVERSE") {
      setDiscount(0.2); // 20% discount
      setPromoCode(cleaned);
      setPromoMessage("✓ Promo Code Applied: 20% OFF Total Booking!");
    } else if (cleaned === "VIPPASS") {
      setDiscount(0.3); // 30% discount
      setPromoCode(cleaned);
      setPromoMessage("✓ VIP Pass Applied: 30% OFF Total Booking!");
    } else {
      setPromoMessage("✗ Invalid coupon. Try promo code: CINEVERSE");
    }
  };

  // Calculations
  const seatsTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const concessionsTotal = Object.values(concessions).reduce(
    (acc, c) => acc + c.item.price * c.count,
    0
  );
  const subtotal = seatsTotal + concessionsTotal;
  const bookingFee = 208;
  const discountAmount = subtotal * discount;
  const grandTotal = Math.max(0, subtotal + bookingFee - discountAmount);

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            cinemaAudio.playHoverTick();
            onBackToSeats();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800/80 border border-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Seat Selection
        </button>

        <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
          Step 2 of 3: Refreshments & Extras
        </span>
      </div>

      {/* Concessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cinemaConcessions.map((item) => {
          const qty = concessions[item.id]?.count || 0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl glass-panel border transition-all flex flex-col justify-between ${
                qty > 0 
                  ? "border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/20" 
                  : "border-white/10 hover:border-white/20 bg-slate-900/60"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-white/5">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {item.category} • {item.calories}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300/80 mt-3 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price & Counter */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-base font-extrabold text-white">
                  {formatCurrencyINR(item.price)}
                </span>

                <div className="flex items-center gap-2 bg-slate-800/90 rounded-xl p-1 border border-white/10">
                  <button
                    disabled={qty === 0}
                    onClick={() => handleQuantity(item, -1)}
                    className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-6 text-center text-xs font-mono font-bold text-white">
                    {qty}
                  </span>

                  <button
                    onClick={() => handleQuantity(item, 1)}
                    className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer shadow-md transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Promo Code & Order Summary Checkout Card */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Promo Code Input */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>Apply VIP Promo Code</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. CINEVERSE or VIPPASS"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-rose-500 flex-1 uppercase"
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors"
            >
              Apply
            </button>
          </div>

          {promoMessage && (
            <p className={`text-xs font-medium ${promoMessage.startsWith("✓") ? "text-emerald-400" : "text-rose-400"}`}>
              {promoMessage}
            </p>
          )}
        </div>

        {/* Right: Price Breakdown & CTA */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6 pt-4 lg:pt-0">
          <div className="space-y-1 text-xs text-slate-300 w-full sm:w-auto">
            <div className="flex justify-between gap-6">
              <span>{selectedSeats.length} Seat(s):</span>
              <strong className="text-white">{formatCurrencyINR(seatsTotal)}</strong>
            </div>
            {concessionsTotal > 0 && (
              <div className="flex justify-between gap-6">
                <span>Concessions & Gear:</span>
                <strong className="text-white">{formatCurrencyINR(concessionsTotal)}</strong>
              </div>
            )}
            <div className="flex justify-between gap-6">
              <span>IMAX Tech & Booking Fee:</span>
              <strong className="text-white">{formatCurrencyINR(bookingFee)}</strong>
            </div>
            {discount > 0 && (
              <div className="flex justify-between gap-6 text-emerald-400 font-bold">
                <span>VIP Discount ({(discount * 100).toFixed(0)}%):</span>
                <span>-{formatCurrencyINR(discountAmount)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                Total Due:
              </span>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-rose-400">
                {formatCurrencyINR(grandTotal)}
              </p>
            </div>

            <button
              onClick={() => {
                cinemaAudio.playSuccessChime();
                onProceedToCheckout(grandTotal);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-rose-600/40 cursor-pointer active:scale-95 transition-all"
            >
              <CreditCard className="w-5 h-5" />
              <span>Confirm & Pay {formatCurrencyINR(grandTotal)}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
