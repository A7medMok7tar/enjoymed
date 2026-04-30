// ============================================
// MEDICAL BOOK STORE - COMPLETE SCRIPT
// ============================================

// Telegram WebApp initialization
let tg = window.Telegram?.WebApp;

// Book Database
const books = [
    {
        id: "anatomy_2024",
        title: "Clinical Anatomy 2024",
        description: "Complete guide to human anatomy with clinical correlations. Over 500 illustrations and clinical cases.",
        price: 299,
        stars: 460,
        category: "anatomy",
        sample: "samples/anatomy-sample.pdf",
        icon: "fas fa-heartbeat",
        color: "linear-gradient(135deg, #e74c3c, #c0392b)",
        featured: true,
        searchQuery: "clinical anatomy"
    },
    {
        id: "pharmacology",
        title: "Pharmacology Handbook",
        description: "Essential drug information, mechanisms, side effects, and clinical applications. Updated for 2024.",
        price: 249,
        stars: 383,
        category: "pharmacology",
        sample: "samples/pharmacology-sample.pdf",
        icon: "fas fa-capsules",
        color: "linear-gradient(135deg, #3498db, #2980b9)",
        featured: true,
        searchQuery: "pharmacology handbook"
    },
    {
        id: "pathophysiology",
        title: "Pathophysiology",
        description: "Understanding disease mechanisms, clinical manifestations, and diagnostic approaches.",
        price: 279,
        stars: 429,
        category: "pathology",
        sample: "samples/pathology-sample.pdf",
        icon: "fas fa-disease",
        color: "linear-gradient(135deg, #9b59b6, #8e44ad)",
        featured: true,
        searchQuery: "pathophysiology"
    },
    {
        id: "neurology",
        title: "Neurology Essentials",
        description: "Comprehensive guide to neurological disorders, examination techniques, and treatment.",
        price: 269,
        stars: 414,
        category: "neurology",
        sample: "samples/neurology-sample.pdf",
        icon: "fas fa-brain",
        color: "linear-gradient(135deg, #1abc9c, #16a085)",
        featured: false,
        searchQuery: "neurology essentials"
    },
    {
        id: "cardiology",
        title: "Cardiology Made Easy",
        description: "ECG interpretation, heart diseases, and management strategies for clinicians.",
        price: 289,
        stars: 445,
        category: "cardiology",
        sample: "samples/cardiology-sample.pdf",
        icon: "fas fa-heart",
        color: "linear-gradient(135deg, #e74c3c, #c0392b)",
        featured: false,
        searchQuery: "cardiology made easy"
    },
    {
        id: "pediatrics",
        title: "Pediatrics Guide",
        description: "Child development, common diseases, vaccinations, and emergency protocols.",
        price: 259,
        stars: 398,
        category: "pediatrics",
        sample: "samples/pediatrics-sample.pdf",
        icon: "fas fa-child",
        color: "linear-gradient(135deg, #f39c12, #e67e22)",
        featured: false,
        searchQuery: "pediatrics guide"
    }
];

// Current category filter
let currentCategory = 'all';

// Navigation stack
let navigationStack = ['home'];

// Initialize Telegram WebApp
function initTelegramApp() {
    if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
        applyTelegramTheme();
        tg.ready();
    }
}

// Apply Telegram theme
function applyTelegramTheme() {
    if (tg && tg.themeParams) {
        const theme = tg.themeParams;
        document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#1a1a2e');
        document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color || '#666666');
        document.documentElement.style.setProperty('--tg-link-color', theme.link_color || '#2c7da0');
        document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#2c7da0');
        document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff');
    }
}

// Switch views with navigation stack
function switchToView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    document.getElementById(`${viewName}View`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        }
    });
    
    // Update navigation stack
    if (viewName !== navigationStack[navigationStack.length - 1]) {
        navigationStack.push(viewName);
    }
    
    // Update back button visibility
    const backBtn = document.getElementById('backBtn');
    if (navigationStack.length > 1 && viewName !== 'home') {
        backBtn.style.display = 'flex';
    } else {
        backBtn.style.display = 'flex';
        backBtn.style.opacity = '0.5';
    }
    
    // Update header title
    const titles = {
        home: 'Medical Book Store',
        books: 'Browse Books',
        support: 'Support & Contact',
        about: 'About Us',
        detail: 'Book Details',
        sample: 'Sample Preview'
    };
    document.querySelector('.header-title span').textContent = titles[viewName] || 'Medical Book Store';
}

