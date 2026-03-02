# Terrain Map Analysis: Princess Peach's Castle Grounds (Top-Down View)

**Analysis Date:** 2 March 2026
**Source:** Top-down view reference image (`Castle_Grounds.png`)
**Context:** Super Mario 64 Castle Grounds — analyzed as a terrain/site plan for 3D reconstruction
**Companion Document:** [peach-castle.md](peach-castle.md) (3/4 aerial perspective analysis)

---

## 1. Site Overview & Classification

- **Site type:** Royal estate / castle grounds — a self-contained landscaped precinct
- **Total visible area:** ~200m × 200m (~40,000 m²)
- **Playable area:** ~160m × 140m (~22,400 m²)
- **Primary orientation:** Castle faces south; main approach from the south
- **Terrain character:** Sculpted parkland with rolling hills, a central castle compound, and a surrounding moat system

**Confidence: High**

---

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
  ▲  ·  ·  ○  ●  ♣  ·  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ≈  ≈  ░  ●  ●  ♣  ·  ·
  ·  ·  ·  ○  ●  ·  ·  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ≈  ≈  ░  ○  ●  ♣  ·  ·
  ·  ·  ·  ○  ●  ░  ░  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ≈  ≈  ░  ○  ♣  ○  ·  ·
  ·  ·  ·  ○  ○  ♣  ░  ≈  ≈  ≈  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ▓  ≈  ≈  ≈  ░  ○  ○  ♣  ·  ·
  ·  ·  ·  ○  ●  ○  ░  ░  ≈  ≈  ≈  ≈  ≈  ════  ≈  ≈  ≈  ≈  ≈  ·  ░  ·  ·  ·  ·  ·
  ·  ·  ·  ○  ●  ●  ○  ░  ░  ≈  ≈  ≈  ≈  ════  ≈  ≈  ≈  ≈  ░  ░  ░  ░  ░  ░  ·  ·
  ·  ·  ·  ○  ●  ●  ♣  ○  ░  ░  ≈  ≈  ≈  ════  ≈  ≈  ≈  ░  ░  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ●  ●  ♣  ●  ○  ·  ░  ░  ░  ░  ░  ░  ░  ░  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ●  ♣  ●  ●  ·  ░  ░  ░  ░  ░  ░  ░  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ♣  ●  ●  ♣  ○  ░  ░  ·  ·  ░  ░  ░  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ○  ○  ●  ♣  ○  ░  ░  ·  ·  ○  ○  ♣  ○  ·  ·  ·  ·  ≈  ≈  ≈  ≈  ░  ░  ·  ·
  ·  ·  ·  ○  ○  ○  ♣  ░  ░  ·  ○  ●  ♣  ○  ○  ·  ·  ·  ≈  ≈  ≈  ≈  ≈  ≈  ░  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ░  ░  ░  ○  ○  ♣  ○  ○  ·  ·  ·  ≈  ≈  ≈  ≈  ≈  ≈  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ░  ░  ░  ○  ♣  ░  ░  ·  ·  □  ≈  ≈  ≈  ≈  ≈  ░  ░  ·  ·
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

