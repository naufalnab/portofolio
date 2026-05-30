/**
 * tools/build-pages.mjs — OPTIONAL shared-shell sync tool (zero npm deps)
 * =========================================================================
 *
 * WHAT THIS IS
 *   An optional, local-only helper that keeps the shared header (nav) and
 *   footer DRY across every page. The site is — and stays — 100% static:
 *   running this script is opt-in, and the deployed artifacts remain pure
 *   static HTML/CSS/JS. Nothing here adds a runtime dependency to the site.
 *
 * HOW TO RUN
 *   From the project root:
 *
 *       node tools/build-pages.mjs            # sync nav + footer into pages
 *       node tools/build-pages.mjs --check    # dry run: report, write nothing
 *
 * WHAT IT DOES
 *   `partials/_header.html` and `partials/_footer.html` are the single source
 *   of truth for the shared shell. For each page in PAGES this script replaces
 *   the page's existing `<nav id="navbar">…</nav>` block with the canonical
 *   header partial, and its `<footer>…</footer>` block with the canonical
 *   footer partial. Each page's unique <head> and body content are left
 *   untouched — only the shared shell is overwritten — so the nav/footer end
 *   up byte-identical across all pages (Requirement 1.2 / PROP-11).
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
 *   node:fs, node:path, node:url only. No npm install required.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PARTIALS_DIR = join(ROOT, 'partials');
const HEADER_PARTIAL = join(PARTIALS_DIR, '_header.html');
const FOOTER_PARTIAL = join(PARTIALS_DIR, '_footer.html');
const THEME_INIT_PARTIAL = join(PARTIALS_DIR, '_theme-init.html');

/**
 * Canonical page set (mirrors design.md "Daftar Halaman" + "Daftar Aset
 * Wajib per Halaman"). The shell sync only needs `file`, but the full metadata
 * documents what each page is and keeps this list usable as a future template
 * input. `description`/`canonical` are null for 404 (noindex, no canonical).
 */
const PAGES = [
  {
    slug: '',
    file: 'index.html',
    title: 'Naufal Nabila — AI Automation, ERP & Digital Product Builder',
    description:
      'I turn messy, manual operations into AI-powered systems — AI automation, ERP/Odoo, internal tools, and digital products for founders and growing teams.',
    canonical: 'https://naufalnabila.my.id/',
    extraCss: ['hero'],
    extraJs: [],
    jsonLd: null,
  },
  {
    slug: 'services',
    file: 'services/index.html',
    title: 'Services — AI Automation, ERP & Internal Tools · Naufal Nabila',
    description:
      'Layanan otomasi workflow AI, sistem ERP/Odoo, internal tools, dan learning platform — mengubah operasi bisnis yang berantakan menjadi sistem terstruktur.',
    canonical: 'https://naufalnabila.my.id/services/',
    extraCss: [],
    extraJs: [],
    jsonLd: null,
  },
  {
    slug: 'case-studies',
    file: 'case-studies/index.html',
    title: 'Case Studies — Real Systems, Real Impact · Naufal Nabila',
    description:
      'Studi kasus sistem nyata: transformasi CRM Naska Jala Dewa, E-Risk Adhi Karya, dan CryptoSharia, plus klien enterprise seperti Yamaha dan Telkom Sigma.',
    canonical: 'https://naufalnabila.my.id/case-studies/',
    extraCss: [],
    extraJs: ['toggles'],
    jsonLd: null,
  },
  {
    slug: 'founded',
    file: 'founded/index.html',
    title: 'Founded Platforms & Track Record · Naufal Nabila',
    description:
      'Track record operator: 4 platform EdTech yang saya dirikan, kapabilitas AI automation, ERP, dan learning platform, pengalaman profesional, serta sertifikasi.',
    canonical: 'https://naufalnabila.my.id/founded/',
    extraCss: [],
    extraJs: ['toggles'],
    jsonLd: null,
  },
  {
    slug: 'layanan-website',
    file: 'layanan-website/index.html',
    title: 'Jasa Pembuatan Website Profesional · Naufal Nabila',
    description:
      'Jasa pembuatan website profesional: paket Basic, Pro, Custom dengan harga transparan dan terhubung WhatsApp langsung untuk bisnis Anda di Indonesia.',
    canonical: 'https://naufalnabila.my.id/layanan-website/',
    extraCss: ['services-commercial'],
    extraJs: ['services'],
    jsonLd: 'Service:Pembuatan Website',
  },
  {
    slug: 'layanan-video-ai',
    file: 'layanan-video-ai/index.html',
    title: 'Jasa Pembuatan Video AI · Naufal Nabila',
    description:
      'Jasa pembuatan video AI untuk iklan dan konten sosial media. Voiceover natural, subtitle otomatis, multi-format. Tersedia paket Basic, Pro, dan Custom.',
    canonical: 'https://naufalnabila.my.id/layanan-video-ai/',
    extraCss: ['services-commercial'],
    extraJs: ['services'],
    jsonLd: 'Service:Pembuatan Video AI',
  },
  {
    slug: 'packages',
    file: 'packages/index.html',
    title: 'Packages & Contact — Ways I Can Help · Naufal Nabila',
    description:
      'Paket kerja sama Naufal Nabila: Operations System Audit, AI workflow build, internal tools/dashboard, dan systems retainer. Hubungi via WhatsApp atau email.',
    canonical: 'https://naufalnabila.my.id/packages/',
    extraCss: [],
    extraJs: [],
    jsonLd: null,
  },
  {
    slug: '404',
    file: '404.html',
    title: '404 — Halaman Tidak Ditemukan · Naufal Nabila',
    description: null,
    canonical: null,
    extraCss: [],
    extraJs: [],
    jsonLd: null,
  },
];

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
 * Sync the shared nav + footer of a single page from the canonical partials.
 *
 * @param {{file: string}} page
 * @param {string} header normalized header partial
 * @param {string} footer normalized footer partial
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

  // Replace nav region: <nav id="navbar"> … </nav>
  const navResult = replaceRegion(
    original,
    /^([ \t]*)<nav id="navbar">/m,
    '</nav>',
    header,
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

  console.log('build-pages: syncing shared nav + footer from partials');
  console.log(`  root:     ${ROOT}`);
  console.log(`  partials: ${rel(HEADER_PARTIAL)}, ${rel(FOOTER_PARTIAL)}`);
  if (existsSync(THEME_INIT_PARTIAL)) {
    console.log(`  note:     ${rel(THEME_INIT_PARTIAL)} present (kept per-page, not synced)`);
  }
  if (checkOnly) console.log('  mode:     --check (dry run, no files written)');
  console.log('');

  const header = readPartial(HEADER_PARTIAL);
  const footer = readPartial(FOOTER_PARTIAL);
  if (header === null || footer === null) {
    console.error('Aborting: a required partial is missing or unreadable.');
    process.exitCode = 1;
    return;
  }

  const summary = { updated: [], unchanged: [], skipped: [] };
  for (const page of PAGES) {
    const result = syncPage(page, header, footer, checkOnly);
    summary[result].push(page.file);
  }

  console.log('\nSummary:');
  console.log(`  ${checkOnly ? 'would update' : 'updated'}: ${summary.updated.length}`);
  for (const f of summary.updated) console.log(`    • ${f}`);
  console.log(`  unchanged: ${summary.unchanged.length}`);
  console.log(`  skipped:   ${summary.skipped.length}`);
  for (const f of summary.skipped) console.log(`    • ${f}`);
  console.log('\nDone. Deployed output stays pure static HTML/CSS/JS.');
}

main();
