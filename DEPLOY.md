# Deploy Game of Mboa

## Deploy the GAME CLIENT (recommended first playable URL)

### Vercel settings
1. Project Settings → General → **Root Directory** = `apps/client`
2. Build & Development Settings → **clear Overrides** or set:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Environment variable (optional until server is online):
   - `VITE_COLYSEUS_URL` = your Colyseus server URL (e.g. `wss://your-server.railway.app`)
4. Redeploy

Important: Do **not** leave Install Command as `cd apps/web && ...` when Root Directory is already `apps/client` or `apps/web`.

## Deploy the LANDING page

Root Directory = `apps/web`  
Install = `npm install`  
Build = `npm run build`  
Output = `dist`

## Deploy the SERVER

Colyseus needs a long-running process → Railway, Render, or Fly.io (not Vercel serverless).

```bash
cd apps/server
npm install
npm run dev
```

Set `PORT` env var. Point client `VITE_COLYSEUS_URL` to that host.
