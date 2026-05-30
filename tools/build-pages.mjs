/**
 * tools/build-pages.mjs — OPTIONAL shared-shell sync tool (zero npm deps)
 * =========================================================================
 *
 * WHAT THIS IS
 *   An optional, local-only helper that keeps the shared header (nav) and
 *   footer DRY across every page, in BOTH locales (ID at root, EN under /en/).
 *   The site is — and stays — 100% static: running this script is opt-in, and
 *   the deployed artifacts remain pure static HTML/CSS/JS. Nothing here adds a
 *   runtime dependency to the site.
 *
 * HOW TO RUN
 *   From the project root:
 *
 *       node tools/build-pages.mjs            # sync nav + footer into pages
 *       node tools/build-pages.mjs --check    # dry run: report, write nothing
 *
 * WHAT IT DOES (LANGUAGE-AWARE)
 *   There are two sources of truth for the shared shell, one per locale:
 *     - ID: partials/_header.html      + partials/_footer.html
 *     - EN: partials/_header.en.html   + partials/_footer.en.html
 *   For each of the 16 pages in PAGES this script selects the partial set that
 *   matches the page's `locale`, fills the per-page language switcher hrefs
 *   (`id` → the ID path of the page's pair, `en` → the EN path, with
 *   `aria-current="true"` on the option whose locale === the page locale), and
 *   replaces the page's existing `<nav id="navbar">…</nav>` block with that
 *   header and its `<footer>…</footer>` block with the locale footer. Each
 *   page's unique <head> and body content are left untouched — only the shared
 *   shell is overwritten — so the nav/footer end up byte-identical across all
 *   pages of the same locale, except for the runtime active-state and the
 *   per-page language-switcher hrefs (Requirement 7.5 / PROP-11, PROP-16).
 *
 * GUARANTEES
 *   - Deterministic & idempotent: running twice produces byte-identical output
 *     (the second run reports 0 updated files).
 *   - Never leaves `{{…}}` placeholders behind.
 *   - Safe: validates that each rewritten page still has exactly one nav and
 *     one footer BEFORE writing. If a page or partial is missing, or a region
 *     marker can't be found, it logs a warning and skips that page without
 *     throwing.
 *
 * DEPENDENCIES
 *   node:fs, node:path, node:url only. No npm install required. In particular
 *   this tool does NOT import the browser-side assets/js/lang.js — it ships its
 *   own tiny `pairPath` so it stays a self-contained build helper.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PARTIALS_DIR = join(ROOT, 'partials');
const HEADER_PARTIAL_ID = join(PARTIALS_DIR, '_header.html');
const FOOTER_PARTIAL_ID = join(PARTIALS_DIR, '_footer.html');
const HEADER_PARTIAL_EN = join(PARTIALS_DIR, '_header.en.html');
const FOOTER_PARTIAL_EN = join(PARTIALS_DIR, '_footer.en.html');
const THEME_INIT_PARTIAL = join(PARTIALS_DIR, '_theme-init.html');

// ---------------------------------------------------------------------------
// Canonical bilingual page set (mirrors design.md "PAGES_BILINGUAL" /
// tests/fixtures/pages.mjs). 16 entries = 7 content slugs + 404, each × {id,en}.
// ID is served at the root, EN under the /en/ prefix. Derived programmatically
// from the slug list + locale so the 16 entries can never drift.
// ---------------------------------------------------------------------------

/** The 7 content slugs (stable order). "" is Home. */
const CONTENT_SLUGS = [
  '',
  'services',
  'case-studies',
  'founded',
  'layanan-website',
  'layanan-video-ai',
  'packages',
];

/** Every slug in the set: the 7 content slugs + the 404 slug. */
const ALL_SLUGS = [...CONTENT_SLUGS, '404'];

/** Supported locales, in stable order (id first = default/root). */
const LOCALES = ['id', 'en'];

