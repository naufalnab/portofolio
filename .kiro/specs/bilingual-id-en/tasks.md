# Implementation Plan: Bilingual ID/EN

## Overview

This plan turns the bilingual design into incremental coding steps that keep the site
100% static (HTML + modular CSS + vanilla JS, no bundler/SSR). It follows the design's
10-step Migration Strategy: build the test fixtures and pure language module first
(TDD over `pairPath`/`localeOf`/`detectFromNavigator`/`resolveLocale`/`decideRedirect`),
add the language switcher to the ID shell, carve out the EN shell partials, create the
7 EN pages under `en/`, translate the 7 root ID pages, add per-locale 404s, make
`build-pages.mjs` language-aware, regenerate the bilingual `sitemap.xml`, localize the
`Service` JSON-LD on the four service pages, and finish with the full enumerative /
property-based test harness over `PAGES_BILINGUAL` (16 pages).

Write conflicts are avoided by ordering: fixtures + `lang.js` first, then the ID shell,
then EN partials, then EN pages (new files under `en/` — parallel between pages), then
ID page translations (existing files — parallel between pages), then `build-pages.mjs`,
JSON-LD, sitemap, and finally the page-level tests. The Task Dependency Graph at the end
encodes the parallel-safe execution waves.

Language used for all code: **vanilla JavaScript (ES modules for tests, browser JS for
site)** — Node built-in test runner + `fast-check` + `jsdom` for tests, exactly as in the
existing `multi-page-restructure` harness. The design uses concrete JS (not pseudocode),
so no implementation-language selection is required.

## Tasks

- [x] 1. Test fixtures and the pure language module (foundation, TDD)
  - [x] 1.1 Extend `tests/fixtures/pages.mjs` into bilingual fixtures
    - Add `ORIGIN = "https://naufalnabila.my.id"` and `CONTENT_SLUGS` (`""`, `services`, `case-studies`, `founded`, `layanan-website`, `layanan-video-ai`, `packages`)
    - Programmatically generate `PAGES_BILINGUAL` (16 entries: 7 content × {id,en} + 404 × {id,en}) with `{ slug, locale, path, pairPath, file, indexable }`, ID at root (`/`, `services/index.html`, …) and EN under `en/` (`/en/`, `en/services/index.html`, …)
    - Derive `CONTENT_PAGES_BILINGUAL` (14 indexable), `PAGE_PAIRS` (`{ id, en }` grouped by slug), and `navItemsFor(locale)` (EN hrefs = ID hrefs prefixed `/en`, labels localized) so fixtures can never drift from the slug list
    - Keep the existing `PAGES`/`CONTENT_PAGES`/`NAV_ITEMS` exports intact for backward compatibility
    - _Requirements: 1.1, 1.2, 1.4, 9.1, 9.6_

  - [x] 1.2 Create `assets/js/lang.js` pure functions + `window.__lang`
    - Implement `pairPath(path)` (add/strip `/en` prefix; involutive; never `/en/en/`), `localeOf(path)`, `detectFromNavigator(language)` (case-insensitive `^en` ⇒ `en`, else `id`), `resolveLocale(explicit, storedRaw, navLang)` (precedence explicit > valid-stored > navigator > id), `decideRedirect(enabled, storedRaw, currentPath, explicitOnThisNav, navLang)` (gated, anti-loop, never returns `currentPath`), `readStoredLang()` (validates to `"id"`/`"en"`, else `null`; try/catch), `storeLang(locale)` (try/catch)
    - Expose `window.__lang = { pairPath, localeOf, detectFromNavigator, resolveLocale, decideRedirect, readStoredLang, storeLang }` (mirrors the `window.__nav` pattern)
    - _Requirements: 1.3, 2.3, 3.1, 3.2, 3.4, 3.5, 3.6_

  - [x]\* 1.3 Write property test for `pairPath`/`localeOf`
    - **Property 1 (PROP-1): pairPath is an involutive bijection that flips locale, never produces `/en/en/`, and lands on a path in `PAGES_BILINGUAL`**
    - File: `tests/lang.pairPath.test.mjs`; generator: canonical paths from `PAGES_BILINGUAL` + random strings; ≥100 runs
    - **Validates: Requirements 1.3, 11.1**

  - [x]\* 1.4 Write property test for language persistence
    - **Property 8 (PROP-8): `storeLang(L)` then `readStoredLang()` returns `L` for `L ∈ {id,en}`; any non-`id`/`en` stored value reads back as `null`**
    - File: `tests/lang.storage.test.mjs` (jsdom for `localStorage`); ≥100 runs
    - **Validates: Requirements 3.1, 3.2, 11.8**

  - [x]\* 1.5 Write property test for `decideRedirect`
    - **Property 9 (PROP-9): `decideRedirect` is gated, anti-loop, and idempotent — returns `null` when disabled / explicit-this-nav / target locale equals current; when non-null, equals `pairPath(currentPath)` and never equals `currentPath`**
    - File: `tests/lang.detect.test.mjs`; generator: `(enabled, storedRaw, currentPath, explicitOnThisNav, navLang)`; ≥100 runs
    - **Validates: Requirements 3.3, 3.5, 11.9**

  - [x]\* 1.6 Write property test for precedence + navigator detection
    - **Property 10 (PROP-9 support): `resolveLocale` follows precedence explicit > valid-stored > navigator > id, ignoring invalid stored values; `detectFromNavigator` returns `en` iff the string starts with `en` case-insensitively, else `id` (incl. empty/null)**
    - File: `tests/lang.detect.test.mjs` (same file as 1.5, separate test case); generator: `(storedRaw, navLang)`; ≥100 runs
    - **Validates: Requirements 3.2, 3.4, 3.7**

