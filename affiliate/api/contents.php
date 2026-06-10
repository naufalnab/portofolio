<?php
/**
 * Contents CRUD API (Content Studio)
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
            $stmt = $db->prepare('SELECT * FROM contents WHERE user_id = ? ORDER BY created_at DESC');
            $stmt->execute([$uid]);
            response_json(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'create':
            $missing = validateRequired(['title'], $data);
            if ($missing) response_json(['success' => false, 'message' => 'Judul konten wajib diisi.'], 400);

            $stmt = $db->prepare('INSERT INTO contents (user_id, title, platform, category, hook, script_body, cta, caption, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $uid,
                getStr($data, 'title'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'category', 'edukasi'),
                getStr($data, 'hook'),
                getStr($data, 'script_body'),
                getStr($data, 'cta'),
                getStr($data, 'caption'),
                getStr($data, 'status', 'draft'),
                getStr($data, 'notes'),
            ]);
            response_json(['success' => true, 'message' => 'Konten berhasil disimpan.', 'id' => $db->lastInsertId()]);
            break;

        case 'update':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('UPDATE contents SET title=?, platform=?, category=?, hook=?, script_body=?, cta=?, caption=?, status=?, notes=? WHERE id=? AND user_id=?');
            $stmt->execute([
                getStr($data, 'title'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'category', 'edukasi'),
                getStr($data, 'hook'),
                getStr($data, 'script_body'),
                getStr($data, 'cta'),
                getStr($data, 'caption'),
                getStr($data, 'status', 'draft'),
                getStr($data, 'notes'),
                $id,
                $uid,
            ]);
            response_json(['success' => true, 'message' => 'Konten berhasil diperbarui.']);
            break;

        case 'delete':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('DELETE FROM contents WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $uid]);
            response_json(['success' => true, 'message' => 'Konten berhasil dihapus.']);
            break;

        case 'reset':
            $stmt = $db->prepare('DELETE FROM contents WHERE user_id = ?');
            $stmt->execute([$uid]);
            response_json(['success' => true, 'message' => 'Semua konten berhasil direset.']);
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
