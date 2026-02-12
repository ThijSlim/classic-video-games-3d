---
name: game-object-patterns
description: Catalog of all game objects in the 3D platformer with their patterns, configurations, and code examples. Use this when designing or implementing new game objects.
---

# Game Object Patterns

Reference catalog for all game objects in **Super Mario 3D Web Edition**. Use this skill when creating new game objects or modifying existing ones.

## Base Class: GameObject

All game objects extend `GameObject` from `src/engine/GameObject.ts`.

```typescript
export abstract class GameObject {
  protected engine: GameEngine;
  mesh!: THREE.Object3D;
  body!: CANNON.Body;
  isActive = true;

  constructor(engine: GameEngine) { this.engine = engine; }
  abstract create(): void;
  abstract update(deltaTime: number): void;
  protected syncMeshToBody(): void { /* copies body pos/rot to mesh */ }
  destroy(): void { /* removes mesh + body, sets isActive = false */ }
}
```

**Key contract:**
- `create()` — Build visuals (Three.js) and physics (cannon-es), add to engine
- `update(deltaTime)` — Called every frame; always guard with `if (!this.isActive) return;`
- `destroy()` — Clean removal from scene and physics world

---

## Existing Objects

### Mario (Player Character)
- **File:** `src/game/objects/Mario.ts`
- **Config:** `InputManager` (no config object — takes input directly)
- **Visual:** Collada 3D model loaded from `/assets/mario/mario.dae` via `ColladaLoader`. Native model ~90 units tall, scaled 0.02 to ~1.8 game units. Includes shadow decal plane beneath. Model wrapped in container group to preserve Z_UP rotation from loader.
- **Assets:** `/public/assets/mario/` — `mario.dae` (Collada model), `mario.fbx` (FBX alternative), ~30 texture PNGs (eyes variants: center/closed/dead/half_closed/left/right/up/down; colors: blue/red/white/skin/shoe/hair; overalls_button, mustache, sideburn, logo, metal, wing/wing_tip). Textures with `_edit` suffix are editor variants.
- **Physics:** `CANNON.Box(0.3, 0.5, 0.3)`, mass=1, fixedRotation=true
- **States:** Idle, Running, Jumping, DoubleJump, TripleJump, GroundPound, WallSlide, Falling, Dead
- **Game state:** coins, stars, lives (100 coins = 1 extra life), isGameOver, isDead
- **Public methods:** `die()`, `respawn()`, `resetGame()`, `collectCoin()`, `collectStar()`
- **Pattern:** State machine enum + switch-based animation
- **Movement speeds:** walk=14, run=22 (with gravity=-25)
- **Jump forces:** single=13, double=15, triple=19

### Platform (Static Surface)
- **File:** `src/game/objects/Platform.ts`
- **Config:** `PlatformConfig { position: {x,y,z}, size: {x,y,z}, color: number }`
- **Visual:** `THREE.BoxGeometry` with `MeshStandardMaterial`
- **Physics:** `CANNON.Box` (half-extents of size), mass=0 (static)
- **Pattern:** Simplest possible game object — good template for new static objects

### Coin (Collectible)
- **File:** `src/game/objects/Coin.ts`
- **Config:** `position: { x: number, y: number, z: number }`
- **Visual:** `THREE.CylinderGeometry` (flat disc) rotated upright + glow sphere overlay
- **Physics:** `CANNON.Sphere(0.5)`, mass=0, `isTrigger: true`, `collisionResponse: false`
- **Behavior:** Spins on Y-axis, bobs up/down sinusoidally, random phase offset
- **Pattern:** Trigger-based collectible with visual feedback

### Goomba (Patrolling Enemy)
- **File:** `src/game/objects/Goomba.ts`
- **Config:** `GoombaConfig { x, y, z: number, patrolRadius: number }`
- **Visual:** Multi-part mushroom character (body sphere, head/cap, eyes, pupils, eyebrows, feet)
- **Physics:** `CANNON.Sphere(0.4)`, mass=0 (kinematic), collisionResponse=true
- **Behavior:** Circular patrol path using sin/cos, walk bob animation
- **Pattern:** Kinematic enemy with config-driven patrol behavior

