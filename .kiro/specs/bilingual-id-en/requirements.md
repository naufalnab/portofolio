# Requirements Document

## Introduction

Fitur **Bilingual ID/EN** menjadikan situs portofolio `naufalnabila.my.id` tersedia dalam **dua bahasa** — Bahasa Indonesia (ID) dan Bahasa Inggris (EN) — lengkap dengan **pemilih bahasa (language switcher)** di shared shell, persistensi pilihan bahasa, SEO bilingual (`hreflang`, canonical per bahasa, sitemap multi-bahasa), dan terjemahan seluruh copy yang terlihat di kedelapan halaman situs.

Situs ini adalah aset _lead-gen_ komersial yang harus tetap **100% statis** (HTML + CSS modular + JavaScript vanilla, tanpa bundler/framework/server-side include) dan deployable ke static hosting yang mendukung clean URL di root domain. Fitur bilingual ini **tidak boleh** mengubah sifat statis tersebut, **tidak boleh** merusak SEO yang sudah berjalan, dan **harus** mempertahankan seluruh perilaku existing (toggle tema + persistensi, anti-FOUC, active-nav highlighting, hamburger mobile, reveal animation) di kedua bahasa serta saat berpindah bahasa.

Pendekatan tetap konsisten dengan arsitektur existing dari fitur **Multi-Page Restructure**: berbagi shell lewat **duplikasi markup** sebagai sumber kebenaran utama (`partials/`), dengan **build script opsional tanpa dependensi** (`tools/build-pages.mjs`) sebagai jalur DRY, plus harness uji enumeratif/property-based (`tests/`, `fast-check` + `jsdom`) yang menjaga invarian atas himpunan halaman yang tertutup dan terhingga.

### Keputusan Arsitektur yang Perlu Dikonfirmasi (Asumsi Eksplisit)

Beberapa keputusan berikut **berdampak material pada arsitektur** (skema URL, bahasa default, penyimpanan terjemahan). Dokumen ini menetapkan asumsi default yang SEO-first dan static-first, namun **meminta konfirmasi** sebelum lanjut ke design:

- **A1 — Bahasa default & skema URL (path-prefix).** Diasumsikan **Bahasa Indonesia adalah bahasa default** dan disajikan di **root** (`/`, `/services/`, dst.) sehingga URL yang sudah ter-index tidak berubah; **Bahasa Inggris** disajikan di bawah **prefix `/en/`** (`/en/`, `/en/services/`, dst.). `x-default` menunjuk ke versi ID (root). Rasional: domain `.my.id`, audiens utama pasar Indonesia, dan kontinuitas SEO URL existing. _(Alternatif yang ditolak: EN sebagai default root + ID di `/id/`.)_
- **A2 — Slug EN mengikuti slug ID.** Diasumsikan halaman EN **memakai slug yang sama** di bawah `/en/` (mis. `/en/layanan-website/`), bukan slug yang diterjemahkan (mis. `/en/website-service/`), agar relasi pasangan halaman ID↔EN tetap sederhana (path-prefix murni) dan fixtures/test existing tetap mudah diperluas. Penerjemahan slug ditandai sebagai opsi yang **ditunda**.
- **A3 — Penyimpanan terjemahan = halaman HTML terduplikasi per bahasa.** Diasumsikan setiap bahasa punya **file HTML statis terpisah** (primary approach, konsisten dengan strategi duplikasi existing), dengan **partial shell per bahasa** (`partials/_header.html` + `partials/_header.en.html`, dst.) sebagai sumber kebenaran dan build script opsional yang merakitnya. Tidak ada penerjemahan runtime via JavaScript. **Auto-redirect deteksi bahasa saat kunjungan pertama bersifat OPSIONAL** (gated), agar tidak berisiko untuk crawler.
- **A4 — Cakupan rewrite konten.** Karena ID menjadi default di root, copy section yang **saat ini berbahasa Inggris** di halaman root (Hero, About, Services, Case Studies, Founded, Skills, Experience, Credentials, Packages, Contact) akan **diterjemahkan ke Bahasa Indonesia** untuk versi ID (root), dan copy Inggris existing menjadi basis versi EN di `/en/`. Dua halaman komersial (`layanan-website`, `layanan-video-ai`) yang kini berbahasa Indonesia akan disediakan padanan EN-nya.

Dokumen ini menetapkan _correctness property_ kandidat **PROP-1..PROP-12** (lihat Requirement 11) yang dirancang agar dapat ditegakkan oleh harness uji existing.

## Glossary

