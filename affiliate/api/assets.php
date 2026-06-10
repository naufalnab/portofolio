<?php
/**
 * Assets Library CRUD API
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
            $type = getStr($data, 'type');
            if ($type) {
                $stmt = $db->prepare('SELECT * FROM assets_library WHERE user_id = ? AND asset_type = ? ORDER BY created_at DESC');
                $stmt->execute([$uid, $type]);
            } else {
                $stmt = $db->prepare('SELECT * FROM assets_library WHERE user_id = ? ORDER BY asset_type ASC, created_at DESC');
                $stmt->execute([$uid]);
            }
            response_json(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'create':
            $missing = validateRequired(['asset_type', 'content'], $data);
            if ($missing) response_json(['success' => false, 'message' => 'Tipe dan isi asset wajib diisi.'], 400);

            $stmt = $db->prepare('INSERT INTO assets_library (user_id, asset_type, content, notes) VALUES (?, ?, ?, ?)');
            $stmt->execute([
                $uid,
                getStr($data, 'asset_type'),
                getStr($data, 'content'),
                getStr($data, 'notes'),
            ]);
            response_json(['success' => true, 'message' => 'Asset berhasil ditambahkan.', 'id' => $db->lastInsertId()]);
            break;

        case 'delete':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('DELETE FROM assets_library WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $uid]);
            response_json(['success' => true, 'message' => 'Asset berhasil dihapus.']);
            break;

        case 'reset':
            $type = getStr($data, 'type');
            if ($type) {
                $stmt = $db->prepare('DELETE FROM assets_library WHERE user_id = ? AND asset_type = ?');
                $stmt->execute([$uid, $type]);
            } else {
                $stmt = $db->prepare('DELETE FROM assets_library WHERE user_id = ?');
                $stmt->execute([$uid]);
            }
            response_json(['success' => true, 'message' => 'Asset berhasil direset.']);
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
