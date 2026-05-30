/**
 * Enumerative correctness tests over the finite set of site pages.
 *
 * Property 7 — SEO meta unik & lengkap (Requirements 5.1, 5.2)
 * Property 8 — JSON-LD tepat sasaran (Requirements 5.3)
 *
 * The page set is small and closed (7 indexable content pages + /404.html),
 * so these are deterministic enumerative tests that assert universal
 * properties by iterating every page rather than randomising inputs.
 *
 * Uses only Node's built-in test runner (`node:test` + `node:assert`) plus the
 * shared `loadDom` helper (jsdom) and the canonical `PAGES`/`CONTENT_PAGES`
 * fixtures. Run with: `node --test tests/pages.seo.test.mjs` (needs jsdom).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { CONTENT_PAGES, PAGES } from "./fixtures/pages.mjs";

/** Canonical origin every absolute URL on the site must use. */
const ORIGIN = "https://naufalnabila.my.id";

/**
 * Read the trimmed `content` attribute of the first matching meta element.
 * @param {Document} doc
 * @param {string} selector
 * @returns {string|null} the content string, or null if the element is absent
 */
function metaContent(doc, selector) {
  const el = doc.querySelector(selector);
  return el ? (el.getAttribute("content") || "").trim() : null;
}

// ---------------------------------------------------------------------------
// Property 7: SEO meta unik & lengkap
// Validates: Requirements 5.1, 5.2
// ---------------------------------------------------------------------------

test("Property 7: <title> non-empty and unique across content pages", () => {
  const titles = [];

  for (const p of CONTENT_PAGES) {
    const doc = loadDom(p.file);
    const titleEl = doc.querySelector("title");
    assert.ok(titleEl, `${p.file}: missing <title>`);
    const title = (titleEl.textContent || "").trim();
    assert.ok(title.length > 0, `${p.file}: <title> is empty`);
    titles.push(title);
  }

  const unique = new Set(titles);
  assert.equal(
    unique.size,
    CONTENT_PAGES.length,
    `titles must be unique across content pages, got duplicates in: ${JSON.stringify(titles)}`,
  );
});

test("Property 7: canonical present, absolute, unique, equals ORIGIN + path", () => {
  const canonicals = [];

  for (const p of CONTENT_PAGES) {
    const doc = loadDom(p.file);
    const link = doc.querySelector("link[rel=canonical]");
    assert.ok(link, `${p.file}: missing <link rel="canonical">`);

    const href = (link.getAttribute("href") || "").trim();
    assert.ok(
      href.startsWith("https://"),
      `${p.file}: canonical must be absolute https URL, got "${href}"`,
    );
    assert.equal(
      href,
      ORIGIN + p.path,
      `${p.file}: canonical must equal "${ORIGIN + p.path}", got "${href}"`,
    );
    canonicals.push(href);
  }

  const unique = new Set(canonicals);
  assert.equal(
    unique.size,
    CONTENT_PAGES.length,
    `canonicals must be unique across content pages, got: ${JSON.stringify(canonicals)}`,
  );
});

test("Property 7: meta description present, length between 50 and 160", () => {
  for (const p of CONTENT_PAGES) {
    const doc = loadDom(p.file);
    const desc = metaContent(doc, "meta[name=description]");
    assert.ok(desc !== null, `${p.file}: missing <meta name="description">`);
    assert.ok(
      desc.length >= 50 && desc.length <= 160,
      `${p.file}: description length must be 50-160, got ${desc.length} ("${desc}")`,
    );
  }
});

