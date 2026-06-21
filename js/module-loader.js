// js/module-loader.js
function loadModules(modules, container) {
  const load = i => {
    if (i >= modules.length) {
      if (window.lucide) lucide.createIcons();
      document.dispatchEvent(new Event('modulesLoaded'));
      return;
    }
    fetch(modules[i])
      .then(r => r.text())
      .then(html => {
        const div = document.createElement('div');
        div.innerHTML = html;
        while (div.firstChild) {
          container.appendChild(div.firstChild);
        }
        load(i + 1);
      })
      .catch(err => {
        console.error('Failed to load partial:', modules[i], err);
        load(i + 1);
      });
  };
  load(0);
}
