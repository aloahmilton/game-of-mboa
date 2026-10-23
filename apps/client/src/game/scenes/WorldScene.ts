import Phaser from 'phaser';
import { InputSystem } from '../systems/InputSystem';
import { ColyseusClient } from '../network/ColyseusClient';
import { GAME } from '@mboa/shared';
import { createPlayerVisual, applyWalkBob } from '../entities/PlayerVisual';

/**
 * Akwa district world — Phaser core + create-game-assets patterns.
 * Cameroon flavour: maquis, carrefour, terrain foot, taxi-moto.
 */

const WORLD_W = 1600;
const WORLD_H = 1200;

const ZONES = [
  { x: 200, y: 200, w: 280, h: 220, color: 0x2e7d32, label: 'Quartier residentiel' },
  { x: 550, y: 250, w: 320, h: 200, color: 0x4e342e, label: 'Zone maquis' },
  { x: 300, y: 500, w: 400, h: 280, color: 0x33691e, label: 'Terrain & rue' },
  { x: 900, y: 400, w: 300, h: 250, color: 0x37474f, label: 'Centre affaires' },
];

const LANDMARKS: Array<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: number;
  label: string;
  roof?: number;
}> = [
  { x: 480, y: 260, w: 100, h: 70, color: 0xc62828, roof: 0xb71c1c, label: 'Maquis Central' },
  { x: 620, y: 360, w: 80, h: 55, color: 0x5d4037, roof: 0x3e2723, label: 'Carrefour' },
  { x: 260, y: 420, w: 75, h: 55, color: 0x1565c0, roof: 0x0d47a1, label: 'Boutique' },
  { x: 520, y: 520, w: 120, h: 80, color: 0x2e7d32, label: 'Terrain foot' },
  { x: 180, y: 200, w: 90, h: 45, color: 0xf9a825, roof: 0xf57f17, label: 'Arret taxi-moto' },
  { x: 850, y: 320, w: 90, h: 65, color: 0x455a64, roof: 0x263238, label: 'Bureau' },
  { x: 700, y: 180, w: 70, h: 50, color: 0x6d4c41, roof: 0x4e342e, label: 'Maison' },
];

