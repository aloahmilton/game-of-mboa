import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';

/**
 * Phaser 3 config — professional 2D top-down setup:
 * pixelArt + roundPixels (crisp edges, no blur on camera move)
 * RESIZE scale for mobile + desktop
 * Arcade physics (top-down, no gravity)
 * Gamepad for manette
 */
export function createGame(parent: string, network: any) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#1b5e20',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
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
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
    },
  };

  const game = new Phaser.Game(config);
  game.scene.start('WorldScene', { network });
  return game;
}
