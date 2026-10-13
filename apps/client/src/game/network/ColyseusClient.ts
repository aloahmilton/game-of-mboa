import { Client, Room } from 'colyseus.js';
import { InputState } from '@mboa/shared';

const COLYSEUS_URL = import.meta.env.VITE_COLYSEUS_URL || 'ws://localhost:2567';

export class ColyseusClient {
  private client: Client;
  public room: Room | null = null;
  public sessionId: string | null = null;
  public playerId: string | null = null;

  constructor() {
    this.client = new Client(COLYSEUS_URL);
  }

  async joinWorld(options: {
    username: string;
    startingClass: 'connecte' | 'debrouillard';
    appearance?: any;
  }) {
    this.room = await this.client.joinOrCreate('world', {});

    this.room.send('join', {
      type: 'join',
      username: options.username,
      startingClass: options.startingClass,
      appearance: options.appearance,
    });

    this.room.onMessage('welcome', (msg: any) => {
      this.playerId = msg.playerId;
      this.sessionId = msg.sessionId;
      console.log('[Network] Welcome', msg);
    });

    this.room.onMessage('chat', (msg: any) => {
      window.dispatchEvent(new CustomEvent('mboa:chat', { detail: msg }));
    });

    this.room.onMessage('notification', (msg: any) => {
      window.dispatchEvent(new CustomEvent('mboa:notification', { detail: msg }));
    });

    this.room.onMessage('activity-result', (msg: any) => {
      window.dispatchEvent(new CustomEvent('mboa:activity-result', { detail: msg }));
    });

    return this.room;
  }

  sendInput(input: InputState) {
    if (!this.room) return;
    this.room.send('input', { type: 'input', input });
  }

  sendChat(text: string) {
    if (!this.room) return;
    this.room.send('chat', { type: 'chat', text });
  }

  sendActivity(activityId: string) {
    if (!this.room) return;
    this.room.send('activity', { type: 'activity', activityId });
  }

  leave() {
    this.room?.leave();
    this.room = null;
  }
}
