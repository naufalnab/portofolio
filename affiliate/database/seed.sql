-- ============================================
-- CryptoSharia Affiliate Command Center
-- Seed Data (run AFTER schema.sql)
-- NOTE: user_id=1 assumed — created by setup.php
-- ============================================

SET NAMES utf8mb4;

-- -------------------------------------------
-- Default Settings
-- -------------------------------------------
INSERT INTO `settings` (`user_id`, `promo_code`, `affiliate_type`, `affiliate_initial`, `affiliate_number`, `admin_whatsapp`, `target_registrants`)
VALUES (1, 'P-NFL', 'P', 'NFL', '', '', 10);

-- -------------------------------------------
-- Hook Templates
-- -------------------------------------------
INSERT INTO `templates` (`user_id`, `template_type`, `title`, `content`) VALUES
(1, 'hook', 'Takut crypto wajar', '"Kalau kamu takut crypto, itu wajar."'),
(1, 'hook', 'Kurang ilmu', '"Masalah banyak orang di crypto bukan kurang berani, tapi kurang ilmu."'),
(1, 'hook', 'Bukan investasi', '"Beli koin tanpa paham risikonya itu bukan investasi, itu rawan spekulasi."'),
(1, 'hook', 'Muslim harus tanya', '"Sebagai Muslim, kita tidak cukup hanya tanya: untung atau tidak?"'),
(1, 'hook', 'Ikut-ikutan', '"Kalau alasan masuk crypto cuma karena ramai, berhenti dulu."'),
(1, 'hook', 'Bukan FOMO', '"Crypto tidak harus identik dengan FOMO."'),
(1, 'hook', 'Cara berpikir', '"Yang perlu dibangun pertama kali bukan portofolio, tapi cara berpikir."'),
(1, 'hook', 'Belajar dulu', '"Belajar dulu jauh lebih murah daripada rugi karena asal masuk."');

-- -------------------------------------------
-- CTA Templates
-- -------------------------------------------
INSERT INTO `templates` (`user_id`, `template_type`, `title`, `content`) VALUES
(1, 'cta', 'Chat admin', '"Kalau mau belajar crypto lebih terstruktur, chat admin CryptoSharia dan gunakan kode promo saya."'),
(1, 'cta', 'Sebutkan kode', '"Kalau mau daftar, pastikan sebutkan kode promo saya agar diskon dan bonusnya tercatat."'),
(1, 'cta', 'DM atau chat', '"Kalau mau info detail, DM saya atau langsung chat admin."'),
(1, 'cta', 'Diskon + bonus', '"Gunakan kode promo saya untuk mendapatkan diskon tambahan Rp250.000 dan bonus Discord Premium 6 bulan."');

-- -------------------------------------------
-- Idea Templates
-- -------------------------------------------
INSERT INTO `templates` (`user_id`, `template_type`, `title`, `content`) VALUES
(1, 'idea', 'Takut crypto', 'Takut crypto itu wajar'),
(1, 'idea', 'Investasi vs spekulasi', 'Beda investasi dan spekulasi'),
(1, 'idea', 'Leverage bahaya', 'Kenapa leverage berbahaya'),
(1, 'idea', 'Screening halal', 'Apa itu screening koin halal'),
(1, 'idea', 'Belajar dulu', 'Kenapa belajar dulu sebelum beli koin'),
(1, 'idea', 'Muslim hati-hati', 'Muslim harus lebih hati-hati di crypto'),
(1, 'idea', 'Bukan cepat kaya', 'Crypto bukan jalan cepat kaya'),
(1, 'idea', 'Ilmu dulu', 'Ilmu dulu, cuan kemudian'),
(1, 'idea', 'Anti scam', 'Cocok untuk pemula yang takut scam'),
(1, 'idea', 'Tanpa FOMO', 'Belajar crypto tanpa FOMO');

