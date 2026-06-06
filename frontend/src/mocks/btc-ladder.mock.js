export const btcLadderMock = {
  config: {
    capitalAllocated: 13_050,
    levels: 12,
    maxDip: -15,
    currentBtcPrice: 43_820,
    stepPct: 1.25,
    startPrice: 43_400,
  },

  rungs: [
    { id: 'r1',  price: 43_400, usdt: 1_087.50, btc: 0.02505, status: 'filled',   fillTime: Date.now() - 3_600_000 * 5 },
    { id: 'r2',  price: 42_855, usdt: 1_087.50, btc: 0.02538, status: 'filled',   fillTime: Date.now() - 3_600_000 * 3 },
    { id: 'r3',  price: 42_320, usdt: 1_087.50, btc: 0.02570, status: 'filled',   fillTime: null },
    { id: 'r4',  price: 41_796, usdt: 1_087.50, btc: 0.02603, status: 'pending',  fillTime: null },
    { id: 'r5',  price: 41_282, usdt: 1_087.50, btc: 0.02635, status: 'pending',  fillTime: null },
    { id: 'r6',  price: 40_776, usdt: 1_087.50, btc: 0.02666, status: 'pending',  fillTime: null },
    { id: 'r7',  price: 40_280, usdt: 1_087.50, btc: 0.02700, status: 'pending',  fillTime: null },
    { id: 'r8',  price: 39_793, usdt: 1_087.50, btc: 0.02733, status: 'pending',  fillTime: null },
    { id: 'r9',  price: 39_315, usdt: 1_087.50, btc: 0.02765, status: 'pending',  fillTime: null },
    { id: 'r10', price: 38_847, usdt: 1_087.50, btc: 0.02800, status: 'pending',  fillTime: null },
    { id: 'r11', price: 38_388, usdt: 1_087.50, btc: 0.02834, status: 'pending',  fillTime: null },
    { id: 'r12', price: 37_938, usdt: 1_087.50, btc: 0.02868, status: 'pending',  fillTime: null },
  ],

  summary: {
    filled: 3,
    pending: 9,
    btcAcquired: 0.07613,
    btcAcquiredUsd: 3_336.54,
    usdtRemaining: 9_787.50,
  },
};
