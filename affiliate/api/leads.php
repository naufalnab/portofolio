<?php
/**
 * Leads CRUD API
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
            $stmt = $db->prepare('SELECT * FROM leads WHERE user_id = ? ORDER BY created_at DESC');
            $stmt->execute([$uid]);
            $rows = $stmt->fetchAll();
            response_json(['success' => true, 'data' => $rows]);
            break;

        case 'create':
            $missing = validateRequired(['name'], $data);
            if ($missing) {
                response_json(['success' => false, 'message' => 'Nama lead wajib diisi.'], 400);
            }
            $stmt = $db->prepare('INSERT INTO leads (user_id, name, contact, platform, source_content, status, entry_date, follow_up_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $uid,
                getStr($data, 'name'),
                getStr($data, 'contact'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'source_content'),
                getStr($data, 'status', 'baru masuk'),
                getStr($data, 'entry_date') ?: date('Y-m-d'),
                getStr($data, 'follow_up_date') ?: null,
                getStr($data, 'notes'),
            ]);
            $newId = $db->lastInsertId();
            response_json(['success' => true, 'message' => 'Lead berhasil ditambahkan.', 'id' => $newId]);
            break;

        case 'update':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('UPDATE leads SET name=?, contact=?, platform=?, source_content=?, status=?, entry_date=?, follow_up_date=?, notes=? WHERE id=? AND user_id=?');
            $stmt->execute([
                getStr($data, 'name'),
                getStr($data, 'contact'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'source_content'),
                getStr($data, 'status', 'baru masuk'),
                getStr($data, 'entry_date') ?: null,
                getStr($data, 'follow_up_date') ?: null,
                getStr($data, 'notes'),
                $id,
                $uid,
            ]);
            response_json(['success' => true, 'message' => 'Lead berhasil diperbarui.']);
            break;

        case 'delete':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('DELETE FROM leads WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $uid]);
            response_json(['success' => true, 'message' => 'Lead berhasil dihapus.']);
            break;

        case 'reset':
            $stmt = $db->prepare('DELETE FROM leads WHERE user_id = ?');
            $stmt->execute([$uid]);
            response_json(['success' => true, 'message' => 'Semua lead berhasil direset.']);
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
