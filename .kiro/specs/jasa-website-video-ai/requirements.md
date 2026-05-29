# Requirements Document

## Introduction

Dokumen ini menurunkan kebutuhan fungsional dan non-fungsional dari `design.md` untuk fitur **Jasa Pembuatan Website & Video AI**. Tujuannya menambah dua layanan komersial baru ke situs portofolio `naufalnabila.my.id` (Pembuatan Website dan Pembuatan Video AI) sebagai *productized service* dengan tiga tier harga (Basic, Pro, Custom), galeri showcase, FAQ, dan konversi langsung ke WhatsApp.

Audiens utama adalah founder, pemilik UMKM, dan organisasi berbahasa Indonesia yang membutuhkan situs profesional dan video pemasaran berbasis AI tanpa harus menyewa agensi penuh.

Setiap requirement di dokumen ini terhubung balik ke section di `design.md` dan, bila relevan, ke *correctness property* (PROP-N) yang sudah didefinisikan di bagian "Correctness Properties" pada design tersebut.

## Glossary

- **Site**: situs portofolio static `naufalnabila.my.id` berbasis HTML + CSS modular + JavaScript vanilla.
- **Section_Layanan**: kumpulan dua section baru (`#jasa-website` dan `#jasa-video-ai`) yang dideskripsikan di section "Section Layout — Posisi Section Baru" pada design.
- **Tier_Card**: kartu paket harga (Basic, Pro, Custom) sesuai komponen di "Components and Interfaces" pada design.
- **Tier**: salah satu dari nama paket terdefinisi `{"Basic", "Pro", "Custom"}`.
- **Service**: salah satu dari kode layanan terdefinisi `{"website", "video-ai"}`.
- **CTA** (*Call To Action*): tombol `[data-cta="service"]` pada Tier_Card yang memicu konversi ke WhatsApp.
- **Service_Module**: modul JavaScript baru `assets/js/services.js` yang berisi `buildWaUrl` dan `initServiceCtaHandlers`.
- **Prefilled_Message**: pesan WhatsApp Bahasa Indonesia yang otomatis terisi pada parameter query `?text=` URL `wa.me`, mengandung Tier, Service label, dan harga.
- **WhatsApp_Phone**: konstanta nomor WhatsApp `"6282328591004"` (digit-only) sesuai design.
- **Showcase_Gallery**: galeri thumbnail kartu sample karya Website / Video AI sesuai komponen di design.
- **FAQ_Accordion**: daftar pertanyaan-jawaban menggunakan elemen native `<details>`/`<summary>` (tanpa custom JS).
- **Nav_Dropdown**: item navbar "Layanan" yang memunculkan dua sub-link `Website` dan `Video AI` di breakpoint desktop.
- **Featured_Tier**: tepat satu Tier per Service yang ditandai sebagai paket utama (badge "Paling populer", elevasi visual).
- **Reveal_Module**: modul existing `assets/js/reveal.js` yang menambahkan animasi kepada elemen `.fade-in`.
- **Breakpoint_Desktop**: viewport `≥ 900px` sesuai pola responsive existing.
- **Breakpoint_Mobile**: viewport `< 900px` sesuai pola responsive existing.
- **Breakpoint_Small**: viewport `< 540px` sesuai pola responsive existing.
- **JSON_LD**: blok `<script type="application/ld+json">` berisi schema.org `Service` per layanan, sesuai section "SEO & Meta Updates" pada design.

## Requirements

### Requirement 1: Konversi ke WhatsApp dengan Pesan Prefilled

**User Story:** Sebagai founder atau pemilik bisnis Indonesia yang sedang membandingkan paket, saya ingin satu klik tombol paket langsung membuka WhatsApp dengan pesan kontekstual yang sudah terisi, sehingga saya dapat memulai diskusi tanpa mengetik ulang nama paket dan harganya.

*Diturunkan dari section "Conversion Funnel — Visitor → Qualified Lead" dan "Algoritma 1: Build WhatsApp URL dengan Pesan Prefilled" pada design. Divalidasi oleh PROP-1, PROP-2, PROP-3, PROP-4.*

#### Acceptance Criteria

