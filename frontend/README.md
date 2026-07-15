# TaskMaster Frontend

A production-ready React (Vite + TypeScript) frontend for the TaskMaster backend.

## Features
- Authentication with JWT access + refresh, persisted tokens and auto-refresh
- Role-based routes (`admin` guard)
- Tasks CRUD with search, filtering, sorting, pagination (client-side), comments
- Recurring tasks: create/list/update/delete/instances
- Voice: audio upload for transcribe/parse/create-task
- Jobs/status: reminder stats and deadline checks
- Admin tools: send welcome email
- React Query caching; optimistic invalidation
- Form validation with `react-hook-form` + `zod`
- Responsive, accessible UI with MUI 6
- Unit tests (Vitest + RTL) and E2E (Playwright)

## Getting Started

### Prerequisites
- Node 18+
- Backend running locally at `http://localhost:3000`

### Install
```bash
cd frontend
npm install
```

### Run Dev
```bash
npm run dev
```
Vite dev server will proxy `/api` to `http://localhost:3000`.

### Env Variables
Frontend reads only browser envs if needed. For API base URL, edit `vite.config.ts` proxy or set `VITE_API_BASE` and update `shared/api/client.ts` accordingly.

Backend required envs (from backend):
- `MONGODB_URL`
- `JWT_ACCESS_TOKEN`
- `JWT_REFRESH_TOKEN`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`

### Tests
```bash
npm run test
npm run e2e
```

### Build
```bash
npm run build
npm run preview
```

## Security & Performance
- Uses Authorization header; no cookies
- Auto token refresh on 401
- Limited retries; stable React Query cache
- Lazy routes possible as app grows

## Deployment
- Build static assets and serve from any CDN/static host
- Example Dockerfile (multi-stage) provided at repo root (to be added) and CI (GitHub Actions) to build/test/deploy
