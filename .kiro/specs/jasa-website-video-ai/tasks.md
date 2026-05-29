# Implementation Plan: Jasa Pembuatan Website & Video AI

## Overview

Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step. Focus ONLY on tasks that involve writing, modifying, or testing code.

Implementasi dipecah jadi sembilan kelompok besar: scaffolding file baru → implementasi modul JS murni → opsional PBT → checkpoint → CSS komponen → CSS responsif & nav dropdown → markup HTML & SEO → opsional integration test → checkpoint final. Setiap perubahan ke `index.html` dipisah ke sub-task tersendiri agar tidak ada konflik tulis paralel ke file yang sama.

Bahasa implementasi: **JavaScript vanilla (ES2015+)** dan **CSS** (sesuai stack existing). Tidak ada framework atau bundler runtime.

## Tasks

- [x] 1. Project scaffolding (file baru & direktori)
  - [x] 1.1 Buat direktori `assets/images/showcase/` dan tambahkan file `.gitkeep` agar direktori ter-track meski belum ada gambar
    - Path baru: `assets/images/showcase/.gitkeep`
    - _Requirements: 3.1, 3.5, 11.8_
  - [x] 1.2 Buat scaffold file `assets/css/services-commercial.css`
    - Tulis hanya header komentar `/* Service Commercial — pricing tiers, showcase, FAQ */` dan blok kosong `.service-commercial { background: var(--bg); }` plus selector `.service-commercial + .service-commercial { background: var(--bg-alt); }` sebagai placeholder
    - _Requirements: 7.3, 11.2_
  - [x] 1.3 Buat scaffold file `assets/js/services.js`
    - Pola IIFE `(function () { 'use strict'; const WHATSAPP_PHONE = '6282328591004'; window.__services = {}; })();` tanpa logika apa pun, semata-mata supaya file ada untuk wiring `<script>` di langkah berikutnya
    - _Requirements: 5.5, 11.1, 11.5_

- [x] 2. Implementasi modul JS `services.js`
  - [x] 2.1 Implementasikan `buildWaUrl(phone, service, tier, price)` sebagai fungsi murni
    - Map `service` ke label Bahasa Indonesia: `"website"` → `"Pembuatan Website"`, `"video-ai"` → `"Pembuatan Video AI"`, default → `"Layanan"`
    - Rakit pesan: `"Halo Mas Naufal, saya tertarik dengan paket {tier} untuk layanan {serviceLabel} ({price}). Bisa minta info lebih lanjut?"`
    - Encode pakai `encodeURIComponent` lalu return `"https://wa.me/" + phone + "?text=" + encoded`
    - Tidak boleh menyentuh DOM, melempar error, atau melakukan I/O
    - Expose lewat `window.__services.buildWaUrl` untuk testing
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6_
  - [x] 2.2 Implementasikan utility `formatTimeline(days)`
    - `days < 7` → `"{days} hari"`
    - `days % 7 === 0 && days < 28` → `"{days/7} minggu"`
    - `days >= 28 && days % 30 === 0` → `"{days/30} bulan"`
    - else → `"~{Math.round(days/7)} minggu"`
    - Expose lewat `window.__services.formatTimeline`
    - _Requirements: 2.4_
  - [x] 2.3 Implementasikan `initServiceCtaHandlers(root)` dengan idempotency, validasi data attribute, popup-blocker fallback
    - Selektor `[data-cta="service"]`, skip jika `dataset.ctaAttached === "true"`, set `dataset.ctaAttached = "true"` setelah attach
    - Pada click: `event.preventDefault()`, validasi `dataset.service`, `dataset.tier`, `dataset.price`. Jika salah satu kosong/missing, panggil `console.warn('[services] Missing data attributes on CTA', btn)` lalu `window.open("https://wa.me/" + WHATSAPP_PHONE, "_blank", "noopener,noreferrer")` dan return.
    - Jika valid, panggil `buildWaUrl` lalu `const opened = window.open(url, "_blank", "noopener,noreferrer")`. Kalau `opened === null`, fallback ke `window.location.href = url`
    - Panggil `initServiceCtaHandlers(document)` di akhir IIFE
    - _Requirements: 1.1, 1.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 3. Property-based testing (opsional, MVP boleh skip)
  - [ ]* 3.1 Setup tooling test minimal: `package.json` (devDependencies `vitest`, `fast-check`, `jsdom`), `vitest.config.js` dengan `environment: 'jsdom'`, dan helper `tests/load-services.js` yang `eval`-kan isi `assets/js/services.js` ke dalam `globalThis` lalu return `window.__services`
    - _Requirements: 11.1 (devDependency saja, tidak masuk production bundle)_
  - [ ]* 3.2 Tulis property test untuk `buildWaUrl` — PROP-1 & PROP-4 (URL absolut HTTPS + tidak ada karakter unsafe lolos)
    - **Property 1: URL absolut HTTPS yang valid** — `url.startsWith("https://wa.me/" + phone + "?text=")`
    - **Property 4: Tidak ada karakter unsafe** — `!/[ "&=?]/.test(url.split("?text=")[1])`
    - Generator: `validPhone = fc.stringMatching(/^\d{10,15}$/)`, `validService = fc.constantFrom('website','video-ai')`, `validTier = fc.constantFrom('Basic','Pro','Custom')`, `validPrice = fc.string({ minLength: 1, maxLength: 30 })`
    - **Validates: Requirements 1.1, 1.3**
  - [ ]* 3.3 Tulis property test untuk `buildWaUrl` — PROP-2 (round-trip decode)
    - **Property 2: Round-trip decode** — `decodeURIComponent(url.split("?text=")[1])` harus equal dengan pesan harapan yang dibuat dari `tier`, `serviceLabel(service)`, dan `price`
    - **Validates: Requirements 1.4_
  - [ ]* 3.4 Tulis property test untuk `buildWaUrl` — PROP-3 (pesan memuat tier, service label, price)
    - **Property 3: Pesan memuat konteks** — `decoded.includes(tier) && decoded.includes(serviceLabel(service)) && decoded.includes(price)`
    - **Validates: Requirements 1.2_
  - [ ]* 3.5 Tulis property test untuk `formatTimeline` — PROP-7 (monoton)
    - **Property 7: formatTimeline monoton** — untuk `d1 < d2` keduanya integer positif, `parseTimelineDays(formatTimeline(d1)) <= parseTimelineDays(formatTimeline(d2))`. Tulis helper kecil `parseTimelineDays(label)` di test file yang membalik konversi label → estimasi hari.
    - Generator: `fc.tuple(fc.integer({min:1,max:1000}), fc.integer({min:1,max:1000}))` lalu sortir `[d1, d2]`
    - **Validates: Requirements 2.4_

