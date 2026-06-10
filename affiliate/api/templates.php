<?php
/**
 * Templates CRUD API
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
                $stmt = $db->prepare('SELECT * FROM templates WHERE user_id = ? AND template_type = ? ORDER BY created_at ASC');
                $stmt->execute([$uid, $type]);
            } else {
                $stmt = $db->prepare('SELECT * FROM templates WHERE user_id = ? ORDER BY template_type ASC, created_at ASC');
                $stmt->execute([$uid]);
            }
            response_json(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'create':
            $missing = validateRequired(['template_type', 'content'], $data);
            if ($missing) response_json(['success' => false, 'message' => 'Tipe dan isi template wajib diisi.'], 400);

            $stmt = $db->prepare('INSERT INTO templates (user_id, template_type, title, content) VALUES (?, ?, ?, ?)');
            $stmt->execute([
                $uid,
                getStr($data, 'template_type'),
                getStr($data, 'title'),
                getStr($data, 'content'),
            ]);
            response_json(['success' => true, 'message' => 'Template berhasil ditambahkan.', 'id' => $db->lastInsertId()]);
            break;

        case 'update':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('UPDATE templates SET template_type=?, title=?, content=? WHERE id=? AND user_id=?');
            $stmt->execute([
                getStr($data, 'template_type'),
                getStr($data, 'title'),
                getStr($data, 'content'),
                $id,
                $uid,
            ]);
            response_json(['success' => true, 'message' => 'Template berhasil diperbarui.']);
            break;

        case 'delete':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('DELETE FROM templates WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $uid]);
            response_json(['success' => true, 'message' => 'Template berhasil dihapus.']);
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