- [x] 2. Language switcher in the ID shell (markup, styling, behavior)
  - [x] 2.1 Add `Pemilih_Bahasa` markup to `partials/_header.html`
    - Insert `.lang-switcher` (`role="group"`, non-empty `aria-label`) inside `.nav-right`, immediately before the theme toggle button, with two `<a class="lang-option" data-lang hreflang>` anchors (ID, EN) as raw `<a href>` (works without JS)
    - On the ID shell mark the `id` option `aria-current="true"`; ID option `href` = self path, EN option `href` = `pairPath(self)` (placeholders filled per-page by the build tool / page authoring)
    - Make each option keyboard-focusable and Enter-activatable
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 2.2 Add `.lang-switcher` styles to `assets/css/layout.css`
    - Style `.lang-switcher` and `.lang-option` (active indicator via `[aria-current="true"]`), plus the `<900px` rule so the switcher renders and is focusable inside the hamburger panel without breaking the theme toggle
    - _Requirements: 2.6_

  - [x] 2.3 Implement `initLangSwitcher(navRoot)` in `assets/js/lang.js`
    - On click of a `.lang-option`, persist `localStorage 'lang'` = `data-lang` and set the explicit-nav marker before navigation, without calling `preventDefault` (the `<a href>` navigates normally); wrap storage in try/catch; guard against double-binding via `dataset.bound`
    - Auto-init against `#navbar` on load and append `initLangSwitcher` to `window.__lang`
    - _Requirements: 3.1, 3.6, 2.5_

- [x] 3. Checkpoint - pure-function tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Create EN shell partials
  - [x] 4.1 Create `partials/_header.en.html`
    - Duplicate `partials/_header.html` structure (identical classes/ids/order), prefix every internal href with `/en`, translate nav/dropdown/CTA labels to English, and set the switcher's active indicator to `en` (`en` option `aria-current="true"`)
    - _Requirements: 6.2, 7.2, 7.3_

  - [x] 4.2 Create `partials/_footer.en.html`
    - Duplicate `partials/_footer.html` structure, prefix internal hrefs with `/en`, and translate footer column titles, link labels, copyright, and meta text to English (keep external links and brand/product terms unchanged)
    - _Requirements: 6.2, 7.2, 7.3_

