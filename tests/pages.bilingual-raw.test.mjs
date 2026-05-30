/**
 * Enumerative raw-HTML presence tests over the finite bilingual page set
 * (PAGES_BILINGUAL). These assert the "shell & structured data present in the
 * RAW static HTML" property — i.e. the markup is there WITHOUT executing any
 * JavaScript. Everything here works on the raw text returned by `readPage`
 * (NOT jsdom-executed), so it proves the static-first / no-i18n-runtime nature
 * of the site: nav/footer anchors, the language switcher, and (on the four
 * service pages) the Service JSON-LD are all server-rendered.
 *
 * Property 18 — shell & structured data hadir di raw HTML:
 *   For any page in PAGES_BILINGUAL, in the RAW HTML (no JS execution):
 *     - the navigation shell is present: `<nav id="navbar">` with at least one
 *       nav anchor (`<a `);
 *     - the footer landmark `<footer>` is present and has non-empty text;
 *     - the language switcher is present: the `.lang-option` switcher anchors;
 *     - there is at least one non-empty `<h1>` landmark;
 *     - the inline anti-FOUC theme-init `<script>` appears BEFORE the first
 *       `<link rel="stylesheet">` (no flash);
 *     - on the four service pages (layanan-website + layanan-video-ai, each in
 *       {id, en}) there is EXACTLY ONE `application/ld+json` Service block.
 *
 * The bilingual page set is small and closed (16 entries: 7 content slugs +
 * 404, each in {id, en}), so this is a deterministic enumerative test that
 * iterates every page. Each page gets its own sub-test so failures point at the
 * exact offending file.
 *
 * Uses only Node's built-in test runner (`node:test` + `node:assert`) plus the
 * shared `readPage` helper (RAW text) and the canonical `PAGES_BILINGUAL`
 * fixture.
 * Run with: `node --test tests/pages.bilingual-raw.test.mjs`.
 *
 * Validates: Requirements 7.4, 8.6, 9.4, 10.1
 */

import test from "node:test";
import assert from "node:assert/strict";

import { readPage } from "./helpers.mjs";
import { PAGES_BILINGUAL } from "./fixtures/pages.mjs";

/** The two slugs whose pages (in both locales) carry a Service JSON-LD block. */
const SERVICE_SLUGS = new Set(["layanan-website", "layanan-video-ai"]);

