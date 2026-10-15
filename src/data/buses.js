// Helper to generate a realistic seat layout for Lower Deck and Upper Deck
export const generateSeatMap = (baseFare, isSleeper = true) => {
  const lowerDeck = [];
  const upperDeck = [];

  // Lower Deck: 18 seats (Mix of seater or sleeper berths)
  // Rows 1-6, Columns A (single/window), B, C
  for (let r = 1; r <= 6; r++) {
    // Window single
    const isBookedA = (r === 2 || r === 5);
    const isFemaleA = (r === 3);
    lowerDeck.push({
      id: `L${r}A`,
      seatNumber: `${r}A`,
      row: r,
      col: 1,
      type: isSleeper ? 'sleeper' : 'seater',
      status: isFemaleA ? 'female_booked' : (isBookedA ? 'booked' : 'available'),
      price: baseFare,
      deck: 'lower'
    });

    // Right column pair: B & C
    const isBookedB = (r === 1 || r === 4);
    lowerDeck.push({
      id: `L${r}B`,
      seatNumber: `${r}B`,
      row: r,
      col: 2,
      type: isSleeper ? 'sleeper' : 'seater',
      status: isBookedB ? 'booked' : 'available',
      price: baseFare,
      deck: 'lower'
    });

    const isBookedC = (r === 6);
    lowerDeck.push({
      id: `L${r}C`,
      seatNumber: `${r}C`,
      row: r,
      col: 3,
      type: isSleeper ? 'sleeper' : 'seater',
      status: isBookedC ? 'booked' : 'available',
      price: baseFare,
      deck: 'lower'
    });
  }

  // Upper Deck: Sleeper Berths (12 berths: U1A, U1B, U2A, U2B...)
  if (isSleeper) {
    for (let r = 1; r <= 6; r++) {
      const isBookedUA = (r === 1 || r === 3);
      upperDeck.push({
        id: `U${r}A`,
        seatNumber: `U${r}A`,
        row: r,
        col: 1,
        type: 'sleeper',
        status: isBookedUA ? 'booked' : 'available',
        price: baseFare + 150,
        deck: 'upper'
      });

      const isBookedUB = (r === 2 || r === 4);
      const isFemaleUB = (r === 5);
      upperDeck.push({
        id: `U${r}B`,
        seatNumber: `U${r}B`,
        row: r,
        col: 2,
        type: 'sleeper',
        status: isFemaleUB ? 'female_booked' : (isBookedUB ? 'booked' : 'available'),
        price: baseFare + 150,
        deck: 'upper'
      });
    }
  }

  return { lowerDeck, upperDeck };
};

