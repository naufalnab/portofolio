/**
 * Canonical fixtures for the multi-page-restructure test suite.
 *
 * These constants mirror the "Data Models" section of design.md and are the
 * single source of truth for the enumerative / property tests over the finite
 * set of site pages. Keep them in sync with the design document.
 *
 * @typedef {Object} Page
 * @property {string} slug - "", "services", ... (used for active-nav matching)
 * @property {string} path - canonical URL path, e.g. "/services/"
 * @property {string} file - file path relative to repo root, e.g. "services/index.html"
 *
 * @typedef {Object} NavItem
 * @property {string} label    - visible label, e.g. "Services"
 * @property {string} href     - root-relative href, e.g. "/services/"
 * @property {string} matchSlug - slug that makes this item "active"
 * @property {NavItem[]} [children] - dropdown sub-links
 */

/**
 * Canonical list of every page in the site: 7 indexable content pages + /404.html.
 * @type {ReadonlyArray<Page>}
 */
export const PAGES = Object.freeze([
  { slug: "", path: "/", file: "index.html" },
  { slug: "services", path: "/services/", file: "services/index.html" },
  { slug: "case-studies", path: "/case-studies/", file: "case-studies/index.html" },
  { slug: "founded", path: "/founded/", file: "founded/index.html" },
  { slug: "layanan-website", path: "/layanan-website/", file: "layanan-website/index.html" },
  { slug: "layanan-video-ai", path: "/layanan-video-ai/", file: "layanan-video-ai/index.html" },
  { slug: "packages", path: "/packages/", file: "packages/index.html" },
  { slug: "404", path: "/404.html", file: "404.html" },
]);

/**
 * The 7 indexable content pages — PAGES without the 404 entry.
 * @type {ReadonlyArray<Page>}
 */
export const CONTENT_PAGES = Object.freeze(PAGES.filter((p) => p.slug !== "404"));

/**
 * Canonical navigation definition, matching design.md "Definisi Navigasi".
 * The "Layanan" item is a dropdown whose two children are the two service pages.
 * @type {ReadonlyArray<NavItem>}
 */
export const NAV_ITEMS = Object.freeze([
  { label: "Services", href: "/services/", matchSlug: "services" },
  { label: "Process", href: "/services/#process", matchSlug: "services" },
  { label: "Case Studies", href: "/case-studies/", matchSlug: "case-studies" },
  { label: "Founded", href: "/founded/", matchSlug: "founded" },
  {
    label: "Layanan",
    href: "/layanan-website/",
    matchSlug: "layanan",
    children: [
      { label: "Website", href: "/layanan-website/", matchSlug: "layanan-website" },
      { label: "Video AI", href: "/layanan-video-ai/", matchSlug: "layanan-video-ai" },
    ],
  },
  { label: "Packages", href: "/packages/", matchSlug: "packages" },
]);
