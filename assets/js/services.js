(function () {
    'use strict';

    const WHATSAPP_PHONE = '6282328591004';

    /**
     * Bangun URL WhatsApp dengan pesan prefilled berbahasa Indonesia.
     * Fungsi murni, tidak ada side effect.
     *
     * @param {string} phone   - digit only, panjang 10-15
     * @param {string} service - "website" | "video-ai"
     * @param {string} tier    - "Basic" | "Pro" | "Custom"
     * @param {string} price   - label harga, contoh "Rp 2.500.000"
     * @returns {string} URL absolut https://wa.me/...?text=...
     */
    function buildWaUrl(phone, service, tier, price) {
        var labels = {
            'website': 'Pembuatan Website',
            'video-ai': 'Pembuatan Video AI'
        };
        var serviceLabel = labels[service] || 'Layanan';
        var message =
            'Halo Mas Naufal, saya tertarik dengan paket ' + tier +
            ' untuk layanan ' + serviceLabel +
            ' (' + price + '). Bisa minta info lebih lanjut?';
        return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
    }

    // Expose untuk testing
    window.__services = {
        buildWaUrl: buildWaUrl
    };

})();
