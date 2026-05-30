/**
 * Enumerative structure tests over the finite set of site pages (PAGES).
 *
 * Validates basic per-page DOM structure required for SEO and the shared shell:
 *   - Property 1 (one nav & footer): every page has exactly one <nav id="navbar">
 *     and exactly one <footer>.
 *   - Property 2 (one H1): every page has exactly one <h1> whose trimmed text
 *     content is non-empty.
 *
 * This is an enumerative test over the finite page set defined in PAGES; each
 * page gets its own sub-test so failures point at the exact offending file.
 *
 * Validates: Requirements 1.1, 6.1
 */

import test from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { PAGES } from "./fixtures/pages.mjs";

for (const p of PAGES) {
  test(`${p.file} has one nav/footer/h1`, () => {
    const document = loadDom(p.file);

    // Property 1: exactly one nav#navbar and exactly one footer.
    assert.equal(
      document.querySelectorAll("nav#navbar").length,
      1,
      `${p.file} must contain exactly one <nav id="navbar">`,
    );
    assert.equal(
      document.querySelectorAll("footer").length,
      1,
      `${p.file} must contain exactly one <footer>`,
    );

    // Property 2: exactly one <h1> with non-empty trimmed text.
    const h1s = document.querySelectorAll("h1");
    assert.equal(
      h1s.length,
      1,
      `${p.file} must contain exactly one <h1>`,
    );
    assert.ok(
      h1s[0].textContent.trim().length >= 1,
      `${p.file} <h1> must have non-empty trimmed text`,
    );
  });
}
