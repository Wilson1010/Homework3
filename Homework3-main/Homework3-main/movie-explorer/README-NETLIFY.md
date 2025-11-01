# Deploying to Netlify

## Option A — Connect to Git (recommended)
1. Push this folder to GitHub/GitLab/Bitbucket.
2. In Netlify → **Add new site → Import an existing project**.
3. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. In **Site settings → Environment variables**, add:
   - `VITE_TMDB_API_KEY` = your TMDb key
5. Deploy.

## Option B — Drag-and-drop (no Git)
1. Build locally:
   ```bash
   npm i
   cp .env.example .env     # paste your TMDb key
   npm run build
   ```
2. Upload the `dist/` folder to Netlify at **Add new site → Deploy manually**.

## Notes
- `public/_redirects` is included so client-side routing works if you add React Router later.
- Do **not** commit a real `.env`. Use the Netlify environment variable instead.