- **Situs**: Keseluruhan situs statis bilingual hasil fitur ini — 7 halaman konten × 2 bahasa + halaman 404 per bahasa — termasuk seluruh file HTML, CSS, dan JS yang di-deploy ke root domain.
- **Bahasa_Default**: Bahasa yang disajikan di root domain tanpa prefix path. Bernilai **Bahasa Indonesia (ID)** sesuai asumsi A1.
- **Locale**: Salah satu dari dua bahasa yang didukung: `id` (Bahasa Indonesia) atau `en` (Bahasa Inggris).
- **Prefix_EN**: Segmen path `/en/` yang mengawali seluruh URL halaman berbahasa Inggris.
- **Halaman_ID**: Halaman konten yang disajikan dalam Bahasa Indonesia di root (mis. file `services/index.html` untuk URL `/services/`).
- **Halaman_EN**: Halaman konten yang disajikan dalam Bahasa Inggris di bawah Prefix_EN (mis. file `en/services/index.html` untuk URL `/en/services/`).
- **Setiap_Halaman**: Satu dokumen HTML yang mewakili satu URL kanonik dalam daftar `PAGES_BILINGUAL` (16 entri: 7 konten × 2 bahasa + 404 × 2 bahasa).
- **Pasangan_Halaman**: Relasi bijektif yang memetakan setiap Halaman_ID ke tepat satu Halaman_EN yang setara secara konten (mis. `/services/` ↔ `/en/services/`), dan sebaliknya.
- **PAGES_BILINGUAL**: Daftar kanonik seluruh halaman situs lintas bahasa (slug, locale, path, file) — perluasan dari `PAGES` existing menjadi dua bahasa.
- **Pemilih_Bahasa**: Komponen UI pada shared shell yang menampilkan bahasa aktif dan menautkan ke padanan halaman saat ini dalam bahasa lainnya (language switcher).
- **Skrip_Deteksi_Bahasa**: Script inline sinkron di `<head>` yang menentukan apakah pengunjung perlu diarahkan ke bahasa lain (deteksi/persistensi), dieksekusi sebelum paint pertama (anti-FOUC-style), bersifat opsional dan ber-guard anti-loop.
- **Modul_Bahasa**: Logika JavaScript (mis. `lang.js`) yang menangani klik Pemilih_Bahasa, penyimpanan pilihan ke `localStorage`, dan penandaan bahasa aktif.
- **Shared Shell (cangkang bersama)**: Bagian markup yang identik di seluruh halaman dalam satu bahasa — nav (header), footer, dan kerangka `<head>` — yang menjadi sumber konsistensi navigasi dan branding per bahasa.
- **Kunci_Bahasa**: Kunci `localStorage` (`lang`) yang menyimpan Locale pilihan eksplisit pengunjung, bernilai `"id"` atau `"en"`.
- **hreflang**: Atribut `hreflang` pada elemen `<link rel="alternate">` (dan entri sitemap setara) yang memberi tahu mesin pencari padanan URL antar bahasa, termasuk nilai `x-default`.
- **Anti-FOUC**: Pencegahan _Flash Of Unstyled/Unthemed Content_ — perilaku existing yang menetapkan tema sebelum paint; pola "tanpa flash" yang sama menjadi acuan untuk keputusan bahasa.
- **Modul_Navigasi**: Logika existing di `nav.js` (`normalizePath`, `setActiveNav`, `initMobileNav`) untuk active-nav highlighting dan hamburger mobile.
- **Modul_Tema**: Logika existing di `theme.js` (`toggleTheme`) untuk toggle tema dark/light dan persistensi via `localStorage` kunci `theme`.
- **Skrip_Build**: Script Node opsional tanpa dependensi npm (`tools/build-pages.mjs`) yang merakit halaman dari partial; pada fitur ini diperluas agar sadar-bahasa (per-locale partial).
- **JSON-LD `Service`**: Schema.org structured data bertipe `Service` pada halaman layanan, dengan nilai `serviceType`/`name`/`description` yang dilokalkan per bahasa.
- **Link_Internal**: Elemen `<a href>` yang menunjuk ke halaman lain dalam `Situs`, di luar tautan eksternal `http(s)` ke domain lain, `mailto:`, `tel:`, dan `wa.me`.

## Requirements

### Requirement 1: Routing Bilingual Statis (Path-Prefix per Bahasa)

**User Story:** Sebagai pemilik situs lead-gen, saya ingin setiap halaman tersedia dalam dua bahasa pada URL clean yang statis dan stabil, sehingga konten kedua bahasa dapat di-index secara independen tanpa mengubah sifat statis situs maupun URL yang sudah ter-index.

#### Acceptance Criteria

