# Frontend Route Mapping (Legacy -> Canonical v1)

Fecha: 2026-05-31  
Objetivo: traducir los llamados del frontend legado (`worker-dashboard.html`) al contrato canónico actual (`/api/v1/...`).

## Regla general

- Contrato objetivo para frontend nuevo: usar solo `/api/v1/...`.
- Rutas `/api/...` quedan como alias temporales en algunos dominios.

## Mapeo por funcionalidad (6 tabs)

| Frontend legado | Backend canónico actual | Estado alias legacy |
|---|---|---|
| `GET /api/dashboard/workers` | `GET /api/v1/dashboard/miners` | `NO` alias directo (debe migrar) |
| `POST /api/dashboard/workers` | `POST /api/v1/dashboard/miners` | `NO` alias directo (debe migrar) |
| `GET /api/dashboard/account-balance` | `GET /api/v1/dashboard/miners/account-balance` | `NO` alias directo (debe migrar) |
| `POST /api/dashboard/account-balance` | `POST /api/v1/dashboard/miners/account-balance` | `NO` alias directo (debe migrar) |
| `POST /api/dashboard/workers/close-preview` | `POST /api/v1/dashboard/miners/close-preview` | `NO` alias directo (debe migrar) |
| `POST /api/dashboard/workers/close` | `POST /api/v1/dashboard/miners/close` | `NO` alias directo (debe migrar) |
| `GET /api/dashboard/discovery` | `GET /api/v1/dashboard/discovery` | `SI` alias activo |
| `GET /api/dashboard/opportunities` | `GET /api/v1/dashboard/opportunities` | `NO` alias directo (debe migrar) |
| `POST /api/dashboard/opportunities/create-preview` | `POST /api/v1/dashboard/opportunities/create-preview` | `NO` alias directo (debe migrar) |
| `POST /api/dashboard/opportunities/create` | `POST /api/v1/dashboard/opportunities/create` | `NO` alias directo (debe migrar) |
| `POST /api/dashboard/opportunities/technical-gate` | `POST /api/v1/dashboard/opportunities/technical-gate` | `SI` alias activo |
| `GET /api/scalping/signals` | `GET /api/v1/scalping/signals` | `SI` alias activo |
| `POST /api/scalping/real-preview` | `POST /api/v1/scalping/real-preview` | `SI` alias activo |
| `POST /api/scalping/real-execute` | `POST /api/v1/scalping/real-execute` | `SI` alias activo |
| `GET /api/scalping/real-monitors` | `GET /api/v1/scalping/real-monitors` | `SI` alias activo |
| `POST /api/scalping/spot-preview` | `POST /api/v1/scalping/spot-preview` | `SI` alias activo |
| `POST /api/scalping/spot-execute` | `POST /api/v1/scalping/spot-execute` | `SI` alias activo |
| `GET /api/dashboard/btc-core` | `GET /api/v1/dashboard/btc-core` | `SI` alias activo |
| `POST /api/dashboard/btc-core/buy` | `POST /api/v1/dashboard/btc-core/buy` | `SI` alias activo |
| `POST /api/dashboard/btc-core/buy-preview` | `POST /api/v1/dashboard/btc-core/buy-preview` | `SI` alias activo |
| `POST /api/dashboard/btc-core/buy-execute` | `POST /api/v1/dashboard/btc-core/buy-execute` | `SI` alias activo |
| `GET /api/dashboard/btc-ladder` | `GET /api/v1/dashboard/btc-ladder` | `SI` alias activo |
| `GET /api/dashboard/btc-ladder/price` | `GET /api/v1/dashboard/btc-ladder/price` | `SI` alias activo |
| `POST /api/dashboard/btc-ladder/place-all` | `POST /api/v1/dashboard/btc-ladder/place-all` | `SI` alias activo |
| `POST /api/dashboard/btc-ladder/cancel-all` | `POST /api/v1/dashboard/btc-ladder/cancel-all` | `SI` alias activo |
| `POST /api/dashboard/btc-ladder/limit-preview` | `POST /api/v1/dashboard/btc-ladder/limit-preview` | `SI` alias activo |
| `POST /api/dashboard/btc-ladder/limit-execute` | `POST /api/v1/dashboard/btc-ladder/limit-execute` | `SI` alias activo |
| `POST /api/dashboard/btc-ladder/fill-confirm` | `POST /api/v1/dashboard/btc-ladder/fill-confirm` | `SI` alias activo |
| `GET /api/analyzer/market/klines` | `GET /api/v1/analyzer/market/klines` | `NO` alias directo (debe migrar) |
| `GET /api/market/ohlc` | `GET /api/v1/market/ohlc` | `NO` alias directo (debe migrar) |
| `GET /api/market/ticker24h` | `GET /api/v1/market/ticker24h` | `NO` alias directo (debe migrar) |

## Recomendación de cutover frontend

1. Cambiar `API_BASE_URL` y unificar todo a `/api/v1`.
2. Migrar primero rutas sin alias (`miners`, `opportunities`, `analyzer`, `market`).
3. Mantener temporalmente alias legacy solo para `discovery`, `scalping`, `btc-core`, `btc-ladder`.
4. Cuando frontend nuevo esté estable, retirar alias `/api/...` en backend.

## Seguridad en llamados frontend

- Header requerido en endpoints protegidos: `X-API-Key`.
- Para PoC actual:
  - tenant normal: enviar `api_key/api_secret` del tenant en flujos de ejecución.
  - owner (`OWNER_API_KEY`): puede usar fallback de credenciales backend.
