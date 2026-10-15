import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Do I need a physical printout of my My Bus Booking ticket?',
      a: 'No, an m-Ticket (SMS or WhatsApp confirmation) or the e-Ticket on your phone is 100% valid across all private and state RTC buses. Conductors simply scan the QR code or verify your PNR number along with a valid ID proof.'
    },
    {
      q: 'Can I cancel my bus ticket and how do I get a refund?',
      a: 'Yes, tickets can easily be cancelled through the "My Bookings" tab up to 2 hours before the scheduled bus departure. The refund amount will automatically be calculated according to the bus operator cancellation policy and returned to your original payment method within 1-2 business days.'
    },
    {
      q: 'What are Primo buses on My Bus Booking?',
      a: 'Primo buses are specially curated buses from top-rated operators that have a stellar record of on-time departures, experienced drivers, spotless clean interiors, and 4.5+ star customer ratings.'
    },
    {
      q: 'How does live bus tracking work?',
      a: 'For all buses marked with "Live Tracking", you will receive a tracking link via SMS & email 30 minutes before departure. You can view the live GPS coordinates of your bus on the map in real-time and share the link with family.'
    },
    {
      q: 'Are female passengers eligible for ladies-only reserved seats?',
      a: 'Yes! Single female travelers can reserve seats next to other female passengers. Male travelers are restricted from booking the adjacent berth or seat for maximum safety and comfort.'
    }
  ];

  return (
    <section className="border-t border-sky-100 bg-gradient-to-b from-sky-50/70 via-white to-cyan-50/50 py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087e8b] uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-['Montserrat']">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Everything you need to know about online bus booking with My Bus Booking
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-xl border bg-gradient-to-br from-white to-sky-50/60 transition-all duration-300 ${
                  isOpen
                    ? 'border-sky-200 shadow-md shadow-sky-100'
                    : 'border-gray-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md hover:shadow-sky-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-gray-800 hover:text-[#087e8b] transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180 text-[#087e8b]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
