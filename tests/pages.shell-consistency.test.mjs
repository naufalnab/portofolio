/**
 * Enumerative shared-shell consistency test over the finite set of site pages.
 *
 * Property 11 (header/footer consistent across pages): the nav
 * (`<nav id="navbar">...</nav>`) and footer (`<footer>...</footer>`) markup —
 * excluding runtime active-state attributes (`class="active"`,
 * `aria-current="page"`) — is byte-identical across all PAGES.
 *
 * This test reads raw HTML only (via readPage) and does not need jsdom, so it
 * runs even before dev dependencies are installed.
 *
 * Validates: Requirements 1.2
 */

import test from "node:test";
import assert from "node:assert/strict";

import { readPage } from "./helpers.mjs";
import { PAGES } from "./fixtures/pages.mjs";

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
 * Neutralize runtime active-state markup so static shell comparison is fair:
 *   - drop ` aria-current="page"` attributes entirely
 *   - remove the `active` token from any `class="..."` list
 * @param {string} markup
 * @returns {string}
 */
function stripActiveState(markup) {
  // Remove the runtime active-state attribute (with its leading space).
  let out = markup.replace(/ aria-current="page"/g, "");

  // Remove the `active` token from class lists, preserving the rest.
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
 * points at the current page (self path) and its locale pair, so its `href`
 * legitimately differs between two same-locale pages. Replace those hrefs with
 * a constant placeholder so the rest of the shell markup can still be compared
 * byte-for-byte. This mirrors `tests/pages.bilingual-shell.test.mjs`.
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
 * Normalize a shell block for robust-but-meaningful comparison:
 *   - neutralize active-state attributes (runtime-only)
 *   - neutralize the per-page `.lang-option` switcher hrefs (correct-by-design
 *     to differ per page — the switcher points at the current page)
 *   - trim leading/trailing whitespace per line (indentation differs per page,
 *     since some pages keep the shell at column 0 and others indent it)
 * @param {string} markup
 * @returns {string}
 */
function normalizeShell(markup) {
  return neutralizeLangSwitcherHrefs(stripActiveState(markup))
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
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

// The first page (index.html) is the reference shell.
const referencePage = PAGES[0];
const reference = shellOf(referencePage.file);

for (const p of PAGES) {
  if (p.file === referencePage.file) continue;

  test(`${p.file} nav matches ${referencePage.file}`, () => {
    const { nav } = shellOf(p.file);
    assert.equal(
      nav,
      reference.nav,
      `${p.file} nav markup must be identical to ${referencePage.file} (ignoring active state)`,
    );
  });

  test(`${p.file} footer matches ${referencePage.file}`, () => {
    const { footer } = shellOf(p.file);
    assert.equal(
      footer,
      reference.footer,
      `${p.file} footer markup must be identical to ${referencePage.file} (ignoring active state)`,
    );
  });
}
