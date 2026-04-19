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
    Day: number;
    Choices: StoryChoice[];
};
