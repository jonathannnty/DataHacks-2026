import {
  resolveChoiceOutcome,
  type UserGameState,
} from "../src/game/simulation/processChoice";
import { getWasteVilleStoryNode } from "../src/game/simulation/storyNodes.wasteVille";

export type ProcessChoiceEvent = {
  sessionId: string;
  nodeId: string;
  choiceIndex: number;
  currentState: UserGameState;
  random?: () => number;
};

/**
 * Pure-function Lambda shim used by unit tests. The CDK-deployed handler
 * lives at infra/lambda/processChoice.ts and wraps this with DynamoDB I/O.
 */
export function processChoice(event: ProcessChoiceEvent) {
  const node = getWasteVilleStoryNode(event.nodeId);

  if (!node) {
    throw new Error(`Unknown StoryNode: ${event.nodeId}`);
  }

  const choice = node.Choices[event.choiceIndex];

  if (!choice) {
    throw new Error(`Unknown choice index: ${event.choiceIndex}`);
  }

  return resolveChoiceOutcome(
    event.currentState,
    node,
    choice,
    event.random ? { random: event.random } : {},
  );
}