test("Property 7: OG tags present, non-empty; og:url == canonical; og:image absolute", () => {
  for (const p of CONTENT_PAGES) {
    const doc = loadDom(p.file);

    const ogTitle = metaContent(doc, "meta[property='og:title']");
    const ogDesc = metaContent(doc, "meta[property='og:description']");
    const ogUrl = metaContent(doc, "meta[property='og:url']");
    const ogImage = metaContent(doc, "meta[property='og:image']");
    const ogType = metaContent(doc, "meta[property='og:type']");

    for (const [name, value] of [
      ["og:title", ogTitle],
      ["og:description", ogDesc],
      ["og:url", ogUrl],
      ["og:image", ogImage],
      ["og:type", ogType],
    ]) {
      assert.ok(value !== null, `${p.file}: missing ${name}`);
      assert.ok(value.length > 0, `${p.file}: ${name} content is empty`);
    }

    const canonical = doc
      .querySelector("link[rel=canonical]")
      .getAttribute("href")
      .trim();
    assert.equal(
      ogUrl,
      canonical,
      `${p.file}: og:url must equal canonical "${canonical}", got "${ogUrl}"`,
    );
    assert.ok(
      ogImage.startsWith("https://"),
      `${p.file}: og:image must be absolute https URL, got "${ogImage}"`,
    );
  }
});

// ---------------------------------------------------------------------------
// Property 8: JSON-LD tepat sasaran
// Validates: Requirements 5.3
// ---------------------------------------------------------------------------

/**
 * Collect every JSON-LD block on a page, parsing each one. Each block MUST
 * JSON.parse successfully (the assertion fails otherwise).
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
    parsed.push(obj);
  });
  return parsed;
}

/**
 * Filter parsed JSON-LD objects down to those that are schema.org Services.
 * @param {Array<object>} blocks
 * @returns {Array<object>} blocks whose @type is "Service"
 */
function serviceBlocks(blocks) {
  return blocks.filter((b) => b && b["@type"] === "Service");
}

test("Property 8: /layanan-website/ has exactly one Service 'Pembuatan Website'", () => {
  const page = CONTENT_PAGES.find((p) => p.slug === "layanan-website");
  assert.ok(page, "fixture must contain layanan-website page");

  const doc = loadDom(page.file);
  const services = serviceBlocks(parseJsonLdBlocks(doc, page.file));

  assert.equal(
    services.length,
    1,
    `${page.file}: expected exactly one Service JSON-LD, got ${services.length}`,
  );
  assert.equal(
    services[0].serviceType,
    "Pembuatan Website",
    `${page.file}: Service serviceType must be "Pembuatan Website", got "${services[0].serviceType}"`,
  );
});

test("Property 8: /layanan-video-ai/ has exactly one Service 'Pembuatan Video AI'", () => {
  const page = CONTENT_PAGES.find((p) => p.slug === "layanan-video-ai");
  assert.ok(page, "fixture must contain layanan-video-ai page");

  const doc = loadDom(page.file);
  const services = serviceBlocks(parseJsonLdBlocks(doc, page.file));

  assert.equal(
    services.length,
    1,
    `${page.file}: expected exactly one Service JSON-LD, got ${services.length}`,
  );
  assert.equal(
    services[0].serviceType,
    "Pembuatan Video AI",
    `${page.file}: Service serviceType must be "Pembuatan Video AI", got "${services[0].serviceType}"`,
  );
});

test("Property 8: no other page (incl. Home, 404) contains a Service JSON-LD block", () => {
  const serviceSlugs = new Set(["layanan-website", "layanan-video-ai"]);

  for (const p of PAGES) {
    if (serviceSlugs.has(p.slug)) continue;

    const doc = loadDom(p.file);
    const services = serviceBlocks(parseJsonLdBlocks(doc, p.file));
    assert.equal(
      services.length,
      0,
      `${p.file}: must NOT contain a Service JSON-LD block, found ${services.length}`,
    );
  }
});

test("Property 8: every JSON-LD block on every page JSON.parses successfully", () => {
  for (const p of PAGES) {
    const doc = loadDom(p.file);
    // parseJsonLdBlocks asserts JSON.parse success for each block.
    parseJsonLdBlocks(doc, p.file);
  }
});
