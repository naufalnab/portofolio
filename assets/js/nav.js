/* Navbar — adds .scrolled class once page is scrolled past 20px */
(function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function update() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();
