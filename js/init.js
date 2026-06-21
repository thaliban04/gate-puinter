document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
  // Load modules (partials) into the page
  const modules = [
    'partials/hero.html',
    'partials/background.html',
    'partials/solution.html',
    'partials/persona.html',
    'partials/swot.html',
    'partials/data.html',
    'partials/roadmap.html',
    'partials/eval.html',
    'partials/closing.html'
  ];
  if (typeof loadModules === 'function') {
    loadModules(modules, document.getElementById('mainContent'));
  }

  if (window.mermaid) {
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: 'dark',
      flowchart: { curve: 'linear' }
    });
  }
});

// Jalankan Mermaid secara manual HANYA SETELAH semua partials selesai dimuat
document.addEventListener('modulesLoaded', () => {
  if (window.mermaid) {
    mermaid.run({ querySelector: '.mermaid' }).catch(err => console.error(err));
  }
});
