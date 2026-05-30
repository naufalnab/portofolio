/**
 * Property 13 — PROP-12: per-locale active-nav highlighting.
 *
 * For any page path in PAGES_BILINGUAL, after running setActiveNav on the shell
 * of the *matching* locale:
 *  - For a content page of that locale (CONTENT_PAGES_BILINGUAL), EXACTLY ONE
 *    nav anchor carries aria-current="page", and that anchor's normalized path
 *    equals the normalized current path.
 *  - For the 404 path of that locale, OR for a foreign/garbage path not present
 *    in the shell (e.g. the other locale's paths), ZERO anchors carry
 *    aria-current="page".
 *
 * The shell is built per-locale from navItemsFor(locale) — mirroring the
 * single-locale test (tests/nav.setActiveNav.test.mjs) — so the property can be
 * exercised across many sampled (currentPath) values for both the ID shell
 * (root hrefs like /services/) and the EN shell (prefixed hrefs like
 * /en/services/). The locale-root logo (/ for id, /en/ for en) is included so
 * the Home page has a matchable top-level anchor, and a hash-bearing CTA is
 * included to exercise setActiveNav's "exactly one" preference logic.
 *
 * Uses Node's built-in test runner + fast-check + the loadScriptModule helper
 * (jsdom). These are dev-only deps, never shipped with the static site.
 *
 * Validates: Requirements 10.2, 11.12
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import { loadScriptModule } from "./helpers.mjs";
import {
  PAGES_BILINGUAL,
  CONTENT_PAGES_BILINGUAL,
  navItemsFor,
} from "./fixtures/pages.mjs";

/** Supported locales (id served at root, en under /en/). */
const LOCALES = ["id", "en"];

/** Static garbage paths that match no shell anchor in either locale. */
const GARBAGE_PATHS = ["/nope/", "/random-xyz/", "/foo/bar/", "/services/extra/"];

/**
 * Build a faithful per-locale nav shell from navItemsFor(locale). Includes the
 * structural hooks setActiveNav relies on: ul.nav-links, li.nav-dropdown, and
 * ul.nav-dropdown-menu. Also includes the locale-root logo (so Home matches)
 * and a hash-bearing CTA (so the "exactly one" preference logic is exercised).
 * @param {"id"|"en"} locale
 * @returns {string} full HTML document with <nav id="navbar">
 */
function buildShellHtml(locale) {
  const items = navItemsFor(locale);
  const rootHref = locale === "en" ? "/en/" : "/";
  const ctaHref = locale === "en" ? "/en/packages/#contact" : "/packages/#contact";

  const liHtml = items
    .map((item) => {
      if (item.children) {
        const childLis = item.children
          .map((c) => `        <li><a href="${c.href}">${c.label}</a></li>`)
          .join("\n");
        return `      <li class="nav-dropdown">
        <a href="${item.href}" aria-haspopup="true" aria-expanded="false">${item.label}</a>
        <ul class="nav-dropdown-menu">
${childLis}
        </ul>
      </li>`;
      }
      return `      <li><a href="${item.href}">${item.label}</a></li>`;
    })
    .join("\n");

  return `<!DOCTYPE html><html lang="${locale}"><head></head><body>
  <nav id="navbar">
    <div class="nav-container">
      <a href="${rootHref}" class="logo">Naufal<span>.</span></a>
      <button class="nav-toggle" aria-label="menu" aria-expanded="false" aria-controls="nav-links">
        <span class="nav-toggle-bar"></span>
      </button>
      <div class="nav-right">
        <ul class="nav-links" id="nav-links">
${liHtml}
        </ul>
        <a href="${ctaHref}" class="nav-cta">CTA</a>
      </div>
    </div>
  </nav>
</body></html>`;
}

/** Content-page paths for a locale, drawn from CONTENT_PAGES_BILINGUAL. */
function contentPathsFor(locale) {
  return CONTENT_PAGES_BILINGUAL.filter((p) => p.locale === locale).map((p) => p.path);
}

/** The 404 path for a locale (e.g. /404.html or /en/404.html). */
function notFoundPathFor(locale) {
  return PAGES_BILINGUAL.find((p) => p.slug === "404" && p.locale === locale).path;
}

/**
 * Foreign / unknown paths for a locale shell: the other locale's content paths
 * and its 404 path (which never match this shell's anchors), plus garbage.
 */
function foreignPathsFor(locale) {
  const other = locale === "id" ? "en" : "id";
  return [...contentPathsFor(other), notFoundPathFor(other), ...GARBAGE_PATHS];
}

/**
 * Load nav.js into a fresh jsdom window using the per-locale shell. nav.js
 * auto-runs setActiveNav(location.pathname) on load, but each test calls
 * setActiveNav explicitly (which clears state first), so the auto-run does not
 * affect assertions.
 * @param {"id"|"en"} locale
 * @returns {Window}
 */
function loadNav(locale) {
  return loadScriptModule("assets/js/nav.js", {
    html: buildShellHtml(locale),
    url: "https://naufalnabila.my.id/",
  });
}

/** Anchors in the nav currently carrying aria-current="page". */
function currentAnchors(navbar) {
  return [...navbar.querySelectorAll('a[aria-current="page"]')];
}

for (const locale of LOCALES) {
  const contentPaths = contentPathsFor(locale);
  const unknownPaths = [notFoundPathFor(locale), ...foreignPathsFor(locale)];

  test(`PROP-12 [${locale}]: exactly one aria-current matches currentPath for content pages`, () => {
    fc.assert(
      fc.property(fc.constantFrom(...contentPaths), (currentPath) => {
        const window = loadNav(locale);
        const navbar = window.document.getElementById("navbar");

        window.__nav.setActiveNav(navbar, currentPath);

        const current = currentAnchors(navbar);
        assert.equal(
          current.length,
          1,
          `[${locale}] expected exactly one aria-current="page" for "${currentPath}", got ${current.length}`
        );

        const anchorPath = window.__nav.normalizePath(
          new URL(current[0].href, window.location.origin).pathname
        );
        assert.equal(
          anchorPath,
          window.__nav.normalizePath(currentPath),
          `[${locale}] the aria-current anchor path should equal the current path for "${currentPath}"`
        );
      }),
      { numRuns: 100 }
    );
  });

  test(`PROP-12 [${locale}]: zero aria-current for the 404 path and foreign/garbage paths`, () => {
    fc.assert(
      fc.property(fc.constantFrom(...unknownPaths), (currentPath) => {
        const window = loadNav(locale);
        const navbar = window.document.getElementById("navbar");

        window.__nav.setActiveNav(navbar, currentPath);

        const current = currentAnchors(navbar);
        assert.equal(
          current.length,
          0,
          `[${locale}] expected zero aria-current="page" for unknown path "${currentPath}", got ${current.length}`
        );
      }),
      { numRuns: 100 }
    );
  });
}
