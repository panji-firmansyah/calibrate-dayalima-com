# Calibrate — calibrate-dayalima.com

## Overview
Diagnostic tools platform for Daya Lima Group's talent management products. Config-driven multi-event architecture where each event has its own form, optional dashboard, and optional report.

## Tech Stack
- **Framework:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **Database:** PostgreSQL via Supabase (shared project: `piopuidmmzvewjeeezfv`)
- **Auth:** JWT cookie via `jose` library
- **Hosting:** Vercel
- **Design System:** DLG L1 (light only, Plus Jakarta Sans, #DC2626 brand red)

## Architecture
- **Config-driven events:** `src/config/events.ts` — EVENTS registry drives all routes
- **Dynamic routes:** `[event]/page.tsx` renders form based on event config
- **API routes:** `api/[event]/submit` and `api/[event]/book-a-call` — single handler, registry lookup
- **Auth middleware:** Protects `/:event/dashboard` and `/:event/report`
- **Shared Supabase:** Same project as perantauglobal.com; tables prefixed `calibrate_`

## Cowork Context
- Brand: DLG → `~/Cowork/memory/brands/dlg/`
- Design system: `~/Cowork/memory/brands/dlg/design.md`

## Key Patterns (from perantauglobal.com)
- Server-side Supabase client: `src/lib/supabase.ts`
- Shared form validation: `src/lib/form-utils.ts`
- JWT auth: `src/lib/auth.ts` (cookie: `calibrate-session`)
- Scoring/aggregation: `src/lib/scoring.ts`

## Env Variables
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
AUTH_SECRET
ADMIN_USERNAME
ADMIN_PASSWORD
```

## Current Events
- **calibrate** — Talent Diagnostic (5 questions: hiring, activation, succession, data, integration)
- **exec-breakfast** — Leadership Pulse (5 questions: awareness, komunikasi, shared leadership, knowledge flow, inklusi)
