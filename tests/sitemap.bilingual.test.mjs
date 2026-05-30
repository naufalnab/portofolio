/**
 * Bilingual sitemap correctness test (enumerative / parse-based).
 *
 * Property 11 — PROP-10: sitemap bilingual lengkap & konsisten
 *   For the committed `sitemap.xml`: the set of `<loc>` values equals exactly
 *   the 14 content URLs (7 ID + 7 EN), with no duplicates and neither 404 URL;
 *   each `<loc>` is an absolute https URL in canonical trailing-slash form equal
 *   to the page's own canonical (`ORIGIN + path`). Every `<url>` carries exactly
 *   three `<xhtml:link rel="alternate" hreflang>` alternates (`id`, `en`,
 *   `x-default`) whose hrefs are identical between the two members of a
 *   Pasangan_Halaman (x-default = the ID URL). The document is well-formed and
 *   `<urlset>` declares both the sitemap 0.9 and the xhtml namespaces.
 *
 * Parses the real `sitemap.xml` with jsdom (XML mode) and compares against the
 * canonical `PAGES_BILINGUAL` / `CONTENT_PAGES_BILINGUAL` / `PAGE_PAIRS`
 * fixtures. Run with: `node --test tests/sitemap.bilingual.test.mjs`.
 *
 * Validates: Requirements 5.1, 5.2, 5.4, 5.5, 11.10
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { JSDOM } from "jsdom";

import { readPage } from "./helpers.mjs";
import {
  ORIGIN,
  CONTENT_PAGES_BILINGUAL,
  PAGE_PAIRS,
} from "./fixtures/pages.mjs";

/** Sitemaps 0.9 namespace, declared as the default namespace on <urlset>. */
const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
/** XHTML namespace, declared with the `xhtml` prefix for <xhtml:link>. */
const XHTML_NS = "http://www.w3.org/1999/xhtml";

/** The three hreflang values every <url> must annotate, in canonical order. */
const HREFLANGS = ["id", "en", "x-default"];

/**
 * Parse sitemap.xml as an XML document via jsdom.
 * @returns {Document} the parsed XML document
 */
function parseSitemap() {
  const xml = readPage("sitemap.xml");
  const dom = new JSDOM(xml, { contentType: "application/xml" });
  return dom.window.document;
}

/**
 * Expected absolute canonical URL set for the 14 indexable content pages.
 * Each equals ORIGIN + path (the page's own canonical).
 * @type {string[]}
 */
const EXPECTED_LOCS = CONTENT_PAGES_BILINGUAL.map((p) => ORIGIN + p.path);

/**
 * For a given <loc> URL, derive the expected {id, en, x-default} alternate
 * hrefs from PAGE_PAIRS. Both members of a Pasangan_Halaman map to the SAME
 * expected alternates, so this also encodes the "identical between paired
 * pages" requirement (x-default = the ID URL).
 * @param {string} loc - absolute canonical URL of the page
 * @returns {{ id: string, en: string, "x-default": string }}
 */
function expectedAlternatesFor(loc) {
  const page = CONTENT_PAGES_BILINGUAL.find((p) => ORIGIN + p.path === loc);
  assert.ok(page, `no content page matches <loc> "${loc}"`);
  const pair = PAGE_PAIRS.find((pr) => pr.slug === page.slug);
  assert.ok(pair, `no PAGE_PAIRS entry for slug "${page.slug}"`);
  const idUrl = ORIGIN + pair.id.path;
  const enUrl = ORIGIN + pair.en.path;
  return { id: idUrl, en: enUrl, "x-default": idUrl };
}

/**
 * Read the trimmed <loc> text of a <url> element.
 * @param {Element} urlEl
 * @returns {string|null}
 */
function locOf(urlEl) {
  const locs = urlEl.getElementsByTagNameNS(SITEMAP_NS, "loc");
  return locs.length ? (locs[0].textContent || "").trim() : null;
}

/**
 * Read all xhtml:link alternates under a <url> element.
 * @param {Element} urlEl
 * @returns {Array<{rel: string|null, hreflang: string|null, href: string|null}>}
 */
function alternatesOf(urlEl) {
  const links = urlEl.getElementsByTagNameNS(XHTML_NS, "link");
  return Array.from(links).map((l) => ({
    rel: l.getAttribute("rel"),
    hreflang: l.getAttribute("hreflang"),
    href: l.getAttribute("href"),
  }));
}

// ---------------------------------------------------------------------------
// Property 11 (PROP-10): document well-formedness + namespaces
// Validates: Requirements 5.5
// ---------------------------------------------------------------------------

test("Property 11: sitemap.xml is well-formed with <urlset> root", () => {
  const doc = parseSitemap();

  // jsdom (like a browser) emits a <parsererror> element on malformed XML.
  const errors = doc.getElementsByTagName("parsererror");
  assert.equal(
    errors.length,
    0,
    `sitemap.xml must be well-formed XML, parser reported: ${
      errors.length ? errors[0].textContent : ""
    }`,
  );

  const root = doc.documentElement;
  assert.ok(root, "sitemap.xml must have a document element");
  assert.equal(
    root.localName,
    "urlset",
    `root element must be <urlset>, got <${root.localName}>`,
  );
});

