import { type Metrics } from "./metrics";
import type { StoryChoice, StoryNode } from "./storyNode";
import { type CatastropheKind } from "./catastrophe";
export type UserGameState = {
    SessionID: string;
    CurrentNodeID: string;
    Metrics: Metrics;
    MapState: Record<string, unknown>;
};
export type EndStateReasonCode = "NONE" | "PROTEST" | "STABILIZED" | "FAILED" | "CATASTROPHE";
export type ProcessChoiceResult = {
    nextNodeId: string;
    metrics: Metrics;
    state: UserGameState;
    endStateReasonCode?: EndStateReasonCode;
    catastrophe?: CatastropheKind;
};
export declare function resolveBranchNextNodeId(currentNodeId: string, metrics: Metrics): string | undefined;
export type ResolveChoiceOptions = {
    random?: () => number;
};
export declare function resolveChoiceOutcome(currentState: UserGameState, currentNode: StoryNode, choice: StoryChoice, options?: ResolveChoiceOptions): ProcessChoiceResult;
