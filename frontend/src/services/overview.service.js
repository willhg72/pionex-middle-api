/**
 * Overview domain service.
 * Mock implementation — ready for /api/v1/overview backend integration.
 */

import { mockCall } from './api-client.js';
import { overviewMock } from '../mocks/overview.mock.js';

export const overviewService = {
  /** GET /api/v1/overview — full portfolio snapshot */
  async getSnapshot() {
    return mockCall({
      totalCapital:    overviewMock.totalCapital,
      freeUsdt:        overviewMock.freeUsdt,
      openPnl:         overviewMock.openPnl,
      monthlyPnl:      overviewMock.monthlyPnl,
      riskScore:       overviewMock.riskScore,
      monthlyGoal:     overviewMock.monthlyGoal,
      monthlyGoalProgress: overviewMock.monthlyGoalProgress,
      capitalAllocation:   overviewMock.capitalAllocation,
      liquidity:           overviewMock.liquidity,
    });
  },

  /** GET /api/v1/overview/alerts */
  async getAlerts() {
    return mockCall(overviewMock.alerts);
  },

  /** GET /api/v1/overview/advisor */
  async getAdvisor() {
    return mockCall(overviewMock.advisor);
  },

  /** GET /api/v1/overview/recommended-actions */
  async getRecommendedActions() {
    return mockCall(overviewMock.recommendedActions);
  },
};