test("Property 11: <urlset> declares both sitemap 0.9 and xhtml namespaces", () => {
  const doc = parseSitemap();
  const root = doc.documentElement;

  assert.equal(
    root.namespaceURI,
    SITEMAP_NS,
    `<urlset> default namespace must be "${SITEMAP_NS}", got "${root.namespaceURI}"`,
  );
  assert.equal(
    root.lookupNamespaceURI("xhtml"),
    XHTML_NS,
    `<urlset> must declare xmlns:xhtml="${XHTML_NS}"`,
  );
});

// ---------------------------------------------------------------------------
// Property 11 (PROP-10): <loc> set == 14 content URLs (no dupes, no 404)
// Validates: Requirements 5.1, 5.4, 11.10
// ---------------------------------------------------------------------------

test("Property 11: <loc> set equals exactly the 14 content canonicals", () => {
  const doc = parseSitemap();
  const urls = Array.from(doc.getElementsByTagNameNS(SITEMAP_NS, "url"));

  assert.equal(
    urls.length,
    CONTENT_PAGES_BILINGUAL.length,
    `expected ${CONTENT_PAGES_BILINGUAL.length} <url> entries, got ${urls.length}`,
  );

  const locs = urls.map((u) => {
    const loc = locOf(u);
    assert.ok(loc, "every <url> must contain exactly one non-empty <loc>");
    return loc;
  });

  // No duplicate <loc> values.
  const unique = new Set(locs);
  assert.equal(
    unique.size,
    locs.length,
    `<loc> values must be unique, got duplicates in: ${JSON.stringify(locs)}`,
  );

  // Exact set match against the expected 14 content canonicals.
  assert.deepEqual(
    [...unique].sort(),
    [...EXPECTED_LOCS].sort(),
    "the <loc> set must equal exactly the 14 content canonicals (7 ID + 7 EN)",
  );

  // Defensive: neither 404 URL may appear, and every loc is canonical https.
  for (const loc of locs) {
    assert.ok(
      loc.startsWith("https://"),
      `<loc> must be an absolute https URL, got "${loc}"`,
    );
    assert.ok(
      loc.endsWith("/"),
      `<loc> must be in canonical trailing-slash form, got "${loc}"`,
    );
    assert.ok(
      !loc.includes("404"),
      `<loc> must not include a 404 URL, got "${loc}"`,
    );
  }
});

// ---------------------------------------------------------------------------
// Property 11 (PROP-10): exactly three correct alternates per <url>,
// identical between paired pages (x-default = ID URL)
// Validates: Requirements 5.2, 5.4, 11.10
// ---------------------------------------------------------------------------

test("Property 11: each <url> has exactly three id/en/x-default alternates with correct hrefs", () => {
  const doc = parseSitemap();
  const urls = Array.from(doc.getElementsByTagNameNS(SITEMAP_NS, "url"));

  for (const urlEl of urls) {
    const loc = locOf(urlEl);
    const alts = alternatesOf(urlEl);

    assert.equal(
      alts.length,
      3,
      `${loc}: expected exactly 3 <xhtml:link> alternates, got ${alts.length}`,
    );

    // Every alternate must be rel="alternate".
    for (const a of alts) {
      assert.equal(
        a.rel,
        "alternate",
        `${loc}: every <xhtml:link> must be rel="alternate", got "${a.rel}"`,
      );
    }

    // hreflang values are exactly {id, en, x-default}, each once.
    const langs = alts.map((a) => a.hreflang).sort();
    assert.deepEqual(
      langs,
      [...HREFLANGS].sort(),
      `${loc}: hreflang set must be exactly {id, en, x-default}, got ${JSON.stringify(langs)}`,
    );

    // hrefs match the expected pair-derived URLs (identical between paired pages).
    const expected = expectedAlternatesFor(loc);
    const byLang = Object.fromEntries(alts.map((a) => [a.hreflang, a.href]));
    for (const lang of HREFLANGS) {
      assert.equal(
        byLang[lang],
        expected[lang],
        `${loc}: hreflang="${lang}" href must be "${expected[lang]}", got "${byLang[lang]}"`,
      );
    }
  }
});

test("Property 11: alternates are identical between the two members of each pair", () => {
  const doc = parseSitemap();
  const urls = Array.from(doc.getElementsByTagNameNS(SITEMAP_NS, "url"));

  // Map each <loc> to its sorted "hreflang=href" alternate signature.
  const sigByLoc = new Map();
  for (const urlEl of urls) {
    const loc = locOf(urlEl);
    const sig = alternatesOf(urlEl)
      .map((a) => `${a.hreflang}=${a.href}`)
      .sort()
      .join("|");
    sigByLoc.set(loc, sig);
  }

  // For every content pair, the ID and EN entries must share the same signature.
  for (const pair of PAGE_PAIRS) {
    if (!pair.id.indexable || !pair.en.indexable) continue; // skip 404 pair
    const idLoc = ORIGIN + pair.id.path;
    const enLoc = ORIGIN + pair.en.path;
    const idSig = sigByLoc.get(idLoc);
    const enSig = sigByLoc.get(enLoc);
    assert.ok(idSig, `missing sitemap <url> for ID page "${idLoc}"`);
    assert.ok(enSig, `missing sitemap <url> for EN page "${enLoc}"`);
    assert.equal(
      idSig,
      enSig,
      `slug "${pair.slug}": alternates must be identical between ${idLoc} and ${enLoc}`,
    );
  }
});
