# CryptoSharia Affiliate Command Center
*(PHP + MySQL Version)*

Aplikasi dashboard kerja pribadi untuk Affiliate Content Creator CryptoSharia Masterclass.

## Fitur Baru (Versi PHP)
1. **Database-driven**: Semua data tersimpan aman di server MySQL, tidak hilang jika browser dibersihkan.
2. **Autentikasi**: Sistem login untuk mencegah akses tidak sah.
3. **Setup Wizard**: Cara mudah membuat akun admin pertama kali.
4. **Data Migration**: Fitur import data lama dari localStorage browser ke database baru.

## Persyaratan Sistem
- PHP 7.4 atau lebih baru (PHP 8.x direkomendasikan)
- MySQL 5.7+ atau MariaDB 10.3+
- PDO PHP Extension (biasanya aktif secara default)
- Web Server (Apache/Nginx/LiteSpeed)

## Cara Instalasi / Deployment di VPS

1. **Upload File**
   Upload semua file ke root directory web server Anda (misal `public_html` atau `/var/www/html`).

2. **Buat Database**
   Buat database baru di MySQL/MariaDB (misal: `cryptosharia_affiliate`).

3. **Import Database**
   Import file `database/schema.sql` ke dalam database yang baru dibuat.
   *Opsional tapi sangat disarankan: Import juga `database/seed.sql` setelah tabel terbentuk agar template data awal (hook, script, CTA) langsung tersedia.*

4. **Konfigurasi Database**
   Buka file `config/database.php` dan sesuaikan pengaturan koneksi:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'cryptosharia_affiliate');
   define('DB_USER', 'root');
   define('DB_PASS', 'password_anda_disini');
   ```

5. **Jalankan Setup**
   Akses `http://domain-anda.com/setup.php` di browser Anda.
   Buat username dan password untuk admin.

6. **Hapus File Setup (PENTING)**
   Setelah berhasil membuat akun, segera hapus file `setup.php` untuk alasan keamanan.

7. **Selesai**
   Silakan login di `http://domain-anda.com/login.php`.

## Migrasi Data Lama
Jika Anda mengakses aplikasi ini dari browser yang sama yang Anda gunakan di versi HTML statis sebelumnya, aplikasi akan mendeteksi data lama Anda (yang tersimpan di LocalStorage) dan memunculkan banner peringatan di bagian atas Dashboard. Klik tombol **"Import Data ke Database Sekarang"** untuk mentransfer semua leads, konten, dan history performa ke database baru.
