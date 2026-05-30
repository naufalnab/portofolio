/**
 * Property 13 — Mobile hamburger toggle is correct.
 *
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 *
 * Exercises `window.__nav.initMobileNav` (defined in assets/js/nav.js). The nav
 * fixture is built from the real `partials/_header.html` source of truth, which
 * contains the `.nav-toggle` button and the `.nav-links` list, wrapped inside a
 * `<nav id="navbar">`. The nav.js IIFE auto-runs `initMobileNav(navbar)` on load
 * via the shared `loadScriptModule` helper.
 *
 * Behaviour under test (PROP-13):
 *  - Initial state after init: `#navbar` has no `.nav-open`, toggle aria-expanded="false".
 *  - One click opens (`.nav-open` + aria-expanded="true"); clicking again closes.
 *  - Clicking a `.nav-links a`, pressing Escape, or resizing to `>=900px` closes.
 *  - Idempotent: calling `initMobileNav` again does NOT add duplicate listeners,
 *    so a single hamburger click still toggles exactly once.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { loadScriptModule, readPage } from "./helpers.mjs";

const SITE_URL = "https://naufalnabila.my.id/";

/**
 * Build a fresh jsdom window whose <body> contains the canonical nav markup
 * from partials/_header.html (a `<nav id="navbar">` with `.nav-toggle` and
 * `.nav-links`). nav.js runs its IIFE — including initMobileNav(navbar) — on load.
 *
 * @param {string} [bodyHtml] - override body markup (defaults to the header partial)
 * @returns {{ win: Window, navbar: HTMLElement, btn: HTMLElement | null }}
 */
function makeNavWindow(bodyHtml) {
  const headerMarkup = bodyHtml ?? readPage("partials/_header.html");
  const html = `<!DOCTYPE html><html><head></head><body>${headerMarkup}</body></html>`;
  const win = loadScriptModule("assets/js/nav.js", { html, url: SITE_URL });
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

// ---------------------------------------------------------------------------
// Deterministic baseline tests (one per acceptance criterion of Requirement 7)
// ---------------------------------------------------------------------------

test("the header fixture exposes the mobile-nav API and required elements", () => {
  const { win, navbar, btn } = makeNavWindow();
  assert.ok(navbar, "#navbar must exist in the fixture");
  assert.ok(btn, ".nav-toggle must exist in the header partial");
  assert.ok(navbar.querySelector(".nav-links"), ".nav-links must exist in the header partial");
  assert.equal(typeof win.__nav?.initMobileNav, "function", "window.__nav.initMobileNav must be exposed");
});

test("7.1 initial state after init is closed (no .nav-open, aria-expanded=false)", () => {
  const { navbar, btn } = makeNavWindow();
  assert.equal(isOpen(navbar), false);
  assert.equal(aria(btn), "false");
});

test("7.2 one click opens the menu (.nav-open + aria-expanded=true)", () => {
  const { win, navbar, btn } = makeNavWindow();
  clickToggle(win, btn);
  assert.equal(isOpen(navbar), true);
  assert.equal(aria(btn), "true");
});

test("7.3 clicking again closes the menu", () => {
  const { win, navbar, btn } = makeNavWindow();
  clickToggle(win, btn); // open
  clickToggle(win, btn); // close
  assert.equal(isOpen(navbar), false);
  assert.equal(aria(btn), "false");
});

test("7.4 clicking a .nav-links link closes the menu", () => {
  const { win, navbar, btn } = makeNavWindow();
  clickToggle(win, btn); // open
  assert.equal(isOpen(navbar), true);
  const link = navbar.querySelector(".nav-links a");
  link.dispatchEvent(new win.Event("click", { bubbles: true, cancelable: true }));
  assert.equal(isOpen(navbar), false);
  assert.equal(aria(btn), "false");
});

test("7.4 pressing Escape closes the menu", () => {
  const { win, navbar, btn } = makeNavWindow();
  clickToggle(win, btn); // open
  pressEscape(win);
  assert.equal(isOpen(navbar), false);
  assert.equal(aria(btn), "false");
});

test("7.4 resizing to >=900px closes the menu", () => {
  const { win, navbar, btn } = makeNavWindow();
  clickToggle(win, btn); // open
  resizeTo(win, 900);
  assert.equal(isOpen(navbar), false);
  assert.equal(aria(btn), "false");
});

test("7.4 resizing to <900px does NOT change the menu state", () => {
  const { win, navbar, btn } = makeNavWindow();
  clickToggle(win, btn); // open
  resizeTo(win, 600);
  assert.equal(isOpen(navbar), true, "a mobile-width resize must not close an open menu");
  assert.equal(aria(btn), "true");
});

test("7.5 calling initMobileNav twice does not double-bind: one click toggles exactly once", () => {
  const { win, navbar, btn } = makeNavWindow();
  // nav.js already ran initMobileNav(navbar) inside its IIFE. Call it again.
  win.__nav.initMobileNav(navbar);
  assert.equal(isOpen(navbar), false, "re-init must not change state");
  // A single click should produce a single net toggle -> OPEN (not double-toggled back to closed).
  clickToggle(win, btn);
  assert.equal(isOpen(navbar), true, "one click after re-init must open exactly once");
  assert.equal(aria(btn), "true");
});

test("7.6 initMobileNav on a navbar without .nav-toggle is a no-op (no throw, no state change)", () => {
  const noToggle = `<nav id="navbar"><div class="nav-container">
    <a href="/" class="logo">Naufal<span>.</span></a>
    <div class="nav-right"><ul class="nav-links" id="nav-links"><li><a href="/services/">Services</a></li></ul></div>
  </div></nav>`;
  const { win, navbar } = makeNavWindow(noToggle);
  assert.doesNotThrow(() => win.__nav.initMobileNav(navbar));
  assert.equal(navbar.classList.contains("nav-open"), false);
  assert.equal(navbar.querySelector(".nav-toggle"), null);
});

// ---------------------------------------------------------------------------
// Property 13 — randomized action sequences vs. a reference reducer.
// ---------------------------------------------------------------------------

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

test("Property 13: open/closed state always tracks the expected reduced state", () => {
  fc.assert(
    fc.property(fc.array(actionArb, { minLength: 1, maxLength: 15 }), (actions) => {
      const { win, navbar, btn } = makeNavWindow();

      // Invariant after init: closed and aria in sync.
      let expected = false;
      assert.equal(isOpen(navbar), expected);
      assert.equal(aria(btn), "false");

      for (const action of actions) {
        applyAction(win, navbar, btn, action);
        expected = nextExpected(expected, action);

        assert.equal(
          isOpen(navbar),
          expected,
          `after action ${action.t} expected open=${expected}`
        );
        // aria-expanded must always mirror the open/closed state.
        assert.equal(aria(btn), expected ? "true" : "false");
      }
    }),
    { numRuns: 100 }
  );
});
