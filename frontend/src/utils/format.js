/**
 * Number and value formatting utilities for trading dashboard.
 */
import { formatCurrency, formatDateTime, formatNumber, getLanguage, getLocale, getTimezone } from '../services/i18n.js';

export const fmt = {
  /** Format as USD currency */
  usd(value, decimals = 0) {
    return formatCurrency(Math.abs(value), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  /** Format signed USD (shows + or -) */
  pnl(value, decimals = 2) {
    const sign = value >= 0 ? '+' : '-';
    const currency = formatCurrency(Math.abs(value), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${sign}${currency}`;
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
    if (Math.abs(value) >= 1_000_000) return `${formatCurrency(value / 1_000_000, { maximumFractionDigits: 2 })}M`;
    if (Math.abs(value) >= 1_000) return `${formatCurrency(value / 1_000, { maximumFractionDigits: 1 })}K`;
    return formatCurrency(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    return formatDateTime(ts, {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  },

  /** Format datetime short */
  datetime(ts) {
    return formatDateTime(ts, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  },

  /** Risk score to label */
  riskLabel(score) {
    if (score < 25) return getLanguage() === 'en' ? 'Minimal' : 'Mínimo';
    if (score < 50) return getLanguage() === 'en' ? 'Low' : 'Bajo';
    if (score < 65) return getLanguage() === 'en' ? 'Medium' : 'Medio';
    if (score < 80) return getLanguage() === 'en' ? 'High' : 'Alto';
    return getLanguage() === 'en' ? 'Critical' : 'Crítico';
  },

  /** Risk score to CSS class */
  riskClass(score) {
    if (score < 50) return 'positive';
    if (score < 65) return 'warning';
    return 'negative';
  },

  number(value, decimals = 0) {
    return formatNumber(value, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  locale() {
    return getLocale();
  },

  timezone() {
    return getTimezone();
  },
};
