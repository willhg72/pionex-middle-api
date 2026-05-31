# Cutover Checklist v1 (Signed)

Fecha: 2026-05-31

## 1. Contrato API

- [x] Contrato `/api/v1` congelado en `docs/api-contract-v1.md`.
- [x] Alias legacy `/api` documentados para transición.

## 2. Seguridad y tenancy

- [x] Autenticación por API Key activa.
- [x] Aislamiento por `tenant_id` aplicado en persistencia crítica.

## 3. Persistencia

- [x] Flujo SQL activo (sin dependencia de Airtable en runtime).
- [x] Base lista para operar en InsForge cloud.
- [x] Eventos operacionales/transaccionales persistidos por tenant.

## 4. Calidad y pruebas

- [x] OpenAPI con ejemplos en dominios críticos.
- [x] Tests API por dominio disponibles.
- [x] E2E críticos `preview -> execute` implementados con mocks.

## 5. Deploy Railway

- [x] Configuración de backend preparada (Procfile + vars).
- [x] Health endpoint listo para smoke.
- [x] Smoke final ejecutado en entorno de release local (previo a prod Railway).

## 6. Operación

- [x] Scope exchange reducido a Pionex.
- [x] Terminología actualizada a `miners`.

## Firmas

- Responsable técnico (implementación): Codex (GPT-5) - **signed**
- Responsable producto/owner: willhg72 - **pending manual sign-off**
