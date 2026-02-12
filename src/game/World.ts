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

    // === Sandy plaza ===
    this.addEntity(new Platform(this.engine, {
      position: { x: 0, y: -0.1, z: 12 },
      size: { x: 15, y: 0.3, z: 20 },
      color: 0xD4A84B,
    }));

    // === Terrain ===
    this.buildTerrain();

    // === Peach's Castle ===
    this.addEntity(new PeachCastle(this.engine, { position: { x: 0, y: 4, z: -25 } }));

    // === Floating platforms ===
    const floatingPlatforms = [
      { x: 8, y: 3, z: 5, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: 14, y: 5, z: 3, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: 20, y: 7, z: 0, sx: 4, sy: 0.5, sz: 4, color: 0xFFC107 },
      { x: -8, y: 3, z: 8, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: -14, y: 6, z: 6, sx: 3, sy: 0.5, sz: 3, color: 0x8BC34A },
      { x: -18, y: 9, z: 2, sx: 4, sy: 0.5, sz: 4, color: 0xFFC107 },
      { x: 0, y: 12, z: -5, sx: 5, sy: 0.5, sz: 5, color: 0xFF5722 },
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
        z: Math.sin(i * Math.PI / 4) * 8,
      })),
      // Coins on platforms
      { x: 8, y: 5, z: 5 },
      { x: 14, y: 7, z: 3 },
      { x: 20, y: 9, z: 0 },
      { x: -8, y: 5, z: 8 },
      { x: -14, y: 8, z: 6 },
      { x: -18, y: 11, z: 2 },
      { x: 0, y: 14, z: -5 },
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
      { x: 10, y: 1, z: -5, patrolRadius: 3 },
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
      // Left hill
      { x: -25, z: -30, y: 3 },
      { x: -30, z: -38, y: 5 },
      { x: -40, z: -45, y: 4 },
      { x: -35, z: -50, y: 2 },
      { x: -20, z: -42, y: 2 },
      // Right hill
      { x: 30, z: -35, y: 4 },
      { x: 38, z: -42, y: 7 },
      { x: 45, z: -50, y: 5 },
      { x: 42, z: -55, y: 3 },
      { x: 50, z: -45, y: 2 },
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
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xB8943D, roughness: 0.9 });
    const medGreenMat = new THREE.MeshStandardMaterial({ color: 0x43A047, roughness: 0.9 });
    const darkGreenMat = new THREE.MeshStandardMaterial({ color: 0x388E3C, roughness: 0.9 });
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xC8A44A, roughness: 0.95 });

    // === Castle Mound — 6 concentric cylinder layers ===
    const moundLayers = [
      { radius: 28, y: 0.4, height: 0.8 },
      { radius: 24, y: 1.2, height: 0.8 },
      { radius: 20, y: 2.0, height: 0.8 },
      { radius: 17, y: 2.8, height: 0.8 },
      { radius: 14.5, y: 3.4, height: 0.8 },
      { radius: 13, y: 4.0, height: 0.8 },
    ];

    for (const layer of moundLayers) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 32),
        grassMat,
      );
      mesh.position.set(0, layer.y, -25);
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);

      const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Cylinder(layer.radius, layer.radius, layer.height, 16),
        position: new CANNON.Vec3(0, layer.y, -25),
      });
      this.engine.addPhysicsBody(body);
    }

    // === Approach Path (Ramp) ===
    const rampMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.3, 15),
      pathMat,
    );
    rampMesh.position.set(0, 1.5, -5);
    rampMesh.rotation.x = -0.12;
    rampMesh.castShadow = true;
    rampMesh.receiveShadow = true;
    this.engine.addToScene(rampMesh);

    const rampBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(1.5, 0.15, 7.5)),
      position: new CANNON.Vec3(0, 1.5, -5),
    });
    rampBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -0.12);
    this.engine.addPhysicsBody(rampBody);

    // === Left Flanking Hill — 4 layers ===
    const leftHillLayers = [
      { radius: 20, y: 1.5, height: 3, scaleX: 1.5 },
      { radius: 15, y: 4.0, height: 2, scaleX: 1.5 },
      { radius: 10, y: 6.0, height: 2, scaleX: 1.3 },
      { radius: 6, y: 8.0, height: 2, scaleX: 1.2 },
    ];

    for (const layer of leftHillLayers) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 24),
        medGreenMat,
      );
      mesh.position.set(-35, layer.y, -40);
      mesh.scale.x = layer.scaleX;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);

      const body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(layer.radius * layer.scaleX, layer.height / 2, layer.radius)),
        position: new CANNON.Vec3(-35, layer.y, -40),
      });
      this.engine.addPhysicsBody(body);
    }

    // === Right Flanking Hill / Ridge — 4 layers ===
    const rightHillLayers = [
      { radius: 25, y: 2.5, height: 5, scaleZ: 1.5, hasPhysics: true },
      { radius: 18, y: 6.0, height: 3, scaleZ: 1.5, hasPhysics: true },
      { radius: 12, y: 9.5, height: 4, scaleZ: 1.4, hasPhysics: false },
      { radius: 7, y: 13.0, height: 3, scaleZ: 1.2, hasPhysics: false },
    ];

    for (const layer of rightHillLayers) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(layer.radius, layer.radius, layer.height, 24),
        darkGreenMat,
      );
      mesh.position.set(40, layer.y, -45);
      mesh.scale.z = layer.scaleZ;
      mesh.receiveShadow = true;
      this.engine.addToScene(mesh);

      if (layer.hasPhysics) {
        const body = new CANNON.Body({
          mass: 0,
          shape: new CANNON.Box(new CANNON.Vec3(layer.radius, layer.height / 2, layer.radius * layer.scaleZ)),
          position: new CANNON.Vec3(40, layer.y, -45),
        });
        this.engine.addPhysicsBody(body);
      }
    }

    // === Far-Left Sandy Slope (decorative) ===
    const slopeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(30, 20, 40),
      sandMat,
    );
    slopeMesh.position.set(-60, 5, -20);
    slopeMesh.rotation.z = 0.7;
    slopeMesh.receiveShadow = true;
    this.engine.addToScene(slopeMesh);

    // === Background Mountains (decorative cones) ===
    const mountains = [
      { x: -70, y: 12.5, z: -90, radius: 40, height: 25, color: 0x66BB6A },
      { x: 0, y: 15, z: -110, radius: 50, height: 30, color: 0x81C784 },
      { x: 60, y: 17.5, z: -100, radius: 35, height: 35, color: 0x90CAF9 },
      { x: 80, y: 10, z: -60, radius: 30, height: 20, color: 0x4CAF50 },
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
