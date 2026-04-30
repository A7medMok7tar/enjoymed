// ============================================
// MEDICAL BOOK STORE - COMPLETE SCRIPT
 WITH CART & CHECKOUT
// ============================================

let tg = window.Telegram?.WebApp;
let cart = [];

// Initialize
function initTelegramApp() {
    if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
        applyTelegramTheme();
        tg.ready();
    }
    loadCartFromStorage();
    updateCartUI();
}

// ============================================
// CART FUNCTIONS
// ============================================

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('medical_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCartToStorage() {
    localStorage.setItem('medical_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Check if already in cart
    const existing = cart.find(item => item.id === bookId);
    if (existing) {
        showToast(`${book.title} is already in your cart!`);
        return;
    }
    
    cart.push({
        id: book.id,
        title: book.title,
        price: book.price,
        icon: book.icon,
        color: book.color
    });
    
    saveCartToStorage();
    showToast(`${book.title} added to cart!`);
    updateCartBadge();
}

function removeFromCart(bookId) {
    const book = books.find(b => b.id === bookId);
    cart = cart.filter(item => item.id !== bookId);
    saveCartToStorage();
    showToast(`${book?.title || 'Book'} removed from cart`);
    updateCartBadge();
    
    // If cart view is open, refresh it
    if (document.getElementById('cartView').classList.contains('active')) {
    displayCartItems();
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const cartCountSpan = document.getElementById('cartCount');
    
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.remove('hidden');
        if (cartCountSpan) cartCountSpan.textContent = cart.length;
    } else {
        badge.classList.add('hidden');
        if (cartCountSpan) cartCountSpan.textContent = '0';
    }
}

function updateCartUI() {
    updateCartBadge();
}

function viewCart() {
    displayCartItems();
    switchToView('cart');
}

function displayCartItems() {
    const container = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 64px; color: var(--text-muted);"></i>
                <p>Your cart is empty</p>
                <button class="action-btn secondary-btn" onclick="switchToView('books')">
                    Browse Books →
                </button>
            </div>
        `;
        summaryContainer.innerHTML = '';
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <div class="cart-item-cover" style="background: ${item.color}">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price} EGP</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }).join('');
    
    summaryContainer.innerHTML = `
        <div class="cart-summary-card">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${total} EGP</span>
            </div>
            <div class="summary-row">
                <span>Delivery:</span>
                <span>Free</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${total} EGP</span>
            </div>
            <div class="summary-note">
                <i class="fas fa-lock"></i> Secure payment via Telegram Stars or Vodafone Cash
            </div>
        </div>
    `;
}

// ============================================
// CHECKOUT FUNCTION - Sends data to bot
// ============================================

function checkoutFromWebApp() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    const checkoutData = {
        action: 'checkout',
        items: cart.map(item => ({
            id: item.id,
            name: item.title,
            price: item.price
        })),
        total: total,
        timestamp: Date.now()
    };
    
    if (tg) {
        // Send data to bot and close web app
        tg.sendData(JSON.stringify(checkoutData));
        showToast('Redirecting to checkout...');
        
        // Close web app after a short delay
        setTimeout(() => {
            tg.close();
        }, 500);
    } else {
        // Fallback for browser testing
        console.log('Checkout data:', checkoutData);
        showToast('Checkout data prepared! (Testing mode)');
        
        // In test mode, show the data
        alert('Checkout Data:\n' + JSON.stringify(checkoutData, null, 2));
    }
}

// ============================================
// BOOK FUNCTIONS (Your existing functions)
// ============================================

const books = [
    {
        id: "anatomy_2024",
        title: "Clinical Anatomy 2024",
        description: "Complete guide to human anatomy with clinical correlations.",
        price: 299,
        stars: 460,
        category: "anatomy",
        icon: "fas fa-heartbeat",
        color: "linear-gradient(135deg, #e74c3c, #c0392b)",
        featured: true,
        searchQuery: "clinical anatomy"
    },
    {
        id: "pharmacology",
        title: "Pharmacology Handbook",
        description: "Essential drug information, mechanisms, side effects.",
        price: 249,
        stars: 383,
        category: "pharmacology",
        icon: "fas fa-capsules",
        color: "linear-gradient(135deg, #3498db, #2980b9)",
        featured: true,
        searchQuery: "pharmacology handbook"
    },
    {
        id: "cardiology",
        title: "Cardiology Made Easy",
        description: "ECG interpretation, heart diseases, and management strategies.",
        price: 289,
        stars: 445,
        category: "cardiology",
        icon: "fas fa-heart",
        color: "linear-gradient(135deg, #e74c3c, #c0392b)",
        featured: false,
        searchQuery: "cardiology made easy"
    },
    {
        id: "neurology",
        title: "Neurology Essentials",
        description: "Comprehensive guide to neurological disorders.",
        price: 269,
        stars: 414,
        category: "neurology",
        icon: "fas fa-brain",
        color: "linear-gradient(135deg, #1abc9c, #16a085)",
        featured: false,
        searchQuery: "neurology essentials"
    },
    {
        id: "pediatrics",
        title: "Pediatrics Guide",
        description: "Child development, common diseases, vaccinations.",
        price: 259,
        stars: 398,
        category: "pediatrics",
        icon: "fas fa-child",
        color: "linear-gradient(135deg, #f39c12, #e67e22)",
        featured: false,
        searchQuery: "pediatrics guide"
    }
];

let currentCategory = 'all';

function loadFeaturedBooks() {
    const featured = books.filter(book => book.featured);
    const container = document.getElementById('featuredBooks');
    if (!container) return;
    
    container.innerHTML = featured.map(book => `
        <div class="book-card">
            <div class="book-cover" style="background: ${book.color}" onclick="showBookDetail('${book.id}')">
                <i class="${book.icon}"></i>
            </div>
            <div class="book-info">
                <div class="book-title" onclick="showBookDetail('${book.id}')">${book.title}</div>
                <div class="book-price">${book.price} EGP</div>
                <div class="book-actions">
                    <button class="sample-link" onclick="event.stopPropagation(); viewSample('${book.id}')">
                        <i class="fas fa-file-pdf"></i> Sample
                    </button>
                    <button class="sample-link" onclick="event.stopPropagation(); addToCart('${book.id}')">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function loadBooksList() {
    const container = document.getElementById('booksList');
    if (!container) return;
    
    let filteredBooks = books;
    if (currentCategory !== 'all') {
        filteredBooks = books.filter(book => book.category === currentCategory);
    }
    
    container.innerHTML = filteredBooks.map(book => `
        <div class="book-list-item">
            <div class="book-list-cover" style="background: ${book.color}" onclick="showBookDetail('${book.id}')">
                <i class="${book.icon}"></i>
            </div>
            <div class="book-list-info">
                <div class="book-list-title" onclick="showBookDetail('${book.id}')">${book.title}</div>
                <div class="book-list-desc">${book.description.substring(0, 80)}...</div>
                <div class="book-list-price">${book.price} EGP</div>
                <div class="book-list-actions">
                    <button class="small-btn" onclick="addToCart('${book.id}')">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="small-btn" onclick="viewSample('${book.id}')">
                        <i class="fas fa-file-pdf"></i> Sample
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category || 
            (category === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
    loadBooksList();
}

function filterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const container = document.getElementById('booksList');
    
    let filtered = books;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(book => book.category === currentCategory);
    }
    if (searchTerm) {
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    }
    
    container.innerHTML = filtered.map(book => `
        <div class="book-list-item">
            <div class="book-list-cover" style="background: ${book.color}" onclick="showBookDetail('${book.id}')">
                <i class="${book.icon}"></i>
            </div>
            <div class="book-list-info">
                <div class="book-list-title" onclick="showBookDetail('${book.id}')">${book.title}</div>
                <div class="book-list-desc">${book.description.substring(0, 80)}...</div>
                <div class="book-list-price">${book.price} EGP</div>
                <div class="book-list-actions">
                    <button class="small-btn" onclick="addToCart('${book.id}')">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                    <button class="small-btn" onclick="viewSample('${book.id}')">
                        <i class="fas fa-file-pdf"></i> Sample
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showBookDetail(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const container = document.getElementById('bookDetail');
    container.innerHTML = `
        <div class="book-detail-card">
            <div class="detail-cover" style="background: ${book.color}">
                <i class="${book.icon}"></i>
            </div>
            <h2>${book.title}</h2>
            <p class="detail-price">${book.price} EGP (${book.stars} Stars)</p>
            <p class="detail-description">${book.description}</p>
            <div class="detail-actions">
                <button class="action-btn primary-btn" onclick="addToCart('${book.id}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="action-btn secondary-btn" onclick="viewSample('${book.id}')">
                    <i class="fas fa-file-pdf"></i> View Sample
                </button>
                <button class="action-btn secondary-btn" onclick="shareBookToTelegram('${book.id}')">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
        </div>
    `;
    switchToView('detail');
}

function viewSample(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('sampleTitle').textContent = book.title;
    document.getElementById('purchaseFromSampleBtn').onclick = () => addToCart(bookId);
    switchToView('sample');
}

function shareBookToTelegram(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const botUsername = "YourMedicalBookBot";
    const shareUrl = `https://t.me/${botUsername}?q=${encodeURIComponent(book.searchQuery || book.title)}`;
    
    if (tg) {
        tg.openTelegramLink(shareUrl);
    } else {
        window.open(shareUrl, '_blank');
    }
}

// Navigation functions
let navigationStack = ['home'];

function switchToView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const viewId = `${viewName}View`;
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        }
    });
    
    if (viewName !== navigationStack[navigationStack.length - 1]) {
        navigationStack.push(viewName);
    }
    
    const backBtn = document.getElementById('backBtn');
    if (navigationStack.length > 1 && viewName !== 'home') {
        backBtn.style.display = 'flex';
        backBtn.style.opacity = '1';
    } else {
        backBtn.style.display = 'flex';
        backBtn.style.opacity = '0.5';
    }
    
    const titles = {
        home: 'Medical Book Store',
        books: 'Browse Books',
        cart: 'Your Cart',
        support: 'Support',
        about: 'About Us',
        detail: 'Book Details',
        sample: 'Sample Preview'
    };
    document.querySelector('.header-title span').textContent = titles[viewName] || 'Medical Book Store';
    
    if (viewName === 'cart') {
        displayCartItems();
    }
}

function goBack() {
    if (navigationStack.length > 1) {
        navigationStack.pop();
        const previousView = navigationStack[navigationStack.length - 1];
        switchToView(previousView);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openTelegramChat() {
    if (tg) {
        tg.openTelegramLink('https://t.me/MedicalBooksSupport');
    } else {
        window.open('https://t.me/MedicalBooksSupport', '_blank');
    }
}

function sendEmail() {
    window.location.href = 'mailto:support@medicalbooks.com';
}

function applyTelegramTheme() {
    if (tg && tg.themeParams) {
        const theme = tg.themeParams;
        document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#1a1a2e');
        document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color || '#666666');
        document.documentElement.style.setProperty('--tg-link-color', theme.link_color || '#2c7da0');
    }
}

document.getElementById('backBtn').addEventListener('click', goBack);
document.getElementById('cartIconBtn')?.addEventListener('click', viewCart);

document.addEventListener('DOMContentLoaded', () => {
    initTelegramApp();
    loadFeaturedBooks();
    loadBooksList();
    navigationStack = ['home'];
    document.querySelector('.nav-item[data-view="home"]').classList.add('active');
});
