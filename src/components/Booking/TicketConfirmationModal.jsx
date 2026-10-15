import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Printer, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  ShieldCheck, 
  X, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBooking } from '../../context/BookingContext';

export default function TicketConfirmationModal() {
  const { 
    confirmationModalOpen, 
    setConfirmationModalOpen, 
    confirmedBooking, 
    navigateToHome,
    setMyBookingsModalOpen
  } = useBooking();

  useEffect(() => {
    if (confirmationModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [confirmationModalOpen]);

  if (!confirmationModalOpen || !confirmedBooking) return null;

  const {
    pnr,
    ticketId,
    bus,
    seats,
    passengers,
    boardingPoint,
    droppingPoint,
    fromCity,
    toCity,
    date,
    finalAmount,
    bookingTime,
    contactInfo
  } = confirmedBooking;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/60 p-2 backdrop-blur-xs animate-in fade-in duration-200 sm:items-center sm:p-6">
      <div className="my-auto flex max-h-[95dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <button
            type="button"
            onClick={() => setConfirmationModalOpen(false)}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black font-['Montserrat']">
            Booking Confirmed!
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            Your e-Ticket and m-Ticket details have been sent to <strong>{contactInfo.email}</strong> & SMS to <strong>+91 {contactInfo.phone}</strong>
          </p>
        </div>

        {/* E-Ticket Card Layout */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4 sm:p-7 print:p-0">
          
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-white shadow-xs relative">
            
            {/* Ticket Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <img src="/brand-logo.png" alt="" className="h-8 w-8 rounded-lg object-cover" />
                <div>
                  <span className="font-black text-[#087e8b] text-lg font-['Montserrat']">My Bus Booking</span>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Official e-Ticket</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">PNR Number</span>
                <span className="font-mono font-black text-gray-900 text-base">{pnr}</span>
              </div>
            </div>

            {/* Operator & Route */}
            <div className="py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{bus.name}</h3>
                  <p className="text-xs text-gray-500">{bus.busType}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    CONFIRMED
                  </span>
                  <div className="text-[10px] text-gray-400 mt-1">Ticket ID: {ticketId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-gray-400 uppercase font-bold text-[10px] block">BOARDING</span>
                  <div className="font-bold text-gray-900 mt-0.5">{fromCity} • {bus.depTime}</div>
                  <div className="text-gray-500 text-[11px]">{boardingPoint.name}</div>
                  <div className="text-[10px] text-gray-400">{date}</div>
                </div>

                <div className="text-right">
                  <span className="text-gray-400 uppercase font-bold text-[10px] block">DROPPING</span>
                  <div className="font-bold text-gray-900 mt-0.5">{toCity} • {bus.arrTime}</div>
                  <div className="text-gray-500 text-[11px]">{droppingPoint.name}</div>
                  <div className="text-[10px] text-gray-400">{date}</div>
                </div>
              </div>
            </div>

            {/* Passengers & Seats */}
            <div className="py-4 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Passenger Details
              </span>
              <div className="space-y-2">
                {passengers.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-gray-50/70 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-[#087e8b] font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-800">{p.name}</span>
                      <span className="text-gray-500 text-[11px]">({p.age} yrs, {p.gender})</span>
                    </div>
                    <span className="font-mono font-bold text-[#087e8b] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      Seat {p.seatNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Conductor QR Simulation */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">TOTAL FARE PAID</span>
                <span className="text-xl font-black text-gray-900 font-mono">₹{finalAmount}</span>
                <span className="text-[10px] text-gray-400 block">Booked on {bookingTime}</span>
              </div>

              {/* QR Code Graphic */}
              <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-900 p-1 rounded flex items-center justify-center">
                  <div className="w-full h-full bg-white grid grid-cols-4 gap-0.5 p-0.5">
                    <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div><div className="bg-black"></div>
                    <div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                    <div className="bg-black"></div><div className="bg-black"></div><div className="bg-white"></div><div className="bg-white"></div>
                    <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div><div className="bg-black"></div>
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 text-left">
                  <span className="font-bold text-gray-700 block">Conductor QR</span>
                  <span>Scan to verify boarding</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 sm:px-7 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-gray-400 font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print / Save PDF</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmationModalOpen(false);
                setMyBookingsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition cursor-pointer"
            >
              My Bookings
            </button>

            <button
              type="button"
              onClick={() => {
                setConfirmationModalOpen(false);
                navigateToHome();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#087e8b] hover:bg-[#075e68] text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>Book Another Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
