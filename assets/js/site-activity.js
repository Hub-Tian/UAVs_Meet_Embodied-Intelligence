/* Public GoatCounter code only. No API token belongs in this file.
 * Setup and counting semantics: docs/site-activity.md.
 */
(() => {
  'use strict';

  const analyticsConfig = {
    provider: 'goatcounter',
    siteId: 'uavs',
    productionOrigin: 'https://hub-tian.github.io',
    path: '/UAVs_Meet_Embodied-Intelligence/'
  };

  const activity = document.getElementById('site-activity');
  const total = document.getElementById('site-activity-total');
  if (!activity || !total || activity.dataset.initialized) return;
  activity.dataset.initialized = 'true';

  // An unconfigured integration makes no external requests and shows no number.
  if (!analyticsConfig.siteId) {
    activity.dataset.state = 'unconfigured';
    return;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(analyticsConfig.siteId)) {
    activity.dataset.state = 'unavailable';
    console.info('Site activity data unavailable');
    return;
  }

  const endpoint = `https://${analyticsConfig.siteId}.goatcounter.com`;
  // Only the published site records a load. SPA navigation, hover, resize and
  // local previews never send extra events; GoatCounter handles session dedup.
  if (location.origin === analyticsConfig.productionOrigin &&
      (location.pathname === analyticsConfig.path ||
       location.pathname === analyticsConfig.path + 'index.html')) {
    const tracker = document.createElement('script');
    tracker.async = true;
    tracker.src = 'https://gc.zgo.at/count.js';
    tracker.dataset.goatcounter = `${endpoint}/count`;
    tracker.dataset.goatcounterSettings = JSON.stringify({
      path: analyticsConfig.path,
      no_events: true
    });
    tracker.onerror = () => console.info('Site activity tracking unavailable');
    document.head.appendChild(tracker);
  }

  async function loadTotal() {
    activity.dataset.state = 'loading';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      // TOTAL is the provider's site-wide aggregate, not the current paper.
      const response = await fetch(`${endpoint}/counter/TOTAL.json`, {
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer'
      });
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      // GoatCounter returns a string with locale-dependent thousands separators.
      const raw = String(data.count ?? '');
      if (!/^\d+(?:[, .\u00a0\u202f]\d{3})*$/.test(raw)) {
        throw new Error('Invalid count');
      }
      const count = Number(raw.replace(/[, .\u00a0\u202f]/g, ''));
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid count');
      const format = new Intl.NumberFormat('en-US');
      const finalText = format.format(count);
      total.setAttribute('aria-label', `${finalText} site total visits, session-deduplicated since tracking began`);
      activity.dataset.state = 'ready';
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || count === 0) {
        total.textContent = finalText;
        return;
      }
      const start = performance.now();
      function animate(now) {
        const progress = Math.min(1, (now - start) / 800);
        total.textContent = format.format(Math.round(count * (1 - (1 - progress) ** 3)));
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    } catch {
      activity.dataset.state = 'unavailable';
      total.textContent = '—';
      console.info('Site activity data unavailable');
    } finally {
      clearTimeout(timeout);
    }
  }

  loadTotal();
})();
