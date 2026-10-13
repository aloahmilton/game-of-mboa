import { Player, CharacterAppearance, StartingClass } from '../types/Player';
import { GAME } from '../constants/game';
import { DEFAULT_DISTRICT_ID, DISTRICTS } from '../constants/districts';

const DEFAULT_APPEARANCE: CharacterAppearance = {
  skinTone: 'medium',
  hairStyle: 'fade',
  hairColor: 'black',
  face: 'default',
  top: 'simple-shirt',
  bottom: 'jeans',
  shoes: 'sneakers',
  accessories: [],
};

export function createPlayer(options: {
  username: string;
  startingClass: StartingClass;
  appearance?: CharacterAppearance;
  sessionId?: string;
  userId?: string;
}): Player {
  const { username, startingClass, appearance, sessionId, userId } = options;

  const district = DISTRICTS[DEFAULT_DISTRICT_ID];
  const spawn = district?.spawnPoints[0] ?? { x: 400, y: 300 };

  const now = Date.now();

  return {
    id: crypto.randomUUID?.() ?? `player_${now}_${Math.random().toString(36).slice(2, 9)}`,
    sessionId,
    userId,
    username: username.trim().slice(0, 20) || 'Player',
    appearance: appearance ?? DEFAULT_APPEARANCE,
    startingClass,
    needs: { ...GAME.STARTING_NEEDS },
    money: GAME.STARTING_MONEY[startingClass],
    position: {
      x: spawn.x,
      y: spawn.y,
      districtId: DEFAULT_DISTRICT_ID,
      direction: 'down',
    },
    isMoving: false,
    isRunning: false,
    currentActivity: undefined,
    createdAt: now,
    lastActiveAt: now,
  };
}
