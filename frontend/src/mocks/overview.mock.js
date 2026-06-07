/**
 * Overview mock data — realistic perpetual futures trading context.
 * Replace with real API calls when backend is ready.
 */

export const overviewMock = {
  totalCapital:   87_450.00,
  freeUsdt:       12_300.00,
  openPnl:        +1_842.50,
  monthlyPnl:     +5_210.00,
  riskScore:      42,
  monthlyGoal:    10_000,
  monthlyGoalProgress: 52.1,
  btcDominance: {
    startDate: '2026-05-30',
    dates: ['2026-05-30', '2026-05-31', '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05', '2026-06-06'],
    current: 56.8,
    weeklyChange: 1.7,
    trend: [52.4, 52.8, 53.1, 53.9, 54.8, 55.4, 56.1, 56.8],
    volume: [18.2, 19.1, 20.3, 22.6, 24.8, 23.9, 25.7, 27.4],
    altStrength: 43.2,
  },
  fearGreed: {
    startDate: '2026-05-30',
    dates: ['2026-05-30', '2026-05-31', '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05', '2026-06-06'],
    value: 72,
    label: 'Greed',
    previous: 64,
    history: [38, 42, 47, 51, 58, 63, 69, 72],
    volume: [2.1, 2.4, 2.8, 3.0, 3.6, 4.2, 4.9, 5.3],
  },
  aiVsBitcoin: {
    window: '90D',
    startDate: '2026-03-10',
    dates: ['2026-03-10', '2026-03-20', '2026-03-30', '2026-04-09', '2026-04-19', '2026-04-29', '2026-05-09', '2026-05-19', '2026-05-29', '2026-06-06'],
    series: {
      btc: [100, 104, 103, 109, 116, 121, 125, 131, 138, 142],
      ai: [100, 101, 107, 113, 118, 123, 131, 144, 151, 156],
    },
    volume: [7.8, 8.4, 8.1, 9.2, 10.4, 10.9, 11.8, 12.7, 13.4, 14.2],
    leaders: [
      { ticker: 'NVDA', returnPct: 56.2 },
      { ticker: 'SMCI', returnPct: 49.8 },
      { ticker: 'BTC', returnPct: 42.0 },
      { ticker: 'MSTR', returnPct: 38.4 },
    ],
  },
  btcVsMetals: {
    window: '1Y',
    startDate: '2025-06-06',
    dates: ['2025-06-06', '2025-07-06', '2025-08-06', '2025-09-06', '2025-10-06', '2025-11-06', '2025-12-06', '2026-01-06', '2026-02-06', '2026-03-06', '2026-04-06', '2026-05-06', '2026-06-06'],
    metrics: {
      price: {
        btc: [100, 106, 112, 118, 123, 129, 136, 142, 148, 155, 161, 168, 176],
        gold: [100, 101, 103, 105, 106, 108, 109, 111, 113, 114, 116, 117, 119],
        silver: [100, 98, 101, 104, 107, 106, 110, 114, 116, 119, 121, 124, 128],
        oil: [100, 96, 94, 97, 101, 99, 103, 107, 105, 108, 111, 113, 110],
        ai: [100, 104, 109, 116, 121, 129, 137, 145, 152, 159, 165, 172, 181],
      },
      volume: {
        btc: [100, 108, 114, 117, 123, 128, 136, 141, 147, 151, 156, 163, 169],
        gold: [100, 101, 99, 102, 104, 106, 108, 107, 109, 111, 110, 112, 113],
        silver: [100, 97, 103, 109, 112, 110, 116, 118, 121, 124, 126, 128, 131],
        oil: [100, 95, 93, 98, 105, 101, 108, 112, 109, 114, 117, 120, 116],
        ai: [100, 107, 111, 119, 124, 133, 139, 148, 154, 161, 167, 174, 182],
      },
      marketCap: {
        btc: [100, 105, 111, 116, 121, 127, 134, 140, 147, 153, 159, 165, 171],
        gold: [100, 100.4, 101.1, 101.9, 102.3, 103.1, 103.8, 104.3, 104.9, 105.4, 106.0, 106.5, 107.0],
        silver: [100, 98.5, 100.2, 102.6, 104.5, 103.8, 106.1, 108.9, 110.5, 112.8, 114.0, 116.3, 118.4],
        oil: [100, 97.8, 96.2, 99.0, 102.7, 101.6, 104.4, 106.3, 105.1, 107.9, 109.8, 111.4, 109.7],
        ai: [100, 105.5, 111.8, 119.7, 126.4, 134.8, 142.6, 150.1, 157.9, 165.2, 172.3, 179.6, 187.4],
      },
    },
    series: {
      btc: [100, 106, 112, 118, 123, 129, 136, 142, 148, 155, 161, 168, 176],
      gold: [100, 101, 103, 105, 106, 108, 109, 111, 113, 114, 116, 117, 119],
      silver: [100, 98, 101, 104, 107, 106, 110, 114, 116, 119, 121, 124, 128],
      oil: [100, 96, 94, 97, 101, 99, 103, 107, 105, 108, 111, 113, 110],
      ai: [100, 104, 109, 116, 121, 129, 137, 145, 152, 159, 165, 172, 181],
    },
    volume: [9.2, 9.6, 9.8, 10.1, 10.8, 11.3, 11.9, 12.4, 12.9, 13.5, 14.0, 14.4, 15.1],
    insight: 'BTC and the AI basket have outrun the rest of the macro complex over the last year, while gold and silver provided steadier defensive performance and oil remained more cyclical.',
  },
  btcPriceLiquidations: {
    window: '14D',
    startDate: '2026-05-24',
    dates: ['2026-05-24', '2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30', '2026-05-31', '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05', '2026-06-06'],
    price: {
      spot: 108_400,
      previous: 105_900,
      index: [100.0, 101.2, 100.6, 102.4, 103.1, 104.8, 104.1, 105.3, 106.0, 105.4, 106.9, 107.8, 108.1, 108.7],
    },
    liquidations: {
      total: [0.9, 1.1, 1.4, 1.0, 1.8, 2.6, 2.1, 3.4, 2.8, 3.1, 4.6, 3.9, 4.2, 3.7],
      latest: 3.7,
      longShare: 61,
      shortShare: 39,
    },
    insight: 'Liquidation pressure has stayed elevated while BTC continues to grind higher, which suggests crowded leverage and higher odds of sudden squeeze-driven moves.',
  },

  capitalMiners:  38_000,
  capitalScalp:    8_500,
  capitalBtcCore: 15_600,
  capitalLadder:  13_050,
  capitalIdle:    12_300,

  capitalAllocation: [
    { label: 'Active Miners',  value: 38_000, color: 'var(--color-strategy-miners)',  pct: 43.5 },
    { label: 'BTC Core',       value: 15_600, color: 'var(--color-strategy-btccore)', pct: 17.8 },
    { label: 'BTC Ladder',     value: 13_050, color: 'var(--color-strategy-ladder)',  pct: 14.9 },
    { label: 'Scalping',       value:  8_500, color: 'var(--color-strategy-scalp)',   pct:  9.7 },
    { label: 'Free / Idle',    value: 12_300, color: 'var(--color-strategy-idle)',    pct: 14.1 },
  ],

  liquidity: {
    exposure:   75_150,
    free:       12_300,
    totalPortfolio: 87_450,
    exposurePct:    85.9,
  },

  alerts: [
    { id: 1, level: 'danger',  message: 'XRPUSDT miner grid gap exceeded 4.2% — consider regrid', time: '4m ago' },
    { id: 2, level: 'warning', message: 'BTC ladder has 3 unfilled levels past lower bound', time: '12m ago' },
    { id: 3, level: 'warning', message: 'Scalping daily target at 78% — reduce position sizing', time: '28m ago' },
    { id: 4, level: 'info',    message: 'Monthly goal progress: 52.1% — on track', time: '1h ago' },
  ],

  advisor: {
    generatedAt: Date.now() - 300_000,
    executiveSummary: 'Your portfolio is performing within expected parameters. Capital efficiency is strong at 85.9% deployed, with healthy diversification across 4 active strategies. Open PnL of +$1,842 indicates positive momentum in current positions. Risk score of 42/100 suggests conservative-moderate exposure — appropriate for current market conditions.',
    recommendations: [
      {
        priority: 1,
        category: 'Capital Reallocation',
        action: 'Deploy $5,000 from idle reserves into SOLUSDT miner',
        rationale: 'SOL volatility is elevated (7-day realized vol: 82%) — favorable grid mining conditions.',
        impact: 'Est. +$180–$340/month additional yield',
        risk: 'Low',
      },
      {
        priority: 2,
        category: 'Risk Reduction',
        action: 'Regrid XRPUSDT miner — current grid gap is suboptimal',
        rationale: 'Gap widened to 4.2% vs optimal 2.8% for current volatility regime.',
        impact: 'Reduces regrid frequency, improves fill rate',
        risk: 'Minimal operational risk',
      },
      {
        priority: 3,
        category: 'BTC Ladder',
        action: 'Extend BTC ladder lower bound by $2,000 at -8% levels',
        rationale: 'BTC showing consolidation signals — extended ladder captures potential dip.',
        impact: 'Captures additional BTC accumulation on deeper dips',
        risk: 'Capital locked in lower ladder rungs',
      },
    ],
    riskSuggestions: [
      'Total exposure (85.9%) is approaching your 90% soft limit — monitor free liquidity.',
      'XRPUSDT miner represents single-ticker concentration risk. Consider diversifying to 3+ tickers.',
      'Scalping leverage at 10x is within profile, but reduce to 7x if daily PnL drops below -$200.',
    ],
    educationalTips: [
      {
        title: 'Grid Mining in High-Volatility Markets',
        body: 'When realized volatility exceeds 80%, tighten grid spacing to capture more oscillations. Consider widening the outer bounds to avoid premature grid close.',
      },
      {
        title: 'Capital Efficiency Principle',
        body: 'Keeping 10–15% in free USDT provides tactical flexibility without sacrificing yield. Your current 14.1% idle is well-positioned.',
      },
    ],
    warnings: [
      { level: 'high',   text: 'XRPUSDT grid gap requires attention within 24h' },
      { level: 'medium', text: 'BTC ladder lower levels unfilled — market may not revisit' },
    ],
    whatIfSimulations: null, // Placeholder for future AI what-if engine
  },

  recommendedActions: [
    { id: 'regrid-xrp',   label: 'Regrid XRPUSDT',          route: 'miners',  urgency: 'high' },
    { id: 'deploy-sol',   label: 'New SOL Opportunity',      route: 'opportunities', urgency: 'medium' },
    { id: 'extend-ladder','label': 'Extend BTC Ladder',      route: 'btc-ladder', urgency: 'medium' },
    { id: 'review-scalp', label: 'Review Scalping Limits',   route: 'scalping', urgency: 'low' },
  ],
};
