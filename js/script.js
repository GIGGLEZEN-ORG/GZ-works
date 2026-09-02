const suiteCatalog = {
  'deluxe-ocean': {
    title: 'Deluxe Ocean View Villa',
    price: 650,
    view: 'Ocean View',
    size: '65 m²',
    guests: '2 Guests',
    bed: '1 King Bed',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    description: 'Panoramic Mediterranean views with a private sun terrace, freestanding soaking tub, and bespoke Italian furnishings.',
    amenities: ['Private terrace', 'Soaking tub', 'Rainfall shower', 'Personal concierge']
  },
  'executive-suite': {
    title: 'Executive Horizon Suite',
    price: 1100,
    view: 'Horizon View',
    size: '95 m²',
    guests: '3 Guests',
    bed: '1 Emperor King',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: 'Expansive living quarters with a private heated plunge pool, dedicated butler pantry, and curated modern art.',
    amenities: ['Heated plunge pool', 'Private pantry', 'Curated art', 'In-room espresso bar']
  },
  'overwater-pavilion': {
    title: 'Overwater Lagoon Pavilion',
    price: 1650,
    view: 'Overwater',
    size: '130 m²',
    guests: '2 Guests',
    bed: '1 Floating King',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    description: 'Perched directly above serene azure waters with private catamaran nets, glass floor portals, and lagoon steps.',
    amenities: ['Glass floor portal', 'Private catamaran net', 'Lagoon steps', 'Sunset deck']
  },
  'royal-penthouse': {
    title: 'Royal Penthouse Sanctuary',
    price: 2800,
    view: 'Penthouse Signature',
    size: '220 m²',
    guests: '6 Guests',
    bed: '3 King Suites',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    description: 'The pinnacle of coastal majesty. Private rooftop lap pool, dedicated sommelier, cinema salon, and 24/7 master chef.',
    amenities: ['Rooftop lap pool', 'Private cinema salon', 'Master chef access', 'Dedicated sommelier']
  },
  'wellness-residence': {
    title: 'Botanical Wellness Residence',
    price: 1350,
    view: 'Wellness Retreat',
    size: '115 m²',
    guests: '2 Guests',
    bed: '1 Organic King',
    image: 'https://images.unsplash.com/photo-1582719478250-c89af14cf738?auto=format&fit=crop&w=1200&q=80',
    description: 'Private Finnish cedar sauna, cold plunge tub, Himalayan salt wall, and bespoke daily Ayurvedic spa rituals.',
    amenities: ['Private cedar sauna', 'Cold plunge tub', 'Salt wall ritual', 'Ayurvedic program']
  },
  'cliffside-villa': {
    title: 'Cliffside Sunset Villa',
    price: 2100,
    view: 'Cliffside Villa',
    size: '180 m²',
    guests: '4 Guests',
    bed: '2 King Suites',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    description: 'Sculpted into sheer granite cliffs with multi-tiered sun decks, a cantilevered infinity pool, and private firepit.',
    amenities: ['Infinity pool', 'Private firepit', 'Sun decks', 'Stone bath']
  }
};

const bookingState = {
  currentStep: 1,
  selectedSuite: 'deluxe-ocean'
};

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(value);

function showToast(message) {
  const toast = document.getElementById('luxury-toast');
  const toastMsg = document.getElementById('luxury-toast-msg');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('active');
  }, 2800);
}

function openBookingModal() {
  const modal = document.getElementById('booking-flow-modal');
  if (!modal) return;

  bookingState.currentStep = 1;
  updateBookingStepUI();
  updateBookingSummary();
  modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('booking-flow-modal');
  if (modal) modal.classList.remove('active');
}

function openBookingModalWithSuite(suiteKey) {
  const suiteId = suiteKey || 'deluxe-ocean';
  bookingState.selectedSuite = suiteId;

  const suiteSelect = document.getElementById('booking-suite-select');
  if (suiteSelect) suiteSelect.value = suiteId;

  updateBookingSummary();
  openBookingModal();
}

