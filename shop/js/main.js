document.addEventListener('DOMContentLoaded', () => {

  // ---- Footer year ----
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile navigation ----
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay   = document.querySelector('.nav-overlay');
  const navClose  = document.querySelector('.nav-close');
  hamburger?.addEventListener('click', () => overlay.classList.add('open'));
  navClose?.addEventListener('click', () => overlay.classList.remove('open'));
  document.querySelectorAll('.nav-overlay-links a').forEach(link =>
    link.addEventListener('click', () => overlay.classList.remove('open'))
  );

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ==========================================================
  //  Cart (framework-level, in-memory)
  // ==========================================================
  const cart = [];
  const cartCountEl   = document.getElementById('cart-count');
  const cartItemsEl   = document.getElementById('cart-items');
  const cartSummaryEl = document.getElementById('cart-summary');
  const cartTotalEl   = document.getElementById('cart-total');

  function formatYen(n) {
    return '¥' + n.toLocaleString('en-US');
  }

  function renderCart() {
    const count = cart.length;
    cartCountEl.textContent = count;

    if (!count) {
      cartItemsEl.innerHTML =
        '<p class="cart-empty">Your cart is empty. Browse the <a href="#shop">shop</a> to add items.</p>';
      cartSummaryEl.hidden = true;
      return;
    }

    cartItemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-line">
        <span class="cart-line-name">${escapeHtml(item.name)}</span>
        <span class="cart-line-right">
          <span class="cart-line-price">${item.price > 0 ? formatYen(item.price) : 'Quote'}</span>
          <button class="cart-remove" data-index="${i}" aria-label="Remove">&times;</button>
        </span>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = formatYen(total);
    cartSummaryEl.hidden = false;
  }

  // Add to cart
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.push({
        name:  btn.dataset.name || 'Item',
        price: parseInt(btn.dataset.price, 10) || 0
      });
      renderCart();
      // brief feedback
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(() => { btn.textContent = original; }, 1200);
    });
  });

  // Remove from cart (event delegation)
  cartItemsEl?.addEventListener('click', (e) => {
    const rm = e.target.closest('.cart-remove');
    if (!rm) return;
    cart.splice(parseInt(rm.dataset.index, 10), 1);
    renderCart();
  });

  // ==========================================================
  //  Stripe checkout — INTEGRATION POINT (placeholder)
  // ==========================================================
  //  When ready, replace the alert below with a real Stripe flow.
  //  Typical setup:
  //    1. Add <script src="https://js.stripe.com/v3/"></script> to index.html
  //    2. Create a backend endpoint that builds a Checkout Session
  //       from `cart` and returns its session URL/id.
  //    3. Redirect the customer to Stripe Checkout:
  //         const stripe = Stripe('pk_live_xxx');
  //         stripe.redirectToCheckout({ sessionId });
  //  Prices here are in JPY; set currency: 'jpy' in the Session.
  // ==========================================================
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (!cart.length) return;
    alert(
      'Checkout is not connected yet.\n\n' +
      'This is where Stripe Checkout will open.\n' +
      'Items in cart: ' + cart.length + '\n' +
      'Subtotal: ' + cartTotalEl.textContent
    );
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  renderCart();
});
