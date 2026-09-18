/**
 * Aurelia Grand Suites & Sanctuary
 * Module: Booking (Floating bar, Guest Counter Popover, Reservation Drawer)
 */

export function initBooking() {
  // 1. Datepicker Initial Setup & Validation
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

  // 2. Floating Guest Selector Popover
  const guestTriggerBtn = document.getElementById('guest-trigger-btn');
  const guestPopover = document.getElementById('guest-popover');
  const guestSummaryText = document.getElementById('guest-summary-text');

  let bookingState = {
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

    // Update Drawer text too
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

    // Guest Counter Buttons
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

        // Button disabled state
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

  // 3. Reservation Drawer Management
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

  // Suite select listener
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

  // Calculate pricing breakdown
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

    // Check add-ons
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

  // Addon Checkbox listeners
  document.querySelectorAll('.js-addon-checkbox').forEach((cb) => {
    cb.addEventListener('change', updateReservationPricing);
  });

  // Handle Reservation Form Submit
  const reservationForm = document.getElementById('reservation-form');
  reservationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const guestName = document.getElementById('guest-fullname')?.value || 'Distinguished Guest';

    // Show instant success feedback
    closeReservationDrawer();
    if (window.showToast) {
      window.showToast(`Thank you, ${guestName}! Your reservation request for ${bookingState.suiteName} has been received. Our concierge will contact you momentarily.`);
    }
    reservationForm.reset();
  });

  // Export method for other modules
  window.openBookingWithSuite = openReservationDrawer;
}
