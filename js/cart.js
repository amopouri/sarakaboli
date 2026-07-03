/* =====================================================================
   SARA KABOLI — cart.js
   Shopping cart page: render lines, qty/remove/clear, totals, checkout.
   Depends on window.SK (store.js).
   ===================================================================== */
(function () {
  'use strict';
  if (!window.SK) return;
  const $ = (s, c = document) => c.querySelector(s);
  const fa = SK.faDigits;

  const cartView = $('#cartView');
  const emptyView = $('#emptyView');
  const orderView = $('#orderView');
  const linesEl = $('#cartLines');

  function lineHtml(l) {
    const p = l.product;
    return '<div class="cart-line" data-id="' + p.id + '">' +
      '<div class="thumb"><img src="' + p.img + '" alt="' + p.title + '"></div>' +
      '<div class="info">' +
        '<b>' + p.title + '</b>' +
        '<span>' + (p.subtitle || '') + '</span>' +
        '<span class="unit">' + SK.money(p.price) + '</span>' +
      '</div>' +
      '<div class="right">' +
        '<div class="qty" role="group" aria-label="تعداد">' +
          '<button type="button" data-dec aria-label="کاهش">−</button>' +
          '<input type="text" inputmode="numeric" value="' + fa(l.qty) + '" data-qty-input aria-label="تعداد">' +
          '<button type="button" data-inc aria-label="افزایش">+</button>' +
        '</div>' +
        '<span class="ltotal">' + SK.money(l.lineTotal) + '</span>' +
        '<button type="button" class="line-remove" data-remove><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>حذف</button>' +
      '</div>' +
    '</div>';
  }

  function render() {
    // if an order was just placed, keep the confirmation visible
    if (orderView.style.display !== 'none' && orderView.dataset.shown === '1') return;

    const lines = SK.cartLines();
    if (!lines.length) {
      cartView.style.display = 'none';
      orderView.style.display = 'none';
      emptyView.style.display = '';
      return;
    }
    emptyView.style.display = 'none';
    orderView.style.display = 'none';
    cartView.style.display = '';

    linesEl.innerHTML = lines.map(lineHtml).join('');
    $('#cartLineCount').textContent = fa(SK.cartCount());

    const sub = SK.cartSubtotal();
    const save = SK.cartSavings();
    $('#sumSubtotal').textContent = SK.money(sub);
    $('#sumTotal').textContent = SK.money(sub);
    const rowSave = $('#rowSave');
    if (save > 0) { rowSave.style.display = ''; $('#sumSave').textContent = SK.money(save); }
    else rowSave.style.display = 'none';
  }

  // delegated controls on lines
  linesEl.addEventListener('click', e => {
    const line = e.target.closest('.cart-line');
    if (!line) return;
    const id = line.getAttribute('data-id');
    const cur = (SK.getCart().find(i => i.id === id) || { qty: 1 }).qty;
    if (e.target.closest('[data-inc]')) SK.setQty(id, cur + 1);
    else if (e.target.closest('[data-dec]')) SK.setQty(id, cur - 1);
    else if (e.target.closest('[data-remove]')) { SK.removeFromCart(id); SK.toast('محصول از سبد حذف شد'); }
  });
  // direct qty input
  linesEl.addEventListener('change', e => {
    const inp = e.target.closest('[data-qty-input]');
    if (!inp) return;
    const line = e.target.closest('.cart-line');
    const id = line.getAttribute('data-id');
    const n = parseInt(SK.enDigits(inp.value).replace(/[^\d]/g, ''), 10);
    SK.setQty(id, isNaN(n) || n < 1 ? 1 : n);
  });

  // clear cart
  $('#clearCart').addEventListener('click', () => { SK.clearCart(); SK.toast('سبد خرید خالی شد'); });

  // checkout
  $('#checkoutBtn').addEventListener('click', () => {
    if (!SK.isAuthed()) {
      SK.toast('برای تکمیل خرید ابتدا وارد شوید', 'error');
      setTimeout(() => location.href = 'account.html#login', 800);
      return;
    }
    const res = SK.checkout();
    if (!res.ok) {
      if (res.error === 'auth') { location.href = 'account.html#login'; return; }
      SK.toast(res.error, 'error'); return;
    }
    cartView.style.display = 'none';
    emptyView.style.display = 'none';
    orderView.style.display = '';
    orderView.dataset.shown = '1';
    $('#orderId').textContent = res.order.id;
    SK.toast('سفارش با موفقیت ثبت شد');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  SK.on('cart', render);
  render();
})();
