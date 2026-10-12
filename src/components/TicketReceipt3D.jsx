import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  RotateCw, 
  Download, 
  Share2, 
  CheckCircle2, 
  QrCode, 
  MapPin, 
  Calendar, 
  Clock, 
  Film, 
  Wifi, 
  Car,
  Armchair,
  Check,
  Home
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";

export default function TicketReceipt3D({
  booking,
  onGoHome,
  onBookAnother,
  onClose
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    cinemaAudio.playSuccessChime();
    
    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e11d48", "#06b6d4", "#f59e0b", "#a855f7", "#ffffff"]
      });
    } catch {
      // fallback
    }
  }, []);

  const handleFlip = () => {
    cinemaAudio.playHoverTick();
    setIsFlipped(!isFlipped);
  };

  const handleDownload = () => {
    cinemaAudio.playHoverTick();
    window.print();
  };

  const handleShareTicket = async () => {
    cinemaAudio.playHoverTick();

    const title = booking.movie?.title || "Cineverse Ticket";
    const date = booking.date || "Upcoming";
    const time = booking.time?.time || "";
    const venue = booking.theater?.name || "";
    const seats = Array.isArray(booking.seats)
      ? booking.seats.map((s) => (typeof s === "string" ? s : s?.id || s)).join(", ")
      : "";

    const shareText = `🎟️ Cineverse Ticket Pass\n🎬 ${title}\n📅 ${date} at ${time}\n📍 ${venue}\n💺 Seats: ${seats}\n🔖 Booking ID: ${booking.bookingId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cineverse Ticket: ${title}`,
          text: shareText,
          url: window.location.href
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    // Fallback: Copy share details to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch {
      // Alert fallback
      alert(`Ticket Details:\n\n${shareText}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Top Congratulation Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Booking Confirmed & Ready
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Your 3D Digital Cinema Pass
        </h2>
        <p className="text-xs text-slate-400">
          Booking Ref: <strong className="font-mono text-cyan-400">{booking.bookingId}</strong> • Tap ticket or flip button to inspect back
        </p>
      </div>

      {/* 3D Holographic Flip Ticket Card Container */}
      <div 
        className="ticket-container w-full min-h-125 flex items-center justify-center p-2"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        <div
          onClick={handleFlip}
          className={`ticket-card relative w-full max-w-lg min-h-120 rounded-3xl cursor-pointer ${
            isFlipped ? "ticket-flipped" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "geometricPrecision"
          }}
        >
          {/* ==================== FRONT OF TICKET ==================== */}
          <div 
            className="ticket-face absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between bg-linear-to-b from-[#131929] via-[#0d121f] to-[#090d16] text-left"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translate3d(0, 0, 1px)",
              WebkitTransform: "translate3d(0, 0, 1px)",
              WebkitFontSmoothing: "subpixel-antialiased",
              textRendering: "geometricPrecision"
            }}
          >
            
            {/* Top 4K Movie Banner */}
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src={booking.movie?.backdrop4k || booking.movie?.backdrop || booking.movie?.poster}
                alt={booking.movie?.title}
                className="w-full h-full object-cover filter brightness-75"
                onError={(e) => {
                  e.target.src = booking.movie?.posterFallback || booking.movie?.poster;
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0e1320] via-black/40 to-transparent" />
              
              {/* Badge & Technology */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-rose-600 text-white shadow-lg">
                  {booking.time?.format || (booking.isEventPass ? "LIVE PASS" : "IMAX 3D Laser")}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40">
                  ★ {booking.isEventPass ? "OFFICIAL PASS" : "VIP PASS"}
                </span>
              </div>

              {/* Title & Tagline overlay */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl sm:text-2xl font-black text-white truncate drop-shadow-sm">
                  {booking.movie?.title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-200 font-semibold truncate">
                  {booking.movie?.tagline || booking.movie?.synopsis || "Live Event Pass"}
                </p>
              </div>
            </div>

            {/* Middle Section: Screen, Theater & Seats */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-300 block text-[11px] uppercase font-bold tracking-wider">{booking.isEventPass ? "Event Venue" : "Cinema Hall"}</span>
                  <span className="font-extrabold text-white text-sm truncate block">{booking.theater?.name}</span>
                </div>
                <div>
                  <span className="text-slate-300 block text-[11px] uppercase font-bold tracking-wider">Date & Time</span>
                  <span className="font-extrabold text-cyan-300 text-sm block">{booking.date} • {booking.time?.time}</span>
                </div>
                <div>
                  <span className="text-slate-300 block text-[11px] uppercase font-bold tracking-wider">{booking.isEventPass ? "Pass Tier" : "Screen #"}</span>
                  <span className="font-extrabold text-white text-sm block truncate">{booking.isEventPass ? (booking.theater?.screenType || "Live Arena") : "Hall 01 (Grand Dome)"}</span>
                </div>
                <div>
                  <span className="text-slate-300 block text-[11px] uppercase font-bold tracking-wider">{booking.isEventPass ? "Pass Holder" : "Ticket Holder"}</span>
                  <span className="font-extrabold text-white text-sm block truncate">{booking.customer?.name || "Guest"}</span>
                </div>
              </div>

              {/* Reserved Seats List */}
              <div className="p-3 rounded-xl bg-slate-800/90 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Armchair className="w-4 h-4 text-rose-400" />
                  <span className="text-xs text-white font-bold">{booking.isEventPass ? "Pass Codes:" : "Seats Reserved:"}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {booking.seats.map((s, idx) => (
                    <span 
                      key={s?.id || (typeof s === "string" ? s : idx)} 
                      className="px-2.5 py-1 rounded-md bg-rose-500/30 text-white font-mono font-black text-xs border border-rose-400/50 shadow-xs"
                    >
                      {s?.id || s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="font-bold text-slate-200 text-xs sm:text-sm">Total Paid</span>
                <span className="font-black text-emerald-400 text-sm sm:text-base">
                  {formatCurrencyINR(booking.totalAmount)}
                </span>
              </div>
            </div>

            {/* Bottom Section: SVG QR Code & Barcode Stub */}
            <div className="p-5 pt-3 bg-black/50 border-t border-dashed border-white/20 flex items-center justify-between">
              
              {/* Left Barcode & Ref */}
              <div className="space-y-1">
                <p className="text-xs text-slate-300 uppercase font-mono font-semibold">
                  REF: <strong className="text-white font-black">{booking.bookingId}</strong>
                </p>
                {/* Simulated High-Res Barcode */}
                <div className="flex items-center gap-0.5 h-7">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full bg-slate-300 ${
                        i % 5 === 0 ? "w-1" : i % 3 === 0 ? "w-0.5" : "w-px"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-300 font-mono tracking-widest font-semibold">
                  *SCAN AT TURNSTILE 04*
                </p>
              </div>

              {/* Right: SVG QR Code */}
              <div className="w-16 h-16 p-1 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="30" height="30" fill="black" />
                  <rect x="16" y="16" width="18" height="18" fill="white" />
                  <rect x="20" y="20" width="10" height="10" fill="black" />

                  <rect x="60" y="10" width="30" height="30" fill="black" />
                  <rect x="66" y="16" width="18" height="18" fill="white" />
                  <rect x="70" y="20" width="10" height="10" fill="black" />

                  <rect x="10" y="60" width="30" height="30" fill="black" />
                  <rect x="16" y="66" width="18" height="18" fill="white" />
                  <rect x="20" y="70" width="10" height="10" fill="black" />

                  {/* Internal matrix dots */}
                  <rect x="48" y="15" width="6" height="12" fill="black" />
                  <rect x="48" y="35" width="12" height="6" fill="black" />
                  <rect x="48" y="55" width="8" height="8" fill="black" />
                  <rect x="65" y="50" width="12" height="12" fill="black" />
                  <rect x="65" y="75" width="20" height="8" fill="black" />
                  <rect x="48" y="75" width="8" height="15" fill="black" />
                </svg>
              </div>

            </div>

            {/* Tap instruction */}
            <div className="text-center py-2 text-xs text-cyan-300 font-semibold font-mono tracking-wide flex items-center justify-center gap-1.5 bg-black/30">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>[ Tap Ticket to Flip & View Privileges ]</span>
            </div>

          </div>

          {/* ==================== BACK OF TICKET ==================== */}
          <div 
            className="ticket-face ticket-face-back absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between bg-linear-to-b from-[#131929] via-[#0d121f] to-[#090d16] p-6 text-left"
            style={{ 
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translate3d(0, 0, 1px)",
              WebkitTransform: "rotateY(180deg) translate3d(0, 0, 1px)",
              WebkitFontSmoothing: "subpixel-antialiased",
              textRendering: "geometricPrecision"
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-rose-500" />
                  <h4 className="font-extrabold text-white text-base sm:text-lg">
                    {booking.isEventPass ? "Arena Pass Privileges" : "Cineverse VIP Privileges"}
                  </h4>
                </div>
                <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {booking.isEventPass ? "VIP Gate Fast-Track" : "Hall 01 Entrance"}
                </span>
              </div>

              {/* Highlights */}
              <div className="mt-4 space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block text-sm">Dolby Atmos & 70mm Calibration</strong>
                    <span className="text-slate-200 text-xs block leading-relaxed">Your selected seats are audio-timed with full sub-harmonic transducer support.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block text-sm">Complimentary Valet Parking</strong>
                    <span className="text-slate-200 text-xs block leading-relaxed">Show this pass at Gate 2 for 4 hours of validated premium parking.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Wifi className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-bold block text-sm">High-Speed VIP Wi-Fi</strong>
                    <span className="text-slate-200 text-xs block leading-relaxed">SSID: <code className="text-cyan-300 font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-white/10">CINEVERSE-5G</code> • Code: <code className="text-cyan-300 font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-white/10">IMAX-ULTRA</code></span>
                  </div>
                </div>
              </div>

              {/* Concessions Summary if purchased */}
              {booking.concessions && Object.keys(booking.concessions).length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-slate-800/90 border border-white/15">
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Pre-Ordered Concessions (Express Counter 3):
                  </p>
                  <ul className="text-xs text-slate-200 space-y-1">
                    {Object.values(booking.concessions).map((c, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="font-semibold">{c.count}x {c.item.name}</span>
                        <span className="font-mono text-emerald-400 font-bold">{formatCurrencyINR(c.count * c.item.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Back Footer */}
            <div className="pt-3 border-t border-white/10 text-center space-y-2">
              <p className="text-xs text-slate-300 font-medium">
                Doors open 25 minutes prior to screening. 3D glasses provided at entrance.
              </p>
              <div className="text-xs text-cyan-300 font-semibold font-mono tracking-wide flex items-center justify-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>[ Tap anywhere to flip back to pass ]</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Action Controls for Ticket */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handleFlip}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RotateCw className="w-4 h-4 text-cyan-400" />
          Flip Ticket (3D)
        </button>

        <button
          onClick={handleDownload}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4 text-rose-400" />
          Print / Save PDF
        </button>

        <button
          onClick={handleShareTicket}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
            shareSuccess
              ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20"
              : "bg-slate-800 hover:bg-slate-700 text-white border-white/10"
          }`}
        >
          {shareSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Ticket Copied & Shared!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share Ticket</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            cinemaAudio.playHoverTick();
            if (onGoHome) {
              onGoHome();
            } else if (onBookAnother) {
              onBookAnother();
            } else if (onClose) {
              onClose();
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-extrabold shadow-lg shadow-rose-600/30 cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>Go Back Home</span>
        </button>
      </div>

    </div>
  );
}
