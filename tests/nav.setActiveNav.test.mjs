/**
 * Property 4 — Active nav matches the current page.
 *
 * After calling setActiveNav(navRoot, currentPath):
 *  - For a currentPath drawn from the valid content-page paths (CONTENT_PAGES),
 *    exactly ONE nav anchor carries aria-current="page", and that anchor's
 *    normalized path equals the normalized currentPath.
 *  - For a path NOT in PAGES (e.g. "/404.html" or an unknown path), ZERO anchors
 *    carry aria-current="page".
 *  - When a "Layanan" dropdown child is the active page, the dropdown parent
 *    trigger gets class "active" but NOT aria-current (so there stays exactly one
 *    aria-current on the page).
 *
 * Uses Node's built-in test runner + fast-check + the loadScriptModule helper
 * (jsdom). The nav markup fixture is the real partials/_header.html. These are
 * dev-only deps and never shipped with the static site.
 *
 * Validates: Requirements 2.2 (Property 4)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import { loadScriptModule, readPage } from "./helpers.mjs";
import { CONTENT_PAGES } from "./fixtures/pages.mjs";

/**
 * Real nav markup (the canonical source of truth) embedded inside a document
 * body. partials/_header.html is itself the <nav id="navbar"> element.
 */
const HEADER_PARTIAL = readPage("partials/_header.html");
const PAGE_HTML = `<!DOCTYPE html><html lang="id"><head></head><body>
${HEADER_PARTIAL}
</body></html>`;

/** The canonical content-page paths (7 indexable pages, no /404.html). */
const CONTENT_PATHS = CONTENT_PAGES.map((p) => p.path);

/** Paths that are NOT registered content pages. */
const UNKNOWN_PATHS = ["/404.html", "/nope/", "/random-xyz/"];

/**
 * Load nav.js into a fresh jsdom window using the real header markup.
 * nav.js auto-runs setActiveNav(location.pathname) on load, but each test calls
 * setActiveNav explicitly with the sampled path (which first clears all state),
 * so the auto-run does not affect the assertions.
 * @returns {Window} the prepared jsdom window
 */
function loadNav() {
  return loadScriptModule("assets/js/nav.js", {
    html: PAGE_HTML,
    url: "https://naufalnabila.my.id/",
  });
}

/**
 * Anchors in the nav that currently carry aria-current="page".
 * @param {Window} window
 * @param {HTMLElement} navbar
 * @returns {HTMLAnchorElement[]}
 */
function currentAnchors(window, navbar) {
  return [...navbar.querySelectorAll('a[aria-current="page"]')];
}

test("Property 4: exactly one aria-current matches currentPath for content pages", () => {
  fc.assert(
    fc.property(fc.constantFrom(...CONTENT_PATHS), (currentPath) => {
      const window = loadNav();
      const navbar = window.document.getElementById("navbar");

      window.__nav.setActiveNav(navbar, currentPath);

      const current = currentAnchors(window, navbar);
      assert.equal(
        current.length,
        1,
        `expected exactly one aria-current="page" for "${currentPath}", got ${current.length}`
      );

      const anchorPath = window.__nav.normalizePath(
        new URL(current[0].href, window.location.origin).pathname
      );
      assert.equal(
        anchorPath,
        window.__nav.normalizePath(currentPath),
        `the aria-current anchor path should equal the current path for "${currentPath}"`
      );
    }),
    { numRuns: 100 }
  );
});

test("Property 4: zero aria-current for paths not registered in PAGES", () => {
  fc.assert(
    fc.property(fc.constantFrom(...UNKNOWN_PATHS), (currentPath) => {
      const window = loadNav();
      const navbar = window.document.getElementById("navbar");

      window.__nav.setActiveNav(navbar, currentPath);

      const current = currentAnchors(window, navbar);
      assert.equal(
        current.length,
        0,
        `expected zero aria-current="page" for unknown path "${currentPath}", got ${current.length}`
      );
    }),
    { numRuns: 100 }
  );
});

test("Property 4: active dropdown child marks parent trigger .active (without aria-current)", () => {
  fc.assert(
    fc.property(
      fc.constantFrom("/layanan-website/", "/layanan-video-ai/"),
      (currentPath) => {
        const window = loadNav();
        const navbar = window.document.getElementById("navbar");

        window.__nav.setActiveNav(navbar, currentPath);

        // Exactly one aria-current overall (the active child link).
        const current = currentAnchors(window, navbar);
        assert.equal(
          current.length,
          1,
          `expected exactly one aria-current="page" for "${currentPath}", got ${current.length}`
        );

        // The dropdown parent trigger gets .active but NOT aria-current.
        const trigger = navbar.querySelector(".nav-dropdown > a");
        assert.ok(trigger, "dropdown trigger anchor should exist");
        assert.equal(
          trigger.classList.contains("active"),
          true,
          `dropdown trigger should have class "active" when child "${currentPath}" is active`
        );
        assert.equal(
          trigger.getAttribute("aria-current"),
          null,
          "dropdown trigger must NOT carry aria-current (keeps exactly one aria-current)"
        );
      }
    ),
    { numRuns: 100 }
  );
});
