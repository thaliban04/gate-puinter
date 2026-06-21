// =============================================================================
// CHARTS.JS — Konfigurasi Chart.js
// Edit data di sini untuk mengubah isi chart
// =============================================================================

document.addEventListener('modulesLoaded', () => {

  // Defaults global Chart.js
  Chart.defaults.color = '#666';
  Chart.defaults.font.family = 'Outfit';
  Chart.defaults.font.size = 11;

  const gridColor  = 'rgba(255,255,255,0.04)';
  const tickColor  = '#555';

  // ---- 1. Segmentasi Pasar (Doughnut) ----
  const elMarket = document.getElementById('marketChart');
  if (elMarket) {
    new Chart(elMarket, {
      type: 'doughnut',
      data: {
        labels: ['Perumahan', 'Perkantoran', 'Kos & Apartemen', 'Ritel'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
          borderColor: '#0f0f0f',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#888888', padding: 14, font: { size: 11 }, boxWidth: 10, borderRadius: 4 }
          }
        }
      }
    });
  }

  // ---- 2. Proyeksi Pendapatan (Bar) ----
  const elRevenue = document.getElementById('revenueChart');
  if (elRevenue) {
    new Chart(elRevenue, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1\'27', 'Q2\'27'],
        datasets: [{
          label: 'Pendapatan (Juta Rp)',
          data: [0, 5, 18, 42, 75, 120],
          backgroundColor: 'rgba(59,130,246,0.75)',
          borderColor: '#3b82f6',
          borderWidth: 1.5,
          borderRadius: 6,
          hoverBackgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: tickColor } },
          y: { grid: { color: gridColor }, ticks: { color: tickColor } }
        }
      }
    });
  }

});
