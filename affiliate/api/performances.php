<?php
/**
 * Content Performances CRUD API
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
            $stmt = $db->prepare('SELECT * FROM content_performances WHERE user_id = ? ORDER BY post_date DESC, created_at DESC');
            $stmt->execute([$uid]);
            response_json(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'create':
            $missing = validateRequired(['content_name'], $data);
            if ($missing) response_json(['success' => false, 'message' => 'Nama konten wajib diisi.'], 400);

            $stmt = $db->prepare('INSERT INTO content_performances (user_id, content_name, platform, post_date, category, hook, views, likes, comments, shares, dms, leads, registrants, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $uid,
                getStr($data, 'content_name'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'post_date') ?: date('Y-m-d'),
                getStr($data, 'category', 'edukasi'),
                getStr($data, 'hook'),
                getInt($data, 'views'),
                getInt($data, 'likes'),
                getInt($data, 'comments'),
                getInt($data, 'shares'),
                getInt($data, 'dms'),
                getInt($data, 'leads'),
                getInt($data, 'registrants'),
                getStr($data, 'notes'),
            ]);
            response_json(['success' => true, 'message' => 'Performa berhasil disimpan.', 'id' => $db->lastInsertId()]);
            break;

        case 'update':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('UPDATE content_performances SET content_name=?, platform=?, post_date=?, category=?, hook=?, views=?, likes=?, comments=?, shares=?, dms=?, leads=?, registrants=?, notes=? WHERE id=? AND user_id=?');
            $stmt->execute([
                getStr($data, 'content_name'),
                getStr($data, 'platform', 'TikTok'),
                getStr($data, 'post_date') ?: null,
                getStr($data, 'category', 'edukasi'),
                getStr($data, 'hook'),
                getInt($data, 'views'),
                getInt($data, 'likes'),
                getInt($data, 'comments'),
                getInt($data, 'shares'),
                getInt($data, 'dms'),
                getInt($data, 'leads'),
                getInt($data, 'registrants'),
                getStr($data, 'notes'),
                $id,
                $uid,
            ]);
            response_json(['success' => true, 'message' => 'Performa berhasil diperbarui.']);
            break;

        case 'delete':
            $id = getInt($data, 'id');
            if (!$id) response_json(['success' => false, 'message' => 'ID tidak valid.'], 400);

            $stmt = $db->prepare('DELETE FROM content_performances WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $uid]);
            response_json(['success' => true, 'message' => 'Data performa berhasil dihapus.']);
            break;

        case 'reset':
            $stmt = $db->prepare('DELETE FROM content_performances WHERE user_id = ?');
            $stmt->execute([$uid]);
            response_json(['success' => true, 'message' => 'Semua data performa berhasil direset.']);
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
