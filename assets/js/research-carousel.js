/**
 * UAVs Meet Embodied Intelligence - Research Carousel Controller
 * Manages 3D carousel stage, slide transitions, keyboard/touch/mouse controls,
 * category counter synchronization, and side-card click activations.
 */

const ResearchCarousel = (function () {
  let papers = [];
  let currentIndex = 0;
  let stageEl = null;
  let currentCounterEl = null;
  let totalCounterEl = null;
  let cardElements = [];

  // Drag & Swipe gesture state
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  /**
   * Initialize the Carousel for a specific dataset
   * @param {Object} options Configuration options
   */
  function init(options) {
    papers = options.papers || [];
    stageEl = document.getElementById(options.stageId || 'carousel-stage');
    currentCounterEl = document.getElementById(options.currentCounterId || 'counter-current');
    totalCounterEl = document.getElementById(options.totalCounterId || 'counter-total');
    currentIndex = 0;

    if (!stageEl || papers.length === 0) {
      console.warn('Carousel stage element not found or papers data is empty.');
      return;
    }

    renderCards();
    updateStagePositions();
    bindEvents();
  }

  /**
   * Render all paper cards into the stage DOM
   */
  function renderCards() {
    stageEl.innerHTML = '';
    cardElements = [];

    papers.forEach((paper, idx) => {
      const cardEl = PaperDetail.createCardElement(paper, idx, papers.length);
      stageEl.appendChild(cardEl);
      cardElements.push(cardEl);

      // Clicking preview side cards switches active item
      cardEl.addEventListener('click', function (e) {
        if (cardEl.classList.contains('card-left')) {
          e.stopPropagation();
          prev();
        } else if (cardEl.classList.contains('card-right')) {
          e.stopPropagation();
          next();
        }
      });
    });

    if (totalCounterEl) {
      totalCounterEl.textContent = PaperDetail.padZero(papers.length);
    }
  }

  /**
   * Update CSS classes and layout positions based on currentIndex
   */
  function updateStagePositions() {
    const total = papers.length;
    if (total === 0) return;

    // Zero-based wrapped positions
    const leftIdx = (currentIndex - 1 + total) % total;
    const rightIdx = (currentIndex + 1) % total;

    cardElements.forEach((card, idx) => {
      // Unflip card if leaving center
      if (idx !== currentIndex) {
        PaperDetail.flipCard(card, false);
      }

      card.classList.remove('card-center', 'card-left', 'card-right', 'card-hidden');

      if (idx === currentIndex) {
        card.classList.add('card-center');
      } else if (idx === leftIdx && total > 1) {
        card.classList.add('card-left');
      } else if (idx === rightIdx && total > 2) {
        card.classList.add('card-right');
      } else {
        card.classList.add('card-hidden');
      }
    });

    // Update Category Counter
    if (currentCounterEl) {
      currentCounterEl.textContent = PaperDetail.padZero(currentIndex + 1);
    }
  }

  /**
   * Navigate to next paper
   */
  function next() {
    if (papers.length <= 1) return;
    currentIndex = (currentIndex + 1) % papers.length;
    updateStagePositions();
  }

  /**
   * Navigate to previous paper
   */
  function prev() {
    if (papers.length <= 1) return;
    currentIndex = (currentIndex - 1 + papers.length) % papers.length;
    updateStagePositions();
  }

  /**
   * Navigate to a specific index
   */
  function goTo(index) {
    if (index >= 0 && index < papers.length) {
      currentIndex = index;
      updateStagePositions();
    }
  }

  /**
   * Bind global controls (Buttons, Keyboard, Pointer drag, Touch swipe)
   */
  function bindEvents() {
    // Nav buttons
    const prevBtn = document.getElementById('carousel-btn-prev');
    const nextBtn = document.getElementById('carousel-btn-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', prev);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', next);
    }

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'Escape') {
        // Close / flip back center card on ESC
        const centerCard = cardElements[currentIndex];
        if (centerCard && centerCard.classList.contains('is-flipped')) {
          PaperDetail.flipCard(centerCard, false);
        }
      }
    });

    // Touch Swipe Gestures
    stageEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stageEl.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });

    // Mouse Drag Gestures
    stageEl.addEventListener('mousedown', function (e) {
      // Only initiate drag on empty stage area or preview cards, not on interactive links
      if (e.target.closest('a, button, .first-badge-container, .card-back')) return;
      isDragging = true;
      touchStartX = e.clientX;
    });

    window.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      touchEndX = e.clientX;
      handleGesture();
    });

    function handleGesture() {
      const diff = touchEndX - touchStartX;
      const threshold = 45;
      if (diff > threshold) {
        prev();
      } else if (diff < -threshold) {
        next();
      }
    }
  }

  return {
    init: init,
    next: next,
    prev: prev,
    goTo: goTo,
    getCurrentIndex: function () { return currentIndex; }
  };
})();
