export type StartingClass = 'connecte' | 'debrouillard';

export interface CharacterAppearance {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  face: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string[];
}

export interface PlayerNeeds {
  hunger: number;
  energy: number;
  fun: number;
  social: number;
  hygiene: number;
}

export interface PlayerPosition {
  x: number;
  y: number;
  districtId: string;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Player {
  id: string;
  sessionId?: string;
  userId?: string;
  username: string;
  appearance: CharacterAppearance;
  startingClass: StartingClass;
  needs: PlayerNeeds;
  money: number;
  position: PlayerPosition;
  isMoving: boolean;
  isRunning: boolean;
  currentActivity?: string;
  createdAt: number;
  lastActiveAt: number;
}

export interface PublicPlayer {
  id: string;
  username: string;
  appearance: CharacterAppearance;
  position: PlayerPosition;
  isMoving: boolean;
  isRunning: boolean;
  currentActivity?: string;
}
