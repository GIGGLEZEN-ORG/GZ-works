/**
 * Aurelia Grand Suites & Sanctuary
 * Module: Rooms & Suites (Category Filtering & Suite Quick View Modal)
 */

export function initRooms() {
  const filterPills = document.querySelectorAll('.rooms-filter .filter-pill');
  const roomCards = document.querySelectorAll('.room-card');
  const suiteModal = document.querySelector('.suite-modal-container');
  const modalOverlay = document.querySelector('.modal-overlay');
  const suiteModalClose = document.querySelector('.suite-modal-close');

  // Room details database for dynamic modal rendering
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

  // 1. Category Filter Logic
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

  // 2. Suite Details Modal Trigger
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

  // Close with Esc key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && suiteModal?.classList.contains('is-active')) {
      closeSuiteModal();
    }
  });
}
