<?php
/**
 * Checklist Items CRUD API
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
            $date = getStr($data, 'date', date('Y-m-d'));
            
            // Check if items exist for this date
            $stmt = $db->prepare('SELECT item_key, is_done FROM checklist_items WHERE user_id = ? AND checklist_date = ?');
            $stmt->execute([$uid, $date]);
            $items = $stmt->fetchAll();
            
            $result = [];
            foreach ($items as $row) {
                $result[$row['item_key']] = (bool)$row['is_done'];
            }
            
            response_json(['success' => true, 'data' => $result]);
            break;

        case 'save':
            $date = getStr($data, 'date', date('Y-m-d'));
            $items = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];
            
            if (empty($items)) {
                response_json(['success' => true, 'message' => 'Tidak ada yang disimpan.']);
            }

            $db->beginTransaction();
            try {
                // Upsert items
                $stmt = $db->prepare('INSERT INTO checklist_items (user_id, checklist_date, item_key, item_label, is_done) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE is_done = VALUES(is_done)');
                
                foreach ($items as $key => $isDone) {
                    $stmt->execute([
                        $uid,
                        $date,
                        $key,
                        $key, // Label is same as key for simplicity, can be mapped if needed
                        $isDone ? 1 : 0
                    ]);
                }
                
                $db->commit();
                response_json(['success' => true, 'message' => 'Checklist tersimpan.']);
            } catch (Exception $e) {
                $db->rollBack();
                throw $e;
            }
            break;

        case 'reset':
            $date = getStr($data, 'date', date('Y-m-d'));
            $stmt = $db->prepare('DELETE FROM checklist_items WHERE user_id = ? AND checklist_date = ?');
            $stmt->execute([$uid, $date]);
            response_json(['success' => true, 'message' => 'Checklist hari ini direset.']);
            break;

        default:
            response_json(['success' => false, 'message' => 'Action tidak dikenal.'], 400);
    }
} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Database error.'], 500);
}
