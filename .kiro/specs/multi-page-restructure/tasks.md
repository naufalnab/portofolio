# Implementation Plan: Multi-Page Restructure

## Overview

Implementasi memecah `index.html` single-page menjadi 7 halaman folder-based clean URL + `/404.html`, semua tetap static HTML/CSS/JS vanilla. Strategi berbagi header/footer adalah **duplikasi** dengan `partials/_header.html` & `partials/_footer.html` sebagai source of truth (opsional dirakit oleh `tools/build-pages.mjs`).

Urutan kerja mengikuti _carve-out_ bertahap pada `design.md` → Migration Strategy: (1) refactor fondasi shared (theme.js, nav.js, base/layout/responsive CSS, partials, snippet anti-FOUC), (2) carve section dari `index.html` ke tiap halaman dengan path root-relative `/assets/...?v=8` dan SEO per-halaman, (3) rewrite `index.html` menjadi Home, (4) test enumeratif/PBT atas himpunan 8 halaman.

Implementasi memakai bahasa sesuai design: **HTML + CSS + JavaScript vanilla**. Test opsional memakai **Node + fast-check + jsdom** (devDependency, tidak ikut di-deploy).

Catatan penting eksekusi: banyak task menulis ke file yang sama atau membaca `index.html` lama, jadi urutan/wave di Task Dependency Graph harus dipatuhi — khususnya rewrite `index.html` (Home) dilakukan **setelah** semua section dicarve ke halaman lain.

## Tasks

- [x] 1. Siapkan shared shell (partials) dan harness test
  - [x] 1.1 Buat `partials/_header.html` sebagai source of truth nav
    - Tulis `<nav id="navbar">` tepat satu, dengan `.nav-container`, logo `<a href="/">`, dan `.nav-right`
    - Tambah tombol hamburger `<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">` berisi 3 `.nav-toggle-bar`
    - `.nav-links#nav-links` dengan link cross-page root-relative: Services `/services/`, Process `/services/#process`, Case Studies `/case-studies/`, Founded `/founded/`, dropdown Layanan (`/layanan-website/` + `/layanan-video-ai/`), Packages `/packages/`
    - CTA `<a href="/packages/#contact" class="nav-cta">` dan tombol `.theme-toggle` dengan `#theme-icon`/`#theme-text`
    - Semua link sebagai `<a href>` literal di raw HTML (tanpa injeksi JS)
    - _Requirements: 1.1, 1.2, 1.3, 2.3, 2.4, 7.1_

  - [x] 1.2 Buat `partials/_footer.html` sebagai source of truth footer
    - Tulis tepat satu `<footer>` dengan brand, kolom Explore (link cross-page root-relative ke 7 halaman), Contact (WhatsApp/email `mailto:`/`wa.me`), dan Founded
    - Pastikan seluruh link internal root-relative dan dapat dinavigasi tanpa JavaScript
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [ ]\* 1.3 Set up harness test (Node + fast-check + jsdom)
    - Buat `package.json` (devDependencies: `fast-check`, `jsdom`; script `"test"`) — hanya devDependency, tidak memengaruhi artefak statis yang di-deploy
    - Buat `tests/fixtures/pages.mjs` berisi konstanta `PAGES` dan `NAV_ITEMS` sesuai Data Models di design (sumber kebenaran untuk test enumeratif)
    - Buat `tests/helpers.mjs` (load file HTML → jsdom document, util `normalizePath` mirror untuk test)
    - _Requirements: 8.1_

- [x] 2. Refactor sistem tema untuk anti-FOUC
  - [x] 2.1 Refactor `assets/js/theme.js` menargetkan `documentElement`
    - Ubah target classList dari `body` ke `document.documentElement`
    - `toggleTheme()` membalik `light-mode`, persist `localStorage.theme` `"light"`/`"dark"`, sinkron `#theme-icon`/`#theme-text`
    - Bungkus baca/tulis `localStorage` dengan `try/catch` (default dark, tanpa throw)
    - _Requirements: 3.3, 3.4, 3.5_

  - [x] 2.2 Sesuaikan selector tema di `assets/css/base.css`
    - Ubah selector `body.light-mode` → `.light-mode` / `html.light-mode` agar konsisten dengan class di `documentElement`
    - Verifikasi seluruh variabel tema light masih ter-apply saat class ada di `<html>`
    - _Requirements: 3.1, 3.2_

  - [x] 2.3 Buat snippet inline anti-FOUC sebagai source of truth
    - Buat `partials/_theme-init.html` berisi script inline sinkron `(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.add('light-mode');}}catch(e){}})();`
    - Snippet ini akan disisipkan di `<head>` setiap halaman **sebelum** `<link rel="stylesheet">` pertama
    - _Requirements: 3.1, 3.2, 3.5_

  - [ ]\* 2.4 Tulis property test untuk `toggleTheme`
    - **Property 9: Idempotensi toggle tema (involutif)** — `toggleTheme(); toggleTheme();` mengembalikan `html.classList` dan `localStorage.theme` ke nilai semula (jsdom + fast-check atas state awal acak)
    - **Validates: Requirements 3.3, 3.4**

