export type AdType = 'rewarded' | 'interstitial' | 'banner';

export type AdPlacement =
  | 'extra_energy'
  | 'double_pay'
  | 'daily_bonus'
  | 'unlock_temp_item'
  | 'after_shift'
  | 'low_energy'
  | 'menu_banner';

export interface AdRequest {
  type: AdType;
  placement: AdPlacement;
  playerId: string;
}

export interface AdResult {
  success: boolean;
  placement: AdPlacement;
  reward?: {
    type: 'money' | 'energy' | 'item' | 'multiplier';
    amount?: number;
    itemId?: string;
    durationSeconds?: number;
  };
  error?: string;
}

export interface AdProvider {
  name: string;
  isReady(): boolean;
  show(request: AdRequest): Promise<AdResult>;
}
