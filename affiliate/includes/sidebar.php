<?php
// Sidebar include — uses $settings from index.php
$promoCode = isset($settings['promo_code']) ? sanitize($settings['promo_code']) : 'P-NFL';
?>
  <!-- Sidebar -->
  <aside id="sidebar" class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-icon">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <defs>
            <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#c9a84c" />
              <stop offset="100%" style="stop-color:#e8c66a" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="url(#brandGrad)" />
          <text x="20" y="27" text-anchor="middle" fill="#0a1628" font-size="18" font-weight="800"
            font-family="Outfit">CS</text>
        </svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">CryptoSharia</span>
        <span class="brand-sub">Command Center</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      <a href="#dashboard" class="nav-link active" data-section="dashboard">
        <span class="nav-icon">📊</span><span class="nav-text">Dashboard</span>
      </a>
      <a href="#alur" class="nav-link" data-section="alur">
        <span class="nav-icon">🔄</span><span class="nav-text">Alur Affiliate</span>
      </a>
      <a href="#studio" class="nav-link" data-section="studio">
        <span class="nav-icon">🎬</span><span class="nav-text">Content Studio</span>
      </a>
      <a href="#promo" class="nav-link" data-section="promo">
        <span class="nav-icon">🏷️</span><span class="nav-text">Promo & WhatsApp</span>
      </a>
      <a href="#leads" class="nav-link" data-section="leads">
        <span class="nav-icon">👥</span><span class="nav-text">Lead Tracker</span>
      </a>
      <a href="#performance" class="nav-link" data-section="performance">
        <span class="nav-icon">📈</span><span class="nav-text">Content Performance</span>
      </a>
      <a href="#komisi" class="nav-link" data-section="komisi">
        <span class="nav-icon">💰</span><span class="nav-text">Komisi Calculator</span>
      </a>
      <a href="#calendar" class="nav-link" data-section="calendar">
        <span class="nav-icon">📅</span><span class="nav-text">Calendar & Checklist</span>
      </a>
      <a href="#assets" class="nav-link" data-section="assets">
        <span class="nav-icon">🎨</span><span class="nav-text">Asset Library</span>
      </a>
      <a href="#syariah" class="nav-link" data-section="syariah">
        <span class="nav-icon">📜</span><span class="nav-text">Prinsip Syariah</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="quick-copy-section">
        <p class="quick-copy-title">⚡ Quick Copy</p>
        <button class="btn btn-sm btn-outline" onclick="App.quickCopy('cta')">Copy CTA</button>
        <button class="btn btn-sm btn-outline" onclick="App.quickCopy('admin')">Copy Pesan Admin</button>
        <button class="btn btn-sm btn-outline" onclick="App.quickCopy('followup')">Copy Follow Up</button>
        <button class="btn btn-sm btn-outline" onclick="App.quickCopy('caption')">Copy Caption</button>
        <button class="btn btn-sm btn-outline" onclick="App.quickCopy('disclaimer')">Copy Disclaimer</button>
      </div>
      <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-color);">
        <p class="text-xs text-muted" style="margin-bottom:var(--space-2);">👤 <?php echo sanitize(getCurrentUserName()); ?></p>
        <a href="logout.php" class="btn btn-sm btn-ghost" style="width:100%;">🚪 Logout</a>
      </div>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="mobile-header">
    <button id="menuToggle" class="menu-toggle" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <span class="mobile-brand">CryptoSharia CC</span>
  </header>
