import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent } from 'lucide-react';
import { OFFERS } from '../data/offers';

export default function PromoOffers() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#087e8b] font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Exclusive Deals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-['Montserrat']">
            TRENDING OFFERS
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Save extra on every bus booking with these verified coupon codes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-xs bg-sky-50 text-[#087e8b] font-bold px-3 py-1.5 rounded-full border border-sky-200">
            {OFFERS.length} Active Offers Today
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="group relative flex transform flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-white to-sky-50/80 p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-sky-200 hover:shadow-[0_18px_36px_rgba(8,126,139,0.16)]"
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${offer.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.07]`}
            />
            {/* Top decorative gradient bar */}
            <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${offer.bgColor} transition-all duration-300 group-hover:h-1.5`} />

            <div className="relative">
              {/* Badge & Expiry */}
              <div className="flex items-center justify-between mb-3">
                <span className={`rounded-md border border-transparent bg-gradient-to-r ${offer.bgColor} px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm`}>
                  {offer.badge}
                </span>
                <span className="text-[11px] font-medium text-gray-400">
                  Valid till {offer.validTill}
                </span>
              </div>

              {/* Offer Title */}
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#087e8b] transition-colors duration-200 leading-snug mb-1">
                {offer.title}
              </h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                {offer.subtitle}
              </p>
            </div>

            {/* Promo Code Box & Copy */}
            <div className="relative mt-2 flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-sky-100 bg-white/80 px-3 py-1.5 shadow-sm">
                <Tag className="w-3.5 h-3.5 text-[#087e8b]" />
                <span className="font-mono font-bold text-xs text-gray-800 tracking-wider">
                  {offer.code}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(offer.code)}
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  copiedCode === offer.code
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : `bg-gradient-to-r ${offer.bgColor} text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md`
                }`}
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
