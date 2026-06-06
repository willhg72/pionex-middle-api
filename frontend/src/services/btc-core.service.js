import { mockCall } from './api-client.js';
import { btcCoreMock } from '../mocks/btc-core.mock.js';

export const btcCoreService = {
  async getConfig()    { return mockCall(btcCoreMock.config); },
  async getProgress()  { return mockCall(btcCoreMock.progress); },
  async getPurchases() { return mockCall(btcCoreMock.purchases); },
  async previewBuy(usdtAmount) {
    const btc = usdtAmount / btcCoreMock.config.btcPrice;
    return mockCall({ usdtAmount, btc, price: btcCoreMock.config.btcPrice });
  },
  async executeBuy(usdtAmount) {
    return mockCall({ success: true, usdtSpent: usdtAmount, btcReceived: usdtAmount / btcCoreMock.config.btcPrice });
  },
};
