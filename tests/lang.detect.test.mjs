/**
 * Property tests for the language detection / redirect helpers exposed by
 * assets/js/lang.js via `window.__lang`.
 *
 * This file is shared by two tasks of the bilingual-id-en spec:
 *   - PROP-9  (this file, task 1.5): `decideRedirect` is gated, anti-loop, idempotent.
 *   - PROP-10 (appended by task 1.6): `resolveLocale` precedence + `detectFromNavigator`.
 * Each property lives in its own `describe()` / `test()` block so additional
 * blocks can be appended without restructuring existing ones.
 *
 * Harness: Node's built-in test runner (`node:test`) + fast-check + jsdom
 * (via the shared `loadScriptModule` helper). Dev-only deps; never shipped.
 *
 * Run: node --test tests/lang.detect.test.mjs
 *      node --test "tests/*.test.mjs"   (full suite; bare dir form fails on Node v24)
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import { loadScriptModule } from "./helpers.mjs";
import { PAGES_BILINGUAL } from "./fixtures/pages.mjs";

// Load lang.js once inside a fresh jsdom window so window.__lang is available.
// lang.js's autoInit guards against a missing #navbar, so a minimal doc is fine.
const win = loadScriptModule("assets/js/lang.js");
const { pairPath, localeOf, detectFromNavigator, decideRedirect } = win.__lang;

/* --------------------------------------------------------------------------
 * Shared arbitraries
 * ------------------------------------------------------------------------ */

// Canonical paths are the only legal `currentPath` inputs per the algorithm's
// precondition (currentPath ∈ PAGES_BILINGUAL). All 16 canonical paths.
const canonicalPath = fc.constantFrom(...PAGES_BILINGUAL.map((p) => p.path));

// storedRaw: localStorage 'lang' as-is — valid locales, invalid/garbage, empty, null.
const storedRawArb = fc.oneof(
  fc.constantFrom("id", "en", "EN", "ID", "english", "", "xx", "de", "id-ID"),
  fc.constant(null),
  fc.string(),
);

// navigatorLanguage: navigator.language-style strings, plus garbage / empty / null.
const navLangArb = fc.oneof(
  fc.constantFrom("en", "en-US", "EN-GB", "id", "id-ID", "fr", "de-DE", ""),
  fc.constant(null),
  fc.string(),
);

/* --------------------------------------------------------------------------
 * PROP-9 — decideRedirect is gated, anti-loop, and idempotent
 * Validates: Requirements 3.3, 3.5, 11.9
 * ------------------------------------------------------------------------ */

describe("PROP-9: decideRedirect is gated, anti-loop, and idempotent", () => {
  test("returns null when disabled, explicit-this-nav, or target locale equals current; else equals pairPath and never equals currentPath", () => {
    fc.assert(
      fc.property(
        fc.boolean(), // enabled
        storedRawArb, // storedRaw
        canonicalPath, // currentPath
        fc.boolean(), // explicitOnThisNav
        navLangArb, // navigatorLanguage
        (enabled, storedRaw, currentPath, explicitOnThisNav, navLang) => {
          const result = decideRedirect(
            enabled,
            storedRaw,
            currentPath,
            explicitOnThisNav,
            navLang,
          );

          // --- Gating: disabled => always null ---
          if (!enabled) {
            assert.equal(result, null, "disabled must yield null");
            return;
          }

          // --- Anti-loop respect: explicit nav => null (honour user's click) ---
          if (explicitOnThisNav) {
            assert.equal(result, null, "explicit-this-nav must yield null");
            return;
          }

          // Recompute the effective target locale the way the algorithm does:
          // valid stored value wins; otherwise navigator detection.
          const here = localeOf(currentPath);
          const target =
            storedRaw === "id" || storedRaw === "en"
              ? storedRaw
              : detectFromNavigator(navLang);

          if (target === here) {
            // Already in the correct locale => no redirect.
            assert.equal(result, null, "target === current locale must yield null");
          } else {
            // Redirecting: result must be the page-pair path and never self.
            assert.equal(
              result,
              pairPath(currentPath),
              "non-null result must equal pairPath(currentPath)",
            );
            assert.notEqual(
              result,
              currentPath,
              "result must never equal currentPath (anti-loop)",
            );
          }
        },
      ),
      { numRuns: 300 },
    );
  });

  test("idempotent: after redirecting, re-deciding at the destination yields null", () => {
    fc.assert(
      fc.property(
        storedRawArb,
        canonicalPath,
        navLangArb,
        (storedRaw, currentPath, navLang) => {
          // Force a non-null decision: enabled=true, explicit=false.
          const dest = decideRedirect(true, storedRaw, currentPath, false, navLang);

          // Only the redirect case is interesting for idempotency.
          fc.pre(dest !== null);

          // Standing on the destination with the same preferences must not redirect again.
          const again = decideRedirect(true, storedRaw, dest, false, navLang);
          assert.equal(
            again,
            null,
            "a second decision at the destination must yield null (no loop)",
          );
        },
      ),
      { numRuns: 300 },
    );
  });

  test("deterministic table cases", () => {
    // [enabled, storedRaw, currentPath, explicit, navLang] -> expected
    const cases = [
      // Gated off => null regardless of mismatch.
      [false, "en", "/", false, "en-US", null],
      // Explicit on this nav => null (respect user's click).
      [true, "en", "/", true, "en-US", null],
      // Stored "en" while on ID home => redirect to /en/.
      [true, "en", "/", false, null, "/en/"],
      // Stored "id" while on EN home => redirect to /.
      [true, "id", "/en/", false, null, "/"],
      // Stored "en" while already on EN => null.
      [true, "en", "/en/services/", false, null, null],
      // No valid stored value; navigator "en" while on ID => redirect.
      [true, null, "/services/", false, "en-GB", "/en/services/"],
      // No valid stored value; navigator "id"/garbage while on ID => null (already correct).
      [true, "", "/services/", false, "fr", null],
    ];
    for (const [enabled, storedRaw, currentPath, explicit, navLang, expected] of cases) {
      assert.equal(
        decideRedirect(enabled, storedRaw, currentPath, explicit, navLang),
        expected,
        `decideRedirect(${enabled}, ${JSON.stringify(storedRaw)}, ${JSON.stringify(
          currentPath,
        )}, ${explicit}, ${JSON.stringify(navLang)}) should be ${JSON.stringify(expected)}`,
      );
    }
  });
});
