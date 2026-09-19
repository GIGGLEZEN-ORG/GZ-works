/**
 * HOTEL MARIO - LUXURY DYNAMIC JSON APPLICATION ENGINE
 * Reads data/hotel.json directly from disk.
 * Edit data/hotel.json in your IDE to instantly change the hotel name, rooms, amenities, and details!
 */

(function () {
  'use strict';

  // Application State
  let hotelData = null;
  let activeCategoryFilter = 'all';

  // DOM Cache
  const navbar = document.getElementById('navbar');
  const statsContainer = document.getElementById('stats-container');
  const roomsContainer = document.getElementById('rooms-container');
  const amenitiesContainer = document.getElementById('amenities-container');
  const experiencesContainer = document.getElementById('experiences-container');
  const reviewsContainer = document.getElementById('reviews-container');
  const faqContainer = document.getElementById('faq-container');
  const roomTabs = document.getElementById('room-tabs');
  const bookingModal = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const reservationForm = document.getElementById('reservation-form');
  const modalSuiteSelect = document.getElementById('modal-suite-select');
  const modalTotalPrice = document.getElementById('modal-total-price');

  // Date Pickers Cache
  const checkInInput = document.getElementById('check-in-date');
  const checkOutInput = document.getElementById('check-out-date');
  const modalCheckIn = document.getElementById('modal-check-in');
  const modalCheckOut = document.getElementById('modal-check-out');

  // Initialize Application
  async function init() {
    setupDates();
    setupEventListeners();

    try {
      // Fetch hotel.json with timestamp parameter to avoid browser caching when editing in IDE
      const response = await fetch(`data/hotel.json?v=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      hotelData = await response.json();
    } catch (error) {
      console.warn('Could not fetch data/hotel.json directly. Falling back to default data.', error);
      hotelData = getDefaultHotelData();
    }

    renderAll();
  }

  // Set default check-in (today) and check-out (tomorrow)
  function setupDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);

    const formatDate = (d) => d.toISOString().split('T')[0];
    if (checkInInput) checkInInput.value = formatDate(today);
    if (checkOutInput) checkOutInput.value = formatDate(tomorrow);
    if (modalCheckIn) modalCheckIn.value = formatDate(today);
    if (modalCheckOut) modalCheckOut.value = formatDate(tomorrow);
  }

  // Dynamic Text Interpolation (replaces {{hotelName}}, {{currency}}, etc.)
  function interpolate(text) {
    if (typeof text !== 'string') return text;
    if (!hotelData) return text;

    return text
      .replace(/\{\{hotelName\}\}/g, hotelData.hotelName || 'Mario')
      .replace(/\{\{hotelFullName\}\}/g, hotelData.hotelFullName || 'Hotel Mario')
      .replace(/\{\{currency\}\}/g, hotelData.currency || '€')
      .replace(/\{\{location\}\}/g, hotelData.location || 'Amalfi Coast, Italy');
  }

  // Get Nested Property value from object by string key (e.g., 'hero.badge')
  function getNestedValue(obj, path) {
    return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined ? prev[curr] : null), obj);
  }

  // Master Render Function
  function renderAll() {
    if (!hotelData) return;

    // Update document title & meta
    document.title = `${hotelData.hotelName} | ${hotelData.tagline || 'Luxury Hotel & Sanctuary'}`;

    // Update all data-bind elements
    document.querySelectorAll('[data-bind]').forEach((el) => {
      const key = el.getAttribute('data-bind');
      const val = getNestedValue(hotelData, key);
      if (val !== null && val !== undefined) {
        el.textContent = interpolate(val);
      }
    });

    renderStats();
    renderRooms(activeCategoryFilter);
    renderAmenities();
    renderExperiences();
    renderReviews();
    renderFAQ();
    populateModalSelect();
  }

  // Render Stats Grid
  function renderStats() {
    if (!statsContainer || !hotelData.stats) return;
    statsContainer.innerHTML = hotelData.stats
      .map(
        (stat) => `
        <div class="stat-card">
          <div class="stat-value">${interpolate(stat.value)}</div>
          <div class="stat-label">${interpolate(stat.label)}</div>
        </div>
      `
      )
      .join('');
  }

  // Render Filterable Rooms & Suites
  function renderRooms(category = 'all') {
    if (!roomsContainer || !hotelData.rooms) return;

    const filtered = category === 'all'
      ? hotelData.rooms
      : hotelData.rooms.filter((r) => r.category === category);

    roomsContainer.innerHTML = filtered
      .map((room) => {
        const title = interpolate(room.title);
        const desc = interpolate(room.description);
        const curr = hotelData.currency || '€';
        const badge = room.badge ? `<div class="room-tag-badge">${interpolate(room.badge)}</div>` : '';

        const amenitiesPills = (room.amenities || [])
          .slice(0, 3)
          .map((a) => `<span class="amenity-pill"><i class="fa-solid fa-check" style="color: var(--gold-primary);"></i> ${interpolate(a)}</span>`)
          .join('');

        return `
          <div class="room-card" data-category="${room.category}">
            <div class="room-image-container">
              <img src="${room.image}" alt="${title}" loading="lazy">
              ${badge}
              <div class="room-price-badge">
                ${curr}${room.price} <span>/ night</span>
              </div>
            </div>

            <div class="room-body">
              <span class="room-category">${interpolate(room.categoryLabel)}</span>
              <h3 class="room-title">${title}</h3>
              <p class="room-desc">${desc}</p>

              <div class="room-meta">
                <div class="room-meta-item"><i class="fa-solid fa-user-group"></i> ${interpolate(room.capacity)}</div>
                <div class="room-meta-item"><i class="fa-solid fa-maximize"></i> ${interpolate(room.size)}</div>
                <div class="room-meta-item"><i class="fa-solid fa-bed"></i> ${interpolate(room.bed)}</div>
              </div>

              <div class="room-amenity-tags">
                ${amenitiesPills}
              </div>

              <div class="room-card-footer">
                <button class="btn-primary select-room-btn" data-room-id="${room.id}">
                  Reserve Suite <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach click handlers to "Reserve Suite" buttons
    roomsContainer.querySelectorAll('.select-room-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const roomId = btn.getAttribute('data-room-id');
        openBookingModal(roomId);
      });
    });
  }

  // Render Amenities
  function renderAmenities() {
    if (!amenitiesContainer || !hotelData.amenities) return;
    amenitiesContainer.innerHTML = hotelData.amenities
      .map(
        (item) => `
        <div class="amenity-card">
          <img src="${item.image}" alt="${interpolate(item.title)}" class="amenity-img" loading="lazy">
          <div class="amenity-content">
            <span class="amenity-tag">${interpolate(item.tag)}</span>
            <h3 class="amenity-title">${interpolate(item.title)}</h3>
            <p class="amenity-desc">${interpolate(item.description)}</p>
          </div>
        </div>
      `
      )
      .join('');
  }

  // Render Experiences
  function renderExperiences() {
    if (!experiencesContainer || !hotelData.experiences) return;
    experiencesContainer.innerHTML = hotelData.experiences
      .map(
        (exp) => `
        <div class="review-card" style="border-top: 3px solid var(--gold-primary);">
          <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--gold-primary); letter-spacing: 0.1em;">
            ${interpolate(exp.tag)} • ${interpolate(exp.time)}
          </span>
          <h3 class="font-serif" style="font-size: 1.5rem;">${interpolate(exp.title)}</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">${interpolate(exp.subtitle)}</p>
          <div style="margin-top: auto;">
            <button class="btn-secondary open-exp-booking" style="width: 100%; font-size: 0.8rem;">Inquire Experience</button>
          </div>
        </div>
      `
      )
      .join('');

    experiencesContainer.querySelectorAll('.open-exp-booking').forEach((btn) => {
      btn.addEventListener('click', () => openBookingModal());
    });
  }

  // Render Guest Reviews
  function renderReviews() {
    if (!reviewsContainer || !hotelData.reviews) return;
    reviewsContainer.innerHTML = hotelData.reviews
      .map(
        (rev) => `
        <div class="review-card">
          <div class="stars">
            ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating || 5)}
          </div>
          <p class="review-comment">"${interpolate(rev.comment)}"</p>
          <div class="reviewer">
            <img src="${rev.avatar}" alt="${rev.guest}" class="reviewer-img">
            <div>
              <div class="reviewer-name">${interpolate(rev.guest)}</div>
              <div class="reviewer-stay">${interpolate(rev.room)} • ${interpolate(rev.location)}</div>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  // Render FAQs
  function renderFAQ() {
    if (!faqContainer || !hotelData.faq) return;
    faqContainer.innerHTML = hotelData.faq
      .map(
        (item) => `
        <div style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); padding: 1.5rem;">
          <h4 class="font-serif" style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">
            <i class="fa-regular fa-circle-question" style="color: var(--gold-primary); margin-right: 0.5rem;"></i>
            ${interpolate(item.q)}
          </h4>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
            ${interpolate(item.a)}
          </p>
        </div>
      `
      )
      .join('');
  }

  // Populate Suite Dropdown inside Booking Modal
  function populateModalSelect() {
    if (!modalSuiteSelect || !hotelData.rooms) return;
    modalSuiteSelect.innerHTML = hotelData.rooms
      .map((r) => `<option value="${r.id}">${interpolate(r.title)} (${hotelData.currency || '€'}${r.price}/night)</option>`)
      .join('');
  }

  // Open Booking Modal
  function openBookingModal(roomId = null) {
    if (roomId && modalSuiteSelect) {
      modalSuiteSelect.value = roomId;
    }
    updateModalPrice();
    bookingModal.classList.add('active');
  }

  function closeBookingModal() {
    bookingModal.classList.remove('active');
  }

  // Calculate total reservation price based on dates and selected room
  function updateModalPrice() {
    if (!modalCheckIn || !modalCheckOut || !modalSuiteSelect || !hotelData) return;

    const inDate = new Date(modalCheckIn.value);
    const outDate = new Date(modalCheckOut.value);
    const diffTime = outDate - inDate;
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1);

    const selectedRoom = hotelData.rooms.find((r) => r.id === modalSuiteSelect.value) || hotelData.rooms[0];
    const pricePerNight = selectedRoom ? selectedRoom.price : 1000;
    const total = pricePerNight * nights;

    if (modalTotalPrice) {
      modalTotalPrice.textContent = `${hotelData.currency || '€'}${total.toLocaleString()} (${nights} night${nights > 1 ? 's' : ''})`;
    }
  }

  // Toast Notification Manager
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--gold-primary);"></i> <span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Event Listeners
  function setupEventListeners() {
    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Room Filtering Tabs
    if (roomTabs) {
      roomTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
          roomTabs.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
          e.target.classList.add('active');
          activeCategoryFilter = e.target.getAttribute('data-filter');
          renderRooms(activeCategoryFilter);
        }
      });
    }

    // Booking Triggers
    const headerBookBtn = document.getElementById('header-book-btn');
    if (headerBookBtn) headerBookBtn.addEventListener('click', () => openBookingModal());

    const heroBookingForm = document.getElementById('hero-booking-form');
    if (heroBookingForm) {
      heroBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const suiteType = document.getElementById('suite-type-select').value;
        openBookingModal(suiteType !== 'all' ? suiteType : null);
      });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
    if (bookingModal) {
      bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeBookingModal();
      });
    }

    if (modalCheckIn) modalCheckIn.addEventListener('change', updateModalPrice);
    if (modalCheckOut) modalCheckOut.addEventListener('change', updateModalPrice);
    if (modalSuiteSelect) modalSuiteSelect.addEventListener('change', updateModalPrice);

    if (reservationForm) {
      reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        closeBookingModal();
        showToast(`Reservation request received at ${hotelData.hotelName}! Concierge will confirm shortly.`);
      });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast(`Thank you for subscribing to ${hotelData.hotelName} Artisan Journal!`);
        newsletterForm.reset();
      });
    }
  }

  // Fallback Data Generator
  function getDefaultHotelData() {
    return {
      hotelName: "Mario",
      hotelFullName: "Hotel Mario & Luxury Resort",
      tagline: "Artisan Elegance & Timeless Coastal Luxury",
      subline: "Experience sanctuary on the Italian coastline.",
      established: "1924",
      location: "Amalfi Coast, Italy",
      address: "Via Costa Costiera 42, 84011 Amalfi, Italy",
      contact: { phone: "+39 089 871 204", email: "concierge@hotelmario.com", checkIn: "15:00", checkOut: "12:00" },
      currency: "€",
      hero: {
        badge: "Welcome to {{hotelName}}",
        heading: "Bespoke Luxury & Timeless Sanctuary at {{hotelName}}",
        description: "Surrender to coastal beauty and unhurried luxury."
      },
      stats: [
        { label: "Private Suites", value: "48" },
        { label: "Michelin Stars", value: "2 Stars" },
        { label: "Guest Rating", value: "4.98 ★" },
        { label: "Artisan Heritage", value: "100+ Yrs" }
      ],
      about: {
        badge: "The {{hotelName}} Legacy",
        title: "A Century of Handcrafted Italian Hospitality",
        description: "Founded on the cliffside cliffs of Amalfi, {{hotelName}} has welcomed royalty and discerning travelers since 1924.",
        quote: "At {{hotelName}}, hospitality is an art form passed through generations."
      },
      rooms: [
        {
          id: "presidential-suite",
          title: "The {{hotelName}} Presidential Suite",
          category: "master",
          categoryLabel: "Master Suite",
          price: 1450,
          capacity: "4 Guests",
          size: "140 m²",
          bed: "King Bed",
          image: "assets/images/presidential.png",
          description: "The crown jewel of {{hotelName}} with heated jacuzzi and butler service.",
          amenities: ["24/7 Butler", "Heated Jacuzzi", "Private Heli Transfer"]
        }
      ],
      amenities: [],
      reviews: [],
      faq: [],
      footer: { copyright: "© 2026 {{hotelName}}. All Rights Reserved." }
    };
  }

  // DOM Content Loaded Handler
  document.addEventListener('DOMContentLoaded', init);
})();
