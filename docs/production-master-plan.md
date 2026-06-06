# Production Master Plan

Fecha: 2026-06-05

Objetivo: llevar este proyecto a producción como reemplazo y evolución del `worker-dashboard`, manteniendo compatibilidad operativa, mejorando la UX, y cerrando todos los gaps de autenticación, tenants, datos, frontend, despliegue y observabilidad.

## Estado actual

- Repo Git ya existe y tiene remoto:
  - `origin`: `https://github.com/willhg72/pionex-middle-api.git`
- Backend actual:
  - FastAPI multi-tenant por `X-API-Key`
  - Persistencia SQL sobre InsForge
  - Railway checklist ya creado
- Frontend nuevo:
  - Servido desde `/dashboard`
  - `miners` conectado en modo live-first
  - `btc-ladder` conectado en modo live-first
  - El resto de tabs sigue mayormente en mock
- Data legacy:
  - Hay importador de backup local en `scripts/import_dashboard_backup.py`
  - Falta estrategia completa de migración desde Airtable y `localStorage`

## Decisión de producto

La meta no es copiar ciegamente el `worker-dashboard`. La meta es:

1. Emular las funcionalidades críticas del monolito.
2. Mejorarlas donde hoy hay deuda técnica o UX frágil.
3. Llevarlas a un modelo multi-tenant real con auth, persistencia y despliegue reproducible.

## Bloques de trabajo

### 1. Auth, sign-in, sign-up y tenants

Objetivo:
- Reemplazar el acceso por API key manual como mecanismo primario de UI.
- Tener registro/login real por tenant.
- Mantener compatibilidad con `X-API-Key` para backend y automatizaciones.

Decisión recomendada:
- Usar InsForge Auth como sistema primario.
- Modelar tenant/owner/memberships explícitamente en DB.

Entregables:
- Páginas frontend:
  - `sign-in`
  - `sign-up`
  - `forgot-password` si aplica
  - `tenant onboarding`
- Modelo de datos:
  - `tenants`
  - `tenant_members`
  - `tenant_api_credentials`
  - `tenant_preferences`
- Reglas:
  - Un usuario puede pertenecer a uno o más tenants
  - Un tenant puede tener credenciales Pionex propias
  - El frontend obtiene sesión por auth, no por pegar llaves en Settings
- Backend:
  - Resolver tenant desde sesión/authtoken para UI
  - Mantener `X-API-Key` solo como compatibilidad operativa y para jobs/scripts

Checklist:
- [ ] Definir tablas tenant/auth
- [ ] Crear migraciones SQL
- [ ] Crear screens de auth
- [ ] Crear flujo de creación de tenant
- [ ] Crear flujo para guardar credenciales Pionex por tenant
- [ ] Definir RLS o equivalente de acceso por tenant
- [ ] Adaptar frontend para usar sesión real

### 2. Repo, GitHub y release flow

Estado:
- Ya existe repo remoto en GitHub.

Falta:
- Formalizar flujo de release.

Checklist:
- [ ] Crear ramas y convención de release
- [ ] Definir README de setup + deploy
- [ ] Definir checklist de PR
- [ ] Definir tags/releases
- [ ] Confirmar secrets requeridos en GitHub/Railway/InsForge

### 3. Deploy Railway

Objetivo:
- Backend desplegado establemente en Railway
- Frontend servido por el mismo backend o separado, según decisión final

Estado:
- Existe `docs/railway-deploy-checklist.md`
- Existe `Procfile`
- Existe `railway.json`

Checklist:
- [ ] Confirmar variables de entorno reales de prod
- [ ] Confirmar `DATABASE_URL` prod de InsForge
- [ ] Confirmar `OWNER_API_KEY`, `API_KEYS`, `MINER_CONFIRMATION_SECRET`
- [ ] Confirmar CORS explícito de prod
- [ ] Hacer smoke deploy a Railway
- [ ] Validar `/api/v1/health`
- [ ] Validar login
- [ ] Validar dashboard con tenant real
- [ ] Validar Pionex read-only path en prod

### 4. Migración de datos legacy

Fuentes legacy:
- Airtable
- `localStorage` del `worker-dashboard`
- backups JSON del dashboard

Objetivo:
- No perder histórico útil
- No mezclar datos ambiguos con ledger productivo sin reconciliación

Sub-fases:

#### 4.1 Airtable -> SQL/InsForge

