import React, { useState } from "react";
import { X, Ticket, Calendar, Clock, MapPin, Armchair, ChevronRight, Trash2, Eye } from "lucide-react";
import { cinemaAudio } from "../utils/soundEffects";
import { formatCurrencyINR } from "../utils/currency";

export default function MyTicketsModal({
  tickets,
  onClose,
  onInspectTicket,
  onDeleteTicket,
  onBrowseMovies
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 animate-in fade-in duration-300">
      
      {/* Outer Click dismiss */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={() => {
          cinemaAudio.playHoverTick();
          onClose();
        }} 
      />

      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/20 shadow-2xl bg-[#0a0e17] p-6 sm:p-8 text-left"
        style={{
          WebkitFontSmoothing: "subpixel-antialiased",
          textRendering: "geometricPrecision"
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500 flex items-center justify-center text-rose-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl">
                My Digital Cinema Passes
              </h3>
              <p className="text-xs text-slate-400">
                {tickets.length} {tickets.length === 1 ? "Active Reservation" : "Active Reservations"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cinemaAudio.playHoverTick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="mt-6 space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">No Tickets Booked Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Pick a 4K blockbuster from the showcase, customize your seats in the 3D amphitheater, and your digital pass will appear here.
                </p>
              </div>
              <button
                onClick={() => {
                  cinemaAudio.playHoverTick();
                  onClose();
                  onBrowseMovies();
                }}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer transition-colors"
              >
                Browse Now Showing
              </button>
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.bookingId}
                className="p-4 rounded-2xl bg-[#131926] border border-white/15 hover:border-rose-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.movie.poster}
                    alt={t.movie.title}
                    className="w-14 h-20 rounded-xl object-cover border border-white/15 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = t.movie.posterFallback;
                    }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-base">
                        {t.movie.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/25 text-rose-300 font-mono font-bold border border-rose-500/30">
                        {t.time.format}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                      <span className="flex items-center gap-1 text-cyan-300">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {t.date}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="flex items-center gap-1 text-rose-300">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        {t.time.time}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Armchair className="w-3.5 h-3.5 text-amber-400" />
                        {t.seats.map(s => s?.id || s).join(", ")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-mono font-medium">
                      Ref: <strong className="text-white font-bold">{t.bookingId}</strong> • Total: <span className="text-emerald-400 font-bold">{formatCurrencyINR(t.totalAmount || 0)}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      cinemaAudio.playHoverTick();
                      onInspectTicket(t);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Pass
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("Cancel this booking reservation?")) {
                        cinemaAudio.playHoverTick();
                        onDeleteTicket(t.bookingId);
                      }
                    }}
                    title="Cancel booking"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
