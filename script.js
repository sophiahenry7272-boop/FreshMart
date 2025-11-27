/**
 * script.js - main site JS
 * Handles product rendering, cart, modal, nav, admin panel toggles.
 */
document.addEventListener('DOMContentLoaded', () => {

  // Short helper
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Basic UI elements
  const cartCountSpan = document.querySelectorAll('.cart-count');
  const cartModal = document.getElementById('cart-modal');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalSpan = document.getElementById('cart-subtotal');
  const cartActionsDiv = cartModal ? cartModal.querySelector('.cart-actions') : null;
  const cartIcon = document.querySelector('.cart-icon');
  const cartModalClose = cartModal ? cartModal.querySelector('.close-modal-btn') : null;
  const productDetailModal = document.getElementById('product-detail-modal');
  const productDetailContainer = document.getElementById('product-detail-container');
  const bestsellerGrid = document.getElementById('bestseller-grid');
  const productGridShop = document.getElementById('product-grid-shop');
  const categoryFilter = document.getElementById('category-filter');
  const sortOptions = document.getElementById('sort-options');

  // Admin panel in index.html
  const adminPanelSection = document.getElementById('admin-panel-section');
  const adminOrdersBody = document.getElementById('admin-orders-body');
  const adminRefreshBtn = document.getElementById('admin-refresh');
  const adminClearAllBtn = document.getElementById('admin-clear-all');

  // mobile/menu/theme
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  }
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (themeToggleBtn) {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }

  // Cart state
  let cart = [];

  function loadCart() {
    try {
      cart = JSON.parse(localStorage.getItem('freshmartCart') || '[]');
      if (!Array.isArray(cart)) cart = [];
      cart = cart.map(i => ({ id: i.id, quantity: parseInt(i.quantity) || 1 }));
    } catch(e) { cart = []; }
    updateCartCounter();
  }
  function saveCart() { localStorage.setItem('freshmartCart', JSON.stringify(cart)); }
  function updateCartCounter() {
    const total = cart.reduce((s,i) => s + (i.quantity || 0), 0);
    cartCountSpan.forEach(el => el.textContent = total);
  }

  // Add to cart
  function addToCart(productId, qty = 1) {
    const pIndex = cart.findIndex(it => it.id === productId);
    if (pIndex > -1) cart[pIndex].quantity = (cart[pIndex].quantity || 0) + qty;
    else cart.push({ id: productId, quantity: qty });
    saveCart(); updateCartCounter();
  }

  // Remove from cart
  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart(); updateCartCounter(); displayCartItems();
  }

  function updateCartItemQuantity(productId, newQty) {
    const idx = cart.findIndex(i => i.id === productId);
    if (idx > -1) {
      cart[idx].quantity = Math.max(1, parseInt(newQty) || 1);
      saveCart(); updateCartCounter(); displayCartItems();
    }
  }

  // Display cart items inside modal
  function displayCartItems() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    if (cart.length === 0) {
      if (cartModal) {
        const empty = document.createElement('p'); empty.className = 'cart-empty-msg'; empty.textContent = 'Your cart is empty.'; cartItemsContainer.appendChild(empty);
      }
      if (cartSubtotalSpan) cartSubtotalSpan.textContent = 'PKR 0.00';
      if (cartActionsDiv) cartActionsDiv.innerHTML = `<a href="shop.html" class="btn btn-primary shop-now-link-btn">Shop Now</a>`;
      return;
    }

    cart.forEach(ci => {
      const p = products.find(x => x.id === ci.id);
      if (!p) return;
      const q = ci.quantity || 1;
      const total = p.price * q; subtotal += total;

      const div = document.createElement('div'); div.className = 'cart-item';
      div.dataset.productId = ci.id;
      div.innerHTML = `
        <img src="${p.imageSrc}" alt="${p.name}">
        <div class="item-details">
          <span class="item-name">${p.name}</span>
          <span class="item-price">PKR ${p.price.toFixed(2)} ${p.unit || ''}</span>
        </div>
        <div class="item-quantity">
          <button class="quantity-change" data-change="-1">-</button>
          <input class="quantity-input" type="number" min="1" value="${q}">
          <button class="quantity-change" data-change="1">+</button>
        </div>
        <span class="item-total">PKR ${total.toFixed(2)}</span>
        <button class="remove-from-cart-btn" aria-label="Remove"><i class="fa-solid fa-trash-can"></i></button>
      `;
      cartItemsContainer.appendChild(div);
    });

    if (cartSubtotalSpan) cartSubtotalSpan.textContent = `PKR ${subtotal.toFixed(2)}`;
    if (cartActionsDiv) cartActionsDiv.innerHTML = `<button class="btn btn-primary checkout-btn">Proceed to Checkout</button>`;
  }

  // Product detail modal
  function displayProductDetail(id) {
    const p = products.find(x => x.id === id);
    if (!p || !productDetailModal) return;
    productDetailContainer.innerHTML = `
      <img src="${p.imageSrc}" alt="${p.name}" class="product-detail-image">
      <div class="product-detail-info">
        <h2 class="product-detail-name">${p.name}</h2>
        <p class="product-detail-category">Category: ${p.category}</p>
        <p class="product-detail-price">PKR ${p.price.toFixed(2)}${p.unit || ''}</p>
        <p class="product-detail-description">${p.description || ''}</p>
        <button class="btn btn-primary add-to-cart-from-detail" data-product-id="${p.id}">Add to Cart</button>
      </div>
    `;
    productDetailModal.classList.add('open'); document.body.style.overflow = 'hidden';
  }

  // Render product card HTML (used on home bestsellers and shop)
  function renderProductCardHTML(product) {
    return `
      <div class="product-card" data-id="${product.id}" data-category="${product.category}">
        <img src="${product.imageSrc}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">PKR ${product.price.toFixed(2)}${product.unit ? ` <span>${product.unit}</span>` : ''}</p>
      </div>
    `;
  }

  // Attach single event listeners
  if (bestsellerGrid && typeof bestsellerIds !== 'undefined') {
    const bests = bestsellerIds.map(id => products.find(p=>p.id===id)).filter(Boolean);
    bestsellerGrid.innerHTML = bests.length ? bests.map(renderProductCardHTML).join('') : '<p class="no-products">No bestsellers found.</p>';
    bestsellerGrid.addEventListener('click', e => { const card = e.target.closest('.product-card'); if (card) displayProductDetail(card.dataset.id); });
  }

  if (productGridShop && typeof products !== 'undefined') {
    const renderShop = (list) => productGridShop.innerHTML = list.length ? list.map(renderProductCardHTML).join('') : '<p class="no-products">No products found.</p>';
    // Initial render
    renderShop(products);
    productGridShop.addEventListener('click', e => { const card = e.target.closest('.product-card'); if (card) displayProductDetail(card.dataset.id); });
    if (categoryFilter) categoryFilter.addEventListener('change', () => {
      const cat = categoryFilter.value; let filtered = products.filter(p => cat === 'all' || p.category === cat);
      const sortVal = sortOptions ? sortOptions.value : 'default';
      filtered.sort((a,b) => {
        if (sortVal === 'price-asc') return a.price - b.price;
        if (sortVal === 'price-desc') return b.price - a.price;
        if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
        if (sortVal === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
      renderShop(filtered);
    });
    if (sortOptions) sortOptions.addEventListener('change', () => categoryFilter.dispatchEvent(new Event('change')));
  }

  // Cart open/close
  if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', (e) => { e.preventDefault(); displayCartItems(); cartModal.classList.add('open'); document.body.style.overflow='hidden'; });
  }
  if (cartModal && cartModalClose) {
    cartModalClose.addEventListener('click', () => { cartModal.classList.remove('open'); document.body.style.overflow=''; });
    cartModal.addEventListener('click', (ev) => { if (ev.target === cartModal) { cartModal.classList.remove('open'); document.body.style.overflow=''; } });
  }

  // Product detail modal close
  if (productDetailModal) {
    const closeBtn = productDetailModal.querySelector('.close-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => { productDetailModal.classList.remove('open'); document.body.style.overflow=''; });
    productDetailModal.addEventListener('click', (ev) => { if (ev.target === productDetailModal) { productDetailModal.classList.remove('open'); document.body.style.overflow=''; } });
  }

  // Detail modal add to cart
  if (productDetailContainer) {
    productDetailContainer.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('add-to-cart-from-detail')) {
        const pid = ev.target.dataset.productId; addToCart(pid,1);
        ev.target.textContent = 'Added!'; ev.target.disabled = true;
      }
    });
  }

  // Cart item interactions (delegation)
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button');
      const cartItemDiv = ev.target.closest('.cart-item');
      if (!cartItemDiv) return;
      const pid = cartItemDiv.dataset.productId;
      if (btn && btn.classList.contains('quantity-change')) {
        const change = parseInt(btn.dataset.change || '0'); const input = cartItemDiv.querySelector('.quantity-input');
        if (input) updateCartItemQuantity(pid, parseInt(input.value || '1') + change);
      } else if (btn && btn.classList.contains('remove-from-cart-btn')) {
        removeFromCart(pid);
      }
    });

    cartItemsContainer.addEventListener('change', (ev) => {
      const input = ev.target;
      if (input && input.classList.contains('quantity-input')) {
        const pid = input.closest('.cart-item').dataset.productId;
        updateCartItemQuantity(pid, input.value);
      }
    });
  }

  // Checkout button: redirect to checkout page (so checkout page can collect address)
  if (cartActionsDiv) {
    cartActionsDiv.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('checkout-btn')) {
        if (cart.length === 0) { alert('Your cart is empty.'); return; }
        window.location.href = 'checkout.html';
      }
      // shop-now handled in displayCartItems
    });
  }

  // ADMIN PANEL (embedded on home). For security: simple password prompt before showing
  const adminLink = document.getElementById('admin-link');
  const adminLink2 = document.getElementById('admin-link-2');
  const ADMIN_PASS = 'admin123'; // change or secure as desired

  function promptAdminAndShow() {
    const pass = prompt('Enter admin password:');
    if (pass === ADMIN_PASS) {
      if (adminPanelSection) adminPanelSection.style.display = 'block';
      loadAdminOrders();
      window.scrollTo({ top: adminPanelSection ? adminPanelSection.offsetTop : 0, behavior: 'smooth' });
    } else if (pass !== null) {
      alert('Incorrect password.');
    }
  }
  if (adminLink) adminLink.addEventListener('click', (e) => { e.preventDefault(); promptAdminAndShow(); });
  if (adminLink2) adminLink2.addEventListener('click', (e) => { e.preventDefault(); promptAdminAndShow(); });

  // Admin helpers
  function loadAdminOrders() {
    if (!adminOrdersBody) return;
    const orders = JSON.parse(localStorage.getItem('freshmartOrders') || '[]');
    adminOrdersBody.innerHTML = '';
    if (!orders.length) { adminOrdersBody.innerHTML = '<tr><td colspan="10">No orders yet.</td></tr>'; return; }
    orders.slice().reverse().forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.customer.name}</td>
        <td>${o.customer.phone}</td>
        <td>${o.customer.city}</td>
        <td>${o.customer.address} (${o.customer.label})</td>
        <td>${o.items.map(it => {
          const p = products.find(x => x.id === it.id);
          return `${p ? p.name : it.id} x${it.quantity}`;
        }).join('<br>')}</td>
        <td>PKR ${parseFloat(o.subtotal).toFixed(2)}</td>
        <td>${o.status}</td>
        <td>${new Date(o.placedAt).toLocaleString()}</td>
        <td>
          <button class="btn" data-action="mark" data-id="${o.id}">Mark Delivered</button>
          <button class="btn" data-action="delete" data-id="${o.id}">Delete</button>
        </td>
      `;
      adminOrdersBody.appendChild(tr);
    });
  }

  if (adminRefreshBtn) adminRefreshBtn.addEventListener('click', loadAdminOrders);
  if (adminClearAllBtn) adminClearAllBtn.addEventListener('click', () => {
    if (!confirm('Clear all orders from localStorage?')) return;
    localStorage.removeItem('freshmartOrders');
    loadAdminOrders();
    alert('All orders cleared.');
  });

  // Admin actions delegation
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (!action || !id) return;
    if (action === 'mark') {
      let orders = JSON.parse(localStorage.getItem('freshmartOrders') || '[]');
      const idx = orders.findIndex(o => o.id === id);
      if (idx > -1) {
        orders[idx].status = 'delivered';
        localStorage.setItem('freshmartOrders', JSON.stringify(orders));
        loadAdminOrders();
      }
    } else if (action === 'delete') {
      if (!confirm('Delete this order?')) return;
      let orders = JSON.parse(localStorage.getItem('freshmartOrders') || '[]');
      orders = orders.filter(o => o.id !== id);
      localStorage.setItem('freshmartOrders', JSON.stringify(orders));
      loadAdminOrders();
    }
  });

  // Initial load
  loadCart();
  // render bestseller (already done above)
  // Footer year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
