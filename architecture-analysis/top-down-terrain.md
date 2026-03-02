
## 2. Top-Down Terrain Map (ASCII)

The following ASCII map represents the castle grounds from directly above. North is up. Each character represents approximately 4m × 4m.

### Legend

| Symbol | Terrain / Feature |
|--------|-------------------|
| `█` | Castle structure (walls, towers) |
| `▓` | Castle roof (red/brown) |
| `≈` | Water (moat, pond) |
| `·` | Grass (flat ground, elevation 0–2m) |
| `○` | Grass hill (moderate elevation, 3–5m) |
| `●` | Grass hill (high elevation, 6–10m) |
| `▲` | Rocky cliff / mountain edge (10m+) |
| `░` | Sandy ground / path |
| `═║` | Bridge / walkway |
| `♣` | Tree |
| `☆` | Mario start position |
| `□` | Stone platform |

### Full Terrain Map (v2)

```
        N (into screen / -Z in game)
        ↑
                                                    
  ▲  ·  ·  ○  ●  ♣  ·  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ≈  ≈  ░  ●  ●  ♣  ·  ·
  ·  ·  ·  ○  ●  ·  ·  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ░ ░ ░ ░  ○  ●  ♣  ·  ·
  ·  ·  ·  ○  ●  ░  ░  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ≈  ≈  ░  ○  ♣  ○  ·  ·
  ·  ·  ·  ○  ○  ♣  ░  ≈  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ≈  ≈  ≈  ░  ○  ○  ♣  ·  ·
  ·  ·  ·  ○  ●  ○  ░  ░  ≈  ≈  ≈  ≈  ≈  ════  ≈  ≈  ≈  ≈  ≈  ·  ░  ·  ·  ·  ·  ·
  ·  ·  ·  ○  ●  ●  ○  ░  ░  ≈  ≈  ≈  ≈  ════  ≈  ≈  ≈  ≈  ░  ░  ░  ░  ░  ░  ·  ·
  ·  ·  ·  ○  ●  ●  ♣  ○  ░  ░  ≈  ≈  ≈  ════  ≈  ≈  ≈  ░  ░  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ●  ●  ♣  ●  ○  ·  ░  ░  ░  ░  ░  ░  ░  ░  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ●  ♣  ●  ●  ·  ░  ░  ░  ░  ░  ░  ░  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ♣  ●  ●  ♣  ○  ░  ░  ·  ·  ░  ░  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ○  ●  ♣  ○  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ≈  ≈  ≈  ≈  ░  ░  ·  ·
  ·  ·  ·  ○  ○  ○  ♣  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ≈  ≈  ≈  ≈  ≈  ≈  ░  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ░  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ≈  ≈  ≈  ≈  ≈  ≈  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ░  ░  ░  ·  ·  ░  ░  ·  ·  □  ≈  ≈  ≈  ≈  ≈  ░  ░  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ░  ░  ░  ░  ░  ░  ·  ·  □  □  ░  ░  ░  ░  ░  ░  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ░  ░  ░  ░  ░  ·  ·  ·  ·  ░  ░  ░  ░  ░  ░  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ░  ░  ·  ·  ·  ·  ·  ░  ░  ░  ░  ░  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·

        ↓
        S (toward camera / +Z in game)

  ← W (-X)                                              E (+X) →
```

**Legend additions:**
| `□` | Stone platform |
| `▲` | Rocky cliff / mountain edge |

**Version 2 Changes:**
- Castle width doubled (from ~5 to ~10 tiles)
- Moat/water around castle doubled in width
- Sand path connects from Mario start to bridge
- West side is now only grass (no sand)
- South of bridge: 3 sand rows → 3 grass rows → 3 sand rows

**Confidence: High** (updated layout per iteration feedback)