- [x] 5. Create the 7 EN content pages under `en/` (from existing English copy)
  - [x] 5.1 Create `en/index.html` (Home, `/en/`)
    - Build the bilingual `<head>` (`<html lang="en">`, canonical = self EN, hreflang id/en/x-default self-referencing absolute https, `og:locale en_US` + `og:locale:alternate id_ID`, `og:url`=canonical, EN title 10–70 / description 50–160), embed the EN shell (header/footer from EN partials) with the switcher hrefs filled (`id`→`/`, `en`→`/en/`), the gated `Skrip_Deteksi_Bahasa` inline at the top of `<head>` before theme-init, root-relative assets incl. `lang.js` (defer), and keep the existing English Home content
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 7.3, 7.4, 10.1, 10.5_

  - [x] 5.2 Create `en/services/index.html` (`/en/services/`)
    - Same bilingual `<head>` + EN shell + switcher (`id`→`/services/`, `en`→`/en/services/`) + `lang.js`; keep existing English Services content
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 7.3, 10.5_

  - [x] 5.3 Create `en/case-studies/index.html` (`/en/case-studies/`)
    - Bilingual `<head>` + EN shell + switcher + `lang.js`; include `toggles` JS; keep existing English Case Studies content
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 7.3, 10.5, 10.6_

  - [x] 5.4 Create `en/founded/index.html` (`/en/founded/`)
    - Bilingual `<head>` + EN shell + switcher + `lang.js`; include `toggles` JS; keep existing English Founded content
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 7.3, 10.5, 10.6_

  - [x] 5.5 Create `en/layanan-website/index.html` (`/en/layanan-website/`)
    - Bilingual `<head>` + EN shell + switcher + `lang.js`; include `services-commercial` CSS + `services` JS; translate the currently-Indonesian Layanan Website copy (tiers, process, showcase, FAQ) to English, keeping prices/currency symbols and numeric values unchanged
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.5, 7.3, 10.5, 10.6_

  - [x] 5.6 Create `en/layanan-video-ai/index.html` (`/en/layanan-video-ai/`)
    - Bilingual `<head>` + EN shell + switcher + `lang.js`; include `services-commercial` CSS + `services` JS; translate the currently-Indonesian Layanan Video AI copy to English, keeping prices/currency/numeric values unchanged
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.5, 7.3, 10.5, 10.6_

  - [x] 5.7 Create `en/packages/index.html` (`/en/packages/`)
    - Bilingual `<head>` + EN shell + switcher + `lang.js`; keep existing English Packages/Contact content
    - _Requirements: 1.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 7.3, 10.5_

- [x] 6. Translate the 7 root ID pages and update their `<head>` SEO
  - [x] 6.1 Update `index.html` (Home, `/`)
    - Translate all user-visible English copy (text nodes + `alt`/`aria-label`/`title`/`placeholder`) to Indonesian; update `<head>`: keep `<html lang="id">`, add hreflang id/en/x-default (identical set to the EN pair), set canonical = self ID, `og:locale id_ID` + `og:locale:alternate en_US`, `og:url`=canonical; insert the gated lang-detection inline script before theme-init; embed the ID shell with switcher (`id`→`/`, `en`→`/en/`) and `lang.js`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 7.3, 10.1, 10.5_

  - [x] 6.2 Update `services/index.html` (`/services/`)
    - Translate visible copy to Indonesian; update `<head>` (hreflang/canonical self/og per locale); embed ID shell + switcher + `lang.js`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 7.3, 10.5_

  - [x] 6.3 Update `case-studies/index.html` (`/case-studies/`)
    - Translate visible copy to Indonesian; update `<head>`; embed ID shell + switcher + `lang.js`; keep `toggles` JS
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 7.3, 10.5, 10.6_

  - [x] 6.4 Update `founded/index.html` (`/founded/`)
    - Translate visible copy to Indonesian; update `<head>`; embed ID shell + switcher + `lang.js`; keep `toggles` JS
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 7.3, 10.5, 10.6_

  - [x] 6.5 Update `packages/index.html` (`/packages/`)
    - Translate visible copy to Indonesian; update `<head>`; embed ID shell + switcher + `lang.js`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 7.3, 10.5_

  - [x] 6.6 Update `layanan-website/index.html` (`/layanan-website/`)
    - Content already Indonesian — update `<head>` only (hreflang id/en/x-default, canonical self ID, og per locale); embed ID shell + switcher (`en`→`/en/layanan-website/`) + `lang.js`; include `services-commercial` CSS + `services` JS
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.5, 7.3, 10.5, 10.6_

  - [x] 6.7 Update `layanan-video-ai/index.html` (`/layanan-video-ai/`)
    - Content already Indonesian — update `<head>` only; embed ID shell + switcher (`en`→`/en/layanan-video-ai/`) + `lang.js`; include `services-commercial` CSS + `services` JS
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.5, 7.3, 10.5, 10.6_

