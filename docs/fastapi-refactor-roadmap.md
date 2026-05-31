# FastAPI Professional Refactor Roadmap (InsForge-first)

## Objective
Migrate from monolithic `main.py` to a production-ready FastAPI backend with organized routers, API key security, and operational persistence on PostgreSQL (InsForge) with Railway deployment.

## Current status (completed in this step)
- New modular backend scaffold in `app/`.
- API versioning base: `/api/v1`.
- Swagger/OpenAPI enabled.
- API key guard enabled for protected routes.
- Async SQLAlchemy session and startup DB initialization.
- First persistence endpoint: `POST /api/v1/telemetry/events`.
- Railway bootstrap files: `Procfile`, `railway.json`, `.env.example`.

## Migration phases
1. Core bootstrap stabilization
- Add unified exception handlers.
- Add request id and structured logging middleware.
- Add OpenAPI tags and examples for existing contracts.

2. Endpoint migration by domain
- `health`, `market`, `analyzer` (read-only first).
- `dashboard` (miners, balances, close preview/execute).
- `btc-core` and `btc-ladder`.
- `scalping` flows.
- `opportunities` and creation preview/execute.
- `webhooks`.

3. Airtable to InsForge SQL migration
- Replace Airtable reads/writes with repositories.
- Keep optional dual-write fallback for 1-2 weeks.
- Implement reconciliation checks.

4. Operational data model
- `miners`, `miner_snapshots`, `miner_events`.
- `financial_snapshots`.
- `scalping_trades`, `scalping_monitors`.
- `btc_core_ledger`, `btc_ladder_orders`.
- `audit_logs`, `idempotency_keys`.

5. Production hardening
- CORS per environment.
- Rate limiting on write-sensitive endpoints.
- Retry strategy and timeout policies for exchange integrations.
- Test coverage parity with legacy behavior.

6. Cutover
- Frontend switches base URL to new `app.main` backend.
- Keep backward compatibility routes temporarily.
- Retire legacy monolith after verification.

## Notes
- Local development can use SQLite.
- Cloud target should use InsForge PostgreSQL via `DATABASE_URL`.
- API keys remain valid for PoC SaaS stage; JWT can be added later.

