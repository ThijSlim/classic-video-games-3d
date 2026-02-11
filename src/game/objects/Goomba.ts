/**
 * Goomba - Enemy that patrols back and forth
 * Mario can defeat them by jumping on top
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from '../../engine/GameEngine';
import { GameObject } from '../../engine/GameObject';

interface GoombaConfig {
  x: number;
  y: number;
  z: number;
  patrolRadius: number;
}

export class Goomba extends GameObject {
  private config: GoombaConfig;
  private startX: number;
  private startZ: number;
  private patrolAngle = 0;
  private patrolSpeed = 1.5;
  private walkAnimation = 0;

  constructor(engine: GameEngine, config: GoombaConfig) {
    super(engine);
    this.config = config;
    this.startX = config.x;
    this.startZ = config.z;
    this.create();
  }

  create(): void {
    const group = new THREE.Group();
    const brownMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const darkBrown = new THREE.MeshStandardMaterial({ color: 0x5D3A1A });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    // Body (mushroom shape)
    const bodyGeo = new THREE.SphereGeometry(0.4, 12, 8);
    const body = new THREE.Mesh(bodyGeo, brownMat);
    body.scale.set(1, 0.8, 1);
    body.position.y = 0.3;
    body.castShadow = true;
    group.add(body);

    // Head/cap
    const headGeo = new THREE.SphereGeometry(0.45, 12, 8);
    const head = new THREE.Mesh(headGeo, darkBrown);
    head.scale.set(1, 0.6, 1);
    head.position.y = 0.65;
    head.castShadow = true;
    group.add(head);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeo, whiteMat);
    leftEye.position.set(-0.15, 0.5, 0.35);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, whiteMat);
    rightEye.position.set(0.15, 0.5, 0.35);
    group.add(rightEye);

    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.05, 6, 6);
    const leftPupil = new THREE.Mesh(pupilGeo, blackMat);
    leftPupil.position.set(-0.15, 0.5, 0.43);
    group.add(leftPupil);
    const rightPupil = new THREE.Mesh(pupilGeo, blackMat);
    rightPupil.position.set(0.15, 0.5, 0.43);
    group.add(rightPupil);

    // Angry eyebrows
    const browGeo = new THREE.BoxGeometry(0.15, 0.03, 0.03);
    const leftBrow = new THREE.Mesh(browGeo, blackMat);
    leftBrow.position.set(-0.15, 0.6, 0.4);
    leftBrow.rotation.z = 0.3;
    group.add(leftBrow);
    const rightBrow = new THREE.Mesh(browGeo, blackMat);
    rightBrow.position.set(0.15, 0.6, 0.4);
    rightBrow.rotation.z = -0.3;
    group.add(rightBrow);

    // Feet
    const footGeo = new THREE.SphereGeometry(0.15, 8, 6);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x3E2723 });
    const leftFoot = new THREE.Mesh(footGeo, footMat);
    leftFoot.position.set(-0.2, 0, 0.05);
    leftFoot.scale.set(1.2, 0.6, 1.5);
    group.add(leftFoot);
    const rightFoot = new THREE.Mesh(footGeo, footMat);
    rightFoot.position.set(0.2, 0, 0.05);
    rightFoot.scale.set(1.2, 0.6, 1.5);
    group.add(rightFoot);

    group.position.set(this.config.x, this.config.y, this.config.z);
    this.mesh = group;
    this.engine.addToScene(this.mesh);

    // Physics
    this.body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Sphere(0.4),
      position: new CANNON.Vec3(this.config.x, this.config.y + 0.3, this.config.z),
      collisionResponse: true,
    });
    this.engine.addPhysicsBody(this.body);
  }

  update(deltaTime: number): void {
    if (!this.isActive) return;

    // Patrol in a circle
    this.patrolAngle += this.patrolSpeed * deltaTime;
    const newX = this.startX + Math.cos(this.patrolAngle) * this.config.patrolRadius;
    const newZ = this.startZ + Math.sin(this.patrolAngle) * this.config.patrolRadius;

    this.mesh.position.x = newX;
    this.mesh.position.z = newZ;
    this.body.position.x = newX;
    this.body.position.z = newZ;

    // Face movement direction
    this.mesh.rotation.y = this.patrolAngle + Math.PI;

    // Walking animation - bob up and down slightly
    this.walkAnimation += deltaTime * 8;
    this.mesh.position.y = this.config.y + Math.abs(Math.sin(this.walkAnimation)) * 0.1;
  }
}
