import { Room, Client } from '@colyseus/core';
import { WorldState } from '../schema/WorldState';
import { PlayerSchema } from '../schema/PlayerSchema';
import {
  createPlayer,
  GAME,
  ACTIVITIES,
  ClientJoinMessage,
  ClientInputMessage,
  ClientChatMessage,
  ClientActivityMessage,
} from '@mboa/shared';

export class WorldRoom extends Room<WorldState> {
  maxClients = GAME.MAX_PLAYERS_PER_ROOM;
  private needInterval: NodeJS.Timeout | null = null;

  onCreate(options: any) {
    this.setState(new WorldState());
    this.state.districtId = options.districtId || GAME.DEFAULT_DISTRICT;

    this.onMessage('*', (client, type, message) => {
      this.handleMessage(client, type, message);
    });

    this.needInterval = setInterval(() => {
      this.decayNeeds();
    }, GAME.NEED_TICK_INTERVAL_MS);

    this.setPatchRate(1000 / GAME.TICK_RATE);
    console.log(`[WorldRoom] Created for district: ${this.state.districtId}`);
  }

  onJoin(client: Client, _options: any) {
    console.log(`[WorldRoom] Client joined: ${client.sessionId}`);
  }

  onLeave(client: Client, _consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      this.state.players.delete(client.sessionId);
      console.log(`[WorldRoom] Player left: ${player.username}`);
    }
  }

  onDispose() {
    if (this.needInterval) clearInterval(this.needInterval);
    console.log(`[WorldRoom] Disposed`);
  }

  private handleMessage(client: Client, type: string | number, message: any) {
    switch (type) {
      case 'join':
        this.handleJoin(client, message as ClientJoinMessage);
        break;
      case 'input':
        this.handleInput(client, message as ClientInputMessage);
        break;
      case 'chat':
        this.handleChat(client, message as ClientChatMessage);
        break;
      case 'activity':
        this.handleActivity(client, message as ClientActivityMessage);
        break;
      default:
        console.warn(`[WorldRoom] Unknown message type: ${type}`);
    }
  }

  private handleJoin(client: Client, data: ClientJoinMessage) {
    if (this.state.players.has(client.sessionId)) return;

    const playerData = createPlayer({
      username: data.username,
      startingClass: data.startingClass,
      appearance: data.appearance,
      sessionId: client.sessionId,
    });

    const player = new PlayerSchema();
    player.id = playerData.id;
    player.username = playerData.username;
    player.startingClass = playerData.startingClass;
    player.skinTone = playerData.appearance.skinTone;
    player.hairStyle = playerData.appearance.hairStyle;
    player.hairColor = playerData.appearance.hairColor;
    player.face = playerData.appearance.face;
    player.top = playerData.appearance.top;
    player.bottom = playerData.appearance.bottom;
    player.shoes = playerData.appearance.shoes;
    player.x = playerData.position.x;
    player.y = playerData.position.y;
    player.districtId = playerData.position.districtId;
    player.direction = playerData.position.direction;
    player.hunger = playerData.needs.hunger;
    player.energy = playerData.needs.energy;
    player.fun = playerData.needs.fun;
    player.social = playerData.needs.social;
    player.hygiene = playerData.needs.hygiene;
    player.money = playerData.money;

    this.state.players.set(client.sessionId, player);

    client.send('welcome', {
      type: 'welcome',
      playerId: player.id,
      sessionId: client.sessionId,
    });

    console.log(`[WorldRoom] Player created: ${player.username} (${player.startingClass})`);
  }

  private handleInput(client: Client, data: ClientInputMessage) {
    const player = this.state.players.get(client.sessionId);
    if (!player || player.currentActivity) return;

    const input = data.input;
    const speed = input.run
      ? GAME.PLAYER_SPEED * GAME.PLAYER_RUN_MULTIPLIER
      : GAME.PLAYER_SPEED;
    const dt = 1 / GAME.TICK_RATE;

    if (input.moveX !== 0 || input.moveY !== 0) {
      player.x += input.moveX * speed * dt;
      player.y += input.moveY * speed * dt;
      player.isMoving = true;
      player.isRunning = input.run;

      if (Math.abs(input.moveX) > Math.abs(input.moveY)) {
        player.direction = input.moveX > 0 ? 'right' : 'left';
      } else if (input.moveY !== 0) {
        player.direction = input.moveY > 0 ? 'down' : 'up';
      }
    } else {
      player.isMoving = false;
      player.isRunning = false;
    }
  }

  private handleChat(client: Client, data: ClientChatMessage) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;

    const text = (data.text || '').trim().slice(0, GAME.MAX_CHAT_LENGTH);
    if (!text) return;

    this.broadcast('chat', {
      type: 'chat',
      playerId: player.id,
      username: player.username,
      text,
      timestamp: Date.now(),
    });
  }

  private handleActivity(client: Client, data: ClientActivityMessage) {
    const player = this.state.players.get(client.sessionId);
    if (!player || player.currentActivity) return;

    const activity = ACTIVITIES[data.activityId];
    if (!activity) {
      client.send('notification', {
        type: 'notification',
        level: 'error',
        message: 'Unknown activity',
      });
      return;
    }

    if (activity.effects.money && activity.effects.money < 0) {
      if (player.money < Math.abs(activity.effects.money)) {
        client.send('notification', {
          type: 'notification',
          level: 'warning',
          message: 'Not enough CFA',
        });
        return;
      }
    }

    player.currentActivity = activity.id;

    setTimeout(() => {
      if (!this.state.players.has(client.sessionId)) return;
      const p = this.state.players.get(client.sessionId)!;

      if (activity.effects.hunger) p.hunger = clamp(p.hunger + activity.effects.hunger, 0, 100);
      if (activity.effects.energy) p.energy = clamp(p.energy + activity.effects.energy, 0, 100);
      if (activity.effects.fun) p.fun = clamp(p.fun + activity.effects.fun, 0, 100);
      if (activity.effects.social) p.social = clamp(p.social + activity.effects.social, 0, 100);
      if (activity.effects.hygiene) p.hygiene = clamp(p.hygiene + activity.effects.hygiene, 0, 100);
      if (activity.effects.money) p.money = Math.max(0, p.money + activity.effects.money);

      p.currentActivity = '';

      client.send('activity-result', {
        type: 'activity-result',
        activityId: activity.id,
        success: true,
        effects: activity.effects,
        message: `You finished: ${activity.name}`,
      });
    }, activity.durationSeconds * 1000);
  }

  private decayNeeds() {
    this.state.players.forEach((player) => {
      player.hunger = clamp(player.hunger - 1.5, 0, 100);
      player.energy = clamp(player.energy - 1.0, 0, 100);
      player.fun = clamp(player.fun - 0.8, 0, 100);
      player.social = clamp(player.social - 0.6, 0, 100);
      player.hygiene = clamp(player.hygiene - 0.4, 0, 100);
    });
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
