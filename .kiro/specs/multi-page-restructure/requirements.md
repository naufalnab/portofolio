# Requirements Document

## Introduction

Fitur **Multi-Page Restructure** memecah situs portofolio `naufalnabila.my.id` dari satu halaman panjang (`index.html`) menjadi situs multi-halaman (7 halaman + halaman 404) yang dipetakan dari item navigasi: Home, Services, Case Studies, Founded, Layanan Website, Layanan Video AI, dan Packages. Tujuannya memperbaiki _crawlability_/ranking (situs ini aset _lead-gen_ komersial), mempercepat _time-to-content_ per halaman, dan memberi setiap topik URL, `<title>`, dan meta sendiri yang dapat di-index dan di-share secara independen.

Situs harus tetap **100% statis** (HTML + CSS modular + JavaScript vanilla, tanpa bundler/framework/server-side include) agar deploy ke static hosting tetap sederhana. Tantangan inti adalah berbagi header (nav) dan footer ke banyak file HTML tanpa merusak SEO dan tanpa beban maintenance berlebih, sambil menangani _theme flash_ (FOUC) yang kini muncul di setiap perpindahan halaman, _active nav highlighting_, SEO per halaman, pemisahan JSON-LD, dan navigasi mobile (hamburger).

Dokumen requirements ini **diderivasi dari** `design.md` (workflow design-first). Setiap requirement merujuk ke section design sumbernya dan ke _correctness property_ (PROP-1..PROP-13) yang sudah ada di design agar tetap _traceable_.

## Glossary

- **Situs**: Keseluruhan situs statis multi-halaman hasil restrukturisasi (7 halaman + `/404.html`), termasuk seluruh file HTML, CSS, dan JS yang di-deploy ke root domain.
- **Halaman / Setiap_Halaman**: Satu dokumen HTML yang mewakili satu URL kanonik dalam daftar `PAGES` (mis. `/services/index.html` untuk URL `/services/`).
- **Shared Shell (cangkang bersama)**: Bagian markup yang identik di seluruh halaman — nav (header), footer, dan kerangka `<head>` — yang menjadi sumber konsistensi navigasi dan branding.
- **Modul_Navigasi**: Logika di `nav.js` yang menangani `.scrolled` state, _active nav highlighting_ (`setActiveNav`), normalisasi path (`normalizePath`), dan hamburger mobile (`initMobileNav`).
- **Modul_Tema**: Logika di `theme.js` yang menangani klik tombol toggle, persist tema ke `localStorage`, dan sinkronisasi ikon/teks tombol (`toggleTheme`).
- **Skrip_Anti_FOUC**: Script inline sinkron di `<head>` (`initThemeBeforePaint`) yang menetapkan class tema pada `documentElement` sebelum CSS ter-paint, mencegah _theme flash_ (FOUC).
- **Anti-FOUC**: Pencegahan _Flash Of Unstyled/Unthemed Content_ — kedipan tema dark→light saat halaman dimuat.
- **Active nav**: Penandaan item navigasi yang sesuai halaman aktif menggunakan class `.active` dan atribut `aria-current="page"`.
- **Menu_Mobile**: Komponen hamburger pada `#navbar` yang membuka/menutup `.nav-links` pada viewport `<900px`.
- **Skrip_Build**: Script Node opsional tanpa dependensi npm (`tools/build-pages.mjs`) yang merakit setiap halaman dari template + partial (`partials/_header.html`, `partials/_footer.html`).
- **Clean URL**: URL berbasis folder tanpa ekstensi `.html` (mis. `/services/` yang melayani `/services/index.html`).
- **Root-relative**: Path aset yang diawali leading slash (`/assets/...`) sehingga ter-resolve identik dari kedalaman folder mana pun, mengharuskan deploy di root domain.
- **PAGES**: Daftar kanonik halaman situs (slug, path, file) yang didefinisikan di design — 7 halaman + `/404.html`.
- **JSON-LD `Service`**: Schema.org structured data bertipe `Service` untuk halaman layanan ("Pembuatan Website" dan "Pembuatan Video AI").
- **CSS core**: `base`, `layout`, `sections`, `components`, `responsive` (dimuat semua halaman; `hero` hanya di Home).
- **JS core**: `theme`, `nav`, `reveal`, `main` (dimuat semua halaman).

## Requirements

