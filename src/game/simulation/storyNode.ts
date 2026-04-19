import type { Metrics } from "./metrics";

export type StoryChoice = {
  ChoiceText: string;
  NextNodeID: string;
  MetricModifiers: Metrics;
  MapUpdates: {
    targetBuilding: string;
    newAssetId: string;
  };
};

export type StoryNode = {
  NodeID: string;
  Title: string;
  Context: string;
  // In-term day this dossier lands on. Every choice's NextNodeID must resolve
  // to a node whose Day is the same day (outcome resolves immediately) or the
  // following day (Day + 1). Enforced by tests in
  // tests/simulation/wasteVilleStoryNodes.test.ts.
  Day: number;
  Choices: StoryChoice[];
};
