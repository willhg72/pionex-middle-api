from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import HTTPException

from app.integrations.pionex_client import PionexClient
from app.services.miners_metrics import safe_float
from app.services.miners_service import miners_service


class CapitalReconciliationService:
    @staticmethod
    def build_fleet_snapshot(
        *,
        miners: list[dict[str, Any]],
        balance: dict[str, Any],
        source: str,
        captured_at: datetime | None = None,
    ) -> dict[str, Any]:
        captured = captured_at or datetime.now(timezone.utc)
        active_ids = [str(m.get("buOrderId") or "") for m in miners if str(m.get("buOrderId") or "")]
        active_miners = [
            {
                "buOrderId": str(m.get("buOrderId") or ""),
                "symbol": m.get("symbol"),
                "quoteInvestment": safe_float(m.get("quoteInvestment"), None),
                "closeProfit": safe_float(m.get("closeProfit"), None),
                "gridProfit": safe_float(m.get("gridProfit"), None),
                "trendPnl": safe_float(m.get("trendPnl"), None),
                "marginBalance": safe_float(m.get("marginBalance"), None),
                "status": m.get("status"),
            }
            for m in miners
        ]
        usdt = balance.get("usdt") or {}
        free_usdt = safe_float(usdt.get("free"), 0.0) or 0.0
        frozen_usdt = safe_float(usdt.get("frozen"), 0.0) or 0.0
        active_capital = sum((safe_float(m.get("quoteInvestment"), 0.0) or 0.0) for m in miners)
        active_closeable_pnl = sum((safe_float(m.get("closeProfit"), 0.0) or 0.0) for m in miners)
        return {
            "capturedAt": captured.isoformat(),
            "freeUsdt": round(free_usdt, 6),
            "frozenUsdt": round(frozen_usdt, 6),
            "activeBotCount": len(active_ids),
            "activeBuOrderIds": active_ids,
            "activeCapitalUsdt": round(active_capital, 6),
            "activeCloseablePnl": round(active_closeable_pnl, 6),
            "accountTotalUsdtEstimate": safe_float(balance.get("estimatedTotalUsd"), None),
            "source": source,
            "activeMiners": active_miners,
        }

    @staticmethod
    def _parse_dt(value: str | None) -> datetime | None:
        text = str(value or "").strip()
        if not text:
            return None
        try:
            return datetime.fromisoformat(text.replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            return None

    @staticmethod
    async def _query_closed_status(api_key: str, api_secret: str, bu_order_id: str) -> dict[str, Any]:
        client = PionexClient(api_key, api_secret)
        try:
            result = await client.get_bot_status(bu_order_id)
        finally:
            await client.close()
        if not result.success:
            return {}
        data = result.raw_response.get("data") if isinstance(result.raw_response, dict) else {}
        data = data if isinstance(data, dict) else {}
        bu_data = data.get("buOrderData") if isinstance(data.get("buOrderData"), dict) else {}
        return {**data, "buOrderData": bu_data}

    async def detect_close_events(
        self,
        *,
        previous_snapshot: dict[str, Any] | None,
        current_snapshot: dict[str, Any],
        api_key: str,
        api_secret: str,
        source: str,
    ) -> list[dict[str, Any]]:
        if not previous_snapshot:
            return []
        prev_ids = set(previous_snapshot.get("activeBuOrderIds") or [])
        now_ids = set(current_snapshot.get("activeBuOrderIds") or [])
        closed_ids = sorted(prev_ids - now_ids)
        if not closed_ids:
            return []

        prev_by_id = {
            str(item.get("buOrderId") or ""): item
            for item in (previous_snapshot.get("activeMiners") or [])
            if str(item.get("buOrderId") or "")
        }
        new_active = [
            item for item in (current_snapshot.get("activeMiners") or []) if str(item.get("buOrderId") or "") not in prev_ids
        ]
        replacement_bu_order_id = str(new_active[0].get("buOrderId") or "") if new_active else None
        replacement_capital = sum((safe_float(item.get("quoteInvestment"), 0.0) or 0.0) for item in new_active)
        wallet_delta = (safe_float(current_snapshot.get("freeUsdt"), 0.0) or 0.0) - (
            safe_float(previous_snapshot.get("freeUsdt"), 0.0) or 0.0
        )

        events: list[dict[str, Any]] = []
        prev_captured = self._parse_dt(previous_snapshot.get("capturedAt"))
        curr_captured = self._parse_dt(current_snapshot.get("capturedAt"))
        within_window = bool(
            prev_captured
            and curr_captured
            and curr_captured - prev_captured <= timedelta(minutes=10)
        )

        for bu_order_id in closed_ids:
            prev = prev_by_id.get(bu_order_id) or {}
            status = await self._query_closed_status(api_key, api_secret, bu_order_id)
            bu_data = status.get("buOrderData") if isinstance(status.get("buOrderData"), dict) else {}
            reason = bu_data.get("reasonBy") or status.get("reasonBy") or "snapshot_delta_detected"
            realized = next(
                (
                    val
                    for val in (
                        safe_float(bu_data.get("totalRealizedProfit"), None),
                        safe_float(bu_data.get("totalProfit"), None),
                        safe_float(status.get("totalRealizedProfit"), None),
                        safe_float(status.get("totalProfit"), None),
                        safe_float(prev.get("closeProfit"), None),
                        safe_float(prev.get("trendPnl"), None),
                    )
                    if val is not None
                ),
                0.0,
            )
            capital_before = next(
                (
                    val
                    for val in (
                        safe_float(prev.get("quoteInvestment"), None),
                        safe_float(prev.get("marginBalance"), None),
                    )
                    if val is not None
                ),
                0.0,
            )
            released = (capital_before or 0.0) + (realized or 0.0)
            redeployed = bool(within_window and replacement_bu_order_id and replacement_capital > 0)
            confidence = 0.92 if bu_data else 0.68
            if redeployed:
                confidence += 0.05
            events.append(
                {
                    "detectedAt": current_snapshot.get("capturedAt"),
                    "buOrderId": bu_order_id,
                    "symbol": prev.get("symbol"),
                    "closedAt": (
                        str(
                            bu_data.get("closeTime")
                            or status.get("closeTime")
                            or current_snapshot.get("capturedAt")
                        )
                    ),
                    "closeReason": str(reason),
                    "capitalBeforeClose": round(capital_before or 0.0, 6),
                    "realizedPnlUsdt": round(realized or 0.0, 6),
                    "releasedUsdtEstimate": round(released, 6),
                    "walletDeltaUsdt": round(wallet_delta, 6),
                    "redeployedWithinWindow": redeployed,
                    "replacementBuOrderId": replacement_bu_order_id if redeployed else None,
                    "confidence": round(min(confidence, 0.99), 2),
                    "source": source,
                    "capitalReusedEstimate": round(min(released, replacement_capital), 6) if redeployed else 0.0,
                    "freeCashImpact": round(released - (min(released, replacement_capital) if redeployed else 0.0), 6),
                }
            )
        return events

    def summarize(self, *, current_snapshot: dict[str, Any], recent_events: list[dict[str, Any]]) -> dict[str, Any]:
        now = datetime.now(timezone.utc).date()
        today_events = [evt for evt in recent_events if self._parse_dt(evt.get("detectedAt")) and self._parse_dt(evt.get("detectedAt")).date() == now]
        realized_today = sum((safe_float(evt.get("realizedPnlUsdt"), 0.0) or 0.0) for evt in today_events)
        released_today = sum((safe_float(evt.get("releasedUsdtEstimate"), 0.0) or 0.0) for evt in today_events)
        redeployed_today = sum((safe_float(evt.get("capitalReusedEstimate"), 0.0) or 0.0) for evt in today_events)
        return {
            "freeUsdtNow": current_snapshot.get("freeUsdt"),
            "activeCapitalNow": current_snapshot.get("activeCapitalUsdt"),
            "closedMinersToday": len(today_events),
            "realizedPnlToday": round(realized_today, 6),
            "releasedCapitalToday": round(released_today, 6),
            "redeployedCapitalToday": round(redeployed_today, 6),
        }

    async def reconcile(
        self,
        *,
        api_key: str,
        api_secret: str,
        target_daily_usdt: float,
        source: str,
        previous_snapshot: dict[str, Any] | None,
    ) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        miners = await miners_service.list_miners(api_key=api_key, api_secret=api_secret, target_daily_usdt=target_daily_usdt)
        balance = await miners_service.get_account_balance(api_key=api_key, api_secret=api_secret)
        current_snapshot = self.build_fleet_snapshot(miners=miners, balance=balance, source=source)
        close_events = await self.detect_close_events(
            previous_snapshot=previous_snapshot,
            current_snapshot=current_snapshot,
            api_key=api_key,
            api_secret=api_secret,
            source=source,
        )
        return current_snapshot, close_events


capital_reconciliation_service = CapitalReconciliationService()
