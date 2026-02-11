---
name: feature-analysis
description: Methodology for analyzing game feature requests and breaking them into implementable specifications. Use this when evaluating new feature requests for the 3D platformer.
---

# Feature Analysis Methodology

Step-by-step process for analyzing game feature requests and producing actionable implementation specifications.

## Process

### Step 1: Classify the Feature
Determine which category the feature falls into:

| Category | Examples | Typical Complexity |
|----------|----------|--------------------|
| **New Game Object** | Star, Bob-omb, Moving Platform, Power-Up | Medium |
| **Player Ability** | Wall Jump, Long Jump, Swim, Fly | High |
| **Level Element** | New area, puzzle mechanism, door/warp | Medium |
| **Enemy Behavior** | New enemy type, boss fight, AI patterns | Medium-High |
| **Visual Effect** | Particles, weather, day/night cycle | Medium |
| **UI Feature** | Menu, dialog, minimap, timer | Low-Medium |
| **Audio** | Sound effects, music, spatial audio | Low |
| **Game System** | Save/load, scoring, achievements | Medium |

### Step 2: Identify Affected Systems
Map which parts of the codebase are affected:

- **Engine layer** — Does this need new engine capabilities?
  - GameEngine: new rendering features, post-processing
  - InputManager: new input bindings
  - CameraController: new camera behaviors
  - GameObject: new base class methods
- **Game layer** — Which game files change?
  - World.ts: new objects, level layout
  - objects/: new or modified game objects
  - ui/HUD.ts: new display elements
  - main.ts: new initialization, game loop changes

### Step 3: Define Requirements
Write requirements using this template:
- `[REQ-XXX]` Unique identifier
- **Must/Should/Could** priority (MoSCoW)
- Clear, testable statement
- Link to affected system

### Step 4: Identify Risks
Common risks in this project:

| Risk | Mitigation |
|------|-----------|
| Physics instability | Keep body counts low, use triggers for non-physical interactions |
| Performance (too many meshes) | Reuse geometries/materials, limit poly counts |
| Collision detection gaps | Use appropriate collision shapes, test edge cases |
| State management complexity | Keep state on the owning object, use simple enums |
| Integration conflicts | Check World.ts for position conflicts with existing objects |

### Step 5: Define Acceptance Criteria
Each criterion must be:
- **Observable** — Can be verified by running the game
- **Specific** — No ambiguity about pass/fail
- **Independent** — Testable in isolation where possible

## Feature Specification Template

```markdown
## Feature: [Name]

### Overview
[1-2 sentence description]

### Category
[From classification table]

### Requirements
1. [REQ-001] **Must** — [description]
2. [REQ-002] **Should** — [description]
3. [REQ-003] **Could** — [description]

### Existing Assets to Reuse
- `ClassName` in `path/file.ts` — [relationship]

### New Components Needed
- [ ] `ComponentName` — [brief description]

### Implementation Plan
1. **[Step]** — [what to do and why]

### Dependencies
- [Dependency with link to system]

### Risks
- [Risk] → [Mitigation]

### Acceptance Criteria
- [ ] [Observable, specific criterion]
```

## Classic Mario 64 Reference

When feature requests are vague, reference these core Mario 64 mechanics:

- **Movement:** Run, walk, crouch, crawl, long jump, side flip, backflip, wall kick
- **Jumping:** Single → Double → Triple jump combo with timing window
- **Combat:** Jump on enemies to defeat them, take damage from side contact
- **Collectibles:** Coins (yellow=1, blue=5, red=2), Stars (level goals), 1-Up Mushrooms
- **Enemies:** Goombas (walk), Koopas (shell), Bob-ombs (explode), Chain Chomps (chase)
- **Level Elements:** Warp pipes, ! blocks, doors, cannons, slides, water, lava
- **Power-ups:** Wing Cap (fly), Metal Cap (heavy/invincible), Vanish Cap (transparent)
