from fastapi import APIRouter, HTTPException, Query

from app.schemas.analyzer.klines import KlineOut, KlinesResponse
from app.schemas.analyzer.range_velocity import (
    EconomicsMetrics,
    MarketMetrics,
    RangeMetrics,
    RangeVelocityResponse,
    ScoreMetrics,
)
from app.services.analyzer_service import analyzer_service, asset_profile_for_symbol, default_execution_efficiency

router = APIRouter(prefix="/analyzer")


@router.get("/market/klines", response_model=KlinesResponse)
async def analyzer_market_klines(
    symbol: str = Query(..., min_length=2),
    interval: str = Query(...),
    limit: int = Query(500, ge=1, le=2000),
    startTime: int | None = Query(None),
    endTime: int | None = Query(None),
    source: str | None = Query(None),
) -> KlinesResponse:
    resolved_source, klines = await analyzer_service.fetch_klines(
        symbol=symbol,
        interval=interval,
        limit=limit,
        source=source,
        start_time=startTime,
        end_time=endTime,
    )

    return KlinesResponse(
        symbol=symbol.upper(),
        interval=interval,
        source=resolved_source,
        startTime=klines[0].timestamp if klines else None,
        endTime=klines[-1].timestamp if klines else None,
        count=len(klines),
        klines=[KlineOut(**k.__dict__) for k in klines],
    )


@router.get("/grid/range-velocity", response_model=RangeVelocityResponse)
async def analyzer_range_velocity(
    symbol: str = Query(..., min_length=2),
    interval: str = Query("5m"),
    bottom: float = Query(...),
    top: float = Query(...),
    grids: int = Query(..., ge=1),
    lookbackHours: int = Query(72, ge=1, le=720),
    perVolume: float | None = Query(None, gt=0),
    feeRateRoundTrip: float = Query(0.001, ge=0, le=0.02),
    executionEfficiency: float | None = Query(None, ge=0, le=1),
    source: str | None = Query(None),
) -> RangeVelocityResponse:
    if top <= bottom:
        raise HTTPException(status_code=400, detail="top must be greater than bottom")

    if interval not in {"1m", "5m", "15m"}:
        raise HTTPException(status_code=400, detail="interval must be one of ['1m','5m','15m']")

    resolved_source, klines = await analyzer_service.fetch_klines_for_lookback(
        symbol=symbol,
        interval=interval,
        lookback_hours=lookbackHours,
        source=source,
    )

    grid_step = (top - bottom) / grids
    if grid_step <= 0:
        raise HTTPException(status_code=400, detail="invalid grid step")

    in_range_count = 0
    crossings = 0
    reversal_hits = 0
    total_segments = max(1, len(klines) - 1)

    for idx, k in enumerate(klines):
        if k.low <= top and k.high >= bottom:
            in_range_count += 1

        line = bottom
        while line <= top:
            if k.low <= line <= k.high:
                crossings += 1
            line += grid_step

        if idx > 0:
            prev = klines[idx - 1]
            if (k.close - prev.close) * (prev.close - prev.open) < 0:
                reversal_hits += 1

    span_days = max(lookbackHours / 24, 1 / 24)
    raw_crossings_per_day = crossings / span_days
    cycles_per_day_raw = raw_crossings_per_day / max(grids * 2, 1)
    efficiency = executionEfficiency if executionEfficiency is not None else default_execution_efficiency(symbol)
    cycles_per_day = cycles_per_day_raw * efficiency

    current_price = klines[-1].close
    current_price_out_of_range = current_price < bottom or current_price > top

    net_profit_per_cycle = None
    estimated_daily_profit = None
    requires_per_volume = perVolume is None
    if perVolume is not None:
        gross = perVolume * grid_step
        fees = gross * feeRateRoundTrip
        net_profit_per_cycle = gross - fees
        estimated_daily_profit = net_profit_per_cycle * cycles_per_day

    if current_price_out_of_range:
        decision = "wait_for_reentry"
        confidence = 0.8
    elif requires_per_volume:
        decision = "needs_per_volume"
        confidence = 0.7
    elif (estimated_daily_profit or 0) >= 1:
        decision = "go"
        confidence = 0.75
    else:
        decision = "watch"
        confidence = 0.6

    in_range_eff = in_range_count / max(len(klines), 1)
    reversal_eff = reversal_hits / max(total_segments, 1)

    return RangeVelocityResponse(
        symbol=symbol.upper(),
        interval=interval,
        source=resolved_source,
        assetProfile=asset_profile_for_symbol(symbol),
        range=RangeMetrics(
            bottom=bottom,
            top=top,
            grids=grids,
            gridStep=grid_step,
            currentPrice=current_price,
            currentPriceOutOfRange=current_price_out_of_range,
        ),
        market=MarketMetrics(
            rawCrossings=crossings,
            rawCrossingsPerDay=raw_crossings_per_day,
            inRangeEfficiency=in_range_eff,
            reversalEfficiency=reversal_eff,
            executionEfficiency=efficiency,
            cyclesPerDayRaw=cycles_per_day_raw,
            cyclesPerDay=cycles_per_day,
        ),
        economics=EconomicsMetrics(
            requiresPerVolume=requires_per_volume,
            estimatedDailyProfit=estimated_daily_profit,
            netProfitPerCycle=net_profit_per_cycle,
        ),
        score=ScoreMetrics(decision=decision, confidence=confidence),
    )
