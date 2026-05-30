/* Navbar — .scrolled state + active page highlighting */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function normalizePath(p) {
    p = String(p).split('#')[0].split('?')[0];
    if (p === '') return '/';
    if (!p.endsWith('/') && !p.endsWith('.html')) p += '/';
    return p;
  }

  function setActiveNav(root, currentPath) {
    const here = normalizePath(currentPath);
    const links = root.querySelectorAll('a[href]');
    links.forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
    links.forEach(a => {
      const target = normalizePath(new URL(a.href, location.origin).pathname);
      if (target === here) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
        const dd = a.closest('.nav-dropdown');
        if (dd) { const trigger = dd.querySelector(':scope > a'); if (trigger) trigger.classList.add('active'); }
      }
    });
  }

  setActiveNav(navbar, location.pathname);

  function initMobileNav(root) {
    const btn = root.querySelector('.nav-toggle');
    if (!btn || btn.dataset.bound === 'true') return;
    const setOpen = (open) => {
      root.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', () => setOpen(!root.classList.contains('nav-open')));
    root.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 900) setOpen(false); }, { passive: true });
    btn.dataset.bound = 'true';
  }
  initMobileNav(navbar);

  window.__nav = { normalizePath, setActiveNav, initMobileNav }; // expose untuk testing
})();
