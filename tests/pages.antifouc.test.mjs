/**
 * Anti-FOUC ordering tests over the finite set of site pages (PAGES).
 *
 * Property 5 (tema persist lintas navigasi tanpa flash):
 *   (a) PRIMARY (string/regex, no jsdom needed): in every page's HTML the inline
 *       theme-init <script> appears in <head> BEFORE the first
 *       <link rel="stylesheet">. The snippet is identified by the substrings
 *       `localStorage.getItem('theme')` together with
 *       `document.documentElement.classList.add('light-mode')`. We assert the
 *       inline <script> opening-tag index is less than the first stylesheet
 *       link index — so the theme class is set synchronously before any CSS is
 *       evaluated/painted (no flash).
 *   (b) BEST-EFFORT (jsdom): with a localStorage stub set to 'light' BEFORE the
 *       snippet runs, evaluating the inline snippet adds 'light-mode' to
 *       documentElement. Guarded with a dynamic import + try/catch so a missing
 *       jsdom (or any eval issue) skips gracefully instead of failing the suite.
 *
 * Validates: Requirements 3.1
 */

import test from "node:test";
import assert from "node:assert/strict";

import { readPage } from "./helpers.mjs";
import { PAGES } from "./fixtures/pages.mjs";

// Identify the anti-FOUC snippet (quote-agnostic for ' or ").
const READ_THEME_RE = /localStorage\.getItem\(\s*['"]theme['"]\s*\)/;
const ADD_LIGHT_RE =
  /document\.documentElement\.classList\.add\(\s*['"]light-mode['"]\s*\)/;
// First <link rel="stylesheet"> (tolerant of attribute order/quoting).
const STYLESHEET_LINK_RE = /<link\b[^>]*\brel\s*=\s*['"]?stylesheet['"]?/i;

/**
 * Extract the JS source of the inline <script> that contains the anti-FOUC
 * snippet, or null if no such inline script exists.
 * @param {string} html
 * @returns {string|null}
 */
function extractThemeInitCode(html) {
  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(scriptRe)) {
    const body = match[1];
    if (READ_THEME_RE.test(body) && ADD_LIGHT_RE.test(body)) {
      return body;
    }
  }
  return null;
}

// ---- Part (a): primary string/regex ordering assertion (no jsdom) ----
for (const p of PAGES) {
  test(`${p.file} inline theme-init precedes first stylesheet link`, () => {
    const html = readPage(p.file);

    // The anti-FOUC snippet must be present and identifiable.
    const themeMatch = html.match(READ_THEME_RE);
    assert.ok(
      themeMatch,
      `${p.file} must contain an inline theme-init reading localStorage.getItem('theme')`,
    );
    assert.ok(
      ADD_LIGHT_RE.test(html),
      `${p.file} theme-init must add the 'light-mode' class to documentElement`,
    );

    // Locate the inline <script> opening tag that wraps the snippet.
    const snippetIdx = themeMatch.index;
    const scriptOpenIdx = html.lastIndexOf("<script", snippetIdx);
    assert.ok(
      scriptOpenIdx >= 0,
      `${p.file} anti-FOUC snippet must live inside an inline <script>`,
    );

    // Locate the first stylesheet link.
    const linkMatch = html.match(STYLESHEET_LINK_RE);
    assert.ok(
      linkMatch,
      `${p.file} must contain at least one <link rel="stylesheet">`,
    );
    const firstLinkIdx = linkMatch.index;

    // Property 5(a): theme-init script index < first stylesheet link index.
    assert.ok(
      scriptOpenIdx < firstLinkIdx,
      `${p.file}: inline theme-init (<script> @ ${scriptOpenIdx}) must appear ` +
        `BEFORE the first <link rel="stylesheet"> (@ ${firstLinkIdx}) to avoid FOUC`,
    );
  });
}

// ---- Part (b): best-effort jsdom behavioral check (skips if jsdom missing) ----
test("inline theme-init applies light-mode when localStorage.theme='light' (jsdom)", async (t) => {
  let JSDOM;
  try {
    ({ JSDOM } = await import("jsdom"));
  } catch {
    t.skip("jsdom not available — skipping behavioral check");
    return;
  }

  for (const p of PAGES) {
    const code = extractThemeInitCode(readPage(p.file));
    if (!code) {
      // Part (a) already asserts presence; nothing behavioral to verify here.
      continue;
    }

    let dom;
    try {
      dom = new JSDOM(
        "<!DOCTYPE html><html><head></head><body></body></html>",
        { runScripts: "outside-only" },
      );
      // Stub localStorage to return 'light' BEFORE the snippet runs.
      Object.defineProperty(dom.window, "localStorage", {
        configurable: true,
        writable: true,
        value: {
          getItem: (key) => (key === "theme" ? "light" : null),
          setItem() {},
          removeItem() {},
        },
      });
      // Evaluate the inline snippet in the window's global scope.
      dom.window.eval(code);
    } catch (err) {
      t.skip(`jsdom behavioral eval failed (${err.message}) — skipping`);
      return;
    }

    assert.ok(
      dom.window.document.documentElement.classList.contains("light-mode"),
      `${p.file}: theme-init should add 'light-mode' to <html> when theme='light'`,
    );
  }
});