// Go back
function goBack() {
    if (navigationStack.length > 1) {
        navigationStack.pop();
        const previousView = navigationStack[navigationStack.length - 1];
        switchToView(previousView);
    }
}

// Load featured books
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
                    <button class="sample-link" onclick="event.stopPropagation(); shareBookToTelegram('${book.id}')">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load all books in list view
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
                <div class="book-list-desc" onclick="showBookDetail('${book.id}')">${book.description.substring(0, 80)}...</div>
                <div class="book-list-price">
                    <i class="fas fa-tag"></i> ${book.price} EGP 
                    (<i class="fab fa-telegram"></i> ${book.stars} Stars)
                </div>
                <div class="book-list-actions">
                    <button class="small-btn" onclick="shareBookToTelegram('${book.id}')">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                    <button class="small-btn" onclick="viewSample('${book.id}')">
                        <i class="fas fa-file-pdf"></i> Sample
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter by category
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

// Show book detail
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
            <p class="detail-price">
                <i class="fas fa-tag"></i> ${book.price} EGP 
                (<i class="fab fa-telegram"></i> ${book.stars} Stars)
            </p>
            <p class="detail-description">
                <i class="fas fa-align-left"></i> ${book.description}
            </p>
            
            <div class="detail-actions">
                <button class="action-btn primary-btn" onclick="purchaseBook('${book.id}', 'stars')">
                    <i class="fab fa-telegram"></i> Pay ${book.stars} Stars
                </button>
                <button class="action-btn primary-btn" onclick="purchaseBook('${book.id}', 'cash')">
                    <i class="fas fa-mobile-alt"></i> Pay ${book.price} EGP
                </button>
                <button class="action-btn secondary-btn" onclick="viewSample('${book.id}')">
                    <i class="fas fa-file-pdf"></i> View Sample Pages
                </button>
                <button class="action-btn secondary-btn" onclick="shareBookToTelegram('${book.id}')">
                    <i class="fas fa-share-alt"></i> Share to Telegram
                </button>
            </div>
        </div>
    `;
    
    switchToView('detail');
}

// Share book to Telegram using inline query
function shareBookToTelegram(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const botUsername = "ahmed7a7medbot"; // Replace with your bot username
    const searchQuery = book.searchQuery || book.title;
    const shareUrl = `https://t.me/${botUsername}?q=${encodeURIComponent(searchQuery)}`;
    
    if (tg) {
        tg.openTelegramLink(shareUrl);
    } else {
        window.open(shareUrl, '_blank');
    }
}

// View PDF sample
function viewSample(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('sampleTitle').textContent = book.title;
    const pdfFrame = document.getElementById('pdfFrame');
    const sampleUrl = book.sample;
    pdfFrame.src = `https://docs.google.com/gview?url=${encodeURIComponent(window.location.origin + '/' + sampleUrl)}&embedded=true`;
    
    document.getElementById('purchaseFromSampleBtn').onclick = () => showBookDetail(bookId);
    
    switchToView('sample');
}

// Purchase book
function purchaseBook(bookId, method) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const botUsername = "ahmed7a7medbot"; // Replace with your bot username
    const startParam = `buy_${bookId}_${method}`;
    
    if (tg) {
        tg.openTelegramLink(`https://t.me/${botUsername}?start=${startParam}`);
    } else {
        window.open(`https://t.me/${botUsername}?start=${startParam}`, '_blank');
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Support functions
function openTelegramChat() {
    if (tg) {
        tg.openTelegramLink('https://t.me/ahmed7a7medbot');
    } else {
        window.open('https://t.me/ahmed7a7medbot', '_blank');
    }
}

function sendEmail() {
    window.location.href = 'mailto:support@medicalbooks.com';
}

function copyNumber() {
    const number = '01001234567';
    navigator.clipboard.writeText(number);
    showToast('Phone number copied!');
}

function openBot() {
    const botUsername = "ahmed7a7medbot"; // Replace with your bot username
    if (tg) {
        tg.openTelegramLink(`https://t.me/${botUsername}`);
    } else {
        window.open(`https://t.me/${botUsername}`, '_blank');
    }
}

// Back button handler
document.getElementById('backBtn').addEventListener('click', goBack);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initTelegramApp();
    loadFeaturedBooks();
    loadBooksList();
    
    // Set navigation stack
    navigationStack = ['home'];
    document.querySelector('.nav-item[data-view="home"]').classList.add('active');
});