- [x] 3. Refactor modul navigasi (`nav.js`) dan CSS nav
  - [x] 3.1 Refactor `assets/js/nav.js`
    - Pertahankan `.scrolled` state; tambah `normalizePath(p)` (buang hash/query, `""`→`"/"`, trailing slash untuk non-`.html`)
    - Tambah `setActiveNav(navRoot, currentPath)`: tepat satu top-level `.active`+`aria-current="page"`, induk dropdown `.active` (tanpa `aria-current`), nol bila path tak terdaftar
    - Tambah `initMobileNav(navRoot)`: toggle `.nav-open`+`aria-expanded`, tutup saat klik link/Escape/resize `>=900px`, guard `dataset.bound`, no-op bila `.nav-toggle`/`.nav-links` tidak ada
    - Panggil `setActiveNav` + `initMobileNav` di IIFE dan expose `window.__nav = { normalizePath, setActiveNav, initMobileNav }` untuk testing
    - _Requirements: 2.2, 2.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 3.2 Tambah styling active-state + hamburger di `assets/css/layout.css`
    - `.nav-links a.active` / `.nav-dropdown > a.active` (warna accent + underline gradient)
    - `.nav-toggle` (default `display:none`) + `.nav-toggle-bar`
    - _Requirements: 2.2, 7.1_

  - [x] 3.3 Sesuaikan `assets/css/responsive.css` untuk hamburger
    - Pada `@media (max-width: 900px)`: tampilkan `.nav-toggle`, ubah `.nav-links` jadi panel (`display:none` default), `#navbar.nav-open .nav-links`/`.nav-cta` tampil, animasi bar→X; selaraskan agar tidak bertabrakan dengan aturan lama `.nav-links/.nav-cta { display:none }`
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ]\* 3.4 Tulis property test untuk `normalizePath`
    - **Property 10: `normalizePath` idempoten & deterministik** — `normalizePath(normalizePath(s)) === normalizePath(s)` untuk string `s` acak (fast-check)
    - **Validates: Requirements 2.2**

  - [ ]\* 3.5 Tulis property test untuk `setActiveNav`
    - **Property 4: Active nav cocok dengan halaman** — fixture nav (jsdom), untuk `currentPath` acak dari path valid → tepat satu `aria-current="page"` pada path yang cocok; untuk path asing (mis. `/404.html`) → nol
    - **Validates: Requirements 2.2**

  - [ ]\* 3.6 Tulis property test untuk `initMobileNav`
    - **Property 13: Mobile hamburger toggle benar** — state awal tertutup; klik → buka; klik lagi → tutup; klik link/Escape/resize`>=900px` → tutup; `initMobileNav` dua kali tidak menambah listener ganda (fast-check atas urutan aksi acak)
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**