### Requirement 1: Shared Shell (Header & Footer) Konsisten dan SEO-Friendly

**User Story:** Sebagai developer yang memelihara situs, saya ingin header (nav) dan footer berbagi secara konsisten di seluruh halaman dan hadir langsung di raw HTML, sehingga navigasi internal seragam, _link equity_ terdistribusi ke 7 halaman, dan SEO tidak terganggu.

_Berdasarkan section design: "Keputusan Inti — Strategi Berbagi Header/Footer", "High-Level: Struktur Situs & Shared Shell", "Komponen Shared", dan "Validation Rules"._

#### Acceptance Criteria

1. THE Situs SHALL menyertakan tepat satu elemen `<nav id="navbar">` dan tepat satu elemen `<footer>` pada setiap halaman dalam `PAGES` (7 halaman + `/404.html`). _(validates correctness property PROP-1)_
2. THE Situs SHALL menjaga markup nav dan footer — di luar atribut active-state runtime (`.active`, `aria-current`) — identik byte-per-byte di seluruh halaman dalam `PAGES`. _(validates correctness property PROP-11)_
3. THE Situs SHALL menempatkan seluruh link nav dan footer sebagai elemen `<a href>` di dalam raw HTML setiap halaman dalam `PAGES`, sehingga link tersebut hadir dan dapat ditelusuri pada respons HTML awal sebelum eksekusi JavaScript apa pun, tanpa injeksi link melalui JavaScript runtime.
4. WHERE Skrip_Build dijalankan, THE Skrip_Build SHALL merakit kedelapan file halaman dalam `PAGES` dari `partials/_header.html` dan `partials/_footer.html`, menghasilkan output tanpa menyisakan placeholder `{{...}}`, dan menghasilkan output byte-identik bila dijalankan ulang dengan input yang sama (deterministik dan idempoten).
5. IF JavaScript dinonaktifkan di browser, THEN THE Situs SHALL tetap menampilkan nav, footer, dan konten halaman, di mana setiap link cross-page pada nav dan footer merupakan `<a href>` root-relative yang menunjuk ke path terdaftar di `PAGES` sehingga dapat dinavigasi tanpa bergantung pada eksekusi JavaScript.

### Requirement 2: Navigasi Cross-Page dan Active Highlighting

**User Story:** Sebagai pengunjung situs, saya ingin berpindah antar halaman melalui navigasi dan melihat halaman mana yang sedang aktif, sehingga saya dapat menelusuri konten dengan jelas tanpa menemui link rusak.

_Berdasarkan section design: "High-Level: Peta Navigasi (Internal Linking)", "Sequence: Active Nav Highlighting", "Algoritma 3: Active Nav Highlighting", "Algoritma 5: Link Resolver", dan "Data Models — Definisi Navigasi"._

#### Acceptance Criteria

1. THE Situs SHALL memastikan setiap link internal (yakni `<a href>` selain tautan eksternal `http(s)` ke domain lain, `mailto:`, `tel:`, dan `wa.me`) pada setiap halaman, setelah dinormalisasi, menunjuk ke path yang terdaftar di `PAGES`, dan tidak memuat link anchor `#section` yang menunjuk ke section yang telah dipindahkan ke halaman lain. _(validates correctness properties PROP-3, PROP-12)_
2. WHEN sebuah halaman dimuat (`DOMContentLoaded`), THE Modul_Navigasi SHALL membandingkan path tiap link nav dengan `location.pathname` memakai normalisasi path yang deterministik dan idempoten (membuang hash dan query, `""` → `"/"`, menambahkan trailing slash untuk path non-`.html`), lalu menetapkan class `.active` dan atribut `aria-current="page"` pada tepat satu item nav top-level yang cocok, dan nol item bila path halaman tidak terdaftar di `PAGES` (mis. `/404.html`). _(validates correctness properties PROP-4, PROP-10)_
3. WHEN item nav "Process" diklik dari halaman mana pun, THE Situs SHALL mengarahkan ke `/services/#process` di mana halaman `/services/` memuat section Process sehingga browser memosisikan tampilan ke section tersebut setelah halaman dimuat.
4. WHERE item nav "Layanan" memiliki sub-menu, THE Situs SHALL menyediakan dropdown berisi tepat dua link — `/layanan-website/` dan `/layanan-video-ai/`; dan WHEN salah satu child cocok dengan halaman aktif, THE Modul_Navigasi SHALL menandai link induk dropdown dengan class `.active` (tanpa `aria-current`, agar tetap tepat satu `aria-current` per halaman).

