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

/* ------------------------------------------------------------------------- *
 * Bilingual fixtures (feature: bilingual-id-en)
 *
 * Extends the single-locale PAGES set above into the closed, finite bilingual
 * page set used by the enumerative / property tests. ID is served at the root
 * (no prefix, x-default) and EN under the /en/ prefix. Everything below is
 * derived programmatically from CONTENT_SLUGS via small pure helpers so the
 * 16 entries can never drift from the slug list.
 *
 * Mirrors design.md "Data Models → PAGES_BILINGUAL".
 * ------------------------------------------------------------------------- */

/** Canonical origin for every absolute URL. */
export const ORIGIN = "https://naufalnabila.my.id";

/**
 * The 7 content slugs (stable order for deterministic tests). "" is Home.
 * The 404 slug is handled separately because it is non-indexable and keeps
 * its `.html` extension.
 * @type {ReadonlyArray<string>}
 */
const CONTENT_SLUGS = [
  "",
  "services",
  "case-studies",
  "founded",
  "layanan-website",
  "layanan-video-ai",
  "packages",
];

/** Every slug in PAGES_BILINGUAL: the 7 content slugs + the 404 slug. */
const ALL_SLUGS = Object.freeze([...CONTENT_SLUGS, "404"]);

/** Supported locales, in stable order (id first = default/root). */
const LOCALES = Object.freeze(["id", "en"]);

/**
 * Build the canonical root-relative path for a slug in a locale.
 * Pure helper so paths can never drift from the slug list.
 *   id:  ""   -> "/",        "services" -> "/services/",     "404" -> "/404.html"
 *   en:  ""   -> "/en/",     "services" -> "/en/services/",  "404" -> "/en/404.html"
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function buildPath(slug, locale) {
  const prefix = locale === "en" ? "/en" : "";
  if (slug === "404") return `${prefix}/404.html`;
  if (slug === "") return `${prefix}/`;
  return `${prefix}/${slug}/`;
}

/**
 * Build the repo-relative file path for a slug in a locale.
 * Pure helper, the file-system mirror of buildPath().
 *   id:  ""   -> "index.html",     "services" -> "services/index.html",     "404" -> "404.html"
 *   en:  ""   -> "en/index.html",  "services" -> "en/services/index.html",  "404" -> "en/404.html"
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function buildFile(slug, locale) {
  const dir = locale === "en" ? "en/" : "";
  if (slug === "404") return `${dir}404.html`;
  if (slug === "") return `${dir}index.html`;
  return `${dir}${slug}/index.html`;
}

/**
 * Build one bilingual page entry. `pairPath` is just the path of the same slug
 * in the other locale, so the Pasangan_Halaman relation is correct by construction.
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {BiPage}
 */
function makeBiPage(slug, locale) {
  const other = locale === "id" ? "en" : "id";
  return {
    slug,
    locale,
    path: buildPath(slug, locale),
    pairPath: buildPath(slug, other),
    file: buildFile(slug, locale),
    indexable: slug !== "404",
  };
}

/**
 * @typedef {Object} BiPage
 * @property {string} slug      - "", "services", ..., or "404"
 * @property {"id"|"en"} locale - the locale this page is served in
 * @property {string} path      - canonical root-relative path, e.g. "/en/services/"
 * @property {string} pairPath  - the Pasangan_Halaman path in the other locale, e.g. "/services/"
 * @property {string} file      - repo-relative file, e.g. "en/services/index.html"
 * @property {boolean} indexable - false only for the two 404 pages
 */

/**
 * Canonical bilingual page set: 16 entries (7 content x {id,en} + 404 x {id,en}).
 * Ordered by slug then locale (id before en) for deterministic tests.
 * @type {ReadonlyArray<BiPage>}
 */
export const PAGES_BILINGUAL = Object.freeze(
  ALL_SLUGS.flatMap((slug) =>
    LOCALES.map((locale) => Object.freeze(makeBiPage(slug, locale))),
  ),
);

/**
 * The 14 indexable content pages — PAGES_BILINGUAL without the two 404 entries.
 * @type {ReadonlyArray<BiPage>}
 */
export const CONTENT_PAGES_BILINGUAL = Object.freeze(
  PAGES_BILINGUAL.filter((p) => p.indexable),
);

/**
 * @typedef {Object} PagePair
 * @property {string} slug   - the shared slug
 * @property {BiPage} id      - the Halaman_ID entry
 * @property {BiPage} en      - the Halaman_EN entry
 */

/**
 * ID<->EN page pairs grouped by slug (8 pairs incl. 404) for bijection tests.
 * @type {ReadonlyArray<PagePair>}
 */
export const PAGE_PAIRS = Object.freeze(
  ALL_SLUGS.map((slug) =>
    Object.freeze({
      slug,
      id: PAGES_BILINGUAL.find((p) => p.slug === slug && p.locale === "id"),
      en: PAGES_BILINGUAL.find((p) => p.slug === slug && p.locale === "en"),
    }),
  ),
);

/** Localized nav labels per locale (not asserted by tests; kept simple/consistent). */
const NAV_LABELS = Object.freeze({
  id: Object.freeze({
    services: "Layanan",
    process: "Proses",
    caseStudies: "Studi Kasus",
    founded: "Dirikan",
    layanan: "Layanan",
    website: "Website",
    videoAi: "Video AI",
    packages: "Paket",
  }),
  en: Object.freeze({
    services: "Services",
    process: "Process",
    caseStudies: "Case Studies",
    founded: "Founded",
    layanan: "Services",
    website: "Website",
    videoAi: "Video AI",
    packages: "Packages",
  }),
});

/**
 * Build the navigation definition for a locale, mirroring NAV_ITEMS.
 * EN hrefs are the ID hrefs prefixed with "/en"; labels are localized.
 * The structure (item count, matchSlug, dropdown children) is identical
 * across locales so active-nav behavior is shared.
 * @param {"id"|"en"} locale
 * @returns {ReadonlyArray<NavItem>}
 */
export function navItemsFor(locale) {
  const prefix = locale === "en" ? "/en" : "";
  const href = (path) => `${prefix}${path}`;
  const L = NAV_LABELS[locale];
  return Object.freeze([
    { label: L.services, href: href("/services/"), matchSlug: "services" },
    { label: L.process, href: href("/services/#process"), matchSlug: "services" },
    { label: L.caseStudies, href: href("/case-studies/"), matchSlug: "case-studies" },
    { label: L.founded, href: href("/founded/"), matchSlug: "founded" },
    {
      label: L.layanan,
      href: href("/layanan-website/"),
      matchSlug: "layanan",
      children: [
        { label: L.website, href: href("/layanan-website/"), matchSlug: "layanan-website" },
        { label: L.videoAi, href: href("/layanan-video-ai/"), matchSlug: "layanan-video-ai" },
      ],
    },
    { label: L.packages, href: href("/packages/"), matchSlug: "packages" },
  ]);
}
