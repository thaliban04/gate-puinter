// Progress bar
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
});

// Hamburger / Sidebar
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});
overlay.addEventListener('click', () => {
  hamburger.classList.remove('open');
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

// Active nav on scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// Close sidebar on nav click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
});

// Scroll animations
const animEls = document.querySelectorAll('.animate-in, .animate-in-right');
const animObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.15 });
animEls.forEach(el => animObs.observe(el));

// Rating bars animation
const ratingObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.rating-fill').forEach(bar => {
        bar.style.width = bar.style.getPropertyValue('--w') || bar.getAttribute('style').match(/--w:([\d%]+)/)?.[1] || '0%';
      });
    }
  });
}, { threshold: 0.3 });
const ratingSection = document.querySelector('.rating-section');
if (ratingSection) ratingObs.observe(ratingSection);

// Fix rating bar CSS var animation
document.querySelectorAll('.rating-fill').forEach(bar => {
  const w = getComputedStyle(bar).getPropertyValue('--w').trim();
  bar.style.setProperty('--w', w);
  // Reset to 0 initially
  bar.style.width = '0%';
  // Trigger on scroll
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => { bar.style.width = w; }, 200);
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(bar);
});

// CHARTS
window.addEventListener('load', () => {
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#a0a0b0', font: { family: 'Inter', size: 11 } } } }
  };

  // Market Segmentation - Doughnut
  new Chart(document.getElementById('marketChart'), {
    type: 'doughnut',
    data: {
      labels: ['Perumahan Pribadi', 'Perkantoran B2B', 'Kos & Apartemen', 'Ritel & Toko'],
      datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['#6c63ff', '#38bdf8', '#a78bfa', '#22c55e'],
        borderColor: '#16161f', borderWidth: 3
      }]
    },
    options: { ...chartDefaults }
  });

  // Revenue Projection - Bar
  new Chart(document.getElementById('revenueChart'), {
    type: 'bar',
    data: {
      labels: ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027'],
      datasets: [{
        label: 'Pendapatan (Juta Rp)',
        data: [0, 5, 18, 42, 75, 120],
        backgroundColor: 'rgba(108,99,255,0.7)',
        borderColor: '#6c63ff', borderWidth: 2, borderRadius: 8
      }]
    },
    options: {
      ...chartDefaults,
      scales: {
        x: { ticks: { color: '#6b6b80' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#6b6b80' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });

  // Competitor - Radar
  new Chart(document.getElementById('competitorChart'), {
    type: 'radar',
    data: {
      labels: ['Harga', 'Keamanan', 'Kemudahan', 'Fitur App', 'Daya Tahan', 'Dukungan Lokal'],
      datasets: [
        {
          label: 'FinGate',
          data: [80, 95, 88, 90, 82, 95],
          backgroundColor: 'rgba(108,99,255,0.2)', borderColor: '#6c63ff', pointBackgroundColor: '#6c63ff'
        },
        {
          label: 'Kompetitor Import',
          data: [70, 75, 72, 80, 70, 30],
          backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#ef4444', pointBackgroundColor: '#ef4444'
        }
      ]
    },
    options: {
      ...chartDefaults,
      scales: {
        r: {
          ticks: { color: '#6b6b80', backdropColor: 'transparent' },
          grid: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { color: '#a0a0b0', font: { size: 11 } }
        }
      }
    }
  });

  // Survey - Horizontal Bar
  new Chart(document.getElementById('surveyChart'), {
    type: 'bar',
    data: {
      labels: ['Keamanan Lebih Baik', 'Tidak Perlu Kunci', 'Praktis & Modern', 'Monitoring via HP', 'Harga Terjangkau'],
      datasets: [{
        label: '% Responden',
        data: [88, 76, 71, 65, 58],
        backgroundColor: ['#6c63ff','#a78bfa','#38bdf8','#22c55e','#f97316'],
        borderRadius: 8
      }]
    },
    options: {
      ...chartDefaults,
      indexAxis: 'y',
      scales: {
        x: { ticks: { color: '#6b6b80' }, grid: { color: 'rgba(255,255,255,0.04)' }, max: 100 },
        y: { ticks: { color: '#6b6b80' }, grid: { display: false } }
      }
    }
  });
});
