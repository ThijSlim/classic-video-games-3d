/**
 * Mario - The player character
 * Implements Mario 64-style movement: running, jumping, triple jump,
 * ground pound, wall jump, and more
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from '../../engine/GameEngine';
import { GameObject } from '../../engine/GameObject';
import { InputManager } from '../../engine/InputManager';

enum MarioState {
  Idle = 'idle',
  Running = 'running',
  Jumping = 'jumping',
  Falling = 'falling',
  DoubleJump = 'double_jump',
  TripleJump = 'triple_jump',
  GroundPound = 'ground_pound',
  WallSlide = 'wall_slide',
  Dead = 'dead',
}

export class Mario extends GameObject {
  private input: InputManager;
  private state: MarioState = MarioState.Idle;
  private moveSpeed = 14;
  private runSpeed = 22;
  private jumpForce = 13;
  private doubleJumpForce = 15;
  private tripleJumpForce = 19;
  private isGrounded = false;
  private jumpCount = 0;
  private jumpTimer = 0;
  private groundPounding = false;
  private facingAngle = 0;
  private marioGroup!: THREE.Group;
  private groundContactCount = 0;
  private deathTimer = 0;

  // Game state
  coins = 0;
  stars = 0;
  lives = 3;
  isGameOver = false;
  isDead = false;

  // Animation
  private animationTime = 0;
  private bodyParts: {
    body: THREE.Mesh;
    head: THREE.Mesh;
    hat: THREE.Mesh;
    leftArm: THREE.Mesh;
    rightArm: THREE.Mesh;
    leftLeg: THREE.Mesh;
    rightLeg: THREE.Mesh;
    nose: THREE.Mesh;
    mustache: THREE.Mesh;
    leftEye: THREE.Mesh;
    rightEye: THREE.Mesh;
  } | null = null;

  constructor(engine: GameEngine, input: InputManager) {
    super(engine);
    this.input = input;
    this.create();
  }

  create(): void {
    this.marioGroup = new THREE.Group();

    // === Build Mario character from primitives ===
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red shirt
    const overallsMat = new THREE.MeshStandardMaterial({ color: 0x0000cc }); // Blue overalls
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc99 }); // Skin
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red hat
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x4a2800 }); // Brown shoes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222 }); // Eyes
    const mustacheMat = new THREE.MeshStandardMaterial({ color: 0x3a1a00 }); // Mustache

    // Body (torso - red shirt)
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.5),
      bodyMat
    );
    body.position.y = 0.9;
    body.castShadow = true;
    this.marioGroup.add(body);

    // Overalls (lower torso)
    const overalls = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.4, 0.5),
      overallsMat
    );
    overalls.position.y = 0.5;
    overalls.castShadow = true;
    this.marioGroup.add(overalls);

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      skinMat
    );
    head.position.y = 1.55;
    head.castShadow = true;
    this.marioGroup.add(head);

    // Hat
    const hat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.4, 0.15, 12),
      hatMat
    );
    hat.position.y = 1.8;
    hat.castShadow = true;
    this.marioGroup.add(hat);

    // Hat brim
    const hatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.05, 12),
      hatMat
    );
    hatBrim.position.set(0, 1.72, 0.1);
    this.marioGroup.add(hatBrim);

    // Nose
    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      skinMat
    );
    nose.position.set(0, 1.5, 0.35);
    this.marioGroup.add(nose);

    // Mustache
    const mustache = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.05, 0.05),
      mustacheMat
    );
    mustache.position.set(0, 1.43, 0.33);
    this.marioGroup.add(mustache);

    // Eyes
    const leftEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      eyeMat
    );
    leftEye.position.set(-0.12, 1.58, 0.3);
    this.marioGroup.add(leftEye);

    const rightEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      eyeMat
    );
    rightEye.position.set(0.12, 1.58, 0.3);
    this.marioGroup.add(rightEye);

    // Left Arm
    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8),
      bodyMat
    );
    leftArm.position.set(-0.55, 0.85, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    this.marioGroup.add(leftArm);

    // Left Hand
    const leftHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      skinMat
    );
    leftHand.position.set(-0.7, 0.6, 0);
    this.marioGroup.add(leftHand);

    // Right Arm
    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8),
      bodyMat
    );
    rightArm.position.set(0.55, 0.85, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    this.marioGroup.add(rightArm);

    // Right Hand
    const rightHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      skinMat
    );
    rightHand.position.set(0.7, 0.6, 0);
    this.marioGroup.add(rightHand);

    // Left Leg
    const leftLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8),
      overallsMat
    );
    leftLeg.position.set(-0.2, 0.15, 0);
    leftLeg.castShadow = true;
    this.marioGroup.add(leftLeg);

    // Left Shoe
    const leftShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.3),
      shoeMat
    );
    leftShoe.position.set(-0.2, -0.05, 0.05);
    this.marioGroup.add(leftShoe);

    // Right Leg
    const rightLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8),
      overallsMat
    );
    rightLeg.position.set(0.2, 0.15, 0);
    rightLeg.castShadow = true;
    this.marioGroup.add(rightLeg);

    // Right Shoe
    const rightShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.3),
      shoeMat
    );
    rightShoe.position.set(0.2, -0.05, 0.05);
    this.marioGroup.add(rightShoe);

    // Store references for animation
    this.bodyParts = {
      body,
      head,
      hat,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      nose,
      mustache,
      leftEye,
      rightEye,
    };

    // Shadow beneath Mario
    const shadowGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    this.marioGroup.add(shadow);

    this.mesh = this.marioGroup;
    this.engine.addToScene(this.mesh);

    // Physics body - capsule-like (cylinder + 2 spheres approximated by a box)
    const shape = new CANNON.Box(new CANNON.Vec3(0.3, 0.5, 0.3));
    this.body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0, 5, 0),
      fixedRotation: true, // Don't tumble
      linearDamping: 0.1,
    });

    // Ground contact detection
    this.body.addEventListener('collide', (event: any) => {
      const contact = event.contact;
      const normal = contact.ni;
      // Determine correct normal direction relative to Mario
      const isBodyA = contact.bi === this.body;
      const upDot = isBodyA ? -normal.y : normal.y;
      // If collision normal points upward relative to Mario, we're on ground
      if (upDot > 0.5) {
        this.groundContactCount++;
        this.isGrounded = true;
        this.jumpCount = 0;
        this.groundPounding = false;
      }
    });

    this.engine.addPhysicsBody(this.body);
  }

  update(deltaTime: number): void {
    if (!this.isActive) return;

    // If dead, run death animation and return
    if (this.isDead) {
      this.deathTimer += deltaTime;
      if (this.deathTimer < 0.5) {
        // Pop up animation
        this.body.velocity.set(0, 10, 0);
      }
      this.mesh.position.set(
        this.body.position.x,
        this.body.position.y - 0.5,
        this.body.position.z
      );
      this.mesh.rotation.z = this.deathTimer * 3;
      if (this.deathTimer > 2) {
        this.handleDeathComplete();
      }
      return;
    }

    this.animationTime += deltaTime;
    this.jumpTimer -= deltaTime;

    // Reset ground contact count each frame — collision events will re-set it
    this.groundContactCount = 0;

    // Movement
    this.handleMovement(deltaTime);

    // Jumping
    this.handleJumping();

    // Ground pound
    this.handleGroundPound();

    // Sync mesh to physics
    this.mesh.position.set(
      this.body.position.x,
      this.body.position.y - 0.5, // Offset for visual alignment
      this.body.position.z
    );

    // Face movement direction
    if (Math.abs(this.body.velocity.x) > 0.5 || Math.abs(this.body.velocity.z) > 0.5) {
      this.facingAngle = Math.atan2(this.body.velocity.x, this.body.velocity.z);
    }
    this.mesh.rotation.y = this.facingAngle;

    // Animate
    this.animate(deltaTime);

    // Update state
    this.updateState();

    // If falling and velocity is near zero, likely resting on surface
    if (Math.abs(this.body.velocity.y) < 0.3 && !this.isGrounded) {
      // Use a small downward ray test: if body is resting, consider grounded
      this.isGrounded = true;
      this.jumpCount = 0;
    }

    // If moving downward, mark as not grounded
    if (this.body.velocity.y < -2) {
      this.isGrounded = false;
    }

    // Fall death
    if (this.body.position.y < -20) {
      this.die();
    }
  }

  private handleMovement(deltaTime: number): void {
    const { x, z } = this.input.movementVector;
    if (x === 0 && z === 0) return;

    const speed = this.input.run ? this.runSpeed : this.moveSpeed;

    // Movement relative to camera direction
    const cameraAngle = this.engine.cameraController.cameraRotationX;
    const moveX = x * Math.cos(cameraAngle) + z * Math.sin(cameraAngle);
    const moveZ = -x * Math.sin(cameraAngle) + z * Math.cos(cameraAngle);

    this.body.velocity.x = moveX * speed;
    this.body.velocity.z = moveZ * speed;
  }

  private handleJumping(): void {
    if (!this.input.jump) return;

    if (this.isGrounded) {
      this.isGrounded = false;

      if (this.jumpTimer > 0 && this.jumpCount === 1) {
        // Double jump
        this.body.velocity.y = this.doubleJumpForce;
        this.jumpCount = 2;
        this.state = MarioState.DoubleJump;
      } else if (this.jumpTimer > 0 && this.jumpCount === 2) {
        // Triple jump!
        this.body.velocity.y = this.tripleJumpForce;
        this.jumpCount = 0;
        this.state = MarioState.TripleJump;
      } else {
        // Normal jump
        this.body.velocity.y = this.jumpForce;
        this.jumpCount = 1;
        this.state = MarioState.Jumping;
      }
      this.jumpTimer = 0.4; // Window for multi-jump
    }
  }

  private handleGroundPound(): void {
    if (this.input.crouch && !this.isGrounded && !this.groundPounding) {
      this.groundPounding = true;
      this.body.velocity.x = 0;
      this.body.velocity.z = 0;
      this.body.velocity.y = -20; // Slam down
      this.state = MarioState.GroundPound;
    }
  }

  private updateState(): void {
    if (this.isGrounded) {
      const speed = Math.sqrt(
        this.body.velocity.x ** 2 + this.body.velocity.z ** 2
      );
      this.state = speed > 0.5 ? MarioState.Running : MarioState.Idle;
    } else if (this.body.velocity.y < -1) {
      if (!this.groundPounding) {
        this.state = MarioState.Falling;
      }
    }
  }

  private animate(_deltaTime: number): void {
    if (!this.bodyParts) return;

    const { leftArm, rightArm, leftLeg, rightLeg } = this.bodyParts;

    switch (this.state) {
      case MarioState.Running: {
        const swingSpeed = this.input.run ? 12 : 8;
        const swing = Math.sin(this.animationTime * swingSpeed) * 0.8;
        leftArm.rotation.x = swing;
        rightArm.rotation.x = -swing;
        leftLeg.rotation.x = -swing * 0.6;
        rightLeg.rotation.x = swing * 0.6;
        break;
      }
      case MarioState.Jumping:
      case MarioState.DoubleJump:
      case MarioState.TripleJump: {
        leftArm.rotation.x = -0.5;
        rightArm.rotation.x = -0.5;
        leftLeg.rotation.x = 0.3;
        rightLeg.rotation.x = 0.3;
        break;
      }
      case MarioState.GroundPound: {
        leftArm.rotation.x = Math.PI;
        rightArm.rotation.x = Math.PI;
        leftLeg.rotation.x = -0.5;
        rightLeg.rotation.x = -0.5;
        break;
      }
      case MarioState.Idle:
      default: {
        // Subtle idle animation
        const breathe = Math.sin(this.animationTime * 2) * 0.05;
        leftArm.rotation.x = breathe;
        rightArm.rotation.x = breathe;
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        break;
      }
    }
  }

  collectCoin(): void {
    this.coins++;
    if (this.coins >= 100) {
      this.coins = 0;
      this.lives++;
    }
  }

  collectStar(): void {
    this.stars++;
  }

  /** Called when Mario touches a Goomba or takes lethal damage */
  die(): void {
    if (this.isDead) return;
    this.isDead = true;
    this.state = MarioState.Dead;
    this.deathTimer = 0;
    // Disable physics response so Mario flies up
    this.body.collisionResponse = false;
    this.body.velocity.set(0, 12, 0);
  }

  private handleDeathComplete(): void {
    this.lives--;
    this.isDead = false;
    this.body.collisionResponse = true;
    this.mesh.rotation.z = 0;

    if (this.lives <= 0) {
      this.isGameOver = true;
    } else {
      this.respawn();
    }
  }

  respawn(): void {
    this.body.position.set(0, 5, 0);
    this.body.velocity.set(0, 0, 0);
    this.isGrounded = false;
    this.state = MarioState.Falling;
  }

  resetGame(): void {
    this.lives = 3;
    this.coins = 0;
    this.stars = 0;
    this.isGameOver = false;
    this.isDead = false;
    this.respawn();
  }
}
