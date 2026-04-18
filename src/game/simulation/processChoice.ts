import {
  applyMetricModifiers,
  clampMetricValue,
  type Metrics,
} from "./metrics";
import type { StoryChoice, StoryNode } from "./storyNode";
import {
  rollCatastrophe,
  type CatastropheKind,
} from "./catastrophe";

export type UserGameState = {
  SessionID: string;
  CurrentNodeID: string;
  Metrics: Metrics;
  MapState: Record<string, unknown>;
};

export type EndStateReasonCode =
  | "NONE"
  | "PROTEST"
  | "STABILIZED"
  | "FAILED"
  | "CATASTROPHE";

export type ProcessChoiceResult = {
  nextNodeId: string;
  metrics: Metrics;
  state: UserGameState;
  endStateReasonCode?: EndStateReasonCode;
  catastrophe?: CatastropheKind;
};

const CRISIS_EQUITY_THRESHOLD = 30;
const CRISIS_SENTIMENT_THRESHOLD = 30;

// These node IDs do not roll catastrophes (prevents infinite catastrophe
// loops and lets terminal/gate nodes resolve cleanly).
const CATASTROPHE_EXEMPT_NODE_IDS = new Set<string>([
  "LANDFILL_FIRE",
  "MARKET_CRASH",
  "CRISIS_GATE_01",
  "CRISIS_PROTEST_01",
  "PHASE1_STABILIZE_01",
  "PHASE1_FAILURE_01",
]);

export function resolveBranchNextNodeId(
  currentNodeId: string,
  metrics: Metrics,
): string | undefined {
  if (currentNodeId === "CRISIS_GATE_01") {
    if (
      metrics.SocialEquity < CRISIS_EQUITY_THRESHOLD ||
      metrics.PublicSentiment < CRISIS_SENTIMENT_THRESHOLD
    ) {
      return "CRISIS_PROTEST_01";
    }

    return "PHASE1_STABILIZE_01";
  }

  return undefined;
}

export type ResolveChoiceOptions = {
  random?: () => number;
};

export function resolveChoiceOutcome(
  currentState: UserGameState,
  currentNode: StoryNode,
  choice: StoryChoice,
  options: ResolveChoiceOptions = {},
): ProcessChoiceResult {
  const nextMetrics = applyMetricModifiers(
    currentState.Metrics,
    choice.MetricModifiers,
  );

  const branchOverride = resolveBranchNextNodeId(
    currentNode.NodeID,
    nextMetrics,
  );
  let routedNextNodeId = branchOverride ?? choice.NextNodeID;

  let catastrophe: CatastropheKind | null = null;
  if (!CATASTROPHE_EXEMPT_NODE_IDS.has(routedNextNodeId)) {
    catastrophe = rollCatastrophe({
      metrics: nextMetrics,
      random: options.random,
    });
    if (catastrophe) {
      routedNextNodeId = catastrophe;
    }
  }

  const endStateReasonCode: EndStateReasonCode = catastrophe
    ? "CATASTROPHE"
    : routedNextNodeId === "CRISIS_PROTEST_01"
      ? "PROTEST"
      : routedNextNodeId === "PHASE1_STABILIZE_01"
        ? "STABILIZED"
        : routedNextNodeId === "PHASE1_FAILURE_01"
          ? "FAILED"
          : "NONE";

  const normalizedState: UserGameState = {
    ...currentState,
    CurrentNodeID: routedNextNodeId,
    Metrics: {
      Treasury: clampMetricValue(nextMetrics.Treasury),
      EcoHealth: clampMetricValue(nextMetrics.EcoHealth),
      PublicSentiment: clampMetricValue(nextMetrics.PublicSentiment),
      InfrastructureLoad: clampMetricValue(nextMetrics.InfrastructureLoad),
      SocialEquity: clampMetricValue(nextMetrics.SocialEquity),
    },
  };

  return {
    nextNodeId: routedNextNodeId,
    metrics: normalizedState.Metrics,
    state: normalizedState,
    endStateReasonCode,
    catastrophe: catastrophe ?? undefined,
  };
}
