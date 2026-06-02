/* Fade-in on scroll using IntersectionObserver */
(function () {
    const items = document.querySelectorAll('.fade-in');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));

    // Make hero immediately visible — it shouldn't wait for scroll
    document.querySelectorAll('.hero .fade-in, .hero-content, .svc-hero .fade-in').forEach(el => {
        el.classList.add('visible');
    });
})();
