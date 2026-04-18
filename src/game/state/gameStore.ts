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

export type GameStore = {
  sessionId: string;
  currentNodeId: string;
  metrics: Metrics;
  status: GameStatus;
  endStateReason: EndStateReasonCode;
  lastCatastrophe: CatastropheKind | null;
  mapState: Record<string, MapStateEntry>;
  history: Array<{ nodeId: string; choiceIndex: number }>;

  startNewGame: () => void;
  makeChoice: (choiceIndex: number, randomSeed?: () => number) => void;
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
  metrics: createDefaultMetrics(),
  status: "idle",
  endStateReason: "NONE",
  lastCatastrophe: null,
  mapState: {},
  history: [],

  startNewGame: () => {
    set({
      sessionId: makeSessionId(),
      currentNodeId: "ROOT_001",
      metrics: createDefaultMetrics(),
      status: "playing",
      endStateReason: "NONE",
      lastCatastrophe: null,
      mapState: {},
      history: [],
    });
  },

  makeChoice: (choiceIndex, randomSeed) => {
    const {
      currentNodeId,
      metrics,
      sessionId,
      mapState,
      history,
    } = get();
    const node = getWasteVilleStoryNode(currentNodeId);
    if (!node) return;
    const choice = node.Choices[choiceIndex];
    if (!choice) return;

    const result = resolveChoiceOutcome(
      {
        SessionID: sessionId,
        CurrentNodeID: currentNodeId,
        Metrics: metrics,
        MapState: mapState,
      },
      node,
      choice,
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

    set({
      currentNodeId: result.nextNodeId,
      metrics: result.metrics,
      mapState: nextMapState,
      history: [...history, { nodeId: currentNodeId, choiceIndex }],
      status: terminal ? "ended" : "playing",
      endStateReason: result.endStateReasonCode ?? "NONE",
      lastCatastrophe: result.catastrophe ?? null,
    });
  },

  getCurrentNode: () => getWasteVilleStoryNode(get().currentNodeId),

  hydrateFrom: (state) => {
    set({
      sessionId: state.SessionID,
      currentNodeId: state.CurrentNodeID,
      metrics: state.Metrics,
      mapState: (state.MapState as Record<string, MapStateEntry>) ?? {},
    });
  },
}));

export const ALL_STORY_NODES = WASTEVILLE_STORY_NODES;