- [x] 4. Checkpoint — fondasi shared shell, tema, dan navigasi
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Carve section dari `index.html` ke halaman terpisah
  - [x] 5.1 Buat `services/index.html`
    - Potong-tempel section `#services` + `#process` dari `index.html` apa adanya
    - Sisipkan `<head>` (anti-FOUC inline, CSS/JS core root-relative `?v=8`), header & footer dari partials
    - SEO unik: `<title>`, `meta[name=description]` (50–160 char), `link[rel=canonical]` absolut `/services/`, OG lengkap (`og:url`=canonical)
    - Promosikan heading pertama jadi `<h1>` tunggal; jaga hierarki heading tanpa lompat; pastikan anchor Process aktif sebagai target `#process`
    - _Requirements: 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 6.4, 8.2, 8.4_

  - [x] 5.2 Buat `case-studies/index.html`
    - Potong-tempel section `#projects` + `#clients`; tambahkan `toggles.js` (untuk `toggleClients`) di samping JS core
    - Head root-relative `?v=8` + anti-FOUC + header/footer partials; SEO unik + OG; satu `<h1>`
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2, 6.1, 6.2, 6.4_

  - [x] 5.3 Buat `founded/index.html`
    - Potong-tempel section `#founded` + `#skills` + `#experience` + `#credentials`; tambahkan `toggles.js` (untuk `toggleCerts`)
    - Head root-relative `?v=8` + anti-FOUC + header/footer partials; SEO unik + OG; satu `<h1>`
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.2, 6.1, 6.2, 6.4_

  - [x] 5.4 Buat `layanan-website/index.html`
    - Potong-tempel section `#jasa-website`; tambahkan `services-commercial.css` + `services.js`
    - Pindahkan JSON-LD `Service` "Pembuatan Website" ke halaman ini sebagai `<script type="application/ld+json">` (tepat satu, valid parse)
    - Head root-relative `?v=8` + anti-FOUC + header/footer partials; SEO unik + OG; satu `<h1>`
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 6.1, 6.2_

  - [x] 5.5 Buat `layanan-video-ai/index.html`
    - Potong-tempel section `#jasa-video-ai`; tambahkan `services-commercial.css` + `services.js`
    - Pindahkan JSON-LD `Service` "Pembuatan Video AI" ke halaman ini (tepat satu, valid parse)
    - Head root-relative `?v=8` + anti-FOUC + header/footer partials; SEO unik + OG; satu `<h1>`
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 6.1, 6.2_

  - [x] 5.6 Buat `packages/index.html`
    - Potong-tempel section `#packages` + `#contact`; JS/CSS core saja (tanpa `hero.css`/`services-*`/`toggles.js`)
    - Head root-relative `?v=8` + anti-FOUC + header/footer partials; SEO unik + OG; satu `<h1>`; CTA `#contact` aktif sebagai target
    - _Requirements: 4.1, 4.2, 4.5, 5.1, 5.2, 6.1, 6.2, 6.4_

  - [x] 5.7 Buat `404.html`
    - Head dengan anti-FOUC + tepat satu `<meta name="robots" content="noindex">`; header/footer partials; aset root-relative `?v=8`
    - Konten: satu `<h1>` "404 …" + tepat satu link "Kembali ke Home" `href="/"`
    - _Requirements: 6.3, 8.2_

  - [x] 5.8 Rewrite `index.html` menjadi Home (Hero + About)
    - Sisakan section `#home` (Hero) + `#about`; hapus section yang sudah dipindah ke halaman lain (tidak ada duplikasi/section hilang)
    - Konversi semua aset ke root-relative `?v=8`; muat `hero.css` (hanya di Home); sisipkan anti-FOUC inline + header/footer partials
    - Ganti seluruh anchor lama (`#services`, `#process`, dst.) ke URL cross-page (mis. `/services/#process`) agar tidak ada anchor mati
    - SEO unik + OG; promosikan heading Hero jadi `<h1>` tunggal
    - _Requirements: 4.1, 4.2, 4.5, 5.1, 5.2, 6.1, 6.2, 6.4, 8.3_

- [x] 6. Checkpoint — seluruh halaman ter-carve & ter-assemble
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Artefak SEO & tooling pendukung
  - [ ]\* 7.1 Buat `sitemap.xml` + `robots.txt`
    - `sitemap.xml` memuat 7 URL kanonik absolut; `robots.txt` menunjuk ke sitemap (artefak statis murni)
    - _Requirements: 8.2, 8.3_

  - [ ]\* 7.2 Buat `tools/build-pages.mjs` (opsional, zero npm deps)
    - Hanya pakai `node:fs`/`node:path`; rakit tiap halaman dari `partials/_header.html`, `partials/_footer.html`, snippet anti-FOUC, dan konten per halaman
    - Output deterministik & idempoten (byte-identik bila dijalankan ulang), tanpa menyisakan placeholder `{{...}}`; tidak menambah dependensi runtime pada artefak yang di-deploy
    - _Requirements: 1.4, 8.5_