1. THE Situs SHALL menyajikan ketujuh halaman konten dalam Bahasa_Default (ID) pada URL root tanpa Prefix_EN — yakni `/`, `/services/`, `/case-studies/`, `/founded/`, `/layanan-website/`, `/layanan-video-ai/`, dan `/packages/` — di mana ketujuh URL ini identik dengan URL halaman existing sebelum fitur bilingual (tanpa perubahan, penghapusan, atau pengalihan terhadap path yang sudah ter-index) dan masing-masing dipetakan ke tepat satu file dalam `PAGES_BILINGUAL`.
2. THE Situs SHALL menyajikan ketujuh halaman konten dalam Bahasa Inggris di bawah Prefix_EN, yakni `/en/`, `/en/services/`, `/en/case-studies/`, `/en/founded/`, `/en/layanan-website/`, `/en/layanan-video-ai/`, dan `/en/packages/`.
3. THE Situs SHALL mendefinisikan relasi Pasangan*Halaman sebagai pemetaan bijektif di mana setiap Halaman_ID berpadanan dengan tepat satu Halaman_EN melalui penambahan atau penghapusan Prefix_EN pada path, dan sebaliknya. *(validates correctness property PROP-1)\_
4. THE Situs SHALL menyajikan keempat-belas halaman konten melalui clean URL berbasis folder yang bentuk kanoniknya selalu diakhiri garis miring `/` dan tanpa ekstensi `.html`, di mana setiap URL dilayani oleh tepat satu file `index.html` pada folder bersangkutan sebagai pemetaan satu-ke-satu antara URL dan file (mis. URL `/en/services/` dilayani oleh `en/services/index.html`); halaman 404 per bahasa (`/404.html` dan `/en/404.html`) merupakan pengecualian yang tetap memakai ekstensi `.html`.
5. THE Situs SHALL men-deploy hanya artefak statis berupa file HTML, CSS, dan JavaScript vanilla — tanpa framework, bundler, SPA router, atau server-side include — sehingga seluruh halaman kedua bahasa dapat disajikan oleh static file server tanpa langkah build runtime maupun proses server-side.
6. WHEN sebuah Link*Internal pada Halaman_EN diaktifkan tanpa melalui Pemilih_Bahasa, THE Situs SHALL mengarahkan ke URL ber-Prefix_EN yang ada dalam `PAGES_BILINGUAL`; dan WHEN sebuah Link_Internal pada Halaman_ID diaktifkan tanpa melalui Pemilih_Bahasa, THE Situs SHALL mengarahkan ke URL root tanpa Prefix_EN yang ada dalam `PAGES_BILINGUAL` — sehingga navigasi tetap berada dalam Locale halaman saat ini (tanpa menghasilkan path ber-prefix ganda seperti `/en/en/`) kecuali pengguna secara eksplisit berganti bahasa melalui Pemilih_Bahasa. *(validates correctness property PROP-7)\_
7. IF peramban meminta sebuah path di bawah domain situs yang tidak cocok dengan URL mana pun dalam `PAGES_BILINGUAL`, THEN THE Situs SHALL menyajikan Halaman 404 dalam Locale yang sesuai dengan path yang diminta — Halaman_EN 404 (`/en/404.html`) bila path diawali Prefix_EN dan Halaman_ID 404 (`/404.html`) untuk path lainnya — tanpa mengalihkan otomatis ke beranda.

### Requirement 2: Pemilih Bahasa pada Shared Shell

**User Story:** Sebagai pengunjung, saya ingin tombol pemilih bahasa yang jelas di header untuk berpindah antara Indonesia dan English pada halaman yang sedang saya baca, sehingga saya bisa membaca konten yang sama dalam bahasa pilihan saya tanpa kembali ke beranda.

#### Acceptance Criteria

1. THE Pemilih_Bahasa SHALL hadir tepat satu kali pada setiap halaman dalam `PAGES_BILINGUAL` sebagai elemen turunan di dalam `<nav id="navbar">` dan berada di dalam kontainer `.nav-right` yang sama dengan tombol theme toggle.
2. THE Pemilih*Bahasa SHALL menandai tepat satu indikator Locale sebagai aktif yang nilainya sama dengan Locale halaman saat ini (`id` pada Halaman_ID dan `en` pada Halaman_EN) serta tidak menandai Locale lainnya sebagai aktif. *(validates correctness property PROP-6)\_
3. WHEN pengunjung mengaktifkan Pemilih*Bahasa untuk berpindah ke Locale lain, THE Pemilih_Bahasa SHALL menavigasi ke URL Pasangan_Halaman dari halaman saat ini dalam Locale tujuan (bukan ke beranda), sehingga konten yang setara ditampilkan dalam bahasa lain. *(validates correctness property PROP-2)\_
4. THE Pemilih_Bahasa SHALL menyediakan target padanan sebagai elemen `<a href>` yang nilai href-nya adalah path root-relative Pasangan_Halaman yang ada dalam `PAGES_BILINGUAL` dan tertulis langsung di raw HTML (tanpa path ber-Prefix_EN ganda seperti `/en/en/`), sehingga perpindahan bahasa berfungsi penuh tanpa eksekusi JavaScript.
5. THE Pemilih_Bahasa SHALL menyertakan atribut `aria-label` non-kosong yang menyatakan fungsi pemilihan bahasa, menandai opsi bahasa aktif dengan `aria-current` (atau penanda status setara), dan menjadikan setiap opsi bahasa sebagai elemen yang dapat menerima fokus keyboard serta dapat diaktifkan melalui tombol Enter.
6. WHILE viewport berukuran `<900px`, THE Pemilih_Bahasa SHALL tetap ter-render dan dapat menerima fokus serta diaktifkan melalui keyboard di dalam navigasi mobile (hamburger), tanpa membuat tombol theme toggle maupun Link_Internal nav lainnya menjadi tidak dapat difokuskan atau tidak dapat diaktifkan.

### Requirement 3: Persistensi dan Deteksi Bahasa (Tanpa Flash)

**User Story:** Sebagai pengunjung yang sudah memilih bahasa, saya ingin pilihan bahasa saya diingat saat berpindah halaman tanpa kedipan konten, sehingga saya tidak perlu memilih ulang bahasa di setiap halaman.

#### Acceptance Criteria