### Requirement 3: Persistensi Tema dan Pencegahan Theme Flash (Anti-FOUC)

**User Story:** Sebagai pengunjung, saya ingin preferensi tema (dark/light) tetap konsisten saat berpindah halaman tanpa kedipan, sehingga pengalaman membaca tetap nyaman di setiap navigasi.

_Berdasarkan section design: "Sequence: Navigasi Antar Halaman + Pencegahan Theme Flash", "Algoritma 1: Anti-FOUC Theme Init", "Algoritma 2: Theme Toggle", dan "Error Handling"._

#### Acceptance Criteria

1. WHILE nilai `localStorage.theme` adalah "light", THE Skrip_Anti_FOUC SHALL menetapkan class `light-mode` pada `documentElement` secara sinkron sebelum `<link rel="stylesheet">` pertama dievaluasi, sehingga pada paint pertama `documentElement` sudah membawa class `light-mode` dan tidak terjadi perubahan tema setelah paint pertama (tanpa flash). _(validates correctness property PROP-5)_
2. WHILE nilai `localStorage.theme` bukan "light" (dark, kosong, tidak ada, atau nilai tak dikenal), THE Skrip_Anti_FOUC SHALL tidak menetapkan class `light-mode` pada `documentElement` sehingga paint pertama menampilkan tema dark default. _(validates correctness property PROP-5)_
3. WHEN tombol theme toggle ditekan satu kali, THE Modul_Tema SHALL membalik class `light-mode` pada `documentElement` dan menyimpan nilai `localStorage.theme` secara persis sebagai `"light"` atau `"dark"` sesuai state baru, serta menyinkronkan ikon/teks tombol. _(validates correctness property PROP-9)_
4. WHEN tombol theme toggle ditekan dua kali berturut-turut, THE Modul_Tema SHALL mengembalikan class `documentElement` dan nilai `localStorage.theme` ke kondisi persis semula (involutif). _(validates correctness property PROP-9)_
5. IF akses baca `localStorage` (di Skrip_Anti_FOUC) atau akses tulis `localStorage` (di Modul_Tema) gagal — mis. private mode atau diblokir kebijakan browser — THEN THE Situs SHALL menggunakan tema dark sebagai default tanpa melempar exception yang tidak tertangani, dan toggle tema tetap berfungsi secara visual dalam sesi berjalan.

### Requirement 4: Pemuatan Aset Per Halaman (Root-Relative, Tanpa Aset Berlebih)

**User Story:** Sebagai developer, saya ingin setiap halaman hanya memuat CSS/JS yang relevan dengan path root-relative, sehingga halaman tetap ringan dan path aset ter-resolve identik dari kedalaman folder mana pun.

_Berdasarkan section design: "Daftar Aset Wajib per Halaman", "Penamaan File & Clean URL", dan "Components and Interfaces"._

#### Acceptance Criteria

1. THE Setiap_Halaman SHALL memuat tepat kelima berkas CSS core (`base`, `layout`, `sections`, `components`, `responsive`) dan keempat berkas JS core (`theme`, `nav`, `reveal`, `main`). _(validates correctness property PROP-6)_
2. THE Setiap_Halaman SHALL mereferensikan seluruh aset CSS, JS, dan gambar memakai path root-relative yang diawali `/assets/`, tanpa memuat referensi aset berpath relatif-dokumen (mis. `assets/...` atau `../assets/...`).
3. WHERE halaman adalah Layanan Website atau Layanan Video AI, THE Setiap_Halaman SHALL memuat tambahan `services-commercial.css` dan `services.js`; halaman selain kedua halaman tersebut SHALL tidak memuat `services-commercial.css` maupun `services.js`. _(validates correctness property PROP-6)_
4. WHERE halaman adalah Case Studies atau Founded, THE Setiap_Halaman SHALL memuat tambahan `toggles.js`; halaman selain kedua halaman tersebut SHALL tidak memuat `toggles.js`. _(validates correctness property PROP-6)_
5. WHERE halaman adalah Home, THE Home SHALL memuat `hero.css`; halaman selain Home SHALL tidak memuat `hero.css`. _(validates correctness property PROP-6)_

