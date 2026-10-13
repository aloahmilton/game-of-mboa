# Deploy Game of Mboa

## 1. Landing page (apps/web) on Vercel

**Important:** In Vercel project settings set:

- **Root Directory** = `apps/web`
- Framework = Vite
- Install Command = `npm install` (or leave default)
- Build Command = `npm run build`
- Output Directory = `dist`

Do **not** install from the monorepo root with pnpm for the first deploy — that caused the ERR_INVALID_THIS errors.

### Steps
1. Vercel → New Project → Import `aloahmilton/game-of-mboa`
2. Before deploy, click **Root Directory** → Edit → `apps/web`
3. Deploy

The landing page does not need the server or client packages.

## 2. Game client (later)
Deploy `apps/client` as a separate Vercel project with Root Directory `apps/client`.

## 3. Server (later)
Deploy `apps/server` on Railway / Render / Fly.io (needs a long-running Node process).

## Local run
```bash
pnpm install
cd apps/server && pnpm dev   # terminal 1
cd apps/client && pnpm dev   # terminal 2
cd apps/web && pnpm dev      # optional landing
```
