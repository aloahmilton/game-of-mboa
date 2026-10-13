import { AdProvider, AdRequest, AdResult, AdPlacement } from './types';
import { MockProvider } from './providers/MockProvider';

export class AdManager {
  private provider: AdProvider;
  private lastShown: Record<string, number> = {};
  private cooldownMs = 45_000;

  constructor(provider?: AdProvider) {
    this.provider = provider || new MockProvider();
  }

  setProvider(provider: AdProvider) {
    this.provider = provider;
  }

  isReady() {
    return this.provider.isReady();
  }

  canShow(placement: AdPlacement, playerId: string): boolean {
    const key = `${playerId}:${placement}`;
    const last = this.lastShown[key] || 0;
    return Date.now() - last > this.cooldownMs;
  }

  async show(request: AdRequest): Promise<AdResult> {
    if (!this.canShow(request.placement, request.playerId)) {
      return {
        success: false,
        placement: request.placement,
        error: 'Please wait a moment before watching another ad',
      };
    }

    if (!this.provider.isReady()) {
      return {
        success: false,
        placement: request.placement,
        error: 'Ads not ready',
      };
    }

    const result = await this.provider.show(request);

    if (result.success) {
      this.lastShown[`${request.playerId}:${request.placement}`] = Date.now();
    }

    return result;
  }
}

export const adManager = new AdManager();
