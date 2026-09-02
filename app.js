/**
 * FRESHBASKET — Interactive Fruit E-Commerce Core Logic
 */

// 1. COMPREHENSIVE PRODUCT DATABASE
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Fresh Red Apples",
        category: "Apples",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        unit: "kg",
        organic: true,
        discountPercent: 10,
        stock: true,
        variants: [
            { label: "500 g", price: 90, unitQty: 0.5 },
            { label: "1 kg", price: 180, unitQty: 1 },
            { label: "2 kg", price: 350, unitQty: 2 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 2,
        name: "Robusta Bananas",
        category: "Tropical",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        unit: "dozen",
        organic: true,
        discountPercent: 0,
        stock: true,
        variants: [
            { label: "6 pcs", price: 30, unitQty: 0.5 },
            { label: "12 pcs (1 Doz)", price: 60, unitQty: 1 },
            { label: "24 pcs (2 Doz)", price: 115, unitQty: 2 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 3,
        name: "Alphonso Mangoes (Ratnagiri)",
        category: "Tropical",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        unit: "kg",
        organic: true,
        discountPercent: 15,
        stock: true,
        variants: [
            { label: "500 g", price: 175, unitQty: 0.5 },
            { label: "1 kg", price: 350, unitQty: 1 },
            { label: "2 kg Box", price: 680, unitQty: 2 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 4,
        name: "Nagpur Oranges",
        category: "Citrus",
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        unit: "kg",
        organic: false,
        discountPercent: 10,
        stock: true,
        variants: [
            { label: "500 g", price: 60, unitQty: 0.5 },
            { label: "1 kg", price: 120, unitQty: 1 },
            { label: "2 kg", price: 230, unitQty: 2 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 5,
        name: "Green Seedless Grapes",
        category: "Berries",
        image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        unit: "kg",
        organic: true,
        discountPercent: 0,
        stock: true,
        variants: [
            { label: "250 g", price: 35, unitQty: 0.25 },
            { label: "500 g", price: 70, unitQty: 0.5 },
            { label: "1 kg", price: 140, unitQty: 1 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 6,
        name: "Fresh Sweet Watermelon",
        category: "Melons",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
        rating: 4.4,
        unit: "pc",
        organic: false,
        discountPercent: 0,
        stock: true,
        variants: [
            { label: "1 pc (~1.5kg)", price: 40, unitQty: 1 },
            { label: "1 pc (~2.5kg)", price: 80, unitQty: 2 },
            { label: "1 Large (~4kg)", price: 115, unitQty: 3 }
        ],
        selectedVariantIndex: 0
    },
    {
        id: 7,
        name: "Ripe Sweet Papaya",
        category: "Melons",
        image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        unit: "kg",
        organic: true,
        discountPercent: 5,
        stock: true,
        variants: [
            { label: "500 g", price: 35, unitQty: 0.5 },
            { label: "1 kg", price: 70, unitQty: 1 },
            { label: "2 kg", price: 135, unitQty: 2 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 8,
        name: "Fresh Queen Pineapple",
        category: "Tropical",
        image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        unit: "piece",
        organic: false,
        discountPercent: 0,
        stock: true,
        variants: [
            { label: "1 pc (Small)", price: 90, unitQty: 1 },
            { label: "2 pcs Pack", price: 175, unitQty: 2 }
        ],
        selectedVariantIndex: 0
    },
    {
        id: 9,
        name: "Premium Ruby Pomegranate",
        category: "Tropical",
        image: "https://i0.wp.com/www.messagemagazine.com/wp-content/uploads/2019/06/Screen-Shot-2019-06-27-at-5.10.20-PM.png?fit=592%2C592&ssl=1",
        rating: 4.8,
        unit: "kg",
        organic: true,
        discountPercent: 12,
        stock: true,
        variants: [
            { label: "500 g", price: 110, unitQty: 0.5 },
            { label: "1 kg", price: 220, unitQty: 1 },
            { label: "2 kg", price: 430, unitQty: 2 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 10,
        name: "New Zealand Green Kiwi",
        category: "Berries",
        image: "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        unit: "pack",
        organic: false,
        discountPercent: 0,
        stock: true,
        variants: [
            { label: "3 pcs Pack", price: 150, unitQty: 3 },
            { label: "6 pcs Pack", price: 300, unitQty: 6 },
            { label: "12 pcs Box", price: 590, unitQty: 12 }
        ],
        selectedVariantIndex: 0
    },
    {
        id: 11,
        name: "Crisp Guava (Allahabad)",
        category: "Tropical",
        image: "https://6a9664fb3db6a220b8641a88.imgix.net/sandbox/guava.webp?w=208&h=160&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        rating: 4.4,
        unit: "kg",
        organic: true,
        discountPercent: 0,
        stock: true,
        variants: [
            { label: "500 g", price: 45, unitQty: 0.5 },
            { label: "1 kg", price: 90, unitQty: 1 },
            { label: "2 kg", price: 175, unitQty: 2 }
        ],
        selectedVariantIndex: 1
    },
    {
        id: 12,
        name: "Mahabaleshwar Strawberries",
        category: "Berries",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        unit: "box",
        organic: true,
        discountPercent: 20,
        stock: true,
        variants: [
            { label: "250 g Punnet", price: 180, unitQty: 0.25 },
            { label: "500 g Pack", price: 350, unitQty: 0.5 }
        ],
        selectedVariantIndex: 0
    }
];

// 2. CATEGORIES METADATA
const CATEGORIES_DATA = [
    { name: "Apples", emoji: "🍎", count: 12 },
    { name: "Tropical", emoji: "🥭", count: 18 },
    { name: "Citrus", emoji: "🍊", count: 8 },
    { name: "Berries", emoji: "🍓", count: 6 },
    { name: "Melons", emoji: "🍉", count: 5 }
];

// 3. APPLICATION STATE MANAGEMENT
let appState = {
    products: JSON.parse(JSON.stringify(PRODUCTS_DATA)),
    cart: [], // items: { productId, variantIndex, quantity }
    wishlist: new Set(),
    activeCategory: "all",
    searchQuery: "",
    priceFilter: "all",
    ratingFilter: 0,
    inStockOnly: false,
    sortBy: "recommended",
    showOnlyWishlist: false,
    showOnlyOffers: false
};

// 4. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    renderCategoryBubbles();
    renderSidebarCategories();
    renderProducts();
    bindEvents();
});

// 5. EVENT BINDINGS
function bindEvents() {
    // Search input typing
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.trim().toLowerCase();
        searchClearBtn.style.display = appState.searchQuery ? 'block' : 'none';
        renderProducts();
    });

    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        appState.searchQuery = '';
        searchClearBtn.style.display = 'none';
        renderProducts();
    });

    // Nav Category clicks
    const navItems = document.querySelectorAll('.nav-categories .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            const cat = item.getAttribute('data-cat');
            
            if (cat === 'offers') {
                filterByOffer();
            } else {
                appState.showOnlyOffers = false;
                appState.activeCategory = cat;
                renderProducts();
            }
        });
    });

    // Cart Toggle
    document.getElementById('cartToggleBtn').addEventListener('click', openCart);
}

// 6. RENDER CATEGORIES BUBBLES
function renderCategoryBubbles() {
    const container = document.getElementById('categoryBubbleGrid');
    container.innerHTML = CATEGORIES_DATA.map(c => `
        <div class="cat-card ${appState.activeCategory === c.name ? 'active' : ''}" onclick="filterByCategoryBubble('${c.name}')">
            <span class="cat-emoji">${c.emoji}</span>
            <div class="cat-name">${c.name}</div>
            <div class="cat-count">${c.count} Items</div>
        </div>
    `).join('');
}

function renderSidebarCategories() {
    const container = document.getElementById('categoryFilterOptions');
    container.innerHTML = `
        <label class="custom-radio">
            <input type="radio" name="sideCat" value="all" ${appState.activeCategory === 'all' ? 'checked' : ''} onchange="filterByCategoryBubble('all')">
            <span class="radio-mark"></span>
            All Fruits
        </label>
        ${CATEGORIES_DATA.map(c => `
            <label class="custom-radio">
                <input type="radio" name="sideCat" value="${c.name}" ${appState.activeCategory === c.name ? 'checked' : ''} onchange="filterByCategoryBubble('${c.name}')">
                <span class="radio-mark"></span>
                ${c.name}
            </label>
        `).join('')}
    `;
}

function filterByCategoryBubble(catName) {
    appState.activeCategory = catName;
    appState.showOnlyOffers = false;
    appState.showOnlyWishlist = false;

    // Update nav state
    document.querySelectorAll('.nav-categories .nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-cat') === catName);
    });

    renderCategoryBubbles();
    renderSidebarCategories();
    renderProducts();

    // Close mobile filter drawer if open
    document.getElementById('storeSidebar').classList.remove('mobile-active');
}

