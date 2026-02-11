/**
 * GameEngine - Core 3D rendering engine wrapping Three.js
 * Manages the scene, camera, renderer, physics world, and game loop
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CameraController } from './CameraController';

export class GameEngine {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  physicsWorld!: CANNON.World;
  cameraController!: CameraController;
  clock!: THREE.Clock;

  private updateCallbacks: ((dt: number) => void)[] = [];
  private running = false;

  async init(): Promise<void> {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 20);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    document.body.appendChild(this.renderer.domElement);

    // Physics
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -25, 0), // Stronger gravity for platformer feel
    });
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.defaultContactMaterial.friction = 0.3;
    this.physicsWorld.defaultContactMaterial.restitution = 0.1;

    // Lighting
    this.setupLighting();

    // Camera Controller
    this.cameraController = new CameraController(this.camera);

    // Clock
    this.clock = new THREE.Clock();

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  private setupLighting(): void {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    // Hemispheric light (sky + ground)
    const hemi = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
    this.scene.add(hemi);

    // Directional sun light
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(50, 80, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    this.scene.add(sun);
  }

  onUpdate(callback: (dt: number) => void): void {
    this.updateCallbacks.push(callback);
  }

  start(): void {
    this.running = true;
    this.clock.start();
    this.gameLoop();
  }

  stop(): void {
    this.running = false;
  }

  private gameLoop = (): void => {
    if (!this.running) return;
    requestAnimationFrame(this.gameLoop);

    const deltaTime = Math.min(this.clock.getDelta(), 0.05); // Cap delta time

    // Step physics
    this.physicsWorld.step(1 / 60, deltaTime, 3);

    // Run update callbacks
    for (const cb of this.updateCallbacks) {
      cb(deltaTime);
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  };

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addToScene(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  removeFromScene(object: THREE.Object3D): void {
    this.scene.remove(object);
  }

  addPhysicsBody(body: CANNON.Body): void {
    this.physicsWorld.addBody(body);
  }

  removePhysicsBody(body: CANNON.Body): void {
    this.physicsWorld.removeBody(body);
  }
}
