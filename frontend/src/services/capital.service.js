/**
 * Capital domain service.
 * Mock implementation — ready for /api/v1/capital backend integration.
 */

import { mockCall } from './api-client.js';
import { capitalMock } from '../mocks/capital.mock.js';

export const capitalService = {
  async getBuckets()  { return mockCall(capitalMock.buckets); },
  async getByTicker() { return mockCall(capitalMock.byTicker); },
  async getByRisk()   { return mockCall(capitalMock.byRisk); },
  async getHistory()  { return mockCall(capitalMock.history); },
};
