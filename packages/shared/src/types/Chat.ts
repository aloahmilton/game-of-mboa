export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  text: string;
  timestamp: number;
  districtId?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  maxMessages: number;
}
