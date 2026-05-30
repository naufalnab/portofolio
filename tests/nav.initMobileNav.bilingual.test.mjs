/**
 * Property 21 — hamburger mobile berperilaku benar di kedua locale.
 *
 * For EITHER shell (id or en) and ANY random sequence of actions drawn from
 * {toggle, nav-link click, Escape keydown, resize}, `window.__nav.initMobileNav`
 * behaves correctly:
 *  - Initial state after init is CLOSED: `#navbar` has no `.nav-open`, the
 *    `.nav-toggle` has aria-expanded="false".
 *  - A toggle (hamburger click) flips the open/closed state.
 *  - Clicking a `.nav-links a`, pressing Escape, or resizing to width `>=900px`
 *    ALWAYS closes the menu.
 *  - Resizing to `<900px` leaves the open/closed state untouched.
 *  - Idempotent init: calling `initMobileNav` twice does NOT add duplicate
 *    listeners, so a single toggle still flips exactly once.
 *
 * The shell is built per-locale from `navItemsFor(locale)` — mirroring the
 * single-locale test (tests/nav.initMobileNav.test.mjs) and the bilingual
 * active-nav test (tests/nav.setActiveNav.bilingual.test.mjs) — so the property
 * is exercised across both the ID shell (root hrefs like /services/) and the
 * EN shell (prefixed hrefs like /en/services/). nav.js runs its IIFE —
 * including initMobileNav(navbar) — on load via the loadScriptModule helper.
 *
 * Uses Node's built-in test runner + fast-check + the loadScriptModule helper
 * (jsdom). These are dev-only deps, never shipped with the static site.
 *
 * Validates: Requirements 10.3
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import { loadScriptModule } from "./helpers.mjs";
import { navItemsFor } from "./fixtures/pages.mjs";

const SITE_URL = "https://naufalnabila.my.id/";

/** Supported locales (id served at root, en under /en/). */
const LOCALES = ["id", "en"];

/**
 * Build a faithful per-locale nav shell from navItemsFor(locale). Includes the
 * structural hooks initMobileNav relies on: the `.nav-toggle` button and the
 * `ul.nav-links` list (with dropdown markup matching the real header), wrapped
 * inside `<nav id="navbar">`.
 * @param {"id"|"en"} locale
 * @returns {string} full HTML document with <nav id="navbar">
 */
function buildShellHtml(locale) {
  const items = navItemsFor(locale);
  const rootHref = locale === "en" ? "/en/" : "/";

  const liHtml = items
    .map((item) => {
      if (item.children) {
        const childLis = item.children
          .map((c) => `        <li><a href="${c.href}">${c.label}</a></li>`)
          .join("\n");
        return `      <li class="nav-dropdown">
        <a href="${item.href}" aria-haspopup="true" aria-expanded="false">${item.label}</a>
        <ul class="nav-dropdown-menu">
${childLis}
        </ul>
      </li>`;
      }
      return `      <li><a href="${item.href}">${item.label}</a></li>`;
    })
    .join("\n");

  return `<!DOCTYPE html><html lang="${locale}"><head></head><body>
  <nav id="navbar">
    <div class="nav-container">
      <a href="${rootHref}" class="logo">Naufal<span>.</span></a>
      <button class="nav-toggle" aria-label="menu" aria-expanded="false" aria-controls="nav-links">
        <span class="nav-toggle-bar"></span>
      </button>
      <div class="nav-right">
        <ul class="nav-links" id="nav-links">
${liHtml}
        </ul>
      </div>
    </div>
  </nav>
</body></html>`;
}

/**
 * Load nav.js into a fresh jsdom window using the per-locale shell. nav.js
 * auto-runs initMobileNav(navbar) inside its IIFE on load.
 * @param {"id"|"en"} locale
 * @returns {{ win: Window, navbar: HTMLElement, btn: HTMLElement }}
 */
function makeNavWindow(locale) {
  const win = loadScriptModule("assets/js/nav.js", {
    html: buildShellHtml(locale),
    url: SITE_URL,
  });
  const navbar = win.document.getElementById("navbar");
  const btn = navbar ? navbar.querySelector(".nav-toggle") : null;
  return { win, navbar, btn };
}

const isOpen = (navbar) => navbar.classList.contains("nav-open");
const aria = (btn) => btn.getAttribute("aria-expanded");

function clickToggle(win, btn) {
  btn.dispatchEvent(new win.Event("click", { bubbles: true }));
}
function pressEscape(win) {
  win.document.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Escape" }));
}
function resizeTo(win, width) {
  win.innerWidth = width;
  win.dispatchEvent(new win.Event("resize"));
}

/**
 * Reference reducer for the expected open/closed state given an action.
 * @param {boolean} state - current open state (true = open)
 * @param {{t: string}} action
 * @returns {boolean} next expected open state
 */
