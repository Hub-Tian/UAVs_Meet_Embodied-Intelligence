/* Archive navigation is data-driven; only Perception opts into this prototype. */
window.PaperArchive = (() => {
  const readmeRows = [{"id": "uav-track-vla", "title": "UAV-Track VLA (UAV-Track VLA: Embodied Aerial Tracking via Vision-Language-Action Models)", "type": "VLA", "publication": "arXiv 2026", "code": "-"}, {"id": "oa-vat", "title": "OA-VAT (Instance-level Visual Active Tracking with Occlusion-Aware Planning)", "type": "VFM", "publication": "CVPR 2026", "code": "-"}, {"id": "esarbench", "title": "ESARBench (ESARBench: A Benchmark for Agentic UAV Embodied Search and Rescue)", "type": "Benchmark", "publication": "arXiv 2026", "code": "-"}, {"id": "active-contact-engagement", "title": "Active Contact Engagement for Aerial Navigation in Unknown Environments with Glass", "type": "Planning", "publication": "RA-L 2026", "code": "-"}, {"id": "detrack-aadworlds", "title": "DeTrack / AaDWorlds (DeTrack: A Benchmark and Altitude-Aware Dual World Model for Drone-embodied Tracking)", "type": "World Model", "publication": "arXiv 2026", "code": "-"}, {"id": "cosfly-track", "title": "CosFly-Track (CosFly-Track: A Large-Scale Multi-Modal Dataset for UAV Visual Tracking via Multi-Constraint Trajectory Optimization)", "type": "Dataset", "publication": "arXiv 2026", "code": "-"}, {"id": "uast", "title": "UAST: Unified Active Search and Tracking for Arbitrary Targets with UAVs", "type": "Active Perception", "publication": "CVPR 2026", "code": "-"}, {"id": "scoutvla", "title": "ScoutVLA (ScoutVLA: UAV-Centric Active Perception via a Dual-Expert VLA Model for Open-World Embodied Question Answering)", "type": "VLA", "publication": "arXiv 2026", "code": "-"}, {"id": "activefly-bench", "title": "ActiveFly-Bench (ActiveFly-Bench: Aligning Embodied Question Answering with Vision-Language-Action for Aerial Embodied Perception)", "type": "VLA+LLM", "publication": "arXiv 2026", "code": "-"}, {"id": "cel", "title": "CEL (Cognitive embodied learning for anomaly active target tracking)", "type": "RL", "publication": "Communications Engineering 2025", "code": "-"}, {"id": "gomaa-geo", "title": "GOMAA-Geo (Gomaa-geo: Goal modality agnostic active geo-localization)", "type": "Active Perception", "publication": "NeurIPS 2024", "code": "-"}, {"id": "d-vat", "title": "D-VAT (D-VAT: End-to-end visual active tracking for micro aerial vehicles)", "type": "RL", "publication": "RAL 2024", "code": "-"}, {"id": "gc-vat", "title": "GC-VAT (Open-World Drone Active Tracking with Goal-Centered Rewards)", "type": "Active Tracking", "publication": "NeurIPS 2024", "code": "-"}, {"id": "adaptive-informative-path-planning", "title": "Adaptive informative path planning using deep reinforcement learning for uav-based active sensing", "type": "Planning+RL", "publication": "ICRA 2022", "code": "-"}, {"id": "ad-aot", "title": "Ad-AOT (Anti-distractor active object tracking in 3D environments)", "type": "RL", "publication": "TCSVT 2021", "code": "-"}, {"id": "semantic-aware-path-planning", "title": "Semantic-aware active perception for uavs using deep reinforcement learning", "type": "RL", "publication": "IROS 2021", "code": "-"}];
  const papers = readmeRows.map(row => ({...window.PERCEPTION_ARCHIVE_DATA.find(p => p.id === row.id), indexTitle:row.title, type:row.type, publication:row.publication, indexCode:row.code}));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let archive, overlay, panel, state = 'closed', origin, savedY, previousBodyStyle, previousInert;
  let animation, quietTimer, lastWheel = 0, touchY = 0, scrollFrame;
  const gallery = document.getElementById('paper-gallery-view');
  const duration = () => motion.matches ? 0 : 520;

  let rail, directory;
  function load(category) {
    if (!archive) mount();
    archive.hidden = category !== 'embodied-perception';
    gallery.classList.toggle('perception-archive-page', !archive.hidden);
    if (!archive.hidden) requestAnimationFrame(() => render(archive.querySelector('input').value));
  }

  function mount() {
    archive = document.createElement('section');
    archive.className = 'paper-archive';
    archive.id = 'perception-paper-archive';
    archive.innerHTML = `<div class="archive-toolbar"><span>Paper Archive / <span class="archive-count" role="status"></span></span><label>Search <input type="search" aria-label="Search papers" placeholder="Title, author, type…"></label><span>Choose a paper · Click its card to explore</span></div>
      <div class="archive-exhibition"><nav class="archive-directory" aria-label="Embodied Perception paper directory"><div class="archive-column-labels"><span>Title</span><span>Type</span><span>Publication</span><span>Code</span></div><ol class="archive-list"></ol></nav><div class="archive-card-rail" aria-label="Scrollable research cards" tabindex="0"></div></div><p class="archive-empty" hidden>No papers found.</p>`;
    gallery.insertBefore(archive, document.getElementById('stage-container'));
    rail=archive.querySelector('.archive-card-rail');
    directory=archive.querySelector('.archive-directory');
    rail.addEventListener('scroll', scheduleOverview, {passive:true});
    window.addEventListener('resize', scheduleOverview, {passive:true});
    archive.querySelector('input').addEventListener('input', e => render(e.target.value));
  }

  function render(query) {
    const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const filtered=papers.filter(p => terms.every(t => [p.indexTitle,p.type,p.publication,p.authorsText].join(' ').toLowerCase().includes(t)));
    archive.querySelector('.archive-count').textContent=`${filtered.length} / ${papers.length}`;
    archive.querySelector('.archive-empty').hidden=filtered.length>0;
    archive.querySelector('ol').innerHTML=filtered.map(p => renderArchiveItem(p,papers.indexOf(p))).join('');
    rail.replaceChildren();
    filtered.forEach(p => {
      const original=document.getElementById(p.cardId);
      if (!original) return;
      // Reuse the existing cover markup, image and labels without rebuilding it.
      const card=document.createElement('article');
      card.className='archive-scroll-card';
      card.dataset.paperId=p.id;
      card.innerHTML=original.innerHTML;
      const cover=card.querySelector('.research-record__cover');
      cover.tabIndex=0;
      cover.addEventListener('click', () => open(p.id,original,card));
      cover.addEventListener('keydown', e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();open(p.id,original,card);}});
      rail.append(card);
    });
    archive.querySelectorAll('.archive-row').forEach(row => {
      row.addEventListener('click', () => locate(row.dataset.paperId));


    });
    rail.scrollTop=0;
    scheduleOverview();
  }

  function renderArchiveItem(p,index) {
    return `<li><button class="archive-row" data-paper-id="${escape(p.id)}" data-card-id="${escape(p.cardId)}" type="button" aria-label="Locate card: ${escape(p.indexTitle)}"><span class="archive-title"><small>${String(index+1).padStart(3,'0')}</small>${escape(p.indexTitle)}</span><span class="archive-type">${escape(p.type)}</span><span class="archive-publication">${escape(p.publication)}</span><span class="archive-code">${escape(p.indexCode)}</span></button></li>`;
  }

  function locate(id) {
    const card=rail.querySelector(`[data-paper-id="${id}"]`);
    if (!card) return;
    rail.scrollTo({top:card.offsetTop-(rail.clientHeight-card.offsetHeight)/2,behavior:motion.matches?'instant':'smooth'});
  }

  function scheduleOverview() {
    if(scrollFrame) return;
    scrollFrame=requestAnimationFrame(() => {
      scrollFrame=null;
      if(!archive || archive.hidden || state!=='closed') return;
      const cards=[...rail.children];
      const center=rail.getBoundingClientRect().top+rail.clientHeight/2;
      let active,nearest=Infinity;
      cards.forEach(card => {
        const rect=card.getBoundingClientRect();
        const distance=Math.abs(rect.top+rect.height/2-center);
        if(distance<nearest){nearest=distance;active=card;}
        card.style.opacity=String(Math.max(.22,1-distance/rail.clientHeight));
      });
      archive.querySelectorAll('.archive-row').forEach(row => {
        const selected=row.dataset.paperId===active?.dataset.paperId;
        row.classList.toggle('is-selected',selected);
        if(selected) {
          row.setAttribute('aria-current','true');
          const rect=row.getBoundingClientRect(),box=directory.getBoundingClientRect();
          if(rect.top<box.top+30 || rect.bottom>box.bottom-20) directory.scrollTo({top:directory.scrollTop+rect.top-box.top-directory.clientHeight/2+rect.height/2,behavior:motion.matches?'instant':'smooth'});
        } else row.removeAttribute('aria-current');
      });
    });
  }

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'paper-expansion';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'expanded-paper-title');
    overlay.setAttribute('aria-describedby', 'expansion-exit-hint');
    overlay.innerHTML = '<article class="research-detail__face archive-native-panel"></article>';
    document.body.append(overlay);
    panel = overlay.firstElementChild;
    window.addEventListener('wheel', event => {
      if (state === 'closed' || event.ctrlKey || !event.deltaY) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      lastWheel = performance.now();
      collapse();
    }, {passive: false, capture: true});
    overlay.addEventListener('touchstart', e => {touchY = e.touches[0].clientY;}, {passive: true});
    overlay.addEventListener('touchmove', e => {
      if (Math.abs(e.touches[0].clientY - touchY) > 35) { e.preventDefault(); collapse(); }
    }, {passive: false});
    window.addEventListener('keydown', e => {
      if (state === 'closed') return;
      if (['Escape', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.stopImmediatePropagation();
      if (e.key === 'Escape') { e.preventDefault(); collapse(); }
      if (e.key === 'Tab') {
        const nodes = Array.from(overlay.querySelectorAll('button, a[href], [tabindex="0"]'));
        const i = nodes.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); nodes.at(-1).focus(); }
        else if (!e.shiftKey && (i === nodes.length-1 || i < 0)) { e.preventDefault(); nodes[0].focus(); }
      }
    }, true);
  }

  function transformTo(rect) {
    const target = panel.getBoundingClientRect();
    return `translate(${rect.left-target.left}px, ${rect.top-target.top}px) scale(${rect.width/target.width}, ${rect.height/target.height})`;
  }

  function open(id, card, archiveOrigin) {
    if (state !== 'closed') return;
    if (!overlay) createOverlay();
    rail.scrollTo({top:rail.scrollTop, behavior:'instant'});
    directory.scrollTo({top:directory.scrollTop, behavior:'instant'});
    const p = papers.find(p => p.id === id);
    if (!p) return;
    origin = archiveOrigin || archive.querySelector(`[data-card-id="${card.id}"]`) || card.querySelector('[role=button]');
    const rect = origin.getBoundingClientRect();
    savedY = window.scrollY;
    previousBodyStyle = document.body.getAttribute('style');
    previousInert = [...document.body.children].filter(el => el !== overlay).map(el => [el, el.inert]);
    previousInert.forEach(([el]) => {el.inert = true;});
    const bodyWidth = document.body.getBoundingClientRect().width;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedY}px`;
    document.body.style.width = `${bodyWidth}px`;
    document.body.classList.add('perception-expanded');
    // Use the same renderer and CSS as Navigation, Planning and the other categories.
    ResearchGallery.renderArchiveDetail(p, papers.indexOf(p), panel);
    panel.querySelector('.detail-paper-title').id = 'expanded-paper-title';
    const focusTarget = panel.querySelector('.detail-copy');
    focusTarget.tabIndex = 0;
    overlay.hidden = false;
    state = 'opening';
    InteractiveGrid.setIntensity(.15);
    animation = panel.animate([{transform: transformTo(rect), opacity: .6}, {transform: 'none', opacity: 1}], {duration: duration(), easing: 'cubic-bezier(.22,1,.36,1)'});
    animation.finished.then(() => {if (state === 'opening') {state = 'open'; focusTarget.focus({preventScroll:true});}}).catch(() => {});
  }

  function collapse() {
    if (state === 'closing' || state === 'closed') return;
    state = 'closing';
    const current = {transform:getComputedStyle(panel).transform, opacity:getComputedStyle(panel).opacity};
    animation?.cancel();
    animation = panel.animate([current, {transform:transformTo(origin.getBoundingClientRect()), opacity:0}], {duration: duration(), easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards'});
    animation.finished.then(() => {
      overlay.hidden = true;
      const finish = () => {
        // Absorb trackpad momentum before unlocking the underlying document.
        if (performance.now()-lastWheel < 180) {quietTimer = setTimeout(finish, 180); return;}
        animation.cancel();
        if (previousBodyStyle === null) document.body.removeAttribute('style');
        else document.body.setAttribute('style', previousBodyStyle);
        document.body.classList.remove('perception-expanded');
        previousInert.forEach(([el, inert]) => {el.inert = inert;});
        window.scrollTo({top:savedY, behavior:'instant'});
        (origin.querySelector('.research-record__cover') || origin).focus({preventScroll:true});
        InteractiveGrid.setIntensity(.45);
        state = 'closed';
        scheduleOverview();
      };
      clearTimeout(quietTimer);
      finish();
    });
  }
  return {load, open};
})();
