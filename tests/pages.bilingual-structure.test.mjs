/**
 * Enumerative fixture-structure tests over the finite bilingual page set
 * (PAGES_BILINGUAL). Bilingual analog of pages.structure.test.mjs.
 *
 *   - Property 14 (integritas struktur PAGES_BILINGUAL): the set has exactly 16
 *     entries (14 indexable + 2 non-indexable 404), each entry maps to exactly
 *     one EXISTING file on disk, and each entry's canonical `path` mirrors the
 *     URL scheme (ID at root, EN under /en/, 404 keeps the `.html` extension).
 *     Also: `pairPath` of each entry equals the `path` of the same slug in the
 *     other locale (never `/en/en/`), and PAGE_PAIRS has exactly 8 pairs.
 *   - Property 15 (one nav & footer): every page has exactly one
 *     <nav id="navbar"> and exactly one <footer> in its raw HTML.
 *
 * Enumerative over the closed, finite page set in PAGES_BILINGUAL; each page
 * gets its own sub-test so failures point at the exact offending file.
 *
 * Validates: Requirements 1.1, 1.2, 1.4, 7.1, 9.1, 9.6
 */

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";

import { ROOT, readPage } from "./helpers.mjs";
import {
  PAGES_BILINGUAL,
  CONTENT_PAGES_BILINGUAL,
  PAGE_PAIRS,
} from "./fixtures/pages.mjs";

/**
 * Count non-overlapping literal occurrences of `needle` in `haystack`.
 * Used to assert exactly one <nav id="navbar"> / <footer> in raw HTML.
 * @param {string} haystack
 * @param {string} needle
 * @returns {number}
 */
function countOccurrences(haystack, needle) {
  let count = 0;
  let from = 0;
  for (;;) {
    const idx = haystack.indexOf(needle, from);
    if (idx === -1) break;
    count += 1;
    from = idx + needle.length;
  }
  return count;
}