1. WHEN pengunjung berpindah bahasa melalui Pemilih*Bahasa ke Locale L, THE Modul_Bahasa SHALL menyimpan nilai `"id"` atau `"en"` sesuai L pada Kunci_Bahasa di `localStorage` dan menyelesaikan penyimpanan tersebut sebelum navigasi ke URL Pasangan_Halaman dimulai, sehingga nilai itu dapat dibaca pada pemuatan halaman tujuan. *(validates correctness property PROP-8)\_
2. THE Situs SHALL menetapkan presedensi penentuan bahasa dengan urutan dari tertinggi ke terendah: (a) pilihan eksplisit melalui Pemilih_Bahasa pada navigasi saat ini, (b) nilai Kunci_Bahasa tersimpan di `localStorage` yang valid — yakni tepat `"id"` atau `"en"`, (c) bahasa peramban dari `navigator.language` pada kunjungan pertama, lalu (d) Bahasa_Default (ID); di mana nilai Kunci_Bahasa selain `"id"` atau `"en"` (kosong, rusak, atau tidak dikenal) diperlakukan sebagai tidak ada sehingga penentuan jatuh ke tingkat (c) lalu (d).
3. WHERE auto-redirect deteksi bahasa diaktifkan AND nilai Kunci*Bahasa tersimpan adalah Locale L yang valid AND halaman yang dibuka memiliki Locale berbeda dari L AND halaman tersebut bukan hasil pilihan eksplisit pada navigasi saat ini, THE Skrip_Deteksi_Bahasa SHALL mengarahkan peramban ke URL Pasangan_Halaman dalam Locale L menggunakan `location.replace`, dieksekusi secara sinkron dan memblokir render di dalam `<head>` sebelum elemen `<body>` mana pun yang terlihat dirender, sehingga keputusan diambil sebelum paint pertama dan nol frame konten ber-Locale yang tidak sesuai ter-render (tanpa flash). *(validates correctness property PROP-9)\_
4. WHERE auto-redirect deteksi bahasa diaktifkan AND tidak ada nilai Kunci_Bahasa tersimpan yang valid, WHEN pengunjung membuka halaman dalam Bahasa_Default, THE Skrip_Deteksi_Bahasa SHALL menentukan Locale dari `navigator.language` dengan pencocokan awalan tanpa peka huruf besar/kecil — nilai yang diawali `en` (mis. `en`, `en-US`, `EN-GB`) menjadi `en` dan selain itu menjadi `id`, sedangkan bila `navigator.language` kosong atau tidak tersedia maka Locale ditetapkan ke Bahasa_Default — dan, bila Locale hasil deteksi berbeda dari Bahasa_Default, mengarahkan ke URL Pasangan_Halaman dalam Locale tersebut menggunakan `location.replace` sebelum paint pertama.
5. THE Skrip*Deteksi_Bahasa SHALL melakukan paling banyak satu pengalihan otomatis per pemuatan halaman dan hanya ketika URL tujuan berbeda dari URL saat ini, sehingga tidak terjadi redirect loop. *(validates correctness property PROP-9)\_
6. IF akses baca atau tulis `localStorage` gagal (mis. private mode atau diblokir kebijakan peramban), THEN THE Situs SHALL memperlakukan kondisi tersebut sebagai tidak ada nilai Kunci_Bahasa tersimpan dan menyajikan halaman pada Locale URL saat ini tanpa melempar exception yang tidak tertangani serta tanpa pengalihan otomatis, dan Pemilih_Bahasa tetap berfungsi sebagai navigasi langsung ke URL Pasangan_Halaman.
7. WHERE auto-redirect deteksi bahasa tidak diaktifkan, THE Situs SHALL menyajikan setiap halaman pada Locale sesuai URL-nya tanpa pengalihan otomatis berbasis Kunci_Bahasa maupun `navigator.language`, sehingga Locale yang ditampilkan selalu cocok dengan path yang diminta.

### Requirement 4: SEO Per Bahasa (lang, hreflang, canonical, Open Graph)

**User Story:** Sebagai pemilik situs lead-gen, saya ingin setiap halaman menyatakan bahasanya dan saling menautkan padanan antar bahasa secara benar, sehingga mesin pencari menyajikan versi bahasa yang tepat kepada pengguna dan tidak menganggapnya konten duplikat.

#### Acceptance Criteria

