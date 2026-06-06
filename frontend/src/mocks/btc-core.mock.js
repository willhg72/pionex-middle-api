export const btcCoreMock = {
  config: {
    monthlyBudget: 2_000,
    currentBtc: 0.41842,
    targetBtc: 1.0,
    btcPrice: 43_820,
  },

  progress: {
    pctToTarget: 41.8,
    usdValue: 18_338,
    remaining: 0.58158,
    remainingUsd: 25_482,
  },

  purchases: [
    { id: 'b1', date: '2024-06-01', amount: 0.04580, price: 43_680, usd: 2_000.69, note: 'Monthly DCA' },
    { id: 'b2', date: '2024-05-15', amount: 0.02840, price: 62_830, usd: 1_784.37, note: 'Dip buy' },
    { id: 'b3', date: '2024-05-01', amount: 0.03240, price: 58_410, usd: 1_892.48, note: 'Monthly DCA' },
    { id: 'b4', date: '2024-04-01', amount: 0.02980, price: 67_120, usd: 2_000.18, note: 'Monthly DCA' },
  ],
};
