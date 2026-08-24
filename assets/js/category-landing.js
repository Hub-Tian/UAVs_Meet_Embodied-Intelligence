/**
 * UAVs Meet Embodied Intelligence - Level 1 Category Landing Controller
 * Manages Aristide-style panel hover activations (image brightening with constant frame size),
 * cursor image parallax, and cinematic FLIP category transitions.
 */

const CategoryLanding = (function () {
  let landingView = null;
  let groupEl = null;
  let panels = [];
  let morphOverlay = null;
  let isTransitioning = false;
  let activeOriginRect = null;
  let activePanel = null;

  function init() {
    landingView = document.getElementById('category-landing-view');
    groupEl = document.getElementById('category-windows-group');
    panels = Array.from(document.querySelectorAll('.category-panel'));
    morphOverlay = document.getElementById('category-morph-overlay');

    if (!landingView || !groupEl) return;

    bindHoverAndParallax();
    bindClicks();
  }

  function bindHoverAndParallax() {
    groupEl.addEventListener('mouseenter', function () {
      groupEl.classList.add('is-hovered');
    });

    groupEl.addEventListener('mouseleave', function () {
      groupEl.classList.remove('is-hovered');
      panels.forEach(p => {
        p.classList.remove('is-active');
        const img = p.querySelector('.category-panel-media');
        if (img) img.style.transform = 'translate(0px, 0px)';
      });
    });

    panels.forEach(panel => {
      panel.addEventListener('mouseenter', function () {
        panels.forEach(p => p.classList.remove('is-active'));
        panel.classList.add('is-active');
      });

      panel.addEventListener('mousemove', function (e) {
        const rect = panel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        const img = panel.querySelector('.category-panel-media');
        if (img) {
          // Internal image parallax: +/- 8px to 12px
          const moveX = Math.max(-11, Math.min(11, deltaX * 10));
          const moveY = Math.max(-11, Math.min(11, deltaY * 10));
          img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.04)`;
        }
      });

      panel.addEventListener('mouseleave', function () {
        panel.classList.remove('is-active');
        const img = panel.querySelector('.category-panel-media');
        if (img) {
          img.style.transform = 'translate(0px, 0px) scale(1)';
        }
      });
    });
  }

  function bindClicks() {
    panels.forEach(panel => {
      panel.addEventListener('click', function (e) {
        e.stopPropagation();
        const slug = panel.getAttribute('data-category');
        if (!slug || isTransitioning) return;

        openCategoryWithFLIP(panel, slug);
      });
    });
  }

  function openCategoryWithFLIP(panel, slug) {
    isTransitioning = true;
    activePanel = panel;
    activeOriginRect = panel.getBoundingClientRect();

    // Phase A: Press Effect (subtle scale)
    panel.style.transform = 'scale(1.02)';

    // Phase B: Fade out other panels
    panels.forEach(p => {
      if (p !== panel) {
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
      }
    });

    const coverImgSrc = panel.querySelector('img').getAttribute('src');

    // Phase C: Morph Overlay Expansion
    setTimeout(() => {
      if (!morphOverlay) {
        finalizeTransition(slug);
        return;
      }

      morphOverlay.style.display = 'block';
      morphOverlay.style.left = activeOriginRect.left + 'px';
      morphOverlay.style.top = activeOriginRect.top + 'px';
      morphOverlay.style.width = activeOriginRect.width + 'px';
      morphOverlay.style.height = activeOriginRect.height + 'px';
      morphOverlay.style.opacity = '1';
      morphOverlay.innerHTML = `<img src="${coverImgSrc}" alt="" />`;

      // Force layout reflow
      void morphOverlay.offsetWidth;

      // Expand to viewport
      morphOverlay.style.left = '0px';
      morphOverlay.style.top = '0px';
      morphOverlay.style.width = '100vw';
      morphOverlay.style.height = '100vh';
      morphOverlay.style.borderRadius = '0px';
      morphOverlay.style.opacity = '0.92';

      setTimeout(() => {
        finalizeTransition(slug);
      }, 480);
    }, 100);
  }

  function finalizeTransition(slug) {
    landingView.classList.add('is-hidden');
    if (morphOverlay) {
      morphOverlay.style.opacity = '0';
      setTimeout(() => {
        morphOverlay.style.display = 'none';
        morphOverlay.style.borderRadius = '16px';
      }, 300);
    }

    // Switch grid intensity to 0.45 for Paper Gallery
    InteractiveGrid.setIntensity(0.45);

    // Call App to reveal Level 2 Paper Gallery
    App.showPaperGallery(slug);
    isTransitioning = false;
  }

  function returnToLanding() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Reset grid intensity
    InteractiveGrid.setIntensity(1.0);

    // Hide Paper Gallery
    App.hidePaperGallery();

    // Reveal Landing
    landingView.classList.remove('is-hidden');
    landingView.style.opacity = '0';

    setTimeout(() => {
      landingView.style.opacity = '1';
      panels.forEach(p => {
        p.style.opacity = '';
        p.style.transform = '';
      });
      isTransitioning = false;
    }, 50);
  }

  return {
    init: init,
    returnToLanding: returnToLanding
  };
})();
