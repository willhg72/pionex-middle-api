from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import router as api_v1_router
from app.api.v1.endpoints.scalping import router as scalping_router
from app.api.v1.endpoints.discovery import router as discovery_router
from app.api.v1.endpoints.btc_core import router as btc_core_router
from app.api.v1.endpoints.btc_ladder import router as btc_ladder_router
from app.api.v1.endpoints.capital_reconciliation import router as capital_reconciliation_router
from app.api.v1.endpoints.opportunities import router as opportunities_router
from app.api.v1.endpoints.miners import router as miners_router, workers_router
from app.core.exceptions import register_exception_handlers
from app.core.middleware import register_middlewares
from app.core.settings import configure_logging, get_settings
from app.db import models as _models  # noqa: F401
from app.db.base import Base
from app.db.session import engine


def register_dashboard_frontend(app: FastAPI) -> None:
    dashboard_dist = Path(__file__).resolve().parents[1] / "frontend" / "dist"

    if dashboard_dist.exists():
        app.mount("/dashboard", StaticFiles(directory=dashboard_dist, html=True), name="dashboard")
        return

    @app.get("/dashboard", include_in_schema=False)
    async def dashboard_not_built() -> HTMLResponse:
        return HTMLResponse(
            """
            <html>
              <body style="font-family:system-ui;padding:2rem">
                <h1>Dashboard frontend not built yet</h1>
                <p>Run <code>npm.cmd install</code> and <code>npm.cmd run build</code> inside <code>frontend/</code>.</p>
              </body>
            </html>
            """,
            status_code=503,
        )


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    if settings.environment in {"staging", "prod"} and not settings.database_url.startswith("postgresql+asyncpg://"):
        raise RuntimeError("DATABASE_URL must use postgresql+asyncpg in staging/prod.")
    if settings.auto_create_schema or settings.environment in {"local", "dev"}:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url=settings.docs_url,
        redoc_url=settings.redoc_url,
        openapi_url=settings.openapi_url,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    register_middlewares(app)
    register_exception_handlers(app)
    register_dashboard_frontend(app)

    @app.get("/")
    async def root() -> dict:
        return {
            "ok": True,
            "service": settings.app_name,
            "version": settings.app_version,
            "docs": settings.docs_url,
            "api": settings.api_v1_prefix,
        }

    app.include_router(api_v1_router, prefix=settings.api_v1_prefix)
    app.include_router(scalping_router, prefix="/api")
    app.include_router(discovery_router, prefix="/api")
    app.include_router(btc_core_router, prefix="/api")
    app.include_router(btc_ladder_router, prefix="/api")
    app.include_router(capital_reconciliation_router, prefix="/api")
    app.include_router(opportunities_router, prefix="/api")
    app.include_router(miners_router, prefix="/api")
    app.include_router(workers_router, prefix="/api")
    return app


app = create_app()
