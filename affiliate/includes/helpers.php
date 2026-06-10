<?php
/**
 * Helper Functions
 * CryptoSharia Affiliate Command Center
 */

/**
 * Send JSON response and exit
 */
function response_json($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Sanitize string for HTML output
 */
function sanitize($str) {
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

/**
 * Get JSON body from POST request
 */
function getJsonBody() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        $data = [];
    }
    return $data;
}

/**
 * Validate required fields exist in data array
 * Returns array of missing field names
 */
function validateRequired($fields, $data) {
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
            $missing[] = $field;
        }
    }
    return $missing;
}

/**
 * Calculate affiliate commission
 * Tier 1: 1-3 registrants = Rp500,000 each
 * Tier 2: 4-5 registrants = Rp750,000 each
 * Tier 3: 6+  registrants = Rp1,000,000 each
 */
function calcKomisi($n) {
    if ($n <= 0) return 0;
    $total = 0;
    $tier1 = min($n, 3);
    $total += $tier1 * 500000;
    if ($n > 3) {
        $tier2 = min($n - 3, 2);
        $total += $tier2 * 750000;
    }
    if ($n > 5) {
        $tier3 = $n - 5;
        $total += $tier3 * 1000000;
    }
    return $total;
}

/**
 * Get string value from data array with default
 */
function getStr($data, $key, $default = '') {
    return isset($data[$key]) ? trim((string)$data[$key]) : $default;
}

/**
 * Get integer value from data array with default
 */
function getInt($data, $key, $default = 0) {
    return isset($data[$key]) ? (int)$data[$key] : $default;
}
