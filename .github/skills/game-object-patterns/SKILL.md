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
- **Visual:** Multi-part character built from boxes, cylinders, spheres (body, head, hat, arms, legs, eyes, mustache)
- **Physics:** `CANNON.Box(0.3, 0.5, 0.3)`, mass=1, fixedRotation=true
- **States:** Idle, Running, Jumping, DoubleJump, TripleJump, GroundPound, WallSlide, Falling
- **Game state:** coins, stars, lives (100 coins = 1 extra life)
- **Pattern:** State machine enum + switch-based animation

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
