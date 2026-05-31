import os

os.environ.setdefault("API_KEYS", '["test-key"]')
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./runtime/test_api.db")