1. WHEN seorang pengunjung mengklik sebuah CTA pada Tier_Card, THE Service_Module SHALL membuka URL `https://wa.me/{WhatsApp_Phone}?text={Prefilled_Message_terencode}` di tab browser baru dengan atribut `noopener,noreferrer`.
2. WHEN Service_Module merakit URL WhatsApp untuk sebuah Tier_Card, THE Prefilled_Message SHALL memuat substring nama Tier, label Service dalam Bahasa Indonesia (`"Pembuatan Website"` untuk Service `"website"` dan `"Pembuatan Video AI"` untuk Service `"video-ai"`), dan label harga yang diambil dari `data-price`.
3. WHEN Service_Module merakit URL WhatsApp, THE Service_Module SHALL meng-encode bagian `text` menggunakan `encodeURIComponent` sehingga query string tidak mengandung karakter literal `space`, `"`, `&`, `=`, atau `?`.
4. WHEN URL WhatsApp dihasilkan, THE Service_Module SHALL memastikan `decodeURIComponent` terhadap bagian setelah `?text=` mengembalikan Prefilled_Message asli secara utuh.
5. IF browser memblokir `window.open` (popup blocker mengembalikan `null`), THEN THE Service_Module SHALL meneruskan navigasi ke URL WhatsApp pada tab yang sama melalui `window.location.href`.
6. THE Service_Module SHALL memperlakukan `buildWaUrl` sebagai fungsi murni tanpa side effect (tidak menulis DOM, tidak melakukan request jaringan, tidak menulis log).

### Requirement 2: Tampilan Tier Harga (Basic / Pro / Custom)

**User Story:** Sebagai calon pembeli yang sedang mengevaluasi paket, saya ingin melihat tiga tier harga (Basic, Pro, Custom) berdampingan dengan harga, timeline, target ideal, dan daftar deliverables yang transparan, sehingga saya dapat memutuskan paket mana yang paling pas untuk bisnis saya.

*Diturunkan dari section "Components and Interfaces", "Data Models" (`WEBSITE_TIERS`, `VIDEO_AI_TIERS`), "Validation Rules", dan "Example Usage — Markup HTML — Tier Card" pada design. Divalidasi oleh PROP-7.*

#### Acceptance Criteria

1. THE Section_Layanan untuk Service `"website"` SHALL menampilkan tepat tiga Tier_Card dengan nama `"Basic"`, `"Pro"`, dan `"Custom"` dalam urutan kiri-ke-kanan pada Breakpoint_Desktop.
2. THE Section_Layanan untuk Service `"video-ai"` SHALL menampilkan tepat tiga Tier_Card dengan nama `"Basic"`, `"Pro"`, dan `"Custom"` dalam urutan kiri-ke-kanan pada Breakpoint_Desktop.
3. THE Tier_Card SHALL menampilkan nama Tier, label harga (`tier-price-amount`), catatan harga (`tier-price-note`), kalimat target ideal (`tier-ideal`), daftar deliverables (`tier-deliverables`), dan satu CTA (`tier-cta`).
4. THE label timeline pada `tier-price-note` SHALL ditulis dalam Bahasa Indonesia menggunakan satuan `hari`, `minggu`, atau `bulan` yang konsisten dengan algoritma `formatTimeline`.
5. WHERE sebuah Tier_Card ditandai sebagai Featured_Tier, THE Tier_Card SHALL menampilkan badge `"Paling populer"` dan menerapkan kelas CSS `.featured`.
6. THE Section_Layanan untuk setiap Service SHALL memiliki tepat satu Featured_Tier.
7. THE daftar deliverables pada setiap Tier_Card SHALL berisi minimum 3 dan maksimum 6 bullet.
8. THE label harga pada Tier_Card SHALL mengikuti format `"Rp X.XXX.XXX"` (titik sebagai pemisah ribuan) atau `"Mulai Rp X.XXX.XXX"` untuk Tier `"Custom"`.

### Requirement 3: Galeri Showcase

**User Story:** Sebagai pengunjung yang ingin melihat bukti kualitas hasil sebelum menghubungi, saya ingin melihat galeri sample Website dan Video AI dengan judul, kategori, dan tag teknologi, sehingga saya dapat menilai kecocokan gaya dan ekspektasi hasil.

*Diturunkan dari section "Components and Interfaces" (Showcase Gallery) dan "Error Handling — Skenario 3: Image Showcase 404" pada design.*

#### Acceptance Criteria

1. THE Section_Layanan SHALL menyertakan elemen `.showcase-grid` yang berisi nol atau lebih `.showcase-card`.
2. THE Showcase_Card SHALL menampilkan thumbnail, kategori (`showcase-cat`), judul (`showcase-title`), dan daftar tag (`showcase-tags`).
3. WHERE sebuah Showcase_Card memiliki atribut `data-format="vertical"`, THE thumbnail SHALL menggunakan rasio aspek `9 / 16`.
4. WHERE atribut `data-format` tidak diset, THE thumbnail SHALL menggunakan rasio aspek default `16 / 10`.
5. THE thumbnail Showcase_Card SHALL diberikan atribut `loading="lazy"`.
6. IF thumbnail gagal dimuat, THEN THE Showcase_Card SHALL tetap menampilkan judul, kategori, dan tag tanpa membuat layout `.showcase-grid` menjadi kolaps.

