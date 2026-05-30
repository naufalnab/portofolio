/* Modul_Bahasa (bilingual ID/EN) — pure helpers + persistence.
   Core JS di semua halaman (di-load defer). Mengekspos util murni untuk
   testing & inline scripts via window.__lang, mengikuti pola window.__nav.

   Fungsi inti (pairPath, localeOf, detectFromNavigator, resolveLocale,
   decideRedirect) bersifat MURNI: tanpa DOM, deterministik, mudah diuji
   property-based. initLangSwitcher (wiring klik + a11y) ditambahkan terpisah. */
(function () {
  'use strict';

  /**
   * Map a site path to its Pasangan_Halaman in the other locale.
   * Pure, total over canonical site paths; involutive: pairPath(pairPath(p)) === p.
   * Tidak pernah menghasilkan prefix ganda "/en/en/".
   * @param {string} path - canonical root-relative path, e.g. "/services/" or "/en/services/"
   * @returns {string} paired path in the other locale
   */
  function pairPath(path) {
    if (path === '/en') return '/';
    if (path.indexOf('/en/') === 0) return path.slice(3); // buang "/en", sisakan leading "/"
    if (path === '/') return '/en/';
    return '/en' + path;
  }

  /**
   * Determine the locale a canonical path belongs to.
   * @param {string} path
   * @returns {"id"|"en"} "en" iff path is "/en" or under the "/en/" prefix, else "id"
   */
  function localeOf(path) {
    if (path === '/en' || path.indexOf('/en/') === 0) return 'en';
    return 'id';
  }

  /**
   * Detect locale from a navigator.language-style string (prefix match, case-insensitive).
   * @param {string|null} language - e.g. "en-US", "id", "", null
   * @returns {"id"|"en"} "en" iff non-empty and lower-cased value starts with "en", else "id"
   */
  function detectFromNavigator(language) {
    if (!language) return 'id';
    var lower = String(language).trim().toLowerCase();
    return /^en/.test(lower) ? 'en' : 'id';
  }

  /**
   * Resolve the effective locale by precedence:
   * (a) explicit choice; (b) valid stored value; (c) navigator detection; (d) default "id".
   * @param {"id"|"en"|null} explicitChoice
   * @param {string|null} storedRaw - localStorage 'lang' as-is (may be invalid)
   * @param {string|null} navigatorLanguage
   * @returns {"id"|"en"}
   */
  function resolveLocale(explicitChoice, storedRaw, navigatorLanguage) {
    if (explicitChoice === 'id' || explicitChoice === 'en') return explicitChoice;
    if (storedRaw === 'id' || storedRaw === 'en') return storedRaw;
    return detectFromNavigator(navigatorLanguage);
  }

  /**
   * Decide whether to auto-redirect to another locale. Pure (no side effects).
   * Anti-loop: never returns currentPath. Gated by `enabled`.
   * @param {boolean} enabled
   * @param {string|null} storedRaw
   * @param {string} currentPath - canonical location.pathname
   * @param {boolean} explicitOnThisNav - true if this nav came from Pemilih_Bahasa click
   * @param {string|null} navigatorLanguage
   * @returns {string|null} destination URL, or null = do not redirect
   */
  function decideRedirect(enabled, storedRaw, currentPath, explicitOnThisNav, navigatorLanguage) {
    if (!enabled) return null;
    if (explicitOnThisNav) return null; // hormati pilihan eksplisit
    var here = localeOf(currentPath);
    var target = (storedRaw === 'id' || storedRaw === 'en')
      ? storedRaw
      : detectFromNavigator(navigatorLanguage);
    if (target === here) return null; // sudah di locale yang benar
    var dest = pairPath(currentPath);
    if (dest === currentPath) return null; // jaga ketat: tak pernah redirect ke diri
    return dest;
  }

  /**
   * Read validated locale from localStorage 'lang'. Never throws.
   * @returns {"id"|"en"|null} stored value if exactly "id"/"en", else null
   */
  function readStoredLang() {
    try {
      var value = localStorage.getItem('lang');
      return (value === 'id' || value === 'en') ? value : null;
    } catch (e) {
      return null; // localStorage unavailable — treat as no stored value
    }
  }

  /**
   * Persist explicit locale choice to localStorage 'lang'. Never throws.
   * @param {"id"|"en"} locale
   */
  function storeLang(locale) {
    if (locale !== 'id' && locale !== 'en') return;
    try {
      localStorage.setItem('lang', locale);
    } catch (e) { /* localStorage unavailable — ignore (Req 3.6) */ }
  }

  /**
   * Wire the Pemilih_Bahasa (language switcher) for persistence — progressive
   * enhancement. The switcher already works as a raw <a href>; this only stores
   * the chosen locale (Req 3.1) before the default navigation proceeds and marks
   * the navigation as explicit. Never calls preventDefault, never throws, and
   * guards against double-binding via dataset.bound (Algoritma 7).
   * @param {HTMLElement|null} navRoot - <nav id="navbar">
   * @returns {void}
   */
  function initLangSwitcher(navRoot) {
    var switcher = navRoot && navRoot.querySelector ? navRoot.querySelector('.lang-switcher') : null;
    if (!switcher || switcher.dataset.bound === 'true') return;
    var options = switcher.querySelectorAll('a.lang-option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        var chosen = opt.getAttribute('data-lang'); // "id" | "en"
        try {
          storeLang(chosen);
          // optional explicit-nav marker (sessionStorage) — best-effort
          try { sessionStorage.setItem('langExplicit', '1'); } catch (e) {}
        } catch (e) { /* ignore; <a href> still navigates */ }
        // do NOT preventDefault — the <a href> navigates normally
      });
    });
    switcher.dataset.bound = 'true';
  }

  // Auto-init on load against #navbar (pola theme.js/nav.js).
  function autoInit() {
    initLangSwitcher(document.getElementById('navbar'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // Expose untuk testing & inline scripts (pola window.__nav).
  window.__lang = {
    pairPath: pairPath,
    localeOf: localeOf,
    detectFromNavigator: detectFromNavigator,
    resolveLocale: resolveLocale,
    decideRedirect: decideRedirect,
    readStoredLang: readStoredLang,
    storeLang: storeLang,
    initLangSwitcher: initLangSwitcher
  };
})();
