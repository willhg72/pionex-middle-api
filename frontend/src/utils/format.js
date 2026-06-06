/**
 * Number and value formatting utilities for trading dashboard.
 */

export const fmt = {
  /** Format as USD currency */
  usd(value, decimals = 0) {
    return '$' + Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  /** Format signed USD (shows + or -) */
  pnl(value, decimals = 2) {
    const sign = value >= 0 ? '+' : '-';
    const str = Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${sign}$${str}`;
  },

  /** Format percentage */
  pct(value, decimals = 2) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
  },

  /** Format plain percentage without sign */
  pctPlain(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  },

  /** Format number with K/M abbreviation */
  compact(value) {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  },

  /** Format BTC amount */
  btc(value, decimals = 5) {
    return `${value.toFixed(decimals)} BTC`;
  },

  /** Format leverage */
  leverage(x) {
    return `${x}x`;
  },

  /** Format date */
  date(ts) {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  },

  /** Format datetime short */
  datetime(ts) {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  },

  /** Risk score to label */
  riskLabel(score) {
    if (score < 25) return 'Minimal';
    if (score < 50) return 'Low';
    if (score < 65) return 'Medium';
    if (score < 80) return 'High';
    return 'Critical';
  },

  /** Risk score to CSS class */
  riskClass(score) {
    if (score < 50) return 'positive';
    if (score < 65) return 'warning';
    return 'negative';
  },
};