### Requirement 4: FAQ Accordion

**User Story:** Sebagai pengunjung yang punya pertanyaan tentang revisi, durasi pengerjaan, dan pembayaran, saya ingin membaca FAQ yang dapat dibuka satu per satu, sehingga saya dapat fokus pada pertanyaan yang relevan tanpa terganggu jawaban panjang yang tidak saya butuhkan.

*Diturunkan dari section "Components and Interfaces" (FAQ Accordion), "Algoritma 3: FAQ Accordion (Native `<details>` — Tanpa JavaScript)", "Data Models — FAQ Content Model", dan "Error Handling — Skenario 4" pada design. Divalidasi oleh PROP-8.*

#### Acceptance Criteria

1. WHEN halaman pertama kali di-render, THE FAQ_Accordion SHALL menampilkan setiap `.faq-item` dalam keadaan tertutup (atribut `open` tidak terpasang).
2. WHEN seorang pengunjung mengklik atau menekan `Enter` / `Space` pada `.faq-q`, THE FAQ_Accordion SHALL men-toggle status `open` dari `.faq-item` yang bersangkutan.
3. THE FAQ_Accordion SHALL diimplementasikan menggunakan elemen native `<details>` dan `<summary>` tanpa membutuhkan JavaScript untuk perilaku dasar buka-tutup.
4. THE Section_Layanan untuk Service `"website"` SHALL berisi minimal lima FAQ item yang turunan dari `FAQ_WEBSITE` pada design.
5. THE Section_Layanan untuk Service `"video-ai"` SHALL berisi minimal lima FAQ item yang turunan dari `FAQ_VIDEO_AI` pada design.
6. WHERE browser tidak mendukung elemen `<details>`, THE FAQ_Accordion SHALL terdegradasi menjadi semua item terlihat terbuka (konten tetap dapat dibaca).

### Requirement 5: Kontrak Modul JavaScript Service

**User Story:** Sebagai developer yang akan memelihara modul ini, saya ingin Service_Module dapat di-inisialisasi ulang tanpa menggandakan event listener dan memvalidasi atribut `data-*` yang dibutuhkan, sehingga modul tetap aman saat re-attach (misalnya setelah penambahan konten dinamis).

*Diturunkan dari section "Components and Interfaces", "Algorithmic Pseudocode — Algoritma 2: Attach CTA Handler", "Key Functions with Formal Specifications", dan "Error Handling — Skenario 2: Data Attributes Hilang" pada design. Divalidasi oleh PROP-5 dan PROP-6.*

#### Acceptance Criteria

1. WHEN `initServiceCtaHandlers(root)` dipanggil dua kali atau lebih pada DOM yang sama, THE Service_Module SHALL hanya memasang satu event listener `click` per CTA Tier_Card.
2. THE Service_Module SHALL menandai setiap CTA yang sudah di-attach dengan atribut `data-cta-attached="true"` sebelum memasang listener.
3. THE setiap CTA pada Tier_Card SHALL memiliki atribut `data-cta="service"`, `data-service` (nilai `"website"` atau `"video-ai"`), `data-tier` (nilai `"Basic"`, `"Pro"`, atau `"Custom"`), dan `data-price` (string non-kosong).
4. IF salah satu dari `data-service`, `data-tier`, atau `data-price` hilang atau kosong saat CTA diklik, THEN THE Service_Module SHALL menulis peringatan ke `console.warn` dan membuka URL fallback `https://wa.me/{WhatsApp_Phone}` tanpa parameter `text`.
5. THE Service_Module SHALL didistribusikan sebagai IIFE di file `assets/js/services.js` tanpa mengekspor variabel ke `window` selain `window.__services` untuk keperluan testing.

### Requirement 6: Navigasi "Layanan" dengan Dropdown

**User Story:** Sebagai pengunjung desktop yang sedang menavigasi situs, saya ingin item nav baru `"Layanan"` yang membuka dropdown ke `Website` dan `Video AI`, sehingga saya dapat melompat langsung ke section yang relevan tanpa scroll panjang.

*Diturunkan dari section "Information Architecture — Perubahan Navigasi" dan "Mobile-First Responsive Considerations" pada design.*