-- -------------------------------------------
-- Script Templates
-- -------------------------------------------
INSERT INTO `templates` (`user_id`, `template_type`, `title`, `content`) VALUES
(1, 'script', 'Takut Crypto Itu Wajar', 'Hook: "Kalau kamu takut crypto, itu wajar."\n\nBanyak yang berpikir crypto itu identik dengan rugi. Padahal, rugi itu biasanya karena asal beli tanpa ilmu.\n\nDi CryptoSharia Masterclass, kamu belajar dari nol. Mulai dari apa itu crypto, cara screening koin halal, sampai risk management.\n\nJadi, kalau kamu mau mulai tapi takut... belajar dulu. Itu langkah pertama yang paling benar.\n\nCTA: Chat admin CryptoSharia dan gunakan kode promo saya untuk diskon Rp250.000.'),
(1, 'script', 'Beda Investasi dan Spekulasi', 'Hook: "Beli koin tanpa paham risikonya itu bukan investasi, itu rawan spekulasi."\n\nInvestasi itu ada ilmunya. Ada analisa fundamental, ada manajemen risiko, ada screening halal.\n\nSpekulasi itu cuma ikut tren tanpa dasar. Dan biasanya berakhir menyesal.\n\nDi CryptoSharia Masterclass, kamu diajarkan pendekatan yang terukur dan terstruktur. Bukan gambling.\n\nCTA: Mau belajar investasi crypto yang benar? DM saya atau chat admin.'),
(1, 'script', 'Kenapa Leverage Berbahaya', 'Hook: "Kalau ada yang bilang bisa kaya cepat dari leverage, waspada."\n\nLeverage itu memperbesar risiko kerugian berlipat. Dalam prinsip syariah, ini juga termasuk hal yang perlu dihindari.\n\nDi CryptoSharia Masterclass, kamu belajar cara investasi yang sadar risiko. Tanpa leverage, tanpa gambling.\n\nCTA: Gunakan kode promo saya untuk diskon dan bonus Discord Premium.'),
(1, 'script', 'Screening Koin Halal', 'Hook: "Sebagai Muslim, kita tidak cukup hanya tanya: untung atau tidak?"\n\nPertanyaan pertama seharusnya: halal atau tidak?\n\nDi CryptoSharia Masterclass, kamu belajar screening koin halal. Supaya investasimu tidak hanya cuan, tapi juga tenang secara syariah.\n\nCTA: DM saya untuk info lebih lanjut, atau langsung chat admin CryptoSharia.'),
(1, 'script', 'Ilmu Dulu Cuan Kemudian', 'Hook: "Belajar dulu jauh lebih murah daripada rugi karena asal masuk."\n\nBanyak yang langsung terjun ke crypto tanpa ilmu. Hasilnya? Panik saat harga turun, FOMO saat harga naik.\n\nCryptoSharia Masterclass mengajarkan pendekatan terstruktur: fundamental, teknikal, macro, financial planning, dan risk management.\n\nCTA: Sebutkan kode promo saya saat daftar untuk bonus eksklusif.');

-- -------------------------------------------
-- WhatsApp Templates
-- -------------------------------------------
INSERT INTO `templates` (`user_id`, `template_type`, `title`, `content`) VALUES
(1, 'whatsapp', 'Pesan untuk Calon Peserta', 'Assalamu''alaikum! 😊\n\nKalau kamu tertarik belajar crypto dengan pendekatan syariah, sistematis, dan terstruktur, saya rekomendasikan CryptoSharia Masterclass.\n\nDi sana kamu akan belajar:\n• Screening koin halal\n• Analisa fundamental & teknikal\n• Risk management\n• Financial planning\n• Dan masih banyak lagi\n\nGunakan kode promo saya: P-NFL untuk mendapatkan:\n✅ Diskon Rp250.000\n✅ Bonus Discord Premium 6 bulan (senilai Rp1.000.000)\n\nChat admin CryptoSharia untuk daftar ya! 🙏'),
(1, 'whatsapp', 'Pesan Follow-Up', 'Assalamu''alaikum! 😊\n\nKemarin sempat tanya-tanya soal CryptoSharia Masterclass ya? Kalau masih tertarik, pendaftaran masih dibuka.\n\nJangan lupa sebutkan kode promo P-NFL supaya kamu dapat diskon Rp250.000 dan bonus Discord Premium 6 bulan.\n\nKalau ada pertanyaan, jangan ragu chat saya ya. 🙏'),
(1, 'whatsapp', 'Broadcast Soft Selling', 'Belajar crypto itu seharusnya tidak bikin cemas.\n\nDi CryptoSharia Masterclass, kamu belajar dari nol dengan pendekatan:\n✅ Syariah\n✅ Terstruktur\n✅ Sadar risiko\n\nBukan janji cuan instan. Tapi ilmu yang bisa kamu pakai seumur hidup.\n\nDM saya untuk info lebih lanjut. 🙏'),
(1, 'whatsapp', 'Pengingat Kode Promo', 'Reminder! 🔔\n\nKalau kamu mau daftar CryptoSharia Masterclass, jangan lupa sebutkan kode promo saya:\n\n🏷️ P-NFL\n\nBenefitnya:\n✅ Diskon Rp250.000\n✅ Bonus Discord Premium 6 bulan\n\nSebutkan ke admin saat chat ya, supaya tercatat. 🙏');