- [x] 7. Per-locale 404 pages
  - [x] 7.1 Update `404.html` (ID)
    - Ensure exactly one `<meta name="robots" content="noindex">`, all text in Indonesian, ID shell, and exactly one "kembali ke beranda" link pointing to `/`
    - _Requirements: 6.3, 7.1_

  - [x] 7.2 Create `en/404.html` (EN)
    - English 404 with exactly one `<meta name="robots" content="noindex">`, EN shell, and exactly one "back to home" link pointing to `/en/`
    - _Requirements: 1.7, 6.3, 7.1_

- [x] 8. Make `build-pages.mjs` language-aware
  - [x] 8.1 Extend `tools/build-pages.mjs` to assemble 16 pages per locale
    - Replace the internal `PAGES` with the 16-entry bilingual set carrying `locale`; read all four partials (`_header.html`/`_footer.html` for ID, `_header.en.html`/`_footer.en.html` for EN); select the partial set per `locale`; add `fillLangSwitcherHrefs(header, self, pairPath(self), locale)` so each page gets its own switcher hrefs + active indicator; keep the existing safety checks (no `{{`, exactly one nav + one footer) and run `--check` then apply; verify deterministic/idempotent (second run reports 0 changed)
    - _Requirements: 7.5_

- [x] 9. Bilingual sitemap and robots
  - [x] 9.1 Regenerate `sitemap.xml`
    - Emit exactly the 14 content `<loc>` entries (7 ID + 7 EN), no 404s, each absolute https in canonical trailing-slash form equal to the page canonical; declare both the sitemap `0.9` and `xhtml` namespaces on `<urlset>`; under every `<url>` add exactly three `<xhtml:link rel="alternate" hreflang>` (id/en/x-default) with hrefs identical between paired pages
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [x] 9.2 Keep `robots.txt` bilingual-safe
    - Verify no `Disallow` blocks any content URL (including `/en/...`) and that exactly one `Sitemap: https://naufalnabila.my.id/sitemap.xml` directive is present
    - _Requirements: 5.3_

  - [x]\* 9.3 Add optional `tools/build-sitemap.mjs` generator
    - Generate `sitemap.xml` deterministically from `PAGES_BILINGUAL` (14 content URLs + xhtml alternates) to avoid manual drift; zero npm deps; dev-only tooling
    - _Requirements: 5.1, 5.2_