1. THE Setiap*Halaman SHALL memuat tepat satu elemen `<html>` dengan tepat satu atribut `lang` yang bernilai persis `"id"` untuk Halaman_ID atau `"en"` untuk Halaman_EN sesuai Locale halaman (huruf kecil, tanpa nilai lain dan tanpa atribut `lang` ganda). *(validates correctness property PROP-3)\_
2. THE Setiap*Halaman konten SHALL menyertakan tepat satu elemen `<link rel="alternate" hreflang="...">` untuk masing-masing nilai `hreflang` `id`, `en`, dan `x-default` (tepat tiga elemen, tanpa nilai `hreflang` ganda maupun yang hilang), di mana `hreflang="id"` menunjuk ke URL Halaman_ID, `hreflang="en"` menunjuk ke URL Halaman_EN, dan `hreflang="x-default"` menunjuk ke URL versi Bahasa_Default (ID); setiap `href` merupakan URL absolut berskema `https` pada host `naufalnabila.my.id` yang menunjuk ke file yang ada dalam `PAGES_BILINGUAL`, dan menyertakan rujukan-mandiri ke Locale halaman itu sendiri. *(validates correctness property PROP-4)\_
3. THE Setiap*Halaman SHALL menetapkan tepat satu `link[rel=canonical]` ke URL absolut dirinya sendiri dalam Locale-nya — berskema `https`, pada host `naufalnabila.my.id`, dengan bentuk kanonik berakhiran garis miring `/` (mis. canonical Halaman_EN `/en/services/` adalah `https://naufalnabila.my.id/en/services/`) — yang nilainya identik dengan entri `hreflang` Locale halaman itu sendiri dan bukan menunjuk ke padanan bahasa lain. *(validates correctness property PROP-5)\_
4. THE Setiap_Halaman SHALL memuat tepat satu elemen `<title>` sepanjang 10–70 karakter dan tepat satu `meta[name=description]` sepanjang 50–160 karakter dalam Locale halaman, di mana keduanya tidak kosong setelah pemangkasan spasi (panjang ≥ 1 karakter non-spasi), dan nilai judul maupun deskripsi unik antar halaman dalam himpunan halaman pada Locale yang sama.
5. THE Setiap_Halaman SHALL menetapkan tepat satu `meta[property="og:locale"]` sesuai Locale (`id_ID` untuk Halaman_ID, `en_US` untuk Halaman_EN) dan tepat satu `meta[property="og:locale:alternate"]` bernilai Locale lainnya, serta menetapkan `og:url` yang nilainya identik (sama persis sebagai string) dengan nilai `canonical` halaman.
6. THE Setiap_Halaman SHALL menyertakan tepat satu `meta[property="og:title"]` dan tepat satu `meta[property="og:description"]` yang tidak kosong setelah pemangkasan spasi (panjang ≥ 1 karakter non-spasi) dan tertulis dalam Locale halaman, sehingga pratinjau berbagi menampilkan teks dalam bahasa yang sama dengan konten halaman.

### Requirement 5: Sitemap dan Robots Bilingual

**User Story:** Sebagai pemilik situs, saya ingin sitemap mencantumkan seluruh URL kedua bahasa beserta anotasi hreflang, sehingga mesin pencari menemukan dan memahami hubungan antar versi bahasa secara lengkap.

#### Acceptance Criteria

1. THE Situs SHALL mencantumkan tepat keempat-belas URL halaman konten — ketujuh Halaman*ID di root dan ketujuh Halaman_EN ber-Prefix_EN — sebagai entri `<url>` yang berbeda tanpa duplikasi nilai `<loc>` di dalam `sitemap.xml`, di mana setiap `<loc>` ditulis dalam bentuk kanonik berakhiran garis miring `/` tanpa ekstensi `.html`, dan kedua halaman 404 (`/404.html` dan `/en/404.html`) tidak dicantumkan. *(validates correctness property PROP-10)\_
2. THE Situs SHALL menyertakan, pada setiap entri `<url>` dalam `sitemap.xml`, tepat tiga elemen alternate bernamespace `xhtml` (`<xhtml:link rel="alternate" hreflang="...">`) dengan nilai `hreflang` tepat `id`, `en`, dan `x-default`, di mana `hreflang="id"` ber-`href` ke URL Halaman_ID, `hreflang="en"` ber-`href` ke URL Halaman_EN, dan `hreflang="x-default"` ber-`href` ke URL versi Bahasa_Default (ID); ketiga nilai `href` ini sama persis dengan URL `hreflang` yang dideklarasikan pada halaman bersangkutan dan identik antar kedua anggota Pasangan_Halaman.
3. THE Situs SHALL menjaga `robots.txt` tidak memuat aturan `Disallow` yang memblokir URL halaman konten mana pun dalam `PAGES_BILINGUAL` (termasuk URL ber-Prefix_EN) dan tetap memuat tepat satu direktif `Sitemap:` yang merujuk persis ke `https://naufalnabila.my.id/sitemap.xml`.
4. THE Situs SHALL memastikan setiap nilai `<loc>` dalam `sitemap.xml` merupakan URL absolut berskema `https` pada domain `naufalnabila.my.id` dalam bentuk kanonik berakhiran garis miring `/`, yang sama persis dengan nilai `canonical` halaman bersangkutan dan menunjuk ke file halaman yang ada dalam `PAGES_BILINGUAL`.
5. THE `sitemap.xml` SHALL berupa dokumen XML well-formed yang dapat di-parse tanpa error, dengan tepat satu elemen akar `<urlset>` yang mendeklarasikan namespace sitemap `http://www.sitemaps.org/schemas/sitemap/0.9` dan namespace `xhtml` `http://www.w3.org/1999/xhtml`.

### Requirement 6: Cakupan Terjemahan Konten

**User Story:** Sebagai pengunjung, saya ingin seluruh teks yang terlihat tersedia dalam bahasa pilihan saya, sehingga tidak ada bagian halaman yang tercampur bahasa lain.

#### Acceptance Criteria

