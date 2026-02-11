/**
 * Super Mario 3D - Web Edition
 * Main entry point - initializes the game engine and starts the game loop
 */

import { GameEngine } from './engine/GameEngine';
import { World } from './game/World';
import { Mario } from './game/objects/Mario';
import { InputManager } from './engine/InputManager';
import { HUD } from './game/ui/HUD';

async function main() {
  const progressFill = document.getElementById('progress-fill') as HTMLElement;
  const loading = document.getElementById('loading') as HTMLElement;

  // Initialize game engine
  progressFill.style.width = '20%';
  const engine = new GameEngine();
  await engine.init();

  // Initialize input
  progressFill.style.width = '40%';
  const input = new InputManager(engine.renderer.domElement);

  // Create world
  progressFill.style.width = '60%';
  const world = new World(engine);

  // Create Mario (player character)
  progressFill.style.width = '80%';
  const mario = new Mario(engine, input);
  world.addEntity(mario);

  // Initialize HUD
  const hud = new HUD();

  // Game over overlay
  const gameOverEl = document.getElementById('game-over') as HTMLElement;
  const restartBtn = document.getElementById('restart-btn') as HTMLElement;
  let gameOverShown = false;

  restartBtn.addEventListener('click', () => {
    mario.resetGame();
    gameOverEl.classList.remove('visible');
    gameOverShown = false;
    // Re-lock pointer
    engine.renderer.domElement.requestPointerLock();
  });

  // Wait a bit for visual effect
  progressFill.style.width = '100%';
  await new Promise(resolve => setTimeout(resolve, 500));

  // Hide loading screen
  loading.classList.add('hidden');
  setTimeout(() => loading.remove(), 500);

  // Lock pointer on click
  engine.renderer.domElement.addEventListener('click', () => {
    engine.renderer.domElement.requestPointerLock();
  });

  // Game loop
  engine.onUpdate((deltaTime: number) => {
    world.update(deltaTime);
    mario.update(deltaTime);
    engine.cameraController.followTarget(mario.position, mario.rotation, deltaTime);
    input.update();
    hud.update({
      coins: mario.coins,
      stars: mario.stars,
      lives: mario.lives,
    });

    // Show game-over overlay
    if (mario.isGameOver && !gameOverShown) {
      gameOverShown = true;
      gameOverEl.classList.add('visible');
      document.exitPointerLock();
    }
  });

  engine.start();
}

main().catch(console.error);