**Confidence: High** (updated layout per iteration feedback
- Castle width doubled (from ~5 to ~10 tiles)
- Moat/water around castle doubled in width
- Sand path connects from Mario start to bridge
- West side is now only grass (no sand)
- South of bridge: 3 sand rows → 3 grass rows → 3 sand rows

**Confidence: High** (updated layout per iteration feedback)

---

## 3. Zone Map with Elevation Contours

### Zone Identification

From the top-down view, the castle grounds can be divided into the following distinct zones:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ZONE G          ZONE H                 ZONE I                   │
│  Rocky Cliff     Left Hill    ┌─────────────────┐  Right Hill    │
│  (Brown cliffs)  ♣  ♣  ♣     │    ZONE C       │   ♣  ♣  ♣      │
│  Elev: +15-25m    ♣  ●  ●    │    Castle       │    ●  ●  ♣     │
│                      ●       │    Compound     │      ●         │
│                          ≈≈≈≈│  (red roof)    │≈≈≈≈            │
│                        ≈≈    │                │    ≈≈           │
│                       ≈ MOAT │    35m × 25m   │ MOAT ≈          │
│                        ≈≈    │   Elev: 0-2m   │    ≈≈           │
│     ░░░░░              ≈≈≈≈≈≈└───────┬───────┘≈≈≈≈              │
│    ░░░░░░                     ZONE D │ Bridge                    │
│   ░░░░░░░   ZONE B                   │ ═════                     │
│   ░░░░░░    Main Hill    ♣  ♣        │                           │
│   ░░░░░     (Center-Left)  ●  ●  ●   │          ░░░░░░           │
│    ░░░░░      ●  ●  ♣  ●             │       ░░░░░░░░░░          │
│     ░░░░░       ●  ♣  ●  ○           │     ░░░░  ZONE F  ░░      │
│      ░░░░░░       ○  ○               │    ░░   Stone     ░░      │
│        ░░░░░░░                       │    ░  □ Platform  ░       │
│          ░░░░░░░░                    │     ░░  ≈≈≈≈≈   ░░        │
│    ZONE A    ░░░░░░░░                │      ░░ ≈≈≈≈≈ ░░          │
│  Sandy Path    ░░░░                  │       ░ ZONE E ░  Pond    │
│  (curves SW     ░░  ☆ Start          │        ░≈≈≈≈≈░            │
│   to SE)         ░░░░                │                           │
│                                                                  │
│                      ZONE J: Perimeter Grass (Elev: 0-3m)        │
└──────────────────────────────────────────────────────────────────┘
```

**Key differences from original:**
- **Asymmetric layout** — Main hill is center-left, not centered
- **Rocky cliff (Zone G)** on far west edge
- **Pond (Zone E)** in bottom-right corner with stone platform
- **Sandy path (Zone A)** curves from SW entrance around to SE
- **No symmetric foreground hill** — terrain flows organically

**Confidence: High**

---

## 4. Detailed Zone Analysis

### ZONE A — Sandy Path (Curved Approach)

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: -20 to +30, y: 0, z: +5 to +25 |
| **Dimensions** | Curved path ~80m long, 8-15m wide |
| **Elevation** | 0.0m (datum level) |
| **Surface** | Sandy / packed earth |
| **Color** | `#D4A84B` — warm golden sand |
| **Slope** | Mostly flat (0-5%) |
| **Features** | Mario spawn point at SW curve, curves from SW around to SE |
| **Adjacent zones** | Main hill (Zone B) to the north, Pond (Zone E) to the east |

**Top-down shape:** L-shaped or boomerang curve — enters from SW corner, wraps around the central hill, and extends to SE near the pond area.

**Key characteristics (from image):**
- NOT a centered plaza — the sandy path follows the terrain contours
- Wider sections at the SW entrance and near the pond
- Narrower where it passes between hills
- Mario start position (☆) is at the southwestern curve

---

### ZONE B — Main Hill (Center-Left)

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: -15, y: 0, z: -5 |
| **Base dimensions** | ~50m × 60m (elongated NW-SE) |
| **Peak elevation** | +8.0m above datum |
| **Surface** | Lush green grass with scattered trees |
| **Color** | `#4CAF50` — bright green |
| **Slope gradient** | West face: 20-30% / East face: 15-25% |
| **Shape (top-down)** | Irregular elongated mound — NOT circular |
| **Features** | Multiple trees (♣) scattered on slopes, wraps around west side of castle approach |

**Key characteristics (from image):**
- Hill is positioned CENTER-LEFT, not centered
- Sandy path wraps around its southern and eastern edges
- Trees are scattered across the green surface (visible as black dots in reference)
- Connects with the rocky cliff area to the far west
- North edge approaches the castle moat

---

### ZONE C — Castle Compound

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: 0, y: 0, z: -50 |
| **Footprint** | ~22m × 16m (main body) + turrets |
| **Elevation (ground)** | 0.0m |
| **Surface** | Stone masonry base, courtyard paving |
| **Plan shape** | Cruciform with 4 corner turrets |
| **Moat clearance** | Enclosed by moat on all sides |

**Castle footprint (top-down):**

```
           ┌──┐          ┌──┐
           │TL│          │TR│        TL/TR = Turret Left/Right (rear)
           └──┤          ├──┘
              │          │
              │  CASTLE  │
              │   MAIN   │
              │   BODY   │
              │ ┌──────┐ │
              │ │TOWER │ │           Central tower (5m dia.)
              │ └──────┘ │
              │          │
           ┌──┤          ├──┐
           │BL│          │BR│        BL/BR = Turret Left/Right (front)
           └──┘    ╔╗    └──┘
                   ║║                Entrance arch
                   ╚╝
                   ║║                Bridge
```

**Key dimensions (from PeachCastle.ts):**

| Component | Shape | Dimensions (game units) |
|-----------|-------|------------------------|
| Main body | Box | 22w × 11h × 16d |
| Central tower | Cylinder | radius 2.5, height 15 |
| Tower spire | Cone | radius 3, height 6 |
| Corner turrets (×4) | Cylinder | radius 1.75, height 13 |
| Turret roofs (×4) | Cone | radius 2.2, height 4 |
| Main roof | Cone (4-sided) | radius 15.56, height 6 |
| Courtyard | Cylinder | radius 14.5, height 0.5 |
| Moat (outer wall) | Cylinder | radius 19, height 5 |
| Moat (inner wall) | Cylinder | radius 15, height 5 |

**Turret positions (relative to castle center):**

| Turret | X | Z |
|--------|---|----|
| Front-Left | -11 | -8 |
| Front-Right | +11 | -8 |
| Rear-Left | -11 | +8 |
| Rear-Right | +11 | +8 |

---

### ZONE D — Bridge Approach

| Property | Value |
|----------|-------|
| **Position** | Spanning from foreground hill to castle entrance |
| **Length** | ~6-8m span over moat |
| **Width** | ~3.5m |
| **Elevation** | 0.0m (level crossing) |
| **Surface** | Timber deck planking |
| **Color** | `#8B6914` — medium brown wood |
| **Drop to water** | ~5m below deck level |
| **Features** | Timber railings both sides |

**Game coordinates (from PeachCastle.ts):**
```
Bridge deck: position (0, 0.15, -15.5), size 3.5w × 0.3h × 6d
Left railing: position (-1.5, 0.95, -15.5), size 0.15w × 1.3h × 6d
Right railing: position (1.5, 0.95, -15.5), size 0.15w × 1.3h × 6d
```

---

### ZONE E — Pond (Southeast Corner)

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: +25, y: -3, z: +15 |
| **Dimensions** | ~20m × 15m irregular shape |
| **Water surface elevation** | -3.0m below datum |
| **Water depth** | ~2-3m |
| **Water color** | `#2196F3` — medium blue |
| **Water opacity** | 70% transparent |
| **Shape (top-down)** | Irregular bean/kidney shape |
| **Features** | Stone platform (Zone F) on western shore |

**Top-down pond profile:**

```
             ≈≈≈≈≈≈≈≈
          ≈≈≈≈≈≈≈≈≈≈≈≈
        □□ ≈≈≈≈≈≈≈≈≈≈≈≈
        □□  ≈≈≈≈≈≈≈≈≈≈
             ≈≈≈≈≈≈≈
              ≈≈≈≈

        □ = Stone platform
        ≈ = Water
```

**Note:** This is a separate body of water from the castle moat. Located in the SE corner of the playable area.

---

### ZONE F — Stone Platform

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: +18, y: 0, z: +12 |
| **Dimensions** | ~8m × 6m |
| **Elevation** | 0.0m (ground level) |
| **Surface** | Grey stone / masonry |
| **Color** | `#9E9E9E` — medium grey |
| **Features** | Flat platform adjacent to pond, possible cannon location |

---

### ZONE G — Rocky Cliff (Far West)

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: -50 to -35, z: -50 to -20 |
| **Dimensions** | ~30m × 40m |
| **Peak elevation** | +15-25m |
| **Surface** | Brown/tan rocky cliff face |
| **Color** | `#8B7355` — brown rock / `#A0926D` — tan sandstone |
| **Slope gradient** | 60-90% (steep cliff face) |
| **Shape (top-down)** | Irregular rocky outcrop on far west edge |
| **Features** | Steep drop-off, non-climbable in most areas |

**Key characteristics (from image):**
- Visible at the far LEFT edge of the map as brown/tan rocky terrain
- NOT a gentle green hill — this is a cliff/mountain edge
- Marks the western boundary of the playable area
- Transition from green grass to brown rock

---

### ZONE H — Left Hill (Northwest)

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: -20, z: -35 |
| **Base dimensions** | ~40m × 35m |
| **Peak elevation** | +10m |
| **Surface** | Green grass with trees |
| **Color** | `#43A047` — medium green |
| **Slope gradient** | 20-35% |
| **Shape (top-down)** | Irregular rounded hill |
| **Features** | Trees scattered on slopes, borders the castle moat on south side |

**Tree positions on left hill (from image):**

| Tree | Approximate X | Approximate Z |
|------|---------------|---------------|
| 1 | -15 | -30 |
| 2 | -22 | -35 |
| 3 | -18 | -42 |
| 4 | -25 | -38 |

---

### ZONE I — Right Hill (Northeast)

| Property | Value |
|----------|-------|
| **Position (game coords)** | x: +25, z: -35 |
| **Base dimensions** | ~45m × 50m |
| **Peak elevation** | +12m |
| **Surface** | Green grass with trees |
| **Color** | `#4CAF50` — bright green |
| **Slope gradient** | 15-30% |
| **Shape (top-down)** | Large rounded hill extending from castle area to SE |
| **Features** | Trees scattered on slopes, extends toward the pond area |

**Tree positions on right hill (from image):**

| Tree | Approximate X | Approximate Z |
|------|---------------|---------------|
| 1 | 20 | -30 |
| 2 | 28 | -35 |
| 3 | 32 | -42 |
| 4 | 25 | -45 |
| 5 | 35 | -38 |

---

### ZONE J — Perimeter Grass Field

| Property | Value |
|----------|-------|
| **Position** | Entire ground plane |
| **Dimensions** | 200m × 200m |
| **Elevation** | -0.25m to 0.0m (effectively flat) |
| **Surface** | Short-mown grass |
| **Color** | `#4CAF50` — bright saturated green |
| **Sub-layer** | Dark earth base at y: -2.0 (`#5D4037`) |

---

## 5. Elevation Heatmap (Top-Down)

Viewed from directly above, color-coded by elevation:

```
ELEVATION KEY:
  ■ = +15m+  (cliff/mountain peak)
  ▓ = +10-15m (high hill)
  ▒ = +6-10m  (mid hill)
  ░ = +3-6m   (low hill)
  · = +0-3m   (ground level / sandy path)  
  ≈ = -3 to -5m (water - pond/moat)
  █ = castle structure

              N
              ↑

  ■  ·  ·  ░  ▒  ·  ·  ≈  ≈  █  █  █  █  █  █  █  █  █  █  ≈  ≈  ·  ▒  ▒  ·  ·  ·
  ·  ·  ·  ░  ▒  ·  ·  ≈  ≈  █  █  █  █  █  █  █  █  █  █  ·  ·  ·  ░  ▒  ·  ·  ·
  ·  ·  ·  ░  ▒  ·  ·  ≈  ≈  █  █  █  █  █  █  █  █  █  █  ≈  ≈  ·  ░  ·  ░  ·  ·
  ■  ·  ·  ░  ▒  ·  ·  ≈  ≈  █  █  █  █  █  █  █  █  █  █  ≈  ≈  ·  ▒  ▒  ·  ·  ·
  ·  ·  ·  ░  ▒  ·  ·  ≈  ≈  █  █  █  █  █  █  █  █  █  █  ≈  ≈  ·  ░  ▒  ·  ·  ·
  ·  ·  ·  ░  ▒  ·  ·  ≈  ≈  █  █  █  █  █  █  █  █  █  █  ≈  ≈  ·  ░  ·  ░  ·  ·
  ·  ·  ·  ░  ░  ·  ·  ≈  ≈  ≈  █  █  █  █  █  █  █  █  ≈  ≈  ≈  ·  ░  ░  ·  ·  ·
  ·  ·  ·  ░  ▒  ░  ·  ·  ≈  ≈  ≈  ≈  ≈  ═══  ≈  ≈  ≈  ≈  ≈  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ░  ▒  ▒  ░  ·  ·  ≈  ≈  ≈  ≈  ═══  ≈  ≈  ≈  ≈  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ░  ▒  ▒  ·  ░  ·  ·  ≈  ≈  ≈  ═══  ≈  ≈  ≈  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ░  ▒  ▒  ·  ▒  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ░  ▒  ·  ▒  ▒  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ░  ·  ▒  ▒  ·  ░  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ░  ░  ▒  ·  ░  ·  ·  ·  ·  ░  ░  ·  ░  ·  ·  ·  ·  ≈  ≈  ≈  ≈  ·  ·  ·  ·
  ·  ·  ·  ░  ░  ░  ·  ·  ·  ·  ░  ▒  ·  ░  ░  ·  ·  ·  ≈  ≈  ≈  ≈  ≈  ≈  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ░  ░  ·  ░  ░  ·  ·  ·  ≈  ≈  ≈  ≈  ≈  ≈  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ░  ·  ·  ·  ·  ·  □  ≈  ≈  ≈  ≈  ≈  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  □  □  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·

              ↓
              S

  ← W                                                      E →
  
  Legend: ■ Rocky cliff (west) | □ Stone platform | ≈ Water (pond/moat)
```

---

## 6. Cross-Section Profiles

### Profile A-A': South-North (Primary Approach Axis)

Through the center line (x = 0), from Mario's start to the castle.

```
Elevation (m)
   35 │                                              ▲ Tower peak (+34m)
      │                                              │
   30 │                                         ┌────┘ Spire
      │                                         │
   25 │                                    ┌────┘ Tower
      │                                    │
   20 │                                    │
      │                                    │
   15 │                               ┌────┘ Roof peak
      │                          ┌────┘
   10 │                     ┌────┘  Main body top
      │                     │
    8 │                     │
    6 │                     │
    4 │                     │
    2 │                     │
    0 │═══sandy path═══════╱═courtyard══bridge══
      │                          │      │
   -3 │                          │ MOAT │
   -5 │                          │ ≈≈≈≈ │ ← water
   -6 │                          └──────┘ ← bottom
      └──────────────────────────────────────────── Z (game coords)
      z=+22  z=+12   z=0  z=-12  z=-30  z=-50  z=-65
      (south)                                   (north)
```

**Note:** The approach path is NOT over a centered hill — it follows the sandy path around the main hill to the west.

### Profile B-B': West-East (Lateral Section at z = -30)

Through z = -30 (between main hill and castle).

```
Elevation (m)
   25 │▲                                                        
      │ ╲  Rocky                                                
   20 │  ╲  Cliff                                               
      │   ╲                                                     
   15 │    ╲                                                    
      │     ╲                                                   
   10 │      ╲    ▲ Main hill                     ▲ Right hill      
    8 │       ╲  ╱ ╲   peak                      ╱ ╲            
    6 │        ╲╱    ╲                         ╱    ╲           
    4 │        ╱      ╲                      ╱        ╲         
    2 │       ╱        ╲                   ╱            ╲       
    0 │══════╱══════════╲════════════════╱════════════════╲════
      │    sandy         sandy path                              
      └──────────────────────────────────────────────────────── X
     x=-60  x=-40  x=-20   x=0   x=+20  x=+40  x=+60
     (west)              (center)                 (east)
```

---

## 7. Game Object Placement Map

### Interactive Objects (Top-Down Positions)

```
                    N (-Z)
                     ↑

  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·CASTLE·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ·  · ¤P ·  ·  ·  ·  ·  ·  ·  ·  ·  ·     ¤P = floating platform
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·           (y=12, z=-12)
  ·  ·  ·  ·  ·  ¤P ·  ·  ·  ·  ·  ·  ¤P ·  ·  ·  ·  ·  ·  ·     ¤P = platforms
  ·  ·  ·  ·  ¤P ·  ·  ·  ·  ·  ·  ·  ·  ¤P ·  ·  ·  ·  ·  ·           (left & right)
  ·  ·  ·  ·  ·  ·  ·  ·  ○  ¢  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·
  ·  ·  ·  ·  ·  ·  ·  ¢  ·  ·  ·  ¢  ·  ·  ·  ·  ·  ·  ·  ·     ¢ = coin (ground ring)
  ·  ·  ·  G  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·     G = Goomba
  ·  ·  ·  ·  ·  ·  ¢  ·  ·  ·  ·  ·  ¢  ·  ·  ·  ·  ·  ·  ·
  ·  ·  G  ·  ·  ·  ·  ·  ·  G  ·  ·  ·  ·  ·  G  ·  ·  ·  ·     G = Goomba
  ·  ·  ·  ·  ·  ·  ¢  ·  ☆  ·  ·  ¢  ·  ·  ·  ·  ·  ·  ·  ·     ☆ = Mario start
  ·  ·  ◊  ·  ·  ·  ·  ¢  ·  ·  ¢  ·  ·  ·  ·  ·  ◊  ·  ·  ·     ◊ = Warp pipe
  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·

                     ↓
                    S (+Z)
```

### Object Inventory

| Object | Count | Positions (X, Z) |
|--------|-------|-------------------|
| Coins (ground ring) | 8 | Circle of r=8 centered on (0, 14) |
| Coins (platform) | 7 | On each floating platform |
| Coins (staircase) | 6 | Along stepping stones |
| Goombas | 4 | (5,5), (-5,5), (10,10), (-15,8) |
| Warp Pipes | 2 | (12,8), (-12,10) |
| Floating Platforms | 7 | Various heights, see World.ts |
| Stepping Stones | 6 | Staircase pattern, ascending east |

---

## 8. Surface Material Map (Top-Down)

```
MATERIAL KEY:
  G = Grass         (#4CAF50)   — bright green, flat ground
  g = Grass (med)   (#43A047)   — medium green, hills with trees  
  R = Rock          (#8B7355)   — brown rocky cliff (far west)
  S = Sand          (#D4A84B)   — sandy path (curved)
  W = Water         (#2196F3)   — moat and pond
  C = Courtyard     (#C8A44A)   — castle courtyard paving
  B = Brown earth   (#5D4037)   — base layer (below grass)
  T = Timber        (#8B6914)   — bridge deck
  K = Stone         (#D3CFC7)   — castle walls / stone platform
  P = Platform      (#9E9E9E)   — grey stone platform

              N (-Z)
              ↑

  R  B  B  g  g  B  B  W  W  K  K  K  K  K  K  K  K  K  K  W  W  S  g  g  B  B  B
  B  B  B  g  g  B  B  W  W  K  K  K  K  K  K  K  K  K  K  S  S  S  g  g  B  B  B
  B  B  B  g  g  S  S  W  W  K  K  K  K  K  K  K  K  K  K  W  W  S  g  B  g  B  B
  R  B  B  g  g  B  B  W  W  K  K  K  K  K  K  K  K  K  K  W  W  S  g  g  B  B  B
  B  B  B  g  g  B  B  W  W  K  K  K  K  K  K  K  K  K  K  W  W  S  g  g  B  B  B
  B  B  B  g  g  S  S  W  W  K  K  K  K  K  K  K  K  K  K  W  W  S  g  B  g  B  B
  B  B  B  g  g  B  S  W  W  W  K  K  K  K  K  K  K  K  W  W  W  S  g  g  B  B  B
  B  B  B  g  g  g  S  S  W  W  W  W  W  T  T  W  W  W  W  B  S  B  B  B  B  B  B
  B  B  B  g  g  g  g  S  S  W  W  W  W  T  T  W  W  W  S  S  S  S  S  S  B  B  B
  B  B  B  g  g  g  B  g  S  S  W  W  W  T  T  W  W  S  S  B  B  B  B  B  B  B  B
  B  B  g  g  g  B  g  g  B  S  S  S  S  S  S  S  S  S  S  B  B  B  B  B  B  B  B
  B  B  g  g  B  g  g  B  S  S  S  S  S  S  S  S  S  B  B  B  B  B  B  B  B  B  B
  B  B  g  B  g  g  B  g  S  S  B  B  S  S  S  S  B  B  B  B  B  B  B  B  B  B  B
  B  B  g  g  g  B  g  S  S  B  B  g  g  B  g  B  B  B  B  W  W  W  W  S  S  B  B
  B  B  B  g  g  g  B  S  S  B  g  g  B  g  g  B  B  B  W  W  W  W  W  W  S  B  B
  B  B  B  B  B  B  B  S  S  S  g  g  B  g  g  B  B  B  W  W  W  W  W  W  B  B  B
  B  B  B  B  B  B  B  B  S  S  S  g  B  S  S  B  B  P  W  W  W  W  W  S  S  B  B
  B  B  B  B  B  B  B  B  B  S  S  S  S  S  S  B  B  P  P  S  S  S  S  S  S  B  B
  B  B  B  B  B  B  B  B  B  S  S  S  S  S  B  B  B  B  S  S  S  S  S  S  B  B  B
  B  B  B  B  B  B  B  B  B  B  B  S  S  B  B  B  B  B  S  S  S  S  S  B  B  B  B
  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B  B

              ↓
              S (+Z)
              
  Legend: R=Rocky cliff | S=Sand path | g=Grass hills | W=Water | K=Castle | P=Platform | T=Bridge
```

---

## 9. Terrain Dimensions Summary Table

| Feature | Game X | Game Y | Game Z | Width | Height | Depth | Color |
|---------|--------|--------|--------|-------|--------|-------|-------|
| Ground (base) | 0 | -2.0 | 0 | 300 | 1 | 300 | `#5D4037` |
| Grass field | 0 | -0.25 | 0 | 200 | 0.5 | 200 | `#4CAF50` |
| Sandy path | -10 | -0.1 | +10 | 80 | 0.3 | curved | `#D4A84B` |
| Main hill (center-left) | -15 | 0→8 | -5 | 50×60 | 8.0 | 60 | `#4CAF50` |
| Left hill (NW) | -20 | 0→10 | -35 | 40×35 | 10.0 | 35 | `#43A047` |
| Right hill (NE) | +25 | 0→12 | -35 | 45×50 | 12.0 | 50 | `#4CAF50` |
| Rocky cliff (W) | -45 | 0→25 | -35 | 30×40 | 25.0 | 40 | `#8B7355` |
| Castle | 0 | 0→34 | -50 | 22 | 34 | 16 | `#D3CFC7` |
| Moat (water) | 0 | -5.0 | -50 | 38 dia. | — | 38 dia. | `#2196F3` |
| Courtyard | 0 | -0.25 | -50 | 29 dia. | 0.5 | 29 dia. | `#C8A44A` |
| Bridge | 0 | +0.15 | -34.5 | 3.5 | 0.3 | 6 | `#8B6914` |
| Pond (SE) | +25 | -3.0 | +15 | 20 | — | 15 | `#2196F3` |
| Stone platform | +18 | 0 | +12 | 8 | 0.5 | 6 | `#9E9E9E` |

---

## 10. Navigation & Pathfinding Map

Key traversal routes from the top-down perspective:

```
                    ┌──────────────┐
                    │   CASTLE     │
                    │  (interior)  │
                    └──────┬───────┘
                           │ Entrance arch
   ROCKY CLIFF        ═══bridge═══
        ▲                  │
        │            ≈≈≈≈moat≈≈≈≈
        │                  │
   ┌────┴────┐        ┌────┴────┐
   │ Left    │        │ Right   │
   │ Hill    │        │ Hill    │
   │ (NW)    │        │ (NE)    │
   └────┬────┘        └────┬────┘
        │                  │
        │   Main Hill      │
        │  ┌──────────┐    │
        └──┤(center-L)├────┘
           └────┬─────┘
                │
     ╔══════════╧══════════════════╗
     ║      Sandy Path              ║
     ║   (curves SW → SE)           ║
     ╠══════════════════════════════╣
     ║        ☆ START              ║
     ╚══════════════════════════════╝
                    │
              ┌─────┴─────┐
              │  Pond &   │
              │ Platform  │
              │   (SE)    │
              └───────────┘
```

### Traversal Routes

| Route | From → To | Distance | Elevation Change | Difficulty |
|-------|-----------|----------|------------------|------------|
| Main approach | Sandy path → Castle | ~70m | 0 → 0m (around hill) | Easy |
| Left exploration | Path → Left hill | ~35m | 0 → +10m | Medium |
| Right exploration | Path → Right hill | ~40m | 0 → +12m | Medium |
| Pond area | Path → Stone platform | ~25m | 0 → 0m | Easy |
| Cliff approach | Path → Rocky cliff | ~30m | 0 → +15m | Hard |
---

## 11. Confidence & Limitations

| Section | Confidence | Notes |
|---------|------------|-------|
| Zone layout & positions | **High** | Updated based on reference image analysis |
| Castle footprint & moat | **High** | Verified against PeachCastle.ts and image |
| Rocky cliff position | **High** | Clearly visible on far left of reference image |
| Pond & platform (SE) | **High** | Distinctly visible in bottom-right of image |
| Sandy path curve | **High** | Prominent curved path visible in image |
| Hill shapes & positions | **High** | Hills visible with tree placement (black dots) |
| Surface materials & colors | **Medium** | Inferred from image colors |
| Object placement | **Medium** | Some objects inferred, need verification |
| Overall proportions in ASCII | **Medium** | ASCII art is approximate; character spacing limits precision |
| Exact game coordinates | **Medium** | May need adjustment when implementing |

**Limitations:**
- Analysis based primarily on top-down reference image (`Castle_Grounds.png`)
- ASCII art resolution is limited to ~4m per character
- Some terrain details may differ from original SM64 implementation
- Interior castle layout is not covered (not visible from top-down)
- Tree positions are approximate based on black dots in reference

**Key corrections from previous version:**
1. **Layout is asymmetric** — not a symmetric centered design
2. **Rocky cliff** on far west edge (brown/tan), not background mountains
3. **Pond** in southeast corner with adjacent stone platform
4. **Sandy path** curves from SW to SE, not a centered plaza
5. **Main hill** is positioned center-left, not centered
6. **No symmetric foreground hill** blocking direct castle approach

---

*Report prepared as a companion to [peach-castle.md](peach-castle.md) for 3D terrain reconstruction. Updated based on analysis of reference image `Castle_Grounds.png`. Game coordinates in [World.ts](../src/game/World.ts) and [PeachCastle.ts](../src/game/objects/PeachCastle.ts) may need updating to match this terrain layout.*
