# 🎬 CINEVERSE 3D — Next-Gen Movie Ticket Booking Web Application

A cutting-edge, component-based React web application for IMAX, 3D, and 70mm movie ticket reservations. Featuring 4K high-resolution backdrops, interactive 3D curved amphitheater seat selection, seat point-of-view (POV) simulations, flippable 3D holographic digital passes with QR codes, gourmet snacks checkout, and Web Audio API synthesized cinema sound effects.

---

## 🚀 Quick Start Guide

### 1. Requirements
- Node.js (v18+ or later)
- npm (v9+ or later)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## ✨ Features

- **3D Curved IMAX Screen & Amphitheater**:
  - Curved screen with realistic projector lighting beam and floor reflection.
  - 3 View Modes: **3D Perspective**, **2D Architectural**, and **Seat POV Simulator** (previews the screen perspective from the selected row).
  - Tiers: Standard, Dolby Prime (with ★ Director's Sweet Spot), VIP Heated Recliners, and Couple Sofas.
- **3D Tilt Hologram Cards**:
  - Parallax tilt tracking mouse coordinates with a dynamic glare sheen.
- **Interactive 3D Flippable Ticket**:
  - Physically flips 180° in 3D space (`transform-style: preserve-3d`).
  - Front: 4K Movie banner, booking reference, screen & seat numbers, authentic SVG QR code, and barcode.
  - Back: Dolby Atmos 128-channel calibration verification, complimentary valet parking pass, and VIP Wi-Fi details.
  - Confetti burst celebration (`canvas-confetti`).
- **Gourmet Concessions & Promo Codes**:
  - Add truffle popcorn, nachos, electric slushies, and 3D glasses with live price calculation.
  - Promo code support (`CINEVERSE`, `IMAX3D`, `VIPPASS`).
- **Web Audio Synthesizer**:
  - Real-time synthesized cinema sub-bass rumble, seat selection clicks, and victory chimes without external audio assets.
- **Ambient Cinema Mood Lighting**:
  - Switch between 4 ambient themes: IMAX Laser Blue, Cyberpunk Neon, Golden Hollywood, and Midnight Obsidian.

---

## 📁 Project Structure

```
movie-ticket-booking/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── index.css
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   └── moviesData.js
    ├── utils/
    │   └── soundEffects.js
    └── components/
        ├── Navbar.jsx
        ├── HeroBanner3D.jsx
        ├── MovieFilterBar.jsx
        ├── MovieCard3D.jsx
        ├── MovieDetailModal.jsx
        ├── SeatPicker3D.jsx
        ├── ShowtimeSelector.jsx
        ├── ConcessionsDrawer.jsx
        ├── TicketReceipt3D.jsx
        ├── MyTicketsModal.jsx
        ├── TheatersSection.jsx
        ├── ExperienceShowcase.jsx
        └── Footer.jsx
```
