import Phaser from 'phaser';

/**
 * Top-down readable character (professional 2D RPG silhouette).
 * Clear head/shoulders from above, strong shadow, limited palette.
 * Procedural — zero external assets.
 */

export type SkinTone = 'light' | 'medium' | 'dark' | 'deep';
export type HairStyle = 'fade' | 'afro' | 'braids' | 'short' | 'bald';

const SKIN: Record<SkinTone, number> = {
  light: 0xe8b896,
  medium: 0xc68642,
  dark: 0x8d5524,
  deep: 0x5c3317,
};

const HAIR: Record<string, number> = {
  black: 0x1a1a1a,
  brown: 0x4a3728,
  darkbrown: 0x2c1810,
};

export interface PlayerVisualData {
  username: string;
  startingClass: string;
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  isLocal?: boolean;
}

export function createPlayerVisual(
  scene: Phaser.Scene,
  x: number,
  y: number,
  data: PlayerVisualData
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const skin = SKIN[(data.skinTone as SkinTone) || 'medium'] ?? SKIN.medium;
  const hairColor = HAIR[data.hairColor || 'black'] ?? HAIR.black;
  const isConnecte = data.startingClass === 'connecte';
  const shirt = isConnecte ? 0x1565c0 : 0xe65100;
  const pants = isConnecte ? 0x263238 : 0x3e2723;
  const shoes = 0x1a1a1a;

  const shadow = scene.add.ellipse(0, 10, 28, 12, 0x000000, 0.4);
  container.add(shadow);

  const shoeL = scene.add.rectangle(-6, 8, 9, 5, shoes);
  const shoeR = scene.add.rectangle(6, 8, 9, 5, shoes);
  container.add([shoeL, shoeR]);

  const legL = scene.add.rectangle(-5, 2, 8, 10, pants);
  const legR = scene.add.rectangle(5, 2, 8, 10, pants);
  container.add([legL, legR]);

  const torso = scene.add.rectangle(0, -8, 24, 18, shirt);
  torso.setStrokeStyle(1, 0x000000, 0.2);
  container.add(torso);

  const armL = scene.add.rectangle(-14, -6, 7, 12, skin);
  const armR = scene.add.rectangle(14, -6, 7, 12, skin);
  container.add([armL, armR]);

  const head = scene.add.circle(0, -24, 11, skin);
  head.setStrokeStyle(1, 0x000000, 0.15);
  container.add(head);

  const eyeL = scene.add.circle(-4, -25, 2, 0x111111);
  const eyeR = scene.add.circle(4, -25, 2, 0x111111);
  container.add([eyeL, eyeR]);

  addHair(scene, container, data.hairStyle || 'fade', hairColor);

  const nameTag = scene.add
    .text(0, -42, data.username || 'Player', {
      fontSize: '11px',
      fontFamily: 'system-ui, sans-serif',
      color: '#ffffff',
      backgroundColor: '#000000cc',
      padding: { x: 5, y: 2 },
    })
    .setOrigin(0.5);
  container.add(nameTag);

  if (data.isLocal) {
    const ring = scene.add.ellipse(0, 10, 34, 14, 0xf9a825, 0);
    ring.setStrokeStyle(2, 0xf9a825, 0.85);
    container.add(ring);
  }

  container.setDepth(10);
  container.setData('username', data.username);
  container.setData('startingClass', data.startingClass);

  return container;
}

function addHair(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  style: string,
  color: number
) {
  switch (style) {
    case 'afro': {
      container.add(scene.add.circle(0, -32, 13, color));
      break;
    }
    case 'braids': {
      container.add(scene.add.ellipse(0, -32, 18, 9, color));
      container.add(scene.add.rectangle(-7, -26, 3, 9, color));
      container.add(scene.add.rectangle(0, -26, 3, 9, color));
      container.add(scene.add.rectangle(7, -26, 3, 9, color));
      break;
    }
    case 'bald':
      break;
    default: {
      container.add(scene.add.ellipse(0, -32, 20, 11, color));
      break;
    }
  }
}

export function applyWalkBob(
  container: Phaser.GameObjects.Container,
  isMoving: boolean,
  time: number
) {
  const sx = container.scaleX < 0 ? -1 : 1;
  if (!isMoving) {
    container.setScale(sx, 1);
    return;
  }
  const bob = 1 + Math.sin(time / 90) * 0.04;
  container.setScale(sx, bob);
}
