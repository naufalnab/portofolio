/**
 * Enumerative bilingual SEO correctness tests over the finite bilingual page
 * set (PAGES_BILINGUAL / CONTENT_PAGES_BILINGUAL). Bilingual analog of
 * pages.seo.test.mjs.
 *
 * Property 3 — PROP-3: `<html lang>` cocok locale halaman
 *   For any page in PAGES_BILINGUAL, the <html> element has exactly one `lang`
 *   attribute whose (lowercase) value equals the page locale ("id" / "en").
 *
 * Property 4 — PROP-4: hreflang lengkap, self-referencing, resolvable
 *   For any content page in CONTENT_PAGES_BILINGUAL, there are exactly three
 *   <link rel="alternate" hreflang>: id, en, x-default. hreflang=id → the ID
 *   member URL, hreflang=en → the EN member URL, hreflang=x-default → the ID
 *   member URL. Every href is an absolute https URL on naufalnabila.my.id that
 *   resolves to a file in PAGES_BILINGUAL, and the set self-references the
 *   page's own locale. The hreflang set is identical between paired pages.
 *
 * Property 5 — PROP-5: canonical = URL diri sendiri
 *   For any content page in CONTENT_PAGES_BILINGUAL, there is exactly one
 *   link[rel=canonical] equal to ORIGIN + path (absolute https, trailing "/"),
 *   identical to the page's own-locale hreflang entry, and not pointing to the
 *   other-language pair.
 *
 * Property 17 — SEO meta per-locale lengkap & unik
 *   For any content page: <title> 10–70 chars and meta[name=description]
 *   50–160 chars, both non-empty after trim and unique within the same-locale
 *   page group; og:locale matches locale (id_ID / en_US), og:locale:alternate
 *   is the opposite locale, og:url == canonical, og:title/og:description
 *   non-empty.
 *
 * The 404 pages are non-indexable (noindex) and are excluded from the
 * indexable-SEO properties above; PROP-3 still applies to them (they have a
 * <html lang>), and we additionally assert they carry NO canonical link.
 *
 * The bilingual page set is small and closed, so these are deterministic
 * enumerative tests that assert the universal property by iterating every
 * page. Each page gets its own sub-test so failures point at the exact
 * offending file.
 *
 * Uses only Node's built-in test runner (`node:test` + `node:assert`) plus the
 * shared `loadDom` helper (jsdom) and the canonical fixtures.
 * Run with: `node --test tests/pages.bilingual-seo.test.mjs` (needs jsdom).
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 11.3, 11.4, 11.5
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import {
  ORIGIN,
  PAGES_BILINGUAL,
  CONTENT_PAGES_BILINGUAL,
  PAGE_PAIRS,
} from "./fixtures/pages.mjs";

/** Every absolute canonical URL that exists in the bilingual page set. */
const VALID_URLS = new Set(PAGES_BILINGUAL.map((p) => ORIGIN + p.path));

/** og:locale string expected for each locale. */
const OG_LOCALE = Object.freeze({ id: "id_ID", en: "en_US" });

/**
 * The ID-member and EN-member canonical paths of a page's Pasangan_Halaman,
 * derived from the fixture. For an ID page: own path is the ID path and
 * pairPath is the EN path; for an EN page: the reverse.
 * @param {{ locale: "id"|"en", path: string, pairPath: string }} page
 * @returns {{ idPath: string, enPath: string }}
 */
function pairPaths(page) {
  const idPath = page.locale === "id" ? page.path : page.pairPath;
  const enPath = page.locale === "en" ? page.path : page.pairPath;
  return { idPath, enPath };
}

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

/**
 * Collect the hreflang alternate links of a page into a { hreflang: href } map,
 * asserting there are exactly three (id/en/x-default) with no duplicates.
 * @param {Document} doc
 * @param {string} file - page file path (for failure messages)
 * @returns {{ id: string, en: string, "x-default": string }}
 */