/**
 * Canonical root-relative path for a slug in a locale.
 *   id:  "" -> "/",    "services" -> "/services/",    "404" -> "/404.html"
 *   en:  "" -> "/en/", "services" -> "/en/services/", "404" -> "/en/404.html"
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function buildPath(slug, locale) {
  const prefix = locale === 'en' ? '/en' : '';
  if (slug === '404') return `${prefix}/404.html`;
  if (slug === '') return `${prefix}/`;
  return `${prefix}/${slug}/`;
}

/**
 * Repo-relative file path for a slug in a locale (the file-system mirror of
 * buildPath()).
 *   id:  "" -> "index.html",    "services" -> "services/index.html"
 *   en:  "" -> "en/index.html", "services" -> "en/services/index.html"
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function buildFile(slug, locale) {
  const dir = locale === 'en' ? 'en/' : '';
  if (slug === '404') return `${dir}404.html`;
  if (slug === '') return `${dir}index.html`;
  return `${dir}${slug}/index.html`;
}

/**
 * The 16-entry bilingual page set. Only `file`, `locale`, and `path` are needed
 * for the shell sync; `slug` documents what each page is.
 * @type {ReadonlyArray<{slug: string, locale: "id"|"en", path: string, file: string}>}
 */
const PAGES = ALL_SLUGS.flatMap((slug) =>
  LOCALES.map((locale) => ({
    slug,
    locale,
    path: buildPath(slug, locale),
    file: buildFile(slug, locale),
  })),
);

// ---------------------------------------------------------------------------
// pairPath — local, self-contained copy of the ID<->EN path mapping.
// Pure & involutive: pairPath(pairPath(p)) === p over canonical site paths.
// Intentionally NOT imported from assets/js/lang.js (browser module); this keeps
// the build tool dependency-free. Mirrors design.md "Data Models → pairPath".
// ---------------------------------------------------------------------------

/**
 * Map a canonical site path to its Pasangan_Halaman in the other locale by
 * adding / stripping a leading `/en` segment.
 *   "/"            <-> "/en/"
 *   "/services/"   <-> "/en/services/"
 *   "/404.html"    <-> "/en/404.html"
 *   "/en" (no slash) is treated as the EN home and pairs to "/".
 * @param {string} path canonical root-relative path
 * @returns {string} the paired path in the other locale
 */
