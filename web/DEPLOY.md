# Deploying Bestmark so everyone can use it

The app is production-ready: a Next.js **standalone** build (`output: 'standalone'`)
that runs as a single `node server.js` process, with SQLite on a persistent
volume and a `/api/health` check. Pick one host below — each is one command set
away from a public URL.

> **Why a persistent-disk host (not Vercel/serverless)?** The database is SQLite
> on local disk. It needs a machine with a mounted volume that stays put. Fly.io,
> Render, and Railway all provide this on their entry tiers (~$0–5/mo). To run on
> Vercel/Netlify instead, swap SQLite for Postgres first (the queries are simple).

Required environment variables:

| Variable | Purpose | Required |
|---|---|---|
| `BESTMARK_DATA_DIR` | Where the SQLite file lives — point at the volume mount (`/data`) | Yes (set in every config below) |
| `ANTHROPIC_API_KEY` | Enables the full Claude-powered AI coach (falls back to the offline coach without it) | Optional |
| `BESTMARK_IMPORT_KEY` | Auth key timing partners use for `POST /api/import` (defaults to `demo-import-key` if unset — **set a random value in production**) | Recommended |

---

## Option A — Fly.io (recommended)

```bash
cd web
fly launch --no-deploy            # accept the included fly.toml; choose a region
fly volumes create bestmark_data --size 1 --region <your-region>
fly secrets set BESTMARK_IMPORT_KEY="$(openssl rand -hex 16)"
fly secrets set ANTHROPIC_API_KEY=sk-ant-...   # optional, for the AI coach
fly deploy
fly open                          # opens your live https URL
```

`fly.toml` already wires the `/data` volume mount and the `/api/health` check.
SQLite means **one machine** — don't scale past `min/max = 1` without moving to Postgres.

## Option B — Render.com

Push the repo to GitHub, then in Render: **New → Blueprint** and point it at the repo.
`web/render.yaml` declares the Docker service, the `/data` disk, the health check, and
prompts you for `ANTHROPIC_API_KEY` and `BESTMARK_IMPORT_KEY`. Click **Apply**.

## Option C — Railway

```bash
cd web
railway init
railway up
# In the Railway dashboard: add a Volume mounted at /data, then set variables:
#   BESTMARK_DATA_DIR=/data, BESTMARK_IMPORT_KEY=<random>, ANTHROPIC_API_KEY=sk-...
```

## Option D — Any Docker host / VPS

```bash
cd web
docker build -t bestmark .
docker volume create bestmark_data
docker run -d --name bestmark -p 80:3000 \
  -v bestmark_data:/data \
  -e BESTMARK_IMPORT_KEY="$(openssl rand -hex 16)" \
  -e ANTHROPIC_API_KEY=sk-ant-...  \
  bestmark
```

Put it behind a reverse proxy with TLS (Caddy/Nginx) so the PWA and the
mobile shell get HTTPS.

---

## After it's live

1. **Point the mobile app at it** — edit `mobile/capacitor.config.ts`
   `server.url` to your new domain, then follow `mobile/APP-STORE-GUIDE.md`.
2. **Verify** — visit `https://your-domain/api/health` → `{"ok":true,...}`.
3. **Feed in official results** — timing partners POST to
   `https://your-domain/api/import` with the `x-import-key` header (see the
   main README).
4. **Before opening sign-ups wide** — add rate limiting and email verification
   (noted in `product/product-outline.md`); consider a nightly volume backup
   (`fly ssh console` + `sqlite3 .backup`, or your host's snapshot feature).

## The database

Auto-created and seeded on first boot at `$BESTMARK_DATA_DIR/bestmark.db`
(plus WAL files). Back it up by snapshotting the volume or copying the `.db`
file. Deleting the volume resets everything to the seed data.
