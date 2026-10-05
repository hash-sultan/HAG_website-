# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

Prerequisites: Node.js 24 and pnpm. Copy `.env.example` to `.env` and set at least `DATABASE_URL`.

- `docker compose up -d` — local Postgres (`postgres://hag:hag@127.0.0.1:5432/hag`)
- `pnpm install` — install workspace dependencies
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — API server (default port 5000)
- `pnpm --filter @workspace/huivex-auto run dev` — Vite frontend (default port 5173; proxies `/api` to the API)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string. Optional: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `PORT`, `BASE_PATH`, `LOG_LEVEL`.

## Deploy behind a reverse proxy

The quote endpoint rate-limits by client IP (`req.ip`). Direct connections already use the TCP peer address. When the API sits behind nginx, Caddy, Cloudflare, or a load balancer, those hops all share one socket address unless Express trusts the proxy.

1. Terminate TLS at the proxy and forward to the API over HTTP (or another internal port).
2. Have the proxy set `X-Forwarded-For`, `X-Forwarded-Proto`, and `X-Forwarded-Host`. Overwrite client-supplied `X-Forwarded-For`; do not append an untrusted value in front of the real client IP.
3. Set `TRUST_PROXY=1` (or `true`) on the API so Express trusts the first proxy hop. Use a higher integer only if there are multiple trusted hops (for example CDN + load balancer + nginx).
4. Do **not** enable `TRUST_PROXY` when the API is reachable directly from the public internet; clients could spoof `X-Forwarded-For` and bypass or poison the rate limiter.
5. Vite’s `/api` proxy is for local development only. In production, serve the built frontend and `/api` on the same origin through the reverse proxy.

Example nginx location:

```
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
```

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
