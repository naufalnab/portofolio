<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CryptoSharia Affiliate Command Center</title>
  <meta name="description" content="Dashboard kerja pribadi affiliate content creator CryptoSharia Masterclass">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
  <!-- Toast Notification -->
  <div id="toast" class="toast" aria-live="polite"></div>

  <!-- Confirm Modal -->
  <div id="confirmModal" class="modal-overlay" hidden>
    <div class="modal">
      <div class="modal-icon">⚠️</div>
      <h3 id="confirmTitle">Konfirmasi</h3>
      <p id="confirmMessage">Apakah Anda yakin?</p>
      <div class="modal-actions">
        <button id="confirmCancel" class="btn btn-ghost">Batal</button>
        <button id="confirmOk" class="btn btn-danger">Hapus</button>
      </div>
    </div>
  </div>
