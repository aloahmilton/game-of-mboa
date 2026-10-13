export const GAME = {
  PLAYER_SPEED: 120,
  PLAYER_RUN_MULTIPLIER: 1.7,
  PLAYER_SIZE: 48,
  TICK_RATE: 20,
  INPUT_SEND_RATE: 20,
  MAX_PLAYERS_PER_ROOM: 80,
  NEED_TICK_INTERVAL_MS: 10_000,
  STARTING_MONEY: {
    connecte: 25_000,
    debrouillard: 3_500,
  },
  STARTING_NEEDS: {
    hunger: 80,
    energy: 90,
    fun: 70,
    social: 60,
    hygiene: 85,
  },
  MIN_MONEY: 0,
  MAX_CHAT_LENGTH: 120,
  DEFAULT_DISTRICT: 'akwa',
  TILE_SIZE: 32,
} as const;

export type GameConstants = typeof GAME;