// Anti-FOUC snippet identifiers (quote-agnostic for ' or "), reused from the
// single-locale antifouc test so the ordering check stays consistent.
const READ_THEME_RE = /localStorage\.getItem\(\s*['"]theme['"]\s*\)/;
const ADD_LIGHT_RE =
  /document\.documentElement\.classList\.add\(\s*['"]light-mode['"]\s*\)/;
// First <link rel="stylesheet"> (tolerant of attribute order/quoting).
const STYLESHEET_LINK_RE = /<link\b[^>]*\brel\s*=\s*['"]?stylesheet['"]?/i;

// Language switcher option anchors (raw <a class="lang-option" ...>).
const LANG_OPTION_RE = /<a\b[^>]*\bclass\s*=\s*['"][^'"]*\blang-option\b/i;

/**
 * Extract the inner text of the FIRST <foo ...>...</foo> block whose tag name
 * is `tag`, with all nested tags stripped and whitespace collapsed. Returns
 * null if no such block exists. Used to assert a landmark's text is non-empty.
 * @param {string} html
 * @param {string} tag - e.g. "h1", "footer", "nav"
 * @returns {string|null}
 */
function landmarkText(html, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = html.match(re);
  if (!m) return null;
  return m[1]
    .replace(/<[^>]*>/g, " ") // drop nested tags
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract the inner HTML of the <nav id="navbar"> ... </nav> block, or null.
 * @param {string} html
 * @returns {string|null}
 */
function navbarInner(html) {
  const m = html.match(/<nav\s+id="navbar">([\s\S]*?)<\/nav>/i);
  return m ? m[1] : null;
}

/**
 * Count the JSON-LD blocks in raw HTML whose body declares @type "Service".
 * Works purely on raw text (no JS / jsdom). schema.org allows @type to be a
 * string; the four service pages use the string form `"@type": "Service"`.
 * @param {string} html
 * @returns {number}
 */
function countServiceJsonLd(html) {
  const scriptRe =
    /<script\b[^>]*type\s*=\s*['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi;
  let count = 0;
  for (const m of html.matchAll(scriptRe)) {
    if (/"@type"\s*:\s*"Service"/.test(m[1])) count += 1;
  }
  return count;
}

for (const page of PAGES_BILINGUAL) {
  const isServicePage = SERVICE_SLUGS.has(page.slug);

  test(`Property 18: ${page.file} (${page.locale}/${page.slug || "home"}) shell present in raw HTML`, () => {
    const html = readPage(page.file);

    // --- Navigation shell: <nav id="navbar"> with at least one anchor. ---
    const nav = navbarInner(html);
    assert.ok(
      nav !== null,
      `${page.file}: raw HTML must contain a <nav id="navbar"> block`,
    );
    assert.match(
      nav,
      /<a\s/i,
      `${page.file}: <nav id="navbar"> must contain at least one nav <a > anchor in raw HTML`,
    );
    const navText = landmarkText(html, "nav");
    assert.ok(
      navText && navText.length > 0,
      `${page.file}: nav landmark text must be non-empty in raw HTML`,
    );

    // --- Footer landmark present and non-empty. ---
    assert.ok(
      html.includes("<footer>"),
      `${page.file}: raw HTML must contain a <footer> landmark`,
    );
    const footerText = landmarkText(html, "footer");
    assert.ok(
      footerText && footerText.length > 0,
      `${page.file}: <footer> landmark text must be non-empty in raw HTML`,
    );

    // --- Language switcher anchors present in raw HTML (no-JS fallback). ---
    const langOptions = (html.match(new RegExp(LANG_OPTION_RE, "gi")) || []).length;
    assert.ok(
      langOptions >= 2,
      `${page.file}: raw HTML must contain the .lang-option switcher anchors (found ${langOptions}, expected >= 2)`,
    );

    // --- At least one non-empty <h1> landmark. ---
    const h1Text = landmarkText(html, "h1");
    assert.ok(
      h1Text !== null,
      `${page.file}: raw HTML must contain at least one <h1> landmark`,
    );
    assert.ok(
      h1Text.length > 0,
      `${page.file}: the <h1> landmark text must be non-empty in raw HTML`,
    );

    // --- Anti-FOUC: inline theme-init precedes the first stylesheet link. ---
    const themeMatch = html.match(READ_THEME_RE);
    assert.ok(
      themeMatch,
      `${page.file}: must contain an inline theme-init reading localStorage.getItem('theme')`,
    );
    assert.ok(
      ADD_LIGHT_RE.test(html),
      `${page.file}: theme-init must add the 'light-mode' class to documentElement`,
    );
    const scriptOpenIdx = html.lastIndexOf("<script", themeMatch.index);
    assert.ok(
      scriptOpenIdx >= 0,
      `${page.file}: anti-FOUC snippet must live inside an inline <script>`,
    );
    const linkMatch = html.match(STYLESHEET_LINK_RE);
    assert.ok(
      linkMatch,
      `${page.file}: must contain at least one <link rel="stylesheet">`,
    );
    assert.ok(
      scriptOpenIdx < linkMatch.index,
      `${page.file}: inline theme-init (<script> @ ${scriptOpenIdx}) must appear ` +
        `BEFORE the first <link rel="stylesheet"> (@ ${linkMatch.index}) to avoid FOUC`,
    );

    // --- Service JSON-LD: exactly one on service pages, zero elsewhere. ---
    const serviceCount = countServiceJsonLd(html);
    const expected = isServicePage ? 1 : 0;
    assert.equal(
      serviceCount,
      expected,
      `${page.file}: expected ${expected} Service application/ld+json block(s) in raw HTML, got ${serviceCount}`,
    );
  });
}
