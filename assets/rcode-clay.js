/* R•CODE V2.0 — drawer navigasi HP + penanda menu aktif (scroll-spy).
   File TAMBAHAN: tidak mengubah/meng-override logika di rcode-interactions.js atau rcode-header-behavior.js.
   Hanya menyentuh elemen baru (#rcodeMenuBtn, #rcodeDrawer) dan atribut aria-current pada link anchor. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---------- Drawer ---------- */
  const btn = document.getElementById('rcodeMenuBtn');
  const drawer = document.getElementById('rcodeDrawer');
  if (btn && drawer) {
    let lastFocus = null, timer = 0;
    const focusables = () => [...drawer.querySelectorAll('a[href],button:not([disabled])')];

    const open = () => {
      if (!drawer.hidden) return;
      clearTimeout(timer);
      lastFocus = document.activeElement;
      drawer.hidden = false;
      root.classList.add('rcode-lock');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Tutup menu');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        drawer.classList.add('is-open');
        const first = drawer.querySelector('.rcode-drawer-x') || focusables()[0];
        if (first) first.focus();
      }));
    };

    const close = (restoreFocus = true) => {
      if (drawer.hidden) return;
      drawer.classList.remove('is-open');
      root.classList.remove('rcode-lock');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Buka menu');
      const done = () => { drawer.hidden = true; };
      if (reduce) done(); else timer = setTimeout(done, 340);
      if (restoreFocus && lastFocus && lastFocus.focus) lastFocus.focus();
    };

    btn.addEventListener('click', () => (drawer.hidden ? open() : close()));
    drawer.addEventListener('click', e => {
      if (e.target.closest('[data-drawer-close]')) { close(); return; }
      if (e.target.closest('a[href]')) close(false);          // biarkan anchor berjalan normal
    });
    document.addEventListener('keydown', e => {
      if (drawer.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab') {                                   // fokus tidak keluar dari drawer
        const f = focusables(); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', e => { if (e.matches) close(false); });
  }

  /* ---------- Scroll-spy: aria-current pada link menu ---------- */
  const SECTION_TO_LINK = { code: 'code', prompts: 'prompts', zonagreen: 'zonagreen', experiments: null,
    'about-intro': 'about', about: 'about', principles: 'about', contact: 'contact' };
  const sections = Object.keys(SECTION_TO_LINK).map(id => document.getElementById(id)).filter(Boolean);
  const links = [...document.querySelectorAll(
    '.rcode-site-header nav a[href^="#"], nav[aria-label="Menu"] a[href^="#"], .rcode-drawer a[href^="#"]')];
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  const visible = new Set();
  const paint = () => {
    const current = sections.filter(s => visible.has(s.id)).pop();   // seksi terakhir (urutan DOM) yang memotong garis baca
    const target = current ? SECTION_TO_LINK[current.id] : null;
    links.forEach(a => {
      if (target && a.getAttribute('href') === '#' + target) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => en.isIntersecting ? visible.add(en.target.id) : visible.delete(en.target.id));
    paint();
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(s => io.observe(s));
})();