### Requirement 5: SEO Per Halaman (Meta Unik dan JSON-LD Tepat Sasaran)

**User Story:** Sebagai pemilik situs lead-gen, saya ingin setiap halaman memiliki title, description, canonical, dan Open Graph unik serta JSON-LD yang tepat sasaran, sehingga setiap topik dapat di-index dan di-share secara independen serta tampil baik di hasil pencarian dan social.

_Berdasarkan section design: "Example Usage — Struktur `<head>` tiap halaman", "Validation Rules", dan "Daftar Aset Wajib per Halaman (kolom jsonLd)"._

#### Acceptance Criteria

1. THE Setiap_Halaman SHALL memiliki `<title>` non-kosong dan `link[rel=canonical]` yang unik antar halaman dalam `PAGES`, serta `meta[name=description]` non-kosong sepanjang 50–160 karakter; di mana nilai `canonical` adalah URL absolut (menyertakan skema dan host) yang cocok dengan path kanonik halaman. _(validates correctness property PROP-7)_
2. THE Setiap_Halaman SHALL menyertakan tag Open Graph `og:title`, `og:description`, `og:url`, `og:image`, dan `og:type` dengan `content` non-kosong; di mana `og:url` sama dengan nilai `canonical` halaman dan `og:image` adalah URL absolut. _(validates correctness property PROP-7)_
3. THE Situs SHALL menempatkan schema JSON-LD `Service` "Pembuatan Website" hanya pada `/layanan-website/` dan schema JSON-LD `Service` "Pembuatan Video AI" hanya pada `/layanan-video-ai/` — masing-masing sebagai blok `<script type="application/ld+json">` yang valid di-parse, tepat satu schema `Service` per halaman tersebut, dan tidak menempatkan schema `Service` pada halaman lain. _(validates correctness property PROP-8)_

### Requirement 6: Pemecahan Konten ke 7 Halaman dengan Struktur Heading yang Benar

**User Story:** Sebagai pemilik situs, saya ingin konten single-page dipecah ke 7 halaman sesuai navigasi tanpa kehilangan konten, dengan struktur heading yang benar untuk SEO, sehingga setiap halaman fokus pada satu topik.

_Berdasarkan section design: "Pemetaan 7 Halaman", "Rasional penempatan konten yang ambigu", "Validation Rules", "Migration Strategy", dan "Halaman 404"._

#### Acceptance Criteria

1. THE Setiap_Halaman SHALL memiliki tepat satu elemen `<h1>` yang berisi teks non-kosong (minimal 1 karakter terlihat setelah trim whitespace). _(validates correctness property PROP-2)_
2. THE Situs SHALL memetakan section existing ke halaman sesuai tabel pemetaan 7 halaman — Home: Hero (`#home`) + About (`#about`); Services: `#services` + `#process`; Case Studies: `#projects` + `#clients`; Founded: `#founded` + `#skills` + `#experience` + `#credentials`; Layanan Website: `#jasa-website`; Layanan Video AI: `#jasa-video-ai`; Packages: `#packages` + `#contact` — sehingga setiap section existing dari `index.html` muncul tepat pada satu dari ketujuh halaman, tidak ada section yang hilang, dan tidak ada section yang terduplikasi di lebih dari satu halaman.
3. IF sebuah URL yang tidak terdaftar di `PAGES` diminta, THEN THE Situs SHALL menyajikan `/404.html` yang memuat tepat satu `<meta name="robots" content="noindex">` dan tepat satu link "Kembali ke Home" dengan href `/`.
4. THE Setiap_Halaman SHALL menyusun heading secara hierarkis tanpa melompati level — elemen `<h1>` muncul sebagai heading pertama dalam urutan dokumen, dan tidak ada heading yang melompati level (mis. tidak ada `<h3>` tanpa `<h2>` yang mendahuluinya pada halaman yang sama).

### Requirement 7: Navigasi Mobile (Hamburger Menu)

**User Story:** Sebagai pengunjung di perangkat mobile (`<900px`), saya ingin menu hamburger untuk navigasi antar halaman, sehingga saya tetap dapat berpindah halaman dari ponsel (sebelumnya nav disembunyikan).

