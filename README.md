<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3dc9bc9b-4e52-47e5-9e71-30dbfc7b5044

## Run Locally

**Prerequisites:** Node.js (v18+ or v20+)

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (optional for standard client gameplay)
3. Run the app:
   `npm run dev`

## Deploy to Vercel

This repository is pre-configured for one-click Vercel hosting with `vercel.json` and `.npmrc`:

1. **Import the repository** into Vercel.
2. **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Click **Deploy**. The `vercel.json` configuration automatically sets up SPA URL rewrites and PWA service worker caching rules.
