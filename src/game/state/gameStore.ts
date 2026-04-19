import { create } from "zustand";
import { createDefaultMetrics, type Metrics } from "../simulation/metrics";
import {
  resolveChoiceOutcome,
  type EndStateReasonCode,
  type UserGameState,
} from "../simulation/processChoice";
import type { CatastropheKind } from "../simulation/catastrophe";
import {
  getWasteVilleStoryNode,
  WASTEVILLE_STORY_NODES,
} from "../simulation/storyNodes.wasteVille";
import type { StoryNode } from "../simulation/storyNode";

export type GameStatus = "idle" | "playing" | "ended";

export type MapStateEntry = {
  targetBuilding: string;
  assetId: string;
  updatedAtNodeId: string;
};

export type PaytTurnAdjustment = {
  socialEquityDelta: number;
  rationale: string[];
};

export type GameStore = {
  sessionId: string;
  currentNodeId: string;
  currentDay: number;
  dayQueueNodeIds: string[];
  dayCompletedNodeIds: string[];
  metrics: Metrics;
  status: GameStatus;
  endStateReason: EndStateReasonCode;
  lastCatastrophe: CatastropheKind | null;
  lastPaytSocialEquityDelta: number | null;
  lastPaytRationale: string[];
  lastPaytResolvedNodeId: string | null;
  mapState: Record<string, MapStateEntry>;
  history: Array<{ nodeId: string; choiceIndex: number }>;

  startNewGame: () => void;
  makeChoice: (
    choiceIndex: number,
    randomSeed?: () => number,
    paytAdjustment?: PaytTurnAdjustment,
  ) => void;
  getCurrentNode: () => StoryNode | undefined;
  hydrateFrom: (state: UserGameState) => void;
};

function makeSessionId(): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `sess_${stamp}_${rand}`;
}

export const useGameStore = create<GameStore>((set, get) => ({
  sessionId: makeSessionId(),
  currentNodeId: "ROOT_001",
  currentDay: 1,
  dayQueueNodeIds: ["ROOT_001"],
  dayCompletedNodeIds: [],
  metrics: createDefaultMetrics(),
  status: "idle",
  endStateReason: "NONE",
  lastCatastrophe: null,
  lastPaytSocialEquityDelta: null,
  lastPaytRationale: [],
  lastPaytResolvedNodeId: null,
  mapState: {},
  history: [],

  startNewGame: () => {
    set({
      sessionId: makeSessionId(),
      currentNodeId: "ROOT_001",
      currentDay: 1,
      dayQueueNodeIds: ["ROOT_001"],
      dayCompletedNodeIds: [],
      metrics: createDefaultMetrics(),
      status: "playing",
      endStateReason: "NONE",
      lastCatastrophe: null,
      lastPaytSocialEquityDelta: null,
      lastPaytRationale: [],
      lastPaytResolvedNodeId: null,
      mapState: {},
      history: [],
    });
  },

  makeChoice: (choiceIndex, randomSeed, paytAdjustment) => {
    const {
      currentNodeId,
      currentDay,
      dayQueueNodeIds,
      dayCompletedNodeIds,
      metrics,
      sessionId,
      mapState,
      history,
    } = get();
    const node = getWasteVilleStoryNode(currentNodeId);
    if (!node) return;
    const choice = node.Choices[choiceIndex];
    if (!choice) return;

    const effectiveChoice =
      paytAdjustment && currentNodeId === "POLICY_PAYT_02"
        ? {
            ...choice,
            MetricModifiers: {
              ...choice.MetricModifiers,
              SocialEquity:
                choice.MetricModifiers.SocialEquity +
                paytAdjustment.socialEquityDelta,
            },
          }
        : choice;

    const result = resolveChoiceOutcome(
      {
        SessionID: sessionId,
        CurrentNodeID: currentNodeId,
        Metrics: metrics,
        MapState: mapState,
      },
      node,
      effectiveChoice,
      randomSeed ? { random: randomSeed } : {},
    );

    const nextMapState: Record<string, MapStateEntry> = { ...mapState };
    if (choice.MapUpdates) {
      nextMapState[choice.MapUpdates.targetBuilding] = {
        targetBuilding: choice.MapUpdates.targetBuilding,
        assetId: choice.MapUpdates.newAssetId,
        updatedAtNodeId: result.nextNodeId,
      };
    }

    const nextNode = getWasteVilleStoryNode(result.nextNodeId);
    const terminal = !nextNode || nextNode.Choices.length === 0;

    const completedForDay = [...dayCompletedNodeIds, currentNodeId];
    let nextDay = currentDay;
    let nextQueue = dayQueueNodeIds.slice(1);
    let nextCompleted = completedForDay;

    if (nextNode) {
      if (nextNode.Day === currentDay) {
        // Same-day follow-up dossier: keep the day queue alive and place the
        // newly-resolved next action at the front so it appears immediately.
        nextQueue = [nextNode.NodeID, ...nextQueue];
      } else {
        // Entering a new day starts a fresh concrete queue for that day.
        nextDay = nextNode.Day;
        nextQueue = [nextNode.NodeID];
        nextCompleted = [];
      }
    }

    set({
      currentNodeId: result.nextNodeId,
      currentDay: nextDay,
      dayQueueNodeIds: nextQueue,
      dayCompletedNodeIds: nextCompleted,
      metrics: result.metrics,
      mapState: nextMapState,
      history: [...history, { nodeId: currentNodeId, choiceIndex }],
      status: terminal ? "ended" : "playing",
      endStateReason: result.endStateReasonCode ?? "NONE",
      lastCatastrophe: result.catastrophe ?? null,
      lastPaytSocialEquityDelta:
        paytAdjustment && currentNodeId === "POLICY_PAYT_02"
          ? paytAdjustment.socialEquityDelta
          : null,
      lastPaytRationale:
        paytAdjustment && currentNodeId === "POLICY_PAYT_02"
          ? paytAdjustment.rationale
          : [],
      lastPaytResolvedNodeId:
        paytAdjustment && currentNodeId === "POLICY_PAYT_02"
          ? result.nextNodeId
          : null,
    });
  },

  getCurrentNode: () => getWasteVilleStoryNode(get().currentNodeId),

  hydrateFrom: (state) => {
    const node = getWasteVilleStoryNode(state.CurrentNodeID);
    set({
      sessionId: state.SessionID,
      currentNodeId: state.CurrentNodeID,
      currentDay: node?.Day ?? 1,
      dayQueueNodeIds: [state.CurrentNodeID],
      dayCompletedNodeIds: [],
      metrics: state.Metrics,
      mapState: (state.MapState as Record<string, MapStateEntry>) ?? {},
    });
  },
}));

export const ALL_STORY_NODES = WASTEVILLE_STORY_NODES;
