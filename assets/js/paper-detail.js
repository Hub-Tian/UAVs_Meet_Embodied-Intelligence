/**
 * UAVs Meet Embodied Intelligence - Paper Detail & 3D Card Face Renderer
 * Handles DOM generation, conditional rendering (★ FIRST, CODE/PAPER buttons),
 * and 3D card flip interactions.
 */

const PaperDetail = (function () {
  /**
   * Helper to format zero-padded index (e.g. 1 -> "01")
   */
  function padZero(num) {
    return String(num).padStart(2, '0');
  }

  /**
   * Escape HTML entities safely
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Create the complete 3D Card DOM element for a paper
   * @param {Object} paper Paper data object
   * @param {number} index 0-based index
   * @param {number} total Total papers in category
   */
  function createCardElement(paper, index, total) {
    const cardEl = document.createElement('div');
    cardEl.className = 'paper-card';
    cardEl.id = `paper-card-${paper.id}`;
    cardEl.setAttribute('data-id', paper.id);
    cardEl.setAttribute('data-index', index);

    const currentFormatted = padZero(index + 1);
    const totalFormatted = padZero(total);

    // Publication display
    const venueYear = paper.venue && paper.year ? `${paper.venue} · ${paper.year}` : (paper.venue || paper.year || '');

    // Authors rendering with et al. truncation if long
    let authorsDisplay = '';
    if (Array.isArray(paper.authors) && paper.authors.length > 0) {
      if (paper.authors.length > 4) {
        authorsDisplay = `<span class="author-names" title="${escapeHtml(paper.authors.join(', '))}">` +
          escapeHtml(paper.authors.slice(0, 3).join(', ')) + ' et al.</span>';
      } else {
        authorsDisplay = `<span class="author-names">` + escapeHtml(paper.authors.join(', ')) + `</span>`;
      }
    }

    // Task tags HTML
    const taskTagsHtml = (paper.taskTags || []).map(t =>
      `<span class="tag-chip task-tag">${escapeHtml(t)}</span>`
    ).join('');

    // Method tags HTML
    const methodTagsHtml = (paper.methodTags || []).map(m =>
      `<span class="tag-chip method-tag">${escapeHtml(m)}</span>`
    ).join('');

    // Dataset tags HTML (only rendered if datasets exist)
    let datasetBlockHtml = '';
    if (paper.datasets && paper.datasets.length > 0 && paper.datasets.some(d => d.trim())) {
      const datasetChips = paper.datasets.map(d => `<span class="tag-chip">${escapeHtml(d)}</span>`).join('');
      datasetBlockHtml = `
        <div class="detail-meta-row">
          <span class="meta-field-label">Dataset</span>
          <div class="meta-field-content">${datasetChips}</div>
        </div>
      `;
    }

    // ★ FIRST Badge Conditional Rendering (Strict Check)
    let firstBadgeHtml = '';
    const theFirstClean = (paper.theFirst || '').trim();
    if (theFirstClean && !['none', 'nan', '无', '否', '-'].includes(theFirstClean.toLowerCase())) {
      firstBadgeHtml = `
        <div class="detail-meta-row">
          <span class="meta-field-label">Highlight</span>
          <div class="meta-field-content">
            <div class="first-badge-container" tabindex="0" role="button" aria-label="First Highlight Tooltip">
              <span class="first-badge">★ FIRST</span>
              <div class="first-tooltip">${escapeHtml(theFirstClean)}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Action Buttons Conditional Rendering
    let paperBtnHtml = '';
    if (paper.paperUrl && paper.paperUrl.trim() && paper.paperUrl.trim() !== '#' && paper.paperUrl.trim() !== '-') {
      paperBtnHtml = `
        <a href="${escapeHtml(paper.paperUrl.trim())}" target="_blank" rel="noopener noreferrer" class="btn-action btn-paper">
          PAPER ↗
        </a>
      `;
    }

    let codeBtnHtml = '';
    if (paper.codeUrl && paper.codeUrl.trim() && paper.codeUrl.trim() !== '#' && paper.codeUrl.trim() !== '-') {
      codeBtnHtml = `
        <a href="${escapeHtml(paper.codeUrl.trim())}" target="_blank" rel="noopener noreferrer" class="btn-action btn-code">
          CODE ↗
        </a>
      `;
    }

    // One Sentence Summary
    let summaryHtml = '';
    if (paper.summary && paper.summary.trim()) {
      summaryHtml = `
        <div class="detail-summary-block">
          <div class="summary-label">Key Contribution</div>
          <div class="summary-text">${escapeHtml(paper.summary.trim())}</div>
        </div>
      `;
    }

    // Build the inner 3D container
    cardEl.innerHTML = `
      <div class="card-3d-inner">
        <!-- Front Face -->
        <div class="card-face card-front" role="button" tabindex="0" aria-label="Paper: ${escapeHtml(paper.title)}. Click to view detail.">
          <div class="card-front-top">
            <span class="card-front-category">01 / Embodied Perception</span>
            <span class="card-front-counter">${currentFormatted} / ${totalFormatted}</span>
          </div>
          
          <div class="card-figure-panel">
            <img src="${escapeHtml(paper.image)}" alt="${escapeHtml(paper.methodName || paper.title)} figure" class="card-figure-img" loading="lazy" />
          </div>

          <div class="card-front-info">
            <div class="card-method-badge">${escapeHtml(paper.methodName || paper.title)}</div>
            <div class="card-paper-title">${escapeHtml(paper.title)}</div>
          </div>

          <div class="card-front-bottom">
            <span class="card-venue-tag">${escapeHtml(venueYear)}</span>
            <span class="card-flip-prompt">Detail ↗</span>
          </div>
        </div>

        <!-- Back Face (Detail View) -->
        <div class="card-face card-back" aria-label="Detail view of ${escapeHtml(paper.title)}">
          <div class="card-back-header">
            <span class="card-back-counter">${currentFormatted} / ${totalFormatted}</span>
            <button type="button" class="btn-flip-close" aria-label="Close detail view">
              ✕ Flip Back
            </button>
          </div>

          <div class="card-back-body">
            <div>
              <div class="detail-method-title">${escapeHtml(paper.methodName)}</div>
              <div class="detail-paper-title">${escapeHtml(paper.title)}</div>
            </div>

            ${summaryHtml}

            ${authorsDisplay ? `
              <div class="detail-meta-row">
                <span class="meta-field-label">Authors</span>
                <div class="meta-field-content">${authorsDisplay}</div>
              </div>
            ` : ''}

            ${taskTagsHtml ? `
              <div class="detail-meta-row">
                <span class="meta-field-label">Task</span>
                <div class="meta-field-content">${taskTagsHtml}</div>
              </div>
            ` : ''}

            ${methodTagsHtml ? `
              <div class="detail-meta-row">
                <span class="meta-field-label">Method</span>
                <div class="meta-field-content">${methodTagsHtml}</div>
              </div>
            ` : ''}

            ${datasetBlockHtml}

            ${venueYear ? `
              <div class="detail-meta-row">
                <span class="meta-field-label">Venue</span>
                <div class="meta-field-content">
                  <span class="card-venue-tag">${escapeHtml(venueYear)}</span>
                </div>
              </div>
            ` : ''}

            ${firstBadgeHtml}
          </div>

          <div class="card-back-actions">
            ${paperBtnHtml}
            ${codeBtnHtml}
          </div>
        </div>
      </div>
    `;

    // Attach local flip interactions
    setupCardInteractions(cardEl);

    return cardEl;
  }

  /**
   * Bind event listeners for card flipping and mobile tooltip interaction
   */
  function setupCardInteractions(cardEl) {
    const cardFront = cardEl.querySelector('.card-front');
    const closeBtn = cardEl.querySelector('.btn-flip-close');
    const firstContainer = cardEl.querySelector('.first-badge-container');

    // Click front face -> flip if this card is center
    cardFront.addEventListener('click', function (e) {
      if (cardEl.classList.contains('card-center')) {
        flipCard(cardEl, true);
      }
    });

    // Keyboard enter/space on front face
    cardFront.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (cardEl.classList.contains('card-center')) {
          e.preventDefault();
          flipCard(cardEl, true);
        }
      }
    });

    // Close button -> flip back
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        flipCard(cardEl, false);
      });
    }

    // Mobile / Keyboard Tap on FIRST badge
    if (firstContainer) {
      firstContainer.addEventListener('click', function (e) {
        e.stopPropagation();
        firstContainer.classList.toggle('is-active');
      });

      // Dismiss tooltip when clicking outside
      document.addEventListener('click', function (e) {
        if (!firstContainer.contains(e.target)) {
          firstContainer.classList.remove('is-active');
        }
      });
    }
  }

  /**
   * Flip a card between front and back
   */
  function flipCard(cardEl, toFlipped) {
    if (!cardEl) return;
    if (toFlipped) {
      cardEl.classList.add('is-flipped');
    } else {
      cardEl.classList.remove('is-flipped');
    }
  }

  return {
    createCardElement: createCardElement,
    flipCard: flipCard,
    padZero: padZero
  };
})();
