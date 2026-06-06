import asyncio
import time

from app.integrations.pionex_rate_limiter import PionexRateLimiter


def test_weighted_limiter_respects_capacity():
    limiter = PionexRateLimiter(rate_per_sec=10.0, burst=10.0)

    async def run_case():
        t0 = time.monotonic()
        await limiter.acquire("acc-1", 10)
        await limiter.acquire("acc-1", 1)
        return time.monotonic() - t0

    elapsed = asyncio.run(run_case())
    assert elapsed >= 0.09


def test_mark_429_introduces_cooldown():
    limiter = PionexRateLimiter(rate_per_sec=100.0, burst=100.0)

    async def run_case():
        await limiter.mark_429("acc-1", cooldown_s=0.2)
        t0 = time.monotonic()
        await limiter.acquire("acc-1", 1)
        return time.monotonic() - t0

    elapsed = asyncio.run(run_case())
    assert elapsed >= 0.18
