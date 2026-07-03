/* =====================================================================
   SARA KABOLI — account.js
   Auth views (login/register/forgot/reset) + user dashboard.
   Depends on window.SK (store.js).
   ===================================================================== */
(function () {
  'use strict';
  if (!window.SK) return;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const fa = SK.faDigits;

  const authSection = $('#authSection');
  const dashSection = $('#dashSection');

  /* ---------- alerts ---------- */
  const err = (box, m) => { box.innerHTML = '<div class="form-error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' + m + '</div>'; };
  const ok = (box, m) => { box.innerHTML = '<div class="form-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>' + m + '</div>'; };

  /* ---------- password toggles ---------- */
  $$('[data-toggle-pw]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = $('#' + btn.getAttribute('data-toggle-pw'));
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.style.color = inp.type === 'text' ? 'var(--royal)' : 'var(--muted)';
    });
  });

  /* ---------- view switching ---------- */
  const views = ['login', 'register', 'forgot', 'reset'];
  const tabs = $$('#authTabs button');
  function showView(name) {
    views.forEach(v => $('#view-' + v).classList.toggle('on', v === name));
    tabs.forEach(t => t.classList.toggle('on', t.getAttribute('data-tab') === name));
    // tabs only reflect login/register
    if (name === 'login' || name === 'register') {
      tabs.forEach(t => t.classList.toggle('on', t.getAttribute('data-tab') === name));
    } else {
      tabs.forEach(t => t.classList.remove('on'));
    }
  }
  tabs.forEach(t => t.addEventListener('click', () => { showView(t.getAttribute('data-tab')); }));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => showView(b.getAttribute('data-go'))));

  /* ---------- forms ---------- */
  // login
  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const box = $('#loginAlert');
    const res = SK.login({ email: $('#li-email').value, password: $('#li-pass').value });
    if (!res.ok) { err(box, res.error); return; }
    SK.toast('خوش آمدید، ' + res.user.name.split(' ')[0]);
    location.hash = '#dashboard'; route();
  });
  // register
  $('#registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const box = $('#registerAlert');
    const p1 = $('#rg-pass').value, p2 = $('#rg-pass2').value;
    if (p1 !== p2) { err(box, 'رمز عبور و تکرار آن یکسان نیستند.'); return; }
    const res = SK.register({ name: $('#rg-name').value, email: $('#rg-email').value, phone: $('#rg-phone').value, password: p1 });
    if (!res.ok) { err(box, res.error); return; }
    SK.toast('حساب شما با موفقیت ساخته شد');
    location.hash = '#dashboard'; route();
  });
  // forgot
  $('#forgotForm').addEventListener('submit', e => {
    e.preventDefault();
    const box = $('#forgotAlert');
    const res = SK.requestReset($('#fg-email').value);
    if (!res.ok) { err(box, res.error); return; }
    // demo: reveal the token (no email backend) and prefill reset view
    box.innerHTML = '<div class="form-ok" style="flex-direction:column;align-items:flex-start;gap:.6rem"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" style="vertical-align:-3px;width:18px;height:18px"><path d="M20 6 9 17l-5-5"/></svg> کد بازیابی شما (نسخه‌ی نمایشی):</span><span class="token-pill">' + res.token + '</span></div>';
    setTimeout(() => {
      $('#rs-email').value = res.email;
      $('#rs-token').value = res.token;
      showView('reset');
    }, 1400);
  });
  // reset
  $('#resetForm').addEventListener('submit', e => {
    e.preventDefault();
    const box = $('#resetAlert');
    const res = SK.resetPassword({ email: $('#rs-email').value, token: $('#rs-token').value, password: $('#rs-pass').value });
    if (!res.ok) { err(box, res.error); return; }
    ok(box, 'رمز عبور با موفقیت تغییر کرد. اکنون وارد شوید.');
    SK.toast('رمز عبور تغییر کرد');
    setTimeout(() => { $('#li-email').value = $('#rs-email').value; showView('login'); box.innerHTML = ''; }, 1400);
  });

  /* ---------- dashboard ---------- */
  const faDate = (ts, withMonth) => {
    try {
      return new Date(ts).toLocaleDateString('fa-IR', withMonth ? { year: 'numeric', month: 'long' } : { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) { return fa(new Date(ts).toISOString().slice(0, 10)); }
  };

  function stepperHtml(status) {
    const cur = (SK.STATUS[status] || SK.STATUS.pending).step;
    const steps = [{ tx: 'ثبت درخواست' }, { tx: 'بررسی و پیگیری' }, { tx: 'تکمیل' }];
    return '<div class="stepper">' + steps.map((s, idx) => {
      const i = idx + 1;
      const cls = i < cur ? 'passed' : (i === cur ? 'active passed' : '');
      const bar = idx < steps.length - 1 ? '<span class="bar"></span>' : '';
      const mark = i < cur ? '✓' : fa(i);
      return '<div class="st ' + cls + '"><span class="dot">' + mark + '</span><span class="tx">' + s.tx + '</span>' + bar + '</div>';
    }).join('') + '</div>';
  }

  function requestCard(r) {
    const st = SK.STATUS[r.status] || SK.STATUS.pending;
    const bits = [];
    if (r.service) bits.push(r.service);
    if (r.dest) bits.push('مقصد: ' + r.dest);
    if (r.level) bits.push(r.level);
    const title = r.service || (r.dest ? 'مشاوره ' + r.dest : 'درخواست مشاوره');
    return '<div class="req">' +
      '<div class="req-top"><b>' + title + '</b><span class="badge ' + r.status + '">' + st.label + '</span></div>' +
      '<div class="req-meta"><span>کد: ' + fa((r.id || '').slice(-6).toUpperCase()) + '</span><span>تاریخ: ' + faDate(r.createdAt) + '</span></div>' +
      (r.note ? '<p class="req-note">' + r.note + '</p>' : '') +
      stepperHtml(r.status) +
      '</div>';
  }

  function orderCard(o) {
    const items = o.items.map(it => it.title + ' ×' + fa(it.qty)).join(' · ');
    return '<div class="req">' +
      '<div class="req-top"><b>سفارش ' + o.id + '</b><span class="badge paid">پرداخت‌شده</span></div>' +
      '<div class="req-meta"><span>تاریخ: ' + faDate(o.createdAt) + '</span><span>مبلغ: ' + SK.money(o.total) + '</span></div>' +
      '<p class="req-note">' + items + '</p>' +
      '</div>';
  }

  const emptyBox = (txt) => '<div class="empty"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><b>موردی ثبت نشده است</b><p>' + txt + '</p></div>';

  function renderDashboard() {
    const u = SK.currentUser();
    if (!u) return;
    $('#dashAvatar').textContent = u.name.trim().charAt(0) || 'س';
    $('#dashName').textContent = u.name;
    $('#dashEmail').textContent = u.email;

    const reqs = SK.myRequests();
    const orders = SK.myOrders();
    $('#stRequests').textContent = fa(reqs.length);
    $('#stOrders').textContent = fa(orders.length);
    $('#stMember').textContent = faDate(u.createdAt, true);

    $('#recentRequests').innerHTML = reqs.length ? reqs.slice(0, 3).map(requestCard).join('') : emptyBox('هنوز درخواست مشاوره‌ای ثبت نکرده‌اید. از صفحه‌ی اصلی فرم مشاوره را پر کنید.');
    $('#requestsList').innerHTML = reqs.length ? reqs.map(requestCard).join('') : emptyBox('هنوز درخواست مشاوره‌ای ثبت نکرده‌اید.');
    $('#ordersList').innerHTML = orders.length ? orders.map(orderCard).join('') : emptyBox('هنوز سفارشی ثبت نکرده‌اید. دوره‌ی زبان ترکی را ببینید.');

    $('#pf-name').value = u.name;
    $('#pf-email').value = u.email;
    $('#pf-phone').value = u.phone || '';
  }

  // dashboard nav
  $$('#dashNav button[data-panel]').forEach(b => {
    b.addEventListener('click', () => {
      $$('#dashNav button[data-panel]').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const p = b.getAttribute('data-panel');
      $$('.dash-panel').forEach(x => x.classList.toggle('on', x.id === 'panel-' + p));
    });
  });
  // logout
  $('#logoutBtn').addEventListener('click', () => {
    SK.logout(); SK.toast('از حساب خارج شدید');
    location.hash = '#login'; route();
  });
  // profile
  $('#profileForm').addEventListener('submit', e => {
    e.preventDefault();
    const box = $('#profileAlert');
    const res = SK.updateProfile({ name: $('#pf-name').value, phone: $('#pf-phone').value });
    if (!res.ok) { err(box, res.error); return; }
    ok(box, 'پروفایل با موفقیت به‌روزرسانی شد.');
    SK.toast('پروفایل ذخیره شد');
    renderDashboard();
  });

  /* ---------- routing ---------- */
  function route() {
    const hash = (location.hash || '').replace('#', '');
    const authed = SK.isAuthed();
    if (hash === 'dashboard' || (authed && hash === '')) {
      if (!authed) { authSection.style.display = ''; dashSection.style.display = 'none'; showView('login'); return; }
      authSection.style.display = 'none';
      dashSection.style.display = '';
      $('#phTitle').textContent = 'داشبورد کاربری';
      $('#phSub').textContent = 'درخواست‌ها، سفارش‌ها و اطلاعات حساب شما در یک نگاه.';
      renderDashboard();
    } else {
      authSection.style.display = '';
      dashSection.style.display = 'none';
      $('#phTitle').textContent = 'حساب کاربری';
      $('#phSub').textContent = 'برای پیگیری درخواست‌ها و سفارش‌ها وارد شوید یا ثبت‌نام کنید.';
      if (authed) { location.hash = '#dashboard'; route(); return; }
      if (views.includes(hash)) showView(hash); else showView('login');
    }
  }
  window.addEventListener('hashchange', route);
  route();
})();
