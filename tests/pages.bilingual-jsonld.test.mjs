/**
 * Enumerative correctness test over the finite bilingual page set.
 *
 * Property 12 — PROP-11: JSON-LD `Service` tepat sasaran & valid
 *   For any page in PAGES_BILINGUAL:
 *     - every <script type="application/ld+json"> block JSON.parses to a
 *       non-null object (valid JSON);
 *     - there is exactly one JSON-LD block whose @type is "Service" on each of
 *       the FOUR service pages (layanan-website + layanan-video-ai, each x
 *       {id, en}) and ZERO Service blocks on all other pages;
 *     - on the four service pages, Service.inLanguage equals the page locale
 *       AND equals the page's <html lang>.
 *
 * The bilingual page set is small and closed (16 pages), so this is a
 * deterministic enumerative test that iterates every page rather than
 * randomising inputs.
 *
 * Uses only Node's built-in test runner (`node:test` + `node:assert`) plus the
 * shared `loadDom` helper (jsdom) and the canonical `PAGES_BILINGUAL` fixture.
 * Run with: `node --test tests/pages.bilingual-jsonld.test.mjs` (needs jsdom).
 *
 * Validates: Requirements 8.1, 8.3, 8.4, 11.11
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { PAGES_BILINGUAL } from "./fixtures/pages.mjs";

/** The two slugs whose pages (in both locales) carry a Service JSON-LD block. */
const SERVICE_SLUGS = new Set(["layanan-website", "layanan-video-ai"]);

/**
 * True iff the page (by slug) is one of the four service pages that must carry
 * exactly one Service JSON-LD block.
 * @param {{slug: string}} page
 * @returns {boolean}
 */
function isServicePage(page) {
  return SERVICE_SLUGS.has(page.slug);
}

/**
 * Collect every JSON-LD block on a page, parsing each one. Each block MUST
 * JSON.parse successfully into a non-null object (the assertion fails
 * otherwise). schema.org allows `@type` to be a string or an array, so the
 * raw parsed objects are returned for callers to classify.
 * @param {Document} doc
 * @param {string} file - page file path (for failure messages)
 * @returns {Array<object>} parsed JSON-LD objects in document order
 */
function parseJsonLdBlocks(doc, file) {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const parsed = [];
  scripts.forEach((s, i) => {
    let obj;
    assert.doesNotThrow(() => {
      obj = JSON.parse(s.textContent);
    }, `${file}: JSON-LD block #${i} must JSON.parse successfully`);
    assert.ok(
      obj !== null && typeof obj === "object",
      `${file}: JSON-LD block #${i} must parse to a non-null object, got ${obj === null ? "null" : typeof obj}`,
    );
    parsed.push(obj);
  });
  return parsed;
}

/**
 * Whether a parsed JSON-LD object is a schema.org Service. Tolerates `@type`
 * being either a string ("Service") or an array that includes "Service".
 * @param {object} block
 * @returns {boolean}
 */
function isServiceBlock(block) {
  if (!block || typeof block !== "object") return false;
  const t = block["@type"];
  return Array.isArray(t) ? t.includes("Service") : t === "Service";
}

/**
 * Filter parsed JSON-LD objects down to those that are schema.org Services.
 * @param {Array<object>} blocks
 * @returns {Array<object>}
 */
function serviceBlocks(blocks) {
  return blocks.filter(isServiceBlock);
}

// ---------------------------------------------------------------------------
// Property 12 (PROP-11)
// ---------------------------------------------------------------------------

test("Property 12 (PROP-11): every JSON-LD block on every bilingual page parses to a non-null object", () => {
  for (const page of PAGES_BILINGUAL) {
    const doc = loadDom(page.file);
    // parseJsonLdBlocks asserts JSON.parse success + non-null object per block.
    parseJsonLdBlocks(doc, page.file);
  }
});

test("Property 12 (PROP-11): exactly one Service JSON-LD on each of the four service pages, zero elsewhere", () => {
  for (const page of PAGES_BILINGUAL) {
    const doc = loadDom(page.file);
    const services = serviceBlocks(parseJsonLdBlocks(doc, page.file));
    const expected = isServicePage(page) ? 1 : 0;
    assert.equal(
      services.length,
      expected,
      `${page.file} (locale=${page.locale}): expected ${expected} Service JSON-LD block(s), got ${services.length}`,
    );
  }
});

test("Property 12 (PROP-11): on each service page Service.inLanguage equals the page locale and <html lang>", () => {
  // Guard: the fixture must actually contain the four service pages, so an
  // empty iteration can never make this test vacuously pass.
  const servicePages = PAGES_BILINGUAL.filter(isServicePage);
  assert.equal(
    servicePages.length,
    4,
    `expected exactly 4 service pages in PAGES_BILINGUAL, got ${servicePages.length}`,
  );

  for (const page of servicePages) {
    const doc = loadDom(page.file);
    const services = serviceBlocks(parseJsonLdBlocks(doc, page.file));
    assert.equal(
      services.length,
      1,
      `${page.file}: expected exactly one Service block, got ${services.length}`,
    );

    const htmlLang = doc.documentElement.getAttribute("lang");
    const inLanguage = services[0].inLanguage;

    assert.equal(
      inLanguage,
      page.locale,
      `${page.file}: Service.inLanguage must equal page locale "${page.locale}", got "${inLanguage}"`,
    );
    assert.equal(
      htmlLang,
      page.locale,
      `${page.file}: <html lang> must equal page locale "${page.locale}", got "${htmlLang}"`,
    );
    assert.equal(
      inLanguage,
      htmlLang,
      `${page.file}: Service.inLanguage ("${inLanguage}") must equal <html lang> ("${htmlLang}")`,
    );
  }
});
