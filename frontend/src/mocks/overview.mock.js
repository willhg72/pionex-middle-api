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
