// js/module-loader.js
function loadModules(modules, container) {
  Promise.all(
    modules.map(module => 
      fetch(module).then(r => {
        if (!r.ok) throw new Error(`Failed to load ${module}`);
        return r.text();
      })
    )
  )
  .then(htmlStrings => {
    htmlStrings.forEach(html => {
      const div = document.createElement('div');
      div.innerHTML = html;
      while (div.firstChild) {
        container.appendChild(div.firstChild);
      }
    });
    
    // Inisialisasi plugin/event setelah semua DOM dirakit
    if (window.lucide) lucide.createIcons();
    document.dispatchEvent(new Event('modulesLoaded'));
  })
  .catch(err => {
    console.error('Module Loader Error:', err);
  });
}