/**
 * The canonical root-relative path a (slug, locale) pair must mirror.
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function expectedPath(slug, locale) {
  const prefix = locale === "en" ? "/en" : "";
  if (slug === "404") return `${prefix}/404.html`;
  if (slug === "") return `${prefix}/`;
  return `${prefix}/${slug}/`;
}

/**
 * The repo-relative file a (slug, locale) pair must map to (FS mirror of URL).
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function expectedFile(slug, locale) {
  const dir = locale === "en" ? "en/" : "";
  if (slug === "404") return `${dir}404.html`;
  if (slug === "") return `${dir}index.html`;
  return `${dir}${slug}/index.html`;
}

// ----------------------------------------------------------------------------
// Property 14: integrity of the PAGES_BILINGUAL set (aggregate invariants).
// ----------------------------------------------------------------------------

test("Property 14: PAGES_BILINGUAL has exactly 16 entries (14 indexable + 2 404)", () => {
  assert.equal(
    PAGES_BILINGUAL.length,
    16,
    "PAGES_BILINGUAL must contain exactly 16 entries",
  );

  const indexable = PAGES_BILINGUAL.filter((p) => p.indexable);
  const nonIndexable = PAGES_BILINGUAL.filter((p) => !p.indexable);
  assert.equal(indexable.length, 14, "exactly 14 indexable content pages");
  assert.equal(nonIndexable.length, 2, "exactly 2 non-indexable 404 pages");

  // CONTENT_PAGES_BILINGUAL is the 14 indexable subset.
  assert.equal(
    CONTENT_PAGES_BILINGUAL.length,
    14,
    "CONTENT_PAGES_BILINGUAL must contain exactly 14 entries",
  );
  assert.ok(
    CONTENT_PAGES_BILINGUAL.every((p) => p.indexable),
    "every CONTENT_PAGES_BILINGUAL entry must be indexable",
  );

  // The two non-indexable pages are exactly the 404s, one per locale.
  assert.deepEqual(
    nonIndexable.map((p) => p.slug).sort(),
    ["404", "404"],
    "the only non-indexable pages are the two 404 pages",
  );
  assert.deepEqual(
    nonIndexable.map((p) => p.locale).sort(),
    ["en", "id"],
    "the two 404 pages are one per locale (id + en)",
  );
});

test("Property 14: every entry maps to exactly one existing file mirroring the URL scheme", () => {
  // Each file path is unique across the set (one-to-one URL <-> file).
  const files = PAGES_BILINGUAL.map((p) => p.file);
  assert.equal(
    new Set(files).size,
    files.length,
    "file paths must be unique across PAGES_BILINGUAL (one file per entry)",
  );

  // Each canonical path is unique across the set.
  const paths = PAGES_BILINGUAL.map((p) => p.path);
  assert.equal(
    new Set(paths).size,
    paths.length,
    "canonical paths must be unique across PAGES_BILINGUAL",
  );
});

test("Property 14: PAGE_PAIRS has exactly 8 ID<->EN pairs", () => {
  assert.equal(PAGE_PAIRS.length, 8, "PAGE_PAIRS must contain exactly 8 pairs");

  // One pair per distinct slug; both members present with correct locales.
  const slugs = new Set();
  for (const pair of PAGE_PAIRS) {
    assert.ok(pair.id, `pair for slug "${pair.slug}" must have an id member`);
    assert.ok(pair.en, `pair for slug "${pair.slug}" must have an en member`);
    assert.equal(pair.id.locale, "id", `pair.id locale must be "id"`);
    assert.equal(pair.en.locale, "en", `pair.en locale must be "en"`);
    assert.equal(pair.id.slug, pair.slug, "pair.id slug matches pair slug");
    assert.equal(pair.en.slug, pair.slug, "pair.en slug matches pair slug");
    // The two members are a Pasangan_Halaman: each other's pairPath.
    assert.equal(
      pair.id.pairPath,
      pair.en.path,
      `pair.id.pairPath must equal pair.en.path for slug "${pair.slug}"`,
    );
    assert.equal(
      pair.en.pairPath,
      pair.id.path,
      `pair.en.pairPath must equal pair.id.path for slug "${pair.slug}"`,
    );
    slugs.add(pair.slug);
  }
  assert.equal(slugs.size, 8, "PAGE_PAIRS must cover 8 distinct slugs");
});

// ----------------------------------------------------------------------------
// Property 14 (per-entry) + Property 15: enumerated over each of the 16 pages.
// ----------------------------------------------------------------------------

for (const p of PAGES_BILINGUAL) {
  test(`${p.file} (${p.locale}/${p.slug || "home"}) has correct structure`, () => {
    // --- Property 14: locale is one of the two supported values. ---
    assert.ok(
      p.locale === "id" || p.locale === "en",
      `${p.file} locale must be "id" or "en"`,
    );

    // --- Property 14: path mirrors the URL scheme for this (slug, locale). ---
    assert.equal(
      p.path,
      expectedPath(p.slug, p.locale),
      `${p.file} canonical path must mirror the URL scheme`,
    );

    // EN paths live under /en/; ID paths at root.
    if (p.locale === "en") {
      assert.ok(
        p.path === "/en/" || p.path.startsWith("/en/"),
        `${p.file} EN path must be under the /en/ prefix`,
      );
    } else {
      assert.ok(
        !p.path.startsWith("/en/"),
        `${p.file} ID path must not be under the /en/ prefix`,
      );
    }

    // Content pages are folder URLs ending in "/"; 404 keeps ".html".
    if (p.indexable) {
      assert.ok(
        p.path.endsWith("/"),
        `${p.file} content path must end with "/"`,
      );
      assert.ok(
        !p.path.endsWith(".html"),
        `${p.file} content path must not keep a .html extension`,
      );
    } else {
      assert.equal(p.slug, "404", `${p.file} non-indexable page must be a 404`);
      assert.ok(
        p.path.endsWith("/404.html"),
        `${p.file} 404 path must keep the .html extension`,
      );
    }

    // --- Property 14: file path mirrors the URL scheme and exists on disk. ---
    assert.equal(
      p.file,
      expectedFile(p.slug, p.locale),
      `${p.file} repo-relative file must mirror the URL scheme`,
    );
    assert.ok(
      existsSync(path.join(ROOT, p.file)),
      `${p.file} must map to a file that exists on disk`,
    );

    // --- Property 14: pairPath = path of same slug in the other locale. ---
    const other = p.locale === "id" ? "en" : "id";
    const pairEntry = PAGES_BILINGUAL.find(
      (q) => q.slug === p.slug && q.locale === other,
    );
    assert.ok(
      pairEntry,
      `${p.file} must have a paired entry for slug "${p.slug}" in locale "${other}"`,
    );
    assert.equal(
      p.pairPath,
      pairEntry.path,
      `${p.file} pairPath must equal the ${other} path for the same slug`,
    );
    assert.ok(
      !p.pairPath.includes("/en/en/"),
      `${p.file} pairPath must never contain a doubled /en/en/ prefix`,
    );

    // --- Property 15: exactly one <nav id="navbar"> and one <footer>. ---
    const html = readPage(p.file);
    assert.equal(
      countOccurrences(html, '<nav id="navbar">'),
      1,
      `${p.file} must contain exactly one <nav id="navbar"> in raw HTML`,
    );
    assert.equal(
      countOccurrences(html, "<footer>"),
      1,
      `${p.file} must contain exactly one <footer> in raw HTML`,
    );
  });
}
