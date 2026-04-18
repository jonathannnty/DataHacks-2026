---
mode: "agent"
description: "Scaffold a full vertical slice for a new policy scenario: StoryNode content, frontend gameplay UI wiring, backend API/Lambda turn resolution, DynamoDB integration updates, and tests."
---

# Scaffold Game Feature

Create a production-ready vertical slice for one new waste-policy scenario.

## Parameters

- ScenarioName: short slug (example: payt-tax-expansion)
- ScenarioSummary: one paragraph describing the dilemma
- EntryNodeID: starting StoryNodes id for this feature
- FrontendStack: react-ts (default) or vue
- BackendRuntime: node (default) or python
- StoryBranchSize: number of nodes to scaffold (default 3)

## Required Deliverables

1. Story data

- Add StoryNodes entries with schema-valid choices and balanced MetricModifiers.
- Ensure at least one explicit SocialEquity trade-off across the branch.

2. Frontend integration

- Wire StoryConsole actions to scenario nodes.
- Ensure HeadsUpDisplay updates all five metrics.
- Add/adjust map visual updates via asset ids, not hardcoded file paths.
- Preserve this component tree when scaffolding the UI slice:
  - App (Main Router)
  - GameScreen (Main gameplay loop)
  - HeadsUpDisplay (HUD: renders the 5 metric progress bars)
  - IsometricMap (container for the town)
  - GridMap (2D array with CSS transforms rotateX(60deg) rotateZ(-45deg))
  - Tile (individual grid squares like grass, road, water)
  - Building (structures placed on top of tiles)
  - CitizenBlob (absolute-positioned animated divs that roam the paths)
  - StoryConsole (choose-your-own-adventure panel with scenario context and action buttons)
  - GlobalImpactDashboard (aggregate data of all players)
  - ActionCenter (educational page with real-world waste management facts and individual actions)

3. Backend integration

- Add API route and Lambda/service logic for applying choice outcomes.
- Persist UserGames state (CurrentNodeID, Metrics, MapState).
- Update GlobalAggregates for terminal outcomes when applicable.

4. Tests

- Unit tests for metric update/clamping and branch traversal.
- Integration test for choice selection request/response.
- Frontend test for StoryConsole choice click updating HUD and node progression.

## Workflow

1. Discover existing project structure and coding patterns.
2. Propose exact files to create/update before editing.
3. Implement minimal, complete changes for the slice.
4. Run available tests/lint for affected areas.
5. Summarize changed files, test results, and follow-up items.

## Constraints

- Respect architecture rules in [AGENTS.md](../../AGENTS.md).
- Respect frontend instructions in [.github/instructions/frontend-isometric-game.instructions.md](../instructions/frontend-isometric-game.instructions.md).
- Respect backend instructions in [.github/instructions/backend-serverless-sim.instructions.md](../instructions/backend-serverless-sim.instructions.md).
- Keep simulation logic deterministic and clamped.
- Preserve trade-offs; do not create all-positive outcome branches.

## Response Format

Return in this order:

1. Planned file changes
2. Implemented edits with rationale
3. Test commands run and outcomes
4. Residual risks or TODOs
