from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from app.repositories.btc_core_repository import BtcCoreRepository
from app.repositories.capital_reconciliation_repository import CapitalReconciliationRepository
from app.repositories.financial_history_repository import FinancialHistoryRepository
from app.services.analyzer_service import analyzer_service
from app.services.btc_core_service import btc_core_service
from app.services.capital_reconciliation_service import capital_reconciliation_service
from app.services.market_data_service import market_data_service
from app.services.miners_metrics import enrich_miner_metrics, safe_float
from app.services.miners_service import miners_service


class CapitalDashboardService:
    @staticmethod
    def _safe_month(value: str | None) -> str:
        text = str(value or "").strip()
        return text[:7] if len(text) >= 7 else ""

    def _build_btc_dca(self, buys: list[dict[str, Any]], *, monthly_budget_usdt: float = 100.0) -> dict[str, Any]:
        now = datetime.now(timezone.utc)
        current_month = now.strftime("%Y-%m")
        current_year = now.year
        current_week = now.isocalendar().week

        def parse_dt(text: str | None) -> datetime | None:
            return self._parse_dt(text)

        normalized: list[dict[str, Any]] = []
        for row in buys:
            dt = parse_dt(row.get("createdAt") or row.get("boughtAt"))
            btc_amount = safe_float(row.get("btcAmount"), 0.0) or 0.0
            usdt_amount = safe_float(row.get("usdtAmount"), 0.0) or 0.0
            if not dt or btc_amount <= 0 or usdt_amount <= 0:
                continue
            normalized.append(
                {
                    "dt": dt,
                    "month": dt.strftime("%Y-%m"),
                    "btcAmount": btc_amount,
                    "usdtAmount": usdt_amount,
                    "price": usdt_amount / btc_amount if btc_amount > 0 else None,
                }
            )

        def weighted_avg(rows: list[dict[str, Any]]) -> float | None:
            total_btc = sum(item["btcAmount"] for item in rows)
            total_usdt = sum(item["usdtAmount"] for item in rows)
            return (total_usdt / total_btc) if total_btc > 0 else None

        current_rows = [row for row in normalized if row["month"] == current_month]
        previous_rows = [row for row in normalized if row["month"] < current_month]
        previous_months = sorted({row["month"] for row in previous_rows})
        previous3_months = previous_months[-3:]
        previous3_rows = [row for row in previous_rows if row["month"] in previous3_months]
        week_rows = [row for row in current_rows if row["dt"].isocalendar().year == current_year and row["dt"].isocalendar().week == current_week]

        current_avg = weighted_avg(current_rows)
        previous_avg = weighted_avg(previous_rows)
        previous3_avg = weighted_avg(previous3_rows)
        current_usdt = sum(row["usdtAmount"] for row in current_rows)
        current_btc = sum(row["btcAmount"] for row in current_rows)
        week_usdt = sum(row["usdtAmount"] for row in week_rows)
        weekly_budget = monthly_budget_usdt / 4.0

        def edge(base: float | None, current: float | None) -> float | None:
            if not base or not current or base <= 0:
                return None
            return ((base / current) - 1.0) * 100.0

        return {
            "currentMonth": current_month,
            "currentUsdt": round(current_usdt, 6),
            "currentBtc": round(current_btc, 8),
            "currentCount": len(current_rows),
            "budget": round(monthly_budget_usdt, 6),
            "remainingUsdt": round(max(0.0, monthly_budget_usdt - current_usdt), 6),
            "weeklyBudget": round(weekly_budget, 6),
            "weekRemainingUsdt": round(max(0.0, weekly_budget - week_usdt), 6),
            "currentAvg": round(current_avg, 6) if current_avg else None,
            "previousAvg": round(previous_avg, 6) if previous_avg else None,
            "previous3Avg": round(previous3_avg, 6) if previous3_avg else None,
            "previous3Count": len(previous3_rows),
            "dcaEdge": round(edge(previous_avg, current_avg), 3) if edge(previous_avg, current_avg) is not None else None,
            "dcaEdge3m": round(edge(previous3_avg, current_avg), 3) if edge(previous3_avg, current_avg) is not None else None,
        }

    @staticmethod
    def _label_for_symbol(symbol: str | None) -> str:
        text = str(symbol or "").strip().upper()
        if not text:
            return "Other"
        return text.replace("_PERP", "").replace("_USDT", "").replace("_", "")

    @staticmethod
    def _monthly_rate_from_apr(apr_pct: float) -> float:
        annual = max(0.0, apr_pct) / 100.0
        if annual <= 0:
            return 0.0
        return (1.0 + annual) ** (1.0 / 12.0) - 1.0

    @staticmethod
    def _risk_label(row: dict[str, Any]) -> str:
        range_health = str(row.get("rangeHealth") or "").lower()
        inventory_ratio = safe_float(row.get("inventoryRatio"), 0.0) or 0.0
        if "outside" in range_health or inventory_ratio >= 0.65:
            return "High Risk"
        if "near_" in range_health or inventory_ratio >= 0.35:
            return "Medium Risk"
        return "Low Risk"

    def _build_history(self, snapshots: list[dict[str, Any]]) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for snapshot in snapshots[-90:]:
            captured_at = snapshot.get("capturedAt")
            dt = self._parse_dt(captured_at) or datetime.now(timezone.utc)
            total = next(
                (
                    value
                    for value in (
                        safe_float(snapshot.get("accountTotalUsdtEstimate"), None),
                        safe_float(snapshot.get("freeUsdt"), 0.0) + safe_float(snapshot.get("activeCapitalUsdt"), 0.0),
                    )
                    if value is not None
                ),
                0.0,
            )
            pnl = safe_float(snapshot.get("activeCloseablePnl"), 0.0) or 0.0
            rows.append(
                {
                    "isoDate": dt.isoformat(),
                    "date": dt.strftime("%b %d").replace(" 0", " "),
                    "total": round(total, 6),
                    "pnl": round(pnl, 6),
                }
            )
        if len(rows) == 1:
            only = rows[0]
            rows.append(
                {
                    "isoDate": only["isoDate"],
                    "date": only["date"],
                    "total": only["total"],
                    "pnl": only["pnl"],
                }
            )
        return rows

    def _build_monthly_history(
        self,
        *,
        monthly_entries: list[dict[str, Any]],
        total_capital_visible: float,
        all_miner_gain: float,
        fixed_monthly_rate: float,
    ) -> list[dict[str, Any]]:
        rows: list[dict[str, Any]] = []
        for entry in monthly_entries:
            total_money = safe_float(entry.get("totalMoney"), 0.0) or 0.0
            all_active_revenue = safe_float(entry.get("allActiveRevenue"), safe_float(entry.get("activeRevenue"), 0.0)) or 0.0
            current_close = safe_float(entry.get("closeProfitNow"), all_active_revenue) or 0.0
            month_revenue = next(
                (
                    value
                    for value in (
                        safe_float(entry.get("monthRevenue"), None),
                        safe_float(entry.get("monthlyCloseablePnlChange"), None),
                    )
                    if value is not None
                ),
                current_close,
            )
            total_ref = total_money if total_money > 0 else total_capital_visible
            rows.append(
                {
                    "month": str(entry.get("month") or ""),
                    "label": str(entry.get("month") or ""),
                    "totalMoney": round(total_money, 6),
                    "revenueAccumulated": round(all_active_revenue, 6),
                    "monthRevenue": round(month_revenue, 6),
                    "monthRoiPct": round(((month_revenue / total_ref) * 100.0) if total_ref > 0 else 0.0, 3),
                    "minersRoiPct": round(((all_active_revenue / total_ref) * 100.0) if total_ref > 0 else 0.0, 3),
                    "fixedEquivalent": round(total_ref * fixed_monthly_rate, 6),
                    "promoRevenue": round(safe_float(entry.get("promoRevenue"), 0.0) or 0.0, 6),
                    "ownRevenue": round(safe_float(entry.get("activeRevenue"), 0.0) or 0.0, 6),
                }
            )
        if not rows:
            rows.append(
                {
                    "month": datetime.now(timezone.utc).strftime("%Y-%m"),
                    "label": datetime.now(timezone.utc).strftime("%Y-%m"),
                    "totalMoney": round(total_capital_visible, 6),
                    "revenueAccumulated": round(all_miner_gain, 6),
                    "monthRevenue": round(all_miner_gain, 6),
                    "monthRoiPct": round(((all_miner_gain / total_capital_visible) * 100.0) if total_capital_visible > 0 else 0.0, 3),
                    "minersRoiPct": round(((all_miner_gain / total_capital_visible) * 100.0) if total_capital_visible > 0 else 0.0, 3),
                    "fixedEquivalent": round(total_capital_visible * fixed_monthly_rate, 6),
                    "promoRevenue": 0.0,
                    "ownRevenue": round(all_miner_gain, 6),
                }
            )
        return rows

    def _build_portfolio_assets(self, balance: dict[str, Any]) -> list[dict[str, Any]]:
        assets = []
        raw_assets = balance.get("assets") or []
        total_usd = sum((safe_float(item.get("usdValue"), 0.0) or 0.0) for item in raw_assets)
        for item in raw_assets:
            coin = str(item.get("coin") or "").upper()
            if not coin:
                continue
            usd_value = safe_float(item.get("usdValue"), 0.0) or 0.0
            total = safe_float(item.get("total"), 0.0) or 0.0
            free = safe_float(item.get("free"), 0.0) or 0.0
            frozen = safe_float(item.get("frozen"), 0.0) or 0.0
            assets.append(
                {
                    "coin": coin,
                    "quantity": round(total, 8),
                    "free": round(free, 8),
                    "frozen": round(frozen, 8),
                    "usdValue": round(usd_value, 6),
                    "proportionPct": round(((usd_value / total_usd) * 100.0), 2) if total_usd > 0 else 0.0,
                }
            )
        return sorted(assets, key=lambda item: item["usdValue"], reverse=True)

    async def _enrich_balance_assets(self, balance: dict[str, Any]) -> dict[str, Any]:
        assets = [dict(item) for item in (balance.get("assets") or [])]
        missing_symbols = [
            str(item.get("coin") or "").upper()
            for item in assets
            if str(item.get("coin") or "").upper() not in {"", "USDT"} and (safe_float(item.get("usdValue"), None) in (None, 0.0))
        ]
        if not missing_symbols:
            return balance

        prices = await market_data_service.get_spot_prices_usd(missing_symbols)
        updated_assets: list[dict[str, Any]] = []
        for item in assets:
            coin = str(item.get("coin") or "").upper()
            usd_value = safe_float(item.get("usdValue"), None)
            total = safe_float(item.get("total"), 0.0) or 0.0
            if coin == "USDT" and (usd_value is None or usd_value <= 0):
                usd_value = total
            elif (usd_value is None or usd_value <= 0) and prices.get(coin):
                usd_value = total * prices[coin]
            updated = dict(item)
            updated["usdValue"] = round(usd_value, 8) if usd_value is not None else None
            updated_assets.append(updated)

        estimated_total = sum((safe_float(item.get("usdValue"), 0.0) or 0.0) for item in updated_assets)
        return {
            **balance,
            "assets": updated_assets,
            "nonUsdtAssets": [item for item in updated_assets if str(item.get("coin") or "").upper() != "USDT"],
            "estimatedTotalUsd": round(estimated_total, 8) if estimated_total > 0 else balance.get("estimatedTotalUsd"),
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
    def _find_asset_value(balance: dict[str, Any], coin: str) -> float:
        target = str(coin or "").upper()
        for asset in balance.get("nonUsdtAssets") or []:
            if str(asset.get("coin") or "").upper() != target:
                continue
            usd_value = safe_float(asset.get("usdValue"), None)
            if usd_value is not None and usd_value > 0:
                return usd_value
        return 0.0

    @staticmethod
    def _find_wallet_usdt_total(balance: dict[str, Any]) -> float:
        usdt = balance.get("usdt") or {}
        total = safe_float(usdt.get("total"), None)
        if total is not None and total > 0:
            return total
        for asset in balance.get("assets") or []:
            if str(asset.get("coin") or "").upper() != "USDT":
                continue
            asset_total = safe_float(asset.get("total"), None)
            if asset_total is not None and asset_total > 0:
                return asset_total
            usd_value = safe_float(asset.get("usdValue"), None)
            if usd_value is not None and usd_value > 0:
                return usd_value
        return 0.0

    async def build_dashboard(
        self,
        *,
        api_key: str,
        api_secret: str,
        source: str,
        target_daily_usdt: float,
        fixed_income_annual_pct: float,
        tenant_id: str,
        capital_repo: CapitalReconciliationRepository,
        btc_core_repo: BtcCoreRepository,
        financial_history_repo: FinancialHistoryRepository,
    ) -> dict[str, Any]:
        previous_snapshot = await capital_repo.get_latest_snapshot(tenant_id=tenant_id)
        current_snapshot, new_events = await capital_reconciliation_service.reconcile(
            api_key=api_key,
            api_secret=api_secret,
            target_daily_usdt=target_daily_usdt,
            source=source,
            previous_snapshot=previous_snapshot,
        )
        await capital_repo.save_fleet_snapshot(tenant_id=tenant_id, snapshot=current_snapshot)
        for event in new_events:
            existing = await capital_repo.find_close_event(tenant_id=tenant_id, bu_order_id=str(event.get("buOrderId") or ""))
            if existing:
                continue
            await capital_repo.save_close_event(tenant_id=tenant_id, event=event)
        await capital_repo.commit()

        balance = await miners_service.get_account_balance(api_key=api_key, api_secret=api_secret)
        balance = await self._enrich_balance_assets(balance)
        portfolio_assets = self._build_portfolio_assets(balance)
        recent_events = await capital_repo.list_recent_close_events(tenant_id=tenant_id, limit=20)
        snapshots = await capital_repo.list_recent_snapshots(tenant_id=tenant_id, limit=90)
        monthly_entries = await financial_history_repo.list_monthly_entries(tenant_id=tenant_id)
        summary = capital_reconciliation_service.summarize(current_snapshot=current_snapshot, recent_events=recent_events)

        _, klines = await analyzer_service.fetch_klines(
            symbol="BTCUSDT",
            interval="1d",
            limit=5,
            source="pionex",
            start_time=None,
            end_time=None,
        )
        btc_price = float(klines[-1].close) if klines else 0.0

        buys = await btc_core_repo.list_buys(tenant_id=tenant_id, limit=1000)
        btc_ledger = btc_core_service.summarize_buys(buys)
        btc_dca = self._build_btc_dca(buys)
        btc_ledger_value = (safe_float(btc_ledger.get("totalBtc"), 0.0) or 0.0) * btc_price
        btc_wallet_value = self._find_asset_value(balance, "BTC")
        btc_core_value = max(btc_wallet_value, btc_ledger_value)

        other_assets_value = sum(
            (safe_float(asset.get("usdValue"), 0.0) or 0.0)
            for asset in (balance.get("nonUsdtAssets") or [])
            if str(asset.get("coin") or "").upper() != "BTC"
        )
        free_usdt = safe_float(current_snapshot.get("freeUsdt"), 0.0) or 0.0
        wallet_usdt_total = self._find_wallet_usdt_total(balance)
        worker_capital = safe_float(current_snapshot.get("activeCapitalUsdt"), 0.0) or 0.0
        all_miner_gain = safe_float(current_snapshot.get("activeCloseablePnl"), 0.0) or 0.0
        estimated_equity = wallet_usdt_total + worker_capital
        total_capital_visible = estimated_equity + btc_core_value + other_assets_value
        capital_not_mining = max(0.0, total_capital_visible - worker_capital)
        miner_capital_roi_pct = ((all_miner_gain / worker_capital) * 100.0) if worker_capital > 0 else 0.0
        fixed_monthly_rate = self._monthly_rate_from_apr(fixed_income_annual_pct)
        promo_margin = 0.0

        buckets: list[dict[str, Any]] = []

        def push_bucket(label: str, value: float, *, productive: bool, risk: str) -> None:
            if value <= 0:
                return
            buckets.append({"label": label, "value": round(value, 6), "productive": productive, "risk": risk})

        push_bucket("Active Miners", worker_capital, productive=True, risk="medium")
        push_bucket("BTC Core", btc_core_value, productive=False, risk="low")
        push_bucket("Other Assets", other_assets_value, productive=False, risk="medium")
        push_bucket("Wallet USDT", wallet_usdt_total, productive=False, risk="none")

        total_bucket_value = sum(item["value"] for item in buckets) or 1.0
        for bucket in buckets:
            bucket["pct"] = round((bucket["value"] / total_bucket_value) * 100.0, 2)

        ticker_totals: dict[str, float] = {
            str(asset.get("coin") or "").upper(): safe_float(asset.get("usdValue"), 0.0) or 0.0
            for asset in portfolio_assets
            if (safe_float(asset.get("usdValue"), 0.0) or 0.0) > 0
        }
        risk_totals = {"Low Risk": 0.0, "Medium Risk": 0.0, "High Risk": 0.0, "No Risk": 0.0}
        for asset in portfolio_assets:
            coin = str(asset.get("coin") or "").upper()
            value = safe_float(asset.get("usdValue"), 0.0) or 0.0
            if value <= 0:
                continue
            if coin == "USDT":
                risk_totals["No Risk"] += value
            elif coin == "BTC":
                risk_totals["Low Risk"] += value
            else:
                risk_totals["Medium Risk"] += value
        for raw_miner in current_snapshot.get("activeMiners") or []:
            enriched = enrich_miner_metrics(raw_miner, target_daily_usdt=target_daily_usdt)
            capital = safe_float(enriched.get("quoteInvestment"), 0.0) or 0.0
            if capital <= 0:
                continue
            label = self._label_for_symbol(enriched.get("symbol"))
            ticker_totals[label] = ticker_totals.get(label, 0.0) + capital
            risk_totals[self._risk_label(enriched)] += capital

        if btc_core_value > 0 and "BTC" not in ticker_totals:
            ticker_totals["BTC"] = ticker_totals.get("BTC", 0.0) + btc_core_value
            risk_totals["Low Risk"] += btc_core_value
        if other_assets_value > 0 and not any(str(asset.get("coin") or "").upper() != "BTC" for asset in portfolio_assets):
            ticker_totals["Other"] = ticker_totals.get("Other", 0.0) + other_assets_value
            risk_totals["Medium Risk"] += other_assets_value
        if wallet_usdt_total > 0 and "USDT" not in ticker_totals:
            ticker_totals["USDT"] = ticker_totals.get("USDT", 0.0) + wallet_usdt_total
            risk_totals["No Risk"] += wallet_usdt_total

        ticker_items = sorted(ticker_totals.items(), key=lambda item: item[1], reverse=True)
        if len(ticker_items) > 10:
            head = ticker_items[:9]
            tail_total = sum(value for _, value in ticker_items[9:])
            ticker_items = [*head, ("Other", tail_total)]
        by_ticker = [
            {
                "ticker": ticker,
                "value": round(value, 6),
                "pct": round((value / total_capital_visible) * 100.0, 2) if total_capital_visible > 0 else 0.0,
            }
            for ticker, value in ticker_items
        ]
        by_risk = [
            {
                "label": label,
                "value": round(value, 6),
                "pct": round((value / total_capital_visible) * 100.0, 2) if total_capital_visible > 0 else 0.0,
            }
            for label, value in risk_totals.items()
            if value > 0
        ]
        monthly_history = self._build_monthly_history(
            monthly_entries=monthly_entries,
            total_capital_visible=total_capital_visible,
            all_miner_gain=all_miner_gain,
            fixed_monthly_rate=fixed_monthly_rate,
        )
        current_month = monthly_history[-1] if monthly_history else {}
        monthly_closeable_pnl_change = safe_float(current_month.get("monthRevenue"), 0.0) or 0.0
        monthly_roi_pct = safe_float(current_month.get("monthRoiPct"), 0.0) or 0.0
        revenue_accumulated = safe_float(current_month.get("revenueAccumulated"), all_miner_gain) or 0.0

        return {
            "ok": True,
            "source": source,
            "asOf": current_snapshot.get("capturedAt"),
            "summary": {
                "totalCapitalVisible": round(total_capital_visible, 6),
                "capitalMining": round(worker_capital, 6),
                "capitalNotMining": round(capital_not_mining, 6),
                "estimatedEquity": round(estimated_equity, 6),
                "promoMargin": round(promo_margin, 6),
                "allMinerGain": round(all_miner_gain, 6),
                "minerCapitalRoiPct": round(miner_capital_roi_pct, 3),
                "fixedIncomeAnnualPct": round(fixed_income_annual_pct, 3),
                "fixedIncomeMonthlyPct": round(fixed_monthly_rate * 100.0, 3),
                "fixedEquivalentMinerCapital": round(worker_capital * fixed_monthly_rate, 6),
                "fixedEquivalentTotalCapital": round(total_capital_visible * fixed_monthly_rate, 6),
                "monthlyCloseablePnlChange": round(monthly_closeable_pnl_change, 6),
                "monthlyRoiPct": round(monthly_roi_pct, 3),
                "revenueAccumulated": round(revenue_accumulated, 6),
                "btcCoreValue": round(btc_core_value, 6),
                "btcPrice": round(btc_price, 6),
                "btcHoldings": round(safe_float(btc_ledger.get("totalBtc"), 0.0) or 0.0, 8),
                "freeUsdt": round(free_usdt, 6),
                "walletUsdtTotal": round(wallet_usdt_total, 6),
                "otherAssetsValue": round(other_assets_value, 6),
                "reportedBalanceUsd": round(safe_float(balance.get("estimatedTotalUsd"), 0.0) or 0.0, 6),
                "activeBotCount": int(current_snapshot.get("activeBotCount") or 0),
                "closedMinersToday": int(summary.get("closedMinersToday") or 0),
                "realizedPnlToday": round(safe_float(summary.get("realizedPnlToday"), 0.0) or 0.0, 6),
                "redeployedCapitalToday": round(safe_float(summary.get("redeployedCapitalToday"), 0.0) or 0.0, 6),
            },
            "buckets": buckets,
            "byTicker": by_ticker,
            "byRisk": by_risk,
            "history": self._build_history(snapshots),
            "monthlyHistory": monthly_history,
            "recentCloseEvents": recent_events,
            "accountBreakdown": {
                "estimatedEquity": round(estimated_equity, 6),
                "freeUsdt": round(free_usdt, 6),
                "walletUsdtTotal": round(wallet_usdt_total, 6),
                "minerMargin": round(worker_capital, 6),
                "promoMargin": round(promo_margin, 6),
                "otherAssetsValue": round(other_assets_value, 6),
                "btcCoreValue": round(btc_core_value, 6),
            },
            "portfolioAssets": portfolio_assets,
            "btcDca": btc_dca,
            "notes": {
                "totalCapitalVisible": "wallet total (free + frozen) + user-funded miners + BTC wallet/core + other spot assets",
                "history": "History starts building from persisted fleet snapshots and uses account estimate when available.",
                "monthlyHistory": "Monthly history uses imported worker-dashboard financial snapshots when available.",
            },
        }


capital_dashboard_service = CapitalDashboardService()