### PeachCastle (Large Static Structure) — Added 2026-02-12
- **File:** `src/game/objects/PeachCastle.ts`
- **Config:** `PeachCastleConfig { position: { x, y, z: number } }`
- **Visual:** ~49 meshes — earthen mound, moat ring, main body box, hip roof (4-sided cone), central tower + spire, 4 corner turrets with conical roofs, entrance arch (box+half-cylinder+half-torus), bridge with railing posts/beams, stained-glass window with gold frame, 8 circular windows
- **Physics:** 8 `CANNON.Body` instances (mass=0, static): mound box, main body box, central tower cylinder, 4 turret cylinders, bridge box. Uses **Multiple Physics Bodies pattern** (see below)
- **Materials:** 10 shared materials reused across all meshes (stone, roof, wood, water, gold, dark, earth, flag, glass, frame)
- **Behavior:** Static structure, flags animated with sine wave in `update()`
- **Pattern:** Multi-body static structure with animated decorations
- **Scale reference:** 0.75 game units per real-world meter (entrance arch = 3 game units for 4m real arch)

---

## Common Patterns

### Pattern: Config-Driven Object
```typescript
interface MyConfig {
  x: number; y: number; z: number;
  // ... specific properties
}

export class MyObject extends GameObject {
  private config: MyConfig;
  constructor(engine: GameEngine, config: MyConfig) {
    super(engine);
    this.config = config;
    this.create();
  }
}
```

### Pattern: Multi-Part Visual
```typescript
create(): void {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
  const part = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
  part.castShadow = true;
  group.add(part);
  // ... more parts ...
  group.position.set(this.config.x, this.config.y, this.config.z);
  this.mesh = group;
  this.engine.addToScene(this.mesh);
}
```

### Pattern: Trigger Collectible
```typescript
this.body = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Sphere(0.5),
  position: new CANNON.Vec3(x, y, z),
  isTrigger: true,
  collisionResponse: false,
});
```

### Pattern: Kinematic Movement (Patrol)
```typescript
update(deltaTime: number): void {
  this.angle += this.speed * deltaTime;
  const newX = this.startX + Math.cos(this.angle) * this.radius;
  const newZ = this.startZ + Math.sin(this.angle) * this.radius;
  this.mesh.position.set(newX, this.config.y, newZ);
  this.body.position.set(newX, this.config.y, newZ);
}
```

### Pattern: Sinusoidal Animation
```typescript
update(deltaTime: number): void {
  this.time += deltaTime;
  this.mesh.position.y = this.startY + Math.sin(this.time * speed) * amplitude;
}
```

### Pattern: Multiple Physics Bodies (Added 2026-02-12)
When a game object needs more than one collision shape (e.g., a large building with distinct collidable sections), store extra bodies in a private array and override `destroy()` to clean them all up:
```typescript
private bodies: CANNON.Body[] = [];

create(): void {
  // Create each physics body, add to engine, and track it
  const wallBody = new CANNON.Body({ mass: 0, shape: new CANNON.Box(...) });
  this.engine.addPhysicsBody(wallBody);
  this.bodies.push(wallBody);

  // Set one as the primary for GameObject compatibility
  this.body = mainBody;
}

destroy(): void {
  this.isActive = false;
  if (this.mesh) this.engine.removeFromScene(this.mesh);
  for (const b of this.bodies) {
    this.engine.removePhysicsBody(b);
  }
}
```
**When to use:** Complex structures where a single CANNON shape can't approximate the collision surface (e.g., castle with turrets, bridge, and main body as separate collidable zones).
**Tip:** Assign the most important body to `this.body` for compatibility with code that expects `GameObject.body`.

### Pattern: Animated Elements on Static Object (Added 2026-02-12)
Store animated sub-meshes in a typed array and animate them in `update()`. Use index-based phase offsets for visual variety:
```typescript
private flags: THREE.Mesh[] = [];
private flagTime = 0;

create(): void {
  for (let i = 0; i < 4; i++) {
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), flagMat);
    flag.position.set(corners[i].x + 0.4, 20.25, corners[i].z);
    group.add(flag);
    this.flags.push(flag);
  }
}

update(deltaTime: number): void {
  if (!this.isActive) return;
  this.flagTime += deltaTime;
  for (let i = 0; i < this.flags.length; i++) {
    this.flags[i].rotation.y = Math.sin(this.flagTime * 3 + i * 1.5) * 0.3;
  }
}
```
**When to use:** Static objects that need subtle motion for visual interest (flags, torches, spinning gears). The base structure doesn't move, only the decorations.