Migrar:
- BTC Core buys
- BTC ladder orders/fills
- workers/miners snapshots
- worker event history
- scalping ledger y monitors si aplica
- capital history mensual si existe en Airtable

Checklist:
- [ ] Inventariar tablas/fuentes Airtable
- [ ] Mapear campos legacy -> modelo SQL
- [ ] Definir scripts idempotentes de import
- [ ] Cargar staging primero
- [ ] Verificar por tenant
- [ ] Cerrar reconciliación entre ledger y wallet cuando aplique

#### 4.2 localStorage -> SQL

Persistencias identificadas en el monolito:
- `worker-dashboard-worker-history-v1`
- `worker-dashboard-financial-history-v1`
- scalping trainer/history/ledger local

Checklist:
- [ ] Inventariar todas las keys legacy
- [ ] Definir cuáles migran y cuáles se descartan
- [ ] Crear importador por tenant
- [ ] Marcar campos como `imported_legacy` para trazabilidad
- [ ] Separar “monitoring history” de “financial ledger”

#### 4.3 Backups manuales -> importadores

Estado:
- Ya existe `scripts/import_dashboard_backup.py`

Falta:
- [ ] Extender importador para más datasets
- [ ] Documentar formato de backup
- [ ] Agregar dry-run
- [ ] Agregar validaciones por tenant

### 5. Migración tab por tab

Esta sección lidera la puesta en producción funcional.

#### 5.1 Overview

Estado:
- Mock

Debe migrar:
- KPIs globales reales
- capital total
- free USDT
- open pnl
- monthly pnl
- risk score
- allocation real por estrategia
- alerts/advisor/recommended actions

Dependencias:
- miners
- btc-core
- btc-ladder
- scalping
- capital reconciliation

Checklist:
- [ ] Definir endpoint agregado o composición frontend real
- [ ] Reemplazar mocks
- [ ] Calcular métricas por tenant

#### 5.2 Capital

Estado:
- Mock

Debe migrar:
- capital buckets
- by ticker
- by risk
- history mensual
- capital reconciliation

Mejoras:
- distinguir capital real, deployed, idle, BTC wallet, ladder pending

Checklist:
- [ ] Conectar a capital reconciliation
- [ ] Migrar financial history legacy
- [ ] Render mensual real

#### 5.3 Active Miners

Estado:
- Parcialmente conectado

Ya conectado:
- listar mineros
- account balance
- close preview/execute
- stabilization
- regrid preview/execute
- historial y eventos backend

Falta migrar del monolito:
- expanded-content rico
- worker trend
- daily cycle velocity
- exit reality
- range ladder
- inventory map
- projection
- cycles & efficiency
- shock tolerance
- emergency close ranking

Checklist:
- [ ] Replicar bloques visuales y métricos del expandido
- [ ] Mapear cada bloque al backend actual
- [ ] Agregar datos faltantes en endpoint si no existen
- [ ] Agregar ranking de cierre de emergencia

#### 5.4 Opportunities

Estado:
- Mock

Debe migrar:
- listado real de oportunidades
- technical gate
- create preview
- create execute
- TradingView ya existe como patrón UI

Falta del monolito:
- expanded-content de opportunity
- justificación/score con detalle
- simulación de capital real

Checklist:
- [ ] Conectar service a `/api/v1/dashboard/opportunities`
- [ ] Conectar preview/execute
- [ ] Conectar technical gate
- [ ] Llevar score y rationale reales

#### 5.5 Discovery

Estado:
- Mock

Debe migrar:
- universe scan real
- filtros
- clasificación/promote/watch/reject

Decisión:
- si acciones `promote/watch/reject` no existen aún en backend, definir persistencia antes de implementar UI final

Checklist:
- [ ] Conectar GET discovery
- [ ] Definir persistencia para estados curatoriales
- [ ] Migrar criterios del monolito

#### 5.6 BTC Core

Estado:
- Mock

Backend disponible:
- dashboard
- buy-preview
- buy-execute
- manual buy

Debe migrar:
- progreso real
- ledger real
- breakdown DCA vs ladder
- wallet BTC vs ledger BTC
- ventanas 7D/30D/90D si están disponibles o se agregan

Checklist:
- [ ] Conectar service a backend real
- [ ] Replicar KPIs de monolito
- [ ] Agregar comparación wallet vs ledger

