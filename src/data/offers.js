export const OFFERS = [
  {
    id: 'FIRST',
    code: 'FIRST',
    title: 'Save up to ₹250 on first bus booking',
    subtitle: 'Valid on all private bus tickets across India',
    discountType: 'fixed',
    discountAmount: 150,
    minBooking: 500,
    validTill: '30 Apr',
    badge: 'NEW USER',
    bgColor: 'from-cyan-500 to-teal-800',
    icon: 'ticket'
  },
  {
    id: 'BUSSUMMER',
    code: 'BUSSUMMER',
    title: 'Flat 15% OFF on Primo Buses',
    subtitle: 'Guaranteed on-time & top-rated buses only',
    discountType: 'percent',
    discountPercent: 15,
    maxDiscount: 200,
    minBooking: 700,
    validTill: '15 May',
    badge: 'PRIMO DEAL',
    bgColor: 'from-amber-500 to-orange-600',
    icon: 'award'
  },
  {
    id: 'SUPERBUS',
    code: 'SUPERBUS',
    title: 'Get ₹200 Instant Discount',
    subtitle: 'Pay via UPI and save instantly on luxury AC coaches',
    discountType: 'fixed',
    discountAmount: 200,
    minBooking: 900,
    validTill: '31 May',
    badge: 'UPI OFFER',
    bgColor: 'from-cyan-700 to-slate-900',
    icon: 'zap'
  },
  {
    id: 'RTCDEAL',
    code: 'RTCDEAL',
    title: 'Flat 10% OFF on State RTC Buses',
    subtitle: 'Applicable on KSRTC, APSRTC, TSRTC, MSRTC',
    discountType: 'percent',
    discountPercent: 10,
    maxDiscount: 100,
    minBooking: 400,
    validTill: '25 May',
    badge: 'RTC SPECIAL',
    bgColor: 'from-emerald-600 to-teal-700',
    icon: 'shield'
  }
];