function updateBookingSummary() {
  const suite = suiteCatalog[bookingState.selectedSuite] || suiteCatalog['deluxe-ocean'];
  const titleEl = document.getElementById('modal-summary-suite-title');
  const priceEl = document.getElementById('modal-summary-suite-price');
  const suiteSelect = document.getElementById('booking-suite-select');
  const bookingSuiteCode = suiteSelect ? suiteSelect.value : bookingState.selectedSuite;
  const selectedSuite = suiteCatalog[bookingSuiteCode] || suite;

  if (titleEl) titleEl.textContent = selectedSuite.title;
  if (priceEl) priceEl.textContent = `${formatCurrency(selectedSuite.price)} / night`;

  const roomCostEl = document.getElementById('inv-room-cost');
  const addonsCostEl = document.getElementById('inv-addons-cost');
  const taxCostEl = document.getElementById('inv-tax-cost');
  const grandTotalEl = document.getElementById('inv-grand-total');
  const nightsCountEl = document.getElementById('inv-nights-count');

  const checkin = document.getElementById('booking-checkin');
  const checkout = document.getElementById('booking-checkout');
  const basePrice = selectedSuite.price;

  const nights = getNightDifference(checkin?.value, checkout?.value);
  const roomSubtotal = basePrice * Math.max(1, nights || 4);
  const addons = getAddonTotal();
  const tax = Math.round((roomSubtotal + addons) * 0.1);
  const total = roomSubtotal + addons + tax;

  if (nightsCountEl) nightsCountEl.textContent = `${Math.max(1, nights || 4)} nights`;
  if (roomCostEl) roomCostEl.textContent = formatCurrency(roomSubtotal);
  if (addonsCostEl) addonsCostEl.textContent = formatCurrency(addons);
  if (taxCostEl) taxCostEl.textContent = formatCurrency(tax);
  if (grandTotalEl) grandTotalEl.textContent = formatCurrency(total);

  const confirmSuite = document.getElementById('confirm-suite-name');
  const confirmDates = document.getElementById('confirm-dates');
  const confirmTotal = document.getElementById('confirm-total');
  const confirmCode = document.getElementById('confirm-ref-code');

  if (confirmSuite) confirmSuite.textContent = selectedSuite.title;
  if (confirmTotal) confirmTotal.textContent = formatCurrency(total);

  const formatDate = (value) => {
    if (!value) return 'Select dates';
    const date = new Date(value + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (confirmDates) {
    const start = checkin?.value ? formatDate(checkin.value) : 'TBD';
    const end = checkout?.value ? formatDate(checkout.value) : 'TBD';
    const stayNights = Math.max(1, nights || 4);
    confirmDates.textContent = `${start} — ${end} (${stayNights} Nights)`;
  }

  if (confirmCode) {
    confirmCode.textContent = `LUM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;
  }
}

function getNightDifference(checkin, checkout) {
  if (!checkin || !checkout) return 4;
  const start = new Date(checkin + 'T00:00:00');
  const end = new Date(checkout + 'T00:00:00');
  const diff = end - start;
  const nights = diff / (1000 * 60 * 60 * 24);
  return Number.isFinite(nights) && nights > 0 ? nights : 4;
}

function getAddonTotal() {
  const addons = [
    { id: 'addon-heli', value: 450 },
    { id: 'addon-champagne', value: 180 },
    { id: 'addon-spa', value: 320 },
    { id: 'addon-butler', value: 250 }
  ];

  return addons.reduce((sum, addon) => {
    const input = document.getElementById(addon.id);
    return sum + ((input && input.checked) ? addon.value : 0);
  }, 0);
}

function nextBookingStep() {
  const currentStep = bookingState.currentStep;

  if (currentStep === 1) {
    const suite = document.getElementById('booking-suite-select');
    const checkin = document.getElementById('booking-checkin');
    const checkout = document.getElementById('booking-checkout');

    if (!suite || !checkin || !checkout || !checkin.value || !checkout.value) {
      showToast('Please select your dates and suite before continuing.');
      return;
    }
  }

  if (currentStep === 3) {
    const guestName = document.getElementById('guest-name');
    const guestEmail = document.getElementById('guest-email');

    if (!guestName || !guestEmail || !guestName.value || !guestEmail.value) {
      showToast('Please fill in your guest details to continue.');
      return;
    }
  }

  bookingState.currentStep = Math.min(currentStep + 1, 4);
  updateBookingStepUI();
  updateBookingSummary();
}

function prevBookingStep() {
  bookingState.currentStep = Math.max(bookingState.currentStep - 1, 1);
  updateBookingStepUI();
}

function updateBookingStepUI() {
  const nodes = Array.from(document.querySelectorAll('.step-indicator-node'));
  const panes = Array.from(document.querySelectorAll('.modal-step-pane'));

  nodes.forEach((node, index) => {
    node.classList.toggle('active', index + 1 === bookingState.currentStep);
    node.classList.toggle('completed', index + 1 < bookingState.currentStep);
  });

  panes.forEach((pane, index) => {
    pane.classList.toggle('active', index + 1 === bookingState.currentStep);
  });
}

function finishBooking() {
  closeBookingModal();
  showToast('Your luxury booking is confirmed and saved.');
}

function openSuiteModal(suiteKey) {
  const modal = document.getElementById('suite-details-modal');
  if (!modal) return;

  const suite = suiteCatalog[suiteKey] || suiteCatalog['deluxe-ocean'];

  const title = document.getElementById('suite-detail-title');
  const img = document.getElementById('suite-detail-img');
  const view = document.getElementById('suite-detail-view');
  const price = document.getElementById('suite-detail-price');
  const desc = document.getElementById('suite-detail-desc');
  const size = document.getElementById('suite-detail-size');
  const guests = document.getElementById('suite-detail-guests');
  const bed = document.getElementById('suite-detail-bed');
  const amenities = document.getElementById('suite-detail-amenities');
  const bookNowBtn = document.getElementById('suite-modal-book-now');

  if (title) title.textContent = suite.title;
  if (img) img.src = suite.image;
  if (view) view.textContent = suite.view;
  if (price) price.textContent = `${formatCurrency(suite.price)} / night`;
  if (desc) desc.textContent = suite.description;
  if (size) size.textContent = suite.size;
  if (guests) guests.textContent = suite.guests;
  if (bed) bed.textContent = suite.bed;
  if (amenities) {
    amenities.innerHTML = suite.amenities.map((item) => `<li style="display:flex; align-items:center; gap:8px; color:var(--color-text-secondary);"><span style="color:var(--color-gold-500);">✓</span> ${item}</li>`).join('');
  }
  if (bookNowBtn) {
    bookNowBtn.onclick = () => {
      bookingState.selectedSuite = suiteKey;
      const select = document.getElementById('booking-suite-select');
      if (select) select.value = suiteKey;
      updateBookingSummary();
      modal.classList.remove('active');
      openBookingModal();
    };
  }

  modal.classList.add('active');
}

function openTableModal(initialRestaurant = '') {
  const modal = document.getElementById('table-reservation-modal');
  if (!modal) return;
  const select = document.getElementById('table-restaurant-select');
  if (select && initialRestaurant) select.value = initialRestaurant;
  modal.classList.add('active');
}

function openSpaModal(initialTreatment = '') {
  const modal = document.getElementById('spa-booking-modal');
  if (!modal) return;
  const select = document.getElementById('spa-treatment-select');
  if (select && initialTreatment) select.value = initialTreatment;
  modal.classList.add('active');
}

function closeModalById(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function initBookingFlow() {
  const bookingSuiteSelect = document.getElementById('booking-suite-select');
  if (bookingSuiteSelect) {
    bookingSuiteSelect.addEventListener('change', (event) => {
      bookingState.selectedSuite = event.target.value;
      updateBookingSummary();
    });
  }

  const bookingCheckin = document.getElementById('booking-checkin');
  const bookingCheckout = document.getElementById('booking-checkout');
  [bookingCheckin, bookingCheckout].forEach((input) => {
    if (input) {
      input.addEventListener('change', updateBookingSummary);
    }
  });

  const addonInputs = document.querySelectorAll('.addon-card-checkbox input');
  addonInputs.forEach((input) => input.addEventListener('change', updateBookingSummary));

  const bookingModalClose = document.getElementById('booking-modal-close');
  if (bookingModalClose) {
    bookingModalClose.addEventListener('click', closeBookingModal);
  }

  const suiteModalClose = document.getElementById('suite-modal-close');
  if (suiteModalClose) suiteModalClose.addEventListener('click', () => closeModalById('suite-details-modal'));

  const tableModalClose = document.getElementById('table-modal-close');
  if (tableModalClose) tableModalClose.addEventListener('click', () => closeModalById('table-reservation-modal'));

  const spaModalClose = document.getElementById('spa-modal-close');
  if (spaModalClose) spaModalClose.addEventListener('click', () => closeModalById('spa-booking-modal'));

  document.getElementById('booking-flow-modal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeBookingModal();
  });

  document.getElementById('suite-details-modal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) event.currentTarget.classList.remove('active');
  });

  document.getElementById('table-reservation-modal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) event.currentTarget.classList.remove('active');
  });

  document.getElementById('spa-booking-modal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) event.currentTarget.classList.remove('active');
  });

  const tableForm = document.getElementById('table-reservation-form');
  if (tableForm) {
    tableForm.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Dining reservation confirmed for your preferred time.');
      closeModalById('table-reservation-modal');
      tableForm.reset();
    });
  }

  const spaForm = document.getElementById('spa-booking-form');
  if (spaForm) {
    spaForm.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast('Your spa appointment has been scheduled successfully.');
      closeModalById('spa-booking-modal');
      spaForm.reset();
    });
  }

  const vipForm = document.getElementById('vip-newsletter-form');
  if (vipForm) {
    vipForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('vip-email');
      showToast(email && email.value ? `VIP access sent to ${email.value}` : 'VIP access sent to your inbox.');
      vipForm.reset();
    });
  }

  const quickForm = document.getElementById('quick-booking-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const suite = document.getElementById('quick-suite');
      const checkin = document.getElementById('quick-checkin');
      const checkout = document.getElementById('quick-checkout');

      if (!suite || !checkin || !checkout || !checkin.value || !checkout.value) {
        showToast('Select your dates to check availability.');
        return;
      }

      const suiteName = suite.options[suite.selectedIndex].text.split(' (')[0];
      showToast(`Availability checked for ${suiteName}. Concierge is reviewing your stay.`);
      openBookingModalWithSuite(suite.value);
      const modalSuite = document.getElementById('booking-suite-select');
      if (modalSuite) modalSuite.value = suite.value;
      const modalCheckin = document.getElementById('booking-checkin');
      const modalCheckout = document.getElementById('booking-checkout');
      if (modalCheckin) modalCheckin.value = checkin.value;
      if (modalCheckout) modalCheckout.value = checkout.value;
      updateBookingSummary();
    });
  }
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-nav-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  const closeMenu = () => drawer && drawer.classList.remove('active');
  const openMenu = () => drawer && drawer.classList.add('active');

  if (toggleBtn) toggleBtn.addEventListener('click', () => {
    if (drawer && drawer.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  if (drawer) {
    drawer.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) closeMenu();
    });
  }
}

function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initLiveClock() {
  const target = document.getElementById('live-resort-time');
  if (!target) return;

  const updateTime = () => {
    const time = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Paris',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    target.textContent = `${time} CET`;
  };

  updateTime();
  setInterval(updateTime, 1000);
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
}

function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * eased);
      element.textContent = `${currentValue}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function initRoomFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const roomCards = document.querySelectorAll('.room-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      const filter = button.dataset.filter;

      roomCards.forEach((card) => {
        const category = card.dataset.category;
        const matches = filter === 'all' || filter === category;
        card.style.display = matches ? '' : 'none';
      });
    });
  });
}

function initGalleryLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!galleryItems.length || !lightbox || !lightboxImg || !lightboxCaption) return;

  const galleryData = galleryItems.map((item) => {
    const img = item.querySelector('img');
    const title = item.querySelector('h4');
    return {
      src: img?.src || '',
      caption: title?.textContent || 'Lumina Gallery'
    };
  });

  let currentIndex = 0;

  const updateLightbox = (index) => {
    const safeIndex = (index + galleryData.length) % galleryData.length;
    const item = galleryData[safeIndex];
    currentIndex = safeIndex;
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateLightbox(index);
      lightbox.classList.add('active');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  if (prevBtn) prevBtn.addEventListener('click', () => updateLightbox(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateLightbox(currentIndex + 1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) lightbox.classList.remove('active');
  });
}

function initReviewsSlider() {
  const slides = Array.from(document.querySelectorAll('.review-slide'));
  const dotsContainer = document.getElementById('reviews-dots');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');

  if (!slides.length || !dotsContainer) return;

  let currentSlide = 0;

  const renderDots = () => {
    dotsContainer.innerHTML = slides.map((_, index) => `
      <button class="carousel-dot ${index === currentSlide ? 'active' : ''}" data-index="${index}" aria-label="Review ${index + 1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        currentSlide = Number(dot.dataset.index);
        updateSlides();
      });
    });
  };

  const updateSlides = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    renderDots();
  };

  prevBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  });

  nextBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }, 5000);

  updateSlides();
}

function initNavbarScrollState() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const updateNavbarState = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState, { passive: true });
}

function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  const updateVisibility = () => {
    backToTop.classList.toggle('active', window.scrollY > 300);
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initNavigationHighlight() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('main section[id], footer[id]'));

  if (!navLinks.length || !sections.length) return;

  const setActiveLink = () => {
    let currentId = 'hero';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 180) currentId = section.id;
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();
}

function initPageInteractions() {
  initMobileMenu();
  initScrollProgress();
  initLiveClock();
  initRevealAnimations();
  initStatCounters();
  initRoomFilters();
  initBookingFlow();
  initGalleryLightbox();
  initReviewsSlider();
  initNavbarScrollState();
  initBackToTop();
  initNavigationHighlight();
  updateBookingSummary();
}

window.openBookingModal = openBookingModal;
window.openBookingModalWithSuite = openBookingModalWithSuite;
window.openSuiteModal = openSuiteModal;
window.openTableModal = openTableModal;
window.openSpaModal = openSpaModal;
window.showToast = showToast;
window.requestCartToHotspot = (location) => showToast(`VIP cart dispatched to ${location}. Concierge will arrive shortly.`);
window.nextBookingStep = nextBookingStep;
window.prevBookingStep = prevBookingStep;
window.finishBooking = finishBooking;

document.addEventListener('DOMContentLoaded', initPageInteractions);