// 7. RENDER MAIN PRODUCTS GRID
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const noState = document.getElementById('noProductsState');
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');

    totalCount.textContent = appState.products.length;

    // Filter Logic
    let filtered = appState.products.filter(p => {
        // Search Query
        if (appState.searchQuery && !p.name.toLowerCase().includes(appState.searchQuery) && !p.category.toLowerCase().includes(appState.searchQuery)) {
            return false;
        }

        // Category Filter
        if (appState.activeCategory !== 'all' && p.category !== appState.activeCategory) {
            return false;
        }

        // Price Filter
        const currentPrice = p.variants[p.selectedVariantIndex].price;
        if (appState.priceFilter === '0-100' && currentPrice > 100) return false;
        if (appState.priceFilter === '100-200' && (currentPrice < 100 || currentPrice > 200)) return false;
        if (appState.priceFilter === '200-500' && (currentPrice < 200 || currentPrice > 500)) return false;

        // Rating
        if (appState.ratingFilter > 0 && p.rating < appState.ratingFilter) return false;

        // Stock
        if (appState.inStockOnly && !p.stock) return false;

        // Wishlist Only
        if (appState.showOnlyWishlist && !appState.wishlist.has(p.id)) return false;

        // Offers Only
        if (appState.showOnlyOffers && p.discountPercent <= 0) return false;

        return true;
    });

    // Sorting Logic
    if (appState.sortBy === 'price-low') {
        filtered.sort((a, b) => a.variants[a.selectedVariantIndex].price - b.variants[b.selectedVariantIndex].price);
    } else if (appState.sortBy === 'price-high') {
        filtered.sort((a, b) => b.variants[b.selectedVariantIndex].price - a.variants[a.selectedVariantIndex].price);
    } else if (appState.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    showingCount.textContent = filtered.length;
    renderActiveFilterPills();

    if (filtered.length === 0) {
        grid.innerHTML = '';
        noState.style.display = 'block';
        return;
    }

    noState.style.display = 'none';

    // Render Cards
    grid.innerHTML = filtered.map(product => {
        const activeVariant = product.variants[product.selectedVariantIndex];
        const isWishlisted = appState.wishlist.has(product.id);
        const cartItem = appState.cart.find(item => item.productId === product.id && item.variantIndex === product.selectedVariantIndex);
        const qtyInCart = cartItem ? cartItem.quantity : 0;

        return `
            <div class="product-card" id="prod-card-${product.id}">
                <div class="product-badges">
                    ${product.discountPercent > 0 ? `<span class="offer-badge">${product.discountPercent}% OFF</span>` : ''}
                    ${product.organic ? `<span class="organic-badge">ORGANIC</span>` : ''}
                </div>

                <button class="wishlist-icon-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                    ${isWishlisted ? '❤️' : '♡'}
                </button>

                <div class="product-img-wrap">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>

                <span class="product-category-tag">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>

                <div class="product-rating">
                    <span class="stars-pill">⭐ ${product.rating}</span>
                    <span>(120+ reviews)</span>
                </div>

                <!-- Weight Variants -->
                <div class="variant-selector">
                    ${product.variants.map((v, idx) => `
                        <button class="variant-pill ${idx === product.selectedVariantIndex ? 'active' : ''}" onclick="changeVariant(${product.id}, ${idx})">
                            ${v.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Footer & Cart Action -->
                <div class="product-footer">
                    <div class="price-box">
                        <span class="current-price">₹${activeVariant.price}</span>
                        ${product.discountPercent > 0 ? `<span class="original-price">₹${Math.round(activeVariant.price * (1 + product.discountPercent / 100))}</span>` : ''}
                    </div>

                    <div class="card-action-container">
                        ${qtyInCart === 0 ? `
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id}, ${product.selectedVariantIndex})">
                                + Add to Cart
                            </button>
                        ` : `
                            <div class="qty-counter">
                                <button class="qty-btn" onclick="updateCartQty(${product.id}, ${product.selectedVariantIndex}, -1)">−</button>
                                <span class="qty-display">${qtyInCart}</span>
                                <button class="qty-btn" onclick="updateCartQty(${product.id}, ${product.selectedVariantIndex}, 1)">+</button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 8. VARIANT CHANGE ACTION
function changeVariant(productId, variantIndex) {
    const product = appState.products.find(p => p.id === productId);
    if (product) {
        product.selectedVariantIndex = variantIndex;
        renderProducts();
    }
}

// 9. CART SYSTEM
function addToCart(productId, variantIndex) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = appState.cart.findIndex(i => i.productId === productId && i.variantIndex === variantIndex);
    if (existingIndex > -1) {
        appState.cart[existingIndex].quantity += 1;
    } else {
        appState.cart.push({
            productId: productId,
            variantIndex: variantIndex,
            quantity: 1
        });
    }

    updateCartCount();
    renderProducts();
    renderCartDrawer();
    showToast(`Added ${product.name} (${product.variants[variantIndex].label}) to cart!`);
}

function updateCartQty(productId, variantIndex, delta) {
    const index = appState.cart.findIndex(i => i.productId === productId && i.variantIndex === variantIndex);
    if (index > -1) {
        appState.cart[index].quantity += delta;
        if (appState.cart[index].quantity <= 0) {
            appState.cart.splice(index, 1);
        }
    }
    updateCartCount();
    renderProducts();
    renderCartDrawer();
}

function removeCartItem(productId, variantIndex) {
    appState.cart = appState.cart.filter(i => !(i.productId === productId && i.variantIndex === variantIndex));
    updateCartCount();
    renderProducts();
    renderCartDrawer();
    showToast("Item removed from your cart.");
}

function updateCartCount() {
    const totalQty = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCountBadge').textContent = totalQty;
    document.getElementById('drawerCartCount').textContent = `${totalQty} Items`;
    document.getElementById('mobCartBadge').textContent = totalQty;
}

function renderCartDrawer() {
    const body = document.getElementById('cartDrawerBody');
    const footer = document.getElementById('cartDrawerFooter');

    if (appState.cart.length === 0) {
        body.innerHTML = `
            <div class="cart-empty-view">
                <div class="cart-empty-icon">🛒</div>
                <h4>Your Cart is Empty</h4>
                <p>Pick wholesome orchard fruits to begin a healthy day!</p>
                <button class="btn btn-primary" onclick="closeCart()">Browse Fresh Store</button>
            </div>
        `;
        footer.style.display = 'none';
        return;
    }

    footer.style.display = 'block';

    let subtotal = 0;
    body.innerHTML = appState.cart.map(item => {
        const product = appState.products.find(p => p.id === item.productId);
        const variant = product.variants[item.variantIndex];
        const itemTotal = variant.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${product.name}</h4>
                    <span class="cart-item-variant">${variant.label} (₹${variant.price} / unit)</span>
                    <div class="cart-item-price">₹${itemTotal}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-counter">
                        <button class="qty-btn" onclick="updateCartQty(${product.id}, ${item.variantIndex}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQty(${product.id}, ${item.variantIndex}, 1)">+</button>
                    </div>
                    <button class="cart-remove-btn" onclick="removeCartItem(${product.id}, ${item.variantIndex})">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    const delivery = subtotal > 499 ? 0 : 40;
    const discount = subtotal > 300 ? 50 : 0;
    const grandTotal = subtotal + delivery - discount;

    document.getElementById('billSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('billDelivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
    document.getElementById('billDiscount').textContent = `-₹${discount}`;
    document.getElementById('billGrandTotal').textContent = `₹${grandTotal}`;
}

function openCart() {
    renderCartDrawer();
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
}

// 10. WISHLIST TOGGLE
function toggleWishlist(productId) {
    if (appState.wishlist.has(productId)) {
        appState.wishlist.delete(productId);
        showToast("Removed from wishlist.");
    } else {
        appState.wishlist.add(productId);
        showToast("Added to your wishlist! ❤️");
    }
    document.getElementById('wishlistCount').textContent = appState.wishlist.size;
    renderProducts();
}

function toggleWishlistFilter() {
    appState.showOnlyWishlist = !appState.showOnlyWishlist;
    appState.showOnlyOffers = false;
    renderProducts();
}

// 11. FILTER & SORT HANDLERS
function handlePriceFilter(val) {
    appState.priceFilter = val;
    renderProducts();
}

function handleRatingFilter(cb) {
    appState.ratingFilter = cb.checked ? parseFloat(cb.value) : 0;
    renderProducts();
}

function handleStockFilter(checked) {
    appState.inStockOnly = checked;
    renderProducts();
}

function handleSort(val) {
    appState.sortBy = val;
    renderProducts();
}

function filterByOffer() {
    appState.showOnlyOffers = true;
    appState.activeCategory = 'all';
    appState.showOnlyWishlist = false;
    renderProducts();
    const sec = document.getElementById('productSection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
}

function resetFilters() {
    appState.activeCategory = 'all';
    appState.searchQuery = '';
    appState.priceFilter = 'all';
    appState.ratingFilter = 0;
    appState.inStockOnly = false;
    appState.showOnlyWishlist = false;
    appState.showOnlyOffers = false;

    document.getElementById('searchInput').value = '';
    document.getElementById('searchClearBtn').style.display = 'none';
    document.querySelectorAll('input[name="priceRange"]')[0].checked = true;
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(c => c.checked = false);

    renderCategoryBubbles();
    renderSidebarCategories();
    renderProducts();
}

function renderActiveFilterPills() {
    const container = document.getElementById('activeFilterTags');
    let pills = [];

    if (appState.activeCategory !== 'all') {
        pills.push(`Category: ${appState.activeCategory} <span onclick="filterByCategoryBubble('all')">✕</span>`);
    }
    if (appState.priceFilter !== 'all') {
        pills.push(`Price: ${appState.priceFilter} <span onclick="handlePriceFilter('all')">✕</span>`);
    }
    if (appState.showOnlyOffers) {
        pills.push(`Offers Only <span onclick="resetFilters()">✕</span>`);
    }
    if (appState.showOnlyWishlist) {
        pills.push(`Wishlist Only <span onclick="toggleWishlistFilter()">✕</span>`);
    }

    container.innerHTML = pills.map(p => `<div class="filter-pill">${p}</div>`).join('');
}

function toggleMobileFilters() {
    const sidebar = document.getElementById('storeSidebar');
    sidebar.classList.toggle('mobile-active');
}

function focusSearch() {
    document.getElementById('searchInput').focus();
}

// 12. CHECKOUT MODAL & ORDER PLACEMENT
function openCheckoutModal() {
    if (appState.cart.length === 0) {
        showToast("Add items to your cart first!");
        return;
    }
    closeCart();

    // Populate Right Pane Summary
    const list = document.getElementById('checkoutItemsList');
    let subtotal = 0;

    list.innerHTML = appState.cart.map(item => {
        const product = appState.products.find(p => p.id === item.productId);
        const variant = product.variants[item.variantIndex];
        const cost = variant.price * item.quantity;
        subtotal += cost;
        return `
            <div class="mini-item-row">
                <span>${product.name} (${variant.label}) × ${item.quantity}</span>
                <strong>₹${cost}</strong>
            </div>
        `;
    }).join('');

    const delivery = subtotal > 499 ? 0 : 40;
    const discount = subtotal > 300 ? 50 : 0;
    const total = subtotal + delivery - discount;

    document.getElementById('coSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('coDelivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
    document.getElementById('coDiscount').textContent = `-₹${discount}`;
    document.getElementById('coGrandTotal').textContent = `₹${total}`;

    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function handlePlaceOrder(e) {
    e.preventDefault();

    const name = document.getElementById('custName').value;
    const house = document.getElementById('custHouse').value;
    const street = document.getElementById('custStreet').value;
    const pin = document.getElementById('custPin').value;
    const slot = document.querySelector('input[name="deliverySlot"]:checked').value;

    const btn = document.getElementById('placeOrderSubmitBtn');
    btn.disabled = true;
    btn.textContent = "Processing Order...";

    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Place FROOTCITY Order";
        closeCheckoutModal();

        // Populate Success Modal
        const orderId = `FB-${Math.floor(100000 + Math.random() * 900000)}`;
        document.getElementById('receiptId').textContent = `#${orderId}`;
        document.getElementById('receiptSlot').textContent = slot;
        document.getElementById('receiptAddress').textContent = `${house}, ${street}, Hyd - ${pin}`;
        document.getElementById('receiptAmount').textContent = document.getElementById('coGrandTotal').textContent;

        // Reset Cart
        appState.cart = [];
        updateCartCount();
        renderProducts();

        // Show Success Box
        document.getElementById('successModal').classList.add('active');
    }, 1200);
}

function closeSuccessAndContinue() {
    document.getElementById('successModal').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 13. TOAST NOTIFICATION UTILITY
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span></span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}