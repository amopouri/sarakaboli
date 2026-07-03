/* =====================================================================
   SARA KABOLI — interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const faDigits = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  /* ---------- Header state on scroll ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile drawer ---------- */
  const burger = $('#burger');
  const drawer = $('#mobileNav');
  if (burger && drawer) {
    const toggle = open => {
      drawer.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!drawer.classList.contains('open')));
    $$('[data-close]', drawer).forEach(el => el.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---------- Smooth anchor scroll with header offset ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = $$('.reveal');
  if (reduce) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------- Counter animation ---------- */
  const counters = $$('[data-count]');
  const runCount = el => {
    const target = +el.dataset.count;
    const valEl = $('.val', el);
    if (reduce) { valEl.textContent = faDigits(target); return; }
    const dur = 1500; const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      valEl.textContent = faDigits(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { runCount(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- Button ripple ---------- */
  $$('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      if (reduce) return;
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item);
    const a = $('.faq-a', item);
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      $$('.faq-item').forEach(other => {
        other.classList.remove('open');
        $('.faq-a', other).style.maxHeight = null;
      });
      if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- Testimonial slider ---------- */
  const track = $('#testiTrack');
  if (track) {
    const slides = $$('.testi-card', track);
    const dotsWrap = $('#testiDots');
    let i = 0, timer = null;
    slides.forEach((_, idx) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'اسلاید ' + faDigits(idx + 1));
      b.addEventListener('click', () => go(idx, true));
      dotsWrap.appendChild(b);
    });
    const dots = $$('button', dotsWrap);
    const go = (n, user) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${i * 100}%)`; /* RTL: positive moves correctly */
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      if (user) restart();
    };
    const next = () => go(i + 1);
    const prev = () => go(i - 1);
    $('#testiNext').addEventListener('click', () => go(i + 1, true));
    $('#testiPrev').addEventListener('click', () => go(i - 1, true));
    const start = () => { if (!reduce) timer = setInterval(next, 6000); };
    const restart = () => { clearInterval(timer); start(); };
    // pause on hover
    const vp = $('.testi-viewport');
    vp.addEventListener('mouseenter', () => clearInterval(timer));
    vp.addEventListener('mouseleave', start);
    // basic swipe
    let x0 = null;
    vp.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
    vp.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) (dx > 0 ? prev : next)(); // RTL aware feel
      x0 = null; restart();
    });
    go(0); start();
  }

  /* ---------- Lightbox gallery ---------- */
  const lb = $('#lightbox');
  if (lb) {
    const lbImg = $('#lbImg');
    const cards = $$('.gcard');
    let idx = 0;
    const open = n => {
      idx = (n + cards.length) % cards.length;
      const card = cards[idx];
      lbImg.src = $('img', card).src;
      lbImg.alt = $('img', card).alt;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    cards.forEach((c, n) => c.addEventListener('click', () => open(n)));
    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', () => open(idx - 1));
    $('#lbNext').addEventListener('click', () => open(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(idx + 1);
      if (e.key === 'ArrowRight') open(idx - 1);
    });
  }

  /* ---------- Contact / consultation form ---------- */
  const form = $('#contactForm');
  if (form) {
    const note = $('#formNote');
    const alertBox = $('#formAlert');
    const fieldEl = id => $('#' + id);
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = fieldEl('name').value.trim();
      const phone = fieldEl('phone').value.trim();
      const email = fieldEl('email') ? fieldEl('email').value.trim() : '';
      const service = fieldEl('service') ? fieldEl('service').value : '';
      const dest = fieldEl('dest') ? fieldEl('dest').value : '';
      const level = fieldEl('level') ? fieldEl('level').value : '';
      const msg = fieldEl('msg') ? fieldEl('msg').value.trim() : '';

      const showErr = m => {
        if (alertBox) alertBox.innerHTML = '<div class="form-error"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' + m + '</div>';
      };
      if (!name || !phone) { showErr('لطفاً نام و شماره تماس را کامل کنید.'); return; }

      if (window.SK) {
        SK.addRequest({ name, phone, email, service, dest, level, note: msg });
      }
      if (alertBox) {
        const authed = window.SK && SK.isAuthed();
        alertBox.innerHTML = '<div class="form-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>درخواست شما با موفقیت ثبت شد ✓ ' +
          (authed ? 'وضعیت آن را می‌توانید در داشبورد دنبال کنید.' : 'به‌زودی با شما تماس می‌گیریم.') + '</div>';
      }
      if (note) note.textContent = 'اطلاعات شما محرمانه می‌ماند و تنها برای تماس استفاده می‌شود.';
      if (window.SK) SK.toast('درخواست مشاوره ثبت شد');
      form.reset();
    });
  }

  /* ---------- Active nav link on scroll (homepage) ---------- */
  const navLinks = $$('.nav-links a[href^="#"]');
  if (navLinks.length) {
    const sections = navLinks
      .map(a => $(a.getAttribute('href')))
      .filter(Boolean);
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = '#' + en.target.id;
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }
})();
