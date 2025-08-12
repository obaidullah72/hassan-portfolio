/* ===== Auto slider (unique namespace: tnAuto) ===== */
(function () {
  const root = document.documentElement;
  const slider = document.querySelector('[data-tn-slider]');
  if (!slider) return;

  const track = slider.querySelector('.tn-track');
  const cards = Array.from(track.children);
  const dotsWrap = document.querySelector('[data-tn-dots]');

  let index = 0;            // leftmost visible card
  let timer = null;
  const INTERVAL = 3000;    // 3s autoplay

  function perView() {
    const v = getComputedStyle(root).getPropertyValue('--tn-perView').trim();
    return Math.max(1, parseInt(v || '1', 10));
  }
  function pages() { return Math.max(1, Math.ceil(cards.length / perView())); }

  function makeDots() {
    const p = pages();
    dotsWrap.innerHTML = '';
    for (let i = 0; i < p; i++) {
      const b = document.createElement('button');
      b.className = 'tn-dot' + (i === Math.floor(index / perView()) ? ' tn-dot--active' : '');
      b.setAttribute('role', 'tab');
      b.addEventListener('click', () => { stop(); goTo(i * perView()); start(); });
      dotsWrap.appendChild(b);
    }
  }

  function clampLoop(i) {
    const maxStart = cards.length - perView();
    if (i > maxStart) return 0;      // loop to start
    if (i < 0) return maxStart;      // loop to end (if ever needed)
    return i;
  }

  function goTo(i) {
    index = clampLoop(i);
    const offset = cards[index].offsetLeft - cards[0].offsetLeft;
    track.style.transform = `translateX(-${offset}px)`;
    makeDots();
  }

  function next() { goTo(index + 1); }

function start() {
  stop();
  timer = setInterval(next, INTERVAL);
}
function stop() {
  if (timer) { clearInterval(timer); timer = null; }
}

// Pause on hover (so user can enjoy hover effects)
slider.addEventListener('mouseenter', stop);
slider.addEventListener('mouseleave', start);

// Keep the current page on resize
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => goTo(Math.floor(index / perView()) * perView()), 80);
});

// Init
makeDots();
goTo(0);
start();

// Optional: pause when tab hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop(); else start();
});
})();
