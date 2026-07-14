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
