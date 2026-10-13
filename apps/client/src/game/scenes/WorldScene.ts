import Phaser from 'phaser';
import { InputSystem } from '../systems/InputSystem';
import { ColyseusClient } from '../network/ColyseusClient';
import { GAME } from '@mboa/shared';

const LANDMARKS = [
  { x: 400, y: 280, label: 'Maquis Central', color: 0xc62828, w: 90, h: 60 },
  { x: 620, y: 350, label: 'Carrefour', color: 0x5d4037, w: 70, h: 50 },
  { x: 250, y: 420, label: 'Boutique', color: 0x1565c0, w: 70, h: 50 },
  { x: 500, y: 480, label: 'Terrain foot', color: 0x2e7d32, w: 100, h: 70 },
  { x: 180, y: 200, label: 'Arret taxi-moto', color: 0xf9a825, w: 80, h: 40 },
];

export class WorldScene extends Phaser.Scene {
  private inputSystem!: InputSystem;
  private network!: ColyseusClient;
  private localPlayer?: Phaser.GameObjects.Container;
  private otherPlayers = new Map<string, Phaser.GameObjects.Container>();
  private inputSendTimer = 0;

  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data: { network: ColyseusClient }) {
    this.network = data.network;
  }

  create() {
    this.add.rectangle(400, 300, 1600, 1200, 0x1b5e20).setDepth(-20);
    this.add.rectangle(400, 300, 1600, 40, 0x5d4037).setDepth(-15).setAlpha(0.6);
    this.add.rectangle(400, 300, 40, 1200, 0x5d4037).setDepth(-15).setAlpha(0.6);

    LANDMARKS.forEach((lm) => {
      const rect = this.add.rectangle(lm.x, lm.y, lm.w, lm.h, lm.color).setDepth(-5);
      rect.setStrokeStyle(2, 0x000000, 0.3);
      this.add
        .text(lm.x, lm.y - lm.h / 2 - 12, lm.label, {
          fontSize: '11px',
          color: '#ffffff',
          backgroundColor: '#00000099',
          padding: { x: 4, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(5);
    });

    this.add
      .text(16, 16, 'Akwa - Game of Mboa', {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0)
      .setDepth(2000);

    this.inputSystem = new InputSystem(this);

    if (this.network.room) {
      this.network.room.state.players.onAdd((player: any, sessionId: string) => {
        this.spawnPlayer(player, sessionId);
      });
      this.network.room.state.players.onRemove((_player: any, sessionId: string) => {
        this.removePlayer(sessionId);
      });
      this.network.room.state.players.forEach((player: any, sessionId: string) => {
        this.spawnPlayer(player, sessionId);
      });
    }

    this.cameras.main.setBounds(0, 0, 1600, 1200);
  }

  update(_time: number, delta: number) {
    if (!this.inputSystem || !this.network.room) return;
    const input = this.inputSystem.getInput();
    this.inputSendTimer += delta;
    if (this.inputSendTimer >= 1000 / GAME.INPUT_SEND_RATE) {
      this.network.sendInput(input);
      this.inputSendTimer = 0;
    }
    this.network.room.state.players.forEach((player: any, sessionId: string) => {
      const container =
        sessionId === this.network.sessionId
          ? this.localPlayer
          : this.otherPlayers.get(sessionId);
      if (!container) return;
      container.x = Phaser.Math.Linear(container.x, player.x, 0.25);
      container.y = Phaser.Math.Linear(container.y, player.y, 0.25);
    });
    if (this.localPlayer) {
      this.cameras.main.centerOn(this.localPlayer.x, this.localPlayer.y);
    }
  }

  private spawnPlayer(player: any, sessionId: string) {
    if (this.otherPlayers.has(sessionId)) return;
    if (this.localPlayer && sessionId === this.network.sessionId) return;

    const container = this.add.container(player.x || 400, player.y || 300);
    const bodyColor = player.startingClass === 'connecte' ? 0x1565c0 : 0xe65100;
    const body = this.add.rectangle(0, 0, 28, 44, bodyColor);
    const head = this.add.circle(0, -30, 13, 0xf5d0a9);
    const nameTag = this.add
      .text(0, -52, player.username || 'Player', {
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: '#00000099',
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5);
    container.add([body, head, nameTag]);
    container.setDepth(10);

    if (sessionId === this.network.sessionId) {
      this.localPlayer = container;
      body.setStrokeStyle(2, 0xffffff);
    } else {
      this.otherPlayers.set(sessionId, container);
    }
  }

  private removePlayer(sessionId: string) {
    const p = this.otherPlayers.get(sessionId);
    if (p) {
      p.destroy();
      this.otherPlayers.delete(sessionId);
    }
  }

  shutdown() {
    this.inputSystem?.destroy();
  }
}
