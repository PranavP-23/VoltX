document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loading Screen Removal ---
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            triggerInitialAnimations();
        }, 800);
    }, 2000); // Simulate a 2-second load time

    function triggerInitialAnimations() {
        const heroElements = document.querySelectorAll('#hero .reveal');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 200);
        });
    }

    // --- 2. Dark/Light Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('i');
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const theme = document.body.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // --- 3. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('active');
            
            // If it's a progress bar, animate its width
            if (entry.target.classList.contains('tech-layout')) {
                animateProgressBars();
            }
            
            // If it contains counters, animate them
            if (entry.target.querySelector('.counter')) {
                animateCounters(entry.target);
            }
            
            observer.unobserve(entry.target); // Only animate once
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- 4. Animate Progress Bars ---
    function animateProgressBars() {
        const bars = document.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-target');
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 300); // Slight delay for smooth effect after scroll reveal
        });
    }

    // --- 5. Animated Number Counters ---
    function animateCounters(parentEl) {
        const counters = parentEl.querySelectorAll('.counter');
        const speed = 200; // Lower is slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');
                
                const inc = target / speed;

                if (count < target) {
                    // Format with commas
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
        });
    }

    // --- 6. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 7. Map Popup Modal ---
    const networkMap = document.getElementById('network-map');
    const mapModal = document.getElementById('map-modal');
    const mapModalClose = document.getElementById('map-modal-close');
    const mapModalBackdrop = document.getElementById('map-modal-backdrop');

    function openMapModal() {
        mapModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMapModal() {
        mapModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (networkMap) {
        networkMap.addEventListener('click', openMapModal);
        networkMap.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                openMapModal();
            }
        });
    }

    if (mapModalClose) mapModalClose.addEventListener('click', closeMapModal);
    if (mapModalBackdrop) mapModalBackdrop.addEventListener('click', closeMapModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mapModal.classList.contains('active')) {
            closeMapModal();
        }
    });
});