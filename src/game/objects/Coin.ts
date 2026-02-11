/**
 * Coin - Collectible spinning coin
 * When Mario touches it, it's collected and the coin count increases
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from '../../engine/GameEngine';
import { GameObject } from '../../engine/GameObject';

export class Coin extends GameObject {
  private spinSpeed = 3;
  private bobSpeed = 2;
  private bobAmount = 0.3;
  private startY: number;
  private time = Math.random() * Math.PI * 2; // Random phase

  constructor(engine: GameEngine, position: { x: number; y: number; z: number }) {
    super(engine);
    this.startY = position.y;
    this.createAt(position);
  }

  private createAt(position: { x: number; y: number; z: number }): void {
    // Coin visual - flat cylinder with gold material
    const group = new THREE.Group();

    const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xFFA000,
      emissiveIntensity: 0.3,
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.z = Math.PI / 2; // Stand upright
    coin.castShadow = true;
    group.add(coin);

    // Glow effect
    const glowGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    group.position.set(position.x, position.y, position.z);
    this.mesh = group;
    this.engine.addToScene(this.mesh);

    // Physics - sensor body (trigger, no physical collision)
    this.body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Sphere(0.5),
      position: new CANNON.Vec3(position.x, position.y, position.z),
      isTrigger: true,
      collisionResponse: false,
    });
    this.engine.addPhysicsBody(this.body);
  }

  create(): void {
    // Created in constructor via createAt
  }

  update(deltaTime: number): void {
    if (!this.isActive) return;

    this.time += deltaTime;

    // Spin
    this.mesh.rotation.y += this.spinSpeed * deltaTime;

    // Bob up and down
    this.mesh.position.y = this.startY + Math.sin(this.time * this.bobSpeed) * this.bobAmount;
  }
}
