---
name: story-node-authoring
description: "Create and validate StoryNodes for the waste-policy simulation, enforcing schema-valid node structure and balanced MetricModifiers trade-offs across Treasury, EcoHealth, PublicSentiment, InfrastructureLoad, and SocialEquity."
---

# Story Node Authoring

Use this skill when creating or editing story dilemmas, outcomes, or StoryNodes seed data.

## Inputs To Collect First

- Current node id and story branch context
- Intended scenario summary and real-world context citation/source note
- Number of choices to generate (default 2-4)
- Desired difficulty/intensity (mild, medium, severe)

## Required StoryNode Contract

For every generated node, enforce this shape:

```json
{
  "NodeID": "STRING",
  "Title": "STRING",
  "Context": "STRING",
  "Choices": [
    {
      "ChoiceText": "STRING",
      "NextNodeID": "STRING",
      "MetricModifiers": {
        "Treasury": 0,
        "EcoHealth": 0,
        "PublicSentiment": 0,
        "InfrastructureLoad": 0,
        "SocialEquity": 0
      },
      "MapUpdates": {
        "targetBuilding": "STRING",
        "newAssetId": "STRING"
      }
    }
  ]
}
```

Notes:

- Keep metric keys consistent with project canonical naming.
- Keep map update keys data-driven; do not hardcode filenames in UI logic.

## Balancing Rules For MetricModifiers

For each choice in a node:

- Include at least one positive and one negative metric delta.
- Avoid all-positive or all-negative choices unless the node is explicitly terminal.
- Keep modifier magnitudes within a sensible per-turn range (default -25 to +25).
- When a choice impacts taxes, fees, or service availability, include a non-zero SocialEquity modifier.
- Prefer InfrastructureLoad changes when waste-routing policy changes are proposed.

For the full set of choices in a node:

- Ensure no single metric dominates every option in the same direction.
- Keep one option as a fiscally conservative path and one as an eco-priority path when possible.
- Preserve narrative plausibility between ChoiceText, MetricModifiers, and MapUpdates.

## Validation Checklist

Before finalizing generated nodes, check:

- NodeID and NextNodeID strings are non-empty and branch-consistent.
- Every choice includes all five metric keys.
- No metric delta exceeds configured limits.
- SocialEquity is explicitly handled for equity-sensitive policies.
- MapUpdates references a valid asset id pattern (example: landfill_overflow_v2).
- At least one choice presents a meaningful trade-off.

## Output Format

Return:

1. StoryNode JSON (or JSON array)
2. A short validation report listing pass/fail for each checklist item
3. If any rule fails, provide corrected JSON immediately after the report

## Repository Links

Project-wide simulation constraints live in [AGENTS.md](../../../AGENTS.md).
Frontend display and asset usage constraints are in [.github/instructions/frontend-isometric-game.instructions.md](../../instructions/frontend-isometric-game.instructions.md).
Backend schema and simulation constraints are in [.github/instructions/backend-serverless-sim.instructions.md](../../instructions/backend-serverless-sim.instructions.md).
