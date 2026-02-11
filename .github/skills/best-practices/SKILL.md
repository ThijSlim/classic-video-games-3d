---
name: best-practices
description: Accumulated best practices, lessons learned, and coding standards for the 3D platformer project. Updated by the learning agent after each feature cycle.
---

# Best Practices

Accumulated knowledge from building **Super Mario 3D Web Edition**. This file is continuously updated by the learning agent.

---

## Code Architecture

### Game Object Design
- **One class per file** in `src/game/objects/`
- **Config interface** in the same file, exported alongside the class
- **Constructor pattern:** `constructor(engine, config) → super(engine) → this.config = config → this.create()`
- **Guard clause:** Always start `update()` with `if (!this.isActive) return;`

### State Management
- Keep game state on the owning object (Mario owns coins/stars/lives)
- Use TypeScript `enum` for state machines (not string literals)
- HUD reads state — never writes it

### Engine Boundaries
- Game objects should only interact with the engine through the `GameEngine` API
- Don't access `scene`, `physicsWorld`, or `renderer` directly
- Use `this.engine.addToScene()` / `this.engine.addPhysicsBody()` for registration

## Visual Design

### Material Selection
| Use Case | Material | Key Properties |
|----------|----------|----------------|
| Solid objects | `MeshStandardMaterial` | color, roughness: 0.8, metalness: 0.1 |
| Metallic/shiny | `MeshStandardMaterial` | metalness: 0.8, roughness: 0.2 |
| Glowing | `MeshStandardMaterial` | + emissive, emissiveIntensity |
| Transparent overlay | `MeshBasicMaterial` | transparent: true, opacity: 0.15 |
| Shadow decal | `MeshBasicMaterial` | color: 0x000000, transparent, depthWrite: false |

### Geometry Segment Counts
- Character parts: 8-12 segments (good enough for small features)
- Large objects: 16 segments (pipes, cylinders)
- Tiny details (eyes, pupils): 6-8 segments
- Ground/platforms: no segments needed (BoxGeometry)

### Color Palette (Mario style)
- Red: `0xFF0000` (Mario, hat)
- Blue: `0x0000CC` (overalls)
- Green: `0x4CAF50` (grass), `0x388E3C` (pipes), `0x2E7D32` (foliage)
- Brown: `0x8B4513` (enemies), `0x5D4037` (wood), `0x795548` (stone steps)
- Gold: `0xFFD700` (coins)
- Gray: `0x9E9E9E` / `0xBDBDBD` (castle, stone)
- Sky: `0x87CEEB`

## Physics Design

### Body Mass Guide
| Entity Type | Mass | fixedRotation | Notes |
|-------------|------|---------------|-------|
| Player | 1 | true | linearDamping: 0.1 |
| Static platform | 0 | N/A | Default static body |
| Collectible | 0 | N/A | isTrigger: true |
| Enemy (patrol) | 0 | N/A | Move via position update |
| Projectile | 0.1-0.5 | false | Apply velocity/force |
| Moving platform | 0 | N/A | Kinematic — update position |

### Collision Shape Sizing
- Physics shapes should **approximately** match visuals — not exact
- Slightly smaller collision shapes feel better for platforming (player fits through gaps)
- Use `CANNON.Sphere` for round objects, `CANNON.Box` for blocky ones
- `CANNON.Cylinder` for pipes and columns

## World Building

### Object Placement
- Use array-driven placement for repeating objects (coins, enemies)
- Generate positions with `Array.from({ length: N }, (_, i) => ...)` for patterns
- Use trigonometric functions for circular arrangements
- Keep objects inside the ground platform bounds (40×40 default)

### Level Design Principles
- Ground level at y=0 (ground platform top surface)
- Floating platforms at y=3, 5, 7, 9+ (progressively higher)
- Coins at ~2 units above the surface they sit on
- Enemies at y=1 (slightly above ground for visual clarity)
- Trees and decorations near edges to frame the play area

## Common Mistakes to Avoid

1. **Forgetting `castShadow`** — Objects look flat without shadow casting
2. **Wrong physics shape size** — Remember `CANNON.Box` takes half-extents, not full size
3. **Not capping deltaTime** — Tab-switch causes huge delta spikes; engine caps at 0.05
4. **Forgetting isActive guard** — Destroyed objects still get update() calls
5. **Direct scene access** — Always use engine API methods
6. **Material per mesh** — Reuse materials when colors are the same
7. **Position-based ground checks** — Never use `body.position.y < N` to detect ground; it breaks on elevated platforms. Use collision normals instead
8. **Wrong collision normal sign** — `contact.ni` direction depends on body order (`contact.bi` vs `contact.bj`); always check `contact.bi === this.body` before reading the normal
9. **Missing isDead/isGameOver guards** — Always skip collision checks and input handling when Mario is dead or game is over
10. **Missing velocity reset on no input** — When using direct velocity control (`body.velocity.x = speed`), always zero velocity in the "no input" branch. An early `return` without zeroing leaves the body sliding forever (especially with low friction/damping)

---

## Collision & Interaction Design (Added 2026-02-11)

### Distance-Based vs Physics-Event Collisions
- **Use distance-based** (World-level loop) for game-logic interactions: coin collection, enemy contact, item pickups. Simpler to implement, easier to debug, reliable.
- **Use physics events** (`body.addEventListener('collide')`) for physical interactions: ground detection, wall sliding, platform riding. These need contact normals.
- **Don't mix them** for the same purpose — pick one approach per interaction type.

### Collision Radius Guide
| Interaction | Radius | Notes |
|------------|--------|-------|
| Coin collection | 1.2 | Generous — feels better to collect easily |
| Enemy contact (damage) | 1.0 | Tighter — unfair hits feel bad |
| Stomp detection | Check dy > 0.5 | Player must be above enemy |

### Death & Game-Over Flow
1. `mario.die()` — Sets `isDead=true`, disables collisionResponse, starts pop-up animation
2. Death animation runs for ~2 seconds (timer-based)
3. `handleDeathComplete()` — Decrements lives; if lives <= 0, sets `isGameOver=true`; otherwise calls `respawn()`
4. `main.ts` game loop detects `isGameOver` flag and shows overlay
5. Restart button calls `mario.resetGame()` which resets all state and respawns

### Typed Object Arrays in World.ts
Keep separate typed arrays (`coins: Coin[]`, `goombas: Goomba[]`) alongside the generic `entities: GameObject[]`. This enables efficient, type-safe collision checking without casting:
```typescript
addEntity(entity: GameObject): void {
  this.entities.push(entity);
  if (entity instanceof Mario) this.mario = entity;
}
```

### UI Overlay Pattern
- Define overlay HTML in `index.html` with `display: none` default
- Toggle with CSS class `.visible` (`display: flex`)
- Control from `main.ts` game loop, not from game objects
- Use `document.exitPointerLock()` when showing overlays
- Re-lock pointer on restart

---

*Last updated: 2026-02-11*
*Updated by: learning agent — movement/jumping/game-over feature cycle*
