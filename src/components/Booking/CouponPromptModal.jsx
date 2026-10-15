import React from 'react';
import { X, Lock, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { OFFERS } from '../../data/offers';

export default function CouponPromptModal() {
  const {
    couponPromptModalOpen,
    setCouponPromptModalOpen,
    promptCouponCode,
    setPromptCouponCode,
    setPendingCouponCode,
    setLoginModalOpen
  } = useBooking();

  if (!couponPromptModalOpen) return null;

  const matchedOffer = OFFERS.find(
    o => o.code === (promptCouponCode || '').trim().toUpperCase()
  );

  const handleLoginClick = () => {
    if (promptCouponCode) {
      setPendingCouponCode(promptCouponCode.trim().toUpperCase());
    }
    setCouponPromptModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleContinueAsGuest = () => {
    setCouponPromptModalOpen(false);
    setPromptCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#087e8b] to-[#075e68] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-100">Coupon Policy</p>
              <h2 className="text-lg font-black font-['Montserrat']">Login Required</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinueAsGuest}
            aria-label="Close modal"
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          {promptCouponCode && (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-bold text-[#087e8b]">
              <Tag className="h-4 w-4 text-[#087e8b]" />
              <span>Coupon:</span>
              <span className="font-mono tracking-wider">{promptCouponCode.toUpperCase()}</span>
            </div>
          )}

          {matchedOffer && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>{matchedOffer.title}</span>
              </div>
              <p className="mt-0.5 text-xs text-gray-600">{matchedOffer.subtitle}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-900">
              Coupons are exclusive to registered users
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Coupons cannot be applied before login. Please log in to your account to apply this coupon and claim your discount.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
            You can still complete your ticket booking without logging in as a guest.
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleLoginClick}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#087e8b] px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 hover:bg-[#075e68] transition cursor-pointer"
            >
              <span>Log In to Apply Coupon</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full rounded-xl py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              Continue Booking as Guest (Without Coupon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
