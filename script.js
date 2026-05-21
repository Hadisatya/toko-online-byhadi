// Data Produk (pink themed items)
  const products = [
    { id: 1, name: "Celana Kulot High Waist Cream Pleated", price: 259000, image: src="img/foto1.jpeg" , category: "dress" },
    { id: 2, name: "Soft Beige Office Wide Pants", price: 589000, image: src="img/foto2.jpeg", category: "bag" },
    { id: 3, name: "Black Elegant Loose Trousers", price: 89000, image: src="img/foto3.jpeg", category: "makeup" },
    { id: 4, name: "Korean Style Formal Wide Leg Pants", price: 329000, image: src="img/foto4.jpeg", category: "shoes" },
  ];

  // Keranjang: array of { id, name, price, image, quantity }
  let cart = [];

  // DOM Elements
  const productGrid = document.getElementById('productGrid');
  const cartCountSpan = document.getElementById('cartCount');
  const cartIcon = document.getElementById('cartIcon');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalPriceSpan = document.getElementById('cartTotalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const shopNowBtn = document.getElementById('shopNowBtn');

  // Utility: format Rupiah
  function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  // Simpan ke localStorage
  function saveCartToLocal() {
    localStorage.setItem('pinkShopCart', JSON.stringify(cart));
  }

  // Load dari localStorage
  function loadCartFromLocal() {
    const stored = localStorage.getItem('pinkShopCart');
    if(stored) {
      try {
        cart = JSON.parse(stored);
        if(!Array.isArray(cart)) cart = [];
      } catch(e) { cart = []; }
    } else {
      cart = [];
    }
    updateCartUI();
  }

  // Menampilkan notifikasi singkat
  function showToast(message) {
    const existingToast = document.querySelector('.toast-msg');
    if(existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      if(toast) toast.remove();
    }, 2000);
  }

  // Render semua produk
  function renderProducts() {
    if(!productGrid) return;
    productGrid.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-title">${product.name}</div>
        <div class="product-price">${formatRupiah(product.price)}</div>
        <div class="add-to-cart" data-id="${product.id}">
          <i class="fas fa-cart-plus"></i> Tambah
        </div>
      `;
      const btnAdd = card.querySelector('.add-to-cart');
      btnAdd.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id);
      });
      productGrid.appendChild(card);
    });
  }

  // Tambah ke keranjang
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if(!product) return;
    const existingItem = cart.find(item => item.id === productId);
    if(existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    saveCartToLocal();
    updateCartUI();
    showToast(`✨ ${product.name} ditambahkan ke keranjang!`);
  }

  // Update keseluruhan UI cart (jumlah, tampilan sidebar, total)
  function updateCartUI() {
    // update cart badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.innerText = totalItems;
    // render cart items di sidebar
    renderCartItems();
    // update total price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPriceSpan.innerText = formatRupiah(totalPrice);
    // simpan localstorage setiap update
    saveCartToLocal();
  }

  // Render item di sidebar
  function renderCartItems() {
    if(!cartItemsContainer) return;
    if(cart.length === 0) {
      cartItemsContainer.innerHTML = `<div class="empty-cart"><i class="fas fa-heart-broken"></i> <br> Keranjang masih kosong <br> Yuk, belanja dulu! 💖</div>`;
      return;
    }
    cartItemsContainer.innerHTML = '';
    cart.forEach((item, idx) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)}</div>
          <div class="cart-qty">
            <button class="cart-dec" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="cart-inc" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-total">${formatRupiah(item.price * item.quantity)}</div>
        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });
    // attach event listeners to inc/dec/remove
    document.querySelectorAll('.cart-inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const cartItem = cart.find(i => i.id === id);
        if(cartItem) {
          cartItem.quantity += 1;
          updateCartUI();
        }
      });
    });
    document.querySelectorAll('.cart-dec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const cartItem = cart.find(i => i.id === id);
        if(cartItem) {
          if(cartItem.quantity > 1) {
            cartItem.quantity -= 1;
          } else {
            // hapus jika quantity 1 dan user klik minus
            cart = cart.filter(i => i.id !== id);
          }
          updateCartUI();
        }
      });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
        showToast('🗑️ Item dihapus dari keranjang');
      });
    });
  }

  // Buka / tutup cart sidebar
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    renderCartItems(); // refresh saat buka
  }
  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
  }

  // Checkout
  function handleCheckout() {
    if(cart.length === 0) {
      showToast('Keranjang kosong, tambahkan produk dulu ya 💕');
      return;
    }
    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    showToast(`🎉 Terima kasih! Pesanan total ${formatRupiah(total)} berhasil diproses. (Demo)`);
    // kosongkan keranjang setelah checkout
    cart = [];
    updateCartUI();
    closeCart();
  }

  // Scroll ke produk
  function scrollToProducts() {
    const produkSection = document.getElementById('produk');
    if(produkSection) {
      produkSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Event Listeners
  cartIcon.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  checkoutBtn.addEventListener('click', handleCheckout);
  shopNowBtn.addEventListener('click', scrollToProducts);

  // Inisialisasi
  renderProducts();
  loadCartFromLocal();  // load cart dan render UI

  // tambahan: klik di luar produk tidak masalah
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && cartSidebar.classList.contains('open')) {
      closeCart();
    }
  });