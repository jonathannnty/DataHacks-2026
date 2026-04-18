---
applyTo: "src/**/*.{ts,tsx,js,jsx,vue,css,scss},assets/**/*,public/assets/**/*"
description: "Use when implementing the isometric UI, gameplay screens, HUD metrics, map rendering, and visual asset integration for the waste-management simulation."
---

# Frontend Isometric Game Instructions

## Scope

Apply this instruction when editing gameplay UI, map rendering, animation, or asset loading.

## Required Gameplay Surface

Maintain this component contract:

- App
- GameScreen
- HeadsUpDisplay
- IsometricMap
- GridMap
- Tile
- Building
- CitizenBlob
- StoryConsole
- GlobalImpactDashboard
- ActionCenter

Keep names aligned unless a migration updates all imports and tests.

## HUD and Metrics

- Always render exactly five primary metrics: Treasury, EcoHealth, PublicSentiment, InfrastructureLoad, SocialEquity.
- Use a shared metric schema/type for labels, colors, min/max bounds, and tooltip text.
- Keep metric updates animated but brief; avoid long blocking transitions.

## Isometric Rendering

- Use a consistent base tile footprint (recommended 128x64) across all terrain tiles.
- Keep GridMap perspective with CSS transforms equivalent to rotateX(60deg) rotateZ(-45deg).
- Preserve deterministic layering order: terrain, roads/water overlays, buildings, citizens, UI effects.
- Ensure responsive behavior for desktop and mobile; never rely on fixed viewport-only layouts.

## Asset Usage Rules

- Prefer transparent PNG files for terrain/buildings/blob sprites.
- Bind visuals through asset ids from data/state; avoid hardcoded file paths inside component logic.
- Support building state variants for upgrade/degrade progression.

## Story and Endgame UX

- StoryConsole must display current scenario, real-world context, and action choices.
- Endgame state must transition to ActionCenter and explain the failure/success cause.
- ActionCenter should present practical real-world steps (for example composting guidance, civic participation, recycling corrections).

## Code Quality

- Keep simulation math outside components.
- Use pure selectors/helpers for map projections and sprite placement.
- Add component tests for HUD rendering, choice interactions, and endgame transitions.
