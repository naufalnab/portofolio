/**
 * Enumerative internal-link resolution tests over the finite set of site pages.
 *
 * Validates two correctness properties from design.md (Algoritma 5: Link
 * Resolver + Validation Rules) across every page in PAGES:
 *
 *   - Property 3 (all internal links resolve): for every page, every internal
 *     link (an <a href> that is NOT external http(s) to another domain, NOT
 *     mailto:, NOT tel:, NOT a wa.me link, and NOT a pure same-page "#anchor")
 *     resolves — after stripping the hash and normalizing the path — to a known
 *     page path in { normalizePath(p.path) for p in PAGES }. The language
 *     switcher (`.lang-switcher` → `a.lang-option`) is excluded here: it is the
 *     only legitimately cross-locale link (its EN option targets the page's
 *     `/en/...` pair, outside the single-locale ID-only PAGES set). That link
 *     is validated by Property 7 in pages.bilingual-links.test.mjs.
 *
 *   - Property 12 (no dead anchors to moved sections): no page contains a
 *     pure same-page href="#X" whose id X is NOT present on that same page.
 *     Sections that were moved to other pages (services, process, projects,
 *     clients, founded, skills, experience, credentials, jasa-website,
 *     jasa-video-ai, packages, contact) must be linked cross-page
 *     (e.g. "/services/#process"), never as a bare same-page "#process".
 *     A same-page hash link is only legitimate when its target id actually
 *     exists as an element id on that same page.
 *
 * This is an enumerative test over the finite page set defined in PAGES; each
 * page gets its own sub-test so failures point at the exact offending file.
 *
 * Validates: Requirements 2.1
 */

import test from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { PAGES } from "./fixtures/pages.mjs";

/** Absolute origin the static site is served from (used to resolve hrefs). */
const ORIGIN = "https://naufalnabila.my.id";

/**
 * Local copy of normalizePath — mirrors assets/js/nav.js and design.md
 * (Algoritma 3 / Algoritma 5). Strips hash/query, "" → "/", and appends a
 * trailing slash for non-".html" paths so comparisons are slash-consistent.
 * @param {string} p
 * @returns {string}
 */
function normalizePath(p) {
  p = String(p).split("#")[0].split("?")[0];
  if (p === "") return "/";
  if (!p.endsWith("/") && !p.endsWith(".html")) p += "/";
  return p;
}

/** The set of every known, navigable page path. */
const KNOWN_PATHS = new Set(PAGES.map((p) => normalizePath(p.path)));

/**
 * Section ids that were carved out of the single-page index.html and now live
 * on a DIFFERENT page. A bare same-page "#<id>" to any of these is a dead
 * anchor and must instead be a cross-page link (e.g. "/services/#process").
 */
const MOVED_SECTION_IDS = Object.freeze([
  "services",
  "process",
  "projects",
  "clients",
  "founded",
  "skills",
  "experience",
  "credentials",
  "jasa-website",
  "jasa-video-ai",
  "packages",
  "contact",
]);

/**
 * Classify a raw href attribute value.
 * @param {string} raw - the literal value of the href attribute
 * @returns {{ kind: "skip" } | { kind: "hash", id: string } | { kind: "internal", path: string }}
 *   - "skip"     : not a link we assert on (empty, mailto, tel, external http(s), wa.me)
 *   - "hash"     : a pure same-page anchor "#X" (id = "X", may be "" for bare "#")
 *   - "internal" : an internal page link; path is its normalized pathname
 */
function classifyHref(raw) {
  const href = String(raw).trim();

  // Empty / placeholder.
  if (href === "") return { kind: "skip" };

  // Pure same-page anchor (Property 12 territory; skipped by Property 3).
  if (href.startsWith("#")) return { kind: "hash", id: href.slice(1) };

  // Non-page schemes.
  if (/^(mailto:|tel:)/i.test(href)) return { kind: "skip" };

  // Resolve against the site origin so root-relative ("/services/#process")
  // and absolute self-links both yield a pathname we can normalize.
  let url;
  try {
    url = new URL(href, ORIGIN + "/");
  } catch {
    // Unparseable href — treat as skip rather than crash the suite.
    return { kind: "skip" };
  }

  // Only http(s) URLs are page links; anything else (mailto:, tel:, etc.) skip.
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { kind: "skip" };
  }

  // External http(s) to ANOTHER domain (e.g. wa.me, github.com) → skip.
  if (url.host !== new URL(ORIGIN).host) {
    return { kind: "skip" };
  }

  // Same-origin → an internal page link. Compare on the normalized pathname.
  return { kind: "internal", path: normalizePath(url.pathname) };
}

// ---------------------------------------------------------------------------
// Property 3 — every internal link resolves to a known page path.
// ---------------------------------------------------------------------------
for (const p of PAGES) {
  test(`Property 3: ${p.file} internal links resolve to known pages`, () => {
    const document = loadDom(p.file);
    const anchors = document.querySelectorAll("a[href]");

    const broken = [];
    for (const a of anchors) {
      // The language switcher is the ONLY legitimately cross-locale link: its
      // EN option points at the page's pair under `/en/...`, which is not in
      // the single-locale ID-only KNOWN_PATHS by design. Skip it here; its
      // correctness is covered by Property 7 in pages.bilingual-links.test.mjs.
      if (a.closest(".lang-switcher")) continue;

      const raw = a.getAttribute("href");
      const c = classifyHref(raw);
      if (c.kind !== "internal") continue; // external / mailto / tel / wa.me / hash
      if (!KNOWN_PATHS.has(c.path)) {
        broken.push(`${raw} → ${c.path}`);
      }
    }

    assert.deepEqual(
      broken,
      [],
      `${p.file} has internal link(s) that do not resolve to a known page path ` +
        `(known: ${[...KNOWN_PATHS].join(", ")}):\n  ${broken.join("\n  ")}`,
    );
  });
}

// ---------------------------------------------------------------------------
// Property 12 — no dead same-page anchors to sections that moved elsewhere.
// ---------------------------------------------------------------------------
for (const p of PAGES) {
  test(`Property 12: ${p.file} has no dead same-page anchors`, () => {
    const document = loadDom(p.file);

    // Every element id present on this page — a same-page anchor is only valid
    // when it points at one of these.
    const idsOnPage = new Set(
      Array.from(document.querySelectorAll("[id]")).map((el) => el.id),
    );

    const dead = [];
    for (const a of document.querySelectorAll("a[href]")) {
      const raw = a.getAttribute("href");
      const c = classifyHref(raw);
      if (c.kind !== "hash") continue; // only pure same-page "#X" anchors
      if (c.id === "") continue; // bare "#" top-of-page link — allowed
      if (!idsOnPage.has(c.id)) {
        const movedNote = MOVED_SECTION_IDS.includes(c.id)
          ? " (a moved section — link it cross-page, e.g. /packages/#contact)"
          : "";
        dead.push(`#${c.id}${movedNote}`);
      }
    }

    assert.deepEqual(
      dead,
      [],
      `${p.file} has same-page anchor(s) pointing at id(s) not present on the ` +
        `page (dead anchors):\n  ${dead.join("\n  ")}`,
    );
  });
}