- [x] 4. Checkpoint — modul JS terverifikasi
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implementasi `assets/css/services-commercial.css`
  - [x] 5.1 Implementasikan tier-grid + tier-card + tier-flag + tier-price + tier-deliverables + tier-cta
    - Grid 3 kolom desktop, `.tier-card.featured` dengan elevasi `translateY(-4px)`, badge "Paling populer" via `.tier-flag`
    - Gunakan token `var(--surface)`, `var(--border)`, `var(--accent)`, `var(--gradient)`, `var(--radius-lg)`, `var(--shadow)`
    - List `.tier-deliverables li::before` dengan content `'✓'` warna `var(--accent)`
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 9.1, 10.2, 11.2, 11.6_
  - [x] 5.2 Implementasikan service process strip `.svc-flow` & `.svc-step`
    - Grid 4 kolom di desktop. `.svc-step-num` dengan `background-clip: text` ke `var(--gradient)`
    - _Requirements: 7.5, 9.1, 11.2_
  - [x] 5.3 Implementasikan showcase gallery `.showcase-grid` & `.showcase-card`
    - `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
    - `.showcase-thumb { aspect-ratio: 16/10; object-fit: cover; background: var(--bg-soft); }`
    - Variant `.showcase-card[data-format="vertical"] .showcase-thumb { aspect-ratio: 9/16; }`
    - Gunakan `loading="lazy"` dari sisi markup; sisi CSS: pastikan layout tidak kolaps saat thumbnail belum load (`aspect-ratio` cukup)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 11.8_
  - [x] 5.4 Implementasikan FAQ accordion styles native `<details>`
    - `.faq-list`, `.faq-item`, `.faq-q`, `.faq-a`
    - Hilangkan marker default: `.faq-q::-webkit-details-marker { display: none; }`, custom `+` / `−` via `::after`
    - Highlight border ketika `[open]`: `border-color: color-mix(in srgb, var(--accent) 30%, var(--border))`
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 10.4, 11.2_

- [x] 6. Responsive & navigation dropdown styling
  - [x] 6.1 Tambah breakpoint baru di `assets/css/responsive.css`
    - `@media (max-width: 900px)` — `.tier-grid { grid-template-columns: 1fr; }`, `.tier-card.featured { transform: none; }`, `.svc-flow { grid-template-columns: repeat(2, 1fr); }`
    - `@media (max-width: 540px)` — `.svc-flow { grid-template-columns: 1fr; }`, `.tier-price-amount { font-size: 1.6rem; }`
    - Sub-link nav-dropdown tetap hidden di mobile mengikuti pola `.nav-links { display: none; }` existing
    - Pastikan setiap `.tier-cta` punya `min-height: 44px` (boleh ditambah di `services-commercial.css` saja, tapi konfirmasi via responsive juga)
    - _Requirements: 6.4, 9.1, 9.2, 9.3, 9.4, 9.5, 11.3_
  - [x] 6.2 Tambah styling `.nav-dropdown` di `assets/css/layout.css` (extend, jangan rewrite)
    - `.nav-dropdown { position: relative; }`, `.nav-dropdown-menu { position: absolute; top: 100%; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }`
    - State open via `:hover` dan `:focus-within`: `opacity: 1; pointer-events: auto`
    - Token: `var(--surface)`, `var(--border)`, `var(--radius)`, `var(--shadow)`
    - Disembunyikan di `<= 900px` mengikuti pola `.nav-links { display: none; }` (boleh ditambah di langkah 6.1)
    - _Requirements: 6.1, 6.2, 6.5, 10.2, 11.4_

- [x] 7. Markup HTML, SEO, dan integrasi (`index.html`)
  - [x] 7.1 Update `<head>` index.html — `lang`, title, description, OG, Twitter, CSS link baru, version bump, script tag baru
    - `<html lang="id">`
    - `<title>Naufal Nabila — Jasa Pembuatan Website & Video AI · Indonesia</title>`
    - `<meta name="description" content="Jasa pembuatan website profesional dan video AI untuk bisnis di Indonesia. Paket Basic/Pro/Custom dengan harga transparan, timeline jelas, dan dukungan WhatsApp langsung.">`
    - Tambah `<meta name="keywords">` opsional, `<meta property="og:type|og:url|og:title|og:description|og:image|og:locale=id_ID|og:locale:alternate=en_US">`, `<meta name="twitter:card=summary_large_image|twitter:title|twitter:description|twitter:image">`
    - Bump semua `?v=6` → `?v=7` pada link CSS existing
    - Tambah `<link rel="stylesheet" href="assets/css/services-commercial.css?v=7">` setelah `responsive.css`
    - Tambah `<script src="assets/js/services.js?v=7" defer></script>` di akhir `<head>` atau sebelum `</body>` (konsisten dengan modul JS lain di codebase)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 11.7_
  - [x] 7.2 Tambah markup nav dropdown "Layanan" di `<nav id="navbar">` index.html
    - Sisipkan `<li class="nav-dropdown"><a href="#jasa-website" aria-haspopup="true">Layanan</a><ul class="nav-dropdown-menu"><li><a href="#jasa-website">Website</a></li><li><a href="#jasa-video-ai">Video AI</a></li></ul></li>` di antara `<li>Founded</li>` dan `<li>Packages</li>` di `.nav-links`
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  - [x] 7.3 Tambah section `#jasa-website` di index.html — sebelum section `#packages`, setelah `#credentials`
    - Struktur: `<section class="service-commercial" id="jasa-website"><div class="container">…</div></section>` dengan turunan `section-eyebrow`, `section-title`, `section-subtitle`, `.tier-grid`, `.svc-flow`, `.showcase-grid`, `.faq-list`
    - 3 `.tier-card` (Basic, Pro featured, Custom). Setiap CTA: `<a class="package-cta tier-cta" data-cta="service" data-service="website" data-tier="{Basic|Pro|Custom}" data-price="{label harga}">`
    - 4 `.svc-step`, ≥3 `.showcase-card` (boleh placeholder image), ≥5 `.faq-item` dari `FAQ_WEBSITE` di design
    - Tambah class `fade-in` di wrapper utama untuk dipungut Reveal_Module existing
    - Setiap link eksternal: `target="_blank" rel="noopener noreferrer"`
    - _Requirements: 2.1, 2.3, 2.5, 2.6, 2.7, 2.8, 3.1, 3.2, 3.3, 3.4, 3.5, 4.4, 4.6, 5.3, 7.1, 7.3, 7.4, 7.5, 10.1, 10.3_
  - [x] 7.4 Tambah section `#jasa-video-ai` di index.html — setelah `#jasa-website`, sebelum `#packages`
    - Sama strukturnya dengan 7.3, tetapi `data-service="video-ai"`, harga `Rp 750.000` / `Rp 2.000.000` / `Mulai Rp 5.000.000`, FAQ dari `FAQ_VIDEO_AI` (≥5 item)
    - Tambah satu showcase dengan `data-format="vertical"` agar varian aspect-ratio 9:16 kepakai
    - _Requirements: 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 3.1, 3.2, 3.3, 3.4, 3.5, 4.5, 4.6, 5.3, 7.2, 7.3, 7.4, 7.5, 10.1, 10.3_
  - [x] 7.5 Tambah dua blok JSON-LD `<script type="application/ld+json">` Service di akhir `<body>` index.html
    - Block 1: `serviceType: "Pembuatan Website"`, `provider.name: "Naufal Nabila"`, `areaServed: "Indonesia"`, `hasOfferCatalog` 3 Offer (Basic 2500000 / Pro 6500000 / Custom 15000000), semua `priceCurrency: "IDR"`
    - Block 2: `serviceType: "Pembuatan Video AI"`, struktur sama, harga (Basic 750000 / Pro 2000000 / Custom 5000000)
    - _Requirements: 8.5, 8.6_

