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
