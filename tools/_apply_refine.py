# -*- coding: utf-8 -*-
import io, sys

path = "/Users/mac/Documents/portofolio/portofolio/.kiro/specs/multi-page-restructure/requirements.md"
with io.open(path, encoding="utf-8") as f:
    lines = f.readlines()

replacements = [
    # (anchorA, anchorB, replacement-block)
    # Req 2 criterion 2
    ("membandingkan path tiap link nav", None,
     '2. WHEN sebuah halaman dimuat (`DOMContentLoaded`), THE Modul_Navigasi SHALL membandingkan path tiap link nav dengan `location.pathname` memakai normalisasi path yang deterministik dan idempoten (membuang hash dan query, `""` \u2192 `"/"`, menambahkan trailing slash untuk path non-`.html`), lalu menetapkan class `.active` dan atribut `aria-current="page"` pada tepat satu item nav top-level yang cocok, dan nol item bila path halaman tidak terdaftar di `PAGES` (mis. `/404.html`). _(validates correctness properties PROP-4, PROP-10)_\n'),
    # Req 3 criterion 1
    ("menetapkan class `light-mode` pada `documentElement` secara sinkron", None,
     '1. WHILE nilai `localStorage.theme` adalah "light", THE Skrip_Anti_FOUC SHALL menetapkan class `light-mode` pada `documentElement` secara sinkron sebelum `<link rel="stylesheet">` pertama dievaluasi, sehingga pada paint pertama `documentElement` sudah membawa class `light-mode` dan tidak terjadi perubahan tema setelah paint pertama (tanpa flash). _(validates correctness property PROP-5)_\n'
     '2. WHILE nilai `localStorage.theme` bukan "light" (dark, kosong, tidak ada, atau nilai tak dikenal), THE Skrip_Anti_FOUC SHALL tidak menetapkan class `light-mode` pada `documentElement` sehingga paint pertama menampilkan tema dark default. _(validates correctness property PROP-5)_\n'
     '3. WHEN tombol theme toggle ditekan satu kali, THE Modul_Tema SHALL membalik class `light-mode` pada `documentElement` dan menyimpan nilai `localStorage.theme` secara persis sebagai `"light"` atau `"dark"` sesuai state baru, serta menyinkronkan ikon/teks tombol. _(validates correctness property PROP-9)_\n'),
    # Req 3 criterion 2 (double press)
    ("ditekan dua kali berturut-turut", None,
     '4. WHEN tombol theme toggle ditekan dua kali berturut-turut, THE Modul_Tema SHALL mengembalikan class `documentElement` dan nilai `localStorage.theme` ke kondisi persis semula (involutif). _(validates correctness property PROP-9)_\n'),
    # Req 3 criterion 3 (localStorage fail)
    ("IF akses `localStorage` gagal", None,
     '5. IF akses baca `localStorage` (di Skrip_Anti_FOUC) atau akses tulis `localStorage` (di Modul_Tema) gagal \u2014 mis. private mode atau diblokir kebijakan browser \u2014 THEN THE Situs SHALL menggunakan tema dark sebagai default tanpa melempar exception yang tidak tertangani, dan toggle tema tetap berfungsi secara visual dalam sesi berjalan.\n'),
    # Req 4 criterion 1
    ("memuat seluruh CSS core", None,
     '1. THE Setiap_Halaman SHALL memuat tepat kelima berkas CSS core (`base`, `layout`, `sections`, `components`, `responsive`) dan keempat berkas JS core (`theme`, `nav`, `reveal`, `main`). _(validates correctness property PROP-6)_\n'),
    # Req 4 criterion 2 (root-relative)
    ("path root-relative yang diawali `/assets/...`", None,
     '2. THE Setiap_Halaman SHALL mereferensikan seluruh aset CSS, JS, dan gambar memakai path root-relative yang diawali `/assets/`, tanpa memuat referensi aset berpath relatif-dokumen (mis. `assets/...` atau `../assets/...`).\n'),
    # Req 4 criterion 3 -> expand to 3,4,5
    ("WHERE halaman adalah Home, THE Home SHALL memuat `hero.css`, dan halaman lain", None,
     '3. WHERE halaman adalah Layanan Website atau Layanan Video AI, THE Setiap_Halaman SHALL memuat tambahan `services-commercial.css` dan `services.js`; halaman selain kedua halaman tersebut SHALL tidak memuat `services-commercial.css` maupun `services.js`. _(validates correctness property PROP-6)_\n'
     '4. WHERE halaman adalah Case Studies atau Founded, THE Setiap_Halaman SHALL memuat tambahan `toggles.js`; halaman selain kedua halaman tersebut SHALL tidak memuat `toggles.js`. _(validates correctness property PROP-6)_\n'
     '5. WHERE halaman adalah Home, THE Home SHALL memuat `hero.css`; halaman selain Home SHALL tidak memuat `hero.css`. _(validates correctness property PROP-6)_\n'),
    # Req 5 criterion 1 -> expand to 1,2
    ("memiliki `<title>` dan `link[rel=canonical]` yang unik", None,
     '1. THE Setiap_Halaman SHALL memiliki `<title>` non-kosong dan `link[rel=canonical]` yang unik antar halaman dalam `PAGES`, serta `meta[name=description]` non-kosong sepanjang 50\u2013160 karakter; di mana nilai `canonical` adalah URL absolut (menyertakan skema dan host) yang cocok dengan path kanonik halaman. _(validates correctness property PROP-7)_\n'
     '2. THE Setiap_Halaman SHALL menyertakan tag Open Graph `og:title`, `og:description`, `og:url`, `og:image`, dan `og:type` dengan `content` non-kosong; di mana `og:url` sama dengan nilai `canonical` halaman dan `og:image` adalah URL absolut. _(validates correctness property PROP-7)_\n'),
    # Req 5 criterion 2 (JSON-LD) -> becomes 3
    ("menempatkan schema JSON-LD `Service` \"Pembuatan Website\" hanya pada", None,
     '3. THE Situs SHALL menempatkan schema JSON-LD `Service` "Pembuatan Website" hanya pada `/layanan-website/` dan schema JSON-LD `Service` "Pembuatan Video AI" hanya pada `/layanan-video-ai/` \u2014 masing-masing sebagai blok `<script type="application/ld+json">` yang valid di-parse, tepat satu schema `Service` per halaman tersebut, dan tidak menempatkan schema `Service` pada halaman lain. _(validates correctness property PROP-8)_\n'),
    # Req 6 criterion 1 (single h1)
    ("SHALL memiliki tepat satu elemen `<h1>`.", None,
     '1. THE Setiap_Halaman SHALL memiliki tepat satu elemen `<h1>` yang berisi teks non-kosong (minimal 1 karakter terlihat setelah trim whitespace). _(validates correctness property PROP-2)_\n'),
    # Req 6 criterion 2 (mapping)
    ("memetakan section existing ke halaman sesuai tabel pemetaan 7 halaman", None,
     '2. THE Situs SHALL memetakan section existing ke halaman sesuai tabel pemetaan 7 halaman \u2014 Home: Hero (`#home`) + About (`#about`); Services: `#services` + `#process`; Case Studies: `#projects` + `#clients`; Founded: `#founded` + `#skills` + `#experience` + `#credentials`; Layanan Website: `#jasa-website`; Layanan Video AI: `#jasa-video-ai`; Packages: `#packages` + `#contact` \u2014 sehingga setiap section existing dari `index.html` muncul tepat pada satu dari ketujuh halaman, tidak ada section yang hilang, dan tidak ada section yang terduplikasi di lebih dari satu halaman.\n'),
    # Req 6 criterion 3 (404) -> 3 + append 4
    ("THE Situs SHALL menyajikan `/404.html` yang memuat", None,
     '3. IF sebuah URL yang tidak terdaftar di `PAGES` diminta, THEN THE Situs SHALL menyajikan `/404.html` yang memuat tepat satu `<meta name="robots" content="noindex">` dan tepat satu link "Kembali ke Home" dengan href `/`.\n'
     '4. THE Setiap_Halaman SHALL menyusun heading secara hierarkis tanpa melompati level \u2014 elemen `<h1>` muncul sebagai heading pertama dalam urutan dokumen, dan tidak ada heading yang melompati level (mis. tidak ada `<h3>` tanpa `<h2>` yang mendahuluinya pada halaman yang sama).\n'),
    # Req 7 criterion 1 -> expand to 1,2,3
    ("default dalam keadaan tertutup", None,
     '1. WHILE viewport berukuran `<900px`, THE Menu_Mobile SHALL menampilkan tombol hamburger `.nav-toggle` sebagai kontrol navigasi yang dapat diklik, dan\u2014setelah `initMobileNav` dijalankan\u2014berada dalam keadaan tertutup secara default (`#navbar` tanpa class `.nav-open`, tombol hamburger `aria-expanded="false"`, dan `.nav-links` tidak ditampilkan sebagai panel navigasi terbuka). _(validates correctness property PROP-13)_\n'
     '2. WHEN tombol hamburger `.nav-toggle` diklik sedangkan menu dalam keadaan tertutup, THE Menu_Mobile SHALL membuka dengan menambahkan class `.nav-open` pada `#navbar`, menetapkan `aria-expanded="true"`, dan menampilkan seluruh link `.nav-links` dalam keadaan terlihat dan dapat diklik. _(validates correctness property PROP-13)_\n'
     '3. WHEN tombol hamburger `.nav-toggle` diklik sedangkan menu dalam keadaan terbuka, THE Menu_Mobile SHALL menutup dengan menghapus class `.nav-open` dari `#navbar` dan menetapkan `aria-expanded="false"`. _(validates correctness property PROP-13)_\n'),
    # Req 7 criterion 2 -> 4
    ("mengklik salah satu link nav, menekan tombol Escape", None,
     '4. WHEN pengguna mengklik salah satu link pada `.nav-links`, menekan tombol Escape, atau mengubah ukuran viewport menjadi `>=900px`, THE Menu_Mobile SHALL menutup dengan menghapus class `.nav-open` dari `#navbar` dan menetapkan `aria-expanded="false"`. _(validates correctness property PROP-13)_\n'),
    # Req 7 criterion 3 -> 5 + append 6
    ("`initMobileNav` dipanggil lebih dari sekali", None,
     '5. WHEN `initMobileNav` dipanggil lebih dari sekali pada `#navbar` yang sama, THE Modul_Navigasi SHALL tidak menambahkan event listener ganda (menggunakan guard `dataset.bound`), sehingga satu klik tombol hamburger tetap mengubah state menu tepat satu kali tanpa toggle ganda. _(validates correctness property PROP-13)_\n'
     '6. IF `initMobileNav` dijalankan pada `#navbar` yang tidak memuat tombol `.nav-toggle` atau daftar `.nav-links`, THEN THE Modul_Navigasi SHALL berhenti tanpa melempar error dan tanpa mengubah state nav (tidak menambahkan class `.nav-open` maupun atribut `aria-expanded`). _(validates correctness property PROP-13)_\n'),
]

def find_idx(anchorA):
    for i, line in enumerate(lines):
        if anchorA in line:
            return i
    return -1

applied = 0
for anchorA, anchorB, repl in replacements:
    idx = find_idx(anchorA)
    if idx == -1:
        sys.stderr.write("NOT FOUND: %s\n" % anchorA)
        continue
    lines[idx] = repl
    applied += 1

with io.open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("applied", applied, "of", len(replacements))
