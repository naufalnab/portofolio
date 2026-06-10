<?php
/**
 * Dashboard API — Aggregated stats
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/helpers.php';

requireApiLogin();

$db = getDB();
$uid = getCurrentUserId();

try {
    // Total leads
    $stmt = $db->prepare('SELECT COUNT(*) FROM leads WHERE user_id = ?');
    $stmt->execute([$uid]);
    $totalLeads = (int)$stmt->fetchColumn();

    // Directed leads (sudah diarahkan ke admin, sudah chat admin, sudah daftar)
    $stmt = $db->prepare("SELECT COUNT(*) FROM leads WHERE user_id = ? AND status IN ('sudah diarahkan ke admin','sudah chat admin','sudah daftar')");
    $stmt->execute([$uid]);
    $directed = (int)$stmt->fetchColumn();

    // Registered leads
    $stmt = $db->prepare("SELECT COUNT(*) FROM leads WHERE user_id = ? AND status = 'sudah daftar'");
    $stmt->execute([$uid]);
    $registered = (int)$stmt->fetchColumn();

    // Posted content
    $stmt = $db->prepare("SELECT COUNT(*) FROM contents WHERE user_id = ? AND status = 'posted'");
    $stmt->execute([$uid]);
    $postedContent = (int)$stmt->fetchColumn();

    // Komisi
    $komisi = calcKomisi($registered);

    // Best content (by leads)
    $stmt = $db->prepare('SELECT content_name, platform, leads, registrants, views, hook FROM content_performances WHERE user_id = ? ORDER BY leads DESC LIMIT 1');
    $stmt->execute([$uid]);
    $bestContent = $stmt->fetch();

    // Best CTA content (by registrants)
    $stmt = $db->prepare('SELECT content_name, platform, registrants, hook FROM content_performances WHERE user_id = ? AND registrants > 0 ORDER BY registrants DESC LIMIT 1');
    $stmt->execute([$uid]);
    $bestCTA = $stmt->fetch();

    // Content insights
    $stmt = $db->prepare('SELECT category, SUM(leads) as total_leads FROM content_performances WHERE user_id = ? GROUP BY category ORDER BY total_leads DESC LIMIT 1');
    $stmt->execute([$uid]);
    $bestCategory = $stmt->fetch();

    $stmt = $db->prepare('SELECT platform, SUM(leads) as total_leads FROM content_performances WHERE user_id = ? GROUP BY platform ORDER BY total_leads DESC LIMIT 1');
    $stmt->execute([$uid]);
    $bestPlatform = $stmt->fetch();

    // Performance totals for insights
    $stmt = $db->prepare('SELECT COUNT(*) as total, SUM(views) as total_views, SUM(leads) as total_leads, SUM(registrants) as total_reg FROM content_performances WHERE user_id = ?');
    $stmt->execute([$uid]);
    $perfTotals = $stmt->fetch();

    // Settings
    $stmt = $db->prepare('SELECT * FROM settings WHERE user_id = ? LIMIT 1');
    $stmt->execute([$uid]);
    $settings = $stmt->fetch();

    response_json([
        'success'    => true,
        'data'       => [
            'totalLeads'    => $totalLeads,
            'directed'      => $directed,
            'registered'    => $registered,
            'postedContent' => $postedContent,
            'komisi'        => $komisi,
            'bestContent'   => $bestContent ?: null,
            'bestCTA'       => $bestCTA ?: null,
            'bestCategory'  => $bestCategory ?: null,
            'bestPlatform'  => $bestPlatform ?: null,
            'perfTotals'    => $perfTotals ?: null,
            'settings'      => $settings ?: null,
        ]
    ]);

} catch (PDOException $e) {
    response_json(['success' => false, 'message' => 'Gagal memuat dashboard.'], 500);
}
