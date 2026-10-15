import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Tag, 
  CreditCard, 
  Smartphone, 
  Landmark, 
  Check, 
  ArrowRight, 
  Lock, 
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { OFFERS } from '../../data/offers';

export default function CheckoutModal() {
  const { checkoutModalOpen, activeBookingData } = useBooking();

  if (!checkoutModalOpen || !activeBookingData) return null;

  return <CheckoutForm bookingData={activeBookingData} />;
}

function CheckoutForm({ bookingData }) {
  const {
    setCheckoutModalOpen,
    completeBooking,
    isLoggedIn,
    setLoginModalOpen,
    pendingCouponCode,
    setPendingCouponCode,
    promptLoginForCoupon
  } = useBooking();
  const { bus, seats, boardingPoint, droppingPoint, fromCity, toCity, date } = bookingData;

  // Passenger state per seat
  const [passengers, setPassengers] = useState(() => 
    bookingData.passengers || seats.map(seat => ({
      seatNumber: seat.seatNumber,
      name: '',
      age: '',
      gender: ''
    }))
  );

  const [contactInfo, setContactInfo] = useState(bookingData.contactInfo || { email: '', phone: '' });

  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('user@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial calculations
  const baseFareTotal = seats.reduce((sum, s) => sum + s.price, 0);
  const insuranceCost = bookingData.addOns?.travelInsurance ? seats.length * 15 : 0;
  const addOnLineItems = [
    { id: 'freeCancellation', label: 'Free Cancellation', price: 230 },
    { id: 'tripGuarantee', label: 'Trip Guarantee', price: 26 },
    { id: 'travelInsurance', label: 'Travel Insurance', price: 15 }
  ].filter(item => bookingData.addOns?.[item.id])
    .map(item => ({ ...item, total: item.price * seats.length }));
  const addOnsCost = addOnLineItems.reduce((total, item) => total + item.total, 0);
  const gstTax = Math.round(baseFareTotal * 0.05);

  // Coupons must NOT be applicable before login
  const activeCoupon = isLoggedIn ? (appliedCoupon || pendingCouponCode) : null;

  // Discount calculation
  let discountAmount = 0;
  if (activeCoupon === 'FIRST') {
    discountAmount = 150;
  } else if (activeCoupon === 'BUSSUMMER') {
    discountAmount = Math.round(baseFareTotal * 0.15);
  } else if (activeCoupon === 'SUPERBUS') {
    discountAmount = 200;
  } else if (activeCoupon === 'RTCDEAL') {
    discountAmount = 100;
  }

  const finalAmount = Math.max(0, baseFareTotal + gstTax + addOnsCost - (isLoggedIn ? discountAmount : 0));

  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const found = OFFERS.find(o => o.code === code);
    if (!found) {
      setCouponError('Invalid coupon code. Try FIRST, BUSSUMMER, or SUPERBUS');
      return;
    }

    if (!isLoggedIn) {
      setCouponInput(code);
      setCouponError(`Coupons cannot be applied before login. Please log in to apply ${code}.`);
      setPendingCouponCode(code);
      promptLoginForCoupon(code);
      return;
    }

    setAppliedCoupon(code);
    setPendingCouponCode(code);
    setCouponError('');
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPendingCouponCode(null);
    setCouponError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        alert(`Please enter name for passenger in seat ${passengers[i].seatNumber}`);
        return;
      }
      if (!passengers[i].age.trim() || isNaN(passengers[i].age)) {
        alert(`Please enter a valid age for passenger in seat ${passengers[i].seatNumber}`);
        return;
      }
    }

    if (!contactInfo.email.trim() || !contactInfo.phone.trim()) {
      alert('Please fill in your contact email and phone number.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment transaction delay
    setTimeout(() => {
      setIsProcessing(false);
      completeBooking({
        bus,
        seats,
        passengers,
        boardingPoint,
        droppingPoint,
        fromCity,
        toCity,
        date,
        baseFare: baseFareTotal,
        gstTax,
        insuranceCost,
        discountAmount: isLoggedIn ? discountAmount : 0,
        finalAmount,
        appliedCoupon: isLoggedIn ? activeCoupon : null,
        paymentMethod,
        contactInfo,
        stateOfResidence: bookingData.stateOfResidence,
        whatsappUpdates: bookingData.whatsappUpdates,
        addOns: bookingData.addOns,
        addOnsCost,
        gstNumber: bookingData.gstNumber
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-xs animate-in fade-in duration-200 sm:items-center sm:p-6">
      <div className="my-auto flex h-[92dvh] max-h-[92vh] min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl sm:h-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#087e8b] to-[#075e68] text-white p-5 sm:px-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-100 text-xs font-semibold uppercase tracking-wider">
              <span>Secure Booking</span>
              <span>•</span>
              <span>{fromCity} → {toCity}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Montserrat'] tracking-tight">
              Passenger & Payment Details
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setCheckoutModalOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COUPON CODES SECTION */}
        <section className="mx-3 mt-3 shrink-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-card sm:mx-6 sm:mt-4 sm:p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
            <Tag className="h-4 w-4 text-emerald-700" />
            You may be eligible for an offer
          </h3>
          {!isLoggedIn ? (
            <div className="mb-3 rounded-xl bg-amber-50/80 border border-amber-200 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">Guest Checkout</p>
                  <p className="mt-0.5 text-xs text-gray-600">
                    You can book without logging in. However, coupons cannot be applied before login.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (couponInput.trim()) {
                      setPendingCouponCode(couponInput.trim().toUpperCase());
                    }
                    setLoginModalOpen(true);
                  }}
                  className="shrink-0 rounded-xl bg-[#087e8b] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#075e68] cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm">
              <p className="font-semibold text-gray-900">
                {activeCoupon ? `Coupon ${activeCoupon} is applied` : 'Offers are available for your account'}
              </p>
              <p className="mt-1 text-gray-600">
                {activeCoupon ? `Your current savings: ₹${discountAmount}` : 'Add a coupon code below to check your savings.'}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Enter Promo Code (e.g. FIRST)"
              className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-mono uppercase focus:border-[#087e8b] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleApplyCoupon()}
              className="rounded-xl bg-gray-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gray-900 cursor-pointer"
            >
              Apply
            </button>
          </div>

          {couponError && (
            <div className={`mt-2 flex items-center justify-between rounded-xl p-2.5 text-xs border ${
              !isLoggedIn
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span>{couponError}</span>
              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={() => promptLoginForCoupon(couponInput.trim().toUpperCase() || 'FIRST')}
                  className="ml-2 font-bold text-[#087e8b] underline hover:text-[#075e68] cursor-pointer shrink-0"
                >
                  Log in now
                </button>
              )}
            </div>
          )}

          {activeCoupon && (
            <div className="mt-2.5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Coupon <strong>{activeCoupon}</strong> applied! You saved ₹{discountAmount}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="cursor-pointer text-xs font-bold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {['FIRST', 'BUSSUMMER', 'SUPERBUS'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => handleApplyCoupon(c)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-mono font-bold text-gray-700 transition hover:bg-sky-50 hover:text-[#087e8b]"
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Modal Scrollable Body */}
        <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-4 sm:p-8">
          
          {/* Trip Recap Card */}
          <div className="bg-sky-50/60 rounded-2xl p-4 sm:p-5 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-base">{bus.name}</span>
                <span className="text-xs bg-white text-[#087e8b] font-bold px-2 py-0.5 rounded border border-sky-200">
                  {bus.busType}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span><strong>Date:</strong> {date}</span>
                <span><strong>Departure:</strong> {bus.depTime} ({boardingPoint.name})</span>
                <span><strong>Arrival:</strong> {bus.arrTime} ({droppingPoint.name})</span>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-sky-200">
              <span className="text-xs text-gray-500 font-medium">Selected Seats:</span>
              <div className="flex items-center sm:justify-end gap-1 mt-0.5">
                {seats.map(s => (
                  <span key={s.id} className="text-xs font-mono font-bold bg-[#087e8b] text-white px-2 py-0.5 rounded">
                    {s.seatNumber}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form id="checkoutForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* PASSENGERS DETAILS SECTION */}
            <div className="hidden">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#087e8b]" />
                <span>Passenger Information ({passengers.length})</span>
              </h3>

              <div className="space-y-4">
                {passengers.map((p, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">
                        Passenger {idx + 1} • <span className="font-mono text-[#087e8b]">Seat {p.seatNumber}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Name */}
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={p.name}
                          onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-[#087e8b]"
                        />
                      </div>

                      {/* Age */}
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="110"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                          placeholder="Age"
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-[#087e8b]"
                        />
                      </div>

                      {/* Gender */}
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                          Gender
                        </label>
                        <select
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-[#087e8b]"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTACT DETAILS SECTION */}
            <div className="hidden">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#087e8b]" />
                <span>Contact Details (For ticket SMS & WhatsApp)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-[#087e8b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-3 py-2 text-sm text-gray-800 font-medium focus:outline-none focus:border-[#087e8b]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MY BUS BOOKING ASSURANCE CHECKBOX */}
            <div className="hidden">
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="assurance"
                checked={insuranceSelected}
                onChange={(e) => setInsuranceSelected(e.target.checked)}
                className="mt-1 text-emerald-600 focus:ring-emerald-500 rounded w-4 h-4"
              />
              <label htmlFor="assurance" className="text-xs cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">Add My Bus Booking Travel Assurance</span>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">
                    ₹29 / person
                  </span>
                </div>
                <p className="text-gray-600 mt-0.5">
                  Get 100% refund on trip cancellation + emergency medical hospitalization coverage up to ₹5,00,000.
                </p>
              </label>
              </div>
            </div>

            {/* PAYMENT OPTIONS */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Payment Mode</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Landmark }
                ].map(mode => {
                  const Icon = mode.icon;
                  const isSelected = paymentMethod === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMethod(mode.id)}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? 'border-[#087e8b] bg-sky-50 text-[#087e8b] font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span className="text-xs">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'upi' && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  <label className="block font-bold text-gray-700 mb-1">Enter UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobilenumber@upi or name@okaxis"
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#087e8b]"
                  />
                  <div className="flex items-center gap-2 text-gray-400 mt-2 text-[11px]">
                    <span>Supported: Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8829"
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Expiry Date</label>
                      <input type="text" defaultValue="08/28" className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">CVV</label>
                      <input type="password" defaultValue="•••" className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                  <label className="block font-bold text-gray-700 mb-1">Select Bank</label>
                  <select className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-sm">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

          </form>

        </div>

        {/* Modal Footer: Fare Breakdown & Pay Button */}
        <div className="bg-gray-50 border-t border-gray-200 p-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Base: ₹{baseFareTotal}</span>
              <span>+ GST: ₹{gstTax}</span>
              {addOnLineItems.map(item => (
                <span key={item.id}>+ {item.label}: ₹{item.total}</span>
              ))}
              {discountAmount > 0 && <span className="text-emerald-600 font-bold">- Disc: ₹{discountAmount}</span>}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs font-bold text-gray-500 uppercase">Total Amount:</span>
              <span className="text-2xl font-black text-gray-900 font-mono">₹{finalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkoutForm"
            disabled={isProcessing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
              isProcessing
                ? 'bg-gray-400 text-white cursor-wait'
                : 'bg-[#087e8b] hover:bg-[#075e68] text-white shadow-sky-500/30'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>PROCESSING PAYMENT...</span>
              </>
            ) : (
              <>
                <span>PAY & CONFIRM TICKET (₹{finalAmount})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
