# Site activity setup

The landing footer uses the `uavs` GoatCounter site's public site-wide counter.
Tracking endpoint: https://uavs.goatcounter.com/count
Total endpoint: https://uavs.goatcounter.com/counter/TOTAL.json
Loading or failed reads display `—`. Earlier traffic cannot be reconstructed.

## Configuration

`analyticsConfig.siteId` is configured as `uavs`. In GoatCounter settings,
**Allow adding visitor counts on your website** must be enabled for public reads.
Sessions follow the site's settings. The dashboard need not be public, and no API
token is used. The existing `main` push workflow publishes this configuration.

## Meaning and limits

- `TOTAL VISITS` is the dedicated site's total, session-deduplicated by GoatCounter,
  since tracking began, not unique people and not individual paper views.
- The SPA sends one normal page-load event via the official tracker. Category
  changes, paper flips, hover, resize and visibility changes do not send events.
- Only the production origin/path records visits. Local previews can read the
  configured public counter but do not record visits.
- One read of `/counter/TOTAL.json` per document load, with an 8-second timeout;
  no polling or retries. This public endpoint supports cross-origin JSON reads.
  The `uavs` public endpoint was verified with HTTP 200 and
  `Access-Control-Allow-Origin: *` after enabling the public counter setting.
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
