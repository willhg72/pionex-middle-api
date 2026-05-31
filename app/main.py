from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as api_v1_router
from app.api.v1.endpoints.scalping import router as scalping_router
from app.api.v1.endpoints.discovery import router as discovery_router
from app.api.v1.endpoints.btc_core import router as btc_core_router
from app.api.v1.endpoints.btc_ladder import router as btc_ladder_router
from app.core.exceptions import register_exception_handlers
from app.core.middleware import register_middlewares
from app.core.settings import configure_logging, get_settings
from app.db import models as _models  # noqa: F401
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    if settings.environment in {"staging", "prod"} and not settings.database_url.startswith("postgresql+asyncpg://"):
        raise RuntimeError("DATABASE_URL must use postgresql+asyncpg in staging/prod.")
    if settings.auto_create_schema:
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
    return app


app = create_app()
