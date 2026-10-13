import { InputState } from './Input';
import { CharacterAppearance, StartingClass } from './Player';

export interface ClientJoinMessage {
  type: 'join';
  username: string;
  startingClass: StartingClass;
  appearance?: CharacterAppearance;
}

export interface ClientInputMessage {
  type: 'input';
  input: InputState;
}

export interface ClientChatMessage {
  type: 'chat';
  text: string;
}

export interface ClientActivityMessage {
  type: 'activity';
  activityId: string;
}

export interface ClientEmoteMessage {
  type: 'emote';
  emoteId: string;
}

export type ClientMessage =
  | ClientJoinMessage
  | ClientInputMessage
  | ClientChatMessage
  | ClientActivityMessage
  | ClientEmoteMessage;

export interface ServerWelcomeMessage {
  type: 'welcome';
  playerId: string;
  sessionId: string;
}

export interface ServerChatBroadcast {
  type: 'chat';
  playerId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface ServerNotification {
  type: 'notification';
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface ServerActivityResult {
  type: 'activity-result';
  activityId: string;
  success: boolean;
  effects?: Record<string, number>;
  message?: string;
}

export type ServerMessage =
  | ServerWelcomeMessage
  | ServerChatBroadcast
  | ServerNotification
  | ServerActivityResult;
