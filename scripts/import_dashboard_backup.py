import argparse
import asyncio
import json
from pathlib import Path

from sqlalchemy import delete

from app.core.security import tenant_id_from_api_key
from app.db.models.financial_history import FinancialHistoryEntry, MinerHistoryAggregate
from app.db.session import SessionLocal


def _parse_json_string(value: str):
    try:
        return json.loads(value)
    except Exception:
        return None


def _normalize_timestamp(value) -> int:
    try:
        raw = int(value or 0)
    except Exception:
        return 0
    if raw > 2_147_483_647:
        return raw // 1000
    return raw


async def run(backup_path: Path, api_key: str, purge_existing: bool) -> None:
    payload = json.loads(backup_path.read_text(encoding="utf-8"))
    data = payload.get("data") or {}

    financial_rows = _parse_json_string(data.get("worker-dashboard-financial-history-v1", "[]")) or []
    miner_history_map = _parse_json_string(data.get("worker-dashboard-worker-history-v1", "{}")) or {}

    tenant_id = tenant_id_from_api_key(api_key)

    async with SessionLocal() as session:
        if purge_existing:
            await session.execute(delete(FinancialHistoryEntry).where(FinancialHistoryEntry.tenant_id == tenant_id))
            await session.execute(delete(MinerHistoryAggregate).where(MinerHistoryAggregate.tenant_id == tenant_id))

        for row in financial_rows:
            session.add(
                FinancialHistoryEntry(
                    tenant_id=tenant_id,
                    t=_normalize_timestamp(row.get("t")),
                    month=row.get("month"),
                    total_money=row.get("totalMoney"),
                    active_revenue=row.get("activeRevenue"),
                    promo_revenue=row.get("promoRevenue"),
                    all_active_revenue=row.get("allActiveRevenue"),
                    close_profit_now=row.get("closeProfitNow"),
                    useful_profit_24h=row.get("usefulProfit24h"),
                    usdt_wallet=row.get("usdtWallet"),
                    bot_margin=row.get("botMargin"),
                    btc_value=row.get("btcValue"),
                    btc_wallet=row.get("btcWallet"),
                    promo_margin=row.get("promoMargin"),
                    own_miner_count=row.get("ownWorkerCount"),
                    payload_json=json.dumps(row, ensure_ascii=True),
                )
            )

        for miner_ref, history in miner_history_map.items():
            history = history if isinstance(history, list) else []
            t_values = [_normalize_timestamp(item.get("t")) for item in history if isinstance(item, dict) and item.get("t") is not None]
            session.add(
                MinerHistoryAggregate(
                    tenant_id=tenant_id,
                    miner_ref=str(miner_ref),
                    snapshot_count=len(history),
                    first_t=min(t_values) if t_values else None,
                    last_t=max(t_values) if t_values else None,
                    history_json=json.dumps(history, ensure_ascii=True),
                )
            )

        await session.commit()

    print(
        json.dumps(
            {
                "ok": True,
                "tenant_id": tenant_id,
                "financial_rows_imported": len(financial_rows),
                "miner_aggregates_imported": len(miner_history_map),
            }
        )
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Import worker dashboard backup data into SQL tables.")
    parser.add_argument("--backup-path", required=True, help="Absolute path to the dashboard backup JSON file.")
    parser.add_argument("--api-key", required=True, help="API key used to resolve tenant_id.")
    parser.add_argument("--purge-existing", action="store_true", help="Delete tenant rows before importing.")
    args = parser.parse_args()
    asyncio.run(run(Path(args.backup_path), args.api_key, args.purge_existing))


if __name__ == "__main__":
    main()