function getHreflangMap(doc, file) {
  const links = Array.from(
    doc.querySelectorAll('link[rel="alternate"][hreflang]'),
  );
  assert.equal(
    links.length,
    3,
    `${file}: must contain exactly three <link rel="alternate" hreflang>, found ${links.length}`,
  );

  const map = {};
  for (const link of links) {
    const hl = (link.getAttribute("hreflang") || "").trim();
    const href = (link.getAttribute("href") || "").trim();
    assert.ok(
      !(hl in map),
      `${file}: duplicate hreflang="${hl}" — each value must appear exactly once`,
    );
    map[hl] = href;
  }

  for (const expected of ["id", "en", "x-default"]) {
    assert.ok(
      expected in map,
      `${file}: missing <link rel="alternate" hreflang="${expected}">`,
    );
  }

  return map;
}

// ===========================================================================
// Property 3 (PROP-3): <html lang> equals the page locale, lowercase, exactly
// one. Applies to ALL pages including the two 404s.
// ===========================================================================

for (const page of PAGES_BILINGUAL) {
  test(`PROP-3: ${page.file} has exactly one lowercase <html lang> = "${page.locale}"`, () => {
    const doc = loadDom(page.file);

    const htmlEls = doc.querySelectorAll("html");
    assert.equal(
      htmlEls.length,
      1,
      `${page.file}: must contain exactly one <html> element, found ${htmlEls.length}`,
    );

    const html = doc.documentElement;
    assert.ok(
      html.hasAttribute("lang"),
      `${page.file}: <html> must have a lang attribute`,
    );

    const lang = html.getAttribute("lang");
    assert.equal(
      lang,
      page.locale,
      `${page.file}: <html lang> must equal page locale "${page.locale}", got "${lang}"`,
    );
    assert.equal(
      lang,
      lang.toLowerCase(),
      `${page.file}: <html lang> must be lowercase, got "${lang}"`,
    );
  });
}

// ===========================================================================
// Property 4 (PROP-4): exactly three self-referencing absolute-https hreflang
// links (id/en/x-default) resolving into PAGES_BILINGUAL; x-default = ID URL.
// Indexable content pages only.
// ===========================================================================

for (const page of CONTENT_PAGES_BILINGUAL) {
  test(`PROP-4: ${page.file} has 3 self-referencing, resolvable hreflang links`, () => {
    const doc = loadDom(page.file);
    const map = getHreflangMap(doc, page.file);

    const { idPath, enPath } = pairPaths(page);
    const idUrl = ORIGIN + idPath;
    const enUrl = ORIGIN + enPath;

    // Every href is an absolute https URL on the canonical host and resolves
    // to a file that exists in PAGES_BILINGUAL.
    for (const [hl, href] of Object.entries(map)) {
      assert.ok(
        href.startsWith("https://"),
        `${page.file}: hreflang="${hl}" href must be absolute https, got "${href}"`,
      );
      assert.ok(
        href.startsWith(ORIGIN + "/"),
        `${page.file}: hreflang="${hl}" href must be on ${ORIGIN}, got "${href}"`,
      );
      assert.ok(
        VALID_URLS.has(href),
        `${page.file}: hreflang="${hl}" href "${href}" must resolve to a page in PAGES_BILINGUAL`,
      );
    }

    // hreflang=id → ID member, hreflang=en → EN member, x-default → ID member.
    assert.equal(
      map.id,
      idUrl,
      `${page.file}: hreflang="id" must point to the ID URL "${idUrl}", got "${map.id}"`,
    );
    assert.equal(
      map.en,
      enUrl,
      `${page.file}: hreflang="en" must point to the EN URL "${enUrl}", got "${map.en}"`,
    );
    assert.equal(
      map["x-default"],
      idUrl,
      `${page.file}: hreflang="x-default" must point to the ID URL "${idUrl}", got "${map["x-default"]}"`,
    );

    // Self-referencing: the entry for the page's own locale equals its own URL.
    const selfHref = map[page.locale];
    assert.equal(
      selfHref,
      ORIGIN + page.path,
      `${page.file}: hreflang set must self-reference "${ORIGIN + page.path}" for locale "${page.locale}", got "${selfHref}"`,
    );
  });
}

