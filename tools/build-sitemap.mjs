/**
 * tools/build-sitemap.mjs — OPTIONAL bilingual sitemap generator (zero npm deps)
 * =============================================================================
 *
 * WHAT THIS IS
 *   An optional, local-only helper that regenerates `sitemap.xml` deterministically
 *   from the closed bilingual page set so the hand-maintained sitemap can never
 *   drift from the actual pages. Like tools/build-pages.mjs, this is opt-in dev
 *   tooling: the deployed site stays 100% static and gains no runtime dependency.
 *
 * HOW TO RUN
 *   From the project root:
 *
 *       node tools/build-sitemap.mjs            # write sitemap.xml
 *       node tools/build-sitemap.mjs --check    # dry run: compare, write nothing
 *
 * WHAT IT EMITS (must match the committed sitemap.xml byte-for-byte)
 *   Exactly the 14 content URLs (7 content slugs × {id, en}, NO 404s), ordered
 *   slug-major / locale-minor (id home, en home, id services, en services, …) to
 *   mirror the committed file. The root <urlset> declares both the sitemap 0.9 and
 *   the xhtml namespaces. Under every <url>:
 *     - one <loc> = the page's own absolute https canonical (trailing-slash form)
 *     - exactly three <xhtml:link rel="alternate" hreflang> alternates (id / en /
 *       x-default), with hrefs identical between the two paired pages (x-default = id)
 *     - the shared <lastmod>, <changefreq>, and the per-page <priority>
 *
 * GUARANTEES
 *   - Deterministic & idempotent: running apply twice yields a byte-identical file,
 *     and --check on a freshly written file reports a match (0 drift).
 *   - Zero deps: node:fs / node:path / node:url only. It hardcodes the slug list +
 *     priorities so it stays self-contained (mirrors tests/fixtures/pages.mjs and
 *     the committed sitemap; intentionally does NOT import the fixtures, which are
 *     test-only ES modules).
 *
 * DEPENDENCIES
 *   node:fs, node:path, node:url only. No npm install required.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SITEMAP_FILE = join(ROOT, 'sitemap.xml');

// ---------------------------------------------------------------------------
// Canonical bilingual content set (mirrors design.md "Data Models" /
// tests/fixtures/pages.mjs and the committed sitemap.xml). 14 indexable URLs =
// 7 content slugs × {id, en}. The two 404 pages are deliberately excluded.
// ---------------------------------------------------------------------------

/** Canonical origin for every absolute URL. */
const ORIGIN = 'https://naufalnabila.my.id';

/** The 7 content slugs (stable order, mirrors the committed sitemap). "" is Home. */
const CONTENT_SLUGS = [
  '',
  'services',
  'case-studies',
  'founded',
  'layanan-website',
  'layanan-video-ai',
  'packages',
];

/** Supported locales, in stable order (id first = default/root, then en). */
const LOCALES = ['id', 'en'];

/** Shared per-URL metadata (preserved from the committed sitemap). */
const LASTMOD = '2026-05-30';
const CHANGEFREQ = 'monthly';

/**
 * Per-page <priority> values, exactly as in the committed sitemap.xml. Stored as
 * strings so formatting (e.g. "1.0") is byte-stable. Keyed by slug; Home differs
 * by locale (id 1.0, en 0.9), every other slug shares one priority across locales.
 * @type {Record<string, { id: string, en: string }>}
 */
const PRIORITY = {
  '': { id: '1.0', en: '0.9' },
  services: { id: '0.8', en: '0.8' },
  'case-studies': { id: '0.7', en: '0.7' },
  founded: { id: '0.7', en: '0.7' },
  'layanan-website': { id: '0.8', en: '0.8' },
  'layanan-video-ai': { id: '0.8', en: '0.8' },
  packages: { id: '0.7', en: '0.7' },
};

/**
 * Canonical root-relative path for a content slug in a locale (mirrors the
 * fixtures' buildPath; 404 is never passed here).
 *   id:  "" -> "/",    "services" -> "/services/"
 *   en:  "" -> "/en/", "services" -> "/en/services/"
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function buildPath(slug, locale) {
  const prefix = locale === 'en' ? '/en' : '';
  if (slug === '') return `${prefix}/`;
  return `${prefix}/${slug}/`;
}

/**
 * Absolute https canonical URL for a content slug in a locale.
 * @param {string} slug
 * @param {"id"|"en"} locale
 * @returns {string}
 */
