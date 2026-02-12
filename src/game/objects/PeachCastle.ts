/**
 * PeachCastle - Princess Peach's Castle
 * A detailed multi-part castle built from Three.js primitives
 * with multiple physics bodies for collision.
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from '../../engine/GameEngine';
import { GameObject } from '../../engine/GameObject';

export interface PeachCastleConfig {
  position: { x: number; y: number; z: number };
}

export class PeachCastle extends GameObject {
  private config: PeachCastleConfig;
  private bodies: CANNON.Body[] = [];
  private flags: THREE.Mesh[] = [];
  private flagTime = 0;

  constructor(engine: GameEngine, config: PeachCastleConfig) {
    super(engine);
    this.config = config;
    this.create();
  }

  create(): void {
    const { x: px, y: py, z: pz } = this.config.position;
    const group = new THREE.Group();

    // === Shared Materials ===
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xD3CFC7, roughness: 0.9, metalness: 0.05 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xC85A34, roughness: 0.7, metalness: 0.1 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.85, metalness: 0.0 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, transparent: true, opacity: 0.6, roughness: 0.1 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xDAA520, metalness: 0.7, roughness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A });
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xFFB6C1, emissive: 0xFF69B4, emissiveIntensity: 0.3,
      metalness: 0.1, roughness: 0.3,
    });

    // === 2. Moat — Deeply excavated medieval trench ===
    // Outer trench wall (stone-lined)
    const outerWall = new THREE.Mesh(
      new THREE.CylinderGeometry(19, 19, 5, 32, 1, true),
      stoneMat,
    );
    outerWall.position.set(0, -2.5, 0);
    outerWall.castShadow = true;
    outerWall.receiveShadow = true;
    group.add(outerWall);

    // Inner trench wall
    const innerWall = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 15, 5, 32, 1, true),
      stoneMat,
    );
    innerWall.position.set(0, -2.5, 0);
    innerWall.castShadow = true;
    innerWall.receiveShadow = true;
    group.add(innerWall);

    // Water surface at bottom of trench
    const moatWater = new THREE.Mesh(
      new THREE.RingGeometry(15, 19, 32),
      waterMat,
    );
    moatWater.position.set(0, -5, 0);
    moatWater.rotation.x = -Math.PI / 2;
    group.add(moatWater);

    // Dark moat bottom beneath water
    const moatBottom = new THREE.Mesh(
      new THREE.RingGeometry(15, 19, 32),
      darkMat,
    );
    moatBottom.position.set(0, -5.5, 0);
    moatBottom.rotation.x = -Math.PI / 2;
    group.add(moatBottom);

    // Moat bottom physics (catches Mario if he falls in)
    const moatBottomPhysics = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Cylinder(19, 19, 0.3, 16),
      position: new CANNON.Vec3(px, py - 5.5, pz),
    });
    this.engine.addPhysicsBody(moatBottomPhysics);
    this.bodies.push(moatBottomPhysics);

    // === Castle courtyard — walkable platform inside moat ===
    const courtyardMat = new THREE.MeshStandardMaterial({ color: 0xC8A44A, roughness: 0.9 });
    const courtyard = new THREE.Mesh(
      new THREE.CylinderGeometry(14.5, 14.5, 0.5, 32),
      courtyardMat,
    );
    courtyard.position.set(0, -0.25, 0);
    courtyard.receiveShadow = true;
    group.add(courtyard);

    const courtyardPhysics = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Cylinder(14.5, 14.5, 0.5, 16),
      position: new CANNON.Vec3(px, py - 0.25, pz),
    });
    this.engine.addPhysicsBody(courtyardPhysics);
    this.bodies.push(courtyardPhysics);

    // === 3. Main Body ===
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(22, 11, 16),
      stoneMat,
    );
    mainBody.position.set(0, 7.5, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    group.add(mainBody);

    const mainPhysics = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(11, 5.5, 8)),
      position: new CANNON.Vec3(px, py + 7.5, pz),
    });
    this.engine.addPhysicsBody(mainPhysics);
    this.bodies.push(mainPhysics);

    // === 4. Main Hip Roof ===
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(15.56, 6, 4),
      roofMat,
    );
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 0.727;
    roof.position.set(0, 16, 0);
    roof.castShadow = true;
    group.add(roof);

    // === 5. Central Tower ===
    const centralTower = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 2.5, 15, 16),
      stoneMat,
    );
    centralTower.position.set(0, 20.5, 0);
    centralTower.castShadow = true;
    group.add(centralTower);

    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(3, 6, 16),
      roofMat,
    );
    spire.position.set(0, 31, 0);
    spire.castShadow = true;
    group.add(spire);

    const towerPhysics = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Cylinder(2.5, 2.5, 15, 8),
      position: new CANNON.Vec3(px, py + 20.5, pz),
    });
    this.engine.addPhysicsBody(towerPhysics);
    this.bodies.push(towerPhysics);

    // === 6. Corner Turrets (×4) ===
    const turretCorners = [
      { x: -11, z: -8 },
      { x: 11, z: -8 },
      { x: -11, z: 8 },
      { x: 11, z: 8 },
    ];

    for (const corner of turretCorners) {
      // Turret cylinder
      const turret = new THREE.Mesh(
        new THREE.CylinderGeometry(1.75, 1.75, 13, 12),
        stoneMat,
      );
      turret.position.set(corner.x, 8.5, corner.z);
      turret.castShadow = true;
      group.add(turret);

      // Turret conical roof
      const turretRoof = new THREE.Mesh(
        new THREE.ConeGeometry(2.2, 4, 12),
        roofMat,
      );
      turretRoof.position.set(corner.x, 17, corner.z);
      turretRoof.castShadow = true;
      group.add(turretRoof);

      // Flagpole
      const flagpole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.5, 4),
        goldMat,
      );
      flagpole.position.set(corner.x, 19.75, corner.z);
      group.add(flagpole);

      // Flag (animated)
      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(0.8, 0.5),
        flagMat,
      );
      flag.position.set(corner.x + 0.4, 20.25, corner.z);
      group.add(flag);
      this.flags.push(flag);

      // Turret physics
      const turretPhysics = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Cylinder(1.75, 1.75, 13, 8),
        position: new CANNON.Vec3(px + corner.x, py + 8.5, pz + corner.z),
      });
      this.engine.addPhysicsBody(turretPhysics);
      this.bodies.push(turretPhysics);
    }

    // === 7. Entrance Arch ===
    // Dark void (rectangular)
    const doorVoid = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 3, 1.2),
      darkMat,
    );
    doorVoid.position.set(0, 3.5, 8.4);
    group.add(doorVoid);

    // Arch top (half-cylinder)
    const archTop = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.25, 1.2, 16, 1, false, 0, Math.PI),
      darkMat,
    );
    archTop.position.set(0, 5, 8.4);
    archTop.rotation.z = Math.PI / 2;
    archTop.rotation.x = Math.PI / 2;
    group.add(archTop);

    // Stone arch surround (half-torus)
    const archSurround = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.15, 8, 16, Math.PI),
      stoneMat,
    );
    archSurround.position.set(0, 5, 8.01);
    archSurround.rotation.z = Math.PI;
    group.add(archSurround);

    // === 8. Bridge (spans full moat width) ===
    const bridgeDeck = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.3, 13),
      woodMat,
    );
    bridgeDeck.position.set(0, 2.15, 14.5);
    bridgeDeck.castShadow = true;
    bridgeDeck.receiveShadow = true;
    group.add(bridgeDeck);

    // Railing posts (13 per side)
    const postZPositions = [8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5, 18.5, 19.5, 20.5];
    for (const side of [-1.2, 1.2]) {
      for (const zPos of postZPositions) {
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.6, 0.1),
          woodMat,
        );
        post.position.set(side, 2.6, zPos);
        group.add(post);
      }
    }

    // Railing beams (full length)
    for (const side of [-1.2, 1.2]) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 13),
        woodMat,
      );
      beam.position.set(side, 2.9, 14.5);
      group.add(beam);
    }

    // Bridge physics
    const bridgePhysics = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(1.25, 0.15, 6.5)),
      position: new CANNON.Vec3(px, py + 2.15, pz + 14.5),
    });
    this.engine.addPhysicsBody(bridgePhysics);
    this.bodies.push(bridgePhysics);

    // === 9. Stained-Glass Window ===
    // Main pane
    const glassPane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 3.7),
      glassMat,
    );
    glassPane.position.set(0, 10, 8.01);
    group.add(glassPane);

    // Frame (4 thin boxes)
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.7, 0.05), goldMat);
    frameLeft.position.set(-1.16, 10, 8.02);
    group.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.7, 0.05), goldMat);
    frameRight.position.set(1.16, 10, 8.02);
    group.add(frameRight);

    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.12, 0.05), goldMat);
    frameBottom.position.set(0, 8.15, 8.02);
    group.add(frameBottom);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.12, 0.05), goldMat);
    frameTop.position.set(0, 11.85, 8.02);
    group.add(frameTop);

    // === 10. Circular Windows (8 total) ===
    const circularWindowPositions = [
      // Upper row
      { x: -7, y: 10.5 },
      { x: -3.5, y: 10.5 },
      { x: 3.5, y: 10.5 },
      { x: 7, y: 10.5 },
      // Lower row
      { x: -7, y: 5.5 },
      { x: -3.5, y: 5.5 },
      { x: 3.5, y: 5.5 },
      { x: 7, y: 5.5 },
    ];

    for (const win of circularWindowPositions) {
      // Gold ring trim
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.35, 0.45, 16),
        goldMat,
      );
      ring.position.set(win.x, win.y, 8.01);
      group.add(ring);

      // Dark interior
      const circle = new THREE.Mesh(
        new THREE.CircleGeometry(0.35, 16),
        darkMat,
      );
      circle.position.set(win.x, win.y, 8.01);
      group.add(circle);
    }

    // === Position the entire group ===
    group.position.set(px, py, pz);
    this.mesh = group;
    this.engine.addToScene(this.mesh);

    // Set the main body as the primary physics body for compatibility
    this.body = mainPhysics;
  }

  update(deltaTime: number): void {
    if (!this.isActive) return;

    // Animate flags
    this.flagTime += deltaTime;
    for (let i = 0; i < this.flags.length; i++) {
      this.flags[i].rotation.y = Math.sin(this.flagTime * 3 + i * 1.5) * 0.3;
    }
  }

  destroy(): void {
    this.isActive = false;
    if (this.mesh) this.engine.removeFromScene(this.mesh);
    for (const b of this.bodies) {
      this.engine.removePhysicsBody(b);
    }
  }
}