_Berdasarkan section design: "Algoritma 6: Mobile Hamburger Nav", "`initMobileNav(navRoot)`", "Active state styling", dan "Open Questions / Risks (Mobile nav kini in-scope)"._

#### Acceptance Criteria

1. WHILE viewport berukuran `<900px`, THE Menu_Mobile SHALL menampilkan tombol hamburger `.nav-toggle` sebagai kontrol navigasi yang dapat diklik, dan—setelah `initMobileNav` dijalankan—berada dalam keadaan tertutup secara default (`#navbar` tanpa class `.nav-open`, tombol hamburger `aria-expanded="false"`, dan `.nav-links` tidak ditampilkan sebagai panel navigasi terbuka). _(validates correctness property PROP-13)_
2. WHEN tombol hamburger `.nav-toggle` diklik sedangkan menu dalam keadaan tertutup, THE Menu_Mobile SHALL membuka dengan menambahkan class `.nav-open` pada `#navbar`, menetapkan `aria-expanded="true"`, dan menampilkan seluruh link `.nav-links` dalam keadaan terlihat dan dapat diklik. _(validates correctness property PROP-13)_
3. WHEN tombol hamburger `.nav-toggle` diklik sedangkan menu dalam keadaan terbuka, THE Menu_Mobile SHALL menutup dengan menghapus class `.nav-open` dari `#navbar` dan menetapkan `aria-expanded="false"`. _(validates correctness property PROP-13)_
4. WHEN pengguna mengklik salah satu link pada `.nav-links`, menekan tombol Escape, atau mengubah ukuran viewport menjadi `>=900px`, THE Menu_Mobile SHALL menutup dengan menghapus class `.nav-open` dari `#navbar` dan menetapkan `aria-expanded="false"`. _(validates correctness property PROP-13)_
5. WHEN `initMobileNav` dipanggil lebih dari sekali pada `#navbar` yang sama, THE Modul_Navigasi SHALL tidak menambahkan event listener ganda (menggunakan guard `dataset.bound`), sehingga satu klik tombol hamburger tetap mengubah state menu tepat satu kali tanpa toggle ganda. _(validates correctness property PROP-13)_
6. IF `initMobileNav` dijalankan pada `#navbar` yang tidak memuat tombol `.nav-toggle` atau daftar `.nav-links`, THEN THE Modul_Navigasi SHALL berhenti tanpa melempar error dan tanpa mengubah state nav (tidak menambahkan class `.nav-open` maupun atribut `aria-expanded`). _(validates correctness property PROP-13)_

### Requirement 8: Situs Tetap Statis dengan Clean URL Berbasis Folder

**User Story:** Sebagai pemilik situs, saya ingin situs tetap 100% statis dengan clean URL berbasis folder, sehingga deploy ke static hosting tetap sederhana dan URL ramah SEO serta mudah di-share.

_Berdasarkan section design: "Goals & Non-Goals", "Penamaan File & Clean URL", dan "Dependencies"._

#### Acceptance Criteria

1. THE Situs SHALL men-deploy hanya artefak statis berupa file HTML, CSS, dan JavaScript vanilla — tanpa framework, bundler, SPA router, atau server-side include — sehingga seluruh situs dapat disajikan oleh static file server tanpa langkah build runtime, proses server-side, maupun instalasi dependensi.
2. THE Situs SHALL menyediakan clean URL berbasis folder tanpa ekstensi `.html` untuk ketujuh halaman konten sesuai daftar `PAGES` (mis. URL `/services/` dilayani oleh file `/services/index.html`), dengan `/404.html` sebagai satu-satunya pengecualian yang tetap memakai ekstensi `.html`.
3. THE Situs SHALL disajikan dari root domain sehingga seluruh referensi aset root-relative (`/assets/...`) ter-resolve ke file aset yang ada tanpa broken reference dari kedalaman folder halaman mana pun.
4. WHEN sebuah folder path clean URL yang terdaftar di `PAGES` (mis. `/services/`) diminta, THE Situs SHALL menyediakan file `index.html` di dalam folder tersebut sesuai pemetaan `PAGES` agar host dapat menyajikannya sebagai dokumen halaman.
5. WHERE Skrip_Build dijalankan untuk merakit halaman, THE Situs SHALL tetap men-deploy hanya artefak HTML, CSS, dan JavaScript statis tanpa menambahkan dependensi runtime pada artefak yang di-deploy.
