# Browser console and deployment checks

After deploying the application and the matching reverse-proxy configuration:

- `/api/v1/auth/session` returns **401 for visitors without a valid staff session**. This is expected; the homepage makes one session probe and admin APIs remain protected. A 401 after logging in may indicate an expired or invalid cookie.
- The hero uses a generic campus image, not a photo of each named destination. The previously referenced destination images were missing. Below-the-fold portraits no longer request priority preloads.
- Cloudflare Web Analytics, if enabled, needs the exact `static.cloudflareinsights.com` script and `cloudflareinsights.com` beacon origins allowed by the app's CSP. If analytics is not wanted, disable Web Analytics/automatic beacon injection in Cloudflare and remove those two origins. An additional CSP set by Nginx, Cloudflare, or another proxy is enforced independently and must also allow them; avoid duplicate conflicting headers.
- The service worker needs to fetch same-origin resources. The application sends `/sw.js` a CSP with `connect-src 'self'`. A **report-only** policy of `connect-src 'none'` applied by Cloudflare or the hosting provider is a separate policy and still reports violations even if the app's policy permits the request. Inspect the response headers for `/sw.js` in DevTools and change/remove that external report-only policy (or scope it away from the worker). The browser's old worker may remain active until the updated worker is installed; reload after deployment.
- Unsupported Permissions-Policy features are omitted by the app and the included Nginx config. If warnings persist, inspect all response headers and remove obsolete directives from any other edge/proxy configuration. Camera and geolocation remain disabled; same-origin microphone access is retained for the admin speech feature.

Useful checks (replace the hostname if required):

```sh
curl -sSI https://www.alaminn.info/ | grep -iE 'content-security-policy|permissions-policy'
curl -sSI https://www.alaminn.info/sw.js | grep -iE 'content-security-policy|cache-control'
curl -sS -o /dev/null -w '%{http_code}\n' 'https://www.alaminn.info/_next/image?url=%2Fgallery%2Fcampus-hero.jpg&w=640&q=75'
```
