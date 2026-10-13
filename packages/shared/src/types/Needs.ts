export type NeedType = 'hunger' | 'energy' | 'fun' | 'social' | 'hygiene';

export interface NeedConfig {
  id: NeedType;
  label: string;
  labelFr: string;
  max: number;
  decayPerMinute: number;
  criticalThreshold: number;
  color: string;
}

export const NEED_CONFIGS: Record<NeedType, NeedConfig> = {
  hunger: {
    id: 'hunger',
    label: 'Hunger',
    labelFr: 'Faim',
    max: 100,
    decayPerMinute: 0.8,
    criticalThreshold: 20,
    color: '#e74c3c',
  },
  energy: {
    id: 'energy',
    label: 'Energy',
    labelFr: 'Energie',
    max: 100,
    decayPerMinute: 0.6,
    criticalThreshold: 15,
    color: '#f39c12',
  },
  fun: {
    id: 'fun',
    label: 'Fun',
    labelFr: 'Amusement',
    max: 100,
    decayPerMinute: 0.5,
    criticalThreshold: 25,
    color: '#9b59b6',
  },
  social: {
    id: 'social',
    label: 'Social',
    labelFr: 'Social',
    max: 100,
    decayPerMinute: 0.4,
    criticalThreshold: 20,
    color: '#3498db',
  },
  hygiene: {
    id: 'hygiene',
    label: 'Hygiene',
    labelFr: 'Hygiene',
    max: 100,
    decayPerMinute: 0.3,
    criticalThreshold: 15,
    color: '#1abc9c',
  },
};
