import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';

export function createGame(parent: string, network: any) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#1a3a1a',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [WorldScene],
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    input: {
      gamepad: true,
    },
  };

  const game = new Phaser.Game(config);
  game.scene.start('WorldScene', { network });
  return game;
}
