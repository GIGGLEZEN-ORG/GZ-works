/**
 * ============================================================================
 * LUMINA RESORT & SPA — VANILLA JAVASCRIPT MASTER SUITE
 * Pure HTML5/CSS3/Vanilla JS Architecture — Zero Framework Dependencies
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClockAndWeather();
  initScrollEffects();
  initNavigation();
  initStatsCounters();
  initRoomsFilter();
  initSuiteDetailsModal();
  initDiningAndSpaModals();
  initResortMapHotspots();
  initGalleryLightbox();
  initReviewsCarousel();
  initNewsletterForm();
  initBookingEngine();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Live Time & Weather Engine (Côte d'Azur, French Riviera)
   -------------------------------------------------------------------------- */
function initLiveClockAndWeather() {
  const timeEl = document.getElementById('live-resort-time');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    // French Riviera UTC+2
    const options = {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    timeEl.textContent = `${now.toLocaleTimeString('en-US', options)} CET`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   2. Scroll Effects (Sticky Glass Navbar, Progress Bar, Back-To-Top)
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const navbar = document.getElementById('main-navbar');
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    // Progress Bar
    if (progressBar) {
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Sticky Navbar Glass Effect
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to Top Visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }

    // Active Nav Link Scrollspy
    highlightActiveNavLink();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollPosition = window.scrollY + 200;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('mobile-nav-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --------------------------------------------------------------------------
   4. Stats Animated Counters
   -------------------------------------------------------------------------- */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 2000;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(count) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const ribbon = document.querySelector('.stats-ribbon');
  if (ribbon) observer.observe(ribbon);
}

/* --------------------------------------------------------------------------
   5. Accommodations Filter System
   -------------------------------------------------------------------------- */
function initRoomsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const roomCards = document.querySelectorAll('.room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Suite Details Drawer & Quick Reserve
   -------------------------------------------------------------------------- */
const SUITE_DATA = {
  'deluxe-ocean': {
    name: 'Deluxe Ocean View Villa',
    rate: 650,
    size: '65 m² / 700 sq.ft',
    guests: '2 Adults, 1 Child',
    bed: '1 Signature King Bed',
    view: 'Panoramic Mediterranean Coast',
    img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    description: 'A tranquil sanctuary perched above the azure waters featuring an expansive private sun terrace, bespoke Italian marble bathroom with freestanding soaking tub, and custom minimalist wood finishes.',
    amenities: ['Private Teak Sun Deck', 'Hermès Paris Bath Products', 'Bang & Olufsen Acoustic Sound', 'Sub-Zero Wine Cellar Bar', '24/7 Dedicated Butler Service', 'Complimentary High-Speed Wi-Fi']
  },
  'executive-suite': {
    name: 'Executive Horizon Suite',
    rate: 1100,
    size: '95 m² / 1,020 sq.ft',
    guests: '3 Adults',
    bed: '1 Grand Emperor King',
    view: 'Unobstructed Horizon & Sunset',
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: 'Sophisticated multi-room suite complete with private infinity dip pool, separate executive salon, walk-in dressing room, and floor-to-ceiling glass doors opening directly to the ocean breeze.',
    amenities: ['Private Heated Plunge Pool', 'Dyson Supersonic Care Suite', 'Champagne Welcome Bar', 'In-Suite Breakfast Service', 'Bespoke Pillow & Linen Menu', 'Private Airport Chauffeur']
  },
  'overwater-pavilion': {
    name: 'Overwater Lagoon Pavilion',
    rate: 1650,
    size: '130 m² / 1,400 sq.ft',
    guests: '2 Adults',
    bed: '1 Custom Floating King',
    view: '360° Emerald Lagoon Waters',
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    description: 'Suspended directly over tranquil crystalline waters, this iconic pavilion features glass floor viewing portals, an overwater hammock net, direct ocean lagoon ladder access, and an outdoor rain shower.',
    amenities: ['Glass Lagoon Floor Viewing', 'Direct Lagoon Access Ladder', 'Overwater Lounging Hammock', 'Sommelier Curated Wine Cellar', 'Private Sunset Yacht Charter Inclusion', 'Personal Wellness Concierge']
  },
  'royal-penthouse': {
    name: 'Royal Penthouse Sanctuary',
    rate: 2800,
    size: '220 m² / 2,368 sq.ft',
    guests: '6 Guests (3 Suites)',
    bed: '3 Master King Suites',
    view: 'Top-Floor Riviera Panorama',
    img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    description: 'The pinnacle of luxury living. Occupying the entire top level with a private wrap-around rooftop garden, heated swimming pool, private cinema room, full chef kitchen, and dedicated 24-hour butler staff.',
    amenities: ['Private Rooftop Swimming Pool', 'Helipad Fast-Track VIP Transfer', 'Dedicated Private Master Chef', 'Full Gaggenau Gourmet Kitchen', 'Private Spa & Sauna Suite', 'Rolls-Royce Ghost Chauffeur']
  },
  'wellness-residence': {
    name: 'Botanical Wellness Residence',
    rate: 1350,
    size: '115 m² / 1,238 sq.ft',
    guests: '2 Adults',
    bed: '1 Organic Latex King Bed',
    view: 'Private Zen Botanical Garden',
    img: 'https://images.unsplash.com/photo-1582719478250-c89af14cf738?auto=format&fit=crop&w=1200&q=80',
    description: 'Designed exclusively for restorative vitality, featuring a private cedarwood Finnish sauna, cold plunge pool, Himalayan salt therapy wall, and personalized daily Ayurvedic wellness infusions.',
    amenities: ['Private Finnish Cedar Sauna', 'Hydrothermal Cold Plunge Tub', 'Himalayan Salt Therapy Room', 'Daily In-Suite Ayurvedic Massage', 'Organic Botanical Herbal Bar', 'Aromatherapy Sleep System']
  },
  'cliffside-villa': {
    name: 'Cliffside Sunset Villa',
    rate: 2100,
    size: '180 m² / 1,937 sq.ft',
    guests: '4 Guests (2 Bedrooms)',
    bed: '2 King Suites',
    view: 'Dramatic Coastal Cliffside',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    description: 'Architecturally sculpted into the natural granite cliffs with dramatic multi-tiered cantilevered sun decks, an infinity edge pool melting into the Mediterranean, and a sunken starlight firepit lounge.',
    amenities: ['Cantilevered Cliffside Deck', 'Sunken Starlight Firepit Lounge', 'Heated Infinity Horizon Pool', 'Private Sunset Cocktail Bartender', 'Direct Private Cove Beach Access', 'Luxury Catamaran Half-Day Sail']
  }
};

function initSuiteDetailsModal() {
  const modal = document.getElementById('suite-details-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('suite-modal-close');
  const bookBtn = document.getElementById('suite-modal-book-now');
  let currentSuiteKey = 'deluxe-ocean';

  window.openSuiteModal = function(suiteKey) {
    const suite = SUITE_DATA[suiteKey] || SUITE_DATA['deluxe-ocean'];
    currentSuiteKey = suiteKey;

    document.getElementById('suite-detail-title').textContent = suite.name;
    document.getElementById('suite-detail-price').textContent = `$${suite.rate} / night`;
    document.getElementById('suite-detail-img').src = suite.img;
    document.getElementById('suite-detail-desc').textContent = suite.description;
    document.getElementById('suite-detail-size').textContent = suite.size;
    document.getElementById('suite-detail-guests').textContent = suite.guests;
    document.getElementById('suite-detail-bed').textContent = suite.bed;
    document.getElementById('suite-detail-view').textContent = suite.view;

    const amenitiesList = document.getElementById('suite-detail-amenities');
    amenitiesList.innerHTML = '';
    suite.amenities.