export class WorldScene extends Phaser.Scene {
  private inputSystem!: InputSystem;
  private network!: any;
  private localPlayer?: Phaser.GameObjects.Container;
  private otherPlayers = new Map<string, Phaser.GameObjects.Container>();
  private inputSendTimer = 0;
  private offline = false;
  private offlineDirection: 'left' | 'right' | 'up' | 'down' = 'down';

  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data: { network: any }) {
    this.network = data.network;
    this.offline = !!(data.network?.offline || !data.network?.room);
  }

  create() {
    this.buildEnvironment();
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
    } else {
      const meta = this.network.offlineMeta || {};
      this.spawnPlayer(
        {
          x: 400,
          y: 300,
          username: meta.username || 'Solo',
          startingClass: meta.startingClass || 'debrouillard',
        },
        this.network.sessionId || 'offline-local'
      );
    }

    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBackgroundColor(0x1b5e20);
  }

  private buildEnvironment() {
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, 0x1b5e20).setDepth(-30);

    ZONES.forEach((z) => {
      this.add
        .rectangle(z.x + z.w / 2, z.y + z.h / 2, z.w, z.h, z.color, 0.45)
        .setDepth(-25);
    });

    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, 48, 0x5d4037).setDepth(-20).setAlpha(0.85);
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, 48, WORLD_H, 0x5d4037).setDepth(-20).setAlpha(0.85);
    this.add.rectangle(400, 400, 600, 28, 0x6d4c41).setDepth(-19).setAlpha(0.7);
    this.add.rectangle(700, 500, 28, 400, 0x6d4c41).setDepth(-19).setAlpha(0.7);

    for (let i = 0; i < WORLD_W; i += 40) {
      this.add.rectangle(i + 16, WORLD_H / 2, 20, 3, 0xf9a825, 0.5).setDepth(-18);
    }
    for (let j = 0; j < WORLD_H; j += 40) {
      this.add.rectangle(WORLD_W / 2, j + 16, 3, 20, 0xf9a825, 0.5).setDepth(-18);
    }

    LANDMARKS.forEach((lm) => {
      const body = this.add.rectangle(lm.x, lm.y, lm.w, lm.h, lm.color).setDepth(-5);
      body.setStrokeStyle(2, 0x000000, 0.25);
      if (lm.roof) {
        this.add
          .rectangle(lm.x, lm.y - lm.h / 2 - 6, lm.w + 8, 12, lm.roof)
          .setDepth(-4);
      }
      this.add
        .rectangle(lm.x, lm.y + lm.h / 2 - 10, 14, 18, 0x3e2723)
        .setDepth(-3);
      this.add
        .text(lm.x, lm.y - lm.h / 2 - 18, lm.label, {
          fontSize: '11px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#ffffff',
          backgroundColor: '#00000099',
          padding: { x: 4, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(5);
    });

    const trees = [
      [120, 120],
      [340, 160],
      [780, 140],
      [950, 500],
      [150, 550],
      [1000, 200],
      [400, 700],
    ];
    trees.forEach(([tx, ty]) => {
      this.add.circle(tx, ty + 8, 8, 0x5d4037).setDepth(-8);
      this.add.circle(tx, ty - 6, 16, 0x2e7d32).setDepth(-7);
    });

    this.add
      .text(16, 16, 'Akwa — Douala · Game of Mboa', {
        fontSize: '14px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#ffffff',
        backgroundColor: '#0d1b2acc',
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0)
      .setDepth(2000);

    this.add
      .text(16, 44, 'WASD / joystick / manette · Activities en bas', {
        fontSize: '11px',
        color: '#ffffffaa',
        backgroundColor: '#00000066',
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(2000);
  }

  update(time: number, delta: number) {
    if (!this.inputSystem) return;

    const input = this.inputSystem.getInput();

    if (this.offline && this.localPlayer) {
      const speed = GAME.PLAYER_SPEED * (input.run ? GAME.PLAYER_RUN_MULTIPLIER : 1);
      const dt = delta / 1000;
      const dx = input.moveX * speed * dt;
      const dy = input.moveY * speed * dt;
      const moving = Math.abs(input.moveX) > 0.05 || Math.abs(input.moveY) > 0.05;
      if (moving) {
        this.localPlayer.x = Phaser.Math.Clamp(this.localPlayer.x + dx, 24, WORLD_W - 24);
        this.localPlayer.y = Phaser.Math.Clamp(this.localPlayer.y + dy, 24, WORLD_H - 24);
        if (Math.abs(input.moveX) >= Math.abs(input.moveY)) {
          this.offlineDirection = input.moveX < 0 ? 'left' : 'right';
        } else {
          this.offlineDirection = input.moveY < 0 ? 'up' : 'down';
        }
      }
      if (this.offlineDirection === 'left') this.localPlayer.scaleX = -1;
      else if (this.offlineDirection === 'right') this.localPlayer.scaleX = 1;
      applyWalkBob(this.localPlayer, moving, time);
      this.cameras.main.startFollow(this.localPlayer, true, 0.12, 0.12);
      return;
    }

    if (!this.network.room) return;

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

      container.x = Phaser.Math.Linear(container.x, player.x, 0.28);
      container.y = Phaser.Math.Linear(container.y, player.y, 0.28);

      if (player.direction === 'left') container.scaleX = -Math.abs(container.scaleX) || -1;
      else if (player.direction === 'right') container.scaleX = Math.abs(container.scaleX) || 1;

      applyWalkBob(container, !!player.isMoving, time);
    });

    if (this.localPlayer) {
      this.cameras.main.startFollow(this.localPlayer, true, 0.12, 0.12);
    }
  }

  private spawnPlayer(player: any, sessionId: string) {
    if (this.otherPlayers.has(sessionId)) return;
    if (this.localPlayer && sessionId === this.network.sessionId) return;

    const isLocal = sessionId === this.network.sessionId || this.offline;
    const container = createPlayerVisual(this, player.x || 400, player.y || 300, {
      username: player.username || 'Player',
      startingClass: player.startingClass || 'debrouillard',
      skinTone: player.skinTone,
      hairStyle: player.hairStyle,
      hairColor: player.hairColor,
      isLocal,
    });

    if (isLocal) {
      this.localPlayer = container;
      this.cameras.main.startFollow(container, true, 0.12, 0.12);
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