-- -------------------------------------------
-- Disclaimer Template
-- -------------------------------------------
INSERT INTO `templates` (`user_id`, `template_type`, `title`, `content`) VALUES
(1, 'disclaimer', 'Disclaimer Wajib', 'Bukan financial advice. Konten ini untuk edukasi.');

-- -------------------------------------------
-- Asset Library: Prompt Karakter
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'prompt karakter', 'Cute amigurumi 3D faceless Muslim character wearing white thobe and keffiyeh, soft lighting, clean background, premium 3D render'),
(1, 'prompt karakter', 'Amigurumi 3D faceless Muslimah character with pastel hijab, holding a tablet showing crypto chart, warm soft lighting'),
(1, 'prompt karakter', 'Chibi-style amigurumi 3D faceless character sitting at desk with laptop, Islamic geometric pattern on wall, professional setting'),
(1, 'prompt karakter', 'Pair of amigurumi 3D faceless Muslim characters, one mentoring the other, warm educational setting, clean and modern');

-- -------------------------------------------
-- Asset Library: Prompt Scene
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'prompt scene', 'Amigurumi 3D scene: character studying at clean modern desk with books about Islamic finance, warm ambient lighting'),
(1, 'prompt scene', 'Amigurumi 3D scene: character looking at phone with crypto prices going up, calm expression, no panic, peaceful room'),
(1, 'prompt scene', 'Amigurumi 3D scene: online classroom with multiple faceless characters on screen, teacher at whiteboard explaining crypto');

-- -------------------------------------------
-- Asset Library: Prompt CTA Scene
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'prompt CTA scene', 'Amigurumi 3D scene: character holding a golden ticket/card with text "PROMO CODE", sparkle effects, premium feel'),
(1, 'prompt CTA scene', 'Amigurumi 3D scene: character pointing at WhatsApp logo, golden accent, clean background with subtle Islamic pattern'),
(1, 'prompt CTA scene', 'Amigurumi 3D scene: character opening a gift box revealing "DISKON Rp250.000" text, celebration confetti, warm lighting');

-- -------------------------------------------
-- Asset Library: Prompt Background
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'prompt background', 'Clean navy blue gradient background with subtle Islamic geometric pattern overlay, golden accent lines, 4K'),
(1, 'prompt background', 'Soft white and gold abstract background with arabic calligraphy inspired patterns, minimal and modern'),
(1, 'prompt background', 'Dark blue premium background with glowing golden eight-pointed star pattern, fintech aesthetic');

-- -------------------------------------------
-- Asset Library: Visual Storytelling
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'prompt visual storytelling', 'Amigurumi 3D visual storytelling: 3-panel sequence showing character confused → studying → confident, warm lighting progression'),
(1, 'prompt visual storytelling', 'Amigurumi 3D visual storytelling: character journey from FOMO panic to calm studying to celebrating small wins');

-- -------------------------------------------
-- Asset Library: Visual Hook
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'prompt visual hook', 'Amigurumi 3D visual hook: character looking shocked at crypto red chart, dramatic lighting, close-up, eye-catching'),
(1, 'prompt visual hook', 'Amigurumi 3D visual hook: character with question marks floating around head, curious expression, pastel colors'),
(1, 'prompt visual hook', 'Amigurumi 3D visual hook: split screen - chaotic crypto trading vs calm studying, contrasting lighting');

-- -------------------------------------------
-- Asset Library: Transisi
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'prompt transisi', 'Smooth zoom transition: from macro shot of Islamic pattern to reveal amigurumi character studying'),
(1, 'prompt transisi', 'Page turn transition: old page shows wrong trading, new page shows proper crypto education');

-- -------------------------------------------
-- Asset Library: Voiceover & Caption Notes
-- -------------------------------------------
INSERT INTO `assets_library` (`user_id`, `asset_type`, `content`) VALUES
(1, 'voiceover', 'Nada suara: tenang, hangat, tidak menggurui, seperti teman yang peduli'),
(1, 'voiceover', 'Pacing: agak lambat di hook, sedikit cepat di problem, kembali tenang di solusi dan CTA'),
(1, 'voiceover', 'Jangan gunakan nada yang terlalu excited atau hype — tetap edukatif dan genuine'),
(1, 'voiceover', 'Bahasa: campuran bahasa Indonesia semi-formal dan casual, hindari jargon berlebihan'),
(1, 'caption', 'Gunakan emoji secukupnya, jangan berlebihan — 2-3 per caption sudah cukup'),
(1, 'caption', 'Selalu akhiri dengan CTA yang lembut, bukan hard selling'),
(1, 'caption', 'Tambahkan hashtag relevan: #CryptoSyariah #BelajarCrypto #InvestasiHalal #CryptoSharia'),
(1, 'caption', 'Caption 2-3 paragraf pendek, mudah dibaca saat scroll');

