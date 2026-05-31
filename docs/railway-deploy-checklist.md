# Railway Deploy Checklist (FastAPI Backend)

## Runtime
- `Procfile`:
  - `web: uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}`
- `railway.json`:
  - `startCommand`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - `healthcheckPath`: `/api/v1/health`

## Required Environment Variables
- `API_KEYS`: JSON array, e.g. `["key-1","key-2"]`
- `API_KEY`: Pionex API key for default backend credentials
- `API_SECRET`: Pionex API secret for default backend credentials
- `MINER_CONFIRMATION_SECRET`: strong random secret for action confirmation tokens
- `DATABASE_URL`: PostgreSQL URL (InsForge or Railway Postgres)

## Recommended Environment Variables
- `ENVIRONMENT=prod`
- `DEBUG=false`
- `SQL_ECHO=false`
- `CORS_ALLOW_ORIGINS`: explicit frontend domains (no wildcard in prod)

## Health and Docs
- Health: `GET /api/v1/health`
- Swagger UI: `/docs`
- OpenAPI JSON: `/openapi.json`

## Go-Live Validation
1. Deploy from `main` branch.
2. Confirm startup log has no DB errors.
3. Validate `GET /api/v1/health` returns `200`.
4. Validate one protected endpoint with valid `X-API-Key`.
5. Validate one protected endpoint without API key returns `401` with uniform error format.
6. Validate Pionex connectivity with a safe read endpoint.

## Post-Deploy Monitoring
- Track `X-Request-ID` in client/server logs for incident tracing.
- Monitor 5xx rate and upstream 502/503 frequency.
- Monitor DB growth for miners/snapshots/events tables and apply retention policy.
