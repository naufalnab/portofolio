/**
 * Enumerative correctness test over the two service ID<->EN page pairs.
 *
 * Property 19 — Price parity across Pasangan_Halaman
 *   For each service pair in PAGE_PAIRS (slug "layanan-website" and
 *   "layanan-video-ai"):
 *     - the MULTISET of price tokens (currency symbol + numeric value, e.g.
 *       "Rp 2.500.000") found in the page's visible text is IDENTICAL between
 *       the Halaman_ID and the Halaman_EN; AND
 *     - the `Service` JSON-LD `OfferCatalog` `price` / `priceCurrency` values
 *       are identical between the pair.
 *
 *   Prices must NOT be translated/localized — the numbers and currency stay the
 *   same on both locales (only surrounding labels may differ).
 *
 * The relevant page set is small and closed (two pairs), so this is a
 * deterministic enumerative test that iterates each pair rather than
 * randomising inputs.
 *
 * Uses only Node's built-in test runner (`node:test` + `node:assert`) plus the
 * shared `loadDom` helper (jsdom) and the canonical `PAGE_PAIRS` fixture.
 * Run with: `node --test tests/pages.price-parity.test.mjs` (needs jsdom).
 *
 * Validates: Requirements 6.5, 8.5
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { loadDom } from "./helpers.mjs";
import { PAGE_PAIRS } from "./fixtures/pages.mjs";

/** The two slugs whose ID/EN pairs carry localized prices that must stay equal. */
const SERVICE_SLUGS = new Set(["layanan-website", "layanan-video-ai"]);

/**
 * The two service pairs from PAGE_PAIRS (filtered to the slugs above).
 * Guarded below so an empty list can never make the suite vacuously pass.
 * @type {ReadonlyArray<{slug: string, id: object, en: object}>}
 */
const SERVICE_PAIRS = PAGE_PAIRS.filter((pair) => SERVICE_SLUGS.has(pair.slug));

/**
 * Matches Indonesian Rupiah amounts like "Rp 2.500.000" / "Rp 750.000" /
 * "Rp 15.000.000": the "Rp" prefix, an optional space, then a 1–3 digit group
 * followed by one or more ".###" thousands groups. Bare integers in the JSON-LD
 * (e.g. "2500000") deliberately do NOT match (no "Rp", no dot separators).
 */
const PRICE_TOKEN_RE = /Rp\s?\d{1,3}(?:\.\d{3})+/g;

/**
 * Extract every visible price token from a page's body text, returned as a
 * SORTED array so it can be compared as a multiset (order-independent, but
 * duplicates preserved).
 * @param {Document} doc
 * @returns {string[]} sorted price tokens, normalised to a single space after "Rp"
 */
function visiblePriceMultiset(doc) {
  const text = doc.body.textContent || "";
  const matches = text.match(PRICE_TOKEN_RE) || [];
  // Normalise "Rp2.500.000" / "Rp 2.500.000" to a canonical "Rp 2.500.000" so a
  // stray missing/extra space can't masquerade as a real price mismatch.
  return matches.map((t) => t.replace(/^Rp\s?/, "Rp ")).sort();
}

/**
 * Whether a parsed JSON-LD object is a schema.org Service. Tolerates `@type`
 * being either a string ("Service") or an array that includes "Service".
 * @param {object} block
 * @returns {boolean}
 */
function isServiceBlock(block) {
  if (!block || typeof block !== "object") return false;
  const t = block["@type"];
  return Array.isArray(t) ? t.includes("Service") : t === "Service";
}

/**
 * Parse the single `Service` JSON-LD block on a page and return its
 * OfferCatalog offers as a SORTED array of `{price, priceCurrency}` objects,
 * so the two locales can be compared as a multiset.
 * @param {Document} doc
 * @param {string} file - page file path (for failure messages)
 * @returns {Array<{price: unknown, priceCurrency: unknown}>}
 */
