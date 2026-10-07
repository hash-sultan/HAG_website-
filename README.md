# Huivex Auto Global (HAG) — Web Portal & API

Huivex Auto Global, Ltd. (陕西汇驰天下汽车贸易有限公司) is a premier automobile sourcing and export service platform headquartered in Xi’an, China. This repository contains the public export portal, backend API service, and database schemas.

---

## Architecture Overview

- **Frontend (`artifacts/huivex-auto`)**: Fast Vite + React 19 application with full bilingual support (English & Simplified Chinese), responsive design tuned for desktop and mobile, interactive vehicle catalog, and quote inquiry submission.
- **Backend API (`artifacts/api-server`)**: Express-based Node.js service providing rate-limited quote persistence, input validation via Zod, and transactional email notifications via Resend.
- **Database & Schemas (`lib/db`, `lib/api-zod`, `lib/api-spec`)**: PostgreSQL managed with Drizzle ORM, OpenAPI v3 specification, and shared Zod/TypeScript types across packages.

---

## Prerequisites

- **Node.js**: v20+ or v24 LTS
- **Package Manager**: `pnpm` (via Corepack or standalone)
- **Container Runtime**: Docker & Docker Compose (for local PostgreSQL)

---

## Getting Started

### 1. Environment Configuration

Copy the example environment configuration into `.env`:

```bash
cp .env.example .env
```

Review and populate the variables in `.env`:
- `DATABASE_URL`: Connection string for PostgreSQL (defaults to `postgres://postgres:postgres@localhost:5432/huivex_auto`)
- `PORT`: API server port (default: `3000`)
- `RESEND_API_KEY`: API key for email delivery (optional in local dev)
- `CONTACT_FROM_EMAIL`: Sender address for quote notifications
- `CONTACT_TO_EMAIL`: Internal inbox for new inquiry alerts

### 2. Start the Local Database

Launch PostgreSQL via Docker Compose:

```bash
docker compose up -d
```

Apply schema changes and migrations to the local PostgreSQL database using Drizzle Kit:

```bash
pnpm --filter @workspace/db run push
```

### 3. Start the API Server

From the repository root:

```bash
pnpm --filter @workspace/api-server run dev
```

The server will start on `http://localhost:3000` (or `PORT` specified in `.env`).

### 4. Start the Frontend Website

In a separate terminal:

```bash
pnpm --filter @workspace/huivex-auto run dev
```

The frontend dev server starts on `http://localhost:19966` (or `http://localhost:5173`).

### 5. Accessing from Mobile Phones on the Local Network

The Vite dev server binds to `0.0.0.0` (`--host 0.0.0.0`), allowing testing on real mobile devices connected to the same Wi-Fi network:

1. Determine your computer's local IP address (e.g. `ipconfig` on Windows or `ifconfig`/`ip a` on macOS/Linux).
2. Open your phone's browser and navigate to `http://<YOUR_LOCAL_IP>:19966`.
3. The API server accepts requests over the local network via standard CORS rules.

---

## Running Tests & Verification

### TypeScript Typecheck
Run type validation across all workspaces:

```bash
pnpm --filter @workspace/huivex-auto run typecheck
pnpm --filter @workspace/api-server run typecheck
```

### End-to-End Tests (Playwright)
Run the automated Playwright test suite (33 tests covering hero short-landscape viewports, touch carousels, mobile catalog grids, draft vehicle 404s, and unlisted vehicle quotes):

```bash
pnpm --filter @workspace/huivex-auto run test:e2e
```

---

## Documentation

Project documentation and launch tracking reside in the [`docs/`](file:///c:/Huivex_web/HAG_website-/docs/) directory:

- [docs/HAG_Website_PRD.md](file:///c:/Huivex_web/HAG_website-/docs/HAG_Website_PRD.md): Product Requirements Document and technical specifications.
- [docs/PROGRESS.md](file:///c:/Huivex_web/HAG_website-/docs/PROGRESS.md): Implementation history, verified bug fixes, test coverage, and the pre-launch checklist.
- [docs/OPEN_QUESTIONS.md](file:///c:/Huivex_web/HAG_website-/docs/OPEN_QUESTIONS.md): Client confirmations, brand rights, email domain verification, and launch sign-offs.
