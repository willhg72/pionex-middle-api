import { apiFetch } from './api-client.js';

export const capitalService = {
  async getDashboard({ targetDailyUsdt = 1, fixedIncomeAnnualPct = null } = {}) {
    const qs = new URLSearchParams({
      targetDailyUsdt: String(targetDailyUsdt),
    });
    if (fixedIncomeAnnualPct !== null && fixedIncomeAnnualPct !== undefined) {
      qs.set('fixedIncomeAnnualPct', String(fixedIncomeAnnualPct));
    }
    return apiFetch(`/dashboard/capital?${qs.toString()}`);
  },
};
