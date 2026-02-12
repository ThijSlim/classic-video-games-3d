# Composition Manifest: PeachCastle

**Status:** Ready for implementation  
**File:** `src/game/objects/PeachCastle.ts`  
**Pattern:** Config-driven, multi-part static object (extends `GameObject`)  
**World position:** `(0, 0, -25)` — set via config

---

## Origin Convention

Castle group origin `(0, 0, 0)` = **center of the castle footprint at ground level (y=0)**.  
The castle faces **+Z** (toward Mario's starting area).  
The entire castle is a single `THREE.Group` added at the world position.

---

## Vertical Reference Stack

```
y=32.0  ─── Central tower spire apex
y=28.0  ─── Central tower top / spire base
y=21.0  ─── Main roof apex
y=20.5  ─── Flag tips
y=18.5  ─── Turret roof apex
y=17.0  ─── Main roof center (geometry center)
y=15.0  ─── Turret tops / turret roof base
y=13.0  ─── Main body top / main roof base / tower base
y=9.0   ─── Stained glass window center
y=8.5   ─── Turret center
y=7.5   ─── Main body center
y=3.5   ─── Entrance arch center
y=2.0   ─── Mound top / main body base / turret base
y=1.0   ─── Mound center / bridge height
y=0.0   ─── Ground plane (group origin)
```

---

## Shared Materials (define once, reuse)

```typescript
const materials = {
  stone: new THREE.MeshStandardMaterial({
    color: 0xD4C8BE,       // Light warm grey
    roughness: 0.85,
    metalness: 0.05,
  }),
  terracotta: new THREE.MeshStandardMaterial({
    color: 0xC85A2B,       // Orange-red roof tiles
    roughness: 0.75,
    metalness: 0.05,
  }),
  earth: new THREE.MeshStandardMaterial({
    color: 0x8B6F47,       // Earth brown
    roughness: 0.95,
    metalness: 0.0,
  }),
  water: new THREE.MeshStandardMaterial({
    color: 0x3498DB,       // Blue water
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  }),
  darkVoid: new THREE.MeshStandardMaterial({
    color: 0x1A0A2E,       // Deep dark purple/black
    roughness: 1.0,
    metalness: 0.0,
  }),
  wood: new THREE.MeshStandardMaterial({
    color: 0x8B5E3C,       // Warm wood brown
    roughness: 0.9,
    metalness: 0.0,
  }),
  goldTrim: new THREE.MeshStandardMaterial({
    color: 0xD4A017,       // Antique gold
    roughness: 0.3,
    metalness: 0.7,
  }),
  stainedGlass: new THREE.MeshStandardMaterial({
    color: 0xFF85C0,       // Pink/rose
    roughness: 0.1,
    metalness: 0.2,
    emissive: 0xFFD700,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.85,
  }),
  flagRed: new THREE.MeshStandardMaterial({
    color: 0xEE1111,       // Bright red
    roughness: 0.6,
    metalness: 0.0,
    side: THREE.DoubleSide,
  }),
  flagPole: new THREE.MeshStandardMaterial({
    color: 0x888888,       // Grey metal
    roughness: 0.4,
    metalness: 0.6,
  }),
};
```

**Material count:** 10

---

## Component Specifications

### 1. Earthen Mound

**Purpose:** Raised platform beneath the castle, elevating it above the surrounding terrain.

| Property | Value |
|----------|-------|
| Geometry | `CylinderGeometry(13, 14, 2, 24)` |
| Material | `materials.earth` |
| Position | `(0, 1, 0)` |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `true` |

- Top radius 13 (slightly narrower), bottom radius 14 → gentle slope
- Top surface at y=2, base at y=0
- Wide enough to extend ~2 units beyond the castle walls in all directions

**Physics:**
| Property | Value |
|----------|-------|
| Shape | `CANNON.Cylinder(13, 14, 2, 16)` |
| Position | `(0, 1, 0)` |
| Mass | `0` (static) |

---

### 2. Moat

**Purpose:** Decorative water ring around the castle mound.

| Property | Value |
|----------|-------|
| Geometry | `RingGeometry(14, 17.5, 32)` |
| Material | `materials.water` |
| Position | `(0, 0.05, 0)` |
| Rotation | `(-Math.PI / 2, 0, 0)` — lay flat on XZ plane |
| castShadow | `false` |
| receiveShadow | `true` |

- Inner radius 14 = mound base edge
- Outer radius 17.5 = 3.5 units wide ring
- Sits just above ground to avoid z-fighting

**Physics:** None (decorative only)

---

### 3. Main Body

**Purpose:** The central rectangular stone building.

| Property | Value |
|----------|-------|
| Geometry | `BoxGeometry(22, 11, 16)` |
| Material | `materials.stone` |
| Position | `(0, 7.5, 0)` |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `true` |

- 22 wide (X) × 11 tall (Y) × 16 deep (Z)
- Base at y=2 (on mound top), top at y=13

**Physics:**
| Property | Value |
|----------|-------|
| Shape | `CANNON.Box(new CANNON.Vec3(11, 5.5, 8))` |
| Position | `(0, 7.5, 0)` |
| Mass | `0` (static) |

---

### 4. Main Hip Roof

**Purpose:** 4-sided pyramid roof covering the main body.

| Property | Value |
|----------|-------|
| Geometry | `ConeGeometry(1, 8, 4)` |
| Material | `materials.terracotta` |
| Position | `(0, 17, 0)` |
| Rotation | `(0, Math.PI / 4, 0)` — rotate 45° so faces align with box edges |
| Scale | `(15.56, 1, 11.31)` |
| castShadow | `true` |
| receiveShadow | `false` |

**Scale calculation:**
- `ConeGeometry(radius=1, height=8, segments=4)` creates a 4-sided pyramid
- After 45° Y rotation, face-to-face distance = `2 × 1 × cos(π/4)` = √2 ≈ 1.414
- Scale X = 22 / 1.414 = **15.56** (matches 22-unit width)
- Scale Z = 16 / 1.414 = **11.31** (matches 16-unit depth)
- Scale Y = 1 (height already set to 8 in constructor)
- Base at y=13 (main body top), apex at y=21
- Rise = 8 units ≈ 45° pitch from short side

**Physics:** None (complex shape; Mario lands on main body top at y=13)

---

### 5. Central Tower

**Purpose:** Tall cylindrical tower rising from the center of the roof.

#### 5a. Tower Cylinder

| Property | Value |
|----------|-------|
| Geometry | `CylinderGeometry(2.5, 2.5, 15, 16)` |
| Material | `materials.stone` |
| Position | `(0, 20.5, 0)` |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `true` |

- Diameter 5 (radius 2.5), height 15
- Base at y=13 (roof base level), top at y=28

**Physics:**
| Property | Value |
|----------|-------|
| Shape | `CANNON.Cylinder(2.5, 2.5, 15, 12)` |
| Position | `(0, 20.5, 0)` |
| Mass | `0` (static) |

#### 5b. Tower Balcony Ring

| Property | Value |
|----------|-------|
| Geometry | `TorusGeometry(2.8, 0.15, 8, 24)` |
| Material | `materials.stone` |
| Position | `(0, 27.5, 0)` |
| Rotation | `(-Math.PI / 2, 0, 0)` — horizontal ring |
| castShadow | `true` |
| receiveShadow | `false` |

- Decorative ledge ring near tower top

**Physics:** None (decorative)

#### 5c. Tower Spire

| Property | Value |
|----------|-------|
| Geometry | `ConeGeometry(2.8, 4, 16)` |
| Material | `materials.terracotta` |
| Position | `(0, 30, 0)` |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `false` |

- Radius 2.8 (slightly wider than tower for eave overhang), height 4
- Base at y=28, apex at y=32
- Pitch ≈ 55° (atan(4/2.8) = 55°)

**Physics:** None

---

### 6. Corner Turrets (×4)

**Purpose:** Cylindrical towers at each corner of the main body with conical roofs and flags.

**Positions (4 instances):**

| ID | X | Y (center) | Z | Label |
|----|---|------------|---|-------|
| FL | -11 | 8.5 | +8 | Front-left |
| FR | +11 | 8.5 | +8 | Front-right |
| BL | -11 | 8.5 | -8 | Back-left |
| BR | +11 | 8.5 | -8 | Back-right |

#### 6a. Turret Cylinder (×4)

| Property | Value |
|----------|-------|
| Geometry | `CylinderGeometry(1.75, 1.75, 13, 12)` |
| Material | `materials.stone` |
| Position | `(tx, 8.5, tz)` per table above |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `true` |

- Diameter 3.5, height 13
- Base at y=2 (mound top), top at y=15

**Physics (per turret):**
| Property | Value |
|----------|-------|
| Shape | `CANNON.Cylinder(1.75, 1.75, 13, 10)` |
| Position | `(tx, 8.5, tz)` |
| Mass | `0` (static) |

#### 6b. Turret Conical Roof (×4)

| Property | Value |
|----------|-------|
| Geometry | `ConeGeometry(2.0, 3.5, 12)` |
| Material | `materials.terracotta` |
| Position | `(tx, 16.75, tz)` |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `false` |

- Radius 2.0 (slightly wider than turret for overhang), height 3.5
- Base at y=15, apex at y=18.5
- Pitch ≈ 60° (atan(3.5/2.0) = 60.3°)

**Physics:** None

#### 6c. Flag Pole (×4)

| Property | Value |
|----------|-------|
| Geometry | `CylinderGeometry(0.04, 0.04, 2, 6)` |
| Material | `materials.flagPole` |
| Position | `(tx, 19.5, tz)` |
| Rotation | none |
| castShadow | `false` |
| receiveShadow | `false` |

- Thin pole extending 2 units above turret roof apex (y=18.5 to y=20.5)

**Physics:** None

#### 6d. Flag (×4)

| Property | Value |
|----------|-------|
| Geometry | `BoxGeometry(0.8, 0.5, 0.03)` |
| Material | `materials.flagRed` |
| Position | `(tx + 0.45, 20.0, tz)` |
| Rotation | none |
| castShadow | `false` |
| receiveShadow | `false` |

- Small rectangular flag offset to the right of the pole
- Near top of pole (y=20.0)

**Physics:** None

---

### 7. Entrance Arch

**Purpose:** Semi-circular arch entrance on the front facade.

#### 7a. Entrance Void (dark recess)

| Property | Value |
|----------|-------|
| Geometry | `BoxGeometry(2.5, 3, 0.6)` |
| Material | `materials.darkVoid` |
| Position | `(0, 3.5, 8.1)` |
| Rotation | none |
| castShadow | `false` |
| receiveShadow | `false` |

- 2.5 wide × 3 tall opening
- Base at y=2 (mound top), top at y=5
- Positioned just in front of the wall face (z=8) to overlay

#### 7b. Arch Surround (stone frame)

| Property | Value |
|----------|-------|
| Geometry | `TorusGeometry(1.25, 0.2, 8, 16, Math.PI)` |
| Material | `materials.stone` |
| Position | `(0, 5.0, 8.2)` |
| Rotation | `(0, 0, 0)` — half-torus opens upward (semi-circle) |
| castShadow | `true` |
| receiveShadow | `false` |

- Semi-circular arch frame above the rectangular void
- Radius 1.25 = half of entrance width (2.5)
- Tube radius 0.2 for visible stone surround
- Arc angle: π (half circle)
- Centered at the top of the rectangular opening

**Physics:** None (entrance is blocked by main body physics box)

---

### 8. Bridge

**Purpose:** Wooden bridge spanning the moat to the castle entrance.

#### 8a. Bridge Deck

| Property | Value |
|----------|-------|
| Geometry | `BoxGeometry(2.5, 0.3, 5)` |
| Material | `materials.wood` |
| Position | `(0, 1.85, 15.5)` |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `true` |

- 2.5 wide × 0.3 thick × 5 long (span)
- Top surface at y=2.0 (matches mound top)
- Spans from z=13.0 (mound edge) to z=18.0 (beyond moat outer edge)

**Physics:**
| Property | Value |
|----------|-------|
| Shape | `CANNON.Box(new CANNON.Vec3(1.25, 0.15, 2.5))` |
| Position | `(0, 1.85, 15.5)` |
| Mass | `0` (static) |

#### 8b. Railing Posts (×4)

| Property | Value |
|----------|-------|
| Geometry | `CylinderGeometry(0.06, 0.06, 1.2, 6)` |
| Material | `materials.wood` |
| Position | see table |
| Rotation | none |
| castShadow | `true` |
| receiveShadow | `false` |

| Post | X | Y | Z |
|------|---|---|---|
| Left-near | -1.15 | 2.6 | 14.0 |
| Left-far | -1.15 | 2.6 | 17.0 |
| Right-near | +1.15 | 2.6 | 14.0 |
| Right-far | +1.15 | 2.6 | 17.0 |

- Thin vertical posts at bridge edges
- Base at y=2.0 (bridge top), top at y=3.2

**Physics:** None

#### 8c. Railing Rails (×2)

| Property | Value |
|----------|-------|
| Geometry | `BoxGeometry(0.06, 0.06, 4)` |
| Material | `materials.wood` |
| Position | see table |
| Rotation | none |
| castShadow | `false` |
| receiveShadow | `false` |

| Rail | X | Y | Z |
|------|---|---|---|
| Left | -1.15 | 3.0 | 15.5 |
| Right | +1.15 | 3.0 | 15.5 |

- Horizontal bars connecting each pair of posts
- Length 4 (between post centers at z=14 and z=17, plus overhang)

**Physics:** None

---

### 9. Stained Glass Window

**Purpose:** Large colorful emissive window on the front facade above the entrance.

#### 9a. Window Pane

| Property | Value |
|----------|-------|
| Geometry | `BoxGeometry(2.2, 3.7, 0.15)` |
| Material | `materials.stainedGlass` |
| Position | `(0, 9.0, 8.1)` |
| Rotation | none |
| castShadow | `false` |
| receiveShadow | `false` |

- 2.2 wide × 3.7 tall
- Centered above entrance (entrance top at y=5, window from y≈7.15 to y≈10.85)
- Slightly proud of wall face for visibility

#### 9b. Window Frame

| Property | Value |
|----------|-------|
| Geometry | `BoxGeometry(2.5, 4.0, 0.12)` |
| Material | `materials.goldTrim` |
| Position | `(0, 9.0, 8.05)` |
| Rotation | none |
| castShadow | `false` |
| receiveShadow | `false` |

- Slightly larger than pane to create a visible frame border
- Slightly behind the pane (z=8.05 vs 8.1) so frame shows around edges

**Physics:** None

---

### 10. Circular Windows (×8)

**Purpose:** Decorative round windows flanking the stained glass on the front facade.

**Layout:** 2 rows × 4 columns, evenly spaced, avoiding center (where stained glass is).

**Positions:**

| ID | X | Y | Row |
|----|---|---|-----|
| UL2 | -7.5 | 10.0 | Upper |
| UL1 | -3.5 | 10.0 | Upper |
| UR1 | +3.5 | 10.0 | Upper |
| UR2 | +7.5 | 10.0 | Upper |
| LL2 | -7.5 | 5.5 | Lower |
| LL1 | -3.5 | 5.5 | Lower |
| LR1 | +3.5 | 5.5 | Lower |
| LR2 | +7.5 | 5.5 | Lower |

#### 10a. Gold Trim Ring (×8)

| Property | Value |
|----------|-------|
| Geometry | `TorusGeometry(0.45, 0.07, 8, 16)` |
| Material | `materials.goldTrim` |
| Position | `(wx, wy, 8.12)` per table |
| Rotation | `(Math.PI / 2, 0, 0)` — face +Z |
| castShadow | `false` |
| receiveShadow | `false` |

- Ring outer diameter ≈ 0.9 (matching spec)
- Tube radius 0.07 for visible gold band

#### 10b. Dark Center Disc (×8)

| Property | Value |
|----------|-------|
| Geometry | `CylinderGeometry(0.38, 0.38, 0.08, 16)` |
| Material | `materials.darkVoid` |
| Position | `(wx, wy, 8.1)` per table |
| Rotation | `(Math.PI / 2, 0, 0)` — face +Z |
| castShadow | `false` |
| receiveShadow | `false` |

- Filled dark disc inside the gold ring

**Physics:** None

---

## Config Interface

```typescript
interface PeachCastleConfig {
  position: { x: number; y: number; z: number };
}
```

---

## Constructor Pattern

```typescript
export class PeachCastle extends GameObject {
  private config: PeachCastleConfig;

  constructor(engine: GameEngine, config: PeachCastleConfig) {
    super(engine);
    this.config = config;
    this.create();
  }

  create(): void {
    const castle = new THREE.Group();

    // 1. Define shared materials
    // 2. Build each component, add to castle group
    // 3. Add physics bodies (offset by config.position)

    castle.position.set(
      this.config.position.x,
      this.config.position.y,
      this.config.position.z
    );
    this.mesh = castle;
    this.engine.addToScene(this.mesh);
  }

  update(_deltaTime: number): void {
    // Static object — no update needed
  }
}
```

---

## Physics Bodies Summary

All bodies are `mass: 0` (static). Positions must be **world-space** (offset by `config.position`).

| # | Component | Shape | Half-extents / Radii | Position (local) |
|---|-----------|-------|---------------------|------------------|
| 1 | Mound | `CANNON.Cylinder(13, 14, 2, 16)` | r=13/14, h=2 | `(0, 1, 0)` |
| 2 | Main Body | `CANNON.Box(Vec3(11, 5.5, 8))` | 11×5.5×8 | `(0, 7.5, 0)` |
| 3 | Central Tower | `CANNON.Cylinder(2.5, 2.5, 15, 12)` | r=2.5, h=15 | `(0, 20.5, 0)` |
| 4 | Turret FL | `CANNON.Cylinder(1.75, 1.75, 13, 10)` | r=1.75, h=13 | `(-11, 8.5, 8)` |
| 5 | Turret FR | `CANNON.Cylinder(1.75, 1.75, 13, 10)` | r=1.75, h=13 | `(11, 8.5, 8)` |
| 6 | Turret BL | `CANNON.Cylinder(1.75, 1.75, 13, 10)` | r=1.75, h=13 | `(-11, 8.5, -8)` |
| 7 | Turret BR | `CANNON.Cylinder(1.75, 1.75, 13, 10)` | r=1.75, h=13 | `(11, 8.5, -8)` |
| 8 | Bridge | `CANNON.Box(Vec3(1.25, 0.15, 2.5))` | 1.25×0.15×2.5 | `(0, 1.85, 15.5)` |

**Total physics bodies: 8**

Each body position must be offset: `localPos + config.position`.

```typescript
// Example for mound:
this.engine.addPhysicsBody(new CANNON.Body({
  mass: 0,
  shape: new CANNON.Cylinder(13, 14, 2, 16),
  position: new CANNON.Vec3(
    this.config.position.x + 0,
    this.config.position.y + 1,
    this.config.position.z + 0
  ),
}));
```

Note: `this.body` on `GameObject` only holds a single body. Store additional bodies in a `private bodies: CANNON.Body[]` array and override `destroy()` to remove them all.

---

## Mesh Count Summary

| Component | Meshes |
|-----------|--------|
| Earthen Mound | 1 |
| Moat | 1 |
| Main Body | 1 |
| Main Hip Roof | 1 |
| Central Tower Cylinder | 1 |
| Central Tower Balcony Ring | 1 |
| Central Tower Spire | 1 |
| Corner Turret Cylinders (×4) | 4 |
| Corner Turret Roofs (×4) | 4 |
| Flag Poles (×4) | 4 |
| Flags (×4) | 4 |
| Entrance Void | 1 |
| Entrance Arch Surround | 1 |
| Bridge Deck | 1 |
| Bridge Railing Posts (×4) | 4 |
| Bridge Railing Rails (×2) | 2 |
| Stained Glass Pane | 1 |
| Stained Glass Frame | 1 |
| Window Gold Trim Rings (×8) | 8 |
| Window Dark Center Discs (×8) | 8 |
| **Total** | **49** |

---

## World.ts Integration

### Import & Instantiation

```typescript
import { PeachCastle } from './objects/PeachCastle';
```

In `buildLevel()`, **replace** the existing castle placeholder platforms:

```typescript
// Remove these existing lines:
// Castle area - raised platform at (0, 0.5, -18)
// Castle towers at (-5, 4, -20) and (5, 4, -20)

// Add:
this.addEntity(new PeachCastle(this.engine, {
  position: { x: 0, y: 0, z: -25 },
}));
```

### Destroy Override

Since the base `GameObject.destroy()` only removes one `this.body`, `PeachCastle` must override `destroy()`:

```typescript
private bodies: CANNON.Body[] = [];

destroy(): void {
  this.isActive = false;
  if (this.mesh) this.engine.removeFromScene(this.mesh);
  for (const body of this.bodies) {
    this.engine.removePhysicsBody(body);
  }
}
```

---

## Implementation Order

1. Create `src/game/objects/PeachCastle.ts` with class skeleton and config interface
2. Define shared materials
3. Build components in order (each added to the `THREE.Group`):
   - Earthen Mound
   - Moat
   - Main Body
   - Main Hip Roof
   - Central Tower (cylinder + balcony + spire)
   - Corner Turrets (loop over 4 positions: cylinder + roof + pole + flag)
   - Entrance Arch (void + surround)
   - Bridge (deck + posts + rails)
   - Stained Glass Window (frame + pane)
   - Circular Windows (loop over 8 positions: trim + disc)
4. Add all physics bodies (with world-space position offset)
5. Update `World.ts`: import, remove old castle placeholders, instantiate `PeachCastle`
6. Visual test and position adjustments

---

## Dependency Map

```
PeachCastle.ts
├── imports: THREE, CANNON, GameEngine, GameObject
├── no dependency on other game objects
└── referenced by: World.ts (instantiation only)
```

**No new game objects need to be created besides `PeachCastle`.**  
**No existing game objects need modification.**  
**Only `World.ts` needs a minor edit** (swap castle placeholders for the new object).

---

## Reuse Assessment

| Requirement | Resolution |
|-------------|-----------|
| Static collidable structure | Reuse `Platform` pattern (mass=0 box/cylinder) |
| Multi-part visual | Reuse `Goomba` pattern (THREE.Group + child meshes) |
| Config-driven placement | Reuse `PlatformConfig` pattern |
| No update logic needed | Follows `Platform.update()` pattern (no-op) |
| Multiple physics bodies | **New pattern**: `bodies[]` array + `destroy()` override |

No existing objects can be reused as-is or subclassed — the castle is a unique composite object requiring a new class.
