/**
 * Enumerative intra-locale internal-link tests over the finite bilingual page
 * set (PAGES_BILINGUAL: 16 entries = 7 content slugs + 404, each in {id, en}).
 *
 * Property 7 — PROP-7: every internal link is intra-locale and resolves
 *   For every page X in PAGES_BILINGUAL, every `<a href>` on the page — EXCEPT
 *   the Pemilih_Bahasa (language switcher) options, which are the only
 *   legitimately cross-locale links — is:
 *
 *     (a) intra-locale: it stays within X's own locale. On an ID page the href
 *         must be a root path WITHOUT the `/en/` prefix (localeOf === "id");
 *         on an EN page it must be an `/en/...` path (localeOf === "en").
 *     (b) resolvable: after stripping the hash, its normalized path is one of
 *         the canonical paths in PAGES_BILINGUAL (content page or 404),
 *         allowing an optional `#fragment` (e.g. "/packages/#contact",
 *         "/services/#process").
 *     (c) never double-prefixed: the resolved path never contains "/en/en/".
 *
 *   Links that are NOT asserted on (classified as "skip"): external http(s) to
 *   another domain (e.g. github.com), `wa.me` links, `mailto:`, `tel:`, empty
 *   hrefs, and pure same-page "#anchor" links (in-page fragments are allowed).
 *
 * The language switcher (`.lang-switcher` → `a.lang-option`) is excluded from
 * the intra-locale assertion because pointing at the opposite-locale pair is
 * exactly its job (covered by PROP-2 in pages.langswitcher.test.mjs).
 *
 * This is an enumerative test over the closed, finite page set; each page gets
 * its own sub-test so a failure points at the exact offending file.
 *
 * Run with: `node --test tests/pages.bilingual-links.test.mjs` (needs jsdom).
 *
 * Validates: Requirements 1.6, 7.3, 7.6, 11.7
 */

import test from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { PAGES_BILINGUAL, ORIGIN } from "./fixtures/pages.mjs";

/** Host the static site is served from (used to tell internal from external). */
const ORIGIN_HOST = new URL(ORIGIN).host;

/**
 * Local copy of normalizePath — mirrors assets/js/nav.js and the legacy
 * pages.links.test.mjs. Strips hash/query, "" → "/", and appends a trailing
 * slash for non-".html" paths so comparisons are slash-consistent.
 * @param {string} p
 * @returns {string}
 */
function normalizePath(p) {
  p = String(p).split("#")[0].split("?")[0];
  if (p === "") return "/";
  if (!p.endsWith("/") && !p.endsWith(".html")) p += "/";
  return p;
}

/**
 * The locale a canonical site path belongs to (mirrors lang.js localeOf).
 * "en" iff the path is exactly "/en" or lives under the "/en/" prefix.
 * @param {string} path
 * @returns {"id"|"en"}
 */
function localeOf(path) {
  return path === "/en" || path.startsWith("/en/") ? "en" : "id";
}

/** The set of every known canonical page path (content + 404, both locales). */
const KNOWN_PATHS = new Set(PAGES_BILINGUAL.map((p) => normalizePath(p.path)));

/**
 * Classify a raw href attribute value.
 * @param {string} raw - the literal value of the href attribute
 * @returns {{ kind: "skip" } | { kind: "hash" } | { kind: "internal", path: string }}
 *   - "skip"     : not asserted on (empty, mailto, tel, external http(s), wa.me, other schemes)
 *   - "hash"     : a pure same-page anchor "#X" (in-page fragment — allowed)
 *   - "internal" : an internal page link; `path` is its raw resolved pathname
 */
function classifyHref(raw) {
  const href = String(raw).trim();

  // Empty / placeholder.
  if (href === "") return { kind: "skip" };

  // Pure same-page anchor — in-page fragment, always allowed.
  if (href.startsWith("#")) return { kind: "hash" };

  // Non-page schemes.
  if (/^(mailto:|tel:)/i.test(href)) return { kind: "skip" };

  // Resolve against the site origin so root-relative ("/services/#process"),
  // protocol-relative, and absolute self-links all yield a comparable pathname.
  let url;
  try {
    url = new URL(href, ORIGIN + "/");
  } catch {
    // Unparseable href — skip rather than crash the suite.
    return { kind: "skip" };
  }

  // Only http(s) URLs are page links; anything else (mailto:, tel:, etc.) skip.
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { kind: "skip" };
  }

  // External http(s) to ANOTHER domain (wa.me, github.com, linkedin.com, the
  // "founded by me" domains, etc.) → skip.
  if (url.host !== ORIGIN_HOST) return { kind: "skip" };

  // Same-origin → an internal page link. Keep the raw resolved pathname so we
  // can both check for "/en/en/" and derive its locale.
  return { kind: "internal", path: url.pathname };
}

/**
 * Is this anchor part of the Pemilih_Bahasa (language switcher)? Those are the
 * only legitimately cross-locale links and are excluded from PROP-7.
 * @param {Element} a
 * @returns {boolean}
 */
function isLangSwitcherOption(a) {
  return a.closest(".lang-switcher") !== null;
}

for (const page of PAGES_BILINGUAL) {
  test(`PROP-7: ${page.file} internal links stay intra-locale (${page.locale}) and resolve`, () => {
    const document = loadDom(page.file);
    const anchors = document.querySelectorAll("a[href]");

    /** @type {string[]} */
    const offenders = [];

    for (const a of anchors) {
      // The language switcher is the ONLY allowed cross-locale link.
      if (isLangSwitcherOption(a)) continue;

      const raw = a.getAttribute("href");
      const c = classifyHref(raw);
      if (c.kind !== "internal") continue; // external / mailto / tel / wa.me / in-page hash

      const resolved = c.path; // raw resolved pathname, e.g. "/services/" or "/en/services/"
      const norm = normalizePath(resolved);

      // (c) never a double-prefixed path.
      if (resolved.includes("/en/en/")) {
        offenders.push(`${raw} → ${resolved} (double /en/en/ prefix)`);
        continue;
      }

      // (a) intra-locale: the link's locale must equal the page's locale.
      const linkLocale = localeOf(resolved);
      if (linkLocale !== page.locale) {
        offenders.push(
          `${raw} → ${resolved} (cross-locale: link is "${linkLocale}", page is "${page.locale}")`,
        );
        continue;
      }

      // (b) resolves into PAGES_BILINGUAL (optional #fragment already stripped).
      if (!KNOWN_PATHS.has(norm)) {
        offenders.push(`${raw} → ${norm} (not a path in PAGES_BILINGUAL)`);
        continue;
      }
    }

    assert.deepEqual(
      offenders,
      [],
      `${page.file} (locale ${page.locale}) has non-switcher internal link(s) that are ` +
        `cross-locale, unresolvable, or double-prefixed:\n  ${offenders.join("\n  ")}\n` +
        `(known paths: ${[...KNOWN_PATHS].join(", ")})`,
    );
  });
}
