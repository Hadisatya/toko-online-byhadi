// Data produk
const products = [
  { id: 1, name: "Celana Kulot High Waist Cream", price: 589000, image: src="img/foto2.jpeg", rating: 4.5, reviews: [] },
  { id: 2, name: "Soft Beige Office Pants", price: 259000, image: src="img/foto1.jpeg", rating: 4.8, reviews: [] },
  { id: 3, name: "Black Elegant Trousers", price: 389000, image: src="img/foto3.jpeg", rating: 4.7, reviews: [] },
  { id: 4, name: "Korean Wide Leg Pants", price: 329000, image: src="img/foto4.jpeg", rating: 4.6, reviews: [] },
];

// Data testimoni/ulasan dari pelanggan
let testimonials = [];

// State
let cart = [];
let wishlist = [];
let userPoints = 0;
let currentProductReview = null;
let currentRating = 0;

// ============ UTILITY FUNCTIONS ============
function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function showToast(message) {
  const existingToast = document.querySelector('.toast-msg');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerText = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast) toast.remove();
  }, 2000);
}

// ============ STORAGE ============
function loadData() {
  const savedCart = localStorage.getItem('aervy_cart');
  if (savedCart) cart = JSON.parse(savedCart);
  
  const savedWish = localStorage.getItem('aervy_wish');
  if (savedWish) wishlist = JSON.parse(savedWish);
  
  const savedPoints = localStorage.getItem('aervy_points');
  if (savedPoints) userPoints = parseInt(savedPoints);
  
  const savedTestimonials = localStorage.getItem('aervy_testimonials');
  if (savedTestimonials) testimonials = JSON.parse(savedTestimonials);
  else {
    // Data dummy testimonial
    testimonials = [
      {
        id: 1,
        name: "Raka Wijaya",
        product: "Celana Kulot High Waist Cream",
        rating: 5,
        comment: "Bahannya super nyaman! Ukuran sesuai chart, cocok untuk daily wear. Recommend banget! ✨",
        date: "2026-05-15"
      },
      {
        id: 2,
        name: "Arbiyan Pratama",
        product: "Soft Beige Office Pants",
        rating: 4,
        comment: "Warnanya cantik dan elegan. Cocok dipakai ke kantor. Pengiriman cepat!",
        date: "2026-05-18"
      },
      {
        id: 3,
        name: "Galang Ramadhan",
        product: "Black Elegant Trousers",
        rating: 5,
        comment: "Material premium, jatuhnya bagus. Bakal beli lagi untuk warna lain! ❤️",
        date: "2022-12-19"
      }
    ];
  }
  
  updateAllBadges();
  renderTestimonials();
}

function saveAll() {
  localStorage.setItem('aervy_cart', JSON.stringify(cart));
  localStorage.setItem('aervy_wish', JSON.stringify(wishlist));
  localStorage.setItem('aervy_points', userPoints);
  localStorage.setItem('aervy_testimonials', JSON.stringify(testimonials));
}

// ============ UPDATE UI ============
function updateAllBadges() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').innerText = totalItems;
  document.getElementById('wishlistCount').innerText = wishlist.length;
  document.getElementById('pointsDisplay').innerText = userPoints;
  renderCart();
  renderWishlist();
  renderProducts();
}

// ============ CART FUNCTIONS ============
function addToCart(id, isFlash = false) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.image
    });
  }
  
  saveAll();
  updateAllBadges();
  showToast(`🛍️ ${product.name} ditambahkan ke keranjang!`);
  
  if (isFlash) {
    openCart();
  }
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveAll();
    updateAllBadges();
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveAll();
  updateAllBadges();
  showToast('🗑️ Item dihapus dari keranjang');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px;">🛒 Keranjang masih kosong</div>';
    document.getElementById('cartTotal').innerText = 'Rp 0';
    return;
  }
  
  let total = 0;
  container.innerHTML = '';
  
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1;">
        <strong>${item.name}</strong><br>
        ${formatRupiah(item.price)} x ${item.qty}<br>
        <strong>${formatRupiah(item.price * item.qty)}</strong>
        <div style="margin-top:8px;">
          <button class="action-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <button class="action-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="action-btn" onclick="removeItem(${item.id})">Hapus</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  
  document.getElementById('cartTotal').innerText = formatRupiah(total);
}

