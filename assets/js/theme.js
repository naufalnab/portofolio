/* Theme toggle (dark/light) with localStorage persistence.
   Target: document.documentElement (<html>) — konsisten dengan anti-FOUC inline
   script di <head> yang menetapkan class tema sebelum paint pertama. */
(function () {
    const root = document.documentElement;

    function applyThemeView(isLight) {
        root.classList.toggle('light-mode', isLight);
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        if (icon) icon.textContent = isLight ? '🌙' : '☀️';
        if (text) text.textContent = isLight ? 'Dark' : 'Light';
    }

    // Sync tombol toggle dengan state tema saat ini. Anti-FOUC inline script
    // sudah menetapkan class di <html> sebelum paint, jadi cukup baca state-nya
    // dan selaraskan ikon/teks (tanpa mengubah class).
    function syncToggleButton() {
        applyThemeView(root.classList.contains('light-mode'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncToggleButton);
    } else {
        syncToggleButton();
    }

    // Expose toggle to inline onclick
    window.toggleTheme = function () {
        const isLight = !root.classList.contains('light-mode');
        applyThemeView(isLight);
        try {
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        } catch (e) { /* localStorage unavailable — default dark, tanpa throw */ }
    };
})();
