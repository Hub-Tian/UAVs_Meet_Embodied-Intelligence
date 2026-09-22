/* Continuous Mountain Journey Homepage Narrative Controller */
(() => {
  const landing = document.getElementById('category-landing-view');
  const hero = document.getElementById('homepage-hero');
  const intro = document.getElementById('homepage-introduction');
  const categories = document.querySelector('.homepage-existing-categories');
  const catGroup = document.getElementById('category-windows-group');
  const title = hero.querySelector('.landing-title-main');
  const subtitle = hero.querySelector('.landing-title-extension');
  const hint = hero.querySelector('.homepage-scroll-hint');
  const figureCol = intro.querySelector('.homepage-figure-col');
  const figure = intro.querySelector('.homepage-figure');
  const textCol = intro.querySelector('.homepage-text-col');
  const text = intro.querySelector('.homepage-introduction-text');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  let queued = false;
  let landingScroll = 0;
  let hidden = landing ? landing.classList.contains('is-hidden') : false;

  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
  const ease = t => { const c = clamp(t); return c * c * (3 - 2 * c); };
  const lerp = (a, b, t) => a + (b - a) * clamp(t);

  // Multi-stop continuous sky color palette (Section XXI & XXII)
  // Stop 0.0: Light morning mist (#dfecee / #cfdee1 / #b4ccd0)
  // Stop 0.35: Intro entrance
  // Stop 0.68: Intro sticky center
  // Stop 0.85: Categories approach
  // Stop 1.0: Categories deep mountain atmosphere (#2b5b68 / #164853 / #0b1d30)
  const SKY_STOPS = [
    { p: 0.0,  top: [223, 236, 238], mid: [207, 222, 225], bot: [180, 204, 208] },
    { p: 0.35, top: [207, 222, 225], mid: [180, 204, 208], bot: [154, 185, 192] },
    { p: 0.68, top: [165, 195, 202], mid: [132, 174, 181], bot: [86, 135, 146] },
    { p: 0.85, top: [95, 142, 153],  mid: [71, 123, 134],  bot: [34, 78, 90] },
    { p: 1.0,  top: [43, 91, 104],   mid: [22, 72, 83],    bot: [11, 29, 48] }
  ];

  function interpolatePalette(p) {
    const norm = clamp(p, 0, 1);
    let i = 0;
    while (i < SKY_STOPS.length - 1 && norm > SKY_STOPS[i + 1].p) i++;
    const s0 = SKY_STOPS[i];
    const s1 = SKY_STOPS[Math.min(i + 1, SKY_STOPS.length - 1)];
    const factor = s1.p === s0.p ? 0 : clamp((norm - s0.p) / (s1.p - s0.p), 0, 1);
    const interp = (c0, c1) => [
      Math.round(lerp(c0[0], c1[0], factor)),
      Math.round(lerp(c0[1], c1[1], factor)),
      Math.round(lerp(c0[2], c1[2], factor))
    ];
    return {
      top: interp(s0.top, s1.top),
      mid: interp(s0.mid, s1.mid),
      bot: interp(s0.bot, s1.bot)
    };
  }

  function rgbStr(c) {
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  }

  function update() {
    queued = false;
    if (!landing) return;
    const visible = !landing.classList.contains('is-hidden');
    if (!visible) return;

    const scroll = window.scrollY;
    const vh = window.innerHeight;
    const heroH = hero ? hero.offsetHeight : vh;
    const introTop = intro ? intro.offsetTop : heroH;
    const introH = intro ? intro.offsetHeight : vh * 1.5;
    const catTop = categories ? categories.offsetTop : introTop + introH;

    // 1. Overall Continuous Journey Progress: 0 (Hero start) -> 1 (Categories reached)
    // Section XXI - XXIV: Continuous Color & Atmosphere Interpolation
    const journeyDist = Math.max(1, catTop - vh * 0.45);
    const journeyProgress = clamp(scroll / journeyDist, 0, 1);

    // Apply continuous sky gradient variables
    const palette = interpolatePalette(journeyProgress);
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--sky-top', rgbStr(palette.top));
    rootStyle.setProperty('--sky-mid', rgbStr(palette.mid));
    rootStyle.setProperty('--sky-bottom', rgbStr(palette.bot));

    // Fog & Mountain Contrast Interpolation (Section XXIII & XXXI)
    const fogOpacity = lerp(0.65, 0.18, journeyProgress);
    const mtnContrast = lerp(1.0, 1.34, journeyProgress);
    const mtnSaturation = lerp(0.96, 1.18, journeyProgress);
    rootStyle.setProperty('--fog-opacity', fogOpacity.toFixed(3));
    rootStyle.setProperty('--mountain-contrast', mtnContrast.toFixed(3));
    rootStyle.setProperty('--mountain-saturation', mtnSaturation.toFixed(3));

    // Sync with 3D WebGL Mountain Scene (Camera forward flight, lights, drone)
    if (window.MountainScene && window.MountainScene.setJourney) {
      window.MountainScene.setJourney(journeyProgress);
    }

    // 2. Hero Scroll Exit (Section XII)
    if (!reduced.matches && hero) {
      const heroExit = clamp(scroll / (heroH * 0.85), 0, 1);
      if (hint) {
        hint.style.opacity = Math.max(0, 1 - heroExit * 4.5);
      }
      if (subtitle) {
        subtitle.style.opacity = Math.max(0, 1 - clamp((heroExit - 0.1) * 2.0));
        subtitle.style.transform = `translateY(${-heroExit * 26}px)`;
      }
      if (title) {
        title.style.opacity = Math.max(0, 1 - heroExit * 1.6);
        title.style.transform = `translateY(${-heroExit * 38}px)`;
      }
    }

    // 3. Introduction Section: 5-Phase Sticky Progression (Section XV - XX)
    if (intro) {
      const introScrollDist = Math.max(1, introH - vh);
      const stickyProgress = clamp((scroll - introTop) / introScrollDist, 0, 1);
      const introRect = intro.getBoundingClientRect();
      const inView = introRect.top < vh && introRect.bottom > 0;

      if (!reduced.matches && inView) {
        // Phase 1 (Entry): Entrance fade and scale
        const entryProgress = clamp((vh - introRect.top) / (vh * 0.45), 0, 1);
        const entryEase = ease(entryProgress);

        // Phase 2, 3, 4: Progression through sticky scene
        // Phase 2 (0.20 - 0.50): Figure subtle scale up, text subtle lift
        // Phase 3 (0.45 - 0.72): Text fades out
        // Phase 4 (0.65 - 1.0): Figure shrinks slightly (1.018 -> 0.95) and centers
        let figScale = 1.0;
        let figTranslateX = 0;
        let textOpacity = 1.0;
        let textTranslateY = 0;

        if (stickyProgress < 0.22) {
          // Phase 1
          figScale = 0.97 + entryEase * 0.03;
          textTranslateY = (1 - entryEase) * 28;
          textOpacity = entryEase;
        } else if (stickyProgress < 0.50) {
          // Phase 2: Figure zooms slightly, text lifts slightly
          const p2 = (stickyProgress - 0.22) / 0.28;
          figScale = 1.0 + p2 * 0.018;
          textTranslateY = -p2 * 18;
          textOpacity = 1.0;
        } else if (stickyProgress < 0.72) {
          // Phase 3: Text fades out, figure maintains anchor
          const p3 = (stickyProgress - 0.50) / 0.22;
          figScale = 1.018 - p3 * 0.01;
          textTranslateY = -18 - p3 * 12;
          textOpacity = Math.max(0, 1 - p3 * 1.35);
        } else {
          // Phase 4: Figure shrinks slightly and shifts toward center (desktop)
          const p4 = (stickyProgress - 0.72) / 0.28;
          figScale = 1.008 - p4 * 0.058; // 1.008 -> 0.95
          textOpacity = 0;
          if (window.innerWidth > 900) {
            // Shift figure toward viewport center
            const centerShiftVw = lerp(0, 13.5, ease(p4));
            figTranslateX = `${centerShiftVw}vw`;
          }
        }

        if (figureCol) {
          figureCol.style.transform = `translateX(${typeof figTranslateX === 'number' ? `${figTranslateX}px` : figTranslateX}) scale(${figScale.toFixed(4)})`;
          figureCol.style.opacity = entryEase;
        }
        if (textCol) {
          textCol.style.transform = `translateY(${textTranslateY.toFixed(1)}px)`;
          textCol.style.opacity = textOpacity.toFixed(3);
        }
      }
    }

    // 4. Categories Stagger Entrance & Emergence (Section XXVIII & XXX)
    if (catGroup && categories) {
      const catRect = categories.getBoundingClientRect();
      const shouldStaggerIn = catRect.top < vh * 0.82;
      if (shouldStaggerIn && !catGroup.classList.contains('stagger-in')) {
        catGroup.classList.remove('stagger-init');
        catGroup.classList.add('stagger-in');
      } else if (!shouldStaggerIn && catRect.top > vh * 1.1) {
        catGroup.classList.remove('stagger-in');
        catGroup.classList.add('stagger-init');
      }
    }

    landingScroll = scroll;
  }

  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }

  // Setup initial state for category stagger
  if (catGroup) {
    catGroup.classList.add('stagger-init');
  }

  // Card 3D tilt hover enhancement (Section XXIX)
  if (catGroup && !reduced.matches) {
    const panels = catGroup.querySelectorAll('.category-panel');
    panels.forEach(panel => {
      panel.addEventListener('pointermove', e => {
        const rect = panel.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = (-ny * 2.2).toFixed(2); // ±1.1°
        const tiltY = (nx * 2.2).toFixed(2);  // ±1.1°
        panel.style.transform = `translateY(-6px) perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }, { passive: true });

      panel.addEventListener('pointerleave', () => {
        panel.style.transform = '';
      });
    });
  }

  // View state change observer (preserves scroll position across category deep dives)
  if (landing) {
    new MutationObserver(() => {
      const nextHidden = landing.classList.contains('is-hidden');
      if (nextHidden !== hidden) {
        hidden = nextHidden;
        window.scrollTo({ top: hidden ? 0 : landingScroll, behavior: 'instant' });
        update();
      }
    }).observe(landing, { attributes: true, attributeFilter: ['class'] });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', update);

  // Initial trigger
  update();
})();

