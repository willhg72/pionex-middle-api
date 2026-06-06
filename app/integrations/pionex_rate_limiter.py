import asyncio
import time
from dataclasses import dataclass


@dataclass
class _BucketState:
    tokens: float
    last_refill: float
    banned_until: float = 0.0


class PionexRateLimiter:
    """Weighted limiter for Pionex private endpoints.

    - Global app bucket emulates IP limit: 10 weight/s.
    - Per-account bucket emulates account private limit: 10 weight/s.
    - On upstream 429, both buckets enter local cooldown to avoid ban extension.
    """

    def __init__(self, rate_per_sec: float = 10.0, burst: float = 10.0) -> None:
        self.rate_per_sec = rate_per_sec
        self.burst = burst
        now = time.monotonic()
        self._global = _BucketState(tokens=burst, last_refill=now)
        self._accounts: dict[str, _BucketState] = {}
        self._lock = asyncio.Lock()

    def _refill(self, state: _BucketState, now: float) -> None:
        if now <= state.last_refill:
            return
        elapsed = now - state.last_refill
        state.tokens = min(self.burst, state.tokens + elapsed * self.rate_per_sec)
        state.last_refill = now

    async def acquire(self, account_id: str, weight: int) -> None:
        while True:
            wait_s = 0.0
            async with self._lock:
                now = time.monotonic()
                account = self._accounts.get(account_id)
                if account is None:
                    account = _BucketState(tokens=self.burst, last_refill=now)
                    self._accounts[account_id] = account

                self._refill(self._global, now)
                self._refill(account, now)

                if now < self._global.banned_until:
                    wait_s = max(wait_s, self._global.banned_until - now)
                if now < account.banned_until:
                    wait_s = max(wait_s, account.banned_until - now)

                if wait_s <= 0:
                    if self._global.tokens >= weight and account.tokens >= weight:
                        self._global.tokens -= weight
                        account.tokens -= weight
                        return
                    need_global = max(0.0, weight - self._global.tokens) / self.rate_per_sec
                    need_account = max(0.0, weight - account.tokens) / self.rate_per_sec
                    wait_s = max(need_global, need_account, 0.01)

            await asyncio.sleep(wait_s)

    async def mark_429(self, account_id: str, cooldown_s: float = 60.0) -> None:
        async with self._lock:
            now = time.monotonic()
            global_until = max(self._global.banned_until, now + cooldown_s)
            self._global.banned_until = global_until

            account = self._accounts.get(account_id)
            if account is None:
                account = _BucketState(tokens=self.burst, last_refill=now)
                self._accounts[account_id] = account
            account.banned_until = max(account.banned_until, now + cooldown_s)
