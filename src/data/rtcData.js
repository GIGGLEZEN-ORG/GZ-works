export const RTC_LIST = [
  {
    id: 'ksrtc',
    name: 'KSRTC',
    regionalName: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ರಸ್ತೆ ಸಾರಿಗೆ ನಿಗಮ',
    languageCode: 'kn-IN',
    fullName: 'Karnataka State Road Transport Corporation',
    state: 'Karnataka',
    route: { from: 'Bengaluru', to: 'Mysuru' },
    routes: [
      { from: 'Bengaluru', to: 'Mysuru', duration: '3h 15m', fare: 250, busCount: 8 },
      { from: 'Bengaluru', to: 'Mangaluru', duration: '7h 00m', fare: 620, busCount: 5 },
      { from: 'Mysuru', to: 'Bengaluru', duration: '3h 15m', fare: 250, busCount: 8 }
    ],
    concession: 'Discounts for eligible passengers',
    busCount: 8,
    startingFare: 250,
    busesCount: '8,500+ Buses',
    rating: '4.6 ★',
    popularBus: 'Airavat Club Class, Flybus, Rajahamsa',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200'
  },
  {
    id: 'apsrtc',
    name: 'APSRTC',
    regionalName: 'ఆంధ్రప్రదేశ్ రాష్ట్ర రోడ్డు రవాణా సంస్థ',
    languageCode: 'te-IN',
    fullName: 'Andhra Pradesh State Road Transport Corporation',
    state: 'Andhra Pradesh',
    route: { from: 'Visakhapatnam', to: 'Vijayawada' },
    routes: [
      { from: 'Visakhapatnam', to: 'Vijayawada', duration: '6h 30m', fare: 450, busCount: 4 },
      { from: 'Vijayawada', to: 'Hyderabad', duration: '5h 00m', fare: 420, busCount: 7 },
      { from: 'Tirupati', to: 'Bengaluru', duration: '5h 15m', fare: 390, busCount: 6 }
    ],
    concession: '50% concession for child passengers',
    busCount: 4,
    startingFare: 450,
    busesCount: '11,000+ Buses',
    rating: '4.5 ★',
    popularBus: 'Amaravati, Garuda Plus, Vennela Sleeper',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'tsrtc',
    name: 'TGSRTC',
    regionalName: 'తెలంగాణ రాష్ట్ర రోడ్డు రవాణా సంస్థ',
    languageCode: 'te-IN',
    fullName: 'Telangana State Road Transport Corporation',
    state: 'Telangana',
    route: { from: 'Hyderabad', to: 'Warangal' },
    routes: [
      { from: 'Hyderabad', to: 'Warangal', duration: '3h 00m', fare: 220, busCount: 14 },
      { from: 'Hyderabad', to: 'Vijayawada', duration: '5h 00m', fare: 410, busCount: 9 },
      { from: 'Warangal', to: 'Hyderabad', duration: '3h 00m', fare: 220, busCount: 14 }
    ],
    concession: '50% concession for child passengers',
    offer: 'Use code TGSRTC to get up to ₹300 off',
    busCount: 14,
    startingFare: 220,
    busesCount: '9,200+ Buses',
    rating: '4.4 ★',
    popularBus: 'Garuda, Rajdhani AC, Super Luxury',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'msrtc',
    name: 'MSRTC',
    regionalName: 'महाराष्ट्र राज्य मार्ग परिवहन महामंडळ',
    languageCode: 'mr-IN',
    fullName: 'Maharashtra State Road Transport Corporation',
    state: 'Maharashtra',
    route: { from: 'Mumbai', to: 'Pune' },
    routes: [
      { from: 'Mumbai', to: 'Pune', duration: '3h 30m', fare: 280, busCount: 18 },
      { from: 'Pune', to: 'Mumbai', duration: '3h 30m', fare: 280, busCount: 18 },
      { from: 'Pune', to: 'Nashik', duration: '4h 45m', fare: 360, busCount: 7 }
    ],
    concession: 'Concessions available for eligible passengers',
    busCount: 18,
    startingFare: 280,
    busesCount: '15,000+ Buses',
    rating: '4.3 ★',
    popularBus: 'Shivshahi, Shivneri Volvo AC, Lal Dabba',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'gsrtc',
    name: 'GSRTC',
    regionalName: 'ગુજરાત રાજ્ય માર્ગ વાહન વ્યવહાર નિગમ',
    languageCode: 'gu-IN',
    fullName: 'Gujarat State Road Transport Corporation',
    state: 'Gujarat',
    route: { from: 'Ahmedabad', to: 'Surat' },
    routes: [
      { from: 'Ahmedabad', to: 'Surat', duration: '4h 30m', fare: 290, busCount: 12 },
      { from: 'Surat', to: 'Ahmedabad', duration: '4h 30m', fare: 290, busCount: 12 },
      { from: 'Ahmedabad', to: 'Vadodara', duration: '2h 15m', fare: 180, busCount: 9 }
    ],
    concession: 'Concessions available for eligible passengers',
    busCount: 12,
    startingFare: 180,
    busesCount: '8,000+ Buses',
    rating: '4.4 ★',
    popularBus: 'Gurjarnagri, Sleeper Express, Volvo AC',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'upsrtc',
    name: 'UPSRTC',
    regionalName: 'उत्तर प्रदेश राज्य सड़क परिवहन निगम',
    languageCode: 'hi-IN',
    fullName: 'Uttar Pradesh State Road Transport',
    state: 'Uttar Pradesh',
    route: { from: 'Delhi', to: 'Lucknow' },
    routes: [
      { from: 'Delhi', to: 'Lucknow', duration: '8h 00m', fare: 550, busCount: 10 },
      { from: 'Lucknow', to: 'Delhi', duration: '8h 00m', fare: 550, busCount: 10 },
      { from: 'Delhi', to: 'Agra', duration: '3h 45m', fare: 290, busCount: 16 }
    ],
    concession: 'Concessions available for eligible passengers',
    busCount: 10,
    startingFare: 290,
    busesCount: '12,500+ Buses',
    rating: '4.2 ★',
    popularBus: 'Janrath AC, Shatabdi, Scania Gold Line',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  }
];