function offerCatalogEntries(doc, file) {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const services = [];
  scripts.forEach((s, i) => {
    let obj;
    assert.doesNotThrow(() => {
      obj = JSON.parse(s.textContent);
    }, `${file}: JSON-LD block #${i} must JSON.parse successfully`);
    if (isServiceBlock(obj)) services.push(obj);
  });

  assert.equal(
    services.length,
    1,
    `${file}: expected exactly one Service JSON-LD block, got ${services.length}`,
  );

  const catalog = services[0].hasOfferCatalog;
  assert.ok(
    catalog && typeof catalog === "object",
    `${file}: Service.hasOfferCatalog must be a non-null object`,
  );

  const items = catalog.itemListElement;
  assert.ok(
    Array.isArray(items) && items.length > 0,
    `${file}: OfferCatalog.itemListElement must be a non-empty array`,
  );

  return items
    .map((offer) => ({ price: offer.price, priceCurrency: offer.priceCurrency }))
    .sort((a, b) =>
      `${a.priceCurrency} ${a.price}`.localeCompare(`${b.priceCurrency} ${b.price}`),
    );
}

// ---------------------------------------------------------------------------
// Guard: the fixture must actually contain the two service pairs.
// ---------------------------------------------------------------------------

test("Property 19: PAGE_PAIRS contains exactly the two service pairs", () => {
  assert.equal(
    SERVICE_PAIRS.length,
    2,
    `expected exactly 2 service pairs (layanan-website, layanan-video-ai), got ${SERVICE_PAIRS.length}`,
  );
  for (const pair of SERVICE_PAIRS) {
    assert.ok(pair.id && pair.id.file, `pair ${pair.slug} must have an ID page file`);
    assert.ok(pair.en && pair.en.file, `pair ${pair.slug} must have an EN page file`);
  }
});

// ---------------------------------------------------------------------------
// Property 19 — visible price-token parity
// ---------------------------------------------------------------------------

for (const pair of SERVICE_PAIRS) {
  test(`Property 19: visible price tokens identical between ID and EN for "${pair.slug}"`, () => {
    const idDoc = loadDom(pair.id.file);
    const enDoc = loadDom(pair.en.file);

    const idPrices = visiblePriceMultiset(idDoc);
    const enPrices = visiblePriceMultiset(enDoc);

    // Sanity: both pages must actually contain price tokens, otherwise the
    // parity check would pass vacuously.
    assert.ok(
      idPrices.length > 0,
      `${pair.id.file}: expected at least one visible "Rp …" price token`,
    );

    assert.deepEqual(
      idPrices,
      enPrices,
      `Price-token multiset mismatch for "${pair.slug}":\n` +
        `  ID (${pair.id.file}): ${JSON.stringify(idPrices)}\n` +
        `  EN (${pair.en.file}): ${JSON.stringify(enPrices)}`,
    );
  });
}

// ---------------------------------------------------------------------------
// Property 19 — JSON-LD OfferCatalog price/priceCurrency parity
// ---------------------------------------------------------------------------

for (const pair of SERVICE_PAIRS) {
  test(`Property 19: JSON-LD OfferCatalog price/priceCurrency identical between ID and EN for "${pair.slug}"`, () => {
    const idDoc = loadDom(pair.id.file);
    const enDoc = loadDom(pair.en.file);

    const idOffers = offerCatalogEntries(idDoc, pair.id.file);
    const enOffers = offerCatalogEntries(enDoc, pair.en.file);

    assert.deepEqual(
      idOffers,
      enOffers,
      `OfferCatalog price/priceCurrency mismatch for "${pair.slug}":\n` +
        `  ID (${pair.id.file}): ${JSON.stringify(idOffers)}\n` +
        `  EN (${pair.en.file}): ${JSON.stringify(enOffers)}`,
    );

    // Every offer must carry a currency (and the spec's IDR currency in
    // particular) so a missing/blank priceCurrency can't slip through.
    for (const offer of idOffers) {
      assert.ok(
        offer.price !== undefined && offer.price !== null && offer.price !== "",
        `${pair.id.file}: every Offer must have a non-empty price`,
      );
      assert.equal(
        offer.priceCurrency,
        "IDR",
        `${pair.id.file}: every Offer priceCurrency must be "IDR", got "${offer.priceCurrency}"`,
      );
    }
  });
}