#### Acceptance Criteria

1. WHILE viewport berada pada Breakpoint_Desktop, THE Site SHALL menampilkan item nav `"Layanan"` di antara item `"Founded"` dan `"Packages"` pada `<nav>` utama.
2. WHEN seorang pengunjung melakukan hover atau memberi keyboard focus pada item nav `"Layanan"`, THE Nav_Dropdown SHALL menampilkan dua sub-link: `"Website"` (anchor `#jasa-website`) dan `"Video AI"` (anchor `#jasa-video-ai`).
3. WHEN seorang pengunjung mengklik salah satu sub-link Nav_Dropdown, THE Site SHALL melakukan scroll halus ke section target menggunakan perilaku `scroll-behavior: smooth` yang sudah didefinisikan di `base.css`.
4. WHILE viewport berada pada Breakpoint_Mobile, THE Nav_Dropdown SHALL mengikuti pola navbar existing dan disembunyikan (tidak menampilkan menu kanan).
5. THE Nav_Dropdown SHALL dapat dioperasikan dengan keyboard (Tab untuk fokus, Enter untuk aktivasi sub-link) tanpa membutuhkan trap fokus tambahan.

### Requirement 7: Penempatan dan Struktur Section

**User Story:** Sebagai pemilik produk yang menjaga arc cerita situs (problem → solusi → bukti → penawaran), saya ingin section layanan komersial baru ditempatkan setelah bukti kerja dan sebelum section `Packages` lama, sehingga pengunjung sudah melihat *proof* sebelum melihat harga.

*Diturunkan dari section "Section Layout — Posisi Section Baru" dan "Implementation Patterns Consistent With Existing Codebase" pada design.*

#### Acceptance Criteria

1. THE Section_Layanan `#jasa-website` SHALL ditempatkan di markup HTML setelah section `Credentials` dan sebelum Section_Layanan `#jasa-video-ai`.
2. THE Section_Layanan `#jasa-video-ai` SHALL ditempatkan di markup HTML setelah Section_Layanan `#jasa-website` dan sebelum section `#packages` existing.
3. THE setiap Section_Layanan SHALL menggunakan struktur `<section class="service-commercial" id="..."><div class="container">...</div></section>` dengan turunan `section-eyebrow`, `section-title`, dan `section-subtitle`.
4. THE setiap Section_Layanan SHALL menerapkan kelas `fade-in` pada wrapper turunan utamanya sehingga animasi reveal ditangani oleh Reveal_Module existing.
5. THE setiap Section_Layanan SHALL menyertakan empat sub-blok berurutan: `.tier-grid`, `.svc-flow` (4 step proses), `.showcase-grid`, dan `.faq-list`.

### Requirement 8: SEO, Meta, dan Schema.org

**User Story:** Sebagai pemilik situs yang ingin layanan baru ditemukan lewat pencarian organik dan dibagikan dengan preview menarik, saya ingin meta tag SEO, Open Graph, Twitter Card, dan schema.org Service ditambahkan, sehingga konten situs muncul rapi di SERP dan saat dibagikan ke sosial media.

*Diturunkan dari section "SEO & Meta Updates" pada design.*

#### Acceptance Criteria

1. THE element `<html>` di `index.html` SHALL menggunakan atribut `lang="id"`.
2. THE `<head>` SHALL menyertakan `<title>` dan `<meta name="description">` yang menyebut frasa "Jasa Pembuatan Website" dan "Video AI".
3. THE `<head>` SHALL menyertakan tag Open Graph berikut: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, dan `og:locale` (dengan nilai `id_ID`).
4. THE `<head>` SHALL menyertakan tag Twitter Card berikut: `twitter:card` (nilai `summary_large_image`), `twitter:title`, `twitter:description`, dan `twitter:image`.
5. THE document SHALL menyertakan satu blok JSON_LD `Service` untuk Service `"website"` dengan `hasOfferCatalog` berisi tiga `Offer` (Basic, Pro, Custom) lengkap dengan `price` dan `priceCurrency: "IDR"`.
6. THE document SHALL menyertakan satu blok JSON_LD `Service` untuk Service `"video-ai"` dengan `hasOfferCatalog` berisi tiga `Offer` (Basic, Pro, Custom) lengkap dengan `price` dan `priceCurrency: "IDR"`.

### Requirement 9: Perilaku Responsif

