/**
 * World - Constructs and manages the game level
 * Creates platforms, coins, enemies, decorations, etc.
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from '../engine/GameEngine';
import { GameObject } from '../engine/GameObject';
import { Platform } from './objects/Platform';
import { Coin } from './objects/Coin';
import { Goomba } from './objects/Goomba';
import { Mario } from './objects/Mario';
import { PeachCastle } from './objects/PeachCastle';

export class World {
  private engine: GameEngine;
  private entities: GameObject[] = [];
  private mario: Mario | null = null;
  private coins: Coin[] = [];
  private goombas: Goomba[] = [];

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.buildLevel();
  }

  private buildLevel(): void {
    // === Base ground (dark earth) ===
    this.addEntity(new Platform(this.engine, {
      position: { x: 0, y: -2, z: 0 },
      size: { x: 300, y: 1, z: 300 },
      color: 0x5D4037,
    }));

    // === Grass field ===
    this.addEntity(new Platform(this.engine, {
      position: { x: 0, y: -0.25, z: 0 },
      size: { x: 200, y: 0.5, z: 200 },
      color: 0x4CAF50,
    }));

    // === Stone Platform (Zone F) ===
    this.addEntity(new Platform(this.engine, {
      position: { x: 18, y: 0, z: 12 },
      size: { x: 8, y: 0.4, z: 6 },
      color: 0x9E9E9E,
    }));

    // === Terrain ===
    this.buildTerrain();

    // === Peach's Castle ===
    this.addEntity(new PeachCastle(this.engine, { position: { x: 0, y: 0, z: -50 } }));

    // === Floating platforms ===
    const floatingPlatforms = [
      { x: 8, y: 3, z: 5, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: 14, y: 5, z: 3, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: 20, y: 7, z: 0, sx: 4, sy: 0.5, sz: 4, color: 0xFFC107 },
      { x: -8, y: 3, z: 8, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: -14, y: 6, z: 6, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: -18, y: 9, z: 2, sx: 4, sy: 0.5, sz: 4, color: 0xFFC107 },
      { x: 0, y: 12, z: -12, sx: 5, sy: 0.5, sz: 5, color: 0xFF5722 },
    ];

    for (const p of floatingPlatforms) {
      this.addEntity(new Platform(this.engine, {
        position: { x: p.x, y: p.y, z: p.z },
        size: { x: p.sx, y: p.sy, z: p.sz },
        color: p.color,
      }));
    }

    // === Stepping stone stairs ===
    for (let i = 0; i < 6; i++) {
      this.addEntity(new Platform(this.engine, {
        position: { x: -5 + i * 2, y: 0.5 + i * 1.5, z: 10 + i * 2 },
        size: { x: 2, y: 0.5, z: 2 },
        color: 0x795548,
      }));
    }

    // === Coins ===
    const coinPositions = [
      // Ground coins in a circle
      ...Array.from({ length: 8 }, (_, i) => ({
        x: Math.cos(i * Math.PI / 4) * 8,
        y: 1.5,
        z: 14 + Math.sin(i * Math.PI / 4) * 8,
      })),
      // Coins on platforms
      { x: 8, y: 5, z: 5 },
      { x: 14, y: 7, z: 3 },
      { x: 20, y: 9, z: 0 },
      { x: -8, y: 5, z: 8 },
      { x: -14, y: 8, z: 6 },
      { x: -18, y: 11, z: 2 },
      { x: 0, y: 14, z: -12 },
      // Staircase coins
      ...Array.from({ length: 6 }, (_, i) => ({
        x: -5 + i * 2,
        y: 2 + i * 1.5,
        z: 10 + i * 2,
      })),
    ];

    for (const pos of coinPositions) {
      const coin = new Coin(this.engine, pos);
      this.coins.push(coin);
      this.addEntity(coin);
    }

    // === Enemies (Goombas) ===
    const goombaPositions = [
      { x: 5, y: 1, z: 5, patrolRadius: 3 },
      { x: -5, y: 1, z: 5, patrolRadius: 4 },
      { x: 10, y: 1, z: 10, patrolRadius: 3 },
      { x: -15, y: 1, z: 8, patrolRadius: 5 },
    ];

    for (const g of goombaPositions) {
      const goomba = new Goomba(this.engine, g);
      this.goombas.push(goomba);
      this.addEntity(goomba);
    }

    // === Decorations ===
    this.addDecorations();
  }

  private addDecorations(): void {
    // Trees on hillsides
    const treePositions = [
      // Main Hill (Zone B) trees
      { x: -10, z: -8, y: 4 },
      { x: -18, z: -3, y: 6 },
      { x: -20, z: -10, y: 5 },
      { x: -12, z: 0, y: 3 },
      // Left Hill (Zone H) trees
      { x: -15, z: -30, y: 5 },
      { x: -22, z: -35, y: 7 },
      { x: -18, z: -42, y: 4 },
      { x: -25, z: -38, y: 6 },
      // Right Hill (Zone I) trees
      { x: 20, z: -30, y: 5 },
      { x: 28, z: -35, y: 8 },
      { x: 32, z: -42, y: 6 },
      { x: 25, z: -45, y: 4 },
      { x: 35, z: -38, y: 3 },
    ];

    for (const pos of treePositions) {
      this.createTree(pos.x, pos.z, pos.y);
    }

    // Pipes near plaza
    this.createPipe(12, 0, 8);
    this.createPipe(-12, 0, 10);
  }

  private buildTerrain(): void {
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.9 });
    const medGreenMat = new THREE.MeshStandardMaterial({ color: 0x43A047, roughness: 0.9 });
    const darkGreenMat = new THREE.MeshStandardMaterial({ color: 0x388E3C, roughness: 0.9 });
    const sandPathMat = new THREE.MeshStandardMaterial({ color: 0xD4A84B, roughness: 0.95 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.92 });
    const darkRockMat = new THREE.MeshStandardMaterial({ color: 0x6B5B45, roughness: 0.95 });
    const pondWaterMat = new THREE.MeshStandardMaterial({
      color: 0x2196F3, roughness: 0.3, metalness: 0.1,
      transparent: true, opacity: 0.7,
    });
    const pondBasinMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.95, side: THREE.DoubleSide });
    const pondFloorMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.95 });

    // === Sandy Path (Zone A) — L-shaped curve from SW to SE ===
    const sandPathSegments = [
      { pos: [-18, -0.1, 22],  size: [12, 0.3, 10], rotY: 0 },
      { pos: [-12, -0.1, 17],  size: [10, 0.3, 8],  rotY: Math.PI / 6 },
      { pos: [-4,  -0.1, 14],  size: [14, 0.3, 8],  rotY: Math.PI / 10 },
      { pos: [6,   -0.1, 12],  size: [12, 0.3, 9],  rotY: 0 },
      { pos: [16,  -0.1, 13],  size: [12, 0.3, 10], rotY: 0 },
      { pos: [25,  -0.1, 16],  size: [10, 0.3, 12], rotY: -Math.PI / 12 },
      { pos: [-2,  -0.1,  6],  size: [8,  0.3, 10], rotY: 0 },
    ];

    for (const seg of sandPathSegments) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(seg.size[0], seg.size[1], seg.size[2]),
        sandPathMat,
      );
      mesh.position.set(seg.pos[0], seg.pos[1], seg.pos[2]);
      mesh.rotation.y = seg.rotY;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);

      const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(seg.size[0] / 2, seg.size[1] / 2, seg.size[2] / 2)),
        position: new CANNON.Vec3(seg.pos[0], seg.pos[1], seg.pos[2]),
      });
      body.quaternion.setFromEuler(0, seg.rotY, 0);
      this.engine.addPhysicsBody(body);
    }

    // === Main Hill (Zone B) — Elongated, center-left ===
    const mainHillCenter = { x: -15, z: -5 };
    const mainHillLayers = [
      { radius: 20,  y: 0.4,  height: 0.8, scaleX: 1.25, scaleZ: 1.50 },
      { radius: 18,  y: 1.2,  height: 0.8, scaleX: 1.25, scaleZ: 1.45 },
      { radius: 16,  y: 2.0,  height: 0.8, scaleX: 1.22, scaleZ: 1.40 },
      { radius: 14,  y: 2.8,  height: 0.8, scaleX: 1.20, scaleZ: 1.35 },
      { radius: 12,  y: 3.6,  height: 0.8, scaleX: 1.18, scaleZ: 1.30 },
      { radius: 10,  y: 4.4,  height: 0.8, scaleX: 1.15, scaleZ: 1.25 },
      { radius: 8,   y: 5.2,  height: 0.8, scaleX: 1.12, scaleZ: 1.20 },
      { radius: 6,   y: 6.0,  height: 0.8, scaleX: 1.10, scaleZ: 1.15 },
      { radius: 4.5, y: 6.8,  height: 0.8, scaleX: 1.08, scaleZ: 1.10 },
      { radius: 3,   y: 7.6,  height: 0.8, scaleX: 1.05, scaleZ: 1.05 },
    ];

    for (const layer of mainHillLayers) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 32),
        grassMat,
      );
      mesh.position.set(mainHillCenter.x, layer.y, mainHillCenter.z);
      mesh.scale.x = layer.scaleX;
      mesh.scale.z = layer.scaleZ;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);

      const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(
          layer.radius * layer.scaleX,
          layer.height / 2,
          layer.radius * layer.scaleZ,
        )),
        position: new CANNON.Vec3(mainHillCenter.x, layer.y, mainHillCenter.z),
      });
      this.engine.addPhysicsBody(body);
    }

    // === Left Hill (Zone H) — Northwest, 5 layers ===
    const leftHillCenter = { x: -20, z: -35 };
    const leftHillLayers = [
      { radius: 18, y: 1.5,  height: 3.0, scaleX: 1.11, scaleZ: 0.97 },
      { radius: 14, y: 4.0,  height: 2.0, scaleX: 1.11, scaleZ: 0.97 },
      { radius: 10, y: 6.5,  height: 3.0, scaleX: 1.05, scaleZ: 0.95 },
      { radius: 7,  y: 8.5,  height: 2.0, scaleX: 1.00, scaleZ: 0.93 },
      { radius: 4,  y: 10.0, height: 1.5, scaleX: 1.00, scaleZ: 0.90 },
    ];

    for (const layer of leftHillLayers) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 24),
        medGreenMat,
      );
      mesh.position.set(leftHillCenter.x, layer.y, leftHillCenter.z);
      mesh.scale.x = layer.scaleX;
      mesh.scale.z = layer.scaleZ;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);

      const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(
          layer.radius * layer.scaleX,
          layer.height / 2,
          layer.radius * layer.scaleZ,
        )),
        position: new CANNON.Vec3(leftHillCenter.x, layer.y, leftHillCenter.z),
      });
      this.engine.addPhysicsBody(body);
    }

    // === Right Hill (Zone I) — Northeast, 5 layers ===
    const rightHillCenter = { x: 25, z: -35 };
    const rightHillLayers = [
      { radius: 20, y: 2.0,  height: 4.0, scaleX: 1.125, scaleZ: 1.25 },
      { radius: 16, y: 5.0,  height: 3.0, scaleX: 1.10,  scaleZ: 1.20 },
      { radius: 11, y: 8.0,  height: 3.0, scaleX: 1.05,  scaleZ: 1.15 },
      { radius: 7,  y: 10.5, height: 2.0, scaleX: 1.00,  scaleZ: 1.10 },
      { radius: 4,  y: 12.0, height: 1.5, scaleX: 1.00,  scaleZ: 1.05 },
    ];

    for (const layer of rightHillLayers) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 24),
        grassMat,
      );
      mesh.position.set(rightHillCenter.x, layer.y, rightHillCenter.z);
      mesh.scale.x = layer.scaleX;
      mesh.scale.z = layer.scaleZ;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);

      const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(
          layer.radius * layer.scaleX,
          layer.height / 2,
          layer.radius * layer.scaleZ,
        )),
        position: new CANNON.Vec3(rightHillCenter.x, layer.y, rightHillCenter.z),
      });
      this.engine.addPhysicsBody(body);
    }

    // === Rocky Cliff (Zone G) — West boundary ===
    const cliffBoxes = [
      { pos: [-45, 3, -35],  size: [25, 6, 35],  rot: [0, 0.15, 0],    mat: rockMat },
      { pos: [-47, 9, -38],  size: [18, 6, 28],  rot: [0, -0.1, 0],    mat: rockMat },
      { pos: [-48, 14, -40], size: [12, 4, 20],  rot: [0, 0.2, 0],     mat: rockMat },
      { pos: [-40, 5, -25],  size: [10, 8, 8],   rot: [0, 0.3, 0.1],   mat: rockMat },
      { pos: [-42, 1, -32],  size: [30, 2, 38],  rot: [0, 0.05, 0],    mat: darkRockMat },
    ];

    for (const box of cliffBoxes) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(box.size[0], box.size[1], box.size[2]),
        box.mat,
      );
      mesh.position.set(box.pos[0], box.pos[1], box.pos[2]);
      mesh.rotation.set(box.rot[0], box.rot[1], box.rot[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);
    }

    const cliffPeaks = [
      { pos: [-50, 19, -42], radius: 6,  height: 10, segments: 5, rot: [0, 0, 0.15] },
      { pos: [-44, 17, -30], radius: 5,  height: 8,  segments: 4, rot: [0, 0, -0.1] },
    ];

    for (const peak of cliffPeaks) {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(peak.radius, peak.height, peak.segments),
        rockMat,
      );
      mesh.position.set(peak.pos[0], peak.pos[1], peak.pos[2]);
      mesh.rotation.set(peak.rot[0], peak.rot[1], peak.rot[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);
    }

    // Cliff physics — invisible walls
    const cliffWalls = [
      { pos: [-45, 6, -35],  halfExtents: [14, 6, 18] },
      { pos: [-47, 14, -38], halfExtents: [10, 6, 15] },
      { pos: [-48, 22, -40], halfExtents: [8, 5, 12] },
      { pos: [-40, 4, -25],  halfExtents: [6, 4, 5] },
    ];

    for (const wall of cliffWalls) {
      const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(wall.halfExtents[0], wall.halfExtents[1], wall.halfExtents[2])),
        position: new CANNON.Vec3(wall.pos[0], wall.pos[1], wall.pos[2]),
      });
      this.engine.addPhysicsBody(body);
    }

    // === Pond (Zone E) — Sunken water body, SE corner ===
    // Water surface
    const waterSurface = new THREE.Mesh(
      new THREE.CylinderGeometry(10, 10, 0.1, 32),
      pondWaterMat,
    );
    waterSurface.position.set(25, -0.5, 15);
    waterSurface.scale.set(1.0, 1, 0.75);
    waterSurface.receiveShadow = true;
    this.engine.addToScene(waterSurface);

    // Basin wall
    const basinWall = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 9, 3, 32, 1, true),
      pondBasinMat,
    );
    basinWall.position.set(25, -1.75, 15);
    basinWall.scale.set(1.0, 1, 0.75);
    this.engine.addToScene(basinWall);

    // Basin floor
    const basinFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 9, 0.2, 32),
      pondFloorMat,
    );
    basinFloor.position.set(25, -3, 15);
    basinFloor.scale.set(1.0, 1, 0.75);
    this.engine.addToScene(basinFloor);

    // Grass lip around pond
    const grassLip = new THREE.Mesh(
      new THREE.CylinderGeometry(12, 12, 0.5, 32),
      grassMat,
    );
    grassLip.position.set(25, -0.2, 15);
    grassLip.scale.set(1.0, 1, 0.75);
    grassLip.receiveShadow = true;
    this.engine.addToScene(grassLip);

    // Pond floor physics
    const pondFloorBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(10, 0.1, 7.5)),
      position: new CANNON.Vec3(25, -3, 15),
    });
    this.engine.addPhysicsBody(pondFloorBody);

    // === Background Mountains (decorative) ===
    const mountains = [
      { x: -80, y: 15, z: -90, radius: 40, height: 30, color: 0x66BB6A },
      { x: 0, y: 17.5, z: -110, radius: 50, height: 35, color: 0x81C784 },
      { x: 65, y: 20, z: -100, radius: 35, height: 40, color: 0x90CAF9 },
      { x: 85, y: 12.5, z: -70, radius: 30, height: 25, color: 0x4CAF50 },
    ];

    for (const mt of mountains) {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(mt.radius, mt.height, 6),
        new THREE.MeshStandardMaterial({ color: mt.color, roughness: 0.9 }),
      );
      mesh.position.set(mt.x, mt.y, mt.z);
      this.engine.addToScene(mesh);
    }
  }

  private createTree(x: number, z: number, baseY = 0): void {
    const group = new THREE.Group();

    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 3.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x5D4037 })
    );
    trunk.position.y = 1.75;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage (3 spheres)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32 });
    for (const offset of [
      { x: 0, y: 4.0, z: 0, r: 1.4 },
      { x: -0.5, y: 4.8, z: 0.3, r: 1.1 },
      { x: 0.4, y: 5.2, z: -0.2, r: 1.0 },
    ]) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(offset.r, 8, 8),
        leafMat
      );
      leaf.position.set(offset.x, offset.y, offset.z);
      leaf.castShadow = true;
      group.add(leaf);
    }

    group.position.set(x, baseY, z);
    this.engine.addToScene(group);
  }

  private createPipe(x: number, y: number, z: number): void {
    const group = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x388E3C });

    // Pipe body
    const pipeBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2, 16),
      pipeMat
    );
    pipeBody.position.y = 1;
    pipeBody.castShadow = true;
    group.add(pipeBody);

    // Pipe rim
    const pipeRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.3, 16),
      pipeMat
    );
    pipeRim.position.y = 2.15;
    pipeRim.castShadow = true;
    group.add(pipeRim);

    // Pipe top (dark)
    const pipeTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x1B5E20 })
    );
    pipeTop.position.y = 2.3;
    group.add(pipeTop);

    group.position.set(x, y, z);
    this.engine.addToScene(group);

    // Physics body for pipe
    const pipePhysics = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Cylinder(0.8, 0.8, 2, 16),
      position: new CANNON.Vec3(x, y + 1, z),
    });
    this.engine.addPhysicsBody(pipePhysics);
  }

  addEntity(entity: GameObject): void {
    this.entities.push(entity);
    if (entity instanceof Mario) {
      this.mario = entity;
    }
  }

  update(deltaTime: number): void {
    for (const entity of this.entities) {
      if (entity.isActive) {
        entity.update(deltaTime);
      }
    }

    // Check collisions
    if (this.mario && !this.mario.isDead && !this.mario.isGameOver) {
      this.checkCoinCollisions();
      this.checkGoombaCollisions();
    }
  }

  private checkCoinCollisions(): void {
    if (!this.mario) return;
    const marioPos = this.mario.body.position;
    const collectRadius = 1.2;

    for (const coin of this.coins) {
      if (!coin.isActive) continue;
      const dx = marioPos.x - coin.body.position.x;
      const dy = marioPos.y - coin.body.position.y;
      const dz = marioPos.z - coin.body.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < collectRadius) {
        this.mario.collectCoin();
        coin.destroy();
      }
    }
  }

  private checkGoombaCollisions(): void {
    if (!this.mario) return;
    const marioPos = this.mario.body.position;
    const hitRadius = 1.0;

    for (const goomba of this.goombas) {
      if (!goomba.isActive) continue;
      const dx = marioPos.x - goomba.body.position.x;
      const dy = marioPos.y - goomba.body.position.y;
      const dz = marioPos.z - goomba.body.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < hitRadius) {
        // Mario hit by Goomba — game over
        this.mario.die();
      }
    }
  }

  dispose(): void {
    // Clean up all entities
    for (const entity of this.entities) {
      if (entity.destroy) {
        entity.destroy();
      }
    }
    this.entities = [];
    this.coins = [];
    this.goombas = [];
    this.mario = null;
  }
}
