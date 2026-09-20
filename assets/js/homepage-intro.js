/* Native scrolling, with no wheel interception or animation dependency. */
(() => {
  const landing = document.getElementById('category-landing-view');
  const hero = document.getElementById('homepage-hero');
  const intro = document.getElementById('homepage-introduction');
  const categories = document.querySelector('.homepage-existing-categories');
  const title = hero.querySelector('.landing-title-main');
  const subtitle = hero.querySelector('.landing-title-extension');
  const hint = hero.querySelector('.homepage-scroll-hint');
  const figure = intro.querySelector('.homepage-figure');
  const text = intro.querySelector('.homepage-introduction-text');
  const content = intro.querySelector('.homepage-introduction-inner');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  let landingScroll = 0;
  let hidden = landing.classList.contains('is-hidden');
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

  function update() {
    queued = false;
    const visible = !landing.classList.contains('is-hidden');
    const progress = visible ? clamp(-hero.getBoundingClientRect().top / hero.offsetHeight) : 0;
    const rect = content.getBoundingClientRect();
    const entry = ease((innerHeight * 0.95 - rect.top) / (innerHeight * 0.35));
    const textEntry = ease((innerHeight * 0.88 - rect.top) / (innerHeight * 0.35));
    const exit = ease((innerHeight * 0.4 - rect.bottom) / (innerHeight * 0.4));
    const light = ease(categories.getBoundingClientRect().top / (innerHeight * 0.55));
    document.body.classList.toggle('homepage-prelude', visible);
    document.body.style.setProperty('--prelude-light', visible ? light : 0);
    document.body.style.setProperty('--prelude-scale', reduced.matches ? 1 : 1 + (1 - progress) * 0.025);
    title.style.opacity = reduced.matches ? '' : 1 - clamp(progress * 1.8);
    title.style.transform = reduced.matches ? '' : `translateY(${-progress * 50}px) scale(${1 - progress * 0.035})`;
    subtitle.style.opacity = reduced.matches ? '' : 1 - clamp((progress - 0.12) * 1.9);
    subtitle.style.transform = reduced.matches ? '' : `translateY(${-progress * 28}px)`;
    hint.style.opacity = reduced.matches ? '' : 1 - clamp(progress * 5);
    figure.style.opacity = reduced.matches ? '' : entry * (1 - exit);
    figure.style.transform = reduced.matches ? '' : `translate(${innerWidth > 900 ? (1 - entry) * -24 + exit * 40 : 0}px, ${(1 - entry) * 38 - exit * 24}px) scale(${0.96 + entry * 0.04 - exit * 0.035})`;
    text.style.opacity = reduced.matches ? '' : textEntry * (1 - exit);
    text.style.transform = reduced.matches ? '' : `translateY(${(1 - textEntry) * 42 - exit * 32}px)`;
    if (visible) landingScroll = scrollY;
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }
  // The original router hides this whole view. Preserve its scroll position
  // now that the homepage is taller, without changing category click handlers.
  new MutationObserver(() => {
    const nextHidden = landing.classList.contains('is-hidden');
    if (nextHidden !== hidden) {
      hidden = nextHidden;
      window.scrollTo({ top: hidden ? 0 : landingScroll, behavior: 'instant' });
      update();
    }
  }).observe(landing, { attributes: true, attributeFilter: ['class'] });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', update);
  update();
})();