**User Story:** Sebagai pengunjung yang membuka situs dari ponsel, tablet, atau desktop, saya ingin tata letak Tier_Card, svc-flow, dan elemen lain menyesuaikan ukuran layar, sehingga semua konten tetap terbaca dan tombol CTA tetap nyaman ditekan.

*Diturunkan dari section "Mobile-First Responsive Considerations" dan "CSS — Responsive (extend `responsive.css`)" pada design.*

#### Acceptance Criteria

1. WHILE viewport berada pada Breakpoint_Desktop, THE `.tier-grid` SHALL diatur ke tiga kolom dan THE `.svc-flow` SHALL diatur ke empat kolom.
2. WHILE viewport berada pada Breakpoint_Mobile, THE `.tier-grid` SHALL stack menjadi satu kolom dan THE `.svc-flow` SHALL stack menjadi dua kolom.
3. WHILE viewport berada pada Breakpoint_Mobile, THE Tier_Card dengan kelas `.featured` SHALL menghilangkan transformasi elevasi (`transform: none`) untuk menjaga kerapihan stack.
4. WHILE viewport berada pada Breakpoint_Small, THE `.svc-flow` SHALL stack menjadi satu kolom dan ukuran font `tier-price-amount` SHALL diperkecil dari `1.85rem` menjadi `1.6rem`.
5. THE setiap CTA tombol pada Tier_Card SHALL memiliki tinggi minimum 44 piksel untuk memenuhi panduan touch target iOS/Android.

### Requirement 10: Aksesibilitas, Tema, dan Keamanan Tautan

**User Story:** Sebagai pengunjung yang memakai keyboard, screen reader, atau theme gelap, saya ingin section baru tetap aksesibel dan kontrasnya nyaman di kedua mode tema, sehingga saya dapat mengakses semua informasi tanpa hambatan.

*Diturunkan dari section "Implementation Patterns Consistent With Existing Codebase", "Security Considerations", dan "Components and Interfaces" pada design.*

#### Acceptance Criteria

1. THE setiap link eksternal pada Section_Layanan SHALL menggunakan `target="_blank"` bersama `rel="noopener noreferrer"`.
2. THE setiap warna pada Tier_Card, FAQ_Accordion, dan Showcase_Card SHALL berasal dari token CSS custom property (`--accent`, `--surface`, `--text`, `--border`, dan turunannya) sehingga otomatis mengikuti dark dan light mode existing.
3. THE Section_Layanan SHALL tidak melakukan render konten apa pun yang berasal dari input pengguna (tidak ada form), sehingga risiko XSS pada section ini tetap minimal.
4. THE FAQ_Accordion SHALL dapat dioperasikan menggunakan keyboard saja (`Tab` untuk berpindah, `Enter` atau `Space` untuk membuka/menutup) sesuai semantik native `<details>`.

### Requirement 11: Batasan Implementasi & Performa

**User Story:** Sebagai engineer yang menjaga arsitektur situs static tetap ringan, saya ingin fitur baru tidak menambah dependency runtime dan tetap konsisten dengan pola modular existing, sehingga performa dan maintainability situs tidak menurun.

*Diturunkan dari section "Performance Considerations", "Dependencies", dan "File Changes Summary" pada design.*

#### Acceptance Criteria

1. THE fitur ini SHALL tidak menambah dependency runtime baru pada situs production (tidak ada framework, bundler, atau library eksternal yang ter-include di build).
2. THE styling untuk fitur ini SHALL ditempatkan pada file baru `assets/css/services-commercial.css` dan SHALL tidak menyentuh isi `assets/css/style.css`, `base.css`, `hero.css`, `sections.css`, atau `components.css` secara struktural.
3. THE styling responsif untuk fitur ini SHALL ditambahkan ke file existing `assets/css/responsive.css` mengikuti pola breakpoint yang sudah ada.
4. THE styling Nav_Dropdown SHALL diperluas dari file existing `assets/css/layout.css`.
5. THE Service_Module SHALL ditempatkan pada file baru `assets/js/services.js` dengan ukuran kurang dari 1.5KB ketika di-minify.
6. THE file `assets/css/services-commercial.css` SHALL berukuran kurang dari 6KB ketika di-minify.
7. WHEN file CSS atau JS ditambahkan atau dimodifikasi, THE referensi `<link>` dan `<script>` di `index.html` SHALL dinaikkan versi query param-nya (misalnya `?v=6` → `?v=7`) untuk cache busting.
8. THE thumbnail Showcase_Gallery SHALL menggunakan `aspect-ratio` di CSS sehingga tidak menyebabkan Cumulative Layout Shift saat gambar belum dimuat.
