/* ============================================
   CryptoSharia Affiliate Command Center
   Application Logic
   ============================================ */

const App = {
  // --- Configuration ---
  promoCode: 'M-SA01',

  // --- Seed Data ---
  seedIdeas: [
    'Takut crypto itu wajar',
    'Beda investasi dan spekulasi',
    'Kenapa leverage berbahaya',
    'Apa itu screening koin halal',
    'Kenapa belajar dulu sebelum beli koin',
    'Muslim harus lebih hati-hati di crypto',
    'Crypto bukan jalan cepat kaya',
    'Ilmu dulu, cuan kemudian',
    'Cocok untuk pemula yang takut scam',
    'Belajar crypto tanpa FOMO',
  ],

  seedHooks: [
    '"Kalau kamu takut crypto, itu wajar."',
    '"Masalah banyak orang di crypto bukan kurang berani, tapi kurang ilmu."',
    '"Beli koin tanpa paham risikonya itu bukan investasi, itu rawan spekulasi."',
    '"Sebagai Muslim, kita tidak cukup hanya tanya: untung atau tidak?"',
    '"Kalau alasan masuk crypto cuma karena ramai, berhenti dulu."',
    '"Crypto tidak harus identik dengan FOMO."',
    '"Yang perlu dibangun pertama kali bukan portofolio, tapi cara berpikir."',
    '"Belajar dulu jauh lebih murah daripada rugi karena asal masuk."',
  ],

  seedCTAs: [
    '"Kalau mau belajar crypto lebih terstruktur, chat admin CryptoSharia dan gunakan kode promo saya."',
    '"Kalau mau daftar, pastikan sebutkan kode promo saya agar diskon dan bonusnya tercatat."',
    '"Kalau mau info detail, DM saya atau langsung chat admin."',
    '"Gunakan kode promo saya untuk mendapatkan diskon tambahan Rp250.000 dan bonus Discord Premium 6 bulan."',
  ],

  seedScripts: [
    {
      title: 'Takut Crypto Itu Wajar',
      text: `Hook: "Kalau kamu takut crypto, itu wajar."

Banyak yang berpikir crypto itu identik dengan rugi. Padahal, rugi itu biasanya karena asal beli tanpa ilmu.

Di CryptoSharia Masterclass, kamu belajar dari nol. Mulai dari apa itu crypto, cara screening koin halal, sampai risk management.

Jadi, kalau kamu mau mulai tapi takut... belajar dulu. Itu langkah pertama yang paling benar.

CTA: Chat admin CryptoSharia dan gunakan kode promo saya untuk diskon Rp250.000.`,
    },
    {
      title: 'Beda Investasi dan Spekulasi',
      text: `Hook: "Beli koin tanpa paham risikonya itu bukan investasi, itu rawan spekulasi."

Investasi itu ada ilmunya. Ada analisa fundamental, ada manajemen risiko, ada screening halal.

Spekulasi itu cuma ikut tren tanpa dasar. Dan biasanya berakhir menyesal.

Di CryptoSharia Masterclass, kamu diajarkan pendekatan yang terukur dan terstruktur. Bukan gambling.

CTA: Mau belajar investasi crypto yang benar? DM saya atau chat admin.`,
    },
    {
      title: 'Kenapa Leverage Berbahaya',
      text: `Hook: "Kalau ada yang bilang bisa kaya cepat dari leverage, waspada."

Leverage itu memperbesar risiko kerugian berlipat. Dalam prinsip syariah, ini juga termasuk hal yang perlu dihindari.

Di CryptoSharia Masterclass, kamu belajar cara investasi yang sadar risiko. Tanpa leverage, tanpa gambling.

CTA: Gunakan kode promo saya untuk diskon dan bonus Discord Premium.`,
    },
    {
      title: 'Screening Koin Halal',
      text: `Hook: "Sebagai Muslim, kita tidak cukup hanya tanya: untung atau tidak?"

Pertanyaan pertama seharusnya: halal atau tidak?

Di CryptoSharia Masterclass, kamu belajar screening koin halal. Supaya investasimu tidak hanya cuan, tapi juga tenang secara syariah.

CTA: DM saya untuk info lebih lanjut, atau langsung chat admin CryptoSharia.`,
    },
    {
      title: 'Ilmu Dulu, Cuan Kemudian',
      text: `Hook: "Belajar dulu jauh lebih murah daripada rugi karena asal masuk."

Banyak yang langsung terjun ke crypto tanpa ilmu. Hasilnya? Panik saat harga turun, FOMO saat harga naik.

CryptoSharia Masterclass mengajarkan pendekatan terstruktur: fundamental, teknikal, macro, financial planning, dan risk management.

CTA: Sebutkan kode promo saya saat daftar untuk bonus eksklusif.`,
    },
  ],

  seedTemplates: [
    {
      title: '📨 Pesan untuk Calon Peserta',
      text: `Assalamu'alaikum! 😊

Kalau kamu tertarik belajar crypto dengan pendekatan syariah, sistematis, dan terstruktur, saya rekomendasikan CryptoSharia Masterclass.

Di sana kamu akan belajar:
• Screening koin halal
• Analisa fundamental & teknikal
• Risk management
• Financial planning
• Dan masih banyak lagi

Gunakan kode promo saya: M-SA01 untuk mendapatkan:
✅ Diskon Rp250.000
✅ Bonus Discord Premium 6 bulan (senilai Rp1.000.000)

Chat admin CryptoSharia untuk daftar ya! 🙏`,
    },
    {
      title: '🔄 Pesan Follow-Up',
      text: `Assalamu'alaikum! 😊

Kemarin sempat tanya-tanya soal CryptoSharia Masterclass ya? Kalau masih tertarik, pendaftaran masih dibuka.

Jangan lupa sebutkan kode promo M-SA01 supaya kamu dapat diskon Rp250.000 dan bonus Discord Premium 6 bulan.

Kalau ada pertanyaan, jangan ragu chat saya ya. 🙏`,
    },
    {
      title: '📢 Broadcast Soft Selling',
      text: `Belajar crypto itu seharusnya tidak bikin cemas.

Di CryptoSharia Masterclass, kamu belajar dari nol dengan pendekatan:
✅ Syariah
✅ Terstruktur
✅ Sadar risiko

Bukan janji cuan instan. Tapi ilmu yang bisa kamu pakai seumur hidup.

DM saya untuk info lebih lanjut. 🙏`,
    },
    {
      title: '🏷️ Pengingat Kode Promo',
      text: `Reminder! 🔔

Kalau kamu mau daftar CryptoSharia Masterclass, jangan lupa sebutkan kode promo saya:

🏷️ M-SA01

Benefitnya:
✅ Diskon Rp250.000
✅ Bonus Discord Premium 6 bulan

Sebutkan ke admin saat chat ya, supaya tercatat. 🙏`,
    },
  ],

  seedAssets: {
    promptKarakter: [
      'Cute amigurumi 3D faceless Muslim character wearing white thobe and keffiyeh, soft lighting, clean background, premium 3D render',
      'Amigurumi 3D faceless Muslimah character with pastel hijab, holding a tablet showing crypto chart, warm soft lighting',
      'Chibi-style amigurumi 3D faceless character sitting at desk with laptop, Islamic geometric pattern on wall, professional setting',
      'Pair of amigurumi 3D faceless Muslim characters, one mentoring the other, warm educational setting, clean and modern',
    ],
    promptScene: [
      'Amigurumi 3D scene: character studying at clean modern desk with books about Islamic finance, warm ambient lighting',
      'Amigurumi 3D scene: character looking at phone with crypto prices going up, calm expression, no panic, peaceful room',
      'Amigurumi 3D scene: online classroom with multiple faceless characters on screen, teacher at whiteboard explaining crypto',
    ],
    promptCTA: [
      'Amigurumi 3D scene: character holding a golden ticket/card with text "PROMO CODE", sparkle effects, premium feel',
      'Amigurumi 3D scene: character pointing at WhatsApp logo, golden accent, clean background with subtle Islamic pattern',
      'Amigurumi 3D scene: character opening a gift box revealing "DISKON Rp250.000" text, celebration confetti, warm lighting',
    ],
    promptBg: [
      'Clean navy blue gradient background with subtle Islamic geometric pattern overlay, golden accent lines, 4K',
      'Soft white and gold abstract background with arabic calligraphy inspired patterns, minimal and modern',
      'Dark blue premium background with glowing golden eight-pointed star pattern, fintech aesthetic',
    ],
    promptStory: [
      'Amigurumi 3D visual storytelling: 3-panel sequence showing character confused → studying → confident, warm lighting progression',
      'Amigurumi 3D visual storytelling: character journey from FOMO panic to calm studying to celebrating small wins',
    ],
    promptHook: [
      'Amigurumi 3D visual hook: character looking shocked at crypto red chart, dramatic lighting, close-up, eye-catching',
      'Amigurumi 3D visual hook: character with question marks floating around head, curious expression, pastel colors',
      'Amigurumi 3D visual hook: split screen - chaotic crypto trading vs calm studying, contrasting lighting',
    ],
    promptTransisi: [
      'Smooth zoom transition: from macro shot of Islamic pattern to reveal amigurumi character studying',
      'Page turn transition: old page shows wrong trading, new page shows proper crypto education',
    ],
    catatanVO: [
      'Nada suara: tenang, hangat, tidak menggurui, seperti teman yang peduli',
      'Pacing: agak lambat di hook, sedikit cepat di problem, kembali tenang di solusi dan CTA',
      'Jangan gunakan nada yang terlalu excited atau hype — tetap edukatif dan genuine',
      'Bahasa: campuran bahasa Indonesia semi-formal dan casual, hindari jargon berlebihan',
    ],
    catatanCaption: [
      'Gunakan emoji secukupnya, jangan berlebihan — 2-3 per caption sudah cukup',
      'Selalu akhiri dengan CTA yang lembut, bukan hard selling',
      'Tambahkan hashtag relevan: #CryptoSyariah #BelajarCrypto #InvestasiHalal #CryptoSharia',
      'Caption 2-3 paragraf pendek, mudah dibaca saat scroll',
    ],
  },

  // Quick copy content
  quickCopyContent: {
    cta: 'Kalau mau belajar crypto lebih terstruktur, chat admin CryptoSharia dan gunakan kode promo saya: M-SA01. Diskon Rp250.000 + Bonus Discord Premium 6 bulan.',
    admin: "Assalamu'alaikum Admin CryptoSharia, saya ingin daftar CryptoSharia Masterclass menggunakan kode promo: M-SA01.",
    followup: "Assalamu'alaikum! Kemarin sempat tanya-tanya soal CryptoSharia Masterclass ya? Kalau masih tertarik, pendaftaran masih dibuka. Jangan lupa sebutkan kode promo M-SA01 supaya dapat diskon Rp250.000 dan bonus Discord Premium 6 bulan. 🙏",
    caption: "Belajar crypto itu seharusnya tidak bikin cemas. 📚\n\nDi CryptoSharia Masterclass, kamu belajar dari nol dengan pendekatan syariah, terstruktur, dan sadar risiko.\n\nBukan janji cuan instan. Tapi ilmu yang bisa kamu pakai seumur hidup.\n\nDM saya untuk info lebih lanjut. 🙏\n\n#CryptoSyariah #BelajarCrypto #InvestasiHalal #CryptoSharia",
    disclaimer: 'Bukan financial advice. Konten ini untuk edukasi.',
  },

  // --- Rupiah Formatter ---
  formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  },

  // --- localStorage Helpers ---
  save(key, data) {
    try {
      localStorage.setItem('cs_' + key, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage save error:', e);
    }
  },

  load(key) {
    try {
      const data = localStorage.getItem('cs_' + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('localStorage load error:', e);
      return null;
    }
  },

  // --- Toast ---
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  },

  // --- Clipboard ---
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      this.showToast('✅ Berhasil disalin!');
    } catch (e) {
      this.showToast('❌ Gagal menyalin. Coba manual.');
    }
  },

  // --- Confirm Modal ---
  confirm(title, message) {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirmModal');
      document.getElementById('confirmTitle').textContent = title;
      document.getElementById('confirmMessage').textContent = message;
      modal.hidden = false;

      const okBtn = document.getElementById('confirmOk');
      const cancelBtn = document.getElementById('confirmCancel');

      const cleanup = () => {
        modal.hidden = true;
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
      };

      const onOk = () => { cleanup(); resolve(true); };
      const onCancel = () => { cleanup(); resolve(false); };

      okBtn.addEventListener('click', onOk);
      cancelBtn.addEventListener('click', onCancel);
    });
  },

  // --- Generate ID ---
  genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  // =============================================
  //   NAVIGATION
  // =============================================
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.section;

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(target).classList.add('active');

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
      });
    });

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const toggle = document.getElementById('menuToggle');
      if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    // Tab handling
    document.querySelectorAll('.tab-bar').forEach(bar => {
      bar.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.dataset.tab;
          bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const parent = bar.parentElement;
          parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
          document.getElementById(tabId).classList.add('active');
        });
      });
    });

    // Asset tabs
    document.querySelectorAll('.asset-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.asset-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderAssetTab(btn.dataset.assetTab);
      });
    });
  },

  // =============================================
  //   DASHBOARD
  // =============================================
  updateDashboard() {
    const leads = this.load('leads') || [];
    const contents = this.load('contents') || [];
    const perf = this.load('performance') || [];

    const totalLeads = leads.length;
    const directed = leads.filter(l =>
      ['sudah diarahkan ke admin', 'sudah chat admin', 'sudah daftar'].includes(l.status)
    ).length;
    const registered = leads.filter(l => l.status === 'sudah daftar').length;
    const posted = contents.filter(c => c.status === 'posted').length;
    const komisi = this.calcKomisi(registered);

    document.getElementById('statTotalLeads').textContent = totalLeads;
    document.getElementById('statDirected').textContent = directed;
    document.getElementById('statRegistered').textContent = registered;
    document.getElementById('statContent').textContent = posted;
    document.getElementById('statKomisi').textContent = this.formatRupiah(komisi);

    // Progress targets
    const p3 = Math.min((registered / 3) * 100, 100);
    const p5 = Math.min((registered / 5) * 100, 100);
    const p10 = Math.min((registered / 10) * 100, 100);

    document.getElementById('progress3').style.width = p3 + '%';
    document.getElementById('progress5').style.width = p5 + '%';
    document.getElementById('progress10').style.width = p10 + '%';
    document.getElementById('progress3Text').textContent = `${registered}/3`;
    document.getElementById('progress5Text').textContent = `${registered}/5`;
    document.getElementById('progress10Text').textContent = `${registered}/10`;

    // Best content
    this.updateBestContent(perf);

    // Insights
    this.updateInsights(perf);

    // Hook A/B selects
    this.populateHookSelects();
  },

  updateBestContent(perf) {
    const bestEl = document.getElementById('bestContent');
    const bestCTAEl = document.getElementById('bestCTA');

    if (perf.length === 0) {
      bestEl.innerHTML = '<p class="text-muted">Belum ada data konten</p>';
      bestCTAEl.innerHTML = '<p class="text-muted">Belum ada data CTA</p>';
      return;
    }

    // Best by lead count
    const sortedByLead = [...perf].sort((a, b) => (b.leadIn || 0) - (a.leadIn || 0));
    const best = sortedByLead[0];
    if (best && best.leadIn > 0) {
      bestEl.innerHTML = `
        <div class="best-item-name">${this.escapeHtml(best.name)}</div>
        <div class="best-item-meta">${best.platform} • ${best.leadIn} lead • ${best.leadReg || 0} daftar • ${this.formatNum(best.views)} views</div>
      `;
    } else {
      bestEl.innerHTML = '<p class="text-muted">Belum ada konten dengan lead</p>';
    }

    // Best by registration
    const sortedByReg = [...perf].sort((a, b) => (b.leadReg || 0) - (a.leadReg || 0));
    const bestReg = sortedByReg[0];
    if (bestReg && bestReg.leadReg > 0) {
      bestCTAEl.innerHTML = `
        <div class="best-item-name">${this.escapeHtml(bestReg.name)}</div>
        <div class="best-item-meta">Hook: "${this.escapeHtml(bestReg.hook || '-')}" • ${bestReg.leadReg} pendaftar</div>
      `;
    } else {
      bestCTAEl.innerHTML = '<p class="text-muted">Belum ada data pendaftar dari konten</p>';
    }
  },

  updateInsights(perf) {
    const container = document.getElementById('contentInsights');
    if (perf.length < 2) {
      container.innerHTML = '<p class="text-muted">Insights akan muncul setelah ada data performa konten yang cukup (minimal 2 konten).</p>';
      return;
    }

    const insights = [];

    // Best category by leads
    const catLeads = {};
    perf.forEach(p => {
      if (!catLeads[p.category]) catLeads[p.category] = 0;
      catLeads[p.category] += (p.leadIn || 0);
    });
    const bestCat = Object.entries(catLeads).sort((a, b) => b[1] - a[1])[0];
    if (bestCat && bestCat[1] > 0) {
      insights.push(`📊 Konten kategori "<strong>${bestCat[0]}</strong>" paling banyak menghasilkan lead (${bestCat[1]} total lead).`);
    }

    // Best hook keyword
    const hookWords = {};
    perf.forEach(p => {
      if (!p.hook) return;
      const words = p.hook.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      words.forEach(w => {
        if (!hookWords[w]) hookWords[w] = { count: 0, leads: 0 };
        hookWords[w].count++;
        hookWords[w].leads += (p.leadIn || 0);
      });
    });
    const bestWord = Object.entries(hookWords)
      .filter(([, v]) => v.count >= 1 && v.leads > 0)
      .sort((a, b) => b[1].leads - a[1].leads)[0];
    if (bestWord) {
      insights.push(`🎣 Hook dengan kata "<strong>${bestWord[0]}</strong>" performanya baik (${bestWord[1].leads} lead dari ${bestWord[1].count} konten).`);
    }

    // CTA effectiveness
    const withDiscount = perf.filter(p => {
      const contents = this.load('contents') || [];
      const content = contents.find(c => c.title === p.name);
      return content && content.cta && (content.cta.toLowerCase().includes('diskon') || content.cta.toLowerCase().includes('bonus'));
    });
    const withoutDiscount = perf.filter(p => {
      const contents = this.load('contents') || [];
      const content = contents.find(c => c.title === p.name);
      return content && content.cta && !(content.cta.toLowerCase().includes('diskon') || content.cta.toLowerCase().includes('bonus'));
    });

    if (withDiscount.length > 0 && withoutDiscount.length > 0) {
      const avgLeadDiscount = withDiscount.reduce((s, p) => s + (p.leadIn || 0), 0) / withDiscount.length;
      const avgLeadNo = withoutDiscount.reduce((s, p) => s + (p.leadIn || 0), 0) / withoutDiscount.length;
      if (avgLeadDiscount > avgLeadNo) {
        insights.push('🎯 CTA yang langsung menyebut <strong>diskon + bonus</strong> lebih efektif menghasilkan lead.');
      }
    }

    // Best platform
    const platLeads = {};
    perf.forEach(p => {
      if (!platLeads[p.platform]) platLeads[p.platform] = 0;
      platLeads[p.platform] += (p.leadIn || 0);
    });
    const bestPlat = Object.entries(platLeads).sort((a, b) => b[1] - a[1])[0];
    if (bestPlat && bestPlat[1] > 0) {
      insights.push(`📱 Platform <strong>${bestPlat[0]}</strong> menghasilkan lead terbanyak (${bestPlat[1]} lead).`);
    }

    if (insights.length === 0) {
      container.innerHTML = '<p class="text-muted">Data belum cukup untuk menghasilkan insight. Terus tambahkan data performa konten.</p>';
    } else {
      container.innerHTML = insights.map(i =>
        `<div class="insight-item"><span class="insight-icon">💡</span><span>${i}</span></div>`
      ).join('');
    }
  },

  // =============================================
  //   KOMISI CALCULATOR
  // =============================================
  calcKomisi(n) {
    if (n <= 0) return 0;
    let total = 0;
    const tier1 = Math.min(n, 3);
    total += tier1 * 500000;
    if (n > 3) {
      const tier2 = Math.min(n - 3, 2);
      total += tier2 * 750000;
    }
    if (n > 5) {
      const tier3 = n - 5;
      total += tier3 * 1000000;
    }
    return total;
  },

  calculateKomisi() {
    const n = parseInt(document.getElementById('komisiInput').value) || 0;
    const tier1 = Math.min(n, 3);
    const tier2 = n > 3 ? Math.min(n - 3, 2) : 0;
    const tier3 = n > 5 ? n - 5 : 0;

    document.getElementById('komisi1').textContent = this.formatRupiah(tier1 * 500000);
    document.getElementById('komisi2').textContent = this.formatRupiah(tier2 * 750000);
    document.getElementById('komisi3').textContent = this.formatRupiah(tier3 * 1000000);
    document.getElementById('komisiTotal').textContent = this.formatRupiah(this.calcKomisi(n));
  },

  setKomisiExample(n) {
    document.getElementById('komisiInput').value = n;
    this.calculateKomisi();
  },

  // =============================================
  //   CONTENT STUDIO
  // =============================================
  initContentStudio() {
    document.getElementById('contentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveContent();
    });

    this.renderBanks();
    this.renderContentList();
  },

  saveContent() {
    const editId = document.getElementById('contentEditId').value;
    const content = {
      id: editId || this.genId(),
      title: document.getElementById('contentTitle').value,
      platform: document.getElementById('contentPlatform').value,
      category: document.getElementById('contentCategory').value,
      hook: document.getElementById('contentHook').value,
      script: document.getElementById('contentScript').value,
      cta: document.getElementById('contentCTA').value,
      caption: document.getElementById('contentCaption').value,
      status: document.getElementById('contentStatus').value,
      notes: document.getElementById('contentNotes').value,
      createdAt: editId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let contents = this.load('contents') || [];
    if (editId) {
      const idx = contents.findIndex(c => c.id === editId);
      if (idx >= 0) {
        content.createdAt = contents[idx].createdAt;
        contents[idx] = content;
      }
    } else {
      contents.push(content);
    }

    this.save('contents', contents);
    this.resetContentForm();
    this.renderContentList();
    this.updateDashboard();
    this.showToast(editId ? '✅ Konten berhasil diperbarui!' : '✅ Konten berhasil disimpan!');
  },

  resetContentForm() {
    document.getElementById('contentForm').reset();
    document.getElementById('contentEditId').value = '';
  },

  editContent(id) {
    const contents = this.load('contents') || [];
    const c = contents.find(x => x.id === id);
    if (!c) return;

    document.getElementById('contentEditId').value = c.id;
    document.getElementById('contentTitle').value = c.title;
    document.getElementById('contentPlatform').value = c.platform;
    document.getElementById('contentCategory').value = c.category;
    document.getElementById('contentHook').value = c.hook || '';
    document.getElementById('contentScript').value = c.script || '';
    document.getElementById('contentCTA').value = c.cta || '';
    document.getElementById('contentCaption').value = c.caption || '';
    document.getElementById('contentStatus').value = c.status;
    document.getElementById('contentNotes').value = c.notes || '';

    // Switch to create tab
    document.querySelector('[data-tab="studioCreate"]').click();
    document.getElementById('contentTitle').focus();
  },

  async deleteContent(id) {
    const ok = await this.confirm('Hapus Konten', 'Apakah Anda yakin ingin menghapus konten ini?');
    if (!ok) return;

    let contents = this.load('contents') || [];
    contents = contents.filter(c => c.id !== id);
    this.save('contents', contents);
    this.renderContentList();
    this.updateDashboard();
    this.showToast('🗑️ Konten berhasil dihapus.');
  },

  renderContentList() {
    const contents = this.load('contents') || [];
    const tbody = document.getElementById('contentTableBody');
    const empty = document.getElementById('contentEmpty');

    if (contents.length === 0) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    tbody.innerHTML = contents.map(c => `
      <tr>
        <td><strong>${this.escapeHtml(c.title)}</strong></td>
        <td>${c.platform}</td>
        <td><span class="badge badge-${this.getCatBadge(c.category)}">${c.category}</span></td>
        <td><span class="badge badge-${c.status}">${c.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="App.editContent('${c.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="App.deleteContent('${c.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  },

  filterContent() {
    const q = document.getElementById('contentSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#contentTableBody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  },

  getCatBadge(cat) {
    const map = {
      'edukasi': 'baru',
      'anti-FOMO': 'tanya',
      'syariah': 'admin',
      'pemula': 'info',
      'soft selling': 'followup',
      'CTA': 'daftar',
    };
    return map[cat] || 'baru';
  },

  renderBanks() {
    // Ideas
    const ideaBank = document.getElementById('ideaBank');
    ideaBank.innerHTML = this.seedIdeas.map(idea => `
      <div class="bank-item">
        <span class="bank-item-text">💡 ${this.escapeHtml(idea)}</span>
        <button class="btn btn-sm btn-outline" onclick="App.copyToClipboard('${this.escapeAttr(idea)}')">📋</button>
      </div>
    `).join('');

    // Hooks
    const hookBank = document.getElementById('hookBank');
    hookBank.innerHTML = this.seedHooks.map(hook => `
      <div class="bank-item">
        <span class="bank-item-text">🎣 ${this.escapeHtml(hook)}</span>
        <button class="btn btn-sm btn-outline" onclick="App.copyToClipboard(${JSON.stringify(hook)})">📋</button>
      </div>
    `).join('');

    // CTAs
    const ctaBank = document.getElementById('ctaBank');
    ctaBank.innerHTML = this.seedCTAs.map(cta => `
      <div class="bank-item">
        <span class="bank-item-text">🎯 ${this.escapeHtml(cta)}</span>
        <button class="btn btn-sm btn-outline" onclick="App.copyToClipboard(${JSON.stringify(cta)})">📋</button>
      </div>
    `).join('');

    // Scripts
    const scriptBank = document.getElementById('scriptBank');
    scriptBank.innerHTML = this.seedScripts.map(s => `
      <div class="bank-item" style="flex-direction:column;align-items:stretch;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">
          <strong style="color:var(--gold-400)">${this.escapeHtml(s.title)}</strong>
          <button class="btn btn-sm btn-outline" onclick="App.copyToClipboard(${JSON.stringify(s.text)})">📋 Copy</button>
        </div>
        <span class="bank-item-text" style="white-space:pre-wrap;font-size:var(--font-size-xs);opacity:0.8;">${this.escapeHtml(s.text)}</span>
      </div>
    `).join('');
  },

  // =============================================
  //   PROMO & WHATSAPP
  // =============================================
  initPromo() {
    // Update promo code displays
    document.getElementById('dashPromoCode').textContent = this.promoCode;
    document.getElementById('promoCodeDisplay').textContent = this.promoCode;

    // WA name input listener
    document.getElementById('waName').addEventListener('input', () => this.updateWAPreview());
    document.getElementById('waAdminNumber').addEventListener('input', () => this.updateWAPreview());

    this.renderTemplates();
  },

  copyPromoCode() {
    this.copyToClipboard(this.promoCode);
  },

  simulatePromo() {
    const type = document.getElementById('promoType').value;
    const initial = document.getElementById('promoInitial').value.toUpperCase();
    const num = document.getElementById('promoNumber').value;
    document.getElementById('promoSimResult').textContent = `${type}-${initial}${num}`;
  },

  updateWAPreview() {
    const name = document.getElementById('waName').value.trim();
    const code = this.promoCode;
    let msg;
    if (name) {
      msg = `Assalamu'alaikum Admin CryptoSharia, saya <strong>${this.escapeHtml(name)}</strong>, ingin daftar CryptoSharia Masterclass menggunakan kode promo: <strong>${code}</strong>.`;
    } else {
      msg = `Assalamu'alaikum Admin CryptoSharia, saya ingin daftar CryptoSharia Masterclass menggunakan kode promo: <strong>${code}</strong>.`;
    }
    document.getElementById('waPreview').innerHTML = msg;
  },

  getWAMessage() {
    const name = document.getElementById('waName').value.trim();
    const code = this.promoCode;
    if (name) {
      return `Assalamu'alaikum Admin CryptoSharia, saya ${name}, ingin daftar CryptoSharia Masterclass menggunakan kode promo: ${code}.`;
    }
    return `Assalamu'alaikum Admin CryptoSharia, saya ingin daftar CryptoSharia Masterclass menggunakan kode promo: ${code}.`;
  },

  openWhatsApp() {
    const phone = document.getElementById('waAdminNumber').value.trim();
    if (!phone) {
      this.showToast('⚠️ Masukkan nomor WhatsApp admin terlebih dahulu.');
      return;
    }
    const msg = encodeURIComponent(this.getWAMessage());
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  },

  copyWAMessage() {
    this.copyToClipboard(this.getWAMessage());
  },

  renderTemplates() {
    const grid = document.getElementById('templateGrid');
    // Update templates with current promo code
    const templates = this.seedTemplates.map(t => ({
      ...t,
      text: t.text.replace(/M-SA01/g, this.promoCode),
    }));

    grid.innerHTML = templates.map((t, i) => `
      <div class="template-card">
        <div class="template-title">${t.title}</div>
        <div class="template-text">${this.escapeHtml(t.text)}</div>
        <button class="btn btn-sm btn-outline" data-template-idx="${i}">📋 Copy Template</button>
      </div>
    `).join('');

    // Attach event listeners for template copy buttons
    grid.querySelectorAll('[data-template-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.templateIdx);
        this.copyToClipboard(templates[idx].text);
      });
    });
  },

  // =============================================
  //   LEAD TRACKER
  // =============================================
  initLeads() {
    document.getElementById('leadForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveLead();
    });

    // Set default date
    document.getElementById('leadDate').value = new Date().toISOString().slice(0, 10);

    this.renderLeads();
  },

  saveLead() {
    const editId = document.getElementById('leadEditId').value;
    const lead = {
      id: editId || this.genId(),
      name: document.getElementById('leadName').value,
      contact: document.getElementById('leadContact').value,
      platform: document.getElementById('leadPlatform').value,
      source: document.getElementById('leadSource').value,
      status: document.getElementById('leadStatus').value,
      date: document.getElementById('leadDate').value,
      followUp: document.getElementById('leadFollowUp').value,
      notes: document.getElementById('leadNotes').value,
      createdAt: editId ? undefined : new Date().toISOString(),
    };

    let leads = this.load('leads') || [];
    if (editId) {
      const idx = leads.findIndex(l => l.id === editId);
      if (idx >= 0) {
        lead.createdAt = leads[idx].createdAt;
        leads[idx] = lead;
      }
    } else {
      leads.push(lead);
    }

    this.save('leads', leads);
    this.resetLeadForm();
    this.renderLeads();
    this.updateDashboard();
    this.showToast(editId ? '✅ Lead berhasil diperbarui!' : '✅ Lead berhasil disimpan!');
  },

  resetLeadForm() {
    document.getElementById('leadForm').reset();
    document.getElementById('leadEditId').value = '';
    document.getElementById('leadDate').value = new Date().toISOString().slice(0, 10);
  },

  editLead(id) {
    const leads = this.load('leads') || [];
    const l = leads.find(x => x.id === id);
    if (!l) return;

    document.getElementById('leadEditId').value = l.id;
    document.getElementById('leadName').value = l.name;
    document.getElementById('leadContact').value = l.contact || '';
    document.getElementById('leadPlatform').value = l.platform;
    document.getElementById('leadSource').value = l.source || '';
    document.getElementById('leadStatus').value = l.status;
    document.getElementById('leadDate').value = l.date || '';
    document.getElementById('leadFollowUp').value = l.followUp || '';
    document.getElementById('leadNotes').value = l.notes || '';
    document.getElementById('leadName').focus();
  },

  async deleteLead(id) {
    const ok = await this.confirm('Hapus Lead', 'Apakah Anda yakin ingin menghapus lead ini?');
    if (!ok) return;

    let leads = this.load('leads') || [];
    leads = leads.filter(l => l.id !== id);
    this.save('leads', leads);
    this.renderLeads();
    this.updateDashboard();
    this.showToast('🗑️ Lead berhasil dihapus.');
  },

  renderLeads() {
    const leads = this.load('leads') || [];
    const tbody = document.getElementById('leadTableBody');
    const empty = document.getElementById('leadEmpty');

    // Stats
    document.getElementById('leadTotal').textContent = leads.length;
    document.getElementById('leadDirected').textContent = leads.filter(l =>
      ['sudah diarahkan ke admin', 'sudah chat admin', 'sudah daftar'].includes(l.status)
    ).length;
    document.getElementById('leadRegistered').textContent = leads.filter(l => l.status === 'sudah daftar').length;

    if (leads.length === 0) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    tbody.innerHTML = leads.map(l => `
      <tr>
        <td><strong>${this.escapeHtml(l.name)}</strong></td>
        <td>${this.escapeHtml(l.contact || '-')}</td>
        <td>${l.platform}</td>
        <td><span class="badge badge-${this.getStatusBadge(l.status)}">${l.status}</span></td>
        <td>${l.date || '-'}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="App.editLead('${l.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="App.deleteLead('${l.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  },

  filterLeads() {
    const q = document.getElementById('leadSearch').value.toLowerCase();
    const status = document.getElementById('leadFilter').value;
    const leads = this.load('leads') || [];

    const filtered = leads.filter(l => {
      const matchQ = !q || l.name.toLowerCase().includes(q) || (l.contact || '').toLowerCase().includes(q);
      const matchStatus = !status || l.status === status;
      return matchQ && matchStatus;
    });

    const tbody = document.getElementById('leadTableBody');
    const empty = document.getElementById('leadEmpty');

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    tbody.innerHTML = filtered.map(l => `
      <tr>
        <td><strong>${this.escapeHtml(l.name)}</strong></td>
        <td>${this.escapeHtml(l.contact || '-')}</td>
        <td>${l.platform}</td>
        <td><span class="badge badge-${this.getStatusBadge(l.status)}">${l.status}</span></td>
        <td>${l.date || '-'}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="App.editLead('${l.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="App.deleteLead('${l.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  },

  getStatusBadge(status) {
    const map = {
      'baru masuk': 'baru',
      'tanya-tanya': 'tanya',
      'sudah dikirim info': 'info',
      'sudah diarahkan ke admin': 'admin',
      'sudah chat admin': 'admin',
      'sudah daftar': 'daftar',
      'belum jadi': 'gagal',
      'follow up nanti': 'followup',
    };
    return map[status] || 'baru';
  },

  exportLeadsCSV() {
    const leads = this.load('leads') || [];
    if (leads.length === 0) {
      this.showToast('⚠️ Belum ada data lead untuk diexport.');
      return;
    }

    const headers = ['Nama', 'Kontak', 'Platform', 'Sumber', 'Status', 'Tanggal', 'Follow Up', 'Catatan'];
    const rows = leads.map(l => [l.name, l.contact, l.platform, l.source, l.status, l.date, l.followUp, l.notes]);
    this.downloadCSV(headers, rows, 'leads_cryptosharia.csv');
  },

  // =============================================
  //   CONTENT PERFORMANCE
  // =============================================
  initPerformance() {
    document.getElementById('perfForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.savePerf();
    });

    document.getElementById('perfDate').value = new Date().toISOString().slice(0, 10);
    this.renderPerformance();
  },

  savePerf() {
    const editId = document.getElementById('perfEditId').value;
    const perf = {
      id: editId || this.genId(),
      name: document.getElementById('perfName').value,
      platform: document.getElementById('perfPlatform').value,
      date: document.getElementById('perfDate').value,
      category: document.getElementById('perfCategory').value,
      hook: document.getElementById('perfHook').value,
      views: parseInt(document.getElementById('perfViewsInput').value) || 0,
      likes: parseInt(document.getElementById('perfLikes').value) || 0,
      comments: parseInt(document.getElementById('perfComments').value) || 0,
      shares: parseInt(document.getElementById('perfShares').value) || 0,
      dm: parseInt(document.getElementById('perfDM').value) || 0,
      leadIn: parseInt(document.getElementById('perfLeadIn').value) || 0,
      leadReg: parseInt(document.getElementById('perfLeadReg').value) || 0,
      notes: document.getElementById('perfNotes').value,
    };

    let perfs = this.load('performance') || [];
    if (editId) {
      const idx = perfs.findIndex(p => p.id === editId);
      if (idx >= 0) perfs[idx] = perf;
    } else {
      perfs.push(perf);
    }

    this.save('performance', perfs);
    this.resetPerfForm();
    this.renderPerformance();
    this.updateDashboard();
    this.showToast(editId ? '✅ Data performa diperbarui!' : '✅ Data performa disimpan!');
  },

  resetPerfForm() {
    document.getElementById('perfForm').reset();
    document.getElementById('perfEditId').value = '';
    document.getElementById('perfDate').value = new Date().toISOString().slice(0, 10);
  },

  editPerf(id) {
    const perfs = this.load('performance') || [];
    const p = perfs.find(x => x.id === id);
    if (!p) return;

    document.getElementById('perfEditId').value = p.id;
    document.getElementById('perfName').value = p.name;
    document.getElementById('perfPlatform').value = p.platform;
    document.getElementById('perfDate').value = p.date || '';
    document.getElementById('perfCategory').value = p.category;
    document.getElementById('perfHook').value = p.hook || '';
    document.getElementById('perfViewsInput').value = p.views;
    document.getElementById('perfLikes').value = p.likes;
    document.getElementById('perfComments').value = p.comments;
    document.getElementById('perfShares').value = p.shares;
    document.getElementById('perfDM').value = p.dm;
    document.getElementById('perfLeadIn').value = p.leadIn;
    document.getElementById('perfLeadReg').value = p.leadReg;
    document.getElementById('perfNotes').value = p.notes || '';
    document.getElementById('perfName').focus();
  },

  async deletePerf(id) {
    const ok = await this.confirm('Hapus Data Performa', 'Apakah Anda yakin ingin menghapus data ini?');
    if (!ok) return;

    let perfs = this.load('performance') || [];
    perfs = perfs.filter(p => p.id !== id);
    this.save('performance', perfs);
    this.renderPerformance();
    this.updateDashboard();
    this.showToast('🗑️ Data performa dihapus.');
  },

  renderPerformance() {
    const perfs = this.load('performance') || [];
    const tbody = document.getElementById('perfTableBody');
    const empty = document.getElementById('perfEmpty');

    // Stats
    const totalViews = perfs.reduce((s, p) => s + (p.views || 0), 0);
    const totalLeads = perfs.reduce((s, p) => s + (p.leadIn || 0), 0);
    const totalReg = perfs.reduce((s, p) => s + (p.leadReg || 0), 0);
    const conv = totalLeads > 0 ? ((totalReg / totalLeads) * 100).toFixed(1) : '0';

    document.getElementById('perfTotal').textContent = perfs.length;
    document.getElementById('perfViews').textContent = this.formatNum(totalViews);
    document.getElementById('perfLeads').textContent = totalLeads;
    document.getElementById('perfReg').textContent = totalReg;
    document.getElementById('perfConv').textContent = conv + '%';

    if (perfs.length === 0) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }

    // Find best content
    const maxLead = Math.max(...perfs.map(p => p.leadIn || 0));
    const maxReg = Math.max(...perfs.map(p => p.leadReg || 0));

    empty.hidden = true;
    tbody.innerHTML = perfs.map(p => {
      const isBest = (p.leadIn === maxLead && maxLead > 0) || (p.leadReg === maxReg && maxReg > 0);
      return `
        <tr>
          <td><strong>${this.escapeHtml(p.name)}</strong></td>
          <td>${p.platform}</td>
          <td>${p.date || '-'}</td>
          <td>${this.formatNum(p.views)}</td>
          <td>${this.formatNum(p.likes)}</td>
          <td>${p.dm}</td>
          <td>${p.leadIn}</td>
          <td>${p.leadReg}</td>
          <td>${isBest ? '<span class="badge badge-best">🏆 Best</span>' : ''}</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="App.editPerf('${p.id}')">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="App.deletePerf('${p.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  exportPerfCSV() {
    const perfs = this.load('performance') || [];
    if (perfs.length === 0) {
      this.showToast('⚠️ Belum ada data untuk diexport.');
      return;
    }

    const headers = ['Konten', 'Platform', 'Tanggal', 'Kategori', 'Hook', 'Views', 'Likes', 'Comments', 'Shares', 'DM', 'Lead', 'Daftar', 'Catatan'];
    const rows = perfs.map(p => [p.name, p.platform, p.date, p.category, p.hook, p.views, p.likes, p.comments, p.shares, p.dm, p.leadIn, p.leadReg, p.notes]);
    this.downloadCSV(headers, rows, 'content_performance_cryptosharia.csv');
  },

  // =============================================
  //   CALENDAR & CHECKLIST
  // =============================================
  initCalendar() {
    document.getElementById('calendarForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveCalEntry();
    });

    document.getElementById('calDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('checklistDate').value = new Date().toISOString().slice(0, 10);

    this.renderCalendar();
    this.loadChecklist();
    this.renderWeeklyProgress();
  },

  saveCalEntry() {
    const editId = document.getElementById('calEditId').value;
    const entry = {
      id: editId || this.genId(),
      date: document.getElementById('calDate').value,
      platform: document.getElementById('calPlatform').value,
      theme: document.getElementById('calTheme').value,
      title: document.getElementById('calTitle').value,
      cta: document.getElementById('calCTA').value,
      status: document.getElementById('calStatus').value,
    };

    let cal = this.load('calendar') || [];
    if (editId) {
      const idx = cal.findIndex(c => c.id === editId);
      if (idx >= 0) cal[idx] = entry;
    } else {
      cal.push(entry);
    }

    this.save('calendar', cal);
    this.resetCalForm();
    this.renderCalendar();
    this.showToast('✅ Rencana konten disimpan!');
  },

  resetCalForm() {
    document.getElementById('calendarForm').reset();
    document.getElementById('calEditId').value = '';
    document.getElementById('calDate').value = new Date().toISOString().slice(0, 10);
  },

  editCalEntry(id) {
    const cal = this.load('calendar') || [];
    const c = cal.find(x => x.id === id);
    if (!c) return;

    document.getElementById('calEditId').value = c.id;
    document.getElementById('calDate').value = c.date;
    document.getElementById('calPlatform').value = c.platform;
    document.getElementById('calTheme').value = c.theme || '';
    document.getElementById('calTitle').value = c.title;
    document.getElementById('calCTA').value = c.cta || '';
    document.getElementById('calStatus').value = c.status;
    document.getElementById('calTitle').focus();
  },

  async deleteCalEntry(id) {
    const ok = await this.confirm('Hapus Rencana', 'Hapus rencana konten ini?');
    if (!ok) return;

    let cal = this.load('calendar') || [];
    cal = cal.filter(c => c.id !== id);
    this.save('calendar', cal);
    this.renderCalendar();
    this.showToast('🗑️ Rencana dihapus.');
  },

  renderCalendar() {
    const cal = this.load('calendar') || [];
    const tbody = document.getElementById('calTableBody');
    const empty = document.getElementById('calEmpty');

    if (cal.length === 0) {
      tbody.innerHTML = '';
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    const sorted = [...cal].sort((a, b) => a.date.localeCompare(b.date));
    const statusIcons = { ide: '💡', script: '📝', ready: '✅', posted: '🚀' };

    tbody.innerHTML = sorted.map(c => `
      <tr>
        <td>${c.date}</td>
        <td>${c.platform}</td>
        <td>${this.escapeHtml(c.title)}</td>
        <td><span class="badge badge-${c.status === 'posted' ? 'posted' : c.status === 'ready' ? 'ready' : 'draft'}">${statusIcons[c.status] || ''} ${c.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="App.editCalEntry('${c.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="App.deleteCalEntry('${c.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  },

  loadChecklist() {
    const date = document.getElementById('checklistDate').value;
    const data = this.load('checklist_' + date) || {};
    const checks = document.querySelectorAll('#checklistContainer input[type="checkbox"]');
    checks.forEach(cb => {
      cb.checked = !!data[cb.dataset.check];
    });
    this.updateChecklistProgress();
  },

  saveChecklist() {
    const date = document.getElementById('checklistDate').value;
    const data = {};
    const checks = document.querySelectorAll('#checklistContainer input[type="checkbox"]');
    checks.forEach(cb => {
      data[cb.dataset.check] = cb.checked;
    });
    this.save('checklist_' + date, data);
    this.updateChecklistProgress();
    this.renderWeeklyProgress();
  },

  updateChecklistProgress() {
    const checks = document.querySelectorAll('#checklistContainer input[type="checkbox"]');
    const total = checks.length;
    const done = Array.from(checks).filter(cb => cb.checked).length;
    const pct = total > 0 ? (done / total) * 100 : 0;

    document.getElementById('checklistProgress').style.width = pct + '%';
    document.getElementById('checklistProgressText').textContent = `${done}/${total} selesai`;
  },

  renderWeeklyProgress() {
    const container = document.getElementById('weeklyBars');
    const today = new Date();
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const bars = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const data = this.load('checklist_' + dateStr) || {};
      const done = Object.values(data).filter(v => v).length;
      const pct = (done / 7) * 100;

      bars.push(`
        <div class="weekly-bar">
          <span class="weekly-bar-value">${done}/7</span>
          <div class="weekly-bar-fill" style="height:${Math.max(pct, 5)}px"></div>
          <span class="weekly-bar-label">${dayNames[d.getDay()]}</span>
        </div>
      `);
    }

    container.innerHTML = bars.join('');
  },

  // =============================================
  //   ASSET LIBRARY
  // =============================================
  initAssets() {
    this.renderAssetTab('promptKarakter');
  },

  renderAssetTab(tabKey) {
    const container = document.getElementById('assetContent');
    const items = this.load('assets_' + tabKey) || this.seedAssets[tabKey] || [];

    const tabTitles = {
      promptKarakter: '🧸 Prompt Karakter Amigurumi',
      promptScene: '🎬 Prompt Scene',
      promptCTA: '🎯 Prompt CTA Scene',
      promptBg: '🖼️ Prompt Background',
      promptStory: '📖 Prompt Visual Storytelling',
      promptHook: '🎣 Prompt Visual Hook',
      promptTransisi: '🔄 Prompt Transisi',
      catatanVO: '🎤 Catatan Voiceover',
      catatanCaption: '📝 Catatan Caption',
    };

    container.innerHTML = `
      <div class="card">
        <div class="card-header-row">
          <h3 class="card-title">${tabTitles[tabKey] || tabKey}</h3>
          <button class="btn btn-sm btn-danger" onclick="App.resetAssetTab('${tabKey}')">🔄 Reset ke Default</button>
        </div>
        <div class="asset-list" id="assetList_${tabKey}">
          ${items.map((item, i) => `
            <div class="asset-item">
              <span class="asset-item-text">${this.escapeHtml(item)}</span>
              <div style="display:flex;gap:var(--space-2);">
                <button class="btn btn-sm btn-outline" onclick="App.copyToClipboard(${JSON.stringify(item)})">📋</button>
                <button class="btn btn-sm btn-danger" onclick="App.deleteAsset('${tabKey}', ${i})">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="asset-add-form">
          <textarea id="assetNewInput_${tabKey}" class="input" rows="2" placeholder="Tambah prompt/catatan baru..."></textarea>
          <button class="btn btn-primary" onclick="App.addAsset('${tabKey}')">➕</button>
        </div>
      </div>

      <div class="card" style="margin-top:var(--space-4);">
        <h3 class="card-title">🎨 Gaya Visual Amigurumi 3D Faceless</h3>
        <div class="syariah-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
          <div class="syariah-card syariah-do"><p>Amigurumi 3D faceless Muslim character</p></div>
          <div class="syariah-card syariah-do"><p>Karakter tanpa wajah detail</p></div>
          <div class="syariah-card syariah-do"><p>Gaya lucu, lembut, bersih, premium</p></div>
          <div class="syariah-card syariah-do"><p>Nuansa Islami modern</p></div>
          <div class="syariah-card syariah-do"><p>Cocok untuk edukasi finance syariah</p></div>
          <div class="syariah-card syariah-do"><p>Tidak kekanak-kanakan berlebihan</p></div>
          <div class="syariah-card syariah-do"><p>Warna lembut dan profesional</p></div>
        </div>
      </div>
    `;
  },

  addAsset(tabKey) {
    const input = document.getElementById('assetNewInput_' + tabKey);
    const text = input.value.trim();
    if (!text) return;

    let items = this.load('assets_' + tabKey) || this.seedAssets[tabKey] || [];
    items.push(text);
    this.save('assets_' + tabKey, items);
    this.renderAssetTab(tabKey);
    this.showToast('✅ Asset ditambahkan!');
  },

  async deleteAsset(tabKey, index) {
    const ok = await this.confirm('Hapus Asset', 'Hapus item ini?');
    if (!ok) return;

    let items = this.load('assets_' + tabKey) || this.seedAssets[tabKey] || [];
    items.splice(index, 1);
    this.save('assets_' + tabKey, items);
    this.renderAssetTab(tabKey);
    this.showToast('🗑️ Asset dihapus.');
  },

  async resetAssetTab(tabKey) {
    const ok = await this.confirm('Reset Asset', 'Kembalikan ke data default?');
    if (!ok) return;

    localStorage.removeItem('cs_assets_' + tabKey);
    this.renderAssetTab(tabKey);
    this.showToast('🔄 Asset direset ke default.');
  },

  // =============================================
  //   HOOK A/B COMPARISON
  // =============================================
  populateHookSelects() {
    const hooks = this.seedHooks;
    const selA = document.getElementById('hookASelect');
    const selB = document.getElementById('hookBSelect');

    const opts = hooks.map((h, i) => `<option value="${i}">${h}</option>`).join('');
    selA.innerHTML = '<option value="">Pilih Hook A...</option>' + opts;
    selB.innerHTML = '<option value="">Pilih Hook B...</option>' + opts;

    // Load saved comparison
    const saved = this.load('abComparison');
    if (saved) {
      selA.value = saved.hookA ?? '';
      selB.value = saved.hookB ?? '';
      document.getElementById('hookAViews').value = saved.aViews || 0;
      document.getElementById('hookADM').value = saved.aDM || 0;
      document.getElementById('hookALead').value = saved.aLead || 0;
      document.getElementById('hookAReg').value = saved.aReg || 0;
      document.getElementById('hookBViews').value = saved.bViews || 0;
      document.getElementById('hookBDM').value = saved.bDM || 0;
      document.getElementById('hookBLead').value = saved.bLead || 0;
      document.getElementById('hookBReg').value = saved.bReg || 0;
      this.updateABComparison();
    }
  },

  updateABComparison() {
    const idxA = document.getElementById('hookASelect').value;
    const idxB = document.getElementById('hookBSelect').value;

    if (idxA === '' || idxB === '') {
      document.getElementById('abResult').innerHTML = '<p class="text-muted">Pilih dua hook dan isi data untuk melihat perbandingan.</p>';
      return;
    }

    const aViews = parseInt(document.getElementById('hookAViews').value) || 0;
    const aDM = parseInt(document.getElementById('hookADM').value) || 0;
    const aLead = parseInt(document.getElementById('hookALead').value) || 0;
    const aReg = parseInt(document.getElementById('hookAReg').value) || 0;

    const bViews = parseInt(document.getElementById('hookBViews').value) || 0;
    const bDM = parseInt(document.getElementById('hookBDM').value) || 0;
    const bLead = parseInt(document.getElementById('hookBLead').value) || 0;
    const bReg = parseInt(document.getElementById('hookBReg').value) || 0;

    const aScore = aViews + (aDM * 5) + (aLead * 10) + (aReg * 50);
    const bScore = bViews + (bDM * 5) + (bLead * 10) + (bReg * 50);

    let result = '';
    if (aScore === 0 && bScore === 0) {
      result = '<p class="text-muted">Isi data performa untuk melihat perbandingan.</p>';
    } else if (aScore > bScore) {
      result = `<div class="ab-winner winner-a"><strong>🏆 Hook A</strong> unggul dengan skor ${aScore} vs ${bScore}</div>`;
    } else if (bScore > aScore) {
      result = `<div class="ab-winner winner-b"><strong>🏆 Hook B</strong> unggul dengan skor ${bScore} vs ${aScore}</div>`;
    } else {
      result = '<div class="ab-winner"><strong>🤝 Seri!</strong> Kedua hook memiliki performa yang sama.</div>';
    }

    document.getElementById('abResult').innerHTML = result;
  },

  saveABComparison() {
    const data = {
      hookA: document.getElementById('hookASelect').value,
      hookB: document.getElementById('hookBSelect').value,
      aViews: document.getElementById('hookAViews').value,
      aDM: document.getElementById('hookADM').value,
      aLead: document.getElementById('hookALead').value,
      aReg: document.getElementById('hookAReg').value,
      bViews: document.getElementById('hookBViews').value,
      bDM: document.getElementById('hookBDM').value,
      bLead: document.getElementById('hookBLead').value,
      bReg: document.getElementById('hookBReg').value,
    };
    this.save('abComparison', data);
    this.showToast('✅ Perbandingan hook disimpan!');
  },

  resetABComparison() {
    document.getElementById('hookASelect').value = '';
    document.getElementById('hookBSelect').value = '';
    document.getElementById('hookAViews').value = 0;
    document.getElementById('hookADM').value = 0;
    document.getElementById('hookALead').value = 0;
    document.getElementById('hookAReg').value = 0;
    document.getElementById('hookBViews').value = 0;
    document.getElementById('hookBDM').value = 0;
    document.getElementById('hookBLead').value = 0;
    document.getElementById('hookBReg').value = 0;
    document.getElementById('abResult').innerHTML = '<p class="text-muted">Pilih dua hook dan isi data untuk melihat perbandingan.</p>';
    localStorage.removeItem('cs_abComparison');
  },

  // =============================================
  //   QUICK COPY
  // =============================================
  quickCopy(type) {
    const text = this.quickCopyContent[type];
    if (text) {
      this.copyToClipboard(text);
    }
  },

  // =============================================
  //   RESET MODULE
  // =============================================
  async resetModule(module) {
    const names = {
      contents: 'Content Studio',
      leads: 'Lead Tracker',
      performance: 'Content Performance',
      calendar: 'Content Calendar',
    };
    const ok = await this.confirm(`Reset ${names[module]}`, `Semua data ${names[module]} akan dihapus. Lanjutkan?`);
    if (!ok) return;

    this.save(module, []);

    if (module === 'contents') this.renderContentList();
    if (module === 'leads') this.renderLeads();
    if (module === 'performance') this.renderPerformance();
    if (module === 'calendar') this.renderCalendar();

    this.updateDashboard();
    this.showToast(`🔄 Data ${names[module]} berhasil direset.`);
  },

  // =============================================
  //   CSV EXPORT
  // =============================================
  downloadCSV(headers, rows, filename) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('📥 File CSV berhasil diunduh!');
  },

  // =============================================
  //   UTILITY
  // =============================================
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  escapeAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  },

  formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  },

  // =============================================
  //   SEED SAMPLE DATA
  // =============================================
  seedSampleData() {
    // Only seed if no data exists
    if (this.load('leads') && this.load('leads').length > 0) return;

    // Sample leads
    const sampleLeads = [
      { id: this.genId(), name: 'Ahmad Fadli', contact: '@ahmadfadli', platform: 'TikTok', source: 'Takut crypto itu wajar', status: 'sudah daftar', date: '2026-06-05', followUp: '', notes: 'Sangat antusias, langsung chat admin' },
      { id: this.genId(), name: 'Siti Nurhaliza', contact: '@sitinurhaliza_id', platform: 'Instagram', source: 'Beda investasi dan spekulasi', status: 'sudah diarahkan ke admin', date: '2026-06-06', followUp: '2026-06-12', notes: 'Sudah kirim link admin' },
      { id: this.genId(), name: 'Budi Santoso', contact: '628123456789', platform: 'WhatsApp', source: 'Kenapa leverage berbahaya', status: 'sudah daftar', date: '2026-06-07', followUp: '', notes: 'Referral dari teman' },
      { id: this.genId(), name: 'Rina Wati', contact: '@rinawati99', platform: 'TikTok', source: 'Ilmu dulu cuan kemudian', status: 'tanya-tanya', date: '2026-06-08', followUp: '2026-06-11', notes: 'Masih tanya soal harga' },
      { id: this.genId(), name: 'Dian Permana', contact: '@dianp', platform: 'Instagram', source: 'Crypto bukan jalan cepat kaya', status: 'sudah dikirim info', date: '2026-06-09', followUp: '2026-06-12', notes: '' },
      { id: this.genId(), name: 'Fahri Rahman', contact: '@fahrirahman', platform: 'YouTube Shorts', source: 'Screening koin halal', status: 'baru masuk', date: '2026-06-10', followUp: '', notes: 'DM tanya detail' },
    ];
    this.save('leads', sampleLeads);

    // Sample contents
    const sampleContents = [
      { id: this.genId(), title: 'Takut Crypto Itu Wajar', platform: 'TikTok', category: 'pemula', hook: 'Kalau kamu takut crypto, itu wajar.', script: 'Script lengkap...', cta: 'Chat admin CryptoSharia dan gunakan kode promo saya.', caption: 'Takut crypto? Wajar kok. Yang penting belajar dulu. 📚', status: 'posted', notes: 'Video pertama, response bagus', createdAt: '2026-06-03T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z' },
      { id: this.genId(), title: 'Beda Investasi dan Spekulasi', platform: 'Instagram Reels', category: 'edukasi', hook: 'Beli koin tanpa paham risikonya itu bukan investasi.', script: 'Script lengkap...', cta: 'Gunakan kode promo saya untuk diskon Rp250.000.', caption: 'Investasi ≠ Spekulasi. Pelajari bedanya. 📖', status: 'posted', notes: '', createdAt: '2026-06-04T10:00:00Z', updatedAt: '2026-06-06T10:00:00Z' },
      { id: this.genId(), title: 'Kenapa FOMO Berbahaya', platform: 'TikTok', category: 'anti-FOMO', hook: 'Kalau alasan masuk crypto cuma karena ramai, berhenti dulu.', script: '', cta: '', caption: '', status: 'draft', notes: 'Masih develop angle', createdAt: '2026-06-08T10:00:00Z', updatedAt: '2026-06-08T10:00:00Z' },
      { id: this.genId(), title: 'Screening Koin Halal 101', platform: 'YouTube Shorts', category: 'syariah', hook: 'Sebagai Muslim, kita tidak cukup hanya tanya: untung atau tidak?', script: 'Script lengkap...', cta: 'DM saya atau chat admin CryptoSharia.', caption: 'Halal atau tidak? Itu pertanyaan pertama. 🕌', status: 'ready', notes: 'Siap upload besok', createdAt: '2026-06-09T10:00:00Z', updatedAt: '2026-06-10T10:00:00Z' },
    ];
    this.save('contents', sampleContents);

    // Sample performance
    const samplePerf = [
      { id: this.genId(), name: 'Takut Crypto Itu Wajar', platform: 'TikTok', date: '2026-06-05', category: 'pemula', hook: 'Kalau kamu takut crypto, itu wajar.', views: 12500, likes: 890, comments: 45, shares: 120, dm: 8, leadIn: 4, leadReg: 1, notes: 'Video pertama, performa sangat baik' },
      { id: this.genId(), name: 'Beda Investasi dan Spekulasi', platform: 'Instagram Reels', date: '2026-06-06', category: 'edukasi', hook: 'Beli koin tanpa paham risikonya bukan investasi.', views: 8300, likes: 520, comments: 32, shares: 85, dm: 5, leadIn: 3, leadReg: 1, notes: 'Engagement rate tinggi' },
    ];
    this.save('performance', samplePerf);

    // Sample calendar
    const sampleCal = [
      { id: this.genId(), date: '2026-06-11', platform: 'TikTok', theme: 'Anti-FOMO', title: 'Kenapa FOMO Berbahaya di Crypto', cta: 'DM untuk info', status: 'script' },
      { id: this.genId(), date: '2026-06-12', platform: 'Instagram Reels', theme: 'Syariah', title: 'Screening Koin Halal 101', cta: 'Chat admin + kode promo', status: 'ready' },
      { id: this.genId(), date: '2026-06-13', platform: 'YouTube Shorts', theme: 'Pemula', title: 'Mulai Crypto dari Mana?', cta: 'Gunakan kode promo saya', status: 'ide' },
    ];
    this.save('calendar', sampleCal);
  },

  // =============================================
  //   INIT
  // =============================================
  init() {
    this.seedSampleData();
    this.initNavigation();
    this.initContentStudio();
    this.initPromo();
    this.initLeads();
    this.initPerformance();
    this.initCalendar();
    this.initAssets();
    this.updateDashboard();
    this.calculateKomisi();
  },
};

// Start app
document.addEventListener('DOMContentLoaded', () => App.init());
