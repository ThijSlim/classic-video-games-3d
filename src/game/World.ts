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

export class World {
  private engine: GameEngine;
  private entities: GameObject[] = [];

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.buildLevel();
  }

  private buildLevel(): void {
    // === Main ground platform ===
    this.addEntity(new Platform(this.engine, {
      position: { x: 0, y: -0.5, z: 0 },
      size: { x: 40, y: 1, z: 40 },
      color: 0x4CAF50, // Green grass
    }));

    // === Castle area - raised platform ===
    this.addEntity(new Platform(this.engine, {
      position: { x: 0, y: 0.5, z: -18 },
      size: { x: 12, y: 2, z: 8 },
      color: 0x9E9E9E, // Stone gray
    }));

    // Castle towers
    this.addEntity(new Platform(this.engine, {
      position: { x: -5, y: 4, z: -20 },
      size: { x: 3, y: 8, z: 3 },
      color: 0xBDBDBD,
    }));
    this.addEntity(new Platform(this.engine, {
      position: { x: 5, y: 4, z: -20 },
      size: { x: 3, y: 8, z: 3 },
      color: 0xBDBDBD,
    }));

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
      this.addEntity(new Coin(this.engine, pos));
    }

    // === Enemies (Goombas) ===
    const goombaPositions = [
      { x: 5, y: 1, z: 5, patrolRadius: 3 },
      { x: -5, y: 1, z: 5, patrolRadius: 4 },
      { x: 10, y: 1, z: -5, patrolRadius: 3 },
      { x: -10, y: 1, z: -8, patrolRadius: 5 },
    ];

    for (const g of goombaPositions) {
      this.addEntity(new Goomba(this.engine, g));
    }

    // === Decorations ===
    this.addDecorations();
  }

  private addDecorations(): void {
    // Trees
    const treePositions = [
      { x: 15, z: 15 },
      { x: -15, z: 15 },
      { x: 15, z: -10 },
      { x: -15, z: -10 },
      { x: -18, z: 0 },
      { x: 18, z: 0 },
      { x: 10, z: -15 },
      { x: -10, z: -15 },
    ];

    for (const pos of treePositions) {
      this.createTree(pos.x, pos.z);
    }

    // Pipe
    this.createPipe(12, 0, -8);
    this.createPipe(-8, 0, -12);
  }

  private createTree(x: number, z: number): void {
    const group = new THREE.Group();

    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 3, 8),
      new THREE.MeshStandardMaterial({ color: 0x5D4037 })
    );
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage (3 spheres)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32 });
    for (const offset of [
      { x: 0, y: 3.5, z: 0, r: 1.2 },
      { x: -0.5, y: 4.2, z: 0.3, r: 0.9 },
      { x: 0.4, y: 4.5, z: -0.2, r: 0.8 },
    ]) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(offset.r, 8, 8),
        leafMat
      );
      leaf.position.set(offset.x, offset.y, offset.z);
      leaf.castShadow = true;
      group.add(leaf);
    }

    group.position.set(x, 0, z);
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
  }

  update(deltaTime: number): void {
    for (const entity of this.entities) {
      if (entity.isActive) {
        entity.update(deltaTime);
      }
    }
  }
}
