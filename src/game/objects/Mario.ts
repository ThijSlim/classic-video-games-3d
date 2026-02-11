/**
 * Mario - The player character
 * Implements Mario 64-style movement: running, jumping, triple jump,
 * ground pound, wall jump, and more
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
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
  private modelLoaded = false;

  // Bone references for animation
  private leftThigh: THREE.Bone | null = null;
  private rightThigh: THREE.Bone | null = null;
  private leftLeg: THREE.Bone | null = null;
  private rightLeg: THREE.Bone | null = null;
  private leftUpperarm: THREE.Bone | null = null;
  private rightUpperarm: THREE.Bone | null = null;
  private leftForearm: THREE.Bone | null = null;
  private rightForearm: THREE.Bone | null = null;

  // Game state
  coins = 0;
  stars = 0;
  lives = 3;
  isGameOver = false;
  isDead = false;

  // Animation
  private animationTime = 0;

  constructor(engine: GameEngine, input: InputManager) {
    super(engine);
    this.input = input;
    this.create();
  }

  create(): void {
    this.marioGroup = new THREE.Group();

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

    // Load 3D Mario model from Collada file
    this.loadModel();

    // Physics body
    const shape = new CANNON.Box(new CANNON.Vec3(0.3, 0.5, 0.3));
    this.body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0, 5, 0),
      fixedRotation: true,
      linearDamping: 0.1,
    });

    // Ground contact detection
    this.body.addEventListener('collide', (event: any) => {
      const contact = event.contact;
      const normal = contact.ni;
      const isBodyA = contact.bi === this.body;
      const upDot = isBodyA ? -normal.y : normal.y;
      if (upDot > 0.5) {
        this.groundContactCount++;
        this.isGrounded = true;
        this.jumpCount = 0;
        this.groundPounding = false;
      }
    });

    this.engine.addPhysicsBody(this.body);
  }

  private loadModel(): void {
    const loader = new ColladaLoader();
    loader.load('/assets/mario/mario.dae', (collada) => {
      const model = collada.scene;

      // Model is ~90 units tall in native coords; scale to ~1.8 game units
      const s = 0.02;
      model.scale.set(s, s, s);
      model.position.y = 0;

      // Enable shadows on all meshes and upgrade to standard materials
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      // Find bones for procedural animation
      model.traverse((node) => {
        if ((node as THREE.Bone).isBone) {
          switch (node.name) {
            case 'left_thigh': this.leftThigh = node as THREE.Bone; break;
            case 'right_thigh': this.rightThigh = node as THREE.Bone; break;
            case 'left_leg': this.leftLeg = node as THREE.Bone; break;
            case 'right_leg': this.rightLeg = node as THREE.Bone; break;
            case 'left_upperarm': this.leftUpperarm = node as THREE.Bone; break;
            case 'right_upperarm': this.rightUpperarm = node as THREE.Bone; break;
            case 'left_forearm': this.leftForearm = node as THREE.Bone; break;
            case 'right_forearm': this.rightForearm = node as THREE.Bone; break;
          }
        }
      });

      // Wrap in a container so the loader's Z_UP rotation on the model
      // is not overwritten by animation code on the container
      const container = new THREE.Group();
      container.add(model);
      this.marioGroup.add(container);
      this.modelLoaded = true;
    });
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
    if (x === 0 && z === 0) {
      this.body.velocity.x = 0;
      this.body.velocity.z = 0;
      return;
    }

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
    // Model-based animation - simple bob/tilt based on state
    if (!this.modelLoaded) return;

    switch (this.state) {
      case MarioState.Running: {
        const isRunning = this.input.run;
        const freq = isRunning ? 14 : 10;
        const t = this.animationTime * freq;

        // Forward lean when running, upright when walking
        const lean = isRunning ? 0.2 : 0;
        // Subtle running bob
        const bob = Math.sin(t * 2) * 0.04;
        this.marioGroup.children.forEach(child => {
          if (child.type === 'Group' || child.type === 'Object3D') {
            child.position.y = bob;
            child.rotation.x = lean;
          }
        });

        // Leg swing — thigh-local Z maps to world X (forward/backward axis)
        const legSwing = Math.sin(t) * 0.8;
        if (this.leftThigh) this.leftThigh.rotation.z = legSwing;
        if (this.rightThigh) this.rightThigh.rotation.z = -legSwing;
        // Knee bend — only bends when leg is behind
        if (this.leftLeg) this.leftLeg.rotation.z = Math.max(0, -Math.sin(t)) * 0.6;
        if (this.rightLeg) this.rightLeg.rotation.z = Math.max(0, Math.sin(t)) * 0.6;

        // Arm swing — upperarm-local X maps to world X (forward/backward)
        // Arms oppose same-side legs for natural gait; more pronounced when running
        const armSwing = Math.sin(t) * (isRunning ? 1.0 : 0.7);
        if (this.leftUpperarm) this.leftUpperarm.rotation.x = -armSwing;
        if (this.rightUpperarm) this.rightUpperarm.rotation.x = armSwing;
        // Forearm/elbow bend — stronger pump when running
        const elbowBase = isRunning ? 0.5 : 0.3;
        const elbowRange = isRunning ? 0.6 : 0.3;
        if (this.leftForearm) this.leftForearm.rotation.x = elbowBase + Math.max(0, Math.sin(t)) * elbowRange;
        if (this.rightForearm) this.rightForearm.rotation.x = elbowBase + Math.max(0, -Math.sin(t)) * elbowRange;
        break;
      }
      case MarioState.Jumping:
      case MarioState.DoubleJump:
      case MarioState.TripleJump: {
        // Arms raised, legs slightly tucked
        if (this.leftUpperarm) this.leftUpperarm.rotation.x = -0.8;
        if (this.rightUpperarm) this.rightUpperarm.rotation.x = -0.8;
        if (this.leftForearm) this.leftForearm.rotation.x = 0.4;
        if (this.rightForearm) this.rightForearm.rotation.x = 0.4;
        if (this.leftThigh) { this.leftThigh.rotation.z = 0.3; this.leftThigh.rotation.x = 0; }
        if (this.rightThigh) { this.rightThigh.rotation.z = 0.3; this.rightThigh.rotation.x = 0; }
        if (this.leftLeg) this.leftLeg.rotation.z = 0;
        if (this.rightLeg) this.rightLeg.rotation.z = 0;
        break;
      }
      case MarioState.Falling: {
        // Arms out, legs dangling
        if (this.leftUpperarm) this.leftUpperarm.rotation.x = -0.3;
        if (this.rightUpperarm) this.rightUpperarm.rotation.x = -0.3;
        if (this.leftForearm) this.leftForearm.rotation.x = 0.2;
        if (this.rightForearm) this.rightForearm.rotation.x = 0.2;
        if (this.leftThigh) { this.leftThigh.rotation.z = 0.15; this.leftThigh.rotation.x = 0; }
        if (this.rightThigh) { this.rightThigh.rotation.z = 0.15; this.rightThigh.rotation.x = 0; }
        if (this.leftLeg) this.leftLeg.rotation.z = 0.2;
        if (this.rightLeg) this.rightLeg.rotation.z = 0.2;
        break;
      }
      case MarioState.GroundPound: {
        // Tuck pose - knees up, arms in
        this.marioGroup.children.forEach(child => {
          if (child.type === 'Group' || child.type === 'Object3D') {
            child.rotation.x = 0.3;
          }
        });
        if (this.leftThigh) { this.leftThigh.rotation.z = -0.8; this.leftThigh.rotation.x = 0; }
        if (this.rightThigh) { this.rightThigh.rotation.z = -0.8; this.rightThigh.rotation.x = 0; }
        if (this.leftLeg) this.leftLeg.rotation.z = 0.6;
        if (this.rightLeg) this.rightLeg.rotation.z = 0.6;
        if (this.leftUpperarm) this.leftUpperarm.rotation.x = 0.4;
        if (this.rightUpperarm) this.rightUpperarm.rotation.x = 0.4;
        if (this.leftForearm) this.leftForearm.rotation.x = 0;
        if (this.rightForearm) this.rightForearm.rotation.x = 0;
        break;
      }
      default: {
        // Idle - reset all bones and container
        this.marioGroup.children.forEach(child => {
          if (child.type === 'Group' || child.type === 'Object3D') {
            child.position.y = 0;
            child.rotation.x = 0;
          }
        });
        this.resetBones();
        break;
      }
    }
  }

  private resetBones(): void {
    if (this.leftThigh) { this.leftThigh.rotation.x = 0; this.leftThigh.rotation.z = 0; }
    if (this.rightThigh) { this.rightThigh.rotation.x = 0; this.rightThigh.rotation.z = 0; }
    if (this.leftLeg) { this.leftLeg.rotation.x = 0; this.leftLeg.rotation.z = 0; }
    if (this.rightLeg) { this.rightLeg.rotation.x = 0; this.rightLeg.rotation.z = 0; }
    if (this.leftUpperarm) this.leftUpperarm.rotation.x = 0;
    if (this.rightUpperarm) this.rightUpperarm.rotation.x = 0;
    if (this.leftForearm) this.leftForearm.rotation.x = 0;
    if (this.rightForearm) this.rightForearm.rotation.x = 0;
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
