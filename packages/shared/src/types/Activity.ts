export type ActivityCategory =
  | 'survival'
  | 'work'
  | 'social'
  | 'fun'
  | 'status'
  | 'transport';

export interface ActivityEffect {
  hunger?: number;
  energy?: number;
  fun?: number;
  social?: number;
  hygiene?: number;
  money?: number;
}

export interface Activity {
  id: string;
  name: string;
  nameFr: string;
  category: ActivityCategory;
  durationSeconds: number;
  effects: ActivityEffect;
  requiredDistricts?: string[];
  requiredMoney?: number;
  description: string;
}

export interface Job {
  id: string;
  name: string;
  nameFr: string;
  basePay: number;
  energyCost: number;
  durationMinutes: number;
  requiredDistricts?: string[];
  description: string;
}
