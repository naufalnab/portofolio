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

/* --------------------------------------------------------------------------
 * PROP-10 — resolveLocale precedence + detectFromNavigator semantics
 * Validates: Requirements 3.2, 3.4, 3.7
 *
 * resolveLocale follows precedence explicit > valid-stored > navigator > id,
 * ignoring invalid stored values; detectFromNavigator returns "en" iff the
 * string starts with "en" case-insensitively, else "id" (incl. empty/null).
 *
 * Reuses the shared `storedRawArb` / `navLangArb` arbitraries declared above
 * and the already-loaded `win.__lang` surface; appended without touching the
 * PROP-9 blocks.
 * ------------------------------------------------------------------------ */

const { resolveLocale } = win.__lang;

// explicitChoice as passed by callers: valid locales, null, or stray/invalid
// values that must be ignored so precedence falls through to stored/navigator.
const explicitArb = fc.oneof(
  fc.constantFrom("id", "en"),
  fc.constant(null),
  fc.constantFrom("EN", "ID", "", "fr", "english"),
  fc.string(),
);

// Independent reference model for navigator detection (mirrors the spec, not
// the implementation's internals): empty/null => "id"; otherwise "en" iff the
// trimmed value starts with "en" case-insensitively.
const expectedDetect = (language) => {
  if (language === null || language === undefined || language === "") return "id";
  return /^en/i.test(String(language).trim()) ? "en" : "id";
};

const isValidLocale = (value) => value === "id" || value === "en";

describe("PROP-10: detectFromNavigator — en-prefix (case-insensitive) else id", () => {
  test("any value whose first two chars are 'en' (any case) resolves to 'en'", () => {
    // Smart generator: a cased "en" prefix (no leading whitespace) + arbitrary
    // suffix. trim() cannot strip the prefix, so these must all detect as "en".
    const enPrefixArb = fc
      .tuple(
        fc.constantFrom("en", "EN", "eN", "En"),
        fc.string(),
      )
      .map(([prefix, suffix]) => prefix + suffix);

    fc.assert(
      fc.property(enPrefixArb, (language) => {
        assert.equal(
          detectFromNavigator(language),
          "en",
          `"${language}" starts with en (case-insensitive) => "en"`,
        );
      }),
      { numRuns: 200 },
    );
  });

  test("values not starting with 'en' (after trim) resolve to 'id'", () => {
    // Strings whose trimmed/lowercased form does not start with "en".
    const nonEnArb = fc
      .string()
      .filter((s) => !/^en/i.test(s.trim()));

    fc.assert(
      fc.property(nonEnArb, (language) => {
        assert.equal(
          detectFromNavigator(language),
          "id",
          `"${language}" does not start with en => "id"`,
        );
      }),
      { numRuns: 200 },
    );
  });

  test("agrees with the reference model across the shared navLang arbitrary", () => {
    fc.assert(
      fc.property(navLangArb, (navLang) => {
        const result = detectFromNavigator(navLang);
        assert.ok(isValidLocale(result), "result is always a valid locale");
        assert.equal(result, expectedDetect(navLang));
      }),
      { numRuns: 200 },
    );
  });

  test("explicit empty-string / null / case-insensitive ^en cases", () => {
    // Empty string and null (incl. missing navigator.language) => "id".
    assert.equal(detectFromNavigator(""), "id", "empty string => id");
    assert.equal(detectFromNavigator(null), "id", "null => id");
    assert.equal(detectFromNavigator(undefined), "id", "undefined => id");
    assert.equal(detectFromNavigator("   "), "id", "whitespace-only => id");
    // Case-insensitive ^en => "en".
    for (const lang of ["en", "EN", "En", "eN", "en-US", "EN-GB", "en_AU"]) {
      assert.equal(detectFromNavigator(lang), "en", `${lang} => en`);
    }
    // Non-en languages => "id".
    for (const lang of ["id", "id-ID", "fr", "de-DE", "es", "zh"]) {
      assert.equal(detectFromNavigator(lang), "id", `${lang} => id`);
    }
  });
});

describe("PROP-10: resolveLocale precedence — explicit > valid-stored > navigator > id", () => {
  test("precedence holds for all (explicit, storedRaw, navLang) combinations", () => {
    fc.assert(
      fc.property(
        explicitArb,
        storedRawArb,
        navLangArb,
        (explicit, storedRaw, navLang) => {
          const result = resolveLocale(explicit, storedRaw, navLang);

          // Result is always a defined locale.
          assert.ok(isValidLocale(result), "result is always 'id' or 'en'");

          if (isValidLocale(explicit)) {
            // (a) Explicit valid choice wins outright, ignoring stored/navigator.
            assert.equal(
              result,
              explicit,
              "valid explicit choice takes precedence",
            );
          } else if (isValidLocale(storedRaw)) {
            // (b) Valid stored value wins when no explicit choice.
            assert.equal(
              result,
              storedRaw,
              "valid stored value wins when explicit is absent/invalid",
            );
          } else {
            // (c)/(d) Fall through to navigator detection (which defaults to id).
            assert.equal(
              result,
              expectedDetect(navLang),
              "falls through to navigator detection (default id)",
            );
          }
        },
      ),
      { numRuns: 300 },
    );
  });

  test("invalid stored values are ignored (treated as absent)", () => {
    // With no explicit choice and an invalid stored value, the outcome must be
    // identical to detecting from the navigator alone.
    const invalidStoredArb = fc
      .oneof(fc.string(), fc.constant(null), fc.constantFrom("EN", "ID", "", "de"))
      .filter((s) => s !== "id" && s !== "en");

    fc.assert(
      fc.property(invalidStoredArb, navLangArb, (storedRaw, navLang) => {
        assert.equal(
          resolveLocale(null, storedRaw, navLang),
          detectFromNavigator(navLang),
          "invalid stored value is ignored => navigator detection",
        );
      }),
      { numRuns: 200 },
    );
  });

  test("deterministic precedence table cases", () => {
    // [explicit, storedRaw, navLang] -> expected
    const cases = [
      // Explicit wins over everything.
      ["en", "id", "id-ID", "en"],
      ["id", "en", "en-US", "id"],
      // Invalid explicit ignored; valid stored wins.
      ["EN", "en", "id", "en"],
      [null, "id", "en-US", "id"],
      // No explicit, invalid stored; navigator decides.
      [null, "xx", "en-GB", "en"],
      [null, "", "fr", "id"],
      [null, null, "EN", "en"],
      // No explicit, no stored, empty/garbage navigator => default id.
      [null, null, "", "id"],
      [null, "de", null, "id"],
    ];
    for (const [explicit, storedRaw, navLang, expected] of cases) {
      assert.equal(
        resolveLocale(explicit, storedRaw, navLang),
        expected,
        `resolveLocale(${JSON.stringify(explicit)}, ${JSON.stringify(
          storedRaw,
        )}, ${JSON.stringify(navLang)}) should be ${JSON.stringify(expected)}`,
      );
    }
  });
});
