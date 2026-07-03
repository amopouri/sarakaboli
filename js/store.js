/* =====================================================================
   SARA KABOLI — store.js
   Shared front-end data layer (no backend). Persists to localStorage.
   Exposes window.SK. Loaded first on every page.
   NOTE: this is a client-side demo store; password hashing here is a
   lightweight obfuscation, not real security. Replace with a real API
   when a backend is available.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- low-level storage ---------- */
  const KEYS = {
    users: 'sk_users',
    session: 'sk_session',
    cart: 'sk_cart',
    requests: 'sk_requests',
    orders: 'sk_orders',
    reset: 'sk_reset'
  };
  const read = (k, fallback) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- utils ---------- */
  const FA = '۰۱۲۳۴۵۶۷۸۹';
  const faDigits = n => String(n).replace(/\d/g, d => FA[d]);
  const enDigits = s => String(s).replace(/[۰-۹]/g, d => FA.indexOf(d));
  const money = n => faDigits(Number(n || 0).toLocaleString('en-US')) + ' تومان';
  const uid = () => 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const hash = str => {
    // djb2 + salt — obfuscation only
    let h = 5381; const s = 'sk7:' + str;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(16);
  };
  const emailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  /* ---------- product catalog ---------- */
  const PRODUCTS = [
    {
      id: 'smart-course',
      title: 'دوره‌ی هوشمند زبان ترکی استانبولی',
      subtitle: 'صفر تا صد · مناسب مبتدی تا پیشرفته',
      price: 1937000, old: 2980000,
      img: 'Images/course-banner.jpg',
      badge: 'SMART'
    },
    {
      id: 'consult-session',
      title: 'جلسه‌ی مشاوره‌ی تخصصی مهاجرت',
      subtitle: 'مشاوره‌ی اختصاصی ۴۵ دقیقه‌ای با سارا کابلی',
      price: 490000, old: 0,
      img: 'Images/sara-portrait.jpg',
      badge: 'VIP'
    }
  ];
  const productById = id => PRODUCTS.find(p => p.id === id) || null;

  /* ---------- pub/sub ---------- */
  const subs = {};
  const on = (evt, fn) => { (subs[evt] = subs[evt] || []).push(fn); };
  const emit = (evt, data) => { (subs[evt] || []).forEach(fn => { try { fn(data); } catch (e) {} }); };

  /* ---------- session / auth ---------- */
  const getUsers = () => read(KEYS.users, []);
  const setUsers = u => write(KEYS.users, u);
  const currentEmail = () => read(KEYS.session, null);
  const currentUser = () => {
    const e = currentEmail();
    if (!e) return null;
    return getUsers().find(u => u.email === e) || null;
  };
  const isAuthed = () => !!currentUser();

  function register({ name, email, phone, password }) {
    name = (name || '').trim(); email = (email || '').trim().toLowerCase(); phone = (phone || '').trim();
    if (!name) return { ok: false, error: 'لطفاً نام و نام خانوادگی را وارد کنید.' };
    if (!emailOk(email)) return { ok: false, error: 'ایمیل واردشده معتبر نیست.' };
    if ((password || '').length < 6) return { ok: false, error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' };
    const users = getUsers();
    if (users.some(u => u.email === email)) return { ok: false, error: 'این ایمیل قبلاً ثبت شده است.' };
    const user = { id: uid(), name, email, phone, pass: hash(password), createdAt: Date.now() };
    users.push(user); setUsers(users);
    write(KEYS.session, email); emit('auth');
    return { ok: true, user };
  }
  function login({ email, password }) {
    email = (email || '').trim().toLowerCase();
    const user = getUsers().find(u => u.email === email);
    if (!user || user.pass !== hash(password || '')) return { ok: false, error: 'ایمیل یا رمز عبور نادرست است.' };
    write(KEYS.session, email); emit('auth');
    return { ok: true, user };
  }
  function logout() { localStorage.removeItem(KEYS.session); emit('auth'); }

  function requestReset(email) {
    email = (email || '').trim().toLowerCase();
    const user = getUsers().find(u => u.email === email);
    if (!user) return { ok: false, error: 'حسابی با این ایمیل پیدا نشد.' };
    const token = Math.random().toString(36).slice(2, 8).toUpperCase();
    const resets = read(KEYS.reset, {}); resets[email] = token; write(KEYS.reset, resets);
    return { ok: true, token, email };
  }
  function resetPassword({ email, token, password }) {
    email = (email || '').trim().toLowerCase();
    const resets = read(KEYS.reset, {});
    if (!resets[email] || resets[email] !== (token || '').trim().toUpperCase())
      return { ok: false, error: 'کد بازیابی نادرست است.' };
    if ((password || '').length < 6) return { ok: false, error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' };
    const users = getUsers(); const u = users.find(x => x.email === email);
    if (!u) return { ok: false, error: 'حساب پیدا نشد.' };
    u.pass = hash(password); setUsers(users);
    delete resets[email]; write(KEYS.reset, resets);
    return { ok: true };
  }
  function updateProfile({ name, phone }) {
    const users = getUsers(); const u = users.find(x => x.email === currentEmail());
    if (!u) return { ok: false, error: 'ابتدا وارد شوید.' };
    if (name && name.trim()) u.name = name.trim();
    u.phone = (phone || '').trim();
    setUsers(users); emit('auth');
    return { ok: true, user: u };
  }

  /* ---------- consultation requests ---------- */
  const allRequests = () => read(KEYS.requests, []);
  function addRequest(data) {
    const list = allRequests();
    const req = Object.assign({
      id: uid(), createdAt: Date.now(), status: 'pending',
      email: currentEmail() || (data.email || '').trim().toLowerCase() || null
    }, data);
    list.unshift(req); write(KEYS.requests, list); emit('requests');
    return req;
  }
  const myRequests = () => {
    const e = currentEmail(); if (!e) return [];
    return allRequests().filter(r => r.email === e);
  };
  const STATUS = {
    pending: { label: 'در حال بررسی', step: 1 },
    review: { label: 'در حال پیگیری', step: 2 },
    done: { label: 'تکمیل‌شده', step: 3 }
  };

  /* ---------- cart ---------- */
  const getCart = () => read(KEYS.cart, []);
  const setCart = c => { write(KEYS.cart, c); emit('cart'); };
  const cartCount = () => getCart().reduce((s, i) => s + i.qty, 0);
  const cartLines = () => getCart().map(i => {
    const p = productById(i.id); if (!p) return null;
    return { id: i.id, qty: i.qty, product: p, lineTotal: p.price * i.qty };
  }).filter(Boolean);
  const cartSubtotal = () => cartLines().reduce((s, l) => s + l.lineTotal, 0);
  const cartSavings = () => cartLines().reduce((s, l) => s + ((l.product.old || 0) ? (l.product.old - l.product.price) * l.qty : 0), 0);
  function addToCart(id, qty) {
    qty = qty || 1; if (!productById(id)) return false;
    const c = getCart(); const ex = c.find(i => i.id === id);
    if (ex) ex.qty = Math.min(ex.qty + qty, 20); else c.push({ id, qty: Math.min(qty, 20) });
    setCart(c); return true;
  }
  function setQty(id, qty) {
    const c = getCart(); const ex = c.find(i => i.id === id);
    if (!ex) return; ex.qty = Math.max(1, Math.min(qty, 20)); setCart(c);
  }
  function removeFromCart(id) { setCart(getCart().filter(i => i.id !== id)); }
  function clearCart() { setCart([]); }

  /* ---------- orders ---------- */
  const myOrders = () => {
    const e = currentEmail(); if (!e) return [];
    return read(KEYS.orders, []).filter(o => o.email === e);
  };
  function checkout() {
    if (!isAuthed()) return { ok: false, error: 'auth' };
    const lines = cartLines(); if (!lines.length) return { ok: false, error: 'سبد خرید خالی است.' };
    const order = {
      id: 'SK-' + Date.now().toString(36).toUpperCase().slice(-6),
      email: currentEmail(), createdAt: Date.now(),
      items: lines.map(l => ({ id: l.id, title: l.product.title, qty: l.qty, price: l.product.price })),
      total: cartSubtotal(), status: 'paid'
    };
    const orders = read(KEYS.orders, []); orders.unshift(order); write(KEYS.orders, orders);
    clearCart(); emit('orders');
    return { ok: true, order };
  }

  /* ---------- toast ---------- */
  let toastWrap = null;
  function toast(msg, type) {
    if (!toastWrap) {
      toastWrap = document.createElement('div'); toastWrap.className = 'sk-toasts';
      document.body.appendChild(toastWrap);
    }
    const t = document.createElement('div');
    t.className = 'sk-toast' + (type ? ' ' + type : '');
    const icon = type === 'error'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>';
    t.innerHTML = '<span class="ic">' + icon + '</span><span>' + msg + '</span>';
    toastWrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 350); }, 3000);
  }

  /* ---------- header hydration ---------- */
  function hydrateHeader() {
    const count = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = faDigits(count);
      el.classList.toggle('has', count > 0);
    });
    const u = currentUser();
    document.querySelectorAll('[data-account-link]').forEach(a => {
      const label = a.querySelector('[data-account-label]');
      if (u) {
        a.setAttribute('href', 'account.html#dashboard');
        if (label) label.textContent = u.name.split(' ')[0];
        a.classList.add('authed');
      } else {
        a.setAttribute('href', 'account.html#login');
        if (label) label.textContent = 'ورود / ثبت‌نام';
        a.classList.remove('authed');
      }
    });
  }

  /* ---------- global delegated add-to-cart ---------- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute('data-add-to-cart');
    const qty = parseInt(btn.getAttribute('data-qty') || '1', 10);
    if (addToCart(id, qty)) {
      const p = productById(id);
      toast('«' + (p ? p.title : 'محصول') + '» به سبد خرید اضافه شد');
      if (btn.hasAttribute('data-go-cart')) setTimeout(() => location.href = 'cart.html', 500);
    }
  });

  /* keep header in sync on changes + across tabs */
  on('cart', hydrateHeader);
  on('auth', hydrateHeader);
  window.addEventListener('storage', e => {
    if (e.key === KEYS.cart || e.key === KEYS.session) hydrateHeader();
  });
  document.addEventListener('DOMContentLoaded', hydrateHeader);

  /* ---------- expose ---------- */
  window.SK = {
    faDigits, enDigits, money, emailOk, PRODUCTS, productById, STATUS,
    register, login, logout, requestReset, resetPassword, updateProfile,
    currentUser, isAuthed,
    addRequest, myRequests, allRequests,
    getCart, cartCount, cartLines, cartSubtotal, cartSavings,
    addToCart, setQty, removeFromCart, clearCart,
    myOrders, checkout,
    toast, hydrateHeader, on
  };
})();
