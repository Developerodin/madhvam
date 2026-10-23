# Madhavam — Next.js + MongoDB admin

TypeScript Next.js (App Router) port of the Madhavam marketing site with:

- MongoDB-backed content (seeded from current site data)
- JWT single-admin panel at `/admin`
- Public APIs under `/api/public/*`
- Vitest suites for auth/API and canonical brochure facts

## Prerequisites

- Node.js ≥ 20.9
- Local Mongo: Docker **or** `npm run mongo:local` (no Docker)

## Setup

```bash
cd madhvam
npm install
cp .env.example .env.local

# Terminal A — Mongo (pick one):
npm run mongo:local          # no Docker; keep this running
# or: docker compose up -d

# Terminal B:
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Contact form submissions are saved to Mongo and listed under **Admin → Enquiries**.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run mongo:local` | Start local Mongo without Docker (keep running) |
| `npm run seed` | Upsert current site data + admin user |
| `npm run export:data` | Write `exports/madhavam-seed.json` for handoff |
| `npm run import:data` | Import that JSON into `MONGODB_URI` |
| `npm test` | Auth, enquiry, and canonical content tests |
| `npm run test:canonical` | Canonical facts only |

## Deploy handoff

See [`docs/DEPLOY-DB.md`](docs/DEPLOY-DB.md). Point `MONGODB_URI` at Atlas/DocumentDB/EC2 Mongo, run seed or import, then `npm run build && npm start`.

## Routes

| Path | Source |
| --- | --- |
| `/` | Home (DB-backed content) |
| `/contact` | Contact + enquiry form → Mongo |
| `/admin` | Admin dashboard (JWT) |
| `/terms`, `/disclaimer-privacy` | Legal (static in code) |

## Notes

- Styles: `src/styles/style.css`
- Assets: `public/assets/`
- Seed sources remain in `src/data/*` and `src/lib/site.ts`; runtime reads Mongo after seed
- Do not invent a public price list beyond seeded tentative rates
