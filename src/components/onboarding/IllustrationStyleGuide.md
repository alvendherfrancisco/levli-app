# Levli Onboarding Illustration Style Guide

## Canvas
- **ViewBox:** 280×200
- **Max width:** 280px (responsive, scales down on narrow screens)
- **Aspect ratio:** 7:5
- **Background glow:** 176×176 blurred circle, `linear-gradient(135deg, #818CF8, #5EEAD4)`, 50% opacity

## Color Palette

### Primary Gradient (indigo → teal)
Used for the mascot, main shapes, and card headers.
| Stop | Color  | Hex       |
|------|--------|-----------|
| 0%   | Indigo | `#6366F1` |
| 100% | Teal   | `#14B8A6` |

### Accent Gradient (orange → coral)
Used for secondary shapes, badges, and highlights.
| Stop | Color  | Hex       |
|------|--------|-----------|
| 0%   | Orange | `#F97316` |
| 100% | Coral  | `#EC4899` |

### Sparkle Colors
| Color  | Hex       | Position    | Delay |
|--------|-----------|-------------|-------|
| Amber  | `#F59E0B` | Top-left    | 0s    |
| Indigo | `#6366F1` | Top-right   | 1s    |
| Teal   | `#14B8A6` | Bottom-left | 0.5s  |

### Neutral Colors
| Element       | Color      | Hex       |
|---------------|------------|-----------|
| Card border   | Light gray | `#E5E7EB` |
| Card fill     | White      | `#FFFFFF` |
| Inactive dots | Light gray | `#E5E7EB` |
| Ring/line     | Medium gray| `#9CA3AF` |

## Line Weight
| Element                          | Weight |
|----------------------------------|--------|
| Feature lines (heartbeat, check) | 2.5px  |
| Card borders                     | 1.5px  |
| Mascot face (full-size)          | 3px    |
| Mascot face (cameo)              | Scaled by radius |
| Detail lines (syringe marks)      | 1px    |

## Corner Radius
| Element                          | Radius     |
|----------------------------------|------------|
| Cards (calendar, ID, envelope)   | 12–16px    |
| Small elements (syringe body)    | 4px        |
| Chips (tracking circles)        | 50% (circle) |

## Shadow / Depth
- **Background glow:** Blurred gradient blob behind each scene
- **Inner highlight:** White at 15% opacity on the left side of gradient-filled shapes
- **No drop shadows** — depth comes from the gradient and glow

## Sparkle Pattern
3 fixed sparkles at consistent positions in every illustration:
1. **Top-left:** Amber `#F59E0B` 4-point star, ~10px, no delay
2. **Top-right:** Indigo `#6366F1` 4-point star, ~8px, 1s delay
3. **Bottom-left:** Teal `#14B8A6` 4-point star, ~8px, 0.5s delay

Exception: Completion illustration uses additional confetti (circles + stars) for celebration.

## Mascot Cameo
The droplet mascot appears as a small guide character in every mid-step illustration:
- **Size:** r ≈ 10–12px (≈ 30px tall)
- **Gradient:** Same indigo→teal as the full-size mascot
- **Face:** Two white dot eyes + white curve smile
- **Highlight:** White at 15% opacity on the left side
- **Placement:** Next to or peeking from behind the main object, face always visible

### Placement per step
| Step | Illustration | Mascot position |
|------|--------------|-----------------|
| 1 (Empathy)    | Calendar      | Peeking from behind bottom-right |
| 2 (Medication) | Pills         | Watching from the right          |
| 3 (SignUp)     | ID card       | Peeking from behind top-right   |
| 3 (VerifyEmail)| Envelope      | Watching from the right          |
| 4 (Privacy)    | Shield        | Peeking from behind bottom-left |
| 5 (Schedule)   | Syringe+dots  | Watching from the right          |
| 6 (Tracking)   | Central       | Mascot is the center of composition |

## Reusable Components
- `Scene` — Canvas wrapper with background glow
- `Sparkles` — Standard 3-sparkle pattern
- `MascotCameo` — Small droplet mascot at `(cx, cy, r)