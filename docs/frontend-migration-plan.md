# Frontend Migration Plan

Fecha: 2026-06-05

## Respuestas cortas

- El frontend nuevo **si tiene un design system**.
- El design system esta **separado de componentes y de funcionalidades**, aunque hoy todavia conviven algunos estilos inline dentro de vistas.
- Los tests actuales **no cubren el frontend web component en navegador**; hoy validan sobre todo el contrato backend que el frontend necesita.

## Como esta separado hoy

- Tokens visuales: `frontend/src/styles/tokens.css`
- Estilos compartidos: `frontend/src/styles/global.css`, `frontend/src/styles/shared-styles.js`
- Componentes UI reutilizables: `frontend/src/components/`
- Dominios y funcionalidad por tab: `frontend/src/domains/`
- Integracion backend: `frontend/src/services/`

Eso significa que podemos cambiar color, tipografia, spacing, radios, sombras y parte del look sin tocar la logica de negocio.

## Como migrar tab por tab desde worker-dashboard

1. `miners`
   - Ya conectado a endpoints reales.
   - Expandir hasta cubrir: trend, velocity, range ladder, inventory map, exit reality y shock tolerance.
   - Fuente monolito: `renderWorker`, `renderWorkerTrend`, `renderRangeLadder`.

2. `btc-ladder`
   - Ya conectado a dashboard, place-all, cancel-all, limit-preview, limit-execute y fill-confirm.
   - Agregada reconciliacion de estados y soporte `open`, `partial_filled`, `filled`, `closed_unknown`.
   - Siguiente capa: mejorar deteccion automatica de fill/cancel con un endpoint de historial de ordenes si Pionex lo permite.

3. `opportunities`
   - Reemplazar mocks por backend real.
   - Mantener patron TradingView + preview + execute.

4. `btc-core`
   - Conectar dashboard, buy, buy-preview y buy-execute.
   - Reusar ledger combinado con ladder.

5. `capital`
   - Conectar capital reconciliation y luego historico mensual.

6. `scalping`
   - Conectar signals, preview, execute y monitors.

7. `overview`
   - Convertirlo en agregador real de tabs conectados, no solo mock.

8. `settings`
   - Mantener credenciales locales como puente.
   - Luego mover preferencias y auditoria a backend si conviene.

## Cobertura de pruebas actual

- `tests/test_frontend_spec_domains.py`
  - Valida contratos backend inspirados por el frontend.
- `tests/test_btc_ladder_reconcile_api.py`
  - Valida el nuevo endpoint de reconciliacion ladder.

## Gaps pendientes

- Falta una suite JS/UI real para Lit components.
- Falta automatizar mas detalles de `miners`.
- Falta resolver con precision 100% la diferencia entre orden cancelada y orden llenada si Pionex no la reporta ya en open orders.
