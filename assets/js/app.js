/**
 * UAVs Meet Embodied Intelligence - App Coordinator & Router
 * Manages two-level application state:
 * Level 1: Aristide-style Category Landing
 * Level 2: Flying Intelligence Recent Research Paper Gallery
 */

const App = (function () {
  let galleryView = null;

  const CATEGORY_NAMES = {
    'embodied-perception': 'Embodied Perception',
    'embodied-navigation': 'Embodied Navigation',
    'embodied-planning': 'Embodied Planning',
    'embodied-manipulation': 'Embodied Manipulation',
    'embodied-collaboration': 'Embodied Collaboration'
  };

  function init() {
    galleryView = document.getElementById('paper-gallery-view');

    // 1. Initialize Interactive Grid Canvas
    InteractiveGrid.init('interactive-grid');
    MountainScene.init();

    // 2. Initialize Category Landing
    CategoryLanding.init();

    // 3. Initialize Research Gallery Engine
    ResearchGallery.init({
      stageId: 'research-airspace-stage',
      statusId: 'gallery-counter'
    });

    // 4. Bind Back to Categories Button
    const backBtn = document.getElementById('btn-back-categories');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        CategoryLanding.returnToLanding();
      });
    }

    console.log('UAVs Meet Embodied Intelligence App initialized.');
  }

  function showPaperGallery(categorySlug) {
    if (!galleryView) return;
    const catTitle = CATEGORY_NAMES[categorySlug] || 'Embodied Intelligence';

    ResearchGallery.loadCategory(categorySlug, catTitle);

    galleryView.classList.remove('is-hidden');
    galleryView.style.opacity = '0';
    setTimeout(() => {
      galleryView.style.opacity = '1';
    }, 40);
  }

  function hidePaperGallery() {
    if (!galleryView) return;
    galleryView.classList.add('is-hidden');
  }

  return {
    init: init,
    showPaperGallery: showPaperGallery,
    hidePaperGallery: hidePaperGallery
  };
})();

document.addEventListener('DOMContentLoaded', App.init);
