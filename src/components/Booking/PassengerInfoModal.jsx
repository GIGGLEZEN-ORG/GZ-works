import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Phone,
  ShieldCheck,
  Tag,
  UserRound,
  Wallet,
  X
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { OFFERS } from '../../data/offers';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

const ADD_ONS = [
  {
    id: 'freeCancellation',
    title: 'Free Cancellation',
    price: 230,
    description: 'Get a 100% refund when you cancel up to 6 hours before departure.',
    icon: '↩'
  },
  {
    id: 'tripGuarantee',
    title: 'Trip Guarantee',
    price: 26,
    description: 'Get a full refund plus ₹500 if the operator cancels the bus.',
    icon: '✓'
  },
  {
    id: 'travelInsurance',
    title: 'Travel Insurance',
    price: 15,
    description: 'Cover for baggage loss, hospitalization and other travel emergencies.',
    icon: '✚'
  }
];

const initialAddOns = {
  freeCancellation: false,
  tripGuarantee: false,
  travelInsurance: false
};

function validatePassengerInfo(form) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.contactInfo.phone || !/^\d{10}$/.test(form.contactInfo.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number.';
  }
  if (!form.contactInfo.email.trim()) {
    errors.email = 'Email is required for ticket details.';
  } else if (!emailPattern.test(form.contactInfo.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  form.passengers.forEach((passenger, index) => {
    if (passenger.name.trim().length < 2) {
      errors[`passenger-${index}-name`] = 'Enter the passenger name.';
    }
    const age = Number(passenger.age);
    if (!Number.isInteger(age) || age < 1 || age > 110) {
      errors[`passenger-${index}-age`] = 'Enter an age from 1 to 110.';
    }
    if (!['Male', 'Female'].includes(passenger.gender)) {
      errors[`passenger-${index}-gender`] = 'Select a gender.';
    }
  });

  if (form.gstEnabled && !/^[0-9A-Z]{15}$/.test(form.gstNumber.toUpperCase())) {
    errors.gstNumber = 'Enter a valid 15-character GSTIN.';
  }
  return errors;
}

function AddOnCard({ item, selected, passengerCount, onChange }) {
  return (
    <label className={`block cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
      selected ? 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm shadow-emerald-100' : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
    }`}>
      <span className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-bold text-white shadow-sm shadow-emerald-500/20">
          {item.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-gray-900">{item.title}</span>
            <span className="text-sm font-semibold text-emerald-700">₹{item.price * passengerCount} total</span>
          </span>
          <span className="mt-1 block text-sm text-gray-500">{item.description}</span>
          <span className="mt-2 block text-xs text-gray-500">₹{item.price} per passenger</span>
        </span>
        <input
          type="checkbox"
          checked={selected}
          onChange={onChange}
          aria-label={`Add ${item.title}`}
          className="mt-1 h-5 w-5 accent-[#087e8b]"
        />
      </span>
    </label>
  );
}

export default function PassengerInfoModal() {
  const {
    passengerInfoModalOpen,
    setPassengerInfoModalOpen,
    activeBookingData,
    continueToBookingLogin,
    pendingCouponCode,
    setPendingCouponCode,
    isLoggedIn,
    promptLoginForCoupon,
    setLoginModalOpen,
    userProfile
  } = useBooking();
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [passengers, setPassengers] = useState([]);
  const [stateOfResidence, setStateOfResidence] = useState('Telangana');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [addOns, setAddOns] = useState(initialAddOns);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [errors, setErrors] = useState({});

  const isCouponActive = Boolean(isLoggedIn && (couponApplied || pendingCouponCode));
  const currentCouponCode = isCouponActive ? (couponCode || pendingCouponCode || '') : couponCode;

  if (!passengerInfoModalOpen || !activeBookingData) return null;

  const { bus, seats, boardingPoint, droppingPoint, fromCity, toCity } = activeBookingData;
  const passengerRows = seats.map((seat, index) => passengers[index] || {
    seatNumber: seat.seatNumber,
    deck: seat.deck,
    name: '',
    age: '',
    gender: ''
  });
  const addOnTotal = ADD_ONS.reduce(
    (total, item) => total + (addOns[item.id] ? item.price * seats.length : 0),
    0
  );
  const fare = seats.reduce((total, seat) => total + seat.price, 0);
  const totalBeforeTax = fare + addOnTotal;

  const handleApplyCoupon = () => {
    const normalizedCode = couponCode.trim().toUpperCase();
    if (!normalizedCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (!OFFERS.some(offer => offer.code === normalizedCode)) {
      setCouponError('Enter a valid coupon code.');
      setCouponApplied(false);
      setPendingCouponCode(null);
      return;
    }

    if (!isLoggedIn) {
      setCouponApplied(false);
      setPendingCouponCode(null);
      setCouponError(`Coupons cannot be applied before login. Please log in to apply ${normalizedCode}.`);
      promptLoginForCoupon(normalizedCode);
      return;
    }

    setCouponCode(normalizedCode);
    setCouponError('');
    setCouponApplied(true);
    setPendingCouponCode(normalizedCode);
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setPendingCouponCode(null);
    setCouponError('');
  };

  const updatePassenger = (index, field, value) => {
    setPassengers(current => {
      const updated = seats.map((seat, seatIndex) => current[seatIndex] || {
        seatNumber: seat.seatNumber,
        deck: seat.deck,
        name: '',
        age: '',
        gender: ''
      });
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors(current => ({ ...current, [`passenger-${index}-${field}`]: '' }));
  };

  const handleContinue = (event) => {
    event.preventDefault();
    const form = {
      contactInfo,
      passengers: passengerRows,
      gstEnabled,
      gstNumber
    };
    const validationErrors = validatePassengerInfo(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    continueToBookingLogin({
      passengers: passengerRows,
      contactInfo: { ...contactInfo, countryCode: '+91' },
      stateOfResidence,
      whatsappUpdates,
      addOns,
      gstNumber: gstEnabled ? gstNumber.trim().toUpperCase() : ''
    });
  };

  return (
    <div className="fixed inset-0 z-[55] flex flex-col overflow-hidden bg-gradient-to-br from-cyan-50 via-[#eef7f6] to-indigo-50">
      <header className="z-10 shrink-0 border-b border-sky-100 bg-gradient-to-r from-white via-white to-sky-50 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            aria-label="Return to boarding point selection"
            onClick={() => setPassengerInfoModalOpen(false)}
            className="rounded-full p-1.5 text-gray-700 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="font-semibold text-gray-900">
            {fromCity} <ChevronRight className="mx-1 inline h-4 w-4 text-gray-400" /> {toCity}
          </p>
        </div>
        <nav aria-label="Booking progress" className="border-t border-gray-100">
          <ol className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-3 text-sm sm:gap-8">
            <li className="flex shrink-0 items-center gap-1.5 text-gray-500 sm:gap-2"><Check className="h-4 w-4 text-emerald-600" /><span className="sm:hidden">Seats</span><span className="hidden sm:inline">Select seats</span></li>
            <li className="flex shrink-0 items-center gap-1.5 text-gray-500 sm:gap-2"><Check className="h-4 w-4 text-emerald-600" /><span className="sm:hidden">Points</span><span className="hidden sm:inline">Board/Drop point</span></li>
            <li aria-current="step" className="shrink-0 border-b-2 border-[#087e8b] pb-3 -mb-[14px] font-semibold text-[#087e8b]"><span className="sm:hidden">Passenger</span><span className="hidden sm:inline">Passenger Info</span></li>
          </ol>
        </nav>
      </header>

      <main className="mx-auto grid min-h-0 w-full min-w-0 flex-1 grid-cols-1 items-start gap-5 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,1fr)] lg:py-8">
        <form id="passenger-info-form" onSubmit={handleContinue} noValidate className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50/80 p-5 shadow-card sm:p-6">
            <h1 className="bg-gradient-to-r from-[#087e8b] to-indigo-700 bg-clip-text text-xl font-bold text-transparent">Contact details</h1>
            <p className="mb-4 text-sm text-gray-500">Ticket details will be sent to</p>
            <div className="space-y-3">
              <div className="flex overflow-hidden rounded-xl border border-gray-300 focus-within:border-[#087e8b]">
                <span className="flex items-center gap-2 border-r border-sky-100 bg-gradient-to-b from-sky-50 to-cyan-50 px-3 text-sm font-semibold text-[#075e68]">
                  <span className="text-xs font-normal text-gray-500">Country Code</span> +91 (IND)
                </span>
                <div className="min-w-0 flex-1">
                  <label className="sr-only" htmlFor="passenger-phone">Phone number</label>
                  <input
                    id="passenger-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={contactInfo.phone}
                    onChange={event => {
                      setContactInfo(current => ({ ...current, phone: event.target.value.replace(/\D/g, '') }));
                      setErrors(current => ({ ...current, phone: '' }));
                    }}
                    placeholder="Phone *"
                    aria-invalid={Boolean(errors.phone)}
                    className="w-full bg-white/80 px-3 py-4 text-sm outline-none focus:bg-white"
                  />
                </div>
              </div>
              {errors.phone && <p className="text-sm text-rose-700">{errors.phone}</p>}
              <div>
                <label className="sr-only" htmlFor="passenger-email">Email address</label>
                <input
                  id="passenger-email"
                  type="email"
                  autoComplete="email"
                  value={contactInfo.email}
                  onChange={event => {
                    setContactInfo(current => ({ ...current, email: event.target.value }));
                    setErrors(current => ({ ...current, email: '' }));
                  }}
                  placeholder="Email ID *"
                  aria-invalid={Boolean(errors.email)}
                  className="w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-4 text-sm outline-none transition focus:border-[#087e8b] focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
                {errors.email && <p className="mt-1 text-sm text-rose-700">{errors.email}</p>}
              </div>
              <label className="block rounded-xl border border-gray-300 bg-white/80 px-3 py-3 transition focus-within:border-[#087e8b] focus-within:ring-2 focus-within:ring-sky-100">
                <span className="block text-xs text-gray-500">State of Residence *</span>
                <select
                  value={stateOfResidence}
                  onChange={event => setStateOfResidence(event.target.value)}
                  className="mt-1 w-full bg-transparent font-semibold text-gray-900 outline-none"
                >
                  {INDIAN_STATES.map(state => <option key={state}>{state}</option>)}
                </select>
              </label>
              <p className="-mt-2 px-3 text-xs text-gray-500">Required for GST tax invoicing</p>
              <label className="flex cursor-pointer items-center justify-between gap-3 pt-2">
                <span className="flex items-center gap-3 text-sm text-gray-800">
                  <Phone className="h-6 w-6 text-green-500" />
                  Send booking details and trip updates on WhatsApp
                </span>
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={event => setWhatsappUpdates(event.target.checked)}
                  className="h-5 w-5 accent-[#087e8b]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/70 p-5 shadow-card sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
              <Tag className="h-5 w-5 text-emerald-700" />
              You may be eligible for an offer
            </h2>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-4">
              <div>
                <p className="font-semibold text-gray-900">
                  {isLoggedIn ? 'Offers & Discounts Available' : 'Log in to apply coupons & discounts'}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {isLoggedIn
                    ? 'Apply a valid coupon code below to save on your booking.'
                    : 'Coupons cannot be applied before login. You can still book as a guest.'}
                </p>
              </div>
              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="shrink-0 rounded-xl bg-[#087e8b] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#075e68] cursor-pointer"
                >
                  Log in
                </button>
              ) : (
                <span className="shrink-0 rounded-full bg-white px-3 py-2 text-sm font-semibold text-emerald-800 border border-emerald-200">
                  {isCouponActive ? currentCouponCode : `${OFFERS.length} offers`}
                </span>
              )}
            </div>
            <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
              <span className="h-px flex-1 bg-gray-200" />
              OR
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <button
              type="button"
              aria-expanded={couponExpanded}
              onClick={() => setCouponExpanded(expanded => !expanded)}
              className="flex w-full items-center justify-between rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50/70 to-orange-50/50 px-3 py-2.5 text-left text-sm font-semibold text-amber-900 transition hover:border-amber-200 hover:from-amber-100/70"
            >
              <span className="flex items-center gap-2"><Tag className="h-4 w-4 text-gray-500" />Have a coupon code</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${couponExpanded ? 'rotate-180' : ''}`} />
            </button>
            {couponExpanded && (
              <div className="mt-3">
                <div className="flex gap-2">
                  <label className="sr-only" htmlFor="passenger-coupon-code">Coupon code</label>
                  <input
                    id="passenger-coupon-code"
                    type="text"
                    value={couponCode}
                    onChange={event => {
                      setCouponCode(event.target.value.toUpperCase());
                      setCouponApplied(false);
                      setCouponError('');
                      setPendingCouponCode(null);
                    }}
                    placeholder="Enter coupon code"
                    className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 uppercase outline-none focus:border-[#087e8b] focus:ring-2 focus:ring-sky-100"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-xl bg-gradient-to-r from-[#087e8b] to-indigo-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
                    <span>{couponError}</span>
                    {!isLoggedIn && (
                      <button
                        type="button"
                        onClick={() => promptLoginForCoupon(couponCode.trim().toUpperCase() || 'OFFER')}
                        className="ml-2 font-bold text-[#087e8b] underline hover:text-[#075e68] cursor-pointer shrink-0"
                      >
                        Log in now
                      </button>
                    )}
                  </div>
                )}
                {isCouponActive && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200">
                    <span>Coupon <strong>{currentCouponCode}</strong> applied! Will be discounted at checkout.</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="cursor-pointer text-xs font-bold text-red-600 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50/40 shadow-card">
            <div className="border-b border-indigo-100 bg-gradient-to-r from-sky-50 via-white to-indigo-50/70 p-5 sm:px-6">
              <h2 className="bg-gradient-to-r from-[#087e8b] to-indigo-700 bg-clip-text text-xl font-bold text-transparent">Passenger details</h2>
              {isLoggedIn ? (
                <p className="mt-4 rounded-full bg-emerald-50 px-4 py-2.5 text-center text-sm font-semibold text-emerald-800 border border-emerald-200">
                  ✓ Logged in as {userProfile.fullName || 'User'} · Coupons and discounts enabled
                </p>
              ) : (
                <p className="mt-4 rounded-full bg-sky-50 px-4 py-2.5 text-center text-sm font-semibold text-[#087e8b] border border-sky-100">
                  Guest Checkout · You can book tickets without logging in
                </p>
              )}
            </div>
            {passengerRows.map((passenger, index) => (
              <div key={passenger.seatNumber} className="border-b border-indigo-100/70 p-5 last:border-b-0 sm:px-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-indigo-100 text-[#087e8b] shadow-sm"><UserRound className="h-6 w-6" /></span>
                  <span>
                    <span className="block font-semibold text-gray-900">Passenger {index + 1}</span>
                    <span className="text-sm text-gray-500">
                      Seat {passenger.seatNumber}, {passenger.deck === 'upper' ? 'Upper' : 'Lower'} deck
                    </span>
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="sr-only" htmlFor={`passenger-${index}-name`}>Passenger name</label>
                    <input
                      id={`passenger-${index}-name`}
                      type="text"
                      autoComplete="name"
                      value={passenger.name}
                      onChange={event => updatePassenger(index, 'name', event.target.value)}
                      placeholder="Name *"
                      aria-invalid={Boolean(errors[`passenger-${index}-name`])}
                      className="w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-4 outline-none transition focus:border-[#087e8b] focus:ring-2 focus:ring-sky-100"
                    />
                    {errors[`passenger-${index}-name`] && <p className="mt-1 text-sm text-rose-700">{errors[`passenger-${index}-name`]}</p>}
                  </div>
                  <div>
                    <label className="sr-only" htmlFor={`passenger-${index}-age`}>Passenger age</label>
                    <input
                      id={`passenger-${index}-age`}
                      type="number"
                      min={1}
                      max={110}
                      value={passenger.age}
                      onChange={event => updatePassenger(index, 'age', event.target.value)}
                      placeholder="Age *"
                      aria-invalid={Boolean(errors[`passenger-${index}-age`])}
                      className="w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-4 outline-none transition focus:border-[#087e8b] focus:ring-2 focus:ring-sky-100"
                    />
                    {errors[`passenger-${index}-age`] && <p className="mt-1 text-sm text-rose-700">{errors[`passenger-${index}-age`]}</p>}
                  </div>
                  <fieldset>
                    <legend className="mb-2 text-sm text-gray-600">Gender <span className="text-[#087e8b]">*</span></legend>
                    <div className="grid grid-cols-2 gap-3">
                      {['Male', 'Female'].map(gender => (
                        <label key={gender} className={`flex cursor-pointer items-center justify-between rounded-full border px-4 py-3 ${
                          passenger.gender === gender ? 'border-[#087e8b] bg-gradient-to-r from-sky-50 to-indigo-50 text-[#075e68] shadow-sm' : 'border-gray-300 bg-white hover:border-sky-200'
                        }`}>
                          {gender}
                          <input
                            type="radio"
                            name={`passenger-${index}-gender`}
                            value={gender}
                            checked={passenger.gender === gender}
                            onChange={event => updatePassenger(index, 'gender', event.target.value)}
                            className="h-5 w-5 accent-[#087e8b]"
                          />
                        </label>
                      ))}
                    </div>
                    {errors[`passenger-${index}-gender`] && <p className="mt-1 text-sm text-rose-700">{errors[`passenger-${index}-gender`]}</p>}
                  </fieldset>
                </div>
              </div>
            ))}
          </section>

          {ADD_ONS.map(item => (
            <section
              key={item.id}
              className={`rounded-2xl border p-5 shadow-card sm:p-6 ${
                item.id === 'freeCancellation'
                  ? 'border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70'
                  : item.id === 'tripGuarantee'
                    ? 'border-sky-100 bg-gradient-to-br from-white to-sky-50/70'
                    : 'border-indigo-100 bg-gradient-to-br from-white to-indigo-50/70'
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                  <p className="text-sm text-gray-500">₹{item.price} per passenger</p>
                </div>
                <ShieldCheck className="h-7 w-7 text-emerald-700" />
              </div>
              {item.id === 'freeCancellation' && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl font-black text-emerald-700">100% refund</p>
                  <p className="text-sm text-gray-600">on cancellation up to 6 hours before departure</p>
                </div>
              )}
              {item.id === 'tripGuarantee' && (
                <div className="mb-4 rounded-xl bg-sky-50 p-4 text-center text-sm text-gray-700">
                  Full refund <span className="font-bold text-emerald-700">+ ₹500 extra</span> if the bus is cancelled by the operator.
                </div>
              )}
              {item.id === 'travelInsurance' && (
                <ul className="mb-4 divide-y divide-gray-100 text-sm text-gray-700">
                  <li className="py-2">Baggage loss cover <span className="float-right text-gray-500">Up to ₹5,000</span></li>
                  <li className="py-2">Accidental hospitalization <span className="float-right text-gray-500">Up to ₹75,000</span></li>
                  <li className="py-2">Accidental death/PTD/PPD <span className="float-right text-gray-500">Up to ₹6 lakh</span></li>
                </ul>
              )}
              <div className="space-y-2">
                <AddOnCard
                  item={item}
                  passengerCount={seats.length}
                  selected={addOns[item.id]}
                  onChange={() => setAddOns(current => ({ ...current, [item.id]: !current[item.id] }))}
                />
                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                  !addOns[item.id] ? 'border-gray-200 bg-white/80 hover:border-gray-300' : 'border-emerald-200 bg-emerald-50/70'
                }`}>
                  <span>Don’t add {item.title}</span>
                  <input
                    type="radio"
                    name={`addon-${item.id}`}
                    checked={!addOns[item.id]}
                    onChange={() => setAddOns(current => ({ ...current, [item.id]: false }))}
                    className="h-5 w-5 accent-[#087e8b]"
                  />
                </label>
              </div>
            </section>
          ))}

          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white via-white to-violet-50/70 p-5 shadow-card sm:p-6">
            <label className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-gray-900">
              <span>I have a GST number <span className="block text-sm font-normal text-gray-500">Optional</span></span>
              <input type="checkbox" checked={gstEnabled} onChange={event => setGstEnabled(event.target.checked)} className="h-5 w-5 accent-[#087e8b]" />
            </label>
            {gstEnabled && (
              <div className="mt-4">
                <label className="sr-only" htmlFor="gst-number">GST number</label>
                <input
                  id="gst-number"
                  type="text"
                  maxLength={15}
                  value={gstNumber}
                  onChange={event => {
                    setGstNumber(event.target.value.toUpperCase());
                    setErrors(current => ({ ...current, gstNumber: '' }));
                  }}
                  placeholder="Enter 15-character GSTIN"
                  aria-invalid={Boolean(errors.gstNumber)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none focus:border-[#087e8b]"
                />
                {errors.gstNumber && <p className="mt-1 text-sm text-rose-700">{errors.gstNumber}</p>}
              </div>
            )}
          </section>
        </form>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-4">
          <section className="rounded-2xl border border-sky-200 bg-gradient-to-br from-white via-sky-50/70 to-indigo-50/70 p-5 shadow-card sm:p-6">
            <p className="mb-4 font-bold text-gray-900">{bus.name}</p>
            <p className="mb-4 text-sm text-gray-500">{seats.length} seat{seats.length === 1 ? '' : 's'} · {bus.busType}</p>
            <div className="space-y-4 border-b border-gray-100 pb-5">
              <div className="flex gap-3">
                <span className="w-12 shrink-0 text-sm font-semibold">{boardingPoint.time}</span>
                <span><span className="block font-semibold">{boardingPoint.name}</span><span className="text-sm text-gray-500">{boardingPoint.landmark}</span></span>
              </div>
              <div className="flex gap-3">
                <span className="w-12 shrink-0 text-sm font-semibold">{droppingPoint.time}</span>
                <span><span className="block font-semibold">{droppingPoint.name}</span><span className="text-sm text-gray-500">{droppingPoint.landmark}</span></span>
              </div>
            </div>
            <div className="pt-4">
              <h2 className="font-bold text-gray-900">Seat details</h2>
              <p className="mt-1 text-sm text-gray-500">{seats.length} seat{seats.length === 1 ? '' : 's'}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {seats.map(seat => (
                  <span key={seat.id} className="rounded-lg border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1 text-sm font-medium text-emerald-800">
                    {seat.seatNumber} · {seat.deck === 'upper' ? 'Upper' : 'Lower'} deck
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="flex items-center gap-2 text-sm text-gray-600"><Wallet className="h-4 w-4" />Selected fare</span>
              <span className="font-bold text-gray-900">₹{fare}</span>
            </div>
            {ADD_ONS.filter(item => addOns[item.id]).map(item => (
              <p key={item.id} className="mt-2 flex justify-between text-sm text-gray-600">
                <span>{item.title}</span>
                <span>₹{item.price * seats.length}</span>
              </p>
            ))}
            <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 font-bold text-gray-900">
              <span>Fare + add-ons</span>
              <span>₹{totalBeforeTax}</span>
            </div>
          </section>
        </aside>
      </main>

      <div className="z-20 shrink-0 border-t border-sky-200 bg-gradient-to-r from-white via-sky-50/95 to-indigo-50/90 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(8,126,139,0.12)] backdrop-blur sm:p-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>{seats.length} seat{seats.length === 1 ? '' : 's'} · Fare ₹{fare}</span>
            {ADD_ONS.filter(item => addOns[item.id]).map(item => (
              <span key={item.id}>{item.title} ₹{item.price * seats.length}</span>
            ))}
            <strong className="text-gray-900">Subtotal ₹{totalBeforeTax}</strong>
          </div>
          <button
            type="submit"
            form="passenger-info-form"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087e8b] via-teal-600 to-indigo-700 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20"
          >
            Continue to booking <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
