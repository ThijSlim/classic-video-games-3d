/**
 * HUD - Heads-Up Display
 * Updates the on-screen coin, star, and life counters
 */

export interface HUDState {
  coins: number;
  stars: number;
  lives: number;
}

export class HUD {
  private coinEl: HTMLElement;
  private starEl: HTMLElement;
  private lifeEl: HTMLElement;

  constructor() {
    this.coinEl = document.getElementById('coin-count')!;
    this.starEl = document.getElementById('star-count')!;
    this.lifeEl = document.getElementById('life-count')!;
  }

  update(state: HUDState): void {
    this.coinEl.textContent = String(state.coins);
    this.starEl.textContent = String(state.stars);
    this.lifeEl.textContent = String(state.lives);
  }
}
