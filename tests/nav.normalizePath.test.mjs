/**
 * Property test for `normalizePath` exposed by assets/js/nav.js.
 *
 * Covers design.md "Property 10: `normalizePath` idempoten & deterministik":
 *   ∀ string s: normalizePath(normalizePath(s)) === normalizePath(s)  (idempotent)
 *   ∀ string s: normalizePath(s) === normalizePath(s)                  (deterministic)
 *
 * Uses Node's built-in test runner + fast-check, loading nav.js inside a jsdom
 * window via loadScriptModule so window.__nav.normalizePath is available.
 *
 * Validates: Requirements 2.2 (Property 10)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { loadScriptModule } from "./helpers.mjs";

// Minimal page with a #navbar shell so nav.js's IIFE initialises without throwing.
const HTML =
  '<!DOCTYPE html><html><head></head><body>' +
  '<nav id="navbar"><ul class="nav-links"></ul></nav>' +
  "</body></html>";

const win = loadScriptModule("assets/js/nav.js", { html: HTML });
const { normalizePath } = win.__nav;

// A focused arbitrary that biases generation toward the path-shaped inputs that
// actually exercise normalizePath's branches (hash, query, trailing slash, .html).
const pathSegment = fc.constantFrom(
  "",
  "/",
  "#",
  "?",
  ".html",
  "services",
  "case-studies",
  "404",
  "q=1",
  "h",
  "//",
  "a.htmlx",
);
const pathLikeArbitrary = fc
  .array(pathSegment, { maxLength: 8 })
  .map((parts) => parts.join(""));

test("Property 10: normalizePath is idempotent over arbitrary strings", () => {
  fc.assert(
    fc.property(fc.string(), (s) => {
      const once = normalizePath(s);
      const twice = normalizePath(once);
      assert.equal(twice, once);
    }),
  );
});

test("Property 10: normalizePath is idempotent over path-shaped inputs", () => {
  fc.assert(
    fc.property(pathLikeArbitrary, (s) => {
      const once = normalizePath(s);
      const twice = normalizePath(once);
      assert.equal(twice, once);
    }),
  );
});

test("Property 10: normalizePath is deterministic (same input -> same output)", () => {
  fc.assert(
    fc.property(fc.string(), (s) => {
      assert.equal(normalizePath(s), normalizePath(s));
    }),
  );
});

test("normalizePath deterministic table cases", () => {
  const cases = [
    ["", "/"],
    ["/services", "/services/"],
    ["/services/", "/services/"],
    ["/x?q=1#h", "/x/"],
    ["/404.html", "/404.html"],
    ["/", "/"],
  ];
  for (const [input, expected] of cases) {
    assert.equal(
      normalizePath(input),
      expected,
      `normalizePath(${JSON.stringify(input)}) should be ${JSON.stringify(expected)}`,
    );
  }
});
