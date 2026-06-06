export const capitalMock = {
  buckets: [
    { label: 'Active Miners',  value: 38_000, pct: 43.5, productive: true,  risk: 'medium' },
    { label: 'BTC Core',       value: 15_600, pct: 17.8, productive: true,  risk: 'low' },
    { label: 'BTC Ladder',     value: 13_050, pct: 14.9, productive: true,  risk: 'low' },
    { label: 'Scalping',       value:  8_500, pct:  9.7, productive: true,  risk: 'high' },
    { label: 'Free USDT',      value: 12_300, pct: 14.1, productive: false, risk: 'none' },
  ],

  byTicker: [
    { ticker: 'BTCUSDT', value: 27_600, pct: 31.6 },
    { ticker: 'ETHUSDT', value: 15_600, pct: 17.8 },
    { ticker: 'SOLUSDT', value: 14_000, pct: 16.0 },
    { ticker: 'XRPUSDT', value:  4_500, pct:  5.1 },
    { ticker: 'AVAXUSDT',value:  3_500, pct:  4.0 },
    { ticker: 'Other',   value: 22_250, pct: 25.5 },
  ],

  byRisk: [
    { label: 'Low Risk',    value: 28_650, pct: 32.8 },
    { label: 'Medium Risk', value: 46_000, pct: 52.6 },
    { label: 'High Risk',   value:  8_500, pct:  9.7 },
    { label: 'No Risk',     value:  4_300, pct:  4.9 },
  ],

  history: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86_400_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total:  72_000 + i * 520 + Math.random() * 1000,
    pnl:    -800 + i * 220 + Math.random() * 400,
  })),
};
