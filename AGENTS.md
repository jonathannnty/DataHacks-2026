# DataHacks 2026 Agent Guide

This repository hosts a city-scale waste-management simulation game with a 2D isometric map and an educational endgame flow.

## Primary Product Goals

- Simulate trade-offs in municipal waste policy using five balanced metrics.
- Present decisions as a choose-your-own-adventure story graph.
- Teach real-world waste management outcomes through an Action Center after game completion.
- Support global aggregate stats across all players.

## Core Simulation Contract

Always model and persist these five metrics together:

- Treasury: City budget health.
- EcoHealth: Pollution, air/water quality, and ecosystem status.
- PublicSentiment: Citizen happiness and trust.
- InfrastructureLoad: Capacity pressure on landfill/recycling/compost systems.
- SocialEquity: Distribution of policy burden across income groups.

Rules for all game logic changes:

- Use normalized metric values from 0 to 100 unless a file explicitly defines a different range.
- Clamp every metric update to valid bounds before writing state.
- Choice outcomes must include at least one trade-off; avoid all-positive outcomes.
- Equity-sensitive decisions (for example flat taxes) must adjust SocialEquity explicitly.

## Frontend Architecture Baseline

Default frontend stack for new code: React + TypeScript (Vite). If Vue is later selected, keep component boundaries and gameplay contracts equivalent.

Required gameplay hierarchy:

- App (router/root shell)
- GameScreen (main loop)
- HeadsUpDisplay (five metric bars)
- IsometricMap (town scene container)
- GridMap (2D matrix with isometric transform)
- Tile
- Building
- CitizenBlob
- StoryConsole (scenario context and actions)
- GlobalImpactDashboard (aggregate multiplayer metrics)
- ActionCenter (real-world education and checklist)

Isometric rendering rules:

- Base tile size must stay uniform (recommended 128x64).
- GridMap perspective uses CSS transforms equivalent to rotateX(60deg) rotateZ(-45deg).
- Buildings are layered on top of tiles and anchored consistently to tile center.
- CitizenBlob elements use absolute positioning and path-based movement along roads.

## Asset Pipeline Rules

- Use PNG with transparent background for map/building/blob assets.
- Keep consistent naming with stable ids (examples: landfill_empty_v1, landfill_overflow_v2).
- Provide 2-3 visual states for upgrade/degrade progression where requested.
- Treat UI bubble symbols as data-driven icon ids, not hardcoded text in logic.

Required asset groups:

- Terrain: clean_grass, polluted_grass, clean_water, toxic_water, paved_road, littered_road
- Buildings: city_hall variants, landfill variants, recycling_center variants, residential variants
- Citizens/UI: blob base plus sentiment/complaint/health bubble variants

## Backend and Infra Baseline

Use serverless architecture by default:

- S3 + CloudFront for static frontend hosting
- API Gateway for HTTP endpoints
- Lambda for turn resolution and metric/map updates
- DynamoDB for story, session, and global aggregate state

Required DynamoDB tables:

1. StoryNodes

- NodeID (PK, string)
- Title (string)
- Context (string)
- Choices (list of objects with ChoiceText, NextNodeID, MetricModifiers, MapUpdates)

2. UserGames

- SessionID (PK, string)
- CurrentNodeID (string)
- Metrics (map)
- MapState (map)

3. GlobalAggregates

- PartitionKey (PK, string; fixed value GLOBAL_STATS)
- TotalGamesPlayed (number)
- TimesBankrupted (number)
- TimesEcoDisaster (number)
- AverageCitizenSentiment (number)

## Endgame Education Requirement

Every terminal game state (win, bankruptcy, eco-collapse) must transition to ActionCenter with:

- A short explanation of why the city ended in that state
- Real-world guidance tied to that failure mode
- A practical checklist of individual/community actions

## Engineering Conventions for Agents

- Keep gameplay calculation logic deterministic and testable in pure functions.
- Separate render state from simulation state.
- Never embed large story graphs in UI components; load from data source.
- Add unit tests for metric update logic and state transitions.
- Add integration tests for choice selection and endgame transition behavior.

## Suggested Initial Paths

- src/game/simulation for metric and event logic
- src/features/map for GridMap, Tile, Building, CitizenBlob
- src/features/story for StoryConsole and node traversal
- src/features/action-center for educational transition and content mapping
- infra for CDK/Serverless definitions and deployment config
- assets/isometric for tile/building/blob png files