#### 5.7 BTC Ladder

Estado:
- Parcialmente conectado

Ya conectado:
- dashboard
- place-all
- cancel-all
- limit-preview
- limit-execute
- fill-confirm
- TradingView embebido
- reconcile base

Falta migrar/mejorar:
- ladder plan más cercano al monolito
- chart plan visual avanzado
- detección más robusta de order lifecycle
- distinción confiable entre cancelado vs filled cuando Pionex no aparece en open orders
- reconciliación automática más fuerte

Checklist:
- [ ] Mejorar visual del plan
- [ ] Agregar más metadata por orden
- [ ] Investigar endpoint/history adicional de Pionex
- [ ] Reducir uso manual de fill confirm

#### 5.8 Scalping Lab

Estado:
- Mock

Backend disponible:
- signals
- real-preview
- real-execute
- real-monitor
- real-monitors
- spot-preview
- spot-execute
- futures-capabilities

Debe migrar:
- signals reales
- monitor list
- journal real
- trainer history si vale la pena mantenerlo

Checklist:
- [ ] Conectar service a backend real
- [ ] Render signals reales
- [ ] Render monitors reales
- [ ] Definir persistencia del journal

#### 5.9 Settings

Estado:
- Local-only

Debe evolucionar a:
- preferencias de usuario/tenant persistidas
- credenciales Pionex por tenant en backend seguro
- no depender de `localStorage` como fuente productiva principal

Checklist:
- [ ] Mantener fallback local temporal
- [ ] Agregar persistencia backend
- [ ] Separar preferencias UI de credenciales exchange

### 6. Design System

Estado actual:
- Sí existe
- Está razonablemente separado

Capas:
- Tokens: `frontend/src/styles/tokens.css`
- Base/shared styles: `frontend/src/styles/global.css`, `frontend/src/styles/shared-styles.js`
- Components: `frontend/src/components/`
- Funcionalidad: `frontend/src/domains/`

Conclusión:
- Sí se puede ajustar el design system sin romper la lógica, siempre que no se cambien contratos de componentes.

Falta:
- [ ] Mover estilos inline repetidos desde views a componentes/shared styles
- [ ] Documentar tokens y semántica visual

### 7. Testing y calidad

Estado actual:
- Backend contract tests sí
- Frontend browser/UI tests no

Necesitamos:
- tests backend por tab
- tests e2e por flujo crítico
- tests frontend reales para Lit

Checklist:
- [ ] Mantener tests contract backend
- [ ] Agregar tests por tab faltante
- [ ] Agregar tests e2e login -> tenant -> dashboard
- [ ] Agregar tests UI/browser para tabs críticas

## Orden recomendado de ejecución

### Fase 1. Base de producción

- Auth + tenant model
- deploy config real
- migraciones DB de tenant/auth
- settings seguros por tenant

### Fase 2. Datos

- inventario Airtable
- inventario localStorage
- importadores
- reconciliación staging

### Fase 3. Tabs críticas operativas

- Opportunities
- Discovery
- BTC Core
- Scalping Lab
- enriquecer Active Miners
- robustecer BTC Ladder

### Fase 4. Tabs agregadas y polish

- Overview
- Capital
- Settings persistentes
- cleanup de design system

### Fase 5. Producción

- push final a GitHub
- deploy Railway
- smoke tests
- validación tenant real
- validación Pionex real
- migración final de datos
- cutover

## Criterio de salida a producción

Se considera listo cuando:

- [ ] Existe sign-in/sign-up funcional
- [ ] Tenant onboarding funcional
- [ ] Credenciales Pionex por tenant seguras
- [ ] Tabs críticas conectadas sin mocks
- [ ] Datos legacy migrados o descartados explícitamente
- [ ] Dashboard nuevo cubre las funciones críticas del worker-dashboard
- [ ] Railway en verde
- [ ] Logs y healthchecks en verde
- [ ] Smoke real por tenant completado

## Resumen ejecutivo de lo que falta hoy

Falta cerrar principalmente:

- auth real
- tenants reales
- migración de Airtable
- migración de localStorage
- conectar `Opportunities`
- conectar `Discovery`
- conectar `BTC Core`
- conectar `Scalping Lab`
- enriquecer `Active Miners`
- cerrar reconciliación avanzada de `BTC Ladder`
- convertir `Overview` y `Capital` a real
- formalizar deploy final y smoke de producción
