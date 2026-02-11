/**
 * CameraController - Third-person camera that follows the player
 * Implements Mario 64-style camera behavior with orbit and follow modes
 */

import * as THREE from 'three';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private offset = new THREE.Vector3(0, 6, 12);
  private lookAtOffset = new THREE.Vector3(0, 2, 0);
  private currentPosition = new THREE.Vector3();
  private currentLookAt = new THREE.Vector3();
  private smoothSpeed = 5;
  private rotationX = 0;
  private rotationY = 0.3;
  private distance = 12;
  private minDistance = 4;
  private maxDistance = 25;
  private minPolarAngle = 0.1;
  private maxPolarAngle = Math.PI / 2.2;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.currentPosition.copy(camera.position);

    // Mouse movement for camera orbit
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('wheel', (e) => this.onWheel(e));
  }

  private onMouseMove(event: MouseEvent): void {
    if (document.pointerLockElement) {
      this.rotationX -= event.movementX * 0.003;
      this.rotationY -= event.movementY * 0.003;
      this.rotationY = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.rotationY));
    }
  }

  private onWheel(event: WheelEvent): void {
    this.distance += event.deltaY * 0.01;
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));
  }

  followTarget(targetPosition: THREE.Vector3, _targetRotation: THREE.Euler, deltaTime: number): void {
    // Calculate desired camera position based on orbit angles
    const offsetX = Math.sin(this.rotationX) * Math.cos(this.rotationY) * this.distance;
    const offsetY = Math.sin(this.rotationY) * this.distance;
    const offsetZ = Math.cos(this.rotationX) * Math.cos(this.rotationY) * this.distance;

    const desiredPosition = new THREE.Vector3(
      targetPosition.x + offsetX,
      targetPosition.y + offsetY + 2,
      targetPosition.z + offsetZ
    );

    const desiredLookAt = new THREE.Vector3(
      targetPosition.x + this.lookAtOffset.x,
      targetPosition.y + this.lookAtOffset.y,
      targetPosition.z + this.lookAtOffset.z
    );

    // Smooth interpolation
    const t = 1 - Math.pow(0.001, deltaTime * this.smoothSpeed);
    this.currentPosition.lerp(desiredPosition, t);
    this.currentLookAt.lerp(desiredLookAt, t);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  get cameraRotationX(): number {
    return this.rotationX;
  }
}
