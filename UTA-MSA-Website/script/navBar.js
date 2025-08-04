// /script/navBar.js
(() => {
  if (window.__navInit) return;
  window.__navInit = true;

  let wired = false; // <-- ensure we only attach once

  function setup() {
    if (wired) return true; // already wired

    const header = document.querySelector('.site-header');
    if (!header) return false;

    const burger = header.querySelector('.hamburger');
    const nav = header.querySelector('.main-nav');
    if (!burger || !nav) return false;

    const closeMenu = () => {
      header.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    };

    burger.addEventListener('click', () => {
      const open = header.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);  // lock/unlock page scroll
      console.log('hamburger clicked, open =', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });


    nav.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    const mq = window.matchMedia('(min-width: 900px)');
    mq.addEventListener('change', e => { if (e.matches) closeMenu(); });

    wired = true;                          // <-- mark wired
    console.log('navBar.js: setup attached ONCE');
    return true;
  }

  // Try now (if markup already present)
  if (setup()) return;

  // Wait for fragment injection to finish
  document.addEventListener('fragments:ready', () => setup(), { once: true });

  // Safety poll (but guarded by `wired`)
  let tries = 0;
  const id = setInterval(() => {
    if (setup() || ++tries > 40) clearInterval(id);
  }, 50);
})();

// Inside your nav setup in navBar.js
document.querySelectorAll('.nav-item.dropdown > .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 900) {
      e.preventDefault(); // prevent navigation on tap
      link.parentElement.classList.toggle('open');
    }
  });
});
