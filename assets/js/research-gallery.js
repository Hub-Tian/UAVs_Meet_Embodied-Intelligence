/**
 * UAVs Meet Embodied Intelligence - Level 2 & 3 Research Gallery & 3D Detail Controller
 * Direct adaptation of Flying Intelligence Recent Research carousel geometry,
 * origin-captured full-screen zoom, and 3D flip card mechanics with strict metadata rules.
 */

const ResearchGallery = (function () {
  let papers = [];
  let activeIndex = 0;
  let detailIndex = -1;
  let stageEl = null;
  let statusEl = null;
  let recordEls = [];
  let currentCategory = 'embodied-perception';

  // Drag & Swipe gesture state
  let dragStartX = 0;
  let dragMoved = false;
  let isDragging = false;

  // Detail Elements
  let detailDialog = null;
  let detailFlipper = null;
  let detailFront = null;
  let detailBack = null;
  let detailPrevBtn = null;
  let detailNextBtn = null;
  let isDetailOpen = false;
  let detailOriginRect = null;

  function padZero(num) {
    return String(num).padStart(2, '0');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function relativeOffset(index) {
    const total = papers.length;
    if (total <= 1) return 0;
    let offset = index - activeIndex;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  }

  // Exact geometry formula from Flying Intelligence
  function recordPosition(offset) {
    const compact = window.innerWidth < 900;
    const step = compact
      ? Math.min(window.innerWidth * 0.82, 330)
      : Math.min(window.innerWidth * 0.42, 760);
    const distance = Math.abs(offset);
    return {
      x: offset * step,
      y: offset === 0 ? -10 : (offset % 2 ? 32 : -26) + distance * 6,
      z: 0,
      rotate: offset * (compact ? 3.8 : 4.8),
      scale: offset === 0 ? 1 : Math.max(0.56, 0.8 - distance * 0.08),
      opacity: offset === 0 ? 1 : (distance > 2 ? 0 : Math.max(0.34, 0.82 - distance * 0.2)),
      layer: 20 - distance
    };
  }

  function updateRecords() {
    recordEls.forEach((record, index) => {
      const offset = relativeOffset(index);
      const pos = recordPosition(offset);
      const active = offset === 0;

      record.style.setProperty('--record-x', `${pos.x}px`);
      record.style.setProperty('--record-y', `${pos.y}px`);
      record.style.setProperty('--record-z', `${pos.z}px`);
      record.style.setProperty('--record-rotate', `${pos.rotate}deg`);
      record.style.setProperty('--record-scale', pos.scale);
      record.style.setProperty('--record-opacity', pos.opacity);
      record.style.setProperty('--record-layer', pos.layer);

      record.classList.toggle('is-active', active);
      record.setAttribute('aria-hidden', String(Math.abs(offset) > 2));

      const cover = record.querySelector('.research-record__cover');
      if (cover) {
        cover.tabIndex = Math.abs(offset) <= 1 ? 0 : -1;
        cover.setAttribute('aria-current', active ? 'true' : 'false');
      }
    });

    if (statusEl) {
      statusEl.textContent = `${padZero(activeIndex + 1)} / ${padZero(papers.length)}`;
    }
  }

  function setActive(nextIndex) {
    if (isDetailOpen || papers.length === 0) return;
    const total = papers.length;
    activeIndex = (nextIndex + total) % total;
    updateRecords();
  }

  function next() {
    setActive(activeIndex + 1);
  }

  function prev() {
    setActive(activeIndex - 1);
  }

  function init(options) {
    stageEl = document.getElementById(options.stageId || 'research-airspace-stage');
    statusEl = document.getElementById(options.statusId || 'gallery-counter');
    detailDialog = document.getElementById('research-detail');
    detailFlipper = document.getElementById('research-detail-flipper');
    detailFront = document.getElementById('research-detail-front');
    detailBack = document.getElementById('research-detail-back');
    detailPrevBtn = document.getElementById('detail-btn-prev');
    detailNextBtn = document.getElementById('detail-btn-next');

    bindGlobalEvents();
    bindDetailControls();
  }

  function loadCategory(categorySlug, categoryTitle) {
    currentCategory = categorySlug;
    activeIndex = 0;

    const titleEl = document.getElementById('gallery-category-title');
    if (titleEl) titleEl.textContent = categoryTitle || 'Embodied Perception';

    const stageContainer = document.getElementById('stage-container');
    const pendingContainer = document.getElementById('pending-container');

    papers = (window.PAPERS_DATA || []).filter(p => p.category === categorySlug);

    if (papers.length === 0) {
      // Pending state for other categories
      if (stageContainer) stageContainer.style.display = 'none';
      if (pendingContainer) {
        pendingContainer.style.display = 'flex';
        const pTitle = pendingContainer.querySelector('.pending-category-title');
        if (pTitle) pTitle.textContent = categoryTitle;
      }
      if (statusEl) statusEl.textContent = '00 / 00';
      return;
    }

    if (stageContainer) stageContainer.style.display = 'block';
    if (pendingContainer) pendingContainer.style.display = 'none';

    renderPapers();
    updateRecords();
  }

  function renderPapers() {
    if (!stageEl) return;
    stageEl.innerHTML = '';
    recordEls = [];

    papers.forEach((paper, idx) => {
      const record = document.createElement('article');
      record.className = 'research-record';
      record.setAttribute('data-id', paper.id);
      record.setAttribute('data-index', idx);

      const venueYear = paper.venue && paper.year ? `${paper.venue} · ${paper.year}` : (paper.venue || paper.year || '');

      record.innerHTML = `
        <div class="research-record__cover" role="button" tabindex="${idx === 0 ? '0' : '-1'}" aria-label="${escapeHtml(paper.title)}. Click to expand detail.">
          <div class="research-media-frame">
            <img class="research-media-img" src="${escapeHtml(paper.image)}" alt="${escapeHtml(paper.methodName || paper.title)} figure" loading="lazy" />
          </div>
          <div class="research-record__meta">
            <div class="research-record__method">${escapeHtml(paper.methodName || paper.title)}</div>
            <div class="research-record__title">${escapeHtml(paper.title)}</div>
            <div class="research-record__venue">${escapeHtml(venueYear)}</div>
          </div>
        </div>
      `;

      // Click behavior: side paper activates; center paper opens detail
      record.addEventListener('click', function (e) {
        if (dragMoved) return;
        const offset = relativeOffset(idx);
        if (offset === 0) {
          openDetail(idx);
        } else if (offset === -1) {
          prev();
        } else if (offset === 1) {
          next();
        } else {
          setActive(idx);
        }
      });

      stageEl.appendChild(record);
      recordEls.push(record);
    });
  }

  // =========================================================================
  // Level 3: 3D Flip Paper Detail Implementation
  // =========================================================================

  function captureDetailOrigin(index) {
    const record = recordEls[index];
    if (!record) return null;
    const mediaFrame = record.querySelector('.research-media-frame');
    return mediaFrame ? mediaFrame.getBoundingClientRect() : record.getBoundingClientRect();
  }

  function openDetail(index) {
    if (index < 0 || index >= papers.length) return;
    detailIndex = index;
    isDetailOpen = true;
    const paper = papers[index];

    // Lower grid intensity during detail
    InteractiveGrid.setIntensity(0.15);

    detailOriginRect = captureDetailOrigin(index);

    // 1. Populate Front Face
    detailFront.innerHTML = `
      <img src="${escapeHtml(paper.image)}" alt="${escapeHtml(paper.methodName || paper.title)}" />
    `;

    // 2. Populate Back Face
    renderDetailBackFace(paper, index);

    // 3. Open Dialog Overlay
    detailDialog.classList.add('is-open');
    detailDialog.classList.remove('is-flipped');

    // 4. Animate 3D Flip after origin zoom
    setTimeout(() => {
      detailDialog.classList.add('is-flipped');
    }, 280);
  }

  function renderDetailBackFace(paper, index) {
    const total = papers.length;
    const venueYear = paper.venue && paper.year ? `${paper.venue} · ${paper.year}` : (paper.venue || paper.year || '');

    // Authors
    let authorsDisplay = '';
    if (Array.isArray(paper.authors) && paper.authors.length > 0) {
      if (paper.authors.length > 4) {
        authorsDisplay = `<span title="${escapeHtml(paper.authors.join(', '))}">` +
          escapeHtml(paper.authors.slice(0, 3).join(', ')) + ' et al.</span>';
      } else {
        authorsDisplay = `<span>` + escapeHtml(paper.authors.join(', ')) + `</span>`;
      }
    }

    // Task tags
    const taskTagsHtml = (paper.taskTags || []).map(t =>
      `<span class="tag-chip task-tag">${escapeHtml(t)}</span>`
    ).join('');

    // Method tags
    const methodTagsHtml = (paper.methodTags || []).map(m =>
      `<span class="tag-chip method-tag">${escapeHtml(m)}</span>`
    ).join('');

    // Dataset block (only if present)
    let datasetBlockHtml = '';
    if (paper.datasets && paper.datasets.length > 0 && paper.datasets.some(d => d.trim())) {
      const datasetChips = paper.datasets.map(d => `<span class="tag-chip">${escapeHtml(d)}</span>`).join('');
      datasetBlockHtml = `
        <div class="detail-meta-row">
          <span class="detail-meta-label">Dataset</span>
          <div class="detail-meta-content">${datasetChips}</div>
        </div>
      `;
    }

    // ★ FIRST Badge (Strict Conditional Check)
    let firstBadgeHtml = '';
    const theFirstClean = (paper.theFirst || '').trim();
    if (theFirstClean && !['none', 'nan', '无', '否', '-'].includes(theFirstClean.toLowerCase())) {
      firstBadgeHtml = `
        <div class="detail-meta-row">
          <span class="detail-meta-label">Highlight</span>
          <div class="detail-meta-content">
            <div class="first-badge-container" tabindex="0" role="button" aria-label="First Highlight Tooltip">
              <span class="first-badge">★ FIRST</span>
              <div class="first-tooltip">${escapeHtml(theFirstClean)}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Action Buttons
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
        <div class="detail-summary-box">
          <div class="summary-tag">Key Contribution</div>
          <div class="summary-content">${escapeHtml(paper.summary.trim())}</div>
        </div>
      `;
    }

    detailBack.innerHTML = `
      <div class="detail-header">
        <span class="detail-counter">${padZero(index + 1)} / ${padZero(total)}</span>
        <button type="button" class="btn-detail-close" id="btn-close-detail" aria-label="Close detail view">
          ✕ Back
        </button>
      </div>

      <div class="detail-body">
        <div>
          <div class="detail-method-name">${escapeHtml(paper.methodName || paper.title)}</div>
          <div class="detail-paper-title">${escapeHtml(paper.title)}</div>
        </div>

        ${summaryHtml}

        ${authorsDisplay ? `
          <div class="detail-meta-row">
            <span class="detail-meta-label">Authors</span>
            <div class="detail-meta-content">${authorsDisplay}</div>
          </div>
        ` : ''}

        ${taskTagsHtml ? `
          <div class="detail-meta-row">
            <span class="detail-meta-label">Task</span>
            <div class="detail-meta-content">${taskTagsHtml}</div>
          </div>
        ` : ''}

        ${methodTagsHtml ? `
          <div class="detail-meta-row">
            <span class="detail-meta-label">Method</span>
            <div class="detail-meta-content">${methodTagsHtml}</div>
          </div>
        ` : ''}

        ${datasetBlockHtml}

        ${venueYear ? `
          <div class="detail-meta-row">
            <span class="detail-meta-label">Venue</span>
            <div class="detail-meta-content">
              <span class="tag-chip">${escapeHtml(venueYear)}</span>
            </div>
          </div>
        ` : ''}

        ${firstBadgeHtml}
      </div>

      <div class="detail-actions">
        ${paperBtnHtml}
        ${codeBtnHtml}
      </div>
    `;

    // Re-bind close & tooltip inside detailBack
    const closeBtn = detailBack.querySelector('#btn-close-detail');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDetail);
    }

    const firstContainer = detailBack.querySelector('.first-badge-container');
    if (firstContainer) {
      firstContainer.addEventListener('click', function (e) {
        e.stopPropagation();
        firstContainer.classList.toggle('is-active');
      });
      document.addEventListener('click', function (e) {
        if (!firstContainer.contains(e.target)) {
          firstContainer.classList.remove('is-active');
        }
      });
    }
  }

  function closeDetail() {
    if (!isDetailOpen) return;
    detailDialog.classList.remove('is-flipped');

    // Restore grid intensity
    InteractiveGrid.setIntensity(0.45);

    setTimeout(() => {
      detailDialog.classList.remove('is-open');
      isDetailOpen = false;
      detailIndex = -1;
      updateRecords();
    }, 280);
  }

  function navigateFromDetail(dir) {
    if (!isDetailOpen || papers.length <= 1) return;
    const nextIdx = (detailIndex + dir + papers.length) % papers.length;
    activeIndex = nextIdx;
    updateRecords();

    // Flip to front briefly, then populate new paper and flip back
    detailDialog.classList.remove('is-flipped');
    setTimeout(() => {
      openDetail(nextIdx);
    }, 200);
  }

  function bindDetailControls() {
    if (detailPrevBtn) {
      detailPrevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        navigateFromDetail(-1);
      });
    }
    if (detailNextBtn) {
      detailNextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        navigateFromDetail(1);
      });
    }

    const backdrop = document.querySelector('.research-detail__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeDetail);
    }
  }

  function bindGlobalEvents() {
    // Stage navigation buttons
    const stagePrev = document.getElementById('stage-btn-prev');
    const stageNext = document.getElementById('stage-btn-next');

    if (stagePrev) stagePrev.addEventListener('click', prev);
    if (stageNext) stageNext.addEventListener('click', next);

    // Keyboard navigation
    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        if (isDetailOpen) navigateFromDetail(-1);
        else prev();
      } else if (e.key === 'ArrowRight') {
        if (isDetailOpen) navigateFromDetail(1);
        else next();
      } else if (e.key === 'Escape') {
        if (isDetailOpen) closeDetail();
      }
    });

    // Touch Swipe Gestures on Stage
    if (stageEl) {
      stageEl.addEventListener('touchstart', function (e) {
        dragStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stageEl.addEventListener('touchend', function (e) {
        const endX = e.changedTouches[0].screenX;
        const diff = endX - dragStartX;
        if (diff > 45) prev();
        else if (diff < -45) next();
      }, { passive: true });

      // Mouse Drag Gestures on Stage
      stageEl.addEventListener('mousedown', function (e) {
        if (e.target.closest('a, button, .first-badge-container')) return;
        isDragging = true;
        dragMoved = false;
        dragStartX = e.clientX;
      });

      window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        if (Math.abs(e.clientX - dragStartX) > 8) {
          dragMoved = true;
        }
      });

      window.addEventListener('mouseup', function (e) {
        if (!isDragging) return;
        isDragging = false;
        const diff = e.clientX - dragStartX;
        if (diff > 45) prev();
        else if (diff < -45) next();
      });
    }

    window.addEventListener('resize', function () {
      if (papers.length > 0) updateRecords();
    }, { passive: true });
  }

  return {
    init: init,
    loadCategory: loadCategory,
    next: next,
    prev: prev,
    setActive: setActive,
    openDetail: openDetail,
    closeDetail: closeDetail,
    getCurrentIndex: function () { return activeIndex; }
  };
})();
