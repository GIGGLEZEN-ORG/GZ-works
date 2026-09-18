/**
 * Serenia Lake Resort & Spa - Component Architecture
 * Fully driven by /data/hotel.json
 */

let hotelData = null;
let currentGalleryCategory = 'all';
let currentTestimonialIndex = 0;
let currentLightboxIndex = 0;
let filteredGalleryItems = [];
let bookingDetailsCache = { nights: 3, baseRate: 480 };

document.addEventListener('DOMContentLoaded', () => {
    loadHotelData();
});

async function loadHotelData() {
    try {
        const response = await fetch('data/hotel.json');
        if (!response.ok) throw new Error('Failed to load hotel configuration.');
        hotelData = await response.json();
        
        applyTheme(hotelData.theme);
        renderNavigation();
        renderHero();
        renderBooking();
        renderStory();
        renderRooms();
        renderAmenities();
        renderDining();
        renderOffers();
        renderExperiences();
        renderGallery();
        renderTestimonials();
        renderFooter();
        
        initializeInteractivity();
    } catch (error) {
        console.error('Error initializing hotel template:', error);
        document.body.innerHTML = `<div style="padding: 4rem; text-align: center;"><h2>Error loading hotel data.</h2><p>${error.message}</p></div>`;
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--border-radius', theme.borderRadius);
    root.style.setProperty('--section-spacing', theme.sectionSpacing);

    const fontHeading = theme.fontHeading || 'Cormorant Garamond';
    const fontBody = theme.fontBody || 'Plus Jakarta Sans';
    root.style.setProperty('--font-heading', `"${fontHeading}", serif`);
    root.style.setProperty('--font-body', `"${fontBody}", sans-serif`);

    const fontLink = document.getElementById('dynamic-fonts');
    fontLink.href = `https://fonts.googleapis.com/css2?family=${fontHeading.replace(/ /g, '+')}:wght@400;500;600;700&family=${fontBody.replace(/ /g, '+')}:wght@300;400;500;600&display=swap`;

    document.title = `${hotelData.hotel.name} — ${hotelData.hotel.tagline}`;
}

// ==========================================================
// COMPONENT RENDERERS
// ==========================================================

function renderNavigation() {
    document.getElementById('brand-logo-container').textContent = hotelData.hotel.name;

    const desktopNav = document.getElementById('desktop-nav');
    desktopNav.innerHTML = hotelData.navigation.map(nav => `
        <a href="${nav.link}">${nav.label}</a>
    `).join('');

    const mobileNavLinks = document.getElementById('mobile-nav-links');
    mobileNavLinks.innerHTML = hotelData.navigation.map(nav => `
        <a href="${nav.link}" class="mobile-nav-link">${nav.label}</a>
    `).join('');
}

function renderHero() {
    const hero = hotelData.hero;
    document.getElementById('hero-bg').style.backgroundImage = `url('${hero.backgroundImage}')`;
    document.getElementById('hero-label').textContent = hero.label;
    document.getElementById('hero-title').textContent = hero.title;
    document.getElementById('hero-desc').textContent = hero.description;

    const buttonsContainer = document.getElementById('hero-buttons');
    buttonsContainer.innerHTML = `
        <a href="${hero.primaryButton.link}" class="btn btn-primary" data-open-reservation="true">${hero.primaryButton.text}</a>
        <a href="${hero.secondaryButton.link}" class="btn btn-outline-light">${hero.secondaryButton.text}</a>
    `;

    document.getElementById('cta-bg').style.backgroundImage = `url('${hero.backgroundImage}')`;
}

function renderBooking() {
    const booking = hotelData.booking;
    document.getElementById('booking-title').textContent = booking.title;
    document.getElementById('booking-btn-text').textContent = booking.buttonText;

    const fieldsContainer = document.getElementById('booking-fields-container');
    fieldsContainer.innerHTML = booking.fields.map(field => {
        if (field === 'checkIn') {
            return `<div class="booking-field-group"><label>Check In</label><input type="date" id="checkin-date" required></div>`;
        }
        if (field === 'checkOut') {
            return `<div class="booking-field-group"><label>Check Out</label><input type="date" id="checkout-date" required></div>`;
        }
        if (field === 'guests') {
            return `<div class="booking-field-group"><label>Guests</label><select id="guests-count"><option value="1">1 Guest</option><option value="2" selected>2 Guests</option><option value="3">3 Guests</option><option value="4">4+ Guests</option></select></div>`;
        }
        if (field === 'rooms') {
            return `<div class="booking-field-group"><label>Villas</label><select id="rooms-count"><option value="1" selected>1 Villa</option><option value="2">2 Villas</option></select></div>`;
        }
        return '';
    }).join('');
}

function renderStory() {
    const story = hotelData.story;
    document.getElementById('story-subtitle').textContent = story.subtitle;
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-desc').textContent = story.description;
    document.getElementById('story-img-1').src = story.image1;
    document.getElementById('story-img-2').src = story.image2;

    const highlightsContainer = document.getElementById('story-highlights');
    highlightsContainer.innerHTML = story.highlights.map(h => `
        <li><i class="fa-solid fa-check"></i> ${h}</li>
    `).join('');
}

function renderRooms() {
    const grid = document.getElementById('rooms-grid');
    grid.innerHTML = hotelData.rooms.map(room => createRoomCard(room)).join('');
}

function createRoomCard(room) {
    return `
        <article class="room-card">
            <div class="room-image-wrapper">
                <img src="${room.image}" alt="${room.name}">
                <div class="room-price-tag">${room.currency} ${room.price.toLocaleString()} / night</div>
            </div>
            <div class="room-content">
                <h3 class="room-title">${room.name}</h3>
                <p class="room-desc">${room.description}</p>
                <div class="room-features">
                    <span><i class="fa-solid fa-expand"></i> ${room.size}</span>
                    <span><i class="fa-solid fa-user-group"></i> ${room.guests} Guests</span>
                    <span><i class="fa-solid fa-bed"></i> ${room.bed}</span>
                </div>
                <div class="room-actions">
                    <button class="btn btn-secondary" onclick="openRoomModal(${room.id})">View Details</button>
                    <button class="btn btn-primary" onclick="openReservationDrawerFromCard(${room.price})">Reserve</button>
                </div>
            </div>
        </article>
    `;
}

function renderAmenities() {
    const grid = document.getElementById('amenities-grid');
    grid.innerHTML = hotelData.amenities.map(amenity => `
        <div class="amenity-card">
            <div class="amenity-icon"><i class="fa-solid fa-${getAmenityIcon(amenity.icon)}"></i></div>
            <h3 class="amenity-title">${amenity.title}</h3>
            <p class="amenity-desc">${amenity.description}</p>
        </div>
    `).join('');
}

function getAmenityIcon(iconName) {
    const map = {
        'spa': 'spa',
        'pool': 'water-ladder',
        'coffee': 'mug-hot',
        'concierge': 'bell-concierge',
        'wifi': 'wifi',
        'dumbbell': 'dumbbell'
    };
    return map[iconName] || 'star';
}

function renderDining() {
    const grid = document.getElementById('dining-grid');
    grid.innerHTML = hotelData.dining.map(d => `
        <div class="dining-card">
            <div class="dining-image"><img src="${d.image}" alt="${d.name}"></div>
            <div class="dining-content">
                <span class="dining-category">${d.category}</span>
                <h3 class="dining-title">${d.name}</h3>
                <p class="dining-desc">${d.description}</p>
            </div>
        </div>
    `).join('');
}

function renderOffers() {
    const grid = document.getElementById('offers-grid');
    grid.innerHTML = hotelData.offers.map(offer => `
        <div class="offer-card">
            <div class="offer-bg" style="background-image: url('${offer.image}')"></div>
            <div class="offer-overlay"></div>
            <div class="offer-content">
                <span class="offer-label">${offer.label}</span>
                <h3 class="offer-title">${offer.title}</h3>
                <p class="offer-desc">${offer.description}</p>
                <button class="btn btn-light" onclick="openReservationDrawerFromCard(480)">${offer.buttonText}</button>
            </div>
        </div>
    `).join('');
}

function renderExperiences() {
    const grid = document.getElementById('experiences-grid');
    grid.innerHTML = hotelData.experiences.map(exp => `
        <div class="experience-card">
            <h3 class="experience-title">${exp.title}</h3>
            <p class="experience-desc">${exp.description}</p>
        </div>
    `).join('');
}

function renderGallery(category = 'all') {
    currentGalleryCategory = category;
    filteredGalleryItems = category === 'all' 
        ? hotelData.gallery 
        : hotelData.gallery.filter(item => item.category.toLowerCase() === category.toLowerCase());

    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = filteredGalleryItems.map((item, index) => `
        <div class="gallery-item" onclick="openLightbox(${index})">
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-overlay">
                <span class="gallery-category">${item.category}</span>
                <h4 class="gallery-title">${item.title}</h4>
            </div>
        </div>
    `).join('');
}

function renderTestimonials() {
    const track = document.getElementById('testimonial-track');
    track.innerHTML = hotelData.testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-rating">${'★'.repeat(t.rating)}</div>
            <p class="testimonial-review">"${t.review}"</p>
            <div class="testimonial-author">
                <img src="${t.image}" alt="${t.name}" class="author-avatar">
                <div class="author-info">
                    <h5>${t.name}</h5>
                    <span>${t.role}</span>
                </div>
            </div>
        </div>
    `).join('');

    const dotsContainer = document.getElementById('slider-dots');
    dotsContainer.innerHTML = hotelData.testimonials.map((_, i) => `
        <div class="dot ${i === 0 ? 'active' : ''}" onclick="goToTestimonial(${i})"></div>
    `).join('');
}

function renderFooter() {
    const hotel = hotelData.hotel;
    document.getElementById('footer-logo').textContent = hotel.name;
    document.getElementById('footer-desc').textContent = hotelData.footer.description;

    const socialContainer = document.getElementById('social-links');
    socialContainer.innerHTML = Object.entries(hotelData.footer.socialLinks).map(([platform, link]) => `
        <a href="${link}" aria-label="${platform}"><i class="fa-brands fa-${platform}"></i></a>
    `).join('');

    const quickLinks = document.getElementById('footer-quick-links');
    quickLinks.innerHTML = hotelData.navigation.slice(0, 5).map(nav => `
        <li><a href="${nav.link}">${nav.label}</a></li>
    `).join('');

    const contactList = document.getElementById('footer-contact');
    contactList.innerHTML = `
        <li><i class="fa-solid fa-location-dot"></i> <span>${hotel.address}, ${hotel.location}</span></li>
        <li><i class="fa-solid fa-phone"></i> <span>${hotel.phone}</span></li>
        <li><i class="fa-solid fa-envelope"></i> <span>${hotel.email}</span></li>
    `;
}

// ==========================================================
// INTERACTIVE MANAGERS & MODALS
// ==========================================================

function openRoomModal(roomId) {
    const room = hotelData.rooms.find(r => r.id === roomId);
    if (!room) return;

    const modalBody = document.getElementById('modal-dynamic-body');
    modalBody.innerHTML = `
        <div class="modal-room-image">
            <img src="${room.image}" alt="${room.name}">
        </div>
        <span class="badge">${room.currency} ${room.price.toLocaleString()} per night</span>
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">${room.name}</h2>
        <p style="color: var(--muted); margin-bottom: 1.5rem;">${room.description}</p>
        <div class="room-features" style="margin-bottom: 2rem;">
            <span><i class="fa-solid fa-expand"></i> ${room.size}</span>
            <span><i class="fa-solid fa-user-group"></i> ${room.guests} Guests Max</span>
            <span><i class="fa-solid fa-bed"></i> ${room.bed}</span>
        </div>
        <h4 style="margin-bottom: 0.75rem;">Villa Amenities & Features</h4>
        <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 2rem;">
            ${room.features.map(f => `<li><i class="fa-solid fa-check" style="color: var(--accent);"></i> ${f}</li>`).join('')}
        </ul>
        <button class="btn btn-primary" style="width: 100%;" onclick="closeRoomModal(); openReservationDrawerFromCard(${room.price});">Reserve This Villa</button>
    `;

    document.getElementById('room-modal').classList.add('active');
}

function closeRoomModal() {
    document.getElementById('room-modal').classList.remove('active');
}

function openReservationDrawer(details) {
    bookingDetailsCache = details;
    updatePricingBreakdown();
    
    document.getElementById('reservation-submit-form').style.display = 'block';
    document.getElementById('reservation-success-msg').style.display = 'none';
    document.getElementById('reservation-modal').classList.add('active');
}

function openReservationDrawerFromCard(priceInINR) {
    // Convert INR to USD equivalent base rate for the drawer UI or keep standard conversion (~80 INR = 1 USD)
    const baseRateUSD = Math.round(priceInINR / 80);
    openReservationDrawer({
        nights: 3,
        baseRate: baseRateUSD > 0 ? baseRateUSD : 480
    });
}

function closeReservationDrawer() {
    document.getElementById('reservation-modal').classList.remove('active');
}

function updatePricingBreakdown() {
    const { nights, baseRate } = bookingDetailsCache;
    const subtotal = nights * baseRate;
    const taxes = Math.round(subtotal * 0.12);
    
    let enhancementsTotal = document.getElementById('add-champagne')?.checked ? 95 : 0;
    if (document.getElementById('add-spa')?.checked) {
        enhancementsTotal += 80;
    }

    const estimatedTotal = subtotal + taxes + enhancementsTotal;

    const pricingBox = document.getElementById('reservation-pricing-box');
    pricingBox.innerHTML = `
        <div class="pricing-row"><span>Duration:</span><span>${nights} nights</span></div>
        <div class="pricing-row"><span>Base Suite Rate:</span><span>$${baseRate}</span></div>
        <div class="pricing-row"><span>Subtotal:</span><span>$${subtotal}</span></div>
        <div class="pricing-row"><span>Taxes & Hospitality Fees (12%):</span><span>$${taxes}</span></div>
        ${enhancementsTotal > 0 ? `<div class="pricing-row"><span>Enhancements:</span><span>$${enhancementsTotal}</span></div>` : ''}
        <div class="pricing-row total"><span>Estimated Total:</span><span>$${estimatedTotal} USD</span></div>
    `;
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    document.getElementById('lightbox-modal').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox-modal').classList.remove('active');
}

function updateLightboxContent() {
    const item = filteredGalleryItems[currentLightboxIndex];
    document.getElementById('lightbox-img').src = item.image;
    document.getElementById('lightbox-caption').textContent = `${item.title} — ${item.category}`;
}

function goToTestimonial(index) {
    currentTestimonialIndex = index;
    const track = document.getElementById('testimonial-track');
    track.style.transform = `translateX(-${index * 100}%)`;

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function initializeInteractivity() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('site-header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });

    const reserveButtons = document.querySelectorAll('.nav-cta, [data-open-reservation="true"]');
    reserveButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openReservationDrawer({
                nights: 3,
                baseRate: 480
            });
        });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderGallery(e.target.getAttribute('data-filter'));
        });
    });

    document.getElementById('next-testimonial').addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % hotelData.testimonials.length;
        goToTestimonial(currentTestimonialIndex);
    });

    document.getElementById('prev-testimonial').addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + hotelData.testimonials.length) % hotelData.testimonials.length;
        goToTestimonial(currentTestimonialIndex);
    });

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-next').addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % filteredGalleryItems.length;
        updateLightboxContent();
    });
    document.getElementById('lightbox-prev').addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + filteredGalleryItems.length) % filteredGalleryItems.length;
        updateLightboxContent();
    });

    document.getElementById('modal-close-btn').addEventListener('click', closeRoomModal);
    document.getElementById('room-modal').addEventListener('click', (e) => {
        if (e.target.id === 'room-modal') closeRoomModal();
    });

    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const checkinInput = document.getElementById('checkin-date');
            const checkoutInput = document.getElementById('checkout-date');
            const feedback = document.getElementById('booking-feedback');

            if (!checkinInput || !checkoutInput || !feedback) return;

            if (!checkinInput.value || !checkoutInput.value) {
                feedback.textContent = 'Please select both check-in and check-out dates.';
                feedback.className = 'booking-feedback error';
                return;
            }

            const checkinDate = new Date(checkinInput.value);
            const checkoutDate = new Date(checkoutInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkinDate < today) {
                feedback.textContent = 'Check-in date cannot be in the past.';
                feedback.className = 'booking-feedback error';
                return;
            }

            if (checkoutDate <= checkinDate) {
                feedback.textContent = 'Check-out date must be after check-in date.';
                feedback.className = 'booking-feedback error';
                return;
            }

            const diffTime = Math.abs(checkoutDate - checkinDate);
            const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            feedback.textContent = '';
            openReservationDrawer({
                nights: nights,
                baseRate: 480
            });
        });
    }

    ['add-champagne', 'add-spa'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', updatePricingBreakdown);
        }
    });

    document.getElementById('reservation-close-btn')?.addEventListener('click', closeReservationDrawer);
    document.getElementById('reservation-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'reservation-modal') closeReservationDrawer();
    });

    document.getElementById('reservation-submit-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('reservation-submit-form').style.display = 'none';
        document.getElementById('reservation-success-msg').style.display = 'block';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeRoomModal();
            closeReservationDrawer();
            mobileNav.classList.remove('open');
        }
    });
}