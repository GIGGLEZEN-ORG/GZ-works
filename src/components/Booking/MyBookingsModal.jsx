import React from 'react';
import { X, Ticket, Calendar, Bus, Printer } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function MyBookingsModal() {
  const {
    myBookingsModalOpen,
    setMyBookingsModalOpen,
    myBookings,
    cancelBooking,
    navigateToHome
  } = useBooking();

  if (!myBookingsModalOpen) return null;

  const handleCancelClick = (ticketId, busName) => {
    const ok = window.confirm(`Are you sure you want to cancel your ticket (${ticketId}) for ${busName}? A 10% cancellation charge applies as per policy.`);
    if (ok) {
      cancelBooking(ticketId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-xs animate-in fade-in duration-200 sm:items-center sm:p-6">
      <div className="my-auto flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-['Montserrat'] text-xl font-bold">My Bookings</h2>
              <p className="text-xs text-gray-400">View, download, or manage your confirmed bus tickets</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close My Bookings"
            onClick={() => setMyBookingsModalOpen(false)}
            className="cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
          {myBookings.length > 0 ? (
            myBookings.map((tkt) => {
              const isCancelled = tkt.status === 'CANCELLED';
              const isConfirmed = tkt.status === 'CONFIRMED';
              return (
                <article
                  key={tkt.ticketId}
                  className={`group relative w-full min-w-0 overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                    isCancelled
                      ? 'border-gray-200 bg-gray-50 opacity-80'
                      : 'border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50/70 shadow-sm hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100'
                  }`}
                >
                  {!isCancelled && (
                    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
                  )}
                  <div className="flex min-w-0 flex-col justify-between gap-2 border-b border-emerald-100 pb-3 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="break-words text-base font-bold text-gray-900 transition-colors group-hover:text-emerald-900">{tkt.fromCity} <span className="text-emerald-600">→</span> {tkt.toCity}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          isCancelled
                            ? 'border-rose-200 bg-rose-100 text-rose-700'
                            : 'border-emerald-300 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 shadow-sm'
                        }`}>
                          {tkt.status}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">{tkt.bus.name} · {tkt.bus.busType}</div>
                    </div>
                    <div className="flex min-w-0 items-center justify-between gap-3 sm:shrink-0 sm:flex-col sm:items-end">
                      <div className="break-all text-[10px] font-bold text-gray-400 sm:text-right">PNR: {tkt.pnr}</div>
                      <div className="shrink-0 font-mono text-sm font-black text-emerald-800">₹{tkt.finalAmount}</div>
                    </div>
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-3 py-3 text-xs sm:grid-cols-3">
                    <div className="min-w-0 rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/80 p-3 transition-colors hover:border-sky-200">
                      <span className="mb-1 block text-[10px] font-bold uppercase text-sky-700">
                        <Calendar className="mr-1 inline h-3.5 w-3.5" />Journey date
                      </span>
                      <span className="font-semibold text-gray-800">{tkt.date}</span>
                      <span className="block text-[11px] text-gray-500">Departs: {tkt.bus.depTime}</span>
                    </div>
                    <div className="min-w-0 rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/80 p-3 transition-colors hover:border-emerald-200">
                      <span className="mb-1 block text-[10px] font-bold uppercase text-emerald-700">
                        <Bus className="mr-1 inline h-3.5 w-3.5" />Boarding point
                      </span>
                      <span className="font-semibold text-gray-800">{tkt.boardingPoint.name}</span>
                      <span className="block text-[10px] text-gray-400">{tkt.boardingPoint.landmark}</span>
                    </div>
                    <div className="min-w-0 rounded-xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/80 p-3 transition-colors hover:border-violet-200">
                      <span className="block text-[10px] font-bold uppercase text-violet-700">Seats ({tkt.seats.length})</span>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {tkt.seats.map((seat) => (
                          <span key={seat.id} className="rounded-md border border-violet-200 bg-gradient-to-r from-violet-100 to-indigo-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-violet-800">
                            {seat.seatNumber}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col justify-between gap-3 border-t border-emerald-100 pt-3 sm:flex-row sm:items-center">
                    <div className={`text-xs ${isCancelled ? 'font-medium text-rose-600' : 'text-[11px] font-medium text-emerald-700'}`}>
                      {isCancelled ? tkt.refundStatus : `Booked on ${tkt.bookingTime}`}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleCancelClick(tkt.ticketId, tkt.bus.name)}
                          className="cursor-pointer rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:shadow-sm"
                        >
                          Cancel Ticket
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className={`flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all hover:-translate-y-0.5 ${
                          isConfirmed
                            ? 'border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-100 text-cyan-800 hover:shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Ticket className="h-8 w-8" />
              </div>
              <h3 className="mb-1 font-['Montserrat'] text-lg font-bold text-gray-800">No tickets booked yet</h3>
              <p className="mx-auto mb-6 max-w-sm text-xs text-gray-500">
                When you book tickets on My Bus Booking, they will appear here with full ticket details, printable receipts, and live status.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMyBookingsModalOpen(false);
                  navigateToHome();
                }}
                className="cursor-pointer rounded-xl bg-[#087e8b] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#075e68]"
              >
                Book Bus Tickets Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