function absUrl(slug, locale) {
  return ORIGIN + buildPath(slug, locale);
}

// ---------------------------------------------------------------------------
// XML assembly
// ---------------------------------------------------------------------------

/**
 * Build the full sitemap.xml text deterministically. Indentation, namespace
 * declarations, element order, and the trailing newline match the committed
 * file so the output is byte-identical.
 * @returns {string}
 */
function buildSitemap() {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

  // slug-major / locale-minor: id home, en home, id services, en services, …
  for (const slug of CONTENT_SLUGS) {
    for (const locale of LOCALES) {
      const idUrl = absUrl(slug, 'id');
      const enUrl = absUrl(slug, 'en');
      const selfUrl = absUrl(slug, locale);
      const priority = PRIORITY[slug][locale];

      lines.push('  <url>');
      lines.push(`    <loc>${selfUrl}</loc>`);
      // x-default points at the ID URL, matching the committed sitemap.
      lines.push(`    <xhtml:link rel="alternate" hreflang="id" href="${idUrl}"/>`);
      lines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`);
      lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${idUrl}"/>`);
      lines.push(`    <lastmod>${LASTMOD}</lastmod>`);
      lines.push(`    <changefreq>${CHANGEFREQ}</changefreq>`);
      lines.push(`    <priority>${priority}</priority>`);
      lines.push('  </url>');
    }
  }

  lines.push('</urlset>');
  // Trailing newline to match the committed file.
  return lines.join('\n') + '\n';
}

function rel(absPath) {
  return absPath.startsWith(ROOT) ? absPath.slice(ROOT.length + 1) : absPath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const checkOnly = process.argv.includes('--check');

  console.log('build-sitemap: generating bilingual sitemap.xml from the content slug set');
  console.log(`  root:   ${ROOT}`);
  console.log(`  target: ${rel(SITEMAP_FILE)}`);
  console.log(`  urls:   ${CONTENT_SLUGS.length * LOCALES.length} content entries (no 404s)`);
  if (checkOnly) console.log('  mode:   --check (dry run, no files written)');
  console.log('');

  const generated = buildSitemap();

  if (checkOnly) {
    if (!existsSync(SITEMAP_FILE)) {
      console.error(`✗ ${rel(SITEMAP_FILE)} does not exist — run without --check to create it.`);
      process.exitCode = 1;
      return;
    }
    let current;
    try {
      current = readFileSync(SITEMAP_FILE, 'utf8');
    } catch (e) {
      console.error(`✗ could not read ${rel(SITEMAP_FILE)}: ${e.message}`);
      process.exitCode = 1;
      return;
    }
    if (current === generated) {
      console.log(`✓ MATCH: generated XML is byte-identical to ${rel(SITEMAP_FILE)} (no drift).`);
    } else {
      console.error(`✗ DRIFT: generated XML differs from ${rel(SITEMAP_FILE)}.`);
      console.error('  Run "node tools/build-sitemap.mjs" to regenerate, or reconcile manually.');
      process.exitCode = 1;
    }
    return;
  }

  // Apply mode: only write when the content actually changes (idempotent).
  const exists = existsSync(SITEMAP_FILE);
  const current = exists ? readFileSync(SITEMAP_FILE, 'utf8') : null;
  if (current === generated) {
    console.log(`unchanged: ${rel(SITEMAP_FILE)} already up to date.`);
  } else {
    try {
      writeFileSync(SITEMAP_FILE, generated, 'utf8');
    } catch (e) {
      console.error(`✗ could not write ${rel(SITEMAP_FILE)}: ${e.message}`);
      process.exitCode = 1;
      return;
    }
    console.log(`${exists ? 'updated' : 'created'}: ${rel(SITEMAP_FILE)}`);
  }
  console.log('\nDone. Deployed output stays pure static HTML/CSS/JS.');
}

main();
