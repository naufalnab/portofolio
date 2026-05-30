/**
 * Property 9 — toggleTheme is involutive (idempotent over two calls).
 *
 * Calling window.toggleTheme() twice from any initial theme state must return
 * BOTH documentElement.classList.contains('light-mode') AND localStorage.theme
 * to their original values.
 *
 * Uses Node's built-in test runner + fast-check + the loadScriptModule helper
 * (jsdom). These are dev-only deps and never shipped with the static site.
 *
 * Validates: Requirements 3.3, 3.4 (Property 9)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";

import { loadScriptModule } from "./helpers.mjs";

/**
 * Markup containing the theme toggle button with #theme-icon / #theme-text,
 * mirroring partials/_header.html. theme.js wires its view sync against these
 * elements, so including them exercises the full toggle path.
 */
const THEME_TOGGLE_HTML = `<!DOCTYPE html><html><head></head><body>
  <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
    <span id="theme-icon">☀️</span>
    <span id="theme-text">Light</span>
  </button>
</body></html>`;

/**
 * Load theme.js into a fresh jsdom window and force the initial theme state.
 * @param {"light"|"dark"} initial - the theme to seed before the first toggle
 * @returns {Window} the prepared jsdom window
 */
function loadWithInitialTheme(initial) {
  const window = loadScriptModule("assets/js/theme.js", { html: THEME_TOGGLE_HTML });

  // Force the sampled initial state directly: classList on <html> + persisted
  // localStorage value. This is the state right before the first toggle.
  const root = window.document.documentElement;
  root.classList.toggle("light-mode", initial === "light");
  window.localStorage.setItem("theme", initial);

  return window;
}

/**
 * Snapshot the observable theme state.
 * @param {Window} window
 * @returns {{ hasLight: boolean, theme: string|null }}
 */
function snapshot(window) {
  return {
    hasLight: window.document.documentElement.classList.contains("light-mode"),
    theme: window.localStorage.getItem("theme"),
  };
}

test("Property 9: toggleTheme twice is involutive over random initial state", () => {
  fc.assert(
    fc.property(fc.constantFrom("light", "dark"), (initial) => {
      const window = loadWithInitialTheme(initial);

      const state0 = snapshot(window);

      window.toggleTheme();
      window.toggleTheme();

      const state2 = snapshot(window);

      assert.deepEqual(
        state2,
        state0,
        `toggling twice from "${initial}" should restore the original state`
      );
    }),
    { numRuns: 100 }
  );
});

test("toggleTheme: deterministic dark -> light -> dark round trip", () => {
  const window = loadWithInitialTheme("dark");
  const root = window.document.documentElement;

  // Start: dark
  assert.equal(root.classList.contains("light-mode"), false);
  assert.equal(window.localStorage.getItem("theme"), "dark");

  // First toggle -> light
  window.toggleTheme();
  assert.equal(root.classList.contains("light-mode"), true);
  assert.equal(window.localStorage.getItem("theme"), "light");

  // Second toggle -> back to dark
  window.toggleTheme();
  assert.equal(root.classList.contains("light-mode"), false);
  assert.equal(window.localStorage.getItem("theme"), "dark");
});
