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
        icon: "fas fa-heartbeat",  // Medical icon
        color: "linear-gradient(135deg, #e74c3c, #c0392b)",
        featured: true
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
        featured: true
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
        featured: true
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
        featured: false
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
        featured: false
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
        featured: false
    },
    {
        id: "radiology",
        title: "Radiology Basics",
        description: "X-ray, CT, MRI interpretation. Essential for clinical practice and board exams.",
        price: 289,
        stars: 445,
        category: "radiology",
        sample: "samples/radiology-sample.pdf",
        icon: "fas fa-x-ray",
        color: "linear-gradient(135deg, #34495e, #2c3e50)",
        featured: false
    },
    {
        id: "emergency",
        title: "Emergency Medicine",
        description: "Critical care protocols, trauma management, and emergency procedures.",
        price: 299,
        stars: 460,
        category: "emergency",
        sample: "samples/emergency-sample.pdf",
        icon: "fas fa-truck-medical",
        color: "linear-gradient(135deg, #e74c3c, #c0392b)",
        featured: false
    }
];

// Story sharing function
function shareToStory(bookTitle, bookCoverUrl) {
    // Check if Telegram WebApp and shareToStory API are available
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.error('Telegram WebApp not available');
        alert('This feature only works inside Telegram');
        return;
    }
    
    const webapp = window.Telegram.WebApp;
    
    // Check if shareToStory method exists
    if (typeof webapp.shareToStory !== 'function') {
        console.warn('shareToStory API not available. Make sure you have the latest Telegram version.');
        alert('Please update Telegram to the latest version to use this feature');
        return;
    }
    
    // Create a widget/text overlay for the story
    // In a production app, you'd generate an image dynamically
    const storyMediaUrl = bookCoverUrl || 'https://your-domain.com/default-share-image.jpg';
    
    // Optional: Add text widget overlay
    const params = {
        text: `📚 Just discovered "${bookTitle}" at Medical Book Store!\n\nGet yours today →`,
        widget_link: {
            url: `https://t.me/YourMedicalBookBot?start=book_${bookTitle.toLowerCase().replace(/\s+/g, '_')}`,
            name: 'Get This Book'
        }
    };
    
    // Open the story editor
    try {
        webapp.shareToStory(storyMediaUrl, params);
        webapp.close(); // Optional: close mini app after sharing
    } catch (error) {
        console.error('Error sharing to story:', error);
        alert('Unable to share. Please try again.');
    }
}
// Initialize Telegram WebApp
function initTelegramApp() {
    if (tg) {
        // Expand to full height
        tg.expand();
        
        // Enable closing confirmation
        tg.enableClosingConfirmation();
        
        // Apply theme colors
        applyTelegramTheme();
        
        // Handle theme changes
        tg.onEvent('themeChanged', applyTelegramTheme);
        
        // Show main button if needed
        // tg.MainButton.setText("Open Bot").show();
        // tg.MainButton.onClick(openBot);
        
        // Ready
        tg.ready();
    }
}

// Apply Telegram theme to CSS variables
function applyTelegramTheme() {
    if (tg && tg.themeParams) {
        const theme = tg.themeParams;
        document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-hint-color', theme.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-link-color', theme.link_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#2481cc');
        document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color || '#f0f0f0');
    }
}

// Navigation
function switchToView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(`${viewName}View`).classList.add('active');
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        }
    });
    
    // Show/hide back button
    const backBtn = document.getElementById('backBtn');
    if (viewName === 'detail' || viewName === 'sample') {
        backBtn.style.display = 'flex';
    } else {
        backBtn.style.display = 'none';
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
    document.querySelector('.header-title span:last-child').textContent = titles[viewName] || 'Medical Book Store';
}

