# My Bus Booking Clone - React Application

A feature-complete, modern clone of **My Bus Booking** (India's leading online bus ticket booking platform), built with **React 19**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🚀 Key Features

### 1. 🔍 Unified Search Hero
- **City Autocomplete & Popular Destinations**: Search from 20+ major Indian cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Jaipur, etc.).
- **Smooth City Swap (⇄)**: Quick swap between departure and destination cities.
- **Dynamic Date Picker**: Instant selection with Today / Tomorrow shortcuts and journey dates.
- **Popular Route Shortcuts**: 1-click access to top routes with live starting fares.

### 2. 🚌 Search Results & Powerful Filter Engine
- **Route Summary Bar**: Date, total buses available, and day navigation (Previous Day / Next Day).
- **Sort By Toolbar**:
  - Top Rated ★
  - Cheapest First
  - Fastest Duration
  - Departure Time (Early vs. Late)
- **Multi-Facet Filter Sidebar**:
  - **Primo Buses Only**: Curated on-time, high-rating luxury fleet.
  - **Live Tracking**: GPS real-time tracked buses.
  - **Bus Types**: AC, Non-AC, Sleeper, Seater / Semi-Sleeper.
  - **Departure Time Slots**: Before 6 AM, 6 AM - 12 PM, 12 PM - 6 PM, After 6 PM.
  - **Bus Operators**: Filter by IntrCity SmartBus, Orange Travels, VRL Travels, Zingbus, SRS, etc.
  - **Price Range Slider**: Filter by maximum ticket budget.

### 3. 💺 Interactive Seat Selection System
- **Dual Deck Layout**: Lower Deck & Upper Deck tabs with authentic bus interior graphics and driver steering wheel indicator.
- **Seat Types & Statuses**:
  - Sleeper Berths (with headrest/pillow markers).
  - Seater Chairs.
  - Available (white/border), Selected (emerald green), Ladies-Only (pink badge), Booked (gray disabled).
- **Dynamic Boarding & Dropping Points**: Choose exact pickup and drop-off stops with timestamps and landmarks.
- **Live Fare Calculator**: Calculates cumulative price as seats are added or removed (max 6 seats).

### 4. 💳 Checkout & Payment Gateway Simulation
- **Passenger Details**: Dynamic form fields (Full Name, Age, Gender) per selected seat.
- **Contact Details**: Mobile number and email for ticket SMS/WhatsApp dispatch.
- **My Bus Booking Travel Assurance Add-on**: Optional trip cancellation insurance for ₹29/passenger.
- **Coupon System**: Instant validation for `FIRST` (₹150 off), `BUSSUMMER` (15% off), `SUPERBUS` (₹200 off), and `RTCDEAL`.
- **Payment Methods**:
  - UPI / QR (Google Pay, PhonePe, Paytm, BHIM).
  - Credit & Debit Cards.
  - Net Banking across major banks.

### 5. 🎟️ Instant E-Ticket Confirmation & Confetti
- **Celebration Effect**: Canvas confetti burst on successful booking.
- **Official My Bus Booking E-Ticket**:
  - PNR Number, Ticket ID, Status badge.
  - Bus Operator, Bus model, Boarding and Dropping details.
  - Conductor QR code for boarding verification.
  - **Print / PDF Download**: Native print dialog support (`window.print()`).

### 6. 📂 "My Bookings" Ticket Management
- Persistent ticket storage using browser `localStorage`.
- Detailed view of all past and upcoming journeys.
- **One-Click Ticket Cancellation**: Instant refund calculation and cancellation status tracking.

### 7. 🏛️ State RTC Partners & Exclusive Offers
- **Government Buses (RTC)**: KSRTC, APSRTC, TSRTC, MSRTC, GSRTC, UPSRTC.
- **Trending Deals Carousel**: Copy-to-clipboard coupon codes with animated feedback.
- **Interactive 24/7 AI Support Bot**: Instant answers to luggage, cancellation, and live tracking queries.

---

## 🛠️ Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Animations / Effects**: Canvas Confetti

---

## 💻 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Open in your browser (typically http://localhost:5173)
```

To build for production:
```bash
npm run build
```
