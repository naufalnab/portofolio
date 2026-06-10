<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/helpers.php';

// Redirect if already logged in
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username && $password) {
        $db = getDB();
        $stmt = $db->prepare('SELECT id, password_hash, display_name FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Login success
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['display_name'] = $user['display_name'];
            header('Location: index.php');
            exit;
        } else {
            $error = 'Username atau password salah.';
        }
    } else {
        $error = 'Mohon isi username dan password.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - CryptoSharia Command Center</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <style>
    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: var(--space-4); }
    .login-container { width: 100%; max-width: 400px; }
    .login-header { text-align: center; margin-bottom: var(--space-6); }
    .login-logo { width: 64px; height: 64px; margin: 0 auto var(--space-4); }
    .login-header h1 { font-size: var(--font-size-2xl); color: var(--gold-400); margin-bottom: var(--space-2); }
    .login-header p { color: var(--text-muted); font-size: var(--font-size-sm); }
    .alert { padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-4); font-size: var(--font-size-sm); }
    .alert-danger { background: rgba(231, 76, 60, 0.15); border: 1px solid rgba(231, 76, 60, 0.3); color: var(--red-500); }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <div class="login-logo">
        <svg viewBox="0 0 40 40" width="100%" height="100%">
          <defs>
            <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#c9a84c" />
              <stop offset="100%" style="stop-color:#e8c66a" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="url(#brandGrad)" />
          <text x="20" y="27" text-anchor="middle" fill="#0a1628" font-size="18" font-weight="800" font-family="Outfit">CS</text>
        </svg>
      </div>
      <h1>CryptoSharia</h1>
      <p>Affiliate Command Center</p>
    </div>

    <div class="card">
      <?php if ($error): ?>
        <div class="alert alert-danger"><?= sanitize($error) ?></div>
      <?php endif; ?>

      <form method="POST" action="login.php" class="form-grid">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" class="input" required autofocus>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" class="input" required>
        </div>
        <button type="submit" class="btn btn-gold btn-lg" style="width: 100%; margin-top: var(--space-2);">Login</button>
      </form>
    </div>
  </div>
</body>
</html>
