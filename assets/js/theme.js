/* Theme toggle (dark/light) with localStorage persistence */
(function () {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    function applyTheme(isLight) {
        body.classList.toggle('light-mode', isLight);
        if (icon) icon.textContent = isLight ? '🌙' : '☀️';
        if (text) text.textContent = isLight ? 'Dark' : 'Light';
    }

    // Restore saved theme
    try {
        if (localStorage.getItem('theme') === 'light') {
            applyTheme(true);
        }
    } catch (e) { /* localStorage unavailable */ }

    // Expose toggle to inline onclick
    window.toggleTheme = function () {
        const isLight = !body.classList.contains('light-mode');
        applyTheme(isLight);
        try {
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        } catch (e) { /* ignore */ }
    };
})();
