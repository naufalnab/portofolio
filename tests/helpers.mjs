/**
 * Small, robust test helpers for the multi-page-restructure suite.
 *
 * Uses only Node built-ins (node:fs, node:path, node:url) plus the `jsdom`
 * package. These helpers are dev-only and never shipped with the static site.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

// tests/ lives directly under the repo root, so ROOT is one level up.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Absolute path to the repository root (one level up from tests/).
 * @type {string}
 */
export const ROOT = path.resolve(__dirname, "..");

/**
 * Resolve a project-relative file path against the repo root.
 * @param {string} relPath - e.g. "services/index.html" or "/assets/js/nav.js"
 * @returns {string} absolute path under ROOT
 */
function resolveFromRoot(relPath) {
  // Tolerate a leading slash (root-relative asset paths like "/assets/js/nav.js").
  const cleaned = String(relPath).replace(/^\/+/, "");
  return path.resolve(ROOT, cleaned);
}

/**
 * Read an HTML (or any text) file from the project root and return its contents.
 * @param {string} file - path relative to the repo root, e.g. "index.html"
 * @returns {string} the file's UTF-8 contents
 */
export function readPage(file) {
  return readFileSync(resolveFromRoot(file), "utf8");
}

/**
 * Parse a page file with jsdom and return its `document`.
 * @param {string} file - path relative to the repo root, e.g. "services/index.html"
 * @returns {Document} the parsed document
 */
export function loadDom(file) {
  const html = readPage(file);
  const dom = new JSDOM(html, { url: "https://naufalnabila.my.id/" });
  return dom.window.document;
}

/**
 * Load a JS asset file and evaluate it inside a fresh jsdom window context so
 * that any globals it exposes (e.g. `window.__nav`, `window.toggleTheme`)
 * become available on the returned window.
 *
 * The script is run via `runScripts: "outside-only"` + manual injection so the
 * module's IIFE executes against the jsdom window/document.
 *
 * @param {string} jsRelPath - path relative to the repo root, e.g. "assets/js/nav.js"
 * @param {{ html?: string, url?: string }} [options]
 *   - html: initial document markup (defaults to a minimal doc with #navbar)
 *   - url: document URL (controls location.pathname for nav tests)
 * @returns {Window} the jsdom window after the script has executed
 */
export function loadScriptModule(jsRelPath, options = {}) {
  const { html = defaultDom(), url = "https://naufalnabila.my.id/" } = options;
  const dom = new JSDOM(html, { url, runScripts: "outside-only" });
  const code = readPage(jsRelPath);

  // Execute the asset code in the window's script context so that references
  // to `window`, `document`, `localStorage`, etc. resolve to jsdom's globals.
  const script = dom.window.document.createElement("script");
  script.textContent = code;
  dom.window.document.head.appendChild(script);

  return dom.window;
}

/**
 * Minimal default document used by loadScriptModule when no html is supplied.
 * Includes a #navbar shell so nav.js can initialise without throwing.
 * @returns {string}
 */
function defaultDom() {
  return `<!DOCTYPE html><html><head></head><body></body></html>`;
}
