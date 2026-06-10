<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/helpers.php';

requireLogin();

$db = getDB();
$uid = getCurrentUserId();

// Load settings to inject into frontend
$stmt = $db->prepare('SELECT * FROM settings WHERE user_id = ? LIMIT 1');
$stmt->execute([$uid]);
$settings = $stmt->fetch();
if (!$settings) {
    $settings = [
        'promo_code' => 'P-NFL',
        'affiliate_type' => 'P',
        'affiliate_initial' => 'NFL',
        'affiliate_number' => '',
        'admin_whatsapp' => ''
    ];
}

include __DIR__ . '/includes/header.php';
include __DIR__ . '/includes/sidebar.php';
?>

  <!-- Main Content -->
  <main id="mainContent" class="main-content">

    <!-- Migration Alert (Dynamic via JS) -->
    <div id="migrationAlert" class="alert alert-warning" style="display:none; margin-bottom:var(--space-6);">
        <strong>⚠️ Data Lama Ditemukan!</strong><br>
        Kami mendeteksi Anda memiliki data dari versi localStorage lama (belum tersimpan ke database).<br>
        <button class="btn btn-sm btn-primary" onclick="App.importFromLocalStorage()" style="margin-top:var(--space-2);">Import Data ke Database Sekarang</button>
    </div>

    <!-- ==================== SECTION 1: DASHBOARD ==================== -->
    <section id="dashboard" class="section active">
      <div class="section-header">
        <h1>Dashboard</h1>
        <p class="section-subtitle">Ringkasan performa affiliate Anda</p>
      </div>

      <!-- Promo Code Banner -->
      <div class="promo-banner" id="dashPromo">
        <div class="promo-banner-content">
          <span class="promo-label">Kode Promo Anda</span>
          <span class="promo-code" id="dashPromoCode"><?= sanitize($settings['promo_code']) ?></span>
          <button class="btn btn-gold btn-sm" onclick="App.copyPromoCode()">📋 Copy</button>
        </div>
      </div>

      <!-- Progress Targets -->
      <div class="card">
        <h3 class="card-title">Progress Target Affiliate</h3>
        <div class="grid-2">
          <div class="progress-wrap">
            <div class="progress-label"><span>Target 3 Pendaftar</span><span class="badge badge-bronze">BRONZE</span></div>
            <div class="progress-bar"><div class="progress-fill" id="progress3" style="width: 0%;"></div></div>
            <div class="progress-label text-sm"><span id="progress3Text">0/3</span><span class="text-muted">Potensi: Rp1.500.000</span></div>
          </div>
          <div class="progress-wrap">
            <div class="progress-label"><span>Target 5 Pendaftar</span><span class="badge badge-silver">SILVER</span></div>
            <div class="progress-bar"><div class="progress-fill" id="progress5" style="width: 0%;"></div></div>
            <div class="progress-label text-sm"><span id="progress5Text">0/5</span><span class="text-muted">Potensi: Rp3.000.000</span></div>
          </div>
          <div class="progress-wrap" style="grid-column: 1 / -1;">
            <div class="progress-label"><span>Target 10 Pendaftar</span><span class="badge badge-gold">GOLD</span></div>
            <div class="progress-bar"><div class="progress-fill progress-fill-green" id="progress10" style="width: 0%;"></div></div>
            <div class="progress-label text-sm"><span id="progress10Text">0/10</span><span class="text-muted">Potensi: Rp8.000.000</span></div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">👥</div>
          <div class="stat-info">
            <span class="stat-value" id="statTotalLeads">0</span>
            <span class="stat-label">Total Lead</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-orange">💬</div>
          <div class="stat-info">
            <span class="stat-value" id="statDirected">0</span>
            <span class="stat-label">Diarahkan Admin</span>
          </div>
        </div>
        <div class="stat-card stat-card-highlight">
          <div class="stat-icon stat-icon-green">✅</div>
          <div class="stat-info">
            <span class="stat-value text-gold" id="statRegistered">0</span>
            <span class="stat-label">Sudah Daftar</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-purple">🎬</div>
          <div class="stat-info">
            <span class="stat-value" id="statContent">0</span>
            <span class="stat-label">Konten Posted</span>
          </div>
        </div>
        <div class="stat-card stat-card-highlight" style="grid-column: 1 / -1; justify-content: center; text-align: center;">
          <div class="stat-icon stat-icon-gold">💰</div>
          <div class="stat-info" style="align-items: center;">
            <span class="stat-value text-gold" id="statKomisi">Rp0</span>
            <span class="stat-label">Estimasi Komisi (Dari Pendaftar)</span>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3 class="card-title">🏆 Konten Terbaik</h3>
          <div id="bestContent" class="best-item-box">
            <p class="text-muted">Loading...</p>
          </div>
          <div style="margin-top:var(--space-4);">
            <h3 class="card-title" style="margin-bottom:var(--space-3);">🎯 CTA Terbaik</h3>
            <div id="bestCTA" class="best-item-box">
              <p class="text-muted">Loading...</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">💡 Best Content Insights</h3>
          <div id="contentInsights" class="insights-container">
            <p class="text-muted">Loading insights...</p>
          </div>
        </div>
      </div>

      <!-- Hook A/B Test Dashboard Section -->
      <div class="card" style="margin-top: var(--space-6);">
        <h3 class="card-title">⚖️ Hook A/B Test Comparison</h3>
        <p class="text-muted text-sm" style="margin-bottom: var(--space-4);">Bandingkan performa dua konten untuk melihat hook mana yang lebih efektif.</p>
        <div class="ab-compare-container">
          <div class="ab-side">
            <select id="abSelectA" class="input" style="margin-bottom: var(--space-3);" onchange="App.compareHooks()">
              <option value="">Pilih Hook A...</option>
            </select>
            <div class="ab-stats" id="hookAStats">
              <div class="ab-stat"><span class="ab-stat-label">Views</span><input type="number" id="hookAViews"
                  class="input input-sm" value="0" min="0"></div>
              <div class="ab-stat"><span class="ab-stat-label">DM</span><input type="number" id="hookADM"
                  class="input input-sm" value="0" min="0"></div>
              <div class="ab-stat"><span class="ab-stat-label">Lead</span><input type="number" id="hookALead"
                  class="input input-sm" value="0" min="0"></div>
              <div class="ab-stat"><span class="ab-stat-label">Pendaftar</span><input type="number" id="hookAReg"
                  class="input input-sm" value="0" min="0"></div>
            </div>
          </div>
          <div class="ab-vs">VS</div>
          <div class="ab-side">
            <select id="abSelectB" class="input" style="margin-bottom: var(--space-3);" onchange="App.compareHooks()">
              <option value="">Pilih Hook B...</option>
            </select>
            <div class="ab-stats" id="hookBStats">
              <div class="ab-stat"><span class="ab-stat-label">Views</span><input type="number" id="hookBViews"
                  class="input input-sm" value="0" min="0"></div>
              <div class="ab-stat"><span class="ab-stat-label">DM</span><input type="number" id="hookBDM"
                  class="input input-sm" value="0" min="0"></div>
              <div class="ab-stat"><span class="ab-stat-label">Lead</span><input type="number" id="hookBLead"
                  class="input input-sm" value="0" min="0"></div>
              <div class="ab-stat"><span class="ab-stat-label">Pendaftar</span><input type="number" id="hookBReg"
                  class="input input-sm" value="0" min="0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION 2: ALUR AFFILIATE ==================== -->
    <section id="alur" class="section">
      <div class="section-header">
        <h1>Alur Affiliate Marketing</h1>
        <p class="section-subtitle">Pahami perjalanan dari konten hingga konversi pendaftaran</p>
      </div>

      <div class="card">
        <h3 class="card-title">Timeline Perjalanan Lead</h3>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-dot">1</div>
            <div class="timeline-content">
              <h3>🎬 Membuat Konten</h3>
              <p>Anda membuat konten edukatif amigurumi 3D faceless tentang crypto syariah di TikTok, Instagram Reels,
                atau YouTube Shorts.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">2</div>
            <div class="timeline-content">
              <h3>🎯 Menyematkan CTA</h3>
              <p>Di akhir video atau di caption, Anda mengajak audiens untuk belajar lebih lanjut dan mengarahkan mereka untuk DM/chat Anda.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">3</div>
            <div class="timeline-content">
              <h3>💬 Audiens Menghubungi Anda (Lead Masuk)</h3>
              <p>Audiens yang tertarik akan DM Anda atau klik link WhatsApp Anda. Di tahap ini, catat mereka di <strong>Lead Tracker</strong>.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">4</div>
            <div class="timeline-content">
              <h3>🤝 Memberikan Info & Kode Promo</h3>
              <p>Anda menjelaskan sedikit tentang Masterclass (gunakan Quick Copy) dan memberikan <strong>Kode Promo</strong> Anda agar mereka dapat diskon.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">5</div>
            <div class="timeline-content">
              <h3>📲 Mengarahkan ke Admin</h3>
              <p>Berikan link WhatsApp Admin Pusat ke lead. Minta mereka chat admin dengan menyertakan kode promo Anda.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">6</div>
            <div class="timeline-content">
              <h3>🔄 Follow Up</h3>
              <p>Jika lead belum daftar setelah beberapa hari, kirim pesan follow-up santai untuk mengingatkan promo.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">7</div>
            <div class="timeline-content">
              <h3>✅ Lead Mendaftar</h3>
              <p>Lead transfer ke rekening pusat. Admin mengkonfirmasi pendaftaran dan mencatat kode promo Anda.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot">8</div>
            <div class="timeline-content">
              <h3>💰 Pencairan Komisi</h3>
              <p>Komisi akan direkap dan dicairkan oleh admin pusat sesuai jadwal yang disepakati.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Funnel Konversi (Visualisasi)</h3>
        <div class="funnel-container">
          <div class="funnel-step" style="width: 100%; background: var(--blue-400);">1. Views Konten</div>
          <div class="funnel-step" style="width: 80%; background: var(--blue-300);">2. Profile Visits</div>
          <div class="funnel-step" style="width: 60%; background: var(--gold-400); color: var(--navy-900);">3. Lead DM / Chat WhatsApp</div>
          <div class="funnel-step" style="width: 40%; background: var(--gold-500); color: var(--navy-900);">4. Chat Admin Pusat</div>
          <div class="funnel-step" style="width: 25%; background: var(--green-400); color: var(--navy-900);">5. Closing / Mendaftar</div>
        </div>
        <p class="text-sm text-muted" style="text-align: center; margin-top: var(--space-4);">*Fokus Anda adalah memperbesar corong di nomor 1, 2, dan 3. Nomor 4 dan 5 adalah hasil dari kualitas edukasi Anda dan follow-up.</p>
      </div>
    </section>

    <!-- ==================== SECTION 3: CONTENT STUDIO ==================== -->
    <section id="studio" class="section">
      <div class="section-header">
        <h1>Content Studio</h1>
        <p class="section-subtitle">Buat, simpan, dan kelola script konten Anda</p>
      </div>

      <div class="tabs">
        <div class="tab-bar">
          <button class="tab-btn active" data-tab="studioCreate">📝 Buat Konten</button>
          <button class="tab-btn" data-tab="studioBank">🏦 Bank Ide & Hook</button>
        </div>
        
        <div id="studioCreate" class="tab-content active">
          <div style="display: flex; flex-direction: column; gap: var(--space-6);">
            <!-- Form Konten -->
            <div class="card">
              <h3 class="card-title">Draft Konten</h3>
              <form id="contentForm" class="form-grid">
                <input type="hidden" id="contentEditId">
                <div class="form-group">
                  <label for="contentTitle">Judul / Topik</label>
                  <input type="text" id="contentTitle" class="input" placeholder="Misal: Kenapa FOMO itu bahaya..." required>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="contentPlatform">Platform Target</label>
                    <select id="contentPlatform" class="input">
                      <option>TikTok</option>
                      <option>Instagram Reels</option>
                      <option>YouTube Shorts</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="contentCategory">Kategori</label>
                    <select id="contentCategory" class="input">
                      <option value="edukasi">Edukasi Mindset</option>
                      <option value="anti-FOMO">Anti-FOMO / Warning</option>
                      <option value="syariah">Prinsip Syariah</option>
                      <option value="pemula">Tutorial Pemula</option>
                      <option value="soft selling">Soft Selling</option>
                      <option value="CTA">Hard Selling / Promo CTA</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="contentHook">Hook (3 Detik Pertama)</label>
                  <textarea id="contentHook" class="input" rows="2" placeholder="Kalimat pertama yang menarik perhatian..."></textarea>
                </div>
                <div class="form-group">
                  <label for="contentScript">Isi Script</label>
                  <textarea id="contentScript" class="input" rows="5"
                    placeholder="Tulis script lengkap di sini..."></textarea>
                </div>
                <div class="form-group">
                  <label for="contentCTA">CTA</label>
                  <input type="text" id="contentCTA" class="input" placeholder="Misal: Cek link di bio untuk belajar...">
                </div>
                <div class="form-group">
                  <label for="contentCaption">Caption & Hashtag</label>
                  <textarea id="contentCaption" class="input" rows="3" placeholder="Tulis caption..."></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="contentStatus">Status</label>
                    <select id="contentStatus" class="input">
                      <option value="draft">Draft (Sedang ditulis)</option>
                      <option value="ready">Ready (Siap produksi/upload)</option>
                      <option value="posted">Posted (Sudah tayang)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="contentNotes">Catatan</label>
                    <input type="text" id="contentNotes" class="input" placeholder="...">
                  </div>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">💾 Simpan Konten</button>
                  <button type="button" class="btn btn-outline" onclick="App.resetContentForm()">Batal</button>
                </div>
              </form>
            </div>

            <!-- List Konten -->
            <div class="card">
              <div class="card-header-row">
                <h3 class="card-title">Daftar Konten</h3>
                <div class="card-actions">
                  <input type="text" id="contentSearch" class="input input-sm" placeholder="🔍 Cari konten..."
                    oninput="App.filterContent()">
                  <button class="btn btn-sm btn-danger" onclick="App.resetModule('contents')">🗑️ Reset Data</button>
                </div>
              </div>
              <div class="table-wrap">
                <table class="table" id="contentTable">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Platform</th>
                      <th>Kategori</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="contentTableBody">
                    <!-- Loaded via JS -->
                  </tbody>
                </table>
                <div id="contentEmpty" class="empty-state" hidden>
                  Belum ada konten. Mulai buat draft pertama Anda!
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="studioBank" class="tab-content">
          <div class="grid-2">
            <div class="card">
              <h3 class="card-title">💡 Bank Ide Konten</h3>
              <div class="bank-list" id="ideaBank">Loading...</div>
            </div>
            <div class="card">
              <h3 class="card-title">🎣 Bank Hook Menarik</h3>
              <div class="bank-list" id="hookBank">Loading...</div>
            </div>
            <div class="card">
              <h3 class="card-title">🎯 Bank Call to Action (CTA)</h3>
              <div class="bank-list" id="ctaBank">Loading...</div>
            </div>
            <div class="card">
              <h3 class="card-title">📝 Script Template Singkat</h3>
              <div class="bank-list" id="scriptBank">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION 4: PROMO & WHATSAPP ==================== -->
    <section id="promo" class="section">
      <div class="section-header">
        <h1>Promo & WhatsApp Tools</h1>
        <p class="section-subtitle">Kelola kode promo dan hasilkan link WhatsApp otomatis</p>
      </div>

      <div class="grid-2">
        <div class="card promo-card-big">
          <div class="promo-display">
            <span class="promo-label-big">KODE PROMO ANDA</span>
            <span class="promo-code-big" id="promoCodeDisplay"><?= sanitize($settings['promo_code']) ?></span>
            <button class="btn btn-gold" onclick="App.copyPromoCode()">📋 Copy Kode Promo</button>
          </div>
          <div class="promo-benefits">
            <h4>Benefit untuk Pendaftar yang memakai kode ini:</h4>
            <ul>
              <li>✅ Diskon Rp250.000</li>
              <li>✅ Bonus akses Discord Premium 6 Bulan (Senilai Rp1.000.000)</li>
            </ul>
          </div>
          <div class="promo-format">
            <h4>Format Kode Promo</h4>
            <p><strong>M</strong> = Member CryptoSharia<br>
              <strong>P</strong> = Pengurus CryptoSharia<br>
              + Inisial nama + Nomor urut
            </p>
            <p class="text-muted text-sm">Contoh: P - NFL | Kode final diberikan admin.</p>
          </div>
          <!-- Promo Code Simulator -->
          <div class="promo-simulator">
            <h4 style="margin-bottom:var(--space-3);">Update Setting Affiliate</h4>
            <div class="form-row form-row-3" style="align-items:flex-end;">
              <div class="form-group">
                <label for="promoType">Tipe</label>
                <select id="promoType" class="input" onchange="App.simulatePromo()">
                  <option value="M" <?= $settings['affiliate_type'] === 'M' ? 'selected' : '' ?>>M (Member)</option>
                  <option value="P" <?= $settings['affiliate_type'] === 'P' ? 'selected' : '' ?>>P (Pengurus)</option>
                </select>
              </div>
              <div class="form-group">
                <label for="promoInitial">Inisial</label>
                <input type="text" id="promoInitial" class="input" maxlength="3" placeholder="NFL" value="<?= sanitize($settings['affiliate_initial']) ?>" oninput="App.simulatePromo()">
              </div>
              <div class="form-group">
                <label for="promoNumber">Nomor (opsional)</label>
                <input type="text" id="promoNumber" class="input" maxlength="3" placeholder="" value="<?= sanitize($settings['affiliate_number']) ?>" oninput="App.simulatePromo()">
              </div>
            </div>
            <div class="promo-preview">
              <span>Hasil: </span><strong id="promoSimResult"><?= sanitize($settings['promo_code']) ?></strong>
            </div>
            <button class="btn btn-primary btn-sm" style="margin-top:var(--space-2);" onclick="App.savePromoSettings()">💾 Simpan Kode & Setting</button>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">📲 WhatsApp Link Generator</h3>
          <p class="text-sm text-muted" style="margin-bottom: var(--space-4);">Buat link WhatsApp yang sudah terisi otomatis pesan pendaftaran beserta kode promo Anda.</p>
          
          <div class="form-group" style="margin-bottom: var(--space-4);">
            <label for="waAdminNumber">Nomor WhatsApp Admin Pusat</label>
            <input type="text" id="waAdminNumber" class="input" placeholder="6281234567890 (Gunakan 62)" value="<?= sanitize($settings['admin_whatsapp']) ?>">
            <span class="text-xs text-muted">Pastikan nomor ini benar untuk CryptoSharia.</span>
          </div>

          <div class="form-group" style="margin-bottom: var(--space-4);">
            <label for="waName">Nama Calon Peserta (Opsional)</label>
            <input type="text" id="waName" class="input" placeholder="Jika Anda membuatkan pesan untuk orang spesifik...">
          </div>

          <div class="form-group">
            <label>Preview Pesan:</label>
            <div class="wa-preview" id="waPreview">
              Assalamu'alaikum Admin CryptoSharia, saya ingin daftar CryptoSharia Masterclass menggunakan kode promo:
              <strong><?= sanitize($settings['promo_code']) ?></strong>.
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-green" onclick="App.openWhatsApp()">💬 Chat WA Admin</button>
            <button class="btn btn-outline" onclick="App.copyWAMessage()">📋 Copy Pesan</button>
          </div>
        </div>
      </div>

      <h3 class="section-subtitle" style="margin-top: var(--space-8); margin-bottom: var(--space-4);">Template Pesan WhatsApp</h3>
      <div class="template-grid" id="templateGrid">
        <!-- Loaded via JS -->
      </div>
    </section>

    <!-- ==================== SECTION 5: LEAD TRACKER ==================== -->
    <section id="leads" class="section">
      <div class="section-header">
        <h1>Lead Tracker</h1>
        <p class="section-subtitle">Catat dan pantau prospek yang tertarik dengan konten Anda</p>
      </div>

      <div class="grid-2">
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-header-row">
            <h3 class="card-title">➕ Tambah/Edit Lead</h3>
          </div>
          <form id="leadForm" class="form-grid">
            <input type="hidden" id="leadEditId">
            <div class="form-row form-row-3">
              <div class="form-group">
                <label for="leadName">Nama / Username</label>
                <input type="text" id="leadName" class="input" required>
              </div>
              <div class="form-group">
                <label for="leadContact">Kontak (No WA / IG / TikTok)</label>
                <input type="text" id="leadContact" class="input">
              </div>
              <div class="form-group">
                <label for="leadPlatform">Sumber Platform</label>
                <select id="leadPlatform" class="input">
                  <option>TikTok</option>
                  <option>Instagram</option>
                  <option>YouTube Shorts</option>
                  <option>WhatsApp</option>
                  <option>Story</option>
                  <option>Lainnya</option>
                </select>
              </div>
            </div>
            <div class="form-row form-row-3">
              <div class="form-group">
                <label for="leadContent">Dari Konten Apa?</label>
                <input type="text" id="leadContent" class="input" placeholder="Judul konten pemicu...">
              </div>
              <div class="form-group">
                <label for="leadStatus">Status Saat Ini</label>
                <select id="leadStatus" class="input">
                  <option value="baru masuk">🔵 Baru masuk</option>
                  <option value="tanya-tanya">🟡 Tanya-tanya</option>
                  <option value="sudah dikirim info">🟠 Sudah dikirim info</option>
                  <option value="sudah diarahkan ke admin">🟣 Sudah diarahkan ke admin</option>
                  <option value="sudah chat admin">🟤 Sudah chat admin</option>
                  <option value="sudah daftar">🟢 SUDAH DAFTAR</option>
                  <option value="belum jadi">🔴 Belum jadi / Mundur</option>
                  <option value="follow up nanti">⚪ Follow up nanti</option>
                </select>
              </div>
              <div class="form-group">
                <label for="leadFollowUp">Tanggal Follow Up</label>
                <input type="date" id="leadFollowUp" class="input">
              </div>
            </div>
            <div class="form-group">
              <label for="leadNotes">Catatan</label>
              <input type="text" id="leadNotes" class="input" placeholder="Kendala harga, tanya materi, dll...">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">💾 Simpan Lead</button>
              <button type="button" class="btn btn-outline" onclick="App.resetLeadForm()">Batal</button>
            </div>
          </form>
        </div>

        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-header-row">
            <h3 class="card-title">📋 Daftar Lead</h3>
            <div class="card-actions">
              <input type="text" id="leadSearch" class="input input-sm" placeholder="🔍 Cari lead..."
                oninput="App.filterLeads()">
              <select id="leadFilter" class="input input-sm" onchange="App.filterLeads()">
                <option value="">Semua Status</option>
                <option value="baru masuk">Baru Masuk</option>
                <option value="tanya-tanya">Tanya-tanya</option>
                <option value="sudah dikirim info">Sudah dikirim info</option>
                <option value="sudah diarahkan ke admin">Sudah diarahkan admin</option>
                <option value="sudah chat admin">Sudah chat admin</option>
                <option value="sudah daftar">Sudah daftar</option>
              </select>
              <button class="btn btn-sm btn-outline" onclick="App.exportCSV('leads')">📥 Export CSV</button>
            </div>
          </div>
          <div class="table-wrap">
            <table class="table" id="leadTable">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama</th>
                  <th>Kontak</th>
                  <th>Sumber</th>
                  <th>Status</th>
                  <th>Catatan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="leadTableBody">
                <!-- Loaded via JS -->
              </tbody>
            </table>
            <div id="leadEmpty" class="empty-state" hidden>
              Belum ada data lead.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION 6: CONTENT PERFORMANCE ==================== -->
    <section id="performance" class="section">
      <div class="section-header">
        <h1>Content Performance Tracker</h1>
        <p class="section-subtitle">Lacak metrik dan konversi dari setiap konten yang diposting</p>
      </div>

      <!-- Performance Stats -->
      <div class="stats-grid stats-grid-sm">
        <div class="stat-card">
          <div class="stat-info"><span class="stat-value" id="perfTotal">0</span><span class="stat-label">Total
              Konten</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-info"><span class="stat-value" id="perfViews">0</span><span class="stat-label">Total
              Views</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-info"><span class="stat-value" id="perfLeads">0</span><span class="stat-label">Total
              Lead</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-info"><span class="stat-value" id="perfReg">0</span><span class="stat-label">Lead
              Daftar</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-info"><span class="stat-value" id="perfConv">0%</span><span
              class="stat-label">Conversion</span></div>
        </div>
      </div>

      <!-- Performance Form -->
      <div class="card">
        <h3 class="card-title">➕ Input/Update Data Performa</h3>
        <form id="perfForm" class="form-grid">
          <input type="hidden" id="perfEditId">
          <div class="form-row form-row-4">
            <div class="form-group">
              <label for="perfName">Judul Konten</label>
              <input type="text" id="perfName" class="input" required>
            </div>
            <div class="form-group">
              <label for="perfPlatform">Platform</label>
              <select id="perfPlatform" class="input">
                <option>TikTok</option>
                <option>Instagram Reels</option>
                <option>YouTube Shorts</option>
              </select>
            </div>
            <div class="form-group">
              <label for="perfDate">Tanggal Tayang</label>
              <input type="date" id="perfDate" class="input">
            </div>
            <div class="form-group">
              <label for="perfCat">Kategori</label>
              <select id="perfCat" class="input">
                <option value="edukasi">Edukasi</option>
                <option value="anti-FOMO">Anti-FOMO</option>
                <option value="syariah">Syariah</option>
                <option value="pemula">Pemula</option>
                <option value="soft selling">Soft Selling</option>
                <option value="CTA">CTA</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="perfHook">Hook Utama (Untuk dianalisa)</label>
            <input type="text" id="perfHook" class="input" placeholder="Hook yang digunakan...">
          </div>
          <div class="form-row form-row-4">
            <div class="form-group"><label for="perfViewsInput">Views</label><input type="number" id="perfViewsInput"
                class="input" min="0" value="0"></div>
            <div class="form-group"><label for="perfLikes">Likes</label><input type="number" id="perfLikes"
                class="input" min="0" value="0"></div>
            <div class="form-group"><label for="perfComments">Comments</label><input type="number" id="perfComments"
                class="input" min="0" value="0"></div>
            <div class="form-group"><label for="perfShares">Shares</label><input type="number" id="perfShares"
                class="input" min="0" value="0"></div>
          </div>
          <div class="form-row form-row-3">
            <div class="form-group"><label for="perfDM">DM Masuk</label><input type="number" id="perfDM" class="input"
                min="0" value="0"></div>
            <div class="form-group"><label for="perfLeadIn">Lead Masuk</label><input type="number" id="perfLeadIn"
                class="input" min="0" value="0"></div>
            <div class="form-group"><label for="perfLeadReg">Lead Daftar</label><input type="number" id="perfLeadReg"
                class="input" min="0" value="0"></div>
          </div>
          <div class="form-group">
            <label for="perfNotes">Catatan Performa</label>
            <input type="text" id="perfNotes" class="input" placeholder="Kenapa views meledak? Atau kenapa sepi?">
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">💾 Simpan Performa</button>
            <button type="button" class="btn btn-outline" onclick="App.resetPerfForm()">Batal</button>
          </div>
        </form>
      </div>

      <!-- Performance List -->
      <div class="card">
        <div class="card-header-row">
          <h3 class="card-title">📈 History Performa Konten</h3>
          <div class="card-actions">
            <input type="text" id="perfSearch" class="input input-sm" placeholder="🔍 Cari..." oninput="App.filterPerf()">
            <button class="btn btn-sm btn-outline" onclick="App.exportCSV('performance')">📥 Export CSV</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table" id="perfTable">
            <thead>
              <tr>
                <th>Konten</th>
                <th>Platform</th>
                <th>Views</th>
                <th>Engagements</th>
                <th>Lead</th>
                <th>Daftar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="perfTableBody">
              <!-- Loaded via JS -->
            </tbody>
          </table>
          <div id="perfEmpty" class="empty-state" hidden>
            Belum ada data performa.
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION 7: KOMISI CALCULATOR ==================== -->
    <section id="komisi" class="section">
      <div class="section-header">
        <h1>Komisi Calculator</h1>
        <p class="section-subtitle">Hitung estimasi pendapatan dari pendaftar Anda</p>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3 class="card-title">🧮 Kalkulator</h3>
          <div class="form-group">
            <label for="komisiInput">Jumlah Pendaftar Valid</label>
            <input type="number" id="komisiInput" class="input input-lg" min="0" value="0"
              oninput="App.calculateKomisi()">
          </div>
          <div class="komisi-breakdown" id="komisiBreakdown">
            <div class="komisi-row">
              <span>Paket 1-3 org (@ Rp750rb)</span>
              <span id="komisi1">Rp0</span>
            </div>
            <div class="komisi-row">
              <span>Paket 4+ org (@ Rp1 Jt)</span>
              <span id="komisi2">Rp0</span>
            </div>
            <div class="komisi-row komisi-total-row">
              <span>Total Estimasi Komisi</span>
              <span id="komisiTotal">Rp0</span>
            </div>
          </div>
          <p class="text-muted text-sm">⚠️ Komisi final mengikuti validasi admin dan hanya dihitung dari pendaftaran
            berbayar yang sah.</p>
        </div>

        <div class="card">
          <h3 class="card-title">Skema Cepat</h3>
          <p class="text-sm text-muted" style="margin-bottom: var(--space-4);">Klik angka di bawah untuk melihat contoh perhitungan.</p>
          
          <div class="ab-stats" style="margin-bottom: var(--space-4);">
            <div class="ab-stat" style="cursor: pointer;" onclick="App.setKomisiExample(1)">
              <span class="ab-stat-label">1 Orang</span><strong class="text-gold">Rp750rb</strong>
            </div>
            <div class="ab-stat" style="cursor: pointer;" onclick="App.setKomisiExample(3)">
              <span class="ab-stat-label">3 Orang</span><strong class="text-gold">Rp2.25 Jt</strong>
            </div>
            <div class="ab-stat" style="cursor: pointer;" onclick="App.setKomisiExample(5)">
              <span class="ab-stat-label">5 Orang</span><strong class="text-gold">Rp5 Jt</strong>
            </div>
            <div class="ab-stat" style="cursor: pointer;" onclick="App.setKomisiExample(10)">
              <span class="ab-stat-label">10 Orang</span><strong class="text-gold">Rp10 Jt</strong>
            </div>
          </div>

          <div class="komisi-tiers">
            <h4>Skema Komisi</h4>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Pendaftar</th>
                  <th>Komisi/Orang</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 s/d 3 Orang</td>
                  <td>Rp750.000</td>
                </tr>
                <tr>
                  <td>4 Orang atau lebih</td>
                  <td>Rp1.000.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION 8: CALENDAR & CHECKLIST ==================== -->
    <section id="calendar" class="section">
      <div class="section-header">
        <h1>Calendar & Checklist</h1>
        <p class="section-subtitle">Rencanakan konten Anda dan pantau tugas harian</p>
      </div>

      <div class="grid-2">
        <!-- Checklist Harian -->
        <div class="card">
          <div class="card-header-row">
            <h3 class="card-title">✅ Checklist Harian</h3>
            <button class="btn btn-sm btn-outline" onclick="App.resetChecklist()">🔄 Reset Hari Ini</button>
          </div>
          <p class="text-sm text-muted" style="margin-bottom: var(--space-4);">Lakukan ini konsisten setiap hari untuk pertumbuhan optimal.</p>
          
          <div class="progress-bar" style="margin-bottom: var(--space-4);">
            <div class="progress-fill progress-fill-green" id="checklistProgress" style="width: 0%;"></div>
          </div>

          <div class="checklist-container" id="dailyChecklist">
            <!-- Loaded via JS -->
          </div>
        </div>

        <!-- Kalender Perencanaan -->
        <div class="card">
          <h3 class="card-title">📅 Content Planner</h3>
          <form id="calForm" class="form-grid" style="margin-bottom: var(--space-4);">
            <input type="hidden" id="calEditId">
            <div class="form-row">
              <div class="form-group">
                <label>Tanggal</label>
                <input type="date" id="calDate" class="input" required>
              </div>
              <div class="form-group">
                <label>Platform</label>
                <select id="calPlatform" class="input">
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Judul / Ide Topik</label>
              <select id="calTitle" class="input" required>
                <option value="">-- Pilih dari Content Studio --</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Tema</label>
                <input type="text" id="calTheme" class="input" placeholder="Edukasi / Mindset / dll">
              </div>
              <div class="form-group">
                <label>Status Produksi</label>
                <select id="calStatus" class="input">
                  <option value="ide">Ide</option>
                  <option value="script">Scripting</option>
                  <option value="ready">Ready Upload</option>
                  <option value="posted">Posted</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-sm">💾 Simpan Jadwal</button>
              <button type="button" class="btn btn-outline btn-sm" onclick="App.resetCalForm()">Batal</button>
            </div>
          </form>

          <div class="table-wrap">
            <table class="table table-sm" id="calTable">
              <thead><tr><th>Tgl</th><th>Topik</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody id="calTableBody"></tbody>
            </table>
            <div id="calEmpty" class="empty-state" hidden style="padding: var(--space-4);">Belum ada jadwal.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SECTION 9: ASSET LIBRARY ==================== -->
    <section id="assets" class="section">
      <div class="section-header">
        <h1>Asset Library</h1>
        <p class="section-subtitle">Koleksi prompt AI, catatan voiceover, dan pedoman visual</p>
      </div>

      <div class="card">
        <div class="asset-tabs">
          <button class="tab-btn active" data-asset-tab="prompt_karakter">Karakter 3D</button>
          <button class="tab-btn" data-asset-tab="prompt_scene">Scene</button>
          <button class="tab-btn" data-asset-tab="prompt_cta_scene">CTA Visual</button>
          <button class="tab-btn" data-asset-tab="prompt_background">Background</button>
          <button class="tab-btn" data-asset-tab="prompt_visual_storytelling">Storytelling</button>
          <button class="tab-btn" data-asset-tab="prompt_visual_hook">Visual Hook</button>
          <button class="tab-btn" data-asset-tab="prompt_transisi">Transisi</button>
          <button class="tab-btn" data-asset-tab="voiceover">Voiceover</button>
          <button class="tab-btn" data-asset-tab="caption">Caption</button>
        </div>

        <div style="margin-top: var(--space-4); margin-bottom: var(--space-4);">
          <form id="assetForm" class="form-row" style="align-items: flex-end;">
            <div class="form-group" style="flex: 1;">
              <label id="assetInputLabel">Tambah Prompt Karakter Baru</label>
              <input type="text" id="assetInput" class="input" required placeholder="Ketik prompt atau catatan di sini...">
            </div>
            <button type="submit" class="btn btn-primary">➕ Tambah</button>
          </form>
        </div>

        <div class="asset-list" id="assetListContainer">
          <!-- Loaded via JS -->
        </div>
      </div>
    </section>

    <!-- ==================== SECTION 10: PRINSIP SYARIAH ==================== -->
    <section id="syariah" class="section">
      <div class="section-header">
        <h1>Prinsip Aman & Syariah</h1>
        <p class="section-subtitle">Panduan wajib agar konten tetap berkah, profesional, dan edukatif</p>
      </div>

      <div class="grid-2">
        <div class="card" style="border-left: 4px solid var(--green-500);">
          <h3 class="card-title">✅ DO (Harus Dilakukan)</h3>
          <ul class="guideline-list">
            <li><strong>Selalu edukasi risiko.</strong> Ingatkan bahwa crypto itu high risk high return.</li>
            <li><strong>Tekankan screening halal.</strong> Ingatkan untuk cek koin halal (via web/app screening).</li>
            <li><strong>Fokus pada mindset.</strong> Ajarkan cara berpikir investor, bukan penjudi.</li>
            <li><strong>Sabar & Sistematis.</strong> Tekankan bahwa di CryptoSharia belajar dari fundamental, teknikal, hingga financial planning.</li>
          </ul>
        </div>
        <div class="card" style="border-left: 4px solid var(--red-500);">
          <h3 class="card-title">❌ DON'T (Dilarang Keras)</h3>
          <ul class="guideline-list">
            <li><strong>NO FOMO.</strong> Jangan membuat konten yang memicu kepanikan (fear of missing out).</li>
            <li><strong>NO Flexing Harta.</strong> Jangan pamer kekayaan, lambo, uang tunai, dll. Ini bertentangan dengan nilai kelas.</li>
            <li><strong>NO Janji Cuan Pasti.</strong> Jangan pernah menjanjikan profit harian/bulanan.</li>
            <li><strong>NO Leverage/Futures.</strong> Hindari pembahasan trading futures, margin, atau leverage tinggi yang rawan riba/maysir.</li>
            <li><strong>NO Shitcoin Pumping.</strong> Jangan mengajak membeli koin tidak jelas/meme coin.</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Disclaimer Wajib</h3>
        <p class="text-sm text-muted" style="margin-bottom: var(--space-4);">Sangat disarankan untuk mencantumkan teks ini di bio profil atau akhir deskripsi video panjang Anda.</p>
        <div class="bank-item" style="background: rgba(255,255,255,0.02);">
          <span class="bank-item-text" style="font-family: monospace; color: var(--gold-400);">
            Disclaimer: Konten ini murni untuk edukasi. Crypto adalah aset berisiko tinggi. Keputusan investasi dan trading adalah tanggung jawab masing-masing individu. Lakukan riset mandiri (DYOR) dan pastikan koin yang Anda beli sesuai dengan prinsip syariah.
          </span>
          <button class="btn btn-sm btn-outline" onclick="App.copyToClipboard('Disclaimer: Konten ini murni untuk edukasi. Crypto adalah aset berisiko tinggi. Keputusan investasi dan trading adalah tanggung jawab masing-masing individu. Lakukan riset mandiri (DYOR) dan pastikan koin yang Anda beli sesuai dengan prinsip syariah.')">📋 Copy</button>
        </div>
      </div>
    </section>

<?php include __DIR__ . '/includes/footer.php'; ?>
