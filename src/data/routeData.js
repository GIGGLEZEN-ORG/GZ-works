const ROUTES = {
  'bengaluru-hyderabad': [
    { id: 'bus-bengaluru-hyderabad-1', operator: 'Deccan Express', busType: 'AC Sleeper', departureTime: '21:30', arrivalTime: '06:45', duration: '9h 15m', price: 1200 },
    { id: 'bus-bengaluru-hyderabad-2', operator: 'South Star Travels', busType: 'AC Seater/Sleeper', departureTime: '22:00', arrivalTime: '07:30', duration: '9h 30m', price: 1350 }
  ],
  'hyderabad-bengaluru': [
    { id: 'bus-hyderabad-bengaluru-1', operator: 'Deccan Express', busType: 'AC Sleeper', departureTime: '21:00', arrivalTime: '06:15', duration: '9h 15m', price: 1200 }
  ],
  'bengaluru-chennai': [
    { id: 'bus-bengaluru-chennai-1', operator: 'Coastal Lines', busType: 'AC Sleeper', departureTime: '22:00', arrivalTime: '05:30', duration: '7h 30m', price: 900 }
  ],
  'chennai-bengaluru': [
    { id: 'bus-chennai-bengaluru-1', operator: 'Coastal Lines', busType: 'AC Sleeper', departureTime: '22:30', arrivalTime: '06:00', duration: '7h 30m', price: 900 }
  ]
};

const createSeats = (price) => Array.from({ length: 24 }, (_, index) => ({
  id: `${Math.floor(index / 4) + 1}${String.fromCharCode(65 + (index % 4))}`,
  price,
  isAvailable: true
}));

const createPoints = (city, suffix) => [
  `${city} ${suffix} - Central`,
  `${city} ${suffix} - Main Road`
];

export const getBusesForRoute = (fromCity, toCity, date) => {
  const routeKey = `${fromCity}`.trim().toLowerCase() + '-' + `${toCity}`.trim().toLowerCase();
  const buses = ROUTES[routeKey] || [];

  return buses.map((bus) => ({
    ...bus,
    date,
    seats: createSeats(bus.price),
    boardingPoints: createPoints(fromCity, 'Boarding Point'),
    droppingPoints: createPoints(toCity, 'Drop Point')
  }));
};
