document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate TOC
    const cards = document.querySelectorAll('.reflection-card');
    const tocContainer = document.getElementById('toc');
    const totalItems = cards.length;
    
    cards.forEach((card, index) => {
        const title = card.querySelector('h2').innerText;
        const id = card.getAttribute('data-id');
        
        card.id = `section-${id}`;
        
        const link = document.createElement('a');
        link.href = `#section-${id}`;
        link.className = 'toc-item';
        link.innerText = `${index + 1}. ${title.substring(0, 28)}${title.length > 28 ? '…' : ''}`;
        link.setAttribute('data-target', id);
        
        tocContainer.appendChild(link);
    });

    // 2. Load Progress from LocalStorage
    let progress = JSON.parse(localStorage.getItem('zulfikri_progress') || '[]');
    
    function updateProgressUI() {
        const countSpan = document.getElementById('completed-count');
        const progressBar = document.getElementById('progress-bar');
        
        countSpan.innerText = progress.length;
        progressBar.style.width = `${(progress.length / totalItems) * 100}%`;
        
        cards.forEach(card => {
            const id = parseInt(card.getAttribute('data-id'));
            const tocLink = document.querySelector(`.toc-item[data-target="${id}"]`);
            const btn = card.querySelector('.mark-btn');
            
            if (progress.includes(id)) {
                card.classList.add('completed');
                if(tocLink) tocLink.classList.add('completed');
                btn.innerHTML = `<span style="font-size: 1.2rem;">✓</span> Sudah Dipahami`;
            } else {
                card.classList.remove('completed');
                if(tocLink) tocLink.classList.remove('completed');
                btn.innerHTML = `<span class="icon"></span> Tandai Dipahami`;
            }
        });
    }

    window.toggleRead = function(id) {
        if (progress.includes(id)) {
            progress = progress.filter(item => item !== id);
        } else {
            progress.push(id);
        }
        localStorage.setItem('zulfikri_progress', JSON.stringify(progress));
        updateProgressUI();
    };

    updateProgressUI();

    // 3. ScrollSpy
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const tocObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('data-id');
                document.querySelectorAll('.toc-item').forEach(item => {
                    item.classList.remove('active');
                });
                const activeLink = document.querySelector(`.toc-item[data-target="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }, observerOptions);

    cards.forEach(card => tocObserver.observe(card));

    // 4. Fade In Animations
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in-up').forEach(el => fadeObserver.observe(el));
    
    // Smooth scrolling for TOC links
    document.querySelectorAll('.toc-item').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
