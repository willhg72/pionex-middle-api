import os
from pathlib import Path

os.environ.setdefault("API_KEYS", '["test-key"]')
os.environ.setdefault("OWNER_API_KEY", "test-key")
os.environ.setdefault("API_KEY", "test-owner-pionex-key")
os.environ.setdefault("API_SECRET", "test-owner-pionex-secret")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./runtime/test_api.db")
os.environ.setdefault("AUTO_CREATE_SCHEMA", "true")

_test_db = Path("runtime/test_api.db")
if _test_db.exists():
    _test_db.unlink()
