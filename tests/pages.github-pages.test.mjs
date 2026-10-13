/**
 * Regression guard for GitHub Pages project URLs and custom-domain URLs.
 * Uses the actual on-disk files, not helpers.readPage's test-only normalization.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SLUGS = ["", "services", "case-studies", "founded", "packages", "layanan-website", "layanan-video-ai"];
const PAGES = [
  ...["", "en/"].flatMap(locale => SLUGS.map(slug => locale + (slug ? slug + "/index.html" : "index.html"))),
  "404.html", "en/404.html",
  "apply/pixtalase-fullstack/index.html",
  "apply/senior-fullstack-se/index.html",
];

for (const file of PAGES) {
  test("GitHub Pages and custom domain: " + file, () => {
    const html = readFileSync(resolve(ROOT, file), "utf8");
    const basePath = file.endsWith("index.html") ? file.slice(0, -"index.html".length) : file;
    const attributes = [...html.matchAll(/\b(?:href|src|action|poster)\s*=\s*(["'])([^"']*)\1/gi)];
    assert.ok(attributes.length > 0, file + " has links and assets");
    for (const domain of ["https://naufalnab.github.io/portofolio/", "https://naufalnabila.my.id/"]) {
      const pageUrl = new URL(basePath, domain);
      for (const [, , value] of attributes) {
        if (/^(?:#|\/\/|[a-z][a-z0-9+.-]*:)/i.test(value)) continue;
        assert.ok(!value.startsWith("/"), file + ": root-absolute path breaks project Pages: " + value);
        const url = new URL(value, pageUrl);
        assert.ok(url.pathname.startsWith(new URL(domain).pathname),
          file + ": link escaped site root: " + value + " from " + pageUrl);
        if (/\.(?:css|js|jpeg|jpg|png|webp|svg)(?:\?.*)?$/i.test(value)) {
          const fileWithinSite = url.pathname.slice(new URL(domain).pathname.length);
          assert.ok(existsSync(resolve(ROOT, fileWithinSite)),
            file + ": missing asset at " + url);
        }
      }
    }
  });
}
