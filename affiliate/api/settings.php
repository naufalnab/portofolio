<?php
/**
 * Settings API
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

requireApiLogin();

$db = getDB();
$uid = getCurrentUserId();
$data = getJsonBody();
$action = getStr($data, 'action', 'get');

try {
    switch ($action) {

        case 'get':
            $stmt = $db->prepare('SELECT * FROM settings WHERE user_id = ? LIMIT 1');
            $stmt->execute([$uid]);
            $settings = $stmt->fetch();
            if (!$settings) {
                // Return default struct if not found
                $settings = [
                    'promo_code' => 'P-NFL',
                    'affiliate_type' => 'P',
                    'affiliate_initial' => 'NFL',
                    'affiliate_number' => '',
                    'admin_whatsapp' => ''
                ];
            }
            response_json(['success' => true, 'data' => $settings]);
            break;

        case 'update':
            // Check if settings row exists
            $stmt = $db->prepare('SELECT id FROM settings WHERE user_id = ? LIMIT 1');
            $stmt->execute([$uid]);
            $row = $stmt->fetch();

            if ($row) {
                // Update existing
                $stmt = $db->prepare('UPDATE settings SET promo_code=?, affiliate_type=?, affiliate_initial=?, affiliate_number=?, admin_whatsapp=? WHERE user_id=?');
                $stmt->execute([
                    getStr($data, 'promo_code'),
                    getStr($data, 'affiliate_type', 'P'),
                    getStr($data, 'affiliate_initial'),
                    getStr($data, 'affiliate_number'),
                    getStr($data, 'admin_whatsapp'),
                    $uid
                ]);
            } else {
                // Insert new
                $stmt = $db->prepare('INSERT INTO settings (user_id, promo_code, affiliate_type, affiliate_initial, affiliate_number, admin_whatsapp) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([
                    $uid,
                    getStr($data, 'promo_code'),
                    getStr($data, 'affiliate_type', 'P'),
                    getStr($data, 'affiliate_initial'),
                    getStr($data, 'affiliate_number'),
                    getStr($data, 'admin_whatsapp')
                ]);
            }
            response_json(['success' => true, 'message' => 'Pengaturan berhasil disimpan.']);
            break;

        case 'import':
            // Special action to import data from localStorage JSON
            $importType = getStr($data, 'import_type');
            $importData = isset($data['data']) ? $data['data'] : [];
            
            if (empty($importData) || !is_array($importData)) {
                response_json(['success' => false, 'message' => 'Data kosong atau tidak valid.'], 400);
            }

            $db->beginTransaction();
            try {
                if ($importType === 'leads') {
                    $stmt = $db->prepare('INSERT INTO leads (user_id, name, contact, platform, source_content, status, entry_date, follow_up_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
                    foreach ($importData as $item) {
                        $stmt->execute([
                            $uid,
                            getStr($item, 'name', 'Imported Lead'),
                            getStr($item, 'contact'),
                            getStr($item, 'platform', 'TikTok'),
                            getStr($item, 'sourceContent'),
                            getStr($item, 'status', 'baru masuk'),
                            getStr($item, 'entryDate') ?: date('Y-m-d'),
                            getStr($item, 'followUpDate') ?: null,
                            getStr($item, 'notes'),
                        ]);
                    }
                } 
                else if ($importType === 'contents') {
                    $stmt = $db->prepare('INSERT INTO contents (user_id, title, platform, category, hook, script_body, cta, caption, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                    foreach ($importData as $item) {
                        $stmt->execute([
                            $uid,
                            getStr($item, 'title', 'Imported Content'),
                            getStr($item, 'platform', 'TikTok'),
                            getStr($item, 'category', 'edukasi'),
                            getStr($item, 'hook'),
                            getStr($item, 'script'),
                            getStr($item, 'cta'),
                            getStr($item, 'caption'),
                            getStr($item, 'status', 'draft'),
                            getStr($item, 'notes'),
                        ]);
                    }
                }
                else if ($importType === 'performance') {
                    $stmt = $db->prepare('INSERT INTO content_performances (user_id, content_name, platform, post_date, category, hook, views, likes, comments, shares, dms, leads, registrants, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                    foreach ($importData as $item) {
                        $stmt->execute([
                            $uid,
                            getStr($item, 'name', 'Imported Performance'),
                            getStr($item, 'platform', 'TikTok'),
                            getStr($item, 'postDate') ?: null,
                            getStr($item, 'category', 'edukasi'),
                            getStr($item, 'hook'),
                            getInt($item, 'views'),
                            getInt($item, 'likes'),
                            getInt($item, 'comments'),
                            getInt($item, 'shares'),
                            getInt($item, 'dms'),
                            getInt($item, 'leadIn'),
                            getInt($item, 'leadReg'),
                            getStr($item, 'notes'),
                        ]);
                    }
                }
                
                $db->commit();
                response_json(['success' => true, 'message' => 'Import ' . $importType . ' berhasil.']);
            } catch (Exception $e) {
                $db->rollBack();
                response_json(['success' => false, 'message' => 'Error import: ' . $e->getMessage()], 500);
            }
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