- [x] 10. Localize `Service` JSON-LD on the four service pages
  - [x] 10.1 Localize JSON-LD on Layanan Website (ID + EN)
    - Embed exactly one `Service` block in `layanan-website/index.html` and `en/layanan-website/index.html` directly in raw HTML; localize `serviceType`/`name`/`description` per locale; set `inLanguage` = `"id"`/`"en"` matching `<html lang>`; keep `OfferCatalog` `price`/`priceCurrency` numeric values identical between the pair; ensure each block `JSON.parse`s to a non-null object
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 10.2 Localize JSON-LD on Layanan Video AI (ID + EN)
    - Embed exactly one `Service` block in `layanan-video-ai/index.html` and `en/layanan-video-ai/index.html`; localize text per locale; set `inLanguage` per locale; keep `price`/`priceCurrency` identical between the pair; valid JSON
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 11. Checkpoint - shell and all 16 pages assembled
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Full validation: bilingual enumerative & property tests over `PAGES_BILINGUAL`
  - [x]\* 12.1 Write language-switcher tests
    - **Property 2 (PROP-2): the opposite-locale option's href equals `pairPath(X.path)` and the self-locale option points to `X.path`** and **Property 6 (PROP-6): exactly one active indicator (`aria-current`) equals the page locale**
    - File: `tests/pages.langswitcher.test.mjs`; domain: `PAGES_BILINGUAL`
    - **Validates: Requirements 2.2, 2.3, 2.4, 11.2, 11.6**

  - [x]\* 12.2 Write bilingual SEO tests
    - **Property 3 (PROP-3): exactly one lowercase `<html lang>` = page locale**, **Property 4 (PROP-4): exactly three self-referencing absolute-https hreflang (id/en/x-default) resolving into `PAGES_BILINGUAL`**, **Property 5 (PROP-5): canonical = `ORIGIN + path`, equal to the page's own hreflang**, and **Property 17: title 10–70 / description 50–160, non-empty + unique per locale; `og:locale`/`og:locale:alternate`/`og:url`=canonical; `og:title`/`og:description` non-empty**
    - File: `tests/pages.bilingual-seo.test.mjs`; domain: `PAGES_BILINGUAL` / `CONTENT_PAGES_BILINGUAL`
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 11.3, 11.4, 11.5**

  - [x]\* 12.3 Write intra-locale internal-link test
    - **Property 7 (PROP-7): every internal `<a href>` except the switcher is intra-locale, resolves into `PAGES_BILINGUAL`, and never contains `/en/en/`**
    - File: `tests/pages.bilingual-links.test.mjs`; domain: `PAGES_BILINGUAL` × anchors
    - **Validates: Requirements 1.6, 7.3, 7.6, 11.7**

  - [x]\* 12.4 Write bilingual sitemap test
    - **Property 11 (PROP-10): `<loc>` set equals the 14 content URLs (no dupes, no 404), each equal to the page canonical; each `<url>` has exactly three `xhtml:link` (id/en/x-default) identical between paired pages; document is well-formed with both namespaces**
    - File: `tests/sitemap.bilingual.test.mjs`; parse `sitemap.xml` vs `PAGES_BILINGUAL`
    - **Validates: Requirements 5.1, 5.2, 5.4, 5.5, 11.10**

  - [x]\* 12.5 Write JSON-LD `Service` test
    - **Property 12 (PROP-11): exactly one `Service` block on each of the four service pages and zero elsewhere; every JSON-LD block `JSON.parse`s to a non-null object; `Service.inLanguage` equals the page locale and `<html lang>`**
    - File: `tests/pages.bilingual-jsonld.test.mjs`; domain: `PAGES_BILINGUAL`
    - **Validates: Requirements 8.1, 8.3, 8.4, 11.11**

  - [x]\* 12.6 Write per-locale active-nav property test
    - **Property 13 (PROP-12): after `setActiveNav` on the matching locale shell, exactly one top-level `aria-current="page"` for content pages and zero for 404; the active anchor's `normalizePath(href)` equals `normalizePath(path)`**
    - File: `tests/nav.setActiveNav.bilingual.test.mjs`; generator: random valid + foreign paths per shell; ≥100 runs
    - **Validates: Requirements 10.2, 11.12**

  - [x]\* 12.7 Write fixture-structure tests
    - **Property 14: `PAGES_BILINGUAL` has exactly 16 entries (14 indexable + 2 404), each maps to exactly one existing file with a canonical path mirroring the URL scheme** and **Property 15: exactly one `<nav id="navbar">` and one `<footer>` per page**
    - File: `tests/pages.bilingual-structure.test.mjs`; domain: `PAGES_BILINGUAL`
    - **Validates: Requirements 1.1, 1.2, 1.4, 7.1, 9.1, 9.6**

  - [x]\* 12.8 Write per-locale shell-consistency test
    - **Property 16: nav and footer are byte-identical between any two pages of the same locale after normalization (neutralize `aria-current`, `active` class, `.lang-option` hrefs, per-line indentation)**
    - File: `tests/pages.bilingual-shell.test.mjs`; per-locale comparison
    - **Validates: Requirements 7.2**

  - [x]\* 12.9 Write raw-HTML presence test
    - **Property 18: nav/footer anchors, switcher, and service-page JSON-LD are present in raw static HTML (no JS); main landmarks (`<h1>`, nav, footer) non-empty; inline theme-init precedes the first `<link rel="stylesheet">`**
    - File: `tests/pages.bilingual-raw.test.mjs`; raw `readPage`
    - **Validates: Requirements 7.4, 8.6, 9.4, 10.1**

  - [x]\* 12.10 Write price-parity test
    - **Property 19: for each service `PAGE_PAIRS`, the multiset of price tokens (currency symbol + numeric value) in page text is identical between ID and EN, and `OfferCatalog` `price`/`priceCurrency` are identical between the pair**
    - File: `tests/pages.price-parity.test.mjs`; domain: service `PAGE_PAIRS`
    - **Validates: Requirements 6.5, 8.5**

  - [x]\* 12.11 Extend asset-path test for bilingual pages
    - **Property 20: every CSS/JS/image reference uses a root-relative path starting `/assets/`, resolving identically from any folder depth including `/en/`**
    - File: `tests/pages.assets.test.mjs` (extend to iterate `PAGES_BILINGUAL`)
    - **Validates: Requirements 10.5**

  - [x]\* 12.12 Write per-locale hamburger property test
    - **Property 21: for either shell and any random sequence of {toggle, nav-link click, Escape, resize}, `initMobileNav` starts closed, toggle flips, link/Escape/resize≥900px always closes, and double-init adds no duplicate listeners**
    - File: `tests/nav.initMobileNav.bilingual.test.mjs`; generator: random action sequences × shell id/en; ≥100 runs
    - **Validates: Requirements 10.3**

  - [x]\* 12.13 Write per-locale 404 test
    - **Property 22: each 404 page has exactly one `<meta name="robots" content="noindex">` and exactly one home link to the same-locale home (`/` for ID, `/en/` for EN)**
    - File: `tests/pages.404.test.mjs`; domain: the two 404 pages
    - **Validates: Requirements 6.3**

