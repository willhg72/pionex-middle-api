# API Contract v1 (Frozen)

Fecha de congelamiento: 2026-05-31  
Estado: `FROZEN` (base para frontend rediseñado y deploy Railway)  
Exchange soportado: `Pionex` (Toobit retirado)

## Reglas de versionado

- Contrato canónico: rutas bajo `/api/v1/...`.
- Rutas bajo `/api/...` se mantienen temporalmente como alias legacy para compatibilidad.
- Cambios breaking solo vía `/api/v2`.

## Seguridad

- Esquema actual: `API Key`.
- Header requerido: `X-API-Key: <key>`.
- Multi-tenant: resolución de `tenant_id` por API key en backend.

## Endpoints canónicos `/api/v1`

### Health

- `GET /api/v1/health`

### Market / Analyzer

- `GET /api/v1/market/ticker24h`
- `GET /api/v1/market/ohlc`
- `GET /api/v1/analyzer/market/klines`
- `GET /api/v1/analyzer/grid/range-velocity`

### Opportunities

- `GET /api/v1/dashboard/opportunities`
- `POST /api/v1/dashboard/opportunities/create-preview`
- `POST /api/v1/dashboard/opportunities/create`
- `POST /api/v1/dashboard/opportunities/technical-gate`

### Miners

- `GET /api/v1/dashboard/miners`
- `POST /api/v1/dashboard/miners`
- `GET /api/v1/dashboard/miners/account-balance`
- `POST /api/v1/dashboard/miners/account-balance`
- `GET /api/v1/dashboard/miners/history`
- `GET /api/v1/dashboard/miners/events`
- `POST /api/v1/dashboard/miners/close-preview`
- `POST /api/v1/dashboard/miners/close`
- `POST /api/v1/dashboard/miners/backfill-closed`
- `POST /api/v1/dashboard/miners/stabilization-check`
- `POST /api/v1/dashboard/miners/regrid-preview`
- `POST /api/v1/dashboard/miners/regrid`

### Scalping

- `GET /api/v1/scalping/signals`
- `POST /api/v1/scalping/real-preview`
- `POST /api/v1/scalping/real-execute`
- `GET /api/v1/scalping/real-monitor/{monitor_id}`
- `GET /api/v1/scalping/real-monitors`
- `POST /api/v1/scalping/spot-preview`
- `POST /api/v1/scalping/spot-execute`
- `GET /api/v1/scalping/futures-capabilities`

### Discovery

- `GET /api/v1/dashboard/discovery`

### BTC Core

- `GET /api/v1/dashboard/btc-core`
- `POST /api/v1/dashboard/btc-core/buy-preview`
- `POST /api/v1/dashboard/btc-core/buy-execute`
- `POST /api/v1/dashboard/btc-core/buy`

### BTC Ladder

- `GET /api/v1/dashboard/btc-ladder`
- `GET /api/v1/dashboard/btc-ladder/price`
- `POST /api/v1/dashboard/btc-ladder/place-all`
- `POST /api/v1/dashboard/btc-ladder/cancel-all`
- `POST /api/v1/dashboard/btc-ladder/limit-preview`
- `POST /api/v1/dashboard/btc-ladder/limit-execute`
- `POST /api/v1/dashboard/btc-ladder/fill-confirm`

### Telemetry

- `POST /api/v1/telemetry/events`

## Alias legacy `/api` (compatibilidad temporal)

- `GET /api/dashboard/discovery`
- `POST /api/dashboard/opportunities/technical-gate`
- `POST /api/dashboard/miners/backfill-closed`
- `POST /api/dashboard/workers/stabilization-check`
- `POST /api/dashboard/workers/regrid-preview`
- `POST /api/dashboard/workers/regrid`
- `GET /api/dashboard/btc-core`
- `POST /api/dashboard/btc-core/buy-preview`
- `POST /api/dashboard/btc-core/buy-execute`
- `POST /api/dashboard/btc-core/buy`
- `GET /api/dashboard/btc-ladder`
- `GET /api/dashboard/btc-ladder/price`
- `POST /api/dashboard/btc-ladder/place-all`
- `POST /api/dashboard/btc-ladder/cancel-all`
- `POST /api/dashboard/btc-ladder/limit-preview`
- `POST /api/dashboard/btc-ladder/limit-execute`
- `POST /api/dashboard/btc-ladder/fill-confirm`
- `GET /api/scalping/signals`
- `POST /api/scalping/real-preview`
- `POST /api/scalping/real-execute`
- `GET /api/scalping/real-monitor/{monitor_id}`
- `GET /api/scalping/real-monitors`
- `POST /api/scalping/spot-preview`
- `POST /api/scalping/spot-execute`
- `GET /api/scalping/futures-capabilities`

## Criterios de aceptación de contrato

- OpenAPI publicada y accesible en deploy (`/openapi.json`).
- Swagger UI accesible (`/docs`).
- Errores uniformes (4xx/5xx) con estructura consistente.
- Flujos críticos `preview -> execute` cubiertos por tests.
