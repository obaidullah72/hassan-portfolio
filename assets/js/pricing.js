/* Reveal-on-scroll using IntersectionObserver with a small stagger */
(function () {
    const items = Array.from(document.querySelectorAll('.pp-reveal'));
    if (!items.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { items.forEach(el => el.classList.add('pp-in')); return; }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Stagger by index for a nice cascade
                const i = items.indexOf(el);
                el.style.transitionDelay = (i * 80) + 'ms';
                el.classList.add('pp-in');
                io.unobserve(el);
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    items.forEach(el => io.observe(el));
})();
