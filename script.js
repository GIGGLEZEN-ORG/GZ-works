/**
 * ==========================================================================
 * AURA LUXURY HOTEL & RESORT - CLIENT JS APPLICATION
 * Pure HTML, CSS, JavaScript & JSON Architecture
 * ==========================================================================
 */

// Global Safe Image Fallback Handler (No quote syntax errors)
window.handleImgError = function(img, emoji, title) {
  img.onerror = null;
  const cleanTitle = (title || "AURA Luxury").replace(/['"]/g, "");
  const cleanEmoji = emoji || "✨";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14171d"/>
        <stop offset="50%" stop-color="#1e232d"/>
        <stop offset="100%" stop-color="#0b0d10"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#aa7c11"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#bg)"/>
    <circle cx="300" cy="160" r="65" fill="#14171d" stroke="url(#gold)" stroke-width="2"/>
    <text x="300" y="175" font-size="54" text-anchor="middle" dominant-baseline="central">${cleanEmoji}</text>
    <rect x="50" y="270" width="500" height="2" fill="url(#gold)" opacity="0.6"/>
    <text x="300" y="310" font-family="serif" font-size="22" font-weight="600" fill="#f8f5ee" text-anchor="middle">${cleanTitle}</text>
  </svg>`;
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

document.addEventListener("DOMContentLoaded", () => {
  // Global State Containers
  let hotelConfig = {
    hotelName: "AURA",
    tagline: "Where Luxury Meets Your Aura",
    description: "Experience refined hospitality, exceptional dining, personalized services, and unforgettable moments at AURA.",
    phone: "+91 98765 43210",
    email: "concierge@aurahotel.com",
    address: "108 Luxury Boulevard, Beachfront Enclave, Chennai, Tamil Nadu, India",
    currency: "₹"
  };

  let guestProfile = {
    name: "Chaithanya",
    email: "chaithanya@example.com",
    phone: "+91 98765 43210",
    bookingId: "AURA1025",
    roomNumber: "Suite 402",
    checkIn: "2026-09-15",
    checkOut: "2026-09-18"
  };

  // Live Room Vacancy Inventory State
  let roomVacancyState = {
    "Executive Deluxe Suite": { count: 3, price: 3500, features: ["King Bed", "Ocean View", "Private Balcony", "Jacuzzi Bath"] },
    "Royal Ocean Villa": { count: 2, price: 6800, features: ["2 Bedrooms", "Private Plunge Pool", "24/7 Butler", "Beach Access"] },
    "Presidential Penthouse": { count: 1, price: 12000, features: ["Top Floor 360 View", "Private Helipad Transfer", "Personal Chef", "Spa Suite"] }
  };

  let servicesData = [];
  let kitchenData = [];
  let entertainmentData = [];
  let billingData = {
    services: [],
    foodOrders: [],
    entertainment: [],
    taxRate: 0.18,
    paymentStatus: "Unpaid / Pending Checkout"
  };

  let currentFoodCart = [];
  let selectedStarRating = 5;

  const ratingLabels = {
    1: "1 ⭐ → Very Poor",
    2: "2 ⭐ → Poor",
    3: "3 ⭐ → Average",
    4: "4 ⭐ → Good",
    5: "5 ⭐ → Excellent"
  };

  /* ==========================================================================
     1. INITIALIZATION & DATA FETCHING
     ========================================================================== */

  function initApp() {
    loadProfileFromStorage();
    loadVacancyFromStorage();
    fetchConfig();
    fetchServices();
    fetchKitchen();
    fetchEntertainment();
    fetchBilling();
    loadReviewsFromStorage();
    renderVacancyWidget();
    setupNavigation();
    setupEventListeners();
  }

  function fetchConfig() {
    fetch("config.json")
      .then(res => res.json())
      .then(data => {
        hotelConfig = { ...hotelConfig, ...data };
        applyConfigToDOM();
      })
      .catch(err => {
        console.warn("Using fallback config data:", err);
        applyConfigToDOM();
      });
  }

  function applyConfigToDOM() {
    document.querySelectorAll(".hotel-name").forEach(el => el.textContent = hotelConfig.hotelName);
    document.querySelectorAll(".hotel-tagline").forEach(el => el.textContent = hotelConfig.tagline);
    document.querySelectorAll(".hotel-description").forEach(el => el.textContent = hotelConfig.description);
    document.querySelectorAll(".hotel-phone").forEach(el => el.textContent = hotelConfig.phone);
    document.querySelectorAll(".hotel-email").forEach(el => el.textContent = hotelConfig.email);
    document.querySelectorAll(".hotel-address").forEach(el => el.textContent = hotelConfig.address);
    document.querySelectorAll(".hotel-currency").forEach(el => el.textContent = hotelConfig.currency);
  }

  /* ==========================================================================
     ROOM VACANCY INVENTORY ENGINE
     ========================================================================== */
  function loadVacancyFromStorage() {
    try {
      const saved = localStorage.getItem("aura_vacancies");
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(k => {
          if (roomVacancyState[k]) {
            roomVacancyState[k].count = parsed[k].count;
          }
        });
      }
    } catch(e) {}
  }

  function saveVacancyToStorage() {
    try {
      localStorage.setItem("aura_vacancies", JSON.stringify(roomVacancyState));
    } catch(e) {}
  }

  function getTotalVacantRooms() {
    let sum = 0;
    Object.keys(roomVacancyState).forEach(k => {
      sum += roomVacancyState[k].count;
    });
    return sum;
  }

  function renderVacancyWidget() {
    const grid = document.getElementById("vacancy-rooms-grid");
    const summaryText = document.getElementById("vacancy-summary-text");
    const statusDot = document.querySelector("#vacancy-total-badge .dot-indicator");
    const bookMainBtn = document.getElementById("home-book-vacant-btn");

    const totalVacant = getTotalVacantRooms();

    if (summaryText && statusDot) {
      if (totalVacant > 0) {
        summaryText.textContent = `${totalVacant} Luxury Suite${totalVacant > 1 ? 's' : ''} Currently Vacant`;
        statusDot.className = "dot-indicator green";
        if (bookMainBtn) {
          bookMainBtn.disabled = false;
          bookMainBtn.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Book Vacant Room Now`;
        }
      } else {
        summaryText.textContent = `All Luxury Suites Currently Fully Booked!`;
        statusDot.className = "dot-indicator red";
        if (bookMainBtn) {
          bookMainBtn.disabled = true;
          bookMainBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Fully Booked - No Vacancy`;
        }
      }
    }

    if (!grid) return;
    grid.innerHTML = "";

    Object.keys(roomVacancyState).forEach(roomType => {
      const info = roomVacancyState[roomType];
      const card = document.createElement("div");
      card.className = "room-vacancy-card";

      const isVacant = info.count > 0;
      const pillClass = isVacant ? "" : "soldout";
      const pillText = isVacant ? `${info.count} Vacant` : "Fully Booked";

      const featuresHtml = info.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join("");

      card.innerHTML = `
        <div class="room-title-row">
          <h4>${roomType}</h4>
          <span class="vacant-pill ${pillClass}">${pillText}</span>
        </div>
        <div class="room-price-tag">${hotelConfig.currency}${info.price.toLocaleString()} <small>/ night</small></div>
        <ul class="room-features-list">
          ${featuresHtml}
        </ul>
        <button class="btn ${isVacant ? 'btn-gold' : 'btn-outline-light'} btn-block book-this-room-btn" data-type="${roomType}" ${isVacant ? '' : 'disabled'}>
          ${isVacant ? '<i class="fa-solid fa-calendar-day"></i> Book This Suite' : 'Sold Out'}
        </button>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll(".book-this-room-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-type");
        const select = document.getElementById("res-room-type");
        if (select) select.value = type;
        updateModalVacancyNotice(type);
        openModal(document.getElementById("booking-modal"));
      });
    });
  }

  function updateModalVacancyNotice(selectedType) {
    const notice = document.getElementById("modal-vacancy-notice");
    const noticeText = document.getElementById("modal-vacancy-text");
    const submitBtn = document.getElementById("res-submit-btn");

    if (!notice || !noticeText) return;

    const info = roomVacancyState[selectedType];
    if (info && info.count > 0) {
      notice.className = "vacancy-notice-banner";
      noticeText.innerHTML = `<strong>${selectedType}</strong> has <strong>${info.count}</strong> vacant room${info.count > 1 ? 's' : ''} available.`;
      if (submitBtn) submitBtn.disabled = false;
    } else {
      notice.className = "vacancy-notice-banner soldout";
      noticeText.innerHTML = `<strong>${selectedType}</strong> is currently <strong>Fully Booked</strong>. Please select another vacant suite.`;
      if (submitBtn) submitBtn.disabled = true;
    }
  }

  /* ==========================================================================
     2. SERVICES, KITCHEN, ENTERTAINMENT & BILLING FETCHING
     ========================================================================== */

  function fetchServices() {
    fetch("services.json")
      .then(res => res.json())
      .then(data => {
        servicesData = data;
        renderServices(servicesData);
      })
      .catch(err => console.error("Error fetching services.json:", err));
  }

  function renderServices(services) {
    const grid = document.getElementById("services-grid");
    if (!grid) return;
    grid.innerHTML = "";

    services.forEach(srv => {
      const card = document.createElement("div");
      card.className = "service-card";
      
      const priceText = srv.price > 0 
        ? `${hotelConfig.currency}${srv.price.toLocaleString()}` 
        : "Complimentary";
      const priceClass = srv.price === 0 ? "free" : "";
      const safeName = (srv.name || "").replace(/'/g, "");
      const emoji = srv.emoji || "🛎️";

      card.innerHTML = `
        <div class="service-img-wrapper">
          <img src="${srv.image}" alt="${safeName}" onerror="handleImgError(this, '${emoji}', '${safeName}')">
          <span class="service-price-tag ${priceClass}">${priceText}</span>
        </div>
        <div class="service-body">
          <div class="service-header-inline">
            <span class="service-emoji-icon">${emoji}</span>
            <h3 class="service-title">${srv.name}</h3>
          </div>
          <p class="service-desc">${srv.description}</p>
          <button class="btn btn-outline-gold btn-block request-srv-btn" data-id="${srv.id}" data-name="${safeName}" data-price="${srv.price}">
            <i class="fa-solid fa-bell"></i> Request Service
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll(".request-srv-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price")) || 0;
        requestServiceItem(name, price);
      });
    });
  }

  function fetchKitchen() {
    fetch("kitchen.json")
      .then(res => res.json())
      .then(data => {
        kitchenData = data;
        renderKitchenItems(kitchenData);
      })
      .catch(err => console.error("Error fetching kitchen.json:", err));
  }

  function renderKitchenItems(items) {
    const grid = document.getElementById("food-grid");
    if (!grid) return;
    grid.innerHTML = "";

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "food-card";
      card.setAttribute("data-category", item.category);

      const popBadge = item.popular ? `<span class="pop-badge">Chef Choice</span>` : "";
      const safeName = (item.name || "").replace(/'/g, "");

      card.innerHTML = `
        <div class="food-img-box">
          <img src="${item.image}" alt="${safeName}" onerror="handleImgError(this, '🍽️', '${safeName}')">
          ${popBadge}
        </div>
        <div class="food-body">
          <h4 class="food-title">${item.name}</h4>
          <p class="food-desc">${item.description}</p>
          <div class="food-row-bottom">
            <span class="food-price">${hotelConfig.currency}${item.price}</span>
            <div class="qty-control" id="qty-ctrl-${item.id}">
              <button class="qty-btn minus-btn" data-id="${item.id}">-</button>
              <span class="qty-count" id="count-${item.id}">1</span>
              <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="btn btn-gold btn-block food-add-btn" data-id="${item.id}">
            <i class="fa-solid fa-plus"></i> Add to Order
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll(".plus-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const countEl = document.getElementById(`count-${id}`);
        let current = parseInt(countEl.textContent, 10);
        countEl.textContent = current + 1;
      });
    });

    grid.querySelectorAll(".minus-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const countEl = document.getElementById(`count-${id}`);
        let current = parseInt(countEl.textContent, 10);
        if (current > 1) {
          countEl.textContent = current - 1;
        }
      });
    });

    grid.querySelectorAll(".food-add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const foodItem = kitchenData.find(f => f.id === id);
        const countEl = document.getElementById(`count-${id}`);
        const qty = parseInt(countEl.textContent, 10);
        
        if (foodItem) {
          addToFoodCart(foodItem, qty);
          countEl.textContent = "1";
        }
      });
    });
  }

  function fetchEntertainment() {
    fetch("entertainment.json")
      .then(res => res.json())
      .then(data => {
        entertainmentData = data;
        renderEntertainment(entertainmentData);
      })
      .catch(err => console.error("Error fetching entertainment.json:", err));
  }

  function renderEntertainment(activities) {
    const grid = document.getElementById("entertainment-grid");
    if (!grid) return;
    grid.innerHTML = "";

    activities.forEach(act => {
      const card = document.createElement("div");
      card.className = "event-card";

      const feeText = act.price > 0 
        ? `${hotelConfig.currency}${act.price}` 
        : "Free Event";
      const feeClass = act.isFree ? "free" : "";
      const safeName = (act.name || "").replace(/'/g, "");
      const icon = act.icon || "🎭";

      card.innerHTML = `
        <div class="event-img-box">
          <img src="${act.image}" alt="${safeName}" onerror="handleImgError(this, '${icon}', '${safeName}')">
          <span class="event-fee-tag ${feeClass}">${feeText}</span>
        </div>
        <div class="event-body">
          <div class="event-icon-title">
            <span style="font-size:1.4rem;">${icon}</span>
            <h3>${act.name}</h3>
          </div>
          <p class="service-desc">${act.description}</p>
          <ul class="event-meta-list">
            <li><i class="fa-solid fa-clock"></i> ${act.dateTime}</li>
            <li><i class="fa-solid fa-location-dot"></i> ${act.location}</li>
          </ul>
          <button class="btn btn-outline-gold btn-block reserve-act-btn" data-id="${act.id}" data-name="${safeName}" data-price="${act.price}">
            <i class="fa-solid fa-ticket"></i> Reserve Activity
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll(".reserve-act-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const price = parseFloat(btn.getAttribute("data-price")) || 0;
        reserveEntertainmentActivity(name, price);
      });
    });
  }

  function fetchBilling() {
    fetch("billing.json")
      .then(res => res.json())
      .then(data => {
        billingData = data;
        loadBillingFromStorage();
        renderBillingInvoice();
      })
      .catch(err => {
        console.warn("Using default billing structure:", err);
        loadBillingFromStorage();
        renderBillingInvoice();
      });
  }

  /* ==========================================================================
     3. CART & ORDER SUMMARY LOGIC
     ========================================================================== */

  function addToFoodCart(item, qty) {
    const existingIndex = currentFoodCart.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      currentFoodCart[existingIndex].qty += qty;
    } else {
      currentFoodCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: qty
      });
    }

    renderCartSummary();
    showToast(`Added ${qty}x ${item.name} to order summary!`, "fa-utensils");
  }

  function renderCartSummary() {
    const listEl = document.getElementById("order-items-list");
    const countBadge = document.getElementById("cart-item-count");
    const subtotalEl = document.getElementById("cart-subtotal");
    const taxEl = document.getElementById("cart-tax");
    const totalEl = document.getElementById("cart-total");
    const placeBtn = document.getElementById("place-food-order-btn");

    if (!listEl) return;

    if (currentFoodCart.length === 0) {
      listEl.innerHTML = `
        <div class="empty-cart-msg">
          <i class="fa-solid fa-bowl-food"></i>
          <p>Your culinary order is empty.</p>
          <small>Select food items to add to your order.</small>
        </div>
      `;
      countBadge.textContent = "0 items";
      subtotalEl.textContent = "0";
      taxEl.textContent = "0";
      totalEl.textContent = "0";
      placeBtn.disabled = true;
      return;
    }

    let subtotal = 0;
    let totalItems = 0;
    listEl.innerHTML = "";

    currentFoodCart.forEach((cartItem, index) => {
      const itemTotal = cartItem.price * cartItem.qty;
      subtotal += itemTotal;
      totalItems += cartItem.qty;

      const itemRow = document.createElement("div");
      itemRow.className = "cart-item-row";
      itemRow.innerHTML = `
        <div class="cart-item-info">
          <h5>${cartItem.name}</h5>
          <small>${cartItem.qty} × ${hotelConfig.currency}${cartItem.price}</small>
        </div>
        <div style="display:flex; align-items:center;">
          <span class="cart-item-price">${hotelConfig.currency}${itemTotal}</span>
          <button class="remove-cart-item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;
      listEl.appendChild(itemRow);
    });

    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + tax;

    countBadge.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
    subtotalEl.textContent = subtotal.toLocaleString();
    taxEl.textContent = tax.toLocaleString();
    totalEl.textContent = grandTotal.toLocaleString();
    placeBtn.disabled = false;

    listEl.querySelectorAll(".remove-cart-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"), 10);
        currentFoodCart.splice(index, 1);
        renderCartSummary();
      });
    });
  }

  function requestServiceItem(name, price) {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newService = { name: name, amount: price, date: todayStr };

    billingData.services.push(newService);
    saveBillingToStorage();
    renderBillingInvoice();

    showToast(`Service Request Placed: ${name}`, "fa-bell-concierge");
  }

  function placeFoodOrder() {
    if (currentFoodCart.length === 0) return;

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    currentFoodCart.forEach(ci => {
      billingData.foodOrders.push({
        name: `${ci.name} (${ci.qty}x)`,
        amount: ci.price * ci.qty,
        date: todayStr
      });
    });

    saveBillingToStorage();
    renderBillingInvoice();

    currentFoodCart = [];
    renderCartSummary();

    showToast("Food order placed successfully! Room service is preparing your meal.", "fa-check-circle");
  }

  function reserveEntertainmentActivity(name, price) {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newEnt = { name: name, amount: price, date: todayStr };

    billingData.entertainment.push(newEnt);
    saveBillingToStorage();
    renderBillingInvoice();

    showToast(`Activity Reserved: ${name}`, "fa-ticket");
  }

  /* ==========================================================================
     4. BILLING CALCULATIONS & RENDER
     ========================================================================== */

  function renderBillingInvoice() {
    const srvBody = document.getElementById("bill-services-body");
    const foodBody = document.getElementById("bill-kitchen-body");
    const entBody = document.getElementById("bill-entertainment-body");

    if (!srvBody) return;

    let subtotal = 0;

    srvBody.innerHTML = "";
    if (billingData.services.length === 0) {
      srvBody.innerHTML = `<tr><td colspan="3" class="text-muted">No requested services billed.</td></tr>`;
    } else {
      billingData.services.forEach(s => {
        subtotal += s.amount;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${s.name}</td>
          <td>${s.date || 'Active Stay'}</td>
          <td class="text-right">${hotelConfig.currency}${s.amount.toLocaleString()}</td>
        `;
        srvBody.appendChild(tr);
      });
    }

    foodBody.innerHTML = "";
    if (billingData.foodOrders.length === 0) {
      foodBody.innerHTML = `<tr><td colspan="3" class="text-muted">No kitchen food orders billed.</td></tr>`;
    } else {
      billingData.foodOrders.forEach(f => {
        subtotal += f.amount;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${f.name}</td>
          <td>1</td>
          <td class="text-right">${hotelConfig.currency}${f.amount.toLocaleString()}</td>
        `;
        foodBody.appendChild(tr);
      });
    }

    entBody.innerHTML = "";
    if (billingData.entertainment.length === 0) {
      entBody.innerHTML = `<tr><td colspan="3" class="text-muted">No entertainment activity fees billed.</td></tr>`;
    } else {
      billingData.entertainment.forEach(e => {
        subtotal += e.amount;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${e.name}</td>
          <td>${e.date || 'Active Stay'}</td>
          <td class="text-right">${hotelConfig.currency}${e.amount.toLocaleString()}</td>
        `;
        entBody.appendChild(tr);
      });
    }

    const tax = Math.round(subtotal * (billingData.taxRate || 0.18));
    const grandTotal = subtotal + tax;

    document.getElementById("bill-guest-name").textContent = guestProfile.name;
    document.getElementById("bill-booking-id").textContent = guestProfile.bookingId;
    document.getElementById("bill-room-number").textContent = guestProfile.roomNumber;
    document.getElementById("bill-checkin").textContent = formatDateShort(guestProfile.checkIn);
    document.getElementById("bill-checkout").textContent = formatDateShort(guestProfile.checkOut);
    document.getElementById("bill-payment-status").textContent = billingData.paymentStatus || "Unpaid / Pending Checkout";

    document.getElementById("bill-subtotal").textContent = subtotal.toLocaleString();
    document.getElementById("bill-taxes").textContent = tax.toLocaleString();
    document.getElementById("bill-grand-total").textContent = grandTotal.toLocaleString();

    const quickBill = document.getElementById("guest-quick-bill");
    if (quickBill) quickBill.textContent = grandTotal.toLocaleString();

    populateModalInvoice(subtotal, tax, grandTotal);
  }

  function populateModalInvoice(subtotal, tax, grandTotal) {
    document.getElementById("modal-inv-id").textContent = guestProfile.bookingId;
    document.getElementById("modal-inv-guest").textContent = guestProfile.name;
    document.getElementById("modal-inv-room").textContent = guestProfile.roomNumber;
    document.getElementById("modal-inv-status").textContent = billingData.paymentStatus;

    document.getElementById("modal-inv-subtotal").textContent = subtotal.toLocaleString();
    document.getElementById("modal-inv-tax").textContent = tax.toLocaleString();
    document.getElementById("modal-inv-total").textContent = grandTotal.toLocaleString();

    const itemsContainer = document.getElementById("modal-inv-items");
    if (!itemsContainer) return;

    itemsContainer.innerHTML = `
      <table class="invoice-table" style="margin-top:1rem;">
        <thead>
          <tr>
            <th>Category & Description</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${billingData.services.map(s => `<tr><td>[Service] ${s.name}</td><td class="text-right">${hotelConfig.currency}${s.amount}</td></tr>`).join('')}
          ${billingData.foodOrders.map(f => `<tr><td>[Dining] ${f.name}</td><td class="text-right">${hotelConfig.currency}${f.amount}</td></tr>`).join('')}
          ${billingData.entertainment.map(e => `<tr><td>[Event] ${e.name}</td><td class="text-right">${hotelConfig.currency}${e.amount}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  /* ==========================================================================
     5. REVIEWS & RATINGS LOGIC
     ========================================================================== */

  function setupStarPicker() {
    const picker = document.getElementById("star-picker");
    const labelText = document.getElementById("rating-label-text");
    const valInput = document.getElementById("selected-rating-val");

    if (!picker) return;

    const stars = picker.querySelectorAll(".star-btn");

    function updateStars(val) {
      stars.forEach(s => {
        const ratingVal = parseInt(s.getAttribute("data-value"), 10);
        if (ratingVal <= val) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
      valInput.value = val;
      labelText.textContent = ratingLabels[val] || `${val} Stars`;
    }

    stars.forEach(s => {
      s.addEventListener("click", () => {
        selectedStarRating = parseInt(s.getAttribute("data-value"), 10);
        updateStars(selectedStarRating);
      });

      s.addEventListener("mouseenter", () => {
        const hoverVal = parseInt(s.getAttribute("data-value"), 10);
        updateStars(hoverVal);
      });
    });

    picker.addEventListener("mouseleave", () => {
      updateStars(selectedStarRating);
    });

    updateStars(5);
  }

  function submitReview(e) {
    e.preventDefault();
    const nameInput = document.getElementById("review-name").value.trim();
    const textInput = document.getElementById("review-text").value.trim();
    const ratingVal = parseInt(document.getElementById("selected-rating-val").value, 10);

    if (!nameInput || !textInput) {
      showToast("Please fill in your name and review message.", "fa-exclamation-triangle");
      return;
    }

    const newReview = {
      id: "rev-" + Date.now(),
      name: nameInput,
      rating: ratingVal,
      text: textInput,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    let reviews = getStoredReviews();
    reviews.unshift(newReview);
    localStorage.setItem("aura_reviews", JSON.stringify(reviews));

    renderReviewsList(reviews);
    document.getElementById("review-form").reset();
    selectedStarRating = 5;

    showToast("Thank you! Your review has been published.", "fa-star");
  }

  function loadReviewsFromStorage() {
    let reviews = getStoredReviews();
    if (reviews.length === 0) {
      reviews = [
        {
          id: "rev-1",
          name: "Siddharth Malhotra",
          rating: 5,
          text: "An unforgettable stay at AURA! The beachfront views, 24/7 concierge, and gold leaf dessert at the kitchen were truly spectacular.",
          date: "14 Sep 2026"
        },
        {
          id: "rev-2",
          name: "Ananya Roy",
          rating: 5,
          text: "Impeccable housekeeping and smooth airport transfer. The live acoustic jazz night made our evening magical.",
          date: "10 Sep 2026"
        }
      ];
      localStorage.setItem("aura_reviews", JSON.stringify(reviews));
    }
    renderReviewsList(reviews);
  }

  function getStoredReviews() {
    try {
      const data = localStorage.getItem("aura_reviews");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function renderReviewsList(reviews) {
    const container = document.getElementById("reviews-list");
    if (!container) return;

    container.innerHTML = "";
    reviews.forEach(rev => {
      const card = document.createElement("div");
      card.className = "review-item-card";

      const starsHtml = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);

      card.innerHTML = `
        <div class="review-item-header">
          <span class="reviewer-name">${rev.name}</span>
          <span class="review-stars">${starsHtml}</span>
        </div>
        <div class="review-date">${rev.date}</div>
        <p class="review-comment">"${rev.text}"</p>
      `;
      container.appendChild(card);
    });
  }

  /* ==========================================================================
     6. PROFILE MANAGEMENT
     ========================================================================== */

  function loadProfileFromStorage() {
    try {
      const saved = localStorage.getItem("aura_profile");
      if (saved) {
        guestProfile = { ...guestProfile, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not read profile from storage.");
    }
    syncProfileUI();
  }

  function syncProfileUI() {
    document.getElementById("guest-welcome-name").textContent = guestProfile.name;
    document.getElementById("guest-welcome-id").textContent = guestProfile.bookingId;
    document.getElementById("guest-welcome-room").textContent = guestProfile.roomNumber;
    document.getElementById("guest-welcome-checkout").textContent = formatDateShort(guestProfile.checkOut);

    document.getElementById("profile-display-name").textContent = guestProfile.name;
    document.getElementById("profile-display-booking").textContent = guestProfile.bookingId;

    document.getElementById("prof-name").value = guestProfile.name;
    document.getElementById("prof-email").value = guestProfile.email;
    document.getElementById("prof-phone").value = guestProfile.phone;
    document.getElementById("prof-booking").value = guestProfile.bookingId;
    document.getElementById("prof-checkin").value = guestProfile.checkIn;
    document.getElementById("prof-checkout").value = guestProfile.checkOut;
  }

  function saveProfileChanges(e) {
    e.preventDefault();
    guestProfile.name = document.getElementById("prof-name").value.trim();
    guestProfile.email = document.getElementById("prof-email").value.trim();
    guestProfile.phone = document.getElementById("prof-phone").value.trim();
    guestProfile.checkIn = document.getElementById("prof-checkin").value;
    guestProfile.checkOut = document.getElementById("prof-checkout").value;

    localStorage.setItem("aura_profile", JSON.stringify(guestProfile));
    syncProfileUI();
    renderBillingInvoice();

    showToast("Profile details updated successfully!", "fa-user-check");
  }

  /* ==========================================================================
     7. CONTACT FORM & VALIDATION
     ========================================================================== */

  function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+\d\s\-\(\)]{7,15}$/;

    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.", "fa-triangle-exclamation");
      return;
    }
    if (!phoneRegex.test(phone)) {
      showToast("Please enter a valid phone number.", "fa-triangle-exclamation");
      return;
    }

    document.getElementById("contact-form").reset();
    showToast(`Thank you ${name}. Your message has been routed to hotel reception.`, "fa-envelope-circle-check");
  }

  /* ==========================================================================
     8. BOOKING & RESERVATION SYSTEM (WITH VACANCY CHECK)
     ========================================================================== */

  function handleReservationSubmit(e) {
    e.preventDefault();
    const roomType = document.getElementById("res-room-type").value;
    const name = document.getElementById("res-name").value.trim();
    const email = document.getElementById("res-email").value.trim();
    const phone = document.getElementById("res-phone").value.trim();
    const checkIn = document.getElementById("res-checkin").value;
    const checkOut = document.getElementById("res-checkout").value;
    const guests = document.getElementById("res-guests").value;
    const requests = document.getElementById("res-requests").value;

    const currentVacancy = roomVacancyState[roomType] ? roomVacancyState[roomType].count : 0;
    if (currentVacancy <= 0) {
      showToast(`Sorry! ${roomType} is fully booked. Please select another vacant suite.`, "fa-lock");
      updateModalVacancyNotice(roomType);
      return;
    }

    if (!name || !email || !phone || !checkIn || !checkOut) {
      showToast("Please fill in all mandatory booking fields.", "fa-exclamation");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      showToast("Check-out date must be after check-in date.", "fa-calendar-minus");
      return;
    }

    roomVacancyState[roomType].count -= 1;
    saveVacancyToStorage();
    renderVacancyWidget();

    const newBookingId = "AURA" + Math.floor(1000 + Math.random() * 9000);

    const reservation = {
      bookingId: newBookingId,
      roomType, name, email, phone, checkIn, checkOut, guests, requests,
      createdAt: new Date().toISOString()
    };

    let resList = [];
    try {
      resList = JSON.parse(localStorage.getItem("aura_reservations") || "[]");
    } catch(err) {}
    resList.push(reservation);
    localStorage.setItem("aura_reservations", JSON.stringify(resList));

    guestProfile.name = name;
    guestProfile.email = email;
    guestProfile.phone = phone;
    guestProfile.bookingId = newBookingId;
    guestProfile.roomNumber = roomType;
    guestProfile.checkIn = checkIn;
    guestProfile.checkOut = checkOut;
    localStorage.setItem("aura_profile", JSON.stringify(guestProfile));
    syncProfileUI();
    renderBillingInvoice();

    closeModal(document.getElementById("booking-modal"));

    document.getElementById("success-booking-id").textContent = newBookingId;
    document.getElementById("success-room-type").textContent = roomType;
    document.getElementById("success-guest-name").textContent = name;
    document.getElementById("success-dates").textContent = `${formatDateShort(checkIn)} - ${formatDateShort(checkOut)}`;

    openModal(document.getElementById("booking-success-modal"));
    document.getElementById("reservation-form").reset();
  }

  /* ==========================================================================
     9. NAVIGATION, MODALS & UTILITIES
     ========================================================================== */

  function setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link, .quick-card, .scroll-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        const targetId = href ? href.replace("#", "") : link.getAttribute("data-target");

        if (targetId) {
          e.preventDefault();
          switchSection(targetId);

          sidebar.classList.remove("active");
          overlay.classList.remove("active");
        }
      });
    });

    const mobileBtn = document.getElementById("mobile-menu-btn");
    if (mobileBtn) {
      mobileBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
      });
    }

    if (overlay) {
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
      });
    }

    const filterBtns = document.querySelectorAll("#kitchen-filters .filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-category");

        if (cat === "All") {
          renderKitchenItems(kitchenData);
        } else {
          const filtered = kitchenData.filter(item => item.category === cat);
          renderKitchenItems(filtered);
        }
      });
    });
  }

  function switchSection(sectionId) {
    const sections = document.querySelectorAll(".page-section");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

    const targetElement = document.getElementById(sectionId);
    
    if (targetElement && targetElement.classList.contains("page-section")) {
      sections.forEach(sec => sec.classList.remove("active"));
      navLinks.forEach(nl => nl.classList.remove("active"));

      targetElement.classList.add("active");
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const activeNav = document.querySelector(`.sidebar-nav .nav-link[data-section="${sectionId}"]`);
      if (activeNav) {
        activeNav.classList.add("active");
      }
    } else if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function setupEventListeners() {
    document.getElementById("home-book-vacant-btn")?.addEventListener("click", () => {
      const select = document.getElementById("res-room-type");
      if (select) updateModalVacancyNotice(select.value);
      openModal(document.getElementById("booking-modal"));
    });

    document.getElementById("res-room-type")?.addEventListener("change", (e) => {
      updateModalVacancyNotice(e.target.value);
    });

    document.querySelectorAll(".close-modal-btn, .modal-close").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        if (modal) closeModal(modal);
      });
    });

    document.querySelectorAll(".modal").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    document.getElementById("place-food-order-btn")?.addEventListener("click", placeFoodOrder);
    document.getElementById("review-form")?.addEventListener("submit", submitReview);
    document.getElementById("profile-edit-form")?.addEventListener("submit", saveProfileChanges);
    document.getElementById("contact-form")?.addEventListener("submit", handleContactSubmit);
    document.getElementById("reservation-form")?.addEventListener("submit", handleReservationSubmit);

    document.getElementById("view-invoice-modal-btn")?.addEventListener("click", () => {
      openModal(document.getElementById("invoice-modal"));
    });

    document.getElementById("print-bill-btn")?.addEventListener("click", () => {
      window.print();
    });

    setupStarPicker();
  }

  function openModal(modal) {
    if (modal) modal.classList.add("active");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("active");
  }

  function showToast(message, iconClass = "fa-info-circle") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function saveBillingToStorage() {
    try {
      localStorage.setItem("aura_billing", JSON.stringify(billingData));
    } catch(e) {}
  }

  function loadBillingFromStorage() {
    try {
      const saved = localStorage.getItem("aura_billing");
      if (saved) {
        billingData = { ...billingData, ...JSON.parse(saved) };
      }
    } catch(e) {}
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  // Launch App
  initApp();
});
