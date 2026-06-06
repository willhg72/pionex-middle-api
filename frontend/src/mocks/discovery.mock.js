export const discoveryMock = {
  universe: [
    { ticker: 'SOLUSDT',  vol24h: 4_280_000_000, trades24h: 1_842_000, volatility: 82, fundingRate: -0.008, trend: 'bullish', segment: 'promote' },
    { ticker: 'ARBUSDT',  vol24h:   620_000_000, trades24h:   380_000, volatility: 74, fundingRate: -0.005, trend: 'bullish', segment: 'promote' },
    { ticker: 'NEARUSDT', vol24h:   380_000_000, trades24h:   210_000, volatility: 68, fundingRate: +0.003, trend: 'neutral', segment: 'watch' },
    { ticker: 'INJUSDT',  vol24h:   520_000_000, trades24h:   290_000, volatility: 91, fundingRate: -0.012, trend: 'bullish', segment: 'watch' },
    { ticker: 'SUIUSDT',  vol24h:   410_000_000, trades24h:   240_000, volatility: 88, fundingRate: -0.009, trend: 'bullish', segment: 'watch' },
    { ticker: 'OPUSDT',   vol24h:   180_000_000, trades24h:    98_000, volatility: 38, fundingRate: +0.012, trend: 'bearish', segment: 'rejected' },
    { ticker: 'FTMUSDT',  vol24h:   145_000_000, trades24h:    72_000, volatility: 42, fundingRate: +0.008, trend: 'neutral', segment: 'rejected' },
    { ticker: 'BLURUSDT', vol24h:    82_000_000, trades24h:    45_000, volatility: 68, fundingRate: +0.015, trend: 'bearish', segment: 'rejected' },
  ],

  filters: {
    minVol24h: 100_000_000,
    minTrades24h: 50_000,
    minVolatility: 40,
    segments: ['promote', 'watch', 'rejected'],
  },
};