// Load featured books with icons
function loadFeaturedBooks() {
    const featured = books.filter(book => book.featured);
    const container = document.getElementById('featuredBooks');
    
    if (!container) return;
    
    container.innerHTML = featured.map(book => `
        <div class="book-card" onclick="showBookDetail('${book.id}')">
            <div class="book-cover" style="background: ${book.color}">
                <i class="${book.icon}" style="font-size: 48px;"></i>
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-price">${book.price} EGP</div>
                <div class="book-actions">
                    <button class="sample-link" onclick="event.stopPropagation(); viewSample('${book.id}')">
                        <i class="fas fa-file-pdf"></i> Sample
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load all books in list view with icons
function loadBooksList() {
    const container = document.getElementById('booksList');
    if (!container) return;
    
    container.innerHTML = books.map(book => `
        <div class="book-list-item" onclick="showBookDetail('${book.id}')">
            <div class="book-list-cover" style="background: ${book.color}">
                <i class="${book.icon}" style="font-size: 32px; color: white;"></i>
            </div>
            <div class="book-list-info">
                <div class="book-list-title">${book.title}</div>
                <div class="book-list-desc">${book.description.substring(0, 80)}...</div>
                <div class="book-list-price">
                    <i class="fas fa-tag"></i> ${book.price} EGP 
                    (<i class="fab fa-telegram"></i> ${book.stars} Stars)
                </div>
            </div>
        </div>
    `).join('');
}

// Show book detail with share button
function showBookDetail(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const container = document.getElementById('bookDetail');
    container.innerHTML = `
        <div class="book-detail-card">
            <div class="detail-cover" style="background: ${book.color}; padding: 40px; text-align: center; border-radius: 20px; margin-bottom: 20px;">
                <i class="${book.icon}" style="font-size: 80px; color: white;"></i>
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
                <button class="action-btn secondary-btn" onclick="shareToStory('${book.title}', '${book.coverUrl || ''}')">
                    <i class="fas fa-share-alt"></i> Share to Story
                </button>
            </div>
        </div>
    `;
    
    switchToView('detail');
}
// Filter books by search
function filterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const container = document.getElementById('booksList');
    
    const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = filtered.map(book => `
        <div class="book-list-item" onclick="showBookDetail('${book.id}')">
            <div class="book-list-cover">${book.cover}</div>
            <div class="book-list-info">
                <div class="book-list-title">${book.title}</div>
                <div class="book-list-desc">${book.description.substring(0, 80)}...</div>
                <div class="book-list-price">${book.price} EGP (${book.stars} Stars)</div>
            </div>
        </div>
    `).join('');
}

// View PDF sample
function viewSample(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('sampleTitle').textContent = book.title;
    const pdfFrame = document.getElementById('pdfFrame');
    
    // Use Google PDF viewer for better compatibility
    const sampleUrl = book.sample || `samples/${bookId}-sample.pdf`;
    pdfFrame.src = `https://docs.google.com/gview?url=${encodeURIComponent(window.location.origin + '/' + sampleUrl)}&embedded=true`;
    
    // Store current book for purchase button
    document.getElementById('purchaseFromSampleBtn').onclick = () => showBookDetail(bookId);
    
    switchToView('sample');
}

// Purchase book
function purchaseBook(bookId, method) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    // Open bot with purchase intent
    const botUsername = 'YourMedicalBookBot'; // Replace with your bot username
    const startParam = `buy_${bookId}_${method}`;
    
    if (tg) {
        tg.openTelegramLink(`https://t.me/${botUsername}?start=${startParam}`);
    } else {
        window.open(`https://t.me/${botUsername}?start=${startParam}`, '_blank');
    }
}

// Support functions
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

function copyNumber() {
    const number = '01001234567';
    navigator.clipboard.writeText(number);
    alert('Phone number copied: ' + number);
}

function openBot() {
    const botUsername = 'YourMedicalBookBot'; // Replace with your bot username
    if (tg) {
        tg.openTelegramLink(`https://t.me/${botUsername}`);
    } else {
        window.open(`https://t.me/${botUsername}`, '_blank');
    }
}

// Back button handler
document.getElementById('backBtn').addEventListener('click', () => {
    const activeView = document.querySelector('.view.active').id;
    if (activeView === 'detailView' || activeView === 'sampleView') {
        switchToView('books');
    } else {
        switchToView('home');
    }
});

// Close button handler
document.getElementById('closeBtn').addEventListener('click', () => {
    if (tg) {
        tg.close();
    } else {
        window.close();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initTelegramApp();
    loadFeaturedBooks();
    loadBooksList();
    
    // Set default active nav
    document.querySelector('.nav-item[data-view="home"]').classList.add('active');
});
