/**
 * Enumerative correctness test over the two 404 pages (ID + EN).
 *
 * Property 22 — per-locale 404 page integrity (Requirements 6.3):
 *   Each 404 page has exactly one <meta name="robots" content="noindex"> and
 *   exactly one dedicated "back to home" CTA in its main/hero content pointing
 *   to the SAME-locale home (`/` for the ID 404, `/en/` for the EN 404).
 *
 * The 404 set is small and closed (404.html + en/404.html), so this is a
 * deterministic enumerative test driven by the PAGES_BILINGUAL fixture
 * (filtered to slug === "404") rather than randomised inputs.
 *
 * Note: every 404 page also links to home from the nav logo and the footer.
 * The property is about the dedicated hero CTA only, so the home-link
 * assertion is scoped to the <section class="hero"> content area, NOT the
 * nav or footer.
 *
 * Uses only Node's built-in test runner (`node:test` + `node:assert`) plus the
 * shared `loadDom` helper (jsdom) and the canonical PAGES_BILINGUAL fixture.
 * Run with: `node --test tests/pages.404.test.mjs` (needs jsdom).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { PAGES_BILINGUAL } from "./fixtures/pages.mjs";

/** The two 404 entries: ID (404.html) and EN (en/404.html). */
const PAGES_404 = PAGES_BILINGUAL.filter((p) => p.slug === "404");

/** Same-locale home path each 404's hero CTA must point at. */
function homePathFor(locale) {
  return locale === "en" ? "/en/" : "/";
}

// Guard: the fixture must yield exactly the two expected 404 pages.
test("Property 22: fixture exposes exactly the two 404 pages (id + en)", () => {
  assert.equal(PAGES_404.length, 2, "expected exactly two 404 pages");
  assert.deepEqual(
    PAGES_404.map((p) => p.locale).sort(),
    ["en", "id"],
    "the two 404 pages must be one per locale",
  );
  assert.deepEqual(
    PAGES_404.map((p) => p.file).sort(),
    ["404.html", "en/404.html"],
    "the two 404 files must be 404.html and en/404.html",
  );
});

for (const p of PAGES_404) {
  test(`Property 22: ${p.file} (${p.locale}) has one noindex robots meta + one same-locale home CTA`, () => {
    const doc = loadDom(p.file);

    // --- <html lang> matches the page locale. ---
    assert.equal(
      (doc.documentElement.getAttribute("lang") || "").trim(),
      p.locale,
      `${p.file}: <html lang> must equal "${p.locale}"`,
    );

    // --- Exactly one <meta name="robots" content="noindex">. ---
    const robots = doc.querySelectorAll(
      'meta[name="robots"][content="noindex"]',
    );
    assert.equal(
      robots.length,
      1,
      `${p.file}: expected exactly one <meta name="robots" content="noindex">, got ${robots.length}`,
    );

    // --- Exactly one dedicated home CTA in the hero content area. ---
    const hero = doc.querySelector("section.hero");
    assert.ok(hero, `${p.file}: missing <section class="hero"> content area`);

    const home = homePathFor(p.locale);
    // Scope strictly to the hero (excludes nav logo + footer home links).
    // The dedicated CTA is the hero's .btn anchor; match on the raw href
    // attribute so it is exactly the same-locale home ("/" or "/en/").
    const heroHomeCtas = Array.from(hero.querySelectorAll("a.btn")).filter(
      (a) => a.getAttribute("href") === home,
    );

    assert.equal(
      heroHomeCtas.length,
      1,
      `${p.file}: expected exactly one hero home CTA with href="${home}", got ${heroHomeCtas.length}`,
    );

    // Defensive: more broadly, the hero must not contain a second anchor
    // pointing at the same-locale home outside the single CTA.
    const heroHomeLinks = Array.from(hero.querySelectorAll("a")).filter(
      (a) => a.getAttribute("href") === home,
    );
    assert.equal(
      heroHomeLinks.length,
      1,
      `${p.file}: hero must contain exactly one same-locale home link (href="${home}"), got ${heroHomeLinks.length}`,
    );
  });
}
