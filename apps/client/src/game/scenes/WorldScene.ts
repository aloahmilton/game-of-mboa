import Phaser from 'phaser';
import { InputSystem } from '../systems/InputSystem';
import { ColyseusClient } from '../network/ColyseusClient';
import { GAME } from '@mboa/shared';

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
    this.add.rectangle(400, 300, 1600, 1200, 0x2e7d32).setDepth(-10);

    this.add
      .text(20, 20, 'Akwa - Game of Mboa', {
        fontSize: '18px',
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
      const container = this.otherPlayers.get(sessionId) || this.localPlayer;
      if (!container) return;
      container.x = Phaser.Math.Linear(container.x, player.x, 0.25);
      container.y = Phaser.Math.Linear(container.y, player.y, 0.25);
    });

    if (this.localPlayer) {
      this.cameras.main.centerOn(this.localPlayer.x, this.localPlayer.y);
    }
  }

  private spawnPlayer(player: any, sessionId: string) {
    if (this.otherPlayers.has(sessionId) || (this.localPlayer && sessionId === this.network.sessionId)) {
      return;
    }

    const container = this.add.container(player.x, player.y);
    const body = this.add.rectangle(0, 0, 32, 48, this.getColorForClass(player.startingClass));
    const head = this.add.circle(0, -32, 14, 0xf5d0a9);
    const nameTag = this.add
      .text(0, -55, player.username, {
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

  private getColorForClass(startingClass: string) {
    return startingClass === 'connecte' ? 0x1565c0 : 0xe65100;
  }

  shutdown() {
    this.inputSystem?.destroy();
  }
}