1. THE Situs SHALL menerjemahkan ke Locale halaman seluruh teks yang dapat dibaca pengguna pada Setiap_Halaman — mencakup (a) teks node yang ter-render dan (b) teks pada atribut yang ditampilkan atau diumumkan ke pengguna (`alt`, `aria-label`, `title`, `placeholder`) — pada section Hero, About, Services, Process, Case Studies, Clients, Founded, Skills, Experience, Credentials, halaman layanan komersial (termasuk detail tier/paket, langkah proses, showcase, dan FAQ), Packages, dan Contact, sehingga tidak ada satuan teks pengguna yang tersisa dalam Locale selain Locale halaman, kecuali istilah pada daftar istilah dikecualikan di kriteria 6.
2. THE Shared Shell SHALL menerjemahkan ke Locale halaman seluruh label navigasi, label dropdown "Layanan", teks CTA (mis. "Book a Systems Audit"), serta seluruh teks footer — judul kolom, label tautan, baris hak cipta, dan teks meta berupa teks node maupun atribut `aria-label`/`title` pada elemen nav dan footer.
3. THE Situs SHALL menyajikan halaman 404 per bahasa (`/404.html` untuk ID dan `/en/404.html` untuk EN) dengan seluruh teks dalam Locale masing-masing dan tepat satu tautan "kembali ke beranda" yang menunjuk ke beranda Locale yang sama — `/` untuk Halaman_ID 404 dan `/en/` untuk Halaman_EN 404 — serta memuat tepat satu `<meta name="robots" content="noindex">` per halaman 404.
4. THE Setiap_Halaman SHALL menampilkan seluruh teks pengguna dalam tepat satu Locale yang sama dengan Locale halaman, sehingga nol satuan teks pengguna berasal dari Locale lain, kecuali istilah yang tercantum dalam daftar istilah dikecualikan pada kriteria 6.
5. WHERE sebuah satuan konten memuat nilai numerik atau harga (mis. harga paket dalam Rupiah), THE Situs SHALL mempertahankan nilai numerik, simbol mata uang (mis. "Rp"), dan format angka tersebut identik antar Pasangan_Halaman, dan hanya menerjemahkan label atau teks penyerta di sekitarnya ke Locale halaman.
6. THE Situs SHALL mendefinisikan daftar istilah dikecualikan sebagai himpunan tertutup dan terhingga berisi nama merek/produk dan istilah teknis yang tidak diterjemahkan (mis. "Odoo", "SvelteKit", "WhatsApp"), di mana hanya istilah dalam himpunan tersebut yang boleh muncul dalam bentuk identik di kedua Locale tanpa dianggap melanggar konsistensi bahasa pada kriteria 4.

### Requirement 7: Shared Shell Per Bahasa yang Konsisten dan Language-Scoped

**User Story:** Sebagai developer yang memelihara situs, saya ingin nav dan footer setiap bahasa konsisten dan seluruh tautannya tetap dalam bahasa yang sama, sehingga pengunjung tidak tiba-tiba terlempar ke bahasa lain saat menavigasi.

#### Acceptance Criteria

1. THE Situs SHALL menyediakan tepat satu `<nav id="navbar">` dan tepat satu `<footer>` pada setiap halaman dalam `PAGES_BILINGUAL`, tanpa elemen nav atau footer kedua.
2. THE Situs SHALL menjaga markup nav dan footer pada seluruh halaman dengan Locale yang sama tetap identik setelah dinormalisasi — yakni setelah menetralkan atribut active-state runtime (`aria-current="page"` dan token kelas `active`), teks terjemahan, indikator bahasa aktif, href Pemilih_Bahasa yang ter-scope per halaman, dan perbedaan spasi indentasi per baris — sehingga konsisten antar seluruh halaman pada Locale tersebut.
3. THE Shared Shell pada Halaman*EN SHALL menggunakan href Link_Internal ber-Prefix_EN untuk seluruh item nav, dropdown "Layanan", CTA, dan footer; dan THE Shared Shell pada Halaman_ID SHALL menggunakan href root tanpa Prefix_EN. *(validates correctness property PROP-7)\_
4. THE Situs SHALL menempatkan seluruh link nav dan footer sebagai elemen `<a href>` di raw HTML setiap halaman sehingga hadir dan dapat ditelusuri sebelum eksekusi JavaScript, tanpa injeksi link melalui JavaScript runtime.
5. WHERE Skrip_Build dijalankan, THE Skrip_Build SHALL merakit seluruh halaman dalam `PAGES_BILINGUAL` dari partial shell per-bahasa (mis. `partials/_header.html`/`partials/_footer.html` untuk ID dan padanan EN-nya), menghasilkan output tanpa menyisakan placeholder `{{...}}`, dan menghasilkan output byte-identik bila dijalankan ulang dengan input yang sama (deterministik dan idempoten).
6. THE Setiap*Halaman SHALL tidak memuat Link_Internal yang menyilang ke Locale berbeda dari Locale halaman tersebut — kecuali tautan Pemilih_Bahasa — dan setiap href Link_Internal yang dihasilkan SHALL menunjuk ke URL yang ada dalam `PAGES_BILINGUAL` tanpa path ber-prefix ganda seperti `/en/en/`. *(validates correctness property PROP-7)\_

### Requirement 8: Structured Data (JSON-LD) yang Dilokalkan

**User Story:** Sebagai pemilik situs, saya ingin schema layanan pada setiap bahasa menyatakan bahasa dan istilah layanan yang sesuai, sehingga hasil pencarian kaya (rich result) menampilkan informasi yang benar per bahasa.

#### Acceptance Criteria