// ===========================================================================
// Property 4 (continued): the hreflang set is identical between paired pages.
// ===========================================================================

for (const pair of PAGE_PAIRS) {
  // Only the indexable content pairs carry hreflang links.
  if (!pair.id.indexable || !pair.en.indexable) continue;

  test(`PROP-4: pair "${pair.slug || "home"}" has identical hreflang set on ID and EN`, () => {
    const idDoc = loadDom(pair.id.file);
    const enDoc = loadDom(pair.en.file);

    const idMap = getHreflangMap(idDoc, pair.id.file);
    const enMap = getHreflangMap(enDoc, pair.en.file);

    assert.deepEqual(
      idMap,
      enMap,
      `pair "${pair.slug}": hreflang set must be identical between ${pair.id.file} and ${pair.en.file}`,
    );

    // And that shared x-default is the ID member URL.
    assert.equal(
      idMap["x-default"],
      ORIGIN + pair.id.path,
      `pair "${pair.slug}": x-default must be the ID URL "${ORIGIN + pair.id.path}"`,
    );
  });
}

// ===========================================================================
// Property 5 (PROP-5): canonical = ORIGIN + path, equal to the page's own
// locale hreflang entry. Indexable content pages only.
// ===========================================================================

for (const page of CONTENT_PAGES_BILINGUAL) {
  test(`PROP-5: ${page.file} canonical = ORIGIN + path = own-locale hreflang`, () => {
    const doc = loadDom(page.file);

    const links = doc.querySelectorAll("link[rel=canonical]");
    assert.equal(
      links.length,
      1,
      `${page.file}: must contain exactly one <link rel="canonical">, found ${links.length}`,
    );

    const href = (links[0].getAttribute("href") || "").trim();
    const expected = ORIGIN + page.path;

    assert.ok(
      href.startsWith("https://"),
      `${page.file}: canonical must be absolute https, got "${href}"`,
    );
    assert.ok(
      href.endsWith("/"),
      `${page.file}: canonical must be in trailing-slash canonical form, got "${href}"`,
    );
    assert.equal(
      href,
      expected,
      `${page.file}: canonical must equal "${expected}", got "${href}"`,
    );

    // canonical equals the page's own-locale hreflang entry (not the pair).
    const map = getHreflangMap(doc, page.file);
    assert.equal(
      href,
      map[page.locale],
      `${page.file}: canonical must equal the own-locale ("${page.locale}") hreflang "${map[page.locale]}", got "${href}"`,
    );

    const otherLocale = page.locale === "id" ? "en" : "id";
    assert.notEqual(
      href,
      map[otherLocale],
      `${page.file}: canonical must NOT point to the other-language pair "${map[otherLocale]}"`,
    );
  });
}

// ===========================================================================
// Property 17: title 10–70, description 50–160, both non-empty; og:locale /
// og:locale:alternate / og:url=canonical; og:title/og:description non-empty.
// Indexable content pages only.
// ===========================================================================

