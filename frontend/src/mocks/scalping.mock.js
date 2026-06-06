export const scalpingMock = {
  config: {
    mode: 'futures',
    riskPerTrade: 1.5,
    leverage: 10,
    dailyTargetMin: 150,
    dailyTargetMax: 400,
    capitalAllocated: 8_500,
  },

  stats: {
    todayPnl: +187.40,
    todayTrades: 12,
    winRate: 66.7,
    dailyProgress: 52.1,
    weeklyPnl: +842.20,
    avgWin: 48.30,
    avgLoss: -24.10,
    sharpeRatio: 1.84,
  },

  signals: [
    { id: 's1', ticker: 'BTCUSDT', direction: 'LONG',  strength: 'strong',  entry: 43_820, sl: 43_580, tp: 44_240, rr: 1.9, timeframe: '5m', confidence: 84, ts: Date.now() - 120_000 },
    { id: 's2', ticker: 'ETHUSDT', direction: 'SHORT', strength: 'medium',  entry: 2_315,  sl: 2_335,  tp: 2_278,  rr: 1.85, timeframe: '15m', confidence: 71, ts: Date.now() - 300_000 },
    { id: 's3', ticker: 'SOLUSDT', direction: 'LONG',  strength: 'weak',    entry: 101.2,  sl: 99.8,   tp: 103.8,  rr: 1.86, timeframe: '5m', confidence: 58, ts: Date.now() - 480_000 },
  ],

  monitors: [
    { ticker: 'BTCUSDT', pnl: +92.40, status: 'active', leverage: 10, size: 850,  entry: 43_200, current: 43_820 },
    { ticker: 'ETHUSDT', pnl: +45.80, status: 'active', leverage: 10, size: 500,  entry: 2_265,  current: 2_315 },
  ],

  journal: [
    { id: 'j1', date: '2024-06-04', ticker: 'BTCUSDT', direction: 'LONG',  pnl: +148.20, notes: 'Clean break of 43k resistance. Executed well.' },
    { id: 'j2', date: '2024-06-04', ticker: 'SOLUSDT', direction: 'SHORT', pnl: -48.10,  notes: 'Stopped out. Failed breakdown — momentum reversed.' },
    { id: 'j3', date: '2024-06-03', ticker: 'ETHUSDT', direction: 'LONG',  pnl: +212.80, notes: 'EMA bounce + volume confirmation. Held for full target.' },
  ],
};
