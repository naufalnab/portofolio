/* Expand/collapse toggles for certifications and clients sections */
(function () {
    window.toggleCerts = function () {
        const extra = document.getElementById('cert-extra');
        const text = document.getElementById('cert-toggle-text');
        const arrow = document.getElementById('cert-toggle-arrow');
        if (!extra || !text || !arrow) return;
        const isOpen = extra.classList.toggle('open');
        text.textContent = isOpen ? 'Show less' : 'View all certifications';
        arrow.textContent = isOpen ? '↑' : '↓';
    };

    window.toggleClients = function () {
        const extra = document.getElementById('clients-extra');
        const btn = document.getElementById('clients-toggle-btn');
        const text = document.getElementById('clients-toggle-text');
        const arrow = document.getElementById('clients-toggle-arrow');
        if (!extra || !btn || !text || !arrow) return;
        const isHidden = extra.hasAttribute('hidden');
        if (isHidden) {
            extra.removeAttribute('hidden');
            btn.setAttribute('aria-expanded', 'true');
            text.textContent = 'Show less';
            arrow.textContent = '↑';
        } else {
            extra.setAttribute('hidden', '');
            btn.setAttribute('aria-expanded', 'false');
            text.textContent = 'View all 14 clients';
            arrow.textContent = '↓';
        }
    };
})();
