/**
 * UAVs Meet Embodied Intelligence - Embodied Perception Archive Controller
 * Corentin Bernadou archive interaction (left directory list + right WebGL card
 * with 3D hyperbolic bend deformation and full academic detail expansion).
 */

window.PaperArchive = (function () {
  const PREFERRED_ORDER = [
    "uav-track-vla",
    "oa-vat",
    "esarbench",
    "active-contact-engagement",
    "detrack-aadworlds",
    "cosfly-track",
    "uast",
    "scoutvla",
    "activefly-bench",
    "cel",
    "gomaa-geo",
    "d-vat",
    "gc-vat",
    "adaptive-informative-path-planning",
    "ad-aot",
    "semantic-aware-path-planning"
  ];

  let allPapers = [];
  let filteredPapers = [];
  let activeIndex = 0;
  let webglScene = null;
  let isMounted = false;

  // DOM elements
  let archiveContainer = null;
  let directoryEl = null;
  let listEl = null;
  let searchInput = null;
  let countBadge = null;
  let cardFrame = null;
  let cardBadgeNum = null;
  let cardBadgeVenue = null;
  let cardBadgeType = null;
  let cardBadgeTask = null;
  let cardMethodName = null;
  let cardPaperTitle = null;
  let emptyMsg = null;

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function initData() {
    const rawData = window.PERCEPTION_ARCHIVE_DATA || [];
    
    // Sort according to PREFERRED_ORDER (newest 2026 to 2021)
    allPapers = [];
    PREFERRED_ORDER.forEach(id => {
      const found = rawData.find(p => p.id === id);
      if (found) allPapers.push(found);
    });

    // Include any remaining perception papers
    rawData.forEach(p => {
      if (!allPapers.some(item => item.id === p.id)) {
        allPapers.push(p);
      }
    });

    filteredPapers = [...allPapers];
  }

  function mountDOM() {
    if (isMounted) return;

    archiveContainer = document.getElementById('perception-paper-archive');
    if (!archiveContainer) return;

    directoryEl = document.getElementById('archive-directory');
    listEl = document.getElementById('archive-paper-list');
    searchInput = document.getElementById('archive-search-input');
    countBadge = document.getElementById('archive-count-badge');
    cardFrame = document.getElementById('archive-preview-stage');
    cardBadgeNum = document.getElementById('card-badge-num');
    cardBadgeVenue = document.getElementById('card-badge-venue');
    cardBadgeType = document.getElementById('card-badge-type');
    cardBadgeTask = document.getElementById('card-badge-task');
    cardMethodName = document.getElementById('card-method-name');
    cardPaperTitle = document.getElementById('card-paper-title');
    emptyMsg = document.getElementById('archive-empty-msg');

    bindEvents();
    isMounted = true;
  }

  function bindEvents() {
    // 1. Search filtering
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        filterPapers(e.target.value.trim());
      });
    }

    // 2. Stage/Card click to flip & open details
    const stageEl = cardFrame || document.getElementById('archive-preview-stage');
    if (stageEl && !stageEl._hasCardClick) {
      stageEl._hasCardClick = true;
      stageEl.addEventListener('click', function () {
        openDetail(activeIndex);
      });
      stageEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(activeIndex);
        }
      });
    }

    // Window resize
    window.addEventListener('resize', function () {
      if (webglScene) {
        webglScene.onResize();
      }
    }, { passive: true });
  }

  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = '';

    if (countBadge) {
      countBadge.textContent = `${filteredPapers.length}`;
    }

    if (filteredPapers.length === 0) {
      if (emptyMsg) emptyMsg.hidden = false;
      return;
    }
    if (emptyMsg) emptyMsg.hidden = true;

    filteredPapers.forEach((paper, idx) => {
      const li = document.createElement('li');
      li.className = 'archive-item-wrapper';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'archive-item-btn' + (idx === activeIndex ? ' is-active' : '');
      btn.setAttribute('data-index', idx);
      btn.setAttribute('data-id', paper.id);
      btn.setAttribute('aria-label', `${paper.methodName || paper.title}, ${paper.venue} ${paper.year}`);

      const numStr = String(idx + 1).padStart(3, '0');
      const venueYearStr = `${paper.venue || ''} ${paper.year || ''}`.trim();
      const typeStr = paper.type || (paper.methodTags && paper.methodTags[0]) || 'Perception';

      const mName = (paper.methodName || '').trim();
      const pTitle = (paper.title || '').trim();
      let titleDisplay = '';
      if (mName && pTitle && mName.toLowerCase() !== pTitle.toLowerCase()) {
        titleDisplay = `${mName} (${pTitle})`;
      } else {
        titleDisplay = pTitle || mName;
      }

      const codeUrl = (paper.codeUrl || paper.code || '').trim();
      let codeHtml = `<span class="archive-item-code-placeholder">-</span>`;
      if (codeUrl) {
        codeHtml = `<a href="${escapeHtml(codeUrl)}" target="_blank" rel="noopener noreferrer" class="archive-item-code-link" title="Source Code" onclick="event.stopPropagation()">Code ↗</a>`;
      }

      btn.innerHTML = `
        <span class="archive-item-idx">${numStr}</span>
        <div class="archive-item-title-block">
          <span class="archive-item-title-text">${escapeHtml(titleDisplay)}</span>
        </div>
        <span class="archive-item-type">${escapeHtml(typeStr)}</span>
        <span class="archive-item-venue">${escapeHtml(venueYearStr)}</span>
        <span class="archive-item-code">${codeHtml}</span>
      `;

      // 1-to-1 sync: hovering or moving over this button activates it directly!
      btn.addEventListener('mouseenter', () => {
        setActive(idx, true);
      });

      btn.addEventListener('mousemove', () => {
        if (activeIndex !== idx) {
          setActive(idx, true);
        }
      });

      btn.addEventListener('focus', () => {
        setActive(idx, true);
      });

      // Left text click ONLY selects/activates this paper; does NOT pop up or flip the card!
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setActive(idx, true);
      });

      li.appendChild(btn);
      listEl.appendChild(li);
    });
  }

  function setActive(index, scrollWebgl = false) {
    if (index < 0 || index >= filteredPapers.length) return;
    activeIndex = index;
    const paper = filteredPapers[activeIndex];

    // Exclusively set .is-active ONLY on activeIndex
    if (listEl) {
      const btns = listEl.querySelectorAll('.archive-item-btn');
      btns.forEach((btn, i) => {
        btn.classList.toggle('is-active', i === activeIndex);
      });
    }

    // Update right card overlay in original format
    if (paper) {
      if (cardBadgeNum) cardBadgeNum.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(filteredPapers.length).padStart(2, '0')}`;
      if (cardBadgeVenue) cardBadgeVenue.textContent = `${paper.venue || ''} · ${paper.year || ''}`.trim();
      if (cardBadgeType) cardBadgeType.textContent = paper.type || (paper.methodTags && paper.methodTags[0]) || 'Perception';
      if (cardBadgeTask) cardBadgeTask.textContent = (paper.taskTags && paper.taskTags[0]) || 'Active Perception';
      if (cardMethodName) cardMethodName.textContent = paper.methodName || paper.title;
      if (cardPaperTitle) cardPaperTitle.textContent = paper.title;
    }

    // Scroll WebGL smoothly with velocity & deformation
    if (scrollWebgl && webglScene) {
      webglScene.scrollToIndex(activeIndex);
    }
  }

  function filterPapers(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      filteredPapers = [...allPapers];
    } else {
      filteredPapers = allPapers.filter(p => {
        const text = [
          p.title,
          p.methodName,
          p.venue,
          p.year,
          p.type,
          p.authorsText,
          (p.authors || []).join(' '),
          (p.methodTags || []).join(' '),
          (p.taskTags || []).join(' ')
        ].join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    activeIndex = 0;
    renderList();
    setActive(0, true);

    if (webglScene) {
      webglScene.setItems(filteredPapers);
    }
  }

  function initWebGL() {
    if (webglScene) return;

    const SceneClass = window.ArchiveWebGLScene || (window.ArchiveWebGLBundle && window.ArchiveWebGLBundle.ArchiveWebGLScene);
    if (!SceneClass) {
      setTimeout(initWebGL, 40);
      return;
    }

    const mountContainer = document.getElementById('perception-webgl-container');
    const stageEl = document.getElementById('archive-preview-stage');

    webglScene = new SceneClass({
      container: mountContainer,
      stageEl: stageEl,
      papers: filteredPapers,
      onActiveChange: (idx, paper) => {
        setActive(idx, false);
      },
      onSelect: (paper, idx) => {
        openDetail(idx);
      }
    });
  }

  function openDetail(index) {
    const paper = filteredPapers[index];
    if (!paper) return;

    const rg = window.ResearchGallery || (typeof ResearchGallery !== 'undefined' ? ResearchGallery : null);
    if (rg) {
      rg.openDetailById(paper.id);
    }
  }

  function getPapers() {
    if (filteredPapers && filteredPapers.length > 0) return filteredPapers;
    if (allPapers && allPapers.length > 0) return allPapers;
    initData();
    return allPapers;
  }

  function load(categorySlug) {
    mountDOM();
    initData();

    const isPerception = categorySlug === 'embodied-perception';
    if (!archiveContainer) return;

    const counterEl = document.getElementById('gallery-counter');

    if (isPerception) {
      if (counterEl) counterEl.style.display = 'none';
      archiveContainer.style.display = 'block';
      archiveContainer.hidden = false;
      renderList();
      setActive(activeIndex, false);

      initWebGL();
      if (webglScene) {
        webglScene.setActive(true);
        setTimeout(() => webglScene.onResize(), 60);
      }
    } else {
      if (counterEl) counterEl.style.display = '';
      archiveContainer.style.display = 'none';
      archiveContainer.hidden = true;
      if (webglScene) {
        webglScene.setActive(false);
      }
    }
  }

  function deactivate() {
    const counterEl = document.getElementById('gallery-counter');
    if (counterEl) counterEl.style.display = '';
    if (webglScene) {
      webglScene.setActive(false);
    }
    if (archiveContainer) {
      archiveContainer.style.display = 'none';
    }
  }

  return {
    load: load,
    deactivate: deactivate,
    setActive: setActive,
    openDetail: openDetail,
    getPapers: getPapers
  };
})();
