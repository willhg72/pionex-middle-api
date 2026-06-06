import { mockCall } from './api-client.js';
import { discoveryMock } from '../mocks/discovery.mock.js';

export const discoveryService = {
  async getUniverse()              { return mockCall(discoveryMock.universe); },
  async promote(ticker)            { return mockCall({ success: true, ticker, segment: 'opportunities' }); },
  async watch(ticker)              { return mockCall({ success: true, ticker, segment: 'watch' }); },
  async reject(ticker)             { return mockCall({ success: true, ticker, segment: 'rejected' }); },
  async addSymbol(ticker)          { return mockCall({ success: true, ticker, added: true }); },
  async scanUniverse(filters)      { return mockCall({ scanned: 1000, matches: discoveryMock.universe.length, filters }); },
};
