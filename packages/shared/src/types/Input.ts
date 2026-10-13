export interface InputState {
  moveX: number;
  moveY: number;
  interact: boolean;
  inventory: boolean;
  emote: boolean;
  run: boolean;
  map: boolean;
  timestamp: number;
}

export const EMPTY_INPUT: InputState = {
  moveX: 0,
  moveY: 0,
  interact: false,
  inventory: false,
  emote: false,
  run: false,
  map: false,
  timestamp: 0,
};
