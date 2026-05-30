/**
 * Property test for `pairPath` / `localeOf` exposed by assets/js/lang.js.
 *
 * Covers design.md "Property 1 (PROP-1): pairPath is an involutive bijection
 * that flips locale, never produces `/en/en/`, and lands on a path in
 * PAGES_BILINGUAL":
 *   ∀ canonical path p:
 *     pairPath(pairPath(p)) === p           (involution / self-inverse bijection)
 *     localeOf(pairPath(p)) !== localeOf(p) (flips locale id<->en)
 *     pairPath(p) does NOT contain "/en/en/" (never double-prefixes)
 *     pairPath(p) ∈ PAGES_BILINGUAL paths    (lands on a real page)
 *
 * The generator draws from two sources, per the task spec:
 *   1. the 16 canonical paths in PAGES_BILINGUAL (the primary, closed domain), and
 *   2. random canonical-shaped paths built from random slug strings
 *      (`/<slug>/` and `/en/<slug>/`) which exercise the structural invariants
 *      over the broader path space, plus fully arbitrary strings to assert the
 *      function is total (never throws).
 *
 * Uses Node's built-in test runner + fast-check, loading lang.js inside a jsdom
 * window via loadScriptModule so window.__lang.{pairPath,localeOf} is available.
 *
 * Validates: Requirements 1.3, 11.1 (Property 1 / PROP-1)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { loadScriptModule } from "./helpers.mjs";
import { PAGES_BILINGUAL } from "./fixtures/pages.mjs";

// Minimal page with a #navbar shell so lang.js's IIFE auto-inits without throwing.
const HTML =
  '<!DOCTYPE html><html><head></head><body>' +
  '<nav id="navbar"><div class="nav-right"></div></nav>' +
  "</body></html>";

const win = loadScriptModule("assets/js/lang.js", { html: HTML });
const { pairPath, localeOf } = win.__lang;

// The closed, finite set of canonical site paths (16 entries).
const CANONICAL_PATHS = PAGES_BILINGUAL.map((p) => p.path);
const CANONICAL_PATH_SET = new Set(CANONICAL_PATHS);

// Arbitrary that picks one of the 16 canonical paths.
const canonicalPathArbitrary = fc.constantFrom(...CANONICAL_PATHS);

// A slug-shaped string from a URL-safe alphabet, excluding the empty slug and
// the reserved "en" segment (which would alias the EN home `/en/`). These keep
// the generated `/<slug>/` form unambiguously ID and `/en/<slug>/` unambiguously
// EN, so the structural invariants (involution, locale flip, no double prefix)
// hold over this broader-but-still-canonical-shaped path space.
const slugArbitrary = fc
  .array(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-"), {
    minLength: 1,
    maxLength: 15,
  })
  .map((chars) => chars.join(""))
  .filter((s) => s !== "en");

// Random canonical-shaped paths in either locale, e.g. "/foo/" or "/en/foo/".
const canonicalShapedArbitrary = fc
  .tuple(slugArbitrary, fc.boolean())
  .map(([slug, isEn]) => (isEn ? `/en/${slug}/` : `/${slug}/`));

const RUNS = { numRuns: 200 };

test("PROP-1: pairPath is an involution over canonical paths (pairPath(pairPath(p)) === p)", () => {
  fc.assert(
    fc.property(canonicalPathArbitrary, (p) => {
      assert.equal(pairPath(pairPath(p)), p);
    }),
    RUNS,
  );
});

test("PROP-1: pairPath flips the locale of every canonical path", () => {
  fc.assert(
    fc.property(canonicalPathArbitrary, (p) => {
      assert.notEqual(localeOf(pairPath(p)), localeOf(p));
    }),
    RUNS,
  );
});

test("PROP-1: pairPath of a canonical path never contains '/en/en/'", () => {
  fc.assert(
    fc.property(canonicalPathArbitrary, (p) => {
      assert.ok(
        !pairPath(p).includes("/en/en/"),
        `pairPath(${JSON.stringify(p)}) = ${JSON.stringify(pairPath(p))} must not double-prefix`,
      );
    }),
    RUNS,
  );
});

test("PROP-1: pairPath of a canonical path lands on a path in PAGES_BILINGUAL", () => {
  fc.assert(
    fc.property(canonicalPathArbitrary, (p) => {
      const paired = pairPath(p);
      assert.ok(
        CANONICAL_PATH_SET.has(paired),
        `pairPath(${JSON.stringify(p)}) = ${JSON.stringify(paired)} must be in PAGES_BILINGUAL`,
      );
    }),
    RUNS,
  );
});

test("PROP-1: pairPath is involutive, locale-flipping, and never double-prefixes over random canonical-shaped paths", () => {
  fc.assert(
    fc.property(canonicalShapedArbitrary, (p) => {
      const paired = pairPath(p);
      assert.equal(pairPath(paired), p, "involution");
      assert.notEqual(localeOf(paired), localeOf(p), "locale flip");
      assert.ok(!paired.includes("/en/en/"), "no double /en/ prefix");
    }),
    RUNS,
  );
});

test("PROP-1: pairPath is total over arbitrary strings (returns a string, never throws)", () => {
  fc.assert(
    fc.property(fc.string(), (s) => {
      const out = pairPath(s);
      assert.equal(typeof out, "string");
      assert.ok(localeOf(s) === "id" || localeOf(s) === "en");
    }),
    RUNS,
  );
});

test("PROP-1: explicit canonical pairing table (deterministic cases)", () => {
  const cases = [
    ["/", "/en/"],
    ["/en/", "/"],
    ["/services/", "/en/services/"],
    ["/en/services/", "/services/"],
    ["/case-studies/", "/en/case-studies/"],
    ["/en/case-studies/", "/case-studies/"],
    ["/404.html", "/en/404.html"],
    ["/en/404.html", "/404.html"],
    // "/en" (no trailing slash) is treated as the EN home and pairs to "/".
    ["/en", "/"],
  ];
  for (const [input, expected] of cases) {
    assert.equal(
      pairPath(input),
      expected,
      `pairPath(${JSON.stringify(input)}) should be ${JSON.stringify(expected)}`,
    );
  }
});

test("PROP-1: localeOf classifies canonical paths by the /en/ prefix", () => {
  for (const { path, locale } of PAGES_BILINGUAL) {
    assert.equal(
      localeOf(path),
      locale,
      `localeOf(${JSON.stringify(path)}) should be ${JSON.stringify(locale)}`,
    );
  }
});