// ============ WISHLIST FUNCTIONS ============
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(i => i !== id);
    showToast('💔 Dihapus dari wishlist');
  } else {
    wishlist.push(id);
    showToast('❤️ Ditambahkan ke wishlist!');
  }
  saveAll();
  updateAllBadges();
}

function renderWishlist() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;
  
  if (wishlist.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px;">💖 Wishlist masih kosong</div>';
    return;
  }
  
  container.innerHTML = '';
  wishlist.forEach(id => {
    const product = products.find(p => p.id === id);
    if (product) {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div style="flex:1;">
          <strong>${product.name}</strong><br>
          ${formatRupiah(product.price)}
          <div style="margin-top:8px;">
            <button class="action-btn" onclick="addToCart(${product.id})">+ Keranjang</button>
            <button class="action-btn" onclick="toggleWishlist(${product.id})">Hapus</button>
          </div>
        </div>
      `;
      container.appendChild(div);
    }
  });
}

// ============ TESTIMONIAL / ULASAN FUNCTIONS ============
function renderTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container) return;
  
  if (testimonials.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px;">✨ Belum ada ulasan. Jadilah yang pertama! ✨</div>';
    return;
  }
  
  container.innerHTML = '';
  testimonials.forEach(testi => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    // Generate star HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += i <= testi.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    
    card.innerHTML = `
      <div class="testimonial-header">
        <span class="testimonial-name"><i class="fas fa-user-circle"></i> ${testi.name}</span>
        <span class="testimonial-product">${testi.product}</span>
      </div>
      <div class="testimonial-rating">${starsHtml}</div>
      <div class="testimonial-comment">"${testi.comment}"</div>
      <div class="testimonial-date"><i class="far fa-calendar-alt"></i> ${testi.date}</div>
    `;
    
    container.appendChild(card);
  });
}

function addTestimonial(name, product, rating, comment) {
  const newTestimonial = {
    id: Date.now(),
    name: name,
    product: product,
    rating: parseInt(rating),
    comment: comment,
    date: new Date().toISOString().split('T')[0]
  };
  
  testimonials.unshift(newTestimonial); // Tambah di awal
  saveAll();
  renderTestimonials();
  showToast(`⭐ Terima kasih atas ulasannya! +10 Poin untuk Anda!`);
  
  // Beri reward poin
  userPoints += 10;
  saveAll();
  updateAllBadges();
}

function initTestimonialForm() {
  // Setup star rating untuk form testimonial
  const stars = document.querySelectorAll('#reviewStarsInput i');
  stars.forEach(star => {
    star.onclick = function() {
      const score = parseInt(this.dataset.score);
      currentRating = score;
      stars.forEach((s, idx) => {
        if (idx < score) {
          s.classList.add('active');
          s.classList.remove('far');
          s.classList.add('fas');
        } else {
          s.classList.remove('active');
          s.classList.remove('fas');
          s.classList.add('far');
        }
      });
    };
  });
  
  // Submit testimonial
  document.getElementById('submitUlasanBtn').onclick = () => {
    const name = document.getElementById('reviewerName').value.trim();
    const product = document.getElementById('reviewerProduct').value;
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (!name) {
      showToast('Silakan masukkan nama Anda');
      return;
    }
    if (!product) {
      showToast('Silakan pilih produk');
      return;
    }
    if (currentRating === 0) {
      showToast('Silakan beri rating bintang');
      return;
    }
    if (!comment) {
      showToast('Silakan tulis komentar');
      return;
    }
    
    addTestimonial(name, product, currentRating, comment);
    
    // Reset form
    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewerProduct').value = '';
    document.getElementById('reviewComment').value = '';
    currentRating = 0;
    stars.forEach(star => {
      star.classList.remove('active', 'fas');
      star.classList.add('far');
    });
  };
}

// ============ PRODUCT RENDERING ============
function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  products.forEach(product => {
    const isWished = wishlist.includes(product.id);
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Generate rating stars
    let starsHtml = '';
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) starsHtml += '<i class="fas fa-star"></i>';
      else if (i === fullStars + 1 && hasHalfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
      else starsHtml += '<i class="far fa-star"></i>';
    }
    
    card.innerHTML = `
      <img class="product-img" src="${product.image}" alt="${product.name}">
      <div class="product-title">${product.name}</div>
      <div class="product-price">${formatRupiah(product.price)}</div>
      <div class="rating">${starsHtml} ${product.rating} (${product.reviews.length} ulasan)</div>
      <div class="card-actions">
        <button class="action-btn add-cart-btn" data-id="${product.id}">
          <i class="fas fa-cart-plus"></i> Keranjang
        </button>
        <button class="action-btn wishlist-btn" data-id="${product.id}">
          <i class="fa${isWished ? 's' : 'r'} fa-heart"></i>
        </button>
        <button class="action-btn review-btn" data-id="${product.id}">
          <i class="fas fa-star"></i> Review
        </button>
      </div>
    `;
    
    grid.appendChild(card);
    
    card.querySelector('.add-cart-btn').onclick = () => addToCart(product.id);
    card.querySelector('.wishlist-btn').onclick = () => toggleWishlist(product.id);
    card.querySelector('.review-btn').onclick = () => openReviewModal(product.id);
  });
  
  renderFlashSale();
}

function renderFlashSale() {
  const flashDiv = document.getElementById('flashProducts');
  if (!flashDiv) return;
  
  flashDiv.innerHTML = '';
  const flashProducts = [products[0], products[2]];
  
  flashProducts.forEach(product => {
    const discPrice = Math.floor(product.price * 0.8);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.minWidth = '180px';
    card.innerHTML = `
      <img class="product-img" src="${product.image}" style="height:120px;">
      <div class="product-title">${product.name}</div>
      <div>
        <strike>${formatRupiah(product.price)}</strike>
        <strong style="color:var(--accent); display:block;">${formatRupiah(discPrice)}</strong>
      </div>
      <button class="action-btn" onclick="addToCart(${product.id}, true)">
        🔥 Beli Sekarang
      </button>
    `;
    flashDiv.appendChild(card);
  });
}

// ============ REVIEW MODAL ============
function openReviewModal(productId) {
  currentProductReview = productId;
  document.getElementById('reviewModal').classList.add('active');
}

function closeReviewModal() {
  document.getElementById('reviewModal').classList.remove('active');
  document.getElementById('reviewText').value = '';
  document.querySelectorAll('#starRating i').forEach(star => {
    star.classList.remove('active');
    star.classList.remove('fas');
    star.classList.add('far');
  });
}

function submitReview() {
  const stars = document.querySelectorAll('#starRating i.active').length;
  const reviewText = document.getElementById('reviewText').value;
  
  if (stars === 0) {
    showToast("⭐ Pilih rating bintang terlebih dahulu!");
    return;
  }
  
  const product = products.find(p => p.id === currentProductReview);
  if (product) {
    product.reviews.push({ stars, text: reviewText });
    const totalStars = product.reviews.reduce((sum, r) => sum + r.stars, 0);
    product.rating = totalStars / product.reviews.length;
    saveAll();
    updateAllBadges();
    showToast(`⭐ Terima kasih! +5 Poin telah ditambahkan`);
    userPoints += 5;
    saveAll();
    updateAllBadges();
  }
  
  closeReviewModal();
}

// ============ CHECKOUT ============
function checkout() {
  if (cart.length === 0) {
    showToast("Keranjang masih kosong!");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cashback = Math.floor(total / 100000) * 10;
  userPoints += cashback;
  
  showToast(`✅ Checkout berhasil! Dapat ${cashback} poin cashback! Total poin: ${userPoints}`);
  
  cart = [];
  saveAll();
  updateAllBadges();
  closeCart();
}

// ============ SIDEBAR FUNCTIONS ============
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
}

function openWishlist() {
  document.getElementById('wishlistSidebar').classList.add('open');
  document.getElementById('wishlistOverlay').classList.add('active');
  renderWishlist();
}

function closeWishlist() {
  document.getElementById('wishlistSidebar').classList.remove('open');
  document.getElementById('wishlistOverlay').classList.remove('active');
}

// ============ COUNTDOWN TIMER ============
function startCountdown() {
  const target = new Date();
  target.setHours(target.getHours() + 23);
  target.setMinutes(59);
  target.setSeconds(59);
  
  const timer = setInterval(() => {
    const now = new Date();
    const diff = target - now;
    
    if (diff <= 0) {
      document.getElementById('countdownTimer').innerText = '🔥 SALE BERAKHIR! 🔥';
      clearInterval(timer);
    } else {
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      document.getElementById('countdownTimer').innerText = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

// ============ DARK MODE ============
function initDarkMode() {
  const darkToggle = document.getElementById('darkModeToggle');
  
  if (localStorage.getItem('aervy_dark') === 'true') {
    document.body.classList.add('dark');
  }
  
  darkToggle.onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('aervy_dark', document.body.classList.contains('dark'));
  };
}

// ============ SCROLL FUNCTIONS ============
function scrollToProducts() {
  document.getElementById('produkSection').scrollIntoView({ behavior: 'smooth' });
}

function scrollToHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToUlasan() {
  document.getElementById('ulasanSection').scrollIntoView({ behavior: 'smooth' });
}

// ============ EVENT LISTENERS ============
function initEventListeners() {
  document.getElementById('shopNowBtn').onclick = scrollToProducts;
  document.getElementById('produkLink').onclick = scrollToProducts;
  document.getElementById('ulasanLink').onclick = scrollToUlasan;
  document.getElementById('homeLink').onclick = scrollToHome;
  document.getElementById('cartIcon').onclick = openCart;
  document.getElementById('closeCartBtn').onclick = closeCart;
  document.getElementById('cartOverlay').onclick = closeCart;
  document.getElementById('wishlistIcon').onclick = openWishlist;
  document.getElementById('closeWishlistBtn').onclick = closeWishlist;
  document.getElementById('wishlistOverlay').onclick = closeWishlist;
  document.getElementById('checkoutBtn').onclick = checkout;
  document.getElementById('submitReviewBtn').onclick = submitReview;
  document.getElementById('closeModalBtn').onclick = closeReviewModal;
  
  // Setup rating stars di modal
  const modalStars = document.querySelectorAll('#starRating i');
  modalStars.forEach(star => {
    star.onclick = function() {
      const score = parseInt(this.dataset.score);
      modalStars.forEach((s, idx) => {
        if (idx < score) {
          s.classList.add('active');
          s.classList.remove('far');
          s.classList.add('fas');
        } else {
          s.classList.remove('active');
          s.classList.remove('fas');
          s.classList.add('far');
        }
      });
    };
  });
  
  // Close modal on overlay click
  document.getElementById('reviewModal').onclick = (e) => {
    if (e.target === document.getElementById('reviewModal')) {
      closeReviewModal();
    }
  };
  
  // ESC key to close sidebars
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeWishlist();
      closeReviewModal();
    }
  });
}

// ============ INITIALIZATION ============
function init() {
  loadData();
  renderProducts();
  initEventListeners();
  startCountdown();
  initDarkMode();
  initTestimonialForm();
}

// Start the app
init();