---

## World Integration

Objects are added in `World.buildLevel()`:
```typescript
// Array-driven placement
const positions = [{ x: 5, y: 1, z: 5 }, { x: -5, y: 1, z: 5 }];
for (const pos of positions) {
  this.addEntity(new MyObject(this.engine, pos));
}
```

Decorative objects (trees, pipes) are added directly to the scene without being tracked as entities.

### World Collision Detection

World.ts manages typed arrays of game objects for collision checking:
```typescript
private mario: Mario | null = null;
private coins: Coin[] = [];
private goombas: Goomba[] = [];
```

Collisions are checked each frame in `update()` after entity updates:
```typescript
if (this.mario && !this.mario.isDead && !this.mario.isGameOver) {
  this.checkCoinCollisions();
  this.checkGoombaCollisions();
}
```

---

## Patterns Added: 2026-02-11

### Pattern: Death Animation
Disable `collisionResponse` so the body ignores platforms, apply upward velocity for a "pop" effect, spin the mesh, then handle respawn or game-over after a timer:
```typescript
die(): void {
  if (this.isDead) return;
  this.isDead = true;
  this.state = MarioState.Dead;
  this.deathTimer = 0;
  this.body.collisionResponse = false;
  this.body.velocity.set(0, 12, 0); // Pop up
}

// In update(), when isDead:
this.mesh.rotation.z = this.deathTimer * 3; // Spin
if (this.deathTimer > 2) this.handleDeathComplete();
```

### Pattern: Distance-Based Collision (World-Level)
Check distance between bodies in the World update loop instead of relying on physics events for game logic:
```typescript
private checkCollisions(): void {
  const marioPos = this.mario.body.position;
  for (const obj of this.targetObjects) {
    if (!obj.isActive) continue;
    const dx = marioPos.x - obj.body.position.x;
    const dy = marioPos.y - obj.body.position.y;
    const dz = marioPos.z - obj.body.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < hitRadius) {
      // Handle collision
    }
  }
}
```
**When to use:** For game-logic collisions (collecting items, enemy hits) where cannon-es trigger events are unreliable or hard to wire up. Keep radius values small: 1.0-1.2 for contact, 0.5-0.8 for precision.

### Pattern: Game State Reset
Separate `respawn()` (position reset) from `resetGame()` (full state reset) for clean restart flow:
```typescript
respawn(): void {
  this.body.position.set(0, 5, 0);
  this.body.velocity.set(0, 0, 0);
  this.isGrounded = false;
}

resetGame(): void {
  this.lives = 3;
  this.coins = 0;
  this.stars = 0;
  this.isGameOver = false;
  this.isDead = false;
  this.respawn();
}
```

### Pattern: Loading External 3D Models (Collada)
Use `ColladaLoader` to load `.dae` models. Wrap the loaded scene in a container group to isolate the loader's Z_UP rotation correction from your own animation transforms. Guard animation code with a `modelLoaded` flag since loading is async.
```typescript
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

private modelLoaded = false;

private loadModel(): void {
  const loader = new ColladaLoader();
  loader.load('/assets/mario/mario.dae', (collada) => {
    const model = collada.scene;
    const s = 0.02; // Scale native units to game units
    model.scale.set(s, s, s);

    // Enable shadows on all meshes
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });

    // Wrap to preserve loader's rotation
    const container = new THREE.Group();
    container.add(model);
    this.marioGroup.add(container);
    this.modelLoaded = true;
  });
}
```
**Key points:**
- The loader may apply a Z_UP → Y_UP rotation on the scene root; wrapping in a container prevents animation code from overwriting it
- Always enable `castShadow`/`receiveShadow` via `traverse()` on loaded models
- Use `modelLoaded` flag to skip animation until the model is ready

### Pattern: Game-Over UI Overlay
Use a CSS overlay (`display: none` toggled to `display: flex` via `.visible` class) controlled from `main.ts`:
```typescript
// In game loop:
if (mario.isGameOver && !gameOverShown) {
  gameOverShown = true;
  gameOverEl.classList.add('visible');
  document.exitPointerLock();
}

// Restart handler:
restartBtn.addEventListener('click', () => {
  mario.resetGame();
  gameOverEl.classList.remove('visible');
  gameOverShown = false;
});
```
