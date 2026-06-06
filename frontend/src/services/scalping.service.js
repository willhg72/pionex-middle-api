import { mockCall } from './api-client.js';
import { scalpingMock } from '../mocks/scalping.mock.js';

export const scalpingService = {
  async getStats()    { return mockCall(scalpingMock.stats); },
  async getSignals()  { return mockCall(scalpingMock.signals); },
  async getMonitors() { return mockCall(scalpingMock.monitors); },
  async getJournal()  { return mockCall(scalpingMock.journal); },
  async executeClose(ticker) { return mockCall({ success: true, ticker, action: 'closed' }); },
};
