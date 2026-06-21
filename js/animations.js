// =============================================================================
// ANIMATIONS.JS — Scroll reveal & rating bars
// =============================================================================

document.addEventListener('modulesLoaded', () => {

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-right');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revObs.observe(el));

  // ---- Rating Bars ----
  const fills = document.querySelectorAll('.rating-fill[data-w]');
  const ratingObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w;
        ratingObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(f => ratingObs.observe(f));

});
