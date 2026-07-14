/* Praxisy — multilingual / multi-country controller
   IT is the base (markup is Italian). FR/EN/DE/ES/EU are override packs
   registered on window.PRAXISY_I18N by their respective files. */
(function () {
  'use strict';

  var PACKS = window.PRAXISY_I18N || {};
  var SUPPORTED = ['it', 'fr', 'en', 'de', 'es', 'eu'];
  var DOC_LANG = { it: 'it', fr: 'fr', en: 'en', de: 'de', es: 'es', eu: 'en' };

  // Capture the original Italian content for every keyed node.
  var nodes = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var base = {};
  nodes.forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (!(k in base)) base[k] = el.innerHTML;
  });

  function apply(lang) {
    var pack = lang === 'it' ? null : PACKS[lang];
    nodes.forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var val = pack && (k in pack) ? pack[k] : base[k];
      if (val != null && el.innerHTML !== val) el.innerHTML = val;
    });
    // Title
    var titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) document.title = titleEl.textContent;
    // <html lang>
    document.documentElement.setAttribute('lang', DOC_LANG[lang] || 'it');
    // exact selected pack (distinct from DOC_LANG, e.g. 'en' vs 'eu' both map to lang="en")
    document.body.setAttribute('data-lang', lang);
    // refresh dynamic year stamp the nav script may have set
    var ys = document.querySelectorAll('[data-year]');
    for (var i = 0; i < ys.length; i++) ys[i].textContent = new Date().getFullYear();
  }

  function setActive(lang) {
    var pills = document.querySelectorAll('.lang-pill');
    for (var i = 0; i < pills.length; i++) {
      pills[i].classList.toggle('active', pills[i].getAttribute('data-lang') === lang);
    }
  }

  function setLang(lang, save) {
    if (SUPPORTED.indexOf(lang) === -1) lang = 'it';
    var body = document.body;
    body.classList.add('lang-switching');
    window.setTimeout(function () {
      apply(lang);
      setActive(lang);
      body.classList.remove('lang-switching');
    }, 150);
    if (save !== false) {
      try { localStorage.setItem('praxisy_lang', lang); } catch (e) {}
    }
  }

  // Wire pills
  document.addEventListener('click', function (e) {
    var pill = e.target.closest ? e.target.closest('.lang-pill') : null;
    if (!pill) return;
    setLang(pill.getAttribute('data-lang'), true);
  });

  // Initial language: explicit past choice wins; otherwise English is the
  // default (Praxisy's primary market is now US-first), except for
  // browsers whose locale is Italian, which still land in Italian.
  var saved = null;
  try { saved = localStorage.getItem('praxisy_lang'); } catch (e) {}
  var initial;
  if (saved && SUPPORTED.indexOf(saved) !== -1) {
    initial = saved;
  } else {
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    initial = nav.indexOf('it') === 0 ? 'it' : 'en';
  }
  // Apply immediately without the fade on first paint.
  apply(initial);
  setActive(initial);

  window.PraxisySetLang = setLang;
})();
