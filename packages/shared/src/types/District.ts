export interface District {
  id: string;
  name: string;
  displayName: string;
  description: string;
  vibe: string;
  availableJobs: string[];
  availableActivities: string[];
  spawnPoints: { x: number; y: number }[];
  isUnlockedByDefault: boolean;
}

export type DistrictId =
  | 'akwa'
  | 'bonanjo'
  | 'new-bell'
  | 'bepanda'
  | 'bonapriso'
  | 'deido'
  | 'bali'
  | 'makepe';
