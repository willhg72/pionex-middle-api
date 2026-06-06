/**
 * Opportunities domain service.
 * Mock implementation — ready for /api/v1/opportunities backend integration.
 */

import { mockCall } from './api-client.js';
import { opportunitiesMock } from '../mocks/opportunities.mock.js';

export const opportunitiesService = {
  async getCandidates() {
    return mockCall(opportunitiesMock.candidates);
  },

  async previewCreate(candidateId, params) {
    return mockCall({ action: 'create-miner', candidateId, params });
  },

  async executeCreate(candidateId, params) {
    return mockCall({ success: true, minerId: `m-${Date.now()}`, candidateId });
  },

  async simulateCapital(candidateId, capital) {
    const c = opportunitiesMock.candidates.find(x => x.id === candidateId);
    return mockCall({
      capital,
      estimatedMonthly: (c?.estimatedMonthly || 0) * (capital / (c?.capitalRequired || 1)),
      estimatedAnnual:  (c?.estimatedAnnual  || 0) * (capital / (c?.capitalRequired || 1)),
    });
  },
};
