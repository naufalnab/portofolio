/**
 * Property 8 (PROP-8) — language persistence round-trip + validation.
 *
 * Two halves of the same invariant over localStorage 'lang':
 *   (a) storeLang(L) then readStoredLang() === L  for every L in {"id","en"}
 *   (b) ANY stored value that is not exactly "id"/"en" (empty, corrupt,
 *       unknown, or simply absent) reads back as null.
 *
 * These exercise the real localStorage-backed helpers in assets/js/lang.js
 * (no mocks) via the loadScriptModule helper, which evaluates the module
 * inside a fresh jsdom window so `localStorage` resolves to jsdom's. These
 * are dev-only deps and never shipped with the static site.
 *
 * Validates: Requirements 3.1, 3.2, 11.8 (Property 8 / PROP-8)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import { loadScriptModule } from "./helpers.mjs";

/**
 * Load lang.js once into a jsdom window and return the window plus its
 * exposed pure-helper surface. The localStorage-backed helpers read/write the
 * SAME window.localStorage, so we clear it between cases to keep runs isolated.
 * @returns {{ window: Window, lang: { storeLang: Function, readStoredLang: Function } }}
 */
function loadLang() {
  const window = loadScriptModule("assets/js/lang.js");
  return { window, lang: window.__lang };
}

test("Property 8a: storeLang(L) then readStoredLang() round-trips for L in {id,en}", () => {
  const { window, lang } = loadLang();

  fc.assert(
    fc.property(fc.constantFrom("id", "en"), (locale) => {
      window.localStorage.clear();

      lang.storeLang(locale);

      // The persisted value must validate and read back exactly as written.
      assert.equal(window.localStorage.getItem("lang"), locale);
      assert.equal(lang.readStoredLang(), locale);
    }),
    { numRuns: 100 }
  );
});

test("Property 8b: any non-id/en stored value reads back as null", () => {
  const { window, lang } = loadLang();

  // Generate arbitrary strings that are NOT the two valid locales. Mix in a
  // few near-miss / known-bad literals so the corpus covers empty, casing,
  // whitespace, and lookalike values alongside fully random strings.
  const invalidStored = fc
    .oneof(
      fc.string(),
      fc.constantFrom("", " ", "ID", "EN", "Id", "eng", "id ", "en\n", "fr", "id,en", "null", "undefined")
    )
    .filter((s) => s !== "id" && s !== "en");

  fc.assert(
    fc.property(invalidStored, (raw) => {
      window.localStorage.clear();

      // Seed the raw (invalid) value directly, bypassing storeLang's guard, to
      // simulate a corrupt/foreign value already present in localStorage.
      window.localStorage.setItem("lang", raw);

      assert.equal(lang.readStoredLang(), null);
    }),
    { numRuns: 100 }
  );
});

test("Property 8b: absent stored value reads back as null", () => {
  const { window, lang } = loadLang();
  window.localStorage.clear();

  // No 'lang' key at all -> null (not "" or undefined).
  assert.equal(lang.readStoredLang(), null);
});

test("storeLang/readStoredLang: deterministic id<->en examples", () => {
  const { window, lang } = loadLang();

  window.localStorage.clear();
  lang.storeLang("id");
  assert.equal(lang.readStoredLang(), "id");

  lang.storeLang("en");
  assert.equal(lang.readStoredLang(), "en");

  // storeLang ignores invalid input (no write), so the last valid value stands.
  lang.storeLang("fr");
  assert.equal(lang.readStoredLang(), "en");
});
