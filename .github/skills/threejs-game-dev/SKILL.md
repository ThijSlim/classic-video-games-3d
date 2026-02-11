---
name: threejs-game-dev
description: Three.js and cannon-es techniques, patterns, and performance tips for 3D web game development. Use this when building visuals, physics, or rendering features.
---

# Three.js & cannon-es Game Development

Techniques and patterns for building 3D web games with Three.js (rendering) and cannon-es (physics).

## Project Setup

- **Three.js version:** ^0.170.0
- **cannon-es version:** ^0.20.0
- **Bundler:** Vite 6
- **TypeScript:** strict mode, ES2022 target

## Rendering

### Scene Configuration
```typescript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);  // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 50, 200);  // Distance fog
```

### Renderer Settings
```typescript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // Cap for performance
```

### Lighting Setup (Platformer Style)
```typescript
// Ambient (base illumination)
new THREE.AmbientLight(0xffffff, 0.5);

// Hemisphere (sky + ground bounce)
new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);

// Directional sun (shadows)
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(50, 80, 30);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -50;
sun.shadow.camera.right = 50;
sun.shadow.camera.top = 50;
sun.shadow.camera.bottom = -50;
```

### Material Best Practices
```typescript
// Standard lit material (preferred for most objects)
new THREE.MeshStandardMaterial({
  color: 0xFF0000,
  roughness: 0.8,
  metalness: 0.1,
});

// Glowing / emissive material (coins, power-ups)
new THREE.MeshStandardMaterial({
  color: 0xFFD700,
  metalness: 0.8,
  roughness: 0.2,
  emissive: 0xFFA000,
  emissiveIntensity: 0.3,
});

// Transparent overlay (glow effects, shadows)
new THREE.MeshBasicMaterial({
  color: 0xFFD700,
  transparent: true,
  opacity: 0.15,
});
```

### Common Geometries
| Shape | Three.js | Typical Use |
|-------|----------|-------------|
| Box | `BoxGeometry(w, h, d)` | Platforms, blocks, body parts |
| Sphere | `SphereGeometry(r, wSeg, hSeg)` | Heads, eyes, projectiles |
| Cylinder | `CylinderGeometry(rTop, rBot, h, seg)` | Pipes, hats, coins, limbs |
| Plane | `PlaneGeometry(w, h)` | Shadow decals, flat surfaces |

### Shadow Rules
- `castShadow = true` on all visible character/object meshes
- `receiveShadow = true` on ground and large platforms
- Don't enable shadows on transparent/glow overlays
- Shadow decals: `PlaneGeometry` with low-opacity dark `MeshBasicMaterial`, `depthWrite: false`

## Physics (cannon-es)

### World Configuration
```typescript
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -25, 0),  // Strong gravity for platformer
});
world.broadphase = new CANNON.SAPBroadphase(world);
world.defaultContactMaterial.friction = 0.3;
world.defaultContactMaterial.restitution = 0.1;
```

### Body Types
```typescript
// Static (platforms, walls) — mass = 0
new CANNON.Body({ mass: 0, shape: new CANNON.Box(...) });

// Dynamic (player) — mass > 0
new CANNON.Body({ mass: 1, fixedRotation: true, linearDamping: 0.1 });

// Trigger (collectibles) — no physical collision
new CANNON.Body({ mass: 0, isTrigger: true, collisionResponse: false });

// Kinematic (enemies) — mass = 0, move via position
new CANNON.Body({ mass: 0, collisionResponse: true });
```

### Collision Detection
```typescript
body.addEventListener('collide', (event: any) => {
  const contact = event.contact;
  const normal = contact.ni;
  // Check collision direction using normal vector
});
```

### Physics-Visual Sync
```typescript
// Option A: Built-in helper
this.syncMeshToBody();

// Option B: Manual (for offset)
this.mesh.position.set(
  this.body.position.x,
  this.body.position.y - 0.5,  // visual offset
  this.body.position.z
);
```

## Camera

### Third-Person Orbit Camera
```typescript
// Spherical coordinates around target
const offsetX = Math.sin(rotX) * Math.cos(rotY) * distance;
const offsetY = Math.sin(rotY) * distance;
const offsetZ = Math.cos(rotX) * Math.cos(rotY) * distance;

// Smooth follow with lerp
const t = 1 - Math.pow(0.001, deltaTime * smoothSpeed);
currentPos.lerp(desiredPos, t);
camera.lookAt(targetPos);
```

## Performance Tips
- Cap `deltaTime` to 0.05s to prevent physics explosion on tab-switch
- Cap `pixelRatio` to 2 to avoid excessive GPU workload on retina screens
- Use `SAPBroadphase` for physics (better than default `NaiveBroadphase`)
- Keep polygon counts low: 8-16 segments for cylinders/spheres
- Reuse materials across objects when colors match
- Use `THREE.Group` for complex objects — easier transforms and cleanup

---

## Techniques Added: 2026-02-11

### Reliable Ground Detection (cannon-es)
The collision normal direction depends on which body is `bi` vs `bj`. **Always** check `contact.bi === this.body` to determine the correct sign:
```typescript
this.body.addEventListener('collide', (event: any) => {
  const contact = event.contact;
  const normal = contact.ni;
  const isBodyA = contact.bi === this.body;
  const upDot = isBodyA ? -normal.y : normal.y;
  if (upDot > 0.5) {
    this.isGrounded = true;
  }
});
```
**Pitfall:** Using `event.body === this.body` or checking raw `normal.y` without body-order correction will give wrong results on platforms.

**Pitfall:** Do NOT use position-based ground checks like `body.position.y < 1.5` — this breaks on elevated platforms. Use collision normals or velocity-based fallback instead.

### Velocity-Based Grounded Fallback
Complement collision-based detection with a velocity check for edge cases:
```typescript
// If velocity.y is near zero, body is resting on something
if (Math.abs(this.body.velocity.y) < 0.3 && !this.isGrounded) {
  this.isGrounded = true;
}
// If clearly falling, mark as not grounded
if (this.body.velocity.y < -2) {
  this.isGrounded = false;
}
```

### Disabling collisionResponse for Death/Ghost
Toggle `body.collisionResponse` at runtime to make objects pass through platforms:
```typescript
this.body.collisionResponse = false;  // Ghost mode — falls through everything
this.body.collisionResponse = true;   // Restore normal collisions
```
Useful for death animations (body pops up then falls through floor).

### Platformer Speed Constants (with gravity -25)
Tuned values that feel right with the project's strong gravity:
| Parameter | Value | Notes |
|-----------|-------|-------|
| Walk speed | 7 | Camera-relative |
| Run speed | 12 | Hold Shift |
| Jump force | 13 | Single jump |
| Double jump | 15 | Within 0.4s window |
| Triple jump | 19 | Within 0.4s window |
| Ground pound | -20 | Instant downward velocity |
| Death pop | 12 | Upward velocity on die |