- [ ] 8. Integration tests (opsional, untuk PROP-5, PROP-6, PROP-8)
  - [ ]* 8.1 DOM integration test untuk markup contract & idempotency
    - **Property 6: Markup contract — data attributes lengkap** — load `index.html` ke jsdom, untuk setiap `.tier-card .package-cta[data-cta="service"]` assert `dataset.service ∈ {"website","video-ai"}`, `dataset.tier ∈ {"Basic","Pro","Custom"}`, `dataset.price` non-empty
    - **Property 5: initServiceCtaHandlers idempotent** — panggil `initServiceCtaHandlers(document)` dua kali, lalu hitung listener via spy `EventTarget.prototype.addEventListener` atau via flag `dataset.ctaAttached` + counter, assert hanya tepat satu listener per CTA
    - **Validates: Requirements 5.1, 5.2, 5.3**
  - [ ]* 8.2 DOM integration test untuk FAQ collapsed-by-default
    - **Property 8: FAQ collapsed by default** — load `index.html` ke jsdom, setiap `.faq-item` HARUS punya `hasAttribute('open') === false` saat initial render
    - **Validates: Requirements 4.1**
  - [ ]* 8.3 Buat smoke test checklist `tests/SMOKE.md`
    - Daftar manual checks yang dijalankan reviewer sebelum deploy: tier CTA klik buka WhatsApp dengan pesan benar (Basic/Pro/Custom × Web/Video AI = 6 kombinasi), theme toggle dark/light, resize 540/900/1200, semua FAQ buka-tutup, lighthouse target ≥ 90/95/95
    - _Requirements: 1.1, 1.2, 4.1, 9.1, 9.2, 10.2_