-- -------------------------------------------
-- Sample Leads
-- -------------------------------------------
INSERT INTO `leads` (`user_id`, `name`, `contact`, `platform`, `source_content`, `status`, `entry_date`, `notes`) VALUES
(1, 'Ahmad Fadli', '@ahmadfadli', 'TikTok', 'Takut crypto itu wajar', 'sudah daftar', '2026-06-05', 'Sangat antusias, langsung chat admin'),
(1, 'Siti Nurhaliza', '@sitinurhaliza_id', 'Instagram', 'Beda investasi dan spekulasi', 'sudah diarahkan ke admin', '2026-06-06', 'Sudah kirim link admin'),
(1, 'Budi Santoso', '628123456789', 'WhatsApp', 'Kenapa leverage berbahaya', 'sudah daftar', '2026-06-07', 'Referral dari teman'),
(1, 'Rina Wati', '@rinawati99', 'TikTok', 'Ilmu dulu cuan kemudian', 'tanya-tanya', '2026-06-08', 'Masih tanya soal harga'),
(1, 'Dian Permana', '@dianp', 'Instagram', 'Crypto bukan jalan cepat kaya', 'sudah dikirim info', '2026-06-09', ''),
(1, 'Fahri Rahman', '@fahrirahman', 'YouTube Shorts', 'Screening koin halal', 'baru masuk', '2026-06-10', 'DM tanya detail');

-- -------------------------------------------
-- Sample Contents
-- -------------------------------------------
INSERT INTO `contents` (`user_id`, `title`, `platform`, `category`, `hook`, `script_body`, `cta`, `caption`, `status`, `notes`) VALUES
(1, 'Takut Crypto Itu Wajar', 'TikTok', 'pemula', 'Kalau kamu takut crypto, itu wajar.', 'Script lengkap...', 'Chat admin CryptoSharia dan gunakan kode promo saya.', 'Takut crypto? Wajar kok. Yang penting belajar dulu. 📚', 'posted', 'Video pertama, response bagus'),
(1, 'Beda Investasi dan Spekulasi', 'Instagram Reels', 'edukasi', 'Beli koin tanpa paham risikonya itu bukan investasi.', 'Script lengkap...', 'Gunakan kode promo saya untuk diskon Rp250.000.', 'Investasi ≠ Spekulasi. Pelajari bedanya. 📖', 'posted', ''),
(1, 'Kenapa FOMO Berbahaya', 'TikTok', 'anti-FOMO', 'Kalau alasan masuk crypto cuma karena ramai, berhenti dulu.', '', '', '', 'draft', 'Masih develop angle'),
(1, 'Screening Koin Halal 101', 'YouTube Shorts', 'syariah', 'Sebagai Muslim, kita tidak cukup hanya tanya: untung atau tidak?', 'Script lengkap...', 'DM saya atau chat admin CryptoSharia.', 'Halal atau tidak? Itu pertanyaan pertama. 🕌', 'ready', 'Siap upload besok');

-- -------------------------------------------
-- Sample Content Performances
-- -------------------------------------------
INSERT INTO `content_performances` (`user_id`, `content_name`, `platform`, `post_date`, `category`, `hook`, `views`, `likes`, `comments`, `shares`, `dms`, `leads`, `registrants`, `notes`) VALUES
(1, 'Takut Crypto Itu Wajar', 'TikTok', '2026-06-05', 'pemula', 'Kalau kamu takut crypto, itu wajar.', 12500, 890, 45, 120, 8, 4, 1, 'Video pertama, performa sangat baik'),
(1, 'Beda Investasi dan Spekulasi', 'Instagram Reels', '2026-06-06', 'edukasi', 'Beli koin tanpa paham risikonya bukan investasi.', 8300, 520, 32, 85, 5, 3, 1, 'Engagement rate tinggi');

-- -------------------------------------------
-- Sample Calendar Items
-- -------------------------------------------
INSERT INTO `calendar_items` (`user_id`, `planned_date`, `platform`, `theme`, `title`, `cta`, `production_status`) VALUES
(1, '2026-06-11', 'TikTok', 'Anti-FOMO', 'Kenapa FOMO Berbahaya di Crypto', 'DM untuk info', 'script'),
(1, '2026-06-12', 'Instagram Reels', 'Syariah', 'Screening Koin Halal 101', 'Chat admin + kode promo', 'ready'),
(1, '2026-06-13', 'YouTube Shorts', 'Pemula', 'Mulai Crypto dari Mana?', 'Gunakan kode promo saya', 'ide');
