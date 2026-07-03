/* =====================================================================
   SARA KABOLI — uni-render.js
   Reusable renderers for the universities feature:
   homepage slider, listing grid, and slug-driven detail page.
   Depends on window.SK_UNI (universities.js). SK (store.js) optional.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.SK_UNI) return;
  const U = window.SK_UNI;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const fa = (window.SK && SK.faDigits) ? SK.faDigits : (n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- shared pieces ---------- */
  function monogram(u, cls) {
    if (u.logo) return '<span class="uni-logo ' + (cls || '') + '"><img src="' + u.logo + '" alt="' + esc(u.name) + '"></span>';
    return '<span class="uni-logo ' + (cls || '') + '" style="--ac:' + u.accent + '"><b>' + esc(u.mark) + '</b></span>';
  }
  const iconBank = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 10 9-6 9 6"/><path d="M4 10v9M20 10v9M8 10v9M16 10v9M2 21h20"/></svg>';

  function metaChips(u) {
    return '<div class="uni-meta">' +
      '<span class="uni-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>' + esc(u.city) + '</span>' +
      '<span class="uni-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>' + esc(u.language) + '</span>' +
      '<span class="uni-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 7 12 3l10 4-10 4z"/><path d="M6 10v5c0 1 3 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg>' + fa(u.programs) + ' رشته</span>' +
      '</div>';
  }

  /* ---------- slider card ---------- */
  function sliderCard(u) {
    return '<article class="uni-card reveal">' +
      monogram(u) +
      '<h3 class="uni-name">' + esc(u.name) + '</h3>' +
      '<p class="uni-desc">' + esc(u.description) + '</p>' +
      '<a class="btn btn-royal uni-btn" href="university.html?slug=' + u.slug + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>اطلاعات بیشتر</a>' +
      '</article>';
  }

  /* ---------- list card ---------- */
  function listCard(u) {
    return '<article class="uni-card list reveal">' +
      '<div class="uni-card-head">' + monogram(u, 'sm') +
      '<div><h3 class="uni-name">' + esc(u.name) + '</h3><span class="uni-open">● ظرفیت باز</span></div></div>' +
      '<p class="uni-desc">' + esc(u.description) + '</p>' +
      metaChips(u) +
      '<a class="btn btn-gold uni-btn" href="university.html?slug=' + u.slug + '">مشاهده دانشگاه</a>' +
      '</article>';
  }

  /* ---------- HOMEPAGE SLIDER ---------- */
  function initSlider() {
    const root = $('#uniSlider'); if (!root) return;
    const track = $('#uniTrack', root);
    const items = U.list;
    track.innerHTML = items.map(u => '<div class="uni-slide">' + sliderCard(u) + '</div>').join('');
    $$('.uni-card.reveal', track).forEach(el => el.classList.add('in'));
    const slides = $$('.uni-slide', track);
    const prev = $('#uniPrev', root), next = $('#uniNext', root);
    let index = 0;
    const perView = () => window.innerWidth <= 640 ? 1 : (window.innerWidth <= 980 ? 2 : 3);
    const maxIndex = () => Math.max(0, items.length - perView());
    const step = () => slides[0] ? slides[0].getBoundingClientRect().width : 0;
    function apply() {
      index = Math.min(Math.max(index, 0), maxIndex());
      track.style.transform = 'translateX(' + (index * step()) + 'px)';
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex();
    }
    // RTL: forward (next) reveals later items → increase index (track slides right)
    next && next.addEventListener('click', () => { index = Math.min(maxIndex(), index + perView()); apply(); });
    prev && prev.addEventListener('click', () => { index = Math.max(0, index - perView()); apply(); });
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(apply, 150); });
    // basic swipe: swipe left → forward, swipe right → back
    let x0 = null;
    track.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
      if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { index = dx < 0 ? Math.min(maxIndex(), index + perView()) : Math.max(0, index - perView()); apply(); }
      x0 = null;
    });
    apply();
  }

  /* ---------- LISTING PAGE ---------- */
  function initList() {
    const grid = $('#uniGrid'); if (!grid) return;
    const items = U.list;
    const PAGE = 9; let shown = 0;
    const more = $('#uniLoadMore');
    const countEl = $('#uniCount');
    if (countEl) countEl.textContent = fa(items.length);
    function render() {
      const next = items.slice(shown, shown + PAGE);
      grid.insertAdjacentHTML('beforeend', next.map(listCard).join(''));
      shown += next.length;
      // reveal newly added
      $$('.uni-card.reveal', grid).forEach(el => el.classList.add('in'));
      if (more) more.style.display = shown >= items.length ? 'none' : '';
    }
    render();
    more && more.addEventListener('click', render);
  }

  /* ---------- DETAIL PAGE ---------- */
  function tagList(arr, icon) {
    return '<div class="uni-tags">' + arr.map(t => '<span class="uni-tag">' + icon + esc(t) + '</span>').join('') + '</div>';
  }
  const capIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 7 12 3l10 4-10 4z"/><path d="M6 10v5c0 1 3 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg>';
  const dotIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>';

  function infoRow(label, value, icon) {
    return '<div class="uni-info-item"><span class="ic">' + icon + '</span><div><span class="l">' + label + '</span><b>' + value + '</b></div></div>';
  }

  function galleryTiles(u) {
    if (u.gallery && u.gallery.length) {
      return u.gallery.map((src, i) => '<a class="uni-shot" href="' + src + '" data-idx="' + i + '"><img src="' + src + '" alt="' + esc(u.name) + ' ' + fa(i + 1) + '" loading="lazy"><span class="uni-shot-zoom"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4M11 8v6M8 11h6"/></svg></span></a>').join('');
    }
    const labels = ['نمای پردیس', 'کلاس و آزمایشگاه', 'کتابخانه', 'محوطه‌ی دانشگاه'];
    return labels.map((lb, i) => '<div class="uni-shot ph" style="--ac:' + u.accent + '"><span class="g-mark">' + esc(u.mark) + '</span><span class="g-lb">' + lb + '</span></div>').join('');
  }

  /* ---------- gallery lightbox (zoom) ---------- */
  function initGalleryLightbox(u, root) {
    const lb = document.getElementById('uniLightbox');
    if (!lb || !u.gallery || !u.gallery.length) return;
    const lbImg = document.getElementById('uniLbImg');
    const shots = $$('.uni-shot', root);
    let idx = 0;
    const open = n => {
      idx = (n + u.gallery.length) % u.gallery.length;
      lbImg.src = u.gallery[idx];
      lbImg.alt = u.name + ' ' + fa(idx + 1);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    shots.forEach((a, n) => a.addEventListener('click', e => { e.preventDefault(); open(n); }));
    $('#uniLbClose').addEventListener('click', close);
    $('#uniLbPrev').addEventListener('click', () => open(idx - 1));
    $('#uniLbNext').addEventListener('click', () => open(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(idx + 1);
      if (e.key === 'ArrowRight') open(idx - 1);
    });
  }

  function initDetail() {
    const root = $('#uniDetail'); if (!root) return;
    const slug = new URLSearchParams(location.search).get('slug');
    const u = slug ? U.get(slug) : null;
    if (!u) {
      root.innerHTML = '<div class="container"><div class="uni-missing"><h2>دانشگاه پیدا نشد</h2><p>ممکن است نشانی اشتباه باشد. فهرست کامل دانشگاه‌ها را ببینید.</p><a class="btn btn-gold btn-lg" href="universities.html">مشاهده‌ی همه‌ی دانشگاه‌ها</a></div></div>';
      return;
    }
    document.title = u.name + ' | سارا کابلی';

    const hero = '<section class="uni-cover" style="--ac:' + u.accent + '">' +
      '<div class="container uni-cover-in">' +
      '<p class="crumb"><a href="index.html">خانه</a> · <a href="universities.html">دانشگاه‌ها</a> · ' + esc(u.name) + '</p>' +
      '<div class="uni-cover-row">' + monogram(u, 'lg') +
      '<div><span class="uni-en">' + esc(u.nameEn) + '</span><h1>' + esc(u.name) + '</h1>' +
      '<p class="uni-lead">' + esc(u.description) + '</p>' +
      '<div class="uni-cover-cta"><a class="btn btn-gold" href="index.html#contact">درخواست پذیرش</a>' +
      (u.website ? '<a class="btn btn-ghost on-dark" href="https://' + u.website + '" target="_blank" rel="noopener">وب‌سایت رسمی</a>' : '') + '</div>' +
      '</div></div></div></section>';

    const info = '<section class="section section--tight"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">University Info <span class="fa">· اطلاعات کلی دانشگاه</span></span><h2 class="h-title">یک نگاه به <span class="gold">' + esc(u.name) + '</span></h2></div>' +
      '<div class="uni-info-grid reveal">' +
      infoRow('شهر', esc(u.city), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M6 21V8l6-4 6 4v13M10 12h4M10 16h4"/></svg>') +
      infoRow('کشور', esc(u.country), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>') +
      infoRow('سال تأسیس', fa(u.founded), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>') +
      infoRow('نوع دانشگاه', esc(u.type), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 2 7l10 5 10-5z"/><path d="M6 10v5c0 1 3 3 6 3s6-2 6-3v-5"/></svg>') +
      infoRow('زبان تدریس', esc(u.language), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg>') +
      infoRow('تعداد رشته‌ها', fa(u.programs) + ' رشته', capIcon) +
      infoRow('دانشجویان بین‌المللی', 'هزاران دانشجو از سراسر جهان', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0 1 14 0M17 3.5a3.5 3.5 0 0 1 0 9M22 21a7 7 0 0 0-5-6.7"/></svg>') +
      infoRow('وب‌سایت', u.website ? '<a href="https://' + u.website + '" target="_blank" rel="noopener" style="color:var(--gold-deep);direction:ltr;display:inline-block">' + u.website + '</a>' : '—', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>') +
      infoRow('رتبه / تمایز', u.ranking ? esc(u.ranking) : '—', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M8.2 12 7 22l5-3 5 3-1.2-10"/></svg>') +
      '</div></div></section>';

    const admit = '<section class="section section--tight" style="background:linear-gradient(180deg,var(--ice),var(--paper))"><div class="container">' +
      '<div class="uni-admit reveal">' +
      '<div class="uni-admit-head"><span class="badge ' + (u.admissionOpen ? 'done' : 'pending') + '">' + (u.admissionOpen ? 'پذیرش باز است' : 'پذیرش بسته است') + '</span><h3>وضعیت پذیرش</h3></div>' +
      '<div class="uni-admit-grid">' +
      '<div><h4>مدارک موردنیاز</h4><ul class="uni-docs">' + u.documents.map(d => '<li>' + esc(d) + '</li>').join('') + '</ul></div>' +
      '<div><h4>وضعیت تأییدیه‌ی ایران</h4>' +
      '<div class="uni-min"><span>وزارت بهداشت</span><b>' + esc(u.ministryHealth) + '</b></div>' +
      '<div class="uni-min"><span>وزارت علوم</span><b>' + esc(u.ministryScience) + '</b></div>' +
      '<p class="uni-note">تأیید مدارک می‌تواند بسته به رشته‌ی تحصیلی متفاوت باشد؛ پیش از اقدام، حتماً با کارشناسان ما استعلام بگیرید.</p></div>' +
      '</div>' +
      '<p class="uni-admit-foot">' + esc(u.notes) + '</p>' +
      '</div></div></section>';

    const gallery = '<section class="section section--tight"><div class="container">' +
      '<div class="section-head reveal"><span class="eyebrow">Gallery <span class="fa">· گالری</span></span></div>' +
      '<div class="uni-gallery reveal">' + galleryTiles(u) + '</div></div></section>';

    const facs = '<section class="section section--tight" style="background:linear-gradient(180deg,var(--ice),var(--paper))"><div class="container">' +
      '<div class="uni-two">' +
      '<div class="reveal"><h3 class="uni-sub">دانشکده‌ها و رشته‌ها</h3>' + tagList(u.faculties, capIcon) + '</div>' +
      '<div class="reveal d1"><h3 class="uni-sub">امکانات دانشگاه</h3>' + tagList(u.facilities, dotIcon) + '</div>' +
      '</div></div></section>';

    const cta = '<section class="section section--tight"><div class="container"><div class="uni-final reveal">' +
      '<h3>برای پذیرش در ' + esc(u.name) + ' آماده‌اید؟</h3>' +
      '<p>کارشناسان سارا کابلی، از بررسی مدارک تا دریافت نامه‌ی پذیرش، در کنار شما هستند.</p>' +
      '<div class="uni-final-cta"><a class="btn btn-gold btn-lg" href="index.html#contact">دریافت مشاوره‌ی رایگان</a><a class="btn btn-ghost on-dark btn-lg" href="universities.html">سایر دانشگاه‌ها</a></div>' +
      '</div></div></section>';

    root.innerHTML = hero + info + admit + gallery + facs + cta;
    // reveal + lightbox for gallery images
    $$('.reveal', root).forEach(el => el.classList.add('in'));
    initGalleryLightbox(u, root);
  }

  document.addEventListener('DOMContentLoaded', () => { initSlider(); initList(); initDetail(); });
})();