export const PRIVATE_OPERATORS = [
  {
    id: 'intrcity',
    name: 'IntrCity SmartBus',
    busType: 'Volvo 9600 Multi-Axle A/C Sleeper (2+1)',
    category: 'sleeper',
    isAC: true,
    isPrimo: true,
    liveTracking: true,
    rating: 4.8,
    ratingCount: 3824,
    fareFactor: 1.35,
    depSlot: '21:30',
    amenities: ['Water Bottle', 'Blankets', 'Charging Point', 'WiFi', 'Reading Light', 'Emergency Exit', 'Live Tracking', 'Clean Restrooms'],
    photos: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'orange',
    name: 'Orange Travels',
    busType: 'Scania Multi-Axle A/C Semi Sleeper (2+2)',
    category: 'semi-sleeper',
    isAC: true,
    isPrimo: true,
    liveTracking: true,
    rating: 4.7,
    ratingCount: 2950,
    fareFactor: 1.15,
    depSlot: '22:00',
    amenities: ['Water Bottle', 'Charging Point', 'Reading Light', 'Emergency Exit', 'Live Tracking', 'Movie Screen'],
    photos: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'vrl',
    name: 'VRL Travels',
    busType: 'I-Shift Multi-Axle Volvo B11R A/C Sleeper',
    category: 'sleeper',
    isAC: true,
    isPrimo: false,
    liveTracking: true,
    rating: 4.6,
    ratingCount: 5120,
    fareFactor: 1.25,
    depSlot: '20:45',
    amenities: ['Blankets', 'Water Bottle', 'Charging Point', 'Reading Light', 'Live Tracking'],
    photos: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'zingbus',
    name: 'Zingbus Plus',
    busType: 'Electric Luxury Coach A/C Sleeper (2+1)',
    category: 'sleeper',
    isAC: true,
    isPrimo: true,
    liveTracking: true,
    rating: 4.9,
    ratingCount: 1680,
    fareFactor: 1.4,
    depSlot: '22:30',
    amenities: ['WiFi', 'Clean Air Filter', 'Charging Point', 'Blankets', 'Live Tracking', 'Snacks'],
    photos: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'srs',
    name: 'SRS Travels',
    busType: 'Non A/C Sleeper (2+1)',
    category: 'sleeper',
    isAC: false,
    isPrimo: false,
    liveTracking: true,
    rating: 4.1,
    ratingCount: 2210,
    fareFactor: 0.9,
    depSlot: '19:30',
    amenities: ['Reading Light', 'Emergency Exit', 'Live Tracking', 'Luggage Compartment'],
    photos: []
  },
  {
    id: 'greenline',
    name: 'Greenline Travels & Holidays',
    busType: 'Mercedes Benz Multi-Axle A/C Sleeper (2+1)',
    category: 'sleeper',
    isAC: true,
    isPrimo: true,
    liveTracking: true,
    rating: 4.8,
    ratingCount: 1420,
    fareFactor: 1.45,
    depSlot: '23:15',
    amenities: ['Water Bottle', 'Blankets', 'Pillow', 'Charging Point', 'WiFi', 'Live Tracking'],
    photos: []
  },
  {
    id: 'jabbar',
    name: 'Jabbar Travels',
    busType: 'Bharat Benz A/C Seater (2+2)',
    category: 'seater',
    isAC: true,
    isPrimo: false,
    liveTracking: false,
    rating: 4.2,
    ratingCount: 890,
    fareFactor: 0.85,
    depSlot: '14:00',
    amenities: ['Charging Point', 'Reading Light', 'Emergency Exit'],
    photos: []
  }
];

