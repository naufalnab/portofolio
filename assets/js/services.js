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

    /**
     * Konversi jumlah hari menjadi label Bahasa Indonesia yang manusiawi.
     *
     * @param {number} days - integer positif (>= 1)
     * @returns {string}
     */
    function formatTimeline(days) {
        if (days < 7) {
            return days + ' hari';
        }
        if (days % 7 === 0 && days < 28) {
            return (days / 7) + ' minggu';
        }
        if (days >= 28 && days % 30 === 0) {
            return (days / 30) + ' bulan';
        }
        return '~' + Math.round(days / 7) + ' minggu';
    }

    /**
     * Attach click listener ke setiap tombol [data-cta="service"].
     * Idempotent — aman dipanggil ulang.
     *
     * @param {Document|HTMLElement} root
     * @returns {void}
     */
    function initServiceCtaHandlers(root) {
        var buttons = root.querySelectorAll('[data-cta="service"]');
        buttons.forEach(function (btn) {
            // Idempotency guard — skip jika sudah pernah di-attach
            if (btn.dataset.ctaAttached === 'true') return;

            btn.addEventListener('click', function (event) {
                event.preventDefault();

                var service = btn.dataset.service;
                var tier = btn.dataset.tier;
                var price = btn.dataset.price;

                // Validasi data attributes — fallback ke nomor WA langsung jika ada yang kosong
                if (!service || !tier || !price) {
                    console.warn('[services] Missing data attributes on CTA', btn);
                    window.open(
                        'https://wa.me/' + WHATSAPP_PHONE,
                        '_blank',
                        'noopener,noreferrer'
                    );
                    return;
                }

                var url = buildWaUrl(WHATSAPP_PHONE, service, tier, price);
                var opened = window.open(url, '_blank', 'noopener,noreferrer');

                // Popup-blocker fallback
                if (opened === null) {
                    window.location.href = url;
                }
            });

            btn.dataset.ctaAttached = 'true';
        });
    }

    // Expose untuk testing
    window.__services = {
        buildWaUrl: buildWaUrl,
        formatTimeline: formatTimeline,
        initServiceCtaHandlers: initServiceCtaHandlers
    };

    initServiceCtaHandlers(document);

})();
