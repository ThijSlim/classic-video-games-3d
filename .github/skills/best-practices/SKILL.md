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

---

*Last updated: Initial project setup*
*Updated by: learning agent*