export const RTC_OPERATORS = {
  ksrtc: [
    {
      id: 'ksrtc_airavat',
      name: 'KSRTC (Airavat Club Class)',
      busType: 'Volvo Multi-Axle AC Semi-Sleeper (2+2)',
      category: 'semi-sleeper',
      isAC: true,
      isPrimo: true,
      liveTracking: true,
      rating: 4.6,
      ratingCount: 7890,
      fareFactor: 1.1,
      depSlot: '07:00',
      amenities: ['Water Bottle', 'Charging Point', 'Emergency Exit', 'Luggage Tag', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'ksrtc',
      rtcCorp: 'Karnataka State Road Transport Corporation'
    },
    {
      id: 'ksrtc_flybus',
      name: 'KSRTC (Flybus Luxury Sleeper)',
      busType: 'Volvo Multi-Axle AC Sleeper (2+1)',
      category: 'sleeper',
      isAC: true,
      isPrimo: true,
      liveTracking: true,
      rating: 4.7,
      ratingCount: 4210,
      fareFactor: 1.3,
      depSlot: '21:15',
      amenities: ['Blankets', 'Water Bottle', 'Charging Point', 'Live Tracking', 'Clean Restrooms'],
      photos: [],
      isRtc: true,
      rtcCode: 'ksrtc',
      rtcCorp: 'Karnataka State Road Transport Corporation'
    },
    {
      id: 'ksrtc_rajahamsa',
      name: 'KSRTC (Rajahamsa Executive)',
      busType: 'Non A/C Deluxe Pushback (2+2)',
      category: 'seater',
      isAC: false,
      isPrimo: false,
      liveTracking: true,
      rating: 4.4,
      ratingCount: 9100,
      fareFactor: 0.85,
      depSlot: '11:30',
      amenities: ['Reading Light', 'Emergency Exit', 'Luggage Tag'],
      photos: [],
      isRtc: true,
      rtcCode: 'ksrtc',
      rtcCorp: 'Karnataka State Road Transport Corporation'
    }
  ],
  apsrtc: [
    {
      id: 'apsrtc_amaravati',
      name: 'APSRTC (Amaravati)',
      busType: 'Scania Multi-Axle A/C Sleeper (2+1)',
      category: 'sleeper',
      isAC: true,
      isPrimo: true,
      liveTracking: true,
      rating: 4.5,
      ratingCount: 6300,
      fareFactor: 1.2,
      depSlot: '21:00',
      amenities: ['Blankets', 'Water Bottle', 'Charging Point', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'apsrtc',
      rtcCorp: 'Andhra Pradesh State Road Transport Corporation'
    },
    {
      id: 'apsrtc_garuda',
      name: 'APSRTC (Garuda Plus)',
      busType: 'Volvo Multi-Axle AC Semi-Sleeper (2+2)',
      category: 'semi-sleeper',
      isAC: true,
      isPrimo: false,
      liveTracking: true,
      rating: 4.4,
      ratingCount: 4800,
      fareFactor: 1.05,
      depSlot: '08:00',
      amenities: ['Water Bottle', 'Charging Point', 'Emergency Exit', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'apsrtc',
      rtcCorp: 'Andhra Pradesh State Road Transport Corporation'
    },
    {
      id: 'apsrtc_superluxury',
      name: 'APSRTC (Super Luxury Non-AC)',
      busType: 'Deluxe Air Suspension (2+2)',
      category: 'seater',
      isAC: false,
      isPrimo: false,
      liveTracking: true,
      rating: 4.3,
      ratingCount: 5200,
      fareFactor: 0.8,
      depSlot: '15:30',
      amenities: ['Reading Light', 'Emergency Exit'],
      photos: [],
      isRtc: true,
      rtcCode: 'apsrtc',
      rtcCorp: 'Andhra Pradesh State Road Transport Corporation'
    }
  ],
  tsrtc: [
    {
      id: 'tsrtc_garuda',
      name: 'TSRTC (Garuda Plus)',
      busType: 'Volvo Multi-Axle AC Sleeper (2+1)',
      category: 'sleeper',
      isAC: true,
      isPrimo: true,
      liveTracking: true,
      rating: 4.5,
      ratingCount: 5400,
      fareFactor: 1.15,
      depSlot: '20:30',
      amenities: ['Water Bottle', 'Blankets', 'Charging Point', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'tsrtc',
      rtcCorp: 'Telangana State Road Transport Corporation'
    },
    {
      id: 'tsrtc_rajdhani',
      name: 'TSRTC (Rajdhani AC)',
      busType: 'BharatBenz AC Pushback (2+2)',
      category: 'seater',
      isAC: true,
      isPrimo: false,
      liveTracking: true,
      rating: 4.4,
      ratingCount: 4600,
      fareFactor: 0.95,
      depSlot: '07:30',
      amenities: ['AC Air Filter', 'Charging Point', 'Emergency Exit'],
      photos: [],
      isRtc: true,
      rtcCode: 'tsrtc',
      rtcCorp: 'Telangana State Road Transport Corporation'
    },
    {
      id: 'tsrtc_superluxury',
      name: 'TSRTC (Super Luxury)',
      busType: 'Non-AC Deluxe Air Suspension (2+2)',
      category: 'seater',
      isAC: false,
      isPrimo: false,
      liveTracking: true,
      rating: 4.3,
      ratingCount: 6100,
      fareFactor: 0.8,
      depSlot: '13:45',
      amenities: ['Reading Light', 'Emergency Exit'],
      photos: [],
      isRtc: true,
      rtcCode: 'tsrtc',
      rtcCorp: 'Telangana State Road Transport Corporation'
    }
  ],
  msrtc: [
    {
      id: 'msrtc_shivneri',
      name: 'MSRTC (Shivneri Volvo AC)',
      busType: 'Volvo B11R AC Multi-Axle (2+2)',
      category: 'semi-sleeper',
      isAC: true,
      isPrimo: true,
      liveTracking: true,
      rating: 4.6,
      ratingCount: 8900,
      fareFactor: 1.1,
      depSlot: '06:30',
      amenities: ['Water Bottle', 'Charging Point', 'AC Climate Control', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'msrtc',
      rtcCorp: 'Maharashtra State Road Transport Corporation'
    },
    {
      id: 'msrtc_shivshahi',
      name: 'MSRTC (Shivshahi AC Sleeper)',
      busType: 'AC Sleeper Coach (2+1)',
      category: 'sleeper',
      isAC: true,
      isPrimo: false,
      liveTracking: true,
      rating: 4.3,
      ratingCount: 7100,
      fareFactor: 1.0,
      depSlot: '21:45',
      amenities: ['Blankets', 'Charging Point', 'Emergency Exit', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'msrtc',
      rtcCorp: 'Maharashtra State Road Transport Corporation'
    },
    {
      id: 'msrtc_asiad',
      name: 'MSRTC (Asiad Semi-Luxury)',
      busType: 'Semi-Luxury Non-AC Express (2+2)',
      category: 'seater',
      isAC: false,
      isPrimo: false,
      liveTracking: false,
      rating: 4.2,
      ratingCount: 4900,
      fareFactor: 0.75,
      depSlot: '12:00',
      amenities: ['Luggage Space', 'Emergency Exit'],
      photos: [],
      isRtc: true,
      rtcCode: 'msrtc',
      rtcCorp: 'Maharashtra State Road Transport Corporation'
    }
  ],
  gsrtc: [
    {
      id: 'gsrtc_volvo',
      name: 'GSRTC (Volvo AC Sleeper)',
      busType: 'Multi-Axle AC Sleeper (2+1)',
      category: 'sleeper',
      isAC: true,
      isPrimo: true,
      liveTracking: true,
      rating: 4.5,
      ratingCount: 4200,
      fareFactor: 1.15,
      depSlot: '22:15',
      amenities: ['Water Bottle', 'Blankets', 'Charging Point', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'gsrtc',
      rtcCorp: 'Gujarat State Road Transport Corporation'
    },
    {
      id: 'gsrtc_gurjarnagri',
      name: 'GSRTC (Gurjarnagri Express)',
      busType: 'Express 2+2 Semi-Sleeper',
      category: 'seater',
      isAC: false,
      isPrimo: false,
      liveTracking: true,
      rating: 4.3,
      ratingCount: 6500,
      fareFactor: 0.8,
      depSlot: '08:30',
      amenities: ['Emergency Exit', 'Luggage Rack'],
      photos: [],
      isRtc: true,
      rtcCode: 'gsrtc',
      rtcCorp: 'Gujarat State Road Transport Corporation'
    }
  ],
  upsrtc: [
    {
      id: 'upsrtc_shatabdi',
      name: 'UPSRTC (Shatabdi Scania Gold)',
      busType: 'Scania Multi-Axle AC Sleeper (2+1)',
      category: 'sleeper',
      isAC: true,
      isPrimo: true,
      liveTracking: true,
      rating: 4.4,
      ratingCount: 4800,
      fareFactor: 1.15,
      depSlot: '21:30',
      amenities: ['Water Bottle', 'Blankets', 'Charging Point', 'Live Tracking'],
      photos: [],
      isRtc: true,
      rtcCode: 'upsrtc',
      rtcCorp: 'Uttar Pradesh State Road Transport'
    },
    {
      id: 'upsrtc_janrath',
      name: 'UPSRTC (Janrath AC)',
      busType: 'Low-Cost 2+2 AC Seater Pushback',
      category: 'seater',
      isAC: true,
      isPrimo: false,
      liveTracking: true,
      rating: 4.2,
      ratingCount: 7400,
      fareFactor: 0.85,
      depSlot: '09:00',
      amenities: ['AC Climate Control', 'Charging Point', 'Reading Light'],
      photos: [],
      isRtc: true,
      rtcCode: 'upsrtc',
      rtcCorp: 'Uttar Pradesh State Road Transport'
    }
  ]
};

export const RAW_OPERATORS = [...PRIVATE_OPERATORS, ...Object.values(RTC_OPERATORS).flat()];

// Route estimates database
export const ROUTE_ESTIMATES = {
  'bengaluru-mysuru': { durationMin: 195, durationStr: '03h 15m', baseFare: 250 },
  'mysuru-bengaluru': { durationMin: 195, durationStr: '03h 15m', baseFare: 250 },
  'bengaluru-mangaluru': { durationMin: 420, durationStr: '07h 00m', baseFare: 620 },
  'mangaluru-bengaluru': { durationMin: 420, durationStr: '07h 00m', baseFare: 620 },
  'mumbai-pune': { durationMin: 210, durationStr: '03h 30m', baseFare: 280 },
  'pune-mumbai': { durationMin: 210, durationStr: '03h 30m', baseFare: 280 },
  'pune-nashik': { durationMin: 285, durationStr: '04h 45m', baseFare: 360 },
  'nashik-pune': { durationMin: 285, durationStr: '04h 45m', baseFare: 360 },
  'mumbai-nashik': { durationMin: 225, durationStr: '03h 45m', baseFare: 290 },
  'nashik-mumbai': { durationMin: 225, durationStr: '03h 45m', baseFare: 290 },
  'hyderabad-warangal': { durationMin: 180, durationStr: '03h 00m', baseFare: 220 },
  'warangal-hyderabad': { durationMin: 180, durationStr: '03h 00m', baseFare: 220 },
  'hyderabad-vijayawada': { durationMin: 300, durationStr: '05h 00m', baseFare: 420 },
  'vijayawada-hyderabad': { durationMin: 300, durationStr: '05h 00m', baseFare: 420 },
  'visakhapatnam-vijayawada': { durationMin: 390, durationStr: '06h 30m', baseFare: 450 },
  'vijayawada-visakhapatnam': { durationMin: 390, durationStr: '06h 30m', baseFare: 450 },
  'ahmedabad-surat': { durationMin: 270, durationStr: '04h 30m', baseFare: 290 },
  'surat-ahmedabad': { durationMin: 270, durationStr: '04h 30m', baseFare: 290 },
  'ahmedabad-vadodara': { durationMin: 135, durationStr: '02h 15m', baseFare: 180 },
  'vadodara-ahmedabad': { durationMin: 135, durationStr: '02h 15m', baseFare: 180 },
  'delhi-lucknow': { durationMin: 480, durationStr: '08h 00m', baseFare: 550 },
  'lucknow-delhi': { durationMin: 480, durationStr: '08h 00m', baseFare: 550 },
  'delhi-agra': { durationMin: 225, durationStr: '03h 45m', baseFare: 290 },
  'agra-delhi': { durationMin: 225, durationStr: '03h 45m', baseFare: 290 },
  'delhi-chandigarh': { durationMin: 285, durationStr: '04h 45m', baseFare: 350 },
  'chandigarh-delhi': { durationMin: 285, durationStr: '04h 45m', baseFare: 350 },
  'delhi-jaipur': { durationMin: 330, durationStr: '05h 30m', baseFare: 399 },
  'jaipur-delhi': { durationMin: 330, durationStr: '05h 30m', baseFare: 399 },
  'bengaluru-hyderabad': { durationMin: 555, durationStr: '09h 15m', baseFare: 650 },
  'hyderabad-bengaluru': { durationMin: 555, durationStr: '09h 15m', baseFare: 650 },
  'bengaluru-chennai': { durationMin: 345, durationStr: '05h 45m', baseFare: 480 },
  'chennai-bengaluru': { durationMin: 345, durationStr: '05h 45m', baseFare: 480 },
  'chennai-coimbatore': { durationMin: 480, durationStr: '08h 00m', baseFare: 590 },
  'coimbatore-chennai': { durationMin: 480, durationStr: '08h 00m', baseFare: 590 },
  'mumbai-goa': { durationMin: 690, durationStr: '11h 30m', baseFare: 850 },
  'goa-mumbai': { durationMin: 690, durationStr: '11h 30m', baseFare: 850 },
  'tirupati-bengaluru': { durationMin: 315, durationStr: '05h 15m', baseFare: 390 },
  'bengaluru-tirupati': { durationMin: 315, durationStr: '05h 15m', baseFare: 390 }
};

// Real-world boarding / dropping landmarks per city
export const CITY_LANDMARKS = {
  bengaluru: [
    { name: 'Majestic (Kempegowda Bus Station)', landmark: 'Platform 3, KSRTC Terminal' },
    { name: 'Satellite Bus Terminal (Mysore Road)', landmark: 'Near Deepanjali Nagar Metro' },
    { name: 'Shantinagar Bus Station', landmark: 'Double Road, KSRTC Depot' },
    { name: 'Electronic City Toll Plaza', landmark: 'Elevated Expressway Pillar 120' }
  ],
  mysuru: [
    { name: 'Mysuru Central Suburb Bus Stand', landmark: 'Opposite Palace South Gate' },
    { name: 'Mysuru KSRTC Suburban Stand', landmark: 'Platform 4, Bengaluru Bay' },
    { name: 'Columbia Asia Hospital Circle', landmark: 'Bengaluru-Mysuru Highway Junction' },
    { name: 'Infosys Main Gate (Hebbal)', landmark: 'Hebbal Industrial Area' }
  ],
  hyderabad: [
    { name: 'MGBS (Mahatma Gandhi Bus Station)', landmark: 'Imlibun, Bay 12' },
    { name: 'Jubilee Bus Station (JBS Secunderabad)', landmark: 'Near Secunderabad Metro Gate 1' },
    { name: 'Ameerpet Metro Junction', landmark: 'Near Big Bazaar / Metro Pillar 1042' },
    { name: 'Gachibowli ORR Outer Ring Road', landmark: 'Cyber Towers Junction Flyover' }
  ],
  warangal: [
    { name: 'Hanamkonda Bus Station (TSRTC Complex)', landmark: 'Subedari Police Station Rd' },
    { name: 'Warangal Railway Station Stand', landmark: 'Station Road Concourse' },
    { name: 'Kazipet Railway Junction Stand', landmark: 'Kazipet Diesel Colony Road' }
  ],
  visakhapatnam: [
    { name: 'Dwaraka Bus Complex (RTC Complex)', landmark: 'Station Road, APSRTC Terminal' },
    { name: 'Maddilapalem Bus Stand', landmark: 'Near Andhra University Gate' },
    { name: 'Gajuwaka Junction', landmark: 'BHPV Flyover Entry Point' }
  ],
  vijayawada: [
    { name: 'Pandit Nehru Bus Station (PNBS)', landmark: 'Autonagar Terminal Platform 8' },
    { name: 'Benz Circle', landmark: 'Near Jyothi Mahal Centre' },
    { name: 'Ramavarappadu Ring', landmark: 'National Highway 16 Bypass' }
  ],
  mumbai: [
    { name: 'Dadar Asiad MSRTC Stand', landmark: 'Swami Narayan Temple / Flyover' },
    { name: 'Borivali Nancy Colony (MSRTC Depot)', landmark: 'Near Western Express Highway' },
    { name: 'Sion Circle Bus Stop', landmark: 'Opposite Sion Railway Station' },
    { name: 'Vashi Plaza Highway Stop', landmark: 'Navi Mumbai Highway Bridge' }
  ],
  pune: [
    { name: 'Swargate MSRTC Central Stand', landmark: 'Satara Road, Platform 2' },
    { name: 'Shivajinagar Bus Station', landmark: 'Near Pune Metro Station Gate 3' },
    { name: 'Wakad Highway Flyover Stand', landmark: 'Near Ginger Hotel / Bhujbal Chowk' },
    { name: 'Hinjewadi Phase 1 Circle', landmark: 'Infosys Circle, IT Park' }
  ],
  ahmedabad: [
    { name: 'Geeta Mandir Central Bus Stand (GSRTC)', landmark: 'Astodia Gate Platform 6' },
    { name: 'Subhash Bridge RTO Circle', landmark: 'Near Sabarmati Riverfront' },
    { name: 'Paldi Cross Road', landmark: 'Near City Corner / Mahalaxmi Complex' },
    { name: 'ISCON Cross Road', landmark: 'SG Highway Flyover' }
  ],
  surat: [
    { name: 'Surat Central Bus Station (GSRTC)', landmark: 'Opposite Surat Railway Station' },
    { name: 'Kamrej Toll Plaza', landmark: 'NH 48 Expressway Entry' },
    { name: 'Sahara Darwaja Flyover', landmark: 'Ring Road Commercial Hub' }
  ],
  delhi: [
    { name: 'Kashmere Gate ISBT', landmark: 'Maharana Pratap Inter State Terminal' },
    { name: 'Anand Vihar ISBT', landmark: 'Swami Vivekananda Terminal, Metro Gate 2' },
    { name: 'Sarai Kale Khan ISBT', landmark: 'Near Hazrat Nizamuddin Station' },
    { name: 'Dhaula Kuan Metro Bus Bay', landmark: 'Ring Road Airport Exit' }
  ],
  lucknow: [
    { name: 'Alambagh Inter State Bus Terminal (UPSRTC)', landmark: 'Metro Station Platform 5' },
    { name: 'Charbagh Central Bus Stand', landmark: 'Near Lucknow Junction Railway Station' },
    { name: 'Polytechnic Crossing', landmark: 'Faizabad Road Flyover' }
  ],
  mangaluru: [
    { name: 'KSRTC Central Bus Stand Bejai', landmark: 'Bejai Main Road Platform 2' },
    { name: 'Pumpwell Circle', landmark: 'Kankanady Bypass Road' },
    { name: 'Jyoti Circle (Ambedkar Circle)', landmark: 'Opposite Medical College' }
  ],
  tirupati: [
    { name: 'Tirupati Central Bus Station (APSRTC)', landmark: 'Platform 1, Srinivasa Concourse' },
    { name: 'Alipiri Toll Gate', landmark: 'Foothills to Tirumala Gate' }
  ],
  nashik: [
    { name: 'Thakkar Bazaar MSRTC Bus Stand', landmark: 'CBS Road, New Bus Stand' },
    { name: 'Mumbai Naka Highway Stand', landmark: 'Mumbai-Agra Highway Junction' }
  ],
  vadodara: [
    { name: 'Vadodara Central Bus Station', landmark: 'Opposite Sayajigunj Railway Station' },
    { name: 'Amit Nagar Circle', landmark: 'VIP Road Flyover' }
  ],
  agra: [
    { name: 'Idgah Bus Stand (UPSRTC)', landmark: 'Near Agra Cantt Railway Station' },
    { name: 'ISBT Transport Nagar', landmark: 'Delhi-Agra Highway Bypass' }
  ],
  chennai: [
    { name: 'CMBT Koyambedu Bus Stand', landmark: 'Mofussil Terminal Platform 5' },
    { name: 'Guindy Asiad Stand', landmark: 'Near Kathipara Junction Metro' },
    { name: 'Tambaram Sanatorium Stand', landmark: 'GST Road Railway Overbridge' }
  ]
};

const calculateArrivalTime = (depTime, durationMin) => {
  const [h, m] = depTime.split(':').map(Number);
  const totalMins = (h * 60 + m + durationMin) % (24 * 60);
  const arrH = Math.floor(totalMins / 60).toString().padStart(2, '0');
  const arrM = (totalMins % 60).toString().padStart(2, '0');
  return `${arrH}:${arrM}`;
};

const formatOffsetTime = (baseTime, offsetMinutes) => {
  const [h, m] = baseTime.split(':').map(Number);
  let totalMins = (h * 60 + m + offsetMinutes) % (24 * 60);
  if (totalMins < 0) totalMins += 24 * 60;
  const offH = Math.floor(totalMins / 60).toString().padStart(2, '0');
  const offM = (totalMins % 60).toString().padStart(2, '0');
  return `${offH}:${offM}`;
};

const normalizeCity = (c = '') => {
  const norm = (c || '').toLowerCase().trim();
  if (norm === 'nasik') return 'nashik';
  if (norm === 'bangalore') return 'bengaluru';
  if (norm === 'bombay') return 'mumbai';
  if (norm === 'madras') return 'chennai';
  if (norm === 'calcutta') return 'kolkata';
  if (norm === 'baroda') return 'vadodara';
  if (norm === 'vizag') return 'visakhapatnam';
  if (norm === 'mysore') return 'mysuru';
  if (norm === 'mangalore') return 'mangaluru';
  return norm;
};

// Determine matching RTCs for route
const getMatchingRtcCodes = (fromCity = '', toCity = '') => {
  const f = normalizeCity(fromCity);
  const t = normalizeCity(toCity);
  const codes = new Set();

  const cityToRtc = {
    bengaluru: 'ksrtc',
    mysuru: 'ksrtc',
    mangaluru: 'ksrtc',
    hubballi: 'ksrtc',
    visakhapatnam: 'apsrtc',
    vijayawada: 'apsrtc',
    tirupati: 'apsrtc',
    hyderabad: 'tsrtc',
    warangal: 'tsrtc',
    mumbai: 'msrtc',
    pune: 'msrtc',
    nashik: 'msrtc',
    ahmedabad: 'gsrtc',
    surat: 'gsrtc',
    vadodara: 'gsrtc',
    delhi: 'upsrtc',
    lucknow: 'upsrtc',
    agra: 'upsrtc'
  };

  if (cityToRtc[f]) codes.add(cityToRtc[f]);
  if (cityToRtc[t]) codes.add(cityToRtc[t]);

  // Interstate combinations
  if ((f === 'hyderabad' && t === 'vijayawada') || (f === 'vijayawada' && t === 'hyderabad')) {
    codes.add('tsrtc');
    codes.add('apsrtc');
  }
  if ((f === 'bengaluru' && t === 'hyderabad') || (f === 'hyderabad' && t === 'bengaluru')) {
    codes.add('ksrtc');
    codes.add('tsrtc');
  }

  // Fallback default
  if (codes.size === 0) {
    codes.add('ksrtc');
  }

  return Array.from(codes);
};

export const getBusesForRoute = (fromCity = 'Bengaluru', toCity = 'Hyderabad', travelDate = '') => {
  const normFrom = normalizeCity(fromCity);
  const normTo = normalizeCity(toCity);
  const routeKey = `${normFrom}-${normTo}`;
  const routeEstimate = ROUTE_ESTIMATES[routeKey] || {
    durationMin: 555,
    durationStr: '09h 15m',
    baseFare: 650
  };

  const fKey = normFrom;
  const tKey = normTo;

  // Resolve City Landmarks or generate plausible defaults
  const fromLandmarks = CITY_LANDMARKS[fKey] || [
    { name: `${fromCity} Central Bus Stand`, landmark: 'Platform 3, Major Terminal' },
    { name: `${fromCity} Satellite Terminal`, landmark: 'Near Metro Gate 2' },
    { name: `${fromCity} Highway Toll Plaza`, landmark: 'Expressway Flyover Entry' },
    { name: `${fromCity} Tech Park Circle`, landmark: 'Opposite Main Tech Gate' }
  ];

  const toLandmarks = CITY_LANDMARKS[tKey] || [
    { name: `${toCity} Central Bus Station`, landmark: 'Main Passenger Concourse' },
    { name: `${toCity} Railway Station Concourse`, landmark: 'East Entrance Pickup Bay' },
    { name: `${toCity} Highway Junction`, landmark: 'Outer Ring Road Flyover' },
    { name: `${toCity} City Center`, landmark: 'Municipal Circle' }
  ];

  // Select operators matching route
  const rtcCodes = getMatchingRtcCodes(fromCity, toCity);
  const selectedRtcBuses = [];
  rtcCodes.forEach(code => {
    if (RTC_OPERATORS[code]) {
      selectedRtcBuses.push(...RTC_OPERATORS[code]);
    }
  });

  // Pick suitable private operators (up to 5)
  const selectedPrivateBuses = PRIVATE_OPERATORS.slice(0, 5);

  // Combine so RTC buses are featured prominently
  const combinedOperators = [...selectedRtcBuses, ...selectedPrivateBuses];

  return combinedOperators.map((op, index) => {
    const isSleeperBus = op.category.includes('sleeper');
    const computedFare = Math.round((routeEstimate.baseFare * (op.fareFactor || 1)) / 10) * 10;
    const originalFare = Math.round(computedFare * 1.25);

    // Stagger departure slots realistically
    const departureTimes = ['06:30', '07:45', '09:00', '14:30', '18:15', '20:30', '21:15', '22:00', '22:45', '23:30'];
    const depTime = op.depSlot || departureTimes[index % departureTimes.length];
    const arrTime = calculateArrivalTime(depTime, routeEstimate.durationMin);

    // Generate accurate timed boarding points
    const boardingPoints = fromLandmarks.map((lm, lmIdx) => ({
      name: lm.name,
      landmark: lm.landmark,
      time: formatOffsetTime(depTime, (lmIdx - 1) * 20)
    }));

    // Generate accurate timed dropping points
    const droppingPoints = toLandmarks.map((lm, lmIdx) => ({
      name: lm.name,
      landmark: lm.landmark,
      time: formatOffsetTime(arrTime, lmIdx * 25)
    }));

    const { lowerDeck, upperDeck } = generateSeatMap(computedFare, isSleeperBus);
    const availableLower = lowerDeck.filter(s => s.status === 'available').length;
    const availableUpper = upperDeck.filter(s => s.status === 'available').length;
    const totalAvailable = availableLower + availableUpper;

    return {
      ...op,
      id: `${op.id}-${index}`,
      from: fromCity,
      to: toCity,
      travelDate: travelDate || 'Tomorrow',
      depTime,
      arrTime,
      duration: routeEstimate.durationStr,
      baseFare: computedFare,
      originalFare,
      boardingPoints,
      droppingPoints,
      selectedBoardingPoint: boardingPoints[0].name,
      selectedDroppingPoint: droppingPoints[0].name,
      availableSeatsCount: totalAvailable,
      seatMap: { lowerDeck, upperDeck },
      cancellationPolicy: [
        { timeWindow: 'Before 24 hrs of journey', refund: '90% refund', fee: '10% deduction' },
        { timeWindow: 'Between 12 to 24 hrs', refund: '75% refund', fee: '25% deduction' },
        { timeWindow: 'Between 6 to 12 hrs', refund: '50% refund', fee: '50% deduction' },
        { timeWindow: 'Within 6 hrs of departure', refund: 'No refund', fee: '100% deduction' }
      ]
    };
  });
};
