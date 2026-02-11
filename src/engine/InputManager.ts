/**
 * InputManager - Handles keyboard and mouse input
 * Provides a clean API for querying input state
 */

export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private keysJustPressed: Map<string, boolean> = new Map();
  private mouseMovement = { x: 0, y: 0 };

  constructor(canvas: HTMLElement) {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  private onKeyDown(event: KeyboardEvent): void {
    const key = event.code.toLowerCase();
    if (!this.keys.get(key)) {
      this.keysJustPressed.set(key, true);
    }
    this.keys.set(key, true);
  }

  private onKeyUp(event: KeyboardEvent): void {
    const key = event.code.toLowerCase();
    this.keys.set(key, false);
  }

  private onMouseMove(event: MouseEvent): void {
    if (document.pointerLockElement) {
      this.mouseMovement.x = event.movementX;
      this.mouseMovement.y = event.movementY;
    }
  }

  update(): void {
    // Clear just-pressed flags each frame
    this.keysJustPressed.clear();
    this.mouseMovement.x = 0;
    this.mouseMovement.y = 0;
  }

  isKeyDown(code: string): boolean {
    return this.keys.get(code.toLowerCase()) ?? false;
  }

  isKeyJustPressed(code: string): boolean {
    return this.keysJustPressed.get(code.toLowerCase()) ?? false;
  }

  getMouseMovement(): { x: number; y: number } {
    return { ...this.mouseMovement };
  }

  // Convenience getters for common actions
  get moveForward(): boolean {
    return this.isKeyDown('keyw') || this.isKeyDown('arrowup');
  }
  get moveBackward(): boolean {
    return this.isKeyDown('keys') || this.isKeyDown('arrowdown');
  }
  get moveLeft(): boolean {
    return this.isKeyDown('keya') || this.isKeyDown('arrowleft');
  }
  get moveRight(): boolean {
    return this.isKeyDown('keyd') || this.isKeyDown('arrowright');
  }
  get jump(): boolean {
    return this.isKeyJustPressed('space');
  }
  get run(): boolean {
    return this.isKeyDown('shiftleft') || this.isKeyDown('shiftright');
  }
  get crouch(): boolean {
    return this.isKeyDown('controlLeft') || this.isKeyDown('controlleft');
  }

  get movementVector(): { x: number; z: number } {
    let x = 0;
    let z = 0;
    if (this.moveForward) z -= 1;
    if (this.moveBackward) z += 1;
    if (this.moveLeft) x -= 1;
    if (this.moveRight) x += 1;
    // Normalize diagonal movement
    const len = Math.sqrt(x * x + z * z);
    if (len > 0) {
      x /= len;
      z /= len;
    }
    return { x, z };
  }
}
