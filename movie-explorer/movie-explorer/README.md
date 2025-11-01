# Movie Explorer (React + Vite)

A simple TMDb movie browser with search, sort, and pagination in a 4×4 grid.

## Quick Start
```bash
npm i
cp .env.example .env   # then edit .env and paste your TMDb API key value
npm run dev
```
Open http://localhost:5173

## Build
```bash
npm run build
```
The production assets will be in `dist/`.

## Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: set `VITE_TMDB_API_KEY` to your TMDb key.

## Notes
- API key is read from `import.meta.env.VITE_TMDB_API_KEY` (Vite convention).
- Client-side sorting is applied to the first 16 results to match the 4×4 layout.
