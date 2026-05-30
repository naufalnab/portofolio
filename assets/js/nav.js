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
    // 1. Clear all active state first.
    links.forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });

    // 2. Collect every anchor whose normalized path matches the current page.
    const matches = [];
    links.forEach(a => {
      const url = new URL(a.href, location.origin);
      if (normalizePath(url.pathname) === here) {
        matches.push({ a, hasHash: url.hash !== '' });
      }
    });

    // 3. Unknown path (e.g. /404.html): leave nothing active.
    if (matches.length === 0) return;

    // 4. Choose EXACTLY ONE anchor for aria-current, by preference:
    //    a) a dropdown child (the specific service page should win);
    //    b) a hash-less link inside .nav-links (canonical top-level link, not "Process");
    //    c) any hash-less match; d) the first match.
    const isDropdownChild = m => !!m.a.closest('.nav-dropdown-menu');
    const inNavLinks = m => !!m.a.closest('.nav-links');
    const chosen =
      matches.find(isDropdownChild) ||
      matches.find(m => inNavLinks(m) && !m.hasHash) ||
      matches.find(m => !m.hasHash) ||
      matches[0];

    chosen.a.classList.add('active');
    chosen.a.setAttribute('aria-current', 'page');

    // 5. If the chosen anchor is a dropdown child, also mark the parent trigger
    //    .active (but NOT aria-current) so exactly one aria-current remains.
    if (isDropdownChild(chosen)) {
      const dd = chosen.a.closest('.nav-dropdown');
      if (dd) { const trigger = dd.querySelector(':scope > a'); if (trigger) trigger.classList.add('active'); }
    }
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
