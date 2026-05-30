/**
 * Enumerative correctness tests over the finite bilingual page set for the
 * Pemilih_Bahasa (language switcher) shell component.
 *
 * Property 2 — PROP-2: Pemilih_Bahasa menaut ke Pasangan_Halaman
 *   For any page X in PAGES_BILINGUAL, the switcher option for the opposite
 *   locale has an `href` equal to `pairPath(X.path)`, and the option for the
 *   page's own locale points to `X.path`. Equivalently, the `data-lang="id"`
 *   option always points at the ID path of the pair and the `data-lang="en"`
 *   option always points at the EN path of the pair.
 *
 * Property 6 — PROP-6: indikator bahasa aktif = locale halaman
 *   For any page in PAGES_BILINGUAL, the switcher marks exactly one option as
 *   active (`aria-current`), and that option's `data-lang` equals the page
 *   locale; the other option is not marked active.
 *
 * The bilingual page set is small and closed (16 entries: 7 content slugs +
 * 404, each in {id, en}), so these are deterministic enumerative tests that
 * assert the universal property by iterating every page. Each page gets its
 * own sub-test so failures point at the exact offending file.
 *
 * Uses only Node's built-in test runner (`node:test` + `node:assert`) plus the
 * shared `loadDom` helper (jsdom) and the canonical `PAGES_BILINGUAL` fixture.
 * Run with: `node --test tests/pages.langswitcher.test.mjs` (needs jsdom).
 *
 * Validates: Requirements 2.2, 2.3, 2.4, 11.2, 11.6
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { PAGES_BILINGUAL } from "./fixtures/pages.mjs";

/**
 * Locate the single language switcher on a page and return its `.lang-option`
 * anchors keyed by `data-lang`. Asserts there is exactly one switcher and
 * exactly one option per locale.
 * @param {Document} doc
 * @param {string} file - page file path (for failure messages)
 * @returns {{ id: Element, en: Element, options: Element[] }}
 */
function getSwitcherOptions(doc, file) {
  const switchers = doc.querySelectorAll(".lang-switcher");
  assert.equal(
    switchers.length,
    1,
    `${file}: must contain exactly one .lang-switcher, found ${switchers.length}`,
  );

  const options = Array.from(switchers[0].querySelectorAll(".lang-option"));
  assert.equal(
    options.length,
    2,
    `${file}: .lang-switcher must contain exactly two .lang-option anchors, found ${options.length}`,
  );

  const byLang = {};
  for (const opt of options) {
    const lang = opt.getAttribute("data-lang");
    assert.ok(
      lang === "id" || lang === "en",
      `${file}: .lang-option has unexpected data-lang="${lang}"`,
    );
    assert.ok(!(lang in byLang), `${file}: duplicate .lang-option data-lang="${lang}"`);
    byLang[lang] = opt;
  }

  assert.ok(byLang.id, `${file}: missing .lang-option[data-lang="id"]`);
  assert.ok(byLang.en, `${file}: missing .lang-option[data-lang="en"]`);

  return { id: byLang.id, en: byLang.en, options };
}

for (const page of PAGES_BILINGUAL) {
  // The ID path and EN path of this page's pair, derived from the fixture.
  // For an ID page: own path is the ID path, pairPath is the EN path.
  // For an EN page: own path is the EN path, pairPath is the ID path.
  const idPath = page.locale === "id" ? page.path : page.pairPath;
  const enPath = page.locale === "en" ? page.path : page.pairPath;

  // ---------------------------------------------------------------------
  // Property 2: switcher options link to the correct pair members.
  // ---------------------------------------------------------------------
  test(`PROP-2: ${page.file} switcher options link to the page pair`, () => {
    const doc = loadDom(page.file);
    const { id, en } = getSwitcherOptions(doc, page.file);

    const idHref = (id.getAttribute("href") || "").trim();
    const enHref = (en.getAttribute("href") || "").trim();

    // The id option always points at the ID member of the pair...
    assert.equal(
      idHref,
      idPath,
      `${page.file}: data-lang="id" option href must be "${idPath}", got "${idHref}"`,
    );
    // ...and the en option always points at the EN member of the pair.
    assert.equal(
      enHref,
      enPath,
      `${page.file}: data-lang="en" option href must be "${enPath}", got "${enHref}"`,
    );

    // Restated against the spec's exact wording: the self-locale option
    // points to X.path and the opposite-locale option points to pairPath(X).
    const selfHref = page.locale === "id" ? idHref : enHref;
    const otherHref = page.locale === "id" ? enHref : idHref;
    assert.equal(
      selfHref,
      page.path,
      `${page.file}: self-locale (${page.locale}) option must point to X.path "${page.path}", got "${selfHref}"`,
    );
    assert.equal(
      otherHref,
      page.pairPath,
      `${page.file}: opposite-locale option must point to pairPath "${page.pairPath}", got "${otherHref}"`,
    );
  });

  // ---------------------------------------------------------------------
  // Property 6: exactly one active indicator, equal to the page locale.
  // ---------------------------------------------------------------------
  test(`PROP-6: ${page.file} marks exactly one active option = page locale`, () => {
    const doc = loadDom(page.file);
    const { id, en, options } = getSwitcherOptions(doc, page.file);

    const active = options.filter((opt) => opt.hasAttribute("aria-current"));
    assert.equal(
      active.length,
      1,
      `${page.file}: exactly one .lang-option must carry aria-current, found ${active.length}`,
    );

    assert.equal(
      active[0].getAttribute("data-lang"),
      page.locale,
      `${page.file}: the active option's data-lang must equal page locale "${page.locale}", got "${active[0].getAttribute("data-lang")}"`,
    );

    // The active aria-current value is the truthy "true" used in the markup.
    assert.equal(
      active[0].getAttribute("aria-current"),
      "true",
      `${page.file}: active option aria-current must be "true", got "${active[0].getAttribute("aria-current")}"`,
    );

    // The opposite-locale option must NOT be marked active.
    const inactive = page.locale === "id" ? en : id;
    assert.ok(
      !inactive.hasAttribute("aria-current"),
      `${page.file}: the non-active (${inactive.getAttribute("data-lang")}) option must not carry aria-current`,
    );
  });
}