- [x] 13. Final checkpoint - full suite green
  - Run `node --test tests/`; ensure all property and enumerative tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional (tests + optional tooling) and can be skipped for a faster MVP, but the property tests are how the bilingual invariants (routing, SEO, switcher, JSON-LD, sitemap) are enforced — running them is strongly recommended.
- Each task references specific requirement sub-clauses for traceability; each test task references its design property number (Property N / PROP-N) and the requirement clause it validates.
- Pure-function property tests (Properties 1, 8, 9, 10) run first (TDD); page-level enumerative tests (Properties 2–7, 11–22) run at the end once all 16 pages, the sitemap, and the JSON-LD exist.
- The deployed artifacts stay pure static HTML/CSS/JS; `build-pages.mjs`/`build-sitemap.mjs` and the `tests/` harness are dev-only and never shipped.
- `nav.js`, `theme.js`, `reveal.js`, `toggles.js`, `services.js` are unchanged and shared by both locales; `lang.js` is the only new core script.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "2.1", "2.2", "9.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.5", "2.3", "4.1", "4.2", "9.1"] },
    {
      "id": 2,
      "tasks": [
        "1.6",
        "5.1",
        "5.2",
        "5.3",
        "5.4",
        "5.5",
        "5.6",
        "5.7",
        "6.1",
        "6.2",
        "6.3",
        "6.4",
        "6.5",
        "6.6",
        "6.7",
        "7.1",
        "7.2"
      ]
    },
    { "id": 3, "tasks": ["8.1", "9.3"] },
    { "id": 4, "tasks": ["10.1", "10.2"] },
    {
      "id": 5,
      "tasks": [
        "12.1",
        "12.2",
        "12.3",
        "12.4",
        "12.5",
        "12.6",
        "12.7",
        "12.8",
        "12.9",
        "12.10",
        "12.11",
        "12.12",
        "12.13"
      ]
    }
  ]
}
```
