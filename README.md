# Madhavam — Next.js frontend

TypeScript Next.js (App Router) port of the Madhavam static site. Visuals and behaviour match the root HTML/CSS/JS; no database or admin in this pass.

## Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Source |
| --- | --- |
| `/` | `index.html` |
| `/contact` | `contact.html` |
| `/terms` | `terms.html` |
| `/disclaimer-privacy` | `disclaimer-privacy.html` |

Old `.html` URLs redirect permanently to these paths.

## Notes

- Styles: `src/styles/style.css` (from root `css/style.css`)
- Assets: `public/assets/`
- Plot data: `src/data/plots.ts` (later admin can replace this)
- No Next.js starter favicon or scaffold SVGs are included
