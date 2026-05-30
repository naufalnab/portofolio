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
    1,
    `${file}: .lang-switcher must contain exactly one .lang-option anchor, found ${options.length}`,
  );

  const opt = options[0];
  const lang = opt.getAttribute("data-lang");
  assert.ok(
    lang === "id" || lang === "en",
    `${file}: .lang-option has unexpected data-lang="${lang}"`,
  );

  return { opt, lang, options };
}

for (const page of PAGES_BILINGUAL) {
  // The pairPath of this page's pair, derived from the fixture.
  const targetPath = page.pairPath;
  const targetLocale = page.locale === "id" ? "en" : "id";

  // ---------------------------------------------------------------------
  // Property 2: switcher options link to the correct pair members.
  // ---------------------------------------------------------------------
  test(`PROP-2: ${page.file} switcher option links to the page pair`, () => {
    const doc = loadDom(page.file);
    const { opt, lang } = getSwitcherOptions(doc, page.file);

    const href = (opt.getAttribute("href") || "").trim();

    assert.equal(
      lang,
      targetLocale,
      `${page.file}: target data-lang must be "${targetLocale}", got "${lang}"`,
    );

    assert.equal(
      href,
      targetPath,
      `${page.file}: option href must be "${targetPath}", got "${href}"`,
    );
  });
}
