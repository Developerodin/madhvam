# Deploy Madhavam (Next.js + MongoDB) on AWS

This app expects a MongoDB connection string. Local development uses Docker; production should use MongoDB Atlas, Amazon DocumentDB, or MongoDB on EC2/ECS.

## Environment variables

Copy `.env.example` and set:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Production Mongo URI |
| `JWT_SECRET` | Long random secret for admin JWT |
| `ADMIN_EMAIL` | Single admin login email |
| `ADMIN_PASSWORD` | Admin password (used by seed only; change after first login if desired) |

## First-time content load

**Option A — seed from code (recommended first deploy)**

```bash
cd madhvam
npm ci
npm run seed
```

This upserts site settings, plots, gallery, FAQs, documents, page sections, and creates the admin user.

**Option B — import exported JSON**

On a machine that already has a seeded DB:

```bash
npm run export:data
# produces exports/madhavam-seed.json
```

On the server (after setting `MONGODB_URI`):

```bash
npm run import:data exports/madhavam-seed.json
npm run seed   # still run once to create/update the admin user
```

Admin accounts are **not** included in the export file.

## Run the app

```bash
npm run build
npm start
```

Admin UI: `/admin/login`  
Public site: `/`

## Local Mongo (developer)

```bash
docker compose up -d
cp .env.example .env.local   # or use the committed local defaults carefully
npm run seed
npm run dev
```

## Notes for seniors

- Do not copy local Docker volumes to production; use seed/import.
- Keep `JWT_SECRET` and `ADMIN_PASSWORD` in Secrets Manager / Parameter Store.
- Legal pages (`/terms`, `/disclaimer-privacy`) remain code-managed in v1.
- Do not invent prices beyond the seeded tentative rate fields.
