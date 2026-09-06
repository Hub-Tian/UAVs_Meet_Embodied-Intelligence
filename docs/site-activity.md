# Site activity setup

The landing footer uses GoatCounter's public site-wide counter. Until configured,
it displays `—`; it never fabricates a number or trend. Tracking starts only after
setup, so earlier website traffic cannot be reconstructed from this integration.

## Activate

1. Create a dedicated site at https://www.goatcounter.com/signup for
   https://hub-tian.github.io/UAVs_Meet_Embodied-Intelligence/.
2. In GoatCounter settings, enable **Allow adding visitor counts on your website**.
   Keep **Sessions** enabled for the provider's session deduplication. The entire
   dashboard does not need to be public. No API token is required.
3. Set `analyticsConfig.siteId` in `assets/js/site-activity.js` to your actual
   GoatCounter code (the prefix of your `code.goatcounter.com` hostname), then
   commit and push to `main` using the existing Pages workflow.

## Meaning and limits

- `TOTAL VIEWS` is the dedicated site's total, session-deduplicated by GoatCounter,
  since tracking began, not unique people and not individual paper views.
- The SPA sends one normal page-load event via the official tracker. Category
  changes, paper flips, hover, resize and visibility changes do not send events.
- Only the production origin/path records visits. Local previews can read the
  configured public counter but do not record visits.
- One read of `/counter/TOTAL.json` per document load, with an 8-second timeout;
  no polling or retries. This public endpoint supports cross-origin JSON reads.
  The official demo returned HTTP 200 and `Access-Control-Allow-Origin: *` during
  integration research; the user's own endpoint still needs activation testing.
- Public results may be cached for up to four hours. Ad blockers/network failures
  may prevent collection or reads. The placeholder remains on read failure.
- TODAY, LAST 7 DAYS and the sparkline are intentionally absent: the chosen single
  public request does not supply a daily series. No artificial SVG is substituted.
- The optional count-up lasts 800 ms and stops; reduced motion shows the final
  value immediately. No chart dependency or persistent animation is added.
- Hosted GoatCounter is free for reasonable public usage, suitable for this
  academic site; very large traffic would require reviewing the service terms.

## Verification after setup

Open the published homepage once and confirm the tracker requests your own
GoatCounter domain. Verify `/counter/TOTAL.json` returns your site's count with
CORS enabled. A new site's response may be unavailable before its first visit is
processed. Allow for caching; do not repeatedly reload to inflate the count.

## Official references

- Public counters, TOTAL, JSON format and caching: https://www.goatcounter.com/help/visitor-counter
- Tracker settings and local/bot filtering: https://www.goatcounter.com/help/js
- Deduplication semantics: https://www.goatcounter.com/help/sessions
- Authenticated API (not used in the browser): https://www.goatcounter.com/help/api
- Hosted service pricing: https://www.goatcounter.com/
