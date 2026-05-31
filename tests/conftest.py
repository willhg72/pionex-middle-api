import os
from pathlib import Path

os.environ.setdefault("API_KEYS", '["test-key"]')
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./runtime/test_api.db")
os.environ.setdefault("AUTO_CREATE_SCHEMA", "true")

_test_db = Path("runtime/test_api.db")
if _test_db.exists():
    _test_db.unlink()
