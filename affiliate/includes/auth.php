<?php
/**
 * Authentication Helper
 * CryptoSharia Affiliate Command Center
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && $_SESSION['user_id'] > 0;
}

/**
 * Get current logged-in user ID
 */
function getCurrentUserId() {
    return isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
}

/**
 * Get current user display name
 */
function getCurrentUserName() {
    return isset($_SESSION['display_name']) ? $_SESSION['display_name'] : '';
}

/**
 * Require login — redirect to login.php if not authenticated
 */
function requireLogin() {
    if (!isLoggedIn()) {
        // If this is an API request, return JSON error
        if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Unauthorized. Please login.']);
            exit;
        }
        // Otherwise redirect
        header('Location: login.php');
        exit;
    }
}

/**
 * Require API login — for API endpoints only
 */
function requireApiLogin() {
    if (!isLoggedIn()) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
        exit;
    }
}
