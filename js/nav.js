// =============================================================================
// NAV.JS — Sidebar toggle, scroll spy, progress bar, theme toggle
// =============================================================================

// ---- Theme Toggle (di luar modulesLoaded agar langsung berjalan) ----
(function() {
  const html = document.documentElement;
  const stored = localStorage.getItem('fingate-theme');
  // Default: ikuti preferensi sistem, fallback ke dark
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = stored || (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', initialTheme);
})();

document.addEventListener('modulesLoaded', () => {

  // ---- Progress Bar ----
  const bar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100) + '%';
  }, { passive: true });

  // ---- Hamburger & Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('show');
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on nav click (mobile)
  document.querySelectorAll('.mobile-menu .nav-item a').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileMenu.classList.contains('show')) toggleMenu();
    });
  });

  // ---- Scroll Spy ----
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-item a');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        // Select both desktop and mobile links
        const links = document.querySelectorAll(`.nav-item a[href="#${entry.target.id}"]`);
        links.forEach(link => link.classList.add('active'));
      }
    });
  }, { rootMargin: '-72px 0px -60% 0px' }); // Offset for 72px navbar

  sections.forEach(s => spy.observe(s));

  // ---- Theme Toggle ----
  const themeBtn  = document.getElementById('themeToggle');
  const iconMoon  = document.getElementById('iconMoon');
  const iconSun   = document.getElementById('iconSun');
  const html      = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('fingate-theme', theme);

    if (theme === 'light') {
      iconMoon.style.display = 'none';
      iconSun.style.display  = 'block';
    } else {
      iconMoon.style.display = 'block';
      iconSun.style.display  = 'none';
    }

    // Update Chart.js colors if charts exist
    if (window.Chart) {
      const isDark = theme === 'dark';
      const tickCol  = isDark ? '#555555' : '#888888';
      const gridCol  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
      const textCol  = isDark ? '#888888' : '#555555';
      Chart.defaults.color = textCol;
      // Re-render all existing charts
      Object.values(Chart.instances).forEach(chart => {
        chart.options.scales?.x && (chart.options.scales.x.ticks.color = tickCol);
        chart.options.scales?.x && (chart.options.scales.x.grid.color  = gridCol);
        chart.options.scales?.y && (chart.options.scales.y.ticks.color = tickCol);
        chart.options.scales?.y && (chart.options.scales.y.grid.color  = gridCol);
        if (chart.options.plugins?.legend?.labels) {
          chart.options.plugins.legend.labels.color = textCol;
        }
        chart.update('none'); // update tanpa animasi
      });
    }
  }

  // Sinkronisasi ikon dengan tema yang sudah di-set saat load
  applyTheme(html.getAttribute('data-theme') || 'dark');

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

});