1. THE Situs SHALL menempatkan tepat satu blok JSON-LD bertipe `Service` — yakni objek structured data Schema.org yang tipenya bernilai `Service` — pada masing-masing keempat halaman layanan di kedua bahasa (`/layanan-website/`, `/en/layanan-website/`, `/layanan-video-ai/`, `/en/layanan-video-ai/`), dan nol blok JSON-LD bertipe `Service` pada setiap halaman lain dalam `PAGES_BILINGUAL`. _(validates correctness property PROP-11)_
2. THE Situs SHALL melokalkan nilai `serviceType`, `name`, dan teks deskriptif pada JSON-LD `Service` ke Locale halaman sedemikian rupa sehingga ketiga nilai tersebut non-kosong, tidak memuat campuran teks dari Locale lain (kecuali nama merek/produk dan istilah teknis yang memang tidak diterjemahkan, mis. "Odoo", "WhatsApp"), dan berbeda dari nilai padanannya pada Pasangan_Halaman (di luar nama merek/istilah teknis tersebut).
3. THE Situs SHALL menetapkan properti `inLanguage` pada setiap blok JSON-LD `Service` ke nilai `"id"` untuk Halaman_ID dan `"en"` untuk Halaman_EN, sehingga cocok dengan atribut `lang` pada elemen `<html>` halaman yang bersangkutan.
4. THE Situs SHALL memastikan setiap blok JSON-LD pada setiap halaman dalam `PAGES_BILINGUAL` dapat di-parse sebagai JSON yang valid (`JSON.parse` berhasil tanpa melempar galat dan menghasilkan objek non-null).
5. THE Situs SHALL mempertahankan nilai numerik `price` dan kode `priceCurrency` pada `OfferCatalog` identik antar Pasangan_Halaman untuk layanan yang sama.
6. THE Situs SHALL menempatkan setiap blok JSON-LD `Service` langsung di raw HTML halaman yang bersangkutan sehingga hadir dan dapat ditelusuri sebelum eksekusi JavaScript, tanpa injeksi melalui JavaScript runtime.

### Requirement 9: Penyimpanan Terjemahan Static-First (Maintainability)

**User Story:** Sebagai developer, saya ingin terjemahan disimpan dengan cara yang konsisten dengan strategi duplikasi statis existing, sehingga situs tetap mudah dipelihara tanpa menambah dependensi runtime.

#### Acceptance Criteria

1. THE Situs SHALL menyimpan setiap entri dalam `PAGES_BILINGUAL` sebagai tepat satu file HTML statis terpisah, mencakup 14 file halaman konten (7 Halaman_ID di root + 7 Halaman_EN di bawah folder `en/`) ditambah 2 file halaman 404 (`/404.html` dan `/en/404.html`), tersusun dalam struktur folder yang mencerminkan skema URL.
2. THE Situs SHALL memelihara, untuk masing-masing Locale (`id` dan `en`), tepat satu partial nav (header) dan tepat satu partial footer di `partials/` (mis. `partials/_header.html`/`partials/_footer.html` untuk ID beserta padanan EN-nya) sebagai satu-satunya sumber kebenaran Shared Shell untuk Locale tersebut.
3. THE Situs SHALL menyajikan seluruh teks konten dan Shared Shell setiap halaman langsung di markup statis halaman tersebut, tanpa mekanisme penerjemahan atau penggantian teks yang dijalankan oleh JavaScript saat runtime.
4. WHEN Setiap_Halaman dimuat dengan JavaScript dinonaktifkan, THE Situs SHALL menampilkan seluruh teks terlihat halaman secara lengkap dalam Locale halaman tersebut tanpa bagian teks yang kosong atau tertinggal pada Locale lain.
5. WHERE Skrip_Build dijalankan untuk merakit halaman, THE Situs SHALL membatasi artefak yang di-deploy hanya pada file HTML, CSS, dan JavaScript vanilla statis — tanpa framework, bundler, server-side include, maupun pemuatan sumber daya terjemahan tambahan saat page load — sehingga Skrip_Build dieksekusi hanya pada waktu build dan tidak menjadi bagian dari artefak runtime yang di-deploy.
6. THE Situs SHALL memperluas fixtures uji existing (mis. `PAGES`, `NAV_ITEMS`) menjadi himpunan `PAGES_BILINGUAL` yang tertutup dan terhingga berisi tepat 16 entri (7 halaman konten × 2 Locale + 2 halaman 404), sehingga seluruh invarian bilingual dapat diuji secara enumeratif atas himpunan tersebut.

### Requirement 10: Pelestarian Perilaku Existing Lintas Bahasa

**User Story:** Sebagai pengunjung, saya ingin tema, navigasi aktif, menu mobile, dan animasi tetap bekerja sama persis di kedua bahasa dan saat berpindah bahasa, sehingga penambahan bilingual tidak menurunkan kualitas pengalaman yang sudah ada.

#### Acceptance Criteria

