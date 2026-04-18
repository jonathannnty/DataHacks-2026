---
applyTo: "infra/**/*,backend/**/*,api/**/*,lambda/**/*,{serverless.yml,cdk.json,template.yaml}"
description: "Use when implementing serverless AWS infrastructure, API handlers, game-turn simulation logic, and DynamoDB data access for the waste-policy simulation."
---

# Backend Serverless Simulation Instructions

## Architecture Defaults

Use a serverless AWS pattern unless a design note states otherwise:

- S3 + CloudFront for static client hosting
- API Gateway for frontend HTTP access
- Lambda for stateless turn processing and state mutation
- DynamoDB for story nodes, user game state, and global aggregates

## Data Model Requirements

### StoryNodes

- PK: NodeID (string)
- Fields: Title, Context, Choices
- Choice object must include: ChoiceText, NextNodeID, MetricModifiers, MapUpdates

### UserGames

- PK: SessionID (string)
- Fields: CurrentNodeID, Metrics, MapState
- Metrics map must include all five core metrics at all times.

### GlobalAggregates

- PK: PartitionKey (string, fixed GLOBAL_STATS)
- Fields: TotalGamesPlayed, TimesBankrupted, TimesEcoDisaster, AverageCitizenSentiment

## Simulation Rules

- Treat turn resolution as deterministic for a given input state and choice.
- Clamp metric values to valid range before persistence.
- Include SocialEquity impact in policy choices that change taxes/fees/service access.
- Record terminal outcomes (bankruptcy, eco-disaster, success) for aggregate updates.

## API Behavior

- Validate request payloads strictly and return typed error codes/messages.
- Keep story-node traversal and metric updates in dedicated service modules.
- Avoid embedding static story data in handlers; read from StoryNodes source.

## Action Center Integration

On terminal game state responses, include:

- endState reason code
- user-facing summary cause
- recommended education topic keys for ActionCenter content

## Reliability and Cost

- Use idempotent write patterns for retry-safe Lambda execution.
- Prefer single-table reads/writes per turn where possible.
- Keep payloads compact; do not send entire unused map/story blobs to clients.

## Testing Expectations

- Unit tests for metric update functions and outcome classification.
- Contract tests for API request/response schemas.
- Data-access tests for DynamoDB key usage and conditional writes.
