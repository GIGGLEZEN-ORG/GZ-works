import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  CheckCircle2, 
  Star, 
  ThumbsUp, 
  MessageSquare,
  Flame,
  Award
} from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import confetti from "canvas-confetti";

const SATISFACTION_EMOJIS = [
  { id: "terrible", emoji: "😡", label: "Terrible", score: 1, color: "text-red-400 border-red-500/40 bg-red-950/30" },
  { id: "bad", emoji: "🙁", label: "Poor", score: 2, color: "text-orange-400 border-orange-500/40 bg-orange-950/30" },
  { id: "okay", emoji: "😐", label: "Average", score: 3, color: "text-amber-400 border-amber-500/40 bg-amber-950/30" },
  { id: "good", emoji: "😊", label: "Good", score: 4, color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/30" },
  { id: "loved", emoji: "🤩", label: "Mind-Blowing!", score: 5, color: "text-rose-400 border-rose-500/40 bg-rose-950/30" }
];

export default function BookingRatingModal({
  booking,
  isOpen = true,
  onClose,
  onSubmitRating
}) {
  const [selectedEmoji, setSelectedEmoji] = useState(SATISFACTION_EMOJIS[4]); // Default to 5-star 'Mind-Blowing!'
  const [starRating, setStarRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSelectEmoji = (item) => {
    cinemaAudio.playHoverTick();
    setSelectedEmoji(item);
    setStarRating(item.score);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    cinemaAudio.playSuccessChime();

    const reviewPayload = {
      bookingId: booking.bookingId,
      rating: starRating,
      satisfaction: selectedEmoji.label,
      emoji: selectedEmoji.emoji,
      comment: comment.trim(),
      submittedAt: new Date().toISOString()
    };

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem("cineverse_user_ratings") || "[]");
      existing.unshift(reviewPayload);
      localStorage.setItem("cineverse_user_ratings", JSON.stringify(existing.slice(0, 50)));
    } catch {
      // storage quota or ignore
    }

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#f43f5e", "#fbbf24", "#06b6d4", "#a855f7", "#ffffff"]
      });
    } catch {
      // ignore
    }

    setIsSubmitted(true);

    if (onSubmitRating) {
      onSubmitRating(reviewPayload);
    }

    setTimeout(() => {
      if (onClose) onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Background dismiss */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => {
          if (!isSubmitted) {
            cinemaAudio.playHoverTick();
            onClose();
          }
        }} 
      />

      {/* Rating Card Shell */}
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#090d16] p-6 sm:p-8 text-left shadow-[0_20px_70px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-300"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        {/* Glow ambient highlight behind card */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-r from-rose-600/30 via-amber-500/25 to-pink-600/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Close Button */}
        {!isSubmitted && (
          <button
            type="button"
            onClick={() => {
              cinemaAudio.playHoverTick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer z-10"
            aria-label="Close review popup"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isSubmitted ? (
          /* Thank You Celebration View */
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Thank You for Rating!</h3>
              <p className="text-sm text-slate-300 mt-1.5">
                Your feedback helps us deliver exceptional 4K & IMAX cinema experiences.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 max-w-xs mx-auto text-xs text-amber-300 font-semibold flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Earned +50 Cineverse VIP Reward Points!</span>
            </div>
          </div>
        ) : (
          /* Rating Form View */
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Header with Title & Cinema Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>Rate Your Booking Experience</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  #{booking.bookingId}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                How was your experience?
              </h2>
            </div>

            {/* 1. Satisfactory Emojis Rating Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Satisfactory Rating
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                {SATISFACTION_EMOJIS.map((item) => {
                  const isSelected = selectedEmoji.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectEmoji(item)}
                      className={`flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? `${item.color} border-2 scale-105 shadow-lg shadow-black/40`
                          : "border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl transition-transform hover:scale-110 select-none">
                        {item.emoji}
                      </span>
                      <span className="text-[10px] font-bold mt-1 text-center line-clamp-1">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Star Rating (1 to 5 Stars) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/10">
              <span className="text-xs font-semibold text-slate-300">
                Score: <strong className="text-amber-400 font-bold">{starRating} of 5 Stars</strong>
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoveredStar || starRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => {
                        cinemaAudio.playHoverTick();
                        setStarRating(star);
                        const match = SATISFACTION_EMOJIS.find((e) => e.score === star);
                        if (match) setSelectedEmoji(match);
                      }}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          isFilled 
                            ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                            : "text-slate-600"
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Comment Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                  <span>Comments & Suggestions</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Optional</span>
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about your booking experience..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />
            </div>

            {/* 4. Action Buttons (Submit Rating & Skip/Cancel) */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  onClose();
                }}
                className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Skip
              </button>
              
              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Rating</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