- [ ] 8. Test korektnes enumeratif atas himpunan 8 halaman
  - [ ]\* 8.1 Tulis test struktur dasar tiap halaman
    - **Property 1: Tepat satu nav & footer** — `count(p, "nav#navbar")=1` ∧ `count(p, "footer")=1` ∀ p ∈ PAGES
    - **Property 2: Tepat satu H1 per halaman** — `count(p, "h1")=1` dan teksnya non-kosong setelah trim
    - **Validates: Requirements 1.1, 6.1**

  - [ ]\* 8.2 Tulis test konsistensi shared shell
    - **Property 11: Header/footer konsisten lintas halaman** — markup nav & footer (di luar atribut active runtime `.active`/`aria-current`) identik byte-per-byte di seluruh `PAGES`
    - **Validates: Requirements 1.2**

  - [ ]\* 8.3 Tulis test pemuatan aset per halaman
    - **Property 6: Aset wajib termuat, tanpa aset berlebih** — semua CSS+JS core ter-link; Layanan memuat `services-commercial.css`+`services.js`; Case Studies/Founded memuat `toggles.js`; `hero.css` hanya Home; tidak ada aset berlebih (mis. `services.js` di Home); semua path root-relative `/assets/`
    - **Validates: Requirements 4.1, 4.3, 4.4, 4.5**

  - [ ]\* 8.4 Tulis test SEO meta & JSON-LD
    - **Property 7: SEO meta unik & lengkap** — `title` & `canonical` unik antar halaman; `description` 50–160 char; OG (`og:title/description/url/image/type`) ada; `canonical` absolut cocok `p.path`; `og:url`=canonical
    - **Property 8: JSON-LD tepat sasaran** — schema `Service` "Pembuatan Website" hanya di `/layanan-website/`, "Pembuatan Video AI" hanya di `/layanan-video-ai/`, tepat satu per halaman, tidak ada di halaman lain
    - **Validates: Requirements 5.1, 5.2, 5.3**

  - [ ]\* 8.5 Tulis test resolusi link internal
    - **Property 3: Semua link internal resolve** — `normalizePath(link) ∈ {normalizePath(q.path)}` untuk semua link internal (lihat Algoritma 5)
    - **Property 12: Tidak ada anchor mati ke section yang sudah pindah** — tidak ada `#section` yang menunjuk ke ID yang kini di halaman lain (mis. Home harus `/services/#process`, bukan `#process`)
    - **Validates: Requirements 2.1**

  - [ ]\* 8.6 Tulis test anti-FOUC ordering
    - **Property 5: Tema persist lintas navigasi tanpa flash** — di tiap `<head>`, script inline theme-init muncul sebelum `<link rel="stylesheet">` pertama; bila `localStorage.theme="light"` maka `html.classList.contains("light-mode")` true (jsdom)
    - **Validates: Requirements 3.1**

- [x] 9. Checkpoint final — seluruh test lulus
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tugas bertanda `*` (mis. 1.3, 2.4, 3.4–3.6, 7.1, 7.2, 8.1–8.6) bersifat opsional dan dapat dilewati untuk MVP cepat; tugas inti implementasi tidak ditandai opsional.
- Test PBT (fast-check + jsdom) memvalidasi properti universal (PROP-3,4,5,9,10,13); test enumeratif atas himpunan 8 halaman memvalidasi PROP-1,2,6,7,8,11,12.
- Setiap halaman dicarve **persis apa adanya** (potong-tempel) untuk mencegah kehilangan konten; rewrite `index.html` (5.8) dilakukan terakhir agar tidak menghapus sumber section sebelum dicopy.
- Aset di-bump `?v=7` → `?v=8` sekaligus dijadikan root-relative `/assets/...`; situs harus disajikan dari root domain.
- **Manual smoke test checklist (di luar scope coding agent, dijalankan manual oleh pemilik):**
  - Jalankan static server lokal (mis. `npx serve .`), klik tiap item nav dari tiap halaman — pastikan tidak ada 404 & active state benar.
  - Set tema light lalu navigasi cepat antar halaman — pastikan tidak ada kedip dark→light (anti-FOUC).
  - Uji hamburger di viewport `<900px`: buka/tutup, klik link menutup, Escape menutup, resize `>=900px` menutup.
  - Lighthouse SEO per halaman (title/description/canonical terdeteksi, link crawlable).
  - Validasi JSON-LD via Google Rich Results Test pada 2 halaman Layanan.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3.1", "3.2", "3.3"]
    },
    {
      "id": 1,
      "tasks": [
        "2.4",
        "3.4",
        "3.5",
        "3.6",
        "5.1",
        "5.2",
        "5.3",
        "5.4",
        "5.5",
        "5.6",
        "5.7",
        "7.1",
        "7.2"
      ]
    },
    { "id": 2, "tasks": ["5.8"] },
    { "id": 3, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] }
  ]
}
```