for (const page of CONTENT_PAGES_BILINGUAL) {
  test(`PROP-17: ${page.file} has complete, well-formed per-locale SEO meta`, () => {
    const doc = loadDom(page.file);

    // --- <title>: present, 10–70 chars, non-empty after trim. ---
    const titleEl = doc.querySelector("title");
    assert.ok(titleEl, `${page.file}: missing <title>`);
    const title = (titleEl.textContent || "").trim();
    assert.ok(title.length > 0, `${page.file}: <title> is empty after trim`);
    assert.ok(
      title.length >= 10 && title.length <= 70,
      `${page.file}: <title> length must be 10-70, got ${title.length} ("${title}")`,
    );

    // --- meta description: present, 50–160 chars, non-empty after trim. ---
    const desc = metaContent(doc, "meta[name=description]");
    assert.ok(desc !== null, `${page.file}: missing <meta name="description">`);
    assert.ok(desc.length > 0, `${page.file}: description is empty after trim`);
    assert.ok(
      desc.length >= 50 && desc.length <= 160,
      `${page.file}: description length must be 50-160, got ${desc.length} ("${desc}")`,
    );

    // --- og:locale / og:locale:alternate match the page locale. ---
    const otherLocale = page.locale === "id" ? "en" : "id";
    const ogLocale = metaContent(doc, "meta[property='og:locale']");
    const ogLocaleAlt = metaContent(doc, "meta[property='og:locale:alternate']");
    assert.equal(
      ogLocale,
      OG_LOCALE[page.locale],
      `${page.file}: og:locale must be "${OG_LOCALE[page.locale]}", got "${ogLocale}"`,
    );
    assert.equal(
      ogLocaleAlt,
      OG_LOCALE[otherLocale],
      `${page.file}: og:locale:alternate must be "${OG_LOCALE[otherLocale]}", got "${ogLocaleAlt}"`,
    );

    // --- og:title / og:description present and non-empty. ---
    const ogTitle = metaContent(doc, "meta[property='og:title']");
    const ogDesc = metaContent(doc, "meta[property='og:description']");
    assert.ok(ogTitle !== null, `${page.file}: missing og:title`);
    assert.ok(ogTitle.length > 0, `${page.file}: og:title is empty`);
    assert.ok(ogDesc !== null, `${page.file}: missing og:description`);
    assert.ok(ogDesc.length > 0, `${page.file}: og:description is empty`);

    // --- og:url == canonical (same string). ---
    const ogUrl = metaContent(doc, "meta[property='og:url']");
    const canonical = (
      doc.querySelector("link[rel=canonical]").getAttribute("href") || ""
    ).trim();
    assert.equal(
      ogUrl,
      canonical,
      `${page.file}: og:url must equal canonical "${canonical}", got "${ogUrl}"`,
    );
  });
}

// ===========================================================================
// Property 17 (continued): title & description are unique WITHIN each locale
// group (id vs en separately).
// ===========================================================================

for (const locale of ["id", "en"]) {
  const pages = CONTENT_PAGES_BILINGUAL.filter((p) => p.locale === locale);

  test(`PROP-17: <title> is unique across ${locale} content pages`, () => {
    const titles = pages.map((p) => {
      const doc = loadDom(p.file);
      const el = doc.querySelector("title");
      assert.ok(el, `${p.file}: missing <title>`);
      return (el.textContent || "").trim();
    });

    assert.equal(
      new Set(titles).size,
      titles.length,
      `titles must be unique across ${locale} content pages, got: ${JSON.stringify(titles)}`,
    );
  });

  test(`PROP-17: description is unique across ${locale} content pages`, () => {
    const descs = pages.map((p) => {
      const doc = loadDom(p.file);
      const d = metaContent(doc, "meta[name=description]");
      assert.ok(d !== null, `${p.file}: missing description`);
      return d;
    });

    assert.equal(
      new Set(descs).size,
      descs.length,
      `descriptions must be unique across ${locale} content pages, got: ${JSON.stringify(descs)}`,
    );
  });
}

// ===========================================================================
// 404 pages are noindex: they must carry NO canonical link (excluded from the
// indexable-SEO properties above).
// ===========================================================================

for (const page of PAGES_BILINGUAL.filter((p) => !p.indexable)) {
  test(`404 noindex: ${page.file} has no canonical link`, () => {
    const doc = loadDom(page.file);
    const links = doc.querySelectorAll("link[rel=canonical]");
    assert.equal(
      links.length,
      0,
      `${page.file}: noindex 404 page must NOT declare a canonical link, found ${links.length}`,
    );

    // Sanity: it is in fact marked noindex.
    const robots = metaContent(doc, 'meta[name="robots"]');
    assert.equal(
      robots,
      "noindex",
      `${page.file}: 404 page must carry <meta name="robots" content="noindex">, got "${robots}"`,
    );
  });
}