1. WHEN pengunjung berpindah bahasa melalui Pemilih_Bahasa, THE Situs SHALL menerapkan preferensi tema (dark/light) dari `localStorage` kunci `theme` pada halaman tujuan sebelum paint pertama — sinkron di `<head>`, konsisten dengan Skrip Anti-FOUC existing — tanpa mengubah nilai kunci `theme`, sehingga tema yang terlihat tidak berubah (tanpa flash) selama transisi bahasa.
2. WHEN sebuah halaman dimuat dalam Locale apa pun, THE Modul*Navigasi SHALL menandai tepat satu item nav top-level dengan `.active` dan `aria-current="page"` yang sesuai halaman aktif dalam Locale tersebut, dan nol item bila path tidak terdaftar di `PAGES_BILINGUAL` (mis. 404). *(validates correctness property PROP-12)\_
3. WHILE viewport berukuran `<900px`, THE Menu_Mobile SHALL pada kedua bahasa menampilkan `.nav-links` dalam keadaan tertutup (tersembunyi) saat halaman dimuat, membuka `.nav-links` saat tombol hamburger diaktifkan, dan menutup `.nav-links` ketika sebuah link nav diklik, tombol Escape ditekan, atau viewport di-resize ke `>=900px`; THE Menu_Mobile SHALL tidak mengubah keadaan buka/tutup `.nav-links` di luar pemicu-pemicu tersebut.
4. WHEN sebuah halaman dimuat dalam Locale apa pun, THE Situs SHALL menjalankan reveal animation berbasis IntersectionObserver sehingga setiap elemen yang ditandai untuk reveal beralih dari keadaan awal tersembunyi/teredam ke keadaan terlihat (visible) ketika elemen tersebut memasuki viewport, dengan perilaku identik pada kedua Locale.
5. THE Setiap_Halaman SHALL mereferensikan seluruh aset CSS, JS, dan gambar memakai path root-relative yang diawali `/assets/`, sehingga aset di-bagikan lintas bahasa dan ter-resolve identik dari kedalaman folder mana pun, termasuk dari halaman ber-Prefix_EN.
6. WHEN sebuah halaman yang memuat toggle khusus halaman dibuka dalam Locale apa pun, THE Situs SHALL mengaktifkan dukungan toggle tersebut (`toggles.js` pada halaman Case Studies dan Founded; `services.js` pada halaman layanan) sehingga setiap aktivasi kontrol toggle mengubah keadaan terlihat/tersembunyi panel targetnya, dengan perilaku identik pada kedua Locale.
7. IF IntersectionObserver tidak tersedia atau gagal diinisialisasi, THEN THE Situs SHALL menampilkan seluruh elemen yang ditandai untuk reveal dalam keadaan terlihat (visible) tanpa melempar exception yang tidak tertangani, sehingga tidak ada konten yang tersembunyi secara permanen.

### Requirement 11: Correctness Properties yang Dapat Diverifikasi

**User Story:** Sebagai pemelihara situs, saya ingin invarian bilingual ditegakkan oleh harness uji enumeratif/property-based existing, sehingga regresi terjemahan, routing, atau SEO terdeteksi otomatis.

_Requirement ini mengkonsolidasikan kandidat correctness property PROP-1..PROP-12 yang dirujuk oleh requirement lain di atas, untuk ditegakkan atas himpunan `PAGES_BILINGUAL` yang tertutup._

#### Acceptance Criteria

1. THE Situs SHALL menjamin relasi Pasangan*Halaman bersifat bijektif — setiap Halaman_ID memetakan ke tepat satu Halaman_EN dan sebaliknya, tanpa halaman yatim (tanpa padanan). *(PROP-1)\_
2. THE Situs SHALL menjamin Pemilih*Bahasa pada halaman X dalam Locale A menaut ke padanan halaman X dalam Locale B, di mana target tersebut ada dalam `PAGES_BILINGUAL`. *(PROP-2)\_
3. THE Situs SHALL menjamin setiap halaman memiliki tepat satu atribut `lang` pada `<html>` yang nilainya cocok dengan Locale halaman tersebut. _(PROP-3)_
4. THE Situs SHALL menjamin setiap halaman konten memuat tag `hreflang` untuk `id`, `en`, dan `x-default`, masing-masing menunjuk ke file yang ada dalam `PAGES_BILINGUAL`. _(PROP-4)_
5. THE Situs SHALL menjamin `canonical` setiap halaman sama dengan URL absolut dirinya sendiri dalam Locale-nya. _(PROP-5)_
6. THE Situs SHALL menjamin indikator bahasa aktif pada Pemilih*Bahasa cocok dengan Locale halaman saat ini. *(PROP-6)\_
7. THE Situs SHALL menjamin seluruh Link*Internal pada sebuah halaman berada dalam Locale yang sama dengan halaman tersebut, kecuali tautan Pemilih_Bahasa yang memang menyilang ke Locale lain. *(PROP-7)\_
8. THE Situs SHALL menjamin pilihan bahasa eksplisit tersimpan pada Kunci*Bahasa `localStorage` dan bertahan lintas navigasi. *(PROP-8)\_
9. THE Situs SHALL menjamin Skrip*Deteksi_Bahasa tidak pernah mengarahkan ke URL yang sama dengan URL saat ini (bebas redirect loop) dan keputusannya diambil sebelum paint pertama (tanpa flash). *(PROP-9)\_
10. THE Situs SHALL menjamin `sitemap.xml` memuat seluruh URL halaman konten kedua bahasa dengan anotasi `hreflang` yang konsisten. _(PROP-10)_
11. THE Situs SHALL menjamin blok JSON-LD `Service` hanya ada pada keempat halaman layanan (dua bahasa × dua layanan), tepat satu per halaman, dan setiap blok JSON-LD valid di-parse. _(PROP-11)_
12. THE Situs SHALL menjamin active-nav highlighting menandai tepat satu item nav top-level per halaman dalam Locale apa pun, dan nol item pada halaman 404. _(PROP-12)_
