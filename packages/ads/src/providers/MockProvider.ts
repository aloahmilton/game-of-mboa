import { AdProvider, AdRequest, AdResult } from '../types';

export class MockProvider implements AdProvider {
  name = 'mock';

  isReady() {
    return true;
  }

  async show(request: AdRequest): Promise<AdResult> {
    await new Promise((r) => setTimeout(r, 1500));

    const rewards: Record<string, AdResult['reward']> = {
      extra_energy: { type: 'energy', amount: 30 },
      double_pay: { type: 'multiplier', amount: 2, durationSeconds: 300 },
      daily_bonus: { type: 'money', amount: 1500 },
      unlock_temp_item: { type: 'item', itemId: 'temp_chain', durationSeconds: 600 },
      after_shift: { type: 'money', amount: 2000 },
      low_energy: { type: 'energy', amount: 40 },
    };

    return {
      success: true,
      placement: request.placement,
      reward: rewards[request.placement] || { type: 'money', amount: 500 },
    };
  }
}