- [x] 9. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped untuk MVP cepat (target launch tanpa test runner) — codebase existing memang belum punya test runner, jadi setup vitest + fast-check adalah investasi opsional.
- Setiap task referensi balik ke acceptance criteria spesifik (`Requirements X.Y`) dan/atau correctness property (`Property N`) untuk traceability.
- Property tests fokus pada PROP-1..PROP-4 (`buildWaUrl`) dan PROP-7 (`formatTimeline`) yang memang fungsi murni — paling cocok untuk PBT.
- PROP-5, PROP-6, PROP-8 lebih cocok sebagai DOM integration test karena bergantung pada markup HTML real, bukan sifat fungsi murni.
- Checkpoint task (4 dan 9) memberi titik berhenti natural untuk verifikasi inkremental sebelum lanjut.
- Urutan eksekusi mempertimbangkan konflik tulis ke `index.html`: lima sub-task `7.x` ditulis sekuensial supaya tidak ada dua agen menulis file yang sama bersamaan.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "3.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "5.1", "3.2", "3.3", "3.4"] },
    { "id": 3, "tasks": ["2.3", "5.2", "3.5"] },
    { "id": 4, "tasks": ["5.3", "6.1", "6.2"] },
    { "id": 5, "tasks": ["5.4"] },
    { "id": 6, "tasks": ["7.1"] },
    { "id": 7, "tasks": ["7.2"] },
    { "id": 8, "tasks": ["7.3"] },
    { "id": 9, "tasks": ["7.4"] },
    { "id": 10, "tasks": ["7.5"] },
    { "id": 11, "tasks": ["8.1", "8.2", "8.3"] }
  ]
}
```
