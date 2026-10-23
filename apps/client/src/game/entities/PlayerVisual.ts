import Phaser from 'phaser';

/**
 * Layered character visual (create-game-assets + Phaser game-objects pattern).
 * Procedural only — zero external assets, free stack.
 * Layers: shadow → shoes → legs → torso → arms → head → hair → name
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
  const shoes = 0x212121;

  const shadow = scene.add.ellipse(0, 22, 26, 10, 0x000000, 0.35);
  container.add(shadow);

  const shoeL = scene.add.rectangle(-7, 20, 10, 6, shoes);
  const shoeR = scene.add.rectangle(7, 20, 10, 6, shoes);
  container.add([shoeL, shoeR]);

  const legL = scene.add.rectangle(-6, 10, 8, 16, pants);
  const legR = scene.add.rectangle(6, 10, 8, 16, pants);
  container.add([legL, legR]);

  const torso = scene.add.rectangle(0, -4, 22, 20, shirt);
  torso.setStrokeStyle(1, 0x000000, 0.15);
  container.add(torso);

  const armL = scene.add.rectangle(-14, -2, 6, 14, skin);
  const armR = scene.add.rectangle(14, -2, 6, 14, skin);
  container.add([armL, armR]);

  const head = scene.add.circle(0, -26, 12, skin);
  head.setStrokeStyle(1, 0x000000, 0.12);
  container.add(head);

  const eyeL = scene.add.circle(-4, -27, 2, 0x1a1a1a);
  const eyeR = scene.add.circle(4, -27, 2, 0x1a1a1a);
  container.add([eyeL, eyeR]);

  addHair(scene, container, data.hairStyle || 'fade', hairColor);

  const nameTag = scene.add
    .text(0, -48, data.username || 'Player', {
      fontSize: '11px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 5, y: 2 },
    })
    .setOrigin(0.5);
  container.add(nameTag);

  if (data.isLocal) {
    const ring = scene.add.circle(0, 0, 28, 0xffffff, 0);
    ring.setStrokeStyle(2, 0xf9a825, 0.7);
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
      const afro = scene.add.circle(0, -34, 14, color);
      container.add(afro);
      break;
    }
    case 'braids': {
      const top = scene.add.ellipse(0, -34, 20, 10, color);
      const b1 = scene.add.rectangle(-8, -28, 4, 10, color);
      const b2 = scene.add.rectangle(0, -28, 4, 10, color);
      const b3 = scene.add.rectangle(8, -28, 4, 10, color);
      container.add([top, b1, b2, b3]);
      break;
    }
    case 'bald':
      break;
    case 'short':
    case 'fade':
    default: {
      const cap = scene.add.ellipse(0, -34, 22, 12, color);
      container.add(cap);
      break;
    }
  }
}

/** Subtle walk bob while moving — only Y scale so facing (flipX) stays intact */
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
  const bob = 1 + Math.sin(time / 80) * 0.035;
  container.setScale(sx, bob);
}
