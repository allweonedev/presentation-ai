# Deploy to Easypanel

This repo is Easypanel-ready. It includes a production Dockerfile, a healthcheck route, and an example env file.

## What Easypanel needs
- Source: Connect your GitHub repo and select this project.
- Builder: Dockerfile (recommended). Root directory is the repository root.
- Port: 3000 (the app also respects the `PORT` environment variable).
- Environment Variables: Provide the ones listed below.
- Database: SQLite by default. Persist it using a volume (recommended), or point `DATABASE_URL` to Postgres if you prefer.

## Environment variables
Set these in the App -> Environment tab:

Required
- `DATABASE_URL`
- `OPENROUTER_API_KEY` (or any required provider key for your usage)
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Optional
- `GROQ_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UNSPLASH_ACCESS_KEY`
- `TAVILY_API_KEY`

See `.env.example` for a quick reference.

### SQLite persistence (recommended)
To avoid losing users/presentations on redeploys, store the SQLite file on a mounted volume:

1) Set `DATABASE_URL` to a path under `/data` inside the container, e.g.:

```
DATABASE_URL=file:/data/dev.db
```

2) In Easypanel, add a Volume mount for the App service:
- Container path: `/data`
- Volume: create/select a persistent volume

### Healthcheck
The container exposes `/api/health`. Configure Easypanel’s healthcheck to GET `http://localhost:3000/api/health`.

## Database schema (Prisma)
For the initial deploy, run the schema sync once:
- In the app container shell: `pnpm prisma db push`

You can also set up a one-off command in Easypanel after the first deployment.

## Build and run
- Dockerfile: multi-stage build; outputs a standalone Next.js server and runs `node server.js`.
- The Dockerfile sets `SKIP_ENV_VALIDATION=1` during build to avoid strict env validation.
- Exposes port `3000` and honors `PORT`.

## Images and static assets
Next.js remote images are configured in `next.config.js` via `images.remotePatterns`. Adjust if your deployment needs additional hosts.

## Troubleshooting
- Prisma/sharp native deps: We use Debian slim to avoid Alpine musl issues.
- Ensure `NEXTAUTH_URL` matches your public domain and HTTPS is enabled in Easypanel.
- If you see `Failed to find Server Action` after a deploy, hard refresh the browser (Ctrl/Cmd+Shift+R) to clear stale client bundles.
- If you see `P2003 Foreign key constraint` errors, your session user likely doesn’t exist in the DB (fresh DB). Sign out and sign back in to initialize your user record. Persisting SQLite with a volume prevents this.
- If the app boots but returns 500s, verify all required env vars and that `DATABASE_URL` is reachable from the app container.

---

## Deploy steps summary
1. Push this branch to GitHub and set it as the deployment branch (or merge to `main`).
2. In Easypanel, create a new App service:
   - Source: GitHub
   - Builder: Dockerfile
   - Root: repository root
   - Port: 3000
3. Either:
   - Persist SQLite: set `DATABASE_URL=file:/data/dev.db` and mount a volume at `/data`, or
   - Use Postgres: create a Postgres service and set its connection string to `DATABASE_URL`.
4. Fill in env vars and Deploy.
5. (One-time) Run `pnpm prisma db push` to create tables.
