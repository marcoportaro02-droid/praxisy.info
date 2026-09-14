/* Praxisy — interazioni eleganti e misurate */
(function () {
  'use strict';

  /* --- Altezza reale della topbar fissa, per compensare gli anchor link --- */
  var topbar = document.querySelector('.topbar');
  function syncTopbarHeight() {
    if (!topbar) return;
    var h = topbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--topbar-h', (h + 16) + 'px');
  }
  if (topbar) {
    syncTopbarHeight();
    window.addEventListener('resize', syncTopbarHeight);
    window.addEventListener('orientationchange', syncTopbarHeight);
    if ('ResizeObserver' in window) {
      new ResizeObserver(syncTopbarHeight).observe(topbar);
    }
  }

  /* --- Menu mobile a tendina --- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    function closeMenu() {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    function toggleMenu() {
      var open = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    navToggle.addEventListener('click', toggleMenu);
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* --- Nav: bordo/blur allo scroll --- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Scroll reveal con stagger --- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- Contatori animati --- */
  // A stat can vary by language (e.g. localized "why now" figures) via a
  // data-count-{lang} override, read against body[data-lang] set by i18n.js.
  function countTarget(el) {
    var lang = document.body.getAttribute('data-lang');
    var override = lang && el.getAttribute('data-count-' + lang);
    return parseFloat(override != null ? override : el.getAttribute('data-count'));
  }
  window.PraxisyCountTarget = countTarget;
  window.PraxisyFormatCount = function (el, value) {
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var sep = el.getAttribute('data-sep') === '1';
    var s = value.toFixed(dec);
    if (sep) {
      var parts = s.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      s = parts.join(',');
    } else if (dec > 0) {
      s = s.replace('.', ',');
    }
    return prefix + s + suffix;
  };
  function animateCount(el) {
    var target = countTarget(el);
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = window.PraxisyFormatCount(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = window.PraxisyFormatCount(el, target); el.classList.add('counted'); }
    }
    requestAnimationFrame(step);
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = window.PraxisyFormatCount(el, countTarget(el));
      el.classList.add('counted');
    });
  }

  /* --- Barre di progresso (dashboard / sondaggi) --- */
  var bars = [].slice.call(document.querySelectorAll('[data-fill]'));
  if ('IntersectionObserver' in window && bars.length) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var t = e.target;
          setTimeout(function () { t.style.width = t.getAttribute('data-fill') + '%'; }, 200);
          bio.unobserve(t);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (el) { bio.observe(el); });
  }

  /* --- Roadmap: linea che si "disegna" allo scroll --- */
  var roadWrap = document.querySelector('.road-wrap');
  if (roadWrap) {
    if ('IntersectionObserver' in window) {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { roadWrap.classList.add('line-in'); rio.unobserve(roadWrap); }
        });
      }, { threshold: 0.15 });
      rio.observe(roadWrap);
    } else {
      roadWrap.classList.add('line-in');
    }
  }

  /* --- Anno corrente nel footer --- */
  var y = document.querySelectorAll('[data-year]');
  for (var i = 0; i < y.length; i++) { y[i].textContent = new Date().getFullYear(); }

})();

/* ---------- Savings calculator (estimate only) ---------- */
(function () {
  'use strict';
  var pop = document.getElementById('calcPop');
  if (!pop) return;
  var staff = document.getElementById('calcStaff');
  var hours = document.getElementById('calcHours');
  var cost = document.getElementById('calcCost');
  var share = document.getElementById('calcShare');
  var outHours = document.getElementById('calcHoursOut');
  var outValue = document.getElementById('calcValueOut');
  var outCost = document.getElementById('calcCostOut');

  var WORKING_WEEKS = 44; // netto ferie e festività

  function money(n) {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'it', {
        style: 'currency', currency: 'EUR', maximumFractionDigits: 0
      }).format(n);
    } catch (e) { return '€' + Math.round(n); }
  }
  function num(n) {
    try { return new Intl.NumberFormat(document.documentElement.lang || 'it').format(Math.round(n)); }
    catch (e) { return String(Math.round(n)); }
  }
  function val(el, fallback) {
    var v = parseFloat(el && el.value);
    return isFinite(v) && v >= 0 ? v : fallback;
  }
  // Primo anno = attivazione una tantum + primo abbonamento annuale.
  function firstYearCost(population) {
    if (population <= 5000) return 2500 + 3600;
    if (population <= 20000) return 5000 + 7200;
    if (population <= 50000) return 8000 + 12000;
    return null; // oltre 50.000: prezzo personalizzato
  }

  function recalc() {
    var h = val(staff, 0) * val(hours, 0) * WORKING_WEEKS * val(share, 0.2);
    var v = h * val(cost, 0);
    outHours.textContent = num(h);
    outValue.textContent = money(v);

    var c = firstYearCost(val(pop, 0));
    if (c === null) {
      var custom = document.querySelector('[data-i18n="pr.4price"]');
      outCost.textContent = custom ? custom.textContent.trim() : '—';
    } else {
      outCost.textContent = money(c);
    }
  }

  [pop, staff, hours, cost, share].forEach(function (el) {
    if (el) { el.addEventListener('input', recalc); el.addEventListener('change', recalc); }
  });
  recalc();
  // Ricalcola dopo un cambio lingua: cambiano formato numeri ed etichetta custom.
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.lang-pill')) window.setTimeout(recalc, 350);
  });
})();

/* ---------- Demo request form → pre-filled email ---------- */
(function () {
  'use strict';
  var form = document.getElementById('demoForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var d = new FormData(form);
    function f(k) { return (d.get(k) || '').toString().trim(); }

    var subject = 'Richiesta demo Praxisy — ' + (f('ente') || 'Comune');
    var body = [
      'Nome: ' + f('nome') + ' ' + f('cognome'),
      'Comune / Ente: ' + f('ente'),
      'Email: ' + f('email'),
      'Numero abitanti: ' + (f('abitanti') || '—'),
      '',
      'Messaggio:',
      f('messaggio') || '—'
    ].join('\n');

    window.location.href = 'mailto:marcoportaro02@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  });
})();
