/**
 * AURELIA GRAND SUITES & SANCTUARY
 * Complete Vanilla JavaScript Application Bundle
 * Designed to work seamlessly over both HTTP(S) and local file:// protocols.
 */

(function () {
  'use strict';

  /* =========================================================================
     1. NAVIGATION MODULE
     ========================================================================= */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Sticky Header
    function handleHeaderScroll() {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // Mobile Drawer
    function openMobileMenu() {
      hamburgerBtn?.classList.add('is-active');
      mobileDrawer?.classList.add('is-open');
      mobileOverlay?.classList.add('is-open');
      document.body.classList.add('no-scroll');
      hamburgerBtn?.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
      hamburgerBtn?.classList.remove('is-active');
      mobileDrawer?.classList.remove('is-open');
      mobileOverlay?.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
    }

    hamburgerBtn?.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.contains('is-active');
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    mobileOverlay?.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });

    // Smooth Anchor Scrolling with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          const headerHeight = header?.offsetHeight || 80;
          const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // ScrollSpy for active nav items
    function updateActiveNavLink() {
      const scrollPosition = window.scrollY + 150;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  }

  /* =========================================================================
     2. BOOKING MODULE
     ========================================================================= */
  function initBooking() {
    const checkinInput = document.getElementById('bar-checkin');
    const checkoutInput = document.getElementById('bar-checkout');
    const drawerCheckin = document.getElementById('drawer-checkin');
    const drawerCheckout = document.getElementById('drawer-checkout');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultCheckout = new Date(tomorrow);
    defaultCheckout.setDate(defaultCheckout.getDate() + 3);

    function formatDate(d) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }

    const tomorrowStr = formatDate(tomorrow);
    const checkoutStr = formatDate(defaultCheckout);

    if (checkinInput && checkoutInput) {
      checkinInput.min = tomorrowStr;
      checkinInput.value = tomorrowStr;

      checkoutInput.min = tomorrowStr;
      checkoutInput.value = checkoutStr;

      checkinInput.addEventListener('change', () => {
        const selectedCheckin = new Date(checkinInput.value);
        const nextDay = new Date(selectedCheckin);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = formatDate(nextDay);

        checkoutInput.min = nextDayStr;
        if (new Date(checkoutInput.value) <= selectedCheckin) {
          checkoutInput.value = nextDayStr;
        }
        syncToDrawerDates();
        updateReservationPricing();
      });

      checkoutInput.addEventListener('change', () => {
        syncToDrawerDates();
        updateReservationPricing();
      });
    }

    function syncToDrawerDates() {
      if (drawerCheckin && checkinInput) drawerCheckin.value = checkinInput.value;
      if (drawerCheckout && checkoutInput) drawerCheckout.value = checkoutInput.value;
    }

    // Guest Selector Popover
    const guestTriggerBtn = document.getElementById('guest-trigger-btn');
    const guestPopover = document.getElementById('guest-popover');
    const guestSummaryText = document.getElementById('guest-summary-text');

    const bookingState = {
      adults: 2,
      children: 0,
      rooms: 1,
      suiteType: 'deluxe-alabaster',
      suiteRate: 480,
      suiteName: 'Deluxe Alabaster Room'
    };

    function updateGuestDisplay() {
      const totalGuests = bookingState.adults + bookingState.children;
      const guestLabel = totalGuests === 1 ? '1 Guest' : `${totalGuests} Guests`;
      const roomLabel = bookingState.rooms === 1 ? '1 Suite' : `${bookingState.rooms} Suites`;
      if (guestSummaryText) {
        guestSummaryText.textContent = `${guestLabel}, ${roomLabel}`;
      }

      const drawerGuestsDisplay = document.getElementById('drawer-guests-display');
      if (drawerGuestsDisplay) {
        drawerGuestsDisplay.textContent = `${guestLabel}, ${roomLabel}`;
      }
    }

    if (guestTriggerBtn && guestPopover) {
      guestTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        guestPopover.classList.toggle('is-open');
      });

      document.addEventListener('click', (e) => {
        if (!guestPopover.contains(e.target) && e.target !== guestTriggerBtn) {
          guestPopover.classList.remove('is-open');
        }
      });

      const counterButtons = guestPopover.querySelectorAll('.counter-btn');
      counterButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const type = btn.dataset.type;
          const action = btn.dataset.action;
          const valElem = document.getElementById(`count-${type}`);

          if (!valElem) return;

          let currentVal = bookingState[type];
          if (action === 'plus') {
            if (type === 'adults' && currentVal < 6) currentVal++;
            if (type === 'children' && currentVal < 4) currentVal++;
            if (type === 'rooms' && currentVal < 4) currentVal++;
          } else if (action === 'minus') {
            if (type === 'adults' && currentVal > 1) currentVal--;
            if (type === 'children' && currentVal > 0) currentVal--;
            if (type === 'rooms' && currentVal > 1) currentVal--;
          }

          bookingState[type] = currentVal;
          valElem.textContent = currentVal;

          const minusBtn = guestPopover.querySelector(`.counter-btn[data-type="${type}"][data-action="minus"]`);
          if (minusBtn) {
            const minVal = type === 'children' ? 0 : 1;
            minusBtn.disabled = currentVal <= minVal;
          }

          updateGuestDisplay();
          updateReservationPricing();
        });
      });
    }

    // Reservation Drawer Management
    const modalOverlay = document.querySelector('.modal-overlay');
    const reservationDrawer = document.querySelector('.reservation-drawer');
    const drawerCloseBtn = document.querySelector('.drawer-close-btn');
    const drawerSuiteSelect = document.getElementById('drawer-suite-select');
    const barSuiteSelect = document.getElementById('bar-suite-select');
    const bookingTriggers = document.querySelectorAll('.js-open-booking');

    const suitePricingMap = {
      'deluxe-alabaster': { name: 'Deluxe Alabaster Room', rate: 480 },
      'signature-courtyard': { name: 'Signature Courtyard Room', rate: 550 },
      'junior-garden': { name: 'Junior Garden Suite', rate: 720 },
      'executive-terrace': { name: 'Executive Terrace Suite', rate: 950 },
      'presidential-sanctuary': { name: 'Presidential Sanctuary Suite', rate: 1600 },
      'grand-aurelia-penthouse': { name: 'The Grand Aurelia Penthouse', rate: 2400 }
    };

    function openReservationDrawer(preferredSuiteKey = null) {
      if (preferredSuiteKey && suitePricingMap[preferredSuiteKey]) {
        bookingState.suiteType = preferredSuiteKey;
        bookingState.suiteRate = suitePricingMap[preferredSuiteKey].rate;
        bookingState.suiteName = suitePricingMap[preferredSuiteKey].name;
        if (drawerSuiteSelect) drawerSuiteSelect.value = preferredSuiteKey;
        if (barSuiteSelect) barSuiteSelect.value = preferredSuiteKey;
      }

      syncToDrawerDates();
      updateGuestDisplay();
      updateReservationPricing();

      modalOverlay?.classList.add('is-active');
      reservationDrawer?.classList.add('is-active');
      document.body.classList.add('no-scroll');
    }

    function closeReservationDrawer() {
      modalOverlay?.classList.remove('is-active');
      reservationDrawer?.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    }

    bookingTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const suiteKey = trigger.dataset.suiteKey;
        openReservationDrawer(suiteKey);
      });
    });

    drawerCloseBtn?.addEventListener('click', closeReservationDrawer);
    modalOverlay?.addEventListener('click', () => {
      closeReservationDrawer();
    });

    if (drawerSuiteSelect) {
      drawerSuiteSelect.addEventListener('change', () => {
        const selected = drawerSuiteSelect.value;
        if (suitePricingMap[selected]) {
          bookingState.suiteType = selected;
          bookingState.suiteRate = suitePricingMap[selected].rate;
          bookingState.suiteName = suitePricingMap[selected].name;
          if (barSuiteSelect) barSuiteSelect.value = selected;
          updateReservationPricing();
        }
      });
    }

    if (barSuiteSelect) {
      barSuiteSelect.addEventListener('change', () => {
        const selected = barSuiteSelect.value;
        if (suitePricingMap[selected]) {
          bookingState.suiteType = selected;
          bookingState.suiteRate = suitePricingMap[selected].rate;
          bookingState.suiteName = suitePricingMap[selected].name;
          if (drawerSuiteSelect) drawerSuiteSelect.value = selected;
        }
      });
    }

    function updateReservationPricing() {
      const checkinVal = (drawerCheckin && drawerCheckin.value) || (checkinInput && checkinInput.value) || tomorrowStr;
      const checkoutVal = (drawerCheckout && drawerCheckout.value) || (checkoutInput && checkoutInput.value) || checkoutStr;

      const d1 = new Date(checkinVal);
      const d2 = new Date(checkoutVal);
      const diffTime = Math.abs(d2 - d1);
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const nightElem = document.getElementById('summary-nights-count');
      const rateElem = document.getElementById('summary-suite-rate');
      const subtotalElem = document.getElementById('summary-subtotal');
      const taxesElem = document.getElementById('summary-taxes');
      const totalElem = document.getElementById('summary-total');

      const baseCost = bookingState.suiteRate * nights * bookingState.rooms;

      const chauffeurAddon = document.getElementById('addon-chauffeur')?.checked ? 120 : 0;
      const champagneAddon = document.getElementById('addon-champagne')?.checked ? 95 : 0;
      const spaAddon = document.getElementById('addon-spa')?.checked ? 80 * (bookingState.adults || 1) : 0;

      const addonsCost = chauffeurAddon + champagneAddon + spaAddon;
      const totalBeforeTax = baseCost + addonsCost;
      const taxes = Math.round(totalBeforeTax * 0.12);
      const grandTotal = totalBeforeTax + taxes;

      if (nightElem) nightElem.textContent = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
      if (rateElem) rateElem.textContent = `$${bookingState.suiteRate}`;
      if (subtotalElem) subtotalElem.textContent = `$${baseCost.toLocaleString()}`;
      if (taxesElem) taxesElem.textContent = `$${taxes.toLocaleString()}`;
      if (totalElem) totalElem.textContent = `$${grandTotal.toLocaleString()} USD`;
    }

    document.querySelectorAll('.js-addon-checkbox').forEach((cb) => {
      cb.addEventListener('change', updateReservationPricing);
    });

    const reservationForm = document.getElementById('reservation-form');
    reservationForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guest-fullname')?.value || 'Distinguished Guest';

      closeReservationDrawer();
      if (window.showToast) {
        window.showToast(`Thank you, ${guestName}! Your reservation request for ${bookingState.suiteName} has been received. Our concierge will contact you momentarily.`);
      }
      reservationForm.reset();
    });

    window.openBookingWithSuite = openReservationDrawer;
  }

  /* =========================================================================
     3. ROOMS & SUITES MODULE
     ========================================================================= */
  function initRooms() {
    const filterPills = document.querySelectorAll('.rooms-filter .filter-pill');
    const roomCards = document.querySelectorAll('.room-card');
    const suiteModal = document.querySelector('.suite-modal-container');
    const modalOverlay = document.querySelector('.modal-overlay');
    const suiteModalClose = document.querySelector('.suite-modal-close');

    const suiteDetailsData = {
      'grand-aurelia-penthouse': {
        title: 'The Grand Aurelia Penthouse',
        category: 'Presidential & Penthouse',
        rate: '$2,400 / night',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
        size: '180 m² / 1,940 sq.ft',
        capacity: 'Up to 4 Guests',
        bed: '1 Emperor & 1 King Bed',
        view: '360° Panoramic Skyline & Coast',
        description: 'Perched on the private topmost tier of Aurelia, the Grand Penthouse represents the zenith of contemporary architectural luxury. Featuring a sweeping wraparound teak terrace, private heated infinity plunge pool, marble fireplace, dining salon for eight, and around-the-clock dedicated butler service.',
        amenities: [
          'Private heated outdoor plunge pool',
          'Dedicated 24/7 Clefs d’Or butler service',
          'Diptyque Paris bespoke toiletries',
          'Custom Bang & Olufsen acoustic sanctuary',
          'Private wine cellar with sommelier reserves',
          'Complimentary airport limousine transfer'
        ]
      },
      'presidential-sanctuary': {
        title: 'Presidential Sanctuary Suite',
        category: 'Presidential & Penthouse',
        rate: '$1,600 / night',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
        size: '140 m² / 1,500 sq.ft',
        capacity: 'Up to 3 Guests',
        bed: 'Super King Bed (Frette Linens)',
        view: 'Lush Courtyard & City Horizons',
        description: 'A secluded sanctuary designed with double-height ceilings, hand-chiseled travertine marble, curated original modern sculptures, a deep freestanding soaking tub overlooking private gardens, and an intimate fireplace lounge.',
        amenities: [
          'Handcrafted travertine soaking tub',
          'Fireplace salon with artisanal bar',
          'Complimentary afternoon champagne service',
          'Technogym in-suite personal wellness kit',
          'Dyson Supersonic & Airwrap vanity bar',
          'Private elevator express access'
        ]
      },
      'executive-terrace': {
        title: 'Executive Terrace Suite',
        category: 'Executive Suites',
        rate: '$950 / night',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop',
        size: '95 m² / 1,020 sq.ft',
        capacity: '2 Guests',
        bed: 'King Bed (Egyptian Cotton)',
        view: 'Private Landscaped Terrace',
        description: 'Crafted specifically for the cosmopolitan traveler, the Executive Terrace Suite seamlessly combines a serene living salon, dedicated executive workspace with ergonomic Vitra seating, and an expansive garden balcony for open-air breakfasting.',
        amenities: [
          'Private landscaped outdoor terrace',
          'Dedicated workstation with fiber connectivity',
          'Nespresso Vertuo & artisan tea library',
          'Marble rain shower with chromotherapy',
          'Nightly aromatherapy pillow menu',
          'Complimentary daily suit pressing'
        ]
      },
      'junior-garden': {
        title: 'Junior Garden Suite',
        category: 'Executive Suites',
        rate: '$720 / night',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
        size: '70 m² / 750 sq.ft',
        capacity: '2 Guests',
        bed: 'King Bed (Natural Silk Duvet)',
        view: 'Botanical Courtyard Gardens',
        description: 'An idyllic retreat bathed in soft natural light, featuring French floor-to-ceiling casement doors leading out onto our botanical courtyard, an integrated reading nook, and an alabaster bathroom with dual stone vanities.',
        amenities: [
          'Direct access to botanical garden courtyard',
          'Dual alabaster vanity and soaking tub',
          'Curated vinyl record player & jazz library',
          'Organic linen robes and slippers',
          'Complimentary seasonal fruit & macaron basket',
          'Custom pillow and scent selection'
        ]
      },
      'signature-courtyard': {
        title: 'Signature Courtyard Room',
        category: 'Deluxe Rooms',
        rate: '$550 / night',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop',
        size: '52 m² / 560 sq.ft',
        capacity: '2 Guests',
        bed: 'King Bed',
        view: 'Inner Courtyard Garden Fountain',
        description: 'Showcasing minimalist elegance and warm earth tones, the Signature Courtyard Room features acoustic triple-glazed windows, a walk-in wardrobe, and a relaxing seating arrangement adjacent to the peaceful fountain courtyard.',
        amenities: [
          'View over central fountain atrium',
          'Spacious walk-in wardrobe',
          'Rain shower with organic botanical oils',
          'Interactive smart concierge tablet',
          'Artisan loose-leaf tea selection',
          'Ultra-fast wireless charging nightstands'
        ]
      },
      'deluxe-alabaster': {
        title: 'Deluxe Alabaster Room',
        category: 'Deluxe Rooms',
        rate: '$480 / night',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1974&auto=format&fit=crop',
        size: '45 m² / 485 sq.ft',
        capacity: '2 Guests',
        bed: 'King or Twin Beds',
        view: 'Historic Architecture & City',
        description: 'Dressed in soft cream linens, white oak wood, and understated brass detailing. Includes a plush king bed with custom posture support, comfortable work alcove, and an invigorating walk-in rain shower.',
        amenities: [
          'High-thread-count hypoallergenic bedding',
          'Walk-in marble rain shower',
          'Nespresso gourmet coffee station',
          'Ultra-quiet intelligent climate control',
          'Curated in-room minibar selection',
          'Nightly artisanal turndown chocolates'
        ]
      }
    };

    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const filterValue = pill.dataset.filter;

        roomCards.forEach((card) => {
          const cardCategory = card.dataset.category;
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });

    const detailButtons = document.querySelectorAll('.js-view-details');

    function openSuiteModal(suiteKey) {
      const data = suiteDetailsData[suiteKey];
      if (!data) return;

      const modalBannerImg = document.getElementById('suite-modal-img');
      const modalCategory = document.getElementById('suite-modal-category');
      const modalTitle = document.getElementById('suite-modal-title');
      const modalRate = document.getElementById('suite-modal-rate');
      const modalSize = document.getElementById('suite-modal-size');
      const modalCapacity = document.getElementById('suite-modal-capacity');
      const modalBed = document.getElementById('suite-modal-bed');
      const modalView = document.getElementById('suite-modal-view');
      const modalDesc = document.getElementById('suite-modal-desc');
      const modalAmenities = document.getElementById('suite-modal-amenities');
      const modalBookBtn = document.getElementById('suite-modal-book-btn');

      if (modalBannerImg) modalBannerImg.src = data.image;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalRate) modalRate.textContent = data.rate;
      if (modalSize) modalSize.textContent = data.size;
      if (modalCapacity) modalCapacity.textContent = data.capacity;
      if (modalBed) modalBed.textContent = data.bed;
      if (modalView) modalView.textContent = data.view;
      if (modalDesc) modalDesc.textContent = data.description;

      if (modalAmenities) {
        modalAmenities.innerHTML = data.amenities.map(item => `
          <div class="suite-modal-amenity-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${item}</span>
          </div>
        `).join('');
      }

      if (modalBookBtn) {
        modalBookBtn.onclick = () => {
          closeSuiteModal();
          if (window.openBookingWithSuite) {
            window.openBookingWithSuite(suiteKey);
          }
        };
      }

      modalOverlay?.classList.add('is-active');
      suiteModal?.classList.add('is-active');
      document.body.classList.add('no-scroll');
    }

    function closeSuiteModal() {
      modalOverlay?.classList.remove('is-active');
      suiteModal?.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    }

    detailButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const suiteKey = btn.dataset.suiteKey;
        openSuiteModal(suiteKey);
      });
    });

    suiteModalClose?.addEventListener('click', closeSuiteModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && suiteModal?.classList.contains('is-active')) {
        closeSuiteModal();
      }
    });
  }

  /* =========================================================================
     4. GALLERY & LIGHTBOX MODULE
     ========================================================================= */
  function initGallery() {
    const galleryFilterPills = document.querySelectorAll('.gallery-filter .filter-pill');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxInfo = document.querySelector('.lightbox-info');
    const closeBtn = document.querySelector('.lightbox-close-btn');
    const prevBtn = document.querySelector('.lightbox-arrow.prev');
    const nextBtn = document.querySelector('.lightbox-arrow.next');

    let activeImages = [];
    let currentIndex = 0;

    function updateActiveImagesList() {
      activeImages = [];
      galleryItems.forEach((item) => {
        if (item.style.display !== 'none') {
          const img = item.querySelector('.gallery-thumb');
          const title = item.querySelector('h5')?.textContent || 'Aurelia Experience';
          const category = item.querySelector('span')?.textContent || 'Gallery';
          activeImages.push({
            src: img?.src,
            alt: img?.alt || 'Aurelia Boutique Hotel',
            title: title,
            category: category
          });
        }
      });
    }

    galleryFilterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        galleryFilterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;

        galleryItems.forEach((item) => {
          const itemCat = item.dataset.category;
          if (filter === 'all' || itemCat === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });

        setTimeout(updateActiveImagesList, 300);
      });
    });

    updateActiveImagesList();

    function showLightbox(index) {
      if (!activeImages.length) updateActiveImagesList();
      if (index < 0) index = activeImages.length - 1;
      if (index >= activeImages.length) index = 0;

      currentIndex = index;
      const currentItem = activeImages[currentIndex];

      if (!currentItem) return;

      if (lightboxImg) {
        lightboxImg.style.opacity = '0.3';
        setTimeout(() => {
          lightboxImg.src = currentItem.src;
          lightboxImg.alt = currentItem.alt;
          lightboxImg.style.opacity = '1';
        }, 150);
      }

      if (lightboxTitle) lightboxTitle.textContent = currentItem.title;
      if (lightboxInfo) {
        lightboxInfo.textContent = `${currentItem.category} • ${currentIndex + 1} of ${activeImages.length}`;
      }

      lightboxModal?.classList.add('is-active');
      document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
      lightboxModal?.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    }

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        updateActiveImagesList();
        const clickedImg = item.querySelector('.gallery-thumb');
        const foundIdx = activeImages.findIndex((img) => img.src === clickedImg?.src);
        showLightbox(foundIdx !== -1 ? foundIdx : 0);
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(currentIndex - 1);
    });
    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(currentIndex + 1);
    });

    window.addEventListener('keydown', (e) => {
      if (!lightboxModal?.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightboxModal?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) showLightbox(currentIndex - 1);
        else showLightbox(currentIndex + 1);
      }
    }, { passive: true });
  }

  /* =========================================================================
     5. DINING MODULE
     ========================================================================= */
  function initDining() {
    const menuModal = document.getElementById('menu-modal');
    const tableModal = document.getElementById('table-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const menuTriggers = document.querySelectorAll('.js-view-menu');
    const tableTriggers = document.querySelectorAll('.js-reserve-table');
    const menuCloseBtn = document.getElementById('menu-modal-close');
    const tableCloseBtn = document.getElementById('table-modal-close');

    const diningMenus = {
      'latelier': {
        title: "L'Atelier Aurelia — 7-Course Degustation",
        chef: 'Executive Chef Jean-Luc Moreau (2 Michelin Stars)',
        courses: [
          {
            name: 'Amuse-Bouche: Truffle Royale & Oscietra Caviar',
            desc: 'Velvety Jerusalem artichoke foam, Périgord black truffle essence, crisp gold leaf.',
            pairing: 'Dom Pérignon Vintage Champagne 2013'
          },
          {
            name: 'Premier: Carpaccio of Brittany Scallops',
            desc: 'Citrus reduction, compressed finger lime, sea urchin emulsion, sea herbs.',
            pairing: 'Chablis Grand Cru Les Clos 2020'
          },
          {
            name: 'Deuxième: Smoked Foie Gras & Quince Tart',
            desc: 'Caramelized heirloom quince, spiced brioche crisp, elderberry glaze.',
            pairing: 'Château d’Yquem Sauternes 2011'
          },
          {
            name: 'Poisson: Wild Turbot Poached in Champagne Butter',
            desc: 'Braised baby leeks, saffron broth, Oscietra caviar velouté.',
            pairing: 'Puligny-Montrachet 1er Cru 2019'
          },
          {
            name: 'Viande: Dry-Aged A5 Miyazaki Wagyu Tenderloin',
            desc: 'Bone marrow jus, smoked morel mushrooms, Robuchon-style pomme purée.',
            pairing: 'Château Margaux 1er Grand Cru Classé 2010'
          },
          {
            name: 'Pré-Dessert: Bergamot & White Peach Granite',
            desc: 'Champagne bubbles, infused lemon thyme pearls.',
            pairing: 'Palate cleanser'
          },
          {
            name: 'Final: Valrhona 72% Smoked Dark Chocolate Sphere',
            desc: 'Warm salted butter caramel drizzle, tonka bean gelato, candied hazelnut.',
            pairing: 'Taylor’s 30 Year Old Tawny Port'
          }
        ]
      },
      'glasshouse': {
        title: 'The Glasshouse Orangery — Royal Botanique Tea',
        chef: 'Master Pâtissier Claire Fontaine',
        courses: [
          {
            name: 'Savory: Smoked Scottish Salmon & Dill Mascarpone',
            desc: 'Brioche tartlet, trout roe, micro borage blossoms.',
            pairing: 'Silver Needle White Tea, Fujian'
          },
          {
            name: 'Savory: Truffled Free-Range Egg & Cornichon',
            desc: 'Pain de mie, quail yolk, chive blossoms.',
            pairing: 'Darjeeling First Flush Margaret’s Hope'
          },
          {
            name: 'Pâtisserie: Lavender-Infused Warm Scones',
            desc: 'Devonshire clotted cream, homemade wild raspberry & rose petal jam.',
            pairing: 'Earl Grey Reserve Imperial'
          },
          {
            name: 'Sweet: Pistachio & Sour Cherry Religieuse',
            desc: 'Choux pastry, Sicilian pistachio cream, griottine coulis.',
            pairing: 'Ruinart Blanc de Blancs Champagne'
          }
        ]
      },
      'nocturne': {
        title: 'The Nocturne Speakeasy — Mixology & Rare Reserves',
        chef: 'Head Mixologist Alessandro Vanni',
        courses: [
          {
            name: 'Signature: The Aurelia Elixir',
            desc: 'The Macallan 18, antique vermouth, smoked cherry bark, edible 24k gold leaf.',
            pairing: 'Presented under a crystal cloche of hickory smoke'
          },
          {
            name: 'Signature: Alabaster Boulevardier',
            desc: 'Michter’s 10 Year Rye, Campari infused with raw cacao nibs, Punt e Mes.',
            pairing: 'Accompanied by dark chocolate truffles'
          },
          {
            name: 'Reserve Flight: Japanese Rare Whiskies',
            desc: 'Yamazaki 18, Hakushu 18, and Hibiki 21 curated pour.',
            pairing: 'Hand-carved crystalline ice sphere'
          }
        ]
      }
    };

    function openMenuModal(venueKey) {
      const menuData = diningMenus[venueKey] || diningMenus['latelier'];
      const titleEl = document.getElementById('menu-modal-title');
      const chefEl = document.getElementById('menu-modal-chef');
      const listEl = document.getElementById('menu-courses-list');

      if (titleEl) titleEl.textContent = menuData.title;
      if (chefEl) chefEl.textContent = menuData.chef;

      if (listEl) {
        listEl.innerHTML = menuData.courses.map(c => `
          <div class="menu-course-item" style="border-bottom: 1px solid var(--border-light); padding: 1.25rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
              <h5 style="font-family: var(--font-serif); font-size: 1.25rem; margin: 0; color: var(--color-charcoal-900);">${c.name}</h5>
            </div>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0 0 0.4rem;">${c.desc}</p>
            <span style="font-size: var(--font-size-2xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-gold-600); font-weight: 600;">Sommelier Note: ${c.pairing}</span>
          </div>
        `).join('');
      }

      modalOverlay?.classList.add('is-active');
      menuModal?.classList.add('is-active');
      document.body.classList.add('no-scroll');
    }

    function closeMenuModal() {
      modalOverlay?.classList.remove('is-active');
      menuModal?.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    }

    menuTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const venue = btn.dataset.venue || 'latelier';
        openMenuModal(venue);
      });
    });

    menuCloseBtn?.addEventListener('click', closeMenuModal);

    function openTableModal(venueKey) {
      const venueSelect = document.getElementById('table-venue-select');
      if (venueSelect && venueKey) {
        venueSelect.value = venueKey;
      }
      modalOverlay?.classList.add('is-active');
      tableModal?.classList.add('is-active');
      document.body.classList.add('no-scroll');
    }

    function closeTableModal() {
      modalOverlay?.classList.remove('is-active');
      tableModal?.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    }

    tableTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const venue = btn.dataset.venue || 'latelier';
        openTableModal(venue);
      });
    });

    tableCloseBtn?.addEventListener('click', closeTableModal);

    const tableForm = document.getElementById('table-reservation-form');
    tableForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      closeTableModal();
      if (window.showToast) {
        window.showToast('Your dining table reservation inquiry has been confirmed. Our maître d’ will confirm your seating.');
      }
      tableForm.reset();
    });
  }

  /* =========================================================================
     6. TESTIMONIALS MODULE
     ========================================================================= */
  function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-arrow-btn.prev');
    const nextBtn = document.querySelector('.slider-arrow-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    const totalSlides = slides.length;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToSlide(idx);
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll('.slider-dot');

    function updateSlidePosition() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function goToSlide(index) {
      if (index < 0) currentIndex = totalSlides - 1;
      else if (index >= totalSlides) currentIndex = 0;
      else currentIndex = index;
      updateSlidePosition();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    const sliderWrap = document.querySelector('.testimonials-slider-wrap');
    sliderWrap?.addEventListener('mouseenter', stopAutoplay);
    sliderWrap?.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrap?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    sliderWrap?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) prevSlide();
        else nextSlide();
      }
      startAutoplay();
    }, { passive: true });

    startAutoplay();
  }

  /* =========================================================================
     7. ANIMATIONS & ACCORDION MODULE
     ========================================================================= */
  function initAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // Number Counters
    const counterElements = document.querySelectorAll('.counter-anim');
    let hasAnimatedCounters = false;

    function runCounters() {
      if (hasAnimatedCounters) return;
      hasAnimatedCounters = true;

      counterElements.forEach(el => {
        const target = parseFloat(el.dataset.target || '0');
        const isDecimal = el.dataset.decimal === 'true';
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;

          el.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }

    const statsSection = document.querySelector('.hero-stats-bar');
    if (statsSection && 'IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          runCounters();
          statsObserver.disconnect();
        }
      }, { threshold: 0.3 });
      statsObserver.observe(statsSection);
    } else {
      setTimeout(runCounters, 500);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      trigger?.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            const otherContent = other.querySelector('.faq-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        if (!isOpen) {
          item.classList.add('is-open');
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          item.classList.remove('is-open');
          content.style.maxHeight = null;
        }
      });
    });

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn?.classList.add('show');
      } else {
        backToTopBtn?.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn?.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Toast Notification System
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();

    function createToastContainer() {
      const container = document.createElement('div');
      container.classList.add('toast-container');
      document.body.appendChild(container);
      return container;
    }

    window.showToast = function(message) {
      const toast = document.createElement('div');
      toast.classList.add('toast');
      toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-gold-400); flex-shrink: 0;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${message}</span>
      `;

      toastContainer.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 20);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 4200);
    };

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value) {
        window.showToast('You have been cordially subscribed to The Aurelia Gazette. Welcome to our inner circle.');
        emailInput.value = '';
      }
    });
  }

  // Initialize All Systems on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initBooking();
    initRooms();
    initGallery();
    initDining();
    initTestimonials();
    initAnimations();

    console.log('%c AURELIA GRAND SUITES & SANCTUARY %c 5-Star Boutique Hotel Initialized ',
      'background: #121316; color: #C5A880; font-weight: bold; padding: 4px 8px; border: 1px solid #C5A880;',
      'background: #FDFBF7; color: #17181C; padding: 4px 8px;'
    );
  });

})();
