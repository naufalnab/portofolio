-- ============================================
-- CryptoSharia Affiliate Command Center
-- Database Schema
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------
-- 1. Users
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 2. Settings
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `promo_code` VARCHAR(20) NOT NULL DEFAULT 'P-NFL',
  `affiliate_type` ENUM('M','P') NOT NULL DEFAULT 'P',
  `affiliate_initial` VARCHAR(10) NOT NULL DEFAULT 'NFL',
  `affiliate_number` VARCHAR(10) NOT NULL DEFAULT '',
  `admin_whatsapp` VARCHAR(20) NOT NULL DEFAULT '',
  `target_registrants` INT UNSIGNED NOT NULL DEFAULT 10,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 3. Leads
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `contact` VARCHAR(150) NOT NULL DEFAULT '',
  `platform` ENUM('TikTok','Instagram','YouTube Shorts','WhatsApp','Story','Lainnya') NOT NULL DEFAULT 'TikTok',
  `source_content` VARCHAR(255) NOT NULL DEFAULT '',
  `status` ENUM('baru masuk','tanya-tanya','sudah dikirim info','sudah diarahkan ke admin','sudah chat admin','sudah daftar','belum jadi','follow up nanti') NOT NULL DEFAULT 'baru masuk',
  `entry_date` DATE DEFAULT NULL,
  `follow_up_date` DATE DEFAULT NULL,
  `notes` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_user` (`user_id`),
  KEY `idx_leads_status` (`status`),
  KEY `idx_leads_date` (`entry_date`),
  CONSTRAINT `fk_leads_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 4. Contents (Content Studio)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `contents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `platform` ENUM('TikTok','Instagram Reels','YouTube Shorts') NOT NULL DEFAULT 'TikTok',
  `category` ENUM('edukasi','anti-FOMO','syariah','pemula','soft selling','CTA') NOT NULL DEFAULT 'edukasi',
  `hook` TEXT,
  `script_body` TEXT,
  `cta` TEXT,
  `caption` TEXT,
  `status` ENUM('draft','ready','posted') NOT NULL DEFAULT 'draft',
  `notes` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contents_user` (`user_id`),
  KEY `idx_contents_status` (`status`),
  CONSTRAINT `fk_contents_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 5. Content Performances
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `content_performances` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `content_name` VARCHAR(255) NOT NULL,
  `platform` ENUM('TikTok','Instagram Reels','YouTube Shorts') NOT NULL DEFAULT 'TikTok',
  `post_date` DATE DEFAULT NULL,
  `category` ENUM('edukasi','anti-FOMO','syariah','pemula','soft selling','CTA') NOT NULL DEFAULT 'edukasi',
  `hook` VARCHAR(500) DEFAULT '',
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `likes` INT UNSIGNED NOT NULL DEFAULT 0,
  `comments` INT UNSIGNED NOT NULL DEFAULT 0,
  `shares` INT UNSIGNED NOT NULL DEFAULT 0,
  `dms` INT UNSIGNED NOT NULL DEFAULT 0,
  `leads` INT UNSIGNED NOT NULL DEFAULT 0,
  `registrants` INT UNSIGNED NOT NULL DEFAULT 0,
  `notes` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_perf_user` (`user_id`),
  CONSTRAINT `fk_perf_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 6. Calendar Items
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `calendar_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `planned_date` DATE NOT NULL,
  `platform` ENUM('TikTok','Instagram Reels','YouTube Shorts') NOT NULL DEFAULT 'TikTok',
  `theme` VARCHAR(255) NOT NULL DEFAULT '',
  `title` VARCHAR(255) NOT NULL,
  `cta` VARCHAR(500) DEFAULT '',
  `production_status` ENUM('ide','script','ready','posted') NOT NULL DEFAULT 'ide',
  `notes` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cal_user` (`user_id`),
  KEY `idx_cal_date` (`planned_date`),
  CONSTRAINT `fk_cal_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 7. Checklist Items
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `checklist_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `checklist_date` DATE NOT NULL,
  `item_key` VARCHAR(50) NOT NULL,
  `item_label` VARCHAR(255) NOT NULL,
  `is_done` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_checklist_item` (`user_id`, `checklist_date`, `item_key`),
  KEY `idx_checklist_date` (`checklist_date`),
  CONSTRAINT `fk_checklist_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 8. Assets Library
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `assets_library` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `asset_type` VARCHAR(50) NOT NULL DEFAULT 'lainnya',
  `content` TEXT NOT NULL,
  `notes` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assets_user` (`user_id`),
  KEY `idx_assets_type` (`asset_type`),
  CONSTRAINT `fk_assets_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- 9. Templates
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `templates` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `template_type` ENUM('whatsapp','cta','caption','hook','script','disclaimer','idea') NOT NULL DEFAULT 'hook',
  `title` VARCHAR(255) NOT NULL DEFAULT '',
  `content` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tpl_user` (`user_id`),
  KEY `idx_tpl_type` (`template_type`),
  CONSTRAINT `fk_tpl_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
