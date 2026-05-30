/**
 * Per-locale shared-shell consistency test over the bilingual page set.
 *
 * Property 16: the nav (`<nav id="navbar">...</nav>`) and footer
 * (`<footer>...</footer>`) markup is byte-identical between any two pages of
 * the SAME locale AFTER normalization. Normalization neutralizes the markup
 * that legitimately varies per page:
 *   - `aria-current="..."` runtime/active-state attributes,
 *   - the `active` class token,
 *   - the `.lang-option` switcher `href` values (the switcher points at the
 *     current page in each locale, so it differs per page by design), and
 *   - per-line leading indentation + line-ending differences.
 *
 * ID pages are compared against each other and EN pages against each other.
 * The two locales are NOT compared to each other — they carry different,
 * intentionally-translated labels and `/en`-prefixed hrefs.
 *
 * This test SUPERSEDES the legacy single-locale
 * `tests/pages.shell-consistency.test.mjs`, which fails on the bilingual site
 * because it does not neutralize the per-page `.lang-option` hrefs. It reads
 * raw HTML only (via readPage) and needs no jsdom.
 *
 * Validates: Requirements 7.2
 */

import test from "node:test";
import assert from "node:assert/strict";

import { readPage } from "./helpers.mjs";
import { PAGES_BILINGUAL } from "./fixtures/pages.mjs";

/**
 * Extract the inclusive substring from the first `openTag` to the first
 * `closeTag` that follows it.
 * @param {string} html
 * @param {string} openTag - e.g. '<nav id="navbar">'
 * @param {string} closeTag - e.g. '</nav>'
 * @returns {string|null} the matched block, or null if either tag is missing
 */
function extractBlock(html, openTag, closeTag) {
  const start = html.indexOf(openTag);
  if (start === -1) return null;
  const end = html.indexOf(closeTag, start);
  if (end === -1) return null;
  return html.slice(start, end + closeTag.length);
}

/**
 * Drop runtime active-state markup:
 *   - any ` aria-current="..."` attribute (with its leading space). This covers
 *     both nav `aria-current="page"` and the switcher `aria-current="true"`.
 *   - the `active` token from any `class="..."` list, preserving the rest.
 * @param {string} markup
 * @returns {string}
 */
function stripActiveState(markup) {
  let out = markup.replace(/ aria-current="[^"]*"/g, "");

  out = out.replace(/class="([^"]*)"/g, (_match, value) => {
    const tokens = value
      .split(/\s+/)
      .filter((token) => token.length > 0 && token !== "active");
    return `class="${tokens.join(" ")}"`;
  });

  return out;
}

/**
 * Neutralize the per-page language-switcher hrefs. Each `.lang-option` anchor
 * points at the current page (self / pair path), so its `href` legitimately
 * differs between two same-locale pages. Replace those hrefs with a constant
 * placeholder so the rest of the switcher markup can still be compared.
 * @param {string} markup
 * @returns {string}
 */
function neutralizeLangSwitcherHrefs(markup) {
  return markup.replace(
    /<a\b[^>]*\blang-option\b[^>]*>/g,
    (tag) => tag.replace(/href="[^"]*"/g, 'href="#"'),
  );
}

/**
 * Normalize a shell block for a robust-but-meaningful same-locale comparison:
 *   - neutralize active-state attributes/classes (runtime-only),
 *   - neutralize the per-page `.lang-option` switcher hrefs,
 *   - normalize CRLF -> LF and trim leading/trailing whitespace per line
 *     (indentation differs per page — some pages keep the shell at column 0,
 *     others indent it),
 *   - trim the whole block.
 * @param {string} markup
 * @returns {string}
 */
function normalizeShell(markup) {
  const neutralized = neutralizeLangSwitcherHrefs(stripActiveState(markup));
  return neutralized
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

/**
 * Read a page and return its normalized nav and footer blocks.
 * @param {string} file
 * @returns {{ nav: string, footer: string }}
 */
function shellOf(file) {
  const html = readPage(file);

  const nav = extractBlock(html, '<nav id="navbar">', "</nav>");
  assert.ok(nav, `${file} must contain a <nav id="navbar">...</nav> block`);

  const footer = extractBlock(html, "<footer>", "</footer>");
  assert.ok(footer, `${file} must contain a <footer>...</footer> block`);

  return { nav: normalizeShell(nav), footer: normalizeShell(footer) };
}

// Group the bilingual pages by locale; compare within each group only.
const LOCALES = ["id", "en"];

for (const locale of LOCALES) {
  const pages = PAGES_BILINGUAL.filter((p) => p.locale === locale);

  // The first page in the locale group is the reference shell.
  const referencePage = pages[0];
  const reference = shellOf(referencePage.file);

  for (const p of pages) {
    if (p.file === referencePage.file) continue;

    test(`[${locale}] ${p.file} nav matches ${referencePage.file}`, () => {
      const { nav } = shellOf(p.file);
      assert.equal(
        nav,
        reference.nav,
        `${p.file} nav markup must be identical to ${referencePage.file} within locale "${locale}" ` +
          `(ignoring active state and per-page switcher hrefs)`,
      );
    });

    test(`[${locale}] ${p.file} footer matches ${referencePage.file}`, () => {
      const { footer } = shellOf(p.file);
      assert.equal(
        footer,
        reference.footer,
        `${p.file} footer markup must be identical to ${referencePage.file} within locale "${locale}" ` +
          `(ignoring active state and per-page switcher hrefs)`,
      );
    });
  }
}