function pairPath(path) {
  if (path === '/en' || path === '/en/') return '/';
  if (path.startsWith('/en/')) return path.slice(3); // drop "/en", keep leading "/"
  if (path === '/') return '/en/';
  return '/en' + path;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Read a partial and normalize it to a clean, trimmed block (no leading/
 * trailing blank lines) using LF line endings. Trimming + fixed line endings
 * are what make the sync deterministic and idempotent: the exact same bytes
 * get injected every run regardless of stray whitespace in the partial file.
 *
 * @param {string} filePath absolute path to the partial
 * @returns {string|null} normalized partial text, or null if unreadable
 */
function readPartial(filePath) {
  if (!existsSync(filePath)) {
    warn(`partial not found, skipping shell sync: ${rel(filePath)}`);
    return null;
  }
  try {
    return readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').trim();
  } catch (e) {
    warn(`could not read partial ${rel(filePath)}: ${e.message}`);
    return null;
  }
}

/**
 * Rewrite a single `.lang-option` anchor (identified by its data-lang) inside a
 * header block: set its `href` and add/remove `aria-current="true"`. The anchor
 * is rebuilt from a fixed attribute template so the output is byte-stable
 * (deterministic & idempotent) and matches the canonical switcher markup order:
 *   class, hreflang, data-lang, href, [aria-current].
 *
 * @param {string} headerHtml header markup containing the switcher
 * @param {"id"|"en"} lang     which option to rewrite
 * @param {string} hrefPath    the href to set on that option
 * @param {boolean} active     whether this option is the active locale
 * @returns {string}
 */
function setLangOption(headerHtml, lang, hrefPath, active) {
  const re = new RegExp(`<a\\b[^>]*\\bdata-lang="${lang}"[^>]*>`);
  const rebuilt =
    `<a class="lang-option" hreflang="${lang}" data-lang="${lang}" ` +
    `href="${hrefPath}"${active ? ' aria-current="true"' : ''}>`;
  return headerHtml.replace(re, rebuilt);
}

/**
 * Fill the `.lang-switcher` hrefs / active indicator for a specific page.
 *
 * The `id` option points at the ID path of the page's pair, the `en` option at
 * the EN path, and `aria-current="true"` lands on the option whose locale ===
 * the page's locale (and is removed from the other).
 *
 * @param {string} headerHtml normalized header partial (with switcher markup)
 * @param {string} selfPath   canonical path of THIS page
 * @param {string} pairedPath canonical path of the page's pair (pairPath(self))
 * @param {"id"|"en"} locale  locale of THIS page
 * @returns {string} header with the switcher specialized for this page
 */
function fillLangSwitcherHrefs(headerHtml, selfPath, pairedPath, locale) {
  const idPath = locale === 'id' ? selfPath : pairedPath;
  const enPath = locale === 'en' ? selfPath : pairedPath;

  let out = setLangOption(headerHtml, 'id', idPath, locale === 'id');
  out = setLangOption(out, 'en', enPath, locale === 'en');
  return out;
}

/**
 * Replace the region delimited by `openTag`…`closeTag` (inclusive) in `html`
 * with `replacement`, preserving the leading indentation of the opening tag so
 * the surrounding document formatting stays stable.
 *
 * Operates on the FIRST occurrence only. Returns an object describing the
 * outcome so the caller can decide whether to write or warn.
 *
 * @param {string} html        full page HTML
 * @param {RegExp} openRe      regex matching the opening tag (with capture of indent)
 * @param {string} closeTag    literal closing tag, e.g. "</nav>"
 * @param {string} replacement normalized partial text to inject
 * @returns {{ ok: boolean, html?: string, reason?: string }}
 */
function replaceRegion(html, openRe, closeTag, replacement) {
  const openMatch = openRe.exec(html);
  if (!openMatch) {
    return { ok: false, reason: `opening marker not found` };
  }

  const indent = openMatch[1] ?? '';
  const regionStart = openMatch.index + indent.length; // start at the tag itself
  const closeIdx = html.indexOf(closeTag, openMatch.index);
  if (closeIdx === -1) {
    return { ok: false, reason: `closing marker ${closeTag} not found` };
  }
  const regionEnd = closeIdx + closeTag.length;

  // Re-indent the replacement to match the opening tag's indentation so the
  // injected block lines up with the rest of the document.
  const indented = indent
    ? replacement
        .split('\n')
        .map((line, i) => (i === 0 || line === '' ? line : indent + line))
        .join('\n')
    : replacement;

  const next = html.slice(0, regionStart) + indented + html.slice(regionEnd);
  return { ok: true, html: next };
}

/** Count non-overlapping occurrences of a literal substring. */
function countOccurrences(haystack, needle) {
  let count = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    count += 1;
    idx = haystack.indexOf(needle, idx + needle.length);
  }
  return count;
}

function rel(absPath) {
  return absPath.startsWith(ROOT) ? absPath.slice(ROOT.length + 1) : absPath;
}

function warn(msg) {
  console.warn(`  ⚠️  ${msg}`);
}

// ---------------------------------------------------------------------------
// Per-page sync
// ---------------------------------------------------------------------------

/**
 * Sync the shared nav + footer of a single page from the locale partials.
 *
 * @param {{file: string, path: string, locale: "id"|"en"}} page
 * @param {string} header normalized header partial for the page's locale
 * @param {string} footer normalized footer partial for the page's locale
 * @param {boolean} checkOnly when true, never write to disk
 * @returns {'updated'|'unchanged'|'skipped'}
 */
