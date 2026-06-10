<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/helpers.php';

$db = getDB();

// Cek apakah tabel users sudah ada dan terisi
$stmt = $db->query('SHOW TABLES LIKE "users"');
$hasTable = $stmt->rowCount() > 0;

$userCount = 0;
if ($hasTable) {
    $stmt = $db->query('SELECT COUNT(*) FROM users');
    $userCount = (int)$stmt->fetchColumn();
}

// Jika belum ada tabel, minta user jalankan script import schema dulu
if (!$hasTable) {
    die('Tabel database belum dibuat. Silakan import schema.sql terlebih dahulu melalui phpMyAdmin atau command line MySQL.');
}

// Jika sudah ada user, setup dilarang
if ($userCount > 0) {
    die('Setup sudah pernah dijalankan. Untuk alasan keamanan, script ini tidak bisa dijalankan lagi.');
}

$success = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $displayName = trim($_POST['display_name'] ?? '');

    if ($username && $password && $displayName) {
        try {
            $db->beginTransaction();
            
            // Insert user
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare('INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)');
            $stmt->execute([$username, $hash, $displayName]);
            $newUserId = $db->lastInsertId();

            // Insert default settings
            $stmt = $db->prepare("INSERT INTO settings (user_id, promo_code, affiliate_type, affiliate_initial) VALUES (?, 'P-NFL', 'P', 'NFL')");
            $stmt->execute([$newUserId]);

            $db->commit();
            $success = true;
        } catch (Exception $e) {
            $db->rollBack();
            $error = 'Gagal membuat user: ' . $e->getMessage();
        }
    } else {
        $error = 'Semua kolom wajib diisi.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Setup - CryptoSharia Command Center</title>
  <link rel="stylesheet" href="assets/css/style.css">
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: var(--space-4); }
    .setup-container { width: 100%; max-width: 500px; }
    .alert { padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-4); font-size: var(--font-size-sm); }
    .alert-danger { background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.3); color: var(--red-500); }
    .alert-success { background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3); color: var(--green-400); }
    .alert-warning { background: rgba(232, 148, 76, 0.15); border: 1px solid rgba(232, 148, 76, 0.3); color: var(--orange-500); margin-top: var(--space-4); }
  </style>
</head>
<body>
  <div class="setup-container">
    <div style="text-align:center;margin-bottom:var(--space-6);">
      <h1 style="color:var(--gold-400);">Setup Pertama</h1>
      <p style="color:var(--text-muted);">Buat akun admin untuk Command Center</p>
    </div>

    <div class="card">
      <?php if ($success): ?>
        <div class="alert alert-success">
          <strong>✅ Setup berhasil!</strong><br><br>
          Akun Anda telah dibuat. Setelah ini, sangat disarankan untuk mengimpor file `database/seed.sql` agar data template bawaan (hook, CTA, prompt amigurumi) terisi otomatis.<br><br>
          <a href="login.php" class="btn btn-gold" style="margin-top:var(--space-3);display:inline-flex;">Lanjut ke Login</a>
        </div>
        <div class="alert alert-warning">
          <strong>⚠️ Keamanan:</strong><br>
          Mohon hapus atau rename file <code>setup.php</code> ini dari server Anda setelah selesai.
        </div>
      <?php else: ?>
        
        <?php if ($error): ?>
          <div class="alert alert-danger"><?= sanitize($error) ?></div>
        <?php endif; ?>

        <form method="POST" action="setup.php" class="form-grid">
          <div class="form-group">
            <label for="display_name">Nama Tampilan (Display Name)</label>
            <input type="text" id="display_name" name="display_name" class="input" placeholder="Misal: Naufal" required autofocus>
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" class="input" placeholder="admin" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" class="input" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:var(--space-2);">Buat Akun Admin</button>
        </form>

      <?php endif; ?>
    </div>
  </div>
</body>
</html>