function nextExpected(state, action) {
  switch (action.t) {
    case "toggle":
      return !state;
    case "link": // clicking a nav link closes
    case "escape": // Escape closes
    case "resizeDesktop": // resizing to >=900px closes
      return false;
    case "resizeMobile": // resizing to <900px leaves state untouched
    case "reinit": // re-initialising must not change state (idempotency guard)
      return state;
    default:
      throw new Error(`unknown action ${action.t}`);
  }
}

/**
 * Drive the DOM with a single action.
 * @param {Window} win
 * @param {HTMLElement} navbar
 * @param {HTMLElement} btn
 * @param {{t: string, i?: number}} action
 */
function applyAction(win, navbar, btn, action) {
  switch (action.t) {
    case "toggle":
      clickToggle(win, btn);
      break;
    case "link": {
      const links = navbar.querySelectorAll(".nav-links a");
      const link = links[action.i % links.length];
      link.dispatchEvent(new win.Event("click", { bubbles: true, cancelable: true }));
      break;
    }
    case "escape":
      pressEscape(win);
      break;
    case "resizeDesktop":
      resizeTo(win, action.i % 2 === 0 ? 900 : 1280);
      break;
    case "resizeMobile":
      resizeTo(win, 320 + (action.i % 500)); // always < 900
      break;
    case "reinit":
      win.__nav.initMobileNav(navbar);
      break;
    default:
      throw new Error(`unknown action ${action.t}`);
  }
}

const actionArb = fc.record({
  t: fc.constantFrom("toggle", "link", "escape", "resizeDesktop", "resizeMobile", "reinit"),
  i: fc.nat(1000),
});

for (const locale of LOCALES) {
  // -------------------------------------------------------------------------
  // Deterministic baseline checks per locale shell.
  // -------------------------------------------------------------------------

  test(`PROP-21 [${locale}]: shell exposes the mobile-nav API and required elements`, () => {
    const { win, navbar, btn } = makeNavWindow(locale);
    assert.ok(navbar, `[${locale}] #navbar must exist in the shell`);
    assert.ok(btn, `[${locale}] .nav-toggle must exist in the shell`);
    assert.ok(navbar.querySelector(".nav-links"), `[${locale}] .nav-links must exist in the shell`);
    assert.equal(
      typeof win.__nav?.initMobileNav,
      "function",
      `[${locale}] window.__nav.initMobileNav must be exposed`
    );
  });

  test(`PROP-21 [${locale}]: initial state after init is closed`, () => {
    const { navbar, btn } = makeNavWindow(locale);
    assert.equal(isOpen(navbar), false, `[${locale}] menu must start closed`);
    assert.equal(aria(btn), "false", `[${locale}] aria-expanded must start "false"`);
  });

  // -------------------------------------------------------------------------
  // Property 21 — randomized action sequences vs. a reference reducer.
  // -------------------------------------------------------------------------

  test(`PROP-21 [${locale}]: open/closed state always tracks the expected reduced state`, () => {
    fc.assert(
      fc.property(fc.array(actionArb, { minLength: 1, maxLength: 15 }), (actions) => {
        const { win, navbar, btn } = makeNavWindow(locale);

        // Invariant after init: closed and aria in sync.
        let expected = false;
        assert.equal(isOpen(navbar), expected, `[${locale}] must start closed`);
        assert.equal(aria(btn), "false", `[${locale}] aria-expanded must start "false"`);

        for (const action of actions) {
          applyAction(win, navbar, btn, action);
          expected = nextExpected(expected, action);

          assert.equal(
            isOpen(navbar),
            expected,
            `[${locale}] after action ${action.t} expected open=${expected}`
          );
          // aria-expanded must always mirror the open/closed state.
          assert.equal(
            aria(btn),
            expected ? "true" : "false",
            `[${locale}] aria-expanded must mirror open state after ${action.t}`
          );
        }
      }),
      { numRuns: 100 }
    );
  });

  test(`PROP-21 [${locale}]: double-init does not double-bind — one toggle flips exactly once`, () => {
    fc.assert(
      fc.property(fc.nat(8), (extraInits) => {
        const { win, navbar, btn } = makeNavWindow(locale);

        // nav.js already ran initMobileNav(navbar) in its IIFE; call it again
        // an arbitrary number of extra times. None of these may add listeners.
        for (let n = 0; n < extraInits; n++) {
          win.__nav.initMobileNav(navbar);
        }
        assert.equal(isOpen(navbar), false, `[${locale}] re-init must not change state`);
        assert.equal(aria(btn), "false", `[${locale}] re-init must not change aria-expanded`);

        // A single click after repeated init must flip exactly once -> OPEN
        // (not double-toggled back to closed by duplicate click listeners).
        clickToggle(win, btn);
        assert.equal(
          isOpen(navbar),
          true,
          `[${locale}] one click after ${extraInits} extra init(s) must open exactly once`
        );
        assert.equal(aria(btn), "true", `[${locale}] aria-expanded must be "true" after one click`);
      }),
      { numRuns: 100 }
    );
  });
}
