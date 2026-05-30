/**
 * Property 6 — Per-page asset loading (enumerative over the finite PAGES set).
 *
 * Validates: Requirements 4.1, 4.3, 4.4, 4.5
 *
 * Rules (from design.md "Daftar Aset Wajib per Halaman" + Requirement 4):
 *  - EVERY page loads the 5 core CSS (base, layout, sections, components,
 *    responsive) and the 4 core JS (theme, nav, reveal, main).            [4.1]
 *  - /layanan-website/ and /layanan-video-ai/ ALSO load
 *    services-commercial.css AND services.js; no other page loads either. [4.3]
 *  - /case-studies/ and /founded/ ALSO load toggles.js; no other page
 *    loads it.                                                            [4.4]
 *  - hero.css is loaded ONLY by Home (index.html, slug "") and 404.html
 *    (404 reuses the .hero layout); no other page loads hero.css.        [4.5]
 *  - Every css/js/img asset reference is root-relative, starting with
 *    "/assets/" (no document-relative "assets/..." or "../assets/...").   [4.2]
 *
 * Implementation note: parses each page via readPage + regex (no jsdom needed
 * for the parse step), so the suite is robust even if optional deps change.
 */

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { readPage } from "./helpers.mjs";
import { PAGES, PAGES_BILINGUAL } from "./fixtures/pages.mjs";

// ---------------------------------------------------------------------------
// Canonical asset sets
// ---------------------------------------------------------------------------

const CORE_CSS = ["base.css", "layout.css", "sections.css", "components.css", "responsive.css"];
const CORE_JS = ["theme.js", "nav.js", "reveal.js", "main.js"];

// Slugs that get each page-specific asset.
const SERVICES_SLUGS = new Set(["layanan-website", "layanan-video-ai"]);
const TOGGLES_SLUGS = new Set(["case-studies", "founded"]);
// 404.html reuses the .hero layout, so hero.css is permitted on Home + 404.
const HERO_SLUGS = new Set(["", "404"]);

// ---------------------------------------------------------------------------
// Tiny HTML asset extractors (regex over raw markup)
// ---------------------------------------------------------------------------

/** @param {string} tag @param {string} attr @returns {string|null} */
function attr(tag, attrName) {
  const m = tag.match(new RegExp(`\\b${attrName}\\s*=\\s*["']([^"']+)["']`, "i"));
  return m ? m[1] : null;
}

/** Collect href of every <link rel="stylesheet">. @param {string} html */
function stylesheetHrefs(html) {
  const out = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (/\brel\s*=\s*["']stylesheet["']/i.test(tag)) {
      const href = attr(tag, "href");
      if (href) out.push(href);
    }
  }
  return out;
}

/** Collect src of every <script src="...">. @param {string} html */
function scriptSrcs(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b[^>]*>/gi)) {
    const src = attr(m[0], "src");
    if (src) out.push(src);
  }
  return out;
}

/** Collect src of every <img src="...">. @param {string} html */
function imgSrcs(html) {
  const out = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = attr(m[0], "src");
    if (src) out.push(src);
  }
  return out;
}

/** Derive the file basename of an asset ref, dropping query/hash. */
function basename(ref) {
  const clean = ref.split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1];
}

/** Build the css/js basename inventory for a page file. */
function assetInventory(file) {
  const html = readPage(file);
  const css = new Set(stylesheetHrefs(html).map(basename));
  const js = new Set(scriptSrcs(html).map(basename));
  return { html, css, js };
}

// ---------------------------------------------------------------------------
// Property 6 — required + page-specific assets, no surplus
// ---------------------------------------------------------------------------

describe("Property 6 — per-page asset loading (required, no surplus)", () => {
  for (const page of PAGES) {
    const label = page.file + (page.slug === "" ? " (Home)" : "");

    test(`${label}: loads all 5 core CSS + 4 core JS`, () => {
      const { css, js } = assetInventory(page.file);
      for (const name of CORE_CSS) {
        assert.ok(css.has(name), `${page.file} must link core CSS "${name}"`);
      }
      for (const name of CORE_JS) {
        assert.ok(js.has(name), `${page.file} must load core JS "${name}"`);
      }
    });

    test(`${label}: services-commercial.css + services.js present iff Layanan page`, () => {
      const { css, js } = assetInventory(page.file);
      const expected = SERVICES_SLUGS.has(page.slug);
      assert.equal(
        css.has("services-commercial.css"),
        expected,
        `${page.file} services-commercial.css presence should be ${expected}`,
      );
      assert.equal(
        js.has("services.js"),
        expected,
        `${page.file} services.js presence should be ${expected}`,
      );
    });

    test(`${label}: toggles.js present iff Case Studies/Founded`, () => {
      const { js } = assetInventory(page.file);
      const expected = TOGGLES_SLUGS.has(page.slug);
      assert.equal(
        js.has("toggles.js"),
        expected,
        `${page.file} toggles.js presence should be ${expected}`,
      );
    });

    test(`${label}: hero.css present iff Home or 404`, () => {
      const { css } = assetInventory(page.file);
      const expected = HERO_SLUGS.has(page.slug);
      assert.equal(
        css.has("hero.css"),
        expected,
        `${page.file} hero.css presence should be ${expected}`,
      );
    });
  }
});

// ---------------------------------------------------------------------------
// Requirement 4.2 — every css/js/img asset ref is root-relative under /assets/
// ---------------------------------------------------------------------------

describe("Property 6 — all css/js/img asset paths are root-relative (/assets/)", () => {
  for (const page of PAGES) {
    const label = page.file + (page.slug === "" ? " (Home)" : "");

    test(`${label}: no document-relative asset references`, () => {
      const html = readPage(page.file);
      const refs = [...stylesheetHrefs(html), ...scriptSrcs(html), ...imgSrcs(html)];

      assert.ok(refs.length > 0, `${page.file} should reference at least one asset`);

      for (const ref of refs) {
        assert.ok(
          ref.startsWith("/assets/"),
          `${page.file}: asset "${ref}" must be root-relative starting with "/assets/"`,
        );
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Property 20 — bilingual aset root-relative
//
// Validates: Requirements 10.5
//
// For ANY page in PAGES_BILINGUAL (all 16: 7 content slugs x {id,en} + 404 x
// {id,en}), every CSS/JS/image reference must be a ROOT-RELATIVE path starting
// with "/assets/" so it resolves identically from any folder depth — including
// EN pages served under "/en/...". A document-relative "../assets/..." or
// "assets/..." (no leading slash) would break on the deeper "/en/" pages, which
// is exactly what this property guards. This iteration also subsumes the
// single-locale PAGES coverage above (the id-locale entries are the same files).
// ---------------------------------------------------------------------------

describe("Property 20 — bilingual css/js/img asset paths are root-relative (/assets/)", () => {
  for (const page of PAGES_BILINGUAL) {
    const label = `${page.file} [${page.locale}]`;

    test(`${label}: every asset ref is root-relative under /assets/`, () => {
      const html = readPage(page.file);
      const refs = [...stylesheetHrefs(html), ...scriptSrcs(html), ...imgSrcs(html)];

      assert.ok(refs.length > 0, `${page.file} should reference at least one asset`);

      for (const ref of refs) {
        assert.ok(
          ref.startsWith("/assets/"),
          `${page.file} [${page.locale}]: asset "${ref}" must be root-relative ` +
            `starting with "/assets/" (no "../assets/" or "assets/..." — would break under "/en/")`,
        );
      }
    });
  }
});
