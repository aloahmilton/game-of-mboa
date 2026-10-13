import Phaser from 'phaser';
import { InputState, EMPTY_INPUT } from '@mboa/shared';

export class InputSystem {
  private scene: Phaser.Scene;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private keys!: {
    interact: Phaser.Input.Keyboard.Key;
    inventory: Phaser.Input.Keyboard.Key;
    emote: Phaser.Input.Keyboard.Key;
    run: Phaser.Input.Keyboard.Key;
    map: Phaser.Input.Keyboard.Key;
  };

  private joyActive = false;
  private joyVector = { x: 0, y: 0 };
  private joyBase?: Phaser.GameObjects.Arc;
  private joyThumb?: Phaser.GameObjects.Arc;
  private joyPointerId: number | null = null;
  private actionButtons: Record<string, boolean> = {};
  private gamepadIndex: number | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupKeyboard();
    this.setupTouchJoystick();
    this.setupGamepad();
  }

  private setupKeyboard() {
    if (!this.scene.input.keyboard) return;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.scene.input.keyboard.addKey('W'),
      down: this.scene.input.keyboard.addKey('S'),
      left: this.scene.input.keyboard.addKey('A'),
      right: this.scene.input.keyboard.addKey('D'),
    };
    this.keys = {
      interact: this.scene.input.keyboard.addKey('E'),
      inventory: this.scene.input.keyboard.addKey('I'),
      emote: this.scene.input.keyboard.addKey('F'),
      run: this.scene.input.keyboard.addKey('SHIFT'),
      map: this.scene.input.keyboard.addKey('M'),
    };
  }

  private setupTouchJoystick() {
    const { width, height } = this.scene.scale;
    const baseX = 90;
    const baseY = height - 90;
    const radius = 55;

    this.joyBase = this.scene.add.circle(baseX, baseY, radius, 0x000000, 0.35).setScrollFactor(0).setDepth(1000).setInteractive();
    this.joyThumb = this.scene.add.circle(baseX, baseY, 28, 0xffffff, 0.55).setScrollFactor(0).setDepth(1001);

    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, baseX, baseY);
      if (dist < radius + 20 && this.joyPointerId === null) {
        this.joyActive = true;
        this.joyPointerId = pointer.id;
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.joyActive || pointer.id !== this.joyPointerId) return;
      const dx = pointer.x - baseX;
      const dy = pointer.y - baseY;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
      const angle = Math.atan2(dy, dx);
      this.joyThumb?.setPosition(baseX + Math.cos(angle) * dist, baseY + Math.sin(angle) * dist);
      this.joyVector.x = dist > 8 ? Math.cos(angle) : 0;
      this.joyVector.y = dist > 8 ? Math.sin(angle) : 0;
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (pointer.id === this.joyPointerId) {
        this.joyActive = false;
        this.joyPointerId = null;
        this.joyVector = { x: 0, y: 0 };
        this.joyThumb?.setPosition(baseX, baseY);
      }
    });

    this.createActionButton(width - 80, height - 160, 'interact', 0x4caf50);
    this.createActionButton(width - 80, height - 80, 'emote', 0x9c27b0);
  }

  private createActionButton(x: number, y: number, action: string, color: number) {
    const btn = this.scene.add.circle(x, y, 32, color, 0.7).setScrollFactor(0).setDepth(1000).setInteractive();
    btn.on('pointerdown', () => { this.actionButtons[action] = true; });
    btn.on('pointerup', () => { this.actionButtons[action] = false; });
    btn.on('pointerout', () => { this.actionButtons[action] = false; });
  }

  private setupGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index;
      console.log('[Input] Manette connected:', e.gamepad.id);
    });
    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = null;
      console.log('[Input] Manette disconnected');
    });
  }

  getInput(): InputState {
    const input: InputState = { ...EMPTY_INPUT, timestamp: Date.now() };

    if (this.cursors) {
      if (this.cursors.left.isDown || this.wasd.left.isDown) input.moveX -= 1;
      if (this.cursors.right.isDown || this.wasd.right.isDown) input.moveX += 1;
      if (this.cursors.up.isDown || this.wasd.up.isDown) input.moveY -= 1;
      if (this.cursors.down.isDown || this.wasd.down.isDown) input.moveY += 1;
      input.interact = this.keys.interact.isDown || this.cursors.space.isDown;
      input.inventory = this.keys.inventory.isDown;
      input.emote = this.keys.emote.isDown;
      input.run = this.keys.run.isDown;
      input.map = this.keys.map.isDown;
    }

    if (this.joyActive) {
      input.moveX = this.joyVector.x;
      input.moveY = this.joyVector.y;
    }
    if (this.actionButtons.interact) input.interact = true;
    if (this.actionButtons.emote) input.emote = true;

    const pads = navigator.getGamepads?.() || [];
    const pad = this.gamepadIndex !== null ? pads[this.gamepadIndex] : pads[0];
    if (pad) {
      const deadzone = 0.15;
      const lx = Math.abs(pad.axes[0]) > deadzone ? pad.axes[0] : 0;
      const ly = Math.abs(pad.axes[1]) > deadzone ? pad.axes[1] : 0;
      if (lx !== 0 || ly !== 0) {
        input.moveX = lx;
        input.moveY = ly;
      }
      if (pad.buttons[0]?.pressed) input.interact = true;
      if (pad.buttons[2]?.pressed) input.inventory = true;
      if (pad.buttons[3]?.pressed) input.emote = true;
      if (pad.buttons[7]?.pressed || pad.buttons[5]?.pressed) input.run = true;
      if (pad.buttons[8]?.pressed) input.map = true;
    }

    const len = Math.sqrt(input.moveX * input.moveX + input.moveY * input.moveY);
    if (len > 1) {
      input.moveX /= len;
      input.moveY /= len;
    }
    return input;
  }

  destroy() {
    this.joyBase?.destroy();
    this.joyThumb?.destroy();
  }
}
