<?php
/**
 * Calendar Items CRUD API
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

requireApiLogin();

$db = getDB();
$uid = getCurrentUserId();
$data = getJsonBody();
$action = getStr($data, 'action', 'list');

try {
    switch ($action) {

        case 'list':
            $stmt = $db->prepare('SELECT * FROM calendar_items WHERE user_id = ? ORDER BY planned_date ASC');
            $stmt->execute([$uid]);
            response_json(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'create':
            $missing = validateRequired(['title', 'planned_date'], $data);
            if ($missing) response_json(['success' => false, 'message' => 'Judul dan tanggal wajib diisi.'], 400);

            $stmt = $db->prepare('INSERT INTO calendar_items (user_id, planned_date, platform, theme, title, cta, production_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $uid,
                getStr($data, 'planned_date'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'theme'),
                getStr($data, 'title'),
                getStr($data, 'cta'),
                getStr($data, 'production_status', 'ide'),
                getStr($data, 'notes'),
            ]);
            response_json(['success' => true, 'message' => 'Jadwal berhasil ditambahkan.', 'id' => $db->lastInsertId()]);
            break;

        case 'update':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('UPDATE calendar_items SET planned_date=?, platform=?, theme=?, title=?, cta=?, production_status=?, notes=? WHERE id=? AND user_id=?');
            $stmt->execute([
                getStr($data, 'planned_date'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'theme'),
                getStr($data, 'title'),
                getStr($data, 'cta'),
                getStr($data, 'production_status', 'ide'),
                getStr($data, 'notes'),
                $id,
                $uid,
            ]);
            response_json(['success' => true, 'message' => 'Jadwal berhasil diperbarui.']);
            break;

        case 'delete':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('DELETE FROM calendar_items WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $uid]);
            response_json(['success' => true, 'message' => 'Jadwal berhasil dihapus.']);
            break;

        case 'reset':
            $stmt = $db->prepare('DELETE FROM calendar_items WHERE user_id = ?');
            $stmt->execute([$uid]);
            response_json(['success' => true, 'message' => 'Semua jadwal berhasil direset.']);
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
