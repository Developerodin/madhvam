# Madhavam local audit — 2026-10-23

Scope: local Mongo + `npm run build` / `npm start`. Fixes applied for **Critical → Medium**.

## Verdict

| Area | Result |
| --- | --- |
| DB | Seeded; connect works; enquiry 503 path present when Mongo down |
| Auth | Login/cookie/me/logout OK; unauth admin APIs 401; pages redirect to login |
| Form → admin | POST enquiry → Mongo → `/admin/enquiries` list + PATCH status |
| Public pages | `/`, `/contact`, `/terms`, `/disclaimer-privacy` 200 |
| SEO | Title/canonical/OG/JSON-LD/sitemap/robots/`llms.txt` OK |
| HTTPS (local) | HTTP localhost expected; prod URLs `https://`; HSTS + CSP on prod build |
| Tests | `npm test` — 11 passed; lint 0 errors; build OK |

## Findings

### Fixed (Critical / High / Medium)

| Sev | Finding | Fix |
| --- | --- | --- |
| High | No security headers (CSP/XFO/nosniff/Referrer/Permissions; no HSTS in prod) | [`next.config.ts`](../next.config.ts) `headers()` |
| High | No rate limit on login / public enquiry | [`src/lib/security/rateLimit.ts`](../src/lib/security/rateLimit.ts) |
| High | Stored XSS via FAQ/document HTML | [`sanitize-html`](../src/lib/security/sanitizeHtml.ts) on admin FAQ/docs writes |
| High | `/api/admin/*` only gated in handlers | Middleware matcher + 401 JSON |
| Medium | Login JSON returned JWT (XSS/token theft surface) | Cookie-only session response |
| Medium | Enquiry spam / bots | Honeypot field + rate limit |
| Medium | Missing favicon / icons | Root `metadata.icons` → burgundy logo |
| Medium | Weak FAQ/docs write validation | Zod + sanitization on FAQ/documents admin routes |
| Medium | Lint errors (setState-in-effect / `@ts-nocheck`) | Header/AdminShell/WhatsAppFloat/Arrival/Gallery/initPlots |

### Remaining Low / Info (not fixed)

| Sev | Finding | Notes |
| --- | --- | --- |
| Low | Cookie `path: "/"` | Sent on all routes; acceptable for this app |
| Low | In-memory rate limit | Per-process; use Redis/edge for multi-instance |
| Low | `<img>` vs `next/image` warnings | Perf polish |
| Low | Asset filenames with spaces | Fragile URLs under `public/assets/` |
| Low | No enquiry email / export | Product gap; leads only in Mongo + admin UI |
| Info | Force HTTPS | Host/CDN responsibility; app sets HSTS when `NODE_ENV=production` |
| Info | GSC / Semrush | Out of local scope |
| Info | Default `.env.example` secrets | Must be rotated in production |
| Info | Next middleware → “proxy” deprecation notice | Framework migration later |

## Smoke evidence (post-fix)

- Public + legal pages: 200
- Enquiry create → admin list: pass
- Login without `token` in JSON body: pass
- Unauthenticated `/api/admin/*`: 401 (middleware)
- Security headers present on `/` in production start
- `npm test`: 11 passed
