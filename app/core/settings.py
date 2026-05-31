import logging
from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Pionex Middle API"
    app_version: str = "3.0.0"
    environment: Literal["local", "dev", "staging", "prod"] = "local"
    debug: bool = False

    api_v1_prefix: str = "/api/v1"
    docs_url: str = "/docs"
    redoc_url: str = "/redoc"
    openapi_url: str = "/openapi.json"

    api_key_header_name: str = "X-API-Key"
    api_keys: list[str] = Field(default_factory=list)

    pionex_api_key: str = Field(default="", alias="API_KEY")
    pionex_api_secret: str = Field(default="", alias="API_SECRET")
    miner_confirmation_secret: str = "change-this-miner-confirmation-secret"

    database_url: str = "sqlite+aiosqlite:///./runtime/pionex_middle.db"
    sql_echo: bool = False

    cors_allow_origins: list[str] = Field(default_factory=lambda: ["*"])
    cors_allow_credentials: bool = False
    cors_allow_methods: list[str] = Field(default_factory=lambda: ["*"])
    cors_allow_headers: list[str] = Field(default_factory=lambda: ["*"])


@lru_cache
def get_settings() -> Settings:
    return Settings()


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.DEBUG if get_settings().debug else logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
