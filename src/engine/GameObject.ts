/**
 * GameObject - Base class for all game entities
 * Provides the interface for objects that exist in the 3D world
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from './GameEngine';

export abstract class GameObject {
  protected engine: GameEngine;
  mesh!: THREE.Object3D;
  body!: CANNON.Body;
  isActive = true;

  constructor(engine: GameEngine) {
    this.engine = engine;
  }

  abstract create(): void;
  abstract update(deltaTime: number): void;

  /** Sync Three.js mesh position/rotation from Cannon physics body */
  protected syncMeshToBody(): void {
    if (this.mesh && this.body) {
      this.mesh.position.copy(this.body.position as unknown as THREE.Vector3);
      this.mesh.quaternion.copy(this.body.quaternion as unknown as THREE.Quaternion);
    }
  }

  get position(): THREE.Vector3 {
    return this.mesh?.position ?? new THREE.Vector3();
  }

  get rotation(): THREE.Euler {
    return this.mesh?.rotation ?? new THREE.Euler();
  }

  destroy(): void {
    this.isActive = false;
    if (this.mesh) this.engine.removeFromScene(this.mesh);
    if (this.body) this.engine.removePhysicsBody(this.body);
  }
}
