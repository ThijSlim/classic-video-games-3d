/**
 * Platform - A static platform in the world
 * Can be ground, floating platforms, walls, etc.
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from '../../engine/GameEngine';
import { GameObject } from '../../engine/GameObject';

export interface PlatformConfig {
  position: { x: number; y: number; z: number };
  size: { x: number; y: number; z: number };
  color: number;
}

export class Platform extends GameObject {
  private config: PlatformConfig;

  constructor(engine: GameEngine, config: PlatformConfig) {
    super(engine);
    this.config = config;
    this.create();
  }

  create(): void {
    const { position, size, color } = this.config;

    // Visual
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      metalness: 0.1,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.engine.addToScene(this.mesh);

    // Physics (static body)
    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    this.body = new CANNON.Body({
      mass: 0, // Static
      shape,
      position: new CANNON.Vec3(position.x, position.y, position.z),
    });
    this.engine.addPhysicsBody(this.body);
  }

  update(_deltaTime: number): void {
    // Static platforms don't need updates
  }
}