function syncPage(page, header, footer, checkOnly) {
  const filePath = join(ROOT, page.file);
  if (!existsSync(filePath)) {
    warn(`page not found, skipping: ${page.file}`);
    return 'skipped';
  }

  let original;
  try {
    original = readFileSync(filePath, 'utf8');
  } catch (e) {
    warn(`could not read page ${page.file}: ${e.message}`);
    return 'skipped';
  }

  // Specialize the header's language switcher for THIS page (self + pair).
  const header2 = fillLangSwitcherHrefs(
    header,
    page.path,
    pairPath(page.path),
    page.locale,
  );

  // Replace nav region: <nav id="navbar"> … </nav>
  const navResult = replaceRegion(
    original,
    /^([ \t]*)<nav id="navbar">/m,
    '</nav>',
    header2,
  );
  if (!navResult.ok) {
    warn(`${page.file}: ${navResult.reason} for nav — skipping`);
    return 'skipped';
  }

  // Replace footer region: <footer> … </footer>
  const footerResult = replaceRegion(
    navResult.html,
    /^([ \t]*)<footer>/m,
    '</footer>',
    footer,
  );
  if (!footerResult.ok) {
    warn(`${page.file}: ${footerResult.reason} for footer — skipping`);
    return 'skipped';
  }

  const updated = footerResult.html;

  // --- Safety validations BEFORE writing ---------------------------------
  if (updated.includes('{{')) {
    warn(`${page.file}: output still contains "{{" placeholder — skipping`);
    return 'skipped';
  }
  const navCount = countOccurrences(updated, '<nav id="navbar">');
  const footerCount = countOccurrences(updated, '<footer>');
  if (navCount !== 1 || footerCount !== 1) {
    warn(
      `${page.file}: expected exactly one nav and one footer, ` +
        `got nav=${navCount} footer=${footerCount} — skipping`,
    );
    return 'skipped';
  }

  if (updated === original) {
    return 'unchanged';
  }

  if (checkOnly) {
    return 'updated'; // would update, but --check writes nothing
  }

  try {
    writeFileSync(filePath, updated, 'utf8');
  } catch (e) {
    warn(`could not write page ${page.file}: ${e.message}`);
    return 'skipped';
  }
  return 'updated';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const checkOnly = process.argv.includes('--check');

  console.log('build-pages: syncing per-locale nav + footer from partials');
  console.log(`  root:        ${ROOT}`);
  console.log(`  ID partials: ${rel(HEADER_PARTIAL_ID)}, ${rel(FOOTER_PARTIAL_ID)}`);
  console.log(`  EN partials: ${rel(HEADER_PARTIAL_EN)}, ${rel(FOOTER_PARTIAL_EN)}`);
  if (existsSync(THEME_INIT_PARTIAL)) {
    console.log(`  note:        ${rel(THEME_INIT_PARTIAL)} present (kept per-page, not synced)`);
  }
  if (checkOnly) console.log('  mode:        --check (dry run, no files written)');
  console.log('');

  const partials = {
    id: { header: readPartial(HEADER_PARTIAL_ID), footer: readPartial(FOOTER_PARTIAL_ID) },
    en: { header: readPartial(HEADER_PARTIAL_EN), footer: readPartial(FOOTER_PARTIAL_EN) },
  };
  if (
    partials.id.header === null ||
    partials.id.footer === null ||
    partials.en.header === null ||
    partials.en.footer === null
  ) {
    console.error('Aborting: a required partial is missing or unreadable.');
    process.exitCode = 1;
    return;
  }

  const summary = { updated: [], unchanged: [], skipped: [] };
  for (const page of PAGES) {
    const { header, footer } = partials[page.locale];
    const result = syncPage(page, header, footer, checkOnly);
    summary[result].push(page.file);
  }

  console.log('\nSummary:');
  console.log(`  ${checkOnly ? 'would update' : 'updated'}: ${summary.updated.length}`);
  for (const f of summary.updated) console.log(`    • ${f}`);
  console.log(`  unchanged: ${summary.unchanged.length}`);
  for (const f of summary.unchanged) console.log(`    • ${f}`);
  console.log(`  skipped:   ${summary.skipped.length}`);
  for (const f of summary.skipped) console.log(`    • ${f}`);
  console.log('\nDone. Deployed output stays pure static HTML/CSS/JS.');
}

main();
